# 07 — REST API Reference

All backend endpoints are mounted under the base path `/api` on port `5000`.

Base URL: `http://localhost:5000/api`

---

## Standard Response Envelope

All API responses return a standardized JSON structure defined by [`ApiResponse.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/utils/ApiResponse.js):

### Success Response (`200`, `201`)
```json
{
  "statusCode": 200,
  "data": {},
  "message": "Operation successful",
  "success": true
}
```

### Error Response (`400`, `401`, `403`, `404`, `409`, `500`)
```json
{
  "statusCode": 400,
  "message": "Validation failed / Error description",
  "errors": [],
  "success": false
}
```

---

## 1. Authentication Endpoints (`/api/auth`)

Mounted at [`server/src/routes/auth.routes.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/routes/auth.routes.js)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `POST` | `/api/auth/register` | Public | Any | Register customer or vendor account. |
| `POST` | `/api/auth/login` | Public | Any | Authenticate user, return JWT and set cookie. |
| `POST` | `/api/auth/logout` | Public | Any | Clears `rentride_token` cookie and invalidates session. |
| `GET` | `/api/auth/me` | JWT | Any | Returns authenticated user details and profile. |
| `PUT` | `/api/auth/profile` | JWT | Any | Update profile details (name, phone, driving license). |
| `PUT` | `/api/auth/change-password` | JWT | Any | Change password verifying `currentPassword`. |

---

## 2. User Profile Endpoints (`/api/users`)

Mounted at [`server/src/routes/user.routes.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/routes/user.routes.js)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/users/profile` | JWT | Any | View authenticated profile. |
| `PATCH` / `PUT` | `/api/users/profile` | JWT | Any | Update profile with optional multipart `avatar` file upload. |
| `PATCH` / `PUT` | `/api/users/change-password` | JWT | Any | Update user password. |

---

## 3. Vehicle Categories (`/api/categories`)

Mounted at [`server/src/routes/category.routes.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/routes/category.routes.js)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/categories` | Public | Any | List all active categories (`?includeInactive=true` for admin). |
| `GET` | `/api/categories/:id` | Public | Any | Get category by MongoDB ID or slug string. |
| `POST` | `/api/categories` | JWT | `ADMIN` | Create vehicle category. |
| `PUT` | `/api/categories/:id` | JWT | `ADMIN` | Update vehicle category details. |
| `DELETE`| `/api/categories/:id` | JWT | `ADMIN` | Delete vehicle category. |

---

## 4. Vehicle Catalog & Inventory (`/api/vehicles`)

Mounted at [`server/src/routes/vehicle.routes.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/routes/vehicle.routes.js)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/vehicles` | Public | Any | Search & multi-filter vehicles (`city`, `category`, `fuelType`, `transmission`, `minPrice`, `maxPrice`, `seats`, `sort`, `page`, `limit`). |
| `GET` | `/api/vehicles/:id` | Public | Any | Get single vehicle details with images, specs, and vendor hub. |
| `GET` | `/api/vehicles/vendor/my-vehicles` | JWT | `VENDOR`, `ADMIN` | List vendor's owned vehicle fleet. |
| `POST` | `/api/vehicles` | JWT | `VENDOR`, `ADMIN` | Create new vehicle listing with multipart `images` (max 5). |
| `PUT` | `/api/vehicles/:id` | JWT | `VENDOR`, `ADMIN` | Update vehicle specifications and rates. |
| `DELETE`| `/api/vehicles/:id` | JWT | `VENDOR`, `ADMIN` | Delete vehicle listing. |
| `PATCH`| `/api/vehicles/:id/status` | JWT | `VENDOR`, `ADMIN` | Update vehicle status (`AVAILABLE`, `RENTED`, `MAINTENANCE`, `INACTIVE`). |

---

## 5. Bookings & Reservations (`/api/bookings`)

Mounted at [`server/src/routes/booking.routes.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/routes/booking.routes.js)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `POST` | `/api/bookings/check-availability` | Public | Any | Dry-run check for collision conflicts and server price quote. |
| `POST` | `/api/bookings/online` | JWT | `CUSTOMER` | Create online booking with `PENDING_PAYMENT` status and 10-min lock. |
| `GET` | `/api/bookings/my-bookings` | JWT | `CUSTOMER` | List customer's booking history. |
| `GET` | `/api/bookings/:id` | JWT | Any | Get single booking details by ID or booking number. |
| `POST` | `/api/bookings/:id/cancel` | JWT | Any | Cancel booking, calculate refund and cancellation fee. |

---

## 6. Vendor Operations (`/api/vendor`)

Mounted at [`server/src/routes/vendor.routes.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/routes/vendor.routes.js)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/vendor/stats` | JWT | `VENDOR`, `ADMIN` | Get vendor KPI cards (revenue, active bookings, fleet size, utilization). |
| `POST` | `/api/vendor/bookings/offline` | JWT | `VENDOR`, `ADMIN` | Record walk-in customer rental with cash payment, blocking slot. |
| `GET` | `/api/vendor/bookings` | JWT | `VENDOR`, `ADMIN` | Unified list of vendor bookings (both online and offline). |
| `POST` | `/api/vendor/bookings/:id/start-trip` | JWT | `VENDOR`, `ADMIN` | Handover vehicle: logs start odometer and changes status to `ACTIVE`. |
| `POST` | `/api/vendor/bookings/:id/complete-trip`| JWT | `VENDOR`, `ADMIN` | Return vehicle: logs end odometer, computes extra km charge, sets status to `COMPLETED`. |

---

## 7. Payments & Razorpay (`/api/payments`)

Mounted at [`server/src/routes/payment.routes.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/routes/payment.routes.js)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `POST` | `/api/payments/razorpay/create-order` | JWT | Any | Generates Razorpay Order ID for pending booking. |
| `POST` | `/api/payments/razorpay/verify` | JWT | Any | Verifies Razorpay HMAC signature, confirms payment and booking. |
| `POST` | `/api/payments/razorpay/fail` | JWT | Any | Records failed transaction attempt. |
| `GET` | `/api/payments/history` | JWT | Any | View payment transaction history. |

---

## 8. Coupons & Promotions (`/api/coupons`)

Mounted at [`server/src/routes/coupon.routes.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/routes/coupon.routes.js)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `POST` | `/api/coupons/validate` | Public | Any | Validate coupon code against booking amount and user quota. |
| `GET` | `/api/coupons` | JWT | `ADMIN`, `VENDOR` | List all promotional coupons. |
| `GET` | `/api/coupons/:id` | JWT | `ADMIN` | Get single coupon details. |
| `POST` | `/api/coupons` | JWT | `ADMIN` | Create new promotional coupon. |
| `PUT` | `/api/coupons/:id` | JWT | `ADMIN` | Update coupon parameters and limits. |
| `DELETE`| `/api/coupons/:id` | JWT | `ADMIN` | Delete coupon. |
| `PATCH`| `/api/coupons/:id/status` | JWT | `ADMIN` | Toggle coupon active/inactive status. |

---

## 9. Vehicle Maintenance (`/api/maintenance`)

Mounted at [`server/src/routes/maintenance.routes.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/routes/maintenance.routes.js)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/maintenance/vendor` | JWT | `VENDOR`, `ADMIN` | List vendor's scheduled maintenance records. |
| `POST` | `/api/maintenance` | JWT | `VENDOR`, `ADMIN` | Schedule maintenance window (blocks vehicle availability). |
| `PATCH`| `/api/maintenance/:id/complete` | JWT | `VENDOR`, `ADMIN` | Mark maintenance as complete, restoring vehicle to `AVAILABLE`. |

---

## 10. Reviews & Ratings (`/api/reviews`)

Mounted at [`server/src/routes/review.routes.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/routes/review.routes.js)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/reviews/vehicle/:vehicleId` | Public | Any | List verified reviews and star ratings for a vehicle. |
| `POST` | `/api/reviews` | JWT | `CUSTOMER` | Submit review for a completed booking (1 review per booking). |

---

## 11. Notifications (`/api/notifications`)

Mounted at [`server/src/routes/notification.routes.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/routes/notification.routes.js)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/notifications` | JWT | Any | Get user notifications and unread count. |
| `PATCH`| `/api/notifications/read-all` | JWT | Any | Mark all notifications as read. |
| `PATCH`| `/api/notifications/:id/read` | JWT | Any | Mark single notification as read. |

---

## 12. Admin Governance (`/api/admin`)

Mounted at [`server/src/routes/admin.routes.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/routes/admin.routes.js)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/admin/stats` | JWT | `ADMIN` | Platform overview KPIs, revenue, gross volume, active fleets. |
| `GET` | `/api/admin/vehicles` | JWT | `ADMIN` | List all vehicles across all vendors with approval filters. |
| `PATCH`| `/api/admin/vehicles/:id/approval` | JWT | `ADMIN` | Approve or reject a vehicle listing. |
| `GET` | `/api/admin/users` | JWT | `ADMIN` | Audit all registered users with role and KYC filters. |
| `GET` | `/api/admin/bookings` | JWT | `ADMIN` | Global marketplace booking ledger. |

---

## 13. AI Services (`/api/ai`)

Mounted at [`server/src/routes/ai.routes.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/routes/ai.routes.js)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/ai/recommendations` | Public | Any | Returns ML-ranked vehicle recommendations based on preferences. |
| `GET` | `/api/ai/demand-forecast` | Public | Any | Returns 7-day predictive demand indices for a city and category. |
| `POST` | `/api/ai/dynamic-pricing` | Public | Any | Returns AI-calculated dynamic surge multiplier and recommended rate. |

---

## 14. Master Vehicle Catalog (`/api/catalog`)

Mounted at [`server/src/routes/catalog.routes.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/routes/catalog.routes.js)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/catalog` | Public | Any | Search, filter, and paginate through 300+ verified master vehicle models (`search`, `brand`, `category`, `fuelType`, `transmission`, `vehicleType`). |
| `GET` | `/api/catalog/brands` | Public | Any | Get unique brand list (50+ manufacturers) optionally filtered by category or vehicleType. |
| `GET` | `/api/catalog/brands/:brand/models`| Public | Any | Cascading model selector endpoint: returns all verified models and trims for a chosen brand. |
| `GET` | `/api/catalog/key/:key` | Public | Any | Retrieve verified specs, certified ARAI fuel economy, and Cloudinary imagery by natural key slug. |
| `GET` | `/api/catalog/:id` | Public | Any | Retrieve single master catalog model by MongoDB ObjectId. |
| `POST` | `/api/catalog` | JWT | `ADMIN` | Create new standardized vehicle model specification. |
| `PUT` | `/api/catalog/:id` | JWT | `ADMIN` | Update existing catalog model specifications. |
| `DELETE`| `/api/catalog/:id` | JWT | `ADMIN` | Soft-deactivate catalog model (`isActive: false`). |

---

## 15. Health Check

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/health` | Public | Returns service health status, uptime, and timestamp. |
