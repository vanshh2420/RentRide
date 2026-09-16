import { Coupon } from '../models/coupon.model.js';
import { ApiError } from '../utils/ApiError.js';

export class CouponService {
  /**
   * Create a new platform coupon
   */
  static async createCoupon(payload, adminId) {
    const existing = await Coupon.findOne({ code: payload.code.toUpperCase().trim() });
    if (existing) {
      throw new ApiError(409, `Coupon with code '${payload.code}' already exists`);
    }

    const coupon = await Coupon.create({
      ...payload,
      code: payload.code.toUpperCase().trim(),
      createdBy: adminId,
      validFrom: payload.validFrom ? new Date(payload.validFrom) : new Date(),
      validUntil: payload.validUntil ? new Date(payload.validUntil) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    return coupon;
  }

  /**
   * List all platform coupons with usage stats
   */
  static async getAllCoupons({ isActive, page = 1, limit = 20 } = {}) {
    const query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true' || isActive === true;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [coupons, total] = await Promise.all([
      Coupon.find(query)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Coupon.countDocuments(query)
    ]);

    return {
      coupons,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  /**
   * Get single coupon by ID
   */
  static async getCouponById(id) {
    const coupon = await Coupon.findById(id).populate('createdBy', 'name email');
    if (!coupon) {
      throw new ApiError(404, 'Coupon not found');
    }
    return coupon;
  }

  /**
   * Update coupon
   */
  static async updateCoupon(id, payload) {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      throw new ApiError(404, 'Coupon not found');
    }

    Object.assign(coupon, payload);
    if (payload.validFrom) coupon.validFrom = new Date(payload.validFrom);
    if (payload.validUntil) coupon.validUntil = new Date(payload.validUntil);

    await coupon.save();
    return coupon;
  }

  /**
   * Delete coupon
   */
  static async deleteCoupon(id) {
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      throw new ApiError(404, 'Coupon not found');
    }
    return { message: 'Coupon deleted successfully' };
  }

  /**
   * Toggle active/inactive status
   */
  static async toggleCouponStatus(id) {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      throw new ApiError(404, 'Coupon not found');
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();
    return coupon;
  }

  /**
   * Validate Coupon for a given booking amount and user
   */
  static async validateCoupon(code, bookingAmount, userId = null) {
    const cleanCode = code.toUpperCase().trim();
    const coupon = await Coupon.findOne({ code: cleanCode });

    if (!coupon) {
      throw new ApiError(404, `Invalid promo coupon '${cleanCode}'`);
    }

    if (!coupon.isActive) {
      throw new ApiError(400, `Coupon '${cleanCode}' is currently inactive`);
    }

    const now = new Date();
    if (coupon.validFrom && now < coupon.validFrom) {
      throw new ApiError(400, `Coupon '${cleanCode}' is not active yet`);
    }

    if (coupon.validUntil && now > coupon.validUntil) {
      throw new ApiError(400, `Coupon '${cleanCode}' has expired`);
    }

    if (Number(bookingAmount) < coupon.minBookingAmount) {
      throw new ApiError(400, `Minimum booking amount of ₹${coupon.minBookingAmount} required for coupon '${cleanCode}'`);
    }

    if (coupon.usageCount >= coupon.totalUsageLimit) {
      throw new ApiError(400, `Coupon '${cleanCode}' has reached its total usage limit`);
    }

    if (userId) {
      const userUsageCount = coupon.usedBy.filter(
        (u) => u.userId?.toString() === userId.toString()
      ).length;

      if (userUsageCount >= coupon.perUserLimit) {
        throw new ApiError(400, `You have already used coupon '${cleanCode}' the maximum allowed times (${coupon.perUserLimit})`);
      }
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      const calculated = Math.round((Number(bookingAmount) * coupon.discountValue) / 100);
      discountAmount = coupon.maxDiscountAmount
        ? Math.min(calculated, coupon.maxDiscountAmount)
        : calculated;
    } else if (coupon.discountType === 'FIXED') {
      discountAmount = Math.min(coupon.discountValue, Number(bookingAmount));
    }

    return {
      isValid: true,
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxDiscountAmount: coupon.maxDiscountAmount,
        minBookingAmount: coupon.minBookingAmount
      },
      discountAmount,
      finalAmount: Math.max(0, Number(bookingAmount) - discountAmount)
    };
  }
}
