# 13 — Development Roadmap & Action Plan

This roadmap outlines the prioritized phases for future development, clearly distinguishing verified existing requirements from developer/AI suggested enhancements.

---

## Phase 1 — Foundation & Operational Hardening (P0 / Critical)

*Goal: Ensure seamless execution of all existing core transactional flows.*

1. **Automated Gateway Refund Dispatch** *(Existing requirement)*:
   * Connect `razorpay.payments.refund()` inside [`BookingService.cancelBooking`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/booking.service.js#L350) for immediate customer refund settlement.
2. **Expired Reservation Lock Sweeper** *(Existing requirement)*:
   * Implement a background cron job (or MongoDB TTL index on `lockExpiresAt`) to transition abandoned `PENDING_PAYMENT` bookings to `EXPIRED`.
3. **Admin Vendor & KYC Approval Actions** *(Existing requirement)*:
   * Add one-click "Approve Vendor KYC" and "Reject Vendor KYC" action buttons in the Admin Dashboard Users tab.

---

## Phase 2 — Core Communication & Mapping (P1 / High)

*Goal: Improve customer-vendor communication and geographic exploration.*

1. **Email & SMS Notification Dispatch** *(Suggested enhancement)*:
   * Integrate Nodemailer (or SendGrid/Twilio) to send digital booking vouchers with QR codes and OTPs directly to customer and vendor inboxes.
2. **Interactive Map Integration** *(Suggested enhancement)*:
   * Mount Leaflet / OpenStreetMap or Google Maps on the Explore page and Vehicle Details page, rendering pins for pickup hubs based on `location.coordinates`.
3. **Vendor Payout Settlement Module** *(Suggested enhancement)*:
   * Build a dedicated Vendor Payouts ledger where vendors can view accumulated net earnings and request automated disbursements.

---

## Phase 3 — Advanced Fleet & AI Capabilities (P2 / Medium)

*Goal: Elevate fleet operations and predictive marketplace capabilities.*

1. **Live GPS / Telematics Fleet Tracking** *(Suggested enhancement)*:
   * Ingest OBD/GPS telemetry for active bookings, providing real-time speed, battery level (for EVs), and geofence tracking.
2. **Automated AI Model Re-Training Pipeline** *(Suggested enhancement)*:
   * Schedule automated weekly batch re-training of the demand forecasting time series and recommendation weights using real marketplace booking logs.
3. **Customer Loyalty Points & Referral Engine** *(Suggested enhancement)*:
   * Award reward points on completed trips that can be redeemed as discount credits during checkout.

---

## Phase 4 — Security, Testing & Performance (P1 / High)

*Goal: Enterprise-grade reliability and automated test coverage.*

1. **End-to-End Test Suite** *(Existing requirement)*:
   * Expand test scripts in `server/src/scripts/` into automated CI/CD unit and integration tests using Jest/Supertest for backend and Vitest/Playwright for frontend.
2. **Direct Client Cloudinary Uploads** *(Suggested enhancement)*:
   * Implement presigned upload signatures allowing client browsers to upload vehicle images directly to Cloudinary, reducing backend memory overhead.
3. **Redis Caching Layer** *(Suggested enhancement)*:
   * Cache high-frequency public reads (categories, city list, vehicle catalog) in Redis with 5-minute TTL.

---

## Phase 5 — Cloud Deployment & Production Orchestration (P2 / Medium)

*Goal: Multi-environment production infrastructure.*

1. **Docker Containerization** *(Suggested enhancement)*:
   * Write multi-stage Dockerfiles and `docker-compose.yml` for unified deployment of Client, Server, and AI Microservice.
2. **Cloudflare CDN & SSL Ingress** *(Suggested enhancement)*:
   * Configure Cloudflare edge caching, SSL/TLS certificates, and DDoS protection.
