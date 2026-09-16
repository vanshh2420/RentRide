import { connectDB } from '../config/db.js';
import { Vehicle } from '../models/vehicle.model.js';
import { User } from '../models/user.model.js';
import { Booking } from '../models/booking.model.js';
import VehicleCatalog from '../models/catalog.model.js';

async function testBookingRegression() {
  await connectDB();
  console.log('=== SECTION 14: CATALOG-LINKED VEHICLE BOOKING REGRESSION ===\n');

  // Find Thar
  const vehicle = await Vehicle.findOne({ registrationNumber: 'MP09TH4004' }).populate('catalogId').lean();
  console.log(`Target Vehicle: ${vehicle.brand} ${vehicle.model} [${vehicle.registrationNumber}]`);
  console.log(`Catalog Linked: ${vehicle.catalogId?.catalogKey} (ID: ${vehicle.catalogId?._id})`);

  const customer = await User.findOne({ role: 'customer' });

  // 1. Availability check
  const startDate = new Date(Date.now() + 86400000 * 5); // 5 days from now
  const endDate = new Date(startDate.getTime() + 3600000 * 4); // 4 hours

  const availRes = await fetch('http://localhost:5000/api/bookings/check-availability', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vehicleId: vehicle._id.toString(),
      rentalPlan: 'HOURLY',
      startDateTime: startDate.toISOString(),
      endDateTime: endDate.toISOString()
    })
  });
  const availData = await availRes.json();
  console.log('[1] Check Availability HTTP:', availRes.status, 'Available:', availData.data?.isAvailable);
  console.log('    Pricing breakdown:', availData.data?.pricingBreakdown);

  // Register or login a test customer
  const testEmail = `cust_${Date.now()}@rentride.com`;
  const regRes = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Audit Customer',
      email: testEmail,
      password: 'Password@123',
      phone: '9876543210',
      role: 'customer'
    })
  });
  const regData = await regRes.json();
  const token = regData.data?.token;

  if (!token) {
    console.log('Could not register test customer token:', regData.message);
    process.exit(0);
  }

  // Create booking
  const createRes = await fetch('http://localhost:5000/api/bookings/online', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      vehicleId: vehicle._id.toString(),
      rentalPlan: 'HOURLY',
      startDateTime: startDate.toISOString(),
      endDateTime: endDate.toISOString()
    })
  });
  const createData = await createRes.json();
  console.log('[2] Create Booking HTTP:', createRes.status, 'Booking Number:', createData.data?.booking?.bookingNumber);
  console.log('    Status:', createData.data?.booking?.status, 'Lock active until:', createData.data?.booking?.paymentLockExpiresAt);

  // Check collision with the locked slot
  const collisionRes = await fetch('http://localhost:5000/api/bookings/check-availability', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vehicleId: vehicle._id.toString(),
      rentalPlan: 'HOURLY',
      startDateTime: startDate.toISOString(),
      endDateTime: endDate.toISOString()
    })
  });
  const collisionData = await collisionRes.json();
  console.log('[3] Conflict Availability (During Lock): Available =', collisionData.data?.isAvailable);
  console.log('    Conflict reason:', collisionData.data?.reason || collisionData.message);

  // Clean up the temporary test booking so physical vehicle stays clean
  if (createData.data?.booking?._id) {
    await Booking.findByIdAndDelete(createData.data.booking._id);
    console.log('[4] Cleaned up temporary test booking from database.');
  }

  process.exit(0);
}

testBookingRegression().catch(console.error);
