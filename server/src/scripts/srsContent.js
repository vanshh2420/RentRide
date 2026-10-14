// srsContent.js - Complete Academic Content for Software Requirements Specification (SRS)
import { 
  ACADEMIC_CSS, 
  SVG_SYSTEM_ARCHITECTURE, 
  SVG_ER_DIAGRAM, 
  SVG_BOOKING_LIFECYCLE, 
  SVG_USE_CASE_DIAGRAM, 
  SVG_DFD_LEVEL1 
} from './docStyles.js';

export function generateSrsHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>RentRide - Software Requirements Specification (SRS)</title>
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
      <div class="cover-doc-type">SOFTWARE REQUIREMENTS SPECIFICATION (SRS)</div>
      <div class="cover-title">RENTRIDE — MULTI-VENDOR VEHICLE RENTAL MARKETPLACE</div>
      <div class="cover-subtitle">Standard IEEE-Inspired Academic Software Requirements Specification for Major Project Submission</div>
      
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
    <div style="margin-top: 10pt;">
      <div class="toc-entry h1"><span>1. INTRODUCTION</span><span>1</span></div>
      <div class="toc-entry h2"><span>1.1 Purpose</span><span>1</span></div>
      <div class="toc-entry h2"><span>1.2 Scope of the System</span><span>1</span></div>
      <div class="toc-entry h2"><span>1.3 Intended Audience &amp; Reading Suggestions</span><span>2</span></div>
      <div class="toc-entry h2"><span>1.4 Product Overview</span><span>2</span></div>
      <div class="toc-entry h2"><span>1.5 Definitions, Acronyms and Abbreviations</span><span>3</span></div>
      <div class="toc-entry h2"><span>1.6 References</span><span>3</span></div>
      <div class="toc-entry h1"><span>2. OVERALL DESCRIPTION</span><span>4</span></div>
      <div class="toc-entry h2"><span>2.1 Product Perspective</span><span>4</span></div>
      <div class="toc-entry h2"><span>2.2 Product Functions Summary</span><span>4</span></div>
      <div class="toc-entry h2"><span>2.3 User Classes and Characteristics</span><span>5</span></div>
      <div class="toc-entry h2"><span>2.4 Operating Environment</span><span>6</span></div>
      <div class="toc-entry h2"><span>2.5 Design and Implementation Constraints</span><span>6</span></div>
      <div class="toc-entry h2"><span>2.6 Assumptions and Dependencies</span><span>7</span></div>
      <div class="toc-entry h1"><span>3. SYSTEM FEATURES / FUNCTIONAL REQUIREMENTS</span><span>8</span></div>
      <div class="toc-entry h2"><span>3.1 Module A: Authentication &amp; Authorization (FR-AUTH)</span><span>8</span></div>
      <div class="toc-entry h2"><span>3.2 Module B: Customer Profile &amp; KYC (FR-CUST)</span><span>9</span></div>
      <div class="toc-entry h2"><span>3.3 Module C: Vendor Onboarding &amp; Fleets (FR-VEND)</span><span>10</span></div>
      <div class="toc-entry h2"><span>3.4 Module D: Vehicle Management (FR-VEH)</span><span>11</span></div>
      <div class="toc-entry h2"><span>3.5 Module E: Vehicle Categories (FR-CAT)</span><span>12</span></div>
      <div class="toc-entry h2"><span>3.6 Module F: City Search &amp; Filter Engine (FR-SRCH)</span><span>13</span></div>
      <div class="toc-entry h2"><span>3.7 Module G: Collision &amp; Availability Engine (FR-AVAL)</span><span>14</span></div>
      <div class="toc-entry h2"><span>3.8 Module H: Rental Plans (Hourly, 12h, 24h) (FR-PLAN)</span><span>15</span></div>
      <div class="toc-entry h2"><span>3.9 Module I: Booking Lifecycle &amp; Locks (FR-BOOK)</span><span>16</span></div>
      <div class="toc-entry h2"><span>3.10 Module J: Server Pricing Engine (FR-PRIC)</span><span>17</span></div>
      <div class="toc-entry h2"><span>3.11 Module K: Coupons &amp; Promotions (FR-COUP)</span><span>18</span></div>
      <div class="toc-entry h2"><span>3.12 Module L: Payment Processing via Razorpay (FR-PAY)</span><span>19</span></div>
      <div class="toc-entry h2"><span>3.13 Module M: Walk-In Offline Bookings (FR-WKIN)</span><span>20</span></div>
      <div class="toc-entry h2"><span>3.14 Module N: Vehicle Handover &amp; Return (FR-TRIP)</span><span>21</span></div>
      <div class="toc-entry h2"><span>3.15 Module O: Maintenance Management (FR-MAINT)</span><span>22</span></div>
      <div class="toc-entry h2"><span>3.16 Module P: Admin Governance &amp; Moderation (FR-ADM)</span><span>23</span></div>
      <div class="toc-entry h2"><span>3.17 Module Q: Customer Reviews &amp; Ratings (FR-REV)</span><span>24</span></div>
      <div class="toc-entry h2"><span>3.18 Module R: In-App Notifications (FR-NOTIF)</span><span>25</span></div>
      <div class="toc-entry h2"><span>3.19 Module S: AI Recommendations Engine (FR-AI-REC)</span><span>26</span></div>
      <div class="toc-entry h2"><span>3.20 Module T: AI 7-Day Demand Forecasting (FR-AI-FCST)</span><span>27</span></div>
      <div class="toc-entry h2"><span>3.21 Module U: AI Dynamic Pricing Engine (FR-AI-PRIC)</span><span>28</span></div>
      <div class="toc-entry h2"><span>3.22 Module V: Master Vehicle Catalog (FR-CATL)</span><span>29</span></div>
      <div class="toc-entry h1"><span>4. NON-FUNCTIONAL REQUIREMENTS (NFR)</span><span>30</span></div>
      <div class="toc-entry h1"><span>5. SYSTEM ARCHITECTURE &amp; DATA FLOW DIAGRAMS</span><span>33</span></div>
      <div class="toc-entry h1"><span>6. USE CASE MODEL &amp; SPECIFICATIONS (UC-01 to UC-17)</span><span>35</span></div>
      <div class="toc-entry h1"><span>7. DATA REQUIREMENTS &amp; ENTITY-RELATIONSHIP MODEL</span><span>40</span></div>
      <div class="toc-entry h1"><span>8. DATA DICTIONARY</span><span>42</span></div>
      <div class="toc-entry h1"><span>9. REST API SPECIFICATIONS</span><span>45</span></div>
      <div class="toc-entry h1"><span>10. SECURITY REQUIREMENTS &amp; IMPLEMENTATION</span><span>48</span></div>
      <div class="toc-entry h1"><span>11. BOOKING &amp; BUSINESS LOGIC SPECIFICATION</span><span>50</span></div>
      <div class="toc-entry h1"><span>12. AI / ML MICROSERVICE DETAILED SPECIFICATION</span><span>52</span></div>
      <div class="toc-entry h1"><span>13. USER INTERFACE SPECIFICATIONS</span><span>54</span></div>
      <div class="toc-entry h1"><span>14. ERROR HANDLING &amp; EXCEPTION MATRIX</span><span>55</span></div>
      <div class="toc-entry h1"><span>15. TESTING REQUIREMENTS &amp; VERIFICATION SUITE</span><span>56</span></div>
      <div class="toc-entry h1"><span>16. DEPLOYMENT &amp; INFRASTRUCTURE</span><span>58</span></div>
      <div class="toc-entry h1"><span>17. SYSTEM LIMITATIONS &amp; KNOWN CONSTRAINTS</span><span>59</span></div>
      <div class="toc-entry h1"><span>18. DEVELOPMENT ROADMAP &amp; FUTURE SCOPE</span><span>60</span></div>
      <div class="toc-entry h1"><span>19. CONCLUSION &amp; SIGNOFF</span><span>61</span></div>
    </div>
  </div>

  <!-- SECTION 1: INTRODUCTION -->
  <div class="page-break">
    <h1>1. INTRODUCTION</h1>

    <h2>1.1 Purpose</h2>
    <p>
      This Software Requirements Specification (SRS) document details the complete functional and non-functional requirements for the <strong>RentRide Multi-Vendor Vehicle Rental Marketplace</strong>. It establishes a formal, verifiable contract between system stakeholders—including software engineers, platform architects, academic project evaluators, and prospective marketplace operators. The document specifies system behavior, constraints, algorithmic logic, interface designs, and operational data flows.
    </p>

    <h2>1.2 Scope of the System</h2>
    <p>
      RentRide is an enterprise-ready, cloud-native web platform that coordinates short-term vehicle rentals across two-wheelers (scooters, commuter motorcycles, electric vehicles) and four-wheelers (hatchbacks, sedans, SUVs). The software orchestrates customer discovery, real-time collision-free availability checking, tiered rental plans, digital payments, vendor fleet administration, offline walk-in bookings, physical trip custody (odometer/OTP), and machine learning services for recommendations, demand forecasting, and dynamic pricing.
    </p>

    <h2>1.3 Intended Audience &amp; Reading Suggestions</h2>
    <p>
      This document is structured for the following stakeholders:
    </p>
    <ul>
      <li><strong>Academic Evaluation Committee &amp; Project Guides:</strong> Focus on Sections 1 to 6 (System Architecture, Requirements, Use Cases) and Section 11 (Business &amp; Scheduling Logic).</li>
      <li><strong>Full-Stack Software Developers:</strong> Review Sections 3 (Functional Requirements), 8 (Data Dictionary), 9 (API Specifications), and 14 (Error Handling).</li>
      <li><strong>DevOps &amp; Infrastructure Engineers:</strong> Examine Section 4 (NFRs), Section 10 (Security), and Section 16 (Deployment Architecture).</li>
      <li><strong>Data &amp; Machine Learning Engineers:</strong> Refer to Section 12 (AI/ML Microservice Specification).</li>
    </ul>

    <h2>1.4 Product Overview &amp; High-Level Philosophy</h2>
    <p>
      RentRide bridges the gap between independent vehicle owners and urban commuters. Built on a resilient three-tier architecture (React SPA, Express API, MongoDB) augmented by a Python FastAPI ML microservice, the platform enforces atomic data consistency, transparent server-side pricing, and verified digital trip handovers.
    </p>

    <h2>1.5 Definitions, Acronyms and Abbreviations</h2>
    <table>
      <thead>
        <tr>
          <th>Acronym / Term</th>
          <th>Full Form &amp; System Definition</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>API</strong></td>
          <td>Application Programming Interface: RESTful endpoints exposed by Express and FastAPI.</td>
        </tr>
        <tr>
          <td><strong>ARAI</strong></td>
          <td>Automotive Research Association of India: Official certification body for vehicle fuel mileage.</td>
        </tr>
        <tr>
          <td><strong>Bcrypt</strong></td>
          <td>Adaptive cryptographic key-derivation function used for one-way password hashing.</td>
        </tr>
        <tr>
          <td><strong>CRUD</strong></td>
          <td>Create, Read, Update, Delete: Basic database manipulation operations.</td>
        </tr>
        <tr>
          <td><strong>DFD</strong></td>
          <td>Data Flow Diagram: Graphical representation of information flow through the system.</td>
        </tr>
        <tr>
          <td><strong>ERD</strong></td>
          <td>Entity-Relationship Diagram: Structural model of database entities and associations.</td>
        </tr>
        <tr>
          <td><strong>GST</strong></td>
          <td>Goods and Services Tax: Mandatory 18% statutory tax calculated on vehicle rental subtotal.</td>
        </tr>
        <tr>
          <td><strong>HMAC</strong></td>
          <td>Hash-based Message Authentication Code: Cryptographic signature used to verify Razorpay webhooks.</td>
        </tr>
        <tr>
          <td><strong>JWT</strong></td>
          <td>JSON Web Token: Compact, URL-safe means of representing claims between client and server.</td>
        </tr>
        <tr>
          <td><strong>KYC</strong></td>
          <td>Know Your Customer: Identity verification procedure validating driving license credentials.</td>
        </tr>
        <tr>
          <td><strong>ODM</strong></td>
          <td>Object Data Modeling: Mongoose abstraction layer mapping JavaScript objects to MongoDB.</td>
        </tr>
        <tr>
          <td><strong>RBAC</strong></td>
          <td>Role-Based Access Control: Security mechanism restricting resources based on user roles.</td>
        </tr>
        <tr>
          <td><strong>SPA</strong></td>
          <td>Single-Page Application: Web application loading a single HTML page (React + Vite).</td>
        </tr>
        <tr>
          <td><strong>TTL</strong></td>
          <td>Time-To-Live: Automatic expiration period used for temporary reservation locks (10 minutes).</td>
        </tr>
      </tbody>
    </table>

    <h2>1.6 References</h2>
    <ol>
      <li>IEEE Std 830-1998: <em>IEEE Recommended Practice for Software Requirements Specifications</em>.</li>
      <li>RentRide Architectural Repository &amp; Technical Documentation Suite (<code>docs/01-15</code>).</li>
      <li>MongoDB Inc. <em>Mongoose 8 Framework Guide &amp; Multi-Index Aggregations</em>.</li>
      <li>Razorpay Technologies. <em>Razorpay Standard Checkout &amp; Webhook Signature Protocols</em>.</li>
    </ol>
  </div>

  <!-- SECTION 2: OVERALL DESCRIPTION -->
  <div class="page-break">
    <h1>2. OVERALL DESCRIPTION</h1>

    <h2>2.1 Product Perspective</h2>
    <p>
      RentRide operates as a sovereign, self-contained multi-vendor marketplace. It interfaces with external services strictly via authenticated HTTPS protocols (Cloudinary for media asset hosting, Razorpay for payment order capture, and internal microservice communication to FastAPI for ML inference). The system is completely cloud-agnostic, capable of local deployment via Node.js/Vite or distributed cloud containerization.
    </p>

    <h2>2.2 Product Functions Summary</h2>
    <ul>
      <li><strong>User Identity &amp; Access:</strong> Registration, login, profile management, driving license upload, role assignment (<code>CUSTOMER</code>, <code>VENDOR</code>, <code>ADMIN</code>).</li>
      <li><strong>Marketplace Exploration:</strong> City hub selection (Indore, Bhopal, Gwalior), multi-tier taxonomy filtering, dynamic fuel cost estimation.</li>
      <li><strong>Availability &amp; Collision Engine:</strong> Deterministic interval overlap conflict prevention across digital bookings, offline walk-ins, and maintenance downtime.</li>
      <li><strong>Rental Duration Flexibility:</strong> Custom Hourly plans (1–24h), 12-Hour Day Passes, and 24-Hour Multi-day packages.</li>
      <li><strong>Checkout &amp; Inventory Lock:</strong> 10-minute temporary inventory reservation lock (<code>lockExpiresAt</code>).</li>
      <li><strong>Payment Reconciliation:</strong> Razorpay order creation, payment capture, and HMAC-SHA256 verification.</li>
      <li><strong>Vendor Operations:</strong> Fleet listing, Cloudinary photo uploads, walk-in offline bookings, digital trip handovers (odometer/OTP), and return processing.</li>
      <li><strong>Platform Governance:</strong> Administrative vehicle moderation, user auditing, coupon lifecycle management, and global booking ledgers.</li>
      <li><strong>AI Microservice:</strong> Multi-attribute recommendation scoring, 7-day demand forecasting, and elasticity-bounded dynamic pricing.</li>
    </ul>

    <h2>2.3 User Classes and Characteristics</h2>
    <table>
      <thead>
        <tr>
          <th>User Class</th>
          <th>Characteristics &amp; Technical Profile</th>
          <th>Permissions &amp; Capabilities</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Public Guest</strong></td>
          <td>Unauthenticated visitor browsing the platform via mobile or desktop web browser.</td>
          <td>View landing page, search and filter available vehicles, inspect vehicle details, calculate estimated fuel costs, simulate fare breakdown.</td>
        </tr>
        <tr>
          <td><strong>Customer</strong></td>
          <td>Registered commuter or traveler requiring on-demand vehicle rental services.</td>
          <td>All Guest capabilities + create online bookings, apply coupons, execute Razorpay checkout, manage reservations, cancel trips, write verified reviews, receive in-app notifications.</td>
        </tr>
        <tr>
          <td><strong>Vendor</strong></td>
          <td>Commercial fleet agency, bike rental shop, or vehicle owner listing fleet inventory.</td>
          <td>Manage vendor business profile, create vehicle listings (manual or 1-click catalog auto-fill), log offline walk-in bookings, execute vehicle handover/return workflows, schedule maintenance blackouts, view earnings metrics.</td>
        </tr>
        <tr>
          <td><strong>Admin</strong></td>
          <td>System administrator responsible for platform governance and compliance.</td>
          <td>Platform-wide superuser: approve/reject vendor vehicle listings, review user KYC status, create and deactivate promotional coupons, inspect global financial transactions, view analytics.</td>
        </tr>
      </tbody>
    </table>

    <h2>2.4 Operating Environment</h2>
    <ul>
      <li><strong>Client Environment:</strong> Modern standards-compliant web browsers (Google Chrome 110+, Mozilla Firefox 110+, Apple Safari 16+, Microsoft Edge 110+). Responsive on mobile (360px+), tablet, and desktop viewports.</li>
      <li><strong>Server Runtime:</strong> Node.js version 18.x or 20.x LTS running on Linux/Windows/macOS.</li>
      <li><strong>Database Environment:</strong> MongoDB version 6.0+ (MongoDB Atlas cloud cluster or local replica set).</li>
      <li><strong>AI Microservice Runtime:</strong> Python 3.10+ with FastAPI, Uvicorn, Scikit-learn, Pandas, and NumPy.</li>
      <li><strong>External Network APIs:</strong> Outbound HTTPS connectivity to <code>api.razorpay.com</code> and <code>api.cloudinary.com</code>.</li>
    </ul>

    <h2>2.5 Design and Implementation Constraints</h2>
    <ul>
      <li><strong>Stateless Authentication:</strong> All backend endpoints rely on stateless JWT tokens; no session state is maintained in server memory.</li>
      <li><strong>Mathematical Collision Consistency:</strong> Availability queries must execute compound range checks (<code>$lt</code> / <code>$gt</code>) with strict exclusion of expired locks.</li>
      <li><strong>Deterministic Pricing Bounds:</strong> Dynamic pricing multipliers must never fall below 0.90x or exceed 1.35x.</li>
      <li><strong>Zero Binary Storage:</strong> The database stores no raw binary image data; all images are hosted on Cloudinary CDN and referenced by HTTPS URL and public ID.</li>
    </ul>

    <h2>2.6 Assumptions and Dependencies</h2>
    <ul>
      <li>Customers possess an active Indian mobile number, driving license, and access to UPI or online banking via Razorpay.</li>
      <li>Vendors are legally authorized to lease vehicles commercially within operational jurisdictions.</li>
      <li>Network latency between Express backend and FastAPI microservice remains under 150ms over internal HTTP.</li>
    </ul>
  </div>

  <!-- SECTION 3: FUNCTIONAL REQUIREMENTS -->
  <div class="page-break">
    <h1>3. SYSTEM FEATURES / FUNCTIONAL REQUIREMENTS</h1>
    <p>
      This section details the functional requirements across all 22 domain modules. Each requirement is assigned a unique identifier, priority level (High / Medium / Low), actor, preconditions, and expected behavior.
    </p>

    <h2>3.1 Module A: Authentication &amp; Authorization (FR-AUTH)</h2>
    <table>
      <thead>
        <tr>
          <th>Requirement ID</th>
          <th>Description &amp; Specification</th>
          <th>Actor</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>FR-AUTH-001</strong></td>
          <td>The system shall register new Customer and Vendor accounts with validated name, email, password, and phone number.</td>
          <td>User</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-AUTH-002</strong></td>
          <td>The system shall hash passwords using Bcrypt (10 salt rounds) prior to database persistence.</td>
          <td>System</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-AUTH-003</strong></td>
          <td>The system shall authenticate credentials and issue a signed JSON Web Token (JWT) containing user ID and role claims.</td>
          <td>User</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-AUTH-004</strong></td>
          <td>The system shall enforce Role-Based Access Control (RBAC) via middleware guards (<code>CUSTOMER</code>, <code>VENDOR</code>, <code>ADMIN</code>).</td>
          <td>System</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-AUTH-005</strong></td>
          <td>The system shall reject requests with missing, expired, or tampered JWT signatures with HTTP 401 Unauthorized.</td>
          <td>System</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-AUTH-006</strong></td>
          <td>The system shall restrict client authentication attempts to 100 requests per 15-minute window via rate-limiting.</td>
          <td>System</td>
          <td>Medium</td>
        </tr>
        <tr>
          <td><strong>FR-AUTH-007</strong></td>
          <td>The system shall allow authenticated users to update their profile information and upload avatar images via Cloudinary.</td>
          <td>User</td>
          <td>Medium</td>
        </tr>
        <tr>
          <td><strong>FR-AUTH-008</strong></td>
          <td>The system shall provide a secure password change endpoint verifying the current password before updating.</td>
          <td>User</td>
          <td>Medium</td>
        </tr>
      </tbody>
    </table>

    <h2>3.2 Module B: Customer Profile &amp; KYC Management (FR-CUST)</h2>
    <table>
      <thead>
        <tr>
          <th>Requirement ID</th>
          <th>Description &amp; Specification</th>
          <th>Actor</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>FR-CUST-001</strong></td>
          <td>The system shall permit customers to submit driving license credentials (number, expiry date, document URL).</td>
          <td>Customer</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-CUST-002</strong></td>
          <td>The system shall maintain customer KYC status flags (<code>PENDING</code>, <code>VERIFIED</code>, <code>REJECTED</code>).</td>
          <td>System</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-CUST-003</strong></td>
          <td>The system shall present customers with an overview of past, active, and upcoming booking reservations.</td>
          <td>Customer</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-CUST-004</strong></td>
          <td>The system shall allow customers to cancel bookings in accordance with cancellation policy rules.</td>
          <td>Customer</td>
          <td>High</td>
        </tr>
      </tbody>
    </table>

    <h2>3.3 Module C: Vendor Onboarding &amp; Fleets (FR-VEND)</h2>
    <table>
      <thead>
        <tr>
          <th>Requirement ID</th>
          <th>Description &amp; Specification</th>
          <th>Actor</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>FR-VEND-001</strong></td>
          <td>The system shall capture vendor business metadata (business name, GST number, physical address).</td>
          <td>Vendor</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-VEND-002</strong></td>
          <td>The system shall maintain an <code>isApproved</code> moderation flag on vendor profiles, controllable by Administrators.</td>
          <td>Admin</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-VEND-003</strong></td>
          <td>The system shall provide vendors with a unified dashboard summarizing fleet count, active rentals, and earnings.</td>
          <td>Vendor</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-VEND-004</strong></td>
          <td>The system shall calculate net vendor payouts by subtracting the platform commission (default 10%) from booking subtotals.</td>
          <td>System</td>
          <td>High</td>
        </tr>
      </tbody>
    </table>

    <h2>3.4 Module D: Vehicle Management (FR-VEH)</h2>
    <table>
      <thead>
        <tr>
          <th>Requirement ID</th>
          <th>Description &amp; Specification</th>
          <th>Actor</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>FR-VEH-001</strong></td>
          <td>The system shall allow vendors to list vehicles with brand, model, registration number, year, fuel, and transmission.</td>
          <td>Vendor</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-VEH-002</strong></td>
          <td>The system shall enforce tiered pricing definitions on vehicle creation: hourly rate, 12-hour rate, 24-hour rate.</td>
          <td>Vendor</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-VEH-003</strong></td>
          <td>The system shall upload vehicle gallery images to Cloudinary, storing HTTPS URLs and public IDs.</td>
          <td>Vendor</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-VEH-004</strong></td>
          <td>The system shall enforce status transitions across <code>AVAILABLE</code>, <code>RENTED</code>, <code>MAINTENANCE</code>, and <code>INACTIVE</code>.</td>
          <td>System</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-VEH-005</strong></td>
          <td>The system shall enforce unique vehicle license registration plates in uppercase format.</td>
          <td>System</td>
          <td>High</td>
        </tr>
      </tbody>
    </table>

    <h2>3.5 Module E: Vehicle Categories (FR-CAT)</h2>
    <table>
      <thead>
        <tr>
          <th>Requirement ID</th>
          <th>Description &amp; Specification</th>
          <th>Actor</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>FR-CAT-001</strong></td>
          <td>The system shall organize fleet vehicles into two top-level types: <code>two_wheeler</code> and <code>four_wheeler</code>.</td>
          <td>System</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-CAT-002</strong></td>
          <td>The system shall maintain specific category slugs: <code>electric-scooters</code>, <code>scooters</code>, <code>bikes</code>, <code>hatchbacks</code>, <code>sedans</code>, <code>suvs</code>.</td>
          <td>System</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-CAT-003</strong></td>
          <td>The system shall automatically generate URL slugs from category names using pre-validate Mongoose hooks.</td>
          <td>System</td>
          <td>Medium</td>
        </tr>
      </tbody>
    </table>

    <h2>3.6 Module F: City Search &amp; Filter Engine (FR-SRCH)</h2>
    <table>
      <thead>
        <tr>
          <th>Requirement ID</th>
          <th>Description &amp; Specification</th>
          <th>Actor</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>FR-SRCH-001</strong></td>
          <td>The system shall provide city hub filtering supporting primary hubs (Indore, Bhopal, Gwalior).</td>
          <td>User</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-SRCH-002</strong></td>
          <td>The system shall filter vehicle inventory by price range, fuel type, transmission, and minimum seating capacity.</td>
          <td>User</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-SRCH-003</strong></td>
          <td>The system shall filter out unapproved (<code>isApproved: false</code>) or inactive vehicles from public search results.</td>
          <td>System</td>
          <td>High</td>
        </tr>
      </tbody>
    </table>

    <h2>3.7 Module G: Availability &amp; Collision Engine (FR-AVAL)</h2>
    <table>
      <thead>
        <tr>
          <th>Requirement ID</th>
          <th>Description &amp; Specification</th>
          <th>Actor</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>FR-AVAL-001</strong></td>
          <td>The system shall execute mathematical interval overlap detection verifying: (Start<sub>req</sub> &lt; End<sub>exist</sub>) &and; (End<sub>req</sub> &gt; Start<sub>exist</sub>).</td>
          <td>System</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-AVAL-002</strong></td>
          <td>The system shall evaluate conflicts against <code>CONFIRMED</code>, <code>ACTIVE</code>, and non-expired <code>PENDING_PAYMENT</code> bookings.</td>
          <td>System</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-AVAL-003</strong></td>
          <td>The system shall evaluate conflicts against active vendor <code>MAINTENANCE</code> blackout intervals.</td>
          <td>System</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-AVAL-004</strong></td>
          <td>The system shall exclude expired <code>PENDING_PAYMENT</code> reservations where <code>lockExpiresAt &lt; Date.now()</code>.</td>
          <td>System</td>
          <td>High</td>
        </tr>
      </tbody>
    </table>

    <h2>3.8 Module H: Rental Duration Plans (FR-PLAN)</h2>
    <table>
      <thead>
        <tr>
          <th>Requirement ID</th>
          <th>Description &amp; Specification</th>
          <th>Actor</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>FR-PLAN-001</strong></td>
          <td>The system shall support three distinct rental plans: <code>HOURLY</code>, <code>12_HOURS</code>, and <code>24_HOURS</code>.</td>
          <td>User</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-PLAN-002</strong></td>
          <td>For <code>HOURLY</code> rentals, the system shall allow the customer to manually specify the duration between 1 and 24 integer hours.</td>
          <td>Customer</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-PLAN-003</strong></td>
          <td>For <code>12_HOURS</code> rentals, the system shall enforce a fixed duration of exactly 12 hours.</td>
          <td>System</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-PLAN-004</strong></td>
          <td>For <code>24_HOURS</code> rentals, the system shall enforce a fixed duration of exactly 24 hours.</td>
          <td>System</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-PLAN-005</strong></td>
          <td>The system shall reject fractional/decimal hours or durations outside [1, 24] with validation errors.</td>
          <td>System</td>
          <td>High</td>
        </tr>
      </tbody>
    </table>

    <h2>3.9 Module I: Booking Management &amp; Reservation Locks (FR-BOOK)</h2>
    <table>
      <thead>
        <tr>
          <th>Requirement ID</th>
          <th>Description &amp; Specification</th>
          <th>Actor</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>FR-BOOK-001</strong></td>
          <td>The system shall generate unique human-readable booking codes in the format <code>RR-YYYYMMDD-XXXXX</code>.</td>
          <td>System</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-BOOK-002</strong></td>
          <td>Upon checkout initiation, the system shall assign status <code>PENDING_PAYMENT</code> with a 10-minute lock (<code>lockExpiresAt</code>).</td>
          <td>System</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-BOOK-003</strong></td>
          <td>The system shall prevent other customers from reserving the locked vehicle during the active 10-minute checkout window.</td>
          <td>System</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-BOOK-004</strong></td>
          <td>The system shall transition booking status to <code>CONFIRMED</code> upon verified Razorpay payment capture.</td>
          <td>System</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-BOOK-005</strong></td>
          <td>The system shall record full price breakdown audit objects within every booking document.</td>
          <td>System</td>
          <td>High</td>
        </tr>
      </tbody>
    </table>

    <h2>3.10 Module J: Server Pricing Engine (FR-PRIC)</h2>
    <table>
      <thead>
        <tr>
          <th>Requirement ID</th>
          <th>Description &amp; Specification</th>
          <th>Actor</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>FR-PRIC-001</strong></td>
          <td>The system shall compute base rental fees server-side, ignoring unvalidated client-submitted prices.</td>
          <td>System</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-PRIC-002</strong></td>
          <td>The system shall apply a 1.15x surge multiplier to base rates for rentals starting on Friday, Saturday, or Sunday.</td>
          <td>System</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-PRIC-003</strong></td>
          <td>The system shall deduct valid coupon discounts from the surge-adjusted subtotal.</td>
          <td>System</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-PRIC-004</strong></td>
          <td>The system shall compute a mandatory 5% platform service fee and 18% GST on the net rental fee.</td>
          <td>System</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-PRIC-005</strong></td>
          <td>The system shall add the vehicle's refundable security deposit to total payable amount.</td>
          <td>System</td>
          <td>High</td>
        </tr>
      </tbody>
    </table>

    <h2>3.11 Module K: Coupons &amp; Promotions Engine (FR-COUP)</h2>
    <table>
      <thead>
        <tr>
          <th>Requirement ID</th>
          <th>Description &amp; Specification</th>
          <th>Actor</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>FR-COUP-001</strong></td>
          <td>The system shall support <code>PERCENTAGE</code> and <code>FIXED</code> discount coupon types.</td>
          <td>Admin</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-COUP-002</strong></td>
          <td>The system shall enforce global usage quotas (<code>totalUsageLimit</code>) and individual per-user limits (<code>perUserLimit</code>).</td>
          <td>System</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-COUP-003</strong></td>
          <td>The system shall enforce minimum booking amount thresholds and validity start/end timestamps.</td>
          <td>System</td>
          <td>High</td>
        </tr>
      </tbody>
    </table>

    <h2>3.12 Module L: Payment Processing via Razorpay (FR-PAY)</h2>
    <table>
      <thead>
        <tr>
          <th>Requirement ID</th>
          <th>Description &amp; Specification</th>
          <th>Actor</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>FR-PAY-001</strong></td>
          <td>The system shall create Razorpay order instances with amount in INR currency subunit (paise).</td>
          <td>System</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-PAY-002</strong></td>
          <td>The system shall verify payments using HMAC-SHA256 signature verification over <code>order_id|payment_id</code>.</td>
          <td>System</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-PAY-003</strong></td>
          <td>The system shall record payment method, gateway order ID, payment ID, and timestamp in a <code>Payment</code> document.</td>
          <td>System</td>
          <td>High</td>
        </tr>
      </tbody>
    </table>

    <h2>3.13 Module M: Walk-In Offline Bookings (FR-WKIN)</h2>
    <table>
      <thead>
        <tr>
          <th>Requirement ID</th>
          <th>Description &amp; Specification</th>
          <th>Actor</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>FR-WKIN-001</strong></td>
          <td>The system shall allow vendors to log walk-in offline rentals specifying customer name, phone, and license number.</td>
          <td>Vendor</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-WKIN-002</strong></td>
          <td>Walk-in offline rentals shall trigger the collision engine, blocking online availability identically to online bookings.</td>
          <td>System</td>
          <td>High</td>
        </tr>
      </tbody>
    </table>

    <h2>3.14 Module N: Vehicle Handover &amp; Return / Trip Custody (FR-TRIP)</h2>
    <table>
      <thead>
        <tr>
          <th>Requirement ID</th>
          <th>Description &amp; Specification</th>
          <th>Actor</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>FR-TRIP-001</strong></td>
          <td>The system shall execute <code>Start Trip</code> handover recording initial vehicle odometer reading and fuel level.</td>
          <td>Vendor</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-TRIP-002</strong></td>
          <td>The system shall execute <code>Complete Trip</code> return recording return odometer reading, fuel level, and return timestamp.</td>
          <td>Vendor</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-TRIP-003</strong></td>
          <td>The system shall calculate extra kilometer penalties if total trip distance exceeds the included daily allowance cap.</td>
          <td>System</td>
          <td>High</td>
        </tr>
      </tbody>
    </table>

    <h2>3.15 Module O: Maintenance Management (FR-MAINT)</h2>
    <table>
      <thead>
        <tr>
          <th>Requirement ID</th>
          <th>Description &amp; Specification</th>
          <th>Actor</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>FR-MAINT-001</strong></td>
          <td>The system shall permit vendors to schedule maintenance windows (<code>routine</code>, <code>repair</code>, <code>inspection</code>).</td>
          <td>Vendor</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-MAINT-002</strong></td>
          <td>The system shall automatically block vehicle availability across the scheduled maintenance time window.</td>
          <td>System</td>
          <td>High</td>
        </tr>
      </tbody>
    </table>

    <h2>3.16 Module P: Admin Governance &amp; Moderation (FR-ADM)</h2>
    <table>
      <thead>
        <tr>
          <th>Requirement ID</th>
          <th>Description &amp; Specification</th>
          <th>Actor</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>FR-ADM-001</strong></td>
          <td>The system shall allow Administrators to approve or reject pending vendor vehicle listings.</td>
          <td>Admin</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-ADM-002</strong></td>
          <td>The system shall provide Administrators with a global ledger auditing all marketplace transactions and commissions.</td>
          <td>Admin</td>
          <td>High</td>
        </tr>
      </tbody>
    </table>

    <h2>3.17 Module Q: Customer Reviews &amp; Ratings (FR-REV)</h2>
    <table>
      <thead>
        <tr>
          <th>Requirement ID</th>
          <th>Description &amp; Specification</th>
          <th>Actor</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>FR-REV-001</strong></td>
          <td>The system shall permit customers to submit verified ratings (1 to 5 stars) and text reviews only for completed trips.</td>
          <td>Customer</td>
          <td>Medium</td>
        </tr>
        <tr>
          <td><strong>FR-REV-002</strong></td>
          <td>The system shall automatically recalculate <code>ratingAverage</code> and <code>ratingCount</code> on the Vehicle entity via Mongoose hooks.</td>
          <td>System</td>
          <td>High</td>
        </tr>
      </tbody>
    </table>

    <h2>3.18 Module R: In-App Notifications (FR-NOTIF)</h2>
    <table>
      <thead>
        <tr>
          <th>Requirement ID</th>
          <th>Description &amp; Specification</th>
          <th>Actor</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>FR-NOTIF-001</strong></td>
          <td>The system shall generate in-app notification alerts upon booking confirmation, cancellation, and payment events.</td>
          <td>System</td>
          <td>Medium</td>
        </tr>
        <tr>
          <td><strong>FR-NOTIF-002</strong></td>
          <td>The system shall allow users to view unread alerts and mark notifications as read.</td>
          <td>User</td>
          <td>Medium</td>
        </tr>
      </tbody>
    </table>

    <h2>3.19 Module S: AI Recommendations Engine (FR-AI-REC)</h2>
    <table>
      <thead>
        <tr>
          <th>Requirement ID</th>
          <th>Description &amp; Specification</th>
          <th>Actor</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>FR-AI-REC-001</strong></td>
          <td>The system shall score candidate fleet vehicles against user preferences using weighted multi-attribute feature scoring.</td>
          <td>AI Microservice</td>
          <td>Medium</td>
        </tr>
        <tr>
          <td><strong>FR-AI-REC-002</strong></td>
          <td>The system shall normalize match scores between 60% and 99% and return ranked vehicle recommendations with highlights.</td>
          <td>AI Microservice</td>
          <td>Medium</td>
        </tr>
      </tbody>
    </table>

    <h2>3.20 Module T: AI 7-Day Demand Forecasting (FR-AI-FCST)</h2>
    <table>
      <thead>
        <tr>
          <th>Requirement ID</th>
          <th>Description &amp; Specification</th>
          <th>Actor</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>FR-AI-FCST-001</strong></td>
          <td>The system shall compute a 7-day demand index forecast based on city multipliers, category factors, and day seasonality.</td>
          <td>AI Microservice</td>
          <td>Medium</td>
        </tr>
        <tr>
          <td><strong>FR-AI-FCST-002</strong></td>
          <td>The system shall identify peak demand days and output demand classifications (<code>LOW</code>, <code>MEDIUM</code>, <code>HIGH</code>, <code>VERY HIGH</code>, <code>PEAK</code>).</td>
          <td>AI Microservice</td>
          <td>Medium</td>
        </tr>
      </tbody>
    </table>

    <h2>3.21 Module U: AI Dynamic Pricing Engine (FR-AI-PRIC)</h2>
    <table>
      <thead>
        <tr>
          <th>Requirement ID</th>
          <th>Description &amp; Specification</th>
          <th>Actor</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>FR-AI-PRIC-001</strong></td>
          <td>The system shall calculate a dynamic pricing multiplier bounded deterministically between 0.90x and 1.35x.</td>
          <td>AI Microservice</td>
          <td>Medium</td>
        </tr>
        <tr>
          <td><strong>FR-AI-PRIC-002</strong></td>
          <td>The engine shall factor day-of-week deltas, fleet scarcity thresholds (&ge;80% &rarr; +15%), and city deltas.</td>
          <td>AI Microservice</td>
          <td>Medium</td>
        </tr>
      </tbody>
    </table>

    <h2>3.22 Module V: Master Vehicle Catalog (FR-CATL)</h2>
    <table>
      <thead>
        <tr>
          <th>Requirement ID</th>
          <th>Description &amp; Specification</th>
          <th>Actor</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>FR-CATL-001</strong></td>
          <td>The system shall maintain a master database of 327 verified Indian vehicle specifications with certified ARAI mileage.</td>
          <td>System</td>
          <td>High</td>
        </tr>
        <tr>
          <td><strong>FR-CATL-002</strong></td>
          <td>The system shall allow vendors to select a master model and auto-populate technical specs, fuel type, and photos with 1 click.</td>
          <td>Vendor</td>
          <td>High</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- SECTION 4: NON-FUNCTIONAL REQUIREMENTS -->
  <div class="page-break">
    <h1>4. NON-FUNCTIONAL REQUIREMENTS</h1>
    <p>
      The platform enforces 12 non-functional requirements to ensure reliability, speed, and maintainability:
    </p>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Category</th>
          <th>Metric &amp; Implementation Requirement</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>NFR-001</strong></td>
          <td>Performance</td>
          <td>API response latency shall remain &lt; 250ms for 95% of database read operations; availability collision query execution &lt; 80ms under typical loads.</td>
        </tr>
        <tr>
          <td><strong>NFR-002</strong></td>
          <td>Security</td>
          <td>Stateless JWT authentication with 24-hour expiration; Bcrypt 10 rounds for passwords; Helmet HTTP security headers; CORS restricted origins.</td>
        </tr>
        <tr>
          <td><strong>NFR-003</strong></td>
          <td>Reliability</td>
          <td>The backend shall handle database disconnections gracefully, providing health status degrades without process termination.</td>
        </tr>
        <tr>
          <td><strong>NFR-004</strong></td>
          <td>Availability</td>
          <td>Target operational uptime of 99.5% for core transactional services (search, availability, booking, payment).</td>
        </tr>
        <tr>
          <td><strong>NFR-005</strong></td>
          <td>Scalability</td>
          <td>Stateless Node.js architecture allows horizontal scaling behind reverse proxies; MongoDB Atlas supports replica-set read scaling.</td>
        </tr>
        <tr>
          <td><strong>NFR-006</strong></td>
          <td>Maintainability</td>
          <td>Clean separation into Layered Service Pattern (Routes &rarr; Controllers &rarr; Domain Services &rarr; Mongoose Models); strict Zod schema decoupling.</td>
        </tr>
        <tr>
          <td><strong>NFR-007</strong></td>
          <td>Usability</td>
          <td>Mobile-first responsive UI built with Tailwind CSS; WCAG 2.1 AA compliant color contrast; clear form validation feedback.</td>
        </tr>
        <tr>
          <td><strong>NFR-008</strong></td>
          <td>Data Integrity</td>
          <td>Compound indexing <code>{ vehicleId: 1, startDateTime: 1, endDateTime: 1 }</code> guarantees zero booking overlaps across concurrent requests.</td>
        </tr>
        <tr>
          <td><strong>NFR-009</strong></td>
          <td>Compatibility</td>
          <td>Cross-browser compatibility across Chrome, Safari, Firefox, and Edge on desktop and mobile viewports.</td>
        </tr>
        <tr>
          <td><strong>NFR-010</strong></td>
          <td>Error Handling</td>
          <td>Standardized error JSON contract (<code>ApiResponse</code> &amp; <code>ApiError</code>) with HTTP status codes and user-friendly diagnostic messages.</td>
        </tr>
        <tr>
          <td><strong>NFR-011</strong></td>
          <td>Privacy</td>
          <td>Customer driving license documents accessible only by authorized vendor and admin roles; payment card data processed directly by PCI-DSS compliant Razorpay.</td>
        </tr>
        <tr>
          <td><strong>NFR-012</strong></td>
          <td>API Consistency</td>
          <td>Consistent RESTful JSON responses (<code>{ success: true, statusCode, data, message }</code>) across all endpoints.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- SECTION 5: SYSTEM ARCHITECTURE & DATA FLOW -->
  <div class="page-break">
    <h1>5. SYSTEM ARCHITECTURE &amp; DATA FLOW DIAGRAMS</h1>
    
    <h2>5.1 Multi-Tier Architecture</h2>
    <p>
      RentRide implements a three-tier architecture augmented by an auxiliary machine learning microservice:
    </p>
    <div class="diagram-container">
      ${SVG_SYSTEM_ARCHITECTURE}
      <div class="figure-caption">Figure 5.1: RentRide Physical &amp; Logical Architecture</div>
    </div>

    <h2>5.2 Data Flow Diagram (Level 1)</h2>
    <p>
      The DFD Level 1 diagram illustrates data flows between external entities (Customer, Vendor, Razorpay), core system processes (Search &amp; Collision Engine, Booking &amp; Pricing Engine, Handover &amp; Return), and persistent data stores:
    </p>
    <div class="diagram-container">
      ${SVG_DFD_LEVEL1}
      <div class="figure-caption">Figure 5.2: RentRide Data Flow Diagram (DFD Level 1)</div>
    </div>
  </div>

  <!-- SECTION 6: USE CASE MODEL & SPECIFICATIONS -->
  <div class="page-break">
    <h1>6. USE CASE MODEL &amp; SPECIFICATIONS</h1>

    <h2>6.1 Use Case Diagram</h2>
    <div class="diagram-container">
      ${SVG_USE_CASE_DIAGRAM}
      <div class="figure-caption">Figure 6.1: Complete Use Case Diagram</div>
    </div>

    <h2>6.2 Detailed Use Case Specifications (UC-01 to UC-17)</h2>

    <h3>UC-01: User Registration</h3>
    <ul>
      <li><strong>Actor:</strong> Public Guest / Customer / Vendor</li>
      <li><strong>Preconditions:</strong> User provides unassigned email address.</li>
      <li><strong>Main Flow:</strong> User submits name, email, password, phone, and role. System validates fields via Zod, hashes password via Bcrypt (10 rounds), persists User document, generates JWT, and returns authenticated session.</li>
      <li><strong>Alternative Flow:</strong> Email already exists &rarr; System responds with HTTP 400 Bad Request.</li>
      <li><strong>Postconditions:</strong> User record is active in MongoDB.</li>
    </ul>

    <h3>UC-02: User Login</h3>
    <ul>
      <li><strong>Actor:</strong> Customer / Vendor / Admin</li>
      <li><strong>Main Flow:</strong> User submits email and password. System queries user including password hash, verifies password via <code>bcrypt.compare</code>, issues signed JWT, and returns role-specific profile.</li>
      <li><strong>Exception Flow:</strong> Invalid credentials &rarr; System returns HTTP 401 Unauthorized.</li>
    </ul>

    <h3>UC-03: Search &amp; Filter Vehicles</h3>
    <ul>
      <li><strong>Actor:</strong> Customer / Guest</li>
      <li><strong>Main Flow:</strong> User selects city hub (Indore, Bhopal, Gwalior) and optional filters (category, price, fuel, transmission, seating). System queries approved, active vehicles matching criteria and returns vehicle cards with pricing and ratings.</li>
    </ul>

    <h3>UC-04: Check Vehicle Availability</h3>
    <ul>
      <li><strong>Actor:</strong> Customer / System</li>
      <li><strong>Main Flow:</strong> Customer selects vehicle, rental plan, duration, and start timestamp. System executes mathematical interval overlap check. If no overlapping bookings or maintenance intervals exist, system returns available status with exact authoritative price quote.</li>
      <li><strong>Alternative Flow:</strong> Overlap detected &rarr; System returns unavailable status with conflicting window notice.</li>
    </ul>

    <h3>UC-05: Create Online Booking &amp; 10-Minute Lock</h3>
    <ul>
      <li><strong>Actor:</strong> Customer</li>
      <li><strong>Preconditions:</strong> Vehicle is available for requested interval; customer is authenticated.</li>
      <li><strong>Main Flow:</strong> Customer confirms schedule. System creates Booking with status <code>PENDING_PAYMENT</code>, computes server-side price breakdown, and assigns <code>lockExpiresAt = Date.now() + 10 minutes</code>. Vehicle is locked from concurrent reservations.</li>
    </ul>

    <h3>UC-06: Make Payment (Razorpay Checkout)</h3>
    <ul>
      <li><strong>Actor:</strong> Customer / Payment Gateway</li>
      <li><strong>Main Flow:</strong> Customer invokes Razorpay modal for locked booking. Upon successful transaction, client returns <code>razorpay_order_id</code>, <code>razorpay_payment_id</code>, and <code>razorpay_signature</code>. Backend verifies HMAC-SHA256 signature, transitions booking status to <code>CONFIRMED</code>, and creates audited Payment record.</li>
      <li><strong>Exception Flow:</strong> Signature mismatch &rarr; Payment marked <code>FAILED</code>, booking remains unconfirmed.</li>
    </ul>

    <h3>UC-07: Cancel Booking</h3>
    <ul>
      <li><strong>Actor:</strong> Customer / Vendor / Admin</li>
      <li><strong>Main Flow:</strong> Customer requests cancellation on confirmed booking. System verifies cancellation policy, computes refund amount and cancellation fee, transitions status to <code>CANCELLED</code>, and releases inventory slot.</li>
    </ul>

    <h3>UC-08: Vendor Adds Vehicle</h3>
    <ul>
      <li><strong>Actor:</strong> Vendor</li>
      <li><strong>Main Flow:</strong> Vendor submits vehicle specifications, tiered pricing (hourly, 12h, 24h), and photographs. System uploads images to Cloudinary, sets <code>isApproved = true</code> (or pending moderation), and saves vehicle record.</li>
    </ul>

    <h3>UC-09: Vendor Logs Walk-In Offline Booking</h3>
    <ul>
      <li><strong>Actor:</strong> Vendor</li>
      <li><strong>Main Flow:</strong> Vendor inputs walk-in customer details (name, phone, license) and dates. System runs collision check and saves Booking with <code>bookingType = OFFLINE</code>, instantly blocking online marketplace availability.</li>
    </ul>

    <h3>UC-10: Vehicle Handover (Start Trip)</h3>
    <ul>
      <li><strong>Actor:</strong> Vendor</li>
      <li><strong>Main Flow:</strong> Customer arrives at pickup hub. Vendor records starting odometer reading and fuel level. System transitions booking status from <code>CONFIRMED</code> to <code>ACTIVE</code>.</li>
    </ul>

    <h3>UC-11: Vehicle Return (Complete Trip)</h3>
    <ul>
      <li><strong>Actor:</strong> Vendor</li>
      <li><strong>Main Flow:</strong> Customer returns vehicle. Vendor inputs return odometer reading. System computes extra km driven against daily cap, adds extra km fee if applicable, releases security deposit, and marks booking <code>COMPLETED</code>.</li>
    </ul>

    <h3>UC-12: Schedule Maintenance</h3>
    <ul>
      <li><strong>Actor:</strong> Vendor</li>
      <li><strong>Main Flow:</strong> Vendor inputs service window (<code>routine</code>, <code>repair</code>, <code>inspection</code>). System verifies no confirmed bookings conflict with the window, creates Maintenance record, and blocks marketplace availability.</li>
    </ul>

    <h3>UC-13: Admin Approves/Rejects Vehicle</h3>
    <ul>
      <li><strong>Actor:</strong> Admin</li>
      <li><strong>Main Flow:</strong> Admin inspects submitted vendor vehicle listing and clicks Approve or Reject. System updates <code>isApproved</code> flag, making vehicle visible or hidden in public marketplace.</li>
    </ul>

    <h3>UC-14: Submit Verified Review</h3>
    <ul>
      <li><strong>Actor:</strong> Customer</li>
      <li><strong>Preconditions:</strong> Booking status is <code>COMPLETED</code>; customer has not already reviewed this booking.</li>
      <li><strong>Main Flow:</strong> Customer submits star rating (1-5) and comment. System saves Review, triggers Mongoose post-save hook, and recalculates vehicle's <code>ratingAverage</code> and <code>ratingCount</code>.</li>
    </ul>

    <h3>UC-15: AI Vehicle Recommendation</h3>
    <ul>
      <li><strong>Actor:</strong> Customer / AI Microservice</li>
      <li><strong>Main Flow:</strong> System passes customer preferences to FastAPI <code>/recommendations</code>. Microservice evaluates candidate fleet via multi-attribute scoring, returns ranked recommendations with percentage match scores (60%–99%).</li>
    </ul>

    <h3>UC-16: AI 7-Day Demand Forecasting</h3>
    <ul>
      <li><strong>Actor:</strong> Vendor / Admin / AI Microservice</li>
      <li><strong>Main Flow:</strong> Vendor views demand forecast for city hub. Microservice analyzes day-of-week seasonality, city multipliers, and fleet utilization, outputting a 7-day demand index curve.</li>
    </ul>

    <h3>UC-17: AI Dynamic Pricing Multiplier</h3>
    <ul>
      <li><strong>Actor:</strong> System / AI Microservice</li>
      <li><strong>Main Flow:</strong> Pricing engine requests dynamic rate multiplier for vehicle booking date. Microservice applies day-of-week deltas, fleet scarcity thresholds, and city factors, returning multiplier bounded in [0.90, 1.35].</li>
    </ul>
  </div>

  <!-- SECTION 7: DATA REQUIREMENTS & ER DIAGRAM -->
  <div class="page-break">
    <h1>7. DATA REQUIREMENTS &amp; ENTITY-RELATIONSHIP MODEL</h1>
    <p>
      RentRide implements 10 normalized document models on MongoDB Atlas. The Entity-Relationship Model demonstrates the structural associations:
    </p>

    <div class="diagram-container">
      ${SVG_ER_DIAGRAM}
      <div class="figure-caption">Figure 7.1: RentRide Entity-Relationship Diagram (ERD)</div>
    </div>

    <h2>7.1 Entity Cardinalities &amp; Multiplicity Rules</h2>
    <ul>
      <li><strong>User (Vendor) to Vehicle:</strong> One-to-Many (1 : N). A vendor owns multiple vehicles; each vehicle has exactly one vendor owner.</li>
      <li><strong>Category to Vehicle:</strong> One-to-Many (1 : N). A category classifies many vehicles; each vehicle references one category.</li>
      <li><strong>Vehicle to Booking:</strong> One-to-Many (1 : N). A vehicle is associated with multiple historical and upcoming bookings.</li>
      <li><strong>Customer to Booking:</strong> One-to-Many (1 : N). A customer creates multiple bookings across their account lifecycle.</li>
      <li><strong>Booking to Payment:</strong> One-to-One (1 : 1). Each online booking references exactly one authoritative payment transaction.</li>
      <li><strong>Booking to Review:</strong> Zero-to-One (0 : 1). A completed booking produces at most one verified customer review.</li>
      <li><strong>Vehicle to Maintenance:</strong> One-to-Many (1 : N). A vehicle undergoes multiple scheduled maintenance events.</li>
    </ul>
  </div>

  <!-- SECTION 8: DATA DICTIONARY -->
  <div class="page-break">
    <h1>8. DATA DICTIONARY</h1>
    <p>
      The data dictionary specifies primary field attributes, types, nullability, and validation constraints for core entities:
    </p>

    <h2>8.1 User Entity (<code>users</code>)</h2>
    <table>
      <thead>
        <tr>
          <th>Field Name</th>
          <th>Data Type</th>
          <th>Req</th>
          <th>Description &amp; Constraints</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>_id</td><td>ObjectId</td><td>Yes</td><td>Primary Key (auto-generated by MongoDB).</td></tr>
        <tr><td>name</td><td>String</td><td>Yes</td><td>User full legal name (min 2, max 60 characters).</td></tr>
        <tr><td>email</td><td>String</td><td>Yes</td><td>Unique lowercase email address with RFC regex validation.</td></tr>
        <tr><td>password</td><td>String</td><td>Yes</td><td>Hashed password via Bcrypt (10 rounds); <code>select: false</code>.</td></tr>
        <tr><td>phone</td><td>String</td><td>No</td><td>Contact phone number string.</td></tr>
        <tr><td>role</td><td>String</td><td>Yes</td><td>Enum: <code>['CUSTOMER', 'VENDOR', 'ADMIN']</code> (default: <code>'CUSTOMER'</code>).</td></tr>
        <tr><td>vendorProfile.businessName</td><td>String</td><td>No</td><td>Registered trade name for commercial vendors.</td></tr>
        <tr><td>vendorProfile.gstNumber</td><td>String</td><td>No</td><td>15-character Goods and Services Tax ID.</td></tr>
        <tr><td>vendorProfile.isApproved</td><td>Boolean</td><td>Yes</td><td>Admin verification status (default: <code>false</code>).</td></tr>
        <tr><td>customerProfile.drivingLicenseNumber</td><td>String</td><td>No</td><td>Driving license ID for customer trip custody.</td></tr>
        <tr><td>customerProfile.kycStatus</td><td>String</td><td>Yes</td><td>Enum: <code>['PENDING', 'VERIFIED', 'REJECTED']</code> (default: <code>'PENDING'</code>).</td></tr>
      </tbody>
    </table>

    <h2>8.2 Vehicle Entity (<code>vehicles</code>)</h2>
    <table>
      <thead>
        <tr>
          <th>Field Name</th>
          <th>Data Type</th>
          <th>Req</th>
          <th>Description &amp; Constraints</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>_id</td><td>ObjectId</td><td>Yes</td><td>Primary Key.</td></tr>
        <tr><td>vendorId</td><td>ObjectId</td><td>Yes</td><td>Foreign Key referencing <code>User._id</code>.</td></tr>
        <tr><td>categoryId</td><td>ObjectId</td><td>Yes</td><td>Foreign Key referencing <code>Category._id</code>.</td></tr>
        <tr><td>brand</td><td>String</td><td>Yes</td><td>Manufacturer name (e.g., 'Royal Enfield', 'Tata').</td></tr>
        <tr><td>model</td><td>String</td><td>Yes</td><td>Model designation (e.g., 'Hunter 350', 'Nexon EV').</td></tr>
        <tr><td>registrationNumber</td><td>String</td><td>Yes</td><td>Unique uppercase license plate number.</td></tr>
        <tr><td>fuelType</td><td>String</td><td>Yes</td><td>Enum: <code>['petrol', 'diesel', 'electric', 'cng', 'hybrid']</code>.</td></tr>
        <tr><td>transmission</td><td>String</td><td>Yes</td><td>Enum: <code>['manual', 'automatic']</code>.</td></tr>
        <tr><td>seatingCapacity</td><td>Number</td><td>Yes</td><td>Passenger capacity (minimum 1).</td></tr>
        <tr><td>location.city</td><td>String</td><td>Yes</td><td>Operating city hub (e.g., 'Indore', 'Bhopal', 'Gwalior').</td></tr>
        <tr><td>pricing.hourlyRate</td><td>Number</td><td>Yes</td><td>Base rate per hour in INR (min ₹10).</td></tr>
        <tr><td>pricing.rate12Hour</td><td>Number</td><td>Yes</td><td>Fixed rate for 12-hour day pack in INR (min ₹50).</td></tr>
        <tr><td>pricing.rate24Hour</td><td>Number</td><td>Yes</td><td>Fixed rate for 24-hour day pack in INR (min ₹100).</td></tr>
        <tr><td>status</td><td>String</td><td>Yes</td><td>Enum: <code>['AVAILABLE', 'RENTED', 'MAINTENANCE', 'INACTIVE']</code>.</td></tr>
        <tr><td>ratingAverage</td><td>Number</td><td>No</td><td>Aggregate rating from 0.0 to 5.0 (default: 0).</td></tr>
      </tbody>
    </table>

    <h2>8.3 Booking Entity (<code>bookings</code>)</h2>
    <table>
      <thead>
        <tr>
          <th>Field Name</th>
          <th>Data Type</th>
          <th>Req</th>
          <th>Description &amp; Constraints</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>_id</td><td>ObjectId</td><td>Yes</td><td>Primary Key.</td></tr>
        <tr><td>bookingNumber</td><td>String</td><td>Yes</td><td>Unique code: <code>RR-YYYYMMDD-XXXXX</code>.</td></tr>
        <tr><td>vehicleId</td><td>ObjectId</td><td>Yes</td><td>Foreign Key referencing <code>Vehicle._id</code>.</td></tr>
        <tr><td>customerId</td><td>ObjectId</td><td>No</td><td>Foreign Key referencing <code>User._id</code> (null for offline walk-ins).</td></tr>
        <tr><td>rentalPlan</td><td>String</td><td>Yes</td><td>Enum: <code>['HOURLY', '12_HOURS', '24_HOURS']</code>.</td></tr>
        <tr><td>startDateTime</td><td>Date</td><td>Yes</td><td>Rental reservation start timestamp.</td></tr>
        <tr><td>endDateTime</td><td>Date</td><td>Yes</td><td>Rental reservation end timestamp.</td></tr>
        <tr><td>durationHours</td><td>Number</td><td>Yes</td><td>Total billable rental hours.</td></tr>
        <tr><td>priceBreakdown.totalAmount</td><td>Number</td><td>Yes</td><td>Total gross payable amount by customer in INR.</td></tr>
        <tr><td>priceBreakdown.vendorPayout</td><td>Number</td><td>Yes</td><td>Net earnings payable to fleet vendor.</td></tr>
        <tr><td>status</td><td>String</td><td>Yes</td><td>Enum: <code>['PENDING_PAYMENT', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'EXPIRED']</code>.</td></tr>
        <tr><td>lockExpiresAt</td><td>Date</td><td>Yes</td><td>Temporary 10-minute reservation lock expiration timestamp.</td></tr>
      </tbody>
    </table>
  </div>

  <!-- SECTION 9: REST API SPECIFICATIONS -->
  <div class="page-break">
    <h1>9. REST API SPECIFICATIONS</h1>
    <p>
      The Express application exposes 14 controller route domains. All endpoints return standardized JSON structures:
    </p>

    <table>
      <thead>
        <tr>
          <th>HTTP Method</th>
          <th>Route Path</th>
          <th>Auth &amp; Role</th>
          <th>Purpose &amp; Payload Description</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>POST</td><td>/api/auth/register</td><td>Public</td><td>Register new customer or vendor user account.</td></tr>
        <tr><td>POST</td><td>/api/auth/login</td><td>Public</td><td>Authenticate credentials; returns JWT and user profile.</td></tr>
        <tr><td>GET</td><td>/api/auth/me</td><td>Protected</td><td>Retrieve current authenticated user session data.</td></tr>
        <tr><td>GET</td><td>/api/vehicles</td><td>Public</td><td>Search fleet with city, category, price, and fuel filters.</td></tr>
        <tr><td>GET</td><td>/api/vehicles/:id</td><td>Public</td><td>Retrieve complete vehicle details and vendor hub information.</td></tr>
        <tr><td>POST</td><td>/api/bookings/check-availability</td><td>Public</td><td>Dry-run interval overlap test and authoritative price quote.</td></tr>
        <tr><td>POST</td><td>/api/bookings/online</td><td>Customer</td><td>Create reservation with status <code>PENDING_PAYMENT</code> (10m lock).</td></tr>
        <tr><td>GET</td><td>/api/bookings/my-bookings</td><td>Customer</td><td>Retrieve customer's historical and active bookings.</td></tr>
        <tr><td>POST</td><td>/api/bookings/:id/cancel</td><td>Protected</td><td>Execute booking cancellation and compute refund amount.</td></tr>
        <tr><td>POST</td><td>/api/payments/create-order</td><td>Customer</td><td>Initialize Razorpay order instance for booking amount.</td></tr>
        <tr><td>POST</td><td>/api/payments/verify</td><td>Customer</td><td>Verify HMAC-SHA256 signature; confirms booking.</td></tr>
        <tr><td>GET</td><td>/api/vendor/dashboard</td><td>Vendor</td><td>Retrieve vendor KPI metrics, active trips, and fleet count.</td></tr>
        <tr><td>POST</td><td>/api/vendor/vehicles</td><td>Vendor</td><td>Create new vehicle listing with Cloudinary image upload.</td></tr>
        <tr><td>POST</td><td>/api/vendor/bookings/offline</td><td>Vendor</td><td>Log walk-in customer booking, blocking marketplace slot.</td></tr>
        <tr><td>POST</td><td>/api/trips/:bookingId/handover</td><td>Vendor</td><td>Execute Start Trip handover with initial odometer reading.</td></tr>
        <tr><td>POST</td><td>/api/trips/:bookingId/return</td><td>Vendor</td><td>Execute Complete Trip return, calculating extra km charges.</td></tr>
        <tr><td>POST</td><td>/api/maintenance</td><td>Vendor</td><td>Schedule maintenance window, blacking out vehicle dates.</td></tr>
        <tr><td>GET</td><td>/api/admin/vehicles/pending</td><td>Admin</td><td>Fetch unmoderated vehicle listings awaiting approval.</td></tr>
        <tr><td>PATCH</td><td>/api/admin/vehicles/:id/status</td><td>Admin</td><td>Approve or reject vendor vehicle listing.</td></tr>
        <tr><td>POST</td><td>/api/fuel-prices/estimate</td><td>Public</td><td>Compute estimated fuel required and cost from distance.</td></tr>
        <tr><td>POST</td><td>/api/ai/recommendations</td><td>Public</td><td>FastAPI proxy for multi-attribute vehicle recommendations.</td></tr>
        <tr><td>GET</td><td>/api/ai/demand-forecast</td><td>Public</td><td>FastAPI proxy for 7-day city hub demand forecasting.</td></tr>
      </tbody>
    </table>
  </div>

  <!-- SECTION 10: SECURITY ARCHITECTURE -->
  <div class="page-break">
    <h1>10. SECURITY REQUIREMENTS &amp; IMPLEMENTATION</h1>
    <p>
      Security is enforced across the presentation, network, application, and data layers:
    </p>

    <h2>10.1 Authentication &amp; Token Architecture</h2>
    <ul>
      <li><strong>JWT Algorithm:</strong> HMAC-SHA256 signing using a 256-bit environment secret (<code>JWT_SECRET</code>). Tokens carry subject <code>id</code> and claim <code>role</code>.</li>
      <li><strong>Token Expiration:</strong> Default 24-hour lifetime, preventing indefinite session exposure.</li>
      <li><strong>HttpOnly Cookie Storage:</strong> Tokens can be transmitted via <code>Authorization: Bearer &lt;token&gt;</code> header or partitioned HttpOnly cookies to mitigate XSS exposure.</li>
    </ul>

    <h2>10.2 Cryptographic Password Protection</h2>
    <p>
      Passwords undergo one-way adaptive salting and hashing via <code>bcryptjs</code> with a work factor of 10. Cleartext passwords are never logged, transmitted in error traces, or stored in database backups.
    </p>

    <h2>10.3 Web Application Firewalls &amp; Middlewares</h2>
    <ul>
      <li><strong>Helmet:</strong> Sets HTTP response headers (<code>X-Content-Type-Options: nosniff</code>, <code>X-Frame-Options: DENY</code>, <code>Strict-Transport-Security</code>).</li>
      <li><strong>CORS:</strong> Whitelists explicit origin origins matching <code>CLIENT_URL</code> with credentials support.</li>
      <li><strong>Rate Limiting:</strong> Enforces <code>express-rate-limit</code> restricting client IPs to 100 requests per 15-minute window.</li>
      <li><strong>Zod Input Sanitization:</strong> Request payloads undergo strict validation against Zod schemas; unexpected fields are automatically stripped.</li>
    </ul>
  </div>

  <!-- SECTION 11: BOOKING & BUSINESS LOGIC -->
  <div class="page-break">
    <h1>11. BOOKING &amp; BUSINESS LOGIC SPECIFICATION</h1>

    <h2>11.1 Mathematical Interval Overlap Collision Prevention</h2>
    <p>
      RentRide enforces deterministic interval mathematics to prevent double-booking. For any candidate booking request with requested interval [Start<sub>req</sub>, End<sub>req</sub>] and existing vehicle interval [Start<sub>exist</sub>, End<sub>exist</sub>], a collision occurs if and only if:
    </p>
    <div class="formula">
      Collision &hArr; (Start<sub>req</sub> &lt; End<sub>exist</sub>) &and; (End<sub>req</sub> &gt; Start<sub>exist</sub>)
    </div>
    <p>
      The database executes this check atomically using compound indexes:
    </p>
    <pre><code>const conflictingBooking = await Booking.findOne({
  vehicleId,
  status: { $in: ['CONFIRMED', 'ACTIVE', 'PENDING_PAYMENT'] },
  startDateTime: { $lt: requestedEnd },
  endDateTime: { $gt: requestedStart },
  $or: [
    { status: { $in: ['CONFIRMED', 'ACTIVE'] } },
    { status: 'PENDING_PAYMENT', lockExpiresAt: { $gt: new Date() } }
  ]
});</code></pre>

    <h2>11.2 10-Minute Temporary Reservation Lock</h2>
    <p>
      When a customer clicks "Reserve Vehicle", the booking is created with status <code>PENDING_PAYMENT</code> and <code>lockExpiresAt = Date.now() + 10m</code>. During these 10 minutes, no other user can book the vehicle. If payment succeeds, status updates to <code>CONFIRMED</code>. If the customer abandons checkout, queries automatically ignore the lock once <code>lockExpiresAt &lt; Date.now()</code>.
    </p>

    <h2>11.3 Booking Lifecycle State Machine</h2>
    <div class="diagram-container">
      ${SVG_BOOKING_LIFECYCLE}
      <div class="figure-caption">Figure 11.1: Booking State Transition Lifecycle Diagram</div>
    </div>

    <h2>11.4 Pricing Formulation</h2>
    <p>
      The server computes transparent pricing breakdowns using exact formulas:
    </p>
    <div class="formula">
      Base Price = HourlyRate &times; DurationHours (or Rate12Hour / Rate24Hour for fixed plans)<br>
      Surge Adjusted = round( Base Price &times; SurgeMultiplier ) [Surge = 1.15 on Fri/Sat/Sun]<br>
      Subtotal = max( 0, Surge Adjusted &minus; CouponDiscount )<br>
      Platform Fee = round( 0.05 &times; Subtotal )<br>
      GST = round( 0.18 &times; Subtotal )<br>
      Total Payable = Subtotal + Platform Fee + GST + Security Deposit<br>
      Vendor Payout = Subtotal &times; (1 &minus; CommissionRate) [Default Commission = 10%]
    </div>
  </div>

  <!-- SECTION 12: AI / ML MICROSERVICE SPECIFICATION -->
  <div class="page-break">
    <h1>12. AI / ML MICROSERVICE DETAILED SPECIFICATION</h1>
    <p>
      The AI subsystem is deployed as an asynchronous Python/FastAPI microservice. It provides three core services:
    </p>

    <h2>12.1 Recommendation Scoring Engine</h2>
    <p>
      Computes multi-attribute match scores between vehicle vectors and customer preference vectors:
    </p>
    <ul>
      <li><strong>Category Match:</strong> +25 points for exact category slug match.</li>
      <li><strong>Budget Compatibility:</strong> +20 points if hourly rate &le; maxBudget; penalty proportional to excess ratio if above.</li>
      <li><strong>Passenger Capacity:</strong> +15 points if seating capacity &ge; requested passengers (&minus;10 if less).</li>
      <li><strong>Engine &amp; Transmission:</strong> +10 points for matching fuel type; +10 points for matching transmission.</li>
      <li><strong>Rating Boost:</strong> Scaled boost: (ratingAverage &minus; 3.0) &times; 6.0.</li>
      <li><strong>Output:</strong> Normalized score bounded between 60% and 99% with human-readable recommendation highlights.</li>
    </ul>

    <h2>12.2 7-Day Demand Forecaster</h2>
    <p>
      Analyzes day-of-week seasonality, city multipliers, and fleet utilization pressure:
    </p>
    <table>
      <thead>
        <tr>
          <th>Day of Week</th>
          <th>Day Factor</th>
          <th>Operational Interpretation</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Monday</td><td>0.85</td><td>Post-weekend drop in leisure demand.</td></tr>
        <tr><td>Tuesday</td><td>0.80</td><td>Lowest weekly demand trough (Value Saver discount day).</td></tr>
        <tr><td>Wednesday</td><td>0.90</td><td>Mid-week baseline commuter demand.</td></tr>
        <tr><td>Thursday</td><td>1.05</td><td>Pre-weekend booking inquiries begin.</td></tr>
        <tr><td>Friday</td><td>1.45</td><td>Significant surge in weekend trip departures.</td></tr>
        <tr><td>Saturday</td><td>1.60</td><td>Peak weekly demand period across all hubs.</td></tr>
        <tr><td>Sunday</td><td>1.35</td><td>Sustained weekend leisure and return rentals.</td></tr>
      </tbody>
    </table>

    <h2>12.3 Dynamic Pricing Engine</h2>
    <p>
      Computes dynamic rate multipliers bounded between 0.90x and 1.35x:
    </p>
    <div class="formula">
      Dynamic Multiplier = clamp( 0.90, 1.35, BaseMultiplier + DayDelta + ScarcityDelta + CityDelta )
    </div>
    <ul>
      <li>Saturday: +0.15 | Friday/Sunday: +0.10 | Tuesday/Wednesday: &minus;0.05</li>
      <li>Fleet Utilization &ge; 80%: +0.15 | &ge; 65%: +0.08 | &lt; 35%: &minus;0.05</li>
      <li>City Multipliers: Indore (+0.05), Bhopal (+0.03), Gwalior (+0.02)</li>
    </ul>
  </div>

  <!-- SECTION 13: UI / UX SPECIFICATIONS -->
  <div class="page-break">
    <h1>13. USER INTERFACE SPECIFICATIONS</h1>
    <p>
      RentRide implements a design system with dedicated user layouts:
    </p>
    <ul>
      <li><strong>Customer Storefront:</strong> Minimalist city selector, multi-parameter filter drawer, grid/card vehicle listings with ARAI mileage tags, sticky <code>FareCalculator</code> drawer on details view, and checkout modal.</li>
      <li><strong>Vendor Operations Portal:</strong> Collapsible sidebar navigation, live fleet inventory table, walk-in offline booking modal, and trip custody action buttons (<code>Start Trip</code>, <code>Complete Trip</code>).</li>
      <li><strong>Admin Governance Dashboard:</strong> Tabbed management shell for vehicle listing approvals, coupon creation, user account moderation, and global financial audit metrics.</li>
      <li><strong>Design System Tokens:</strong> Primary Brand Indigo (<code>#4f46e5</code>), Emerald Accent (<code>#10b981</code>), Amber Warnings (<code>#f59e0b</code>), Slate Dark Mode (<code>#0f172a</code>), Typography in Outfit (headings) and Inter (body).</li>
    </ul>
  </div>

  <!-- SECTION 14: ERROR HANDLING & EXCEPTION MATRIX -->
  <div>
    <h1>14. ERROR HANDLING &amp; EXCEPTION MATRIX</h1>
    <table>
      <thead>
        <tr>
          <th>Error Condition</th>
          <th>HTTP Code</th>
          <th>System Response &amp; Client Mitigation</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Validation Error</td><td>400 Bad Request</td><td>Zod returns formatted array of field errors (<code>{ field, message }</code>).</td></tr>
        <tr><td>Authentication Missing</td><td>401 Unauthorized</td><td>Client redirects to <code>/login</code> with return URL query param.</td></tr>
        <tr><td>Forbidden Role Action</td><td>403 Forbidden</td><td>User role lacks required permissions; access denied banner shown.</td></tr>
        <tr><td>Vehicle Slot Collision</td><td>409 Conflict</td><td>Availability conflict returned; suggestions for alternate slots shown.</td></tr>
        <tr><td>Resource Not Found</td><td>404 Not Found</td><td>Returns descriptive missing entity message.</td></tr>
        <tr><td>Rate Limit Exceeded</td><td>429 Too Many Req</td><td>Express-rate-limit blocks traffic; retry-after header sent.</td></tr>
        <tr><td>Internal Server Error</td><td>500 Server Error</td><td>Error logged via Winston/console; sanitized client message returned.</td></tr>
      </tbody>
    </table>
  </div>

  <!-- SECTION 15: TESTING REQUIREMENTS -->
  <div class="page-break">
    <h1>15. TESTING REQUIREMENTS &amp; VERIFICATION SUITE</h1>
    <p>
      The platform enforces comprehensive testing protocols across critical operational paths:
    </p>
    <ul>
      <li><strong>Booking Duration Flow Verification (<code>testBookingDurationFlow.js</code>):</strong> 20 automated tests validating:
        <ul>
          <li>Hourly plan: 1h, 2h, 6h, 12h, 24h accepted; 0h, negative, decimal (2.5h), and &gt;24h strictly rejected.</li>
          <li>12-Hour plan: exactly 12 hours accepted; non-12h rejected.</li>
          <li>24-Hour plan: exactly 24 hours accepted; non-24h rejected.</li>
          <li>Pricing service zero-trust validation: verifies base price calculations across all plans.</li>
        </ul>
      </li>
      <li><strong>Fuel Cost Dynamic Calculator Verification (<code>testFuelCostCalculation.js</code>):</strong> 13 automated tests verifying:
        <ul>
          <li>Test 1: Distance 150 km, Mileage 45 km/l, Price ₹100/l &rarr; 3.33 L, ₹333.</li>
          <li>Test 2: Distance 50 km &rarr; 1.11 L, ₹111.</li>
          <li>Test 3: Distance 100 km &rarr; 2.22 L, ₹222.</li>
          <li>Test 4: Distance 0 km &rarr; 0 L, ₹0 (no NaN/Infinity).</li>
          <li>Test 5: Empty distance &rarr; status <code>EMPTY</code> with helper message.</li>
          <li>Test 6–7: Negative and string inputs rejected.</li>
          <li>Test 8–11: Multi-vehicle comparisons, Diesel (L), CNG (kg), EV (kWh), and backend parity.</li>
        </ul>
      </li>
      <li><strong>Dynamic Pricing Engine Verification (<code>test_pricing.py</code>):</strong> 24 automated tests in Python verifying deterministic bounds [0.90x, 1.35x], day deltas, and scarcity multipliers.</li>
    </ul>
  </div>

  <!-- SECTION 16: DEPLOYMENT & INFRASTRUCTURE -->
  <div>
    <h1>16. DEPLOYMENT &amp; INFRASTRUCTURE</h1>
    <p>
      RentRide is engineered for flexible deployment across local development and production environments:
    </p>
    <ul>
      <li><strong>Local Development Topology:</strong> Vite HMR frontend (Port 5173), Express API (Port 5000), FastAPI AI service (Port 8000), with MongoDB Atlas or local <code>mongodb-memory-server</code> fallback.</li>
      <li><strong>Production Cloud Topology:</strong> React SPA served via Cloudflare CDN / Vercel; Express backend containerized on AWS ECS / Render; FastAPI microservice deployed on container instances; MongoDB Atlas dedicated M10 cluster with automated daily snapshots; Cloudinary CDN media delivery.</li>
    </ul>
  </div>

  <!-- SECTION 17: SYSTEM LIMITATIONS -->
  <div class="page-break">
    <h1>17. SYSTEM LIMITATIONS &amp; KNOWN CONSTRAINTS</h1>
    <p>
      In accordance with academic rigor, current system limitations are explicitly documented:
    </p>
    <ol>
      <li><strong>Automated Razorpay Refund API Trigger:</strong> While cancellation fees and refund amounts are computed and saved in <code>cancellationDetails</code>, live API dispatch to <code>razorpay.payments.refund()</code> is not yet executed automatically.</li>
      <li><strong>Customer KYC Verification UI:</strong> Driving license fields are stored and displayed, but admin verification action buttons currently operate as a status viewer.</li>
      <li><strong>Email and SMS Dispatch:</strong> Transactional vouchers are generated in-app; SMTP (Nodemailer) and SMS gateway (Twilio) dispatch are not configured in the active build.</li>
      <li><strong>Interactive Map UI:</strong> Geographic coordinates (<code>{ lat, lng }</code>) are stored for pickup hubs, but interactive Leaflet map pins are not yet mounted on the Explore page.</li>
      <li><strong>Expired Lock Cron Worker:</strong> Expired locks are excluded in availability queries, but background cron worker to transition status from <code>PENDING_PAYMENT</code> to <code>EXPIRED</code> is pending implementation.</li>
    </ol>
  </div>

  <!-- SECTION 18: ROADMAP & FUTURE SCOPE -->
  <div>
    <h1>18. DEVELOPMENT ROADMAP &amp; FUTURE SCOPE</h1>
    <ul>
      <li><strong>Phase 1 (Operational Hardening):</strong> Live Razorpay refund dispatch, background TTL lock sweeper, admin KYC approval buttons.</li>
      <li><strong>Phase 2 (Communications &amp; Maps):</strong> Email/SMS voucher dispatch with QR codes, interactive Leaflet/Google Maps on Explore view, vendor payout settlement ledger.</li>
      <li><strong>Phase 3 (Telematics &amp; AI Retraining):</strong> Live OBD-II and GPS telematics ingestion for speed and EV battery tracking; automated weekly retraining for demand models.</li>
      <li><strong>Phase 4 (Enterprise Caching):</strong> Redis caching layer with 5-minute TTL for public vehicle catalog queries.</li>
      <li><strong>Phase 5 (Containerization):</strong> Multi-stage Docker containerization with <code>docker-compose.yml</code> and Cloudflare edge ingress.</li>
    </ul>
  </div>

  <!-- SECTION 19: CONCLUSION & SIGNOFF -->
  <div class="page-break">
    <h1>19. CONCLUSION &amp; SIGNOFF</h1>
    <p>
      This Software Requirements Specification establishes the complete, authoritative engineering baseline for the <strong>RentRide Multi-Vendor Vehicle Rental Marketplace</strong>. By defining rigorous functional requirements, mathematical collision checks, tiered rental plans, robust security constraints, and predictive machine learning models, this specification serves as the blueprint for development, verification, and academic submission.
    </p>

    <div style="margin-top: 50pt;">
      <table style="border: none;">
        <tr style="background: none;">
          <td style="border: none; width: 50%;">
            <p><strong>Prepared By:</strong></p>
            <p style="margin-top: 35pt;">__________________________________</p>
            <p>Student Candidate (B.Tech CSE)</p>
          </td>
          <td style="border: none; width: 50%; text-align: right;">
            <p><strong>Approved By:</strong></p>
            <p style="margin-top: 35pt;">__________________________________</p>
            <p>Project Guide / Academic Supervisor</p>
          </td>
        </tr>
      </table>
    </div>
  </div>

</body>
</html>
`;
}
