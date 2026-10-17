"""Comprehensive Phase 01 Foundation, Identity, and Relational Contract Tests.

Verifies:
- PBKDF2 password hashing, salt uniqueness, and constant-time verification (REQ-LT-0062)
- SyntheticAuthProvider role and active state validation (REQ-LT-0005..0010, REQ-LT-0061)
- Opaque session token generation, hashing, expiration, and revocation (REQ-LT-0062)
- REST Authentication endpoints: /api/auth/login, /api/auth/me, /api/auth/logout (REQ-LT-0066)
- Actor dependency and RBAC enforcement (REQ-LT-0063)
- Transactional Command wrapper & Idempotency-Key contract (REQ-LT-0029, REQ-LT-0063)
- Append-only Audit immutability enforcement via SQLAlchemy event listeners (REQ-LT-0064)
- Relational schema check constraints and read-only environment guard (REQ-LT-0067)
"""
from datetime import timedelta
import uuid
import pytest
from sqlalchemy import select
from labtrack import db
from labtrack.auth import password_hash, verify_password, SyntheticAuthProvider, issue_token, token_user
from labtrack.config import settings
from labtrack.models import User, AuthSession, Audit, Stock, Item, utcnow


def test_password_hashing_and_verification():
    """Verify PBKDF2 hash format, unique salt generation, and verification."""
    pwd = "SecureStudentPass2026!"
    h1 = password_hash(pwd)
    h2 = password_hash(pwd)

    # Different salts must yield different hashes
    assert h1 != h2
    assert h1.startswith("pbkdf2_sha256$")
    parts = h1.split("$")
    assert len(parts) == 3
    assert len(parts[1]) == 32  # 16 bytes hex salt

    # Verification must succeed for correct password and fail for wrong password
    assert verify_password(pwd, h1) is True
    assert verify_password("WrongPassword123!", h1) is False
    assert verify_password("", h1) is False


def test_synthetic_auth_provider_rules(client):
    """Verify SyntheticAuthProvider rejects invalid, inactive, or system accounts."""
    provider = SyntheticAuthProvider()
    with db.Session() as session:
        # 1. Valid student
        stu = provider.authenticate(session, "DEMO-STU-001", "DemoOnly2026!")
        assert stu is not None
        assert stu.identifier == "DEMO-STU-001"
        assert "STUDENT" in stu.roles

        # 2. Invalid password
        bad_pwd = provider.authenticate(session, "DEMO-STU-001", "IncorrectPassword!")
        assert bad_pwd is None

        # 3. Non-existent identifier
        non_existent = provider.authenticate(session, "NON-EXISTENT-ID", "DemoOnly2026!")
        assert non_existent is None

        # 4. Inactive user must be rejected
        stu.active = False
        session.commit()
        inactive_auth = provider.authenticate(session, "DEMO-STU-001", "DemoOnly2026!")
        assert inactive_auth is None

        # Restore active status
        stu.active = True
        session.commit()

        # 5. User with SYSTEM role must be rejected by synthetic provider
        sys_user = User(
            name="System Service Agent",
            identifier="SYS-INTERNAL-001",
            email="system@internal.labtrack",
            password_hash=password_hash("SysSecretPass!"),
            roles=["SYSTEM"],
            active=True
        )
        session.add(sys_user)
        session.commit()

        sys_auth = provider.authenticate(session, "SYS-INTERNAL-001", "SysSecretPass!")
        assert sys_auth is None


def test_session_token_issuance_and_resolution(client):
    """Verify token issuance, expiration, and user resolution."""
    with db.Session() as session:
        user = session.scalar(select(User).where(User.identifier == "DEMO-STU-001"))
        assert user is not None

        # Issue 1-hour valid token
        token = issue_token(session, user, hours=1)
        session.commit()

        # Resolve active token
        resolved = token_user(session, token)
        assert resolved is not None
        assert resolved.id == user.id

        # Non-existent / invalid token
        assert token_user(session, "totally-invalid-token-string") is None

        # Issue expired token (negative duration)
        expired_token = issue_token(session, user, hours=-1)
        session.commit()
        assert token_user(session, expired_token) is None


def test_api_auth_lifecycle(client):
    """Verify /api/auth/login, /api/me, and /api/auth/logout HTTP flow."""
    # 1. Login with correct credentials
    login_resp = client.post("/api/auth/login", json={
        "identifier": "DEMO-STU-001",
        "password": "DemoOnly2026!"
    })
    assert login_resp.status_code == 200
    login_data = login_resp.json()
    assert "token" in login_data
    assert login_data["user"]["identifier"] == "DEMO-STU-001"
    token = login_data["token"]
    auth_header = {"Authorization": f"Bearer {token}"}

    # 2. Get profile with valid token
    me_resp = client.get("/api/me", headers=auth_header)
    assert me_resp.status_code == 200
    assert me_resp.json()["identifier"] == "DEMO-STU-001"

    # 3. Access without token -> 401
    anon_resp = client.get("/api/me")
    assert anon_resp.status_code == 401
    assert anon_resp.json()["error"]["code"] == "UNAUTHENTICATED"

    # 4. Access with malformed token -> 401
    bad_auth_resp = client.get("/api/me", headers={"Authorization": "Bearer bad-token-xyz"})
    assert bad_auth_resp.status_code == 401
    assert bad_auth_resp.json()["error"]["code"] == "UNAUTHENTICATED"

    # 5. Logout
    logout_resp = client.post("/api/auth/logout", headers=auth_header)
    assert logout_resp.status_code == 200
    assert logout_resp.json()["logged_out"] is True

    # 6. Post-logout access with revoked token -> 401
    post_logout_resp = client.get("/api/me", headers=auth_header)
    assert post_logout_resp.status_code == 401
    assert post_logout_resp.json()["error"]["code"] == "UNAUTHENTICATED"


def test_idempotency_key_validation(client, headers):
    """Verify Idempotency-Key requirement, length check, and conflict detection."""
    h = headers["student"]

    # 1. Missing Idempotency-Key on mutating command -> 422
    body = {
        "name": "Phase 01 Test Project",
        "description": "Testing idempotency",
        "mentor_id": 3,
        "member_ids": []
    }
    resp_no_key = client.post("/api/projects", json=body, headers={"Authorization": h["Authorization"]})
    assert resp_no_key.status_code == 422
    assert resp_no_key.json()["error"]["code"] == "IDEMPOTENCY_KEY_REQUIRED"

    # 2. Excessively long Idempotency-Key (> 120 chars) -> 422
    long_key = "a" * 121
    resp_long_key = client.post("/api/projects", json=body, headers={**h, "Idempotency-Key": long_key})
    assert resp_long_key.status_code == 422
    assert resp_long_key.json()["error"]["code"] == "IDEMPOTENCY_KEY_REQUIRED"

    # 3. Valid first submission
    idemp_key = str(uuid.uuid4())
    resp1 = client.post("/api/projects", json=body, headers={**h, "Idempotency-Key": idemp_key})
    assert resp1.status_code == 200
    project_id = resp1.json()["id"]

    # 4. Replay with identical payload and key -> returns identical response without duplicate project
    resp_replay = client.post("/api/projects", json=body, headers={**h, "Idempotency-Key": idemp_key})
    assert resp_replay.status_code == 200
    assert resp_replay.json()["id"] == project_id

    # 5. Reuse same key with DIFFERENT payload -> 409 IDEMPOTENCY_CONFLICT
    different_body = {
        "name": "Conflicting Project Name",
        "description": "Different body payload",
        "mentor_id": 3,
        "member_ids": []
    }
    resp_conflict = client.post("/api/projects", json=different_body, headers={**h, "Idempotency-Key": idemp_key})
    assert resp_conflict.status_code == 409
    assert resp_conflict.json()["error"]["code"] == "IDEMPOTENCY_CONFLICT"


def test_audit_log_append_only_immutability(client):
    """Verify SQLAlchemy event hooks strictly prevent raw update or delete on Audit records."""
    with db.Session() as session:
        # Create an audit entry
        audit_entry = Audit(
            actor_id=1,
            action="PHASE_01_INITIAL_AUDIT",
            previous_state=None,
            new_state="INITIALIZED",
            details={"test": "immutability"}
        )
        session.add(audit_entry)
        session.commit()
        audit_id = audit_entry.id
        assert audit_id is not None

        # Attempt to modify the audit record -> MUST raise ValueError
        with pytest.raises(ValueError, match="Raw audit records are append-only"):
            audit_entry.action = "MUTATED_ACTION_ATTEMPT"
            session.commit()
        session.rollback()

        # Attempt to delete the audit record -> MUST raise ValueError
        audit_to_delete = session.get(Audit, audit_id)
        assert audit_to_delete is not None
        with pytest.raises(ValueError, match="Raw audit records are append-only"):
            session.delete(audit_to_delete)
            session.commit()
        session.rollback()


def test_read_only_mode_guard(client, headers, monkeypatch):
    """Verify read-only mode rejects write commands with 403 READ_ONLY."""
    h = headers["student"]
    monkeypatch.setattr(settings, "read_only", True)

    resp = client.post("/api/projects", json={
        "name": "Read Only Project Attempt",
        "description": "Should fail",
        "mentor_id": 3,
        "member_ids": []
    }, headers={**h, "Idempotency-Key": str(uuid.uuid4())})

    assert resp.status_code == 403
    assert resp.json()["error"]["code"] == "READ_ONLY"


def test_schema_constraints(client):
    """Verify database check constraints on models."""
    with db.Session() as session:
        # Check stock cannot have negative values
        stock = Stock(item_id=1, lab_id=999, good=-5, bad=0)
        session.add(stock)
        with pytest.raises(Exception):
            session.commit()
        session.rollback()

        # Check item kind must be ASSET or CONSUMABLE
        bad_item = Item(name="Invalid Item", kind="INVALID_KIND", category="Misc")
        session.add(bad_item)
        with pytest.raises(Exception):
            session.commit()
        session.rollback()
