# RentRide Documentation Index

Welcome to the comprehensive technical documentation for **RentRide** — a multi-vendor vehicle rental marketplace connecting Customers, Vendors, and Platform Administrators.

---

## 🏛️ Standard Enterprise Audit Suite (v1.3.0)

This standardized 14-document suite serves as the **official single source of truth** for the RentRide platform, verified and audited against the active codebase on 2026-09-03:

| File | Document Title | Purpose & Scope |
| :--- | :--- | :--- |
| [**00 — Documentation Audit**](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/docs/00-Documentation-Audit.md) | Documentation Audit & Inventory | Complete inventory table of all documentation files, gap analysis, and action log. |
| [**01 — Requirements**](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/docs/01-Requirements.md) | System Requirements Specification | Comprehensive functional (`AUTH`, `USER`, `VEH`, `BOOK`, `PAY`, `COUP`, `VEN`, `MAIN`, `ADM`, `REV`, `NOTIF`, `AI`, `PLAT`) and non-functional requirements. |
| [**02 — Feature Tree**](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/docs/02-Feature-Tree.md) | Hierarchical Feature Scope Tree | Exhaustive hierarchical tree mapping every feature to its corresponding Requirement ID. |
| [**03 — User Roles & Permissions**](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/docs/03-User-Roles-and-Permissions.md) | User Roles, RBAC & Permissions Matrix | Granular specifications for Guest, Customer, Vendor, and Admin roles with full 32-action permission matrix. |
| [**04 — User Flows**](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/docs/04-User-Flows.md) | End-to-End User Journeys | 9 comprehensive sequence diagrams and workflows using Mermaid syntax. |
| [**05 — System Architecture**](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/docs/05-System-Architecture.md) | System & Subsystem Architecture | Multi-tier architecture, Express layered pattern, React client, FastAPI microservice, and Mermaid system diagram. |
| [**06 — Database Design**](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/docs/06-Database-Design.md) | Database Schemas & ERD | Complete field breakdown of all 9 Mongoose schemas, validation, indexes, hooks, and Mermaid ER diagram. |
| [**07 — API Specification**](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/docs/07-API-Specification.md) | REST API Endpoint Reference | Complete endpoint specifications across 13 domains with parameters, payloads, and response status codes. |
| [**08 — UI/UX Specification**](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/docs/08-UI-UX-Specification.md) | UI/UX & Component Specification | Design system tokens, 15 pages, 16 components, navigation layouts, and state design patterns. |
| [**09 — Business Rules**](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/docs/09-Business-Rules.md) | Business Logic Rules & Invariants | 12 core business logic rules, mathematical collision formulas, and financial payout splits. |
| [**10 — Test Cases**](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/docs/10-Test-Cases.md) | Test Cases & Verification Matrix | Test case specifications mapped to executable test harnesses with verified execution statuses. |
| [**11 — Requirement Traceability**](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/docs/11-Requirement-Traceability.md) | Master Traceability Matrix (RTM) | Full traceability from Requirement ID $\rightarrow$ Feature $\rightarrow$ UI $\rightarrow$ API $\rightarrow$ Backend $\rightarrow$ Database $\rightarrow$ Test. |
| [**12 — Change Log**](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/docs/12-Change-Log.md) | Audit & Version Change Log | Detailed change log recording documentation modernization and project milestone history. |
| [**13 — Project Audit**](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/docs/13-Project-Audit.md) | Comprehensive Audit & Gap Analysis | Full-stack audit across 10 dimensions, issue categorization by severity (Critical, High, Medium, Low), and recommendations. |

---

## 🧭 Legacy Documentation Archive

In accordance with documentation preservation guidelines, the legacy documentation suite has been preserved in its original form for historical reference and backward compatibility:

```text
docs/
├── 01_PROJECT_OVERVIEW.md              # Purpose, target roles, tech stack, and executive summary
├── 02_REQUIREMENTS.md                  # Functional and non-functional specifications & status
├── 03_FEATURES.md                      # Comprehensive feature inventory & code references
├── 04_ARCHITECTURE.md                  # High-level architecture, module layers, and Mermaid diagrams
├── 05_PROJECT_STRUCTURE.md             # Codebase directory map, module purposes, and entry points
├── 06_DATABASE.md                      # Database schemas, fields, validation, indexes, and ERDs
├── 07_API.md                           # Complete REST API reference with routes and parameters
├── 08_USER_FLOWS.md                    # End-to-end customer, vendor, and admin user journeys
├── 09_AUTHENTICATION_AUTHORIZATION.md  # JWT security, session management, and RBAC matrix
├── 10_EXTERNAL_SERVICES.md             # MongoDB Atlas, Cloudinary, Razorpay, and AI microservice
├── 11_TECHNICAL_DECISIONS.md           # Confirmed and inferred architectural decisions & trade-offs
├── 12_CURRENT_STATUS.md                # System health report, completed modules, and technical debt
├── 13_ROADMAP.md                       # Prioritized development roadmap (P0–P3)
├── 14_TESTING.md                       # Test suites, verification scripts, and domain checklists
└── 15_CHANGELOG.md                     # Version history and milestone changelog
```

Root-level project documentation is also available:
* [**`README.md`**](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/README.md): Quick start guide and repository layout.
* [**`RENTRIDE_FUNCTIONALITY_MAP.md`**](file:///c:/Users/vansh/OneDrive/Desktop/Project/RentRide/RENTRIDE_FUNCTIONALITY_MAP.md): High-level functional scope tree.
