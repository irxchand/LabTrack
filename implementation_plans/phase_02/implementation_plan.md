# Phase 02 Implementation Plan: Catalogue, Inventory Model & Project Governance

**Phase ID:** `PHASE_02`  
**Phase Name:** Catalogue, Inventory Model & Project Governance  
**Status:** `IN_PROGRESS`  
**SDD Reference:** Sections 3, 5, 6, 23, 24, 32, 33, 34 (OP-02, OP-03, OP-20), 41  
**Requirement Ledger IDs:** `REQ-LT-0001`, `REQ-LT-0002`, `REQ-LT-0003`, `REQ-LT-0004`, `REQ-LT-0011`, `REQ-LT-0012`, `REQ-LT-0013`, `REQ-LT-0014`, `REQ-LT-0015`, `REQ-LT-0072`, `REQ-LT-0074`  

---

## 1. Phase Objective & Scope

Establish authoritative departmental hardware catalogue and project governance records:
1. **Dual-Class Inventory Model & Constraints:**
   - Enforce dual inventory classes: `CONSUMABLE` (quantity-tracked with good/bad/total breakdown, no serial numbers) and `ASSET` (serialized with unique barcodes, bill numbers, default IDs, and lifecycle states).
   - Enforce database check constraints: `ck_item_kind` (`kind IN ('ASSET', 'CONSUMABLE')`) and `ck_stock_nonnegative` (`good >= 0 AND bad >= 0`).
   - Physical asset states: `AVAILABLE`, `UNDER_REPAIR`, `RETIRED`, `IN_USE`.
2. **Lab-Scoped Stock Tracking & Barcode Lookups:**
   - Track inventory on a per-lab basis (`labs`, `stock`, `assets`).
   - Barcode uniqueness constraint across all assets.
   - Asset detail and barcode lookup operations with verified lab locations.
3. **Project Lifecycle & Sequential Global IDs:**
   - Student project creation with immutable, sequential deployment-global formatting: `PROJ-000001` (`PROJ-{id:06d}`).
   - Project lead automatically assigned to student creator.
   - Assigned faculty mentor validated as active user with `MENTOR` role.
   - Validated student team membership (`members` junction table) preventing non-existent users or duplicate memberships.
4. **Catalogue & Project API Contracts:**
   - `GET /api/catalogue`: Search, category filtering, lab stock availability breakdown (`good`, `bad`, `total`, `available`).
   - `POST /api/projects`: Atomic project creation with command idempotency wrapper and audit trail (`PROJECT_CREATED`).
   - `GET /api/projects`: Role-scoped project listing.
   - `GET /api/projects/{id}`: Detailed project metadata, members, and audit history.
   - Barcode lookup endpoint/support.
5. **Fixture & Demo Seed Integrity:**
   - Verify standard demonstration fixtures (`fixtures/demo.json`) import with verified labs, items, assets, and initial stock.

---

## 2. Concrete Change States

### 2.1 INTRODUCE
- **Module/File:** `tests/test_phase_02_catalogue_projects.py`
  - **Reason:** Comprehensive verification of Phase 02 requirements, relational integrity, edge cases, barcode constraints, project sequential ID formatting, and access controls.
  - **SDD Reference:** §3, §5, §6, §23, §24, §34 (OP-02, OP-03, OP-20)
  - **Requirement IDs:** `REQ-LT-0001..0004`, `REQ-LT-0011..0015`, `REQ-LT-0072`, `REQ-LT-0074`
  - **Expected Behavior:** Runs standalone; verifies dual-class catalogue, search/category filter, stock non-negativity constraint violations, unique barcode collisions, sequential project IDs, member validation, student-lead assignment, and fixture integrity.
  - **Dependencies:** `labtrack.models`, `labtrack.service`, `labtrack.api`, `labtrack.db`
  - **Acceptance Criteria:** All test assertions pass cleanly with zero warnings or errors.

### 2.2 MODIFY / ENHANCE
- **Module/File:** `src/backend/labtrack/schemas.py`
  - **Reason:** Ensure Pydantic request/response schemas for catalogue search, asset details, and project creation strictly match `contracts/openapi.yaml`.
  - **SDD Reference:** §24, §34 (OP-02, OP-03)
  - **Requirement IDs:** `REQ-LT-0002`, `REQ-LT-0011`, `REQ-LT-0015`

- **Module/File:** `src/backend/labtrack/api.py` & `src/backend/labtrack/service.py`
  - **Reason:** Ensure catalogue filtering (category, query search), dedicated asset lookup, and project listing endpoints adhere to error contracts and role scoping.
  - **SDD Reference:** §5, §6, §24
  - **Requirement IDs:** `REQ-LT-0011..0015`

### 2.3 VALIDATE
- **Module/File:** `tests/test_phase_02_catalogue_projects.py` + full test suite (`tests/`)
  - **Reason:** Verify zero regression across existing 40 tests and 100% green on new Phase 02 tests.

---

## 3. Pre-Implementation Consistency Verification Check

- [x] Phase 02 is permitted by approved SDD (§33, §34 OP-02, OP-03, OP-20).
- [x] Phase 01 is completed and sealed.
- [x] Database ownership is respected (Relational SQLite/MySQL owns domain truth and audit log).
- [x] Server-side authorization enforced.
- [x] Open business decisions (OD-05 project lead transfers, OD-15 stock admin editing) remain blocked and are not guessed.
