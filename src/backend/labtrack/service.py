"""Domain operations: no network calls inside inventory transactions."""
from datetime import timedelta, timezone
from itertools import combinations
from sqlalchemy import select, func
from .models import *
from .config import settings


class DomainError(Exception):
    def __init__(self, code, message, status=409, decision=None):
        self.code, self.message, self.status, self.decision = code, message, status, decision


def require(condition, message, code="INVALID_STATE", status=409):
    if not condition:
        raise DomainError(code, message, status)


def policy(decision, message):
    raise DomainError("POLICY_REQUIRED", message, 409, decision)


def get(session, model, identifier, lock=False):
    query = select(model).where(model.id == identifier)
    if lock:
        query = query.with_for_update()
    row = session.scalar(query)
    require(row is not None, "Record not found", "NOT_FOUND", 404)
    return row


def roles(session, role):
    return [u.id for u in session.scalars(select(User).where(User.active.is_(True))) if role in u.roles]


def lines_for(session, request):
    return list(session.scalars(select(RequestLine).where(RequestLine.request_id == request.id).order_by(RequestLine.item_id, RequestLine.lab_id)))


def assistants(session, lab_ids):
    return [u.id for u in session.scalars(select(User).where(User.active.is_(True))) if "ASSISTANT" in u.roles and set(u.lab_ids) & set(lab_ids)]


def can_view_project(session, user, project):
    if "HOD" in user.roles or ("MENTOR" in user.roles and project.mentor_id == user.id):
        return True
    if session.get(Member, (project.id, user.id)):
        return True
    for request in session.scalars(select(Request).where(Request.project_id == project.id)):
        if "INCHARGE" in user.roles and request.incharge_id == user.id:
            return True
        if "ASSISTANT" in user.roles and any(l.lab_id in user.lab_ids for l in lines_for(session, request)):
            return True
    return False


def visible_project(session, user, project_id):
    project = get(session, Project, project_id)
    require(can_view_project(session, user, project), "Project is outside your scope", "FORBIDDEN", 403)
    return project


def lead_project(session, user, project_id):
    project = get(session, Project, project_id, True)
    require(project.lead_id == user.id, "Only the project lead may submit this action", "FORBIDDEN", 403)
    return project


def audit(session, user, action, project_id=None, request=None, previous=None, details=None):
    record = Audit(actor_id=user.id, project_id=project_id or (request.project_id if request else None), request_id=request.id if request else None, action=action, previous_state=previous, new_state=request.state if request else None, details=details or {})
    session.add(record)
    session.flush()
    return record


def emit(session, event, recipients, request=None, details=None, key=None):
    key = key or f"{event}:{request.id if request else 'global'}:{utcnow().isoformat()}"
    recipients = sorted(set(recipients))
    session.add(Outbox(event_key=key, payload={"event": event, "recipients": recipients, "request_id": request.id if request else None, "details": details or {}}))


def recipients(session, request, event):
    p = get(session, Project, request.project_id)
    lab_ids = [line.lab_id for line in lines_for(session, request)]
    staff = assistants(session, lab_ids)
    incharge = [request.incharge_id] if request.incharge_id else []
    if event == "REQUEST_SUBMITTED":
        return [p.lead_id, p.mentor_id]
    if event == "APPROVAL_EXPIRED":
        return [p.lead_id]
    if event == "MENTOR_REJECTED":
        return [p.lead_id]
    if event == "MENTOR_APPROVED":
        return [p.lead_id] + (incharge if request.kind == "ASSET" else roles(session, "HOD"))
    if event == "INCHARGE_DECISION":
        return [p.lead_id, p.mentor_id] + (roles(session, "HOD") if request.state != "REJECTED" else [])
    if event.startswith("HOD_") or event in ["ISSUE_COMPLETED", "FULFILMENT_FAILED_STOCK"]:
        return [p.lead_id, p.mentor_id] + incharge + staff + roles(session, "HOD")
    return [p.lead_id, p.mentor_id] + incharge + staff


def change(session, user, request, state, action, remarks=""):
    previous = request.state
    request.state = state
    record = audit(session, user, action, request=request, previous=previous, details={"remarks": remarks})
    emit(session, action, recipients(session, request, action), request, {"previous_state": previous, "state": state, "remarks": remarks}, key=f"audit:{record.id}")


def catalogue(session):
    result = []
    for item in session.scalars(select(Item).order_by(Item.name)):
        labs = []
        for lab in session.scalars(select(Lab).order_by(Lab.id)):
            if item.kind == "CONSUMABLE":
                stock = session.scalar(select(Stock).where(Stock.item_id == item.id, Stock.lab_id == lab.id))
                if stock:
                    labs.append({"lab_id": lab.id, "lab_name": lab.name, "good": stock.good, "bad": stock.bad, "total": stock.good+stock.bad})
            else:
                assets = list(session.scalars(select(Asset).where(Asset.item_id == item.id, Asset.lab_id == lab.id).order_by(Asset.barcode)))
                if assets:
                    labs.append({"lab_id": lab.id, "lab_name": lab.name, "good": sum(a.state == "AVAILABLE" for a in assets), "bad": sum(a.state in ["DEFECTIVE", "UNDER_REPAIR"] for a in assets), "total": len(assets), "assets": [{"barcode": a.barcode, "state": a.state, "default_id": a.default_id, "bill_number": a.bill_number} for a in assets]})
        result.append({"id": item.id, "name": item.name, "kind": item.kind, "category": item.category, "description": item.description, "brand": item.brand, "specs": item.specs, "labs": labs, "available": sum(l["good"] for l in labs)})
    return result


def plan(session, input_lines):
    needs = {x.item_id: x.quantity for x in input_lines}
    require(len(needs) == len(input_lines), "Combine duplicate item quantities", "INVALID_QUANTITY", 422)
    data = {x["id"]: x for x in catalogue(session)}
    require(set(needs) <= set(data), "Unknown catalogue item", "NOT_FOUND", 404)
    shortages = [{"item_id": i, "requested": n, "available": data[i]["available"]} for i, n in needs.items() if n > data[i]["available"]]
    if shortages:
        return {"feasible": False, "shortages": shortages, "labs": [], "allocations": []}
    lab_ids = sorted({l["lab_id"] for i in needs for l in data[i]["labs"]})
    q = {(i, l["lab_id"]): l["good"] for i in needs for l in data[i]["labs"]}
    selected = None
    for size in range(1, len(lab_ids)+1):
        feasible = [s for s in combinations(lab_ids, size) if all(sum(q.get((i, l), 0) for l in s) >= n for i, n in needs.items())]
        if feasible:
            selected = min(feasible, key=lambda s: (-sum(min(q.get((i, l), 0), n) for i, n in needs.items() for l in s), s))
            break
    allocations = []
    for i, n in sorted(needs.items()):
        left = n
        for lab_id in selected:
            count = min(left, q.get((i, lab_id), 0))
            if count:
                allocations.append({"item_id": i, "lab_id": lab_id, "quantity": count})
                left -= count
    return {"feasible": True, "shortages": [], "labs": list(selected), "allocations": allocations, "planning_only": True}


def create_project(session, user, body):
    require("STUDENT" in user.roles, "Student role required", "FORBIDDEN", 403)
    mentor = get(session, User, body.mentor_id)
    require(mentor.active and "MENTOR" in mentor.roles, "Choose an active faculty mentor", "INVALID_MENTOR", 422)
    members = sorted(set(body.member_ids + [user.id]))
    for uid in members:
        member = get(session, User, uid)
        require(member.active and "STUDENT" in member.roles, "Project members must be active students", "INVALID_MEMBER", 422)
    p = Project(name=body.name, description=body.description, lead_id=user.id, mentor_id=mentor.id)
    session.add(p); session.flush()
    session.add_all(Member(project_id=p.id, user_id=uid) for uid in members)
    audit(session, user, "PROJECT_CREATED", p.id, details={"name": p.name, "members": members})
    return {"id": p.id, "project_code": f"PROJ-{p.id:06d}", "name": p.name}


def submit_request(session, user, body):
    p = lead_project(session, user, body.project_id)
    result = plan(session, body.lines)
    require(result["feasible"], "Requested stock is unavailable; choose a reservation or revise quantities", "INSUFFICIENT_STOCK")
    items = [get(session, Item, line.item_id) for line in body.lines]
    kinds = {i.kind for i in items}
    if len(kinds) != 1:
        policy("OD-06", "Mixed asset/consumable approval policy is unresolved")
    kind = kinds.pop()
    require((kind == "CONSUMABLE" and body.purpose == "BORROW") or (kind == "ASSET" and body.purpose in ["USE_IN_COLLEGE", "TAKE_OUTSIDE"]), "Purpose does not match inventory class", "INVALID_PURPOSE", 422)
    incharge = None
    if kind == "ASSET":
        people = {get(session, Lab, lab).incharge_id for lab in result["labs"]}
        if len(people) != 1:
            policy("OD-06", "Multiple asset In-Charges require an explicit approval coordination rule")
        incharge = people.pop()
        if incharge == p.mentor_id:
            policy("OD-06", "The same faculty member holds both stages; approval overlap policy is unresolved")
    r = Request(project_id=p.id, kind=kind, purpose=body.purpose, duration_hours=body.duration_hours, incharge_id=incharge)
    session.add(r); session.flush()
    session.add_all(RequestLine(request_id=r.id, **line) for line in result["allocations"])
    session.flush()
    a = audit(session, user, "REQUEST_SUBMITTED", request=r, details={"plan": result, "duration_hours": body.duration_hours, "purpose": body.purpose})
    emit(session, "REQUEST_SUBMITTED", recipients(session, r, "REQUEST_SUBMITTED"), r, key=f"audit:{a.id}")
    return {"id": r.id, "state": r.state, "plan": result}


def decide(session, user, request_id, body):
    r = get(session, Request, request_id, True)
    p = get(session, Project, r.project_id)
    approved = body.decision == "APPROVE"
    if r.state == "MENTOR_REVIEW":
        require(user.id == p.mentor_id and "MENTOR" in user.roles, "Assigned mentor required", "FORBIDDEN", 403)
        if approved and r.kind == "CONSUMABLE":
            result = plan(session, [type("Q", (), {"item_id": item, "quantity": sum(l.quantity for l in lines_for(session, r) if l.item_id == item)}) for item in sorted({l.item_id for l in lines_for(session, r)})])
            require(result["feasible"], "Central Store availability check failed", "INSUFFICIENT_STOCK")
            audit(session, user, "CENTRAL_STORE_VALIDATED", request=r, details={"system_stage": True, "planning_only": True})
        state = ("INCHARGE_REVIEW" if r.kind == "ASSET" else "HOD_REVIEW") if approved else "REJECTED"
        action = "MENTOR_APPROVED" if approved else "MENTOR_REJECTED"
    elif r.state == "INCHARGE_REVIEW":
        require(user.id == r.incharge_id and "INCHARGE" in user.roles, "Assigned Lab In-Charge required", "FORBIDDEN", 403)
        state, action = ("HOD_REVIEW" if approved else "REJECTED"), "INCHARGE_DECISION"
    elif r.state == "HOD_REVIEW":
        require("HOD" in user.roles, "HoD final approval required", "FORBIDDEN", 403)
        require(user.id not in [p.mentor_id, r.incharge_id], "Overlapping approval roles require policy", "POLICY_REQUIRED")
        state, action = ("APPROVED" if approved else "REJECTED"), ("HOD_APPROVED" if approved else "HOD_REJECTED")
        if approved:
            r.approved_at = utcnow()
    else:
        raise DomainError("INVALID_STATE", "Request is not at an approval stage")
    change(session, user, r, state, action, body.remarks)
    return {"id": r.id, "state": r.state}


def operating(session, user, r, owner=False):
    labs = {line.lab_id for line in lines_for(session, r)}
    require("ASSISTANT" in user.roles and labs <= set(user.lab_ids), "Operation requires an Assistant assigned to every issuing lab", "FORBIDDEN", 403)
    if owner:
        require(r.claimed_by == user.id, "Claim the operational order first", "CLAIM_REQUIRED")


def claim(session, user, identifier):
    r = get(session, Request, identifier, True)
    require(r.state == "APPROVED", "Only approved orders can be claimed")
    operating(session, user, r)
    require(r.claimed_by in [None, user.id], "Another Assistant owns this order", "ALREADY_CLAIMED")
    if r.claimed_by is None:
        r.claimed_by = user.id
        audit(session, user, "ORDER_CLAIMED", request=r)
    return {"id": r.id, "claimed_by": r.claimed_by}


def issue(session, user, identifier, body):
    r = get(session, Request, identifier, True)
    require(r.state == "APPROVED", "Request must be approved and unissued")
    operating(session, user, r, True)
    if r.approved_at + timedelta(hours=settings.collection_hours) <= utcnow():
        change(session, user, r, "APPROVED_EXPIRED_BEFORE_ISSUE", "APPROVAL_EXPIRED")
        return {"id": r.id, "state": r.state}
    lines = lines_for(session, r)
    require(not body.assignments or set(body.assignments) <= {l.id for l in lines}, "Unknown assignment line", "INVALID_ASSET", 422)
    # Validate EVERY lab/line before performing ANY inventory mutation.
    inventory = []
    all_assets = set()
    for line in lines:
        if r.kind == "CONSUMABLE":
            stock = session.scalar(select(Stock).where(Stock.item_id == line.item_id, Stock.lab_id == line.lab_id).with_for_update())
            if not stock or stock.good < line.quantity:
                change(session, user, r, "FULFILMENT_FAILED_STOCK", "FULFILMENT_FAILED_STOCK")
                return {"id": r.id, "state": r.state}
            inventory.append((line, stock))
        else:
            codes = body.assignments.get(line.id, [])
            require(len(codes) == line.quantity and len(set(codes)) == len(codes), "Supply one unique barcode per approved asset", "INVALID_ASSET", 422)
            selected = []
            for code in sorted(codes):
                asset = session.scalar(select(Asset).where(Asset.barcode == code).with_for_update())
                require(asset is not None and asset.item_id == line.item_id and asset.lab_id == line.lab_id, "Barcode does not match approved item/lab", "INVALID_ASSET", 422)
                require(asset.id not in all_assets, "Same physical asset assigned twice", "INVALID_ASSET", 422)
                all_assets.add(asset.id)
                if asset.state != "AVAILABLE":
                    change(session, user, r, "FULFILMENT_FAILED_STOCK", "FULFILMENT_FAILED_STOCK")
                    return {"id": r.id, "state": r.state}
                selected.append(asset)
            inventory.append((line, selected))
    audit(session, user, "FULFILMENT_PENDING", request=r, details={"whole_request": True, "physical_confirmation": True})
    for line, value in inventory:
        if r.kind == "CONSUMABLE":
            value.good -= line.quantity
        else:
            for asset in value:
                asset.state = "IN_USE" if r.purpose == "USE_IN_COLLEGE" else "ISSUED_OUT"
            line.asset_ids = [a.id for a in value]
    r.issued_at = utcnow()
    r.due_at = r.issued_at + timedelta(hours=r.duration_hours)
    r.due_version = 1
    change(session, user, r, "IN_USE" if r.purpose == "USE_IN_COLLEGE" else "ISSUED", "ISSUE_COMPLETED")
    return {"id": r.id, "state": r.state, "due_at": r.due_at.isoformat()+"Z"}


def cancel(session, user, identifier):
    r = get(session, Request, identifier, True)
    lead_project(session, user, r.project_id)
    require(r.state in ["MENTOR_REVIEW", "INCHARGE_REVIEW", "HOD_REVIEW", "APPROVED"], "Issued/terminal transactions cannot be cancelled")
    change(session, user, r, "CANCELLED", "REQUEST_CANCELLED")
    return {"id": r.id, "state": r.state}


def reconcile(session, user, identifier, body):
    r = get(session, Request, identifier, True)
    require(r.state in ["ISSUED", "IN_USE"], "Only active issued transactions can be returned")
    operating(session, user, r)
    lines = lines_for(session, r)
    entries = {x.line_id: x for x in body.lines}
    require(len(entries) == len(body.lines) and set(entries) == {l.id for l in lines}, "Submit a complete inspection for every line; staged returns await OD-16", "INCOMPLETE_RETURN", 422)
    # Entire return validates before writes, matching whole-request custody scope.
    mutations, incidents = [], []
    for line in lines:
        entry = entries[line.id]
        if r.kind == "CONSUMABLE":
            require(entry.good+entry.bad+entry.missing == line.quantity, "Good + bad + missing must equal issued quantity", "INVALID_QUANTITY", 422)
            require(not entry.asset_conditions, "Consumables do not use physical asset identities", "INVALID_INSPECTION", 422)
            stock = session.scalar(select(Stock).where(Stock.item_id == line.item_id, Stock.lab_id == line.lab_id).with_for_update())
            mutations.append((stock, entry))
            if entry.bad or entry.missing:
                incidents.append(entry.model_dump(mode="json"))
        else:
            assets = [get(session, Asset, aid, True) for aid in line.asset_ids]
            require(set(entry.asset_conditions) == {a.barcode for a in assets}, "Inspect every issued barcode exactly once", "INVALID_INSPECTION", 422)
            for asset in assets:
                condition = entry.asset_conditions[asset.barcode]
                require(not (condition == "GOOD" and entry.functional == "FAIL"), "A failed functional test cannot make an asset available", "INVALID_INSPECTION", 422)
                require(asset.state in ["IN_USE", "ISSUED_OUT"], "Physical asset is not on this active issue", "INVALID_STATE")
                if condition in ["DAMAGED", "DEFECTIVE"]:
                    require(bool(entry.evidence_ids), "Damage/defect inspection requires photo evidence", "EVIDENCE_REQUIRED", 422)
                    for eid in entry.evidence_ids:
                        evidence = session.get(Evidence, eid)
                        require(evidence is not None and evidence.request_id == r.id, "Evidence must belong to this issue", "INVALID_EVIDENCE", 422)
                mutations.append((asset, condition))
                if condition != "GOOD":
                    incidents.append({"barcode": asset.barcode, "condition": condition, "functional": entry.functional, "missing_parts": entry.missing_parts, "evidence_ids": entry.evidence_ids})
    for obj, value in mutations:
        if isinstance(obj, Stock):
            obj.good += value.good; obj.bad += value.bad
        else:
            obj.state = {"GOOD": "AVAILABLE", "DAMAGED": "DEFECTIVE", "DEFECTIVE": "DEFECTIVE", "LOST": "LOST"}[value]
    session.add(Inspection(request_id=r.id, actor_id=user.id, details=[x.model_dump(mode="json") for x in body.lines], remarks=body.remarks))
    for detail in incidents:
        session.add(Incident(request_id=r.id, project_id=r.project_id, actor_id=user.id, details={**detail, "remarks": body.remarks}))
    change(session, user, r, "CLOSED", "RETURN_COMPLETED", body.remarks)
    return {"id": r.id, "state": r.state, "incidents_recorded": len(incidents), "attribution": "NOT_DETERMINED"}


def extension_create(session, user, identifier, body):
    r = get(session, Request, identifier, True)
    lead_project(session, user, r.project_id)
    require(r.state in ["ISSUED", "IN_USE"], "Extension requires active issue")
    if r.due_at <= utcnow():
        policy("OD-11", "Overdue extension approval policy is unresolved")
    existing = list(session.scalars(select(Extension).where(Extension.request_id == r.id)))
    require(not any(e.state not in ["APPROVED", "REJECTED"] for e in existing), "An extension is already pending")
    require(sum(e.state == "APPROVED" for e in existing) < settings.max_extensions, "Configured extension limit reached", "EXTENSION_LIMIT")
    due = body.new_due_at.astimezone(timezone.utc).replace(tzinfo=None)
    require(due > r.due_at, "Revised due time must follow current due time", "INVALID_EXTENSION", 422)
    e = Extension(request_id=r.id, new_due_at=due, old_due_at=r.due_at, reason=body.reason)
    session.add(e); session.flush()
    a = audit(session, user, "EXTENSION_REQUESTED", request=r, details={"extension_id": e.id, "old_due_at": r.due_at.isoformat()+"Z", "new_due_at": due.isoformat()+"Z"})
    emit(session, "EXTENSION_REQUESTED", [user.id, get(session, Project, r.project_id).mentor_id], r, key=f"audit:{a.id}")
    return {"id": e.id, "state": e.state}


def extension_decide(session, user, identifier, body):
    e = get(session, Extension, identifier)
    r = get(session, Request, e.request_id, True)
    # Reload after parent lock, since every extension mutation locks its request.
    session.refresh(e)
    p = get(session, Project, r.project_id)
    require(r.state in ["ISSUED", "IN_USE"], "Issue is no longer active")
    if r.due_at <= utcnow():
        policy("OD-11", "Late extension decisions await explicit policy")
    expected = p.mentor_id if e.state == "MENTOR_REVIEW" else r.incharge_id if e.state == "INCHARGE_REVIEW" else None
    require((e.state == "HOD_REVIEW" and "HOD" in user.roles) or (expected == user.id and ((e.state == "MENTOR_REVIEW" and "MENTOR" in user.roles) or (e.state == "INCHARGE_REVIEW" and "INCHARGE" in user.roles))), "Actor does not own current extension stage", "FORBIDDEN", 403)
    previous = e.state
    if body.decision == "REJECT":
        e.state = "REJECTED"
    elif e.state == "MENTOR_REVIEW":
        e.state = "INCHARGE_REVIEW" if r.kind == "ASSET" else "HOD_REVIEW"
        if r.kind == "CONSUMABLE":
            audit(session, user, "EXTENSION_CENTRAL_STORE_VALIDATED", request=r, details={"system_stage": True})
    elif e.state == "INCHARGE_REVIEW":
        e.state = "HOD_REVIEW"
    else:
        require(r.due_at == e.old_due_at, "Due date changed since extension request", "STALE_EXTENSION")
        require(sum(x.state == "APPROVED" for x in session.scalars(select(Extension).where(Extension.request_id == r.id))) < settings.max_extensions, "Extension limit reached", "EXTENSION_LIMIT")
        e.state = "APPROVED"; r.due_at = e.new_due_at; r.due_version += 1
    a = audit(session, user, "EXTENSION_DECISION", request=r, details={"extension_id": e.id, "previous": previous, "state": e.state, "remarks": body.remarks})
    next_ids = [p.mentor_id] if e.state == "MENTOR_REVIEW" else [r.incharge_id] if e.state == "INCHARGE_REVIEW" else roles(session, "HOD") if e.state == "HOD_REVIEW" else []
    emit(session, "EXTENSION_DECISION", [p.lead_id, p.mentor_id]+([r.incharge_id] if r.incharge_id else [])+next_ids, r, key=f"audit:{a.id}")
    return {"id": e.id, "state": e.state, "due_at": r.due_at.isoformat()+"Z"}


def reserve(session, user, body):
    p = lead_project(session, user, body.project_id)
    get(session, Item, body.item_id)
    result = plan(session, [body])
    require(not result["feasible"], "Available inventory should use the request workflow", "AVAILABLE_NOW")
    # Lock catalogue identity to serialize same-type queue enrollment in MySQL.
    get(session, Item, body.item_id, True)
    prior = session.scalar(select(Reservation).where(Reservation.project_id == p.id, Reservation.item_id == body.item_id, Reservation.state == "WAITING_FIFO"))
    require(prior is None, "A waiting reservation already exists", "DUPLICATE_RESERVATION")
    r = Reservation(project_id=p.id, item_id=body.item_id, quantity=body.quantity)
    session.add(r); session.flush()
    a = audit(session, user, "RESERVATION_CREATED", p.id, details={"reservation_id": r.id, "item_id": r.item_id, "quantity": r.quantity})
    emit(session, "RESERVATION_CREATED", [user.id, p.mentor_id], details={"reservation_id": r.id}, key=f"audit:{a.id}")
    return {"id": r.id, "state": r.state, "fulfilment_policy": "OD-04"}


def reservation_cancel(session, user, identifier):
    r = get(session, Reservation, identifier, True)
    lead_project(session, user, r.project_id)
    require(r.state == "WAITING_FIFO", "Only waiting reservations can be cancelled")
    r.state = "CANCELLED"
    a = audit(session, user, "RESERVATION_CANCELLED", r.project_id, details={"reservation_id": r.id})
    emit(session, "RESERVATION_CANCELLED", [user.id, get(session, Project, r.project_id).mentor_id], details={"reservation_id": r.id}, key=f"audit:{a.id}")
    return {"id": r.id, "state": r.state}
