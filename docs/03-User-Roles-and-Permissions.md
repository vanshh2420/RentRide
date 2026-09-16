# 03 — User Roles & Permissions

> **Document Type:** Role-Based Access Control (RBAC) Specification & Permission Matrix  
> **Application:** RentRide Multi-Vendor Vehicle Rental Marketplace  
> **Status:** Verified from Live Implementation  
> **Version:** 1.3.0  
> **Date:** 2026-09-03  

---

## 1. Role Architecture Overview

RentRide implements a strict, dual-layer Role-Based Access Control (RBAC) model across both backend API routes and frontend client navigation. 

Role definitions are centralized in [`server/src/constants/roles.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/constants/roles.js) and mirrored in [`client/src/constants/roles.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/constants/roles.js):

```javascript
export const ROLES = {
  CUSTOMER: 'CUSTOMER',
  VENDOR: 'VENDOR',
  ADMIN: 'ADMIN'
};
```

### Authorization Enforcement Mechanisms

1. **Backend Route Guards:**
   * **Authentication Middleware ([`protect`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/middleware/auth.middleware.js)):** Validates JWT bearer tokens passed via `Authorization: Bearer <token>` header or `token` HttpOnly cookie. Attaches the decoded user document to `req.user`. Returns `401 Unauthorized` if invalid or missing.
   * **Role Middleware ([`authorize(...roles)`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/middleware/role.middleware.js)):** Verifies that `req.user.role` is included in the allowed roles. Rejection returns `403 Forbidden` with an explicit `ApiError`.

2. **Frontend Route Guards:**
   * **[`ProtectedRoute`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/components/navigation/ProtectedRoute.jsx):** Checks if the user is authenticated in the Redux `authSlice`. Unauthenticated visitors are redirected to `/login` with return URL state.
   * **[`RoleRoute`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/components/navigation/ProtectedRoute.jsx):** Checks if `user.role` matches `allowedRoles`. Unauthorized users are redirected to their designated dashboard (e.g. vendors to `/vendor/dashboard`, admins to `/admin/dashboard`, customers to `/`).

---

## 2. Granular Role Specifications

### 2.1 Unauthenticated Guest (`GUEST`)
* **Role Summary:** Public web visitors who have not authenticated with credentials.
* **Permissions:**
  * Browse marketplace home, category explorer, vehicle explore catalog, and rental plan comparisons.
  * Search vehicles by city hub, category, fuel type, transmission, seating, and price range.
  * View vehicle details, specifications, images, and public customer review feeds.
  * Check vehicle interval availability and estimated rental rates.
  * Register new accounts as a Customer or Vendor; log in to existing accounts.
* **Accessible Pages:**
  * `/` (Home), `/explore`, `/categories`, `/rental-plans`, `/pricing`, `/vehicles/:id`, `/login`, `/register`, `/vendor/register`, `/404`
* **Accessible APIs:**
  * `GET /api/categories`, `GET /api/categories/:id`
  * `GET /api/vehicles`, `GET /api/vehicles/:id`
  * `POST /api/bookings/check-availability`
  * `POST /api/coupons/validate`
  * `GET /api/reviews/vehicle/:vehicleId`
  * `POST /api/auth/register`, `POST /api/auth/login`
  * `GET /api/ai/recommendations`
* **Restricted Functionality:** Cannot create reservations, initiate payments, access user profiles, manage vehicles, or access dashboards.

---

### 2.2 Retail Customer (`CUSTOMER`)
* **Role Summary:** Registered consumers who search, reserve, pay for, and rent vehicles for personal use.
* **Permissions:**
  * All permissions of `GUEST`.
  * Manage personal customer profile, avatar, and contact info; provide driving license number.
  * Create online booking reservations (`PENDING_PAYMENT`) with 10-minute inventory locks.
  * Initiate and complete online payments through Razorpay gateway.
  * View personal booking history, digital rental receipts, and tracking statuses.
  * Cancel bookings in pending or confirmed states prior to trip start.
  * Receive automated in-app notifications (booking confirmations, trip updates).
  * Submit post-trip star ratings (1–5) and reviews for completed rentals.
* **Accessible Pages:**
  * All `GUEST` pages.
  * `/profile`, `/checkout/:id`, `/payment/:id`, `/my-bookings`, `/bookings/:id`
* **Accessible APIs:**
  * `GET /api/auth/me`, `POST /api/auth/logout`, `PUT /api/auth/change-password`
  * `GET /api/users/profile`, `PATCH /api/users/profile`, `PUT /api/users/profile`
  * `POST /api/bookings/online`
  * `GET /api/bookings/my-bookings`, `GET /api/bookings/:id`, `POST /api/bookings/:id/cancel`
  * `POST /api/payments/razorpay/create-order`, `POST /api/payments/razorpay/verify`, `POST /api/payments/razorpay/fail`, `GET /api/payments/history`
  * `POST /api/reviews`
  * `GET /api/notifications`, `PATCH /api/notifications/:id/read`, `PATCH /api/notifications/read-all`
* **Restricted Functionality:** Cannot access vendor dispatch portal (`/vendor/*`), create vehicle listings, start/complete trips, manage maintenance, or access admin controls (`/admin/*`).

---

### 2.3 Fleet Vendor (`VENDOR`)
* **Role Summary:** Fleet owners and commercial rental operators who provide vehicles, manage maintenance, dispatch walk-ins, and execute physical vehicle handovers.
* **Permissions:**
  * Manage vendor business profile (business name, GST number, operating hub address).
  * Access Vendor Operations Dashboard with fleet and earnings KPIs.
  * Create, update, and delete owned vehicle listings; upload vehicle images to Cloudinary CDN.
  * Toggle vehicle operating status (`AVAILABLE`, `MAINTENANCE`, `INACTIVE`).
  * View unified bookings across their vehicle fleet (online + offline).
  * Create offline walk-in bookings with desk rate overrides and cash/UPI collection.
  * Execute vehicle trip handovers: record start odometer (km) and trip condition notes.
  * Execute vehicle returns: record end odometer, distance driven, fuel level, damages, and extra km charges.
  * Schedule fleet maintenance windows to lock vehicle availability; log completion costs.
  * View 7-day city fleet demand forecasts and AI dynamic pricing suggestions.
* **Accessible Pages:**
  * `/vendor/dashboard`, `/vendor/vehicles`, `/vendor/bookings`, `/vendor/maintenance`, `/vendor/earnings`, `/vendor/forecast`, `/profile`
* **Accessible APIs:**
  * All basic user auth APIs (`/api/auth/*`, `/api/users/*`).
  * `GET /api/vehicles/vendor/my-vehicles`
  * `POST /api/vehicles`, `PUT /api/vehicles/:id`, `DELETE /api/vehicles/:id`, `PATCH /api/vehicles/:id/status`
  * `GET /api/vendor/stats`, `GET /api/vendor/bookings`
  * `POST /api/vendor/bookings/offline`
  * `POST /api/vendor/bookings/:id/start-trip`, `POST /api/vendor/bookings/:id/complete-trip`
  * `GET /api/maintenance/vendor`, `POST /api/maintenance`, `PATCH /api/maintenance/:id/complete`
  * `GET /api/coupons` (read-only view for vendor operations)
  * `GET /api/ai/demand-forecast`, `POST /api/ai/dynamic-pricing`
* **Restricted Functionality:** Cannot book vehicles via customer checkout, access admin governance panels (`/admin/*`), approve vehicle listings, or manage platform coupons.

---

### 2.4 Platform Administrator (`ADMIN`)
* **Role Summary:** Master operators with global governance authority over the marketplace.
* **Permissions:**
  * Access Master Admin Dashboard with platform GMV, commission revenue (12%), and payout metrics.
  * Review and moderate newly submitted vehicle listings (Approve to `AVAILABLE` or Reject to `INACTIVE`).
  * View all registered platform users, vendors, and administrators.
  * Audit all platform bookings (online and offline) with full financial split visibility.
  * Manage vehicle categories (Create, Update, Delete).
  * Manage promotional coupons (Create, Edit, Toggle Status, Delete).
  * Has cross-role inheritance over Vendor operations (can view and manage vendor endpoints).
* **Accessible Pages:**
  * `/admin/dashboard`, `/admin/vehicles`, `/admin/users`, `/admin/bookings`, `/admin/coupons`, `/admin/revenue`, `/profile`
* **Accessible APIs:**
  * `GET /api/admin/stats`
  * `GET /api/admin/vehicles`, `PATCH /api/admin/vehicles/:id/approval`
  * `GET /api/admin/users`
  * `GET /api/admin/bookings`
  * `POST /api/categories`, `PUT /api/categories/:id`, `DELETE /api/categories/:id`
  * `POST /api/coupons`, `PUT /api/coupons/:id`, `DELETE /api/coupons/:id`, `PATCH /api/coupons/:id/status`, `GET /api/coupons/:id`
  * All vendor APIs (`/api/vendor/*`, `/api/maintenance/*`, `/api/vehicles/*`)
* **Restricted Functionality:** Cannot initiate retail customer checkouts using admin role credentials.

---

## 3. Comprehensive Permission Matrix

The following matrix documents feature authorization verified directly from route guards and controller code:

| Platform Feature / Action | Guest | Customer | Vendor | Admin | Guard Mechanism |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Browse Marketplace & Categories** | ✓ | ✓ | ✓ | ✓ | Public Route |
| **Search & Filter Vehicles** | ✓ | ✓ | ✓ | ✓ | Public Route |
| **Check Interval Availability** | ✓ | ✓ | ✓ | ✓ | Public Route |
| **View Vehicle Specifications** | ✓ | ✓ | ✓ | ✓ | Public Route |
| **View Verified Customer Reviews** | ✓ | ✓ | ✓ | ✓ | Public Route |
| **Register & Login** | ✓ | ✓ | ✓ | ✓ | Public Route / `authRateLimiter` |
| **View/Edit Personal Profile** | ✗ | ✓ | ✓ | ✓ | `protect` |
| **Upload Avatar Image** | ✗ | ✓ | ✓ | ✓ | `protect`, Multer + Cloudinary |
| **Change Password** | ✗ | ✓ | ✓ | ✓ | `protect` |
| **View Notification Feed** | ✗ | ✓ | ✓ | ✓ | `protect` |
| **Create Online Booking** | ✗ | ✓ | ✗ | ✗ | `protect`, `RoleRoute([CUSTOMER])` |
| **Initiate Razorpay Payment** | ✗ | ✓ | ✗ | ✗ | `protect`, `RoleRoute([CUSTOMER])` |
| **Verify Payment Signature** | ✗ | ✓ | ✗ | ✗ | `protect`, `validate(verifyPaymentSchema)` |
| **View Personal Bookings** | ✗ | ✓ | ✗ | ✗ | `protect`, `RoleRoute([CUSTOMER])` |
| **Cancel Personal Booking** | ✗ | ✓ | ✗ | ✗ | `protect` (ownership checked in service) |
| **Submit Customer Review** | ✗ | ✓ | ✗ | ✗ | `protect` (verified trip checked in service) |
| **Access Vendor Operations Portal** | ✗ | ✗ | ✓ | ✓ | `protect`, `authorize(VENDOR, ADMIN)` |
| **Add / Edit / Delete Owned Vehicles** | ✗ | ✗ | ✓ | ✓ | `protect`, `authorize(VENDOR, ADMIN)` |
| **Toggle Vehicle Operating Status** | ✗ | ✗ | ✓ | ✓ | `protect`, `authorize(VENDOR, ADMIN)` |
| **View Fleet Unified Bookings** | ✗ | ✗ | ✓ | ✓ | `protect`, `authorize(VENDOR, ADMIN)` |
| **Create Offline Walk-in Booking** | ✗ | ✗ | ✓ | ✓ | `protect`, `authorize(VENDOR, ADMIN)` |
| **Start Trip (Handover & Odometer)** | ✗ | ✗ | ✓ | ✓ | `protect`, `authorize(VENDOR, ADMIN)` |
| **Complete Trip (Return & Extra Km)** | ✗ | ✗ | ✓ | ✓ | `protect`, `authorize(VENDOR, ADMIN)` |
| **Schedule Fleet Maintenance** | ✗ | ✗ | ✓ | ✓ | `protect`, `authorize(VENDOR, ADMIN)` |
| **Complete Maintenance & Release** | ✗ | ✗ | ✓ | ✓ | `protect`, `authorize(VENDOR, ADMIN)` |
| **View AI Demand Forecast** | ✗ | ✗ | ✓ | ✓ | `protect`, `authorize(VENDOR, ADMIN)` |
| **Calculate Dynamic Pricing** | ✗ | ✗ | ✓ | ✓ | `protect`, `authorize(VENDOR, ADMIN)` |
| **Access Master Admin Dashboard** | ✗ | ✗ | ✗ | ✓ | `protect`, `authorize(ADMIN)` |
| **Moderate / Approve Vehicles** | ✗ | ✗ | ✗ | ✓ | `protect`, `authorize(ADMIN)` |
| **View All Users & KYC Directory** | ✗ | ✗ | ✗ | ✓ | `protect`, `authorize(ADMIN)` |
| **Audit Platform Bookings & GMV** | ✗ | ✗ | ✗ | ✓ | `protect`, `authorize(ADMIN)` |
| **Create / Edit / Delete Coupons** | ✗ | ✗ | ✗ | ✓ | `protect`, `authorize(ADMIN)` |
| **Create / Edit / Delete Categories** | ✗ | ✗ | ✗ | ✓ | `protect`, `authorize(ADMIN)` |
