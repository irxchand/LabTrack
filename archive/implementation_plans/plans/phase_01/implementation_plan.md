# Phase 01 Implementation Plan: Core Foundation, Identity & Relational Contracts

**Phase ID:** `PHASE_01`  
**Phase Name:** Core Foundation, Identity & Relational Contracts  
**Status:** `READY_FOR_EXECUTION`  
**SDD Reference:** Sections 3, 4, 23, 24, 25, 28, 32, 33, 34 (OP-01), 35, 41  
**Requirement Ledger IDs:** `REQ-LT-0005`, `REQ-LT-0006`, `REQ-LT-0007`, `REQ-LT-0008`, `REQ-LT-0009`, `REQ-LT-0010`, `REQ-LT-0061`, `REQ-LT-0062`, `REQ-LT-0063`, `REQ-LT-0064`, `REQ-LT-0066`, `REQ-LT-0067`  

---

## 1. Phase Objective & Scope

Establish the core foundational layer of LabTrack:
1. **Synthetic Authentication Engine & RBAC:** Implement `AuthProvider` protocol, `SyntheticAuthProvider` with PBKDF2-HMAC-SHA256 password hashing (310,000 iterations), unique 16-byte salt, 40-character bearer tokens with SHA-256 session hash, and server-side role validation.
2. **Relational Truth & Immutability:** SQLAlchemy 2.x Declarative Base with relational models (`User`, `AuthSession`, `Audit`, `Outbox`, `Idempotency`, `Delivery`), SQLite local WAL profile, and ORM event listeners guaranteeing `Audit` table records are strictly append-only (raising `ValueError` on any update/delete).
3. **Deterministic Command Wrapper:** Provide `command()` transactional wrapper enforcing single SQL write transaction for domain state + audit + idempotency + outbox, `Idempotency-Key` header contract (length 1–120), fingerprint conflict detection (`422 IDEMPOTENCY_CONFLICT`), replay without re-execution, and clean transaction rollback on failure.
4. **Standard Error Contract & OpenAPI:** Expose consistent JSON error responses (`code`, `message`, `status_code`), health checks, and OpenAPI 3.1 contract.

---

## 2. Concrete Change States

### 2.1 INTRODUCE
- **Module/File:** `tests/test_phase_01_foundation.py`
  - **Reason:** Provide dedicated, exhaustive automated verification for Phase 01 contracts, security boundaries, authentication error flows, and audit immutability before sealing the phase.
  - **SDD Reference:** §4, §24, §28, §31, §34 (OP-01)
  - **Requirement IDs:** `REQ-LT-0005..0010`, `REQ-LT-0061..0064`, `REQ-LT-0066..0067`
  - **Expected Behavior:** Runs standalone; verifies PBKDF2 hashing, login success, invalid password rejection, inactive account blocking, system user login prohibition, token expiration, actor resolution, idempotency key validation, conflict detection, replay, and ORM immutability interception.
  - **Dependencies:** `labtrack.auth`, `labtrack.models`, `labtrack.api`, `labtrack.db`
  - **Test Coverage:** 100% of Phase 01 requirements
  - **Acceptance Criteria:** All test assertions pass cleanly with zero warnings or errors.

### 2.2 MODIFY
- **Module/File:** `src/backend/labtrack/auth.py`
  - **Reason:** Verify and ensure strict compliance of `SyntheticAuthProvider`, password hashing iterations, role separation, and session handling against SDD §4 and §28.
  - **SDD Reference:** §4.1..4.6, §28 (Security Architecture), §34 (OP-01)
  - **Requirement IDs:** `REQ-LT-0005`, `REQ-LT-0006`, `REQ-LT-0061`, `REQ-LT-0062`, `REQ-LT-0063`
  - **Expected Behavior:** Verifies passwords with `hmac.compare_digest`; blocks inactive users and SYSTEM role accounts; issues random urlsafe bearer tokens stored as SHA-256 hashes.
  - **Dependencies:** `hashlib`, `hmac`, `secrets`, `labtrack.models`
  - **Test Coverage:** `tests/test_phase_01_foundation.py::test_auth_*`
  - **Acceptance Criteria:** Constant-time hash verification; no raw tokens persisted in database.

- **Module/File:** `src/backend/labtrack/models.py`
  - **Reason:** Confirm table schemas, foreign keys, unique constraints, and append-only event listeners for `Audit`.
  - **SDD Reference:** §23 (Data Architecture), §32 (Architecture Guardrails), §34 (OP-01)
  - **Requirement IDs:** `REQ-LT-0063`, `REQ-LT-0064`, `REQ-LT-0067`
  - **Expected Behavior:** `Audit` table rejects any SQL update or delete operation with a clear error message; non-negative constraints on quantities; UTC-naive timestamps.
  - **Dependencies:** `sqlalchemy`, `sqlalchemy.orm`, `sqlalchemy.event`
  - **Test Coverage:** `tests/test_phase_01_foundation.py::test_audit_immutability`
  - **Acceptance Criteria:** Direct `session.delete(audit_entry)` or `audit_entry.action = 'X'` raises `ValueError`.

### 2.3 INTEGRATE
- **Module/File:** `src/backend/labtrack/api.py`
  - **Reason:** Expose authenticated API routes `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`, and wrap all write endpoints with `command()` idempotency.
  - **SDD Reference:** §24 (API Contract), §34 (OP-01)
  - **Requirement IDs:** `REQ-LT-0063`, `REQ-LT-0066`
  - **Expected Behavior:** Bearer token authentication in HTTP Authorization header; 401 on missing/invalid/expired token; 422 on missing/conflicted idempotency key.
  - **Dependencies:** `fastapi`, `labtrack.auth`, `labtrack.db`, `labtrack.service`
  - **Test Coverage:** `tests/test_phase_01_foundation.py::test_api_auth_*`, `test_api_idempotency_*`
  - **Acceptance Criteria:** HTTP endpoints match `contracts/openapi.yaml`.

### 2.4 CONSUME
- **Module/File:** `contracts/openapi.yaml`
  - **Reason:** Acts as authoritative contract source for REST endpoints, schemas, headers, and error formats.
  - **SDD Reference:** §24
  - **Requirement IDs:** `REQ-LT-0066`
  - **Expected Behavior:** FastAPI routes reflect paths and schemas defined in the OpenAPI specification.
  - **Dependencies:** None
  - **Test Coverage:** Verified via FastAPI OpenAPI schema comparison.
  - **Acceptance Criteria:** No undocumented endpoints or divergent request/response shapes.

### 2.5 VALIDATE
- **Module/File:** `tests/test_phase_01_foundation.py` + full test suite (`tests/`)
  - **Reason:** Prove correctness of Phase 01 foundation before moving to Phase 02.
  - **SDD Reference:** §31, §41
  - **Requirement IDs:** `REQ-LT-0079`, `REQ-LT-0080`
  - **Expected Behavior:** All unit, integration, validation, error, and immutability tests pass without failure.
  - **Dependencies:** pytest, httpx, sqlalchemy
  - **Test Coverage:** Entire backend codebase
  - **Acceptance Criteria:** Zero test failures, zero regressions across existing 32 tests, new Phase 01 tests passing.

---

## 3. Pre-Implementation Consistency Verification Check

- [x] Phase 01 is permitted by approved SDD (§33, §34 OP-01).
- [x] All prerequisites (Python packages, virtual environment) exist.
- [x] Contracts (`contracts/openapi.yaml`) match API routes.
- [x] Database ownership is respected: Relational SQLite/MySQL owns domain truth and audit log; NoSQL holds projections only.
- [x] Authorization boundaries are enforced server-side.
- [x] No pitch deck or historical material has leaked into implementation.
- [x] Open business decisions (OD-04 through OD-22) remain blocked and are not guessed.

---

## 4. Execution Steps

1. Review and verify `auth.py`, `models.py`, `db.py`, and `api.py` against Phase 01 requirements.
2. Implement comprehensive `tests/test_phase_01_foundation.py` covering:
   - Password hashing and verification
   - Synthetic authentication login / logout / me
   - Inactive user and system account rejection
   - Token expiry and revocation
   - Idempotency key requirement, conflict handling, and replay
   - Read-only environment enforcement
   - Audit log append-only immutability
   - Schema check constraints (non-negative stock, valid kinds)
3. Execute test suite with `pytest`.
4. Validate Phase 01 exit criteria.
5. Update `docs/ASTRA/IMPLEMENTATION_STATE.md`.
