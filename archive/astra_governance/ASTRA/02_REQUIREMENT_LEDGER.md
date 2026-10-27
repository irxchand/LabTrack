# ASTRA requirement ledger

Version: 1.0 | 2026-10-07 | AWAITING_USER_VALIDATION

IDs are stable and must not be renumbered. No item is newly user-validated. EXPLICIT means stated in its cited source, not separately signed approval. RECORDED_CURRENT means current project decisions asserted in SRC-02; its faculty-attributed statements remain distinguishable from the raw SRC-04 evidence. ASSUMPTION/PROPOSAL/DERIVED/FUTURE/DEPRECATED/UNKNOWN never silently become confirmed requirements. Pitch contributes zero entries.

Validation statements are derived checks of the extracted wording, not extra business policy, implemented tests or measured results. Dependencies are named source-level prerequisites, not implementation phases. Every record inherits the gate prohibition and its own stated constraints. Detailed schemas/tests remain for approved design. OD links resolve in [05_OPEN_DECISIONS.md](05_OPEN_DECISIONS.md).

## REQ-LT-0001 — scope

R&A-only project-centric hardware lifecycle; cross-department sharing excluded

- **Source:** SRC-02
- **Source location:** A2; C; D; AJ
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Project owner
- **Trigger:** Scope review
- **Dependencies:** None; scope prerequisite
- **Affected components/entities:** Department/product boundary
- **Affected state transitions:** No independent runtime transition
- **Validation requirement / derived acceptance check:** Verify catalogue and workflows remain department-scoped
- **Unresolved questions:** OD-02
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0002 — project

Required Project Name; immutable sequential deployment-global PROJ-000001-style ID, never reused

- **Source:** SRC-02
- **Source location:** PART A3 — PROJECT IDENTITY WITHIN THE SYSTEM
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Project Lead / permitted members
- **Trigger:** Create/edit/submit
- **Dependencies:** Department scope; identity; authorization
- **Affected components/entities:** Project, membership, requirements
- **Affected state transitions:** Create/edit; submission links to request
- **Validation requirement / derived acceptance check:** Concurrent creation yields unique immutable IDs; archival cannot reuse IDs
- **Unresolved questions:** OD-05
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0003 — project

Projects link student members, mentor, requirements, requests, issues and history

- **Source:** SRC-02
- **Source location:** F; UAQ23
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Project Lead / permitted members
- **Trigger:** Create/edit/submit
- **Dependencies:** Department scope; identity; authorization
- **Affected components/entities:** Project, membership, requirements
- **Affected state transitions:** Create/edit; submission links to request
- **Validation requirement / derived acceptance check:** Trace each transaction to project and participants
- **Unresolved questions:** OD-05
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0004 — project

Project Lead edits metadata/membership/requirements and submits/withdraws before issue; members contribute without silently changing authoritative requests

- **Source:** SRC-02
- **Source location:** UAQ23
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Project Lead / permitted members
- **Trigger:** Create/edit/submit
- **Dependencies:** Department scope; identity; authorization
- **Affected components/entities:** Project, membership, requirements
- **Affected state transitions:** Create/edit; submission links to request
- **Validation requirement / derived acceptance check:** Lead/member/outsider permission checks and audit of material changes
- **Unresolved questions:** OD-05
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0005 — identity

PRN is intended student identity; profile includes name/batch/branch/email/section/phone; PRN encoding remains unverified

- **Source:** SRC-02
- **Source location:** E2
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Synthetic user / technical administrator; future IT administrator
- **Trigger:** Login or master-data maintenance
- **Dependencies:** Server-side authorization; synthetic data boundary
- **Affected components/entities:** User, roles, mappings, AuthProvider
- **Affected state transitions:** Session/master-data lifecycle unspecified
- **Validation requirement / derived acceptance check:** Use synthetic data without inventing institutional PRN encoding
- **Unresolved questions:** OD-14
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0006 — identity

Teacher IDs are T plus 5 digits and staff IDs N plus 5 digits

- **Source:** SRC-02
- **Source location:** E2; AE; SRC-04 t(5digits)/n(5digits) notes
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Synthetic user / technical administrator; future IT administrator
- **Trigger:** Login or master-data maintenance
- **Dependencies:** Server-side authorization; synthetic data boundary
- **Affected components/entities:** User, roles, mappings, AuthProvider
- **Affected state transitions:** Session/master-data lifecycle unspecified
- **Validation requirement / derived acceptance check:** Validate recorded ID format in prototype master data
- **Unresolved questions:** OD-14
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0007 — approval

Mentor and In-Charge are distinct roles; In-Charge is faculty responsible for one or at most two labs

- **Source:** SRC-02
- **Source location:** E3/E4; I; SRC-04 lab incharge notes
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Lead, Mentor, In-Charge, HoD; Central Store system stage
- **Trigger:** Submit/decide request
- **Dependencies:** Project authority; role/lab mappings; current request version
- **Affected components/entities:** Request, approval timeline
- **Affected state transitions:** DRAFT/SUBMITTED/review/HOD_REVIEW/APPROVED or REJECTED
- **Validation requirement / derived acceptance check:** Verify role distinctions and lab cardinality
- **Unresolved questions:** OD-06
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0008 — claim

Assistants may manage several labs and a lab may have several assistants; first authorized claim owns operational order, all assigned assistants notified

- **Source:** SRC-02
- **Source location:** E5; UAQ24
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Issuing-lab Assistant
- **Trigger:** Approved order available
- **Dependencies:** Prior approvals; assigned lab
- **Affected components/entities:** Operational order and lab mapping
- **Affected state transitions:** Unclaimed → claimed conceptual state; enum absent
- **Validation requirement / derived acceptance check:** Two simultaneous claims produce one operational owner and audit
- **Unresolved questions:** OD-07
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0009 — override

HoD is first-class R&A Super Access, sees all projects, final normal approver and sole general overwrite authority

- **Source:** SRC-02
- **Source location:** E6; O; SRC-04 HoD notes
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** HoD
- **Trigger:** Correction/overwrite
- **Dependencies:** HoD authority; source record; historical preservation
- **Affected components/entities:** Affected record and append-only audit
- **Affected state transitions:** Correction transition rules incomplete
- **Validation requirement / derived acceptance check:** Other roles cannot invoke general overwrite; HoD changes preserve history
- **Unresolved questions:** OD-06 OD-08
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0010 — identity

Technical Admin supports configuration, development, seed data and deployment, not institutional approval

- **Source:** SRC-02
- **Source location:** E7; AG
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Synthetic user / technical administrator; future IT administrator
- **Trigger:** Login or master-data maintenance
- **Dependencies:** Server-side authorization; synthetic data boundary
- **Affected components/entities:** User, roles, mappings, AuthProvider
- **Affected state transitions:** Session/master-data lifecycle unspecified
- **Validation requirement / derived acceptance check:** Technical privileges cannot replace HoD in domain workflow
- **Unresolved questions:** OD-14 OD-15
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0011 — inventory

Assets and returnable quantity-tracked Consumables are the two primary inventory classes

- **Source:** SRC-02
- **Source location:** G; H; UAQ7
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Authorized inventory personnel; exact maintenance permissions open
- **Trigger:** Catalogue/stock query or maintenance
- **Dependencies:** Department scope; class rules; authorization
- **Affected components/entities:** Catalogue, asset, per-lab stock
- **Affected state transitions:** Q0 asset states; numeric good/bad/total
- **Validation requirement / derived acceptance check:** Class-aware catalogue, issue and return representation
- **Unresolved questions:** OD-02
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0012 — inventory

Assets use SIT Barcode as primary lookup, Default ID and potentially shared Bill Number; CPR/purchase metadata where available

- **Source:** SRC-02
- **Source location:** G1; H1/H3; A3
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Authorized inventory personnel; exact maintenance permissions open
- **Trigger:** Catalogue/stock query or maintenance
- **Dependencies:** Department scope; class rules; authorization
- **Affected components/entities:** Catalogue, asset, per-lab stock
- **Affected state transitions:** Q0 asset states; numeric good/bad/total
- **Validation requirement / derived acceptance check:** Preserve physical identity without assuming bill-number uniqueness
- **Unresolved questions:** OD-15
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0013 — inventory

Sensors/actuators are consumables; classes Sensor, MC, Microprocessor, Motors, Misc, Communication Module, Battery; relevant brand/range/descriptions

- **Source:** SRC-02
- **Source location:** G2; SRC-04 classes notes
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Authorized inventory personnel; exact maintenance permissions open
- **Trigger:** Catalogue/stock query or maintenance
- **Dependencies:** Department scope; class rules; authorization
- **Affected components/entities:** Catalogue, asset, per-lab stock
- **Affected state transitions:** Q0 asset states; numeric good/bad/total
- **Validation requirement / derived acceptance check:** Catalogue supports recorded classes and metadata
- **Unresolved questions:** OD-15
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0014 — inventory

Per-lab consumable good plus bad equals total physical quantity; no normal per-unit IDs

- **Source:** SRC-02
- **Source location:** G2; H2; Q0; W3
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Authorized inventory personnel; exact maintenance permissions open
- **Trigger:** Catalogue/stock query or maintenance
- **Dependencies:** Department scope; class rules; authorization
- **Affected components/entities:** Catalogue, asset, per-lab stock
- **Affected state transitions:** Q0 asset states; numeric good/bad/total
- **Validation requirement / derived acceptance check:** Stock mutations preserve nonnegative quantities and total identity
- **Unresolved questions:** OD-02 OD-10
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0015 — inventory

Catalogue types differ from physical assets; every issue preserves actual issuing lab and unit/quantity

- **Source:** SRC-02
- **Source location:** G3; I; Q
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Authorized inventory personnel; exact maintenance permissions open
- **Trigger:** Catalogue/stock query or maintenance
- **Dependencies:** Department scope; class rules; authorization
- **Affected components/entities:** Catalogue, asset, per-lab stock
- **Affected state transitions:** Q0 asset states; numeric good/bad/total
- **Validation requirement / derived acceptance check:** Unit history and aggregate quantity history remain distinguishable
- **Unresolved questions:** OD-10
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0016 — discovery

Show authoritative availability/category/specifications/candidate labs during entry; shortage is immediate and not an issuable normal request

- **Source:** SRC-02
- **Source location:** J; K; L
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Student / Project Lead
- **Trigger:** Requirement entry/search
- **Dependencies:** Inventory model; MySQL source of truth
- **Affected components/entities:** Catalogue and availability boundary
- **Affected state transitions:** Draft requirement/shortage; exact schema absent
- **Validation requirement / derived acceptance check:** Insufficient total quantity produces shortage, not fabricated availability
- **Unresolved questions:** OD-09
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0017 — allocation

Find minimum feasible number of labs using exact subset search at prototype scale

- **Source:** SRC-02
- **Source location:** I1
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** System on requirement entry
- **Trigger:** Plan fulfilable request
- **Dependencies:** Live stock; minimum-lab objective
- **Affected components/entities:** Fulfilment plan; lab/stock
- **Affected state transitions:** Planning only; no automatic reservation
- **Validation requirement / derived acceptance check:** Compare result with every smaller candidate lab set
- **Unresolved questions:** OD-09
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0018 — allocation

Equal-cardinality lab sets use specified stock-concentration score then stable lab-ID ordering

- **Source:** SRC-02
- **Source location:** I1 exact prototype algorithm; SRC-03 section 7
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** System on requirement entry
- **Trigger:** Plan fulfilable request
- **Dependencies:** Live stock; minimum-lab objective
- **Affected components/entities:** Fulfilment plan; lab/stock
- **Affected state transitions:** Planning only; no automatic reservation
- **Validation requirement / derived acceptance check:** Equal-sized feasible plans obey documented secondary/tertiary ordering
- **Unresolved questions:** OD-09
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0019 — allocation

Availability/fulfilment plan is informational; requirement entry alone reserves no stock

- **Source:** SRC-02
- **Source location:** I1 important rules; L1
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** System on requirement entry
- **Trigger:** Plan fulfilable request
- **Dependencies:** Live stock; minimum-lab objective
- **Affected components/entities:** Fulfilment plan; lab/stock
- **Affected state transitions:** Planning only; no automatic reservation
- **Validation requirement / derived acceptance check:** Plan creation alone does not decrement stock or create a reservation
- **Unresolved questions:** OD-04 OD-09
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0020 — approval

Consumable route is Student → Mentor → Central Store system stage → HoD → issuing-lab Assistant

- **Source:** SRC-02
- **Source location:** L; O; UAQ5/25
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Lead, Mentor, In-Charge, HoD; Central Store system stage
- **Trigger:** Submit/decide request
- **Dependencies:** Project authority; role/lab mappings; current request version
- **Affected components/entities:** Request, approval timeline
- **Affected state transitions:** DRAFT/SUBMITTED/review/HOD_REVIEW/APPROVED or REJECTED
- **Validation requirement / derived acceptance check:** Normal issue cannot bypass required class-specific stages
- **Unresolved questions:** OD-06
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0021 — approval

Asset route is Student → Mentor → relevant In-Charge → HoD → issuing-lab Assistant

- **Source:** SRC-02
- **Source location:** L; O; UAQ5
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Lead, Mentor, In-Charge, HoD; Central Store system stage
- **Trigger:** Submit/decide request
- **Dependencies:** Project authority; role/lab mappings; current request version
- **Affected components/entities:** Request, approval timeline
- **Affected state transitions:** DRAFT/SUBMITTED/review/HOD_REVIEW/APPROVED or REJECTED
- **Validation requirement / derived acceptance check:** Asset approval cannot omit In-Charge or HoD
- **Unresolved questions:** OD-06 OD-09
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0022 — approval

Central Store is system/inventory-management stage validating stock/plan before HoD, not a separate user role

- **Source:** SRC-02
- **Source location:** O; UAQ25
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Lead, Mentor, In-Charge, HoD; Central Store system stage
- **Trigger:** Submit/decide request
- **Dependencies:** Project authority; role/lab mappings; current request version
- **Affected components/entities:** Request, approval timeline
- **Affected state transitions:** DRAFT/SUBMITTED/review/HOD_REVIEW/APPROVED or REJECTED
- **Validation requirement / derived acceptance check:** Do not invent a Central Store login role
- **Unresolved questions:** OD-15
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0023 — approval

Mentor/In-Charge approve or reject; do not silently rewrite requested duration/quantity

- **Source:** SRC-02
- **Source location:** R; SRC-03 section 4.2
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Lead, Mentor, In-Charge, HoD; Central Store system stage
- **Trigger:** Submit/decide request
- **Dependencies:** Project authority; role/lab mappings; current request version
- **Affected components/entities:** Request, approval timeline
- **Affected state transitions:** DRAFT/SUBMITTED/review/HOD_REVIEW/APPROVED or REJECTED
- **Validation requirement / derived acceptance check:** Decision is against recorded request payload and authorized version
- **Unresolved questions:** OD-05 OD-06
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0024 — issue

Asset in-college use and outside/take-home permission differ; both create checkout/use with start, due time and reconciliation

- **Source:** SRC-02
- **Source location:** L; UAQ28; SRC-03 section 8.3
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Authorized issuing-lab Assistant
- **Trigger:** Physical handover/use start
- **Dependencies:** Approvals; claim; stock; duration; audit/outbox
- **Affected components/entities:** Order, issue, stock/asset, SQL transaction
- **Affected state transitions:** APPROVED/FULFILMENT_PENDING → ISSUED/IN_USE or FULFILMENT_FAILED_STOCK
- **Validation requirement / derived acceptance check:** In-college use cannot become an untracked permission-only action
- **Unresolved questions:** OD-06 OD-10
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0025 — approval

Request/reservation/asset/extension state families remain distinct and use Q0 recorded states

- **Source:** SRC-02
- **Source location:** Q0; SRC-03 section 9
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Lead, Mentor, In-Charge, HoD; Central Store system stage
- **Trigger:** Submit/decide request
- **Dependencies:** Project authority; role/lab mappings; current request version
- **Affected components/entities:** Request, approval timeline
- **Affected state transitions:** DRAFT/SUBMITTED/review/HOD_REVIEW/APPROVED or REJECTED
- **Validation requirement / derived acceptance check:** Review all legal paths and reject undefined transitions
- **Unresolved questions:** OD-06 OD-04
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0026 — issue

Issuing-lab Assistant confirms a specific matching asset using SIT Barcode/Default ID at operational stage

- **Source:** SRC-02
- **Source location:** P; UAQ27
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Authorized issuing-lab Assistant
- **Trigger:** Physical handover/use start
- **Dependencies:** Approvals; claim; stock; duration; audit/outbox
- **Affected components/entities:** Order, issue, stock/asset, SQL transaction
- **Affected state transitions:** APPROVED/FULFILMENT_PENDING → ISSUED/IN_USE or FULFILMENT_FAILED_STOCK
- **Validation requirement / derived acceptance check:** Unknown barcode, wrong lab or unavailable unit cannot issue
- **Unresolved questions:** OD-07 OD-10
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0027 — issue

Issue locks/rechecks SQL stock/asset and atomically commits inventory, issue, audit and outbox

- **Source:** SRC-02
- **Source location:** L1; BL7; SRC-03 section 11
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Authorized issuing-lab Assistant
- **Trigger:** Physical handover/use start
- **Dependencies:** Approvals; claim; stock; duration; audit/outbox
- **Affected components/entities:** Order, issue, stock/asset, SQL transaction
- **Affected state transitions:** APPROVED/FULFILMENT_PENDING → ISSUED/IN_USE or FULFILMENT_FAILED_STOCK
- **Validation requirement / derived acceptance check:** Concurrent issues cannot oversell or double-assign; failure rolls back SQL writes
- **Unresolved questions:** OD-10 OD-12
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0028 — issue

Stock race produces FULFILMENT_FAILED_STOCK with audit/notification; no automatic partial fulfilment

- **Source:** SRC-02
- **Source location:** L1; BL6
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Authorized issuing-lab Assistant
- **Trigger:** Physical handover/use start
- **Dependencies:** Approvals; claim; stock; duration; audit/outbox
- **Affected components/entities:** Order, issue, stock/asset, SQL transaction
- **Affected state transitions:** APPROVED/FULFILMENT_PENDING → ISSUED/IN_USE or FULFILMENT_FAILED_STOCK
- **Validation requirement / derived acceptance check:** Shortage cannot silently reduce approved order quantity
- **Unresolved questions:** OD-10
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0029 — issue

Duplicate state-changing submissions must not duplicate issue/transition; idempotency is required where applicable

- **Source:** SRC-02
- **Source location:** L1; BL9; SRC-03 section 24
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Authorized issuing-lab Assistant
- **Trigger:** Physical handover/use start
- **Dependencies:** Approvals; claim; stock; duration; audit/outbox
- **Affected components/entities:** Order, issue, stock/asset, SQL transaction
- **Affected state transitions:** APPROVED/FULFILMENT_PENDING → ISSUED/IN_USE or FULFILMENT_FAILED_STOCK
- **Validation requirement / derived acceptance check:** Replay after ambiguous response produces one committed effect
- **Unresolved questions:** OD-12
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0030 — duration

Student selects duration; due date computed from approved issue/use start; no universal hard-coded borrowing period

- **Source:** SRC-02
- **Source location:** R; UAQ12
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Student; reviewers; issuing Assistant
- **Trigger:** Request duration / issue start
- **Dependencies:** Approved request and actual start
- **Affected components/entities:** Issue/use due-date version
- **Affected state transitions:** Approved issue receives due time
- **Validation requirement / derived acceptance check:** Preserve requested duration through review and verify due time
- **Unresolved questions:** OD-11
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0031 — extension

Extensions follow original authority path; old due date remains until approval; approved extension preserves old due-date history

- **Source:** SRC-02
- **Source location:** S; Q0
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Requester and original approval actors
- **Trigger:** Extension request
- **Dependencies:** Active issue; original approval route; current due date
- **Affected components/entities:** Extension and due-date history
- **Affected state transitions:** REQUESTED → APPROVED or REJECTED
- **Validation requirement / derived acceptance check:** Pending/rejected extension does not stop reminders; approval creates dated version
- **Unresolved questions:** OD-11
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0032 — extension

V1 permits maximum two extensions as configurable demo value, not institutional law

- **Source:** SRC-02
- **Source location:** S; UAQ12
- **Authority:** CONFIGURATION_OR_SIZING_ASSUMPTION
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** ASSUMPTION
- **Actor:** Requester and original approval actors
- **Trigger:** Extension request
- **Dependencies:** Active issue; original approval route; current due date
- **Affected components/entities:** Extension and due-date history
- **Affected state transitions:** REQUESTED → APPROVED or REJECTED
- **Validation requirement / derived acceptance check:** Boundary cases use configured maximum
- **Unresolved questions:** OD-11
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0033 — reminders

Reminder five days before due and daily after due to student and relevant lab personnel

- **Source:** SRC-02
- **Source location:** T; SRC-04 reminder note
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Primary scheduler and role-derived recipients
- **Trigger:** Due/overdue/recovery obligation
- **Dependencies:** Current due date; active issue; notification outbox
- **Affected components/entities:** Scheduler, due-date version, notification obligation
- **Affected state transitions:** Processing/delivery states unspecified
- **Validation requirement / derived acceptance check:** Demonstrate pre-due/overdue obligations without reminders after closure
- **Unresolved questions:** OD-11
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0034 — reminders

V1 overdue recipients days 0–4 student/assistant, day 5 add mentor, day 7 add In-Charge/HoD and formally escalate

- **Source:** SRC-02
- **Source location:** U; AA6; UAQ32
- **Authority:** CONFIGURATION_OR_SIZING_ASSUMPTION
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** ASSUMPTION
- **Actor:** Primary scheduler and role-derived recipients
- **Trigger:** Due/overdue/recovery obligation
- **Dependencies:** Current due date; active issue; notification outbox
- **Affected components/entities:** Scheduler, due-date version, notification obligation
- **Affected state transitions:** Processing/delivery states unspecified
- **Validation requirement / derived acceptance check:** Validate role-derived day-5/day-7 recipients
- **Unresolved questions:** OD-03 OD-11
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0035 — reservation

Approved uncollected request expires after configurable 48 hours, audits/notifies and releases associated hold

- **Source:** SRC-02
- **Source location:** U1
- **Authority:** CONFIGURATION_OR_SIZING_ASSUMPTION
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** ASSUMPTION
- **Actor:** Student; Assistant/HoD override; scheduler
- **Trigger:** Unavailable item / availability / expiry
- **Dependencies:** Inventory class; queue order; timers; authorization
- **Affected components/entities:** Queue, possible hold, stock/type
- **Affected state transitions:** WAITING_FIFO → FULFILABLE → FULFILLED; EXPIRED/CANCELLED
- **Validation requirement / derived acceptance check:** Expiry cannot cancel a physically issued order
- **Unresolved questions:** OD-04 OD-10
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0036 — reservation

Both classes support FIFO reservation; assets reserve type before physical unit assignment

- **Source:** SRC-02
- **Source location:** V; UAQ11
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Student; Assistant/HoD override; scheduler
- **Trigger:** Unavailable item / availability / expiry
- **Dependencies:** Inventory class; queue order; timers; authorization
- **Affected components/entities:** Queue, possible hold, stock/type
- **Affected state transitions:** WAITING_FIFO → FULFILABLE → FULFILLED; EXPIRED/CANCELLED
- **Validation requirement / derived acceptance check:** FIFO and type/unit distinction survive availability changes
- **Unresolved questions:** OD-04
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0037 — reservation

Reservation expiry is configurable 24 hours; release expired priority and advance next reservation

- **Source:** SRC-02
- **Source location:** V; UAQ11
- **Authority:** CONFIGURATION_OR_SIZING_ASSUMPTION
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** ASSUMPTION
- **Actor:** Student; Assistant/HoD override; scheduler
- **Trigger:** Unavailable item / availability / expiry
- **Dependencies:** Inventory class; queue order; timers; authorization
- **Affected components/entities:** Queue, possible hold, stock/type
- **Affected state transitions:** WAITING_FIFO → FULFILABLE → FULFILLED; EXPIRED/CANCELLED
- **Validation requirement / derived acceptance check:** Agreed timer start produces one expiry and queue advance
- **Unresolved questions:** OD-04 OD-11
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0038 — reservation

Assistant may override FIFO with reason/audit; HoD may override with audit; preserve old/new positions, role, actor, reason and time

- **Source:** SRC-02
- **Source location:** V; UAQ11
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Student; Assistant/HoD override; scheduler
- **Trigger:** Unavailable item / availability / expiry
- **Dependencies:** Inventory class; queue order; timers; authorization
- **Affected components/entities:** Queue, possible hold, stock/type
- **Affected state transitions:** WAITING_FIFO → FULFILABLE → FULFILLED; EXPIRED/CANCELLED
- **Validation requirement / derived acceptance check:** Unauthorized reorder denied and valid reorder preserves provenance
- **Unresolved questions:** OD-08
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0039 — cancellation

Student cancellation allowed pre-issue and WAITING_FIFO; terminal CANCELLED, audit, hold release, queue advance, notification

- **Source:** SRC-02
- **Source location:** UAQ26; SRC-03 section 12
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Authorized Project Lead
- **Trigger:** Withdraw before issue
- **Dependencies:** Project authority; physical issue boundary
- **Affected components/entities:** Request/reservation/hold
- **Affected state transitions:** Eligible pre-issue / WAITING_FIFO → CANCELLED
- **Validation requirement / derived acceptance check:** Issue/cancel race cannot both succeed; issued items close through return
- **Unresolved questions:** OD-04 OD-10
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0040 — return

Both classes require Assistant return inspection/reconciliation, student acknowledgement, closure, audit and notification

- **Source:** SRC-02
- **Source location:** W
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Returning student/project and inspecting Assistant
- **Trigger:** Physical return
- **Dependencies:** Original issue; inspection; quantity conservation
- **Affected components/entities:** Return, inspection, original issue, asset/stock
- **Affected state transitions:** Issued/use → closure and condition-dependent physical state
- **Validation requirement / derived acceptance check:** Trace physical return to stock/asset state and acknowledgement
- **Unresolved questions:** OD-10 OD-16
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0041 — return

Asset inspection records barcode, PASS/FAIL/NOT_TESTED, condition, missing parts, damage, evidence, remarks, actor/time

- **Source:** SRC-02
- **Source location:** W1
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Returning student/project and inspecting Assistant
- **Trigger:** Physical return
- **Dependencies:** Original issue; inspection; quantity conservation
- **Affected components/entities:** Return, inspection, original issue, asset/stock
- **Affected state transitions:** Issued/use → closure and condition-dependent physical state
- **Validation requirement / derived acceptance check:** Damaged asset cannot silently become AVAILABLE
- **Unresolved questions:** OD-16
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0042 — return

Consumable inspection records expected/returned/good/bad/missing quantities and test result where relevant; no standard photo requirement

- **Source:** SRC-02
- **Source location:** W2
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Returning student/project and inspecting Assistant
- **Trigger:** Physical return
- **Dependencies:** Original issue; inspection; quantity conservation
- **Affected components/entities:** Return, inspection, original issue, asset/stock
- **Affected state transitions:** Issued/use → closure and condition-dependent physical state
- **Validation requirement / derived acceptance check:** Returned good/bad quantities reconcile with physical count
- **Unresolved questions:** OD-16
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0043 — return

Issue subtracts good/total; good or bad returns restore respective quantity/total; lost stock is not restored

- **Source:** SRC-02
- **Source location:** W3
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Returning student/project and inspecting Assistant
- **Trigger:** Physical return
- **Dependencies:** Original issue; inspection; quantity conservation
- **Affected components/entities:** Return, inspection, original issue, asset/stock
- **Affected state transitions:** Issued/use → closure and condition-dependent physical state
- **Validation requirement / derived acceptance check:** Conservation tests cover good/bad/missing returns and duplicate replay
- **Unresolved questions:** OD-10 OD-16
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0044 — repair

Repair moves bad to good without changing total; asset requires authorized verification before AVAILABLE

- **Source:** SRC-02
- **Source location:** W3
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Authorized verifier; exact role open
- **Trigger:** Repair completion
- **Dependencies:** Inspection history; inventory authorization
- **Affected components/entities:** Asset or good/bad stock, repair history
- **Affected state transitions:** DEFECTIVE/UNDER_REPAIR → AVAILABLE; bad → good
- **Validation requirement / derived acceptance check:** Repair preserves count and history
- **Unresolved questions:** OD-16
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0045 — retention

RETAINED_IN_PROJECT closes issue without second decrement or restored availability; retain physical asset register/history

- **Source:** SRC-02
- **Source location:** W4; SRC-03 section 18
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Department project handover participants; authority open
- **Trigger:** Project retained by department
- **Dependencies:** Original issue; handover confirmation
- **Affected components/entities:** Issue closure, project and inventory
- **Affected state transitions:** Closed; asset RETAINED_IN_PROJECT
- **Validation requirement / derived acceptance check:** Retained closure neither double-decrements nor restores issued stock
- **Unresolved questions:** OD-16
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0046 — accountability

Record damage/defect/loss linked to item, student, project, original issue, actor/time, evidence, condition, repair and attribution

- **Source:** SRC-02
- **Source location:** X; Z1
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Inspector/attribution actor; authorized viewers; HoD corrector
- **Trigger:** Incident, correction or score view
- **Dependencies:** Original issue; human attribution; resolved scope
- **Affected components/entities:** Incident ledger; optional score
- **Affected state transitions:** Recorded/voided incident; derived flag if adopted
- **Validation requirement / derived acceptance check:** Normal wear does not automatically become student misconduct
- **Unresolved questions:** OD-13 OD-16
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0047 — accountability

Automated monetary penalties/payment consequences are out of V1

- **Source:** SRC-02
- **Source location:** Y; UAQ13; AW19
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Inspector/attribution actor; authorized viewers; HoD corrector
- **Trigger:** Incident, correction or score view
- **Dependencies:** Original issue; human attribution; resolved scope
- **Affected components/entities:** Incident ledger; optional score
- **Affected state transitions:** Recorded/voided incident; derived flag if adopted
- **Validation requirement / derived acceptance check:** No score/incident/overdue action creates automatic fine or access block
- **Unresolved questions:** OD-13
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0048 — accountability

Repeated-offender information only visible to authorized Faculty, HoD and In-Charge; no automatic borrowing/FIFO restrictions

- **Source:** SRC-02
- **Source location:** A3; UAQ15; Z4
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Inspector/attribution actor; authorized viewers; HoD corrector
- **Trigger:** Incident, correction or score view
- **Dependencies:** Original issue; human attribution; resolved scope
- **Affected components/entities:** Incident ledger; optional score
- **Affected state transitions:** Recorded/voided incident; derived flag if adopted
- **Validation requirement / derived acceptance check:** Role-scoped visibility and no automatic punitive mutation
- **Unresolved questions:** OD-13 OD-15
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0049 — accountability

Explainable REPO formula is current in Z/UAQ29 but unnecessary/future in A3/UAQ15/AK/AW19; scope unresolved

- **Source:** SRC-02
- **Source location:** Z; UAQ15/29; AK; AW19/48–50; SRC-03 section 20
- **Authority:** CONFLICTED_CURRENT
- **Status:** CONFLICTED / AWAITING_VALIDATION
- **Type:** PROPOSAL
- **Actor:** Inspector/attribution actor; authorized viewers; HoD corrector
- **Trigger:** Incident, correction or score view
- **Dependencies:** Original issue; human attribution; resolved scope
- **Affected components/entities:** Incident ledger; optional score
- **Affected state transitions:** Recorded/voided incident; derived flag if adopted
- **Validation requirement / derived acceptance check:** Get explicit scope resolution before treating formula as V1 requirement
- **Unresolved questions:** OD-13
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0050 — accountability

Recorded proposed flag is two confirmed incidents in 180 days OR REPO at least 35; HoD corrections recompute score

- **Source:** SRC-02
- **Source location:** Z4/Z5; UAQ29
- **Authority:** CONFLICTED_CURRENT
- **Status:** CONFLICTED / AWAITING_VALIDATION
- **Type:** PROPOSAL
- **Actor:** Inspector/attribution actor; authorized viewers; HoD corrector
- **Trigger:** Incident, correction or score view
- **Dependencies:** Original issue; human attribution; resolved scope
- **Affected components/entities:** Incident ledger; optional score
- **Affected state transitions:** Recorded/voided incident; derived flag if adopted
- **Validation requirement / derived acceptance check:** If adopted test window boundaries, corrections and contribution rules
- **Unresolved questions:** OD-13
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0051 — accountability

TF-IDF/logistic regression on synthetic remarks is preferred advisory NLP; no incident creation or override of human attribution

- **Source:** SRC-02
- **Source location:** Z2/Z3
- **Authority:** CONFLICTED_CURRENT
- **Status:** CONFLICTED / AWAITING_VALIDATION
- **Type:** PROPOSAL
- **Actor:** Inspector/attribution actor; authorized viewers; HoD corrector
- **Trigger:** Incident, correction or score view
- **Dependencies:** Original issue; human attribution; resolved scope
- **Affected components/entities:** Incident ledger; optional score
- **Affected state transitions:** Recorded/voided incident; derived flag if adopted
- **Validation requirement / derived acceptance check:** Human zero attribution contributes zero; test model only if adopted
- **Unresolved questions:** OD-13 OD-18
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0052 — notifications

Domain transaction writes SQL outbox; notifications fan out independently to in-app and email

- **Source:** SRC-02
- **Source location:** AA1; BL3
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Outbox dispatcher and scoped recipients
- **Trigger:** Committed domain event
- **Dependencies:** Committed event; role mapping; channel adapters
- **Affected components/entities:** SQL outbox, Mongo in-app/delivery, EmailProvider
- **Affected state transitions:** Pending/delivery result; concrete enum absent
- **Validation requirement / derived acceptance check:** Commit persists event; channel failure cannot reverse domain state
- **Unresolved questions:** OD-12
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0053 — notifications

Mongo stores notification/delivery documents; event-recipient-channel idempotency prevents duplicate effects

- **Source:** SRC-02
- **Source location:** AA2/4; BL2
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Outbox dispatcher and scoped recipients
- **Trigger:** Committed domain event
- **Dependencies:** Committed event; role mapping; channel adapters
- **Affected components/entities:** SQL outbox, Mongo in-app/delivery, EmailProvider
- **Affected state transitions:** Pending/delivery result; concrete enum absent
- **Validation requirement / derived acceptance check:** Consumer replay does not create duplicate notification records
- **Unresolved questions:** OD-12
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0054 — notifications

Dedicated sender with Gmail API adapter; email links to live website state and does not itself authorize approvals

- **Source:** SRC-02
- **Source location:** AA3/5; UAQ30
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Outbox dispatcher and scoped recipients
- **Trigger:** Committed domain event
- **Dependencies:** Committed event; role mapping; channel adapters
- **Affected components/entities:** SQL outbox, Mongo in-app/delivery, EmailProvider
- **Affected state transitions:** Pending/delivery result; concrete enum absent
- **Validation requirement / derived acceptance check:** Website action revalidates actor/current request despite old email
- **Unresolved questions:** OD-12 OD-14
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0055 — approval

Approval timeline stores actor/role/time/action/remarks/old-new state; action emits follow-up event

- **Source:** SRC-02
- **Source location:** AA5; SRC-03 section 10.1
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Lead, Mentor, In-Charge, HoD; Central Store system stage
- **Trigger:** Submit/decide request
- **Dependencies:** Project authority; role/lab mappings; current request version
- **Affected components/entities:** Request, approval timeline
- **Affected state transitions:** DRAFT/SUBMITTED/review/HOD_REVIEW/APPROVED or REJECTED
- **Validation requirement / derived acceptance check:** Timeline and request state agree after correction/retry
- **Unresolved questions:** OD-06 OD-12
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0056 — notifications

AA6 role/entity-based recipient matrix covers submissions, decisions, issue/return, extensions, reservations, overdue, incidents and failures

- **Source:** SRC-02
- **Source location:** AA6; UAQ32
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Outbox dispatcher and scoped recipients
- **Trigger:** Committed domain event
- **Dependencies:** Committed event; role mapping; channel adapters
- **Affected components/entities:** SQL outbox, Mongo in-app/delivery, EmailProvider
- **Affected state transitions:** Pending/delivery result; concrete enum absent
- **Validation requirement / derived acceptance check:** Each event class maps to intended relationship-derived recipients
- **Unresolved questions:** OD-03 OD-15
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0057 — recommendation

Optional AI alternatives use curated candidates, deterministic filters, explanation/ranking and live MySQL validation

- **Source:** SRC-02
- **Source location:** M; N; UAQ31
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Student; optional recommendation service
- **Trigger:** Alternative/advice request
- **Dependencies:** Catalogue candidates; live MySQL; optional adapter
- **Affected components/entities:** Curated mappings, LLM adapter, live validator
- **Affected state transitions:** Recommendation/provenance only; no domain writes
- **Validation requirement / derived acceptance check:** Reject invented/unavailable candidates; preserve non-AI discovery path
- **Unresolved questions:** OD-18
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0058 — recommendation

Recorded LLM adapter is BrowserAPIFree → ChatGPT with initial snapshot, deltas and recommendation provenance

- **Source:** SRC-02
- **Source location:** N; AK; BL1
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Student; optional recommendation service
- **Trigger:** Alternative/advice request
- **Dependencies:** Catalogue candidates; live MySQL; optional adapter
- **Affected components/entities:** Curated mappings, LLM adapter, live validator
- **Affected state transitions:** Recommendation/provenance only; no domain writes
- **Validation requirement / derived acceptance check:** Validate missing external contract before claiming working integration
- **Unresolved questions:** OD-18
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0059 — recommendation

AI cannot mutate inventory, approve, issue, change FIFO or determine institutional status

- **Source:** SRC-02
- **Source location:** N
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Student; optional recommendation service
- **Trigger:** Alternative/advice request
- **Dependencies:** Catalogue candidates; live MySQL; optional adapter
- **Affected components/entities:** Curated mappings, LLM adapter, live validator
- **Affected state transitions:** Recommendation/provenance only; no domain writes
- **Validation requirement / derived acceptance check:** Model output has no domain-write authority
- **Unresolved questions:** OD-18
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0060 — analytics

Unmet-demand analytics serve Central Store inventory management; no procurement execution

- **Source:** SRC-02
- **Source location:** AB; AQ; UAQ21
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Authorized inventory management; exact role open
- **Trigger:** Shortage/demand report
- **Dependencies:** Shortage trigger; role permissions
- **Affected components/entities:** Unmet-demand events and Mongo analytics
- **Affected state transitions:** Event/aggregate states unspecified
- **Validation requirement / derived acceptance check:** Aggregate shortages without purchase orders or AI dependence
- **Unresolved questions:** OD-15 OD-19
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0061 — identity

All prototype identities/master data/inventory synthetic, replaceable outside domain logic

- **Source:** SRC-02
- **Source location:** AC; AE; BK
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Synthetic user / technical administrator; future IT administrator
- **Trigger:** Login or master-data maintenance
- **Dependencies:** Server-side authorization; synthetic data boundary
- **Affected components/entities:** User, roles, mappings, AuthProvider
- **Affected state transitions:** Session/master-data lifecycle unspecified
- **Validation requirement / derived acceptance check:** Swap seed data without rewriting business workflows
- **Unresolved questions:** OD-14 OD-19
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0062 — identity

Replaceable AuthProvider for synthetic V1 authentication; future IT SSO protocol deferred

- **Source:** SRC-02
- **Source location:** AD; UAQ1
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Synthetic user / technical administrator; future IT administrator
- **Trigger:** Login or master-data maintenance
- **Dependencies:** Server-side authorization; synthetic data boundary
- **Affected components/entities:** User, roles, mappings, AuthProvider
- **Affected state transitions:** Session/master-data lifecycle unspecified
- **Validation requirement / derived acceptance check:** Authorization remains backend-enforced across identity adapters
- **Unresolved questions:** OD-14
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0063 — security

Server-side RBAC with project/lab scope, validated input, parameterized SQL and secrets outside repository

- **Source:** SRC-02
- **Source location:** AG; SRC-03 section 28
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Every API actor
- **Trigger:** Every protected read/write
- **Dependencies:** Identity and domain relationship mappings
- **Affected components/entities:** API authorization/project/lab scope
- **Affected state transitions:** Denied action leaves domain unchanged
- **Validation requirement / derived acceptance check:** Negative authorization and validation checks for domain reads/writes
- **Unresolved questions:** OD-14 OD-15
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0064 — override

Audit/history append-only; HoD corrections preserve before/after and compensating event; normal hard deletion prohibited

- **Source:** SRC-02
- **Source location:** AG; AH
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** HoD
- **Trigger:** Correction/overwrite
- **Dependencies:** HoD authority; source record; historical preservation
- **Affected components/entities:** Affected record and append-only audit
- **Affected state transitions:** Correction transition rules incomplete
- **Validation requirement / derived acceptance check:** Correction cannot erase original historical event
- **Unresolved questions:** OD-08 OD-12
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0065 — evidence

Asset photos through ObjectStorageAdapter/S3 with secure DB references; damaged/defective photo required unless configured exception

- **Source:** SRC-02
- **Source location:** W1; AG; UAQ33
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Assistant / authorized evidence viewer
- **Trigger:** Inspection upload/view
- **Dependencies:** Asset inspection; authorization; storage adapter
- **Affected components/entities:** ObjectStorageAdapter and metadata
- **Affected state transitions:** Upload/link lifecycle unspecified
- **Validation requirement / derived acceptance check:** Required evidence failure cannot be silently ignored; unauthorized reads denied
- **Unresolved questions:** OD-16 OD-17
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0066 — contracts

Recorded stack React/Vite/TypeScript, Python/FastAPI/Pydantic, REST/OpenAPI/generated clients

- **Source:** SRC-02
- **Source location:** AK; BL1; SRC-03 sections 24/25
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Backend/frontend owners
- **Trigger:** API publication/use
- **Dependencies:** Validated domain state/schema; no existing contract artifact
- **Affected components/entities:** REST/OpenAPI and generated clients
- **Affected state transitions:** Per-operation state depends on workflow
- **Validation requirement / derived acceptance check:** Future client/server contract validation; app presently absent
- **Unresolved questions:** OD-20
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0067 — data

MySQL 8.4/InnoDB + SQLAlchemy 2.x/Alembic owns domain state/outbox; Mongo limited to document/event/analytics

- **Source:** SRC-02
- **Source location:** BL1/2; AK
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Domain/persistence boundaries
- **Trigger:** Business transaction/projection
- **Dependencies:** Domain invariants; audit/outbox durability
- **Affected components/entities:** MySQL and MongoDB
- **Affected state transitions:** SQL commit then document projection
- **Validation requirement / derived acceptance check:** Mongo projections cannot override transactional state
- **Unresolved questions:** OD-12 OD-20
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0068 — reminders

Primary APScheduler/simple scheduler; no Redis V1; idempotent missed-obligation scan after restart

- **Source:** SRC-02
- **Source location:** AK; BL10; SRC-03 section 30
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Primary scheduler and role-derived recipients
- **Trigger:** Due/overdue/recovery obligation
- **Dependencies:** Current due date; active issue; notification outbox
- **Affected components/entities:** Scheduler, due-date version, notification obligation
- **Affected state transitions:** Processing/delivery states unspecified
- **Validation requirement / derived acceptance check:** Restart catches missed obligations without duplicate processing
- **Unresolved questions:** OD-11 OD-12 OD-21
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0069 — deployment

AWS primary, Azure isolated staging/DR-ready, GCP analytics/read-only; one writer and active scheduler

- **Source:** SRC-02
- **Source location:** AF; BL12
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Technical owner/operator
- **Trigger:** Deploy/restart/promotion
- **Dependencies:** Synthetic data; single writer and scheduler
- **Affected components/entities:** Containers, cloud adapters, scheduler
- **Affected state transitions:** Promotion/recovery protocol unspecified
- **Validation requirement / derived acceptance check:** Secondary cannot write competing state or send duplicate reminders; controlled promotion
- **Unresolved questions:** OD-21
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0070 — deployment

Portable Docker images, Compose option, GitHub Actions and preferred Terraform/provider modules

- **Source:** SRC-02
- **Source location:** AK; BL1/12
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Technical owner/operator
- **Trigger:** Deploy/restart/promotion
- **Dependencies:** Synthetic data; single writer and scheduler
- **Affected components/entities:** Containers, cloud adapters, scheduler
- **Affected state transitions:** Promotion/recovery protocol unspecified
- **Validation requirement / derived acceptance check:** Reproduce app version across approved demo environments
- **Unresolved questions:** OD-21
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0071 — scope

Web first; future Capacitor/mobile reuses API/auth and is not V1 dependency

- **Source:** SRC-02
- **Source location:** BB; BL13; SRC-03 section 37
- **Authority:** RECORDED_FUTURE
- **Status:** DEFERRED
- **Type:** FUTURE
- **Actor:** Project owner
- **Trigger:** Scope review
- **Dependencies:** None; scope prerequisite
- **Affected components/entities:** Department/product boundary
- **Affected state transitions:** No independent runtime transition
- **Validation requirement / derived acceptance check:** Web lifecycle works without mobile release
- **Unresolved questions:** OD-21
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0072 — scope

Asset transfers, cross-department sharing, procurement, institutional rollout, full notebook migration/app-store release excluded V1

- **Source:** SRC-02
- **Source location:** AI; AJ; AK; AC; BB
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Project owner
- **Trigger:** Scope review
- **Dependencies:** None; scope prerequisite
- **Affected components/entities:** Department/product boundary
- **Affected state transitions:** No independent runtime transition
- **Validation requirement / derived acceptance check:** Do not silently add deferred capabilities to V1
- **Unresolved questions:** OD-02
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0073 — academic

DCDS Python/SQL/NoSQL/advanced queries/code-docs-UI/testing-validation-security-errors: 2+2+2+2+1+1 marks

- **Source:** SRC-05
- **Source location:** SRC-05 pp1–3; AM
- **Authority:** ACADEMIC_OFFICIAL
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Project owners and evaluators
- **Trigger:** Evaluation/demonstration
- **Dependencies:** Official rubric and real application evidence
- **Affected components/entities:** Evidence, queries/reports, documentation
- **Affected state transitions:** N/A: academic constraint, not domain state
- **Validation requirement / derived acceptance check:** Map evidence to all six official criteria
- **Unresolved questions:** OD-19 OD-22
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0074 — academic

Meaningful joins/subqueries/grouping/stored procedure/Mongo aggregation and controlled Python import/export

- **Source:** SRC-02
- **Source location:** BL11; SRC-05 pp2–3
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Project owners and evaluators
- **Trigger:** Evaluation/demonstration
- **Dependencies:** Official rubric and real application evidence
- **Affected components/entities:** Evidence, queries/reports, documentation
- **Affected state transitions:** N/A: academic constraint, not domain state
- **Validation requirement / derived acceptance check:** Demonstrate real LabTrack use of database and file-handling operations
- **Unresolved questions:** OD-19
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0075 — academic

CCE topic/research/presentation/running-example/viva marks 5/5/5/10/5; tentative 19 October 2026

- **Source:** SRC-06
- **Source location:** SRC-06 pp1–2; AN
- **Authority:** ACADEMIC_OFFICIAL
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Project owners and evaluators
- **Trigger:** Evaluation/demonstration
- **Dependencies:** Official rubric and real application evidence
- **Affected components/entities:** Evidence, queries/reports, documentation
- **Affected state transitions:** N/A: academic constraint, not domain state
- **Validation requirement / derived acceptance check:** Actual research references and working running example required
- **Unresolved questions:** OD-22
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0076 — academic

Live cloud and unified CCE/DCDS project are recorded user goals; three providers are project choice, not explicit rubric mandate

- **Source:** SRC-02
- **Source location:** AN; AO; AF
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Project owners and evaluators
- **Trigger:** Evaluation/demonstration
- **Dependencies:** Official rubric and real application evidence
- **Affected components/entities:** Evidence, queries/reports, documentation
- **Affected state transitions:** N/A: academic constraint, not domain state
- **Validation requirement / derived acceptance check:** Integrated synthetic cloud lifecycle demonstration
- **Unresolved questions:** OD-21 OD-22
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0077 — academic

Ishaan lead/backend and Raghu frontend; reported four-member/same-division academic registration rule lacks supplied primary evidence

- **Source:** SRC-02
- **Source location:** AL; SRC-08 initial setup
- **Authority:** UNVERIFIED_ACADEMIC_CLAIM
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** UNKNOWN
- **Actor:** Project owners and evaluators
- **Trigger:** Evaluation/demonstration
- **Dependencies:** Official rubric and real application evidence
- **Affected components/entities:** Evidence, queries/reports, documentation
- **Affected state transitions:** N/A: academic constraint, not domain state
- **Validation requirement / derived acceptance check:** Obtain registration evidence; do not invent implementation owners
- **Unresolved questions:** OD-22
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0078 — deployment

8–10 labs, 10–12 assistants, 700–800 students, 5–10 concurrent users are approximate broader-environment sizing assumptions

- **Source:** SRC-02
- **Source location:** C
- **Authority:** CONFIGURATION_OR_SIZING_ASSUMPTION
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** ASSUMPTION
- **Actor:** Technical owner/operator
- **Trigger:** Deploy/restart/promotion
- **Dependencies:** Synthetic data; single writer and scheduler
- **Affected components/entities:** Containers, cloud adapters, scheduler
- **Affected state transitions:** Promotion/recovery protocol unspecified
- **Validation requirement / derived acceptance check:** Do not claim measured R&A scale or performance
- **Unresolved questions:** OD-21
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0079 — quality

Define detection/safe state/recovery/retry/idempotency/UI/audit/tests for all 22 recorded error cases

- **Source:** SRC-02
- **Source location:** BL8/9; SRC-03 section 29
- **Authority:** RECORDED_CURRENT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Project owners / future implementers
- **Trigger:** Design readiness/verification
- **Dependencies:** Validated requirements and future approved SDD
- **Affected components/entities:** Error catalog, tests, traceability
- **Affected state transitions:** DESIGN-INCOMPLETE until specified
- **Validation requirement / derived acceptance check:** Trace each error class to design/acceptance evidence before readiness
- **Unresolved questions:** OD-12 OD-17 OD-20
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0080 — quality

Per-feature unit/validation/authorization/integration/error/relevant-concurrency/notification/audit tests and recorded quality gates

- **Source:** SRC-03
- **Source location:** SRC-03 section 31; BJI/BM
- **Authority:** STRUCTURAL_CONTRACT
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** Project owners / future implementers
- **Trigger:** Design readiness/verification
- **Dependencies:** Validated requirements and future approved SDD
- **Affected components/entities:** Error catalog, tests, traceability
- **Affected state transitions:** DESIGN-INCOMPLETE until specified
- **Validation requirement / derived acceptance check:** Future readiness maps meaningful tests and evidence to each operation
- **Unresolved questions:** OD-20
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0081 — governance

Preserve complete supplied SDD headings, deterministic operation structure, traceability and change control as minimum baseline

- **Source:** SRC-01
- **Source location:** SRC-01 SDD STRUCTURAL AUTHORITY; SRC-03 sections 0–42
- **Authority:** PROCESS_AUTHORITY
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** User / ASTRA / project owner
- **Trigger:** Review/approval/material change
- **Dependencies:** None; governs every requirement
- **Affected components/entities:** Persistent review and approval records
- **Affected state transitions:** AWAITING_USER_VALIDATION; no approval
- **Validation requirement / derived acceptance check:** Map every baseline heading into eventual SDD with no omissions
- **Unresolved questions:** OD-01
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0082 — governance

No canonical SDD, implementation plan or code before explicit gates; material source change invalidates affected approval

- **Source:** SRC-01
- **Source location:** SRC-01 APPROVAL GATE 1; CHANGE INVALIDATION; USER-01
- **Authority:** PROCESS_AUTHORITY
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** EXPLICIT
- **Actor:** User / ASTRA / project owner
- **Trigger:** Review/approval/material change
- **Dependencies:** None; governs every requirement
- **Affected components/entities:** Persistent review and approval records
- **Affected state transitions:** AWAITING_USER_VALIDATION; no approval
- **Validation requirement / derived acceptance check:** Gate remains unapproved with hashes and empty validated source set
- **Unresolved questions:** OD-01 OD-02
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0083 — governance

Production SSO/master data/privacy/infrastructure/retention/ownership stay separate from V1 policy

- **Source:** SRC-02
- **Source location:** UAQ1/2/17/18/19/22/33; SRC-03 section 38
- **Authority:** RECORDED_FUTURE
- **Status:** DEFERRED
- **Type:** FUTURE
- **Actor:** User / ASTRA / project owner
- **Trigger:** Review/approval/material change
- **Dependencies:** None; governs every requirement
- **Affected components/entities:** Persistent review and approval records
- **Affected state transitions:** AWAITING_USER_VALIDATION; no approval
- **Validation requirement / derived acceptance check:** Prototype validation does not imply institutional rollout approval
- **Unresolved questions:** OD-14 OD-17 OD-21 OD-22
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0084 — scope

Old 7/3/1 reminders, PostgreSQL current stack, old approval loop and three-mode inventory are explicitly deprecated by master context

- **Source:** SRC-02
- **Source location:** BJ
- **Authority:** RECORDED_DEPRECATION
- **Status:** DEPRECATED
- **Type:** DEPRECATED
- **Actor:** Project owner
- **Trigger:** Scope review
- **Dependencies:** None; scope prerequisite
- **Affected components/entities:** Department/product boundary
- **Affected state transitions:** No independent runtime transition
- **Validation requirement / derived acceptance check:** Never reactivate these rules; pitch is not used as their source
- **Unresolved questions:** OD-02
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

## REQ-LT-0085 — governance

Undefined operation fields must remain explicit decisions; no inferred policy to claim implementation readiness

- **Source:** SRC-01
- **Source location:** SRC-01 COMPLETENESS AUDIT; BL15/BM
- **Authority:** ASTRA_INFERENCE
- **Status:** EXTRACTED / AWAITING_VALIDATION
- **Type:** DERIVED
- **Actor:** User / ASTRA / project owner
- **Trigger:** Review/approval/material change
- **Dependencies:** None; governs every requirement
- **Affected components/entities:** Persistent review and approval records
- **Affected state transitions:** AWAITING_USER_VALIDATION; no approval
- **Validation requirement / derived acceptance check:** Every audit gap maps to open decision rather than fabricated behavior
- **Unresolved questions:** OD-20
- **Constraints:** All limits and exclusions in the statement apply; synthetic V1 data, server-side authorization and preserved audit/history govern relevant operations. No unresolved policy may be inferred.

