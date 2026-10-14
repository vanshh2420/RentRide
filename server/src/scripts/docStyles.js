// docStyles.js - Shared Academic CSS, Formatting and Embedded SVG Diagrams
// Designed for A4 University Project Submission standards

export const ACADEMIC_CSS = `
@page {
  size: A4 portrait;
  margin: 20mm 15mm 20mm 15mm;
  @bottom-right {
    content: counter(page);
    font-size: 9pt;
    font-family: 'Times New Roman', Times, serif;
  }
}

@page:first {
  margin: 0;
  @bottom-right {
    content: none;
  }
}

* {
  box-sizing: border-box;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

body {
  font-family: 'Times New Roman', Times, Georgia, serif;
  font-size: 11pt;
  line-height: 1.5;
  color: #111111;
  background-color: #ffffff;
  margin: 0;
  padding: 0;
}

/* Headings */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Times New Roman', Times, serif;
  color: #0b1e36;
  font-weight: bold;
  page-break-after: avoid;
  break-after: avoid;
}

h1 {
  font-size: 18pt;
  margin-top: 24pt;
  margin-bottom: 12pt;
  border-bottom: 2pt solid #0b1e36;
  padding-bottom: 4pt;
  text-transform: uppercase;
  letter-spacing: 0.5pt;
}

h2 {
  font-size: 14pt;
  margin-top: 18pt;
  margin-bottom: 8pt;
  border-bottom: 1pt solid #c0c6cf;
  padding-bottom: 3pt;
}

h3 {
  font-size: 12pt;
  margin-top: 14pt;
  margin-bottom: 6pt;
}

h4 {
  font-size: 11pt;
  font-style: italic;
  margin-top: 10pt;
  margin-bottom: 4pt;
}

p {
  margin-top: 0;
  margin-bottom: 8pt;
  text-align: justify;
  text-justify: inter-word;
}

ul, ol {
  margin-top: 0;
  margin-bottom: 8pt;
  padding-left: 20pt;
}

li {
  margin-bottom: 4pt;
  text-align: justify;
}

/* Page Breaks */
.page-break {
  page-break-before: always;
  break-before: page;
}

.no-break {
  page-break-inside: avoid;
  break-inside: avoid;
}

/* Academic Tables */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8pt;
  margin-bottom: 14pt;
  font-size: 9.5pt;
  page-break-inside: auto;
}

tr {
  page-break-inside: avoid;
  page-break-after: auto;
}

thead {
  display: table-header-group;
}

th, td {
  border: 1pt solid #2c3e50;
  padding: 5pt 7pt;
  text-align: left;
  vertical-align: top;
}

th {
  background-color: #0b1e36 !important;
  color: #ffffff !important;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 8.5pt;
  letter-spacing: 0.3pt;
}

tbody tr:nth-child(even) {
  background-color: #f7f9fb !important;
}

.table-caption {
  font-size: 9.5pt;
  font-weight: bold;
  margin-bottom: 4pt;
  color: #0b1e36;
  text-align: left;
}

/* Callouts / Highlights */
.callout {
  border-left: 3.5pt solid #0b1e36;
  background-color: #f4f6f9;
  padding: 8pt 12pt;
  margin-top: 8pt;
  margin-bottom: 10pt;
  font-size: 10pt;
  page-break-inside: avoid;
}

.callout-title {
  font-weight: bold;
  color: #0b1e36;
  margin-bottom: 3pt;
}

/* Code & Formulas */
code, pre {
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 9pt;
  background-color: #f4f4f4;
}

pre {
  padding: 8pt;
  border: 1pt solid #ddd;
  border-radius: 3pt;
  overflow-x: auto;
  page-break-inside: avoid;
  margin-bottom: 10pt;
}

.formula {
  background-color: #f9fbfd;
  border: 1pt solid #d0d7de;
  padding: 8pt 14pt;
  margin: 8pt 0 12pt 0;
  font-family: 'Times New Roman', serif;
  font-style: italic;
  font-size: 11pt;
  text-align: center;
  border-radius: 3pt;
  page-break-inside: avoid;
}

/* Diagrams container */
.diagram-container {
  text-align: center;
  margin: 14pt 0;
  page-break-inside: avoid;
  break-inside: avoid;
}

.diagram-container svg {
  max-width: 100%;
  height: auto;
  border: 1pt solid #cbd5e1;
  background-color: #ffffff;
  border-radius: 4pt;
  box-shadow: 0 1pt 3pt rgba(0,0,0,0.05);
}

.figure-caption {
  font-size: 9.5pt;
  font-weight: bold;
  margin-top: 6pt;
  color: #0b1e36;
  text-align: center;
}

/* Cover Page */
.cover-page {
  padding: 35mm 25mm 25mm 25mm;
  height: 297mm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  border: 4pt double #0b1e36;
  margin: 15mm;
  page-break-after: always;
  break-after: page;
}

.cover-header {
  margin-top: 10mm;
}

.cover-univ-title {
  font-size: 15pt;
  font-weight: bold;
  color: #0b1e36;
  text-transform: uppercase;
  letter-spacing: 1pt;
  margin-bottom: 6pt;
}

.cover-dept {
  font-size: 12pt;
  color: #333333;
  margin-bottom: 20pt;
}

.cover-doc-type {
  font-size: 15pt;
  font-weight: bold;
  color: #b33927;
  text-transform: uppercase;
  letter-spacing: 2pt;
  margin: 18pt 0 8pt 0;
  border-top: 1.5pt solid #0b1e36;
  border-bottom: 1.5pt solid #0b1e36;
  padding: 6pt 0;
  display: inline-block;
  width: 80%;
}

.cover-title {
  font-size: 22pt;
  font-weight: bold;
  color: #0b1e36;
  line-height: 1.25;
  margin: 18pt 0 10pt 0;
}

.cover-subtitle {
  font-size: 12.5pt;
  color: #444444;
  font-style: italic;
  margin-bottom: 20pt;
}

.cover-middle {
  margin: 25pt 0;
  font-size: 11pt;
}

.cover-metadata {
  display: flex;
  justify-content: space-between;
  text-align: left;
  margin-top: 30pt;
  border-top: 1pt solid #999;
  padding-top: 15pt;
  font-size: 10.5pt;
}

.cover-meta-col {
  width: 48%;
}

.cover-footer {
  margin-top: 15pt;
  font-size: 11pt;
  font-weight: bold;
  color: #0b1e36;
}

/* Table of Contents */
.toc-entry {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5pt;
  font-size: 10.5pt;
}

.toc-entry.h1 {
  font-weight: bold;
  margin-top: 8pt;
  border-bottom: 1pt dotted #ccc;
  padding-bottom: 2pt;
}

.toc-entry.h2 {
  padding-left: 15pt;
  color: #333;
}

.toc-entry.h3 {
  padding-left: 30pt;
  color: #555;
  font-size: 9.5pt;
}

.toc-dots {
  flex-grow: 1;
  border-bottom: 1pt dotted #888;
  margin: 0 6pt 3pt 6pt;
}
`;

// Vector SVG Diagrams for publication-grade PDF rendering
export const SVG_SYSTEM_ARCHITECTURE = `
<svg width="720" height="420" viewBox="0 0 720 420" xmlns="http://www.w3.org/2000/svg" font-family="'Times New Roman', serif">
  <!-- Background -->
  <rect width="720" height="420" fill="#f8fafc" rx="8" />

  <!-- Layer 1: Client Layer -->
  <rect x="20" y="20" width="680" height="75" fill="#ffffff" stroke="#0284c7" stroke-width="2" rx="6" />
  <rect x="30" y="28" width="160" height="20" fill="#0284c7" rx="3" />
  <text x="35" y="42" fill="#ffffff" font-size="11" font-weight="bold">PRESENTATION TIER (CLIENT)</text>
  
  <rect x="40" y="54" width="180" height="32" fill="#e0f2fe" stroke="#38bdf8" rx="4" />
  <text x="50" y="74" fill="#0369a1" font-size="11" font-weight="bold">Customer Storefront SPA</text>
  
  <rect x="240" y="54" width="190" height="32" fill="#e0f2fe" stroke="#38bdf8" rx="4" />
  <text x="250" y="74" fill="#0369a1" font-size="11" font-weight="bold">Vendor Operations Portal</text>
  
  <rect x="450" y="54" width="230" height="32" fill="#e0f2fe" stroke="#38bdf8" rx="4" />
  <text x="460" y="74" fill="#0369a1" font-size="11" font-weight="bold">Admin Governance Dashboard</text>

  <!-- Flow Arrow: Client to Backend -->
  <line x1="360" y1="95" x2="360" y2="125" stroke="#0f172a" stroke-width="2" marker-end="url(#arrow)" />
  <text x="370" y="115" fill="#475569" font-size="10" font-style="italic">HTTPS / RESTful JSON / JWT Headers</text>

  <!-- Layer 2: Backend Application Tier -->
  <rect x="20" y="130" width="680" height="135" fill="#ffffff" stroke="#0f766e" stroke-width="2" rx="6" />
  <rect x="30" y="138" width="220" height="20" fill="#0f766e" rx="3" />
  <text x="35" y="152" fill="#ffffff" font-size="11" font-weight="bold">APPLICATION TIER (EXPRESS CORE)</text>

  <!-- Route / Middlewares Box -->
  <rect x="40" y="166" width="190" height="85" fill="#f0fdf4" stroke="#86efac" rx="4" />
  <text x="50" y="184" fill="#166534" font-size="11" font-weight="bold">Security & Validation Gateway</text>
  <text x="50" y="200" fill="#334155" font-size="10">• JWT Protect & Role Guards</text>
  <text x="50" y="215" fill="#334155" font-size="10">• Helmet, CORS, Rate Limiter</text>
  <text x="50" y="230" fill="#334155" font-size="10">• Zod Request Validation</text>

  <!-- Controllers & Services Box -->
  <rect x="250" y="166" width="230" height="85" fill="#f0fdf4" stroke="#86efac" rx="4" />
  <text x="260" y="184" fill="#166534" font-size="11" font-weight="bold">Domain Controllers & Services</text>
  <text x="260" y="200" fill="#334155" font-size="10">• Collision & Overlap Engine</text>
  <text x="260" y="215" fill="#334155" font-size="10">• Multi-Tier Pricing & Surge</text>
  <text x="260" y="230" fill="#334155" font-size="10">• Booking & Handover Workflows</text>

  <!-- Mongoose ODM Box -->
  <rect x="500" y="166" width="180" height="85" fill="#f0fdf4" stroke="#86efac" rx="4" />
  <text x="510" y="184" fill="#166534" font-size="11" font-weight="bold">Mongoose ODM 8.10</text>
  <text x="510" y="200" fill="#334155" font-size="10">• Document Schemas & Enums</text>
  <text x="510" y="215" fill="#334155" font-size="10">• Compound Query Indexes</text>
  <text x="510" y="230" fill="#334155" font-size="10">• Rating Hooks & Timestamps</text>

  <!-- Flow Arrows: Down to Data & Right to External -->
  <line x1="200" y1="265" x2="200" y2="295" stroke="#0f172a" stroke-width="2" marker-end="url(#arrow)" />
  <line x1="580" y1="265" x2="580" y2="295" stroke="#0f172a" stroke-width="2" marker-end="url(#arrow)" />

  <!-- Layer 3: Data Tier & Microservices -->
  <!-- MongoDB -->
  <rect x="20" y="300" width="210" height="100" fill="#ffffff" stroke="#16a34a" stroke-width="2" rx="6" />
  <rect x="30" y="308" width="190" height="20" fill="#16a34a" rx="3" />
  <text x="35" y="322" fill="#ffffff" font-size="11" font-weight="bold">DATA TIER (MONGODB)</text>
  <text x="35" y="348" fill="#1e293b" font-size="10.5">• MongoDB Atlas / In-Memory</text>
  <text x="35" y="365" fill="#1e293b" font-size="10.5">• 10 Relational Document Models</text>
  <text x="35" y="382" fill="#1e293b" font-size="10.5">• Atomic Multi-Index Queries</text>

  <!-- AI Microservice -->
  <rect x="250" y="300" width="230" height="100" fill="#ffffff" stroke="#7c3aed" stroke-width="2" rx="6" />
  <rect x="260" y="308" width="210" height="20" fill="#7c3aed" rx="3" />
  <text x="265" y="322" fill="#ffffff" font-size="11" font-weight="bold">AI SERVICE (FASTAPI :8000)</text>
  <text x="265" y="348" fill="#1e293b" font-size="10.5">• Cosine Similarity Recommendations</text>
  <text x="265" y="365" fill="#1e293b" font-size="10.5">• 7-Day Time Series Demand Forecast</text>
  <text x="265" y="382" fill="#1e293b" font-size="10.5">• Dynamic Pricing Elasticity (0.90x-1.35x)</text>

  <!-- External Gateways -->
  <rect x="500" y="300" width="200" height="100" fill="#ffffff" stroke="#ea580c" stroke-width="2" rx="6" />
  <rect x="510" y="308" width="180" height="20" fill="#ea580c" rx="3" />
  <text x="515" y="322" fill="#ffffff" font-size="11" font-weight="bold">EXTERNAL SERVICES</text>
  <text x="515" y="348" fill="#1e293b" font-size="10.5">• Razorpay Payment Gateway</text>
  <text x="515" y="365" fill="#1e293b" font-size="10.5">• HMAC-SHA256 Webhook Auth</text>
  <text x="515" y="382" fill="#1e293b" font-size="10.5">• Cloudinary Asset Management</text>

  <!-- Connect Backend to AI -->
  <line x1="365" y1="251" x2="365" y2="295" stroke="#7c3aed" stroke-width="2" stroke-dasharray="4" marker-end="url(#arrow)" />

  <!-- Arrow Marker Definition -->
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#0f172a" />
    </marker>
  </defs>
</svg>
`;

export const SVG_BOOKING_LIFECYCLE = `
<svg width="720" height="260" viewBox="0 0 720 260" xmlns="http://www.w3.org/2000/svg" font-family="'Times New Roman', serif">
  <!-- Background -->
  <rect width="720" height="260" fill="#f8fafc" rx="6" />

  <!-- State 1: PENDING_PAYMENT -->
  <rect x="30" y="70" width="130" height="50" fill="#fef3c7" stroke="#d97706" stroke-width="2" rx="6" />
  <text x="45" y="92" fill="#92400e" font-size="10" font-weight="bold">PENDING_PAYMENT</text>
  <text x="48" y="108" fill="#b45309" font-size="9">(10-Min Temporary Lock)</text>

  <!-- Arrow 1 to 2 -->
  <line x1="160" y1="95" x2="205" y2="95" stroke="#1e293b" stroke-width="2" marker-end="url(#bk-arrow)" />
  <text x="165" y="85" fill="#475569" font-size="8">Payment OK</text>

  <!-- State 2: CONFIRMED -->
  <rect x="210" y="70" width="115" height="50" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" rx="6" />
  <text x="232" y="92" fill="#0369a1" font-size="10.5" font-weight="bold">CONFIRMED</text>
  <text x="225" y="108" fill="#0284c7" font-size="9">(Slot Locked Securely)</text>

  <!-- Arrow 2 to 3 -->
  <line x1="325" y1="95" x2="370" y2="95" stroke="#1e293b" stroke-width="2" marker-end="url(#bk-arrow)" />
  <text x="330" y="85" fill="#475569" font-size="8">Handover</text>

  <!-- State 3: ACTIVE -->
  <rect x="375" y="70" width="115" height="50" fill="#dcfce7" stroke="#16a34a" stroke-width="2" rx="6" />
  <text x="408" y="92" fill="#15803d" font-size="11" font-weight="bold">ACTIVE</text>
  <text x="390" y="108" fill="#16a34a" font-size="9">(Odometer Logged)</text>

  <!-- Arrow 3 to 4 -->
  <line x1="490" y1="95" x2="535" y2="95" stroke="#1e293b" stroke-width="2" marker-end="url(#bk-arrow)" />
  <text x="495" y="85" fill="#475569" font-size="8">Complete</text>

  <!-- State 4: COMPLETED -->
  <rect x="540" y="70" width="130" height="50" fill="#f1f5f9" stroke="#475569" stroke-width="2" rx="6" />
  <text x="565" y="92" fill="#334155" font-size="11" font-weight="bold">COMPLETED</text>
  <text x="555" y="108" fill="#64748b" font-size="9">(Review & Deposit Return)</text>

  <!-- Branch Down 1: EXPIRED -->
  <line x1="95" y1="120" x2="95" y2="175" stroke="#dc2626" stroke-width="2" marker-end="url(#bk-red-arrow)" />
  <rect x="40" y="180" width="110" height="42" fill="#fee2e2" stroke="#dc2626" stroke-width="1.5" rx="5" />
  <text x="65" y="198" fill="#991b1b" font-size="10" font-weight="bold">EXPIRED</text>
  <text x="50" y="212" fill="#b91c1c" font-size="8.5">(10m Lock Timed Out)</text>

  <!-- Branch Down 2: CANCELLED -->
  <line x1="267" y1="120" x2="267" y2="175" stroke="#dc2626" stroke-width="2" marker-end="url(#bk-red-arrow)" />
  <rect x="210" y="180" width="115" height="42" fill="#fee2e2" stroke="#dc2626" stroke-width="1.5" rx="5" />
  <text x="230" y="198" fill="#991b1b" font-size="10" font-weight="bold">CANCELLED</text>
  <text x="218" y="212" fill="#b91c1c" font-size="8.5">(Refund Audit Stored)</text>

  <!-- Arrow Marker Definition -->
  <defs>
    <marker id="bk-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#1e293b" />
    </marker>
    <marker id="bk-red-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#dc2626" />
    </marker>
  </defs>
</svg>
`;

export const SVG_ER_DIAGRAM = `
<svg width="720" height="380" viewBox="0 0 720 380" xmlns="http://www.w3.org/2000/svg" font-family="'Times New Roman', serif">
  <!-- Background -->
  <rect width="720" height="380" fill="#f8fafc" rx="8" />

  <!-- Entity 1: User -->
  <rect x="30" y="30" width="150" height="110" fill="#ffffff" stroke="#1e3a8a" stroke-width="2" rx="4" />
  <rect x="30" y="30" width="150" height="22" fill="#1e3a8a" />
  <text x="80" y="45" fill="#ffffff" font-size="11" font-weight="bold">USER</text>
  <text x="38" y="66" fill="#1e293b" font-size="9.5">PK  _id</text>
  <text x="38" y="80" fill="#1e293b" font-size="9.5">    name, email</text>
  <text x="38" y="94" fill="#1e293b" font-size="9.5">    role (C/V/A)</text>
  <text x="38" y="108" fill="#1e293b" font-size="9.5">    vendorProfile</text>
  <text x="38" y="122" fill="#1e293b" font-size="9.5">    customerProfile</text>

  <!-- Entity 2: Vehicle -->
  <rect x="280" y="30" width="160" height="120" fill="#ffffff" stroke="#047857" stroke-width="2" rx="4" />
  <rect x="280" y="30" width="160" height="22" fill="#047857" />
  <text x="335" y="45" fill="#ffffff" font-size="11" font-weight="bold">VEHICLE</text>
  <text x="288" y="66" fill="#1e293b" font-size="9.5">PK  _id</text>
  <text x="288" y="80" fill="#1e293b" font-size="9.5">FK  vendorId -> USER</text>
  <text x="288" y="94" fill="#1e293b" font-size="9.5">FK  categoryId -> CATEGORY</text>
  <text x="288" y="108" fill="#1e293b" font-size="9.5">    brand, model, regNo</text>
  <text x="288" y="122" fill="#1e293b" font-size="9.5">    pricing (H/12H/24H)</text>
  <text x="288" y="136" fill="#1e293b" font-size="9.5">    location, status</text>

  <!-- Entity 3: Category -->
  <rect x="530" y="30" width="160" height="90" fill="#ffffff" stroke="#b45309" stroke-width="2" rx="4" />
  <rect x="530" y="30" width="160" height="22" fill="#b45309" />
  <text x="575" y="45" fill="#ffffff" font-size="11" font-weight="bold">CATEGORY</text>
  <text x="538" y="66" fill="#1e293b" font-size="9.5">PK  _id</text>
  <text x="538" y="80" fill="#1e293b" font-size="9.5">    name, slug</text>
  <text x="538" y="94" fill="#1e293b" font-size="9.5">    type (two/four_wheeler)</text>
  <text x="538" y="108" fill="#1e293b" font-size="9.5">    isActive</text>

  <!-- Entity 4: Booking -->
  <rect x="280" y="210" width="160" height="145" fill="#ffffff" stroke="#6d28d9" stroke-width="2" rx="4" />
  <rect x="280" y="210" width="160" height="22" fill="#6d28d9" />
  <text x="335" y="225" fill="#ffffff" font-size="11" font-weight="bold">BOOKING</text>
  <text x="288" y="246" fill="#1e293b" font-size="9.5">PK  _id</text>
  <text x="288" y="260" fill="#1e293b" font-size="9.5">FK  vehicleId -> VEHICLE</text>
  <text x="288" y="274" fill="#1e293b" font-size="9.5">FK  customerId -> USER</text>
  <text x="288" y="288" fill="#1e293b" font-size="9.5">FK  vendorId -> USER</text>
  <text x="288" y="302" fill="#1e293b" font-size="9.5">    startDateTime, endDateTime</text>
  <text x="288" y="316" fill="#1e293b" font-size="9.5">    rentalPlan, priceBreakdown</text>
  <text x="288" y="330" fill="#1e293b" font-size="9.5">    status, lockExpiresAt</text>
  <text x="288" y="344" fill="#1e293b" font-size="9.5">    bookingType (ONLINE/OFFLINE)</text>

  <!-- Entity 5: Payment -->
  <rect x="30" y="220" width="150" height="110" fill="#ffffff" stroke="#0e7490" stroke-width="2" rx="4" />
  <rect x="30" y="220" width="150" height="22" fill="#0e7490" />
  <text x="75" y="235" fill="#ffffff" font-size="11" font-weight="bold">PAYMENT</text>
  <text x="38" y="256" fill="#1e293b" font-size="9.5">PK  _id</text>
  <text x="38" y="270" fill="#1e293b" font-size="9.5">FK  bookingId -> BOOKING</text>
  <text x="38" y="284" fill="#1e293b" font-size="9.5">    razorpayOrderId</text>
  <text x="38" y="298" fill="#1e293b" font-size="9.5">    razorpayPaymentId</text>
  <text x="38" y="312" fill="#1e293b" font-size="9.5">    amount, status</text>

  <!-- Entity 6: Review & Maintenance -->
  <rect x="530" y="180" width="160" height="85" fill="#ffffff" stroke="#be123c" stroke-width="2" rx="4" />
  <rect x="530" y="180" width="160" height="22" fill="#be123c" />
  <text x="585" y="195" fill="#ffffff" font-size="11" font-weight="bold">REVIEW</text>
  <text x="538" y="216" fill="#1e293b" font-size="9.5">PK  _id</text>
  <text x="538" y="230" fill="#1e293b" font-size="9.5">FK  bookingId, vehicleId</text>
  <text x="538" y="244" fill="#1e293b" font-size="9.5">    rating (1-5), comment</text>

  <rect x="530" y="280" width="160" height="85" fill="#ffffff" stroke="#475569" stroke-width="2" rx="4" />
  <rect x="530" y="280" width="160" height="22" fill="#475569" />
  <text x="560" y="295" fill="#ffffff" font-size="11" font-weight="bold">MAINTENANCE</text>
  <text x="538" y="316" fill="#1e293b" font-size="9.5">PK  _id, FK vehicleId</text>
  <text x="538" y="330" fill="#1e293b" font-size="9.5">    startDate, endDate</text>
  <text x="538" y="344" fill="#1e293b" font-size="9.5">    maintenanceType, status</text>

  <!-- Relationships Lines -->
  <!-- User to Vehicle -->
  <line x1="180" y1="80" x2="280" y2="80" stroke="#334155" stroke-width="1.5" />
  <text x="205" y="74" fill="#475569" font-size="8.5">1 : N (Vendor)</text>

  <!-- Category to Vehicle -->
  <line x1="530" y1="75" x2="440" y2="75" stroke="#334155" stroke-width="1.5" />
  <text x="460" y="69" fill="#475569" font-size="8.5">1 : N (Classifies)</text>

  <!-- Vehicle to Booking -->
  <line x1="360" y1="150" x2="360" y2="210" stroke="#334155" stroke-width="1.5" />
  <text x="365" y="185" fill="#475569" font-size="8.5">1 : N (Rented)</text>

  <!-- Booking to Payment -->
  <line x1="280" y1="270" x2="180" y2="270" stroke="#334155" stroke-width="1.5" />
  <text x="200" y="264" fill="#475569" font-size="8.5">1 : 1 (Settled)</text>

  <!-- Booking to Review -->
  <line x1="440" y1="240" x2="530" y2="225" stroke="#334155" stroke-width="1.5" />
  <text x="455" y="228" fill="#475569" font-size="8.5">1 : 1 (Generates)</text>

  <!-- Vehicle to Maintenance -->
  <line x1="440" y1="130" x2="530" y2="295" stroke="#334155" stroke-width="1.5" stroke-dasharray="3" />
  <text x="465" y="200" fill="#475569" font-size="8.5">1 : N (Blocks)</text>
</svg>
`;

export const SVG_USE_CASE_DIAGRAM = `
<svg width="720" height="420" viewBox="0 0 720 420" xmlns="http://www.w3.org/2000/svg" font-family="'Times New Roman', serif">
  <!-- Background -->
  <rect width="720" height="420" fill="#f8fafc" rx="8" />

  <!-- Boundary System Box -->
  <rect x="160" y="15" width="400" height="390" fill="#ffffff" stroke="#0f172a" stroke-width="2" rx="8" />
  <text x="280" y="35" fill="#0f172a" font-size="12" font-weight="bold">RentRide Marketplace System</text>

  <!-- Actor 1: Customer (Left Top) -->
  <circle cx="70" cy="90" r="14" fill="#dbeafe" stroke="#1d4ed8" stroke-width="2" />
  <line x1="70" y1="104" x2="70" y2="135" stroke="#1d4ed8" stroke-width="2" />
  <line x1="50" y1="115" x2="90" y2="115" stroke="#1d4ed8" stroke-width="2" />
  <line x1="70" y1="135" x2="55" y2="160" stroke="#1d4ed8" stroke-width="2" />
  <line x1="70" y1="135" x2="85" y2="160" stroke="#1d4ed8" stroke-width="2" />
  <text x="45" y="175" fill="#1d4ed8" font-size="11" font-weight="bold">CUSTOMER</text>

  <!-- Actor 2: Vendor (Left Bottom) -->
  <circle cx="70" cy="270" r="14" fill="#dcfce7" stroke="#15803d" stroke-width="2" />
  <line x1="70" y1="284" x2="70" y2="315" stroke="#15803d" stroke-width="2" />
  <line x1="50" y1="295" x2="90" y2="295" stroke="#15803d" stroke-width="2" />
  <line x1="70" y1="315" x2="55" y2="340" stroke="#15803d" stroke-width="2" />
  <line x1="70" y1="315" x2="85" y2="340" stroke="#15803d" stroke-width="2" />
  <text x="50" y="355" fill="#15803d" font-size="11" font-weight="bold">VENDOR</text>

  <!-- Actor 3: Admin (Right Top) -->
  <circle cx="640" cy="90" r="14" fill="#fee2e2" stroke="#b91c1c" stroke-width="2" />
  <line x1="640" y1="104" x2="640" y2="135" stroke="#b91c1c" stroke-width="2" />
  <line x1="620" y1="115" x2="660" y2="115" stroke="#b91c1c" stroke-width="2" />
  <line x1="640" y1="135" x2="625" y2="160" stroke="#b91c1c" stroke-width="2" />
  <line x1="640" y1="135" x2="655" y2="160" stroke="#b91c1c" stroke-width="2" />
  <text x="620" y="175" fill="#b91c1c" font-size="11" font-weight="bold">ADMIN</text>

  <!-- Actor 4: AI Service (Right Bottom) -->
  <rect x="590" y="270" width="100" height="45" fill="#f3e8ff" stroke="#7e22ce" stroke-width="2" rx="4" />
  <text x="600" y="295" fill="#7e22ce" font-size="10.5" font-weight="bold">AI SERVICE</text>
  <text x="605" y="308" fill="#6b21a8" font-size="8.5">(FastAPI Engine)</text>

  <!-- Customer Use Cases -->
  <ellipse cx="250" cy="65" rx="70" ry="16" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2" />
  <text x="195" y="69" font-size="9">UC-01 Browse & Filter Fleet</text>

  <ellipse cx="250" cy="105" rx="70" ry="16" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2" />
  <text x="190" y="109" font-size="9">UC-02 Check Overlap Availability</text>

  <ellipse cx="250" cy="145" rx="70" ry="16" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2" />
  <text x="192" y="149" font-size="9">UC-03 Book & Pay via Razorpay</text>

  <ellipse cx="250" cy="185" rx="70" ry="16" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2" />
  <text x="195" y="189" font-size="9">UC-04 Cancel & Request Refund</text>

  <!-- Vendor Use Cases -->
  <ellipse cx="250" cy="235" rx="70" ry="16" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2" />
  <text x="195" y="239" font-size="9">UC-05 List & Manage Vehicles</text>

  <ellipse cx="250" cy="275" rx="70" ry="16" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2" />
  <text x="190" y="279" font-size="9">UC-06 Record Walk-In Booking</text>

  <ellipse cx="250" cy="315" rx="70" ry="16" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2" />
  <text x="190" y="319" font-size="9">UC-07 Handover & Trip Return</text>

  <ellipse cx="250" cy="355" rx="70" ry="16" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2" />
  <text x="192" y="359" font-size="9">UC-08 Schedule Maintenance</text>

  <!-- Admin Use Cases -->
  <ellipse cx="460" cy="75" rx="75" ry="16" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2" />
  <text x="405" y="79" font-size="9">UC-09 Moderate Fleet Listings</text>

  <ellipse cx="460" cy="115" rx="75" ry="16" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2" />
  <text x="400" y="119" font-size="9">UC-10 Manage Coupons & Users</text>

  <ellipse cx="460" cy="155" rx="75" ry="16" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2" />
  <text x="405" y="159" font-size="9">UC-11 Audit Global Booking Ledger</text>

  <!-- AI Use Cases -->
  <ellipse cx="460" cy="250" rx="75" ry="16" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2" />
  <text x="400" y="254" font-size="9">UC-12 Cosine Recommendations</text>

  <ellipse cx="460" cy="290" rx="75" ry="16" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2" />
  <text x="400" y="294" font-size="9">UC-13 7-Day Demand Forecast</text>

  <ellipse cx="460" cy="330" rx="75" ry="16" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2" />
  <text x="405" y="334" font-size="9">UC-14 Dynamic Pricing Engine</text>

  <!-- Connecting Lines -->
  <!-- Customer Lines -->
  <line x1="90" y1="120" x2="180" y2="65" stroke="#1d4ed8" stroke-width="1" />
  <line x1="90" y1="120" x2="180" y2="105" stroke="#1d4ed8" stroke-width="1" />
  <line x1="90" y1="120" x2="180" y2="145" stroke="#1d4ed8" stroke-width="1" />
  <line x1="90" y1="120" x2="180" y2="185" stroke="#1d4ed8" stroke-width="1" />

  <!-- Vendor Lines -->
  <line x1="90" y1="300" x2="180" y2="235" stroke="#15803d" stroke-width="1" />
  <line x1="90" y1="300" x2="180" y2="275" stroke="#15803d" stroke-width="1" />
  <line x1="90" y1="300" x2="180" y2="315" stroke="#15803d" stroke-width="1" />
  <line x1="90" y1="300" x2="180" y2="355" stroke="#15803d" stroke-width="1" />

  <!-- Admin Lines -->
  <line x1="620" y1="120" x2="535" y2="75" stroke="#b91c1c" stroke-width="1" />
  <line x1="620" y1="120" x2="535" y2="115" stroke="#b91c1c" stroke-width="1" />
  <line x1="620" y1="120" x2="535" y2="155" stroke="#b91c1c" stroke-width="1" />

  <!-- AI Lines -->
  <line x1="590" y1="290" x2="535" y2="250" stroke="#7e22ce" stroke-width="1" />
  <line x1="590" y1="290" x2="535" y2="290" stroke="#7e22ce" stroke-width="1" />
  <line x1="590" y1="290" x2="535" y2="330" stroke="#7e22ce" stroke-width="1" />
</svg>
`;

export const SVG_DFD_LEVEL1 = `
<svg width="720" height="340" viewBox="0 0 720 340" xmlns="http://www.w3.org/2000/svg" font-family="'Times New Roman', serif">
  <!-- Background -->
  <rect width="720" height="340" fill="#f8fafc" rx="8" />

  <!-- External Entities -->
  <rect x="20" y="30" width="100" height="50" fill="#e2e8f0" stroke="#334155" stroke-width="1.5" />
  <text x="45" y="60" font-size="11" font-weight="bold">Customer</text>

  <rect x="20" y="240" width="100" height="50" fill="#e2e8f0" stroke="#334155" stroke-width="1.5" />
  <text x="50" y="270" font-size="11" font-weight="bold">Vendor</text>

  <rect x="600" y="30" width="100" height="50" fill="#e2e8f0" stroke="#334155" stroke-width="1.5" />
  <text x="615" y="60" font-size="11" font-weight="bold">Payment GW</text>

  <!-- Process 1.0: Vehicle Search & Collision Check -->
  <circle cx="230" cy="55" r="35" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" />
  <text x="212" y="52" font-size="10" font-weight="bold">1.0 Search &amp;</text>
  <text x="205" y="65" font-size="9">Availability Check</text>

  <!-- Process 2.0: Booking & Pricing Calculator -->
  <circle cx="430" cy="55" r="35" fill="#fef3c7" stroke="#d97706" stroke-width="2" />
  <text x="412" y="52" font-size="10" font-weight="bold">2.0 Booking &amp;</text>
  <text x="410" y="65" font-size="9">Pricing Engine</text>

  <!-- Process 3.0: Handover & Fleet Management -->
  <circle cx="230" cy="265" r="35" fill="#dcfce7" stroke="#16a34a" stroke-width="2" />
  <text x="210" y="262" font-size="10" font-weight="bold">3.0 Handover &amp;</text>
  <text x="208" y="275" font-size="9">Trip Completion</text>

  <!-- Data Stores -->
  <path d="M 310 150 L 450 150 M 310 185 L 450 185" stroke="#0f172a" stroke-width="2" />
  <text x="320" y="172" font-size="11" font-weight="bold">D1: Bookings &amp; Locks</text>

  <path d="M 120 150 L 260 150 M 120 185 L 260 185" stroke="#0f172a" stroke-width="2" />
  <text x="130" y="172" font-size="11" font-weight="bold">D2: Vehicles &amp; Fleets</text>

  <!-- Connecting Data Flows -->
  <line x1="120" y1="55" x2="195" y2="55" stroke="#0f172a" stroke-width="1.5" marker-end="url(#dfd-arrow)" />
  <text x="130" y="47" font-size="8">City, Dates</text>

  <line x1="265" y1="55" x2="395" y2="55" stroke="#0f172a" stroke-width="1.5" marker-end="url(#dfd-arrow)" />
  <text x="280" y="47" font-size="8">Vehicle ID, Plan</text>

  <line x1="465" y1="55" x2="600" y2="55" stroke="#0f172a" stroke-width="1.5" marker-end="url(#dfd-arrow)" />
  <text x="490" y="47" font-size="8">Create Order</text>

  <!-- Read/Write D1 -->
  <line x1="430" y1="90" x2="400" y2="150" stroke="#0f172a" stroke-width="1.5" marker-end="url(#dfd-arrow)" />
  <text x="425" y="125" font-size="8">Write Booking</text>

  <line x1="240" y1="90" x2="320" y2="150" stroke="#0f172a" stroke-width="1.5" marker-end="url(#dfd-arrow)" stroke-dasharray="3" />
  <text x="260" y="130" font-size="8">Query Overlaps</text>

  <!-- Vendor to Process 3.0 -->
  <line x1="120" y1="265" x2="195" y2="265" stroke="#0f172a" stroke-width="1.5" marker-end="url(#dfd-arrow)" />
  <text x="130" y="257" font-size="8">Odometer &amp; OTP</text>

  <!-- Process 3.0 to D1 -->
  <line x1="245" y1="230" x2="340" y2="185" stroke="#0f172a" stroke-width="1.5" marker-end="url(#dfd-arrow)" />
  <text x="290" y="215" font-size="8">Update ACTIVE/COMPLETED</text>

  <defs>
    <marker id="dfd-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#0f172a" />
    </marker>
  </defs>
</svg>
`;
