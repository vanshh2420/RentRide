import { Maintenance } from '../models/maintenance.model.js';
import { Vehicle } from '../models/vehicle.model.js';
import { Booking } from '../models/booking.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ROLES } from '../constants/roles.js';
import { BOOKING_STATUS } from '../constants/status.js';

export class MaintenanceService {
  /**
   * Schedule a maintenance blackout window with anti-collision validation against bookings
   */
  static async scheduleMaintenance(vendorId, userRole, payload) {
    const { vehicleId, title, serviceType, startDate, endDate, estimatedCost = 0, notes = '' } = payload;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      throw new ApiError(400, 'End date must be strictly after start date');
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }

    if (userRole !== ROLES.ADMIN && vehicle.vendorId.toString() !== vendorId.toString()) {
      throw new ApiError(403, 'You do not have permission to manage this vehicle');
    }

    // 1. Check for overlapping customer bookings (Zero Overlap Rule)
    const conflictingBooking = await Booking.findOne({
      vehicleId,
      status: { $in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.ACTIVE, BOOKING_STATUS.PENDING_PAYMENT] },
      startDateTime: { $lt: end },
      endDateTime: { $gt: start }
    });

    if (conflictingBooking) {
      throw new ApiError(
        409,
        `Cannot schedule maintenance: Overlaps with an existing reservation (#${conflictingBooking.bookingNumber}) from ${conflictingBooking.startDateTime.toLocaleString()} to ${conflictingBooking.endDateTime.toLocaleString()}`
      );
    }

    // 2. Check for overlapping scheduled maintenance records
    const conflictingMaintenance = await Maintenance.findOne({
      vehicleId,
      status: { $in: ['SCHEDULED', 'IN_PROGRESS'] },
      startDate: { $lt: end },
      endDate: { $gt: start }
    });

    if (conflictingMaintenance) {
      throw new ApiError(
        409,
        `Vehicle already has maintenance scheduled from ${conflictingMaintenance.startDate.toLocaleString()} to ${conflictingMaintenance.endDate.toLocaleString()}`
      );
    }

    // 3. Create Maintenance record
    const maintenance = await Maintenance.create({
      vehicleId,
      vendorId: vehicle.vendorId,
      title,
      serviceType,
      startDate: start,
      endDate: end,
      estimatedCost: Number(estimatedCost),
      notes,
      status: 'SCHEDULED'
    });

    // 4. If maintenance starts right now or earlier, set vehicle status to MAINTENANCE
    const now = new Date();
    if (start <= now && end >= now) {
      vehicle.status = 'MAINTENANCE';
      await vehicle.save();
    }

    return maintenance;
  }

  /**
   * Get vendor maintenance schedule & history
   */
  static async getVendorMaintenance(vendorId, { status = 'ALL', page = 1, limit = 20 } = {}) {
    const query = { vendorId };
    if (status !== 'ALL') {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [records, total] = await Promise.all([
      Maintenance.find(query)
        .populate('vehicleId', 'brand model registrationNumber images location')
        .sort({ startDate: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Maintenance.countDocuments(query)
    ]);

    return {
      maintenanceRecords: records,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  /**
   * Complete maintenance and restore vehicle availability
   */
  static async completeMaintenance(maintenanceId, vendorId, userRole, payload) {
    const { actualCost, serviceCenterName = '', invoiceNumber = '', notes = '' } = payload;

    const maintenance = await Maintenance.findById(maintenanceId).populate('vehicleId');
    if (!maintenance) {
      throw new ApiError(404, 'Maintenance record not found');
    }

    if (userRole !== ROLES.ADMIN && maintenance.vendorId.toString() !== vendorId.toString()) {
      throw new ApiError(403, 'You do not have permission to manage this record');
    }

    maintenance.status = 'COMPLETED';
    maintenance.actualCost = Number(actualCost);
    maintenance.serviceCenterName = serviceCenterName;
    maintenance.invoiceNumber = invoiceNumber;
    maintenance.completedDate = new Date();
    if (notes) maintenance.notes = `${maintenance.notes ? maintenance.notes + ' | ' : ''}${notes}`;

    await maintenance.save();

    // Release vehicle status back to AVAILABLE
    if (maintenance.vehicleId) {
      await Vehicle.findByIdAndUpdate(maintenance.vehicleId._id, {
        status: 'AVAILABLE'
      });
    }

    return maintenance;
  }
}
