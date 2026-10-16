# LabTrack Implementation Program

**Authority:** Approved LabTrack Software Design Document (`docs/architecture/LabTrack_SDD.md`, v0.1 canonical baseline).  
**Approval Gate:** `docs/ASTRA/SDD_APPROVAL_GATE.yaml` (`SDD_APPROVED`).  
**Architectural Order (§33):** Identity/Contracts → Project/Catalogue → Planning/Approval → Issue/Reconciliation → Notification/Time/Analytics → Deployment Validation.

---

## Program Overview

The LabTrack implementation program translates the approved SDD into six strictly ordered execution phases. Each phase implements a bounded architectural layer, respects domain authority, enforces deterministic operations (§34), maintains strict traceability to the Requirement Ledger (`docs/ASTRA/02_REQUIREMENT_LEDGER.md`), and blocks open business policies without guessing.

```
PHASE 01: Core Foundation, Identity & Relational Contracts
  │
  ▼
PHASE 02: Catalogue, Inventory Model & Project Governance
  │
  ▼
PHASE 03: Request Submission, Minimum-Lab Planning & Multi-Stage Approvals
  │
  ▼
PHASE 04: Operational Claims, Whole-Request Issue & Physical Custody
  │
  ▼
PHASE 05: Return Inspection, Reconciliation, Evidence & Outbox Projections
  │
  ▼
PHASE 06: Scheduling, Analytics, Hardening & Deployment Validation
```

---

## Phase 01: Core Foundation, Identity & Relational Contracts

```text
PHASE ID: PHASE_01
PHASE NAME: Core Foundation, Identity & Relational Contracts
OBJECTIVE: Establish the core application runtime, synthetic authentication engine, relational persistence foundation with append-only audit immutability, transactional command wrapper, idempotency enforcement, and API error contracts.
WHY THE PHASE EXISTS: Provides the indispensable technical substrate and security boundary upon which all downstream business operations, RBAC guards, and atomic database transactions rely. Without deterministic transaction boundaries, strict idempotency, and immutable audit logs, workflow integrity cannot be guaranteed.
PRECONDITIONS: Python 3.12+ virtual environment, FastAPI, SQLAlchemy 2.x, Alembic, and Pydantic installed. Approved SDD baseline with validated SHA-256 hashes.
REQUIREMENTS IN SCOPE: REQ-LT-0005, REQ-LT-0006, REQ-LT-0007, REQ-LT-0008, REQ-LT-0009, REQ-LT-0010, REQ-LT-0061, REQ-LT-0062, REQ-LT-0063, REQ-LT-0064, REQ-LT-0066, REQ-LT-0067.
REQUIREMENTS OUT OF SCOPE: Business domain workflows (submission, planning, approval, issue, return); external institutional SSO protocols (SAML/OAuth/LDAP - deferred per REQ-LT-0083); live cloud IAM integration.
ENTITIES: User, AuthSession, Audit, Outbox, Idempotency, Delivery.
STATE TRANSITIONS: User authentication (UNAUTHENTICATED → AUTHENTICATED via AuthSession); Session expiration/revocation (VALID → EXPIRED/REVOKED).
API CONTRACTS: POST /api/auth/login, GET /api/auth/me, POST /api/auth/logout; stable error format (code, message, status_code); Idempotency-Key header contract.
DATABASE CHANGES: Relational tables: users, auth_sessions, audit, outbox, idempotency, deliveries. SQLAlchemy before_update and before_delete event hooks on Audit table enforcing append-only immutability.
EVENTS: None (Foundation layer; events are emitted by domain workflows in subsequent phases).
NOTIFICATIONS: None.
UI SCOPE: Authentication boundary, login form, role switching, user profile header, session storage, and 401 error handler with clean state eviction.
ERROR CASES: UNAUTHENTICATED (401), FORBIDDEN (403), IDEMPOTENCY_KEY_REQUIRED (422), IDEMPOTENCY_CONFLICT (422), TRANSACTION_RETRY (503), READ_ONLY (403).
TEST PLAN: Unit tests for PBKDF2 hashing, salt generation, session lifetime, and token validation; integration tests for /api/auth/login, /api/auth/me, and logout; idempotency conflict and replay tests; audit immutability tests verifying ValueError on update/delete; concurrency tests on transaction wrapper.
SECURITY CHECKS: PBKDF2-HMAC-SHA256 with 310,000 iterations and unique 16-byte salt; 40-character cryptographically secure bearer token hashed with SHA-256; parameterized SQL queries only; no secrets in logs or responses; server-side role and active status validation.
ACADEMIC RUBRIC MAPPING: DCDS: Python classes, SQLAlchemy models, database connection handling, security and error architecture. CCE: Authentication architecture and microservice runtime baseline.
TRACEABILITY: SDD §4, §23, §24, §25, §28, §34 (OP-01); REQ-LT-0005..0010, REQ-LT-0061..0064, REQ-LT-0066..0067.
EXIT CRITERIA: Database migrations apply cleanly; authentication succeeds with synthetic credentials and fails with invalid/inactive credentials; audit log updates/deletions are blocked by database/ORM hooks; idempotency keys prevent duplicate execution; test suite passes with zero failures.
ROLLBACK PLAN: Drop generated test tables; revert migrations via alembic downgrade base; revoke active session tokens.
ARTIFACTS PRODUCED: src/backend/labtrack/models.py, auth.py, db.py, config.py, schemas.py, alembic migrations, tests/test_phase_01_foundation.py.
OWNER: Backend Engineering / Antigravity Agent.
DEPENDENCIES: None (Root phase).
```

---

## Phase 02: Catalogue, Inventory Model & Project Governance

```text
PHASE ID: PHASE_02
PHASE NAME: Catalogue, Inventory Model & Project Governance
OBJECTIVE: Implement the dual-class inventory model (physical assets and quantity-tracked consumables), lab-scoped stock tracking with good/bad separation, barcode lookups, project creation with sequential deployment-global IDs (PROJ-XXXXXX), and team membership management.
WHY THE PHASE EXISTS: Establishes authoritative departmental hardware and project records. All student requests must link to an existing verified project and select valid catalogue items from departmental labs.
PRECONDITIONS: Completion of Phase 01.
REQUIREMENTS IN SCOPE: REQ-LT-0001, REQ-LT-0002, REQ-LT-0003, REQ-LT-0004, REQ-LT-0011, REQ-LT-0012, REQ-LT-0013, REQ-LT-0014, REQ-LT-0015, REQ-LT-0072, REQ-LT-0074.
REQUIREMENTS OUT OF SCOPE: Minimum-lab algorithmic optimization (Phase 03); request submission and approvals (Phase 03); submitted project revisions / lead transfers (Blocked by OD-05); live stock-admin editing role (Blocked by OD-15).
ENTITIES: Lab, Item, Stock, Asset, Project, Member.
STATE TRANSITIONS: Project: (DRAFT/CREATED); Asset: (AVAILABLE, UNDER_REPAIR, RETIRED); Stock: Nonnegative quantity updates (good + bad = total).
API CONTRACTS: GET /api/catalogue, POST /api/projects, GET /api/projects, GET /api/projects/{id}; check constraints on kind ('ASSET', 'CONSUMABLE') and stock nonnegativity.
DATABASE CHANGES: Tables: labs, items, stock, assets, projects, members; check constraints: ck_item_kind, ck_stock_nonnegative; unique constraints on (item_id, lab_id) and asset barcode.
EVENTS: None directly generated (project created audit record stored).
NOTIFICATIONS: In-app project creation confirmation.
UI SCOPE: Catalogue explorer with search, category filtering, lab stock availability breakdown, project creation dialog, team member selection, and active project dashboard.
ERROR CASES: PROJECT_NAME_REQUIRED (422), MENTOR_REQUIRED (422), INVALID_MEMBER (422), DUPLICATE_PROJECT_NAME (409), ITEM_NOT_FOUND (404).
TEST PLAN: Project sequential ID formatting (PROJ-000001); member linking and query isolation; stock balance constraint verification; asset barcode uniqueness; catalogue search and filter verification; fixture import verification.
SECURITY CHECKS: Student role required to create project; project lead assigned automatically to creator; mentor must have FACULTY/MENTOR role; members must be valid registered users.
ACADEMIC RUBRIC MAPPING: DCDS: Relational schemas, foreign keys, multi-table joins, JSON/fixture import/export. CCE: Departmental resource cataloging.
TRACEABILITY: SDD §3, §5, §6, §23, §34 (OP-02, OP-03, OP-20); REQ-LT-0001..0004, REQ-LT-0011..0015, REQ-LT-0072, REQ-LT-0074.
EXIT CRITERIA: Projects generate immutable sequential IDs; stock tables enforce good+bad non-negative constraints; asset lookups return verified lab locations; catalogue API returns real-time availability.
ROLLBACK PLAN: Revert project creation migrations; truncate seeded catalogue and lab tables.
ARTIFACTS PRODUCED: src/backend/labtrack/service.py (catalogue & project methods), fixtures/demo.json, tests/test_workflows.py.
OWNER: Backend & Frontend Engineering.
DEPENDENCIES: Phase 01.
```

---

## Phase 03: Request Submission, Minimum-Lab Planning & Multi-Stage Approvals

```text
PHASE ID: PHASE_03
PHASE NAME: Request Submission, Minimum-Lab Planning & Multi-Stage Approvals
OBJECTIVE: Implement deterministic minimum-lab allocation algorithm (I1 exact subset search), student request submission, Central Store stock validation, class-specific multi-stage approval routing (Student → Mentor → In-Charge [Assets only] → HoD), approval timelines, and decision audits.
WHY THE PHASE EXISTS: Solves the core academic problem of component fragmentation across multiple labs, ensuring requests are fulfilled from the fewest possible labs, and guarantees faculty governance before any equipment is collected.
PRECONDITIONS: Completion of Phase 01 and Phase 02.
REQUIREMENTS IN SCOPE: REQ-LT-0016, REQ-LT-0017, REQ-LT-0018, REQ-LT-0019, REQ-LT-0020, REQ-LT-0021, REQ-LT-0022, REQ-LT-0023, REQ-LT-0024, REQ-LT-0025, REQ-LT-0055, REQ-LT-0057, REQ-LT-0059, REQ-LT-0060.
REQUIREMENTS OUT OF SCOPE: Mixed-class requests in a single submission (Blocked by OD-06); multi-In-Charge asset requests (Blocked by OD-06); automated reservation holds during planning (Blocked by OD-04); external paid LLM contracts (Blocked by OD-18).
ENTITIES: Request, RequestLine, Audit, Outbox.
STATE TRANSITIONS: Request: SUBMITTED → CENTRAL_STORE_VALIDATED → MENTOR_REVIEW → (INCHARGE_REVIEW) → HOD_REVIEW → APPROVED (or REJECTED).
API CONTRACTS: POST /api/requests, GET /api/requests, GET /api/requests/{id}, POST /api/requests/{id}/decision, GET /api/alternatives, GET /api/demand.
DATABASE CHANGES: Tables: requests, request_lines; columns: state, purpose, duration_hours, due_at, due_version, timeline audit records.
EVENTS: REQUEST_SUBMITTED, MENTOR_APPROVED, INCHARGE_APPROVED, HOD_APPROVED, REQUEST_REJECTED.
NOTIFICATIONS: Notification documents emitted to outbox for next responsible reviewer; in-app status updates for student.
UI SCOPE: Request builder with real-time minimum-lab calculation preview, class selection (Consumable vs Asset), approval timeline viewer, decision cards for Mentor/In-Charge/HoD with remarks.
ERROR CASES: EMPTY_REQUEST (422), INSUFFICIENT_STOCK (422), UNAUTHORIZED_REVIEWER (403), INVALID_STAGE_TRANSITION (409), REQUEST_NOT_FOUND (404).
TEST PLAN: Minimum-lab algorithm unit tests (single lab, two labs, tie-breaker concentration score, lexicographical lab-ID); approval chain progression tests; negative authorization tests (Mentor trying to approve HoD stage); rejection terminal state tests; timeline audit verification.
SECURITY CHECKS: Only Project Lead can submit requests; Mentor must be assigned project mentor; In-Charge must be assigned to issuing lab; HoD verified via role; timeline records immutable actor identity.
ACADEMIC RUBRIC MAPPING: DCDS: Algorithmic optimization (exact subset search), complex multi-stage state machines, transactional integrity. CCE: Workflow orchestration and distributed consensus simulation.
TRACEABILITY: SDD §6, §7, §8, §9, §10, §34 (OP-04, OP-05, OP-16); REQ-LT-0016..0025, REQ-LT-0055, REQ-LT-0057, REQ-LT-0059..0060.
EXIT CRITERIA: Exact minimum-lab search returns deterministic optimal lab subsets; requests traverse strict approval stages without stage bypassing; rejection halts the workflow and notifies the student; approval timeline captures full audit history.
ROLLBACK PLAN: Mark invalid requests as REJECTED; roll back transaction before committing request_lines.
ARTIFACTS PRODUCED: src/backend/labtrack/service.py (planning & decision logic), tests/test_workflows.py.
OWNER: Backend Engineering.
DEPENDENCIES: Phase 01, Phase 02.
```

---

## Phase 04: Operational Claims, Whole-Request Issue & Physical Custody

```text
PHASE ID: PHASE_04
PHASE NAME: Operational Claims, Whole-Request Issue & Physical Custody
OBJECTIVE: Implement first-authorized operational claim by lab assistants, atomic whole-request physical issue across all labs, physical handover confirmation, barcode binding for assets, pre-issue student cancellation, extension requests/decisions, and FIFO shortage queue entry.
WHY THE PHASE EXISTS: Governs the actual transfer of legal/institutional custody of physical equipment from departmental labs to student project teams, ensuring no partial issues occur and all serialized assets are tracked.
PRECONDITIONS: Completion of Phase 03.
REQUIREMENTS IN SCOPE: REQ-LT-0026, REQ-LT-0027, REQ-LT-0028, REQ-LT-0029, REQ-LT-0030, REQ-LT-0031, REQ-LT-0032, REQ-LT-0035, REQ-LT-0036, REQ-LT-0037, REQ-LT-0038, REQ-LT-0039.
REQUIREMENTS OUT OF SCOPE: Multi-operator staggered physical handover coordination (Blocked by OD-10; single assistant assigned to all issuing labs is the supported path); claim stealing / reassignment timeout (Blocked by OD-07); automated 24h queue expiry (Blocked by OD-04); discretionary FIFO reordering (Blocked by OD-08).
ENTITIES: Request, RequestLine, Asset, Stock, Extension, Reservation, Audit, Outbox.
STATE TRANSITIONS: Request: APPROVED → CLAIMED → ISSUED; Asset: AVAILABLE → IN_USE; Extension: MENTOR_REVIEW → APPROVED/REJECTED; Reservation: WAITING_FIFO; Request Cancellation: (PRE-ISSUE) → CANCELLED.
API CONTRACTS: POST /api/requests/{id}/claim, POST /api/requests/{id}/issue, POST /api/requests/{id}/cancel, POST /api/requests/{id}/extend, POST /api/extensions/{id}/decision, POST /api/reservations, POST /api/reservations/{id}/cancel.
DATABASE CHANGES: requests table (claimed_by, issued_at, due_at, due_version); assets table (state = 'IN_USE'); stock table (good decrements atomically); extensions table; reservations table.
EVENTS: REQUEST_CLAIMED, REQUEST_ISSUED, EXTENSION_REQUESTED, EXTENSION_APPROVED, REQUEST_CANCELLED.
NOTIFICATIONS: Outbox events for custody transfer to student, mentor, and assistant.
UI SCOPE: Assistant operational queue, barcode scanner input / asset selector, physical handover confirmation toggle, student cancellation button, extension dialog, FIFO position viewer.
ERROR CASES: NOT_ASSIGNED_TO_LAB (403), ALREADY_CLAIMED (409), FULFILMENT_FAILED_STOCK (409), ASSET_NOT_AVAILABLE (409), CANCEL_NOT_PERMITTED_POST_ISSUE (409), EXTENSION_LIMIT_EXCEEDED (422).
TEST PLAN: Concurrency tests for simultaneous claims (first-claim wins); whole-request atomic rollback on stock shortage; asset barcode assignment tests; pre-issue cancellation tests; extension due-date versioning tests; idempotency replay tests on issue.
SECURITY CHECKS: Assistant must be assigned to all issuing labs for the request; physical handover confirmation explicitly required; stock and asset locked via SELECT FOR UPDATE; duplicate submissions rejected via idempotency key.
ACADEMIC RUBRIC MAPPING: DCDS: Concurrency control, pessimistic locking, atomic transactions, complex state transitions. CCE: Asset lifecycle tracking and distributed state management.
TRACEABILITY: SDD §10, §11, §12, §15, §16, §34 (OP-06, OP-07, OP-08, OP-09, OP-10, OP-11); REQ-LT-0026..0032, REQ-LT-0035..0039.
EXIT CRITERIA: Single SQL transaction commits inventory deduction, asset state change, request state transition, audit entry, and outbox event; no partial issue is possible; duplicate issue requests replay without mutating stock; tests pass.
ROLLBACK PLAN: Revert transaction on error; unclaim request if issue aborts.
ARTIFACTS PRODUCED: src/backend/labtrack/service.py (claim, issue, extension, cancellation logic), tests/test_workflows.py.
OWNER: Backend & Frontend Engineering.
DEPENDENCIES: Phase 01, Phase 02, Phase 03.
```

---

## Phase 05: Return Inspection, Reconciliation, Evidence & Outbox Projections

```text
PHASE ID: PHASE_05
PHASE NAME: Return Inspection, Reconciliation, Evidence & Outbox Projections
OBJECTIVE: Implement equipment return, inspection recording (PASS/FAIL/NOT_TESTED, missing/damaged/good quantities), student reconciliation acknowledgement, damaged asset evidence photo upload with SHA-256 integrity, incident recording, and reliable outbox event dispatch to MongoDB document projections.
WHY THE PHASE EXISTS: Closes the physical custody lifecycle, restores inventory to departmental stock, captures damage incidents with tamper-proof evidence, and projects transactional truth to high-performance read models without contaminating the relational domain.
PRECONDITIONS: Completion of Phase 04.
REQUIREMENTS IN SCOPE: REQ-LT-0040, REQ-LT-0041, REQ-LT-0042, REQ-LT-0043, REQ-LT-0044, REQ-LT-0045, REQ-LT-0046, REQ-LT-0047, REQ-LT-0048, REQ-LT-0049, REQ-LT-0050, REQ-LT-0051, REQ-LT-0052, REQ-LT-0053, REQ-LT-0054, REQ-LT-0056, REQ-LT-0065.
REQUIREMENTS OUT OF SCOPE: Automated monetary fines or student penalties (Blocked by OD-13); automatic REPO numeric formula calculation (Blocked by OD-13); cross-lab return routing (Blocked by OD-16); retention approval workflows (Blocked by OD-16); live external cloud S3/Gmail credentials (local storage adapter & JSON delivery used).
ENTITIES: Inspection, Incident, Evidence, Request, Asset, Stock, Outbox, LocalDocument / Mongo Collections.
STATE TRANSITIONS: Request: ISSUED → RETURNED (or RECONCILED upon student ack); Asset: IN_USE → AVAILABLE (or UNDER_REPAIR / DEFECTIVE); Stock: good/bad restored based on inspection outcome.
API CONTRACTS: POST /api/requests/{id}/return, POST /api/requests/{id}/acknowledge, POST /api/requests/{id}/evidence, GET /api/evidence/{id}, GET /api/notifications, GET /api/incidents.
DATABASE CHANGES: Tables: inspections, incidents, evidence, local_documents, deliveries; updates to requests, assets, stock, outbox tables.
EVENTS: REQUEST_RETURNED, RECONCILIATION_ACKNOWLEDGED, DAMAGE_INCIDENT_RECORDED, EVIDENCE_UPLOADED.
NOTIFICATIONS: In-app delivery documents stored in document projections; email delivery simulation stored with PENDING/SENT states.
UI SCOPE: Inspection form with line-by-line quantity entries and functional status radio buttons, image upload with client preview and SHA-256 display, student acknowledgement banner, incident list, and in-app notification bell.
ERROR CASES: INVALID_INSPECTION_QUANTITY (422), EVIDENCE_REQUIRED_FOR_DAMAGE (422), INVALID_IMAGE_FORMAT (422), UNAUTHORIZED_EVIDENCE_ACCESS (403), ALREADY_RETURNED (409).
TEST PLAN: Consumable return restoring good stock; asset return marked defective moving asset to UNDER_REPAIR; evidence photo upload and cryptographic SHA-256 verification; student acknowledgement tests; outbox dispatch tests to local document store; channel failure isolation tests.
SECURITY CHECKS: Evidence uploads restricted to valid image types (PNG/JPEG) under 5MB; image re-encoded to strip malicious EXIF metadata; private evidence read restricted to request participants and authorized faculty; audit immutable.
ACADEMIC RUBRIC MAPPING: DCDS: Multi-database architecture (SQL relational truth + NoSQL document projection), blob/binary handling, advanced queries. CCE: Event-driven outbox pattern and asynchronous messaging.
TRACEABILITY: SDD §17, §18, §19, §20, §21, §27, §34 (OP-12, OP-13, OP-14, OP-15, OP-17); REQ-LT-0040..0054, REQ-LT-0056, REQ-LT-0065.
EXIT CRITERIA: Returns restore inventory correctly; damaged assets create immutable incident records with attached evidence photos; outbox worker dispatches events idempotently without blocking SQL transaction; tests pass.
ROLLBACK PLAN: Compensating transaction if dispatch worker fails; retain outbox event in outbox table with last_error.
ARTIFACTS PRODUCED: src/backend/labtrack/worker.py, adapters.py, tests/test_workflows.py, tests/test_projection_features.py.
OWNER: Backend & Frontend Engineering.
DEPENDENCIES: Phase 01, Phase 02, Phase 03, Phase 04.
```

---

## Phase 06: Scheduling, Analytics, Hardening & Deployment Validation

```text
PHASE ID: PHASE_06
PHASE NAME: Scheduling, Analytics, Hardening & Deployment Validation
OBJECTIVE: Implement background worker for approved-request 48h expiration, department usage and unmet-demand analytical reporting, MySQL stored procedure / MongoDB aggregation pipelines, Docker containerization, and multi-environment deployment readiness.
WHY THE PHASE EXISTS: Guarantees uncollected reservations are reclaimed, gives department leadership operational visibility into lab utilization, and delivers containerized artifacts ready for staging and production hosting.
PRECONDITIONS: Completion of Phase 05.
REQUIREMENTS IN SCOPE: REQ-LT-0068, REQ-LT-0069, REQ-LT-0070, REQ-LT-0073, REQ-LT-0074, REQ-LT-0075, REQ-LT-0076, REQ-LT-0078, REQ-LT-0079, REQ-LT-0080.
REQUIREMENTS OUT OF SCOPE: Live production multi-cloud fencing / DR execution (Blocked by lack of provisioned cloud infrastructure / credentials per OD-21); live email/calendar server configuration (Blocked by OD-11).
ENTITIES: Outbox, Request, Stock, Asset, Audit, Analytics views.
STATE TRANSITIONS: Request: APPROVED → EXPIRED (via 48h background scheduler if uncollected).
API CONTRACTS: GET /api/reports/usage, GET /api/health, GET /api/metrics; CLI commands for worker, seed, and fixture export.
DATABASE CHANGES: database/mysql/reporting.sql (stored procedure sp_lab_monthly_usage, analytical views), database/mongo/analytics.js (aggregation pipelines).
EVENTS: REQUEST_EXPIRED.
NOTIFICATIONS: Outbox event notifying student and assistant of expiration.
UI SCOPE: HoD Departmental Analytics dashboard with lab utilization charts, unmet demand reports, and system health status.
ERROR CASES: SCHEDULER_LOCK_FAILURE, DATABASE_UNAVAILABLE (503), INVALID_DATE_RANGE (422).
TEST PLAN: 48h expiration sweep test; background outbox dispatcher recovery tests; reporting SQL procedure validation; container build tests; full end-to-end regression suite.
SECURITY CHECKS: Container runs as non-root user; database credentials loaded via environment variables; health check exposes no sensitive system diagnostics.
ACADEMIC RUBRIC MAPPING: DCDS: Advanced SQL (stored procedures, aggregations), NoSQL aggregation pipeline, data export/reporting. CCE: Multi-cloud architecture documentation, containerization, deployment runbooks.
TRACEABILITY: SDD §25, §26, §29, §30, §31, §36, §37, §41; REQ-LT-0068..0070, REQ-LT-0073..0076, REQ-LT-0078..0080.
EXIT CRITERIA: Docker image builds cleanly; compose environment starts services; background worker sweeps expired requests; analytical reports compute correct aggregations; all test suites pass.
ROLLBACK PLAN: Docker stop/down; revert migration if needed.
ARTIFACTS PRODUCED: Dockerfile, compose.yaml, database/mysql/reporting.sql, database/mongo/analytics.js, .github/workflows/validate.yml.
OWNER: DevOps & Backend Engineering.
DEPENDENCIES: Phase 01 through Phase 05.
```
