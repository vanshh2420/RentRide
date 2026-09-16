# 02 — Requirements & Specifications

This document outlines the functional and non-functional requirements implemented or inferred from the current RentRide codebase.

---

## Status Legend
* ✅ **Implemented**: Fully built and verified in the codebase.
* 🟡 **Partially Implemented**: Core logic exists; supplementary features, integrations, or edge cases remain.
* ❌ **Not Implemented**: Identified as a requirement or planned item but no code implementation exists.
* ❓ **Unknown**: Cannot be definitively determined from the current codebase.

---

## Functional Requirements

### 1. Authentication & User Management
| ID | Requirement | Description | Status | Evidence |
| :--- | :--- | :--- | :---: | :--- |
| **FR-AUTH-01** | User Registration | Customers and Vendors can register with name, email, password, phone, and optional role-specific metadata. | ✅ | [`server/src/controllers/auth.controller.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/controllers/auth.controller.js#L7-L23), [`client/src/features/auth/RegisterForm.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/auth/RegisterForm.jsx) |
| **FR-AUTH-02** | User Login & JWT Issuance | Authenticate users via email/password; return JWT token in JSON response and set HttpOnly cookie. | ✅ | [`server/src/controllers/auth.controller.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/controllers/auth.controller.js#L28-L51), [`client/src/features/auth/LoginForm.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/auth/LoginForm.jsx) |
| **FR-AUTH-03** | Profile Management | Authenticated users can view and update their profile details (phone, avatar, driving license, vendor address). | ✅ | [`server/src/controllers/user.controller.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/controllers/user.controller.js), [`client/src/pages/customer/ProfilePage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/customer/ProfilePage.jsx) |
| **FR-AUTH-04** | Password Change | Authenticated users can update their password after verifying their old password. | ✅ | [`server/src/controllers/auth.controller.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/controllers/auth.controller.js#L78-L98) |
| **FR-AUTH-05** | Role-Based Access Control | Enforce strict authorization separating `CUSTOMER`, `VENDOR`, and `ADMIN` routes. | ✅ | [`server/src/middleware/role.middleware.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/middleware/role.middleware.js), [`client/src/components/navigation/ProtectedRoute.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/components/navigation/ProtectedRoute.jsx) |
| **FR-AUTH-06** | Password Reset via Email | Send secure reset tokens via email when a user forgets their password. | ❌ | *Not implemented in current codebase (no email service integration found).* |

### 2. Vehicle Catalog & Inventory
| ID | Requirement | Description | Status | Evidence |
| :--- | :--- | :--- | :---: | :--- |
| **FR-VEH-01** | Vehicle Categorization | Vehicles belong to categories (Two-Wheelers / Four-Wheelers) with icon, slug, and description. | ✅ | [`server/src/models/category.model.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/models/category.model.js), [`client/src/pages/customer/CategoriesPage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/customer/CategoriesPage.jsx) |
| **FR-VEH-02** | Search & Multi-Filter Engine | Search vehicles by city, category, fuel type, transmission, seating capacity, price range, and sort order. | ✅ | [`server/src/services/vehicle.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/vehicle.service.js#L235-L310), [`client/src/pages/customer/ExplorePage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/customer/ExplorePage.jsx) |
| **FR-VEH-03** | City Autocomplete Selection | Filter vehicles across supported operational cities (Indore, Bhopal, Gwalior). | ✅ | [`client/src/components/common/CityAutocomplete.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/components/common/CityAutocomplete.jsx), [`client/src/constants/cities.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/constants/cities.js) |
| **FR-VEH-04** | Vehicle Listing Creation | Vendors and Admins can create vehicle listings with tiered rates, specs, address, and multiple image uploads. | ✅ | [`server/src/controllers/vehicle.controller.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/controllers/vehicle.controller.js#L8-L22), [`client/src/features/vendor/AddVehicleModal.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/vendor/AddVehicleModal.jsx) |
| **FR-VEH-05** | Vehicle Moderation / Approval | Admins can approve, reject, or flag newly listed vehicles before public visibility. | ✅ | [`server/src/services/admin.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/admin.service.js#L75-L105), [`client/src/pages/admin/AdminDashboardPage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/admin/AdminDashboardPage.jsx) |

### 3. Booking, Collision Engine & Rental Plans
| ID | Requirement | Description | Status | Evidence |
| :--- | :--- | :--- | :---: | :--- |
| **FR-BKG-01** | Zero-Collision Availability Check | Prevent double-booking across online reservations, walk-in offline bookings, and maintenance downtime using interval overlap queries. | ✅ | [`server/src/services/booking.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/booking.service.js#L16-L78) |
| **FR-BKG-02** | Multi-Plan Pricing Calculator | Calculate server-authoritative rates across `HOURLY`, `12_HOURS`, and `24_HOURS` rental plans. | ✅ | [`server/src/services/pricing.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/pricing.service.js#L9-L122) |
| **FR-BKG-03** | Temporary Checkout Inventory Lock | Place a 10-minute temporary reservation lock on a vehicle during checkout to avoid race conditions. | ✅ | [`server/src/models/booking.model.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/models/booking.model.js#L100-L103), [`server/src/services/booking.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/booking.service.js#L41-L44) |
| **FR-BKG-04** | Walk-In Offline Bookings | Vendors can record walk-in customers with name, phone, license, and cash payment, syncing availability. | ✅ | [`server/src/services/booking.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/booking.service.js#L260-L330), [`client/src/features/vendor/CreateOfflineBookingModal.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/vendor/CreateOfflineBookingModal.jsx) |
| **FR-BKG-05** | Trip Handover & Return | Vendors can start trips (logging start odometer & optional OTP) and complete trips (calculating extra km charges). | ✅ | [`server/src/services/booking.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/booking.service.js#L450-L540), [`client/src/features/vendor/VehicleHandoverModal.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/vendor/VehicleHandoverModal.jsx) |
| **FR-BKG-06** | Booking Cancellation & Refunds | Customers can cancel pending/confirmed bookings; calculate cancellation fee and refund amount. | ✅ | [`server/src/services/booking.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/booking.service.js#L350-L420) |

### 4. Payments, Coupons & Financials
| ID | Requirement | Description | Status | Evidence |
| :--- | :--- | :--- | :---: | :--- |
| **FR-PAY-01** | Razorpay Order Creation | Create server-side Razorpay orders for online bookings with currency and receipt metadata. | ✅ | [`server/src/services/payment.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/payment.service.js#L14-L60), [`client/src/pages/customer/PaymentPage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/customer/PaymentPage.jsx) |
| **FR-PAY-02** | Signature Verification | Verify Razorpay payment signatures using HMAC SHA256 before confirming booking state. | ✅ | [`server/src/services/payment.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/payment.service.js#L65-L130) |
| **FR-PAY-03** | Coupon Discounts | Admin-created promo codes (percentage or fixed amount) with per-user limits, expiry dates, and min spend. | ✅ | [`server/src/services/coupon.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/coupon.service.js), [`client/src/features/admin/CouponManager.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/admin/CouponManager.jsx) |
| **FR-PAY-04** | Vendor Payout & Platform Commission | Automatic revenue split (12% platform fee default, 18% GST, security deposit hold). | ✅ | [`server/src/services/pricing.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/pricing.service.js#L93-L119) |
| **FR-PAY-05** | Automated Gateway Refunds | Process real-time Razorpay refunds via API on cancellation. | 🟡 | *Recorded in database schema; automated gateway API refund trigger is planned/stubbed.* |

### 5. Maintenance, Reviews & Notifications
| ID | Requirement | Description | Status | Evidence |
| :--- | :--- | :--- | :---: | :--- |
| **FR-OPS-01** | Vehicle Maintenance Scheduling | Vendors can schedule routine service or repair windows, automatically blocking vehicle rental slots. | ✅ | [`server/src/services/maintenance.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/maintenance.service.js), [`client/src/features/maintenance/ScheduleMaintenanceModal.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/maintenance/ScheduleMaintenanceModal.jsx) |
| **FR-OPS-02** | Verified Customer Reviews | Customers can submit 1-5 star ratings and reviews for completed trips; vehicle average ratings update automatically. | ✅ | [`server/src/models/review.model.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/models/review.model.js#L54-L85), [`client/src/features/reviews/ReviewModal.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/reviews/ReviewModal.jsx) |
| **FR-OPS-03** | In-App Notifications | Automated in-app notifications dispatched for booking confirmations, cancellations, payments, and handovers. | ✅ | [`server/src/services/notification.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/notification.service.js), [`client/src/features/notifications/NotificationDropdown.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/notifications/NotificationDropdown.jsx) |

### 6. AI Microservice Capabilities
| ID | Requirement | Description | Status | Evidence |
| :--- | :--- | :--- | :---: | :--- |
| **FR-AI-01** | Content-Based Recommendations | Rank candidate vehicles based on category similarity, rating weights, and customer preferences. | ✅ | [`ai-service/app/services/recommendation_engine.py`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/ai-service/app/services/recommendation_engine.py), [`client/src/features/ai/AiRecommendationsCarousel.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/ai/AiRecommendationsCarousel.jsx) |
| **FR-AI-02** | 7-Day Demand Forecasting | Time-series heuristic model forecasting fleet demand by city and category. | ✅ | [`ai-service/app/services/demand_forecaster.py`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/ai-service/app/services/demand_forecaster.py), [`client/src/features/ai/DemandForecastWidget.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/ai/DemandForecastWidget.jsx) |
| **FR-AI-03** | Dynamic Pricing Engine | Calculate dynamic pricing surge multipliers based on utilization elasticity and seasonal dates. | ✅ | [`ai-service/app/services/dynamic_pricing_engine.py`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/ai-service/app/services/dynamic_pricing_engine.py) |

---

## Non-Functional Requirements

### 1. Security & Compliance
* **NFR-SEC-01 (Inferred & Implemented)**: Passwords are encrypted using `bcryptjs` with 10 salt rounds prior to persistence ([`user.model.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/models/user.model.js#L86-L95)).
* **NFR-SEC-02 (Implemented)**: API rate limiting applied to auth routes (`authRateLimiter` at 10 requests / 15 mins) and general API routes (`apiRateLimiter` at 200 requests / 15 mins) ([`rateLimiter.middleware.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/middleware/rateLimiter.middleware.js)).
* **NFR-SEC-03 (Implemented)**: HTTP security headers enforced using `helmet` ([`server/src/app.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/app.js#L15)).
* **NFR-SEC-04 (Implemented)**: Request payload validation enforced across all endpoints using `Zod` schemas before controller execution ([`validate.middleware.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/middleware/validate.middleware.js)).
* **NFR-SEC-05 (Implemented)**: Microservice API authentication protected via `X-API-Key` header validation ([`security.py`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/ai-service/app/core/security.py)).

### 2. Performance & Scalability
* **NFR-PERF-01 (Implemented)**: Compound database indexes created on high-frequency query paths (`{ categoryId: 1, status: 1, isApproved: 1 }`, `{ vehicleId: 1, startDateTime: 1, endDateTime: 1, status: 1 }`) ([`vehicle.model.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/models/vehicle.model.js#L141-L145), [`booking.model.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/models/booking.model.js#L110-L115)).
* **NFR-PERF-02 (Implemented)**: Client assets bundled and minified with Vite + PostCSS with code splitting support.
* **NFR-PERF-03 (Implemented)**: In-memory MongoDB dev fallback (`mongodb-memory-server`) to enable local startup when cloud Atlas clusters are unreachable.

### 3. Reliability & Concurrency
* **NFR-REL-01 (Implemented)**: Zero booking overlaps guaranteed mathematically via interval logic: `(existingStart < requestedEnd) AND (existingEnd > requestedStart)`.
* **NFR-REL-02 (Implemented)**: Centralized error handling middleware converts unexpected exceptions into clean JSON `ApiResponse` / `ApiError` payloads without exposing server stack traces in production ([`error.middleware.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/middleware/error.middleware.js)).
