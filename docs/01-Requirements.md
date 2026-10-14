# 01 — System Requirements Specification

> **Document Type:** System Requirements Specification (SRS)  
> **Application:** RentRide Multi-Vendor Vehicle Rental Marketplace  
> **Status:** Verified from Live Implementation  
> **Version:** 1.3.0  
> **Date:** 2026-09-03  

---

## 1. Project Overview

**RentRide** is an enterprise-grade multi-vendor vehicle rental marketplace engineered to seamlessly connect retail customers seeking flexible urban mobility with independent vehicle fleet owners (Vendors) and platform supervisors (Administrators). 

The platform facilitates on-demand rentals across multiple duration tiers (Hourly, 12-Hour Day Pass, and 24-Hour Overnight) for diverse vehicle categories spanning two-wheelers (electric scooters, motorbikes) and four-wheelers (hatchbacks, sedans, SUVs). Built with a modern microservice-augmented architecture, RentRide incorporates a dedicated Node.js/Express REST API, a reactive Vite/React single-page application, and an auxiliary Python FastAPI microservice powering AI-driven vehicle recommendations, dynamic pricing calculations, and 7-day city-wide fleet demand forecasting.

---

## 2. Problem Statement

Urban commuting, regional leisure travel, and gig-economy logistics increasingly require temporary personal transportation without the long-term liabilities of vehicle ownership. However, existing vehicle rental ecosystems suffer from:
1. **Fragmented Inventory:** Local vehicle owners operate in isolated silos, lacking digital storefronts and payment infrastructure.
2. **Double-Booking Vulnerabilities:** Manual walk-in desks and disjointed online reservation engines regularly collide, leading to customer strandedness and dispute liabilities.
3. **Opaque Pricing:** Customers face surprise security deposit policies, unitemized surge rates, and hidden platform fees upon vehicle pickup.
4. **Suboptimal Utilization:** Fleet owners lack data-driven demand forecasting and dynamic rate recommendation tools to optimize fleet turnover during off-peak windows.

---

## 3. Objectives

* **Zero Booking Overlap:** Guarantee 100% collision-free interval scheduling across online reservations, vendor walk-in bookings, and maintenance downtime via server-authoritative interval intersection validation.
* **Unified Multi-Vendor Operations:** Provide vehicle fleet vendors with complete digital autonomy to onboard fleets, adjust tiered rental rates, schedule maintenance windows, execute digital vehicle handovers, and track net payout earnings.
* **Complete Financial Transparency:** Enforce server-side itemized price breakdowns including base rates, weekend surges, promotional coupon discounts, platform commissions, 18% GST, and refundable security deposits.
* **Intelligent Recommendations & Pricing:** Augment customer discovery with content-based machine learning recommendations and empower vendors with dynamic pricing multipliers and 7-day predictive demand curves.

---

## 4. Target Users

| User Role | System Identifier | Profile & Operational Responsibility |
| :--- | :--- | :--- |
| **Retail Customer** | `CUSTOMER` | Urban commuters, tourists, and short-term renters searching for vehicles, reserving rental slots, completing digital payments, and rating completed trips. |
| **Fleet Vendor** | `VENDOR` | Independent vehicle owners and rental businesses listing vehicles, managing vehicle availability, executing offline walk-in bookings, and performing physical vehicle handovers/returns. |
| **Platform Administrator** | `ADMIN` | System operators overseeing platform health, approving/rejecting vendor vehicle listings, moderating users, managing global promotional coupons, and auditing financial ledgers. |
| **Unauthenticated Guest** | `GUEST` | Public visitors browsing marketplace categories, searching vehicles by hub city, comparing rental plans, and registering accounts. |

---

## 5. Functional Requirements

### 5.1 Authentication & Identity Management (`AUTH`)

#### AUTH-001 — User Registration
* **Description:** The system shall allow public visitors to register as a `CUSTOMER` or `VENDOR`. Registration requires name, unique email, password (min 6 characters), and mobile phone. Vendors must supply business name, GST number, and operational hub city.
* **Actor:** Guest
* **Priority:** High
* **Status:** Implemented
* **Evidence:** [`server/src/controllers/auth.controller.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/controllers/auth.controller.js#L7-L23), [`client/src/features/auth/RegisterForm.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/auth/RegisterForm.jsx)

#### AUTH-002 — Secure User Login & JWT Session Issuance
* **Description:** The system shall authenticate users against bcrypt-hashed credentials and return a signed JSON Web Token (JWT) in the response payload while simultaneously setting a secure HttpOnly cookie for session persistence.
* **Actor:** Guest / User
* **Priority:** High
* **Status:** Implemented
* **Evidence:** [`server/src/controllers/auth.controller.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/controllers/auth.controller.js#L28-L51), [`server/src/models/user.model.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/models/user.model.js#L112-L125)

#### AUTH-003 — Session Logout
* **Description:** The system shall terminate authenticated user sessions by clearing the server-side authorization cookie and purging the client Redux authentication state.
* **Actor:** Authenticated User (Customer, Vendor, Admin)
* **Priority:** Medium
* **Status:** Implemented
* **Evidence:** [`server/src/controllers/auth.controller.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/controllers/auth.controller.js#L56-L65), [`client/src/store/slices/authSlice.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/store/slices/authSlice.js)

#### AUTH-004 — Current User Session Verification (`/me`)
* **Description:** The system shall provide an endpoint to re-authenticate active client sessions on page reload using the stored JWT token, returning the current user entity without exposing password hashes.
* **Actor:** Authenticated User
* **Priority:** High
* **Status:** Implemented
* **Evidence:** [`server/src/controllers/auth.controller.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/controllers/auth.controller.js#L70-L75), [`client/src/App.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/App.jsx)

#### AUTH-005 — Role-Based Access Control (RBAC) Enforcement
* **Description:** The system shall restrict access to protected API routes and frontend page hierarchies based on the user's role (`CUSTOMER`, `VENDOR`, `ADMIN`). Unauthorized attempts must return `403 Forbidden` on backend and redirect on frontend.
* **Actor:** System / All Roles
* **Priority:** High
* **Status:** Implemented
* **Evidence:** [`server/src/middleware/role.middleware.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/middleware/role.middleware.js), [`client/src/components/navigation/ProtectedRoute.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/components/navigation/ProtectedRoute.jsx)

#### AUTH-006 — Password Reset via Email Link
* **Description:** The system shall allow users who forgot their password to request a secure, time-limited password reset token delivered via email.
* **Actor:** Guest / User
* **Priority:** Medium
* **Status:** Not Implemented
* **Evidence:** Identified as planned in roadmap; no SMTP/email service integration or reset token schema exists in the codebase.

---

### 5.2 User Profile Management (`USER`)

#### USER-001 — View User Profile
* **Description:** Authenticated users shall be able to view their account profile details, including contact details, avatar, KYC status, driving license info (for customers), and business details (for vendors).
* **Actor:** Authenticated User
* **Priority:** Medium
* **Status:** Implemented
* **Evidence:** [`server/src/controllers/user.controller.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/controllers/user.controller.js#L7-L14), [`client/src/pages/customer/ProfilePage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/customer/ProfilePage.jsx)

#### USER-002 — Update User Contact & Role Profile
* **Description:** Users shall be able to update their phone number, customer driving license number, or vendor business metadata (business name, GST, operating hub address).
* **Actor:** Authenticated User
* **Priority:** Medium
* **Status:** Implemented
* **Evidence:** [`server/src/controllers/user.controller.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/controllers/user.controller.js#L19-L38), [`client/src/pages/customer/ProfilePage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/customer/ProfilePage.jsx)

#### USER-003 — Avatar Image Upload
* **Description:** Users shall be able to upload a custom profile avatar image, processed via Multer memory storage and uploaded directly to Cloudinary CDN, storing the secure image URL and public ID.
* **Actor:** Authenticated User
* **Priority:** Low
* **Status:** Implemented
* **Evidence:** [`server/src/middleware/upload.middleware.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/middleware/upload.middleware.js), [`server/src/controllers/user.controller.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/controllers/user.controller.js#L23-L27)

#### USER-004 — Password Change
* **Description:** Authenticated users shall be able to change their password by supplying their current password and a compliant new password (min 6 characters).
* **Actor:** Authenticated User
* **Priority:** Medium
* **Status:** Implemented
* **Evidence:** [`server/src/controllers/user.controller.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/controllers/user.controller.js#L43-L60), [`server/src/services/user.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/user.service.js#L68-L95)

---

### 5.3 Vehicle Catalog & Discovery (`VEH`)

#### VEH-001 — Vehicle Category Browsing
* **Description:** The system shall display vehicle categories partitioned by two-wheeler and four-wheeler classifications, showing category names, slugs, icons, and vehicle counts.
* **Actor:** Guest / Customer
* **Priority:** High
* **Status:** Implemented
* **Evidence:** [`server/src/controllers/category.controller.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/controllers/category.controller.js), [`client/src/pages/customer/CategoriesPage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/customer/CategoriesPage.jsx)

#### VEH-002 — Faceted Vehicle Search & Filter Engine
* **Description:** The system shall allow users to search and filter public available vehicles by keyword, category, fuel type (petrol, diesel, electric, cng, hybrid), transmission (manual, automatic), seating capacity, city hub, and price range with sorting options.
* **Actor:** Guest / Customer
* **Priority:** High
* **Status:** Implemented
* **Evidence:** [`server/src/services/vehicle.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/vehicle.service.js#L235-L310), [`client/src/pages/customer/ExplorePage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/customer/ExplorePage.jsx)

#### VEH-003 — City Hub Autocomplete Discovery
* **Description:** The system shall provide an autocomplete city selector for supported operational hubs (Indore, Bhopal, Gwalior) and support cross-city search mode.
* **Actor:** Guest / Customer
* **Priority:** Medium
* **Status:** Implemented
* **Evidence:** [`client/src/components/common/CityAutocomplete.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/components/common/CityAutocomplete.jsx), [`server/src/constants/cities.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/constants/cities.js)

#### VEH-004 — Vehicle Details & Live Estimator
* **Description:** The system shall present full vehicle specifications, multi-image carousel, feature badges, vendor contact location, verified reviews, and a dynamic real-time price estimator based on selected rental plan.
* **Actor:** Guest / Customer
* **Priority:** High
* **Status:** Implemented
* **Evidence:** [`client/src/pages/customer/VehicleDetailsPage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/customer/VehicleDetailsPage.jsx), [`server/src/controllers/vehicle.controller.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/controllers/vehicle.controller.js#L45-L55)

#### VEH-005 — Interactive Fleet Map Hub View
* **Description:** The system shall display vehicle pickup locations plotted on an interactive Leaflet + OpenStreetMap view with custom price badge markers, detail popups, and click-to-view navigation.
* **Actor:** Customer
* **Priority:** Medium
* **Status:** Implemented
* **Evidence:** [`client/src/components/common/MapView.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/components/common/MapView.jsx), [`client/src/pages/customer/ExplorePage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/customer/ExplorePage.jsx)

#### VEH-006 — Vehicle Fuel Economy & Certified Mileage
* **Description:** The system shall capture, validate, and display certified vehicle fuel economy / range (`fuelEconomy` and `fuelEconomyUnit` supporting `km/l`, `km/kg`, and `km/charge`), with dynamic unit adaptation based on fuel type and graceful fallback for unpopulated legacy listings.
* **Actor:** Vendor / Customer
* **Priority:** Medium
* **Status:** Implemented
* **Evidence:** [`server/src/models/vehicle.model.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/models/vehicle.model.js), [`client/src/features/vendor/AddVehicleModal.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/vendor/AddVehicleModal.jsx), [`client/src/pages/customer/VehicleDetailsPage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/customer/VehicleDetailsPage.jsx)

#### VEH-007 — Nearest Available Vehicles / Vendors Discovery
* **Description:** The system shall allow customers to discover the nearest available vehicles to their physical geolocation within a search radius (default 50 km). Candidate listings must be strictly validated against the server-side anti-collision availability engine for the requested rental window and sorted ascending by spherical Haversine distance.
* **Actor:** Customer
* **Priority:** High
* **Status:** Implemented
* **Evidence:** [`server/src/services/vehicle.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/vehicle.service.js), [`server/src/controllers/vehicle.controller.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/controllers/vehicle.controller.js), [`client/src/pages/customer/ExplorePage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/customer/ExplorePage.jsx)

#### VEH-008 — Vendor Pickup Hub Location Map & Turn-by-Turn Navigation
* **Description:** Vehicle detail pages shall render an interactive Leaflet map centered on the vendor dispatch hub coordinates, indicating exact pickup address and providing a direct Google Maps turn-by-turn navigation link.
* **Actor:** Customer
* **Priority:** Medium
* **Status:** Implemented
* **Evidence:** [`client/src/components/common/MapView.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/components/common/MapView.jsx), [`client/src/pages/customer/VehicleDetailsPage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/customer/VehicleDetailsPage.jsx)

---

### 5.4 Booking & Anti-Collision Lifecycle (`BOOK`)

#### BOOK-001 — Zero-Collision Interval Availability Engine
* **Description:** The system shall verify that a requested rental interval `[startDateTime, endDateTime]` has zero overlap with any confirmed online booking, active trip, walk-in booking, temporary checkout lock, or scheduled maintenance blockout. Overlap definition: `(existingStart < requestedEnd) AND (existingEnd > requestedStart)`.
* **Actor:** Customer / Vendor / System
* **Priority:** Critical
* **Status:** Implemented
* **Evidence:** [`server/src/services/booking.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/booking.service.js#L16-L78), [`server/src/scripts/testCollision.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/scripts/testCollision.js)

#### BOOK-002 — Multi-Plan Server-Authoritative Price Calculation
* **Description:** The system shall calculate itemized rental charges based on the selected plan (`HOURLY`, `12_HOURS`, `24_HOURS`), applying weekend surge (1.15x for Saturday/Sunday rentals), platform fee (5%), GST (18%), and refundable security deposit.
* **Actor:** System / Customer
* **Priority:** Critical
* **Status:** Implemented
* **Evidence:** [`server/src/services/pricing.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/pricing.service.js#L9-L122)

#### BOOK-003 — 10-Minute Temporary Checkout Inventory Lock
* **Description:** Upon initiating checkout, the system shall create a booking record in `PENDING_PAYMENT` state with a 10-minute TTL lock (`lockExpiresAt`), reserving the vehicle interval against other concurrent checkout attempts.
* **Actor:** Customer
* **Priority:** High
* **Status:** Implemented
* **Evidence:** [`server/src/models/booking.model.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/models/booking.model.js#L100-L103), [`server/src/services/booking.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/booking.service.js#L41-L44)

#### BOOK-004 — Online Booking Creation
* **Description:** Customers shall create online booking reservations with verified driving license confirmation and selected rental plans.
* **Actor:** Customer
* **Priority:** High
* **Status:** Implemented
* **Evidence:** [`server/src/controllers/booking.controller.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/controllers/booking.controller.js#L19-L30), [`client/src/pages/customer/CheckoutPage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/customer/CheckoutPage.jsx)

#### BOOK-005 — Customer Booking Management & Status Tracking
* **Description:** Customers shall view their full booking history partitioned by Upcoming, Active, Completed, and Cancelled statuses, with digital receipt details and cancellation actions.
* **Actor:** Customer
* **Priority:** High
* **Status:** Implemented
* **Evidence:** [`client/src/pages/customer/MyBookingsPage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/customer/MyBookingsPage.jsx), [`client/src/pages/customer/BookingDetailsPage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/customer/BookingDetailsPage.jsx)

#### BOOK-006 — Customer Booking Cancellation
* **Description:** Customers shall be permitted to cancel bookings in `PENDING_PAYMENT` or `CONFIRMED` states prior to trip start. The system assesses cancellation fees according to policy and releases locked vehicle intervals.
* **Actor:** Customer
* **Priority:** High
* **Status:** Implemented
* **Evidence:** [`server/src/services/booking.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/booking.service.js#L350-L420)

---

### 5.5 Payments & Financial Transactions (`PAY`)

#### PAY-001 — Razorpay Order Generation
* **Description:** The system shall create server-side Razorpay payment orders for bookings in `PENDING_PAYMENT` status, specifying the exact total amount in paise (INR) with metadata notes.
* **Actor:** Customer
* **Priority:** Critical
* **Status:** Implemented
* **Evidence:** [`server/src/services/payment.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/payment.service.js#L14-L60), [`client/src/pages/customer/PaymentPage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/customer/PaymentPage.jsx)

#### PAY-002 — Cryptographic Payment Signature Verification
* **Description:** The system shall verify Razorpay HMAC-SHA256 signatures (`razorpay_order_id|razorpay_payment_id` hashed with `RAZORPAY_KEY_SECRET`) before marking payments as `SUCCESS` and transitioning bookings to `CONFIRMED`.
* **Actor:** System
* **Priority:** Critical
* **Status:** Implemented
* **Evidence:** [`server/src/services/payment.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/payment.service.js#L65-L130)

#### PAY-003 — Payment Failure Handling
* **Description:** The system shall capture payment failure callback events from Razorpay modal dismissals or gateway rejections, logging failure metadata while retaining the booking for retry within the 10-minute hold window.
* **Actor:** Customer / System
* **Priority:** High
* **Status:** Implemented
* **Evidence:** [`server/src/controllers/payment.controller.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/controllers/payment.controller.js#L36-L45)

#### PAY-004 — Automated Payment Gateway Refunds
* **Description:** Upon booking cancellation, the system shall trigger an automatic API refund via the Razorpay Refund API for the calculated net refund amount.
* **Actor:** System
* **Priority:** High
* **Status:** Partially Implemented
* **Evidence:** Refund records tracked in [`payment.model.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/models/payment.model.js#L54-L65); real-time external Razorpay gateway refund API trigger is planned for production payment credentials.

---

### 5.6 Promotional Coupon Management (`COUP`)

#### COUP-001 — Coupon Validation & Application
* **Description:** Customers shall be able to apply promo codes at checkout. The system validates active status, date validity, minimum booking threshold, global usage limit, and per-user usage limits.
* **Actor:** Customer
* **Priority:** Medium
* **Status:** Implemented
* **Evidence:** [`server/src/services/coupon.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/coupon.service.js#L12-L95), [`client/src/pages/customer/CheckoutPage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/customer/CheckoutPage.jsx)

#### COUP-002 — Coupon Administration (CRUD)
* **Description:** Administrators shall create, edit, toggle active status, and delete promotional coupons with percentage or fixed discount values, usage caps, and validity windows.
* **Actor:** Admin
* **Priority:** Medium
* **Status:** Implemented
* **Evidence:** [`server/src/controllers/coupon.controller.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/controllers/coupon.controller.js), [`client/src/features/admin/CouponManager.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/admin/CouponManager.jsx)

---

### 5.7 Vendor Fleet Operations Portal (`VEN`)

#### VEN-001 — Vendor Operations Dashboard & KPI Cards
* **Description:** The system shall provide vendors with real-time operational statistics: fleet status breakdown (Total, Available, Maintenance), rental counts (Active, Upcoming, Completed), and financial metrics (Gross GMV, Net Payouts).
* **Actor:** Vendor
* **Priority:** High
* **Status:** Implemented
* **Evidence:** [`server/src/services/admin.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/admin.service.js), [`client/src/pages/vendor/VendorDashboardPage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/vendor/VendorDashboardPage.jsx)

#### VEN-002 — Vehicle Fleet Management (CRUD)
* **Description:** Vendors shall add new vehicle listings with multi-image Cloudinary upload, brand/model/year specifications, hub pickup address, and tiered rental rates (Hourly, 12h, 24h). Vendors can update details or delete listings.
* **Actor:** Vendor
* **Priority:** High
* **Status:** Implemented
* **Evidence:** [`server/src/controllers/vehicle.controller.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/controllers/vehicle.controller.js), [`client/src/pages/vendor/MyVehiclesPage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/vendor/MyVehiclesPage.jsx)

#### VEN-003 — Quick Vehicle Status Toggle
* **Description:** Vendors shall quickly switch vehicle operating status between `AVAILABLE`, `MAINTENANCE`, and `INACTIVE` from their fleet management list.
* **Actor:** Vendor
* **Priority:** Medium
* **Status:** Implemented
* **Evidence:** [`server/src/controllers/vehicle.controller.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/controllers/vehicle.controller.js#L78-L92), [`client/src/pages/vendor/MyVehiclesPage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/vendor/MyVehiclesPage.jsx)

#### VEN-004 — Offline Walk-In Desk Dispatch
* **Description:** Vendors shall create offline walk-in bookings for customers appearing physically at their hub desk, capturing customer name, phone, driving license number, custom desk rate, and cash/UPI payment collection.
* **Actor:** Vendor
* **Priority:** High
* **Status:** Implemented
* **Evidence:** [`server/src/services/booking.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/booking.service.js#L260-L330), [`client/src/features/vendor/CreateOfflineBookingModal.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/vendor/CreateOfflineBookingModal.jsx)

#### VEN-005 — Vehicle Handover & Trip Start
* **Description:** When dispatching a vehicle, vendors shall record starting odometer reading (km), physical condition notes, and transition booking status to `ACTIVE` and vehicle status to `BOOKED`.
* **Actor:** Vendor
* **Priority:** High
* **Status:** Implemented
* **Evidence:** [`server/src/services/booking.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/booking.service.js#L450-L490), [`client/src/features/vendor/VehicleHandoverModal.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/vendor/VehicleHandoverModal.jsx)

#### VEN-006 — Vehicle Return & Trip Completion
* **Description:** Upon customer return, vendors shall record ending odometer reading, calculate total distance driven, inspect fuel levels, log any damage incidents, assess extra kilometer charges, complete the trip, and release the vehicle to `AVAILABLE`.
* **Actor:** Vendor
* **Priority:** High
* **Status:** Implemented
* **Evidence:** [`server/src/services/booking.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/booking.service.js#L495-L540), [`client/src/features/vendor/VehicleReturnModal.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/vendor/VehicleReturnModal.jsx)

---

### 5.8 Maintenance Management (`MAIN`)

#### MAIN-001 — Fleet Maintenance Scheduling
* **Description:** Vendors shall schedule vehicle service windows (routine, repair, inspection, accident, cleaning) specifying garage details, estimated cost, and start/end dates. The system automatically locks the vehicle interval against customer bookings.
* **Actor:** Vendor
* **Priority:** High
* **Status:** Implemented
* **Evidence:** [`server/src/services/maintenance.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/maintenance.service.js#L12-L65), [`client/src/features/maintenance/ScheduleMaintenanceModal.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/maintenance/ScheduleMaintenanceModal.jsx)

#### MAIN-002 — Maintenance Completion & Vehicle Release
* **Description:** Vendors shall record actual maintenance cost, work performed, and mark maintenance as completed, automatically restoring the vehicle status to `AVAILABLE`.
* **Actor:** Vendor
* **Priority:** High
* **Status:** Implemented
* **Evidence:** [`server/src/services/maintenance.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/maintenance.service.js#L70-L105)

---

### 5.9 Master Admin Governance (`ADM`)

#### ADM-001 — Platform-Wide Analytics & Financial Oversight
* **Description:** Administrators shall access platform KPIs including total registered users, active vendors, vehicle inventory count, gross merchandise value (GMV), platform commission earnings (12%), and vendor payout liabilities.
* **Actor:** Admin
* **Priority:** High
* **Status:** Implemented
* **Evidence:** [`server/src/services/admin.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/admin.service.js#L12-L70), [`client/src/pages/admin/AdminDashboardPage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/admin/AdminDashboardPage.jsx)

#### ADM-002 — Vehicle Listing Moderation Queue
* **Description:** Administrators shall review pending vehicle submissions in an approvals queue, inspect vendor identity and specifications, and approve or reject listings with reasons.
* **Actor:** Admin
* **Priority:** High
* **Status:** Implemented
* **Evidence:** [`server/src/services/admin.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/admin.service.js#L75-L105), [`client/src/pages/admin/AdminDashboardPage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/admin/AdminDashboardPage.jsx)

#### ADM-003 — User & Vendor Governance Directory
* **Description:** Administrators shall view all platform users, filter by role (`CUSTOMER`, `VENDOR`, `ADMIN`), and inspect contact metadata, KYC status, and business profiles.
* **Actor:** Admin
* **Priority:** Medium
* **Status:** Implemented
* **Evidence:** [`server/src/services/admin.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/admin.service.js#L110-L150), [`client/src/pages/admin/AdminDashboardPage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/admin/AdminDashboardPage.jsx)

#### ADM-004 — Global Bookings Audit Trail
* **Description:** Administrators shall view a comprehensive log of all platform bookings (online and offline) with filterable status indicators, financial splits, and customer/vendor associations.
* **Actor:** Admin
* **Priority:** Medium
* **Status:** Implemented
* **Evidence:** [`server/src/services/admin.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/admin.service.js#L155-L185), [`client/src/pages/admin/AdminDashboardPage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/admin/AdminDashboardPage.jsx)

---

### 5.10 Reviews & Feedback (`REV`)

#### REV-001 — Verified Post-Trip Customer Reviews
* **Description:** Customers who completed a rental trip shall be allowed to submit a 1–5 star rating and written review. The system recalculates vehicle average ratings and review counts automatically via database aggregation.
* **Actor:** Customer
* **Priority:** Medium
* **Status:** Implemented
* **Evidence:** [`server/src/models/review.model.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/models/review.model.js#L54-L85), [`client/src/features/reviews/ReviewModal.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/reviews/ReviewModal.jsx)

#### REV-002 — Vehicle Review Feed Display
* **Description:** Public and customer vehicle detail views shall render all verified customer reviews, formatted star badges, and creation timestamps.
* **Actor:** Guest / Customer
* **Priority:** Medium
* **Status:** Implemented
* **Evidence:** [`server/src/controllers/review.controller.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/controllers/review.controller.js#L7-L18), [`client/src/pages/customer/VehicleDetailsPage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/customer/VehicleDetailsPage.jsx)

---

### 5.11 Notifications & In-App Alerts (`NOTIF`)

#### NOTIF-001 — In-App Notification Feed & Badge
* **Description:** The system shall display a notification center in the navigation header with an unread badge count, allowing users to view alerts and mark individual or all notifications as read.
* **Actor:** Authenticated User
* **Priority:** Medium
* **Status:** Implemented
* **Evidence:** [`server/src/controllers/notification.controller.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/controllers/notification.controller.js), [`client/src/features/notifications/NotificationDropdown.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/notifications/NotificationDropdown.jsx)

#### NOTIF-002 — Automated Lifecycle Notification Triggers
* **Description:** The system shall automatically dispatch notification records upon critical lifecycle events: booking confirmation, trip start, trip completion, cancellations, payments, and vehicle approvals.
* **Actor:** System
* **Priority:** Medium
* **Status:** Implemented
* **Evidence:** [`server/src/services/notification.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/notification.service.js)

---

### 5.12 AI & Predictive Analytics Microservice (`AI`)

#### AI-001 — Content-Based Vehicle Recommendations
* **Description:** The system shall rank candidate vehicles using multi-attribute scoring (budget fit, category preferences, fuel type, transmission, popularity, ratings) via the Python FastAPI microservice, backed by a Node.js heuristic fallback engine.
* **Actor:** Customer / Guest
* **Priority:** Medium
* **Status:** Implemented
* **Evidence:** [`ai-service/app/services/recommendation_engine.py`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/ai-service/app/services/recommendation_engine.py), [`server/src/services/ai.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/ai.service.js#L14-L65), [`client/src/features/ai/AiRecommendationsCarousel.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/ai/AiRecommendationsCarousel.jsx)

#### AI-002 — 7-Day Multi-Dimensional Fleet Demand Forecasting
* **Description:** The system shall forecast daily demand indices for the next 7 days across city hubs (Indore, Bhopal, Gwalior) and vehicle categories, outputting daily demand level badges (`LOW`, `MEDIUM`, `HIGH`, `VERY HIGH`, `PEAK`), projected fleet utilization, forecast-driven operational insights, and actionable vendor revenue recommendations.
* **Actor:** Vendor
* **Priority:** Medium
* **Status:** Implemented
* **Evidence:** [`ai-service/app/services/demand_forecaster.py`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/ai-service/app/services/demand_forecaster.py), [`server/src/services/ai.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/ai.service.js), [`client/src/features/ai/DemandForecastWidget.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/ai/DemandForecastWidget.jsx)

#### AI-003 — Dynamic Pricing Multiplier Engine
* **Description:** The system shall calculate optimal, explainable rate multipliers strictly bounded between 0.90x and 1.35x based on a deterministic multi-factor model: low fleet utilization (<30%: -7%) and off-peak weekdays (Tue/Wed: -3%) for value saver pricing (0.90x–0.99x); fleet scarcity (70–84%: +8%, ≥85%: +15%); weekend surges (Fri/Sun: +10%, Sat: +15%); and operational city hub adjustments (Indore: +3%, Bhopal/Gwalior: 0%). The backend (`PricingService.calculatePriceBreakdown`) acts as the single authoritative source of truth for all final payable amounts, while the AI service provides real-time multiplier recommendations with seamless deterministic fallback if offline.
* **Actor:** Vendor / Customer / System
* **Priority:** High
* **Status:** Implemented
* **Evidence:** [`ai-service/app/services/dynamic_pricing_engine.py`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/ai-service/app/services/dynamic_pricing_engine.py), [`server/src/services/pricing.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/pricing.service.js), [`server/src/constants/pricing.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/constants/pricing.js), [`server/src/services/ai.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/ai.service.js), [`client/src/features/booking/PriceBreakdownCard.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/booking/PriceBreakdownCard.jsx)

#### AI-004 — AI-Driven Behavioral Personalized Offers
* **Description:** The system shall recommend tailored promotional discount offers based on customer rental signals (frequently rented vehicle category, duration, average spending value). Server-side pricing and coupon validation services remain strictly authoritative over discount eligibility and financial rules.
* **Actor:** Customer
* **Priority:** Medium
* **Status:** Implemented
* **Evidence:** [`ai-service/app/services/personalized_offer_engine.py`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/ai-service/app/services/personalized_offer_engine.py), [`server/src/services/ai.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/ai.service.js), [`client/src/features/ai/PersonalizedOfferBanner.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/ai/PersonalizedOfferBanner.jsx)

#### AI-005 — Conversational AI Rental Assistant
* **Description:** The system shall provide a floating conversational assistant capable of vehicle discovery, availability queries, rental plan explanations, pricing breakdowns, and policy navigation. To enforce transactional security, the assistant never completes transactions directly, instead rendering verified vehicle cards with direct links to the authoritative checkout workflow.
* **Actor:** Customer / Guest
* **Priority:** High
* **Status:** Implemented
* **Evidence:** [`ai-service/app/services/rental_assistant_engine.py`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/ai-service/app/services/rental_assistant_engine.py), [`server/src/services/ai.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/ai.service.js), [`client/src/features/ai/AiRentalAssistant.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/ai/AiRentalAssistant.jsx)

---

### 5.13 Platform Infrastructure & Security (`PLAT`)

#### PLAT-001 — Dual-Mode MongoDB Atlas with In-Memory Fallback
* **Description:** The backend shall connect to MongoDB Atlas by default, but automatically fall back to an ephemeral `mongodb-memory-server` if Atlas is unreachable, seeding standard initial categories, users, and vehicles to guarantee zero setup disruption.
* **Actor:** System
* **Priority:** Critical
* **Status:** Implemented
* **Evidence:** [`server/src/config/db.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/config/db.js#L14-L85)

#### PLAT-002 — API Rate Limiting
* **Description:** The system shall protect authentication endpoints (`10 requests / 15 mins`) and general API endpoints (`200 requests / 15 mins`) against brute force and DDoS abuse using IP-based window tracking.
* **Actor:** System
* **Priority:** High
* **Status:** Implemented
* **Evidence:** [`server/src/middleware/rateLimiter.middleware.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/middleware/rateLimiter.middleware.js)

#### PLAT-003 — Request Validation Pipeline
* **Description:** All incoming HTTP requests modifying system state shall be strictly validated using Zod schemas before reaching business logic controllers. Invalid payloads must return `400 Bad Request` with structured error messages.
* **Actor:** System
* **Priority:** High
* **Status:** Implemented
* **Evidence:** [`server/src/middleware/validate.middleware.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/middleware/validate.middleware.js), [`server/src/validators/*.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/validators)

---

## 6. Non-Functional Requirements Summary

| NFR ID | Category | Specification | Status | Evidence |
| :--- | :--- | :--- | :---: | :--- |
| **NFR-SEC-01** | Security | Passwords hashed using bcrypt (salt rounds: 10) prior to persistence. | Implemented | [`user.model.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/models/user.model.js#L86-L95) |
| **NFR-SEC-02** | Security | HTTP security response headers configured via `helmet`. | Implemented | [`server/src/app.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/app.js#L15) |
| **NFR-SEC-03** | Security | Service-to-service API key validation for AI microservice comms. | Implemented | [`ai-service/app/core/security.py`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/ai-service/app/core/security.py) |
| **NFR-PERF-01** | Performance | Compound indexes on high-frequency availability and search query fields. | Implemented | [`booking.model.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/models/booking.model.js#L110-L115), [`vehicle.model.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/models/vehicle.model.js#L141-L145) |
| **NFR-REL-01** | Reliability | Server-side collision validation with mathematical non-overlap invariants. | Implemented | [`booking.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/booking.service.js#L16-L78) |
| **NFR-RES-01** | Resilience | Heuristic fallback algorithms executed if Python AI microservice is offline. | Implemented | [`server/src/services/ai.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/ai.service.js#L45-L65) |
