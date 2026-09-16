# 09 — Business Rules & Invariants

> **Document Type:** Business Logic Invariants & Operational Rules Specification  
> **Application:** RentRide Multi-Vendor Vehicle Rental Marketplace  
> **Status:** Derived from Verified Codebase Implementation  
> **Version:** 1.3.0  
> **Date:** 2026-09-03  

---

## 1. Core Principles

RentRide's business logic is strictly enforced at the **backend service layer** to prevent client-side tampering. Frontend UI components mirror these rules to provide immediate visual feedback, but the backend serves as the final authority. Every rule documented below is derived directly from executable logic in `server/src/services/`, `models/`, and `middleware/`.

---

## 2. Business Rules Catalog

### BR-001 — Zero-Collision Interval Availability Invariant
* **Description:** A vehicle cannot be booked, locked, or scheduled if the requested rental interval `[R_start, R_end]` overlaps with any existing booking or maintenance blockout on that vehicle.
* **Mathematical Invariant:**
  ```text
  Overlap = (Existing_Start < Requested_End) AND (Existing_End > Requested_Start)
  ```
* **Enforcing Modules:**
  * [`server/src/services/booking.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/booking.service.js#L16-L78)
  * [`server/src/services/maintenance.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/maintenance.service.js#L20-L40)
* **Conflict Triggers:**
  1. Confirmed online bookings (`status: 'CONFIRMED'`).
  2. Active trips (`status: 'ACTIVE'`).
  3. Walk-in offline bookings (`status: 'CONFIRMED'`).
  4. Active 10-minute temporary reservation locks (`status: 'PENDING_PAYMENT'` where `lockExpiresAt > now`).
  5. Scheduled fleet maintenance windows (`status: 'SCHEDULED'` or `'IN_PROGRESS'`).
* **Enforcement Action:** Rejects the booking request immediately with HTTP `409 Conflict` ("Vehicle is not available for the selected time interval").
* **Related Requirement:** `BOOK-001`

---

### BR-002 — 10-Minute Temporary Reservation Hold Lock TTL
* **Description:** When a customer initiates online checkout, the system places a 10-minute temporary reservation lock on the vehicle interval to prevent concurrent checkout race conditions (double-booking).
* **Enforcing Modules:**
  * [`server/src/models/booking.model.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/models/booking.model.js#L100-L103)
  * [`server/src/services/booking.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/booking.service.js#L41-L44)
* **Rule Invariants:**
  * The booking document is created with `status: 'PENDING_PAYMENT'` and `lockExpiresAt: Date.now() + 10 * 60 * 1000`.
  * During interval collision checks, any booking in `PENDING_PAYMENT` whose `lockExpiresAt` is in the past is treated as expired and disregarded, releasing the slot automatically without requiring a background cron job.
  * Successful payment verification converts the hold lock into a permanent `CONFIRMED` booking.
* **Related Requirement:** `BOOK-003`

---

### BR-003 — Multi-Plan Tiered Pricing Calculation
* **Description:** Rental rates are determined by the customer's selected plan tier (`HOURLY`, `12_HOURS`, `24_HOURS`):
  * **HOURLY Plan:** `basePrice = vehicle.pricing.hourlyRate * durationHours` (duration must be $\ge$ `vehicle.pricing.minRentalHours`).
  * **12_HOURS Plan:** `basePrice = vehicle.pricing.rate12Hour * ceil(durationHours / 12)`.
  * **24_HOURS Plan:** `basePrice = vehicle.pricing.rate24Hour * ceil(durationHours / 24)`.
* **Enforcing Module:** [`server/src/services/pricing.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/pricing.service.js#L9-L65)
* **Related Requirement:** `BOOK-002`

---

### BR-004 — Weekend Demand Surge Multiplier
* **Description:** If the rental interval includes a weekend day (Saturday or Sunday), a **1.15x surge multiplier** (+15%) is applied to the base rental rate.
* **Enforcing Module:** [`server/src/services/pricing.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/pricing.service.js#L70-L85)
* **Mathematical Formula:**
  ```text
  surgeMultiplier = isWeekend(startDateTime) || isWeekend(endDateTime) ? 1.15 : 1.0
  surgedBasePrice = round(basePrice * surgeMultiplier)
  ```
* **Related Requirement:** `BOOK-002`, `AI-003`

---

### BR-005 — Itemized Fee & Tax Composition
* **Description:** Every booking invoice strictly enforces a uniform financial composition:
  1. `subtotal = surgedBasePrice - couponDiscount` (cannot be negative).
  2. `platformFee = round(subtotal * 0.05)` (5% customer marketplace service fee).
  3. `taxAmount = round((subtotal + platformFee) * 0.18)` (18% Goods and Services Tax - GST).
  4. `securityDeposit = vehicle.pricing.securityDeposit` (refundable deposit, default ₹1000).
  5. `totalAmount = subtotal + platformFee + taxAmount + securityDeposit`.
* **Enforcing Module:** [`server/src/services/pricing.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/pricing.service.js#L88-L122)
* **Related Requirement:** `BOOK-002`

---

### BR-006 — Platform Commission & Vendor Payout Split
* **Description:** The platform revenue model enforces an automated financial split on the subtotal:
  * **Platform Commission:** 12% of `subtotal` + 100% of `platformFee` + 100% of `taxAmount`.
  * **Vendor Payout:** 88% of `subtotal` + 100% of `securityDeposit` (to be held or refunded).
  * If a custom `commissionRateOverride` is defined on the vendor's profile, it replaces the default 12% rate.
* **Enforcing Module:** [`server/src/services/pricing.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/pricing.service.js#L105-L120)
* **Related Requirement:** `BOOK-002`, `ADM-001`

---

### BR-007 — Promotional Coupon Eligibility & Redemption Limits
* **Description:** A promotional coupon code can only be applied if all the following conditions are met:
  1. `coupon.isActive == true`.
  2. `now >= coupon.validFrom` and `now <= coupon.validUntil`.
  3. `cartSubtotal >= coupon.minBookingAmount`.
  4. `coupon.usageCount < coupon.totalUsageLimit` (global usage cap).
  5. User has redeemed this coupon strictly less than `coupon.perUserLimit` times.
  6. For `PERCENTAGE` coupons, `discount = min(subtotal * (discountValue / 100), maxDiscountAmount)`.
  7. For `FIXED` coupons, `discount = min(discountValue, subtotal)`.
* **Enforcing Module:** [`server/src/services/coupon.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/coupon.service.js#L12-L95)
* **Related Requirement:** `COUP-001`

---

### BR-008 — Vehicle Listing Moderation Approval Gate
* **Description:** Newly created vendor vehicles are created in an unapproved state (`isApproved: false`).
* **Invariants:**
  * Unapproved vehicles are filtered out from all public marketplace search queries (`{ isApproved: true }`).
  * Only Platform Administrators can approve a vehicle (setting `isApproved: true`) or reject a vehicle (setting `status: 'INACTIVE'` with a rejection reason).
  * Approving or rejecting a vehicle triggers an automated in-app notification to the vendor.
* **Enforcing Modules:**
  * [`server/src/models/vehicle.model.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/models/vehicle.model.js#L120-L123)
  * [`server/src/services/admin.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/admin.service.js#L75-L105)
* **Related Requirement:** `ADM-002`

---

### BR-009 — Trip Handover & Return State Invariants
* **Description:** Physical vehicle handovers and returns must follow strict state transitions:
  * **Trip Start (Handover):**
    * Precondition: Booking must be `CONFIRMED`.
    * Vendor must supply a valid `startOdometerKm` ($\ge 0$).
    * Booking transitions to `ACTIVE`; Vehicle transitions to `BOOKED`.
  * **Trip Complete (Return):**
    * Precondition: Booking must be `ACTIVE`.
    * Vendor must supply `endOdometerKm` ($\ge \text{startOdometerKm}$).
    * `distanceDriven = endOdometerKm - startOdometerKm`.
    * If `distanceDriven > (vehicle.mileageLimitPerDayKm * ceil(durationHours / 24))`, an extra km fee is assessed: `extraKmCharges = (distanceDriven - allowedKm) * vehicle.extraKmCharge`.
    * Booking transitions to `COMPLETED`; Vehicle transitions to `AVAILABLE`.
* **Enforcing Module:** [`server/src/services/booking.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/booking.service.js#L450-L540)
* **Related Requirement:** `VEN-005`, `VEN-006`

---

### BR-010 — Customer Booking Cancellation & Refund Invariant
* **Description:** Customers can only cancel bookings in `PENDING_PAYMENT` or `CONFIRMED` states prior to trip start (`startDateTime > now`).
* **Rules:**
  * If cancelled $>24$ hours prior to start: Full refund of total amount minus 5% administrative fee.
  * If cancelled between 12 and 24 hours prior to start: 50% rental subtotal refund + 100% security deposit refund.
  * If cancelled $<12$ hours prior to start: 0% rental refund; 100% security deposit refunded.
  * If booking was `PENDING_PAYMENT`, cancellation is immediate with zero fee.
  * Booking transitions to `CANCELLED`; vehicle interval is unlocked immediately.
* **Enforcing Module:** [`server/src/services/booking.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/booking.service.js#L350-L420)
* **Related Requirement:** `BOOK-006`

---

### BR-011 — Verified Review Submission & Real-time Rating Aggregation
* **Description:** A review can only be submitted by a customer who completed a rental trip on that vehicle.
* **Rules:**
  * Precondition: Associated booking must have `status: 'COMPLETED'` and `customerId == req.user._id`.
  * Exactly one review is allowed per completed booking.
  * Upon saving the review, Mongoose `post('save')` executes an atomic aggregation pipeline recalculating `Vehicle.ratingAverage` (rounded to 1 decimal) and `Vehicle.ratingCount`.
* **Enforcing Module:** [`server/src/models/review.model.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/models/review.model.js#L54-L85)
* **Related Requirement:** `REV-001`

---

### BR-012 — Role Exclusivity & Ownership Integrity
* **Description:** Users cannot cross operational boundaries between Customer, Vendor, and Admin roles:
  * Vendors cannot rent vehicles via customer online checkout.
  * Vendors can only edit, delete, start trips, or complete trips for vehicles and bookings they own (`booking.vendorId == req.user._id`).
  * Non-admin users cannot access administrative moderation or financial audit endpoints.
* **Enforcing Modules:**
  * [`server/src/middleware/role.middleware.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/middleware/role.middleware.js)
  * [`server/src/services/booking.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/booking.service.js)
  * [`server/src/services/vehicle.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/vehicle.service.js)
* **Related Requirement:** `AUTH-005`
