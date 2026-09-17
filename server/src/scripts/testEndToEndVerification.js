import mongoose from 'mongoose';
import { ENV } from '../config/env.js';

const BASE_URL = `http://localhost:${ENV.PORT}/api`;

async function run() {
  console.log('===============================================================');
  console.log('🚀 RENTRIDE COMPLETE END-TO-END VERIFICATION SUITE');
  console.log('===============================================================\n');

  let passed = 0;
  let total = 0;

  async function check(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}:`, err.message);
    }
  }

  let customerToken = '';
  let customerUser = null;
  let vendorToken = '';
  let vendorUser = null;
  let adminToken = '';
  let testVehicle = null;

  // 1. Database & Server Health
  await check('1. Server Health Check returns 200 UP', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const status = data.data?.status || data.status;
    if (status !== 'UP') {
      throw new Error(`Unexpected health status: ${JSON.stringify(data)}`);
    }
  });

  // 2. Authentication & Persistence
  const testEmail = `verify_${Date.now()}@rentride.in`;
  const testPassword = 'Password@123';

  await check('2. Customer Registration creates persistent user', async () => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'End-to-End Tester',
        email: testEmail,
        password: testPassword,
        phone: '+919999888877',
        role: 'customer'
      })
    });
    const json = await res.json();
    if (!res.ok || !json.data?.token) throw new Error(json.message || `HTTP ${res.status}`);
    customerToken = json.data.token;
    customerUser = json.data.user;
  });

  await check('3. Customer Logout clears cookie', async () => {
    const res = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  });

  await check('4. Customer can log in again with same credentials', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword })
    });
    const json = await res.json();
    if (!res.ok || !json.data?.token) throw new Error(json.message || `HTTP ${res.status}`);
    customerToken = json.data.token;
    customerUser = json.data.user;
  });

  // Log in existing Vendor & Admin
  await check('5. Vendor and Admin login succeeds', async () => {
    const vRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'vendor1@rentride.in', password: 'Vendor@123' })
    });
    const vJson = await vRes.json();
    if (!vRes.ok) throw new Error(vJson.message || 'Vendor login failed');
    vendorToken = vJson.data.token;
    vendorUser = vJson.data.user;

    const aRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@rentride.in', password: 'Admin@123' })
    });
    const aJson = await aRes.json();
    if (!aRes.ok) throw new Error(aJson.message || 'Admin login failed');
    adminToken = aJson.data.token;
  });

  // 3. Vehicle Visibility & Contract
  await check('6. GET /api/vehicles returns active fleet with totalPages and pages', async () => {
    const res = await fetch(`${BASE_URL}/vehicles`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
    const vehicles = json.data?.vehicles;
    const pagination = json.data?.pagination;
    if (!vehicles || vehicles.length === 0) throw new Error('No vehicles returned');
    if (!pagination?.totalPages || !pagination?.pages) {
      throw new Error(`Pagination missing totalPages or pages: ${JSON.stringify(pagination)}`);
    }
    testVehicle = vehicles[0];
  });

  await check('7. Vehicle has fuelEconomy and valid fuelEconomyUnit', async () => {
    if (!testVehicle) throw new Error('No vehicle to inspect');
    if (testVehicle.fuelEconomy === undefined || testVehicle.fuelEconomy === null) {
      throw new Error('Vehicle fuelEconomy is undefined or null');
    }
    const validUnits = ['km/l', 'km/kg', 'km/charge', 'km/kWh'];
    if (!validUnits.includes(testVehicle.fuelEconomyUnit)) {
      throw new Error(`Invalid fuelEconomyUnit: ${testVehicle.fuelEconomyUnit}`);
    }
  });

  await check('8. Vehicle search filters by city and fuelType correctly', async () => {
    const res = await fetch(`${BASE_URL}/vehicles?city=Indore&fuelType=petrol`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
    const vehicles = json.data?.vehicles;
    if (!vehicles || vehicles.length === 0) throw new Error('No petrol vehicles found in Indore');
    for (const v of vehicles) {
      if (v.fuelType !== 'petrol') throw new Error(`Vehicle ${v.model} has wrong fuelType: ${v.fuelType}`);
      if (!v.location?.city?.toLowerCase().includes('indore')) {
        throw new Error(`Vehicle ${v.model} has wrong city: ${v.location?.city}`);
      }
    }
  });

  // 4. Booking & Availability Engine
  let createdBookingId = null;
  const bookingOffsetHours = 50 + Math.floor(Math.random() * 200);
  const futureStart = new Date(Date.now() + bookingOffsetHours * 60 * 60 * 1000).toISOString();
  const futureEnd = new Date(Date.now() + (bookingOffsetHours + 4) * 60 * 60 * 1000).toISOString();

  await check('9. POST /api/bookings/check-availability reports slot AVAILABLE', async () => {
    const res = await fetch(`${BASE_URL}/bookings/check-availability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
      body: JSON.stringify({
        vehicleId: testVehicle._id,
        rentalPlan: 'HOURLY',
        startDateTime: futureStart,
        endDateTime: futureEnd
      })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
    if (json.data?.available !== true) throw new Error(`Slot not available: ${json.data?.reason}`);
  });

  await check('10. POST /api/bookings/online creates booking with PENDING_PAYMENT and 10-min lock', async () => {
    const res = await fetch(`${BASE_URL}/bookings/online`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
      body: JSON.stringify({
        vehicleId: testVehicle._id,
        rentalPlan: 'HOURLY',
        startDateTime: futureStart,
        endDateTime: futureEnd
      })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
    const booking = json.data?.booking;
    if (!booking?._id) throw new Error('Booking ID missing');
    if (booking.status !== 'PENDING_PAYMENT') throw new Error(`Unexpected status: ${booking.status}`);
    if (!booking.lockExpiresAt) throw new Error('lockExpiresAt missing');
    createdBookingId = booking._id;
  });

  // 5. Payment Security & Verification
  let orderData = null;
  await check('11. POST /api/payments/razorpay/create-order generates verified order payload', async () => {
    const res = await fetch(`${BASE_URL}/payments/razorpay/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
      body: JSON.stringify({ bookingId: createdBookingId })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
    orderData = json.data;
    if (!orderData?.orderId || !orderData?.amount) throw new Error('Order creation missing fields');
  });

  await check('12. POST /api/payments/razorpay/verify confirms booking and clears lock', async () => {
    const res = await fetch(`${BASE_URL}/payments/razorpay/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
      body: JSON.stringify({
        bookingId: createdBookingId,
        razorpay_order_id: orderData.orderId,
        razorpay_payment_id: `pay_${Date.now()}`,
        razorpay_signature: `simulated_sig_${Date.now()}`
      })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
    if (json.data?.booking?.status !== 'CONFIRMED') {
      throw new Error(`Booking status not CONFIRMED: ${json.data?.booking?.status}`);
    }
  });

  await check('13. POST /api/payments/razorpay/verify is idempotent (duplicate verification safe)', async () => {
    const res = await fetch(`${BASE_URL}/payments/razorpay/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
      body: JSON.stringify({
        bookingId: createdBookingId,
        razorpay_order_id: orderData.orderId,
        razorpay_payment_id: `pay_duplicate_${Date.now()}`,
        razorpay_signature: `simulated_sig_${Date.now()}`
      })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
    if (json.data?.isDuplicate !== true) {
      throw new Error('Expected isDuplicate to be true on second verification');
    }
  });

  // 5b. Cancellation & Refund Ledger
  await check('14. Booking cancellation calculates refund and updates Payment ledger', async () => {
    const res = await fetch(`${BASE_URL}/bookings/${createdBookingId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
      body: JSON.stringify({ reason: 'Personal schedule change' })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
    if (json.data?.booking?.status !== 'CANCELLED') {
      throw new Error(`Booking not marked CANCELLED: ${json.data?.booking?.status}`);
    }
  });

  // 6. Failed Payment Releases Booking Lock Immediately
  await check('15. POST /api/payments/razorpay/fail releases booking lock immediately', async () => {
    // Create a new booking with non-colliding time slot
    const failOffsetHours = 600 + Math.floor(Math.random() * 400);
    const start2 = new Date(Date.now() + failOffsetHours * 60 * 60 * 1000).toISOString();
    const end2 = new Date(Date.now() + (failOffsetHours + 4) * 60 * 60 * 1000).toISOString();
    const bRes = await fetch(`${BASE_URL}/bookings/online`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
      body: JSON.stringify({
        vehicleId: testVehicle._id,
        rentalPlan: 'HOURLY',
        startDateTime: start2,
        endDateTime: end2
      })
    });
    const bJson = await bRes.json();
    if (!bRes.ok) throw new Error(bJson.message || `HTTP ${bRes.status}`);
    const bId = bJson.data?.booking?._id;
    if (!bId) throw new Error('Booking creation failed in test 15');

    // Fail payment
    const fRes = await fetch(`${BASE_URL}/payments/razorpay/fail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
      body: JSON.stringify({ bookingId: bId, errorDescription: 'User cancelled payment popup' })
    });
    if (!fRes.ok) throw new Error(`HTTP ${fRes.status}`);

    // Verify slot is now available again immediately (no 10-minute blocking lock)
    const availRes = await fetch(`${BASE_URL}/bookings/check-availability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
      body: JSON.stringify({
        vehicleId: testVehicle._id,
        rentalPlan: 'HOURLY',
        startDateTime: start2,
        endDateTime: end2
      })
    });
    const availJson = await availRes.json();
    if (availJson.data?.available !== true) {
      throw new Error(`Slot remained blocked after payment failure: ${availJson.data?.reason}`);
    }
  });

  // 7. Vendor Walk-in / Offline Booking
  let offlineBookingId = null;
  await check('16. Vendor Walk-in Offline Booking persists customer details under offlineCustomer', async () => {
    const offsetHours = 300 + Math.floor(Math.random() * 200);
    const walkinStart = new Date(Date.now() + offsetHours * 60 * 60 * 1000).toISOString();
    const walkinEnd = new Date(Date.now() + (offsetHours + 4) * 60 * 60 * 1000).toISOString();

    const res = await fetch(`${BASE_URL}/vendor/bookings/offline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${vendorToken}` },
      body: JSON.stringify({
        vehicleId: testVehicle._id,
        rentalPlan: 'HOURLY',
        startDateTime: walkinStart,
        endDateTime: walkinEnd,
        offlineCustomer: {
          name: 'Walkin Customer Suresh',
          phone: '+919876543210',
          drivingLicenseNumber: 'MP092024009988',
          notes: 'Cash collected at Vijay Nagar counter'
        },
        paymentMethod: 'offline_cash',
        isPaymentCollected: true
      })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
    const booking = json.data?.booking;
    if (!booking?._id) throw new Error('Offline booking missing _id');
    offlineBookingId = booking._id;

    // Verify customer data persisted
    const cust = booking.offlineCustomer || booking.offlineCustomerDetails;
    if (!cust?.name || cust.name !== 'Walkin Customer Suresh') {
      throw new Error(`Customer name not persisted: ${JSON.stringify(cust)}`);
    }
    if (cust.drivingLicenseNumber !== 'MP092024009988') {
      throw new Error(`Driving license not persisted: ${cust.drivingLicenseNumber}`);
    }

    // Clean up test booking
    try {
      const { Booking } = await import('../models/booking.model.js');
      await Booking.findByIdAndDelete(offlineBookingId);
    } catch (e) {}
  });

  // 8. Vendor Maintenance Hub
  let maintenanceId = null;
  await check('17. Vendor Maintenance: create, fetch records, and complete maintenance', async () => {
    // 1. Fetch vendor maintenance records
    const listRes = await fetch(`${BASE_URL}/maintenance/vendor`, {
      headers: { 'Authorization': `Bearer ${vendorToken}` }
    });
    const listJson = await listRes.json();
    if (!listRes.ok) throw new Error(listJson.message || `HTTP ${listRes.status}`);

    // 2. Schedule maintenance
    const mOffset = 600 + Math.floor(Math.random() * 200);
    const mStart = new Date(Date.now() + mOffset * 60 * 60 * 1000).toISOString();
    const mEnd = new Date(Date.now() + (mOffset + 4) * 60 * 60 * 1000).toISOString();
    const createRes = await fetch(`${BASE_URL}/maintenance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${vendorToken}` },
      body: JSON.stringify({
        vehicleId: testVehicle._id,
        title: 'Routine Brake & Oil Inspection',
        serviceType: 'OIL_CHANGE',
        startDate: mStart,
        endDate: mEnd,
        estimatedCost: 1500,
        notes: 'Routine service inspection'
      })
    });
    const createJson = await createRes.json();
    if (!createRes.ok) throw new Error(createJson.message || `HTTP ${createRes.status}`);
    maintenanceId = createJson.data?.maintenance?._id;

    // 3. Complete maintenance
    const compRes = await fetch(`${BASE_URL}/maintenance/${maintenanceId}/complete`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${vendorToken}` },
      body: JSON.stringify({
        actualCost: 1450,
        serviceCenterName: 'Indore Prime Authorized Workshop',
        invoiceNumber: 'INV-2026-9901',
        notes: 'Oil and air filter replaced, vehicle inspected and clean.'
      })
    });
    const compJson = await compRes.json();
    if (!compRes.ok) throw new Error(compJson.message || `HTTP ${compRes.status}`);
    if (compJson.data?.maintenance?.status !== 'COMPLETED') {
      throw new Error(`Expected COMPLETED, got: ${compJson.data?.maintenance?.status}`);
    }

    // Clean up test maintenance
    try {
      const { Maintenance } = await import('../models/maintenance.model.js');
      await Maintenance.findByIdAndDelete(maintenanceId);
    } catch (e) {}
  });

  // 9. Vendor Stats & Earnings
  await check('18. GET /api/vendor/stats returns real fleet, booking, and financial KPIs', async () => {
    const res = await fetch(`${BASE_URL}/vendor/stats`, {
      headers: { 'Authorization': `Bearer ${vendorToken}` }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
    const stats = json.data;
    if (!stats?.fleetStats || !stats?.bookingStats || !stats?.financialStats) {
      throw new Error(`Missing KPI sections: ${JSON.stringify(stats)}`);
    }
    if (stats.fleetStats.totalFleet === undefined || stats.financialStats.grossRevenue === undefined) {
      throw new Error('Stat fields invalid');
    }
  });

  // 10. AI Demand Forecast & Assistant
  await check('19. AI Demand Forecast returns 7-day projections', async () => {
    const res = await fetch(`${BASE_URL}/ai/demand-forecast?city=Indore&category=all`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
    const forecast = json.data?.forecast;
    if (!forecast?.dailyForecasts && !forecast?.forecast) {
      throw new Error(`Missing daily forecast array: ${JSON.stringify(forecast)}`);
    }
  });

  await check('20. AI Assistant processes user query and returns reply with suggestions', async () => {
    const res = await fetch(`${BASE_URL}/ai/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Explain rental plans',
        userContext: { city: 'Indore' }
      })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
    const assistant = json.data;
    if (!assistant?.reply || !assistant?.suggestedActions) {
      throw new Error(`Invalid assistant response: ${JSON.stringify(assistant)}`);
    }
  });

  console.log('\n===============================================================');
  console.log(`🏁 VERIFICATION SUMMARY: ${passed}/${total} TESTS PASSED CLEANLY (${Math.round((passed/total)*100)}%)`);
  console.log('===============================================================\n');

  // Clean up test customer
  try {
    const { User } = await import('../models/user.model.js');
    await User.findOneAndDelete({ email: testEmail });
  } catch (e) {}

  process.exit(passed === total ? 0 : 1);
}

run().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
