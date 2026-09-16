import mongoose from 'mongoose';
import { BOOKING_STATUS, BOOKING_TYPES, RENTAL_PLANS, PAYMENT_STATUS } from '../constants/status.js';

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle ID is required']
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Vendor ID is required']
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null // Nullable for offline walk-in bookings
    },
    // Walk-in customer details for OFFLINE bookings
    offlineCustomer: {
      name: { type: String, trim: true, default: '' },
      phone: { type: String, trim: true, default: '' },
      drivingLicenseNumber: { type: String, trim: true, default: '' },
      notes: { type: String, trim: true, default: '' }
    },
    offlineCustomerDetails: {
      name: { type: String, trim: true, default: '' },
      phone: { type: String, trim: true, default: '' },
      drivingLicenseNumber: { type: String, trim: true, default: '' },
      notes: { type: String, trim: true, default: '' }
    },
    bookingType: {
      type: String,
      enum: Object.values(BOOKING_TYPES),
      default: BOOKING_TYPES.ONLINE,
      required: true
    },
    rentalPlan: {
      type: String,
      enum: Object.values(RENTAL_PLANS),
      required: [true, 'Rental plan (HOURLY, 12_HOURS, 24_HOURS) is required']
    },
    startDateTime: {
      type: Date,
      required: [true, 'Start date and time is required']
    },
    endDateTime: {
      type: Date,
      required: [true, 'End date and time is required']
    },
    durationHours: {
      type: Number,
      required: true,
      min: [1, 'Rental duration must be at least 1 hour']
    },
    priceBreakdown: {
      basePrice: { type: Number, required: true },
      surgeMultiplier: { type: Number, default: 1.0 },
      couponDiscount: { type: Number, default: 0 },
      subtotal: { type: Number, required: true },
      platformFee: { type: Number, required: true },
      taxAmount: { type: Number, required: true },
      securityDeposit: { type: Number, required: true },
      totalAmount: { type: Number, required: true },
      vendorPayout: { type: Number, required: true },
      platformCommission: { type: Number, required: true }
    },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING_PAYMENT,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
      required: true
    },
    couponApplied: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
      default: null
    },
    cancellationDetails: {
      cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
      },
      reason: { type: String, default: '' },
      cancelledAt: { type: Date, default: null },
      refundAmount: { type: Number, default: 0 },
      cancellationFee: { type: Number, default: 0 }
    },
    // Vehicle Handover & Return Details (Authoritative Odometer & Inspections)
    handoverDetails: {
      startOdometer: { type: Number, default: null },
      startedAt: { type: Date, default: null },
      handoverNotes: { type: String, default: '' },
      endOdometer: { type: Number, default: null },
      completedAt: { type: Date, default: null },
      fuelLevel: { type: String, default: 'FULL' },
      damageReport: { type: String, default: '' },
      extraCharges: { type: Number, default: 0 },
      distanceDriven: { type: Number, default: 0 },
      allowedKm: { type: Number, default: 0 },
      extraKm: { type: Number, default: 0 },
      extraKmCharge: { type: Number, default: 0 },
      finalRentalAmount: { type: Number, default: null },
      finalVendorEarnings: { type: Number, default: null }
    },
    // Checkout temporary reservation lock expiry (e.g. 10 minutes from creation)
    lockExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000)
    }
  },
  {
    timestamps: true
  }
);

// CRITICAL AVAILABILITY & CONFLICT RESOLUTION INDEX
bookingSchema.index({ vehicleId: 1, startDateTime: 1, endDateTime: 1, status: 1 });
bookingSchema.index({ customerId: 1, createdAt: -1 });
bookingSchema.index({ vendorId: 1, startDateTime: -1 });
bookingSchema.index({ status: 1, lockExpiresAt: 1 });

// Helper Static Method to Generate Unique Human-Readable Booking Number
bookingSchema.statics.generateBookingNumber = function () {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `RR-${dateStr}-${randomHex}`;
};

export const Booking = mongoose.model('Booking', bookingSchema);
