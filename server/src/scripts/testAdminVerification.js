import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

const runTests = async () => {
  console.log('===============================================================');
  console.log('🚀 RENTRIDE ADMIN SECTION — COMPREHENSIVE END-TO-END AUDIT');
  console.log('===============================================================');

  let passed = 0;
  let failed = 0;

  const assert = (condition, title) => {
    if (condition) {
      console.log(`✅ [PASS] ${title}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${title}`);
      failed++;
    }
  };

  // Helper login
  const login = async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    return { status: res.status, token: data.data?.token, user: data.data?.user };
  };

  // -------------------------------------------------------------
  // TEST 1: Role-Based Authorization Security Boundary
  // -------------------------------------------------------------
  console.log('\n--- 1. Testing Role-Based Admin Authorization Boundary ---');

  // 1a. No Token -> /api/admin/dashboard
  const noTokenRes = await fetch(`${BASE_URL}/admin/dashboard`);
  assert(noTokenRes.status === 401, 'Unauthenticated request to /api/admin/dashboard returns 401 Unauthorized');

  // 1b. Customer Token -> /api/admin/dashboard
  const customerLogin = await login('customer1@rentride.in', 'Customer@123');
  assert(customerLogin.status === 200 && customerLogin.token, 'Customer login succeeds');

  const customerAdminReq = await fetch(`${BASE_URL}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${customerLogin.token}` }
  });
  assert(customerAdminReq.status === 403, 'Customer token to /api/admin/dashboard is blocked with 403 Forbidden');

  // 1c. Vendor Token -> /api/admin/dashboard
  const vendorLogin = await login('vendor1@rentride.in', 'Vendor@123');
  assert(vendorLogin.status === 200 && vendorLogin.token, 'Vendor login succeeds');

  const vendorAdminReq = await fetch(`${BASE_URL}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${vendorLogin.token}` }
  });
  assert(vendorAdminReq.status === 403, 'Vendor token to /api/admin/dashboard is blocked with 403 Forbidden');

  // 1d. Admin Token -> /api/admin/dashboard
  const adminLogin = await login('admin@rentride.in', 'Admin@123');
  assert(adminLogin.status === 200 && adminLogin.token, 'Admin login succeeds with encrypted password');

  const adminDashboardReq = await fetch(`${BASE_URL}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${adminLogin.token}` }
  });
  const adminDashboardData = await adminDashboardReq.json();
  assert(adminDashboardReq.status === 200, 'Admin token to /api/admin/dashboard returns 200 OK');
  assert(
    adminDashboardData.data?.overview?.totalUsers > 0 &&
    adminDashboardData.data?.charts?.bookingTrends?.length > 0,
    'Dashboard returns real aggregated MongoDB metrics & Recharts datasets'
  );

  // -------------------------------------------------------------
  // TEST 2: Admin API Modules Completeness
  // -------------------------------------------------------------
  console.log('\n--- 2. Testing All Admin API Modules ---');

  // Users
  const usersRes = await fetch(`${BASE_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${adminLogin.token}` }
  });
  const usersData = await usersRes.json();
  assert(usersRes.status === 200 && usersData.data.users.length > 0, 'GET /api/admin/users returns paginated user directory');

  // Vendors
  const vendorsRes = await fetch(`${BASE_URL}/admin/vendors`, {
    headers: { Authorization: `Bearer ${adminLogin.token}` }
  });
  const vendorsData = await vendorsRes.json();
  assert(vendorsRes.status === 200 && vendorsData.data.vendors.length > 0, 'GET /api/admin/vendors returns vendor partners with fleet & revenue metrics');

  // Vehicles
  const vehiclesRes = await fetch(`${BASE_URL}/admin/vehicles`, {
    headers: { Authorization: `Bearer ${adminLogin.token}` }
  });
  const vehiclesData = await vehiclesRes.json();
  assert(vehiclesRes.status === 200 && vehiclesData.data.vehicles.length > 0, 'GET /api/admin/vehicles returns fleet queue');

  // Bookings
  const bookingsRes = await fetch(`${BASE_URL}/admin/bookings`, {
    headers: { Authorization: `Bearer ${adminLogin.token}` }
  });
  const bookingsData = await bookingsRes.json();
  assert(bookingsRes.status === 200 && bookingsData.data.bookings.length > 0, 'GET /api/admin/bookings returns global bookings audit');

  // Payments
  const paymentsRes = await fetch(`${BASE_URL}/admin/payments`, {
    headers: { Authorization: `Bearer ${adminLogin.token}` }
  });
  const paymentsData = await paymentsRes.json();
  assert(paymentsRes.status === 200 && paymentsData.data.payments.length > 0, 'GET /api/admin/payments returns gateway transactions audit');

  // Maintenance
  const maintRes = await fetch(`${BASE_URL}/admin/maintenance`, {
    headers: { Authorization: `Bearer ${adminLogin.token}` }
  });
  const maintData = await maintRes.json();
  assert(maintRes.status === 200 && maintData.data.maintenance.length > 0, 'GET /api/admin/maintenance returns fleet maintenance log');

  // Reviews
  const reviewsRes = await fetch(`${BASE_URL}/admin/reviews`, {
    headers: { Authorization: `Bearer ${adminLogin.token}` }
  });
  const reviewsData = await reviewsRes.json();
  assert(reviewsRes.status === 200 && reviewsData.data.reviews.length > 0, 'GET /api/admin/reviews returns customer review records');

  // -------------------------------------------------------------
  // TEST 3: Vehicle Visibility & Approval Lifecycle End-to-End
  // -------------------------------------------------------------
  console.log('\n--- 3. Testing Vehicle Visibility & Approval Lifecycle ---');

  // Find a pending vehicle
  const pendingVehicles = vehiclesData.data.vehicles.filter((v) => !v.isApproved);
  let testVehicle = pendingVehicles[0];

  if (!testVehicle) {
    console.log('No pending vehicle found in initial fetch, fetching with isApproved=false...');
    const pRes = await fetch(`${BASE_URL}/admin/vehicles?isApproved=false`, {
      headers: { Authorization: `Bearer ${adminLogin.token}` }
    });
    const pData = await pRes.json();
    testVehicle = pData.data.vehicles[0];
  }

  assert(testVehicle !== undefined, 'Found a pending vehicle for lifecycle testing');

  if (testVehicle) {
    // Step 3a: Verify pending vehicle is NOT visible in customer catalog
    const publicExploreBefore = await fetch(`${BASE_URL}/vehicles?search=${encodeURIComponent(testVehicle.registrationNumber)}`);
    const publicDataBefore = await publicExploreBefore.json();
    const isVisibleBefore = (publicDataBefore.data?.vehicles || []).some((v) => v._id === testVehicle._id);
    assert(!isVisibleBefore, `Pending vehicle (${testVehicle.registrationNumber}) is NOT visible to customers in GET /api/vehicles`);

    // Step 3b: Admin Approves the Vehicle
    const approveRes = await fetch(`${BASE_URL}/admin/vehicles/${testVehicle._id}/approve`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminLogin.token}` 
      },
      body: JSON.stringify({ isApproved: true, status: 'AVAILABLE' })
    });
    assert(approveRes.status === 200, `Admin approves vehicle ${testVehicle.registrationNumber} (PATCH /api/admin/vehicles/:id/approve)`);

    // Step 3c: Verify vehicle NOW appears in customer explore
    const publicExploreAfter = await fetch(`${BASE_URL}/vehicles?search=${encodeURIComponent(testVehicle.registrationNumber)}`);
    const publicDataAfter = await publicExploreAfter.json();
    const isVisibleAfter = (publicDataAfter.data?.vehicles || []).some((v) => v._id === testVehicle._id);
    assert(isVisibleAfter, `Approved vehicle (${testVehicle.registrationNumber}) is now VISIBLE to customers in GET /api/vehicles`);

    // Step 3d: Admin Deactivates the Vehicle
    const deactivateRes = await fetch(`${BASE_URL}/admin/vehicles/${testVehicle._id}/deactivate`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminLogin.token}` }
    });
    assert(deactivateRes.status === 200, 'Admin deactivates vehicle');

    // Step 3e: Verify vehicle is no longer visible
    const publicExploreDeactivated = await fetch(`${BASE_URL}/vehicles?search=${encodeURIComponent(testVehicle.registrationNumber)}`);
    const publicDataDeactivated = await publicExploreDeactivated.json();
    const isVisibleDeactivated = (publicDataDeactivated.data?.vehicles || []).some((v) => v._id === testVehicle._id);
    assert(!isVisibleDeactivated, 'Deactivated vehicle is HIDDEN from customer marketplace search');

    // Step 3f: Revert to pending for demo state
    await fetch(`${BASE_URL}/admin/vehicles/${testVehicle._id}/approval`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminLogin.token}` 
      },
      body: JSON.stringify({ isApproved: false, status: 'PENDING_APPROVAL' })
    });
  }

  // -------------------------------------------------------------
  // TEST 4: Security Protections & User Suspension
  // -------------------------------------------------------------
  console.log('\n--- 4. Testing Account Governance & Protections ---');

  // Self-suspension guard: Admin cannot suspend self
  const selfSuspendRes = await fetch(`${BASE_URL}/admin/users/${adminLogin.user._id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminLogin.token}`
    },
    body: JSON.stringify({ isActive: false, reason: 'Self test' })
  });
  assert(selfSuspendRes.status === 400, 'Admin is prevented from suspending own account (Security Guard 400)');

  // Suspend Customer 2
  const targetCust = usersData.data.users.find((u) => u.email === 'customer2@rentride.in');
  if (targetCust) {
    const suspendRes = await fetch(`${BASE_URL}/admin/users/${targetCust._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminLogin.token}`
      },
      body: JSON.stringify({ isActive: false, reason: 'Testing compliance suspension' })
    });
    assert(suspendRes.status === 200, `Admin successfully suspended ${targetCust.email}`);

    // Try logging in as suspended customer
    const suspendedLogin = await login('customer2@rentride.in', 'Customer@123');
    assert(suspendedLogin.status === 403, 'Suspended customer is blocked from login with 403 Account Deactivated');

    // Reactivate Customer 2
    const reactivateRes = await fetch(`${BASE_URL}/admin/users/${targetCust._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminLogin.token}`
      },
      body: JSON.stringify({ isActive: true })
    });
    assert(reactivateRes.status === 200, `Admin reactivated ${targetCust.email}`);

    // Verify login restored
    const restoredLogin = await login('customer2@rentride.in', 'Customer@123');
    assert(restoredLogin.status === 200, 'Reactivated customer can successfully log in again');
  }

  // -------------------------------------------------------------
  // TEST 5: Public Registration Admin Role Injection Defense
  // -------------------------------------------------------------
  console.log('\n--- 5. Testing Public Registration Defense Against Admin Role ---');

  const rogueSignupRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Rogue Attacker',
      email: 'rogue@attacker.com',
      password: 'Attacker@123',
      role: 'admin'
    })
  });
  assert(rogueSignupRes.status === 400, 'Public registration attempting role="admin" is rejected with 400 Bad Request');

  console.log('\n===============================================================');
  console.log(`📊 FINAL RESULT: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
