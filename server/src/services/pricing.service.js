import { Coupon } from '../models/coupon.model.js';
import { Vehicle } from '../models/vehicle.model.js';
import { Booking } from '../models/booking.model.js';
import { PRICING_DEFAULTS, DYNAMIC_PRICING_CONFIG } from '../constants/pricing.js';

export class PricingService {
  /**
   * Determine fleet utilization safely from MongoDB
   * Returns a neutral 0.50 fallback on any error, timeout, or disconnected state
   */
  static async getFleetUtilization(city) {
    try {
      const vehicleQuery = { isApproved: true };
      if (city && typeof city === 'string') {
        vehicleQuery['location.city'] = new RegExp(`^${city.trim()}$`, 'i');
      }

      const [totalFleet, activeBookings] = await Promise.all([
        Vehicle.countDocuments(vehicleQuery).maxTimeMS(1000),
        Booking.countDocuments({
          status: { $in: ['CONFIRMED', 'ACTIVE'] }
        }).maxTimeMS(1000)
      ]);

      if (totalFleet > 0) {
        return Math.min(1.0, Math.max(0.0, activeBookings / totalFleet));
      }
      return 0.50;
    } catch {
      return 0.50; // Documented neutral default
    }
  }

  /**
   * Calculate deterministic dynamic rate multiplier bounded strictly between 0.90x and 1.35x
   * Factors: Day/Time, Fleet Scarcity/Utilization, Geographic Hub
   */
  static calculateDynamicMultiplier({ rentalDate, city = 'Indore', fleetUtilization = 0.50 } = {}) {
    let dateObj;
    try {
      if (rentalDate) {
        dateObj = new Date(rentalDate);
        if (isNaN(dateObj.getTime())) {
          dateObj = new Date();
        }
      } else {
        dateObj = new Date();
      }
    } catch {
      dateObj = new Date();
    }

    // Sanitize utilization
    const utilization = typeof fleetUtilization === 'number' && !isNaN(fleetUtilization)
      ? Math.min(1.0, Math.max(0.0, fleetUtilization))
      : 0.50;

    const { FACTORS, MIN_DYNAMIC_MULTIPLIER, MAX_DYNAMIC_MULTIPLIER, BASE_MULTIPLIER, BADGES } = DYNAMIC_PRICING_CONFIG;
    let multiplier = BASE_MULTIPLIER;
    const appliedFactors = [];

    const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hours = dateObj.getHours();
    let isWeekend = false;

    // 1. Day / Time Factor
    if (dayOfWeek === 6) { // Saturday
      multiplier += FACTORS.SATURDAY_DELTA;
      appliedFactors.append ? appliedFactors.append('Peak Weekend Surge (+15%)') : appliedFactors.push('Peak Weekend Surge (+15%)');
      isWeekend = true;
    } else if (dayOfWeek === 0) { // Sunday
      multiplier += FACTORS.SUNDAY_DELTA;
      appliedFactors.push('Weekend Surge (+10%)');
      isWeekend = true;
    } else if (dayOfWeek === 5) { // Friday
      multiplier += FACTORS.FRIDAY_DELTA;
      appliedFactors.push('Weekend Surge (+10%)');
      isWeekend = true;
    } else if (FACTORS.OFF_PEAK_WEEKDAY_DAYS.includes(dayOfWeek)) { // Tuesday (2), Wednesday (3)
      multiplier += FACTORS.OFF_PEAK_WEEKDAY_DELTA;
      appliedFactors.push(`Value Saver Off-Peak Discount (${Math.round(FACTORS.OFF_PEAK_WEEKDAY_DELTA * 100)}%)`);
    }

    // 2. Fleet Scarcity / Utilization Factor
    if (utilization >= FACTORS.HIGH_SCARCITY_THRESHOLD) {
      multiplier += FACTORS.HIGH_SCARCITY_DELTA;
      appliedFactors.push(`High Fleet Scarcity (+${Math.round(FACTORS.HIGH_SCARCITY_DELTA * 100)}%)`);
    } else if (utilization >= FACTORS.MODERATE_SCARCITY_THRESHOLD) {
      multiplier += FACTORS.MODERATE_SCARCITY_DELTA;
      appliedFactors.push(`Moderate Fleet Scarcity (+${Math.round(FACTORS.MODERATE_SCARCITY_DELTA * 100)}%)`);
    } else if (utilization < FACTORS.LOW_UTILIZATION_THRESHOLD) {
      multiplier += FACTORS.LOW_UTILIZATION_DELTA;
      appliedFactors.push(`Low Fleet Demand Discount (${Math.round(FACTORS.LOW_UTILIZATION_DELTA * 100)}%)`);
    }

    // 3. Location / Hub Factor (Operational Hubs: Indore, Bhopal, Gwalior)
    const cityKey = (city || 'Indore').trim().toLowerCase();
    const cityDelta = FACTORS.CITY_FACTORS[cityKey] !== undefined
      ? FACTORS.CITY_FACTORS[cityKey]
      : FACTORS.DEFAULT_CITY_DELTA;

    if (cityDelta > 0) {
      multiplier += cityDelta;
      appliedFactors.push(`Commercial Hub Adjustment (${cityKey.charAt(0).toUpperCase() + cityKey.slice(1)}) (+${Math.round(cityDelta * 100)}%)`);
    }

    // 4. Clamping strictly between 0.90x and 1.35x
    const rawMultiplier = Math.round(multiplier * 100) / 100;
    const finalMultiplier = Math.round(
      Math.min(MAX_DYNAMIC_MULTIPLIER, Math.max(MIN_DYNAMIC_MULTIPLIER, rawMultiplier)) * 100
    ) / 100;

    // 5. Surge Badge
    let surgeBadge = BADGES.STANDARD_RATE;
    if (finalMultiplier < 1.0) {
      surgeBadge = BADGES.VALUE_SAVER;
    } else if (finalMultiplier >= 1.20) {
      surgeBadge = BADGES.HIGH_DEMAND_SURGE;
    } else if (isWeekend) {
      surgeBadge = BADGES.WEEKEND_SURGE;
    } else if (finalMultiplier > 1.0) {
      surgeBadge = BADGES.MODERATE_SURGE;
    }

    return {
      dynamicMultiplier: finalMultiplier,
      surgeMultiplier: finalMultiplier,
      surgeBadge,
      appliedFactors: appliedFactors.length > 0 ? appliedFactors : ['Standard Base Rate'],
      potentialRevenueUpliftPercent: finalMultiplier > 1.0 ? Math.round((finalMultiplier - 1.0) * 100) : 0,
      potentialSavingsPercent: finalMultiplier < 1.0 ? Math.round((1.0 - finalMultiplier) * 100) : 0
    };
  }

  /**
   * Calculate complete authoritative rental price breakdown on the server
   * Zero trust on frontend amounts
   */
  static async calculatePriceBreakdown({
    vehicle,
    rentalPlan,
    startDateTime,
    endDateTime,
    couponCode,
    userId,
    fleetUtilization
  }) {
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid rental start or end date/time');
    }

    if (start >= end) {
      throw new Error('End date/time must be strictly after start date/time');
    }

    // 1. Calculate duration in fractional & integer hours
    const durationMs = end.getTime() - start.getTime();
    const durationHoursExact = durationMs / (1000 * 60 * 60);

    // Validate plan-duration invariants (Zero trust)
    if (rentalPlan === '12_HOURS') {
      if (Math.abs(durationHoursExact - 12) > 0.01) {
        throw new Error('12-Hour rental plan requires a duration of exactly 12 hours');
      }
    } else if (rentalPlan === '24_HOURS') {
      if (Math.abs(durationHoursExact - 24) > 0.01) {
        throw new Error('24-Hour rental plan requires a duration of exactly 24 hours');
      }
    } else if (rentalPlan === 'HOURLY') {
      if (Math.abs(durationHoursExact - Math.round(durationHoursExact)) > 0.001) {
        throw new Error('Hourly rental duration must be a whole number of hours');
      }
      const rounded = Math.round(durationHoursExact);
      if (rounded < 1) {
        throw new Error('Hourly rental duration must be at least 1 hour');
      }
      if (rounded > 24) {
        throw new Error('Hourly rental duration cannot exceed 24 hours');
      }
    }

    const durationHours = Math.max(1, Math.round(durationHoursExact));

    // 2. Calculate Base Price based on selected plan
    const pricingObj = vehicle?.pricing || {};
    const hourlyRate = Math.max(0, Number(pricingObj.hourlyRate) || 0);
    const rate12Hour = Math.max(0, Number(pricingObj.rate12Hour) || (hourlyRate * 12));
    const rate24Hour = Math.max(0, Number(pricingObj.rate24Hour) || (hourlyRate * 24));

    let basePrice = 0;
    if (rentalPlan === 'HOURLY') {
      basePrice = durationHours * hourlyRate;
    } else if (rentalPlan === '12_HOURS') {
      basePrice = rate12Hour;
    } else if (rentalPlan === '24_HOURS') {
      basePrice = rate24Hour;
    } else {
      basePrice = durationHours * hourlyRate;
    }
    basePrice = Math.max(0, Math.round(basePrice));

    // 3. Dynamic Multiplier Calculation (Server Authoritative)
    let utilization = fleetUtilization;
    if (utilization === undefined || utilization === null) {
      utilization = await this.getFleetUtilization(vehicle?.location?.city);
    }

    const {
      dynamicMultiplier,
      surgeBadge,
      appliedFactors,
      potentialRevenueUpliftPercent,
      potentialSavingsPercent
    } = this.calculateDynamicMultiplier({
      rentalDate: start,
      city: vehicle?.location?.city || 'Indore',
      fleetUtilization: utilization
    });

    // Dynamic pricing strictly adjusts the rental rate
    const adjustedBase = Math.max(0, Math.round(basePrice * dynamicMultiplier));
    const dynamicAdjustment = adjustedBase - basePrice;

    // 4. Coupon Validation & Discount Calculation
    let couponDiscount = 0;
    let appliedCoupon = null;

    if (couponCode && typeof couponCode === 'string' && couponCode.trim()) {
      try {
        const coupon = await Coupon.findOne({
          code: couponCode.trim().toUpperCase(),
          isActive: true,
          validFrom: { $lte: new Date() },
          validUntil: { $gte: new Date() }
        });

        if (coupon) {
          // Check minimum booking amount
          if (adjustedBase >= (coupon.minBookingAmount || 0)) {
            // Check usage limit
            if (coupon.usageCount < (coupon.totalUsageLimit || Infinity)) {
              // Check per-user limit
              const userUsageCount = userId && Array.isArray(coupon.usedBy)
                ? coupon.usedBy.filter((u) => u.userId?.toString() === userId.toString()).length
                : 0;

              if (userUsageCount < (coupon.perUserLimit || Infinity)) {
                if (coupon.discountType === 'PERCENTAGE') {
                  const calculated = Math.round((adjustedBase * (coupon.discountValue || 0)) / 100);
                  couponDiscount = coupon.maxDiscountAmount
                    ? Math.min(calculated, coupon.maxDiscountAmount)
                    : calculated;
                } else if (coupon.discountType === 'FIXED') {
                  couponDiscount = Math.min(coupon.discountValue || 0, adjustedBase);
                }
                couponDiscount = Math.max(0, couponDiscount);
                appliedCoupon = coupon;
              }
            }
          }
        }
      } catch {
        couponDiscount = 0;
      }
    }

    // 5. Net Subtotal
    const subtotal = Math.max(0, adjustedBase - couponDiscount);

    // 6. Platform Fees & Taxes
    const platformFee = Math.round(subtotal * PRICING_DEFAULTS.PLATFORM_FEE_RATE); // 5%
    const taxAmount = Math.round(subtotal * PRICING_DEFAULTS.GST_RATE); // 18%
    const securityDeposit = Math.max(0, Number(pricingObj.securityDeposit) || 1000);

    // 7. Total Payable by Customer
    const totalAmount = subtotal + platformFee + taxAmount + securityDeposit;

    // 8. Vendor Payout vs Platform Commission Split
    const commissionRate = vehicle?.vendorId?.vendorProfile?.commissionRateOverride || PRICING_DEFAULTS.PLATFORM_COMMISSION_RATE; // 12%
    const platformCommission = Math.round(subtotal * commissionRate);
    const vendorPayout = subtotal - platformCommission;

    return {
      durationHours,
      priceBreakdown: {
        basePrice,
        baseRentalAmount: basePrice,
        dynamicMultiplier,
        surgeMultiplier: dynamicMultiplier,
        dynamicAdjustment,
        adjustedRentalAmount: adjustedBase,
        surgeBadge,
        appliedFactors,
        potentialRevenueUpliftPercent,
        potentialSavingsPercent,
        couponDiscount,
        discountAmount: couponDiscount,
        subtotal,
        platformFee,
        taxAmount,
        gstAmount: taxAmount,
        securityDeposit,
        totalAmount,
        totalPayable: totalAmount,
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
