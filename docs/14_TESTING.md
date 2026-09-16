# 14 — Testing Strategy & Verification Suites

This document catalogues all existing test suites, automated verification scripts, and domain-by-domain testing checklists found in the RentRide codebase.

---

## 1. Existing Test Suites & Verification Scripts

The backend includes a comprehensive suite of automated verification scripts located in [`server/src/scripts/`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/scripts/):

| Script | Purpose & Scope | Execution Command |
| :--- | :--- | :--- |
| [`testCollisionLogic.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/scripts/testCollisionLogic.js) | Pure unit test of the interval overlap collision algorithm across 6 boundary scenarios (exact match, partial overlap, adjacent slots, etc.). | `node src/scripts/testCollisionLogic.js` |
| [`testCollision.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/scripts/testCollision.js) | Database integration test verifying that concurrent online and offline bookings cannot double-book a vehicle. | `node src/scripts/testCollision.js` |
| [`testRoleBasedAccess.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/scripts/testRoleBasedAccess.js) | Verifies that unauthenticated requests, unauthorized roles, and invalid JWTs receive correct 401/403 HTTP status codes. | `node src/scripts/testRoleBasedAccess.js` |
| [`testUserProfileLifecycle.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/scripts/testUserProfileLifecycle.js) | Tests user profile view, avatar update, password change, and validation errors. | `node src/scripts/testUserProfileLifecycle.js` |
| [`testFullMarketplaceLifecycle.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/scripts/testFullMarketplaceLifecycle.js) | End-to-end test of the entire marketplace: registration -> vehicle listing -> availability check -> online booking -> payment verification -> start trip -> complete trip -> customer review. | `node src/scripts/testFullMarketplaceLifecycle.js` |
| [`testCitySelectionFlow.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/scripts/testCitySelectionFlow.js) | Verifies city filtering across Indore, Bhopal, and Gwalior for customer search and vendor profile updates. | `node src/scripts/testCitySelectionFlow.js` |
| [`seed.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/scripts/seed.js) | Comprehensive database seeder populating demo users (Customer, Vendor, Admin), categories, vehicles, coupons, reviews, and bookings. | `npm run seed` |

---

## 2. Feature Verification Checklists

### Authentication & Authorization
- [x] Customer registration with valid credentials
- [x] Vendor registration with business name and GST
- [x] Registration fails with duplicate email (409 Conflict)
- [x] Login with valid credentials returns JWT token and sets cookie
- [x] Login fails with incorrect password (401 Unauthorized)
- [x] Protected endpoints reject requests without JWT (401 Unauthorized)
- [x] Admin endpoints reject non-admin users (403 Forbidden)
- [x] Vendor endpoints reject customer users (403 Forbidden)
- [x] Password change succeeds with correct current password and fails with invalid current password

### Vehicle Catalog & Discovery
- [x] Categories API returns active vehicle categories (Two-Wheelers and Four-Wheelers)
- [x] Search filters by city (Indore, Bhopal, Gwalior)
- [x] Search multi-filters by category, fuel type, transmission, seats, price range, and sort order
- [x] Vehicle details view returns images, tech specs, pricing tiers, and vendor hub address
- [x] Vendor can create vehicle with up to 5 photos (stored in Cloudinary)
- [x] Newly created vehicle requires admin approval before appearing in public search

### Booking & Zero-Collision Availability
- [x] `check-availability` returns available when no overlapping bookings exist
- [x] `check-availability` detects and blocks overlapping online booking
- [x] `check-availability` detects and blocks overlapping walk-in offline booking
- [x] `check-availability` detects and blocks overlapping scheduled maintenance window
- [x] Booking creation sets `PENDING_PAYMENT` with 10-minute temporary inventory lock
- [x] Expired temporary locks are ignored by availability check
- [x] Server calculates base rate, weekend surge (1.15x), 5% platform fee, 18% GST, and security deposit accurately
- [x] Coupon discount applies correctly and enforces minimum spend and per-user limits

### Payments & Handover Operations
- [x] Razorpay order creation generates valid order ID and amount
- [x] Payment verification succeeds with valid HMAC SHA256 signature and transitions booking to `CONFIRMED`
- [x] Payment failure endpoint updates payment record and preserves lock until expiry
- [x] Vendor can create walk-in offline booking with customer details and cash payment
- [x] Vendor can start trip (`ACTIVE`), logging start odometer reading
- [x] Vendor can complete trip (`COMPLETED`), logging end odometer and computing extra km fees
- [x] Customer can cancel booking, recording cancellation fee and refund in database

### Reviews, Maintenance & AI Microservices
- [x] Customer can submit review and star rating for completed booking
- [x] Duplicate review for same booking is prevented by unique index
- [x] Review submission automatically updates vehicle's aggregate average rating and count
- [x] Vendor can schedule maintenance, blocking vehicle from rental search
- [x] Vendor can complete maintenance, restoring vehicle to `AVAILABLE` status
- [x] AI Microservice returns cosine-similarity ranked vehicle recommendations
- [x] AI Microservice returns 7-day city/category demand forecast
- [x] AI Microservice calculates dynamic pricing surge multiplier
- [x] Backend falls back gracefully if AI microservice is unreachable
