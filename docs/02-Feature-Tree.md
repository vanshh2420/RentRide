# 02 — Feature Tree

> **Document Type:** Hierarchical Functional Scope & Feature Breakdown  
> **Application:** RentRide Multi-Vendor Vehicle Rental Marketplace  
> **Status:** Verified from Live Implementation  
> **Version:** 1.3.0  
> **Date:** 2026-09-03  

---

## 1. Complete Hierarchical Feature Tree

```text
RENTRIDE PLATFORM
│
├── 1. Authentication & Identity Management
│   ├── Customer Authentication
│   │   ├── Registration [AUTH-001]
│   │   ├── Login [AUTH-002]
│   │   └── Session Logout [AUTH-003]
│   │
│   ├── Vendor Authentication
│   │   ├── Vendor Onboarding & Business KYC [AUTH-001]
│   │   ├── Login [AUTH-002]
│   │   └── Session Logout [AUTH-003]
│   │
│   ├── Admin Authentication
│   │   ├── Secure Admin Login [AUTH-002]
│   │   └── Session Logout [AUTH-003]
│   │
│   ├── Profile & Account Management
│   │   ├── View Account Details [USER-001]
│   │   ├── Update Customer Driving License & Phone [USER-002]
│   │   ├── Update Vendor GST, Business Name & Hub [USER-002]
│   │   ├── Cloudinary Avatar Image Upload [USER-003]
│   │   └── Password Change [USER-004]
│   │
│   └── Role-Based Access Control (RBAC)
│       ├── Protected Route Guards [AUTH-005]
│       └── Role Enforcement (CUSTOMER, VENDOR, ADMIN) [AUTH-005]
│
├── 2. Customer: Vehicle Discovery & Marketplace Storefront
│   ├── Marketplace Storefront
│   │   ├── Hero Search Banner [VEH-002]
│   │   ├── Platform Trust Metrics Strip [ADM-001]
│   │   ├── Category Explorer Cards [VEH-001]
│   │   ├── Featured Fleet Showcase [VEH-002]
│   │   ├── AI Trip Matcher Prompt [AI-001]
│   │   ├── "How It Works" Step-by-Step Guide [VEH-001]
│   │   ├── Verified Customer Reviews Feed [REV-002]
│   │   └── Vendor Onboarding Call-to-Action [AUTH-001]
│   │
│   ├── Operating Hub & City Discovery
│   │   ├── Supported Hubs Selection (Indore, Bhopal, Gwalior) [VEH-003]
│   │   ├── City Autocomplete Suggestion Dropdown [VEH-003]
│   │   └── Cross-City All-Hubs Search Mode [VEH-003]
│   │
│   ├── Vehicle Category Browsing
│   │   ├── Electric Scooters (2-Wheeler) [VEH-001]
│   │   ├── Standard Scooters (2-Wheeler) [VEH-001]
│   │   ├── Geared Motorcycles & Bikes (2-Wheeler) [VEH-001]
│   │   ├── Hatchback Cars (4-Wheeler) [VEH-001]
│   │   ├── Sedan Cars (4-Wheeler) [VEH-001]
│   │   └── SUVs & Adventure Vehicles (4-Wheeler) [VEH-001]
│   │
│   ├── Rental Plans & Pricing Models
│   │   ├── Hourly Rental Plan (Flexible Short Trips) [BOOK-002]
│   │   ├── 12-Hour Rental Plan (Day Trips & Work Commutes) [BOOK-002]
│   │   ├── 24-Hour Rental Plan (Overnight & Weekend Getaways) [BOOK-002]
│   │   └── Plan Rate Comparison Calculator [BOOK-002]
│   │
│   ├── Faceted Fleet Search & Filtering
│   │   ├── Search by Brand & Model Keyword [VEH-002]
│   │   ├── Filter by Category (Slug / ID) [VEH-002]
│   │   ├── Filter by Vehicle Type (2-Wheeler vs 4-Wheeler) [VEH-002]
│   │   ├── Filter by Propulsion / Fuel (Petrol, Diesel, EV, CNG, Hybrid) [VEH-002]
│   │   ├── Filter by Transmission (Manual vs Automatic) [VEH-002]
│   │   ├── Filter by Maximum Price Range Slider [VEH-002]
│   │   ├── Active Filter Chips (Removable / Clear All) [VEH-002]
│   │   └── Real-time URL Search Parameters Sync [VEH-002]
│   │
│   ├── Sorting & View Modes
│   │   ├── Sort by Popular / Recommended [VEH-002]
│   │   ├── Sort by Newest Listings [VEH-002]
│   │   ├── Sort by Price (Ascending / Descending) [VEH-002]
│   │   ├── Sort by Highest Rated [VEH-002]
│   │   ├── Responsive Fleet Grid Layout [VEH-002]
│   │   └── Interactive Map Hub View [VEH-005] [PARTIAL]
│   │
│   └── Vehicle Details & Specifications
│       ├── High-Resolution Image Carousel [VEH-004]
│       ├── Technical Specifications (Fuel, Transmission, Seats, Engine CC/kWh) [VEH-004]
│       ├── Feature Badges & Inclusions (ABS, Helmets, Fast Charge, Sunroof) [VEH-004]
│       ├── Operating Hub & Pickup Location Address [VEH-004]
│       ├── Verified Vendor Information Badge [VEH-004]
│       ├── Live Rental Price Estimator [VEH-004]
│       ├── Real-time Interval Availability Conflict Checker [BOOK-001]
│       └── Customer Ratings & Feedback Feed [REV-002]
│
├── 3. Customer: Booking & Rental Lifecycle
│   ├── Slot Availability & Anti-Collision Engine
│   │   ├── Zero-Collision Interval Validation Algorithm [BOOK-001]
│   │   ├── Active Rental Conflict Detection [BOOK-001]
│   │   └── Scheduled Maintenance Window Conflict Detection [BOOK-001]
│   │
│   ├── Transparent Price Calculation
│   │   ├── Server-Side Base Rate Calculation [BOOK-002]
│   │   ├── Dynamic Weekend Surge Multiplier (1.15x) [BOOK-002]
│   │   ├── Platform Fee Calculation (5%) [BOOK-002]
│   │   ├── GST / Tax Calculation (18%) [BOOK-002]
│   │   ├── Refundable Security Deposit Inclusion [BOOK-002]
│   │   └── Vendor Payout & Platform Commission Split (88% / 12%) [BOOK-002]
│   │
│   ├── Promotional Discount Engine
│   │   ├── Promo Code Validation [COUP-001]
│   │   ├── Percentage Discount with Maximum Cap [COUP-001]
│   │   ├── Fixed Discount Value [COUP-001]
│   │   ├── Minimum Order Amount Check [COUP-001]
│   │   └── Per-User and Global Usage Limit Enforcement [COUP-001]
│   │
│   ├── Online Reservation & Checkout
│   │   ├── 10-Minute Reservation Hold Lock (Anti-Double-Booking TTL) [BOOK-003]
│   │   ├── Driving License & Identity Confirmation [BOOK-004]
│   │   ├── Trip Interval Review [BOOK-004]
│   │   └── Itemized Price Breakdown Review [BOOK-004]
│   │
│   └── Customer Booking Management
│       ├── My Bookings Dashboard (Upcoming, Active, Completed, Cancelled) [BOOK-005]
│       ├── Booking Summary & Digital Receipt [BOOK-005]
│       ├── Pickup & Return Details [BOOK-005]
│       ├── Rental Cancellation Workflow [BOOK-006]
│       └── Progressive Refund Calculation [PAY-004] [PARTIAL]
│
├── 4. Payments & Financial Transactions
│   ├── Online Payment Gateway Integration
│   │   ├── Razorpay Server-Side Order Creation [PAY-001]
│   │   ├── Razorpay Modal Checkout [PAY-001]
│   │   ├── Cryptographic HMAC-SHA256 Signature Verification [PAY-002]
│   │   ├── Hold Lock to Confirmed Booking Transition [PAY-002]
│   │   └── Payment Failure Logging & Recovery [PAY-003]
│   │
│   └── Financial Ledger & Transaction History
│       ├── User Transaction History [PAY-001]
│       └── Vendor Payout Ledger [ADM-001]
│
├── 5. Vendor: Fleet Dispatch & Operations Portal
│   ├── Operations Dashboard
│   │   ├── Real-time Fleet Metrics (Total, Available, In Maintenance) [VEN-001]
│   │   ├── Rental Statistics (Active, Upcoming, Completed, Total) [VEN-001]
│   │   ├── Financial KPI Cards (Gross GMV, Net Earnings, Pending Payouts) [VEN-001]
│   │   └── AI Demand & Market Trends Preview [AI-002]
│   │
│   ├── Vehicle Fleet Management (CRUD)
│   │   ├── Add New Vehicle Listing [VEN-002]
│   │   │   ├── Brand, Model, Year, Registration Number [VEN-002]
│   │   │   ├── Category Selection [VEN-002]
│   │   │   ├── Fuel, Transmission, Seating Capacity, Engine Size [VEN-002]
│   │   │   ├── Hourly, 12-Hour, 24-Hour Pricing & Security Deposit [VEN-002]
│   │   │   ├── Hub City, State, Street Address [VEN-002]
│   │   │   ├── Feature Pills (Bluetooth, ABS, Helmet, Sunroof) [VEN-002]
│   │   │   └── Cloudinary Multi-Image Upload [VEN-002]
│   │   ├── Update Vehicle Details & Rates [VEN-002]
│   │   ├── Delete Vehicle Listing [VEN-002]
│   │   ├── Quick Status Toggle (AVAILABLE, MAINTENANCE, INACTIVE) [VEN-003]
│   │   └── Fleet Filter & Inventory Search [VEN-002]
│   │
│   ├── Unified Fleet Bookings Management
│   │   ├── Combined Online & Offline Bookings List [VEN-001]
│   │   ├── Filter by Booking Status (Confirmed, Active, Completed, Cancelled) [VEN-001]
│   │   └── Filter by Channel (Online vs Offline Walk-in) [VEN-001]
│   │
│   ├── Offline Walk-in Desk Booking
│   │   ├── Walk-in Customer Capture (Name, Phone, Driving License) [VEN-004]
│   │   ├── Vehicle & Interval Selection [VEN-004]
│   │   ├── Instant Anti-Collision Availability Check [BOOK-001]
│   │   ├── Custom Desk Rate Override [VEN-004]
│   │   ├── Cash / UPI Payment Collection at Desk [VEN-004]
│   │   └── Instant Confirmed Reservation Creation [VEN-004]
│   │
│   ├── Vehicle Handover & Trip Start
│   │   ├── Handover Modal Checklist [VEN-005]
│   │   ├── Start Odometer (km) Recording [VEN-005]
│   │   ├── Handover Condition Notes [VEN-005]
│   │   ├── Transition Booking Status to ACTIVE [VEN-005]
│   │   └── Transition Vehicle Status to BOOKED [VEN-005]
│   │
│   ├── Vehicle Return & Trip Completion
│   │   ├── Return Modal Checklist [VEN-006]
│   │   ├── End Odometer (km) Recording & Distance Driven Calculation [VEN-006]
│   │   ├── Fuel Level Inspection [VEN-006]
│   │   ├── Damage Incident Reporting [VEN-006]
│   │   ├── Extra Kilometer / Late Return Charges Assessment [VEN-006]
│   │   ├── Transition Booking Status to COMPLETED [VEN-006]
│   │   └── Release Vehicle Status back to AVAILABLE [VEN-006]
│   │
│   └── Fleet Maintenance Scheduling
│       ├── Schedule Maintenance Modal [MAIN-001]
│       ├── Service Type (Routine, Repair, Inspection, Cleaning) [MAIN-001]
│       ├── Service Interval (Start Date to End Date) [MAIN-001]
│       ├── Garage Name & Estimated Cost [MAIN-001]
│       ├── Automatic Slot Blocking (Prevents Booking Collisions) [BOOK-001]
│       ├── Complete Maintenance Modal [MAIN-002]
│       └── Actual Cost & Work Done Logging [MAIN-002]
│
├── 6. Master Admin: Governance & Platform Control
│   ├── Master Analytics & Financial Oversight
│   │   ├── Platform Overview Metrics (Users, Vendors, Vehicles, Bookings) [ADM-001]
│   │   ├── Gross Merchandise Value (GMV) Aggregation [ADM-001]
│   │   ├── Platform Commission Revenue Aggregation [ADM-001]
│   │   ├── Total Vendor Payout Liability [ADM-001]
│   │   └── Recent Bookings Audit Stream [ADM-001]
│   │
│   ├── Vehicle Moderation & Approval Engine
│   │   ├── Pending Vehicle Approvals Queue [ADM-002]
│   │   ├── Vehicle Verification Inspection [ADM-002]
│   │   ├── Approve Vehicle Listing (Sets to AVAILABLE) [ADM-002]
│   │   ├── Reject Vehicle Listing (Sets to INACTIVE with Reason) [ADM-002]
│   │   └── Instant Notification Dispatch to Vendor [NOTIF-002]
│   │
│   ├── User & Vendor Governance
│   │   ├── Registered Users Directory (Customers, Vendors, Admins) [ADM-003]
│   │   ├── Filter by Role [ADM-003]
│   │   └── Search Users by Name, Email, or Phone [ADM-003]
│   │
│   ├── Global Bookings Audit Trail
│   │   ├── Platform-wide Bookings Directory [ADM-004]
│   │   ├── Status-based Filtering [ADM-004]
│   │   └── Customer, Vendor, Vehicle & Payout Inspection [ADM-004]
│   │
│   ├── Promotional Coupon Governance (CRUD)
│   │   ├── Coupon Manager Interface [COUP-002]
│   │   ├── Create Coupon (Code, Discount Type, Discount Value, Limits) [COUP-002]
│   │   ├── Edit Coupon Parameters [COUP-002]
│   │   ├── Toggle Active / Inactive Status [COUP-002]
│   │   ├── Delete Coupon [COUP-002]
│   │   └── Real-time Usage Tracker [COUP-002]
│   │
│   └── Vehicle Category Management
│       ├── Category Listing & Types [VEH-001]
│       ├── Create Category (Admin API) [VEH-001]
│       ├── Update Category Details (Admin API) [VEH-001]
│       └── Delete Category (Admin API) [VEH-001]
│
├── 7. Reviews & Verified Ratings
│   ├── Customer Review Submission
│   │   ├── Post-Trip Review Modal Form [REV-001]
│   │   ├── Star Rating (1 to 5 Stars) [REV-001]
│   │   └── Written Feedback & Title [REV-001]
│   │
│   ├── Rating Aggregation Pipeline
│   │   ├── MongoDB Aggregation Calculating Average Rating [REV-001]
│   │   ├── Total Review Count Increment [REV-001]
│   │   └── Real-time Vehicle Schema Update [REV-001]
│   │
│   └── Vehicle Review Feed
│       ├── Review Cards Display on Vehicle Details [REV-002]
│       └── Verified Customer Badge [REV-002]
│
├── 8. Notifications & Alerts
│   ├── Notification Feed
│   │   ├── Navbar Dropdown Bell with Unread Badge Counter [NOTIF-001]
│   │   ├── Mark Single Notification as Read [NOTIF-001]
│   │   └── Mark All Notifications as Read [NOTIF-001]
│   │
│   └── Automated Notification Triggers
│       ├── Welcome & System Announcements [NOTIF-002]
│       ├── Booking Confirmation (Customer) [NOTIF-002]
│       ├── New Booking Alert (Vendor) [NOTIF-002]
│       ├── Booking Cancellation Notice (Customer & Vendor) [NOTIF-002]
│       ├── Trip Started & Initial Odometer Notice (Customer) [NOTIF-002]
│       ├── Trip Completed & Distance Driven Notice (Customer) [NOTIF-002]
│       └── Vehicle Listing Approved / Rejected (Vendor) [NOTIF-002]
│
├── 9. AI & Machine Learning Features
│   ├── FastAPI AI Microservice
│   │   ├── Python FastAPI Backend with Pydantic v2 Validation [AI-001]
│   │   └── Internal Service-to-Service API Key Guard [PLAT-003]
│   │
│   ├── Personalized Vehicle Recommendations
│   │   ├── Multi-Attribute Scoring Engine [AI-001]
│   │   ├── Preference Matching (Budget, Category, Fuel, Transmission) [AI-001]
│   │   ├── Customer Rating & Popularity Weighting [AI-001]
│   │   ├── Heuristic Fallback Engine (Resilient if AI offline) [AI-001]
│   │   └── Frontend AI Recommendation Carousel [AI-001]
│   │
│   ├── 7-Day Demand Forecasting
│   │   ├── Day-of-Week Seasonality Analysis [AI-002]
│   │   ├── City & Metro Multipliers [AI-002]
│   │   ├── Fleet Utilization Pressure Integration [AI-002]
│   │   ├── Surge Level Classification (Low, Moderate, High, Peak) [AI-002]
│   │   └── Vendor Demand Forecast Widget & Utilization Visualizer [AI-002]
│   │
│   └── Dynamic Pricing Engine
│       ├── Real-time Optimal Rate Multiplier Calculation [AI-003]
│       ├── Fleet Scarcity Surge (>75% utilization) [AI-003]
│       ├── Weekend Demand Surge (+15%) [AI-003]
│       ├── Metro Multiplier [AI-003]
│       ├── Bounded Multiplier (0.90x to 1.35x) [AI-003]
│       └── Potential Revenue Uplift Estimation [AI-003]
│
└── 10. Shared Platform Infrastructure & Utilities
    ├── Resilient Database Fallback & Seeding
    │   ├── Primary MongoDB Atlas Connection [PLAT-001]
    │   ├── In-Memory MongoDB Fallback (`mongodb-memory-server`) [PLAT-001]
    │   └── Auto-Seeding of Categories, Users & Vehicles across Hubs [PLAT-001]
    │
    ├── Asset Management
    │   ├── Cloudinary Multi-Image Upload [USER-003, VEN-002]
    │   └── Cloudinary Asset Deletion on Vehicle Removal [VEN-002]
    │
    └── Error Handling & Validation
        ├── Centralized API Error Response Formatter [PLAT-003]
        ├── Express Global Error Middleware [PLAT-003]
        ├── Client-side Axios Error Interceptor with Contextual Messages [PLAT-003]
        └── Zod Schema Validation for Form & Request Payloads [PLAT-003]
```
