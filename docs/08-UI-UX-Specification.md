# 08 — UI/UX Specification & Frontend Design System

> **Document Type:** User Interface, User Experience & Component Specification  
> **Application:** RentRide Multi-Vendor Vehicle Rental Marketplace  
> **Status:** Verified from Live Implementation  
> **Version:** 1.3.0  
> **Date:** 2026-09-03  

---

## 1. Design System & Global Principles

RentRide's frontend user experience is built around a modern, accessible, mobile-first design system utilizing **Tailwind CSS 3.4**, **Framer Motion** for micro-interactions, and **Lucide React** for iconography.

### Visual Foundations
* **Color Palette:**
  * **Primary (Brand):** Electric Indigo & Blue (`bg-blue-600`, `hover:bg-blue-700`, `text-blue-600`) symbolizing trust and mobility.
  * **Secondary / Accent:** Emerald Green (`bg-emerald-600`) for success, pricing badges, and completed states.
  * **Amber / Warning:** Warm Gold (`bg-amber-500`) for ratings, maintenance states, and surge pricing alerts.
  * **Danger / Destructive:** Crimson Red (`bg-red-600`) for cancellation actions, error states, and collision conflicts.
  * **Neutrals:** Slate Gray scale (`slate-50` to `slate-900`) with comprehensive dark mode support.
* **Typography:** System-native sans-serif stack (`Inter`, system UI) with strict hierarchy:
  * Page Hero: `text-4xl md:text-5xl font-extrabold tracking-tight`
  * Section Headers: `text-2xl md:text-3xl font-bold text-slate-900 dark:text-white`
  * Card Titles: `text-lg font-semibold`
  * Body Text: `text-sm md:text-base text-slate-600 dark:text-slate-300`
  * Microcopy / Badges: `text-xs font-medium uppercase tracking-wider`
* **Interaction Feedback:**
  * Interactive components provide explicit focus rings (`focus:ring-2 focus:ring-blue-500 focus:outline-none`).
  * Asynchronous actions render animated SVG spinners or pulsing skeleton placeholders.

---

## 2. Page Hierarchy & Layout Architectures

The client implements three distinct nested layout shells defined in `client/src/layouts/`:

```text
App Shells
├── CustomerLayout (Public & Retail Customer Shell)
│   ├── Sticky Navigation Header (Brand, City Autocomplete, Navigation Links, Notification Bell, User Menu)
│   ├── Main Dynamic Outlet
│   └── Footer (Sitemap, Legal Policies, Trust Badges, Support Contacts)
│
├── VendorLayout (Fleet Operations Shell)
│   ├── Vendor Header (Hub Switcher, Notification Bell, User Avatar)
│   ├── Sidebar Navigation (Dashboard, My Vehicles, Bookings Ledger, Maintenance, Earnings, AI Forecast)
│   └── Operations Dynamic Outlet
│
└── AdminLayout (Platform Governance Shell)
    ├── Master Header (Global Search, Notification Center, Superadmin Controls)
    ├── Admin Sidebar (Approvals Queue, Users Directory, Bookings Audit, Coupons, Platform Revenue)
    └── Governance Dynamic Outlet
```

---

## 3. Page Specifications & Requirement Mappings

### 3.1 Public & Customer Pages

#### 1. Home Page (`HomePage.jsx`)
* **Route:** `/`
* **Layout:** `CustomerLayout`
* **Access:** Public / Guest / All Roles
* **Key Modules:**
  * **Hero Search Banner:** Quick hub city picker, date interval selection, and search call-to-action.
  * **Platform Trust Strip:** Verified vehicle count, happy customers, and guaranteed zero-collision metrics.
  * **Category Explorer Cards:** Interactive grid showing 2-wheelers and 4-wheelers with icons and direct explore links.
  * **Featured Fleet Showcase:** Carousel of top-rated vehicles in the selected city.
  * **AI Trip Matcher:** Interactive prompt guiding users to personalized vehicle picks.
  * **"How It Works" Stepper:** 3-step visualization (1. Choose Vehicle, 2. Book & Pay, 3. Pickup & Ride).
  * **Customer Testimonials:** Verified reviews carousel with star ratings.
* **Related Requirements:** `VEH-001`, `VEH-002`, `VEH-003`, `AI-001`

#### 2. Vehicle Explore Catalog (`ExplorePage.jsx`)
* **Route:** `/explore`
* **Layout:** `CustomerLayout`
* **Access:** Public
* **Key Modules:**
  * **Faceted Sidebar Filter:** Checkboxes for category, fuel type, transmission, seating capacity; range slider for max price; city selector.
  * **Active Filter Chips:** Removable chips with a "Clear All" action.
  * **Sorting Dropdown:** Popular, Newest, Price: Low to High, Price: High to Low, Highest Rated.
  * **Responsive Vehicle Grid:** Multi-column grid rendering `VehicleCard` components with image carousel, specs, pricing pills, and "Rent Now" action.
  * **Empty State:** Clean illustration and "Reset Filters" action when zero vehicles match.
* **Related Requirements:** `VEH-002`, `VEH-003`

#### 3. Vehicle Categories Page (`CategoriesPage.jsx`)
* **Route:** `/categories`
* **Layout:** `CustomerLayout`
* **Access:** Public
* **Key Modules:**
  * Category tiles partitioned by Two-Wheelers and Four-Wheelers.
  * Displays category descriptions, icons, and one-click navigation to pre-filtered `/explore?category=...`.
* **Related Requirements:** `VEH-001`

#### 4. Rental Plans & Pricing Comparison (`RentalPlansPage.jsx`)
* **Route:** `/rental-plans`, `/pricing`
* **Layout:** `CustomerLayout`
* **Access:** Public
* **Key Modules:**
  * Interactive rate comparison between **Hourly** (short errands), **12-Hour Day Pass** (work commutes), and **24-Hour Overnight** (weekend trips).
  * Rate calculator slider estimating costs across duration hours.
* **Related Requirements:** `BOOK-002`

#### 5. Vehicle Details Page (`VehicleDetailsPage.jsx`)
* **Route:** `/vehicles/:id`
* **Layout:** `CustomerLayout`
* **Access:** Public
* **Key Modules:**
  * **Image Gallery:** Large primary image with thumbnail selector.
  * **Specifications Grid:** Fuel type, transmission, seating capacity, engine cc / kWh battery, manufacturing year.
  * **Feature Badges:** ABS, Helmet included, Bluetooth, Sunroof, Fast Charging.
  * **Operating Location:** Street pickup address, hub city, and verified vendor badge.
  * **Live Reservation Widget:** Interactive plan selector, date/time pickers, dynamic subtotal estimate, and conflict checker.
  * **Verified Reviews Feed:** List of customer review cards with star ratings and timestamps.
* **Related Requirements:** `VEH-004`, `BOOK-001`, `REV-002`

#### 6. Reservation Checkout Page (`CheckoutPage.jsx`)
* **Route:** `/checkout/:id`
* **Layout:** `CustomerLayout`
* **Access:** Protected (`CUSTOMER` only)
* **Key Modules:**
  * **Reservation Summary:** Selected vehicle brand, model, dates, duration hours, and pickup hub.
  * **Driving License Confirmation:** Input for DL number with pre-fill from user profile.
  * **Promotional Coupon Input:** Promo code field with real-time validation and instant discount subtraction.
  * **Transparent Price Table:** Itemized list of Base Rental, Weekend Surge, Coupon Discount, Platform Fee, 18% GST, Security Deposit, and Final Amount Payable.
  * **Lock Timer Indicator:** Informs user of the 10-minute hold lock upon checkout start.
* **Related Requirements:** `BOOK-003`, `BOOK-004`, `COUP-001`

#### 7. Payment Gateway Modal & Confirmation (`PaymentPage.jsx`)
* **Route:** `/payment/:id`
* **Layout:** `CustomerLayout`
* **Access:** Protected (`CUSTOMER` only)
* **Key Modules:**
  * Razorpay Checkout Launcher button.
  * Payment status polling and failure retry actions.
  * Successful payment confirmation with digital booking reference number.
* **Related Requirements:** `PAY-001`, `PAY-002`, `PAY-003`

#### 8. My Bookings Dashboard (`MyBookingsPage.jsx`)
* **Route:** `/my-bookings`
* **Layout:** `CustomerLayout`
* **Access:** Protected (`CUSTOMER` only)
* **Key Modules:**
  * Filter tabs: `All`, `Upcoming`, `Active`, `Completed`, `Cancelled`.
  * Booking cards showing booking number, vehicle image, dates, amount paid, and status pill.
  * Action buttons: "View Details", "Cancel Booking" (for pending/confirmed), "Leave Review" (for completed).
* **Related Requirements:** `BOOK-005`, `BOOK-006`, `REV-001`

#### 9. Booking Digital Receipt (`BookingDetailsPage.jsx`)
* **Route:** `/bookings/:id`
* **Layout:** `CustomerLayout`
* **Access:** Protected (Booking Owner, Vendor, Admin)
* **Key Modules:**
  * Printable digital receipt with full transaction breakdown, pickup address, vendor phone, and timeline.
* **Related Requirements:** `BOOK-005`

#### 10. User Profile & Settings (`ProfilePage.jsx`)
* **Route:** `/profile`
* **Layout:** `CustomerLayout`
* **Access:** Protected (`CUSTOMER`, `VENDOR`, `ADMIN`)
* **Key Modules:**
  * Tabbed interface: `Profile Information`, `Role Profile` (Customer DL vs Vendor Business/GST), `Change Password`.
  * Cloudinary avatar file uploader with image preview.
* **Related Requirements:** `USER-001`, `USER-002`, `USER-003`, `USER-004`

---

### 3.2 Vendor Operations Pages

#### 1. Vendor Operations Dashboard (`VendorDashboardPage.jsx`)
* **Route:** `/vendor/dashboard`, `/vendor/bookings`, `/vendor/earnings`, `/vendor/forecast`
* **Layout:** `VendorLayout`
* **Access:** Protected (`VENDOR`, `ADMIN`)
* **Key Modules:**
  * **Fleet Status Cards:** Total Fleet, Available Now, In Maintenance.
  * **Rental Status Cards:** Active Trips, Upcoming Bookings, Total Completed.
  * **Financial KPI Cards:** Gross Revenue, Net Payouts, Pending Settlements.
  * **Unified Bookings Table:** Filterable online and offline bookings ledger with "Handover (Start Trip)" and "Return (Complete Trip)" triggers.
  * **Offline Walk-in Button:** Launches `CreateOfflineBookingModal`.
  * **AI Demand Forecast Widget:** 7-day predictive demand indices and utilization gauge.
* **Related Requirements:** `VEN-001`, `VEN-004`, `VEN-005`, `VEN-006`, `AI-002`

#### 2. Fleet Management (`MyVehiclesPage.jsx`)
* **Route:** `/vendor/vehicles`
* **Layout:** `VendorLayout`
* **Access:** Protected (`VENDOR`, `ADMIN`)
* **Key Modules:**
  * Vehicle fleet inventory table / card view.
  * "Add New Vehicle" action launching `AddVehicleModal`.
  * Quick status dropdown (`AVAILABLE`, `MAINTENANCE`, `INACTIVE`).
  * "Schedule Maintenance" action launching `ScheduleMaintenanceModal`.
  * Edit and Delete actions.
* **Related Requirements:** `VEN-002`, `VEN-003`, `MAIN-001`

---

### 3.3 Admin Governance Pages

#### 1. Master Admin Dashboard (`AdminDashboardPage.jsx`)
* **Route:** `/admin/dashboard`, `/admin/vehicles`, `/admin/users`, `/admin/coupons`, `/admin/revenue`
* **Layout:** `AdminLayout`
* **Access:** Protected (`ADMIN` only)
* **Key Modules:**
  * **Master Financial Summary:** Platform GMV, Commission revenue (12%), total payouts.
  * **Vehicle Moderation Queue:** Pending submissions with "Approve" (sets to `AVAILABLE`) and "Reject" (with modal reason).
  * **User & Vendor Directory:** Searchable table of all registered users with role badges and KYC status.
  * **Global Bookings Audit:** Comprehensive platform-wide bookings ledger.
  * **Coupon Manager (`CouponManager.jsx`):** Coupon creation modal, active toggle, usage counter, and deletion.
* **Related Requirements:** `ADM-001`, `ADM-002`, `ADM-003`, `ADM-004`, `COUP-002`

---

## 4. Reusable Component Catalog

| Component | Path | Purpose |
| :--- | :--- | :--- |
| `CityAutocomplete` | `client/src/components/common/CityAutocomplete.jsx` | Autocomplete dropdown filtering supported hub cities (Indore, Bhopal, Gwalior) and cross-city mode. |
| `SectionHeader` | `client/src/components/common/SectionHeader.jsx` | Standardized section title, subtitle, and badge decorator. |
| `Skeleton` | `client/src/components/common/Skeleton.jsx` | Pulsing placeholder elements for cards, text blocks, and avatars during async loading states. |
| `ProtectedRoute` | `client/src/components/navigation/ProtectedRoute.jsx` | Higher-order wrapper checking Redux authentication state. |
| `RoleRoute` | `client/src/components/navigation/ProtectedRoute.jsx` | Higher-order wrapper verifying user role permissions. |
| `Navbar` | `client/src/components/navigation/Navbar.jsx` | Responsive navigation bar with mobile hamburger menu, city switcher, and notification bell. |
| `NotificationDropdown` | `client/src/features/notifications/NotificationDropdown.jsx` | Dropdown panel displaying unread notification count, alert items, and "Mark All as Read". |
| `AddVehicleModal` | `client/src/features/vendor/AddVehicleModal.jsx` | Multi-step modal form for adding vehicles with Cloudinary image upload. |
| `CreateOfflineBookingModal`| `client/src/features/vendor/CreateOfflineBookingModal.jsx`| Modal capturing walk-in customer details, cash payments, and instant reservation creation. |
| `VehicleHandoverModal` | `client/src/features/vendor/VehicleHandoverModal.jsx` | Modal recording start odometer and vehicle condition notes at trip start. |
| `VehicleReturnModal` | `client/src/features/vendor/VehicleReturnModal.jsx` | Modal recording end odometer, fuel levels, damage notes, and extra km charges. |
| `ScheduleMaintenanceModal`| `client/src/features/maintenance/ScheduleMaintenanceModal.jsx`| Modal scheduling service downtime windows and blocking vehicle slots. |
| `CouponManager` | `client/src/features/admin/CouponManager.jsx` | Administrative table and form for creating and toggling promo coupons. |
| `ReviewModal` | `client/src/features/reviews/ReviewModal.jsx` | Post-trip customer rating modal with interactive star selector. |
| `AiRecommendationsCarousel`| `client/src/features/ai/AiRecommendationsCarousel.jsx`| Horizontal carousel showcasing AI-ranked vehicle recommendations. |
| `DemandForecastWidget` | `client/src/features/ai/DemandForecastWidget.jsx` | Visual chart displaying 7-day predictive demand indices for the operating hub. |

---

## 5. UI State Design Patterns

* **Loading States:** Every data-fetching view displays dedicated skeleton loaders (`Skeleton.jsx`) matching the exact layout of loaded cards or tables, eliminating content shifts.
* **Error States:** Handled via contextual error alert boxes with retry buttons and toast notifications (`react-hot-toast` / toast banners) displaying server-returned error strings.
* **Empty States:** When queries return zero results (e.g. no vehicles found in filter, no bookings in tab), components render an illustrative icon, a descriptive message, and a clear call-to-action button (e.g. "Reset Filters", "Book a Ride").
* **Responsive Breakpoints:** Strictly tested across Mobile (`<640px`), Tablet (`640px–1024px`), and Desktop (`>1024px`). Mobile views feature collapsable drawer navigation and stacked cards.
