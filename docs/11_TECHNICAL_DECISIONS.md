# 11 — Technical Decisions & Architecture Rationale

This document captures the key architectural and engineering decisions identified across the RentRide codebase.

---

## 1. Confirmed Decisions

### Decision 1: Layered Service Pattern over Controller-Heavy Architecture
* **Evidence**: Distinct separation across [`routes/`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/routes/), [`controllers/`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/controllers/), and [`services/`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/).
* **Reason**: Decouples business logic (e.g. interval collision calculation, commission splits, Razorpay signature verification) from the Express HTTP transport layer. Allows reuse in scripts, tests, or alternative transports.
* **Status**: Implemented ✅

### Decision 2: Centralized Interval-Overlap Collision Algorithm
* **Evidence**: [`BookingService.isVehicleAvailable`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/booking.service.js#L16) checking `startDateTime < end AND endDateTime > start` across both online bookings, offline walk-ins, and scheduled maintenance.
* **Reason**: Guaranteed mathematical prevention of double-booking across heterogeneous channels without needing complex distributed locks.
* **Status**: Implemented ✅

### Decision 3: Server-Authoritative Pricing with Zero Trust on Frontend
* **Evidence**: [`PricingService.calculatePriceBreakdown`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/pricing.service.js#L9).
* **Reason**: Eliminates client-side price tampering. The backend independently calculates hours, base rate, surge multipliers, coupon discounts, GST, and security deposits during checkout and order creation.
* **Status**: Implemented ✅

### Decision 4: 10-Minute Temporary Reservation Lock on Checkout
* **Evidence**: `lockExpiresAt: Date.now() + 10m` in [`booking.model.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/models/booking.model.js#L100).
* **Reason**: Prevents concurrent customers from paying for the same vehicle slot simultaneously while allowing abandoned checkouts to release automatically.
* **Status**: Implemented ✅

### Decision 5: Resilient In-Memory MongoDB Fallback for Local Development
* **Evidence**: [`server/src/config/db.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/config/db.js).
* **Reason**: Avoids crashes when developers are on networks without MongoDB Atlas IP access or working offline, automatically initializing categories.
* **Status**: Implemented ✅

### Decision 6: Dedicated Python AI Microservice with Node.js Fallback
* **Evidence**: [`ai-service/app/main.py`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/ai-service/app/main.py) and [`server/src/services/ai.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/ai.service.js).
* **Reason**: Leverages Python's ecosystem (`scikit-learn`, `pandas`, `numpy`) for ML vector similarity and time-series analysis while maintaining high-throughput Node.js for core transactional APIs. If the AI service is unreachable, Node.js uses heuristic fallbacks.
* **Status**: Implemented ✅

---

## 2. Inferred Decisions

### Inferred Decision 1: Single User Collection with Role-Specific Profile Sub-Documents
* **Evidence**: [`user.model.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/models/user.model.js) contains `vendorProfile` and `customerProfile` objects within the `User` schema rather than separate `Customer` / `Vendor` collections.
* **Inferred Reason**: Simplifies authentication, JWT generation, and role transitions (a customer can later become a vendor without migrating authentication credentials).
* **Status**: Implemented ✅

### Inferred Decision 2: Dual Storage of Auth Token (LocalStorage + HttpOnly Cookie)
* **Evidence**: [`auth.controller.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/controllers/auth.controller.js#L19) sets `res.cookie('rentride_token')` while also returning `token` in JSON payload for `localStorage` in [`authSlice.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/auth/authSlice.js).
* **Inferred Reason**: Provides flexibility for both SPA state hydration (Redux) and cookie-based API clients (Postman, mobile apps, or SSR).
* **Status**: Implemented ✅

---

## 3. Architectural Concerns & Trade-Offs

1. **Stateful In-Memory Development Mode vs Shared MongoDB**:
   * *Trade-off*: `MongoMemoryServer` offers instant offline setup, but data resets when the server restarts. In production, a persistent replica set is required.
2. **Synchronous Image Uploading via Multer Memory Storage**:
   * *Trade-off*: Storing images in memory before streaming to Cloudinary works well for standard vehicle photos (<5MB), but could cause memory spikes if hundreds of vendors upload high-res images concurrently. Moving to presigned Cloudinary direct client uploads would reduce backend bandwidth.
3. **Lock Expiration Polling vs Event Queue**:
   * *Trade-off*: Query-time filtering on `lockExpiresAt: { $gt: new Date() }` is simple and eliminates need for Redis, but leaves un-updated `PENDING_PAYMENT` records in the database until queried.
