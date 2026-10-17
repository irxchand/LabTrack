"""Comprehensive Phase 02 Catalogue, Inventory Model & Project Governance Tests.

Verifies:
- REQ-LT-0001 & REQ-LT-0072: Dual inventory classes ('CONSUMABLE' and 'ASSET') with 'ck_item_kind' check constraint
- REQ-LT-0002 & REQ-LT-0072: Stock tracking non-negativity ('ck_stock_nonnegative') and unique (item_id, lab_id) constraints
- REQ-LT-0003 & REQ-LT-0013: Serialized assets, barcode uniqueness constraint, and barcode lookup
- REQ-LT-0004: Project creation with immutable sequential global IDs ('PROJ-000001' style) and lead assignment
- REQ-LT-0011 & REQ-LT-0012: Multi-lab stock visibility, catalogue category filtering, and text search
- REQ-LT-0014: Team membership validation (active students required, non-students rejected)
- REQ-LT-0015: Project listing, detail retrieval, and role-based visibility scoping
- REQ-LT-0074: Demo fixture structure and baseline asset/stock accounting
"""
import uuid
import pytest
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from labtrack import db
from labtrack.models import Item, Stock, Asset, Project, Member, User, Audit, Lab


def post(client, path, headers, data=None, key=None):
    return client.post("/api" + path, json=data or {}, headers={**headers, "Idempotency-Key": key or str(uuid.uuid4())})


def test_dual_class_catalogue_constraint(client):
    """Verify ck_item_kind constraint: only 'ASSET' and 'CONSUMABLE' are permitted."""
    with db.Session() as session:
        # Valid CONSUMABLE
        item_c = Item(name="Test Consumable Resistor", kind="CONSUMABLE", category="Passive", description="Test resistor")
        session.add(item_c)
        session.commit()
        assert item_c.id > 0

        # Valid ASSET
        item_a = Item(name="Test Digital Multimeter", kind="ASSET", category="Instrumentation", description="Test DMM")
        session.add(item_a)
        session.commit()
        assert item_a.id > 0

        # Invalid kind must fail check constraint
        bad_item = Item(name="Invalid Kind Item", kind="INVALID_KIND", category="Misc", description="Should fail")
        session.add(bad_item)
        with pytest.raises(IntegrityError):
            session.commit()
        session.rollback()


def test_stock_nonnegative_and_unique_constraints(client):
    """Verify ck_stock_nonnegative constraint and unique (item_id, lab_id) constraint."""
    with db.Session() as session:
        # 1. Non-negative constraint for 'good'
        bad_stock_good = Stock(item_id=1, lab_id=999, good=-5, bad=0)
        session.add(bad_stock_good)
        with pytest.raises(IntegrityError):
            session.commit()
        session.rollback()

        # 2. Non-negative constraint for 'bad'
        bad_stock_bad = Stock(item_id=1, lab_id=999, good=5, bad=-2)
        session.add(bad_stock_bad)
        with pytest.raises(IntegrityError):
            session.commit()
        session.rollback()

        # 3. Unique (item_id, lab_id) constraint: item 1, lab 1 already exists in fixtures
        duplicate_stock = Stock(item_id=1, lab_id=1, good=10, bad=0)
        session.add(duplicate_stock)
        with pytest.raises(IntegrityError):
            session.commit()
        session.rollback()


def test_asset_barcode_uniqueness_and_lookup(client, headers):
    """Verify asset barcode uniqueness and /api/catalogue/assets/{barcode} lookup."""
    with db.Session() as session:
        # Duplicate barcode collision must raise IntegrityError
        dup_asset = Asset(
            item_id=4,
            lab_id=1,
            barcode="SIT-DEMO-JN-001",  # already exists in demo fixture
            default_id="JETSON-DUP",
            bill_number="BILL-DUP",
            state="AVAILABLE"
        )
        session.add(dup_asset)
        with pytest.raises(IntegrityError):
            session.commit()
        session.rollback()

    # Successful barcode lookup via API
    res = client.get("/api/catalogue/assets/SIT-DEMO-JN-001", headers=headers["student"])
    assert res.status_code == 200, res.text
    asset_data = res.json()
    assert asset_data["barcode"] == "SIT-DEMO-JN-001"
    assert asset_data["item_name"] == "Jetson Nano"
    assert asset_data["lab_name"] == "Robotics Lab"
    assert asset_data["state"] == "AVAILABLE"
    assert asset_data["default_id"] == "JETSON-001"
    assert asset_data["bill_number"] == "DEMO-BILL-2026-01"

    # Non-existent barcode lookup returns 404
    missing_res = client.get("/api/catalogue/assets/NON-EXISTENT-BARCODE-999", headers=headers["student"])
    assert missing_res.status_code == 404
    assert missing_res.json()["error"]["code"] == "NOT_FOUND"


def test_catalogue_browsing_filtering_and_search(client, headers):
    """Verify /api/catalogue with category filtering, search queries, and multi-lab breakdowns."""
    # 1. Unfiltered catalogue
    res = client.get("/api/catalogue", headers=headers["student"])
    assert res.status_code == 200
    all_items = res.json()
    assert len(all_items) >= 6

    # Verify multi-lab stock structure on a consumable
    hc_sr04 = next(x for x in all_items if x["id"] == 1)
    assert hc_sr04["kind"] == "CONSUMABLE"
    assert hc_sr04["category"] == "Sensor"
    assert len(hc_sr04["labs"]) == 2  # Robotics Lab and Automation Lab
    assert hc_sr04["available"] == sum(l["good"] for l in hc_sr04["labs"])
    for lab_stock in hc_sr04["labs"]:
        assert lab_stock["total"] == lab_stock["good"] + lab_stock["bad"]

    # 2. Category filtering
    sensor_res = client.get("/api/catalogue?category=Sensor", headers=headers["student"])
    assert sensor_res.status_code == 200
    sensor_items = sensor_res.json()
    assert len(sensor_items) > 0
    assert all(i["category"].lower() == "sensor" for i in sensor_items)

    # 3. Text search query by name
    jetson_res = client.get("/api/catalogue?q=Jetson", headers=headers["student"])
    assert jetson_res.status_code == 200
    jetson_items = jetson_res.json()
    assert len(jetson_items) == 1
    assert jetson_items[0]["name"] == "Jetson Nano"
    assert jetson_items[0]["kind"] == "ASSET"

    # 4. Text search query by description keyword
    obstacle_res = client.get("/api/catalogue?q=obstacle", headers=headers["student"])
    assert obstacle_res.status_code == 200
    obstacle_items = obstacle_res.json()
    assert len(obstacle_items) >= 1
    assert any(i["id"] == 1 for i in obstacle_items)

    # 5. Non-matching query returns empty list
    empty_res = client.get("/api/catalogue?q=NonExistentComponentXyz", headers=headers["student"])
    assert empty_res.status_code == 200
    assert empty_res.json() == []


def test_project_creation_sequential_id_and_governance(client, headers):
    """Verify project creation, sequential global IDs (PROJ-XXXXXX), RBAC, mentor, and membership."""
    # 1. Non-student cannot create a project
    mentor_attempt = post(client, "/projects", headers["mentor"], {
        "name": "Faculty Disallowed Project",
        "description": "Should fail",
        "mentor_id": 3,
        "member_ids": []
    })
    assert mentor_attempt.status_code == 403
    assert mentor_attempt.json()["error"]["code"] == "FORBIDDEN"

    # 2. Student creating project with invalid mentor (must be active user with MENTOR role)
    invalid_mentor = post(client, "/projects", headers["student"], {
        "name": "Invalid Mentor Project",
        "description": "Student as mentor should fail",
        "mentor_id": 2,  # student2, not mentor
        "member_ids": []
    })
    assert invalid_mentor.status_code == 422
    assert invalid_mentor.json()["error"]["code"] == "INVALID_MENTOR"

    # 3. Student creating project with invalid member (must be active student)
    invalid_member = post(client, "/projects", headers["student"], {
        "name": "Invalid Member Project",
        "description": "Faculty as member should fail",
        "mentor_id": 3,
        "member_ids": [3]  # mentor cannot be a student member
    })
    assert invalid_member.status_code == 422
    assert invalid_member.json()["error"]["code"] == "INVALID_MEMBER"

    # 4. Successful project creation with student teammate (Mira Rao, ID 2)
    p_res = post(client, "/projects", headers["student"], {
        "name": "Automated Solar Tracking System",
        "description": "Dual-axis solar array telemetry and power optimization.",
        "mentor_id": 3,
        "member_ids": [2]
    })
    assert p_res.status_code == 200, p_res.text
    p_data = p_res.json()
    project_id = p_data["id"]
    expected_code = f"PROJ-{project_id:06d}"
    assert p_data["project_code"] == expected_code
    assert p_data["name"] == "Automated Solar Tracking System"

    # 5. Verify database records, lead assignment, and audit trail
    with db.Session() as session:
        proj = session.get(Project, project_id)
        assert proj is not None
        assert proj.lead_id == 1  # Aarav Shah (student creator)
        assert proj.mentor_id == 3

        # Membership must include both the creator (lead) and the specified member
        members = list(session.scalars(select(Member.user_id).where(Member.project_id == project_id)))
        assert set(members) == {1, 2}

        # Audit log must record PROJECT_CREATED
        audit_entry = session.scalar(
            select(Audit).where(Audit.project_id == project_id, Audit.action == "PROJECT_CREATED")
        )
        assert audit_entry is not None
        assert audit_entry.actor_id == 1


def test_project_listing_detail_and_visibility_scoping(client, headers):
    """Verify GET /api/projects and GET /api/projects/{id} visibility scoping across roles."""
    # Create a project owned by student 1 with member student 2 and mentor 3
    create_res = post(client, "/projects", headers["student"], {
        "name": "Deep Sea Submersible",
        "description": "Underwater telemetry and pressure control.",
        "mentor_id": 3,
        "member_ids": [2]
    })
    assert create_res.status_code == 200
    pid = create_res.json()["id"]

    # 1. Project lead (student 1) can view project in list and via detail endpoint
    lead_list = client.get("/api/projects", headers=headers["student"]).json()
    assert any(p["id"] == pid for p in lead_list)

    lead_detail = client.get(f"/api/projects/{pid}", headers=headers["student"])
    assert lead_detail.status_code == 200
    assert lead_detail.json()["name"] == "Deep Sea Submersible"
    assert lead_detail.json()["project_code"] == f"PROJ-{pid:06d}"
    assert set(lead_detail.json()["member_ids"]) == {1, 2}

    # 2. Mentor (user 3) can view the project
    mentor_list = client.get("/api/projects", headers=headers["mentor"]).json()
    assert any(p["id"] == pid for p in mentor_list)

    mentor_detail = client.get(f"/api/projects/{pid}", headers=headers["mentor"])
    assert mentor_detail.status_code == 200
    assert mentor_detail.json()["id"] == pid

    # 3. HoD (user 5) can view all projects
    hod_list = client.get("/api/projects", headers=headers["hod"]).json()
    assert any(p["id"] == pid for p in hod_list)

    hod_detail = client.get(f"/api/projects/{pid}", headers=headers["hod"])
    assert hod_detail.status_code == 200
    assert hod_detail.json()["id"] == pid

    # 4. Third-party student not associated with the project cannot view it
    with db.Session() as session:
        # Create third student user
        unaffiliated_student = User(
            name="Unaffiliated Student · Test",
            identifier="DEMO-STU-099",
            email="unaffiliated@example.invalid",
            password_hash="pbkdf2_sha256$dummy",
            roles=["STUDENT"],
            active=True
        )
        session.add(unaffiliated_student)
        session.commit()
        from labtrack.auth import issue_token
        third_token = issue_token(session, unaffiliated_student, hours=1)
        session.commit()

    third_headers = {"Authorization": f"Bearer {third_token}"}
    third_list = client.get("/api/projects", headers=third_headers).json()
    assert not any(p["id"] == pid for p in third_list)

    third_detail = client.get(f"/api/projects/{pid}", headers=third_headers)
    assert third_detail.status_code == 403
    assert third_detail.json()["error"]["code"] == "FORBIDDEN"
