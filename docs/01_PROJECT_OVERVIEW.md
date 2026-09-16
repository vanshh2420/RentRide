# 01 — Project Overview

## Project Name
**RentRide** — Multi-Vendor Vehicle Rental Marketplace

---

## Project Purpose & Problem Statement
RentRide is a comprehensive, production-grade vehicle rental marketplace designed to connect **Customers**, **Vehicle Vendors**, and **Platform Administrators**.

The platform solves major pain points in the vehicle rental industry:
1. **Zero-Collision Inventory Scheduling**: Prevents double-booking across both online digital reservations and walk-in offline rentals using interval-overlap validation and temporary checkout reservation locks.
2. **Multi-Vendor Fleet Empowerment**: Enables independent vehicle owners and rental agencies to list two-wheelers (scooters, motorbikes, EVs) and four-wheelers (hatchbacks, sedans, SUVs), manage maintenance schedules, record walk-in customers, and monitor earnings.
3. **Transparent Tiered & Dynamic Pricing**: Supports transparent rental plans (**Hourly**, **12-Hour Daily**, and **24-Hour Multi-Day**) with rule-based weekend surge pricing, coupon discounts, platform fee breakdowns, security deposit handling, and AI-driven dynamic pricing recommendations.
4. **AI-Powered Discovery & Optimization**: Integrates a dedicated Python/FastAPI microservice providing content-based vehicle recommendations, 7-day demand forecasting, and rate optimization.

---

## Target Users & Roles

RentRide recognizes three distinct user roles defined in [`server/src/constants/roles.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/constants/roles.js):

| Role | Target User | Key Responsibilities & Capabilities |
| :--- | :--- | :--- |
| **`CUSTOMER`** | Everyday commuters, tourists, and travelers | Browse vehicles, filter by category/city/price, select rental plans, apply promo coupons, checkout via Razorpay, view booking history, download receipts, and write verified reviews. |
| **`VENDOR`** | Fleet operators, bike rental shops, car owners | Register business profile/GST, list vehicles with photos and pricing tiers, manage walk-in offline bookings, execute vehicle handover/return workflows, track maintenance schedules, and monitor earnings analytics. |
| **`ADMIN`** | Platform operators & managers | Platform-wide KPI monitoring, vehicle listing moderation & approvals, user/vendor management, global booking audit, coupon lifecycle management, and revenue analytics. |

---

## Core Value Proposition

* **Guaranteed Availability**: An interval overlap collision detection engine (`isVehicleAvailable`) guarantees that no vehicle can be double-booked across online reservations, walk-in offline rentals, or maintenance downtime.
* **Multi-Plan Flexibility**: Customers can choose between hourly short trips, 12-hour daytime commutes, and 24-hour long journeys with automated cost calculation.
* **Unified Vendor Workflow**: Vendors can log walk-in customers alongside online bookings, preventing physical fleet fragmentation.
* **Integrated Payments & Trust**: End-to-end Razorpay payment gateway integration, automated status transitions, transparent breakdown of GST and security deposits, and verified customer reviews.
* **AI-Assisted Operations**: Machine learning microservice for vehicle recommendations, fleet demand forecasting, and dynamic pricing elasticity.

---

## Technology Stack

The project is structured as a modern full-stack MERN monorepo with an auxiliary Python AI microservice:

```
RentRide/
├── client/       # React 18 + Vite SPA Frontend
├── server/       # Node.js + Express + MongoDB REST API Backend
├── ai-service/   # Python 3 + FastAPI Machine Learning Microservice
└── docs/         # Complete Technical Architecture Documentation
```

### Technology Breakdown

| Layer | Technologies Found in Codebase |
| :--- | :--- |
| **Frontend Framework** | React 18.3.1, Vite 6.1.0 |
| **Routing & Navigation** | React Router DOM v7.1.5 (with Role-Based Route Guards) |
| **State Management** | Redux Toolkit 2.5.1, React Redux 9.2.0 |
| **Styling & Design System** | Tailwind CSS 3.4.17 (Custom color palette, dark mode support, Outfit & Inter fonts), PostCSS, Autoprefixer |
| **UI Components & Icons** | Lucide React 0.475.0, React Icons 5.4.0, Framer Motion 12.4.7, Recharts 2.15.1 |
| **Form Management & Validation** | React Hook Form 7.54.2, `@hookform/resolvers`, Zod 3.24.2 |
| **HTTP Client** | Axios 1.7.9 (Configured with request/response interceptors, credentials, and token injection) |
| **Backend Runtime & Framework** | Node.js (ES Modules), Express 4.21.2 |
| **Database & ODM** | MongoDB, Mongoose 8.10.1 (with in-memory fallback for local dev via `mongodb-memory-server`) |
| **Authentication & Security** | JWT (`jsonwebtoken` 9.0.2), `bcryptjs` 3.0.3, `cookie-parser` 1.4.7, `helmet` 8.0.0, `express-rate-limit` 7.5.0, CORS |
| **File Storage & Media** | Multer 1.4.5-lts.1 (Memory storage), Cloudinary SDK 2.5.1 |
| **Payment Gateway** | Razorpay Node.js SDK 2.9.5 |
| **Logging & Utility** | Morgan 1.10.0, Custom Colored Logger, Date-fns 4.1.0 |
| **AI Microservice** | Python 3, FastAPI 0.115.8, Uvicorn 0.34.0, Scikit-learn 1.6.1, Pandas 2.2.3, NumPy 2.2.3, Pydantic v2 |
| **Development & Tooling** | Nodemon 3.1.9, Dotenv 16.4.7 |

---

## Major Implemented Capabilities

1. **City-Based Discovery**: Autocomplete selection for operating hubs (Indore, Bhopal, Gwalior) with instant inventory filtering.
2. **Vehicle Categorization**: Multi-tier vehicle browsing across Two-Wheelers (Electric Scooters, Scooters, Bikes) and Four-Wheelers (Hatchbacks, Sedans, SUVs).
3. **Availability & Collision Engine**: Automated conflict resolution checking overlapping bookings and scheduled maintenance.
4. **Checkout & Reservation Lock**: 10-minute temporary inventory locking during checkout before payment capture.
5. **Razorpay Payment Integration**: Server-side order creation, HMAC-SHA256 signature verification, and automated payment state reconciliation.
6. **Unified Vendor Operations**: Walk-in offline booking creation, vehicle handover (odometer/OTP), trip completion, and earnings calculation.
7. **Maintenance Management**: Vendor scheduling for routine service, repairs, and inspections with automated availability blockouts.
8. **Admin Governance**: Fleet moderation, approval/rejection workflows, user management, and platform analytics.
9. **Coupon & Discount Engine**: Percentage and fixed discount rules with user usage limits, expiration dates, and minimum booking requirements.
10. **Review & Rating System**: Verified post-trip reviews with automatic vehicle average rating aggregation.
11. **In-App Notifications**: Real-time notifications for booking confirmations, cancellations, payments, and system announcements.
12. **AI Microservice**: Content-based vehicle recommendation cosine similarity, 7-day demand forecasting, and dynamic pricing calculation.

---

## Application Summary

RentRide is an enterprise-ready vehicle rental solution designed to scale from localized city hubs to a nationwide marketplace. The architecture enforces strict separation of concerns across a React Single-Page Application (SPA), an Express RESTful API backend, a MongoDB document database, and an auxiliary FastAPI machine learning microservice.

The platform guarantees zero booking overlaps through atomic database queries, validates all pricing calculations on the server, protects sensitive operations with JWT and role-based access control, and offers intuitive dashboards customized for customers, fleet vendors, and system administrators.
