import { Booking } from '../models/booking.model.js';
import { Vehicle } from '../models/vehicle.model.js';
import { Maintenance } from '../models/maintenance.model.js';
import { Notification } from '../models/notification.model.js';
import { Payment } from '../models/payment.model.js';
import { PricingService } from './pricing.service.js';
import { TripTrackingService } from './tripTracking.service.js';
import { ApiError } from '../utils/ApiError.js';
import { BOOKING_STATUS, BOOKING_TYPES, PAYMENT_STATUS, PAYMENT_METHODS } from '../constants/status.js';
import { ROLES } from '../constants/roles.js';

export class BookingService {
  /**
   * Centralized Interval Overlap Collision & Availability Validation Algorithm
   * Guaranteeing zero overlap for both Online & Offline bookings
   */
  static async isVehicleAvailable(vehicleId, startDateTime, endDateTime, excludeBookingId = null) {
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    if (start >= end) {
      throw new ApiError(400, 'End date/time must be strictly after start date/time');
    }

    if (start < new Date(Date.now() - 5 * 60 * 1000)) {
      throw new ApiError(400, 'Pickup date/time cannot be in the past');
    }

    // 1. Verify vehicle base existence and approval
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle || !vehicle.isApproved || vehicle.status === 'INACTIVE') {
      return { available: false, reason: 'Vehicle is not active or approved for rental' };
    }

    // 2. Check Overlapping Active Bookings (Online + Offline)
    // Overlap Formula: (existingStart < requestedEnd) AND (existingEnd > requestedStart)
    const bookingQuery = {
      vehicleId,
      $or: [
        { status: { $in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.ACTIVE] } },
        { 
          status: BOOKING_STATUS.PENDING_PAYMENT, 
          lockExpiresAt: { $gt: new Date() } // Active checkout lock
        }
      ],
      startDateTime: { $lt: end },
      endDateTime: { $gt: start }
    };

    if (excludeBookingId) {
      bookingQuery._id = { $ne: excludeBookingId };
    }

    const conflictingBooking = await Booking.findOne(bookingQuery);
    if (conflictingBooking) {
      const isOffline = conflictingBooking.bookingType === BOOKING_TYPES.OFFLINE;
      return {
        available: false,
        reason: `Vehicle already reserved (${isOffline ? 'Offline Walk-in' : 'Online Booking'}) from ${conflictingBooking.startDateTime.toLocaleString()} to ${conflictingBooking.endDateTime.toLocaleString()}`
      };
    }

    // 3. Check Overlapping Scheduled Maintenance Windows
    const conflictingMaintenance = await Maintenance.findOne({
      vehicleId,
      status: { $in: ['SCHEDULED', 'IN_PROGRESS'] },
      startDate: { $lt: end },
      endDate: { $gt: start }
    });

    if (conflictingMaintenance) {
      return {
        available: false,
        reason: `Vehicle is scheduled for maintenance from ${conflictingMaintenance.startDate.toLocaleString()} to ${conflictingMaintenance.endDate.toLocaleString()}`
      };
    }

    return { available: true, vehicle };
  }

  /**
   * Check vehicle slot availability and preview price quote
   */
  static async checkAvailability({
    vehicleId,
    rentalPlan,
    startDateTime,
    endDateTime,
    couponCode,
    userId
  }) {
    const availability = await this.isVehicleAvailable(vehicleId, startDateTime, endDateTime);
    if (!availability.available) {
      return {
        available: false,
        reason: availability.reason
      };
    }

    const vehicle = availability.vehicle;
    const priceCalculation = await PricingService.calculatePriceBreakdown({
      vehicle,
      rentalPlan,
      startDateTime,
      endDateTime,
      couponCode,
      userId
    });

    return {
      available: true,
      vehicle: {
        _id: vehicle._id,
        brand: vehicle.brand,
        model: vehicle.model,
        location: vehicle.location,
        pricing: vehicle.pricing
      },
      ...priceCalculation
    };
  }

  /**
   * Create Online Booking & Lock Reservation Slot (10-minute TTL)
   */
  static async createOnlineBooking(customerId, payload) {
    const { vehicleId, rentalPlan, startDateTime, endDateTime, couponCode } = payload;

    // 1. Validate Availability & Anti-Collision
    const availability = await this.isVehicleAvailable(vehicleId, startDateTime, endDateTime);
    if (!availability.available) {
      throw new ApiError(409, availability.reason);
    }

    const vehicle = availability.vehicle;

    // 2. Server-side price calculation (Zero-Trust Frontend)
    const { durationHours, priceBreakdown, appliedCoupon } = await PricingService.calculatePriceBreakdown({
      vehicle,
      rentalPlan,
      startDateTime,
      endDateTime,
      couponCode,
      userId: customerId
    });

    // 3. Generate Booking Number & Insert Record with PENDING_PAYMENT
    const bookingNumber = Booking.generateBookingNumber();

    const booking = await Booking.create({
      bookingNumber,
      vehicleId,
      vendorId: vehicle.vendorId,
      customerId,
      bookingType: BOOKING_TYPES.ONLINE,
      rentalPlan,
      startDateTime: new Date(startDateTime),
      endDateTime: new Date(endDateTime),
      durationHours,
      priceBreakdown,
      status: BOOKING_STATUS.PENDING_PAYMENT,
      paymentStatus: PAYMENT_STATUS.PENDING,
      couponApplied: appliedCoupon ? appliedCoupon._id : null,
      lockExpiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes lock
    });

    return await Booking.findById(booking._id)
      .populate('vehicleId', 'brand model registrationNumber fuelType transmission images location pricing')
      .populate('vendorId', 'name email phone vendorProfile');
  }

  /**
   * Get Customer's Bookings List with Pagination & Status filter
   */
  static async getCustomerBookings(customerId, { status, page = 1, limit = 10 }) {
    const query = { customerId };

    if (status && status !== 'ALL') {
      if (status === 'UPCOMING') {
        query.status = BOOKING_STATUS.CONFIRMED;
        query.startDateTime = { $gte: new Date() };
      } else if (status === 'ACTIVE') {
        query.status = BOOKING_STATUS.ACTIVE;
      } else if (status === 'COMPLETED') {
        query.status = BOOKING_STATUS.COMPLETED;
      } else if (status === 'CANCELLED') {
        query.status = BOOKING_STATUS.CANCELLED;
      } else {
        query.status = status;
      }
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('vehicleId', 'brand model registrationNumber fuelType transmission images location pricing')
        .populate('vendorId', 'name email phone vendorProfile')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Booking.countDocuments(query)
    ]);

    return {
      bookings,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  /**
   * Get single booking details & verify access permission
   */
  static async getBookingById(bookingId, userId, userRole) {
    const booking = await Booking.findById(bookingId)
      .populate('vehicleId', 'brand model registrationNumber fuelType transmission images location pricing features')
      .populate('vendorId', 'name email phone vendorProfile')
      .populate('customerId', 'name email phone customerProfile')
      .populate('couponApplied', 'code discountType discountValue');

    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    // Permission check: Customer, Vendor, or Admin
    const isCustomer = booking.customerId && booking.customerId._id.toString() === userId.toString();
    const isVendor = booking.vendorId && booking.vendorId._id.toString() === userId.toString();
    const isAdmin = userRole === ROLES.ADMIN;

    if (!isCustomer && !isVendor && !isAdmin) {
      throw new ApiError(403, 'You are not authorized to view this booking');
    }

    return booking;
  }

  /**
   * Cancel booking with refund calculation
   */
  static async cancelBooking(bookingId, userId, userRole, reason = '') {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    if (booking.status === BOOKING_STATUS.CANCELLED) {
      throw new ApiError(400, 'Booking is already cancelled');
    }

    if (booking.status === BOOKING_STATUS.COMPLETED || booking.status === BOOKING_STATUS.ACTIVE) {
      throw new ApiError(400, 'Active or completed rentals cannot be cancelled');
    }

    // Permission check
    const isCustomer = booking.customerId?.toString() === userId.toString();
    const isVendor = booking.vendorId?.toString() === userId.toString();
    const isAdmin = userRole === ROLES.ADMIN;

    if (!isCustomer && !isVendor && !isAdmin) {
      throw new ApiError(403, 'You are not authorized to cancel this booking');
    }

    // Refund Policy:
    // If cancelled > 4 hours before pickup: 100% refund of total amount
    // If cancelled <= 4 hours before pickup: 80% refund (20% cancellation fee)
    const hoursToPickup = (new Date(booking.startDateTime).getTime() - Date.now()) / (1000 * 60 * 60);
    let cancellationFee = 0;
    let refundAmount = booking.priceBreakdown.totalAmount;

    if (booking.paymentStatus === PAYMENT_STATUS.SUCCESS) {
      if (hoursToPickup < 4 && hoursToPickup > 0) {
        cancellationFee = Math.round(booking.priceBreakdown.subtotal * 0.20);
        refundAmount = Math.max(0, booking.priceBreakdown.totalAmount - cancellationFee);
      }
    } else {
      refundAmount = 0;
    }

    booking.status = BOOKING_STATUS.CANCELLED;
    booking.cancellationDetails = {
      cancelledBy: userId,
      reason: reason || 'Cancelled by user',
      cancelledAt: new Date(),
      refundAmount,
      cancellationFee
    };

    await booking.save();

    // Reconcile Payment ledger refundDetails
    if (booking.paymentStatus === PAYMENT_STATUS.SUCCESS && refundAmount > 0) {
      const payment = await Payment.findOne({ bookingId: booking._id, status: PAYMENT_STATUS.SUCCESS });
      if (payment) {
        payment.refundDetails = {
          refundId: `rfnd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          amount: refundAmount,
          status: 'INITIATED',
          reason: reason || 'Booking cancellation',
          processedAt: new Date()
        };
        payment.status = PAYMENT_STATUS.REFUNDED;
        await payment.save();
      }
    }

    // Send in-app notification to Vendor
    await Notification.create({
      recipientId: booking.vendorId,
      recipientRole: ROLES.VENDOR,
      type: 'BOOKING_CANCELLED',
      title: `Booking Cancelled (${booking.bookingNumber})`,
      message: `Booking #${booking.bookingNumber} for ${booking.startDateTime.toLocaleDateString()} was cancelled. Reason: ${reason || 'Customer request'}. Inventory has been freed.`,
      data: { bookingId: booking._id }
    });

    return booking;
  }

  /**
   * Vendor Offline Walk-in Booking
   * Guarantees 100% synchronized inventory with Online bookings
   */
  static async createOfflineBooking(vendorId, payload, userRole) {
    const {
      vehicleId,
      rentalPlan,
      startDateTime,
      endDateTime,
      offlineCustomer,
      paymentMethod = 'offline_cash',
      isPaymentCollected = true,
      customBasePrice
    } = payload;

    // 1. Verify vehicle ownership
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }

    if (userRole !== ROLES.ADMIN && vehicle.vendorId.toString() !== vendorId.toString()) {
      throw new ApiError(403, 'You can only create offline bookings for your own fleet');
    }

    // 2. Validate availability using the EXACT same Anti-Collision Overlap Algorithm
    const availability = await this.isVehicleAvailable(vehicleId, startDateTime, endDateTime);
    if (!availability.available) {
      throw new ApiError(409, `Offline booking rejected: ${availability.reason}`);
    }

    // 3. Compute price breakdown
    const priceCalculation = await PricingService.calculatePriceBreakdown({
      vehicle,
      rentalPlan,
      startDateTime,
      endDateTime,
      userId: null
    });

    let finalPriceBreakdown = priceCalculation.priceBreakdown;
    if (customBasePrice !== undefined && Number(customBasePrice) >= 0) {
      finalPriceBreakdown.basePrice = Number(customBasePrice);
      finalPriceBreakdown.subtotal = Number(customBasePrice);
      finalPriceBreakdown.totalAmount = Number(customBasePrice) + finalPriceBreakdown.securityDeposit;
      finalPriceBreakdown.vendorPayout = Math.round(Number(customBasePrice) * 0.88);
      finalPriceBreakdown.platformCommission = Number(customBasePrice) - finalPriceBreakdown.vendorPayout;
    }

    // 4. Create Offline Booking record (CONFIRMED)
    const bookingNumber = Booking.generateBookingNumber();
    const booking = await Booking.create({
      bookingNumber,
      vehicleId,
      vendorId: vehicle.vendorId,
      customerId: null, // Nullable for offline walk-in customers
      bookingType: BOOKING_TYPES.OFFLINE,
      rentalPlan,
      startDateTime: new Date(startDateTime),
      endDateTime: new Date(endDateTime),
      durationHours: priceCalculation.durationHours,
      priceBreakdown: finalPriceBreakdown,
      status: BOOKING_STATUS.CONFIRMED,
      paymentStatus: isPaymentCollected ? PAYMENT_STATUS.SUCCESS : PAYMENT_STATUS.PENDING,
      offlineCustomer: {
        name: offlineCustomer?.name?.trim() || '',
        phone: offlineCustomer?.phone?.trim() || '',
        drivingLicenseNumber: offlineCustomer?.drivingLicenseNumber?.trim().toUpperCase() || '',
        notes: offlineCustomer?.notes || 'Walk-in desk customer'
      },
      offlineCustomerDetails: {
        name: offlineCustomer?.name?.trim() || '',
        phone: offlineCustomer?.phone?.trim() || '',
        drivingLicenseNumber: offlineCustomer?.drivingLicenseNumber?.trim().toUpperCase() || '',
        notes: offlineCustomer?.notes || 'Walk-in desk customer'
      }
    });

    // 5. Create Payment ledger record if cash/UPI was collected at desk
    if (isPaymentCollected) {
      await Payment.create({
        bookingId: booking._id,
        userId: vehicle.vendorId,
        amount: finalPriceBreakdown.totalAmount,
        currency: 'INR',
        paymentMethod: paymentMethod === 'upi' ? PAYMENT_METHODS.OFFLINE_COUNTER_UPI : PAYMENT_METHODS.OFFLINE_CASH,
        status: PAYMENT_STATUS.SUCCESS,
        vendorPayout: {
          vendorId: vehicle.vendorId,
          amount: finalPriceBreakdown.vendorPayout,
          status: 'SETTLED',
          payoutDate: new Date()
        }
      });
    }

    return await Booking.findById(booking._id)
      .populate('vehicleId', 'brand model registrationNumber fuelType transmission images location pricing')
      .populate('vendorId', 'name email phone vendorProfile');
  }

  /**
   * Get Vendor's Fleet Bookings (Online & Offline Unified)
   */
  static async getVendorBookings(vendorId, { bookingType = 'ALL', status = 'ALL', page = 1, limit = 20 }) {
    const query = { vendorId };

    if (bookingType !== 'ALL') {
      query.bookingType = bookingType;
    }

    if (status !== 'ALL') {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('vehicleId', 'brand model registrationNumber fuelType transmission images location')
        .populate('customerId', 'name email phone customerProfile')
        .sort({ startDateTime: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Booking.countDocuments(query)
    ]);

    return {
      bookings,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  /**
   * Start Trip / Vehicle Handover (Record initial odometer & set ACTIVE)
   */
  static async startTrip(bookingId, vendorId, userRole, { startOdometer, notes = '' }) {
    const booking = await Booking.findById(bookingId).populate('vehicleId');
    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    if (userRole !== ROLES.ADMIN && booking.vendorId.toString() !== vendorId.toString()) {
      throw new ApiError(403, 'You do not have permission to manage this booking');
    }

    if (booking.status !== BOOKING_STATUS.CONFIRMED) {
      throw new ApiError(400, `Cannot start trip for booking with status '${booking.status}'. Must be CONFIRMED.`);
    }

    booking.status = BOOKING_STATUS.ACTIVE;
    booking.handoverDetails = {
      ...booking.handoverDetails,
      startOdometer: Number(startOdometer),
      startedAt: new Date(),
      handoverNotes: notes
    };

    await booking.save();

    // Initialize Trip Tracking session for active telemetry
    await TripTrackingService.startTripTracking(
      booking._id,
      booking.customerId,
      booking.vehicleId?._id || booking.vehicleId
    );

    // Update vehicle status to BOOKED
    if (booking.vehicleId) {
      await Vehicle.findByIdAndUpdate(booking.vehicleId._id, {
        status: booking.bookingType === BOOKING_TYPES.OFFLINE ? 'OFFLINE_BOOKED' : 'BOOKED'
      });
    }

    // Customer notification
    if (booking.customerId) {
      await Notification.create({
        recipientId: booking.customerId,
        recipientRole: ROLES.CUSTOMER,
        type: 'TRIP_STARTED',
        title: `Trip Started (#${booking.bookingNumber})`,
        message: `Your ride has officially started! Initial odometer recorded: ${startOdometer} km. Drive safely!`,
        data: { bookingId: booking._id }
      });
    }

    return booking;
  }

  /**
   * Complete Trip / Vehicle Return (Record final odometer, fuel, damages & release slot)
   * Authoritative final distance & extra-KM fee calculation based on odometer readings
   */
  static async completeTrip(bookingId, vendorId, userRole, payload) {
    const { endOdometer, fuelLevel = 'FULL', damageReport = '', extraCharges = 0 } = payload;

    const booking = await Booking.findById(bookingId).populate('vehicleId');
    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    if (userRole !== ROLES.ADMIN && booking.vendorId.toString() !== vendorId.toString()) {
      throw new ApiError(403, 'You do not have permission to manage this booking');
    }

    if (booking.status !== BOOKING_STATUS.ACTIVE) {
      throw new ApiError(400, `Cannot complete trip for booking with status '${booking.status}'. Must be ACTIVE.`);
    }

    const startKm = booking.handoverDetails?.startOdometer || 0;
    if (Number(endOdometer) < startKm) {
      throw new ApiError(400, `Return odometer (${endOdometer} km) cannot be less than start odometer (${startKm} km)`);
    }

    // Authoritative distance from physical odometer readings
    const distanceDriven = Number(endOdometer) - startKm;

    // Daily allowance & Extra KM reconciliation
    const rentalDays = Math.max(1, Math.ceil(booking.durationHours / 24));
    const dailyLimit = booking.vehicleId?.mileageLimitPerDayKm || 250;
    const allowedKm = rentalDays * dailyLimit;
    const extraKm = Math.max(0, distanceDriven - allowedKm);
    const extraKmRate = booking.vehicleId?.extraKmCharge || 10;
    const extraKmCharge = extraKm * extraKmRate;
    const totalExtraCharges = extraKmCharge + Number(extraCharges || 0);

    // Final authoritative billing calculation
    const baseTotal = booking.priceBreakdown?.totalAmount || 0;
    const finalRentalAmount = baseTotal + totalExtraCharges;

    // Authoritative vendor earnings breakdown
    const vendorEconomics = PricingService.calculateVendorEarningsBreakdown({
      subtotal: booking.priceBreakdown?.subtotal || 0,
      extraKmRevenue: totalExtraCharges,
      commissionRate: 0.12
    });

    booking.status = BOOKING_STATUS.COMPLETED;
    booking.handoverDetails = {
      ...booking.handoverDetails,
      endOdometer: Number(endOdometer),
      completedAt: new Date(),
      fuelLevel,
      damageReport,
      extraCharges: Number(extraCharges),
      distanceDriven,
      allowedKm,
      extraKm,
      extraKmCharge,
      finalRentalAmount,
      finalVendorEarnings: vendorEconomics.netVendorEarnings
    };

    await booking.save();

    // Close and stop live telemetry tracking
    await TripTrackingService.stopTripTracking(bookingId);

    // Release vehicle inventory back to AVAILABLE
    if (booking.vehicleId) {
      await Vehicle.findByIdAndUpdate(booking.vehicleId._id, {
        status: 'AVAILABLE'
      });
    }

    // Customer notification
    if (booking.customerId) {
      await Notification.create({
        recipientId: booking.customerId,
        recipientRole: ROLES.CUSTOMER,
        type: 'TRIP_COMPLETED',
        title: `Trip Completed (#${booking.bookingNumber})`,
        message: `Your rental is complete! Total distance driven: ${distanceDriven} km. Thank you for riding with RentRide!`,
        data: { bookingId: booking._id }
      });
    }

    return booking;
  }

  /**
   * Get Vendor Dashboard KPI Statistics
   */
  static async getVendorStats(vendorId) {
    const [vehicles, bookings, payments] = await Promise.all([
      Vehicle.find({ vendorId }),
      Booking.find({ vendorId }),
      Payment.find({
        $or: [
          { 'metadata.vendorPayout.vendorId': vendorId },
          { 'vendorPayout.vendorId': vendorId },
          { userId: vendorId }
        ]
      })
    ]);

    const totalFleet = vehicles.length;
    const availableFleet = vehicles.filter((v) => v.status === 'AVAILABLE').length;
    const activeRentals = bookings.filter((b) => b.status === BOOKING_STATUS.ACTIVE).length;
    const upcomingRentals = bookings.filter((b) => b.status === BOOKING_STATUS.CONFIRMED).length;
    const completedRentals = bookings.filter((b) => b.status === BOOKING_STATUS.COMPLETED).length;

    let grossRevenue = 0;
    let platformCommission = 0;
    let netEarnings = 0;

    bookings.forEach((b) => {
      if (b.status === BOOKING_STATUS.CONFIRMED || b.status === BOOKING_STATUS.ACTIVE || b.status === BOOKING_STATUS.COMPLETED) {
        grossRevenue += b.priceBreakdown?.subtotal || 0;
        platformCommission += b.priceBreakdown?.platformCommission || 0;
        netEarnings += b.priceBreakdown?.vendorPayout || 0;
      }
    });

    const settledAmount = payments
      .filter((p) => (p.vendorPayout?.status === 'SETTLED' || p.metadata?.vendorPayout?.status === 'SETTLED'))
      .reduce((sum, p) => sum + (p.vendorPayout?.amount || p.metadata?.vendorPayout?.amount || 0), 0);

    const pendingPayout = Math.max(0, netEarnings - settledAmount);

    return {
      fleetStats: {
        totalFleet,
        availableFleet,
        underMaintenance: vehicles.filter((v) => v.status === 'MAINTENANCE').length
      },
      bookingStats: {
        activeRentals,
        upcomingRentals,
        completedRentals,
        totalBookings: bookings.length
      },
      financialStats: {
        grossRevenue,
        platformCommission,
        netEarnings,
        settledAmount,
        pendingPayout
      }
    };
  }
}
