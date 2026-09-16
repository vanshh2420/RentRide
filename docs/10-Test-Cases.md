# 10 — Test Cases & Verification Matrix

> **Document Type:** Test Case Specifications & Execution Verification Log  
> **Application:** RentRide Multi-Vendor Vehicle Rental Marketplace  
> **Status:** Grounded in Executable Test Scripts & Manual Verification  
> **Version:** 1.3.0  
> **Date:** 2026-09-03  

---

## 1. Testing Strategy Overview

RentRide implements a pragmatic, test-script-driven verification strategy focused on the core transactional and security invariants of the marketplace. Verification is performed through dedicated Node.js test execution harnesses in `server/src/scripts/` that spin up the application layer and test the database in-memory or against MongoDB Atlas, alongside manual end-to-end verification of user interfaces.

### Automated Test Suites in Codebase
* `server/src/scripts/testCollisionLogic.js`: Mathematical verification of the 9 interval intersection scenarios for the anti-collision formula.
* `server/src/scripts/testCollision.js`: Database integration test verifying that concurrent online and offline bookings on the same vehicle are blocked.
* `server/src/scripts/testRoleBasedAccess.js`: 13-test security suite verifying RBAC boundary isolation between Customer, Vendor, and Admin roles.
* `server/src/scripts/testUserProfileLifecycle.js`: 12-test suite verifying profile fetch, update, avatar handling, and password change security.
* `server/src/scripts/testCitySelectionFlow.js`: 6-test suite verifying vendor hub city registration, profile updates, and vehicle search filtering.
* `server/src/scripts/testFullMarketplaceLifecycle.js`: Complete end-to-end marketplace flow test (Registration $\rightarrow$ Vehicle Creation $\rightarrow$ Admin Approval $\rightarrow$ Booking $\rightarrow$ Handover $\rightarrow$ Return $\rightarrow$ Review).

---

## 2. Test Case Catalog

### 2.1 Authentication & Security Tests (`TC-AUTH`)

| Test ID | Req ID | Test Name & Feature | Preconditions | Test Steps | Expected Result | Actual Result / Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-AUTH-001** | `AUTH-001` | Customer Registration with Valid Data | Public visitor on registration page | Submit name, unique email, password $\ge 6$ chars, phone, and DL number | HTTP 201 Created; JWT token returned; user saved with role `CUSTOMER` | **PASS** (Executed via `testFullMarketplaceLifecycle.js`) |
| **TC-AUTH-002** | `AUTH-001` | Duplicate Email Registration Rejection | User exists in database | Submit registration with existing email | HTTP 409 Conflict ("User already exists"); no duplicate document created | **PASS** (Executed via `testUserProfileLifecycle.js`) |
| **TC-AUTH-003** | `AUTH-002` | User Login with Valid Credentials | User registered | POST credentials to `/api/auth/login` | HTTP 200 OK; valid JWT issued in body and HttpOnly cookie set | **PASS** (Executed via `testRoleBasedAccess.js`) |
| **TC-AUTH-004** | `AUTH-002` | User Login with Invalid Password | User registered | POST wrong password to `/api/auth/login` | HTTP 401 Unauthorized ("Invalid email or password"); no token issued | **PASS** (Manual API verification) |
| **TC-AUTH-005** | `AUTH-005` | Unauthenticated Request Rejection | None | Send request to `/api/users/profile` without token | HTTP 401 Unauthorized ("Please authenticate to access this resource") | **PASS** (Executed via `testUserProfileLifecycle.js`) |
| **TC-AUTH-006** | `AUTH-005` | Customer Role Access to Vendor Portal | Authenticated as `CUSTOMER` | GET `/api/vendor/stats` | HTTP 403 Forbidden ("You do not have permission to perform this action") | **PASS** (Executed via `testRoleBasedAccess.js`) |
| **TC-AUTH-007** | `AUTH-005` | Customer Role Access to Admin Portal | Authenticated as `CUSTOMER` | GET `/api/admin/stats` | HTTP 403 Forbidden ("You do not have permission to perform this action") | **PASS** (Executed via `testRoleBasedAccess.js`) |
| **TC-AUTH-008** | `AUTH-005` | Vendor Role Access to Admin Panel | Authenticated as `VENDOR` | GET `/api/admin/users` | HTTP 403 Forbidden; vendor blocked from admin directory | **PASS** (Executed via `testRoleBasedAccess.js`) |
| **TC-AUTH-009** | `AUTH-005` | Role Privilege Escalation Prevention | Authenticated as `CUSTOMER` | PATCH `/api/users/profile` with `{ "role": "ADMIN" }` | HTTP 200 OK, but user role remains `CUSTOMER` (ignored by validator) | **PASS** (Executed via `testUserProfileLifecycle.js`) |

---

### 2.2 User Profile Management Tests (`TC-USER`)

| Test ID | Req ID | Test Name & Feature | Preconditions | Test Steps | Expected Result | Actual Result / Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-USER-001** | `USER-001` | Fetch Profile Without Exposing Password | Authenticated user | GET `/api/users/profile` | HTTP 200 OK; response contains user profile; `password` field is omitted | **PASS** (Executed via `testUserProfileLifecycle.js`) |
| **TC-USER-002** | `USER-002` | Update Profile Name and Phone | Authenticated user | PATCH `/api/users/profile` with new name and phone | HTTP 200 OK; profile updated with new contact metadata | **PASS** (Executed via `testUserProfileLifecycle.js`) |
| **TC-USER-003** | `USER-004` | Password Change with Incorrect Current | Authenticated user | PATCH `/api/users/change-password` with wrong current password | HTTP 400 Bad Request ("Incorrect current password"); password unchanged | **PASS** (Executed via `testUserProfileLifecycle.js`) |
| **TC-USER-004** | `USER-004` | Password Change with Mismatched Confirm | Authenticated user | PATCH `/api/users/change-password` with mismatching passwords | HTTP 400 Bad Request ("Passwords do not match") | **PASS** (Executed via `testUserProfileLifecycle.js`) |
| **TC-USER-005** | `USER-004` | Successful Password Change & Re-login | Authenticated user | PATCH `/api/users/change-password` with valid new password; login with new pass | HTTP 200 OK; login succeeds with new password; old password invalid | **PASS** (Executed via `testUserProfileLifecycle.js`) |

---

### 2.3 Vehicle Catalog & Discovery Tests (`TC-VEH`)

| Test ID | Req ID | Test Name & Feature | Preconditions | Test Steps | Expected Result | Actual Result / Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-VEH-001** | `VEH-001` | Public Category Listing | Categories exist in database | GET `/api/categories` | HTTP 200 OK; returns list of categories with name, slug, and type | **PASS** (Executed via `testCitySelectionFlow.js`) |
| **TC-VEH-002** | `VEH-002` | Vehicle Search with Hub City Filter | Vehicles seeded in multiple hubs | GET `/api/vehicles?city=Indore` | HTTP 200 OK; returns only vehicles located in Indore hub | **PASS** (Executed via `testCitySelectionFlow.js`) |
| **TC-VEH-003** | `VEH-002` | Vehicle Search with Category Filter | Vehicles seeded | GET `/api/vehicles?category=suv` | HTTP 200 OK; returns only vehicles matching SUV category | **PASS** (Manual API verification) |
| **TC-VEH-004** | `VEH-003` | Vendor Registration with Supported Hub | Public visitor | Register vendor with city `Indore` | HTTP 201 Created; vendor assigned Indore hub | **PASS** (Executed via `testCitySelectionFlow.js`) |
| **TC-VEH-005** | `VEH-003` | Update Vendor Operating Hub City | Authenticated vendor | Update profile city to `Bhopal`, then `Gwalior` | HTTP 200 OK; operating city updated successfully | **PASS** (Executed via `testCitySelectionFlow.js`) |
| **TC-VEH-006** | `VEH-004` | Single Vehicle Detail Query | Vehicle exists | GET `/api/vehicles/:id` | HTTP 200 OK; full specs, pricing, and vendor details populated | **PASS** (Manual API verification) |

---

### 2.4 Anti-Collision & Booking Lifecycle Tests (`TC-BOOK`)

| Test ID | Req ID | Test Name & Feature | Preconditions | Test Steps | Expected Result | Actual Result / Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-BOOK-001** | `BOOK-001` | Identical Interval Overlap Detection | Existing booking `[10:00 - 20:00]` | Request `[10:00 - 20:00]` | Collision detected = `true`; booking blocked | **PASS** (Executed via `testCollisionLogic.js`) |
| **TC-BOOK-002** | `BOOK-001` | Overlapping Head Interval Collision | Existing booking `[10:00 - 20:00]` | Request `[08:00 - 12:00]` | Collision detected = `true`; booking blocked | **PASS** (Executed via `testCollisionLogic.js`) |
| **TC-BOOK-003** | `BOOK-001` | Overlapping Tail Interval Collision | Existing booking `[10:00 - 20:00]` | Request `[17:00 - 22:00]` | Collision detected = `true`; booking blocked | **PASS** (Executed via `testCollisionLogic.js`) |
| **TC-BOOK-004** | `BOOK-001` | Interior Subset Interval Collision | Existing booking `[10:00 - 20:00]` | Request `[13:00 - 16:00]` | Collision detected = `true`; booking blocked | **PASS** (Executed via `testCollisionLogic.js`) |
| **TC-BOOK-005** | `BOOK-001` | Exterior Superset Interval Collision | Existing booking `[12:00 - 15:00]` | Request `[10:00 - 20:00]` | Collision detected = `true`; booking blocked | **PASS** (Executed via `testCollisionLogic.js`) |
| **TC-BOOK-006** | `BOOK-001` | Non-Overlapping Before Interval | Existing booking `[10:00 - 20:00]` | Request `[06:00 - 09:00]` | Collision detected = `false`; available for booking | **PASS** (Executed via `testCollisionLogic.js`) |
| **TC-BOOK-007** | `BOOK-001` | Non-Overlapping After Interval | Existing booking `[10:00 - 20:00]` | Request `[20:05 - 23:00]` | Collision detected = `false`; available for booking | **PASS** (Executed via `testCollisionLogic.js`) |
| **TC-BOOK-008** | `BOOK-001` | Exact Boundary Abutting Interval | Existing booking `[10:00 - 20:00]` | Request `[20:00 - 23:00]` (touching border) | Collision detected = `false`; available for back-to-back rental | **PASS** (Executed via `testCollisionLogic.js`) |
| **TC-BOOK-009** | `BOOK-001` | Online vs Offline Walk-in Collision | Active online booking exists | Vendor attempts walk-in desk booking on same interval | HTTP 409 Conflict; walk-in rejected | **PASS** (Executed via `testCollision.js`) |
| **TC-BOOK-010** | `BOOK-002` | Weekend Surge Pricing Calculation | Rental starts on Saturday | Check availability price breakdown | `surgeMultiplier: 1.15` applied to base price; 18% GST and 5% fee calculated | **PASS** (Unit verification) |
| **TC-BOOK-011** | `BOOK-003` | 10-Minute Hold Lock Expiry Release | Booking created 11 mins ago without payment | New customer requests same interval | Expired booking is ignored; new booking succeeds | **PASS** (Logic verification) |
| **TC-BOOK-012** | `BOOK-006` | Cancel Confirmed Booking Prior to Trip | Confirmed booking $>24$h in future | Customer calls `/api/bookings/:id/cancel` | Status becomes `CANCELLED`; refund assessed minus 5% fee; interval freed | **PASS** (Service verification) |

---

### 2.5 Payments & Financial Verification Tests (`TC-PAY`)

| Test ID | Req ID | Test Name & Feature | Preconditions | Test Steps | Expected Result | Actual Result / Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-PAY-001** | `PAY-001` | Razorpay Order Creation | Booking in `PENDING_PAYMENT` | POST `/api/payments/razorpay/create-order` | HTTP 200 OK; returns valid Razorpay `order_id` matching total amount in paise | **PASS** (Integration verification) |
| **TC-PAY-002** | `PAY-002` | Cryptographic Signature Verification | Valid order created | POST correct HMAC-SHA256 signature | HTTP 200 OK; payment marked `SUCCESS`; booking marked `CONFIRMED` | **PASS** (Service verification) |
| **TC-PAY-003** | `PAY-002` | Tampered Signature Rejection | Valid order created | POST invalid signature string | HTTP 400 Bad Request ("Invalid payment signature"); booking remains locked | **PASS** (Service verification) |

---

### 2.6 Vendor Operations Tests (`TC-VEN`)

| Test ID | Req ID | Test Name & Feature | Preconditions | Test Steps | Expected Result | Actual Result / Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-VEN-001** | `VEN-004` | Walk-In Offline Booking Dispatch | Vehicle available | POST `/api/vendor/bookings/offline` with customer name, phone, DL, and cash payment | HTTP 201 Created; booking confirmed immediately with channel `OFFLINE` | **PASS** (Executed via `testCollision.js`) |
| **TC-VEN-002** | `VEN-005` | Start Trip & Odometer Recording | Confirmed booking | POST `/api/vendor/bookings/:id/start-trip` with `startOdometerKm: 12000` | HTTP 200 OK; booking transitions to `ACTIVE`; vehicle status becomes `BOOKED` | **PASS** (Service verification) |
| **TC-VEN-003** | `VEN-006` | Complete Trip & Extra Km Penalty | Active trip | POST `/api/vendor/bookings/:id/complete-trip` with `endOdometerKm: 12400` (> daily allowance) | HTTP 200 OK; extra km charges calculated; booking `COMPLETED`; vehicle `AVAILABLE` | **PASS** (Service verification) |

---

### 2.7 Maintenance, Reviews & Admin Tests (`TC-ADM` / `TC-MAIN` / `TC-REV`)

| Test ID | Req ID | Test Name & Feature | Preconditions | Test Steps | Expected Result | Actual Result / Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-MAIN-001**| `MAIN-001`| Maintenance Window Availability Block | Scheduled maintenance exists | Customer attempts booking during maintenance window | HTTP 409 Conflict; booking blocked due to maintenance | **PASS** (Collision engine verification) |
| **TC-ADM-001** | `ADM-002` | Admin Vehicle Listing Approval | Vehicle created (`isApproved: false`) | Admin sends PATCH `/api/admin/vehicles/:id/approval` with `isApproved: true` | HTTP 200 OK; vehicle `isApproved: true`; visible in public search | **PASS** (Executed via `testRoleBasedAccess.js`) |
| **TC-ADM-002** | `ADM-002` | Admin Vehicle Listing Rejection | Vehicle created | Admin sends PATCH `/api/admin/vehicles/:id/approval` with `isApproved: false, rejectionReason` | HTTP 200 OK; vehicle `isApproved: false, status: INACTIVE`; vendor notified | **PASS** (Service verification) |
| **TC-REV-001** | `REV-001` | Post-Trip Review Submission | Customer completed trip | POST `/api/reviews` with rating = 5 and comment | HTTP 201 Created; review saved; vehicle average rating recalculated | **PASS** (Model hook verification) |
| **TC-REV-002** | `REV-001` | Review Rejection on Incomplete Booking | Booking is `CONFIRMED` but not `COMPLETED` | Customer attempts to POST review | HTTP 400 Bad Request ("Can only review completed trips") | **PASS** (Service verification) |
