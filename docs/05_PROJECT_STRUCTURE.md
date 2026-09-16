# 05 — Project Structure & Codebase Map

This document outlines the file and directory organization of the RentRide codebase, explaining the role of each module and specifying all system entry points.

---

## 1. Top-Level Repository Structure

```text
RentRide/
├── client/          # Frontend Single Page Application (React 18 + Vite)
├── server/          # Backend REST API Server (Node.js + Express + Mongoose)
├── ai-service/      # Machine Learning Microservice (Python + FastAPI)
├── docs/            # Technical Architecture & System Documentation
├── .gitignore       # Git exclusion rules
└── README.md        # Monorepo overview & local development guide
```

---

## 2. Frontend Structure (`client/`)

```text
client/
├── public/                 # Static public assets (favicon, branding)
├── src/
│   ├── components/         # Reusable presentation components
│   │   ├── common/         # Generic components (CityAutocomplete.jsx)
│   │   └── navigation/     # Navigation & routing guards (ProtectedRoute.jsx)
│   ├── constants/          # Client-side constants (cities.js, roles.js)
│   ├── features/           # Modular domain feature slices
│   │   ├── admin/          # Admin feature widgets (CouponManager.jsx)
│   │   ├── ai/             # AI components (AiRecommendationsCarousel.jsx, DemandForecastWidget.jsx)
│   │   ├── auth/           # Auth forms & state (LoginForm.jsx, RegisterForm.jsx, authSlice.js)
│   │   ├── booking/        # Booking UI widgets (PriceBreakdownCard.jsx)
│   │   ├── maintenance/    # Maintenance modals (ScheduleMaintenanceModal.jsx, CompleteMaintenanceModal.jsx)
│   │   ├── notifications/  # Notification center (NotificationDropdown.jsx)
│   │   ├── reviews/        # Review modals & lists (ReviewModal.jsx, VehicleReviewsList.jsx)
│   │   ├── vehicles/       # Vehicle components (VehicleCard.jsx, VehicleGrid.jsx, FilterPanel.jsx)
│   │   └── vendor/         # Vendor modals & cards (AddVehicleModal.jsx, CreateOfflineBookingModal.jsx, VehicleHandoverModal.jsx, EarningsCard.jsx)
│   ├── layouts/            # Page shell layouts
│   │   ├── AdminLayout.jsx     # Admin sidebar + header navigation shell
│   │   ├── AppLayout.jsx       # Root layout wrapper
│   │   ├── CustomerLayout.jsx  # Customer storefront layout shell
│   │   ├── CustomerNavbar.jsx  # Customer navigation header
│   │   ├── Footer.jsx          # Public footer
│   │   ├── Navbar.jsx          # Top-level navigation bar
│   │   └── VendorLayout.jsx    # Vendor dashboard sidebar + header shell
│   ├── pages/              # Route view pages
│   │   ├── admin/          # Admin pages (AdminDashboardPage.jsx)
│   │   ├── customer/       # Customer pages (HomePage.jsx, ExplorePage.jsx, CategoriesPage.jsx, RentalPlansPage.jsx, VehicleDetailsPage.jsx, CheckoutPage.jsx, PaymentPage.jsx, MyBookingsPage.jsx, BookingDetailsPage.jsx, ProfilePage.jsx)
│   │   ├── public/         # Auth pages (LoginPage.jsx, RegisterPage.jsx)
│   │   └── vendor/         # Vendor pages (VendorDashboardPage.jsx, MyVehiclesPage.jsx)
│   ├── routes/             # Client routing declaration (AppRoutes.jsx)
│   ├── services/           # Axios HTTP API services
│   │   ├── adminApi.js         # /api/admin service calls
│   │   ├── aiApi.js            # /api/ai service calls
│   │   ├── api.js              # Base Axios instance & response/error interceptors
│   │   ├── authApi.js          # /api/auth service calls
│   │   ├── bookingApi.js       # /api/bookings service calls
│   │   ├── categoryApi.js      # /api/categories service calls
│   │   ├── couponApi.js        # /api/coupons service calls
│   │   ├── maintenanceApi.js   # /api/maintenance service calls
│   │   ├── notificationApi.js  # /api/notifications service calls
│   │   ├── paymentApi.js       # /api/payments service calls
│   │   ├── reviewApi.js        # /api/reviews service calls
│   │   ├── userApi.js          # /api/users service calls
│   │   ├── vehicleApi.js       # /api/vehicles service calls
│   │   └── vendorApi.js        # /api/vendor service calls
│   ├── store/              # Redux Toolkit configuration (store.js, rootReducer.js)
│   ├── validators/         # Client-side form validators (authValidators.js)
│   ├── App.jsx             # Root React application component
│   ├── index.css           # Global Tailwind CSS directives and custom classes
│   └── main.jsx            # Frontend React DOM entry point
├── index.html              # HTML5 application template
├── package.json            # Client npm dependencies & build scripts
├── postcss.config.js       # PostCSS plugin configuration
├── tailwind.config.js      # Tailwind CSS design system configuration
└── vite.config.js          # Vite build & development server configuration
```

---

## 3. Backend Structure (`server/`)

```text
server/
├── src/
│   ├── config/             # Environment & third-party service configuration
│   │   ├── cloudinary.js   # Cloudinary SDK & stream upload helper
│   │   ├── db.js           # Mongoose connection & in-memory dev fallback
│   │   ├── env.js          # Sanitized environment variable parser
│   │   └── razorpay.js     # Razorpay client instance initialization
│   ├── constants/          # Application-wide domain constants
│   │   ├── cities.js       # Supported cities list
│   │   ├── pricing.js      # Platform fee, GST rates, and weekend multipliers
│   │   ├── roles.js        # CUSTOMER, VENDOR, ADMIN roles
│   │   └── status.js       # Booking, vehicle, payment, and maintenance enums
│   ├── controllers/        # Express route request handlers
│   │   ├── admin.controller.js
│   │   ├── ai.controller.js
│   │   ├── auth.controller.js
│   │   ├── booking.controller.js
│   │   ├── category.controller.js
│   │   ├── coupon.controller.js
│   │   ├── maintenance.controller.js
│   │   ├── notification.controller.js
│   │   ├── payment.controller.js
│   │   ├── review.controller.js
│   │   ├── user.controller.js
│   │   ├── vehicle.controller.js
│   │   └── vendor.controller.js
│   ├── middleware/         # Express request pipeline middlewares
│   │   ├── auth.middleware.js        # JWT extraction & authentication guard
│   │   ├── error.middleware.js       # Centralized exception handler
│   │   ├── rateLimiter.middleware.js # Express rate limiters
│   │   ├── role.middleware.js        # Role-based authorization guard
│   │   ├── upload.middleware.js      # Multer memory storage multipart parser
│   │   └── validate.middleware.js    # Zod request schema validator
│   ├── models/             # Mongoose database schemas & models
│   │   ├── booking.model.js          # Bookings, collision index & pricing breakdown
│   │   ├── category.model.js         # Vehicle categories
│   │   ├── coupon.model.js           # Promo coupons & usage counters
│   │   ├── index.js                  # Centralized model export
│   │   ├── maintenance.model.js      # Vehicle maintenance windows
│   │   ├── notification.model.js     # In-app notifications
│   │   ├── payment.model.js          # Payment transaction records
│   │   ├── review.model.js           # Verified customer reviews
│   │   ├── user.model.js             # User credentials, roles & profiles
│   │   └── vehicle.model.js          # Vehicle listings, pricing & locations
│   ├── routes/             # Express API route declarations
│   │   ├── admin.routes.js           # /api/admin
│   │   ├── ai.routes.js              # /api/ai
│   │   ├── auth.routes.js            # /api/auth
│   │   ├── booking.routes.js         # /api/bookings
│   │   ├── category.routes.js        # /api/categories
│   │   ├── coupon.routes.js          # /api/coupons
│   │   ├── index.js                  # Master API Router (/api) & Health check
│   │   ├── maintenance.routes.js     # /api/maintenance
│   │   ├── notification.routes.js    # /api/notifications
│   │   ├── payment.routes.js         # /api/payments
│   │   ├── review.routes.js          # /api/reviews
│   │   ├── user.routes.js            # /api/users
│   │   ├── vehicle.routes.js         # /api/vehicles
│   │   └── vendor.routes.js          # /api/vendor
│   ├── scripts/            # Database seeders & test suites
│   │   ├── seed.js                           # Full marketplace demo database seeder
│   │   ├── testCitySelectionFlow.js          # City selection & vendor profile test
│   │   ├── testCollision.js                  # Interval overlap test
│   │   ├── testCollisionLogic.js             # Collision algorithm validation
│   │   ├── testFullMarketplaceLifecycle.js   # Full end-to-end booking lifecycle test
│   │   ├── testRoleBasedAccess.js            # Role guard authentication test
│   │   └── testUserProfileLifecycle.js       # User profile lifecycle test
│   ├── services/           # Core domain business logic
│   │   ├── admin.service.js
│   │   ├── ai.service.js
│   │   ├── auth.service.js
│   │   ├── booking.service.js
│   │   ├── category.service.js
│   │   ├── coupon.service.js
│   │   ├── maintenance.service.js
│   │   ├── notification.service.js
│   │   ├── payment.service.js
│   │   ├── pricing.service.js
│   │   ├── review.service.js
│   │   ├── user.service.js
│   │   └── vehicle.service.js
│   ├── utils/              # Helper utilities
│   │   ├── ApiError.js       # Standardized operational error class
│   │   ├── ApiResponse.js    # Standardized success response envelope
│   │   ├── asyncHandler.js   # Async controller wrapper
│   │   └── logger.js         # Formatted console logger
│   ├── validators/         # Zod schemas for request validation
│   │   ├── admin.validator.js
│   │   ├── auth.validator.js
│   │   ├── booking.validator.js
│   │   ├── category.validator.js
│   │   ├── coupon.validator.js
│   │   ├── maintenance.validator.js
│   │   ├── payment.validator.js
│   │   ├── review.validator.js
│   │   ├── user.validator.js
│   │   ├── vehicle.validator.js
│   │   └── vendor.validator.js
│   ├── app.js              # Express app instantiation & middleware configuration
│   └── server.js           # Backend HTTP server entry point & lifecycle manager
├── .env                    # Local environment variables
└── package.json            # Server npm dependencies & scripts
```

---

## 4. AI Microservice Structure (`ai-service/`)

```text
ai-service/
├── app/
│   ├── api/
│   │   └── v1/
│   │       └── api_router.py           # FastAPI v1 route declarations
│   ├── core/
│   │   ├── config.py                   # Pydantic Settings configuration
│   │   └── security.py                 # API Key authentication dependency
│   ├── services/
│   │   ├── demand_forecaster.py        # 7-day predictive demand time series model
│   │   ├── dynamic_pricing_engine.py   # Price elasticity & surge multiplier engine
│   │   └── recommendation_engine.py    # Cosine similarity vehicle recommendation engine
│   └── main.py                         # FastAPI application entry point
├── .env                                # AI service environment variables
└── requirements.txt                    # Python dependencies
```

---

## 5. System Entry Points

| Component | Entry File | Startup Command | Port | Description |
| :--- | :--- | :--- | :---: | :--- |
| **Frontend** | [`client/src/main.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/main.jsx) | `npm run dev` (Vite) | `5173` | React 18 DOM root mount, Redux store provider, and browser router initialization. |
| **Backend** | [`server/src/server.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/server.js) | `npm run dev` (Nodemon) | `5000` | Database connection, Express HTTP server listener on port 5000, and graceful shutdown handlers. |
| **AI Microservice** | [`ai-service/app/main.py`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/ai-service/app/main.py) | `uvicorn app.main:app --port 8000` | `8000` | FastAPI application listener with CORS and route mounting. |
| **Database Seeder** | [`server/src/scripts/seed.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/scripts/seed.js) | `npm run seed` | — | Initializes demo users, categories, vehicles, bookings, maintenance, and reviews. |
