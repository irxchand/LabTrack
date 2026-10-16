# ASTRA reference graph

Version: 1.0 | 2026-10-07 | AWAITING_USER_VALIDATION

This is provenance, not an authored SDD or implementation plan. Source IDs resolve in [00_SOURCE_MANIFEST.md](00_SOURCE_MANIFEST.md); requirements in [02_REQUIREMENT_LEDGER.md](02_REQUIREMENT_LEDGER.md).

## Source relationships

- USER-01 → SRC-01 → review artifacts and approval gate.
- USER-02 → all pitch sources excluded from product/architecture authority.
- SRC-04 → support for parts of SRC-02 A3/E/G/O/T; not independent verification of every expanded rule.
- SRC-05 → SRC-02 AM and SRC-03 §36: DCDS evaluation constraints.
- SRC-06 → SRC-02 AN and SRC-03 §36: CCE evaluation constraints.
- SRC-02 ↔ SRC-03: overlapping current rules; conflicts remain explicit.
- SRC-07 → SRC-02 bootstrap and SRC-08 continuity.
- SRC-10 → no product implementation. Presentation tooling implements only slides.
- Working-copy SHA-256 hashes → exact review baseline; HEAD alone does not capture uncommitted current context.

## Requirement trace edges

Each row gives source → requirement/business rule → entity/component → state → workflow → validation. Components are conceptual source-described boundaries, not newly selected deployment units. API/schema/event contracts are MISSING as executable artifacts. VAL nodes are required validation criteria in the ledger, not existing tests or passing results. Implementation phases are DEFERRED_BY_GATE, not planned here.

| Source/location | Requirement / rule | Entity/component | State | Workflow | Validation | API / code / phase |
|---|---|---|---|---|---|---|
| SRC-02 A2; C; D; AJ | REQ-LT-0001 / BR-0001 | Department/product boundary | No independent runtime transition | scope | VAL-0001 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 PART A3 — PROJECT IDENTITY WITHIN THE SYSTEM | REQ-LT-0002 / BR-0002 | Project, membership, requirements | Create/edit; submission links to request | project | VAL-0002 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 F; UAQ23 | REQ-LT-0003 / BR-0003 | Project, membership, requirements | Create/edit; submission links to request | project | VAL-0003 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 UAQ23 | REQ-LT-0004 / BR-0004 | Project, membership, requirements | Create/edit; submission links to request | project | VAL-0004 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 E2 | REQ-LT-0005 / BR-0005 | User, roles, mappings, AuthProvider | Session/master-data lifecycle unspecified | identity | VAL-0005 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 E2; AE; SRC-04 t(5digits)/n(5digits) notes | REQ-LT-0006 / BR-0006 | User, roles, mappings, AuthProvider | Session/master-data lifecycle unspecified | identity | VAL-0006 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 E3/E4; I; SRC-04 lab incharge notes | REQ-LT-0007 / BR-0007 | Request, approval timeline | DRAFT/SUBMITTED/review/HOD_REVIEW/APPROVED or REJECTED | approval | VAL-0007 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 E5; UAQ24 | REQ-LT-0008 / BR-0008 | Operational order and lab mapping | Unclaimed → claimed conceptual state; enum absent | claim | VAL-0008 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 E6; O; SRC-04 HoD notes | REQ-LT-0009 / BR-0009 | Affected record and append-only audit | Correction transition rules incomplete | override | VAL-0009 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 E7; AG | REQ-LT-0010 / BR-0010 | User, roles, mappings, AuthProvider | Session/master-data lifecycle unspecified | identity | VAL-0010 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 G; H; UAQ7 | REQ-LT-0011 / BR-0011 | Catalogue, asset, per-lab stock | Q0 asset states; numeric good/bad/total | inventory | VAL-0011 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 G1; H1/H3; A3 | REQ-LT-0012 / BR-0012 | Catalogue, asset, per-lab stock | Q0 asset states; numeric good/bad/total | inventory | VAL-0012 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 G2; SRC-04 classes notes | REQ-LT-0013 / BR-0013 | Catalogue, asset, per-lab stock | Q0 asset states; numeric good/bad/total | inventory | VAL-0013 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 G2; H2; Q0; W3 | REQ-LT-0014 / BR-0014 | Catalogue, asset, per-lab stock | Q0 asset states; numeric good/bad/total | inventory | VAL-0014 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 G3; I; Q | REQ-LT-0015 / BR-0015 | Catalogue, asset, per-lab stock | Q0 asset states; numeric good/bad/total | inventory | VAL-0015 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 J; K; L | REQ-LT-0016 / BR-0016 | Catalogue and availability boundary | Draft requirement/shortage; exact schema absent | discovery | VAL-0016 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 I1 | REQ-LT-0017 / BR-0017 | Fulfilment plan; lab/stock | Planning only; no automatic reservation | allocation | VAL-0017 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 I1 exact prototype algorithm; SRC-03 section 7 | REQ-LT-0018 / BR-0018 | Fulfilment plan; lab/stock | Planning only; no automatic reservation | allocation | VAL-0018 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 I1 important rules; L1 | REQ-LT-0019 / BR-0019 | Fulfilment plan; lab/stock | Planning only; no automatic reservation | allocation | VAL-0019 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 L; O; UAQ5/25 | REQ-LT-0020 / BR-0020 | Request, approval timeline | DRAFT/SUBMITTED/review/HOD_REVIEW/APPROVED or REJECTED | approval | VAL-0020 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 L; O; UAQ5 | REQ-LT-0021 / BR-0021 | Request, approval timeline | DRAFT/SUBMITTED/review/HOD_REVIEW/APPROVED or REJECTED | approval | VAL-0021 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 O; UAQ25 | REQ-LT-0022 / BR-0022 | Request, approval timeline | DRAFT/SUBMITTED/review/HOD_REVIEW/APPROVED or REJECTED | approval | VAL-0022 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 R; SRC-03 section 4.2 | REQ-LT-0023 / BR-0023 | Request, approval timeline | DRAFT/SUBMITTED/review/HOD_REVIEW/APPROVED or REJECTED | approval | VAL-0023 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 L; UAQ28; SRC-03 section 8.3 | REQ-LT-0024 / BR-0024 | Order, issue, stock/asset, SQL transaction | APPROVED/FULFILMENT_PENDING → ISSUED/IN_USE or FULFILMENT_FAILED_STOCK | issue | VAL-0024 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 Q0; SRC-03 section 9 | REQ-LT-0025 / BR-0025 | Request, approval timeline | DRAFT/SUBMITTED/review/HOD_REVIEW/APPROVED or REJECTED | approval | VAL-0025 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 P; UAQ27 | REQ-LT-0026 / BR-0026 | Order, issue, stock/asset, SQL transaction | APPROVED/FULFILMENT_PENDING → ISSUED/IN_USE or FULFILMENT_FAILED_STOCK | issue | VAL-0026 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 L1; BL7; SRC-03 section 11 | REQ-LT-0027 / BR-0027 | Order, issue, stock/asset, SQL transaction | APPROVED/FULFILMENT_PENDING → ISSUED/IN_USE or FULFILMENT_FAILED_STOCK | issue | VAL-0027 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 L1; BL6 | REQ-LT-0028 / BR-0028 | Order, issue, stock/asset, SQL transaction | APPROVED/FULFILMENT_PENDING → ISSUED/IN_USE or FULFILMENT_FAILED_STOCK | issue | VAL-0028 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 L1; BL9; SRC-03 section 24 | REQ-LT-0029 / BR-0029 | Order, issue, stock/asset, SQL transaction | APPROVED/FULFILMENT_PENDING → ISSUED/IN_USE or FULFILMENT_FAILED_STOCK | issue | VAL-0029 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 R; UAQ12 | REQ-LT-0030 / BR-0030 | Issue/use due-date version | Approved issue receives due time | duration | VAL-0030 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 S; Q0 | REQ-LT-0031 / BR-0031 | Extension and due-date history | REQUESTED → APPROVED or REJECTED | extension | VAL-0031 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 S; UAQ12 | REQ-LT-0032 / BR-0032 | Extension and due-date history | REQUESTED → APPROVED or REJECTED | extension | VAL-0032 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 T; SRC-04 reminder note | REQ-LT-0033 / BR-0033 | Scheduler, due-date version, notification obligation | Processing/delivery states unspecified | reminders | VAL-0033 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 U; AA6; UAQ32 | REQ-LT-0034 / BR-0034 | Scheduler, due-date version, notification obligation | Processing/delivery states unspecified | reminders | VAL-0034 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 U1 | REQ-LT-0035 / BR-0035 | Queue, possible hold, stock/type | WAITING_FIFO → FULFILABLE → FULFILLED; EXPIRED/CANCELLED | reservation | VAL-0035 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 V; UAQ11 | REQ-LT-0036 / BR-0036 | Queue, possible hold, stock/type | WAITING_FIFO → FULFILABLE → FULFILLED; EXPIRED/CANCELLED | reservation | VAL-0036 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 V; UAQ11 | REQ-LT-0037 / BR-0037 | Queue, possible hold, stock/type | WAITING_FIFO → FULFILABLE → FULFILLED; EXPIRED/CANCELLED | reservation | VAL-0037 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 V; UAQ11 | REQ-LT-0038 / BR-0038 | Queue, possible hold, stock/type | WAITING_FIFO → FULFILABLE → FULFILLED; EXPIRED/CANCELLED | reservation | VAL-0038 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 UAQ26; SRC-03 section 12 | REQ-LT-0039 / BR-0039 | Request/reservation/hold | Eligible pre-issue / WAITING_FIFO → CANCELLED | cancellation | VAL-0039 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 W | REQ-LT-0040 / BR-0040 | Return, inspection, original issue, asset/stock | Issued/use → closure and condition-dependent physical state | return | VAL-0040 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 W1 | REQ-LT-0041 / BR-0041 | Return, inspection, original issue, asset/stock | Issued/use → closure and condition-dependent physical state | return | VAL-0041 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 W2 | REQ-LT-0042 / BR-0042 | Return, inspection, original issue, asset/stock | Issued/use → closure and condition-dependent physical state | return | VAL-0042 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 W3 | REQ-LT-0043 / BR-0043 | Return, inspection, original issue, asset/stock | Issued/use → closure and condition-dependent physical state | return | VAL-0043 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 W3 | REQ-LT-0044 / BR-0044 | Asset or good/bad stock, repair history | DEFECTIVE/UNDER_REPAIR → AVAILABLE; bad → good | repair | VAL-0044 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 W4; SRC-03 section 18 | REQ-LT-0045 / BR-0045 | Issue closure, project and inventory | Closed; asset RETAINED_IN_PROJECT | retention | VAL-0045 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 X; Z1 | REQ-LT-0046 / BR-0046 | Incident ledger; optional score | Recorded/voided incident; derived flag if adopted | accountability | VAL-0046 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 Y; UAQ13; AW19 | REQ-LT-0047 / BR-0047 | Incident ledger; optional score | Recorded/voided incident; derived flag if adopted | accountability | VAL-0047 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 A3; UAQ15; Z4 | REQ-LT-0048 / BR-0048 | Incident ledger; optional score | Recorded/voided incident; derived flag if adopted | accountability | VAL-0048 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 Z; UAQ15/29; AK; AW19/48–50; SRC-03 section 20 | REQ-LT-0049 / BR-0049 | Incident ledger; optional score | Recorded/voided incident; derived flag if adopted | accountability | VAL-0049 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 Z4/Z5; UAQ29 | REQ-LT-0050 / BR-0050 | Incident ledger; optional score | Recorded/voided incident; derived flag if adopted | accountability | VAL-0050 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 Z2/Z3 | REQ-LT-0051 / BR-0051 | Incident ledger; optional score | Recorded/voided incident; derived flag if adopted | accountability | VAL-0051 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 AA1; BL3 | REQ-LT-0052 / BR-0052 | SQL outbox, Mongo in-app/delivery, EmailProvider | Pending/delivery result; concrete enum absent | notifications | VAL-0052 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 AA2/4; BL2 | REQ-LT-0053 / BR-0053 | SQL outbox, Mongo in-app/delivery, EmailProvider | Pending/delivery result; concrete enum absent | notifications | VAL-0053 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 AA3/5; UAQ30 | REQ-LT-0054 / BR-0054 | SQL outbox, Mongo in-app/delivery, EmailProvider | Pending/delivery result; concrete enum absent | notifications | VAL-0054 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 AA5; SRC-03 section 10.1 | REQ-LT-0055 / BR-0055 | Request, approval timeline | DRAFT/SUBMITTED/review/HOD_REVIEW/APPROVED or REJECTED | approval | VAL-0055 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 AA6; UAQ32 | REQ-LT-0056 / BR-0056 | SQL outbox, Mongo in-app/delivery, EmailProvider | Pending/delivery result; concrete enum absent | notifications | VAL-0056 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 M; N; UAQ31 | REQ-LT-0057 / BR-0057 | Curated mappings, LLM adapter, live validator | Recommendation/provenance only; no domain writes | recommendation | VAL-0057 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 N; AK; BL1 | REQ-LT-0058 / BR-0058 | Curated mappings, LLM adapter, live validator | Recommendation/provenance only; no domain writes | recommendation | VAL-0058 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 N | REQ-LT-0059 / BR-0059 | Curated mappings, LLM adapter, live validator | Recommendation/provenance only; no domain writes | recommendation | VAL-0059 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 AB; AQ; UAQ21 | REQ-LT-0060 / BR-0060 | Unmet-demand events and Mongo analytics | Event/aggregate states unspecified | analytics | VAL-0060 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 AC; AE; BK | REQ-LT-0061 / BR-0061 | User, roles, mappings, AuthProvider | Session/master-data lifecycle unspecified | identity | VAL-0061 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 AD; UAQ1 | REQ-LT-0062 / BR-0062 | User, roles, mappings, AuthProvider | Session/master-data lifecycle unspecified | identity | VAL-0062 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 AG; SRC-03 section 28 | REQ-LT-0063 / BR-0063 | API authorization/project/lab scope | Denied action leaves domain unchanged | security | VAL-0063 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 AG; AH | REQ-LT-0064 / BR-0064 | Affected record and append-only audit | Correction transition rules incomplete | override | VAL-0064 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 W1; AG; UAQ33 | REQ-LT-0065 / BR-0065 | ObjectStorageAdapter and metadata | Upload/link lifecycle unspecified | evidence | VAL-0065 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 AK; BL1; SRC-03 sections 24/25 | REQ-LT-0066 / BR-0066 | REST/OpenAPI and generated clients | Per-operation state depends on workflow | contracts | VAL-0066 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 BL1/2; AK | REQ-LT-0067 / BR-0067 | MySQL and MongoDB | SQL commit then document projection | data | VAL-0067 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 AK; BL10; SRC-03 section 30 | REQ-LT-0068 / BR-0068 | Scheduler, due-date version, notification obligation | Processing/delivery states unspecified | reminders | VAL-0068 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 AF; BL12 | REQ-LT-0069 / BR-0069 | Containers, cloud adapters, scheduler | Promotion/recovery protocol unspecified | deployment | VAL-0069 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 AK; BL1/12 | REQ-LT-0070 / BR-0070 | Containers, cloud adapters, scheduler | Promotion/recovery protocol unspecified | deployment | VAL-0070 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 BB; BL13; SRC-03 section 37 | REQ-LT-0071 / BR-0071 | Department/product boundary | No independent runtime transition | scope | VAL-0071 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 AI; AJ; AK; AC; BB | REQ-LT-0072 / BR-0072 | Department/product boundary | No independent runtime transition | scope | VAL-0072 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-05 SRC-05 pp1–3; AM | REQ-LT-0073 / BR-0073 | Evidence, queries/reports, documentation | N/A: academic constraint, not domain state | academic | VAL-0073 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 BL11; SRC-05 pp2–3 | REQ-LT-0074 / BR-0074 | Evidence, queries/reports, documentation | N/A: academic constraint, not domain state | academic | VAL-0074 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-06 SRC-06 pp1–2; AN | REQ-LT-0075 / BR-0075 | Evidence, queries/reports, documentation | N/A: academic constraint, not domain state | academic | VAL-0075 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 AN; AO; AF | REQ-LT-0076 / BR-0076 | Evidence, queries/reports, documentation | N/A: academic constraint, not domain state | academic | VAL-0076 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 AL; SRC-08 initial setup | REQ-LT-0077 / BR-0077 | Evidence, queries/reports, documentation | N/A: academic constraint, not domain state | academic | VAL-0077 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 C | REQ-LT-0078 / BR-0078 | Containers, cloud adapters, scheduler | Promotion/recovery protocol unspecified | deployment | VAL-0078 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 BL8/9; SRC-03 section 29 | REQ-LT-0079 / BR-0079 | Error catalog, tests, traceability | DESIGN-INCOMPLETE until specified | quality | VAL-0079 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-03 SRC-03 section 31; BJI/BM | REQ-LT-0080 / BR-0080 | Error catalog, tests, traceability | DESIGN-INCOMPLETE until specified | quality | VAL-0080 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-01 SRC-01 SDD STRUCTURAL AUTHORITY; SRC-03 sections 0–42 | REQ-LT-0081 / BR-0081 | Persistent review and approval records | AWAITING_USER_VALIDATION; no approval | governance | VAL-0081 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-01 SRC-01 APPROVAL GATE 1; CHANGE INVALIDATION; USER-01 | REQ-LT-0082 / BR-0082 | Persistent review and approval records | AWAITING_USER_VALIDATION; no approval | governance | VAL-0082 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 UAQ1/2/17/18/19/22/33; SRC-03 section 38 | REQ-LT-0083 / BR-0083 | Persistent review and approval records | AWAITING_USER_VALIDATION; no approval | governance | VAL-0083 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-02 BJ | REQ-LT-0084 / BR-0084 | Department/product boundary | No independent runtime transition | scope | VAL-0084 | MISSING / ABSENT / DEFERRED_BY_GATE |
| SRC-01 SRC-01 COMPLETENESS AUDIT; BL15/BM | REQ-LT-0085 / BR-0085 | Persistent review and approval records | AWAITING_USER_VALIDATION; no approval | governance | VAL-0085 | MISSING / ABSENT / DEFERRED_BY_GATE |

## Minimum SDD structural baseline

**All 43 numbered top-level sections (0–42), plus every subordinate heading in SRC-03, are preserved below verbatim with original line locations. USER SDD STRUCTURE ⊆ eventual ASTRA SDD STRUCTURE.** No area is dropped because its behavior is contested: the REPO area remains identifiable while V1 scope stays open. Phase/agent sections are later-gate structural obligations, not permission to plan now. The eventual SDD may expand this baseline but must explicitly map every BASE ID, without weakening or hiding required areas in unexplained appendices. Final SDD conformance is not yet testable because no SDD has been authored. OD-01 asks whether another original reference was intended.

| Baseline ID | Original heading (verbatim) | SRC-03 line | Preservation |
|---|---|---|---|
| BASE-001 | # LabTrack — Software Design Document (SDD) | 1 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-002 | ## Deterministic Execution Template | 2 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-003 | # 0. DOCUMENT CONTROL | 10 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-004 | ## 0.1 Source-of-Truth Hierarchy | 25 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-005 | # 1. IMPLEMENTATION MATURITY TAGS | 37 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-006 | # 2. SYSTEM IDENTITY | 51 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-007 | # 3. PROJECT MODEL | 63 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-008 | ## 3.1 Project Identity | 67 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-009 | ### Project ID | 69 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-010 | ### Project Name | 79 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-011 | ## 3.2 Project Fields | 85 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-012 | ## 3.3 Project Permissions | 100 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-013 | # 4. USERS AND ROLES | 108 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-014 | ## 4.1 Student | 110 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-015 | ## 4.2 Faculty Mentor | 132 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-016 | ## 4.3 Lab In-Charge | 139 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-017 | ## 4.4 Lab Assistant | 146 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-018 | ## 4.5 HoD | 155 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-019 | ## 4.6 Technical/System Admin | 164 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-020 | # 5. INVENTORY MODEL | 171 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-021 | ## 5.1 Assets | 175 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-022 | ## 5.2 Consumables | 187 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-023 | # 6. PROJECT/COMPONENT REQUIREMENT ENTRY | 209 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-024 | # 7. MINIMUM-LAB FULFILMENT | 226 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-025 | ## 7.1 Objective | 228 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-026 | ## 7.2 Secondary objective | 232 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-027 | ## 7.3 Tertiary deterministic tie-breaker | 236 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-028 | ## 7.4 Exact V1 algorithm | 240 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-029 | ## 7.5 Feasibility | 252 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-030 | # 8. APPROVAL WORKFLOW | 262 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-031 | ## 8.1 Consumable | 264 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-032 | ## 8.2 Asset | 274 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-033 | ## 8.3 Asset purpose | 278 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-034 | # 9. CANONICAL STATE MODEL | 289 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-035 | ## 9.1 Request states | 291 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-036 | ## 9.2 Reservation states | 302 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-037 | ## 9.3 Asset states | 311 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-038 | ## 9.4 Extension states | 329 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-039 | # 10. REQUEST / APPROVAL EXECUTION CONTRACT | 337 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-040 | ## 10.1 Example: Faculty Approval | 354 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-041 | # 11. PHYSICAL ISSUE CONTRACT | 378 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-042 | ## 11.1 Consumable issue | 380 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-043 | ## 11.2 Asset issue/use | 394 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-044 | ## 11.3 Failure | 406 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-045 | # 12. PROJECT/REQUEST CANCELLATION | 416 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-046 | # 13. RESERVATION | 438 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-047 | # 14. APPROVED-BUT-NOT-COLLECTED EXPIRY | 452 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-048 | # 15. BORROWING / USAGE DURATION | 467 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-049 | # 16. EXTENSIONS | 476 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-050 | # 17. RETURN / INSPECTION | 486 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-051 | ## 17.1 Asset inspection | 490 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-052 | ## 17.2 Consumable inspection | 506 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-053 | ## 17.3 Reconciliation | 522 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-054 | # 18. RETAINED IN PROJECT | 546 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-055 | # 19. DEFECT / DAMAGE / LOSS | 562 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-056 | # 20. EXPLAINABLE REPO INDEX | 583 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-057 | ## 20.1 Purpose | 585 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-058 | ## 20.2 NLP layer | 589 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-059 | ## 20.3 Incident contribution | 597 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-060 | ## 20.4 Repeated-offender flag | 626 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-061 | ## 20.5 Correction | 630 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-062 | ## 20.6 Explainability output | 636 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-063 | # 21. NOTIFICATION ARCHITECTURE | 654 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-064 | ## 21.1 Event flow | 656 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-065 | ## 21.2 Recipient matrix | 662 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-066 | ## 21.3 Email approval | 681 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-067 | # 22. AI RECOMMENDATION ARCHITECTURE | 696 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-068 | # 23. DATA ARCHITECTURE | 721 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-069 | ## 23.1 MySQL — authoritative state | 723 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-070 | ## 23.2 MongoDB — document/event/analytics state | 743 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-071 | # 24. API CONTRACT | 755 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-072 | # 25. TECHNOLOGY SELECTION & RATIONALE | 771 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-073 | ## 25.1 Stack | 777 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-074 | # 26. CLOUD / DEPLOYMENT | 800 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-075 | ## Primary V1 roles | 802 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-076 | # 27. OBJECT STORAGE | 818 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-077 | # 28. SECURITY | 839 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-078 | # 29. ERROR / RECOVERY CATALOG | 856 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-079 | # 30. SCHEDULER | 896 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-080 | # 31. TESTING CONTRACT | 918 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-081 | ## Every feature requires | 920 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-082 | ## Phase gates | 931 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-083 | ### Local edit | 933 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-084 | ### Commit | 936 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-085 | ### PR/merge | 939 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-086 | ### Phase gate | 942 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-087 | ### Nightly | 945 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-088 | ### Demo/release | 948 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-089 | # 32. ARCHITECTURE GUARDRAILS | 953 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-090 | # 33. PHASE IMPLEMENTATION TEMPLATE | 969 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-091 | # 34. DETERMINISTIC OPERATION TEMPLATE | 1001 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-092 | # 35. TRACEABILITY | 1045 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-093 | # 36. ACADEMIC MAPPING | 1057 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-094 | ## DCDS | 1059 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-095 | ## CCE | 1078 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-096 | # 37. PROTOTYPE → PRODUCTION MATRIX | 1093 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-097 | # 38. OPEN DECISION REGISTER | 1109 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-098 | # 39. ADR / CHANGE CONTROL | 1129 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-099 | # 40. AGENT EXECUTION CONTRACT | 1143 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-100 | # 41. IMPLEMENTATION READINESS GATE | 1170 | REQUIRED MINIMUM; eventual mapping pending |
| BASE-101 | # 42. FINAL DESIGN RULE | 1190 | REQUIRED MINIMUM; eventual mapping pending |

## Missing downstream nodes

`contracts/openapi.yaml`, migrations, tests, deployments, `ACTIVE_STATE.md`, ASTRA canonical SDD and phase plans are absent. Their absence is evidence, not permission to create them at Gate 1. Every requirement has one trace row; every conceptual component has a source-backed reason. No pitch source produces a requirement or architecture edge.
