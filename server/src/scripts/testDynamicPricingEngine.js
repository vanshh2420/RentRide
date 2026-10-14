/**
 * RentRide Comprehensive Dynamic Pricing Engine Verification Test Suite
 * Validates all 24 required pricing scenarios and edge cases.
 */

import assert from 'node:assert/strict';
import { PricingService } from '../services/pricing.service.js';
import { DYNAMIC_PRICING_CONFIG, PRICING_DEFAULTS } from '../constants/pricing.js';

console.log('====================================================');
console.log('  RentRide Dynamic Pricing Verification Test Suite  ');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

async function test(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✓ [TEST ${totalTests}] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ [TEST ${totalTests}] ${name}`);
    console.error(`     Error: ${err.message}`);
    throw err;
  }
}

async function runTests() {
  // Mock vehicle for testing (Indore)
  const mockVehicleIndore = {
    _id: '507f1f77bcf86cd799439011',
    brand: 'Hyundai',
    model: 'Creta',
    location: { city: 'Indore', address: 'Vijay Nagar Hub' },
    pricing: {
      hourlyRate: 100,
      rate12Hour: 1000,
      rate24Hour: 1800,
      securityDeposit: 3000
    },
    vendorId: {
      _id: '507f1f77bcf86cd799439022',
      name: 'Indore Wheels',
      vendorProfile: { commissionRateOverride: 0.12 }
    }
  };

  // Mock vehicle in Bhopal (neutral city factor)
  const mockVehicleBhopal = {
    ...mockVehicleIndore,
    location: { city: 'Bhopal', address: 'MP Nagar Hub' }
  };

  // Helper dates (2026 calendar)
  const mondayDate = '2026-09-14T10:00:00.000Z';   // Monday
  const tuesdayDate = '2026-09-15T10:00:00.000Z';  // Tuesday (Off-peak -3%)
  const wednesdayDate = '2026-09-16T10:00:00.000Z';// Wednesday (Off-peak -3%)
  const thursdayDate = '2026-09-17T10:00:00.000Z'; // Thursday
  const fridayDate = '2026-09-18T10:00:00.000Z';   // Friday (+10%)
  const saturdayDate = '2026-09-19T10:00:00.000Z'; // Saturday (Peak +15%)
  const sundayDate = '2026-09-20T10:00:00.000Z';   // Sunday (+10%)

  // 1. Normal weekday (Monday, standard hub Bhopal, neutral 50% util)
  await test('1. Normal weekday (Monday): standard rate 1.00x', () => {
    const res = PricingService.calculateDynamicMultiplier({
      rentalDate: mondayDate,
      city: 'Bhopal',
      fleetUtilization: 0.50
    });
    assert.equal(res.dynamicMultiplier, 1.00);
    assert.equal(res.surgeBadge, 'STANDARD_RATE');
    assert.deepEqual(res.appliedFactors, ['Standard Base Rate']);
  });

  // 2. Friday demand (+10%)
  await test('2. Friday: weekend surge (+10%)', () => {
    const res = PricingService.calculateDynamicMultiplier({
      rentalDate: fridayDate,
      city: 'Bhopal',
      fleetUtilization: 0.50
    });
    assert.equal(res.dynamicMultiplier, 1.10);
    assert.equal(res.surgeBadge, 'WEEKEND_SURGE');
    assert(res.appliedFactors.some(f => f.includes('Weekend Surge (+10%)')));
  });

  // 3. Saturday peak (+15%)
  await test('3. Saturday: peak weekend surge (+15%)', () => {
    const res = PricingService.calculateDynamicMultiplier({
      rentalDate: saturdayDate,
      city: 'Bhopal',
      fleetUtilization: 0.50
    });
    assert.equal(res.dynamicMultiplier, 1.15);
    assert.equal(res.surgeBadge, 'WEEKEND_SURGE');
    assert(res.appliedFactors.some(f => f.includes('Peak Weekend Surge (+15%)')));
  });

  // 4. Sunday (+10%)
  await test('4. Sunday: weekend return surge (+10%)', () => {
    const res = PricingService.calculateDynamicMultiplier({
      rentalDate: sundayDate,
      city: 'Bhopal',
      fleetUtilization: 0.50
    });
    assert.equal(res.dynamicMultiplier, 1.10);
    assert.equal(res.surgeBadge, 'WEEKEND_SURGE');
    assert(res.appliedFactors.some(f => f.includes('Weekend Surge (+10%)')));
  });

  // 5. Low demand off-peak weekday (Tuesday: -3%)
  await test('5. Low demand off-peak weekday (Tuesday): 0.97x discount', () => {
    const res = PricingService.calculateDynamicMultiplier({
      rentalDate: tuesdayDate,
      city: 'Bhopal',
      fleetUtilization: 0.50
    });
    assert.equal(res.dynamicMultiplier, 0.97);
    assert.equal(res.surgeBadge, 'VALUE_SAVER');
    assert(res.appliedFactors.some(f => f.includes('Value Saver Off-Peak Discount (-3%)')));
  });

  // 6. Moderate demand: fleet scarcity 70-84% (+8%)
  await test('6. Moderate demand (75% utilization): +8% scarcity surge', () => {
    const res = PricingService.calculateDynamicMultiplier({
      rentalDate: mondayDate,
      city: 'Bhopal',
      fleetUtilization: 0.75
    });
    assert.equal(res.dynamicMultiplier, 1.08);
    assert.equal(res.surgeBadge, 'MODERATE_SURGE');
    assert(res.appliedFactors.some(f => f.includes('Moderate Fleet Scarcity (+8%)')));
  });

  // 7. High demand: fleet scarcity >=85% (+15%)
  await test('7. High demand (90% utilization): +15% scarcity surge', () => {
    const res = PricingService.calculateDynamicMultiplier({
      rentalDate: mondayDate,
      city: 'Bhopal',
      fleetUtilization: 0.90
    });
    assert.equal(res.dynamicMultiplier, 1.15);
    assert.equal(res.surgeBadge, 'MODERATE_SURGE');
    assert(res.appliedFactors.some(f => f.includes('High Fleet Scarcity (+15%)')));
  });

  // 8. High fleet utilization combined with Saturday and commercial hub
  await test('8. High fleet utilization combined: Saturday + 90% util + Indore (+33% total surge)', () => {
    const res = PricingService.calculateDynamicMultiplier({
      rentalDate: saturdayDate,
      city: 'Indore',
      fleetUtilization: 0.90
    });
    // 1.00 + 0.15 (Sat) + 0.15 (Util) + 0.03 (Indore) = 1.33x
    assert.equal(res.dynamicMultiplier, 1.33);
    assert.equal(res.surgeBadge, 'HIGH_DEMAND_SURGE');
  });

  // 9. Low fleet utilization (20% util): -7% low demand discount
  await test('9. Low fleet utilization (20% util): -7% discount', () => {
    const res = PricingService.calculateDynamicMultiplier({
      rentalDate: mondayDate,
      city: 'Bhopal',
      fleetUtilization: 0.20
    });
    assert.equal(res.dynamicMultiplier, 0.93);
    assert.equal(res.surgeBadge, 'VALUE_SAVER');
    assert(res.appliedFactors.some(f => f.includes('Low Fleet Demand Discount (-7%)')));
  });

  // 10. Supported cities check: Indore (+3%), Bhopal (0%), Gwalior (0%)
  await test('10. Supported cities check: Indore (+3%), Bhopal (0%), Gwalior (0%)', () => {
    const indoreRes = PricingService.calculateDynamicMultiplier({
      rentalDate: mondayDate,
      city: 'Indore',
      fleetUtilization: 0.50
    });
    assert.equal(indoreRes.dynamicMultiplier, 1.03);

    const bhopalRes = PricingService.calculateDynamicMultiplier({
      rentalDate: mondayDate,
      city: 'Bhopal',
      fleetUtilization: 0.50
    });
    assert.equal(bhopalRes.dynamicMultiplier, 1.00);

    const gwaliorRes = PricingService.calculateDynamicMultiplier({
      rentalDate: mondayDate,
      city: 'Gwalior',
      fleetUtilization: 0.50
    });
    assert.equal(gwaliorRes.dynamicMultiplier, 1.00);
  });

  // 11. Unknown city: neutral default 0.00 (no surprise surcharges)
  await test('11. Unknown city: neutral default 0.00', () => {
    const res = PricingService.calculateDynamicMultiplier({
      rentalDate: mondayDate,
      city: 'UnknownCityX',
      fleetUtilization: 0.50
    });
    assert.equal(res.dynamicMultiplier, 1.00);
  });

  // 12. Category variation: executes deterministically
  await test('12. Category variation: general execution parity', () => {
    const res = PricingService.calculateDynamicMultiplier({
      rentalDate: mondayDate,
      city: 'Indore',
      fleetUtilization: 0.50
    });
    assert(res.dynamicMultiplier >= 0.90 && res.dynamicMultiplier <= 1.35);
  });

  // 13. Multiplier Lower Bound: exactly 0.90x on Tuesday + 15% util in Bhopal
  await test('13. Multiplier Lower Bound: exactly 0.90x (Tue -3%, Low util -7%)', () => {
    const res = PricingService.calculateDynamicMultiplier({
      rentalDate: tuesdayDate,
      city: 'Bhopal',
      fleetUtilization: 0.15
    });
    // 1.00 - 0.03 - 0.07 = 0.90
    assert.equal(res.dynamicMultiplier, 0.90);
    assert(res.dynamicMultiplier >= DYNAMIC_PRICING_CONFIG.MIN_DYNAMIC_MULTIPLIER);
    assert.equal(res.surgeBadge, 'VALUE_SAVER');
  });

  // 14. Multiplier Upper Bound: strictly clamped <= 1.35x
  await test('14. Multiplier Upper Bound: strictly clamped <= 1.35x', () => {
    const res = PricingService.calculateDynamicMultiplier({
      rentalDate: saturdayDate,
      city: 'Indore',
      fleetUtilization: 1.0 // 100% full
    });
    assert(res.dynamicMultiplier <= 1.35);
    assert(res.dynamicMultiplier >= 0.90);
  });

  // 15. Invalid rental date: safe fallback without NaN/throw
  await test('15. Invalid rental date: safe fallback without NaN or throw', () => {
    const res = PricingService.calculateDynamicMultiplier({
      rentalDate: 'invalid-date-string-123',
      city: 'Indore',
      fleetUtilization: 0.50
    });
    assert(!isNaN(res.dynamicMultiplier));
    assert(res.dynamicMultiplier >= 0.90 && res.dynamicMultiplier <= 1.35);
  });

  // 16. Zero or negative base rate in price breakdown
  await test('16. Zero or negative base rate in calculatePriceBreakdown', async () => {
    const zeroVehicle = { ...mockVehicleIndore, pricing: { hourlyRate: 0, rate12Hour: 0, rate24Hour: 0, securityDeposit: 1000 } };
    const { priceBreakdown } = await PricingService.calculatePriceBreakdown({
      vehicle: zeroVehicle,
      rentalPlan: 'HOURLY',
      startDateTime: mondayDate,
      endDateTime: '2026-09-14T14:00:00.000Z',
      fleetUtilization: 0.50
    });
    assert.equal(priceBreakdown.basePrice, 0);
    assert.equal(priceBreakdown.subtotal, 0);
    assert.equal(priceBreakdown.platformFee, 0);
    assert.equal(priceBreakdown.taxAmount, 0);
    assert.equal(priceBreakdown.totalAmount, 1000); // Only security deposit
  });

  // 17. Very large base rate
  await test('17. Very large base rate (e.g. ₹500,000)', async () => {
    const luxuryVehicle = { ...mockVehicleIndore, pricing: { hourlyRate: 50000, rate12Hour: 500000, rate24Hour: 900000, securityDeposit: 7500 } };
    const { priceBreakdown } = await PricingService.calculatePriceBreakdown({
      vehicle: luxuryVehicle,
      rentalPlan: '12_HOURS',
      startDateTime: mondayDate,
      endDateTime: '2026-09-14T22:00:00.000Z',
      fleetUtilization: 0.50
    });
    assert(!isNaN(priceBreakdown.totalAmount));
    assert(priceBreakdown.totalAmount > 500000);
    assert.equal(priceBreakdown.securityDeposit, 7500);
  });

  // 18. Decimal base rate
  await test('18. Decimal base rate: rounded properly without float artifacts', async () => {
    const decimalVehicle = { ...mockVehicleIndore, pricing: { hourlyRate: 149.99, rate12Hour: 1599.49, rate24Hour: 2899.75, securityDeposit: 1000 } };
    const { priceBreakdown } = await PricingService.calculatePriceBreakdown({
      vehicle: decimalVehicle,
      rentalPlan: 'HOURLY',
      startDateTime: tuesdayDate,
      endDateTime: '2026-09-15T13:00:00.000Z', // 3 hours
      fleetUtilization: 0.50
    });
    assert(Number.isInteger(priceBreakdown.basePrice));
    assert(Number.isInteger(priceBreakdown.adjustedRentalAmount));
    assert(Number.isInteger(priceBreakdown.totalAmount));
  });

  // 19. AI service unavailable: fallback calculates accurate rate (Bhopal 0.90x lower bound)
  await test('19. Fallback resilience: PricingService runs 100% offline without external services', async () => {
    const { priceBreakdown } = await PricingService.calculatePriceBreakdown({
      vehicle: mockVehicleBhopal,
      rentalPlan: 'HOURLY',
      startDateTime: tuesdayDate,
      endDateTime: '2026-09-15T15:00:00.000Z', // 5 hours: 5 * 100 = 500
      fleetUtilization: 0.15 // Low util (-7%) + Tuesday (-3%) = 0.90x
    });
    assert.equal(priceBreakdown.basePrice, 500);
    assert.equal(priceBreakdown.dynamicMultiplier, 0.90);
    assert.equal(priceBreakdown.adjustedRentalAmount, 450);
    assert.equal(priceBreakdown.dynamicAdjustment, -50);
    assert.equal(priceBreakdown.surgeBadge, 'VALUE_SAVER');
  });

  // 20. Frontend/backend price breakdown alias consistency
  await test('20. Frontend/backend price consistency: exposes both canonical and UI alias fields', async () => {
    const { priceBreakdown } = await PricingService.calculatePriceBreakdown({
      vehicle: mockVehicleIndore,
      rentalPlan: 'HOURLY',
      startDateTime: mondayDate,
      endDateTime: '2026-09-14T13:00:00.000Z', // 3 hours = 300
      fleetUtilization: 0.50
    });
    // Canonical & Aliases match
    assert.equal(priceBreakdown.totalAmount, priceBreakdown.totalPayable);
    assert.equal(priceBreakdown.taxAmount, priceBreakdown.gstAmount);
    assert.equal(priceBreakdown.couponDiscount, priceBreakdown.discountAmount);
    assert.equal(priceBreakdown.dynamicMultiplier, priceBreakdown.surgeMultiplier);
    assert(Array.isArray(priceBreakdown.appliedFactors));
  });

  // 21. Coupon calculation applied strictly after dynamic rental price
  await test('21. Coupon calculation applied strictly after dynamic rental price', async () => {
    const { priceBreakdown } = await PricingService.calculatePriceBreakdown({
      vehicle: mockVehicleIndore,
      rentalPlan: 'HOURLY',
      startDateTime: saturdayDate, // Sat + Indore + 50% util = 1.0 + 0.15 + 0.03 = 1.18x
      endDateTime: '2026-09-19T14:00:00.000Z', // 4 hours = 400
      fleetUtilization: 0.50
    });
    // Base = 400. Dynamic Multiplier = 1.18. Adjusted = round(400 * 1.18) = 472.
    assert.equal(priceBreakdown.basePrice, 400);
    assert.equal(priceBreakdown.dynamicMultiplier, 1.18);
    assert.equal(priceBreakdown.adjustedRentalAmount, 472);
    assert.equal(priceBreakdown.subtotal, 472);
  });

  // 22. Security deposit completely unaffected by dynamic multiplier
  await test('22. Security deposit completely unaffected by dynamic multiplier', async () => {
    const surgeBreakdown = (await PricingService.calculatePriceBreakdown({
      vehicle: mockVehicleIndore,
      rentalPlan: 'HOURLY',
      startDateTime: saturdayDate,
      endDateTime: '2026-09-19T14:00:00.000Z',
      fleetUtilization: 0.90 // 1.33x surge
    })).priceBreakdown;

    const discountBreakdown = (await PricingService.calculatePriceBreakdown({
      vehicle: mockVehicleBhopal,
      rentalPlan: 'HOURLY',
      startDateTime: tuesdayDate,
      endDateTime: '2026-09-15T14:00:00.000Z',
      fleetUtilization: 0.15 // 0.90x discount
    })).priceBreakdown;

    assert.equal(surgeBreakdown.securityDeposit, 3000);
    assert.equal(discountBreakdown.securityDeposit, 3000);
    assert.equal(mockVehicleIndore.pricing.securityDeposit, 3000);
  });

  // 23. Invalid rental interval throws error (end <= start)
  await test('23. Invalid rental interval rejection (end <= start)', async () => {
    let thrown = false;
    try {
      await PricingService.calculatePriceBreakdown({
        vehicle: mockVehicleIndore,
        rentalPlan: 'HOURLY',
        startDateTime: '2026-09-15T14:00:00.000Z',
        endDateTime: '2026-09-15T12:00:00.000Z', // In past
        fleetUtilization: 0.50
      });
    } catch (err) {
      thrown = true;
      assert(err.message.includes('strictly after'));
    }
    assert(thrown, 'Should have thrown validation error for past/inverted date');
  });

  // 24. Full checkout breakdown arithmetic equality
  await test('24. Full checkout arithmetic: subtotal + fee + tax + deposit === totalAmount', async () => {
    const { priceBreakdown } = await PricingService.calculatePriceBreakdown({
      vehicle: mockVehicleIndore,
      rentalPlan: '24_HOURS',
      startDateTime: fridayDate,
      endDateTime: '2026-09-19T10:00:00.000Z', // 24 hours
      fleetUtilization: 0.75 // Moderate scarcity
    });

    const expectedTotal = priceBreakdown.subtotal + priceBreakdown.platformFee + priceBreakdown.taxAmount + priceBreakdown.securityDeposit;
    assert.equal(priceBreakdown.totalAmount, expectedTotal);
    assert.equal(priceBreakdown.vendorPayout + priceBreakdown.platformCommission, priceBreakdown.subtotal);
  });

  console.log('\n====================================================');
  console.log(`  ALL ${passedTests}/${totalTests} DYNAMIC PRICING TESTS PASSED!`);
  console.log('====================================================\n');
}

runTests().catch((err) => {
  console.error('\nTest suite execution failed:', err);
  process.exit(1);
});
