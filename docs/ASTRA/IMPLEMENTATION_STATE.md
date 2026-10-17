# LabTrack Implementation State

**Authority:** User approval recorded in `docs/ASTRA/SDD_APPROVAL_GATE.yaml` (`SDD_APPROVED`).
**Canonical SDD:** `docs/architecture/LabTrack_SDD.md` (SHA-256: `b00c08352665e7c255233641816fa98e4c573ddc1d8c147f2ca7f81a29c76b6c`).
**SDD Review:** `docs/ASTRA/SDD_REVIEW.md` (SHA-256: `e8d695ac92d9ee3677c251c61747be9c282347eaa30bfbf75d12d42b138eacc0`).
**Requirement Traceability Authority:** `docs/ASTRA/02_REQUIREMENT_LEDGER.md` (85 stable IDs).
**Current Date:** 2026-10-16.

---

## 1. Implementation State Summary

| Dimension | Current State |
|---|---|
| **Overall State** | `PHASE_02_COMPLETED` (Phase 02 Sealed; Ready for Phase 03) |
| **Current Active Phase** | `PHASE_02` (COMPLETED & SEALED) |
| **Completed Phases** | `PHASE_01` (Core Foundation & Identity), `PHASE_02` (Catalogue, Inventory Model & Project Governance) |
| **Next Executable Phase** | `PHASE_03` — Request Submission, Minimum-Lab Planning & Multi-Stage Approvals |
| **Active Phase Status** | `SEALED` (Validation reports: `implementation_plans/phase_01/validation_report.md`, `implementation_plans/phase_02/validation_report.md`) |
| **Blocked Phases** | Phases 04, 05, 06 have branches partially blocked by unresolved business policies (OD-04, OD-07, OD-10, OD-11, OD-13, OD-16) |
| **Last Validation Point** | 2026-10-17: 46 tests passed, 2 service skips (local SQLite profile), 0 failures |

---

## 2. Phase Execution Status

| Phase ID | Phase Name | Scope / Focus | Status |
|---|---|---|---|
| **PHASE_01** | Core Foundation & Identity | Identity, RBAC, Core Models, Transaction Engine, Idempotency, Audit Immutability | **COMPLETED & SEALED** |
| **PHASE_02** | Catalogue & Projects | Project Lifecycle, Membership, Catalogue Structure, Physical Assets/Consumables, Fixtures | **COMPLETED & SEALED** |
| **PHASE_03** | Planning & Approvals | Minimum-Lab Exact Planning, Submission, Multi-Stage Approvals (Mentor, In-Charge, HoD) | **READY / PENDING** |
| **PHASE_04** | Claims & Physical Issue | Operational Claims, Entire-Request Issue, Cancellation, Extensions, FIFO Queue | **PENDING** |
| **PHASE_05** | Returns, Evidence & Outbox | Return Inspection, Reconciliation, Damage Evidence, Outbox Dispatch, Projections | **PENDING** |
| **PHASE_06** | Scheduling & Deployment | APScheduler Missed-Obligations, Multi-Cloud Container Configs, Reporting, Hardening | **PENDING** |

---

## 3. Requirement Status Ledger (85 Stable REQ-LT IDs)

### 3.1 Implemented & Verified in Local Prototype Baseline (44 REQs)
- **Scope & Identity:** `REQ-LT-0001`, `REQ-LT-0002`, `REQ-LT-0003`, `REQ-LT-0005`, `REQ-LT-0006`, `REQ-LT-0007`, `REQ-LT-0061`, `REQ-LT-0062`, `REQ-LT-0063`, `REQ-LT-0064`
- **Inventory & Catalogue:** `REQ-LT-0011`, `REQ-LT-0012`, `REQ-LT-0013`, `REQ-LT-0014`, `REQ-LT-0015`
- **Planning & Feasibility:** `REQ-LT-0016`, `REQ-LT-0017`, `REQ-LT-0018`, `REQ-LT-0019`
- **Approval Workflow (Standard single-class):** `REQ-LT-0022`, `REQ-LT-0023`, `REQ-LT-0024`
- **Physical Issue (Entire-request single assistant):** `REQ-LT-0026`, `REQ-LT-0027`, `REQ-LT-0028`, `REQ-LT-0029`, `REQ-LT-0030`
- **Duration & Cancellation:** `REQ-LT-0032`, `REQ-LT-0035`, `REQ-LT-0039`
- **Return & Inspection (Same-lab standard):** `REQ-LT-0041`, `REQ-LT-0042`, `REQ-LT-0043`, `REQ-LT-0047`
- **Events & Outbox Baseline:** `REQ-LT-0055`, `REQ-LT-0059`
- **Architecture & Frameworks:** `REQ-LT-0066`, `REQ-LT-0072`, `REQ-LT-0084`

### 3.2 Partially Implemented / Retaining Explicit Boundaries (23 REQs)
- `REQ-LT-0004` (Project Lead edits; submitted revision amendments / lead transfers blocked by OD-05)
- `REQ-LT-0008` (Multi-assistant assignment implemented; claim reassignment / theft policy blocked by OD-07)
- `REQ-LT-0009` (HoD Super Access implemented; discretionary unrestricted database overwrite blocked by OD-08)
- `REQ-LT-0010` (Technical Admin configuration implemented; institutional user provisioning deferred)
- `REQ-LT-0020`, `REQ-LT-0021`, `REQ-LT-0025` (Single-class routes implemented; mixed-class requests & multi-In-Charge asset routing blocked by OD-06)
- `REQ-LT-0031` (Standard extensions implemented; overdue extension blocked by OD-11)
- `REQ-LT-0036` (FIFO queue entry implemented; reservation stock holds & pickup clock blocked by OD-04)
- `REQ-LT-0040`, `REQ-LT-0046`, `REQ-LT-0048` (Standard return/incident history implemented; auto penalty/restriction blocked by OD-13, cross-lab return blocked by OD-16)
- `REQ-LT-0052`, `REQ-LT-0053`, `REQ-LT-0054`, `REQ-LT-0056` (Outbox & local document dispatch implemented; live Gmail OAuth & live external channels unverified)
- `REQ-LT-0057`, `REQ-LT-0060` (Deterministic alternatives & unmet demand implemented; live external LLM contract unverified)
- `REQ-LT-0065` (Damage photo upload & SHA-256 storage implemented; S3 live cloud bucket unverified)
- `REQ-LT-0067` (SQLAlchemy relational truth verified; live MySQL 8.4 engine test skipped locally)
- `REQ-LT-0068`, `REQ-LT-0069`, `REQ-LT-0070` (APScheduler & Docker configs prepared; cloud deployment unverified)
- `REQ-LT-0073`, `REQ-LT-0074`, `REQ-LT-0075`, `REQ-LT-0076`, `REQ-LT-0079`, `REQ-LT-0080` (Local test & validation evidence verified; live service evidence pending)

### 3.3 Explicitly Blocked by Policy / Awaiting Resolution (10 REQs)
- `REQ-LT-0033`, `REQ-LT-0034` (Overdue automated email reminders & catch-up semantics blocked by OD-11)
- `REQ-LT-0037` (24h reservation expiry anchor & stock hold bridge blocked by OD-04)
- `REQ-LT-0038` (Discretionary FIFO reordering authority blocked by OD-08)
- `REQ-LT-0044` (Unauthorized repair/return to available blocked by OD-16)
- `REQ-LT-0045` (Retention approval authority workflow blocked by OD-16)
- `REQ-LT-0049`, `REQ-LT-0050`, `REQ-LT-0051` (Numeric REPO score, automatic penalties & NLP override blocked by OD-13)
- `REQ-LT-0058` (BrowserAPIFree external contract blocked by OD-18)

### 3.4 Excluded from V1 / Governance Requirements (8 REQs)
- `REQ-LT-0071` (Mobile app excluded from V1)
- `REQ-LT-0077` (Academic team ownership context)
- `REQ-LT-0078` (Sizing assumption context)
- `REQ-LT-0081`, `REQ-LT-0082`, `REQ-LT-0085` (ASTRA governance & gate rules)
- `REQ-LT-0083` (Production institutional SSO & enterprise infrastructure deferred)

---

## 4. Current Test Baseline

- **Total Test Cases:** 42
- **Passed:** 40 (Unit, workflow, integration, concurrency, projection, error handling, Phase 01 foundation)
- **Skipped:** 2 (`tests/test_mysql_mongo.py`: `test_mysql_connection` and `test_mongo_connection` skipped when live service URLs are not configured)
- **Failed:** 0
- **Coverage:** ~88% on backend business logic

---

## 5. Known Deviations & Technical Decisions

1. **Transactional Engine:** Single SQL transaction for domain state, append-only audit, idempotency, and outbox. No network I/O inside the database transaction.
2. **Local Profile vs Production:** SQLite with WAL mode and foreign key constraints enabled for reproducible offline local development; MySQL 8.4 InnoDB is the authoritative target schema.
3. **Audit Immutability:** SQLAlchemy event listener intercepts any update or delete operation on `Audit` and throws `ValueError`.
4. **Idempotency Strategy:** `Idempotency-Key` header with client SHA-256 fingerprint; same key + same fingerprint replays result; mismatch returns `422 IDEMPOTENCY_CONFLICT`.
5. **Synthetic Authentication:** PBKDF2-HMAC-SHA256 password hashing with unique salt, opaque 40-character bearer token hashed with SHA-256 in session table.

---

## 6. Open Business Decisions & Policy Boundaries

- **OD-04:** Reservation 24h start anchor, inventory hold semantics, scarcity priority.
- **OD-05:** Project revisions after submission, member consent, lead transfer.
- **OD-06:** Mixed asset/consumable request routing and multi-In-Charge approval.
- **OD-07:** Abandoned operational claim timeout and reassignment rules.
- **OD-08:** Discretionary FIFO queue reordering and unrestricted record edits.
- **OD-10:** Multi-operator physical custody handover across different labs (Entire-request SQL atomicity is CONFIRMED; physical coordination policy remains open).
- **OD-11:** Overdue calendar semantics, weekend catch-up rules, and late extension requests.
- **OD-13:** Numeric REPO index, team attribution vs individual liability, automated penalties.
- **OD-16:** Cross-lab returns, repair verification, and retention approval authority.
- **OD-18:** External LLM API contracts and live cloud provider integrations.
