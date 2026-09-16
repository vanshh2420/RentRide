import { TripTracking } from '../models/tripTracking.model.js';
import { Booking } from '../models/booking.model.js';
import { Vehicle } from '../models/vehicle.model.js';
import { PricingService } from './pricing.service.js';
import { FuelCostService } from './fuelCost.service.js';
import { VehicleService } from './vehicle.service.js';
import { ApiError } from '../utils/ApiError.js';
import { BOOKING_STATUS } from '../constants/status.js';
import { ROLES } from '../constants/roles.js';

export class TripTrackingService {
  /**
   * Initialize trip tracking session when vendor hands over vehicle (startTrip)
   */
  static async startTripTracking(bookingId, customerId, vehicleId) {
    try {
      const tracking = await TripTracking.findOneAndUpdate(
        { bookingId },
        {
          bookingId,
          vehicleId,
          customerId,
          status: 'TRACKING',
          gpsStatus: 'ACTIVE',
          totalGpsDistanceKm: 0,
          startedAt: new Date(),
          endedAt: null,
          recentWaypoints: []
        },
        { upsert: true, new: true, runValidators: true }
      );
      return tracking;
    } catch (err) {
      console.warn('[TripTrackingService] Failed to initialize trip tracking:', err.message);
      return null;
    }
  }

  /**
   * Ingest and validate live GPS telemetry from active rental
   * Strictly filters accuracy, drift, duplicate points, and impossible speed jumps
   */
  static async recordTelemetry(bookingId, userId, userRole, telemetry) {
    const { lat, lng, accuracy = 10, speed = 0, timestamp = new Date() } = telemetry;

    if (lat == null || lng == null) {
      throw new ApiError(400, 'Latitude and longitude coordinates are required');
    }

    const latitude = Number(lat);
    const longitude = Number(lng);

    if (isNaN(latitude) || latitude < -90 || latitude > 90 || isNaN(longitude) || longitude < -180 || longitude > 180) {
      throw new ApiError(400, 'Invalid coordinate range');
    }

    // 1. Authoritative Booking State & Ownership Check
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new ApiError(404, 'Rental booking not found');
    }

    if (userRole !== ROLES.ADMIN) {
      const isCustomer = booking.customerId && booking.customerId.toString() === userId.toString();
      const isVendor = booking.vendorId && booking.vendorId.toString() === userId.toString();
      if (!isCustomer && !isVendor) {
        throw new ApiError(403, 'Unauthorized: you are not assigned to this rental booking');
      }
    }

    if (booking.status !== BOOKING_STATUS.ACTIVE) {
      throw new ApiError(400, `Telemetry can only be recorded for ACTIVE rentals (current: ${booking.status})`);
    }

    // 2. Fetch or create tracking document
    let tracking = await TripTracking.findOne({ bookingId });
    if (!tracking) {
      tracking = await TripTracking.create({
        bookingId,
        vehicleId: booking.vehicleId,
        customerId: booking.customerId,
        status: 'TRACKING',
        startedAt: booking.handoverDetails?.startedAt || new Date()
      });
    }

    if (tracking.status === 'STOPPED') {
      throw new ApiError(400, 'Trip tracking has already been stopped for this completed rental');
    }

    // 3. Telemetry Accuracy Filter (Discard points with accuracy > 60m)
    const pointAccuracy = Number(accuracy) || 10;
    if (pointAccuracy > 60) {
      tracking.gpsStatus = 'ACCURACY_DEGRADED';
      await tracking.save();
      return {
        accepted: false,
        reason: 'GPS accuracy degraded (> 60m threshold). Telemetry discarded to prevent drift.',
        totalGpsDistanceKm: tracking.totalGpsDistanceKm
      };
    }

    // 4. Sequential Distance Calculation & Anomaly Prevention
    const currentPointTime = new Date(timestamp);
    let distanceIncrementKm = 0;

    if (tracking.lastValidLocation?.lat != null && tracking.lastValidLocation?.lng != null) {
      const prevLat = tracking.lastValidLocation.lat;
      const prevLng = tracking.lastValidLocation.lng;
      const prevTime = new Date(tracking.lastValidLocation.timestamp || tracking.updatedAt);

      const segmentDistKm = VehicleService.calculateDistanceKm(prevLat, prevLng, latitude, longitude);
      const timeDiffSeconds = Math.max(1, (currentPointTime.getTime() - prevTime.getTime()) / 1000);

      // Speed anomaly check: If implied speed > 160 km/h, discard as impossible jump / teleport
      const impliedSpeedKmh = (segmentDistKm / timeDiffSeconds) * 3600;
      if (impliedSpeedKmh > 160 && segmentDistKm > 0.3) {
        console.warn(`[TripTracking] Speed anomaly detected: ${impliedSpeedKmh.toFixed(1)} km/h. Discarding point.`);
        return {
          accepted: false,
          reason: 'Speed anomaly / impossible jump detected. Telemetry discarded.',
          totalGpsDistanceKm: tracking.totalGpsDistanceKm
        };
      }

      // Drift suppression: If vehicle moved less than 3 meters (0.003 km), treat as stationary jitter
      if (segmentDistKm >= 0.003) {
        distanceIncrementKm = segmentDistKm;
      }
    }

    // 5. Update Telemetry State
    tracking.totalGpsDistanceKm = Math.round((tracking.totalGpsDistanceKm + distanceIncrementKm) * 1000) / 1000;
    tracking.lastValidLocation = {
      lat: latitude,
      lng: longitude,
      accuracy: pointAccuracy,
      speed: Number(speed) || 0,
      timestamp: currentPointTime
    };
    tracking.gpsStatus = 'ACTIVE';

    // Keep bounded breadcrumb waypoints (capped at 100 points)
    tracking.recentWaypoints.push({
      lat: latitude,
      lng: longitude,
      timestamp: currentPointTime,
      speed: Number(speed) || 0
    });

    if (tracking.recentWaypoints.length > 100) {
      tracking.recentWaypoints.shift();
    }

    await tracking.save();

    return {
      accepted: true,
      distanceIncrementKm,
      totalGpsDistanceKm: tracking.totalGpsDistanceKm,
      lastValidLocation: tracking.lastValidLocation
    };
  }

  /**
   * Get Live Trip Telemetry & Live Estimated Fare
   * Zero trust: Live fare is strictly an operational estimate based on server pricing rules
   */
  static async getLiveTripState(bookingId, userId, userRole) {
    const booking = await Booking.findById(bookingId).populate('vehicleId');
    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    if (userRole !== ROLES.ADMIN) {
      const isCustomer = booking.customerId && booking.customerId.toString() === userId.toString();
      const isVendor = booking.vendorId && booking.vendorId.toString() === userId.toString();
      if (!isCustomer && !isVendor) {
        throw new ApiError(403, 'Unauthorized: you are not assigned to this rental booking');
      }
    }

    const vehicle = booking.vehicleId;
    let tracking = await TripTracking.findOne({ bookingId });

    const startTime = booking.handoverDetails?.startedAt || booking.startDateTime;
    const now = new Date();
    const elapsedMs = Math.max(0, now.getTime() - new Date(startTime).getTime());
    const elapsedHours = Math.max(1, Math.ceil(elapsedMs / (1000 * 60 * 60)));

    const gpsDistanceKm = tracking?.totalGpsDistanceKm || 0;

    // Allowed daily kilometer allowance calculation
    const rentalDays = Math.max(1, Math.ceil(elapsedHours / 24));
    const dailyLimit = vehicle?.mileageLimitPerDayKm || 250;
    const allowedKm = rentalDays * dailyLimit;
    const extraKm = Math.max(0, Math.round((gpsDistanceKm - allowedKm) * 10) / 10);
    const extraKmRate = vehicle?.extraKmCharge || 10;
    const estimatedExtraKmCharge = extraKm * extraKmRate;

    // Server-authoritative price calculation for elapsed or booked plan
    const { priceBreakdown } = await PricingService.calculatePriceBreakdown({
      vehicle,
      rentalPlan: booking.rentalPlan,
      startDateTime: booking.startDateTime,
      endDateTime: new Date(Math.max(booking.endDateTime.getTime(), now.getTime())),
      couponCode: null,
      userId: booking.customerId
    });

    // Live Estimated Total
    const liveEstimatedTotal = priceBreakdown.totalAmount + estimatedExtraKmCharge;

    // Fuel Cost Estimation
    const fuelCostEstimate = await FuelCostService.calculateEstimatedFuelCost({
      distanceKm: gpsDistanceKm,
      fuelType: vehicle?.fuelType,
      fuelEconomy: vehicle?.fuelEconomy,
      fuelEconomyUnit: vehicle?.fuelEconomyUnit,
      city: vehicle?.location?.city || 'Indore'
    });

    return {
      bookingId: booking._id,
      bookingNumber: booking.bookingNumber,
      status: booking.status,
      rentalPlan: booking.rentalPlan,
      startedAt: startTime,
      elapsedHours,
      elapsedFormatted: `${Math.floor(elapsedMs / 3600000)}h ${Math.floor((elapsedMs % 3600000) / 60000)}m`,
      vehicle: {
        _id: vehicle?._id,
        brand: vehicle?.brand,
        model: vehicle?.model,
        registrationNumber: vehicle?.registrationNumber,
        fuelType: vehicle?.fuelType,
        fuelEconomy: vehicle?.fuelEconomy,
        fuelEconomyUnit: vehicle?.fuelEconomyUnit,
        mileageLimitPerDayKm: dailyLimit,
        extraKmCharge: extraKmRate
      },
      odometer: {
        startOdometer: booking.handoverDetails?.startOdometer || null,
        endOdometer: booking.handoverDetails?.endOdometer || null,
        isAuthoritative: true
      },
      telemetry: {
        totalGpsDistanceKm: Math.round(gpsDistanceKm * 10) / 10,
        allowedKm,
        extraKm,
        estimatedExtraKmCharge,
        gpsStatus: tracking?.gpsStatus || (booking.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'),
        lastLocation: tracking?.lastValidLocation || null,
        recentWaypoints: tracking?.recentWaypoints || []
      },
      liveFare: {
        baseSubtotal: priceBreakdown.subtotal,
        estimatedExtraKmCharge,
        platformFee: priceBreakdown.platformFee,
        taxAmount: priceBreakdown.taxAmount,
        securityDeposit: priceBreakdown.securityDeposit,
        liveEstimatedTotal,
        isEstimate: true,
        notice: 'Live estimated fare. Authoritative final fare is calculated upon vehicle return using odometer readings.'
      },
      fuelCostEstimate
    };
  }

  /**
   * Stop tracking upon return
   */
  static async stopTripTracking(bookingId) {
    try {
      await TripTracking.findOneAndUpdate(
        { bookingId },
        {
          status: 'STOPPED',
          gpsStatus: 'INACTIVE',
          endedAt: new Date()
        }
      );
    } catch (err) {
      console.warn('[TripTrackingService] Failed stopping tracking session:', err.message);
    }
  }
}
