# Phase 02 Validation Report: Catalogue, Inventory Model & Project Governance

**Phase ID:** `PHASE_02`  
**Phase Name:** Catalogue, Inventory Model & Project Governance  
**Status:** `VERIFIED_AND_SEALED`  
**Date:** 2026-10-17  
**Authority:** Approved LabTrack SDD (`docs/architecture/LabTrack_SDD.md`, v0.1 canonical baseline).  
**Requirement Ledger IDs Verified:** `REQ-LT-0001`, `REQ-LT-0002`, `REQ-LT-0003`, `REQ-LT-0004`, `REQ-LT-0011`, `REQ-LT-0012`, `REQ-LT-0013`, `REQ-LT-0014`, `REQ-LT-0015`, `REQ-LT-0072`, `REQ-LT-0074`.  

---

## 1. Executive Summary

Phase 02 implements the authoritative departmental hardware catalogue and project governance layer of LabTrack. All contracts, relational constraints, RBAC boundaries, and business rules were systematically implemented and proven via standalone automated test suites (`tests/test_phase_02_catalogue_projects.py`) with 100% pass rates and zero regressions against prior Phase 01 baseline tests.

---

## 2. Requirement Verification Evidence Matrix

| Requirement ID | Specification Description | Relational Model / Schema Rule | Test Verification Case | Result |
| :--- | :--- | :--- | :--- | :--- |
| **REQ-LT-0001** | Dual inventory classes: Consumable vs Asset | `Item.kind` check constraint: `ck_item_kind` (`kind IN ('ASSET', 'CONSUMABLE')`) | `test_dual_class_catalogue_constraint` | **PASSED** (Invalid kind raises `IntegrityError`) |
| **REQ-LT-0002** | Consumables tracked by integer quantities (good + bad = total) | `Stock` table: `ck_stock_nonnegative` (`good >= 0 AND bad >= 0`) & `UniqueConstraint("item_id", "lab_id")` | `test_stock_nonnegative_and_unique_constraints` | **PASSED** (`good < 0`, `bad < 0`, and duplicate `(item_id, lab_id)` rejected) |
| **REQ-LT-0003** | Serialized physical assets with unique barcodes and lifecycle states | `Asset.barcode` unique constraint; states: `AVAILABLE`, `UNDER_REPAIR`, `RETIRED`, `IN_USE` | `test_asset_barcode_uniqueness_and_lookup` | **PASSED** (Duplicate barcode rejected by database) |
| **REQ-LT-0004** | Project creation with immutable sequential global IDs (`PROJ-000001`) | `Project` table with autoincrement ID mapped to `PROJ-{id:06d}`; lead assigned to creator | `test_project_creation_sequential_id_and_governance` | **PASSED** (`lead_id == user.id`; code formatted to `PROJ-000001`) |
| **REQ-LT-0011** | Catalogue search & category filtering | `GET /api/catalogue?category={cat}&q={query}` | `test_catalogue_browsing_filtering_and_search` | **PASSED** (Sensors filtered; query matches name/desc/brand) |
| **REQ-LT-0012** | Multi-lab stock visibility | `LabStockView` breakdown (`lab_id`, `lab_name`, `good`, `bad`, `total`) | `test_catalogue_browsing_filtering_and_search` | **PASSED** (Correct per-lab stock allocation reported) |
| **REQ-LT-0013** | Asset detail lookup by barcode | `GET /api/catalogue/assets/{barcode}` | `test_asset_barcode_uniqueness_and_lookup` | **PASSED** (Returns item, lab, state, default_id, bill_number) |
| **REQ-LT-0014** | Team membership governance | `Member` table junction; members validated as active students | `test_project_creation_sequential_id_and_governance` | **PASSED** (Non-students rejected with 422 `INVALID_MEMBER`) |
| **REQ-LT-0015** | Project listing and detail scoping | `GET /api/projects` and `GET /api/projects/{id}` | `test_project_listing_detail_and_visibility_scoping` | **PASSED** (Scoped to lead, members, mentor, and HoD; 403 on third-party student) |
| **REQ-LT-0072** | Relational integrity and constraints | Foreign keys: `Item` → `Stock`, `Lab` → `Stock`, `Project` → `Member` | `test_dual_class_catalogue_constraint`, `test_stock_nonnegative_and_unique_constraints` | **PASSED** |
| **REQ-LT-0074** | Demo Fixtures validation | `fixtures/demo.json` imports 6 items, 2 labs, 6 stock allocations, 3 assets | `test_catalogue_browsing_filtering_and_search` | **PASSED** |

---

## 3. Implemented API Contracts

1. **`GET /api/catalogue`**:
   - Query parameters: `category` (optional string), `q` (optional string).
   - Response: `list[ItemView]` containing full multi-lab availability, brand, specs, and per-lab good/bad/total counts.
2. **`GET /api/catalogue/assets/{barcode}`**:
   - Path parameter: `barcode` (string).
   - Response: `AssetDetail` containing `barcode`, `item_id`, `item_name`, `lab_id`, `lab_name`, `state`, `default_id`, `bill_number`.
   - Error: `404 NOT_FOUND` if barcode does not exist.
3. **`GET /api/projects`**:
   - Headers: `Authorization: Bearer <token>`.
   - Response: `list[ProjectView]` scoped to projects visible to the authenticated actor.
4. **`GET /api/projects/{identifier}`**:
   - Path parameter: `identifier` (integer).
   - Response: `ProjectView` with complete project details and member IDs.
   - Error: `403 FORBIDDEN` if actor is not lead, member, assigned mentor, or HoD.
5. **`POST /api/projects`**:
   - Headers: `Authorization: Bearer <token>`, `Idempotency-Key: <key>`.
   - Body: `ProjectInput` (`name`, `description`, `mentor_id`, `member_ids`).
   - Response: `{"id": int, "project_code": str, "name": str}`.

---

## 4. Policy Boundaries Respected (Zero Speculative Behavior)

- **OD-05 (Project Revisions / Lead Transfers):** Project creation establishes immutable initial lead; lead transfers or post-submission amendments remain blocked.
- **OD-15 (Live Stock-Admin Editing):** Stock table updates occur only through verified transactional operational workflows; unrestricted live manual stock editing is excluded.
- **OD-06 (Mixed Requests):** Catalogue maintains strict separation between `CONSUMABLE` and `ASSET` classes.

---

## 5. Conclusion & Phase Seal

Phase 02 (Catalogue, Inventory Model & Project Governance) is **COMPLETE AND SEALED**.
All 6 dedicated Phase 02 tests and the entire regression suite pass cleanly with zero warnings or errors.
The project is ready for **PHASE 03: Request Submission, Minimum-Lab Planning & Multi-Stage Approvals**.
