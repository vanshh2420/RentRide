# 04 — User Journeys & End-to-End System Flows

> **Document Type:** Operational Workflows, User Journeys & Sequence Specifications  
> **Application:** RentRide Multi-Vendor Vehicle Rental Marketplace  
> **Status:** Verified from Live Implementation  
> **Version:** 1.3.0  
> **Date:** 2026-09-03  

---

## 1. Primary User Journey Flows

### 1.1 Customer Registration & Authentication Journey

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Retail Customer
    participant UI as React Frontend (RegisterPage)
    participant AuthCtrl as Auth Controller
    participant UserMod as User Model (Mongoose)
    participant DB as MongoDB Database

    Customer->>UI: Enter Name, Email, Password, Phone & DL Number
    UI->>UI: Client Zod Form Validation
    UI->>AuthCtrl: POST /api/auth/register (payload)
    AuthCtrl->>AuthCtrl: Validate via registerSchema
    AuthCtrl->>UserMod: Check if Email Exists
    alt Email Already Registered
        UserMod-->>AuthCtrl: Existing User Document
        AuthCtrl-->>UI: 409 Conflict ("User already exists")
        UI-->>Customer: Display Error Toast
    else Unique Email
        AuthCtrl->>UserMod: Instantiate User Document
        UserMod->>UserMod: pre('save') Hook: bcrypt.hash(password, 10)
        UserMod->>DB: Save User Document
        DB-->>UserMod: User Persisted
        AuthCtrl->>UserMod: user.generateAccessToken()
        UserMod-->>AuthCtrl: Signed JWT Token
        AuthCtrl->>AuthCtrl: Set HttpOnly Cookie ('token')
        AuthCtrl-->>UI: 201 Created (Token + Sanitized User Object)
        UI->>UI: Dispatch Redux setCredentials(user, token)
        UI-->>Customer: Redirect to / (Home) with Welcome Notification
    end
```

---

### 1.2 Customer Vehicle Discovery & Search Journey

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer / Guest
    participant Storefront as ExplorePage / HomePage
    participant CityAuto as CityAutocomplete Component
    participant VehCtrl as Vehicle Controller
    participant VehSvc as Vehicle Service
    participant DB as MongoDB Database

    Customer->>Storefront: Lands on Marketplace Explore
    Customer->>CityAuto: Types City Hub (e.g. "Indore")
    CityAuto->>Storefront: Sets Active City Hub Filter
    Customer->>Storefront: Selects Category (e.g. "SUV"), Fuel, Transmission & Price Slider
    Storefront->>Storefront: Updates URL Search Params (?city=Indore&category=suv)
    Storefront->>VehCtrl: GET /api/vehicles?city=Indore&category=suv&status=AVAILABLE
    VehCtrl->>VehSvc: searchVehicles(queryParams)
    VehSvc->>DB: Query { status: 'AVAILABLE', isApproved: true, 'location.city': 'Indore' }
    DB-->>VehSvc: Matched Vehicle Records
    VehSvc-->>VehCtrl: Paginated Vehicle Array + Total Count
    VehCtrl-->>Storefront: 200 OK (Vehicles List)
    Storefront-->>Customer: Render Responsive Vehicle Grid with Pricing & Badges
```

---

### 1.3 Online Booking & Anti-Collision Reservation Journey

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Retail Customer
    participant Checkout as CheckoutPage
    participant BookCtrl as Booking Controller
    participant BookSvc as Booking Service
    participant PriceSvc as Pricing Service
    participant DB as MongoDB Database

    Customer->>Checkout: Selects Rental Plan (HOURLY / 12_HOURS / 24_HOURS) & Dates
    Checkout->>BookCtrl: POST /api/bookings/check-availability
    BookCtrl->>BookSvc: checkVehicleAvailability(vehicleId, start, end)
    BookSvc->>DB: Query Overlapping Bookings & Maintenance
    alt Overlap Detected
        DB-->>BookSvc: Active Booking / Maintenance Conflict
        BookSvc-->>BookCtrl: false (Collision Detected)
        BookCtrl-->>Checkout: 409 Conflict ("Vehicle unavailable for selected window")
        Checkout-->>Customer: Display Collision Warning & Block Checkout
    else Zero Overlap Verified
        DB-->>BookSvc: No Conflicts
        BookSvc->>PriceSvc: calculateRentalPrice(vehicle, plan, start, end)
        PriceSvc-->>BookSvc: Itemized Breakdown (Base, Surge, Fees, Tax, Deposit)
        BookSvc-->>BookCtrl: Available + Price Breakdown
        BookCtrl-->>Checkout: 200 OK (Available, Itemized Breakdown)
        Checkout-->>Customer: Render Pricing Breakdown & Unlock Checkout Button
    end

    Customer->>Checkout: Clicks "Proceed to Payment"
    Checkout->>BookCtrl: POST /api/bookings/online
    BookCtrl->>BookSvc: createOnlineBooking(customerId, vehicleId, plan, start, end)
    BookSvc->>BookSvc: Double-check Interval Collision
    BookSvc->>DB: Create Booking { status: 'PENDING_PAYMENT', lockExpiresAt: +10 Mins }
    DB-->>BookSvc: Booking Created with Lock
    BookSvc-->>BookCtrl: Booking Document
    BookCtrl-->>Checkout: 201 Created (Booking ID, Lock Expiry)
    Checkout-->>Customer: Redirect to /payment/:bookingId
```

---

### 1.4 Razorpay Payment & Confirmation Journey

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Retail Customer
    participant PayPage as PaymentPage
    participant PayCtrl as Payment Controller
    participant PaySvc as Payment Service
    participant Razorpay as Razorpay API Gateway
    participant NotifSvc as Notification Service
    participant DB as MongoDB Database

    Customer->>PayPage: Initiates Payment for Locked Booking
    PayPage->>PayCtrl: POST /api/payments/razorpay/create-order
    PayCtrl->>PaySvc: createOrder(bookingId, userId)
    PaySvc->>Razorpay: razorpay.orders.create({ amount, currency: 'INR', notes })
    Razorpay-->>PaySvc: Razorpay Order Object (order_id)
    PaySvc->>DB: Create Payment Record { status: 'PENDING', razorpayOrderId }
    PaySvc-->>PayCtrl: Order Details + Key ID
    PayCtrl-->>PayPage: 200 OK (key, order_id, amount)

    PayPage->>Customer: Launch Razorpay Modal Checkout
    Customer->>Razorpay: Authorizes Payment (UPI / Card / NetBanking)
    Razorpay-->>PayPage: Return { razorpay_payment_id, razorpay_order_id, razorpay_signature }

    PayPage->>PayCtrl: POST /api/payments/razorpay/verify
    PayCtrl->>PaySvc: verifyPayment(paymentId, orderId, signature)
    PaySvc->>PaySvc: crypto.createHmac('sha256').update(orderId|paymentId).digest('hex')
    alt Signature Mismatch
        PaySvc-->>PayCtrl: Verification Failed
        PayCtrl-->>PayPage: 400 Bad Request ("Invalid payment signature")
        PayPage-->>Customer: Payment Failed Toast
    else Signature Valid
        PaySvc->>DB: Update Payment { status: 'SUCCESS', razorpayPaymentId }
        PaySvc->>DB: Update Booking { status: 'CONFIRMED', paymentStatus: 'PAID' }
        PaySvc->>NotifSvc: Dispatch BOOKING_CONFIRMED (Customer) & NEW_BOOKING (Vendor)
        PaySvc-->>PayCtrl: Booking Confirmed
        PayCtrl-->>PayPage: 200 OK (Booking Confirmed)
        PayPage-->>Customer: Render Success Screen & Redirect to /my-bookings
    end
```

---

### 1.5 Vendor Offline Walk-In Desk Dispatch Journey

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Walk-in Customer
    actor Vendor as Fleet Vendor
    actor UI as Vendor Portal (CreateOfflineBookingModal)
    participant VendCtrl as Vendor Controller
    participant BookSvc as Booking Service
    participant DB as MongoDB Database

    Customer->>Vendor: Arrives at Hub Desk in Person
    Vendor->>UI: Opens "Offline Walk-in Booking" Modal
    Vendor->>UI: Enters Customer Name, Phone, Driving License Number
    Vendor->>UI: Selects Vehicle, Rental Plan, Dates & Optional Custom Rate Override
    Vendor->>UI: Selects Payment Mode (Cash / Desk UPI)
    UI->>VendCtrl: POST /api/vendor/bookings/offline
    VendCtrl->>BookSvc: createOfflineBooking(vendorId, offlineData)
    BookSvc->>BookSvc: Zero-Collision Interval Validation
    alt Interval Conflict with Existing Reservation
        BookSvc-->>VendCtrl: Collision Error
        VendCtrl-->>UI: 409 Conflict ("Vehicle occupied during interval")
        UI-->>Vendor: Display Collision Error Alert
    else Available
        BookSvc->>DB: Create Booking { bookingType: 'OFFLINE', status: 'CONFIRMED', paymentStatus: 'PAID' }
        BookSvc->>DB: Create Payment Record { paymentMethod: 'offline_cash', status: 'SUCCESS' }
        DB-->>BookSvc: Records Saved
        BookSvc-->>VendCtrl: Confirmed Offline Booking
        VendCtrl-->>UI: 201 Created (Booking Number)
        UI-->>Vendor: Display Success Modal & Add to Unified Booking Ledger
        Vendor->>Customer: Hands over keys / Dispatches vehicle
    end
```

---

### 1.6 Vehicle Handover & Trip Completion Lifecycle

```mermaid
graph TD
    classDef init fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#ffffff;
    classDef active fill:#10b981,stroke:#047857,stroke-width:2px,color:#ffffff;
    classDef complete fill:#6366f1,stroke:#4338ca,stroke-width:2px,color:#ffffff;
    classDef cancel fill:#ef4444,stroke:#b91c1c,stroke-width:2px,color:#ffffff;

    B_Conf[Booking: CONFIRMED<br/>Vehicle: AVAILABLE]:::init -->|Customer Arrives for Pickup| V_Handover[Vendor Executes Handover Modal]
    
    V_Handover -->|1. Record Start Odometer km<br/>2. Inspect Condition Notes<br/>3. POST /api/vendor/bookings/:id/start-trip| B_Active[Booking: ACTIVE<br/>Vehicle: BOOKED]:::active

    B_Active -->|Trip Underway| V_Return[Customer Returns Vehicle at Hub]
    
    V_Return -->|1. Record End Odometer km<br/>2. Inspect Fuel Level<br/>3. Document Damage Incidents<br/>4. Assess Extra Km Charges<br/>5. POST /api/vendor/bookings/:id/complete-trip| B_Comp[Booking: COMPLETED<br/>Vehicle: AVAILABLE]:::complete

    B_Conf -->|Customer Cancels Prior to Trip| B_Cancel[Booking: CANCELLED<br/>Vehicle: AVAILABLE<br/>Refund Assessed]:::cancel
```

---

### 1.7 Fleet Maintenance Scheduling Journey

```mermaid
sequenceDiagram
    autonumber
    actor Vendor as Fleet Vendor
    participant UI as ScheduleMaintenanceModal
    participant MaintCtrl as Maintenance Controller
    participant MaintSvc as Maintenance Service
    participant DB as MongoDB Database

    Vendor->>UI: Selects Vehicle, Service Type (Routine / Repair), Start & End Dates
    Vendor->>UI: Enters Service Center Details & Estimated Cost
    UI->>MaintCtrl: POST /api/maintenance
    MaintCtrl->>MaintSvc: scheduleMaintenance(vendorId, vehicleId, dates, details)
    MaintSvc->>DB: Check for Active Booking Collisions on Vehicle
    alt Vehicle Has Confirmed Bookings in Service Window
        DB-->>MaintSvc: Existing Bookings Found
        MaintSvc-->>MaintCtrl: Conflict Error
        MaintCtrl-->>UI: 409 Conflict ("Vehicle has confirmed customer bookings in this window")
        UI-->>Vendor: Display Scheduling Block Alert
    else No Conflicts
        MaintSvc->>DB: Create Maintenance Record { status: 'SCHEDULED' }
        MaintSvc->>DB: Update Vehicle Status to 'MAINTENANCE' (if immediate)
        DB-->>MaintSvc: Maintenance Persisted
        MaintSvc-->>MaintCtrl: Maintenance Record
        MaintCtrl-->>UI: 201 Created
        UI-->>Vendor: Display Scheduled Service in Dashboard
    end
```

---

### 1.8 Master Admin Vehicle Moderation Journey

```mermaid
sequenceDiagram
    autonumber
    actor Vendor as Fleet Vendor
    actor Admin as Platform Admin
    participant Server as Backend API
    participant NotifSvc as Notification Service
    participant DB as MongoDB Database

    Vendor->>Server: POST /api/vehicles (New Listing Details & Images)
    Server->>DB: Create Vehicle { isApproved: false, status: 'AVAILABLE' }
    Server-->>Vendor: 201 Created (Pending Moderation Notice)

    Admin->>Server: GET /api/admin/vehicles?approvalStatus=pending
    Server->>DB: Query Vehicles { isApproved: false }
    DB-->>Server: Pending Fleet Submissions
    Server-->>Admin: Render Approvals Queue

    alt Admin Approves Vehicle
        Admin->>Server: PATCH /api/admin/vehicles/:id/approval { isApproved: true }
        Server->>DB: Update Vehicle { isApproved: true }
        Server->>NotifSvc: Send VENDOR_APPROVAL Notification ("Listing Approved")
        Server-->>Admin: 200 OK (Vehicle Approved)
    else Admin Rejects Vehicle
        Admin->>Server: PATCH /api/admin/vehicles/:id/approval { isApproved: false, rejectionReason }
        Server->>DB: Update Vehicle { status: 'INACTIVE' }
        Server->>NotifSvc: Send VENDOR_APPROVAL Notification ("Listing Rejected: " + reason)
        Server-->>Admin: 200 OK (Vehicle Rejected)
    end
```

---

### 1.9 Post-Trip Review & Rating Aggregation Journey

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Retail Customer
    participant UI as ReviewModal (MyBookingsPage)
    participant RevCtrl as Review Controller
    participant RevMod as Review Model (Mongoose)
    participant VehMod as Vehicle Model
    participant DB as MongoDB Database

    Customer->>UI: Selects Completed Booking & Rates 1-5 Stars with Comments
    UI->>RevCtrl: POST /api/reviews { bookingId, vehicleId, rating, comment }
    RevCtrl->>RevMod: Check that Booking is COMPLETED and belongs to Customer
    RevMod->>DB: Save Review Document
    DB-->>RevMod: Review Saved
    RevMod->>RevMod: post('save') Hook -> calculateAverageRating(vehicleId)
    RevMod->>DB: Aggregation Pipeline: $match { vehicleId, isModerated: true } -> $avg('rating'), $sum(1)
    DB-->>RevMod: Aggregated Stats { ratingAverage: 4.8, ratingCount: 12 }
    RevMod->>VehMod: findByIdAndUpdate(vehicleId, { ratingAverage, ratingCount })
    VehMod->>DB: Update Vehicle Cached Ratings
    RevCtrl-->>UI: 201 Created (Review Published)
    UI-->>Customer: Display Success Confirmation & Update Vehicle Average Star Rating
```
