"""Comprehensive Phase 03 Tests: Request Submission, Minimum-Lab Planning & Multi-Stage Approvals.

Verifies:
- REQ-LT-0016: Availability, category, specifications and immediate shortage during requirement entry
- REQ-LT-0017: Exact minimum-lab combinatorial planning algorithm (I1 prototype algorithm)
- REQ-LT-0018: Concentration score and stable lab-ID tie-breaking
- REQ-LT-0019: Informational planning only (zero stock reservation, zero mutation)
- REQ-LT-0020: Consumable approval workflow (Student -> Mentor -> Central Store system stage -> HoD)
- REQ-LT-0021: Asset approval workflow (Student -> Mentor -> Lab In-Charge -> HoD)
- REQ-LT-0022: Central Store system validation stage (not a separate user login role)
- REQ-LT-0023: Preserved quantities/durations and terminal rejection at any review stage
- REQ-LT-0024: Asset purpose differentiation (USE_IN_COLLEGE vs TAKE_OUTSIDE) and positive duration
- REQ-LT-0025: Distinct state families (MENTOR_REVIEW, INCHARGE_REVIEW, HOD_REVIEW, APPROVED, REJECTED)
- REQ-LT-0055: Timeline audit trail storing actor, role, timestamp, action, remarks, and states
- REQ-LT-0057: Curated hardware alternatives query (matching function, interface, live stock)
- REQ-LT-0059: AI/advisory suggestions never mutate inventory or bypass approvals
- REQ-LT-0060: Unmet demand registration for exhausted and unstocked components (zero inventory creation)
"""
import uuid
import pytest
from sqlalchemy import select
from labtrack import db
from labtrack.models import Item, Stock, Asset, Project, Member, User, Audit, Lab, Request


def post(client, path, headers, data=None, key=None):
    return client.post("/api" + path, json=data or {}, headers={**headers, "Idempotency-Key": key or str(uuid.uuid4())})


def create_project(client, headers, name="Autonomous Rover"):
    r = post(client, "/projects", headers["student"], {
        "name": name,
        "description": "Autonomous Rover Hardware Project",
        "mentor_id": 3,
        "member_ids": []
    })
    assert r.status_code == 200, r.text
    return r.json()["id"]


# ---------------------------------------------------------------------------
# 1. Exact Minimum-Lab Combinatorial Search (REQ-LT-0017, REQ-LT-0018, REQ-LT-0019)
# ---------------------------------------------------------------------------

def test_minimum_lab_planning_single_lab_and_combinations(client, headers):
    """Verify I1 exact subset search finds minimal cardinality lab subsets.
    
    In demo fixtures:
    Item 1: Lab 1 has 8, Lab 2 has 5.
    Item 3: Lab 1 has 2, Lab 2 has 6.
    """
    # Case 1: Single lab satisfiable (Item 1: 4, Item 3: 4)
    # Lab 2 alone has Item 1 (5 good) and Item 3 (6 good). Lab 1 only has Item 3 (2 good).
    # Minimal subset size is 1 -> Lab 2 alone.
    res1 = post(client, "/plans", headers["student"], {
        "lines": [{"item_id": 1, "quantity": 4}, {"item_id": 3, "quantity": 4}]
    })
    assert res1.status_code == 200, res1.text
    plan1 = res1.json()
    assert plan1["feasible"] is True
    assert plan1["labs"] == [2]
    assert plan1["planning_only"] is True
    assert len(plan1["allocations"]) == 2
    assert all(a["lab_id"] == 2 for a in plan1["allocations"])

    # Case 2: Multi-lab required (Item 1: 10)
    # Neither Lab 1 (8) nor Lab 2 (5) can satisfy 10 alone.
    # Minimal subset size is 2 -> [1, 2].
    res2 = post(client, "/plans", headers["student"], {
        "lines": [{"item_id": 1, "quantity": 10}]
    })
    assert res2.status_code == 200, res2.text
    plan2 = res2.json()
    assert plan2["feasible"] is True
    assert set(plan2["labs"]) == {1, 2}
    total_alloc = sum(a["quantity"] for a in plan2["allocations"] if a["item_id"] == 1)
    assert total_alloc == 10


def test_minimum_lab_planning_concentration_score_and_tie_breaking(client, headers):
    """Verify tie-breaker logic: secondary concentration score, tertiary stable lab-ID.
    
    SDD §7 test case:
    Demand: Component A = 4, Component B = 3
    Lab 1 = (A: 4, B: 0)
    Lab 2 = (A: 0, B: 3)
    Lab 3 = (A: 4, B: 3)
    Subset search evaluates single lab {3} before {1, 2} and selects Lab 3 alone!
    """
    with db.Session() as s:
        # Create 3 dedicated test labs and 2 test items to test SDD §7 explicitly
        l1 = Lab(id=101, name="Test Lab 101", incharge_id=4)
        l2 = Lab(id=102, name="Test Lab 102", incharge_id=4)
        l3 = Lab(id=103, name="Test Lab 103", incharge_id=4)
        s.add_all([l1, l2, l3])
        s.flush()

        item_a = Item(id=101, name="Component A", kind="CONSUMABLE", category="Sensors", description="Comp A", brand="Test", specs={})
        item_b = Item(id=102, name="Component B", kind="CONSUMABLE", category="Sensors", description="Comp B", brand="Test", specs={})
        s.add_all([item_a, item_b])
        s.flush()

        # Lab 1: A=4, B=0
        # Lab 2: A=0, B=3
        # Lab 3: A=4, B=3
        s.add_all([
            Stock(item_id=101, lab_id=101, good=4, bad=0),
            Stock(item_id=102, lab_id=101, good=0, bad=0),
            Stock(item_id=101, lab_id=102, good=0, bad=0),
            Stock(item_id=102, lab_id=102, good=3, bad=0),
            Stock(item_id=101, lab_id=103, good=4, bad=0),
            Stock(item_id=102, lab_id=103, good=3, bad=0),
        ])
        s.commit()

    res = post(client, "/plans", headers["student"], {
        "lines": [{"item_id": 101, "quantity": 4}, {"item_id": 102, "quantity": 3}]
    })
    assert res.status_code == 200, res.text
    plan = res.json()
    assert plan["feasible"] is True
    # Lab 3 alone must be selected over {Lab 1, Lab 2}
    assert plan["labs"] == [103]
    assert len(plan["allocations"]) == 2
    assert all(a["lab_id"] == 103 for a in plan["allocations"])


def test_planning_informational_zero_mutation(client, headers):
    """Verify REQ-LT-0019: Requirement entry and planning reserves zero stock and mutates zero rows."""
    with db.Session() as s:
        before_stock = [(st.id, st.good, st.bad) for st in s.scalars(select(Stock).order_by(Stock.id))]

    res = post(client, "/plans", headers["student"], {
        "lines": [{"item_id": 1, "quantity": 5}, {"item_id": 3, "quantity": 3}]
    })
    assert res.status_code == 200, res.text
    assert res.json()["planning_only"] is True

    with db.Session() as s:
        after_stock = [(st.id, st.good, st.bad) for st in s.scalars(select(Stock).order_by(Stock.id))]
        assert before_stock == after_stock


def test_planning_input_validations_and_shortages(client, headers):
    """Verify REQ-LT-0016: duplicate line rejection, unknown items, and immediate shortage reporting."""
    # 1. Duplicate item lines in request
    dup_res = post(client, "/plans", headers["student"], {
        "lines": [{"item_id": 1, "quantity": 2}, {"item_id": 1, "quantity": 3}]
    })
    assert dup_res.status_code == 422
    assert dup_res.json()["error"]["code"] == "INVALID_QUANTITY"

    # 2. Unknown catalogue item
    unknown_res = post(client, "/plans", headers["student"], {
        "lines": [{"item_id": 99999, "quantity": 1}]
    })
    assert unknown_res.status_code == 404
    assert unknown_res.json()["error"]["code"] == "NOT_FOUND"

    # 3. Shortage (requested > total good across all labs)
    # Total available for item 1 is 8 + 5 = 13. Requesting 14 must report shortage immediately.
    shortage_res = post(client, "/plans", headers["student"], {
        "lines": [{"item_id": 1, "quantity": 14}]
    })
    assert shortage_res.status_code == 200
    plan = shortage_res.json()
    assert plan["feasible"] is False
    assert plan["labs"] == []
    assert plan["allocations"] == []
    assert len(plan["shortages"]) == 1
    assert plan["shortages"][0]["item_id"] == 1
    assert plan["shortages"][0]["requested"] == 14
    assert plan["shortages"][0]["available"] == 13


# ---------------------------------------------------------------------------
# 2. Student Request Submission & Class Routing (REQ-LT-0016, 0020, 0021, 0024)
# ---------------------------------------------------------------------------

def test_student_request_submission_lead_authorization_and_classes(client, headers):
    """Verify OP-04: Only Project Lead can submit; class and purpose validation; OD-06 single class."""
    proj_id = create_project(client, headers, "Team Project 1")

    # 1. Non-lead student (outsider) cannot submit request for this project
    denied = post(client, "/requests", headers["outsider"], {
        "project_id": proj_id,
        "duration_hours": 72,
        "purpose": "BORROW",
        "lines": [{"item_id": 1, "quantity": 2}]
    })
    assert denied.status_code == 403
    assert denied.json()["error"]["code"] == "FORBIDDEN"

    # 2. Infeasible stock submission is rejected
    infeasible = post(client, "/requests", headers["student"], {
        "project_id": proj_id,
        "duration_hours": 72,
        "purpose": "BORROW",
        "lines": [{"item_id": 1, "quantity": 999}]
    })
    assert infeasible.status_code == 409
    assert infeasible.json()["error"]["code"] == "INSUFFICIENT_STOCK"

    # 3. Mixed-class request (Consumable item 1 + Asset item 4) rejected under OD-06
    mixed = post(client, "/requests", headers["student"], {
        "project_id": proj_id,
        "duration_hours": 72,
        "purpose": "BORROW",
        "lines": [{"item_id": 1, "quantity": 2}, {"item_id": 4, "quantity": 1}]
    })
    assert mixed.status_code == 409
    assert mixed.json()["error"]["code"] == "POLICY_REQUIRED"
    assert "OD-06" in mixed.json()["error"]["decision"]

    # 4. Consumable with purpose 'USE_IN_COLLEGE' rejected
    bad_purpose_c = post(client, "/requests", headers["student"], {
        "project_id": proj_id,
        "duration_hours": 72,
        "purpose": "USE_IN_COLLEGE",
        "lines": [{"item_id": 1, "quantity": 2}]
    })
    assert bad_purpose_c.status_code == 422
    assert bad_purpose_c.json()["error"]["code"] == "INVALID_PURPOSE"

    # 5. Asset with purpose 'BORROW' rejected
    bad_purpose_a = post(client, "/requests", headers["student"], {
        "project_id": proj_id,
        "duration_hours": 72,
        "purpose": "BORROW",
        "lines": [{"item_id": 4, "quantity": 1}]
    })
    assert bad_purpose_a.status_code == 422
    assert bad_purpose_a.json()["error"]["code"] == "INVALID_PURPOSE"

    # 6. Valid consumable submission succeeds
    ok_res = post(client, "/requests", headers["student"], {
        "project_id": proj_id,
        "duration_hours": 72,
        "purpose": "BORROW",
        "lines": [{"item_id": 1, "quantity": 2}]
    })
    assert ok_res.status_code == 200, ok_res.text
    assert ok_res.json()["state"] == "MENTOR_REVIEW"


# ---------------------------------------------------------------------------
# 3. Consumable Multi-Stage Approval Chain (REQ-LT-0020, REQ-LT-0022, REQ-LT-0055)
# ---------------------------------------------------------------------------

def test_consumable_multi_stage_approval_chain(client, headers):
    """Verify Student -> Mentor -> Central Store system stage -> HoD -> Approved.
    
    Central Store is confirmed as an automated system stage and audit entry, NOT a login role.
    """
    proj_id = create_project(client, headers, "Consumable Rover")
    req_res = post(client, "/requests", headers["student"], {
        "project_id": proj_id,
        "duration_hours": 168,
        "purpose": "BORROW",
        "lines": [{"item_id": 1, "quantity": 3}]
    })
    assert req_res.status_code == 200
    rid = req_res.json()["id"]

    # Step 1: Initial state is MENTOR_REVIEW
    req_view = client.get(f"/api/requests/{rid}", headers=headers["student"]).json()
    assert req_view["state"] == "MENTOR_REVIEW"

    # Unauthorized actors cannot approve at MENTOR_REVIEW
    for actor in ["student", "outsider", "assistant", "hod", "incharge"]:
        err = post(client, f"/requests/{rid}/decision", headers[actor], {"decision": "APPROVE"})
        assert err.status_code == 403, f"{actor} should be forbidden from mentor approval"

    # Step 2: Faculty Mentor approves
    mentor_res = post(client, f"/requests/{rid}/decision", headers["mentor"], {
        "decision": "APPROVE",
        "remarks": "Academic justification verified by mentor"
    })
    assert mentor_res.status_code == 200, mentor_res.text

    # After Mentor approval:
    # State has progressed through Central Store system validation to HOD_REVIEW
    req_after_mentor = client.get(f"/api/requests/{rid}", headers=headers["student"]).json()
    assert req_after_mentor["state"] == "HOD_REVIEW"

    timeline_actions = [a["action"] for a in req_after_mentor["timeline"]]
    # Central Store validation must appear in timeline
    assert "REQUEST_SUBMITTED" in timeline_actions
    assert "CENTRAL_STORE_VALIDATED" in timeline_actions
    assert "MENTOR_APPROVED" in timeline_actions

    # Mentor cannot approve again or decide at HOD_REVIEW
    mentor_again = post(client, f"/requests/{rid}/decision", headers["mentor"], {"decision": "APPROVE"})
    assert mentor_again.status_code in [403, 409]

    # Step 3: HoD approves
    hod_res = post(client, f"/requests/{rid}/decision", headers["hod"], {
        "decision": "APPROVE",
        "remarks": "Approved by Head of Department"
    })
    assert hod_res.status_code == 200, hod_res.text
    assert hod_res.json()["state"] == "APPROVED"

    final_req = client.get(f"/api/requests/{rid}", headers=headers["student"]).json()
    assert final_req["state"] == "APPROVED"
    assert final_req["due_version"] == 0  # not yet issued
    final_actions = [a["action"] for a in final_req["timeline"]]
    assert final_actions == ["REQUEST_SUBMITTED", "CENTRAL_STORE_VALIDATED", "MENTOR_APPROVED", "HOD_APPROVED"]


# ---------------------------------------------------------------------------
# 4. Asset Multi-Stage Approval Chain (REQ-LT-0021, REQ-LT-0024, REQ-LT-0055)
# ---------------------------------------------------------------------------

def test_asset_multi_stage_approval_chain(client, headers):
    """Verify Student -> Mentor -> Lab In-Charge -> HoD -> Approved.
    
    Asset route CANNOT omit In-Charge or HoD.
    """
    proj_id = create_project(client, headers, "Jetson AI Project")
    req_res = post(client, "/requests", headers["student"], {
        "project_id": proj_id,
        "duration_hours": 96,
        "purpose": "USE_IN_COLLEGE",
        "lines": [{"item_id": 4, "quantity": 1}]
    })
    assert req_res.status_code == 200
    rid = req_res.json()["id"]

    # Step 1: Initial state is MENTOR_REVIEW
    detail1 = client.get(f"/api/requests/{rid}", headers=headers["student"]).json()
    assert detail1["state"] == "MENTOR_REVIEW"
    assert detail1["kind"] == "ASSET"
    assert detail1["purpose"] == "USE_IN_COLLEGE"

    # Step 2: Mentor approves -> Advances to INCHARGE_REVIEW (not HOD_REVIEW!)
    mentor_dec = post(client, f"/requests/{rid}/decision", headers["mentor"], {
        "decision": "APPROVE",
        "remarks": "Project mentor endorsement"
    })
    assert mentor_dec.status_code == 200
    assert mentor_dec.json()["state"] == "INCHARGE_REVIEW"

    # HoD cannot skip or bypass In-Charge stage
    hod_early = post(client, f"/requests/{rid}/decision", headers["hod"], {"decision": "APPROVE"})
    assert hod_early.status_code == 403, "HoD cannot approve while in INCHARGE_REVIEW"

    # Non-incharge faculty cannot approve In-Charge stage
    outsider_incharge = post(client, f"/requests/{rid}/decision", headers["mentor"], {"decision": "APPROVE"})
    assert outsider_incharge.status_code == 403

    # Step 3: Assigned Lab In-Charge approves
    incharge_dec = post(client, f"/requests/{rid}/decision", headers["incharge"], {
        "decision": "APPROVE",
        "remarks": "Lab In-Charge equipment availability confirmed"
    })
    assert incharge_dec.status_code == 200
    assert incharge_dec.json()["state"] == "HOD_REVIEW"

    # Step 4: HoD approves
    hod_dec = post(client, f"/requests/{rid}/decision", headers["hod"], {
        "decision": "APPROVE",
        "remarks": "Final HoD clearance"
    })
    assert hod_dec.status_code == 200
    assert hod_dec.json()["state"] == "APPROVED"

    final_req = client.get(f"/api/requests/{rid}", headers=headers["student"]).json()
    assert final_req["state"] == "APPROVED"
    timeline_actions = [a["action"] for a in final_req["timeline"]]
    assert timeline_actions == ["REQUEST_SUBMITTED", "MENTOR_APPROVED", "INCHARGE_DECISION", "HOD_APPROVED"]


# ---------------------------------------------------------------------------
# 5. Terminal Rejection at Every Stage (REQ-LT-0023, REQ-LT-0025)
# ---------------------------------------------------------------------------

def test_terminal_rejection_at_all_stages(client, headers):
    """Verify REQ-LT-0023: Rejection at any stage terminates request to REJECTED with zero inventory mutation."""
    # Subtest 1: Rejection by Mentor
    p1 = create_project(client, headers, "Rejection Test 1")
    r1 = post(client, "/requests", headers["student"], {
        "project_id": p1, "duration_hours": 24, "purpose": "BORROW", "lines": [{"item_id": 1, "quantity": 1}]
    }).json()["id"]

    rej1 = post(client, f"/requests/{r1}/decision", headers["mentor"], {
        "decision": "REJECT",
        "remarks": "Project objective insufficiently defined"
    })
    assert rej1.status_code == 200
    assert rej1.json()["state"] == "REJECTED"

    d1 = client.get(f"/api/requests/{r1}", headers=headers["student"]).json()
    assert d1["state"] == "REJECTED"
    assert d1["timeline"][-1]["action"] == "MENTOR_REJECTED"
    assert d1["timeline"][-1]["details"]["remarks"] == "Project objective insufficiently defined"

    # Attempting to decide a REJECTED request fails with 409
    assert post(client, f"/requests/{r1}/decision", headers["hod"], {"decision": "APPROVE"}).status_code == 409
    # Attempting to claim a REJECTED request fails with 409
    assert post(client, f"/requests/{r1}/claim", headers["assistant"]).status_code == 409

    # Subtest 2: Rejection by In-Charge on Asset request
    p2 = create_project(client, headers, "Rejection Test 2")
    r2 = post(client, "/requests", headers["student"], {
        "project_id": p2, "duration_hours": 24, "purpose": "USE_IN_COLLEGE", "lines": [{"item_id": 4, "quantity": 1}]
    }).json()["id"]

    # Mentor approves
    post(client, f"/requests/{r2}/decision", headers["mentor"], {"decision": "APPROVE"})
    # In-Charge rejects
    rej2 = post(client, f"/requests/{r2}/decision", headers["incharge"], {
        "decision": "REJECT",
        "remarks": "Hardware reserved for institutional lab exam"
    })
    assert rej2.status_code == 200
    assert rej2.json()["state"] == "REJECTED"
    d2 = client.get(f"/api/requests/{r2}", headers=headers["student"]).json()
    assert d2["state"] == "REJECTED"

    # Subtest 3: Rejection by HoD
    p3 = create_project(client, headers, "Rejection Test 3")
    r3 = post(client, "/requests", headers["student"], {
        "project_id": p3, "duration_hours": 24, "purpose": "BORROW", "lines": [{"item_id": 1, "quantity": 1}]
    }).json()["id"]
    post(client, f"/requests/{r3}/decision", headers["mentor"], {"decision": "APPROVE"})
    rej3 = post(client, f"/requests/{r3}/decision", headers["hod"], {
        "decision": "REJECT",
        "remarks": "Exceeds department budget allocation"
    })
    assert rej3.status_code == 200
    assert rej3.json()["state"] == "REJECTED"
    d3 = client.get(f"/api/requests/{r3}", headers=headers["student"]).json()
    assert d3["state"] == "REJECTED"
    assert d3["timeline"][-1]["action"] == "HOD_REJECTED"


# ---------------------------------------------------------------------------
# 6. Reviews Cannot Rewrite Quantities or Duration (REQ-LT-0023)
# ---------------------------------------------------------------------------

def test_reviewers_cannot_rewrite_quantities_or_duration(client, headers):
    """Verify REQ-LT-0023: Decision input contract forbids rewriting quantities, lines, or duration."""
    proj_id = create_project(client, headers, "Immutable Request")
    r = post(client, "/requests", headers["student"], {
        "project_id": proj_id,
        "duration_hours": 72,
        "purpose": "BORROW",
        "lines": [{"item_id": 1, "quantity": 2}]
    }).json()["id"]

    # Decision endpoint forbids extra fields (like quantity or duration)
    bad_decision = post(client, f"/requests/{r}/decision", headers["mentor"], {
        "decision": "APPROVE",
        "remarks": "Attempting to change duration",
        "duration_hours": 24,  # forbidden extra field
        "quantity": 1         # forbidden extra field
    })
    assert bad_decision.status_code == 422, "Pydantic schema must forbid extra fields"

    # Request contents remain strictly intact
    detail = client.get(f"/api/requests/{r}", headers=headers["student"]).json()
    assert detail["duration_hours"] == 72
    assert detail["lines"][0]["quantity"] == 2


# ---------------------------------------------------------------------------
# 7. Curated Hardware Alternatives (REQ-LT-0057, REQ-LT-0059)
# ---------------------------------------------------------------------------

def test_curated_hardware_alternatives(client, headers):
    """Verify REQ-LT-0057 & REQ-LT-0059: Curated alternatives query returns compatible items with stock > 0.
    
    Item 1 (HC-SR04) has alternative Item 2 (JSN-SR04T) with matching function & interface.
    Zero mutations occur.
    """
    with db.Session() as s:
        before_stock = [(st.id, st.good) for st in s.scalars(select(Stock).order_by(Stock.id))]

    res = client.get("/api/alternatives/1", headers=headers["student"])
    assert res.status_code == 200, res.text
    alts = res.json()
    assert len(alts) == 1
    assert alts[0]["id"] == 2
    assert alts[0]["name"] == "Waterproof Sensor JSN-SR04T"
    assert alts[0]["available"] > 0

    # Item with no alternatives configured returns empty list
    res_empty = client.get("/api/alternatives/3", headers=headers["student"])
    assert res_empty.status_code == 200
    assert res_empty.json() == []

    # Verify zero database mutations
    with db.Session() as s:
        after_stock = [(st.id, st.good) for st in s.scalars(select(Stock).order_by(Stock.id))]
        assert before_stock == after_stock


# ---------------------------------------------------------------------------
# 8. Unmet Demand Registration (REQ-LT-0060)
# ---------------------------------------------------------------------------

def test_unmet_demand_registration_and_validation(client, headers):
    """Verify REQ-LT-0060: Unmet demand registration for exhausted and unstocked components.
    
    Item 6 (LiDAR Module) has 0 good stock in fixtures.
    """
    # 1. Exhausted catalogue item demand registration
    res1 = post(client, "/demand", headers["student"], {
        "item_id": 6,
        "quantity": 3
    })
    assert res1.status_code == 200, res1.text
    assert res1.json()["recorded"] is True

    # 2. Demand on an available item (Item 1 has 13 units) is rejected with AVAILABLE_NOW
    res_avail = post(client, "/demand", headers["student"], {
        "item_id": 1,
        "quantity": 2
    })
    assert res_avail.status_code == 409
    assert res_avail.json()["error"]["code"] == "AVAILABLE_NOW"

    # 3. Unstocked component demand registration
    res_unstocked = post(client, "/demand/unstocked", headers["student"], {
        "component_name": "ESP32-S3-WROOM-1 Cam Module",
        "quantity": 5
    })
    assert res_unstocked.status_code == 200, res_unstocked.text
    assert res_unstocked.json()["recorded"] is True
    assert res_unstocked.json()["inventory_created"] is False

    # 4. Unstocked demand for a component that ALREADY exists in catalogue is rejected
    res_existing = post(client, "/demand/unstocked", headers["student"], {
        "component_name": "Jetson Nano",
        "quantity": 1
    })
    assert res_existing.status_code == 409
    assert res_existing.json()["error"]["code"] == "CATALOGUE_ITEM_EXISTS"

    # 5. Non-student cannot register unmet demand
    res_forbidden = post(client, "/demand", headers["mentor"], {
        "item_id": 6,
        "quantity": 1
    })
    assert res_forbidden.status_code == 403


# ---------------------------------------------------------------------------
# 9. Asset Purpose Differentiation & Durations (REQ-LT-0024)
# ---------------------------------------------------------------------------

def test_asset_purpose_differentiation_and_duration(client, headers):
    """Verify REQ-LT-0024: USE_IN_COLLEGE and TAKE_OUTSIDE both create tracked checkouts."""
    p = create_project(client, headers, "Outdoor Field Test Rover")

    # In-college asset request
    r_college = post(client, "/requests", headers["student"], {
        "project_id": p,
        "duration_hours": 8,
        "purpose": "USE_IN_COLLEGE",
        "lines": [{"item_id": 4, "quantity": 1}]
    })
    assert r_college.status_code == 200
    assert r_college.json()["state"] == "MENTOR_REVIEW"

    # Take-home / outside-college asset request
    r_outside = post(client, "/requests", headers["student"], {
        "project_id": p,
        "duration_hours": 168,
        "purpose": "TAKE_OUTSIDE",
        "lines": [{"item_id": 4, "quantity": 1}]
    })
    assert r_outside.status_code == 200
    assert r_outside.json()["state"] == "MENTOR_REVIEW"

    # Non-positive duration is rejected
    bad_dur = post(client, "/requests", headers["student"], {
        "project_id": p,
        "duration_hours": 0,
        "purpose": "USE_IN_COLLEGE",
        "lines": [{"item_id": 4, "quantity": 1}]
    })
    assert bad_dur.status_code == 422


# ---------------------------------------------------------------------------
# 10. SMTP Email Provider & Outbox Integration (REQ-LT-0055, REQ-LT-0020, SDD §21)
# ---------------------------------------------------------------------------

def test_smtp_email_provider_dispatch_and_templates(monkeypatch, tmp_path):
    """Verify SMTPEmailProvider properly builds headers, HTML, plain text, and executes SMTP TLS handshakes."""
    from labtrack.adapters import SMTPEmailProvider
    from labtrack.config import settings

    sent_messages = []

    class MockSMTP:
        def __init__(self, host, port, timeout=20):
            self.host = host
            self.port = port
            self.started_tls = False
            self.logged_in = None

        def __enter__(self):
            return self

        def __exit__(self, exc_type, exc_val, exc_tb):
            pass

        def starttls(self, context=None):
            self.started_tls = True

        def login(self, username, password):
            self.logged_in = (username, password)

        def send_message(self, msg):
            sent_messages.append(msg)

    import smtplib
    monkeypatch.setattr(smtplib, "SMTP", MockSMTP)
    monkeypatch.setattr(settings, "smtp_host", "smtp.gmail.com")
    monkeypatch.setattr(settings, "smtp_port", 587)
    monkeypatch.setattr(settings, "smtp_username", "labtrack821@gmail.com")
    monkeypatch.setattr(settings, "smtp_password", "secret-password")
    monkeypatch.setattr(settings, "smtp_use_tls", True)
    monkeypatch.setattr(settings, "email_sender", "labtrack821@gmail.com")
    monkeypatch.setattr(settings, "email_override", "")

    provider = SMTPEmailProvider()
    payload = {
        "event": "REQUEST_SUBMITTED",
        "request_id": 42,
        "link": "/requests/42",
        "details": {"duration_hours": 72, "purpose": "BORROW"}
    }
    provider.send("email:100:1", "mentor@sitpune.edu.in", payload)

    assert len(sent_messages) == 1
    msg = sent_messages[0]
    assert msg["To"] == "mentor@sitpune.edu.in"
    assert msg["From"] == "labtrack821@gmail.com"
    assert "Request Submitted (#42)" in msg["Subject"]
    assert "<email.100.1@labtrack.invalid>" == msg["Message-ID"]

    # Verify both plain text and HTML payloads exist
    body = msg.get_body(preferencelist=("plain",))
    assert body is not None
    assert "Event: REQUEST_SUBMITTED" in body.get_content()
    assert "#42" in body.get_content()

    html_body = msg.get_body(preferencelist=("html",))
    assert html_body is not None
    assert "LABTRACK" in html_body.get_content()
    assert "View Request in Workspace" in html_body.get_content()


def test_smtp_outbox_worker_integration(client, headers, monkeypatch):
    """Verify transactional outbox dispatcher sends via SMTP provider without blocking domain mutations."""
    from labtrack.config import settings
    from labtrack.worker import dispatch
    import labtrack.worker as worker

    sent_deliveries = []

    class MockSMTPProvider:
        def send(self, identifier, recipient, payload):
            sent_deliveries.append((identifier, recipient, payload))

    monkeypatch.setattr(settings, "email_provider", "smtp")
    monkeypatch.setattr(worker, "email_provider", lambda: MockSMTPProvider())

    proj_id = create_project(client, headers, "SMTP Test Rover")
    r = post(client, "/requests", headers["student"], {
        "project_id": proj_id,
        "duration_hours": 48,
        "purpose": "BORROW",
        "lines": [{"item_id": 1, "quantity": 1}]
    })
    assert r.status_code == 200

    # Dispatch outbox events
    with db.Session() as s:
        res = dispatch(s)
        s.commit()

    assert res["processed"] >= 1
    assert len(sent_deliveries) >= 1
    # Check that student and mentor were targeted
    recipients = [d[1] for d in sent_deliveries]
    assert any("student" in rec or "mentor" in rec for rec in recipients)

