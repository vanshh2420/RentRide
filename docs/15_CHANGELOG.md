# 15 — Project Changelog & Revision History

This document records the verifiable milestones and architectural iterations in the RentRide project.

---

## [v1.3.0] — 2026-08-31
### Fixed & Enhanced
* **Category Navigation & Vehicle Filtering Flow**:
  * Fixed bug where clicking any category from `/categories` or `/` displayed "No rides found in this hub".
  * Resolved Zod validator mismatch in [`vehicle.validator.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/validators/vehicle.validator.js) allowing flexible query parameters, enum filters, and sort configurations without 400 Bad Request errors.
  * Enhanced [`VehicleService.searchVehicles`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/vehicle.service.js) to resolve category by ObjectId, slug (case-insensitive), or name.
  * Corrected enum case-sensitivity for `vehicleType` (`two_wheeler`/`four_wheeler`), `fuelType`, and `transmission`.
  * Updated [`ExplorePage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/customer/ExplorePage.jsx) and [`FilterPanel.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/vehicles/FilterPanel.jsx) with real-time URL query parameter synchronization, active category chip highlight, and "All Hubs & Cities" search support.
  * Upgraded development auto-seeding in [`db.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/config/db.js) and [`seed.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/scripts/seed.js) with verified fleet inventory across all 6 categories in Indore, Bhopal, and Gwalior hubs.

---

## [v1.2.0] — 2026-08-31
### Added & Improved
* **Resilient Database Architecture**:
  * Integrated an automatic in-memory MongoDB fallback (`mongodb-memory-server`) in [`server/src/config/db.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/config/db.js) for local development resilience when remote MongoDB Atlas clusters are unreachable.
  * Added `autoSeedCategoriesIfEmpty()` to automatically populate core vehicle categories (`Electric Scooters`, `Scooters`, `Bikes`, `Hatchbacks`, `Sedans`, `SUVs`).
* **Category Flow & Error Handling**:
  * Enhanced Axios response interceptor in [`client/src/services/api.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/services/api.js) to provide distinct, human-readable error messages for network outages, 404s, 503s, and 500s.
  * Enhanced [`CategoriesPage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/customer/CategoriesPage.jsx) with a dedicated empty state and contextual error retry actions.
* **City Selection UI Redesign**:
  * Redesigned [`CityAutocomplete.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/components/common/CityAutocomplete.jsx) to match modern minimal travel app styling: vertically centered building outline icon, bold top-line city name, and muted bottom-line state name with clean dividers.

---

## [v1.1.0] — 2026-08-15
### Added
* **AI Machine Learning Microservice**:
  * Created independent Python + FastAPI microservice with Pydantic v2 validation.
  * Implemented content-based vehicle recommendation engine using cosine similarity.
  * Implemented 7-day predictive demand forecasting model and dynamic pricing elasticity engine.
  * Built Node.js proxy service with heuristic fallbacks and frontend AI widgets.
* **Vehicle Maintenance Module**:
  * Built maintenance scheduling and completion workflows for vendors.
  * Integrated maintenance date intervals into the zero-collision availability check.
* **Verified Customer Review System**:
  * Implemented review submission with MongoDB aggregate pipeline recalculating vehicle star ratings.

---

## [v1.0.0] — 2026-08-01
### Initial Release
* **Core Marketplace Architecture**:
  * Express REST API backend with JWT authentication and role-based access control (`CUSTOMER`, `VENDOR`, `ADMIN`).
  * React 18 + Vite SPA with Tailwind CSS design system and Redux Toolkit state management.
  * Mongoose schemas for Users, Vehicles, Bookings, Categories, Coupons, Payments, and Notifications.
  * Centralized interval overlap collision algorithm guaranteeing zero double-bookings across online and offline walk-in rentals.
  * Multi-plan rental calculator (Hourly, 12-Hour, 24-Hour) with weekend surge pricing, GST, and security deposits.
  * Razorpay payment gateway integration with HMAC-SHA256 signature verification.
  * Cloudinary CDN integration for multi-image vehicle uploads.
  * Admin moderation portal for vehicle approvals, user audits, and coupon management.
