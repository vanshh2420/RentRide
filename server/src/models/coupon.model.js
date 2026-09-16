import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    discountType: {
      type: String,
      enum: ['PERCENTAGE', 'FIXED'],
      required: [true, 'Discount type is required']
    },
    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: [1, 'Discount value must be at least 1']
    },
    minBookingAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    maxDiscountAmount: {
      type: Number,
      default: null // Cap for PERCENTAGE coupons, e.g. 20% up to ₹500
    },
    validFrom: {
      type: Date,
      default: Date.now
    },
    validUntil: {
      type: Date,
      required: [true, 'Coupon expiry date is required']
    },
    totalUsageLimit: {
      type: Number,
      default: 500,
      min: 1
    },
    perUserLimit: {
      type: Number,
      default: 1,
      min: 1
    },
    usageCount: {
      type: Number,
      default: 0
    },
    usedBy: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
        usedAt: { type: Date, default: Date.now }
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes
couponSchema.index({ code: 1, isActive: 1 });

export const Coupon = mongoose.model('Coupon', couponSchema);
