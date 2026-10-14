// synopsisContent.js - Complete Academic Content for RentRide Project Synopsis
import { 
  ACADEMIC_CSS, 
  SVG_SYSTEM_ARCHITECTURE, 
  SVG_ER_DIAGRAM, 
  SVG_BOOKING_LIFECYCLE 
} from './docStyles.js';

export function generateSynopsisHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>RentRide - Project Synopsis</title>
  <style>
    ${ACADEMIC_CSS}
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="cover-page">
    <div class="cover-header">
      <div class="cover-univ-title">DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING</div>
      <div class="cover-dept">ACADEMIC SESSION: 2023–2027</div>
      <div style="margin: 15pt auto; width: 60px; height: 2px; background: #0b1e36;"></div>
    </div>

    <div class="cover-middle">
      <div class="cover-doc-type">PROJECT SYNOPSIS</div>
      <div class="cover-title">RENT RIDE — MULTI-VENDOR VEHICLE RENTAL MARKETPLACE</div>
      <div class="cover-subtitle">A Resilient Cloud-Native Platform with Zero-Collision Scheduling, Tiered Pricing, and Machine Learning Telemetry</div>
      
      <p style="text-align: center; margin-top: 20pt; font-size: 11pt;">
        Submitted in partial fulfillment of the requirements for the degree of<br>
        <strong>Bachelor of Technology (B.Tech)</strong><br>
        in<br>
        <strong>Computer Science and Engineering</strong>
      </p>
    </div>

    <div>
      <div class="cover-metadata">
        <div class="cover-meta-col">
          <p><strong>SUBMITTED BY:</strong></p>
          <p>Student Name: __________________________</p>
          <p>Enrollment No: __________________________</p>
          <p>Roll Number: __________________________</p>
          <p>Semester: VIII (Final Year Major Project)</p>
        </div>
        <div class="cover-meta-col" style="text-align: right;">
          <p><strong>UNDER THE SUPERVISION OF:</strong></p>
          <p>Project Guide: __________________________</p>
          <p>Designation: Assistant Professor / Professor</p>
          <p>Department of Computer Science &amp; Engg.</p>
          <p>Institution: __________________________</p>
        </div>
      </div>

      <div class="cover-footer">
        MAY 2026
      </div>
    </div>
  </div>

  <!-- TABLE OF CONTENTS -->
  <div class="page-break">
    <h1>TABLE OF CONTENTS</h1>
    <div style="margin-top: 15pt;">
      <div class="toc-entry h1"><span>1. ABSTRACT</span><span>1</span></div>
      <div class="toc-entry h1"><span>2. INTRODUCTION &amp; MOTIVATION</span><span>2</span></div>
      <div class="toc-entry h1"><span>3. PROBLEM STATEMENT</span><span>3</span></div>
      <div class="toc-entry h1"><span>4. PROPOSED SYSTEM &amp; VALUE PROPOSITION</span><span>4</span></div>
      <div class="toc-entry h1"><span>5. PROJECT OBJECTIVES</span><span>5</span></div>
      <div class="toc-entry h1"><span>6. SCOPE OF THE PROJECT</span><span>6</span></div>
      <div class="toc-entry h2"><span>6.1 User Roles Scope (Customer, Vendor, Admin)</span><span>6</span></div>
      <div class="toc-entry h2"><span>6.2 Technical &amp; System Scope</span><span>7</span></div>
      <div class="toc-entry h1"><span>7. MAJOR FEATURES &amp; IMPLEMENTATION STATUS</span><span>8</span></div>
      <div class="toc-entry h2"><span>7.1 Currently Implemented Modules</span><span>8</span></div>
      <div class="toc-entry h2"><span>7.2 Partially Implemented Modules</span><span>9</span></div>
      <div class="toc-entry h2"><span>7.3 Future / Planned Modules</span><span>9</span></div>
      <div class="toc-entry h1"><span>8. TECHNOLOGY STACK</span><span>10</span></div>
      <div class="toc-entry h1"><span>9. SYSTEM ARCHITECTURE</span><span>11</span></div>
      <div class="toc-entry h1"><span>10. FUNCTIONAL MODULES BREAKDOWN</span><span>12</span></div>
      <div class="toc-entry h1"><span>11. DATABASE DESIGN &amp; ENTITY-RELATIONSHIP MODEL</span><span>14</span></div>
      <div class="toc-entry h1"><span>12. ARTIFICIAL INTELLIGENCE &amp; MACHINE LEARNING SUBSYSTEM</span><span>15</span></div>
      <div class="toc-entry h1"><span>13. SECURITY ARCHITECTURE &amp; COMPLIANCE</span><span>17</span></div>
      <div class="toc-entry h1"><span>14. EXPECTED &amp; DEMONSTRATED PROJECT OUTCOMES</span><span>18</span></div>
      <div class="toc-entry h1"><span>15. ROADMAP &amp; FUTURE ENHANCEMENTS</span><span>19</span></div>
      <div class="toc-entry h1"><span>16. CONCLUSION</span><span>20</span></div>
      <div class="toc-entry h1"><span>17. REFERENCES &amp; TECHNICAL SOURCES</span><span>21</span></div>
    </div>
  </div>

  <!-- SECTION 1: ABSTRACT -->
  <div class="page-break">
    <h1>1. ABSTRACT</h1>
    <p>
      In modern urban and tourist economies, short-term mobility relies heavily on vehicle rentals. However, the conventional vehicle rental industry remains plagued by fragmented vendor management, manual scheduling books, double-booking collisions, non-transparent pricing structures, and an absence of predictive inventory intelligence. <strong>RentRide</strong> is an enterprise-grade, multi-vendor vehicle rental marketplace engineered to unite vehicle customers, independent fleet vendors, and platform administrators within a high-integrity, cloud-native ecosystem.
    </p>
    <p>
      The system features a three-tier decoupled architecture: a modern Single-Page Application (SPA) built with React 18, Vite, Redux Toolkit, and Tailwind CSS; a resilient RESTful application backend developed using Node.js, Express, and Mongoose 8 on MongoDB; and an auxiliary predictive microservice built with Python 3 and FastAPI. Central to RentRide's transactional integrity is a mathematical interval-overlap collision prevention engine that guarantees zero overlapping reservations across digital bookings, walk-in offline rentals, and scheduled maintenance blackouts. The system incorporates a multi-tier duration structure offering Flexi-Hourly (1 to 24 hours), 12-Hour Daytime, and 24-Hour Multi-Day rental plans, complemented by a server-side pricing engine with weekend surge multipliers, platform fees, GST calculations, security deposits, and Razorpay gateway integration.
    </p>
    <p>
      Furthermore, RentRide embeds an operational machine learning microservice providing multi-attribute vehicle recommendations via cosine similarity, a 7-day time series demand forecaster, and an elasticity-bounded dynamic pricing model. This synopsis outlines the theoretical underpinnings, system architecture, database schema, implementation health, and technical outcomes of the RentRide marketplace.
    </p>
  </div>

  <!-- SECTION 2: INTRODUCTION & MOTIVATION -->
  <div>
    <h1>2. INTRODUCTION &amp; MOTIVATION</h1>
    <p>
      Urban mobility in developing nations, particularly across tier-1 and tier-2 Indian smart cities such as Indore, Bhopal, and Gwalior, is undergoing a profound paradigm shift. Increasing vehicle ownership costs, parking congestion, and transient corporate and student populations have triggered surging demand for on-demand personal transportation. Commuters seek two-wheelers (scooters, commuter motorcycles, electric vehicles) for agility, while families and business travelers require four-wheelers (hatchbacks, sedans, SUVs) for regional excursions.
    </p>
    <p>
      Despite high market demand, the supply side remains largely disorganized. Local rental shops operate in silos, managing fleets on physical registers or disconnected spreadsheets. Customers face unpredictable pricing, undocumented vehicle handovers, lack of insurance transparency, and frequent cancellations resulting from overbooking. Conversely, fleet owners suffer from idle inventory during off-peak weekdays and lack digital channels to compete with monolithic corporate rental entities.
    </p>
    <p>
      RentRide was conceptualized to democratize vehicle rentals through an open, multi-vendor marketplace paradigm. By providing localized vendors with digital fleet onboarding, automated availability guarantees, verified customer workflows, and algorithmic demand intelligence, RentRide creates an equitable, transparent, and frictionless platform for modern shared mobility.
    </p>
  </div>

  <!-- SECTION 3: PROBLEM STATEMENT -->
  <div>
    <h1>3. PROBLEM STATEMENT</h1>
    <p>
      Conventional vehicle rental ecosystems exhibit critical operational vulnerabilities that impede scalability, trust, and profitability:
    </p>
    <ul>
      <li><strong>Inventory Fragmentation &amp; Information Asymmetry:</strong> Customers must physically visit or contact multiple fragmented agencies to compare rental rates, vehicle specifications, and availability, resulting in massive search friction.</li>
      <li><strong>Double-Booking &amp; Availability Collisions:</strong> In the absence of atomic reservation systems, vehicles are frequently promised to multiple parties simultaneously—particularly when online requests conflict with walk-in walk-up customers or unrecorded maintenance periods.</li>
      <li><strong>Inflexible Pricing Structures:</strong> Traditional agencies enforce rigid 24-hour day boundaries, forcing customers who only require a 3-hour or 6-hour commute to pay for a full day.</li>
      <li><strong>Operational Handover Ambiguity:</strong> Odometer readings, fuel levels, pre-existing damages, and return delays are rarely audited digitally, leading to disputes over extra kilometer penalties and security deposits.</li>
      <li><strong>Absence of Data-Driven Predictive Pricing:</strong> Local vendors lack analytical capabilities to predict weekend demand spikes or implement competitive discounts during off-peak weekdays, suppressing fleet utilization.</li>
    </ul>
  </div>

  <!-- SECTION 4: PROPOSED SYSTEM & VALUE PROPOSITION -->
  <div class="page-break">
    <h1>4. PROPOSED SYSTEM &amp; VALUE PROPOSITION</h1>
    <p>
      RentRide addresses these industry challenges by deploying an integrated digital platform characterized by strict separation of concerns, transactional safety, and predictive machine learning:
    </p>
    <div class="callout">
      <div class="callout-title">Core Value Proposition</div>
      RentRide guarantees zero-overlap fleet scheduling, transparent server-calculated multi-tier pricing, end-to-end digital trip custody (odometer and OTP handover), and AI-driven demand analytics within a single multi-vendor web marketplace.
    </div>
    <ul>
      <li><strong>Centralized Multi-Vendor Marketplace:</strong> Verified vendors register trade profiles, upload fleet vehicles with real specifications and Cloudinary-hosted photography, and manage bookings through a dedicated vendor portal.</li>
      <li><strong>Interval-Overlap Collision Prevention:</strong> The backend executes deterministic interval mathematics verifying that candidate rental windows do not overlap with active reservations or maintenance intervals:
        <div class="formula">
          Overlap Condition: (Start<sub>req</sub> &lt; End<sub>exist</sub>) &and; (End<sub>req</sub> &gt; Start<sub>exist</sub>)
        </div>
      </li>
      <li><strong>Customizable Rental Plans:</strong> Supports flexible Hourly rentals (1 to 24 customizable hours), 12-Hour Day Passes, and 24-Hour Multi-day packages.</li>
      <li><strong>10-Minute Checkout Inventory Lock:</strong> Eliminates checkout race conditions by holding a temporary lock (<code>lockExpiresAt</code>) on selected vehicles while customers complete payment.</li>
      <li><strong>Integrated Digital Financial Ledger:</strong> Full Razorpay integration with HMAC-SHA256 signature verification, automated 18% GST and 5% platform fee calculations, refundable security deposit tracking, and coupon discounts.</li>
    </ul>
  </div>

  <!-- SECTION 5: PROJECT OBJECTIVES -->
  <div>
    <h1>5. PROJECT OBJECTIVES</h1>
    <p>
      The primary academic and engineering objectives of the RentRide major project include:
    </p>
    <ol>
      <li><strong>Design and Implement a Decoupled Three-Tier Architecture:</strong> Construct a responsive React 18 SPA frontend, an Express/Node.js RESTful API, and an auxiliary Python FastAPI microservice.</li>
      <li><strong>Implement Role-Based Access Control (RBAC):</strong> Architect fine-grained authentication and authorization guards distinguishing Customers, Vendors, and Administrators via JSON Web Tokens (JWT) and Bcrypt password hashing.</li>
      <li><strong>Develop a Guaranteed Collision-Free Scheduling Engine:</strong> Engineer atomic database queries preventing conflicting reservations across online bookings, walk-in offline rentals, and maintenance downtime.</li>
      <li><strong>Construct a Server-Side Dynamic Pricing Calculator:</strong> Formulate transparent fare computations incorporating hourly rates, weekend surge multipliers (1.15x), promotional coupon discounts, platform commission splits, and refundable deposits.</li>
      <li><strong>Embed an Operational AI/ML Microservice:</strong> Build content-based vehicle recommendation scoring (cosine similarity), a 7-day demand forecasting model based on regional seasonality, and a bounded dynamic pricing elasticity engine.</li>
      <li><strong>Deploy Master Vehicle Catalog Architecture:</strong> Standardize 327 verified Indian vehicle specifications with certified ARAI fuel economy, zero-binary MongoDB storage, and 1-click vendor modal auto-fill.</li>
    </ol>
  </div>

  <!-- SECTION 6: SCOPE OF THE PROJECT -->
  <div class="page-break">
    <h1>6. SCOPE OF THE PROJECT</h1>
    <p>
      The project scope is divided across operational user roles and underlying technical subsystems:
    </p>
    
    <h2>6.1 User Roles Scope</h2>
    <table>
      <thead>
        <tr>
          <th>User Role</th>
          <th>Functional Scope &amp; Responsibilities</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Customer</strong></td>
          <td>
            • City-based fleet exploration (Indore, Bhopal, Gwalior) with instant filters (category, price, fuel, transmission, seats).<br>
            • Vehicle details inspection, real-time availability checking, and dynamic fuel cost calculation.<br>
            • Selection of rental plans (Hourly 1–24h, 12h, 24h), coupon redemption, and Razorpay checkout.<br>
            • Digital booking history review, cancellation management, and verified post-trip rating submission.
          </td>
        </tr>
        <tr>
          <td><strong>Vendor</strong></td>
          <td>
            • Business profile onboarding with GST registration and verification tracking.<br>
            • Fleet management: 1-click listing from Master Catalog or manual vehicle creation with Cloudinary image upload.<br>
            • Walk-in offline customer logging to eliminate offline fleet double-booking.<br>
            • Digital handover execution (Start Trip with starting odometer) and return reconciliation (Complete Trip with extra km fee).<br>
            • Maintenance scheduling with automated marketplace blackout and earnings KPI monitoring.
          </td>
        </tr>
        <tr>
          <td><strong>Admin</strong></td>
          <td>
            • Platform governance: listing moderation (approval/rejection), customer KYC status review.<br>
            • Promotional coupon creation, usage limits, and expiration controls.<br>
            • Global booking audit ledger monitoring financial distributions, deposits, and platform commissions.
          </td>
        </tr>
      </tbody>
    </table>

    <h2>6.2 Technical &amp; System Scope</h2>
    <ul>
      <li><strong>Backend Scope:</strong> RESTful API exposing 14 controller domains, Zod schema validation middleware, rate limiting (100 req/15min), Helmet security headers, CORS origin restrictions, and MongoDB aggregation pipelines.</li>
      <li><strong>Database Scope:</strong> 10 relational Mongoose schemas (<code>User</code>, <code>Vehicle</code>, <code>Category</code>, <code>Booking</code>, <code>Payment</code>, <code>Coupon</code>, <code>Review</code>, <code>Maintenance</code>, <code>Notification</code>, <code>VehicleCatalog</code>) with compound indexing for atomic collision resolution.</li>
      <li><strong>AI Microservice Scope:</strong> Python/FastAPI service communicating over authenticated internal HTTP, delivering real-time vehicle recommendation matrices, 7-day city demand indexes, and dynamic pricing elasticity.</li>
    </ul>
  </div>

  <!-- SECTION 7: MAJOR FEATURES & IMPLEMENTATION STATUS -->
  <div class="page-break">
    <h1>7. MAJOR FEATURES &amp; IMPLEMENTATION STATUS</h1>
    <p>
      To adhere strictly to academic integrity standards, all platform features are classified according to their actual verification state in the RentRide codebase:
    </p>

    <h2>7.1 Currently Implemented Modules (100% Operational)</h2>
    <table>
      <thead>
        <tr>
          <th>Module Name</th>
          <th>Implementation Details in Active Codebase</th>
          <th>Verification</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Authentication &amp; RBAC</strong></td>
          <td>JWT access tokens, bcryptjs (10 rounds), role guards (<code>CUSTOMER</code>, <code>VENDOR</code>, <code>ADMIN</code>), secure HttpOnly cookies, profile update, and password change endpoints.</td>
          <td>Operational 🟢</td>
        </tr>
        <tr>
          <td><strong>Fleet Discovery &amp; Search</strong></td>
          <td>City dropdown (Indore, Bhopal, Gwalior), multi-tier categories (Two/Four-Wheelers), search filter panel by price, fuel type, transmission, and seat count.</td>
          <td>Operational 🟢</td>
        </tr>
        <tr>
          <td><strong>Collision Engine</strong></td>
          <td>Mathematical interval overlap conflict check across online bookings, walk-in offline rentals, and maintenance blackouts.</td>
          <td>Operational 🟢</td>
        </tr>
        <tr>
          <td><strong>Multi-Tier Duration</strong></td>
          <td>Hourly plan (1 to 24 customizable hours), 12-Hour Day Pass, and 24-Hour Multi-day packages with automatic fare calculation.</td>
          <td>Operational 🟢</td>
        </tr>
        <tr>
          <td><strong>Dynamic Fuel Cost</strong></td>
          <td>User-entered trip distance input with real-time recalculation: (Distance &divide; Mileage) &times; Fuel Price (Petrol, Diesel, CNG, EV).</td>
          <td>Operational 🟢</td>
        </tr>
        <tr>
          <td><strong>Server Pricing Engine</strong></td>
          <td>Calculates base price, weekend surge (1.15x), coupon discounts, 5% platform fee, 18% GST, security deposit, and vendor payout split.</td>
          <td>Operational 🟢</td>
        </tr>
        <tr>
          <td><strong>Checkout &amp; Lock</strong></td>
          <td>10-minute temporary inventory reservation lock (<code>lockExpiresAt</code>) preventing concurrent checkout races before payment capture.</td>
          <td>Operational 🟢</td>
        </tr>
        <tr>
          <td><strong>Razorpay Payments</strong></td>
          <td>Server-side order generation, client SDK modal invocation, and HMAC-SHA256 payment signature verification.</td>
          <td>Operational 🟢</td>
        </tr>
        <tr>
          <td><strong>Vendor Fleet Portal</strong></td>
          <td>Vehicle listing creation, Cloudinary photo uploads, walk-in offline customer booking creation, and maintenance scheduling.</td>
          <td>Operational 🟢</td>
        </tr>
        <tr>
          <td><strong>Trip Custody Workflow</strong></td>
          <td>Vehicle Handover (<code>Start Trip</code> with initial odometer reading) and Vehicle Return (<code>Complete Trip</code> with extra km penalty calculation).</td>
          <td>Operational 🟢</td>
        </tr>
        <tr>
          <td><strong>Admin Governance</strong></td>
          <td>Vehicle moderation approval/rejection, user management, global booking audit ledger, and platform revenue metrics.</td>
          <td>Operational 🟢</td>
        </tr>
        <tr>
          <td><strong>Master Catalog</strong></td>
          <td>327 verified Indian vehicle models with certified ARAI fuel economy, specifications, and 1-click modal auto-fill.</td>
          <td>Operational 🟢</td>
        </tr>
        <tr>
          <td><strong>AI Microservice</strong></td>
          <td>FastAPI microservice executing multi-attribute recommendation scoring, 7-day demand forecasting, and dynamic pricing (0.90x–1.35x).</td>
          <td>Operational 🟢</td>
        </tr>
      </tbody>
    </table>

    <h2>7.2 Partially Implemented Modules</h2>
    <table>
      <thead>
        <tr>
          <th>Module</th>
          <th>Current Implemented State</th>
          <th>Remaining Limitation</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Gateway Refund Dispatch</strong></td>
          <td>Refund amounts, cancellation policies, and audit records are computed and saved in <code>cancellationDetails</code>.</td>
          <td>Live API dispatch to <code>razorpay.payments.refund()</code> is pending automated triggering.</td>
        </tr>
        <tr>
          <td><strong>Customer KYC Verification</strong></td>
          <td>Schema supports <code>drivingLicenseNumber</code>, <code>drivingLicenseUrl</code>, and status (<code>PENDING</code>, <code>VERIFIED</code>, <code>REJECTED</code>).</td>
          <td>Admin verification UI currently operates as a status viewer; action buttons pending.</td>
        </tr>
      </tbody>
    </table>

    <h2>7.3 Future / Planned Modules (Roadmap Scope)</h2>
    <ul>
      <li><strong>Automated Lock Expiry Background Sweeper:</strong> Expired locks are filtered in queries; recurring cron worker to transition status from <code>PENDING_PAYMENT</code> to <code>EXPIRED</code> is planned for Phase 1.</li>
      <li><strong>Email &amp; SMS Dispatch:</strong> Integration with Nodemailer/SendGrid and Twilio for booking vouchers and OTPs (Phase 2).</li>
      <li><strong>Interactive Map UI:</strong> Coordinates stored in DB; mounting interactive Leaflet/Google Maps on Explore page (Phase 2).</li>
      <li><strong>Vendor Automated Payout Settlements:</strong> Direct banking payout disbursement pipeline (Phase 2).</li>
      <li><strong>Live GPS Telematics:</strong> OBD/GPS hardware data ingestion for vehicle speed and EV battery telemetry (Phase 3).</li>
      <li><strong>Redis Caching &amp; Docker Orchestration:</strong> Redis caching for public catalog and multi-container Docker compose (Phase 4–5).</li>
    </ul>
  </div>

  <!-- SECTION 8: TECHNOLOGY STACK -->
  <div class="page-break">
    <h1>8. TECHNOLOGY STACK</h1>
    <p>
      The technology stack utilizes current, industry-standard frameworks verified directly from package descriptors:
    </p>
    <table>
      <thead>
        <tr>
          <th>Tier / Domain</th>
          <th>Technology &amp; Exact Version</th>
          <th>Architectural Purpose &amp; Role</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td rowspan="6"><strong>Frontend Tier</strong><br>(React SPA)</td>
          <td>React 18.3.1</td>
          <td>Component-based presentation layer and UI virtual DOM rendering.</td>
        </tr>
        <tr>
          <td>Vite 6.1.0</td>
          <td>High-speed build tool and Hot Module Replacement (HMR) development server.</td>
        </tr>
        <tr>
          <td>React Router DOM 7.1.5</td>
          <td>Declarative client-side routing with role-based route guard wrappers.</td>
        </tr>
        <tr>
          <td>Redux Toolkit 2.5.1</td>
          <td>Predictable global state management for auth session and profile state.</td>
        </tr>
        <tr>
          <td>Tailwind CSS 3.4.17</td>
          <td>Utility-first responsive design system with dark mode and custom tokens.</td>
        </tr>
        <tr>
          <td>Axios 1.7.9, Lucide React, Recharts</td>
          <td>HTTP client with interceptors, icon library, and administrative chart widgets.</td>
        </tr>
        <tr>
          <td rowspan="5"><strong>Backend Tier</strong><br>(Node.js REST API)</td>
          <td>Node.js (ES Modules)</td>
          <td>Asynchronous non-blocking JavaScript server runtime environment.</td>
        </tr>
        <tr>
          <td>Express 4.21.2</td>
          <td>RESTful HTTP web application framework and routing pipeline.</td>
        </tr>
        <tr>
          <td>Mongoose 8.10.1</td>
          <td>Object Data Modeling (ODM) library for MongoDB with schema validation.</td>
        </tr>
        <tr>
          <td>jsonwebtoken 9.0.2 &amp; bcryptjs 3.0.3</td>
          <td>Stateless JWT token issuance and one-way password hashing (10 rounds).</td>
        </tr>
        <tr>
          <td>Helmet 8.0.0, Zod 3.24.2, Rate-Limit</td>
          <td>HTTP security headers, strict runtime request schema validation, and rate protection.</td>
        </tr>
        <tr>
          <td rowspan="3"><strong>AI Microservice</strong><br>(Python FastAPI)</td>
          <td>Python 3.11+, FastAPI 0.115.8</td>
          <td>High-performance asynchronous API framework for ML model inference.</td>
        </tr>
        <tr>
          <td>Uvicorn 0.34.0</td>
          <td>Lightning-fast ASGI web server implementation.</td>
        </tr>
        <tr>
          <td>Scikit-learn 1.6.1, Pandas, NumPy</td>
          <td>Mathematical vector operations, cosine similarity scoring, and time series modeling.</td>
        </tr>
        <tr>
          <td rowspan="3"><strong>Cloud &amp; Infrastructure</strong></td>
          <td>MongoDB Atlas</td>
          <td>Cloud NoSQL document database with automated replica sets and indexing.</td>
        </tr>
        <tr>
          <td>Cloudinary SDK 2.5.1</td>
          <td>Cloud storage for fleet images with automated transformations and CDN delivery.</td>
        </tr>
        <tr>
          <td>Razorpay SDK 2.9.5</td>
          <td>Payment gateway supporting UPI, Net Banking, Credit/Debit Cards, and Wallets.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- SECTION 9: SYSTEM ARCHITECTURE -->
  <div class="page-break">
    <h1>9. SYSTEM ARCHITECTURE</h1>
    <p>
      RentRide adopts a decoupled, multi-tier architectural pattern. The React SPA communicates with the Express backend via RESTful JSON over HTTPS. The Express core manages transactional domain logic, data persistence via Mongoose 8 on MongoDB, and interacts with external infrastructure (Razorpay, Cloudinary) and an auxiliary Python FastAPI AI microservice over internal HTTP with API key authentication.
    </p>
    
    <div class="diagram-container">
      ${SVG_SYSTEM_ARCHITECTURE}
      <div class="figure-caption">Figure 9.1: RentRide Decoupled Multi-Tier System Architecture</div>
    </div>

    <p>
      The architecture guarantees that business logic resides strictly within domain services (<code>BookingService</code>, <code>PricingService</code>, <code>PaymentService</code>, <code>FuelCostService</code>), ensuring high modularity, testability, and adherence to Single Responsibility principles.
    </p>
  </div>

  <!-- SECTION 10: FUNCTIONAL MODULES BREAKDOWN -->
  <div class="page-break">
    <h1>10. FUNCTIONAL MODULES BREAKDOWN</h1>
    <p>
      The RentRide platform is partitioned into 13 cohesive functional modules:
    </p>
    <ol>
      <li><strong>Authentication &amp; User Profile Module:</strong> Manages registration for Customers and Vendors, password hashing via bcrypt, JWT issuance, profile updates, and role-based route access controls (<code>CUSTOMER</code>, <code>VENDOR</code>, <code>ADMIN</code>).</li>
      <li><strong>Vehicle Categorization Module:</strong> Structures vehicles into parent types (<code>two_wheeler</code>, <code>four_wheeler</code>) and slugs (<code>electric-scooters</code>, <code>scooters</code>, <code>bikes</code>, <code>hatchbacks</code>, <code>sedans</code>, <code>suvs</code>) with active status filtering.</li>
      <li><strong>Fleet Discovery &amp; Search Engine:</strong> Provides autocomplete city hub filtering (Indore, Bhopal, Gwalior) combined with multi-parameter criteria (category, price range, transmission, fuel type, seating capacity).</li>
      <li><strong>Availability &amp; Collision Engine:</strong> Evaluates candidate booking intervals against active bookings and maintenance intervals using atomic compound indexes, preventing double-booking.</li>
      <li><strong>Multi-Plan Duration &amp; Booking Module:</strong> Supports Hourly plans (customizable 1–24 hours), 12-Hour Day Passes, and 24-Hour Multi-day rentals with temporary 10-minute checkout inventory locks (<code>lockExpiresAt</code>).</li>
      <li><strong>Dynamic Fuel Cost Estimator:</strong> Allows customers to enter trip distance (km) on the vehicle details page and computes instantaneous fuel consumption and cost based on certified vehicle mileage and city fuel rates.</li>
      <li><strong>Server-Side Pricing Engine:</strong> Authoritative fare calculation factoring base duration rates, weekend demand multipliers (1.15x), coupon discounts, platform service fees (5%), GST (18%), and refundable security deposits.</li>
      <li><strong>Coupon &amp; Discount Engine:</strong> Admin-configured percentage and fixed discount codes with user redemption counters, minimum booking thresholds, and validity windows.</li>
      <li><strong>Payment Processing Module:</strong> Generates Razorpay orders, handles checkout client integration, verifies HMAC-SHA256 signatures, and transitions booking status to <code>CONFIRMED</code>.</li>
      <li><strong>Vendor Operations &amp; Walk-in Module:</strong> Provides vendors with listing management, Cloudinary photo uploads, walk-in offline booking creation, and real-time earnings analytics.</li>
      <li><strong>Trip Custody (Handover &amp; Return) Module:</strong> Executes digital handover (<code>Start Trip</code> with initial odometer reading) and vehicle return (<code>Complete Trip</code> calculating extra km penalties and deposit release).</li>
      <li><strong>Maintenance Scheduling Module:</strong> Allows vendors to record service downtime (<code>routine</code>, <code>repair</code>, <code>inspection</code>), automatically blocking vehicle availability on the marketplace.</li>
      <li><strong>Admin Governance &amp; Moderation Module:</strong> Platform-wide controls for approving/rejecting vendor vehicle listings, managing user accounts, auditing global booking ledgers, and monitoring revenue.</li>
    </ol>
  </div>

  <!-- SECTION 11: DATABASE DESIGN & ENTITY-RELATIONSHIP MODEL -->
  <div class="page-break">
    <h1>11. DATABASE DESIGN &amp; ENTITY-RELATIONSHIP MODEL</h1>
    <p>
      RentRide implements 10 relational Mongoose document models hosted on MongoDB Atlas. Compound indexes are deployed to ensure high-speed collision lookups and financial integrity.
    </p>

    <div class="diagram-container">
      ${SVG_ER_DIAGRAM}
      <div class="figure-caption">Figure 11.1: RentRide Entity-Relationship Diagram (ERD)</div>
    </div>

    <p>
      Key entity relationships include:
    </p>
    <ul>
      <li><strong>User &rarr; Vehicle (1 : N):</strong> A Vendor user owns multiple listed fleet vehicles.</li>
      <li><strong>Category &rarr; Vehicle (1 : N):</strong> A category classifies multiple vehicles.</li>
      <li><strong>Vehicle &rarr; Booking (1 : N):</strong> A vehicle is rented across multiple time intervals.</li>
      <li><strong>Booking &rarr; Payment (1 : 1):</strong> Every online booking maps to an audited payment record.</li>
      <li><strong>Booking &rarr; Review (1 : 1):</strong> A completed booking produces at most one verified review.</li>
      <li><strong>Vehicle &rarr; Maintenance (1 : N):</strong> Maintenance windows block vehicle availability intervals.</li>
    </ul>
  </div>

  <!-- SECTION 12: ARTIFICIAL INTELLIGENCE & MACHINE LEARNING SUBSYSTEM -->
  <div class="page-break">
    <h1>12. ARTIFICIAL INTELLIGENCE &amp; MACHINE LEARNING SUBSYSTEM</h1>
    <p>
      The platform incorporates a dedicated Python/FastAPI microservice running on port 8000. All ML algorithms utilize verified mathematical and statistical formulations rather than opaque deep-learning models:
    </p>

    <h2>12.1 Content-Based Vehicle Recommendation Engine</h2>
    <p>
      Evaluates candidate vehicles against user preferences using multi-attribute feature scoring and collaborative criteria. Normalized match scores range between 60% and 99%:
    </p>
    <table>
      <thead>
        <tr>
          <th>Attribute Feature</th>
          <th>Weight</th>
          <th>Scoring Criteria</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Category Match</td>
          <td>25 points</td>
          <td>Exact match between user preference and vehicle category slug.</td>
        </tr>
        <tr>
          <td>Budget Compatibility</td>
          <td>20 points</td>
          <td>Hourly rate within user's declared maximum budget threshold.</td>
        </tr>
        <tr>
          <td>Seating Capacity</td>
          <td>15 points</td>
          <td>Vehicle seats &ge; preferred passenger count (+15 pts; penalty if less).</td>
        </tr>
        <tr>
          <td>Fuel &amp; Transmission</td>
          <td>15 points</td>
          <td>Match on engine type (EV, Petrol, Diesel) and transmission (Manual, Auto).</td>
        </tr>
        <tr>
          <td>Rating &amp; Popularity</td>
          <td>15 points</td>
          <td>Scaled boost based on verified customer rating: (ratingAverage &minus; 3.0) &times; 6.0.</td>
        </tr>
      </tbody>
    </table>

    <h2>12.2 7-Day Demand Forecasting Engine</h2>
    <p>
      Computes daily demand indexes for city operating hubs (Indore: 1.20, Bhopal: 1.15, Gwalior: 1.10) using day-of-week seasonality (Saturday: 1.60, Friday: 1.45, Tuesday: 0.80) and active fleet utilization pressure:
    </p>
    <div class="formula">
      Demand Index = round( [ BaseDay &times; (0.6 + 0.4 &times; CityFactor) &times; (0.7 + 0.3 &times; CatFactor) ] &times; (0.8 + 0.4 &times; FleetUtilization), 2 )
    </div>

    <h2>12.3 Elasticity-Bounded Dynamic Pricing Engine</h2>
    <p>
      Dynamically adjusts base rental rates to optimize vendor yield while maintaining consumer price fairness. The multiplier is deterministically bounded between <strong>0.90x (Value Saver)</strong> and <strong>1.35x (Peak Surge)</strong> based on day of week, fleet scarcity (&ge;80% utilization &rarr; +15%), and city multipliers.
    </p>
  </div>

  <!-- SECTION 13: SECURITY ARCHITECTURE -->
  <div class="page-break">
    <h1>13. SECURITY ARCHITECTURE &amp; COMPLIANCE</h1>
    <p>
      RentRide enforces enterprise-grade security protocols across all architectural tiers:
    </p>
    <ul>
      <li><strong>Stateless JWT Authentication:</strong> Employs signed JSON Web Tokens containing user ID and role payloads, with automatic rejection of expired or tampered signatures.</li>
      <li><strong>Bcrypt Password Hashing:</strong> Passwords undergo one-way cryptographic salting and hashing with 10 rounds before persistence; password fields are omitted by default (<code>select: false</code>).</li>
      <li><strong>Role-Based Route Guards:</strong> Middleware functions (<code>protect</code>, <code>authorize('VENDOR', 'ADMIN')</code>) enforce strict principle-of-least-privilege access control on protected routes.</li>
      <li><strong>Zod Runtime Schema Validation:</strong> All incoming request bodies, query parameters, and URL params are validated against strict Zod schemas, stripping unexpected fields and rejecting malformed inputs.</li>
      <li><strong>Defense-in-Depth Middleware:</strong> Helmet security headers prevent cross-site scripting (XSS) and clickjacking; express-rate-limit caps client traffic to 100 requests per 15-minute window; CORS restricts origins to verified frontend hosts.</li>
      <li><strong>Payment HMAC-SHA256 Verification:</strong> Razorpay payments are verified server-side by computing <code>crypto.createHmac('sha256')</code> across order and payment identifiers before booking status confirmation.</li>
    </ul>
  </div>

  <!-- SECTION 14: EXPECTED & ACTUAL OUTCOMES -->
  <div>
    <h1>14. EXPECTED &amp; DEMONSTRATED PROJECT OUTCOMES</h1>
    <p>
      The completed implementation of RentRide demonstrates concrete technical outcomes:
    </p>
    <table>
      <thead>
        <tr>
          <th>Target Capability</th>
          <th>Conventional Systems</th>
          <th>Demonstrated RentRide Outcome</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Booking Collisions</td>
          <td>Frequent double-booking</td>
          <td><strong>0% Collisions:</strong> Mathematical interval overlap prevention.</td>
        </tr>
        <tr>
          <td>Rental Flexibility</td>
          <td>Rigid 24-hour day boundaries</td>
          <td><strong>Customizable Hourly:</strong> 1–24h flexible, 12h, and 24h plans.</td>
        </tr>
        <tr>
          <td>Checkout Safety</td>
          <td>Race conditions during payment</td>
          <td><strong>10-Min Reservation Lock:</strong> Temporary inventory hold.</td>
        </tr>
        <tr>
          <td>Fleet Administration</td>
          <td>Paper logs and spreadsheets</td>
          <td><strong>Unified Vendor Portal:</strong> Digital handovers and walk-ins.</td>
        </tr>
        <tr>
          <td>Fuel Transparency</td>
          <td>Opaque estimates</td>
          <td><strong>Dynamic Calculator:</strong> Real-time distance fuel/energy calculation.</td>
        </tr>
        <tr>
          <td>Demand Intelligence</td>
          <td>Static pricing</td>
          <td><strong>ML Forecasting &amp; Dynamic Rates:</strong> 0.90x to 1.35x optimization.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- SECTION 15: ROADMAP & FUTURE ENHANCEMENTS -->
  <div class="page-break">
    <h1>15. ROADMAP &amp; FUTURE ENHANCEMENTS</h1>
    <p>
      RentRide's development roadmap outlines scheduled engineering phases for production expansion:
    </p>
    <ul>
      <li><strong>Phase 1 — Operational Hardening:</strong> Automated gateway refund dispatch via <code>razorpay.payments.refund()</code>, background cron worker for expired checkout lock status transitions, and admin KYC approval actions.</li>
      <li><strong>Phase 2 — Communication &amp; Mapping:</strong> Email &amp; SMS digital booking voucher dispatch with QR codes via Nodemailer/SendGrid and Twilio; interactive Leaflet/Google Maps integration on the Explore page; vendor payout settlement ledger.</li>
      <li><strong>Phase 3 — Telematics &amp; AI Expansion:</strong> Ingestion of live OBD-II and GPS telematics for speed and EV battery tracking; automated weekly re-training pipeline for demand forecasting models.</li>
      <li><strong>Phase 4 — Enterprise Performance &amp; Caching:</strong> Redis caching layer for high-frequency catalog queries; comprehensive Vitest and Playwright CI/CD test automation.</li>
      <li><strong>Phase 5 — Cloud Containerization &amp; CDN:</strong> Multi-stage Docker containerization with <code>docker-compose.yml</code> and Cloudflare edge CDN deployment.</li>
    </ul>
  </div>

  <!-- SECTION 16: CONCLUSION -->
  <div>
    <h1>16. CONCLUSION</h1>
    <p>
      The <strong>RentRide</strong> project successfully demonstrates the design, engineering, and deployment of a resilient, full-stack multi-vendor vehicle rental marketplace. By combining a modern React SPA, an Express REST backend, a MongoDB document store, and a Python FastAPI machine learning microservice, RentRide resolves critical industry pain points surrounding double-booking collisions, rigid duration tiers, and lack of fleet intelligence.
    </p>
    <p>
      The system's modular architecture, strict mathematical overlap validation, verified 327-vehicle master catalog, dynamic fuel cost calculator, and algorithmic dynamic pricing establish RentRide as an enterprise-grade academic major project. The platform provides a viable, production-ready foundation for scalable urban shared mobility.
    </p>
  </div>

  <!-- SECTION 17: REFERENCES -->
  <div class="page-break">
    <h1>17. REFERENCES &amp; TECHNICAL SOURCES</h1>
    <ol>
      <li><strong>React Documentation:</strong> Meta Open Source. (2024). <em>React 18 &amp; Virtual DOM Reconciliation</em>. https://react.dev</li>
      <li><strong>Node.js Documentation:</strong> OpenJS Foundation. (2024). <em>Node.js Asynchronous Runtime &amp; Event Loop</em>. https://nodejs.org</li>
      <li><strong>Express.js Guide:</strong> StrongLoop / OpenJS Foundation. (2024). <em>Express 4.x REST Routing &amp; Middleware</em>. https://expressjs.com</li>
      <li><strong>Mongoose Documentation:</strong> Automattic. (2025). <em>Mongoose 8 Object Data Modeling for MongoDB</em>. https://mongoosejs.com</li>
      <li><strong>MongoDB Atlas Architecture:</strong> MongoDB Inc. (2025). <em>High-Availability Document Databases &amp; Compound Indexing</em>. https://www.mongodb.com</li>
      <li><strong>FastAPI Framework:</strong> Tiangolo, S. (2024). <em>FastAPI: High-Performance Python Microservices</em>. https://fastapi.tiangolo.com</li>
      <li><strong>Scikit-Learn Documentation:</strong> Pedregosa et al. (2024). <em>Machine Learning in Python: Feature Vector Metrics &amp; Cosine Similarity</em>. https://scikit-learn.org</li>
      <li><strong>Razorpay Developers:</strong> Razorpay Software Pvt. Ltd. (2025). <em>Orders API, Checkout SDK &amp; Webhook HMAC-SHA256 Verification</em>. https://razorpay.com/docs</li>
      <li><strong>Cloudinary API Guide:</strong> Cloudinary Ltd. (2025). <em>Media Asset Ingestion &amp; Dynamic CDN Transformations</em>. https://cloudinary.com/documentation</li>
      <li><strong>Zod Documentation:</strong> Colinhacks. (2024). <em>TypeScript-First Schema Declaration with Static Type Inference</em>. https://zod.dev</li>
    </ol>
  </div>

</body>
</html>
`;
}
