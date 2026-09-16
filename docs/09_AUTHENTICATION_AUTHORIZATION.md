# 09 — Authentication & Authorization Architecture

This document describes the security protocols, session management, cryptographic hashing, and role-based access control (RBAC) implemented across RentRide.

---

## 1. Authentication Architecture

RentRide employs a **Dual-Mode JWT (JSON Web Token)** authentication system:

```
[User Login Credentials]
         ↓
[Verify Email & Password Hash (Bcrypt)]
         ↓
[Generate Signed JWT Token (7-Day Expiry)]
         ↓
  ┌───────────────────────────────┴───────────────────────────────┐
  ↓                                                               ↓
[Set HttpOnly Cookie]                               [Return in JSON Response Body]
(rentride_token, SameSite: Strict)                  (localStorage: rentride_token)
```

### 1. Password Hashing & Salting
* **Algorithm**: `bcryptjs` with **10 salt rounds** executed in a Mongoose `pre('save')` schema hook on [`User`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/models/user.model.js#L86-L95).
* **Field Projection**: The `password` field has `select: false` configured on the schema, preventing accidental exposure in database queries unless explicitly requested with `.select('+password')`.

### 2. Token Generation & Expiration
* **Payload**: `{ _id, email, name, role }`
* **Signing Algorithm**: HMAC SHA256 using `ENV.JWT_SECRET`
* **Default Expiration**: 7 days (`JWT_EXPIRES_IN=7d`)

---

## 2. Authorization & Role-Based Access Control (RBAC)

RentRide defines three roles in [`server/src/constants/roles.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/constants/roles.js):
1. **`CUSTOMER`**: Default role for standard accounts.
2. **`VENDOR`**: Commercial fleet operators.
3. **`ADMIN`**: Platform administrators.

### Role Permission Matrix

| Resource / Action | `CUSTOMER` | `VENDOR` | `ADMIN` | Public |
| :--- | :---: | :---: | :---: | :---: |
| Browse Vehicles & Categories | ✅ | ✅ | ✅ | ✅ |
| Live Availability & Price Quote | ✅ | ✅ | ✅ | ✅ |
| Online Booking & Razorpay Checkout | ✅ | ❌ | ❌ | ❌ |
| View Personal Booking History | ✅ | ❌ | ❌ | ❌ |
| Submit Vehicle Reviews | ✅ | ❌ | ❌ | ❌ |
| Add Vehicle to Fleet | ❌ | ✅ | ✅ | ❌ |
| Create Walk-In Offline Booking | ❌ | ✅ | ✅ | ❌ |
| Execute Vehicle Handover / Return | ❌ | ✅ | ✅ | ❌ |
| Schedule Fleet Maintenance | ❌ | ✅ | ✅ | ❌ |
| View Vendor KPI Dashboard | ❌ | ✅ | ✅ | ❌ |
| Moderate / Approve Vehicle Listings | ❌ | ❌ | ✅ | ❌ |
| Audit All Users & KYC Records | ❌ | ❌ | ✅ | ❌ |
| Audit Global Booking Ledger | ❌ | ❌ | ✅ | ❌ |
| Create & Manage Promo Coupons | ❌ | View Only | ✅ | ❌ |

---

## 3. Middleware Implementation

### 1. Authentication Guard (`protect`)
* **File**: [`server/src/middleware/auth.middleware.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/middleware/auth.middleware.js)
* **Behavior**:
  1. Checks for Bearer token in `req.headers.authorization`.
  2. Falls back to `req.cookies.rentride_token`.
  3. Decodes and verifies token against `ENV.JWT_SECRET`.
  4. Loads active user document from database (`User.findById(decoded._id)`).
  5. Attaches sanitized user object to `req.user` or throws `401 Unauthorized`.

### 2. Role Guard (`authorize(...roles)`)
* **File**: [`server/src/middleware/role.middleware.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/middleware/role.middleware.js)
* **Behavior**: Checks if `roles.includes(req.user.role)`. If not authorized, returns `403 Forbidden: Access denied. Required role: [X]`.

---

## 4. Frontend Route Protection

The client enforces role boundaries via React Router components in [`ProtectedRoute.jsx`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/client/src/components/navigation/ProtectedRoute.jsx):

```jsx
// Requires authentication
<ProtectedRoute>
  <ProfilePage />
</ProtectedRoute>

// Requires specific role (e.g. VENDOR)
<RoleRoute allowedRoles={['VENDOR']}>
  <VendorLayout />
</RoleRoute>
```

---

## 5. Security & Rate Limiting Controls

1. **Brute Force Protection ([`rateLimiter.middleware.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/middleware/rateLimiter.middleware.js))**:
   * Auth endpoints (`/api/auth/login`, `/api/auth/register`) capped at **10 requests per 15 minutes** per IP.
   * General API endpoints capped at **200 requests per 15 minutes** per IP.
2. **CORS Policy ([`server/src/app.js`](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/server/src/app.js#L17-L30))**:
   * Restricts cross-origin requests to `CLIENT_URL` (`http://localhost:5173`) and local dev domains with credentials enabled.
3. **Helmet Security Headers**: Sets secure HTTP response headers against clickjacking, XSS, and MIME-sniffing.
4. **Input Sanitization**: All route payloads strictly parsed and validated against typed **Zod schemas** before reaching controllers.
