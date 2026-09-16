import mongoose from 'mongoose';
import { PAYMENT_STATUS } from '../constants/status.js';

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Booking ID is required']
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null // Nullable for offline walk-in bookings
    },
    razorpayOrderId: {
      type: String,
      trim: true,
      default: null
    },
    razorpayPaymentId: {
      type: String,
      trim: true,
      default: null
    },
    razorpaySignature: {
      type: String,
      trim: true,
      default: null
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0, 'Amount cannot be negative']
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'wallet', 'offline_cash', 'other', 'RAZORPAY', 'razorpay', 'OFFLINE_CASH', 'OFFLINE_COUNTER_UPI', 'OFFLINE_CARD'],
      default: 'RAZORPAY'
    },
    refundDetails: {
      refundId: { type: String, default: null },
      amount: { type: Number, default: 0 },
      status: {
        type: String,
        enum: ['NONE', 'INITIATED', 'COMPLETED', 'FAILED'],
        default: 'NONE'
      },
      reason: { type: String, default: '' },
      processedAt: { type: Date, default: null }
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

// Indexes
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ razorpayPaymentId: 1 });
paymentSchema.index({ userId: 1, createdAt: -1 });

export const Payment = mongoose.model('Payment', paymentSchema);
