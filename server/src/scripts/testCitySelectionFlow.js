/**
 * RentRide City Selection & Listing Flow Automated Verification Suite
 */

const BASE_URL = 'http://localhost:5000/api';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

async function runTest(testName, testFn) {
  try {
    await testFn();
    console.log(`  ✅ [PASS] ${testName}`);
    return true;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${testName}:`, err.message);
    return false;
  }
}

console.log('\n===============================================================');
console.log('🚀 RUNNING CITY SELECTION & AUTOCOMPLETE FLOW VERIFICATION');
console.log('===============================================================\n');

let passedTests = 0;
let totalTests = 0;

async function executeSuite() {
  let vendorToken = '';
  let categoryId = '';

  // -------------------------------------------------------------
  // SUITE 1: VENDOR LOGIN & CATEGORY FETCH
  // -------------------------------------------------------------
  console.log('🔑 TEST SUITE 1: Vendor Authentication & Metadata');

  totalTests++;
  if (await runTest('Vendor logs in successfully', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'vendor1@rentride.in', password: 'Vendor@123' })
    });
    const data = await res.json();
    assert(res.status === 200, 'Vendor login should succeed');
    assert(!!data.data?.token, 'JWT Token required');
    vendorToken = data.data.token;
  })) passedTests++;

  totalTests++;
  if (await runTest('Fetches category ID for vehicle creation', async () => {
    const res = await fetch(`${BASE_URL}/categories`);
    const data = await res.json();
    assert(res.status === 200, 'Category fetch should succeed');
    assert(data.data.categories?.length > 0, 'Must have at least one category');
    categoryId = data.data.categories[0]._id;
  })) passedTests++;

  // -------------------------------------------------------------
  // SUITE 2: VENDOR REGISTRATION WITH CITY AUTOCOMPLETE SELECTION
  // -------------------------------------------------------------
  console.log('\n🏙️ TEST SUITE 2: Vendor Registration with Supported City (Indore/Bhopal/Gwalior)');

  const testEmail = `vendor_mp_${Date.now()}@rentride.in`;

  totalTests++;
  if (await runTest('Registers new vendor with city = Indore', async () => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Indore Fleet Owner',
        email: testEmail,
        password: 'Password@123',
        role: 'vendor',
        businessName: 'Rajwada Super Wheels',
        city: 'Indore',
        phone: '+919876500111'
      })
    });
    const data = await res.json();
    assert(res.status === 201, `Expected 201, got ${res.status}: ${data.message}`);
    assert(data.data.user.role === 'vendor', 'User must be vendor');
    assert(data.data.user.vendorProfile?.address?.city === 'Indore', 'City must be saved as Indore');
  })) passedTests++;

  // -------------------------------------------------------------
  // SUITE 3: VENDOR PROFILE CITY UPDATE (BHOPAL / GWALIOR)
  // -------------------------------------------------------------
  console.log('\n📝 TEST SUITE 3: Update Operating Hub City in Profile');

  totalTests++;
  if (await runTest('Updates vendor operating city to Bhopal', async () => {
    const res = await fetch(`${BASE_URL}/users/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${vendorToken}`
      },
      body: JSON.stringify({
        city: 'Bhopal',
        businessName: 'Lake City Express Rentals'
      })
    });
    const data = await res.json();
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(data.data.user.vendorProfile?.address?.city === 'Bhopal', 'City should be updated to Bhopal');
  })) passedTests++;

  totalTests++;
  if (await runTest('Updates vendor operating city to Gwalior', async () => {
    const res = await fetch(`${BASE_URL}/users/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${vendorToken}`
      },
      body: JSON.stringify({
        city: 'Gwalior',
        businessName: 'Fort City Rides'
      })
    });
    const data = await res.json();
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(data.data.user.vendorProfile?.address?.city === 'Gwalior', 'City should be updated to Gwalior');
  })) passedTests++;

  // -------------------------------------------------------------
  // SUITE 4: VEHICLE SEARCH BY CITY (INDORE, BHOPAL, GWALIOR)
  // -------------------------------------------------------------
  console.log('\n🔍 TEST SUITE 4: Vehicle Inventory Filtering by City');

  totalTests++;
  if (await runTest('Queries vehicle search endpoint with city filter', async () => {
    const res = await fetch(`${BASE_URL}/vehicles?city=Indore&plan=HOURLY`);
    const data = await res.json();
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(data.success === true, 'Search response must succeed');
  })) passedTests++;

  // -------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------
  console.log('\n===============================================================');
  console.log(`🎉 TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED CLEANLY (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log('===============================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

executeSuite().catch((err) => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
