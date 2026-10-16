# ASTRA context review

Version: 1.0 | 2026-10-07 | State: **AWAITING_USER_VALIDATION**

This is an evidence-backed understanding for Gate 1, not a canonical SDD. No implementation plan or production code has been authored. All pitch artifacts are excluded from product and architecture authority by USER-02.

## Reading guide and confidence

**CONFIRMED** below means directly established by inspected repository evidence or the current user's instruction. It does not mean this review has received Gate 1 approval. **RECORDED CURRENT** means SRC-02/SRC-03 assert a current decision; separate approval evidence was not found for every assertion. **ASSUMED** denotes explicit configurable/sizing assumptions. **DERIVED** is analysis, **PROPOSED** is an unapproved candidate, **DEFERRED** is future scope, and **UNKNOWN** is a gap. The ledger retains the protocol's requirement-type taxonomy separately.

## Problem and intended system

RECORDED CURRENT — LabTrack digitizes project-based R&A laboratory hardware handling now described as email, Excel and notebook work: discovery, approvals, physical custody, due dates, returns, condition, retention and history. It is a hardware lifecycle application, not simply inventory CRUD (SRC-02 A/B/D/BA). This is the team's account of the manual process; no independent operational measurement or sample inventory dataset was supplied.

CONFIRMED — There is no LabTrack application implementation in this repository. `src/.gitkeep` is empty; tests, schemas, migrations, API contracts and deployment files are absent. Slide tooling is not product implementation. Therefore no runtime/security/performance behavior has been proven.

## Users, roles, permissions and ownership

RECORDED CURRENT — Student projects have a Project Lead and members; the lead controls authoritative submission/withdrawal and project edits. Faculty Mentor reviews first. Asset requests also need relevant Lab In-Charge faculty review. In-Charge has one or at most two labs; Assistants may serve several labs and each lab may have multiple assistants. HoD has R&A-wide visibility, normal final approval and general overwrite. Technical Admin remains separate from institutional approval. Central Store is a system/inventory-management stage, not an application role (SRC-02 E/I/O/UAQ23–28).

RECORDED CURRENT — Permissions are enforced server-side and scoped to project/lab relationships. HoD corrections are audited; raw history is append-only. An explicitly allowed Assistant FIFO override may be a narrower action than general overwrite, but that distinction needs validation (OD-08). Student score visibility, maintenance permissions, Central Store report readers, dual-role approval, membership edits and reassignment rules are not fully defined (OD-05/06/07/14/15).

## Domain entities and lifecycle

RECORDED CURRENT — Domain concepts: User/role, Student Project/lead/members/mentor, Catalogue Item, Lab/mapping, Physical Asset, per-lab Consumable Stock, Requirement, Request, Approval, Fulfilment Plan/Operational Order, Issue/Use Transaction, Reservation, Extension/Due-date History, Return/Inspection, Incident, Retained Project linkage, Audit, Outbox Event, Notification/Delivery, Compatibility Mapping, Recommendation Provenance, Unmet Demand and Policy Configuration. These are extracted concepts, **not authored table schemas** (SRC-02 F–AA/BL2).

RECORDED CURRENT — Assets are individually identified through SIT Barcode with Default ID and procurement references; Bill Number may repeat. Consumables are returnable quantities, including sensors/actuators, with good/bad/total per lab. Active stock means physical good+bad quantities currently at the lab; items on issue are excluded. Physical asset history remains unit-specific. Precise inventory maintenance and borrowed-item responsibility across a team are UNKNOWN (OD-15/16).

RECORDED CURRENT — Lifecycle: Project → Requirement/Availability → Request → Mentor → class-specific stage → HoD → Assistant physical Issue/Use → active tracking/extension/reservation → Return/Inspection or Retained in Project → Inventory reconciliation/History. Consumables use Central Store before HoD; assets use In-Charge. Asset use in college is a real checkout requiring due time and reconciliation, distinct from outside-college purpose (SRC-02 L/O/P/W/UAQ28).

RECORDED CURRENT — Planning minimizes lab count, then recorded stock-concentration score, then lab-ID ordering. Planning does not guarantee or reserve stock. Actual issue rechecks/locks stock and commits issue/audit/outbox in SQL. Multi-lab all-or-reject scope and per-component allocation details remain UNKNOWN (OD-09/10).

## State families (extracted, not newly designed)

| Family | Recorded states/path | Open boundary |
|---|---|---|
| Request | DRAFT → SUBMITTED → class-specific review → HOD_REVIEW → APPROVED → FULFILMENT_PENDING → ISSUED/IN_USE → CLOSED; REJECTED, CANCELLED, APPROVED_EXPIRED_BEFORE_ISSUE, FULFILMENT_FAILED_STOCK | Concrete review enums, mixed requests, aggregate/child states and corrections (OD-06/10) |
| Reservation | WAITING_FIFO → FULFILABLE → FULFILLED; EXPIRED, CANCELLED | Timer anchor, held quantity/type/lab, approval bridge and scarcity (OD-04) |
| Asset | AVAILABLE, RESERVED, IN_USE, ISSUED_OUT, DEFECTIVE, UNDER_REPAIR, LOST, RETAINED_IN_PROJECT | Full legal transition/repair/correction matrix (OD-08/16) |
| Consumable | Good/bad/total numeric stock; issue subtracts, return adds, repair reclassifies | Staged/excess returns, cross-lab reconciliation (OD-10/16) |
| Extension | REQUESTED → APPROVED or REJECTED; new due-date version on approval | Pending/overdue/return races, maximum-count semantics (OD-11) |

## Timing, reservation, return and accountability

RECORDED CURRENT — Requested duration is student-selected and approved without silent rewriting. Pending extension does not pause existing due date. Reminder is five days before due and daily while overdue. ASSUMED/CONFIGURABLE — two-extension limit, 24h reservation expiry, 48h collection window, day-5 added mentor and day-7 escalation are V1 values. These must not become immutable institutional law. Timer anchors, timezone and catch-up policy remain UNKNOWN (OD-04/11).

RECORDED CURRENT — Both classes require return inspection. Assets have functional/condition/evidence details; consumables have good/bad/missing quantity reconciliation. Retained-in-project closure does not decrement twice or restore availability. History stays with project/physical unit. Exact retention approver, partial return closure, repair authority and acknowledgement consequences remain UNKNOWN (OD-16).

RECORDED CURRENT — Incident history and authorized repeated-offender visibility are intended; automatic monetary penalties and score-based access restrictions are excluded. PROPOSED/CONFLICTED — numeric REPO and NLP have conflicting scope statements. The detailed formula, thresholds and HoD correction rule are preserved as candidates in REQ-LT-0049–0051, not silently approved. Team attribution, uncertainty and missing severity policy require resolution (OD-13).

## Data, integrations and contracts

RECORDED CURRENT — MySQL 8.4/InnoDB + SQLAlchemy 2.x/Alembic owns business truth/outbox. MongoDB holds non-authoritative notification/delivery, events, AI and analytics documents. React/Vite/TypeScript consumes REST/OpenAPI from Python/FastAPI/Pydantic, with generated frontend types. Redis is excluded V1. These are recorded selections, not a working stack verified in this repository (SRC-02 AK/BL).

RECORDED CURRENT — External boundaries: replaceable AuthProvider, EmailProvider initially Gmail API/dedicated sender, optional LLM adapter initially BrowserAPIFree → ChatGPT, ObjectStorageAdapter initially S3, future institutional data import. `contracts/openapi.yaml` is named by SRC-03 but missing. No concrete event, notification, error or entity schema exists. API generation authority and precise failure contracts remain open (OD-12/14/17/18/19/20).

RECORDED CURRENT — SQL transactional event → outbox → Notification Service → Mongo in-app/delivery plus email. Email is a deep-link/status channel, never approval authority. Website decisions write history and follow-up events. AA6 is explicitly normative via UAQ32, but stale UAQ16 and minor recipient wording require validation. Channel failure does not reverse domain transaction. Canonical audit storage and ambiguous external-delivery recovery are UNKNOWN (OD-03/12).

## Security, auditability and reliability

RECORDED CURRENT — Server-side role/project/lab checks, parameterized queries, synthetic prototype data, secrets outside source, secure photo references, append-only audit and no normal transactional hard delete. HoD corrections preserve before/after and compensating events (SRC-02 AG/AH). Prototype auth/session, upload controls, retention, recovery objectives and measurable performance/security acceptance limits are UNKNOWN (OD-14/17/20/21).

RECORDED CURRENT — Source intent includes atomic issue, idempotent state transitions/notifications/jobs and scheduler restart scans. No transactional delivery or failover implementation has been demonstrated. Reconciliation audit identifies races and physical-versus-database boundaries without inventing recovery policy.

## AI boundaries

RECORDED CURRENT — AI is optional/advisory, not inventory/approval/issuance/FIFO authority. Compatibility mappings and deterministic filters bound candidate set; live SQL revalidation occurs before display. Snapshot/delta context and provenance are desired. UNKNOWN — enabled-demo scope, adapter contract, offline fallback, technical compatibility rules/owner and score NLP scope (OD-13/18). No external service capability is assumed merely from its name.

## Deployment and prototype/production boundary

RECORDED CURRENT — AWS primary, Azure isolated staging/DR-ready, GCP analytics/read-only; same portable containers, one authoritative writer and one active scheduler, controlled promotion rather than active-active writes. Docker/Compose, GitHub Actions and preferred Terraform are recorded directions. No hosting/service/failover artifacts exist (SRC-02 AF/BL12).

ASSUMED — Approximate broader environment of 8–10 labs, 10–12 assistants, 700–800 students and 5–10 simultaneous users is a sizing hint, not measured R&A capacity. Production IT protocol, data source, privacy approval, college infrastructure, retention and ownership are DEFERRED. Synthetic data/configuration/adapters must be replaceable. Asset transfer, cross-department sharing, procurement/payment execution and mobile/app-store release are outside V1. Deployment cost/services/backup/restore/fencing and demo scope remain UNKNOWN (OD-21).

## Academic constraints and evidence

CONFIRMED FROM SUPPLIED RUBRICS — DCDS ESE: Python data-driven application with SQL and NoSQL; 10 marks, 40% weight, six criteria weighted 2/2/2/2/1/1, tentative 26–30 October 2026. Python file handling and advanced SQL/Mongo operations are part of detailed evaluation (SRC-05 pp1–3; p4 blank). SRC-02 BL11 explicitly selects meaningful stored procedure/aggregation/import-export demonstrations.

CONFIRMED FROM SUPPLIED RUBRIC — CCE presentation/viva: 30 marks, topic/research/presentation/running example/viva = 5/5/5/10/5, tentative 19 October 2026 (SRC-06 pp1–2). Live cloud and unified project are RECORDED USER GOALS in SRC-02 AN/AO, not a requirement in those exact words in the rubric. Three providers are not demanded by that rubric. No actual literature bibliography/full syllabus is supplied. Four-person/same-division registration is UNVERIFIED; current implementation ownership is recorded as Ishaan and Raghu. Approximate 15-day target lacks an anchored start (OD-19/22). These are evidence limits, not a request to change owners or silently reduce scope.

## Likely interpretation mismatches requiring validation

1. “Original Standard SDD Structure” may refer to a different missing document. Only the deterministic template was found (OD-01).
2. Current “LOCKED” context may contain later decisions that supersede stale passages, but the repository does not date each decision (OD-02/03/13).
3. “Consumable” here means returnable quantity-tracked hardware, not disposable supplies; “Central Store” is not a role.
4. “Overwrite” may mean auditable correction, while Assistant FIFO override is a separately authorized action (OD-08).
5. “No partial issue” may mean per-lab approved order rather than whole multi-lab project request (OD-10).
6. “Reservation expires in 24h” may mean ready-for-pickup window rather than time spent waiting (OD-04).
7. “Retained in Project is returned” means administrative closure without available-stock restoration, not a second physical return (OD-16).
8. Optional AI and numeric REPO may have been promoted during later discussions; their scope is not inferred from contradictory prose (OD-13/18).
9. Academic goals and cloud ambitions may exceed the immediate demonstration target; no scope cut or new plan is selected (OD-21/22).

## Completeness audit method

The protocol's 26 questions are applied to each significant executable capability below. KNOWN means source-stated at the indicated requirement granularity; PARTIAL explicitly states the remaining gap; UNDEFINED means no policy was found and the linked OD remains open. Validation/acceptance entries are derived audit checks, not implemented tests. A generic documented guardrail does not count as a complete per-operation contract. Non-executable scope, stack, academic, security and governance constraints are covered by the ledger and the cross-system audit; they do not pretend to be workflows.

### CAP-01 — project

Evidence: REQ-LT-0002, REQ-LT-0003, REQ-LT-0004. Source locations and per-requirement checks are in the ledger. Open decisions: OD-05.

| Audit question | Evidence / explicit gap |
|---|---|
| What? | KNOWN at requirement level: REQ-LT-0002, REQ-LT-0003, REQ-LT-0004. |
| Who? | PARTIAL: Project Lead / permitted members. Exact unresolved authority is in OD-05. |
| Trigger? | PARTIAL: Create/edit/submit. |
| Preconditions? | PARTIAL: authorized project lead/member; post-submission revision and membership rules open (UAQ23). |
| Authorization? | PARTIAL: server-side project/lab/role controls (SRC-02 AG); complete operation matrix absent. |
| Inputs? | KNOWN: required project name, generated ID, members, mentor, requirements; detailed schema/limits absent. |
| Validation? | PARTIAL: source constraints in linked requirements; field schemas and all limits not specified. |
| Normal flow? | PARTIAL: see source-stated behavior in REQ-LT-0002, REQ-LT-0003, REQ-LT-0004; complete operation contract absent. |
| Decision rule? | UNDEFINED for this operation — OD-05; no default policy inferred. |
| State transition? | PARTIAL: Create/edit; submission links to request. |
| Persistent state? | PARTIAL: Project, membership, requirements; entity schemas absent. |
| Database mutation? | PARTIAL: MySQL project/member/requirement persistence; revisions and key-allocation details absent. |
| Transaction boundary? | UNDEFINED for this operation — OD-05; no default policy inferred. |
| Concurrency concerns? | GAP: concurrent ID creation, membership/lead changes and edits during approval (OD-05). |
| External side effects? | UNDEFINED for this operation — OD-05; no default policy inferred. |
| Event? | UNDEFINED for this operation — OD-05; no default policy inferred. |
| Notification? | UNDEFINED for this operation — OD-05; no default policy inferred. |
| Audit record? | PARTIAL: important mutations auditable, actor/time/history retained (SRC-02 AH); exact schema/residence incomplete (OD-12). |
| Failure modes? | UNDEFINED for this operation — OD-05; no default policy inferred. |
| Retry? | UNDEFINED for this operation — OD-05; no default policy inferred. |
| Idempotency? | UNDEFINED for this operation — OD-05; no default policy inferred. |
| Rollback/compensation? | UNDEFINED for this operation — OD-05; no default policy inferred. |
| Stale-data behavior? | UNDEFINED for this operation — OD-05; no default policy inferred. |
| Security implications? | PARTIAL: synthetic data, role/ownership checks and preserved history; exact operation controls incomplete. |
| Testing requirements? | REQUIRED, NOT IMPLEMENTED: source §31 testing categories plus this capability’s ledger validation checks. |
| Acceptance criteria? | DERIVED checks in linked ledger entries; precise unresolved business outcomes remain in OD-05. |

### CAP-02 — identity

Evidence: REQ-LT-0005, REQ-LT-0006, REQ-LT-0010, REQ-LT-0061, REQ-LT-0062. Source locations and per-requirement checks are in the ledger. Open decisions: OD-14 OD-15 OD-19.

| Audit question | Evidence / explicit gap |
|---|---|
| What? | KNOWN at requirement level: REQ-LT-0005, REQ-LT-0006, REQ-LT-0010, REQ-LT-0061, REQ-LT-0062. |
| Who? | PARTIAL: Synthetic user / technical administrator; future IT administrator. Exact unresolved authority is in OD-14 OD-15 OD-19. |
| Trigger? | PARTIAL: Login or master-data maintenance. |
| Preconditions? | UNDEFINED for this operation — OD-14 OD-15 OD-19; no default policy inferred. |
| Authorization? | PARTIAL: role/project/lab checks required; exact admin and revocation permissions open. |
| Inputs? | PARTIAL: synthetic identities, PRN and staff formats; login credentials/session contract unspecified. |
| Validation? | PARTIAL: source constraints in linked requirements; field schemas and all limits not specified. |
| Normal flow? | PARTIAL: see source-stated behavior in REQ-LT-0005, REQ-LT-0006, REQ-LT-0010, REQ-LT-0061, REQ-LT-0062; complete operation contract absent. |
| Decision rule? | UNDEFINED for this operation — OD-14 OD-15 OD-19; no default policy inferred. |
| State transition? | PARTIAL: Session/master-data lifecycle unspecified. |
| Persistent state? | PARTIAL: User, roles, mappings, AuthProvider; entity schemas absent. |
| Database mutation? | UNDEFINED for this operation — OD-14 OD-15 OD-19; no default policy inferred. |
| Transaction boundary? | UNDEFINED for this operation — OD-14 OD-15 OD-19; no default policy inferred. |
| Concurrency concerns? | UNDEFINED for this full operation; see OD-14 OD-15 OD-19. |
| External side effects? | DEFERRED: production IT/SSO/master-data integration; no institutional call contract exists. |
| Event? | UNDEFINED for this operation — OD-14 OD-15 OD-19; no default policy inferred. |
| Notification? | UNDEFINED for this operation — OD-14 OD-15 OD-19; no default policy inferred. |
| Audit record? | UNDEFINED for this operation — OD-14 OD-15 OD-19; no default policy inferred. |
| Failure modes? | UNDEFINED: prototype login/session expiry/revocation and synchronization failures (OD-14). |
| Retry? | UNDEFINED for this operation — OD-14 OD-15 OD-19; no default policy inferred. |
| Idempotency? | UNDEFINED for this operation — OD-14 OD-15 OD-19; no default policy inferred. |
| Rollback/compensation? | UNDEFINED for this operation — OD-14 OD-15 OD-19; no default policy inferred. |
| Stale-data behavior? | UNDEFINED for this operation — OD-14 OD-15 OD-19; no default policy inferred. |
| Security implications? | PARTIAL: synthetic data, role/ownership checks and preserved history; exact operation controls incomplete. |
| Testing requirements? | REQUIRED, NOT IMPLEMENTED: source §31 testing categories plus this capability’s ledger validation checks. |
| Acceptance criteria? | DERIVED checks in linked ledger entries; precise unresolved business outcomes remain in OD-14 OD-15 OD-19. |

### CAP-03 — inventory

Evidence: REQ-LT-0011, REQ-LT-0012, REQ-LT-0013, REQ-LT-0014, REQ-LT-0015. Source locations and per-requirement checks are in the ledger. Open decisions: OD-02 OD-10 OD-15.

| Audit question | Evidence / explicit gap |
|---|---|
| What? | KNOWN at requirement level: REQ-LT-0011, REQ-LT-0012, REQ-LT-0013, REQ-LT-0014, REQ-LT-0015. |
| Who? | PARTIAL: Authorized inventory personnel; exact maintenance permissions open. Exact unresolved authority is in OD-02 OD-10 OD-15. |
| Trigger? | PARTIAL: Catalogue/stock query or maintenance. |
| Preconditions? | UNDEFINED for this operation — OD-02 OD-10 OD-15; no default policy inferred. |
| Authorization? | PARTIAL: server-side project/lab/role controls (SRC-02 AG); complete operation matrix absent. |
| Inputs? | KNOWN: item class, asset barcode/default ID/bill or lab/item good/bad quantities; maintenance schema incomplete. |
| Validation? | PARTIAL: class-aware identity and good+bad=total; duplicate IDs/metadata limits/maintenance rules incomplete. |
| Normal flow? | PARTIAL: see source-stated behavior in REQ-LT-0011, REQ-LT-0012, REQ-LT-0013, REQ-LT-0014, REQ-LT-0015; complete operation contract absent. |
| Decision rule? | UNDEFINED for this operation — OD-02 OD-10 OD-15; no default policy inferred. |
| State transition? | PARTIAL: Q0 asset states; numeric good/bad/total. |
| Persistent state? | PARTIAL: Catalogue, asset, per-lab stock; entity schemas absent. |
| Database mutation? | PARTIAL: MySQL asset/catalogue/stock records; CRUD/correction permissions and mutation contracts undefined. |
| Transaction boundary? | UNDEFINED for this operation — OD-02 OD-10 OD-15; no default policy inferred. |
| Concurrency concerns? | GAP: stock maintenance versus issue/reservation and evidence of physical adjustments (OD-15). |
| External side effects? | UNDEFINED for this operation — OD-02 OD-10 OD-15; no default policy inferred. |
| Event? | UNDEFINED for this operation — OD-02 OD-10 OD-15; no default policy inferred. |
| Notification? | UNDEFINED for this operation — OD-02 OD-10 OD-15; no default policy inferred. |
| Audit record? | UNDEFINED for this operation — OD-02 OD-10 OD-15; no default policy inferred. |
| Failure modes? | UNDEFINED for this operation — OD-02 OD-10 OD-15; no default policy inferred. |
| Retry? | UNDEFINED for this operation — OD-02 OD-10 OD-15; no default policy inferred. |
| Idempotency? | UNDEFINED for this operation — OD-02 OD-10 OD-15; no default policy inferred. |
| Rollback/compensation? | UNDEFINED for this operation — OD-02 OD-10 OD-15; no default policy inferred. |
| Stale-data behavior? | UNDEFINED for this operation — OD-02 OD-10 OD-15; no default policy inferred. |
| Security implications? | PARTIAL: synthetic data, role/ownership checks and preserved history; exact operation controls incomplete. |
| Testing requirements? | REQUIRED, NOT IMPLEMENTED: source §31 testing categories plus this capability’s ledger validation checks. |
| Acceptance criteria? | DERIVED checks in linked ledger entries; precise unresolved business outcomes remain in OD-02 OD-10 OD-15. |

### CAP-04 — discovery

Evidence: REQ-LT-0016. Source locations and per-requirement checks are in the ledger. Open decisions: OD-09.

| Audit question | Evidence / explicit gap |
|---|---|
| What? | KNOWN at requirement level: REQ-LT-0016. |
| Who? | PARTIAL: Student / Project Lead. Exact unresolved authority is in OD-09. |
| Trigger? | PARTIAL: Requirement entry/search. |
| Preconditions? | PARTIAL: student access to R&A catalogue; precise field visibility open. |
| Authorization? | PARTIAL: server-side project/lab/role controls (SRC-02 AG); complete operation matrix absent. |
| Inputs? | KNOWN: catalogue item/type and required quantity. |
| Validation? | PARTIAL: source constraints in linked requirements; field schemas and all limits not specified. |
| Normal flow? | KNOWN: query authoritative availability, display shortage/labs; offer reservation/alternatives as eligible (J/L). |
| Decision rule? | UNDEFINED for this operation — OD-09; no default policy inferred. |
| State transition? | PARTIAL: Draft requirement/shortage; exact schema absent. |
| Persistent state? | PARTIAL: Catalogue and availability boundary; entity schemas absent. |
| Database mutation? | KNOWN: availability query itself has no stock decrement; requirement/unmet-demand persistence triggers incomplete. |
| Transaction boundary? | N/A for read-only availability itself; requirement/demand writes need explicit contracts. |
| Concurrency concerns? | UNDEFINED for this full operation; see OD-09. |
| External side effects? | UNDEFINED for this operation — OD-09; no default policy inferred. |
| Event? | UNDEFINED for this operation — OD-09; no default policy inferred. |
| Notification? | UNDEFINED for this operation — OD-09; no default policy inferred. |
| Audit record? | UNDEFINED for this operation — OD-09; no default policy inferred. |
| Failure modes? | UNDEFINED for this operation — OD-09; no default policy inferred. |
| Retry? | UNDEFINED for this operation — OD-09; no default policy inferred. |
| Idempotency? | UNDEFINED for this operation — OD-09; no default policy inferred. |
| Rollback/compensation? | UNDEFINED for this operation — OD-09; no default policy inferred. |
| Stale-data behavior? | KNOWN: planning availability not guaranteed; recheck at issue (L1). |
| Security implications? | PARTIAL: synthetic data, role/ownership checks and preserved history; exact operation controls incomplete. |
| Testing requirements? | REQUIRED, NOT IMPLEMENTED: source §31 testing categories plus this capability’s ledger validation checks. |
| Acceptance criteria? | DERIVED checks in linked ledger entries; precise unresolved business outcomes remain in OD-09. |

### CAP-05 — allocation

Evidence: REQ-LT-0017, REQ-LT-0018, REQ-LT-0019. Source locations and per-requirement checks are in the ledger. Open decisions: OD-04 OD-09.

| Audit question | Evidence / explicit gap |
|---|---|
| What? | KNOWN at requirement level: REQ-LT-0017, REQ-LT-0018, REQ-LT-0019. |
| Who? | PARTIAL: System on requirement entry. Exact unresolved authority is in OD-04 OD-09. |
| Trigger? | PARTIAL: Plan fulfilable request. |
| Preconditions? | UNDEFINED for this operation — OD-04 OD-09; no default policy inferred. |
| Authorization? | PARTIAL: server-side project/lab/role controls (SRC-02 AG); complete operation matrix absent. |
| Inputs? | KNOWN: r[c], q[l,c], labs; asset feasibility and held-stock subtraction undefined. |
| Validation? | PARTIAL: source constraints in linked requirements; field schemas and all limits not specified. |
| Normal flow? | PARTIAL: see source-stated behavior in REQ-LT-0017, REQ-LT-0018, REQ-LT-0019; complete operation contract absent. |
| Decision rule? | PARTIAL: minimum feasible cardinality, maximum stated concentration score, then lab-ID ordering; line allocation order missing (I1). |
| State transition? | PARTIAL: Planning only; no automatic reservation. |
| Persistent state? | PARTIAL: Fulfilment plan; lab/stock; entity schemas absent. |
| Database mutation? | KNOWN: no automatic stock reservation/decrement; plan persistence/versioning unspecified. |
| Transaction boundary? | UNDEFINED for this operation — OD-04 OD-09; no default policy inferred. |
| Concurrency concerns? | KNOWN: plan may become stale before issue; replan/approval effect unresolved. |
| External side effects? | UNDEFINED for this operation — OD-04 OD-09; no default policy inferred. |
| Event? | UNDEFINED for this operation — OD-04 OD-09; no default policy inferred. |
| Notification? | UNDEFINED for this operation — OD-04 OD-09; no default policy inferred. |
| Audit record? | UNDEFINED for this operation — OD-04 OD-09; no default policy inferred. |
| Failure modes? | UNDEFINED for this operation — OD-04 OD-09; no default policy inferred. |
| Retry? | UNDEFINED for this operation — OD-04 OD-09; no default policy inferred. |
| Idempotency? | UNDEFINED for this operation — OD-04 OD-09; no default policy inferred. |
| Rollback/compensation? | UNDEFINED for this operation — OD-04 OD-09; no default policy inferred. |
| Stale-data behavior? | PARTIAL: issue revalidates; when to recompute plan is unspecified. |
| Security implications? | PARTIAL: synthetic data, role/ownership checks and preserved history; exact operation controls incomplete. |
| Testing requirements? | REQUIRED, NOT IMPLEMENTED: source §31 testing categories plus this capability’s ledger validation checks. |
| Acceptance criteria? | DERIVED checks in linked ledger entries; precise unresolved business outcomes remain in OD-04 OD-09. |

### CAP-06 — approval

Evidence: REQ-LT-0007, REQ-LT-0020, REQ-LT-0021, REQ-LT-0022, REQ-LT-0023, REQ-LT-0025, REQ-LT-0055. Source locations and per-requirement checks are in the ledger. Open decisions: OD-04 OD-05 OD-06 OD-09 OD-12 OD-15.

| Audit question | Evidence / explicit gap |
|---|---|
| What? | KNOWN at requirement level: REQ-LT-0007, REQ-LT-0020, REQ-LT-0021, REQ-LT-0022, REQ-LT-0023, REQ-LT-0025, REQ-LT-0055. |
| Who? | PARTIAL: Lead, Mentor, In-Charge, HoD; Central Store system stage. Exact unresolved authority is in OD-04 OD-05 OD-06 OD-09 OD-12 OD-15. |
| Trigger? | PARTIAL: Submit/decide request. |
| Preconditions? | PARTIAL: current request at actor stage; exact class/revision/role-overlap matrix absent. |
| Authorization? | KNOWN: Mentor first, class-specific stage, HoD final normal approval; exact mixed/multi-lab matrix open. |
| Inputs? | PARTIAL: request decision/remarks/current state; payload schema and revision token undefined. |
| Validation? | PARTIAL: source constraints in linked requirements; field schemas and all limits not specified. |
| Normal flow? | PARTIAL: see source-stated behavior in REQ-LT-0007, REQ-LT-0020, REQ-LT-0021, REQ-LT-0022, REQ-LT-0023, REQ-LT-0025, REQ-LT-0055; complete operation contract absent. |
| Decision rule? | UNDEFINED for this operation — OD-04 OD-05 OD-06 OD-09 OD-12 OD-15; no default policy inferred. |
| State transition? | PARTIAL: DRAFT/SUBMITTED/review/HOD_REVIEW/APPROVED or REJECTED. |
| Persistent state? | PARTIAL: Request, approval timeline; entity schemas absent. |
| Database mutation? | PARTIAL: MySQL request/approval/timeline/audit/outbox; exact transition/error contract absent. |
| Transaction boundary? | UNDEFINED for this operation — OD-04 OD-05 OD-06 OD-09 OD-12 OD-15; no default policy inferred. |
| Concurrency concerns? | GAP: duplicate decisions, edit/cancel/expiry versus approval and role reassignment (OD-05/06). |
| External side effects? | UNDEFINED for this operation — OD-04 OD-05 OD-06 OD-09 OD-12 OD-15; no default policy inferred. |
| Event? | PARTIAL: template §10.1 names REQUEST_FACULTY_DECISION example; complete canonical event schema absent. |
| Notification? | PARTIAL: AA6 intended role-based event recipients; precise routing gaps OD-03/15. |
| Audit record? | PARTIAL: important mutations auditable, actor/time/history retained (SRC-02 AH); exact schema/residence incomplete (OD-12). |
| Failure modes? | UNDEFINED for this operation — OD-04 OD-05 OD-06 OD-09 OD-12 OD-15; no default policy inferred. |
| Retry? | UNDEFINED for this operation — OD-04 OD-05 OD-06 OD-09 OD-12 OD-15; no default policy inferred. |
| Idempotency? | UNDEFINED for this operation — OD-04 OD-05 OD-06 OD-09 OD-12 OD-15; no default policy inferred. |
| Rollback/compensation? | UNDEFINED for this operation — OD-04 OD-05 OD-06 OD-09 OD-12 OD-15; no default policy inferred. |
| Stale-data behavior? | UNDEFINED for this operation — OD-04 OD-05 OD-06 OD-09 OD-12 OD-15; no default policy inferred. |
| Security implications? | PARTIAL: synthetic data, role/ownership checks and preserved history; exact operation controls incomplete. |
| Testing requirements? | REQUIRED, NOT IMPLEMENTED: source §31 testing categories plus this capability’s ledger validation checks. |
| Acceptance criteria? | DERIVED checks in linked ledger entries; precise unresolved business outcomes remain in OD-04 OD-05 OD-06 OD-09 OD-12 OD-15. |

### CAP-07 — claim

Evidence: REQ-LT-0008. Source locations and per-requirement checks are in the ledger. Open decisions: OD-07.

| Audit question | Evidence / explicit gap |
|---|---|
| What? | KNOWN at requirement level: REQ-LT-0008. |
| Who? | PARTIAL: Issuing-lab Assistant. Exact unresolved authority is in OD-07. |
| Trigger? | PARTIAL: Approved order available. |
| Preconditions? | KNOWN: approved order and Assistant assigned to issuing lab. |
| Authorization? | PARTIAL: server-side project/lab/role controls (SRC-02 AG); complete operation matrix absent. |
| Inputs? | UNDEFINED for this operation — OD-07; no default policy inferred. |
| Validation? | PARTIAL: source constraints in linked requirements; field schemas and all limits not specified. |
| Normal flow? | PARTIAL: see source-stated behavior in REQ-LT-0008; complete operation contract absent. |
| Decision rule? | KNOWN: first authorized claimant wins (UAQ24). |
| State transition? | PARTIAL: Unclaimed → claimed conceptual state; enum absent. |
| Persistent state? | PARTIAL: Operational order and lab mapping; entity schemas absent. |
| Database mutation? | UNDEFINED for this operation — OD-07; no default policy inferred. |
| Transaction boundary? | UNDEFINED for this operation — OD-07; no default policy inferred. |
| Concurrency concerns? | GAP: exclusive claim intent known; atomic claim and abandoned-owner recovery undefined. |
| External side effects? | UNDEFINED for this operation — OD-07; no default policy inferred. |
| Event? | UNDEFINED for this operation — OD-07; no default policy inferred. |
| Notification? | UNDEFINED for this operation — OD-07; no default policy inferred. |
| Audit record? | PARTIAL: claim/assignment must be audited; full record schema unspecified. |
| Failure modes? | UNDEFINED for this operation — OD-07; no default policy inferred. |
| Retry? | UNDEFINED for this operation — OD-07; no default policy inferred. |
| Idempotency? | UNDEFINED for this operation — OD-07; no default policy inferred. |
| Rollback/compensation? | UNDEFINED for this operation — OD-07; no default policy inferred. |
| Stale-data behavior? | UNDEFINED for this operation — OD-07; no default policy inferred. |
| Security implications? | PARTIAL: synthetic data, role/ownership checks and preserved history; exact operation controls incomplete. |
| Testing requirements? | REQUIRED, NOT IMPLEMENTED: source §31 testing categories plus this capability’s ledger validation checks. |
| Acceptance criteria? | DERIVED checks in linked ledger entries; precise unresolved business outcomes remain in OD-07. |

### CAP-08 — override

Evidence: REQ-LT-0009, REQ-LT-0064. Source locations and per-requirement checks are in the ledger. Open decisions: OD-06 OD-08 OD-12.

| Audit question | Evidence / explicit gap |
|---|---|
| What? | KNOWN at requirement level: REQ-LT-0009, REQ-LT-0064. |
| Who? | PARTIAL: HoD. Exact unresolved authority is in OD-06 OD-08 OD-12. |
| Trigger? | PARTIAL: Correction/overwrite. |
| Preconditions? | UNDEFINED for this operation — OD-06 OD-08 OD-12; no default policy inferred. |
| Authorization? | PARTIAL: HoD general overwrite; Assistant scoped FIFO action separate; explicit correction bounds open. |
| Inputs? | UNDEFINED for this operation — OD-06 OD-08 OD-12; no default policy inferred. |
| Validation? | PARTIAL: source constraints in linked requirements; field schemas and all limits not specified. |
| Normal flow? | PARTIAL: see source-stated behavior in REQ-LT-0009, REQ-LT-0064; complete operation contract absent. |
| Decision rule? | UNDEFINED for this operation — OD-06 OD-08 OD-12; no default policy inferred. |
| State transition? | PARTIAL: Correction transition rules incomplete. |
| Persistent state? | PARTIAL: Affected record and append-only audit; entity schemas absent. |
| Database mutation? | PARTIAL: correct authoritative records without rewriting raw audit; stock/approval consistency constraints open. |
| Transaction boundary? | UNDEFINED for this operation — OD-06 OD-08 OD-12; no default policy inferred. |
| Concurrency concerns? | GAP: correction while physical issue/return or downstream projection is active (OD-08/12). |
| External side effects? | UNDEFINED for this operation — OD-06 OD-08 OD-12; no default policy inferred. |
| Event? | UNDEFINED for this operation — OD-06 OD-08 OD-12; no default policy inferred. |
| Notification? | UNDEFINED for this operation — OD-06 OD-08 OD-12; no default policy inferred. |
| Audit record? | KNOWN: before/after, actor, correction reason and append-only compensating event (AG). |
| Failure modes? | UNDEFINED for this operation — OD-06 OD-08 OD-12; no default policy inferred. |
| Retry? | UNDEFINED for this operation — OD-06 OD-08 OD-12; no default policy inferred. |
| Idempotency? | UNDEFINED for this operation — OD-06 OD-08 OD-12; no default policy inferred. |
| Rollback/compensation? | UNDEFINED for this operation — OD-06 OD-08 OD-12; no default policy inferred. |
| Stale-data behavior? | UNDEFINED for this operation — OD-06 OD-08 OD-12; no default policy inferred. |
| Security implications? | PARTIAL: synthetic data, role/ownership checks and preserved history; exact operation controls incomplete. |
| Testing requirements? | REQUIRED, NOT IMPLEMENTED: source §31 testing categories plus this capability’s ledger validation checks. |
| Acceptance criteria? | DERIVED checks in linked ledger entries; precise unresolved business outcomes remain in OD-06 OD-08 OD-12. |

### CAP-09 — issue

Evidence: REQ-LT-0024, REQ-LT-0026, REQ-LT-0027, REQ-LT-0028, REQ-LT-0029. Source locations and per-requirement checks are in the ledger. Open decisions: OD-06 OD-07 OD-10 OD-12.

| Audit question | Evidence / explicit gap |
|---|---|
| What? | KNOWN at requirement level: REQ-LT-0024, REQ-LT-0026, REQ-LT-0027, REQ-LT-0028, REQ-LT-0029. |
| Who? | PARTIAL: Authorized issuing-lab Assistant. Exact unresolved authority is in OD-06 OD-07 OD-10 OD-12. |
| Trigger? | PARTIAL: Physical handover/use start. |
| Preconditions? | KNOWN: approved operational order, assigned Assistant, actual available stock/asset and issuing lab. |
| Authorization? | PARTIAL: server-side project/lab/role controls (SRC-02 AG); complete operation matrix absent. |
| Inputs? | KNOWN: approved quantity/allocation or physical asset identity, issue/use purpose and start/duration. |
| Validation? | KNOWN: re-read/lock authoritative quantity/asset; barcode/lab/state must match. |
| Normal flow? | KNOWN: lock/recheck → stock/asset mutation + issue + audit + outbox → commit (L1). |
| Decision rule? | UNDEFINED for this operation — OD-06 OD-07 OD-10 OD-12; no default policy inferred. |
| State transition? | PARTIAL: APPROVED/FULFILMENT_PENDING → ISSUED/IN_USE or FULFILMENT_FAILED_STOCK. |
| Persistent state? | PARTIAL: Order, issue, stock/asset, SQL transaction; entity schemas absent. |
| Database mutation? | KNOWN: consumable good/total decrease or asset enters active-use/issued state, issue/audit/outbox persist. |
| Transaction boundary? | PARTIAL: single MySQL transaction; cross-lab approved-order aggregate boundary unresolved (OD-10). |
| Concurrency concerns? | KNOWN: lock stock/asset to prevent oversell/double issue; claim/cancel/retry integration open. |
| External side effects? | KNOWN: physical handover/use plus asynchronous notification; physical compensation undefined. |
| Event? | PARTIAL: authoritative domain/outbox event required (AA/BL3); named complete payload contract absent. |
| Notification? | PARTIAL: AA6 intended role-based event recipients; precise routing gaps OD-03/15. |
| Audit record? | PARTIAL: important mutations auditable, actor/time/history retained (SRC-02 AH); exact schema/residence incomplete (OD-12). |
| Failure modes? | KNOWN: stock race → FULFILMENT_FAILED_STOCK; SQL failure rolls back; multi-lab physical failure open. |
| Retry? | UNDEFINED for this operation — OD-06 OD-07 OD-10 OD-12; no default policy inferred. |
| Idempotency? | PARTIAL: duplicate issue must not commit twice; key scope/retention/response replay unspecified. |
| Rollback/compensation? | PARTIAL: SQL rollback explicit; already handed-over hardware cannot be undone by SQL rollback. |
| Stale-data behavior? | KNOWN: revalidate at issue; prior display/approval does not guarantee stock. |
| Security implications? | PARTIAL: synthetic data, role/ownership checks and preserved history; exact operation controls incomplete. |
| Testing requirements? | REQUIRED, NOT IMPLEMENTED: source §31 testing categories plus this capability’s ledger validation checks. |
| Acceptance criteria? | DERIVED checks in linked ledger entries; precise unresolved business outcomes remain in OD-06 OD-07 OD-10 OD-12. |

### CAP-10 — duration

Evidence: REQ-LT-0030. Source locations and per-requirement checks are in the ledger. Open decisions: OD-11.

| Audit question | Evidence / explicit gap |
|---|---|
| What? | KNOWN at requirement level: REQ-LT-0030. |
| Who? | PARTIAL: Student; reviewers; issuing Assistant. Exact unresolved authority is in OD-11. |
| Trigger? | PARTIAL: Request duration / issue start. |
| Preconditions? | UNDEFINED for this operation — OD-11; no default policy inferred. |
| Authorization? | PARTIAL: server-side project/lab/role controls (SRC-02 AG); complete operation matrix absent. |
| Inputs? | KNOWN: student requested duration and approved issue/use start; units/limits/timezone undefined. |
| Validation? | PARTIAL: source constraints in linked requirements; field schemas and all limits not specified. |
| Normal flow? | PARTIAL: see source-stated behavior in REQ-LT-0030; complete operation contract absent. |
| Decision rule? | KNOWN: reviewers approve/reject rather than silently changing duration; audited HoD correction allowed. |
| State transition? | PARTIAL: Approved issue receives due time. |
| Persistent state? | PARTIAL: Issue/use due-date version; entity schemas absent. |
| Database mutation? | PARTIAL: due-date/version stored with issue; exact calculation/schema absent. |
| Transaction boundary? | UNDEFINED for this operation — OD-11; no default policy inferred. |
| Concurrency concerns? | GAP: start-time changes/corrections and scheduling against due-date version (OD-11). |
| External side effects? | UNDEFINED for this operation — OD-11; no default policy inferred. |
| Event? | UNDEFINED for this operation — OD-11; no default policy inferred. |
| Notification? | UNDEFINED for this operation — OD-11; no default policy inferred. |
| Audit record? | UNDEFINED for this operation — OD-11; no default policy inferred. |
| Failure modes? | UNDEFINED for this operation — OD-11; no default policy inferred. |
| Retry? | UNDEFINED for this operation — OD-11; no default policy inferred. |
| Idempotency? | UNDEFINED for this operation — OD-11; no default policy inferred. |
| Rollback/compensation? | UNDEFINED for this operation — OD-11; no default policy inferred. |
| Stale-data behavior? | UNDEFINED for this operation — OD-11; no default policy inferred. |
| Security implications? | PARTIAL: synthetic data, role/ownership checks and preserved history; exact operation controls incomplete. |
| Testing requirements? | REQUIRED, NOT IMPLEMENTED: source §31 testing categories plus this capability’s ledger validation checks. |
| Acceptance criteria? | DERIVED checks in linked ledger entries; precise unresolved business outcomes remain in OD-11. |

### CAP-11 — extension

Evidence: REQ-LT-0031, REQ-LT-0032. Source locations and per-requirement checks are in the ledger. Open decisions: OD-11.

| Audit question | Evidence / explicit gap |
|---|---|
| What? | KNOWN at requirement level: REQ-LT-0031, REQ-LT-0032. |
| Who? | PARTIAL: Requester and original approval actors. Exact unresolved authority is in OD-11. |
| Trigger? | PARTIAL: Extension request. |
| Preconditions? | PARTIAL: existing issue and original authority path; overdue/returned boundary and counting semantics undefined. |
| Authorization? | PARTIAL: server-side project/lab/role controls (SRC-02 AG); complete operation matrix absent. |
| Inputs? | KNOWN: requested revised duration/due date. |
| Validation? | PARTIAL: source constraints in linked requirements; field schemas and all limits not specified. |
| Normal flow? | PARTIAL: see source-stated behavior in REQ-LT-0031, REQ-LT-0032; complete operation contract absent. |
| Decision rule? | KNOWN: same approval path, configurable max two; existing due date applies until approval. |
| State transition? | PARTIAL: REQUESTED → APPROVED or REJECTED. |
| Persistent state? | PARTIAL: Extension and due-date history; entity schemas absent. |
| Database mutation? | KNOWN: extension event/new due-date version; old history retained. |
| Transaction boundary? | UNDEFINED for this operation — OD-11; no default policy inferred. |
| Concurrency concerns? | GAP: simultaneous extension requests, return/closure and reminder processing. |
| External side effects? | UNDEFINED for this operation — OD-11; no default policy inferred. |
| Event? | PARTIAL: authoritative domain/outbox event required (AA/BL3); named complete payload contract absent. |
| Notification? | PARTIAL: AA6 intended role-based event recipients; precise routing gaps OD-03/15. |
| Audit record? | PARTIAL: important mutations auditable, actor/time/history retained (SRC-02 AH); exact schema/residence incomplete (OD-12). |
| Failure modes? | UNDEFINED for this operation — OD-11; no default policy inferred. |
| Retry? | UNDEFINED for this operation — OD-11; no default policy inferred. |
| Idempotency? | UNDEFINED for this operation — OD-11; no default policy inferred. |
| Rollback/compensation? | UNDEFINED for this operation — OD-11; no default policy inferred. |
| Stale-data behavior? | PARTIAL: pending request does not alter due date; stale approval/notification suppression unspecified. |
| Security implications? | PARTIAL: synthetic data, role/ownership checks and preserved history; exact operation controls incomplete. |
| Testing requirements? | REQUIRED, NOT IMPLEMENTED: source §31 testing categories plus this capability’s ledger validation checks. |
| Acceptance criteria? | DERIVED checks in linked ledger entries; precise unresolved business outcomes remain in OD-11. |

### CAP-12 — reminders

Evidence: REQ-LT-0033, REQ-LT-0034, REQ-LT-0068. Source locations and per-requirement checks are in the ledger. Open decisions: OD-03 OD-11 OD-12 OD-21.

| Audit question | Evidence / explicit gap |
|---|---|
| What? | KNOWN at requirement level: REQ-LT-0033, REQ-LT-0034, REQ-LT-0068. |
| Who? | PARTIAL: Primary scheduler and role-derived recipients. Exact unresolved authority is in OD-03 OD-11 OD-12 OD-21. |
| Trigger? | PARTIAL: Due/overdue/recovery obligation. |
| Preconditions? | UNDEFINED for this operation — OD-03 OD-11 OD-12 OD-21; no default policy inferred. |
| Authorization? | PARTIAL: server-side project/lab/role controls (SRC-02 AG); complete operation matrix absent. |
| Inputs? | KNOWN: active issue, due date, policy timings and role mappings. |
| Validation? | PARTIAL: source constraints in linked requirements; field schemas and all limits not specified. |
| Normal flow? | PARTIAL: primary scheduler finds obligations and emits notification processing; durable obligation schema absent. |
| Decision rule? | PARTIAL: T−5, daily after due, day-5/7 recipients; calendar boundaries/catch-up unclear. |
| State transition? | PARTIAL: Processing/delivery states unspecified. |
| Persistent state? | PARTIAL: Scheduler, due-date version, notification obligation; entity schemas absent. |
| Database mutation? | UNDEFINED for this operation — OD-03 OD-11 OD-12 OD-21; no default policy inferred. |
| Transaction boundary? | UNDEFINED for this operation — OD-03 OD-11 OD-12 OD-21; no default policy inferred. |
| Concurrency concerns? | UNDEFINED for this full operation; see OD-03 OD-11 OD-12 OD-21. |
| External side effects? | KNOWN: in-app/email and escalation notification; external repeated-send ambiguity unresolved. |
| Event? | UNDEFINED for this operation — OD-03 OD-11 OD-12 OD-21; no default policy inferred. |
| Notification? | UNDEFINED for this operation — OD-03 OD-11 OD-12 OD-21; no default policy inferred. |
| Audit record? | UNDEFINED for this operation — OD-03 OD-11 OD-12 OD-21; no default policy inferred. |
| Failure modes? | UNDEFINED for this operation — OD-03 OD-11 OD-12 OD-21; no default policy inferred. |
| Retry? | PARTIAL: restart scans missed obligations, delivery retries independently; backoff/limits/catch-up policy undefined. |
| Idempotency? | PARTIAL: jobs must not duplicate processing; identity tied to due-date version not defined. |
| Rollback/compensation? | UNDEFINED for this operation — OD-03 OD-11 OD-12 OD-21; no default policy inferred. |
| Stale-data behavior? | GAP: changed due date/returned item after obligation generation (OD-11). |
| Security implications? | PARTIAL: synthetic data, role/ownership checks and preserved history; exact operation controls incomplete. |
| Testing requirements? | REQUIRED, NOT IMPLEMENTED: source §31 testing categories plus this capability’s ledger validation checks. |
| Acceptance criteria? | DERIVED checks in linked ledger entries; precise unresolved business outcomes remain in OD-03 OD-11 OD-12 OD-21. |

### CAP-13 — reservation

Evidence: REQ-LT-0035, REQ-LT-0036, REQ-LT-0037, REQ-LT-0038. Source locations and per-requirement checks are in the ledger. Open decisions: OD-04 OD-08 OD-10 OD-11.

| Audit question | Evidence / explicit gap |
|---|---|
| What? | KNOWN at requirement level: REQ-LT-0035, REQ-LT-0036, REQ-LT-0037, REQ-LT-0038. |
| Who? | PARTIAL: Student; Assistant/HoD override; scheduler. Exact unresolved authority is in OD-04 OD-08 OD-10 OD-11. |
| Trigger? | PARTIAL: Unavailable item / availability / expiry. |
| Preconditions? | KNOWN: existing but unavailable/issued stock; eligibility details/open quantities remain undefined. |
| Authorization? | PARTIAL: server-side project/lab/role controls (SRC-02 AG); complete operation matrix absent. |
| Inputs? | UNDEFINED for this operation — OD-04 OD-08 OD-10 OD-11; no default policy inferred. |
| Validation? | PARTIAL: source constraints in linked requirements; field schemas and all limits not specified. |
| Normal flow? | PARTIAL: see source-stated behavior in REQ-LT-0035, REQ-LT-0036, REQ-LT-0037, REQ-LT-0038; complete operation contract absent. |
| Decision rule? | PARTIAL: FIFO, type-level asset reservation, configured 24h expiry and scoped override; timer/hold/scarcity policy open. |
| State transition? | PARTIAL: WAITING_FIFO → FULFILABLE → FULFILLED; EXPIRED/CANCELLED. |
| Persistent state? | PARTIAL: Queue, possible hold, stock/type; entity schemas absent. |
| Database mutation? | PARTIAL: SQL reservation/priority/expiry; hold creation and stock effect undefined. |
| Transaction boundary? | UNDEFINED for this operation — OD-04 OD-08 OD-10 OD-11; no default policy inferred. |
| Concurrency concerns? | GAP: return/reserve/issue/expiry/override races and concurrent queue positions. |
| External side effects? | UNDEFINED for this operation — OD-04 OD-08 OD-10 OD-11; no default policy inferred. |
| Event? | PARTIAL: authoritative domain/outbox event required (AA/BL3); named complete payload contract absent. |
| Notification? | PARTIAL: AA6 intended role-based event recipients; precise routing gaps OD-03/15. |
| Audit record? | PARTIAL: important mutations auditable, actor/time/history retained (SRC-02 AH); exact schema/residence incomplete (OD-12). |
| Failure modes? | UNDEFINED for this operation — OD-04 OD-08 OD-10 OD-11; no default policy inferred. |
| Retry? | UNDEFINED for this operation — OD-04 OD-08 OD-10 OD-11; no default policy inferred. |
| Idempotency? | UNDEFINED for this operation — OD-04 OD-08 OD-10 OD-11; no default policy inferred. |
| Rollback/compensation? | PARTIAL: expiry/cancel releases associated priority/hold; creation/ownership of hold not defined. |
| Stale-data behavior? | UNDEFINED for this operation — OD-04 OD-08 OD-10 OD-11; no default policy inferred. |
| Security implications? | PARTIAL: synthetic data, role/ownership checks and preserved history; exact operation controls incomplete. |
| Testing requirements? | REQUIRED, NOT IMPLEMENTED: source §31 testing categories plus this capability’s ledger validation checks. |
| Acceptance criteria? | DERIVED checks in linked ledger entries; precise unresolved business outcomes remain in OD-04 OD-08 OD-10 OD-11. |

### CAP-14 — cancellation

Evidence: REQ-LT-0039. Source locations and per-requirement checks are in the ledger. Open decisions: OD-04 OD-10.

| Audit question | Evidence / explicit gap |
|---|---|
| What? | KNOWN at requirement level: REQ-LT-0039. |
| Who? | PARTIAL: Authorized Project Lead. Exact unresolved authority is in OD-04 OD-10. |
| Trigger? | PARTIAL: Withdraw before issue. |
| Preconditions? | KNOWN: pre-physical-issue request or WAITING_FIFO reservation. |
| Authorization? | PARTIAL: server-side project/lab/role controls (SRC-02 AG); complete operation matrix absent. |
| Inputs? | UNDEFINED for this operation — OD-04 OD-10; no default policy inferred. |
| Validation? | PARTIAL: source constraints in linked requirements; field schemas and all limits not specified. |
| Normal flow? | KNOWN: CANCELLED + audit + release hold + advance queue + notification (UAQ26). |
| Decision rule? | UNDEFINED for this operation — OD-04 OD-10; no default policy inferred. |
| State transition? | PARTIAL: Eligible pre-issue / WAITING_FIFO → CANCELLED. |
| Persistent state? | PARTIAL: Request/reservation/hold; entity schemas absent. |
| Database mutation? | UNDEFINED for this operation — OD-04 OD-10; no default policy inferred. |
| Transaction boundary? | UNDEFINED for this operation — OD-04 OD-10; no default policy inferred. |
| Concurrency concerns? | GAP: simultaneous issue/approval and partially issued multi-lab request. |
| External side effects? | UNDEFINED for this operation — OD-04 OD-10; no default policy inferred. |
| Event? | PARTIAL: authoritative domain/outbox event required (AA/BL3); named complete payload contract absent. |
| Notification? | PARTIAL: AA6 intended role-based event recipients; precise routing gaps OD-03/15. |
| Audit record? | PARTIAL: important mutations auditable, actor/time/history retained (SRC-02 AH); exact schema/residence incomplete (OD-12). |
| Failure modes? | PARTIAL: cancellation after issue prohibited; exact rejection response and stale request handling absent. |
| Retry? | UNDEFINED for this operation — OD-04 OD-10; no default policy inferred. |
| Idempotency? | UNDEFINED for this operation — OD-04 OD-10; no default policy inferred. |
| Rollback/compensation? | UNDEFINED for this operation — OD-04 OD-10; no default policy inferred. |
| Stale-data behavior? | UNDEFINED for this operation — OD-04 OD-10; no default policy inferred. |
| Security implications? | PARTIAL: synthetic data, role/ownership checks and preserved history; exact operation controls incomplete. |
| Testing requirements? | REQUIRED, NOT IMPLEMENTED: source §31 testing categories plus this capability’s ledger validation checks. |
| Acceptance criteria? | DERIVED checks in linked ledger entries; precise unresolved business outcomes remain in OD-04 OD-10. |

### CAP-15 — return

Evidence: REQ-LT-0040, REQ-LT-0041, REQ-LT-0042, REQ-LT-0043. Source locations and per-requirement checks are in the ledger. Open decisions: OD-10 OD-16.

| Audit question | Evidence / explicit gap |
|---|---|
| What? | KNOWN at requirement level: REQ-LT-0040, REQ-LT-0041, REQ-LT-0042, REQ-LT-0043. |
| Who? | PARTIAL: Returning student/project and inspecting Assistant. Exact unresolved authority is in OD-10 OD-16. |
| Trigger? | PARTIAL: Physical return. |
| Preconditions? | PARTIAL: issued item and authorized inspector; repeated/staged return and acknowledgement closure rules open. |
| Authorization? | PARTIAL: server-side project/lab/role controls (SRC-02 AG); complete operation matrix absent. |
| Inputs? | KNOWN: asset condition/test/evidence or expected/returned/good/bad/missing quantities; original issue. |
| Validation? | PARTIAL: source constraints in linked requirements; field schemas and all limits not specified. |
| Normal flow? | PARTIAL: see source-stated behavior in REQ-LT-0040, REQ-LT-0041, REQ-LT-0042, REQ-LT-0043; complete operation contract absent. |
| Decision rule? | UNDEFINED for this operation — OD-10 OD-16; no default policy inferred. |
| State transition? | PARTIAL: Issued/use → closure and condition-dependent physical state. |
| Persistent state? | PARTIAL: Return, inspection, original issue, asset/stock; entity schemas absent. |
| Database mutation? | KNOWN: add returned good/bad quantities; missing not restored; asset availability follows condition (W3). |
| Transaction boundary? | UNDEFINED: return/inspection/evidence transaction boundary and staged aggregate closure (OD-16). |
| Concurrency concerns? | GAP: repeated return/extension/retention/repair or excess quantity restoration. |
| External side effects? | KNOWN: physical handback, required asset evidence where applicable, acknowledgement and notifications. |
| Event? | PARTIAL: authoritative domain/outbox event required (AA/BL3); named complete payload contract absent. |
| Notification? | PARTIAL: AA6 intended role-based event recipients; precise routing gaps OD-03/15. |
| Audit record? | PARTIAL: important mutations auditable, actor/time/history retained (SRC-02 AH); exact schema/residence incomplete (OD-12). |
| Failure modes? | UNDEFINED for this operation — OD-10 OD-16; no default policy inferred. |
| Retry? | UNDEFINED for this operation — OD-10 OD-16; no default policy inferred. |
| Idempotency? | UNDEFINED for this operation — OD-10 OD-16; no default policy inferred. |
| Rollback/compensation? | UNDEFINED for this operation — OD-10 OD-16; no default policy inferred. |
| Stale-data behavior? | UNDEFINED for this operation — OD-10 OD-16; no default policy inferred. |
| Security implications? | PARTIAL: synthetic data, role/ownership checks and preserved history; exact operation controls incomplete. |
| Testing requirements? | REQUIRED, NOT IMPLEMENTED: source §31 testing categories plus this capability’s ledger validation checks. |
| Acceptance criteria? | DERIVED checks in linked ledger entries; precise unresolved business outcomes remain in OD-10 OD-16. |

### CAP-16 — repair

Evidence: REQ-LT-0044. Source locations and per-requirement checks are in the ledger. Open decisions: OD-16.

| Audit question | Evidence / explicit gap |
|---|---|
| What? | KNOWN at requirement level: REQ-LT-0044. |
| Who? | PARTIAL: Authorized verifier; exact role open. Exact unresolved authority is in OD-16. |
| Trigger? | PARTIAL: Repair completion. |
| Preconditions? | UNDEFINED for this operation — OD-16; no default policy inferred. |
| Authorization? | UNDEFINED: authorized verifier role and repair-state ownership (OD-16). |
| Inputs? | UNDEFINED for this operation — OD-16; no default policy inferred. |
| Validation? | PARTIAL: source constraints in linked requirements; field schemas and all limits not specified. |
| Normal flow? | PARTIAL: see source-stated behavior in REQ-LT-0044; complete operation contract absent. |
| Decision rule? | KNOWN: verified repaired bad stock moves to good without changing total; verified asset may become AVAILABLE. |
| State transition? | PARTIAL: DEFECTIVE/UNDER_REPAIR → AVAILABLE; bad → good. |
| Persistent state? | PARTIAL: Asset or good/bad stock, repair history; entity schemas absent. |
| Database mutation? | KNOWN: bad decreases and good increases equally, or verified physical asset state changes. |
| Transaction boundary? | UNDEFINED for this operation — OD-16; no default policy inferred. |
| Concurrency concerns? | UNDEFINED for this full operation; see OD-16. |
| External side effects? | UNDEFINED for this operation — OD-16; no default policy inferred. |
| Event? | UNDEFINED for this operation — OD-16; no default policy inferred. |
| Notification? | UNDEFINED for this operation — OD-16; no default policy inferred. |
| Audit record? | UNDEFINED for this operation — OD-16; no default policy inferred. |
| Failure modes? | UNDEFINED for this operation — OD-16; no default policy inferred. |
| Retry? | UNDEFINED for this operation — OD-16; no default policy inferred. |
| Idempotency? | UNDEFINED for this operation — OD-16; no default policy inferred. |
| Rollback/compensation? | UNDEFINED for this operation — OD-16; no default policy inferred. |
| Stale-data behavior? | UNDEFINED for this operation — OD-16; no default policy inferred. |
| Security implications? | PARTIAL: synthetic data, role/ownership checks and preserved history; exact operation controls incomplete. |
| Testing requirements? | REQUIRED, NOT IMPLEMENTED: source §31 testing categories plus this capability’s ledger validation checks. |
| Acceptance criteria? | DERIVED checks in linked ledger entries; precise unresolved business outcomes remain in OD-16. |

### CAP-17 — retention

Evidence: REQ-LT-0045. Source locations and per-requirement checks are in the ledger. Open decisions: OD-16.

| Audit question | Evidence / explicit gap |
|---|---|
| What? | KNOWN at requirement level: REQ-LT-0045. |
| Who? | PARTIAL: Department project handover participants; authority open. Exact unresolved authority is in OD-16. |
| Trigger? | PARTIAL: Project retained by department. |
| Preconditions? | PARTIAL: department accepts project handover; exact accepting/approving authority absent. |
| Authorization? | UNDEFINED: retained-project handover approval authority (OD-16). |
| Inputs? | UNDEFINED for this operation — OD-16; no default policy inferred. |
| Validation? | PARTIAL: source constraints in linked requirements; field schemas and all limits not specified. |
| Normal flow? | PARTIAL: see source-stated behavior in REQ-LT-0045; complete operation contract absent. |
| Decision rule? | KNOWN: no second stock decrement and no availability restoration. |
| State transition? | PARTIAL: Closed; asset RETAINED_IN_PROJECT. |
| Persistent state? | PARTIAL: Issue closure, project and inventory; entity schemas absent. |
| Database mutation? | KNOWN: close issue, keep issued quantity excluded; asset RETAINED_IN_PROJECT and history retained. |
| Transaction boundary? | UNDEFINED for this operation — OD-16; no default policy inferred. |
| Concurrency concerns? | UNDEFINED for this full operation; see OD-16. |
| External side effects? | KNOWN: physical project remains with department, components stay in it. |
| Event? | PARTIAL: authoritative domain/outbox event required (AA/BL3); named complete payload contract absent. |
| Notification? | PARTIAL: AA6 intended role-based event recipients; precise routing gaps OD-03/15. |
| Audit record? | PARTIAL: important mutations auditable, actor/time/history retained (SRC-02 AH); exact schema/residence incomplete (OD-12). |
| Failure modes? | UNDEFINED for this operation — OD-16; no default policy inferred. |
| Retry? | UNDEFINED for this operation — OD-16; no default policy inferred. |
| Idempotency? | UNDEFINED for this operation — OD-16; no default policy inferred. |
| Rollback/compensation? | UNDEFINED for this operation — OD-16; no default policy inferred. |
| Stale-data behavior? | UNDEFINED for this operation — OD-16; no default policy inferred. |
| Security implications? | PARTIAL: synthetic data, role/ownership checks and preserved history; exact operation controls incomplete. |
| Testing requirements? | REQUIRED, NOT IMPLEMENTED: source §31 testing categories plus this capability’s ledger validation checks. |
| Acceptance criteria? | DERIVED checks in linked ledger entries; precise unresolved business outcomes remain in OD-16. |

### CAP-18 — accountability

Evidence: REQ-LT-0046, REQ-LT-0047, REQ-LT-0048, REQ-LT-0049, REQ-LT-0050, REQ-LT-0051. Source locations and per-requirement checks are in the ledger. Open decisions: OD-13 OD-15 OD-16 OD-18.

| Audit question | Evidence / explicit gap |
|---|---|
| What? | KNOWN at requirement level: REQ-LT-0046, REQ-LT-0047, REQ-LT-0048, REQ-LT-0049, REQ-LT-0050, REQ-LT-0051. |
| Who? | PARTIAL: Inspector/attribution actor; authorized viewers; HoD corrector. Exact unresolved authority is in OD-13 OD-15 OD-16 OD-18. |
| Trigger? | PARTIAL: Incident, correction or score view. |
| Preconditions? | UNDEFINED for this operation — OD-13 OD-15 OD-16 OD-18; no default policy inferred. |
| Authorization? | PARTIAL: Faculty/HoD/In-Charge visibility; HoD correction stated in score section; creation/attribution and team liability open. |
| Inputs? | KNOWN: incident, original issue/project/student, human attribution, evidence/remarks; score settings disputed. |
| Validation? | PARTIAL: source constraints in linked requirements; field schemas and all limits not specified. |
| Normal flow? | PARTIAL: see source-stated behavior in REQ-LT-0046, REQ-LT-0047, REQ-LT-0048, REQ-LT-0049, REQ-LT-0050, REQ-LT-0051; complete operation contract absent. |
| Decision rule? | CONFLICTED: incident-only versus score/NLP scope; uncertainty/recurrence/severity rules need OD-13. |
| State transition? | PARTIAL: Recorded/voided incident; derived flag if adopted. |
| Persistent state? | PARTIAL: Incident ledger; optional score; entity schemas absent. |
| Database mutation? | PARTIAL: authoritative SQL incident; score storage/recompute timing unspecified. |
| Transaction boundary? | UNDEFINED for this operation — OD-13 OD-15 OD-16 OD-18; no default policy inferred. |
| Concurrency concerns? | UNDEFINED for this full operation; see OD-13 OD-15 OD-16 OD-18. |
| External side effects? | KNOWN prohibition: no automatic fine, access block or FIFO mutation from score/flag. |
| Event? | PARTIAL: authoritative domain/outbox event required (AA/BL3); named complete payload contract absent. |
| Notification? | PARTIAL: AA6 intended role-based event recipients; precise routing gaps OD-03/15. |
| Audit record? | PARTIAL: important mutations auditable, actor/time/history retained (SRC-02 AH); exact schema/residence incomplete (OD-12). |
| Failure modes? | UNDEFINED for this operation — OD-13 OD-15 OD-16 OD-18; no default policy inferred. |
| Retry? | UNDEFINED for this operation — OD-13 OD-15 OD-16 OD-18; no default policy inferred. |
| Idempotency? | UNDEFINED for this operation — OD-13 OD-15 OD-16 OD-18; no default policy inferred. |
| Rollback/compensation? | UNDEFINED for this operation — OD-13 OD-15 OD-16 OD-18; no default policy inferred. |
| Stale-data behavior? | PARTIAL: correction recomputes if score adopted; decay refresh and correction to recurrence history unclear. |
| Security implications? | PARTIAL: synthetic data, role/ownership checks and preserved history; exact operation controls incomplete. |
| Testing requirements? | REQUIRED, NOT IMPLEMENTED: source §31 testing categories plus this capability’s ledger validation checks. |
| Acceptance criteria? | DERIVED checks in linked ledger entries; precise unresolved business outcomes remain in OD-13 OD-15 OD-16 OD-18. |

### CAP-19 — notifications

Evidence: REQ-LT-0052, REQ-LT-0053, REQ-LT-0054, REQ-LT-0056. Source locations and per-requirement checks are in the ledger. Open decisions: OD-03 OD-12 OD-14 OD-15.

| Audit question | Evidence / explicit gap |
|---|---|
| What? | KNOWN at requirement level: REQ-LT-0052, REQ-LT-0053, REQ-LT-0054, REQ-LT-0056. |
| Who? | PARTIAL: Outbox dispatcher and scoped recipients. Exact unresolved authority is in OD-03 OD-12 OD-14 OD-15. |
| Trigger? | PARTIAL: Committed domain event. |
| Preconditions? | KNOWN: committed authoritative event; role-derived recipients. |
| Authorization? | PARTIAL: server-side project/lab/role controls (SRC-02 AG); complete operation matrix absent. |
| Inputs? | UNDEFINED for this operation — OD-03 OD-12 OD-14 OD-15; no default policy inferred. |
| Validation? | PARTIAL: source constraints in linked requirements; field schemas and all limits not specified. |
| Normal flow? | KNOWN: SQL outbox → notification service → in-app and email independently (AA). |
| Decision rule? | UNDEFINED for this operation — OD-03 OD-12 OD-14 OD-15; no default policy inferred. |
| State transition? | PARTIAL: Pending/delivery result; concrete enum absent. |
| Persistent state? | PARTIAL: SQL outbox, Mongo in-app/delivery, EmailProvider; entity schemas absent. |
| Database mutation? | PARTIAL: SQL outbox, Mongo documents/delivery state; acknowledgement and canonical audit residence open. |
| Transaction boundary? | PARTIAL: outbox atomic with SQL domain write; SQL-to-Mongo/provider boundary not atomic. |
| Concurrency concerns? | UNDEFINED for this full operation; see OD-03 OD-12 OD-14 OD-15. |
| External side effects? | UNDEFINED for this operation — OD-03 OD-12 OD-14 OD-15; no default policy inferred. |
| Event? | UNDEFINED for this operation — OD-03 OD-12 OD-14 OD-15; no default policy inferred. |
| Notification? | UNDEFINED for this operation — OD-03 OD-12 OD-14 OD-15; no default policy inferred. |
| Audit record? | UNDEFINED for this operation — OD-03 OD-12 OD-14 OD-15; no default policy inferred. |
| Failure modes? | KNOWN: channel failure cannot roll back domain or block other channel; detailed outage/replay states absent. |
| Retry? | PARTIAL: independent tracked delivery retry; limits/backoff/dead-letter/manual recovery unspecified. |
| Idempotency? | PARTIAL: event/recipient/channel delivery key specified conceptually; retention and provider semantics missing. |
| Rollback/compensation? | UNDEFINED for this operation — OD-03 OD-12 OD-14 OD-15; no default policy inferred. |
| Stale-data behavior? | KNOWN: old email links to current website; it never authorizes action. |
| Security implications? | PARTIAL: synthetic data, role/ownership checks and preserved history; exact operation controls incomplete. |
| Testing requirements? | REQUIRED, NOT IMPLEMENTED: source §31 testing categories plus this capability’s ledger validation checks. |
| Acceptance criteria? | DERIVED checks in linked ledger entries; precise unresolved business outcomes remain in OD-03 OD-12 OD-14 OD-15. |

### CAP-20 — recommendation

Evidence: REQ-LT-0057, REQ-LT-0058, REQ-LT-0059. Source locations and per-requirement checks are in the ledger. Open decisions: OD-18.

| Audit question | Evidence / explicit gap |
|---|---|
| What? | KNOWN at requirement level: REQ-LT-0057, REQ-LT-0058, REQ-LT-0059. |
| Who? | PARTIAL: Student; optional recommendation service. Exact unresolved authority is in OD-18. |
| Trigger? | PARTIAL: Alternative/advice request. |
| Preconditions? | UNDEFINED for this operation — OD-18; no default policy inferred. |
| Authorization? | KNOWN: no authority to approve/issue/mutate inventory/FIFO; catalogue/metadata maintenance role open. |
| Inputs? | KNOWN: student need, curated candidate mapping, metadata, inventory snapshot/deltas and live validator. |
| Validation? | PARTIAL: source constraints in linked requirements; field schemas and all limits not specified. |
| Normal flow? | KNOWN if enabled: curated mapping → deterministic filters → AI explanation/ranking → live SQL validation. |
| Decision rule? | UNDEFINED for this operation — OD-18; no default policy inferred. |
| State transition? | PARTIAL: Recommendation/provenance only; no domain writes. |
| Persistent state? | PARTIAL: Curated mappings, LLM adapter, live validator; entity schemas absent. |
| Database mutation? | PARTIAL: recommendation provenance in Mongo; no authoritative domain mutation. |
| Transaction boundary? | UNDEFINED for this operation — OD-18; no default policy inferred. |
| Concurrency concerns? | UNDEFINED for this full operation; see OD-18. |
| External side effects? | PARTIAL: LLM adapter external call; contract, payload/redaction, timeout and optional fallback open. |
| Event? | UNDEFINED for this operation — OD-18; no default policy inferred. |
| Notification? | UNDEFINED for this operation — OD-18; no default policy inferred. |
| Audit record? | UNDEFINED for this operation — OD-18; no default policy inferred. |
| Failure modes? | UNDEFINED for this operation — OD-18; no default policy inferred. |
| Retry? | UNDEFINED for this operation — OD-18; no default policy inferred. |
| Idempotency? | UNDEFINED for this operation — OD-18; no default policy inferred. |
| Rollback/compensation? | UNDEFINED for this operation — OD-18; no default policy inferred. |
| Stale-data behavior? | KNOWN: reject/revalidate against live MySQL before display. |
| Security implications? | PARTIAL: synthetic data, role/ownership checks and preserved history; exact operation controls incomplete. |
| Testing requirements? | REQUIRED, NOT IMPLEMENTED: source §31 testing categories plus this capability’s ledger validation checks. |
| Acceptance criteria? | DERIVED checks in linked ledger entries; precise unresolved business outcomes remain in OD-18. |

### CAP-21 — analytics

Evidence: REQ-LT-0060. Source locations and per-requirement checks are in the ledger. Open decisions: OD-15 OD-19.

| Audit question | Evidence / explicit gap |
|---|---|
| What? | KNOWN at requirement level: REQ-LT-0060. |
| Who? | PARTIAL: Authorized inventory management; exact role open. Exact unresolved authority is in OD-15 OD-19. |
| Trigger? | PARTIAL: Shortage/demand report. |
| Preconditions? | UNDEFINED for this operation — OD-15 OD-19; no default policy inferred. |
| Authorization? | UNDEFINED: Central Store is not role; actual report readers require OD-15. |
| Inputs? | PARTIAL: unmet item/quantity request/shortage; trigger/deduplication and exact fields open. |
| Validation? | PARTIAL: source constraints in linked requirements; field schemas and all limits not specified. |
| Normal flow? | PARTIAL: see source-stated behavior in REQ-LT-0060; complete operation contract absent. |
| Decision rule? | KNOWN: demand intelligence only, no procurement execution. |
| State transition? | PARTIAL: Event/aggregate states unspecified. |
| Persistent state? | PARTIAL: Unmet-demand events and Mongo analytics; entity schemas absent. |
| Database mutation? | PARTIAL: Mongo demand events/aggregates; source-event persistence contract undefined. |
| Transaction boundary? | UNDEFINED for this operation — OD-15 OD-19; no default policy inferred. |
| Concurrency concerns? | UNDEFINED for this full operation; see OD-15 OD-19. |
| External side effects? | UNDEFINED for this operation — OD-15 OD-19; no default policy inferred. |
| Event? | UNDEFINED for this operation — OD-15 OD-19; no default policy inferred. |
| Notification? | UNDEFINED for this operation — OD-15 OD-19; no default policy inferred. |
| Audit record? | UNDEFINED for this operation — OD-15 OD-19; no default policy inferred. |
| Failure modes? | UNDEFINED for this operation — OD-15 OD-19; no default policy inferred. |
| Retry? | UNDEFINED for this operation — OD-15 OD-19; no default policy inferred. |
| Idempotency? | UNDEFINED for this operation — OD-15 OD-19; no default policy inferred. |
| Rollback/compensation? | UNDEFINED for this operation — OD-15 OD-19; no default policy inferred. |
| Stale-data behavior? | UNDEFINED for this operation — OD-15 OD-19; no default policy inferred. |
| Security implications? | PARTIAL: synthetic data, role/ownership checks and preserved history; exact operation controls incomplete. |
| Testing requirements? | REQUIRED, NOT IMPLEMENTED: source §31 testing categories plus this capability’s ledger validation checks. |
| Acceptance criteria? | DERIVED checks in linked ledger entries; precise unresolved business outcomes remain in OD-15 OD-19. |

### CAP-22 — evidence

Evidence: REQ-LT-0065. Source locations and per-requirement checks are in the ledger. Open decisions: OD-16 OD-17.

| Audit question | Evidence / explicit gap |
|---|---|
| What? | KNOWN at requirement level: REQ-LT-0065. |
| Who? | PARTIAL: Assistant / authorized evidence viewer. Exact unresolved authority is in OD-16 OD-17. |
| Trigger? | PARTIAL: Inspection upload/view. |
| Preconditions? | UNDEFINED for this operation — OD-16 OD-17; no default policy inferred. |
| Authorization? | PARTIAL: server-side project/lab/role controls (SRC-02 AG); complete operation matrix absent. |
| Inputs? | PARTIAL: damaged/defective asset photo plus metadata; file restrictions undefined. |
| Validation? | PARTIAL: source constraints in linked requirements; field schemas and all limits not specified. |
| Normal flow? | PARTIAL: see source-stated behavior in REQ-LT-0065; complete operation contract absent. |
| Decision rule? | UNDEFINED for this operation — OD-16 OD-17; no default policy inferred. |
| State transition? | PARTIAL: Upload/link lifecycle unspecified. |
| Persistent state? | PARTIAL: ObjectStorageAdapter and metadata; entity schemas absent. |
| Database mutation? | KNOWN: DB stores metadata/secure reference, not photo bytes. |
| Transaction boundary? | UNDEFINED for this operation — OD-16 OD-17; no default policy inferred. |
| Concurrency concerns? | UNDEFINED for this full operation; see OD-16 OD-17. |
| External side effects? | KNOWN: object-store upload via S3 adapter. |
| Event? | UNDEFINED for this operation — OD-16 OD-17; no default policy inferred. |
| Notification? | UNDEFINED for this operation — OD-16 OD-17; no default policy inferred. |
| Audit record? | UNDEFINED for this operation — OD-16 OD-17; no default policy inferred. |
| Failure modes? | UNDEFINED: upload failure, required-photo exception, orphaned upload cleanup (OD-17). |
| Retry? | UNDEFINED for this operation — OD-16 OD-17; no default policy inferred. |
| Idempotency? | UNDEFINED for this operation — OD-16 OD-17; no default policy inferred. |
| Rollback/compensation? | UNDEFINED for this operation — OD-16 OD-17; no default policy inferred. |
| Stale-data behavior? | UNDEFINED for this operation — OD-16 OD-17; no default policy inferred. |
| Security implications? | PARTIAL: secure references required; authorization/size/type/retention controls absent. |
| Testing requirements? | REQUIRED, NOT IMPLEMENTED: source §31 testing categories plus this capability’s ledger validation checks. |
| Acceptance criteria? | DERIVED checks in linked ledger entries; precise unresolved business outcomes remain in OD-16 OD-17. |

### CAP-23 — deployment

Evidence: REQ-LT-0069, REQ-LT-0070, REQ-LT-0078. Source locations and per-requirement checks are in the ledger. Open decisions: OD-21.

| Audit question | Evidence / explicit gap |
|---|---|
| What? | KNOWN at requirement level: REQ-LT-0069, REQ-LT-0070, REQ-LT-0078. |
| Who? | PARTIAL: Technical owner/operator. Exact unresolved authority is in OD-21. |
| Trigger? | PARTIAL: Deploy/restart/promotion. |
| Preconditions? | PARTIAL: synthetic data and same versioned containers; services/accounts/cost/readiness unspecified. |
| Authorization? | PARTIAL: server-side project/lab/role controls (SRC-02 AG); complete operation matrix absent. |
| Inputs? | UNDEFINED for this operation — OD-21; no default policy inferred. |
| Validation? | PARTIAL: source constraints in linked requirements; field schemas and all limits not specified. |
| Normal flow? | PARTIAL: see source-stated behavior in REQ-LT-0069, REQ-LT-0070, REQ-LT-0078; complete operation contract absent. |
| Decision rule? | KNOWN: one primary writer/scheduler; secondary isolated/read-only; controlled promotion. |
| State transition? | PARTIAL: Promotion/recovery protocol unspecified. |
| Persistent state? | PARTIAL: Containers, cloud adapters, scheduler; entity schemas absent. |
| Database mutation? | UNDEFINED for this operation — OD-21; no default policy inferred. |
| Transaction boundary? | UNDEFINED for this operation — OD-21; no default policy inferred. |
| Concurrency concerns? | GAP: former primary fencing and scheduler leadership on promotion/restart (OD-21). |
| External side effects? | PARTIAL: cloud provisioning, email/storage connectivity; exact resources not defined. |
| Event? | UNDEFINED for this operation — OD-21; no default policy inferred. |
| Notification? | UNDEFINED for this operation — OD-21; no default policy inferred. |
| Audit record? | UNDEFINED for this operation — OD-21; no default policy inferred. |
| Failure modes? | UNDEFINED for this operation — OD-21; no default policy inferred. |
| Retry? | UNDEFINED for this operation — OD-21; no default policy inferred. |
| Idempotency? | UNDEFINED for this operation — OD-21; no default policy inferred. |
| Rollback/compensation? | UNDEFINED: restore/promotion rollback, data freshness, RPO/RTO (OD-21). |
| Stale-data behavior? | UNDEFINED for this operation — OD-21; no default policy inferred. |
| Security implications? | PARTIAL: synthetic data, role/ownership checks and preserved history; exact operation controls incomplete. |
| Testing requirements? | REQUIRED, NOT IMPLEMENTED: source §31 testing categories plus this capability’s ledger validation checks. |
| Acceptance criteria? | DERIVED checks in linked ledger entries; precise unresolved business outcomes remain in OD-21. |

## Audit outcome and structural verification

- Completeness checklist applied to **23 executable capability groups × 26 questions**. Coverage is complete at discovery level; many answers are explicitly partial/undefined. This is not a claim of implementation-ready completeness.
- Cross-system consistency audit in 03_RECONCILIATION_REPORT.md covers authorization, competing state paths, double issuance/return, claim ownership, notifications/AI authority, approval prerequisites, cancellation after physical events, history preservation and prototype leakage.
- All 85 requirement IDs are traced into the reference graph; no pitch-derived requirement exists. No application test can be run because no product implementation exists.
- **Minimum structure preserved:** all 43 numbered SRC-03 sections and all 101 headings appear verbatim in the baseline register. Future SDD may be a superset; no baseline area may be omitted or weakened. Actual SDD conformance is deferred until authorized authoring.
- The 22 open decisions distinguish core SDD blockers from production-only deferrals. No unresolved architectural choice has been silently made.
- Gate 1 remains unapproved. Do not proceed to SDD, implementation planning or code on the basis of this review alone.

## Validation requested

Validate the source authority, structural-reference identity, core system understanding and scope; resolve or explicitly defer the listed decisions with a named boundary. The user's explicit validation must be recorded against the hashed reviewed versions. Silence, elapsed time and existing “LOCKED” wording are not approval.

**AWAITING_USER_VALIDATION**

## Executed documentation verification

Verified at 2026-10-07T17:10:45+05:30 (Asia/Calcutta): all 85 requirement identifiers resolve in the graph; every cited OD resolves to one of 22 register entries; all 101 original template headings, including 43 numbered sections, match their captured text/line locations; all 23 capability audits contain the protocol's 26 questions. All 30 original source files matched discovery hashes before the required continuity-log append. No product tests were run: there is no product implementation. The only original file changed by this review is the append-only AGENT_LOG entry; other source hashes are unchanged. Final source/artifact hashes are in APPROVAL_GATE.yaml.
