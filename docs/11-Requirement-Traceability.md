# 11 — Requirement Traceability Matrix (RTM)

> **Document Type:** End-to-End Requirement Traceability Matrix & Gap Analysis  
> **Application:** RentRide Multi-Vendor Vehicle Rental Marketplace  
> **Status:** Fully Mapped & Cross-Verified  
> **Version:** 1.3.0  
> **Date:** 2026-09-03  

---

## 1. Traceability Architecture

The Requirement Traceability Matrix (RTM) establishes bidirectional traceability across all tiers of the RentRide marketplace:
$$\text{Requirement ID} \longrightarrow \text{Feature} \longrightarrow \text{Frontend} \longrightarrow \text{REST API} \longrightarrow \text{Backend Service} \longrightarrow \text{Database Model} \longrightarrow \text{Test Case}$$

---

## 2. Master Traceability Matrix Table

| Req ID | Feature Name | Frontend Component / Page | REST API Route | Backend Controller / Service | Database Model | Test Case ID |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **AUTH-001** | User Registration | `RegisterPage.jsx`, `RegisterForm.jsx` | `POST /api/auth/register` | `auth.controller.js`, `auth.service.js` | `User` | `TC-AUTH-001`, `TC-AUTH-002` |
| **AUTH-002** | User Login & JWT | `LoginPage.jsx`, `LoginForm.jsx` | `POST /api/auth/login` | `auth.controller.js`, `auth.service.js` | `User` | `TC-AUTH-003`, `TC-AUTH-004` |
| **AUTH-003** | Session Logout | `Navbar.jsx` | `POST /api/auth/logout` | `auth.controller.js` | — | `TC-AUTH-003` |
| **AUTH-004** | Session Verify (`/me`) | `App.jsx`, `authSlice.js` | `GET /api/auth/me` | `auth.controller.js` | `User` | `TC-AUTH-003` |
| **AUTH-005** | Role-Based Access | `ProtectedRoute.jsx`, `RoleRoute.jsx` | All protected routes | `auth.middleware.js`, `role.middleware.js` | `User` | `TC-AUTH-005` to `TC-AUTH-009` |
| **USER-001** | View User Profile | `ProfilePage.jsx` | `GET /api/users/profile` | `user.controller.js`, `user.service.js` | `User` | `TC-USER-001` |
| **USER-002** | Update Profile & KYC | `ProfilePage.jsx` | `PATCH /api/users/profile` | `user.controller.js`, `user.service.js` | `User` | `TC-USER-002` |
| **USER-003** | Avatar Upload | `ProfilePage.jsx` | `PATCH /api/users/profile` (multipart) | `upload.middleware.js`, `cloudinary.js` | `User` | `TC-USER-002` |
| **USER-004** | Change Password | `ProfilePage.jsx` | `PATCH /api/users/change-password` | `user.controller.js`, `user.service.js` | `User` | `TC-USER-003` to `TC-USER-005` |
| **VEH-001** | Category Browsing | `CategoriesPage.jsx`, `HomePage.jsx` | `GET /api/categories` | `category.controller.js` | `Category` | `TC-VEH-001` |
| **VEH-002** | Faceted Fleet Search | `ExplorePage.jsx`, `VehicleCard.jsx` | `GET /api/vehicles` | `vehicle.controller.js`, `vehicle.service.js`| `Vehicle` | `TC-VEH-002`, `TC-VEH-003` |
| **VEH-003** | Hub City Autocomplete | `CityAutocomplete.jsx` | `GET /api/vehicles?city=...` | `vehicle.service.js` | `Vehicle` | `TC-VEH-004`, `TC-VEH-005` |
| **VEH-004** | Vehicle Details View | `VehicleDetailsPage.jsx` | `GET /api/vehicles/:id` | `vehicle.controller.js`, `vehicle.service.js`| `Vehicle` | `TC-VEH-006` |
| **VEH-005** | Interactive Map View | `MapView.jsx`, `ExplorePage.jsx` | `GET /api/vehicles` | `MapView.jsx`, `vehicle.service.js` | `Vehicle` | `TC-VEH-002` |
| **VEH-006** | Fuel Economy & Mileage | `AddVehicleModal.jsx`, `VehicleDetailsPage.jsx` | `POST /api/vehicles`, `PUT /api/vehicles/:id` | `vehicle.model.js`, `vehicle.validator.js` | `Vehicle` | `TC-VEH-006` |
| **VEH-007** | Nearest Available Rides | `ExplorePage.jsx` (Near Me) | `GET /api/vehicles/nearby` | `vehicle.service.js`, `vehicle.controller.js` | `Vehicle`, `Booking` | `TC-VEH-002` |
| **VEH-008** | Vendor Pickup Hub Map | `VehicleDetailsPage.jsx`, `MapView.jsx` | `GET /api/vehicles/:id` | `MapView.jsx` | `Vehicle` | `TC-VEH-006` |
| **BOOK-001** | Zero-Collision Logic | `VehicleDetailsPage.jsx`, `CheckoutPage.jsx` | `POST /api/bookings/check-availability` | `booking.service.js` | `Booking`, `Maintenance` | `TC-BOOK-001` to `TC-BOOK-009` |
| **BOOK-002** | Pricing & Surge Engine | `RentalPlansPage.jsx`, `CheckoutPage.jsx` | `POST /api/bookings/check-availability` | `pricing.service.js` | `Booking` | `TC-BOOK-010` |
| **BOOK-003** | 10-Min Reservation Lock | `CheckoutPage.jsx` | `POST /api/bookings/online` | `booking.service.js` | `Booking` | `TC-BOOK-011` |
| **BOOK-004** | Online Booking Creation | `CheckoutPage.jsx` | `POST /api/bookings/online` | `booking.controller.js`, `booking.service.js`| `Booking` | `TC-BOOK-009` |
| **BOOK-005** | Customer Bookings List | `MyBookingsPage.jsx`, `BookingDetailsPage.jsx` | `GET /api/bookings/my-bookings` | `booking.controller.js`, `booking.service.js`| `Booking` | `TC-BOOK-009` |
| **BOOK-006** | Booking Cancellation | `MyBookingsPage.jsx` | `POST /api/bookings/:id/cancel` | `booking.controller.js`, `booking.service.js`| `Booking`, `Payment` | `TC-BOOK-012` |
| **PAY-001** | Razorpay Order Creation | `PaymentPage.jsx` | `POST /api/payments/razorpay/create-order` | `payment.controller.js`, `payment.service.js`| `Payment`, `Booking` | `TC-PAY-001` |
| **PAY-002** | Signature Verification | `PaymentPage.jsx` | `POST /api/payments/razorpay/verify` | `payment.controller.js`, `payment.service.js`| `Payment`, `Booking` | `TC-PAY-002`, `TC-PAY-003` |
| **PAY-003** | Payment Failure Log | `PaymentPage.jsx` | `POST /api/payments/razorpay/fail` | `payment.controller.js`, `payment.service.js`| `Payment` | `TC-PAY-001` |
| **PAY-004** | Gateway Refunds | `BookingDetailsPage.jsx` | `POST /api/bookings/:id/cancel` | `payment.service.js` | `Payment` | `TC-BOOK-012` |
| **COUP-001** | Coupon Validation | `CheckoutPage.jsx` | `POST /api/coupons/validate` | `coupon.controller.js`, `coupon.service.js` | `Coupon` | `TC-BOOK-010` |
| **COUP-002** | Coupon CRUD & Toggle | `CouponManager.jsx` | `POST /api/coupons`, `DELETE /api/coupons/:id`| `coupon.controller.js`, `coupon.service.js` | `Coupon` | `TC-ADM-001` |
| **VEN-001** | Vendor Dashboard KPIs | `VendorDashboardPage.jsx` | `GET /api/vendor/stats` | `vendor.controller.js`, `admin.service.js` | `Booking`, `Vehicle` | `TC-AUTH-006` |
| **VEN-002** | Vendor Fleet CRUD | `MyVehiclesPage.jsx`, `AddVehicleModal.jsx` | `POST /api/vehicles`, `PUT /api/vehicles/:id` | `vehicle.controller.js`, `vehicle.service.js`| `Vehicle` | `TC-VEH-004` |
| **VEN-003** | Vehicle Status Toggle | `MyVehiclesPage.jsx` | `PATCH /api/vehicles/:id/status` | `vehicle.controller.js` | `Vehicle` | `TC-VEH-004` |
| **VEN-004** | Walk-in Offline Booking | `CreateOfflineBookingModal.jsx` | `POST /api/vendor/bookings/offline` | `vendor.controller.js`, `booking.service.js` | `Booking`, `Payment` | `TC-VEN-001` |
| **VEN-005** | Vehicle Handover | `VehicleHandoverModal.jsx` | `POST /api/vendor/bookings/:id/start-trip` | `vendor.controller.js`, `booking.service.js` | `Booking`, `Vehicle` | `TC-VEN-002` |
| **VEN-006** | Vehicle Return & Extra Km | `VehicleReturnModal.jsx` | `POST /api/vendor/bookings/:id/complete-trip`| `vendor.controller.js`, `booking.service.js` | `Booking`, `Vehicle` | `TC-VEN-003` |
| **MAIN-001** | Schedule Maintenance | `ScheduleMaintenanceModal.jsx` | `POST /api/maintenance` | `maintenance.controller.js`, `service.js` | `Maintenance`, `Vehicle` | `TC-MAIN-001` |
| **MAIN-002** | Complete Maintenance | `VendorDashboardPage.jsx` | `PATCH /api/maintenance/:id/complete` | `maintenance.controller.js`, `service.js` | `Maintenance`, `Vehicle` | `TC-MAIN-001` |
| **ADM-001** | Platform Analytics | `AdminDashboardPage.jsx` | `GET /api/admin/stats` | `admin.controller.js`, `admin.service.js` | `Booking`, `User`, `Vehicle` | `TC-AUTH-007` |
| **ADM-002** | Vehicle Moderation Queue | `AdminDashboardPage.jsx` | `PATCH /api/admin/vehicles/:id/approval` | `admin.controller.js`, `admin.service.js` | `Vehicle` | `TC-ADM-001`, `TC-ADM-002` |
| **ADM-003** | User Management | `AdminDashboardPage.jsx` | `GET /api/admin/users` | `admin.controller.js`, `admin.service.js` | `User` | `TC-AUTH-008` |
| **ADM-004** | Global Bookings Audit | `AdminDashboardPage.jsx` | `GET /api/admin/bookings` | `admin.controller.js`, `admin.service.js` | `Booking` | `TC-AUTH-008` |
| **REV-001** | Submit Post-Trip Review | `ReviewModal.jsx` | `POST /api/reviews` | `review.controller.js`, `review.model.js` | `Review`, `Vehicle` | `TC-REV-001`, `TC-REV-002` |
| **REV-002** | Vehicle Review Feed | `VehicleDetailsPage.jsx` | `GET /api/reviews/vehicle/:vehicleId` | `review.controller.js` | `Review` | `TC-REV-001` |
| **NOTIF-001**| In-App Notification Bell | `NotificationDropdown.jsx`, `Navbar.jsx` | `GET /api/notifications` | `notification.controller.js` | `Notification` | `TC-AUTH-003` |
| **NOTIF-002**| Lifecycle Alerts Dispatch| Contextual Event Emitters | Internal trigger in services | `notification.service.js` | `Notification` | `TC-VEN-001` |
| **AI-001** | AI Vehicle Recommendations | `AiRecommendationsCarousel.jsx` | `GET /api/ai/recommendations` | `ai.controller.js`, `ai.service.js` | `Vehicle` | `TC-VEH-002` |
| **AI-002** | 7-Day Demand Forecast | `DemandForecastWidget.jsx` | `GET /api/ai/demand-forecast` | `ai.controller.js`, `ai.service.js` | `Vehicle` | `TC-VEN-001` |
| **AI-003** | Dynamic Pricing Multiplier | `DemandForecastWidget.jsx` | `POST /api/ai/dynamic-pricing` | `ai.controller.js`, `ai.service.js` | `Vehicle` | `TC-BOOK-010` |
| **AI-004** | AI Personalized Offers | `PersonalizedOfferBanner.jsx` | `GET /api/ai/personalized-offers` | `ai.service.js`, `personalized_offer_engine.py` | `Coupon`, `Booking` | `TC-BOOK-010` |
| **AI-005** | AI Rental Assistant | `AiRentalAssistant.jsx` | `POST /api/ai/assistant` | `ai.service.js`, `rental_assistant_engine.py` | `Vehicle`, `Category` | `TC-VEH-002` |
| **PLAT-001**| Dual Mongo DB with Seeder | Backend Startup Pipeline | Automated startup hook | `server/src/config/db.js` | All Models | `TC-AUTH-001` |
| **PLAT-002**| Rate Limiting Engine | Express Server Pipeline | Global middleware | `rateLimiter.middleware.js` | — | `TC-AUTH-003` |
| **PLAT-003**| Zod Validation Pipeline | Express Server Pipeline | Route middleware | `validate.middleware.js` | — | `TC-USER-003` |

---

## 3. Traceability Gap Analysis

### 3.1 Requirements Without Full Implementation
* **`AUTH-006` (Password Reset via Email):** Documented as planned in legacy roadmaps; no backend mailer transport (Nodemailer/SendGrid) or reset token database fields exist.
* **`PAY-004` (Automated Gateway Refund Call):** Refund calculation and refund audit fields exist in `Payment` model and `booking.service.js`, but automated HTTP dispatch to Razorpay Refunds API is partially stubbed.
* **`AI-004/005` (AI Inference Engines):** Core API routes exist, but the Python-based recommendation and assistant engines currently return mock inference results.

### 3.2 APIs Without Documented Frontend Triggers
* `DELETE /api/categories/:id`: Exists in `category.routes.js` with admin protection, but no UI button currently exposes category deletion on the client admin panel (categories are managed primarily via seed scripts).

### 3.3 Models Without Orphaned Logic
* Every single Mongoose model (`User`, `Vehicle`, `Category`, `Booking`, `Payment`, `Coupon`, `Review`, `Notification`, `Maintenance`) has active corresponding routes, controllers, and services in the codebase. Zero orphaned models were discovered.
