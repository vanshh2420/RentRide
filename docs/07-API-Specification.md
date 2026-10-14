# 07 — REST API Specification

> **Document Type:** RESTful API Reference & Endpoint Specification  
> **Application:** RentRide Multi-Vendor Vehicle Rental Marketplace  
> **Status:** Verified from Live Implementation  
> **Version:** 1.3.0  
> **Date:** 2026-09-03  
> **Base URL:** `/api`  

---

## 1. Global API Standards

All endpoints adhere to standardized JSON response structures defined in [`server/src/utils/ApiResponse.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/utils/ApiResponse.js) and [`server/src/utils/ApiError.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/utils/ApiError.js):

### Standard Success Response (`2xx`)
```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Operation completed successfully",
  "success": true
}
```

### Standard Error Response (`4xx / 5xx`)
```json
{
  "statusCode": 400,
  "message": "Invalid request payload",
  "errors": [
    { "field": "email", "message": "Please provide a valid email address" }
  ],
  "success": false
}
```

---

## 2. Authentication Endpoints (`/api/auth`)

### 2.1 Register User
* **Method:** `POST`
* **Endpoint:** `/api/auth/register`
* **Purpose:** Register a new retail customer or vehicle fleet vendor.
* **Auth Requirement:** Public (Subject to `authRateLimiter` - 10 req / 15 min)
* **Required Role:** None
* **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123",
    "phone": "9876543210",
    "role": "CUSTOMER", // Optional: "CUSTOMER" or "VENDOR" (default: "CUSTOMER")
    "drivingLicenseNumber": "MP-09-2023-0012345", // Required if role = CUSTOMER
    "businessName": "Acme Rentals", // Required if role = VENDOR
    "gstNumber": "23AAAAA0000A1Z5", // Required if role = VENDOR
    "city": "Indore" // Required if role = VENDOR
  }
  ```
* **Success Response (`201 Created`):**
  ```json
  {
    "statusCode": 201,
    "data": {
      "user": { "_id": "...", "name": "Jane Doe", "email": "jane@example.com", "role": "CUSTOMER" },
      "token": "eyJhbGciOi..."
    },
    "message": "Registration successful",
    "success": true
  }
  ```
* **Error Cases:** `400 Bad Request` (Zod validation failure), `409 Conflict` (Email already registered).
* **Related Requirement:** `AUTH-001`

### 2.2 User Login
* **Method:** `POST`
* **Endpoint:** `/api/auth/login`
* **Purpose:** Authenticate credentials, return JWT in response, and set `token` HttpOnly cookie.
* **Auth Requirement:** Public (Subject to `authRateLimiter`)
* **Required Role:** None
* **Request Body:** `{ "email": "jane@example.com", "password": "Password123" }`
* **Success Response (`200 OK`):** Returns sanitized user document + JWT access token.
* **Error Cases:** `400 Bad Request`, `401 Unauthorized` ("Invalid email or password").
* **Related Requirement:** `AUTH-002`

### 2.3 User Logout
* **Method:** `POST`
* **Endpoint:** `/api/auth/logout`
* **Purpose:** Clear the HttpOnly session cookie.
* **Auth Requirement:** Public / Authenticated
* **Request Body:** None
* **Success Response (`200 OK`):** `{ "statusCode": 200, "data": {}, "message": "Logged out successfully", "success": true }`
* **Related Requirement:** `AUTH-003`

### 2.4 Verify Session (`/me`)
* **Method:** `GET`
* **Endpoint:** `/api/auth/me`
* **Purpose:** Return current authenticated user data using active token.
* **Auth Requirement:** Protected (`protect`)
* **Success Response (`200 OK`):** Returns user document without password hash.
* **Error Cases:** `401 Unauthorized` (Token missing or expired).
* **Related Requirement:** `AUTH-004`

---

## 3. User Profile Endpoints (`/api/users`)

### 3.1 Get User Profile
* **Method:** `GET`
* **Endpoint:** `/api/users/profile`
* **Purpose:** Fetch detailed profile data for the authenticated user.
* **Auth Requirement:** Protected (`protect`)
* **Success Response (`200 OK`):** Detailed User document including role-specific sub-documents.
* **Related Requirement:** `USER-001`

### 3.2 Update User Profile
* **Method:** `PATCH` or `PUT`
* **Endpoint:** `/api/users/profile`
* **Purpose:** Update profile contact details, driving license, vendor business info, and optional avatar image file.
* **Auth Requirement:** Protected (`protect`)
* **Content-Type:** `multipart/form-data` or `application/json`
* **Request Body:** Form fields (`name`, `phone`, `drivingLicenseNumber`, `businessName`, `gstNumber`, `address`) + optional `avatar` image file.
* **Success Response (`200 OK`):** Updated user object with Cloudinary image URL if uploaded.
* **Error Cases:** `400 Bad Request`, `401 Unauthorized`.
* **Related Requirement:** `USER-002`, `USER-003`

### 3.3 Change Password
* **Method:** `PATCH` or `PUT`
* **Endpoint:** `/api/users/change-password`
* **Purpose:** Change password after verifying old password.
* **Auth Requirement:** Protected (`protect`)
* **Request Body:** `{ "currentPassword": "oldPass", "newPassword": "newPass123" }`
* **Success Response (`200 OK`):** Password updated confirmation.
* **Error Cases:** `400 Bad Request` ("Incorrect current password" or "New password must be at least 6 characters").
* **Related Requirement:** `USER-004`

---

## 4. Vehicle Catalog Endpoints (`/api/vehicles`)

### 4.1 Search & Filter Vehicles
* **Method:** `GET`
* **Endpoint:** `/api/vehicles`
* **Purpose:** Search and filter public fleet listings.
* **Auth Requirement:** Public
* **Query Parameters:**
  * `search` (string): Keyword matching brand or model
  * `category` (string): Category ID or slug
  * `city` (string): Operating hub city (e.g. "Indore")
  * `fuelType` (string): `petrol`, `diesel`, `electric`, `cng`, `hybrid`
  * `transmission` (string): `manual`, `automatic`
  * `seatingCapacity` (number): Min seating capacity
  * `minPrice`, `maxPrice` (number): Hourly rate filters
  * `sortBy` (string): `popular`, `newest`, `price_low`, `price_high`, `rating`
  * `page` (number, default: 1), `limit` (number, default: 12)
* **Success Response (`200 OK`):** Array of vehicle objects + pagination metadata (`total`, `page`, `pages`).
* **Related Requirement:** `VEH-002`

### 4.2 Get Vehicle Details
* **Method:** `GET`
* **Endpoint:** `/api/vehicles/:id`
* **Purpose:** Return full specifications, images, and ratings for a single vehicle.
* **Auth Requirement:** Public
* **Path Parameters:** `id` (Mongoose ObjectId)
* **Success Response (`200 OK`):** Populated vehicle document with vendor and category details.
* **Error Cases:** `404 Not Found` ("Vehicle listing not found").
* **Related Requirement:** `VEH-004`

### 4.3 Create Vehicle Listing
* **Method:** `POST`
* **Endpoint:** `/api/vehicles`
* **Purpose:** Onboard a new vehicle listing to the vendor's fleet.
* **Auth Requirement:** Protected (`protect`), Role: `VENDOR` or `ADMIN`
* **Content-Type:** `multipart/form-data`
* **Request Body:** Form fields (`brand`, `model`, `year`, `registrationNumber`, `categoryId`, `fuelType`, `transmission`, `seatingCapacity`, `hourlyRate`, `rate12Hour`, `rate24Hour`, `city`, `address`, `features`) + `images` (up to 5 image files).
* **Success Response (`201 Created`):** Created vehicle document (`isApproved: false`).
* **Error Cases:** `400 Bad Request`, `409 Conflict` ("Registration number already exists").
* **Related Requirement:** `VEN-002`

### 4.4 Update Vehicle Listing
* **Method:** `PUT`
* **Endpoint:** `/api/vehicles/:id`
* **Purpose:** Modify vehicle specifications, rates, or features.
* **Auth Requirement:** Protected (`protect`), Role: `VENDOR` (owner only) or `ADMIN`
* **Request Body:** JSON payload of updated fields.
* **Success Response (`200 OK`):** Updated vehicle document.
* **Related Requirement:** `VEN-002`

### 4.5 Delete Vehicle Listing
* **Method:** `DELETE`
* **Endpoint:** `/api/vehicles/:id`
* **Purpose:** Permanently remove vehicle listing and delete associated Cloudinary media.
* **Auth Requirement:** Protected (`protect`), Role: `VENDOR` (owner only) or `ADMIN`
* **Success Response (`200 OK`):** Deletion confirmation.
* **Related Requirement:** `VEN-002`

### 4.6 Toggle Vehicle Status
* **Method:** `PATCH`
* **Endpoint:** `/api/vehicles/:id/status`
* **Purpose:** Change status between `AVAILABLE`, `MAINTENANCE`, `INACTIVE`.
* **Auth Requirement:** Protected (`protect`), Role: `VENDOR` (owner only) or `ADMIN`
* **Request Body:** `{ "status": "MAINTENANCE" }`
* **Success Response (`200 OK`):** Updated vehicle document.
* **Related Requirement:** `VEN-003`

### 4.7 Get Vendor Fleet Listings
* **Method:** `GET`
* **Endpoint:** `/api/vehicles/vendor/my-vehicles`
* **Purpose:** Fetch all vehicles owned by the authenticated vendor.
* **Auth Requirement:** Protected (`protect`), Role: `VENDOR` or `ADMIN`
* **Success Response (`200 OK`):** Array of owned vehicle objects.
* **Related Requirement:** `VEN-002`

### 4.8 Discover Nearest Available Vehicles
* **Method:** `GET`
* **Endpoint:** `/api/vehicles/nearby`
* **Purpose:** Return verified available vehicles sorted ascending by Haversine distance, strictly filtered through the anti-collision availability engine for requested rental intervals.
* **Auth Requirement:** Public / Authenticated
* **Query Parameters:**
  * `lat`: Latitude (-90 to 90) [Required]
  * `lng`: Longitude (-180 to 180) [Required]
  * `startDateTime`: ISO string [Optional]
  * `endDateTime`: ISO string [Optional]
  * `category`: Category ID [Optional]
  * `vehicleType`: `two_wheeler` | `four_wheeler` [Optional]
  * `radius`: Search radius in km (default: 50 km) [Optional]
  * `limit`: Max results (default: 12) [Optional]
* **Success Response (`200 OK`):**
  ```json
  {
    "statusCode": 200,
    "data": {
      "totalFound": 5,
      "userLocation": { "lat": 22.7196, "lng": 75.8577 },
      "searchRadiusKm": 50,
      "intervalChecked": true,
      "vehicles": [
        {
          "_id": "...",
          "brand": "Royal Enfield",
          "model": "Hunter 350",
          "fuelEconomy": 36,
          "fuelEconomyUnit": "km/l",
          "distanceKm": 2.4,
          "location": { "city": "Indore", "address": "Vijay Nagar Hub" }
        }
      ]
    },
    "message": "Nearby available vehicles retrieved successfully",
    "success": true
  }
  ```
* **Related Requirement:** `VEH-007`

---

## 5. Booking & Reservation Endpoints (`/api/bookings`)

### 5.1 Check Interval Availability & Estimate Pricing
* **Method:** `POST`
* **Endpoint:** `/api/bookings/check-availability`
* **Purpose:** Verify zero interval collision and calculate transparent price breakdown.
* **Auth Requirement:** Public
* **Request Body:**
  ```json
  {
    "vehicleId": "65b1...",
    "startDateTime": "2026-09-10T10:00:00.000Z",
    "endDateTime": "2026-09-10T22:00:00.000Z",
    "rentalPlan": "12_HOURS"
  }
  ```
* **Success Response (`200 OK`):**
  ```json
  {
    "statusCode": 200,
    "data": {
      "isAvailable": true,
      "priceBreakdown": {
        "basePrice": 1200,
        "baseRentalAmount": 1200,
        "dynamicMultiplier": 0.95,
        "surgeMultiplier": 0.95,
        "dynamicAdjustment": -60,
        "adjustedRentalAmount": 1140,
        "surgeBadge": "VALUE_SAVER",
        "appliedFactors": [
          "Value Saver Off-Peak Discount (-3%)"
        ],
        "couponDiscount": 0,
        "subtotal": 1140,
        "platformFee": 57,
        "taxAmount": 205,
        "securityDeposit": 1000,
        "totalAmount": 2402,
        "vendorPayout": 1003,
        "platformCommission": 137
      }
    },
    "message": "Vehicle is available",
    "success": true
  }
  ```
* **Error Cases:** `400 Bad Request`, `409 Conflict` ("Vehicle is not available for the selected dates").
* **Related Requirement:** `BOOK-001`, `BOOK-002`

### 5.2 Create Online Booking (Reservation Lock)
* **Method:** `POST`
* **Endpoint:** `/api/bookings/online`
* **Purpose:** Create booking in `PENDING_PAYMENT` state with 10-minute hold lock.
* **Auth Requirement:** Protected (`protect`), Role: `CUSTOMER`
* **Request Body:**
  ```json
  {
    "vehicleId": "65b1...",
    "rentalPlan": "12_HOURS",
    "startDateTime": "2026-09-10T10:00:00.000Z",
    "endDateTime": "2026-09-10T22:00:00.000Z",
    "drivingLicenseNumber": "MP-09-2023-0012345",
    "couponCode": "DISCOUNT10" // Optional
  }
  ```
* **Success Response (`201 Created`):** Booking record with `bookingNumber`, `totalAmount`, and `lockExpiresAt`.
* **Related Requirement:** `BOOK-003`, `BOOK-004`

### 5.3 Get Customer Bookings
* **Method:** `GET`
* **Endpoint:** `/api/bookings/my-bookings`
* **Purpose:** List all bookings for the authenticated customer.
* **Auth Requirement:** Protected (`protect`), Role: `CUSTOMER`
* **Success Response (`200 OK`):** Array of booking documents with populated vehicle and vendor data.
* **Related Requirement:** `BOOK-005`

### 5.4 Get Booking By ID
* **Method:** `GET`
* **Endpoint:** `/api/bookings/:id`
* **Purpose:** Fetch detailed booking summary and digital receipt.
* **Auth Requirement:** Protected (`protect`) (Customer, Vendor, or Admin associated with booking)
* **Success Response (`200 OK`):** Populated booking document.
* **Related Requirement:** `BOOK-005`

### 5.5 Cancel Booking
* **Method:** `POST`
* **Endpoint:** `/api/bookings/:id/cancel`
* **Purpose:** Cancel booking prior to trip start and calculate refund amount.
* **Auth Requirement:** Protected (`protect`), Role: Customer who owns the booking
* **Request Body:** `{ "reason": "Change of travel plans" }`
* **Success Response (`200 OK`):** Updated booking (`status: CANCELLED`) + refund summary.
* **Error Cases:** `400 Bad Request` ("Cannot cancel an active or completed trip").
* **Related Requirement:** `BOOK-006`

---

## 6. Vendor Operations Endpoints (`/api/vendor`)

### 6.1 Get Vendor Dashboard KPI Statistics
* **Method:** `GET`
* **Endpoint:** `/api/vendor/stats`
* **Purpose:** Fetch real-time fleet, rental, and financial KPIs for the vendor.
* **Auth Requirement:** Protected (`protect`), Role: `VENDOR` or `ADMIN`
* **Success Response (`200 OK`):** `{ totalVehicles, availableVehicles, maintenanceVehicles, activeBookings, totalBookings, grossEarnings, netEarnings }`.
* **Related Requirement:** `VEN-001`

### 6.2 Create Offline Walk-in Desk Booking
* **Method:** `POST`
* **Endpoint:** `/api/vendor/bookings/offline`
* **Purpose:** Dispatch a vehicle to a physical customer at the hub desk.
* **Auth Requirement:** Protected (`protect`), Role: `VENDOR` or `ADMIN`
* **Request Body:**
  ```json
  {
    "vehicleId": "65b1...",
    "rentalPlan": "HOURLY",
    "startDateTime": "2026-09-03T12:00:00.000Z",
    "endDateTime": "2026-09-03T18:00:00.000Z",
    "customerName": "Ramesh Kumar",
    "customerPhone": "9826012345",
    "drivingLicenseNumber": "MP-09-2020-0098765",
    "paymentMethod": "offline_cash",
    "customRateOverride": 1500 // Optional
  }
  ```
* **Success Response (`201 Created`):** Confirmed offline booking document (`paymentStatus: PAID`).
* **Error Cases:** `409 Conflict` ("Vehicle unavailable for interval").
* **Related Requirement:** `VEN-004`

### 6.3 Get Unified Vendor Bookings
* **Method:** `GET`
* **Endpoint:** `/api/vendor/bookings`
* **Purpose:** List combined online and offline bookings across vendor's fleet.
* **Auth Requirement:** Protected (`protect`), Role: `VENDOR` or `ADMIN`
* **Query Parameters:** `status`, `channel` (`ONLINE` / `OFFLINE`), `page`, `limit`.
* **Success Response (`200 OK`):** Array of booking documents.
* **Related Requirement:** `VEN-001`

### 6.4 Handover Vehicle (Start Trip)
* **Method:** `POST`
* **Endpoint:** `/api/vendor/bookings/:id/start-trip`
* **Purpose:** Record starting odometer reading and set booking to `ACTIVE`.
* **Auth Requirement:** Protected (`protect`), Role: `VENDOR` or `ADMIN`
* **Request Body:** `{ "startOdometerKm": 12450, "conditionNotes": "Clean exterior, minor scratch on rear bumper" }`
* **Success Response (`200 OK`):** Booking transitioned to `ACTIVE`, vehicle to `BOOKED`.
* **Related Requirement:** `VEN-005`

### 6.5 Return Vehicle (Complete Trip)
* **Method:** `POST`
* **Endpoint:** `/api/vendor/bookings/:id/complete-trip`
* **Purpose:** Record ending odometer, compute extra km charges, and complete booking.
* **Auth Requirement:** Protected (`protect`), Role: `VENDOR` or `ADMIN`
* **Request Body:**
  ```json
  {
    "endOdometerKm": 12780,
    "fuelLevel": "FULL",
    "damageNotes": "None",
    "extraKmCharges": 300
  }
  ```
* **Success Response (`200 OK`):** Booking transitioned to `COMPLETED`, vehicle restored to `AVAILABLE`.
* **Related Requirement:** `VEN-006`

---

## 7. Fleet Maintenance Endpoints (`/api/maintenance`)

### 7.1 Schedule Maintenance Window
* **Method:** `POST`
* **Endpoint:** `/api/maintenance`
* **Purpose:** Block out vehicle availability for routine service or repairs.
* **Auth Requirement:** Protected (`protect`), Role: `VENDOR` or `ADMIN`
* **Request Body:**
  ```json
  {
    "vehicleId": "65b1...",
    "maintenanceType": "routine",
    "description": "10,000 km periodic service & brake pad check",
    "startDate": "2026-09-15T09:00:00.000Z",
    "endDate": "2026-09-16T18:00:00.000Z",
    "estimatedCost": 2500,
    "serviceCenterName": "Indore Auto Workshop"
  }
  ```
* **Success Response (`201 Created`):** Scheduled maintenance document.
* **Error Cases:** `409 Conflict` ("Vehicle has confirmed customer bookings in this window").
* **Related Requirement:** `MAIN-001`

### 7.2 Get Vendor Maintenance List
* **Method:** `GET`
* **Endpoint:** `/api/maintenance/vendor`
* **Purpose:** Fetch all maintenance schedules for vendor's fleet.
* **Auth Requirement:** Protected (`protect`), Role: `VENDOR` or `ADMIN`
* **Success Response (`200 OK`):** Array of maintenance documents.
* **Related Requirement:** `MAIN-001`

### 7.3 Complete Maintenance
* **Method:** `PATCH`
* **Endpoint:** `/api/maintenance/:id/complete`
* **Purpose:** Log final service invoice cost and release vehicle to `AVAILABLE`.
* **Auth Requirement:** Protected (`protect`), Role: `VENDOR` or `ADMIN`
* **Request Body:** `{ "actualCost": 2750, "workDoneNotes": "Replaced oil filter and brake pads" }`
* **Success Response (`200 OK`):** Completed maintenance record.
* **Related Requirement:** `MAIN-002`

---

## 8. Payment & Gateway Endpoints (`/api/payments`)

### 8.1 Create Razorpay Order
* **Method:** `POST`
* **Endpoint:** `/api/payments/razorpay/create-order`
* **Purpose:** Generate server-side Razorpay order for locked booking.
* **Auth Requirement:** Protected (`protect`)
* **Request Body:** `{ "bookingId": "65b1..." }`
* **Success Response (`200 OK`):** `{ "key": "rzp_test_...", "orderId": "order_...", "amount": 270982, "currency": "INR" }`.
* **Related Requirement:** `PAY-001`

### 8.2 Verify Razorpay Payment Signature
* **Method:** `POST`
* **Endpoint:** `/api/payments/razorpay/verify`
* **Purpose:** Verify cryptographic HMAC-SHA256 signature and confirm booking.
* **Auth Requirement:** Protected (`protect`)
* **Request Body:**
  ```json
  {
    "bookingId": "65b1...",
    "razorpayOrderId": "order_...",
    "razorpayPaymentId": "pay_...",
    "razorpaySignature": "9b12e3..."
  }
  ```
* **Success Response (`200 OK`):** Booking confirmed and marked as `PAID`.
* **Error Cases:** `400 Bad Request` ("Invalid payment signature").
* **Related Requirement:** `PAY-002`

### 8.3 Handle Payment Failure
* **Method:** `POST`
* **Endpoint:** `/api/payments/razorpay/fail`
* **Purpose:** Record gateway payment failure reason while maintaining hold lock.
* **Auth Requirement:** Protected (`protect`)
* **Request Body:** `{ "bookingId": "65b1...", "errorReason": "Card declined by issuing bank" }`
* **Success Response (`200 OK`):** Failure logged.
* **Related Requirement:** `PAY-003`

### 8.4 Get Payment History
* **Method:** `GET`
* **Endpoint:** `/api/payments/history`
* **Purpose:** View user's past payment transactions.
* **Auth Requirement:** Protected (`protect`)
* **Success Response (`200 OK`):** Array of payment documents.
* **Related Requirement:** `PAY-001`

---

## 9. Promotional Coupon Endpoints (`/api/coupons`)

### 9.1 Validate Coupon Code
* **Method:** `POST`
* **Endpoint:** `/api/coupons/validate`
* **Purpose:** Check coupon validity against cart amount and user limits.
* **Auth Requirement:** Public / Authenticated
* **Request Body:** `{ "code": "WELCOME50", "subtotal": 2000 }`
* **Success Response (`200 OK`):** `{ "valid": true, "discountAmount": 400, "coupon": { "code": "WELCOME50", ... } }`.
* **Error Cases:** `400 Bad Request` ("Coupon expired", "Minimum order of ₹1500 required").
* **Related Requirement:** `COUP-001`

### 9.2 Coupon Administration CRUD
* `GET /api/coupons`: List all coupons (Admin, Vendor).
* `POST /api/coupons`: Create coupon (Admin).
* `PUT /api/coupons/:id`: Update coupon parameters (Admin).
* `PATCH /api/coupons/:id/status`: Toggle active status (Admin).
* `DELETE /api/coupons/:id`: Delete coupon (Admin).
* **Related Requirement:** `COUP-002`

---

## 10. Reviews & Ratings Endpoints (`/api/reviews`)

### 10.1 Get Vehicle Reviews
* **Method:** `GET`
* **Endpoint:** `/api/reviews/vehicle/:vehicleId`
* **Purpose:** Publicly list approved customer reviews for a vehicle.
* **Auth Requirement:** Public
* **Success Response (`200 OK`):** Array of review documents with reviewer names.
* **Related Requirement:** `REV-002`

### 10.2 Create Customer Review
* **Method:** `POST`
* **Endpoint:** `/api/reviews`
* **Purpose:** Submit star rating and written review for a completed trip.
* **Auth Requirement:** Protected (`protect`), Role: `CUSTOMER`
* **Request Body:** `{ "bookingId": "65b1...", "rating": 5, "title": "Great trip!", "comment": "The car was in pristine condition." }`
* **Success Response (`201 Created`):** Review saved + vehicle average rating updated.
* **Error Cases:** `400 Bad Request` ("Can only review completed trips").
* **Related Requirement:** `REV-001`

---

## 11. In-App Notifications Endpoints (`/api/notifications`)

### 11.1 Get My Notifications
* **Method:** `GET`
* **Endpoint:** `/api/notifications`
* **Purpose:** Return unread and recent notification alerts for user.
* **Auth Requirement:** Protected (`protect`)
* **Success Response (`200 OK`):** Array of notification objects + unread count.
* **Related Requirement:** `NOTIF-001`

### 11.2 Mark Notification as Read
* **Method:** `PATCH`
* **Endpoint:** `/api/notifications/:id/read`
* **Purpose:** Set single notification `isRead: true`.
* **Auth Requirement:** Protected (`protect`)
* **Success Response (`200 OK`):** Updated notification.
* **Related Requirement:** `NOTIF-001`

### 11.3 Mark All Notifications as Read
* **Method:** `PATCH`
* **Endpoint:** `/api/notifications/read-all`
* **Purpose:** Mark all notifications for user as read.
* **Auth Requirement:** Protected (`protect`)
* **Success Response (`200 OK`):** Count of updated records.
* **Related Requirement:** `NOTIF-001`

---

## 12. Master Admin Endpoints (`/api/admin`)

### 12.1 Platform Overview Statistics
* **Method:** `GET`
* **Endpoint:** `/api/admin/stats`
* **Purpose:** Master financial metrics (GMV, platform revenue, vendor payouts) and system counts.
* **Auth Requirement:** Protected (`protect`), Role: `ADMIN`
* **Success Response (`200 OK`):** Summary metrics object.
* **Related Requirement:** `ADM-001`

### 12.2 Vehicle Moderation & Approvals
* `GET /api/admin/vehicles`: List all vehicles with filter by `isApproved`.
* `PATCH /api/admin/vehicles/:id/approval`: Approve (`isApproved: true`) or reject (`isApproved: false, status: INACTIVE, rejectionReason`).
* **Auth Requirement:** Protected (`protect`), Role: `ADMIN`
* **Related Requirement:** `ADM-002`

### 12.3 User Directory Management
* `GET /api/admin/users`: List all platform users with role filters and search.
* **Auth Requirement:** Protected (`protect`), Role: `ADMIN`
* **Related Requirement:** `ADM-003`

### 12.4 Global Bookings Audit Trail
* `GET /api/admin/bookings`: Audit all platform bookings.
* **Auth Requirement:** Protected (`protect`), Role: `ADMIN`
* **Related Requirement:** `ADM-004`

---

## 13. AI & Predictive Analytics Endpoints (`/api/ai`)

### 13.1 Personalized Recommendations
* **Method:** `GET`
* **Endpoint:** `/api/ai/recommendations`
* **Purpose:** Return ranked vehicle recommendations matching preferences.
* **Auth Requirement:** Public / Authenticated
* **Related Requirement:** `AI-001`

### 13.2 7-Day Demand Forecast
* **Method:** `GET`
* **Endpoint:** `/api/ai/demand-forecast`
* **Purpose:** Return 7-day predictive demand indices for vendor's hub.
* **Auth Requirement:** Protected (`protect`), Role: `VENDOR` or `ADMIN`
* **Related Requirement:** `AI-002`

### 13.3 Dynamic Pricing Multiplier
* **Method:** `POST`
* **Endpoint:** `/api/ai/dynamic-pricing`
* **Purpose:** Calculate optimal rate multiplier based on utilization and weekend demand.
* **Auth Requirement:** Protected (`protect`), Role: `VENDOR` or `ADMIN`
* **Related Requirement:** `AI-003`

### 13.4 AI-Driven Personalized Offers
* **Method:** `GET` / `POST`
* **Endpoint:** `/api/ai/personalized-offers`
* **Purpose:** Generate tailored discount offers based on customer rental history and preferences.
* **Auth Requirement:** Public / Authenticated
* **Query Parameters:** `city` (default: `'Indore'`), `userId` (optional)
* **Success Response (`200 OK`):**
  ```json
  {
    "statusCode": 200,
    "data": {
      "offer": {
        "eligible": true,
        "isPersonalized": true,
        "offerType": "PERCENTAGE",
        "discountValue": 15,
        "couponCode": "RIDEAI15",
        "category": "two_wheeler",
        "title": "15% OFF Your Next City Ride",
        "badge": "Frequent Rider Reward",
        "reason": "Exclusive discount tailored for you based on your verified rental activity in Indore.",
        "minBookingAmount": 350,
        "maxDiscountAmount": 200,
        "validityDays": 7
      }
    },
    "message": "Personalized offer generated successfully",
    "success": true
  }
  ```
* **Related Requirement:** `AI-004`

### 13.5 Conversational AI Rental Assistant
* **Method:** `POST`
* **Endpoint:** `/api/ai/assistant`
* **Purpose:** Conversational dialogue handler supporting vehicle discovery, plan and pricing explanations, and policies.
* **Auth Requirement:** Public / Authenticated
* **Request Body:**
  ```json
  {
    "message": "Find bikes under 800",
    "userContext": { "city": "Indore" }
  }
  ```
* **Success Response (`200 OK`):**
  ```json
  {
    "statusCode": 200,
    "data": {
      "reply": "I found the best verified options matching your search...",
      "intent": "DISCOVER_VEHICLES",
      "suggestedActions": ["Find Bikes under ₹800", "Electric Vehicles", "Show Cars in Indore"],
      "vehicles": [ ... ]
    },
    "message": "AI assistant processed message successfully",
    "success": true
  }
  ```
* **Related Requirement:** `AI-005`
