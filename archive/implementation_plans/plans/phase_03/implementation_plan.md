# Phase 03 Implementation Plan: Request Submission, Minimum-Lab Planning & Multi-Stage Approvals

**Phase ID:** `PHASE_03`  
**Phase Name:** Request Submission, Minimum-Lab Planning & Multi-Stage Approvals  
**Status:** `IN_PROGRESS`  
**SDD Reference:** Sections 6, 7, 8, 9, 10, 34 (OP-04, OP-05, OP-16)  
**Requirement Ledger IDs:** `REQ-LT-0016`, `REQ-LT-0017`, `REQ-LT-0018`, `REQ-LT-0019`, `REQ-LT-0020`, `REQ-LT-0021`, `REQ-LT-0022`, `REQ-LT-0023`, `REQ-LT-0024`, `REQ-LT-0025`, `REQ-LT-0055`, `REQ-LT-0057`, `REQ-LT-0059`, `REQ-LT-0060`  

---

## 1. Phase Objective & Scope

Establish the mathematical optimization, student request submission, stock validation, and multi-stage faculty governance framework:
1. **Deterministic Minimum-Lab Allocation Algorithm (I1 Exact Subset Search):**
   - Given a component demand dictionary $r[c] > 0$, search lab subsets $S$ in increasing cardinality $k = 1, 2, \dots, |L|$ to find all feasible subsets where $\sum_{l \in S} q[l,c] \ge r[c]$ for all $c$.
   - Secondary tie-breaker: maximize concentration score $\sum_c \sum_{l \in S} \min(q[l,c], r[c])$.
   - Tertiary tie-breaker: lexicographically smallest stable lab ID tuple.
   - Component allocation distributed greedily by ascending stable lab ID.
   - Enforce informational planning policy: plan generation reserves zero stock and mutates zero database rows (`REQ-LT-0019`).
2. **Authoritative Student Request Submission & Class Routing:**
   - Enforce Project Lead authorization: only the student designated as project lead may submit hardware requests (`OP-04`).
   - Departmental cross-issue protection: student can only requisition from their enrolled department labs (`AIML`, `CSE`, `RA`).
   - Single inventory class enforcement (`OD-06`): mixed `CONSUMABLE` and `ASSET` lines in a single request are rejected with `POLICY_REQUIRED`.
   - Purpose validation: Consumables must use `BORROW`; Assets must use `USE_IN_COLLEGE` or `TAKE_OUTSIDE` with positive duration (`REQ-LT-0024`).
   - Derived In-Charge mapping: Assets require that all issuing labs resolve to a single Lab In-Charge faculty member (`OD-06`).
   - Rejection of overlapping roles: Mentor and In-Charge cannot be the same person on an asset request (`OD-06`).
3. **Class-Specific Multi-Stage Faculty Approvals (`OP-05`):**
   - **Consumable Flow:** `SUBMITTED` $\to$ `MENTOR_REVIEW` $\to$ `CENTRAL_STORE_VALIDATED` $\to$ `HOD_REVIEW` $\to$ `APPROVED` (or `REJECTED`).
     - Central Store is an automated system validation stage, not a separate human login role (`REQ-LT-0022`).
   - **Asset Flow:** `SUBMITTED` $\to$ `MENTOR_REVIEW` $\to$ `INCHARGE_REVIEW` $\to$ `HOD_REVIEW` $\to$ `APPROVED` (or `REJECTED`).
   - Terminal Rejection: Rejection at any stage immediately transitions request to `REJECTED` and halts the workflow (`REQ-LT-0023`).
   - No silent modifications: Reviewers can approve or reject, but cannot silently alter quantities or duration (`REQ-LT-0023`).
   - HoD Role Isolation: HoD must have `HOD` role and cannot collide with the assigned Mentor or In-Charge (`REQ-LT-0020`, `REQ-LT-0021`).
4. **Approval Timeline & Outbox Emission (`REQ-LT-0055`):**
   - Every state transition produces an immutable SQL `Audit` record capturing actor ID, action, prior state, new state, timestamp, and optional remarks.
   - Outbox event emitted transactionally with recipient routing based on current stage and outcome.
5. **Curated Alternatives & Unmet Demand (`OP-16`):**
   - `GET /api/alternatives/{item_id}`: returns curated alternatives matching technical function and interface specifications with live stock > 0 (`REQ-LT-0057`). Suggestions are read-only and never mutate inventory (`REQ-LT-0059`).
   - `POST /api/demand`: registers unmet demand for exhausted stock items without creating stock or issuing procurement orders (`REQ-LT-0060`).
   - `POST /api/demand/unstocked`: registers unmet demand for non-catalogue hardware; rejects if item exists in catalogue (`REQ-LT-0060`).

---

## 2. Concrete Change States

### 2.1 INTRODUCE
- **Module/File:** `tests/test_phase_03_requests_approvals.py`
  - **Reason:** Comprehensive verification of Phase 03 requirements, combinatorial planning logic, tie-breakers, class routing, multi-stage approval chains, RBAC boundaries, rejection terminal states, timeline auditing, alternatives, and unmet demand.
  - **SDD Reference:** §6, §7, §8, §9, §10, §34 (OP-04, OP-05, OP-16)
  - **Requirement IDs:** `REQ-LT-0016..0025`, `REQ-LT-0055`, `REQ-LT-0057`, `REQ-LT-0059..0060`
  - **Expected Behavior:** Runs standalone; verifies all 14 Phase 03 requirements with zero failures.
  - **Dependencies:** `labtrack.models`, `labtrack.service`, `labtrack.api`, `labtrack.db`
  - **Acceptance Criteria:** 100% pass on new test suite with zero regression on prior suites.

### 2.2 MODIFY / ENHANCE
- **Module/File:** `src/backend/labtrack/service.py` & `src/backend/labtrack/api.py`
  - **Reason:** Verify and ensure that all Phase 03 edge cases, error codes, and audit records conform strictly to SDD and OpenAPI contracts.
  - **SDD Reference:** §6, §7, §8, §9, §10, §34
  - **Requirement IDs:** `REQ-LT-0016..0025`, `REQ-LT-0055`, `REQ-LT-0057`, `REQ-LT-0059..0060`

### 2.3 TRACKING & VALIDATION
- **Module/File:** `.project/tracker.md`
  - **Reason:** Track Phase 03 execution steps, verification milestones, and sign-offs as required by Operating Rule 13.
- **Module/File:** `implementation_plans/phase_03/validation_report.md`
  - **Reason:** Authoritative validation evidence matrix documenting each tested requirement ID.

---

## 3. Pre-Implementation Consistency Verification Check

- [x] Phase 03 is permitted by approved SDD (§6–§10, §34 OP-04, OP-05, OP-16).
- [x] Phase 01 and Phase 02 are completed and sealed.
- [x] Baseline test suite passes (47 passed, 2 skipped, zero regressions).
- [x] Server-side authorization enforced at all approval stages.
- [x] Open business decisions (OD-04 automated holds, OD-06 mixed-class requests / multi-InCharge, OD-18 LLM integration) remain explicitly blocked.
