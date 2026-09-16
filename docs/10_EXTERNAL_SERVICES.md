# 10 — External Services & Third-Party Integrations

This document catalogues all external services, third-party APIs, and microservices integrated into RentRide.

---

## 1. MongoDB Atlas / Database

* **Service**: MongoDB Atlas Database Cluster
* **Purpose**: Primary operational database storing users, vehicles, categories, bookings, payments, reviews, maintenance, and notifications.
* **Used By**: Node.js Express backend (via Mongoose ODM).
* **Integration Location**: [`server/src/config/db.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/config/db.js)
* **Required Configuration**: `MONGODB_URI` (MongoDB connection URI string).
* **Resilience Mechanism**: In development mode (`NODE_ENV=development`), if the remote MongoDB Atlas cluster is unreachable (e.g. IP whitelist restrictions), the server automatically falls back to an in-memory database instance (`mongodb-memory-server`) and self-seeds initial vehicle categories.
* **Current Status**: Active 🟢

---

## 2. Cloudinary Media Storage CDN

* **Service**: Cloudinary Image & Video Cloud Platform
* **Purpose**: Storing uploaded vehicle photos and user profile avatars; returns optimized image URLs and public IDs.
* **Used By**: Vehicle creation, vehicle update, and user profile avatar upload workflows.
* **Integration Location**:
  * Config: [`server/src/config/cloudinary.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/config/cloudinary.js)
  * Multipart Parser: [`server/src/middleware/upload.middleware.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/middleware/upload.middleware.js)
  * Service Handler: [`server/src/services/vehicle.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/vehicle.service.js#L14)
* **Required Configuration**:
  * `CLOUDINARY_CLOUD_NAME`
  * `CLOUDINARY_API_KEY`
  * `CLOUDINARY_API_SECRET`
* **Current Status**: Configured with fallback sample URLs when credentials are dummy/unconfigured.

---

## 3. Razorpay Payment Gateway

* **Service**: Razorpay Payments API (India)
* **Purpose**: Online payment processing for vehicle rentals; creates payment orders, serves client checkout popup, and verifies HMAC SHA256 payment signatures.
* **Used By**: Customer online checkout and booking confirmation flows.
* **Integration Location**:
  * Client: [`client/src/pages/customer/PaymentPage.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/pages/customer/PaymentPage.jsx) (loads `https://checkout.razorpay.com/v1/checkout.js`)
  * Server Config: [`server/src/config/razorpay.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/config/razorpay.js)
  * Service Logic: [`server/src/services/payment.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/payment.service.js)
* **Required Configuration**:
  * Frontend: `VITE_RAZORPAY_KEY_ID`
  * Backend: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
* **Current Status**: Implemented with full cryptographic signature verification.

---

## 4. Python FastAPI AI Microservice

* **Service**: RentRide AI Machine Learning Service (Port `8000`)
* **Purpose**: Real-time vehicle recommendation ranking (cosine similarity), 7-day city/category demand forecasting, and dynamic pricing surge multipliers.
* **Used By**: Customer storefront recommendations, Vendor dashboard demand widgets, and booking pricing calculations.
* **Integration Location**:
  * FastAPI Microservice: [`ai-service/app/main.py`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/ai-service/app/main.py)
  * Backend Proxy Service: [`server/src/services/ai.service.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/services/ai.service.js)
  * Frontend Widgets: [`AiRecommendationsCarousel.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/ai/AiRecommendationsCarousel.jsx), [`DemandForecastWidget.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/features/ai/DemandForecastWidget.jsx)
* **Required Configuration**:
  * `AI_SERVICE_URL` (`http://localhost:8000`)
  * `AI_SERVICE_API_KEY` (shared secret passed in `X-API-Key` header)
* **Resilience Mechanism**: `AiService` in Node.js contains graceful fallback algorithms (rule-based heuristic calculations) if the Python microservice is offline, preventing checkout or discovery crashes.
* **Current Status**: Active 🟢
