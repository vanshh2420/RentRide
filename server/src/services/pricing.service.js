import { Coupon } from '../models/coupon.model.js';
import { PRICING_DEFAULTS } from '../constants/pricing.js';

export class PricingService {
  /**
   * Calculate complete rental price breakdown on the server
   * Zero trust on frontend amounts
   */
  static async calculatePriceBreakdown({
    vehicle,
    rentalPlan,
    startDateTime,
    endDateTime,
    couponCode,
    userId
  }) {
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    if (start >= end) {
      throw new Error('End date/time must be strictly after start date/time');
    }

    // 1. Calculate duration in fractional & integer hours
    const durationMs = end.getTime() - start.getTime();
    const durationHours = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60)));

    // 2. Calculate Base Price based on selected plan
    let basePrice = 0;
    if (rentalPlan === 'HOURLY') {
      basePrice = durationHours * vehicle.pricing.hourlyRate;
    } else if (rentalPlan === '12_HOURS') {
      const units = Math.max(1, Math.ceil(durationHours / 12));
      basePrice = units * vehicle.pricing.rate12Hour;
    } else if (rentalPlan === '24_HOURS') {
      const units = Math.max(1, Math.ceil(durationHours / 24));
      basePrice = units * vehicle.pricing.rate24Hour;
    } else {
      basePrice = durationHours * vehicle.pricing.hourlyRate;
    }

    // 3. Dynamic Surge Multiplier (Rule-based weekend surge)
    let surgeMultiplier = 1.0;
    const startDay = start.getDay(); // 0 = Sunday, 5 = Friday, 6 = Saturday
    const isWeekend = startDay === 0 || startDay === 6 || (startDay === 5 && start.getHours() >= 18);
    if (isWeekend) {
      surgeMultiplier = PRICING_DEFAULTS.WEEKEND_SURGE_MULTIPLIER; // 1.15x
    }

    const adjustedBase = Math.round(basePrice * surgeMultiplier);

    // 4. Coupon Validation & Discount Calculation
    let couponDiscount = 0;
    let appliedCoupon = null;

    if (couponCode && couponCode.trim()) {
      const coupon = await Coupon.findOne({
        code: couponCode.trim().toUpperCase(),
        isActive: true,
        validFrom: { $lte: new Date() },
        validUntil: { $gte: new Date() }
      });

      if (coupon) {
        // Check minimum booking amount
        if (adjustedBase >= coupon.minBookingAmount) {
          // Check usage limit
          if (coupon.usageCount < coupon.totalUsageLimit) {
            // Check per-user limit
            const userUsageCount = userId
              ? coupon.usedBy.filter((u) => u.userId?.toString() === userId.toString()).length
              : 0;

            if (userUsageCount < coupon.perUserLimit) {
              if (coupon.discountType === 'PERCENTAGE') {
                const calculated = Math.round((adjustedBase * coupon.discountValue) / 100);
                couponDiscount = coupon.maxDiscountAmount
                  ? Math.min(calculated, coupon.maxDiscountAmount)
                  : calculated;
              } else if (coupon.discountType === 'FIXED') {
                couponDiscount = Math.min(coupon.discountValue, adjustedBase);
              }
              appliedCoupon = coupon;
            }
          }
        }
      }
    }

    // 5. Net Subtotal
    const subtotal = Math.max(0, adjustedBase - couponDiscount);

    // 6. Platform Fees & Taxes
    const platformFee = Math.round(subtotal * PRICING_DEFAULTS.PLATFORM_FEE_RATE); // 5%
    const taxAmount = Math.round(subtotal * PRICING_DEFAULTS.GST_RATE); // 18%
    const securityDeposit = vehicle.pricing?.securityDeposit || 1000;

    // 7. Total Payable by Customer
    const totalAmount = subtotal + platformFee + taxAmount + securityDeposit;

    // 8. Vendor Payout vs Platform Commission Split
    const commissionRate = vehicle.vendorId?.vendorProfile?.commissionRateOverride || PRICING_DEFAULTS.PLATFORM_COMMISSION_RATE; // 12%
    const platformCommission = Math.round(subtotal * commissionRate);
    const vendorPayout = subtotal - platformCommission;

    return {
      durationHours,
      priceBreakdown: {
        basePrice,
        surgeMultiplier,
        couponDiscount,
        subtotal,
        platformFee,
        taxAmount,
        securityDeposit,
        totalAmount,
        vendorPayout,
        platformCommission
      },
      appliedCoupon
    };
  }

  /**
   * Vendor Economics Calculator
   * Rental Revenue + Extra KM Revenue - Platform Commission = Net Vendor Earnings
   */
  static calculateVendorEarningsBreakdown({
    subtotal = 0,
    extraKmRevenue = 0,
    commissionRate = PRICING_DEFAULTS.PLATFORM_COMMISSION_RATE // 12%
  }) {
    const grossRentalRevenue = Math.max(0, Number(subtotal) || 0);
    const grossExtraKmRevenue = Math.max(0, Number(extraKmRevenue) || 0);
    const totalGrossRevenue = grossRentalRevenue + grossExtraKmRevenue;

    const platformCommission = Math.round(totalGrossRevenue * commissionRate);
    const netVendorEarnings = totalGrossRevenue - platformCommission;

    return {
      grossRentalRevenue,
      grossExtraKmRevenue,
      totalGrossRevenue,
      commissionRate,
      platformCommission,
      netVendorEarnings
    };
  }
}

