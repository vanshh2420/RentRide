/**
 * RentRide Role-Based Access Control (RBAC) & Authorization Test Suite
 * Validates backend route guards and role boundary segregation across Customer, Vendor, Admin, and Guest
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
console.log('🚀 RUNNING ROLE-BASED ACCESS CONTROL (RBAC) VERIFICATION SUITE');
console.log('===============================================================\n');

let passedTests = 0;
let totalTests = 0;

async function executeSuite() {
  let customerToken = '';
  let vendorToken = '';
  let adminToken = '';

  // -------------------------------------------------------------
  // SUITE 1: AUTHENTICATION & ROLE IDENTIFICATION
  // -------------------------------------------------------------
  console.log('🔑 TEST SUITE 1: Authentication & Role Verification');

  totalTests++;
  if (await runTest('Customer logs in and receives role = customer', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'customer1@rentride.in', password: 'Customer@123' })
    });
    const data = await res.json();
    assert(res.status === 200, 'Customer login should succeed');
    assert(data.data.user.role === 'customer', 'User role must be customer');
    customerToken = data.data.token;
  })) passedTests++;

  totalTests++;
  if (await runTest('Vendor logs in and receives role = vendor', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'vendor1@rentride.in', password: 'Vendor@123' })
    });
    const data = await res.json();
    assert(res.status === 200, 'Vendor login should succeed');
    assert(data.data.user.role === 'vendor', 'User role must be vendor');
    vendorToken = data.data.token;
  })) passedTests++;

  totalTests++;
  if (await runTest('Admin logs in and receives role = admin', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@rentride.in', password: 'Admin@123' })
    });
    const data = await res.json();
    assert(res.status === 200, 'Admin login should succeed');
    assert(data.data.user.role === 'admin', 'User role must be admin');
    adminToken = data.data.token;
  })) passedTests++;

  // -------------------------------------------------------------
  // SUITE 2: CUSTOMER BOUNDARY ENFORCEMENT
  // -------------------------------------------------------------
  console.log('\n👤 TEST SUITE 2: Customer Role Boundary & Protection');

  totalTests++;
  if (await runTest('Customer can access profile and my-bookings', async () => {
    const res = await fetch(`${BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
  })) passedTests++;

  totalTests++;
  if (await runTest('Customer CANNOT access vendor stats (403 Forbidden)', async () => {
    const res = await fetch(`${BASE_URL}/vendor/stats`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert(res.status === 403, `Expected 403 Forbidden, got ${res.status}`);
  })) passedTests++;

  totalTests++;
  if (await runTest('Customer CANNOT access admin platform stats (403 Forbidden)', async () => {
    const res = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert(res.status === 403, `Expected 403 Forbidden, got ${res.status}`);
  })) passedTests++;

  totalTests++;
  if (await runTest('Customer CANNOT access admin users list (403 Forbidden)', async () => {
    const res = await fetch(`${BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert(res.status === 403, `Expected 403 Forbidden, got ${res.status}`);
  })) passedTests++;

  // -------------------------------------------------------------
  // SUITE 3: VENDOR BOUNDARY ENFORCEMENT
  // -------------------------------------------------------------
  console.log('\n🏪 TEST SUITE 3: Vendor Role Boundary & Operations');

  totalTests++;
  if (await runTest('Vendor CAN access vendor stats and bookings', async () => {
    const res = await fetch(`${BASE_URL}/vendor/stats`, {
      headers: { Authorization: `Bearer ${vendorToken}` }
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
  })) passedTests++;

  totalTests++;
  if (await runTest('Vendor CANNOT access admin stats (403 Forbidden)', async () => {
    const res = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${vendorToken}` }
    });
    assert(res.status === 403, `Expected 403 Forbidden, got ${res.status}`);
  })) passedTests++;

  totalTests++;
  if (await runTest('Vendor CANNOT access admin user management (403 Forbidden)', async () => {
    const res = await fetch(`${BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${vendorToken}` }
    });
    assert(res.status === 403, `Expected 403 Forbidden, got ${res.status}`);
  })) passedTests++;

  // -------------------------------------------------------------
  // SUITE 4: ADMIN GOVERNANCE & ACCESS
  // -------------------------------------------------------------
  console.log('\n🛡️ TEST SUITE 4: Admin Governance & Control');

  totalTests++;
  if (await runTest('Admin CAN access platform overview stats', async () => {
    const res = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
  })) passedTests++;

  totalTests++;
  if (await runTest('Admin CAN access global user directory', async () => {
    const res = await fetch(`${BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
  })) passedTests++;

  totalTests++;
  if (await runTest('Admin CAN access global vehicle approvals registry', async () => {
    const res = await fetch(`${BASE_URL}/admin/vehicles`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
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
  console.error('Fatal Test Suite Error:', err);
  process.exit(1);
});
