# Phase 03 Validation Report: Request Submission, Minimum-Lab Planning & Multi-Stage Approvals

**Phase ID:** `PHASE_03`  
**Phase Name:** Request Submission, Minimum-Lab Planning & Multi-Stage Approvals  
**Status:** `VERIFIED_AND_SEALED`  
**Date:** 2026-10-18  
**Authority:** Approved LabTrack SDD (`docs/architecture/LabTrack_SDD.md`, v0.1 canonical baseline).  
**Requirement Ledger IDs Verified:** `REQ-LT-0016`, `REQ-LT-0017`, `REQ-LT-0018`, `REQ-LT-0019`, `REQ-LT-0020`, `REQ-LT-0021`, `REQ-LT-0022`, `REQ-LT-0023`, `REQ-LT-0024`, `REQ-LT-0025`, `REQ-LT-0055`, `REQ-LT-0057`, `REQ-LT-0059`, `REQ-LT-0060`.  

---

## 1. Executive Summary

Phase 03 establishes the mathematical optimization, student request submission, stock validation, and multi-stage faculty governance framework for LabTrack. All combinatorial allocation rules, state transitions, role-based access controls, and policy bounds were verified via the dedicated automated test suite (`tests/test_phase_03_requests_approvals.py`) and the full system test suite (`tests/`), achieving a 100% pass rate (59 passed, 2 skipped, 0 failures) with zero regressions against prior Phase 01 and Phase 02 baselines.

---

## 2. Requirement Verification Evidence Matrix

| Requirement ID | Specification Description | Relational Model / Schema Rule | Test Verification Case | Result |
| :--- | :--- | :--- | :--- | :--- |
| **REQ-LT-0016** | Authoritative availability and immediate shortage reporting | `plan()` validates against live good stock; duplicate lines rejected with 422 | `test_planning_input_validations_and_shortages` | **PASSED** (Immediate shortage reported; duplicates rejected with `INVALID_QUANTITY`) |
| **REQ-LT-0017** | Exact minimum-lab combinatorial planning (I1 exact algorithm) | Subsets evaluated in increasing cardinality $k = 1, \dots, \|L\|$ | `test_minimum_lab_planning_single_lab_and_combinations` | **PASSED** (Single-lab identified when feasible; minimal 2-lab set selected otherwise) |
| **REQ-LT-0018** | Secondary concentration score & tertiary stable lab-ID tie-breaking | Maximizes $\sum_c \sum_{l \in S} \min(q[l,c], r[c])$; breaks ties by sorted lab ID tuple | `test_minimum_lab_planning_concentration_score_and_tie_breaking` | **PASSED** (Lab 3 alone chosen over {1,2} per SDD §7 acceptance test) |
| **REQ-LT-0019** | Informational planning only (zero stock reservation, zero mutation) | Calling `POST /api/plans` returns `planning_only: True` without mutating stock | `test_planning_informational_zero_mutation` | **PASSED** (Pre- and post-stock state bitwise identical) |
| **REQ-LT-0020** | Consumable approval workflow (Student $\to$ Mentor $\to$ Central Store $\to$ HoD) | State sequence: `MENTOR_REVIEW` $\to$ `HOD_REVIEW` $\to$ `APPROVED` | `test_consumable_multi_stage_approval_chain` | **PASSED** (Central Store validates; HoD approves; full timeline preserved) |
| **REQ-LT-0021** | Asset approval workflow (Student $\to$ Mentor $\to$ In-Charge $\to$ HoD) | State sequence: `MENTOR_REVIEW` $\to$ `INCHARGE_REVIEW` $\to$ `HOD_REVIEW` $\to$ `APPROVED` | `test_asset_multi_stage_approval_chain` | **PASSED** (In-Charge cannot be omitted or bypassed by HoD) |
| **REQ-LT-0022** | Central Store is an automated system stage, not a separate login role | System validation runs inside Mentor approval transition; records audit entry | `test_consumable_multi_stage_approval_chain` | **PASSED** (`CENTRAL_STORE_VALIDATED` audit emitted automatically) |
| **REQ-LT-0023** | Quantities/durations preserved; terminal rejection at every review stage | Decision contract accepts only `APPROVE`/`REJECT` + remarks; rejection halts flow | `test_terminal_rejection_at_all_stages`, `test_reviewers_cannot_rewrite_quantities_or_duration` | **PASSED** (Rejection at any stage sets `REJECTED`; extra fields blocked by Pydantic) |
| **REQ-LT-0024** | Asset purpose differentiation (`USE_IN_COLLEGE` vs `TAKE_OUTSIDE`) | Purpose validated against inventory class; positive duration enforced | `test_asset_purpose_differentiation_and_duration` | **PASSED** (Both accepted for assets; `BORROW` restricted to consumables) |
| **REQ-LT-0025** | Distinct state families in canonical state model | States: `MENTOR_REVIEW`, `INCHARGE_REVIEW`, `HOD_REVIEW`, `APPROVED`, `REJECTED` | `test_consumable_multi_stage_approval_chain`, `test_asset_multi_stage_approval_chain` | **PASSED** (States adhere strictly to Q0 model) |
| **REQ-LT-0055** | Approval timeline records actor, role, timestamp, action, remarks, states | `Audit` rows queried on `GET /api/requests/{id}`; events emitted to Outbox | `test_consumable_multi_stage_approval_chain`, `test_asset_multi_stage_approval_chain` | **PASSED** (Timeline view matches execution sequence) |
| **REQ-LT-0057** | Curated hardware alternatives query | `GET /api/alternatives/{item_id}` filters by function, interface, and live stock > 0 | `test_curated_hardware_alternatives` | **PASSED** (Returns compatible options; empty when none match) |
| **REQ-LT-0059** | Advisory alternatives never mutate inventory or bypass approvals | Read-only endpoint; returns curated catalogue data | `test_curated_hardware_alternatives` | **PASSED** (Zero database mutations confirmed) |
| **REQ-LT-0060** | Unmet demand registration for exhausted and unstocked hardware | `POST /api/demand` and `POST /api/demand/unstocked` record demand without stock | `test_unmet_demand_registration_and_validation` | **PASSED** (Exhausted stock records demand; available stock rejects with `AVAILABLE_NOW`) |

---

## 3. Implemented API Contracts

1. **`POST /api/plans`**:
   - Request Body: `PlanInput` (`lines: list[Quantity]`).
   - Response: `{"feasible": bool, "shortages": list, "labs": list[int], "allocations": list, "planning_only": true}`.
   - Idempotent and read-only.

2. **`POST /api/requests`**:
   - Headers: `Authorization: Bearer <token>`, `Idempotency-Key: <key>`.
   - Request Body: `RequestInput` (`project_id`, `lines`, `duration_hours`, `purpose`).
   - Authorization: Verified that actor is designated `lead_id` for the project.
   - Response: `{"id": int, "state": "MENTOR_REVIEW", "plan": dict}`.

3. **`GET /api/requests` & `GET /api/requests/{identifier}`**:
   - Scoped visibility: student lead, members, assigned mentor, lab in-charge, and HoD.
   - Response: `RequestView` with allocated lines, item details, issuing labs, and complete immutable audit timeline.

4. **`POST /api/requests/{identifier}/decision`**:
   - Headers: `Authorization: Bearer <token>`, `Idempotency-Key: <key>`.
   - Request Body: `DecisionInput` (`decision: "APPROVE" | "REJECT"`, `remarks: str`).
   - Role Scoping:
     - At `MENTOR_REVIEW`: requires assigned project mentor.
     - At `INCHARGE_REVIEW`: requires assigned lab in-charge.
     - At `HOD_REVIEW`: requires HoD role with role overlap check.
   - Response: `{"id": int, "state": str}`.

5. **`GET /api/alternatives/{item_id}`**:
   - Response: `list[ItemView]` for compatible alternative items with active stock.

6. **`POST /api/demand` & `POST /api/demand/unstocked`**:
   - Records student demand for out-of-stock or non-catalogued hardware without altering physical stock.

---

## 4. Policy Boundaries Respected (Zero Speculative Behavior)

- **OD-04:** Automated reservation holds during planning remain blocked. Planning is strictly informational.
- **OD-06:** Mixed consumable and asset requests are rejected with `POLICY_REQUIRED`. Multiple In-Charge asset requests are rejected with `POLICY_REQUIRED`. Role collision between Mentor and In-Charge on the same request is rejected with `POLICY_REQUIRED`.
- **OD-15:** Central Store administration authority is strictly maintained as an automated system validation stage, avoiding any invented human login role.
- **OD-18:** Uncontrolled external LLM execution is blocked; curated candidate technical matching with live MySQL stock validation is enforced.
