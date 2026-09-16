/**
 * RentRide User Profile Management Verification Suite
 * Tests Profile View, Update, Email Uniqueness, Password Security, and Role Guard
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
console.log('🚀 RUNNING USER PROFILE MANAGEMENT TEST SUITE');
console.log('===============================================================\n');

let passedTests = 0;
let totalTests = 0;

async function executeSuite() {
  let customerToken = '';
  let adminToken = '';

  // -------------------------------------------------------------
  // SUITE 1: AUTHENTICATION & LOGIN FOR TESTING
  // -------------------------------------------------------------
  console.log('🔑 TEST SUITE 1: Authentication & Token Acquisition');

  totalTests++;
  if (await runTest('Logs in customer to get valid JWT token', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'customer1@rentride.in', password: 'Customer@123' })
    });
    const data = await res.json();
    assert(data.success === true, 'Login should succeed');
    assert(!!data.data?.token, 'JWT Token must be returned');
    customerToken = data.data.token;
  })) passedTests++;

  totalTests++;
  if (await runTest('Logs in admin to get valid admin token', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@rentride.in', password: 'Admin@123' })
    });
    const data = await res.json();
    assert(data.success === true, 'Admin login should succeed');
    assert(!!data.data?.token, 'Admin JWT Token must be returned');
    adminToken = data.data.token;
  })) passedTests++;

  // -------------------------------------------------------------
  // SUITE 2: SECURITY & UNPROTECTED ACCESS GUARDS
  // -------------------------------------------------------------
  console.log('\n🛡️ TEST SUITE 2: Security & Unauthenticated Guards');

  totalTests++;
  if (await runTest('Rejects unauthenticated GET /api/users/profile (401)', async () => {
    const res = await fetch(`${BASE_URL}/users/profile`);
    const data = await res.json();
    assert(res.status === 401, `Expected status 401, got ${res.status}`);
    assert(data.success === false, 'Should not allow unauthenticated access');
  })) passedTests++;

  totalTests++;
  if (await runTest('Rejects unauthenticated PATCH /api/users/profile (401)', async () => {
    const res = await fetch(`${BASE_URL}/users/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Hacker' })
    });
    assert(res.status === 401, `Expected status 401, got ${res.status}`);
  })) passedTests++;

  totalTests++;
  if (await runTest('Rejects unauthenticated PATCH /api/users/change-password (401)', async () => {
    const res = await fetch(`${BASE_URL}/users/change-password`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: 'test', newPassword: 'newPassword123' })
    });
    assert(res.status === 401, `Expected status 401, got ${res.status}`);
  })) passedTests++;

  // -------------------------------------------------------------
  // SUITE 3: VIEW & UPDATE PROFILE INFORMATION
  // -------------------------------------------------------------
  console.log('\n👤 TEST SUITE 3: View & Update Profile');

  totalTests++;
  if (await runTest('Fetches authenticated user profile without exposing password', async () => {
    const res = await fetch(`${BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const data = await res.json();
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(data.data.user.email === 'customer1@rentride.in', 'Should match authenticated user email');
    assert(data.data.user.password === undefined, 'Password must never be exposed');
  })) passedTests++;

  totalTests++;
  if (await runTest('Updates name and phone number successfully', async () => {
    const res = await fetch(`${BASE_URL}/users/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        name: 'Vansh Sharma',
        phone: '+919876543210',
        drivingLicenseNumber: 'KA0320230009999'
      })
    });
    const data = await res.json();
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(data.data.user.name === 'Vansh Sharma', 'Name should be updated');
    assert(data.data.user.phone === '+919876543210', 'Phone should be updated');
  })) passedTests++;

  totalTests++;
  if (await runTest('Prevents role privilege escalation via profile update', async () => {
    const res = await fetch(`${BASE_URL}/users/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        role: 'admin'
      })
    });
    const data = await res.json();
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(data.data.user.role === 'customer', 'Role must remain customer!');
  })) passedTests++;

  // -------------------------------------------------------------
  // SUITE 4: EMAIL CHANGE & DUPLICATE PREVENTION
  // -------------------------------------------------------------
  console.log('\n📧 TEST SUITE 4: Email Change & Unique Constraint');

  totalTests++;
  if (await runTest('Rejects email update to an already registered email (409 Conflict)', async () => {
    const res = await fetch(`${BASE_URL}/users/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        email: 'admin@rentride.in'
      })
    });
    const data = await res.json();
    assert(res.status === 409, `Expected 409 Conflict, got ${res.status}`);
    assert(data.success === false, 'Duplicate email must be rejected');
  })) passedTests++;

  // -------------------------------------------------------------
  // SUITE 5: CHANGE PASSWORD SECURITY
  // -------------------------------------------------------------
  console.log('\n🔒 TEST SUITE 5: Secure Password Change');

  totalTests++;
  if (await runTest('Rejects password change with incorrect current password (400)', async () => {
    const res = await fetch(`${BASE_URL}/users/change-password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        currentPassword: 'WrongPassword@999',
        newPassword: 'BrandNewPassword@123',
        confirmPassword: 'BrandNewPassword@123'
      })
    });
    const data = await res.json();
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  })) passedTests++;

  totalTests++;
  if (await runTest('Rejects password change when confirmPassword does not match (400)', async () => {
    const res = await fetch(`${BASE_URL}/users/change-password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        currentPassword: 'Customer@123',
        newPassword: 'BrandNewPassword@123',
        confirmPassword: 'MismatchedPassword@999'
      })
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  })) passedTests++;

  totalTests++;
  if (await runTest('Successfully updates password and validates new login credentials', async () => {
    // 1. Change password to NewPassword@2026
    const res = await fetch(`${BASE_URL}/users/change-password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        currentPassword: 'Customer@123',
        newPassword: 'NewPassword@2026',
        confirmPassword: 'NewPassword@2026'
      })
    });
    const data = await res.json();
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(data.success === true, 'Password change must succeed');

    // 2. Verify old password fails
    const oldLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'customer1@rentride.in', password: 'Customer@123' })
    });
    assert(oldLoginRes.status === 401, 'Old password must no longer work');

    // 3. Verify new password succeeds
    const newLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'customer1@rentride.in', password: 'NewPassword@2026' })
    });
    const newLoginData = await newLoginRes.json();
    assert(newLoginRes.status === 200, 'New password must log in successfully');

    // 4. Restore original password for demo account stability
    const restoreRes = await fetch(`${BASE_URL}/users/change-password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newLoginData.data.token}`
      },
      body: JSON.stringify({
        currentPassword: 'NewPassword@2026',
        newPassword: 'Customer@123',
        confirmPassword: 'Customer@123'
      })
    });
    assert(restoreRes.status === 200, 'Password should be restored cleanly');
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
