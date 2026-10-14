import assert from 'node:assert/strict';
import { RENTAL_PLANS } from '../constants/status.js';
import { checkAvailabilitySchema, createOnlineBookingSchema, validateRentalBookingPayload } from '../validators/booking.validator.js';
import { PricingService } from '../services/pricing.service.js';

async function runDurationVerificationTests() {
  console.log('====================================================');
  console.log('  RentRide Booking Duration Feature Verification Suite');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✓ [TEST ${total}] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ [TEST ${total}] ${name}`);
      console.error(`     Error: ${err.message}`);
      throw err;
    }
  }

  const baseStartTime = new Date('2026-10-15T10:00:00.000Z');
  const getEndTime = (hours) => new Date(baseStartTime.getTime() + hours * 60 * 60 * 1000).toISOString();
  const startTimeIso = baseStartTime.toISOString();

  const mockVehicle = {
    _id: '507f1f77bcf86cd799439011',
    brand: 'Hyundai',
    model: 'Creta',
    location: { city: 'Indore', address: 'Hub' },
    pricing: {
      hourlyRate: 100,
      rate12Hour: 1000,
      rate24Hour: 1800,
      minRentalHours: 1,
      securityDeposit: 2000
    }
  };

  // --- SECTION 1: HOURLY DURATION VALIDATION (VALID VALUES) ---
  await test('Hourly plan: 1 hour duration is valid', async () => {
    const payload = {
      vehicleId: mockVehicle._id,
      rentalPlan: RENTAL_PLANS.HOURLY,
      startDateTime: startTimeIso,
      endDateTime: getEndTime(1),
      duration: 1
    };
    const parsed = checkAvailabilitySchema.body.parse(payload);
    assert.equal(parsed.duration, 1);
  });

  await test('Hourly plan: 2 hours duration is valid', async () => {
    const payload = {
      vehicleId: mockVehicle._id,
      rentalPlan: RENTAL_PLANS.HOURLY,
      startDateTime: startTimeIso,
      endDateTime: getEndTime(2),
      duration: 2
    };
    const parsed = checkAvailabilitySchema.body.parse(payload);
    assert.equal(parsed.duration, 2);
  });

  await test('Hourly plan: 6 hours duration is valid', async () => {
    const payload = {
      vehicleId: mockVehicle._id,
      rentalPlan: RENTAL_PLANS.HOURLY,
      startDateTime: startTimeIso,
      endDateTime: getEndTime(6),
      duration: 6
    };
    const parsed = checkAvailabilitySchema.body.parse(payload);
    assert.equal(parsed.duration, 6);
  });

  await test('Hourly plan: 12 hours duration is valid', async () => {
    const payload = {
      vehicleId: mockVehicle._id,
      rentalPlan: RENTAL_PLANS.HOURLY,
      startDateTime: startTimeIso,
      endDateTime: getEndTime(12),
      duration: 12
    };
    const parsed = checkAvailabilitySchema.body.parse(payload);
    assert.equal(parsed.duration, 12);
  });

  await test('Hourly plan: 24 hours duration is valid (max boundary)', async () => {
    const payload = {
      vehicleId: mockVehicle._id,
      rentalPlan: RENTAL_PLANS.HOURLY,
      startDateTime: startTimeIso,
      endDateTime: getEndTime(24),
      duration: 24
    };
    const parsed = checkAvailabilitySchema.body.parse(payload);
    assert.equal(parsed.duration, 24);
  });

  // --- SECTION 2: HOURLY DURATION VALIDATION (INVALID VALUES) ---
  await test('Hourly plan: 0 hours duration is rejected', async () => {
    let threw = false;
    try {
      checkAvailabilitySchema.body.parse({
        vehicleId: mockVehicle._id,
        rentalPlan: RENTAL_PLANS.HOURLY,
        startDateTime: startTimeIso,
        endDateTime: startTimeIso,
        duration: 0
      });
    } catch {
      threw = true;
    }
    assert.equal(threw, true);
  });

  await test('Hourly plan: negative duration (-2 hours) is rejected', async () => {
    let threw = false;
    try {
      checkAvailabilitySchema.body.parse({
        vehicleId: mockVehicle._id,
        rentalPlan: RENTAL_PLANS.HOURLY,
        startDateTime: startTimeIso,
        endDateTime: getEndTime(-2),
        duration: -2
      });
    } catch {
      threw = true;
    }
    assert.equal(threw, true);
  });

  await test('Hourly plan: decimal/fractional duration (2.5 hours) is rejected', async () => {
    let threw = false;
    try {
      checkAvailabilitySchema.body.parse({
        vehicleId: mockVehicle._id,
        rentalPlan: RENTAL_PLANS.HOURLY,
        startDateTime: startTimeIso,
        endDateTime: new Date(baseStartTime.getTime() + 2.5 * 3600000).toISOString(),
        duration: 2.5
      });
    } catch {
      threw = true;
    }
    assert.equal(threw, true);
  });

  await test('Hourly plan: non-numeric/string input is rejected', async () => {
    let threw = false;
    try {
      checkAvailabilitySchema.body.parse({
        vehicleId: mockVehicle._id,
        rentalPlan: RENTAL_PLANS.HOURLY,
        startDateTime: startTimeIso,
        endDateTime: getEndTime(4),
        duration: 'abc'
      });
    } catch {
      threw = true;
    }
    assert.equal(threw, true);
  });

  await test('Hourly plan: very large duration (>24 hours) is rejected', async () => {
    let threw = false;
    try {
      checkAvailabilitySchema.body.parse({
        vehicleId: mockVehicle._id,
        rentalPlan: RENTAL_PLANS.HOURLY,
        startDateTime: startTimeIso,
        endDateTime: getEndTime(30),
        duration: 30
      });
    } catch {
      threw = true;
    }
    assert.equal(threw, true);
  });

  // --- SECTION 3: 12-HOUR & 24-HOUR FIXED PLANS INTEGRITY ---
  await test('12-Hour plan: exactly 12 hours is accepted', async () => {
    const payload = {
      vehicleId: mockVehicle._id,
      rentalPlan: RENTAL_PLANS.TWELVE_HOURS,
      startDateTime: startTimeIso,
      endDateTime: getEndTime(12),
      duration: 12
    };
    const parsed = checkAvailabilitySchema.body.parse(payload);
    assert.equal(parsed.duration, 12);
  });

  await test('12-Hour plan: non-12 hour duration (e.g. 3 hours) is strictly rejected', async () => {
    let threw = false;
    try {
      checkAvailabilitySchema.body.parse({
        vehicleId: mockVehicle._id,
        rentalPlan: RENTAL_PLANS.TWELVE_HOURS,
        startDateTime: startTimeIso,
        endDateTime: getEndTime(3),
        duration: 3
      });
    } catch (err) {
      threw = true;
      assert(err.errors.some(e => e.message.includes('12-Hour rental plan requires a duration of exactly 12 hours')));
    }
    assert.equal(threw, true);
  });

  await test('24-Hour plan: exactly 24 hours is accepted', async () => {
    const payload = {
      vehicleId: mockVehicle._id,
      rentalPlan: RENTAL_PLANS.TWENTY_FOUR_HOURS,
      startDateTime: startTimeIso,
      endDateTime: getEndTime(24),
      duration: 24
    };
    const parsed = checkAvailabilitySchema.body.parse(payload);
    assert.equal(parsed.duration, 24);
  });

  await test('24-Hour plan: non-24 hour duration (e.g. 10 hours) is strictly rejected', async () => {
    let threw = false;
    try {
      checkAvailabilitySchema.body.parse({
        vehicleId: mockVehicle._id,
        rentalPlan: RENTAL_PLANS.TWENTY_FOUR_HOURS,
        startDateTime: startTimeIso,
        endDateTime: getEndTime(10),
        duration: 10
      });
    } catch (err) {
      threw = true;
      assert(err.errors.some(e => e.message.includes('24-Hour rental plan requires a duration of exactly 24 hours')));
    }
    assert.equal(threw, true);
  });

  await test('Security: Duration mismatch between explicit duration & interval is rejected', async () => {
    let threw = false;
    try {
      checkAvailabilitySchema.body.parse({
        vehicleId: mockVehicle._id,
        rentalPlan: RENTAL_PLANS.HOURLY,
        startDateTime: startTimeIso,
        endDateTime: getEndTime(6), // Interval is 6h
        duration: 10 // But payload claims 10h
      });
    } catch (err) {
      threw = true;
      assert(err.errors.some(e => e.message.includes('does not match the time difference')));
    }
    assert.equal(threw, true);
  });

  // --- SECTION 4: PRICING SERVICE DYNAMIC RECALCULATION ---
  await test('Pricing Service: Hourly 6h calculates basePrice = 6 * 100 = ₹600', async () => {
    const { priceBreakdown, durationHours } = await PricingService.calculatePriceBreakdown({
      vehicle: mockVehicle,
      rentalPlan: RENTAL_PLANS.HOURLY,
      startDateTime: startTimeIso,
      endDateTime: getEndTime(6),
      fleetUtilization: 0.50
    });
    assert.equal(durationHours, 6);
    assert.equal(priceBreakdown.basePrice, 600);
  });

  await test('Pricing Service: Hourly 10h calculates basePrice = 10 * 100 = ₹1000', async () => {
    const { priceBreakdown, durationHours } = await PricingService.calculatePriceBreakdown({
      vehicle: mockVehicle,
      rentalPlan: RENTAL_PLANS.HOURLY,
      startDateTime: startTimeIso,
      endDateTime: getEndTime(10),
      fleetUtilization: 0.50
    });
    assert.equal(durationHours, 10);
    assert.equal(priceBreakdown.basePrice, 1000);
  });

  await test('Pricing Service: 12-Hour plan returns fixed rate12Hour = ₹1000', async () => {
    const { priceBreakdown, durationHours } = await PricingService.calculatePriceBreakdown({
      vehicle: mockVehicle,
      rentalPlan: RENTAL_PLANS.TWELVE_HOURS,
      startDateTime: startTimeIso,
      endDateTime: getEndTime(12),
      fleetUtilization: 0.50
    });
    assert.equal(durationHours, 12);
    assert.equal(priceBreakdown.basePrice, 1000);
  });

  await test('Pricing Service: 24-Hour plan returns fixed rate24Hour = ₹1800', async () => {
    const { priceBreakdown, durationHours } = await PricingService.calculatePriceBreakdown({
      vehicle: mockVehicle,
      rentalPlan: RENTAL_PLANS.TWENTY_FOUR_HOURS,
      startDateTime: startTimeIso,
      endDateTime: getEndTime(24),
      fleetUtilization: 0.50
    });
    assert.equal(durationHours, 24);
    assert.equal(priceBreakdown.basePrice, 1800);
  });

  await test('Pricing Service Zero Trust: rejects 12-Hour plan if duration is not 12', async () => {
    let threw = false;
    try {
      await PricingService.calculatePriceBreakdown({
        vehicle: mockVehicle,
        rentalPlan: RENTAL_PLANS.TWELVE_HOURS,
        startDateTime: startTimeIso,
        endDateTime: getEndTime(4),
        fleetUtilization: 0.50
      });
    } catch (err) {
      threw = true;
      assert(err.message.includes('12-Hour rental plan requires a duration of exactly 12 hours'));
    }
    assert.equal(threw, true);
  });

  console.log('\n====================================================');
  console.log(`  ALL ${passed}/${total} DURATION FLOW TESTS PASSED!`);
  console.log('====================================================\n');
}

runDurationVerificationTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
