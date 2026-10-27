import hashlib
import io
import json
import secrets
from contextlib import asynccontextmanager
from datetime import timedelta
from pathlib import Path
from fastapi import FastAPI, Depends, Header, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response, FileResponse
from fastapi.exceptions import RequestValidationError
from fastapi.staticfiles import StaticFiles
from PIL import Image, UnidentifiedImageError
from sqlalchemy import select, func
from sqlalchemy.exc import OperationalError, IntegrityError, SQLAlchemyError
from . import db
from .auth import SyntheticAuthProvider, issue_token, token_user
from .config import settings
from .models import *
from .schemas import *
from . import service as svc
from .adapters import document_store, object_store, MongoDocumentStore
from .worker import dispatch, expire_approved


def serialize_time(value):
    return value.isoformat()+"Z" if value else None


def user_view(u):
    return {
        "id": u.id,
        "name": u.name,
        "identifier": u.identifier,
        "email": u.email,
        "roles": u.roles,
        "lab_ids": u.lab_ids,
        "department": getattr(u, "department", None),
        "designation": getattr(u, "designation", None),
        "batch": getattr(u, "batch", None),
        "year_of_study": getattr(u, "year_of_study", None),
        "branch": getattr(u, "branch", None),
        "roll_number": getattr(u, "roll_number", None),
        "phone": getattr(u, "phone", None),
    }


def request_view(session, r):
    p = session.get(Project, r.project_id)
    return {"id": r.id, "project_id": p.id, "project_code": f"PROJ-{p.id:06d}", "project_name": p.name, "lead_id": p.lead_id, "mentor_id": p.mentor_id, "incharge_id": r.incharge_id, "claimed_by": r.claimed_by, "kind": r.kind, "purpose": r.purpose, "state": r.state, "duration_hours": r.duration_hours, "due_at": serialize_time(r.due_at), "due_version": r.due_version, "acknowledged_at": serialize_time(r.acknowledged_at), "lines": [{"id": l.id, "item_id": l.item_id, "item_name": session.get(Item, l.item_id).name, "lab_id": l.lab_id, "lab_name": session.get(Lab, l.lab_id).name, "quantity": l.quantity, "barcodes": [session.get(Asset, aid).barcode for aid in l.asset_ids]} for l in svc.lines_for(session, r)], "timeline": [{"id": a.id, "actor": session.get(User, a.actor_id).name, "action": a.action, "previous_state": a.previous_state, "new_state": a.new_state, "details": a.details, "created_at": serialize_time(a.created_at)} for a in session.scalars(select(Audit).where(Audit.request_id == r.id).order_by(Audit.id))], "extensions": [{"id": e.id, "state": e.state, "old_due_at": serialize_time(e.old_due_at), "new_due_at": serialize_time(e.new_due_at), "reason": e.reason} for e in session.scalars(select(Extension).where(Extension.request_id == r.id).order_by(Extension.id))]}


def actor(authorization: str = Header(default="")):
    if not authorization.startswith("Bearer "):
        raise svc.DomainError("UNAUTHENTICATED", "Sign in to continue", 401)
    with db.Session() as session:
        u = token_user(session, authorization[7:])
        if not u:
            raise svc.DomainError("UNAUTHENTICATED", "Session expired or revoked", 401)
        return u.id


def command(uid, operation, key, body, callback):
    if settings.read_only:
        raise svc.DomainError("READ_ONLY", "This secondary environment is read-only", 403)
    if not key or len(key) > 120:
        raise svc.DomainError("IDEMPOTENCY_KEY_REQUIRED", "Provide Idempotency-Key (1–120 characters)", 422)
    fingerprint = hashlib.sha256(json.dumps(body, sort_keys=True, default=str).encode()).hexdigest()
    identity = f"{uid}:{operation}:{key}"
    with db.Session() as session:
        try:
            db.begin_write(session)
            u = svc.get(session, User, uid, True)
            svc.require(u.active, "User disabled", "UNAUTHENTICATED", 401)
            existing = session.get(Idempotency, identity)
            if existing:
                svc.require(existing.fingerprint == fingerprint, "Idempotency key was already used with a different payload", "IDEMPOTENCY_CONFLICT")
                session.rollback()
                return existing.result
            result = callback(session, u)
            session.add(Idempotency(key=identity, fingerprint=fingerprint, result=result))
            session.commit()
            return result
        except (OperationalError, IntegrityError):
            session.rollback()
            raise svc.DomainError("TRANSACTION_RETRY", "Transaction could not commit; retry with the same idempotency key", 503)


@asynccontextmanager
async def lifespan(app):
    scheduler = None
    if settings.scheduler_enabled and not settings.read_only:
        from apscheduler.schedulers.background import BackgroundScheduler
        scheduler = BackgroundScheduler(timezone="UTC")
        def run():
            with db.Session() as s:
                try:
                    db.begin_write(s); expire_approved(s); dispatch(s); s.commit()
                except Exception:
                    s.rollback()
        scheduler.add_job(run, "interval", seconds=10, max_instances=1, coalesce=True)
        scheduler.start()
    yield
    if scheduler:
        scheduler.shutdown(wait=False)


app = FastAPI(title="LabTrack API", version="0.1.0", lifespan=lifespan, responses={401: {"model": ErrorEnvelope}, 403: {"model": ErrorEnvelope}, 409: {"model": ErrorEnvelope}, 422: {"model": ErrorEnvelope}, 503: {"model": ErrorEnvelope}})

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


_EVENTS_FILE = Path(__file__).resolve().parent.parent.parent.parent / "fixtures" / "requisition_events.json"

def _load_events():
    try:
        if _EVENTS_FILE.exists():
            with open(_EVENTS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception:
        pass
    return []

def _save_events(events):
    try:
        _EVENTS_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(_EVENTS_FILE, "w", encoding="utf-8") as f:
            json.dump(events, f, indent=2)
    except Exception:
        pass

_REQUISITION_EVENTS_LEDGER = []
_save_events([])


@app.get("/api/notifications/requisition-events")
def get_requisition_events():
    """Retrieve history of life-cycle requisition events dispatched by the application."""
    global _REQUISITION_EVENTS_LEDGER
    _REQUISITION_EVENTS_LEDGER = _load_events()
    return {"events": _REQUISITION_EVENTS_LEDGER}


@app.post("/api/notifications/requisition-events/clear")
def clear_requisition_events():
    """Clear in-memory and on-disk requisition events ledger."""
    global _REQUISITION_EVENTS_LEDGER
    _REQUISITION_EVENTS_LEDGER = []
    _save_events([])
    return {"status": "cleared", "events": []}


@app.post("/api/notifications/requisition-event")
def notify_requisition_event(body: dict):
    """Bridge endpoint enabling the web frontend to dispatch real SMTP lifecycle emails."""
    event = body.get("event", "REQUEST_SUBMITTED")
    req_id = body.get("request_id", "REQ-LIVE")
    student_name = body.get("student_name", "Ishaan Chand")
    student_prn = body.get("student_prn", "25070126076")
    project_name = body.get("project_name", "Autonomous Quadruped Vision Robot")
    mentor_name = body.get("mentor_name", "Dr. Meenakshi Sharma")
    technical_purpose = body.get("technical_purpose", "Coursework Project")
    components = body.get("components", [])

    entry = {
        "event": event,
        "request_id": req_id,
        "student_name": student_name,
        "student_prn": student_prn,
        "project_name": project_name,
        "mentor_name": mentor_name,
        "technical_purpose": technical_purpose,
        "components": components,
    }
    _REQUISITION_EVENTS_LEDGER.insert(0, entry)
    _save_events(_REQUISITION_EVENTS_LEDGER)

    from .adapters import email_provider
    import uuid

    identifier = f"fe:{req_id}:{uuid.uuid4().hex[:6]}"
    target = settings.email_override or settings.smtp_username or "labtrack821@gmail.com"

    payload = {
        "event": event,
        "request_id": req_id,
        "link": "/workspace/operations/approvals",
        "details": {
            "student_name": student_name,
            "student_prn": student_prn,
            "project_name": project_name,
            "mentor_name": mentor_name,
            "technical_purpose": technical_purpose,
            "components": components,
        }
    }

    try:
        provider = email_provider()
        provider.send(identifier, target, payload)
        return {"status": "dispatched", "target": target, "event": event, "request_id": req_id}
    except Exception as exc:
        return JSONResponse(status_code=500, content={"error": {"code": "EMAIL_DISPATCH_FAILED", "message": str(exc)}})


@app.post("/api/notifications/test-email")
def test_email():
    """Manual trigger to verify Gmail SMTP dispatch to configured target."""
    from .adapters import email_provider
    import uuid
    identifier = f"test:{uuid.uuid4().hex[:6]}"
    target = settings.email_override or settings.smtp_username or "labtrack821@gmail.com"
    payload = {
        "event": "PORTAL_EMAIL_CHECK",
        "request_id": "TEST-2026",
        "link": "/workspace",
        "details": {
            "student_name": "Ishaan Chand",
            "student_prn": "25070126076",
            "project_name": "Autonomous Quadruped Vision Robot",
            "mentor_name": "Dr. Meenakshi Sharma",
            "technical_purpose": "Testing institutional live SMTP dispatch to Google inbox.",
            "components": [{"nomenclature": "NVIDIA Jetson Nano 4GB B01 Developer Kit", "quantity": 1}],
        }
    }
    try:
        provider = email_provider()
        provider.send(identifier, target, payload)
        return {"status": "dispatched", "target": target}
    except Exception as exc:
        return JSONResponse(status_code=500, content={"error": {"code": "EMAIL_DISPATCH_FAILED", "message": str(exc)}})


@app.exception_handler(svc.DomainError)
async def domain_error(_, exc):
    return JSONResponse(status_code=exc.status, content={"error": {"code": exc.code, "message": exc.message, "decision": exc.decision}})


@app.exception_handler(RequestValidationError)
async def validation_error(_, exc):
    return JSONResponse(status_code=422, content={"error": {"code": "VALIDATION_ERROR", "message": "; ".join(".".join(str(x) for x in e["loc"])+": "+e["msg"] for e in exc.errors()), "decision": None}})


@app.exception_handler(SQLAlchemyError)
async def persistence_error(_, exc):
    return JSONResponse(status_code=503, content={"error": {"code": "DATABASE_UNAVAILABLE", "message": "Database operation could not complete; retry safely with the same idempotency key", "decision": None}})


@app.get("/api/health")
def health():
    with db.Session() as s:
        s.execute(select(1))
    return {"status": "ok", "sql": db.engine.dialect.name, "documents": settings.document_store, "email": settings.email_provider, "synthetic_data": True, "read_only": settings.read_only}


@app.post("/api/auth/login", response_model=LoginView)
def login(body: Login):
    # Fixed-cost PBKDF2 verification; login attempts are additionally bounded at proxy.
    with db.Session() as s:
        u = SyntheticAuthProvider().authenticate(s, body.identifier, body.password)
        svc.require(u is not None, "Invalid synthetic credentials", "UNAUTHENTICATED", 401)
        token = issue_token(s, u, settings.session_hours); s.commit()
        return {"token": token, "user": user_view(u)}


@app.post("/api/auth/logout")
def logout(uid=Depends(actor), authorization: str = Header()):
    with db.Session() as s:
        record = s.get(AuthSession, hashlib.sha256(authorization[7:].encode()).hexdigest())
        if record:
            s.delete(record); s.commit()
    return {"logged_out": True}


@app.get("/api/me", response_model=UserView)
def me(uid=Depends(actor)):
    with db.Session() as s:
        return user_view(s.get(User, uid))


@app.get("/api/directory", response_model=list[UserView])
def directory(uid=Depends(actor)):
    with db.Session() as s:
        # Synthetic directory only; no institutional PII or credential fields.
        return [user_view(u) for u in s.scalars(select(User).where(User.active.is_(True))) if "SYSTEM" not in u.roles]


@app.get("/api/catalogue", response_model=list[ItemView])
def catalogue(category: str | None = None, q: str | None = None, uid=Depends(actor)):
    with db.Session() as s:
        return svc.catalogue(s, category=category, q=q)


@app.get("/api/catalogue/assets/{barcode}")
def asset_lookup(barcode: str, uid=Depends(actor)):
    with db.Session() as s:
        return svc.lookup_asset(s, barcode)


@app.post("/api/plans")
def plans(body: PlanInput, uid=Depends(actor)):
    with db.Session() as s:
        return svc.plan(s, body.lines)


@app.get("/api/projects", response_model=list[ProjectView])
def projects(uid=Depends(actor)):
    with db.Session() as s:
        u = s.get(User, uid)
        return [{"id": p.id, "project_code": f"PROJ-{p.id:06d}", "name": p.name, "description": p.description, "lead_id": p.lead_id, "mentor_id": p.mentor_id, "member_ids": list(s.scalars(select(Member.user_id).where(Member.project_id == p.id)))} for p in s.scalars(select(Project).order_by(Project.id.desc())) if svc.can_view_project(s, u, p)]


@app.get("/api/projects/{identifier}", response_model=ProjectView)
def project_detail(identifier: int, uid=Depends(actor)):
    with db.Session() as s:
        u = s.get(User, uid)
        return svc.get_project(s, u, identifier)


@app.post("/api/projects")
def project_create(body: ProjectInput, uid=Depends(actor), idempotency_key: str = Header(default="")):
    return command(uid, "project", idempotency_key, body.model_dump(), lambda s, u: svc.create_project(s, u, body))


@app.post("/api/requests")
def submit(body: RequestInput, uid=Depends(actor), idempotency_key: str = Header(default="")):
    return command(uid, "submit", idempotency_key, body.model_dump(), lambda s, u: svc.submit_request(s, u, body))


@app.get("/api/requests", response_model=list[RequestView])
def requests_list(uid=Depends(actor)):
    with db.Session() as s:
        u = s.get(User, uid)
        return [request_view(s, r) for r in s.scalars(select(Request).order_by(Request.id.desc())) if svc.can_view_project(s, u, s.get(Project, r.project_id))]


@app.get("/api/requests/{identifier}", response_model=RequestView)
def request_detail(identifier: int, uid=Depends(actor)):
    with db.Session() as s:
        r = svc.get(s, Request, identifier)
        svc.visible_project(s, s.get(User, uid), r.project_id)
        return request_view(s, r)


@app.post("/api/requests/{identifier}/decision")
def decision(identifier: int, body: DecisionInput, uid=Depends(actor), idempotency_key: str = Header(default="")):
    return command(uid, f"decision:{identifier}", idempotency_key, body.model_dump(), lambda s, u: svc.decide(s, u, identifier, body))


@app.post("/api/requests/{identifier}/claim")
def claim(identifier: int, uid=Depends(actor), idempotency_key: str = Header(default="")):
    return command(uid, f"claim:{identifier}", idempotency_key, {}, lambda s, u: svc.claim(s, u, identifier))


@app.post("/api/requests/{identifier}/issue")
def issue(identifier: int, body: IssueInput, uid=Depends(actor), idempotency_key: str = Header(default="")):
    return command(uid, f"issue:{identifier}", idempotency_key, body.model_dump(), lambda s, u: svc.issue(s, u, identifier, body))


@app.post("/api/requests/{identifier}/cancel")
def cancel(identifier: int, uid=Depends(actor), idempotency_key: str = Header(default="")):
    return command(uid, f"cancel:{identifier}", idempotency_key, {}, lambda s, u: svc.cancel(s, u, identifier))


@app.post("/api/requests/{identifier}/return")
def returned(identifier: int, body: ReturnInput, uid=Depends(actor), idempotency_key: str = Header(default="")):
    return command(uid, f"return:{identifier}", idempotency_key, body.model_dump(), lambda s, u: svc.reconcile(s, u, identifier, body))


@app.post("/api/requests/{identifier}/acknowledge")
def acknowledge(identifier: int, uid=Depends(actor), idempotency_key: str = Header(default="")):
    def work(s, u):
        r = svc.get(s, Request, identifier, True); svc.lead_project(s, u, r.project_id)
        svc.require(r.state == "CLOSED", "Return must be reconciled first")
        if not r.acknowledged_at:
            r.acknowledged_at = utcnow(); svc.audit(s, u, "RETURN_ACKNOWLEDGED", request=r)
        return {"id": r.id, "acknowledged_at": serialize_time(r.acknowledged_at)}
    return command(uid, f"ack:{identifier}", idempotency_key, {}, work)


@app.post("/api/requests/{identifier}/extensions")
def extension(identifier: int, body: ExtensionInput, uid=Depends(actor), idempotency_key: str = Header(default="")):
    return command(uid, f"extension:{identifier}", idempotency_key, body.model_dump(mode="json"), lambda s, u: svc.extension_create(s, u, identifier, body))


@app.post("/api/extensions/{identifier}/decision")
def extension_decision(identifier: int, body: DecisionInput, uid=Depends(actor), idempotency_key: str = Header(default="")):
    return command(uid, f"extension-decision:{identifier}", idempotency_key, body.model_dump(), lambda s, u: svc.extension_decide(s, u, identifier, body))


@app.get("/api/reservations", response_model=list[ReservationView])
def reservations(uid=Depends(actor)):
    with db.Session() as s:
        u = s.get(User, uid)
        return [{"id": r.id, "project_id": r.project_id, "item_id": r.item_id, "item_name": s.get(Item, r.item_id).name, "quantity": r.quantity, "state": r.state, "created_at": serialize_time(r.created_at)} for r in s.scalars(select(Reservation).order_by(Reservation.id)) if svc.can_view_project(s, u, s.get(Project, r.project_id))]


@app.post("/api/reservations")
def reserve(body: ReservationInput, uid=Depends(actor), idempotency_key: str = Header(default="")):
    return command(uid, "reserve", idempotency_key, body.model_dump(), lambda s, u: svc.reserve(s, u, body))


@app.post("/api/reservations/{identifier}/cancel")
def reservation_cancel(identifier: int, uid=Depends(actor), idempotency_key: str = Header(default="")):
    return command(uid, f"reservation-cancel:{identifier}", idempotency_key, {}, lambda s, u: svc.reservation_cancel(s, u, identifier))


@app.post("/api/requests/{identifier}/retained")
def retained(identifier: int, uid=Depends(actor)):
    with db.Session() as s:
        r = svc.get(s, Request, identifier); svc.visible_project(s, s.get(User, uid), r.project_id)
    svc.policy("OD-16", "Departmental retention approval authority must be specified before retention can close custody")


@app.post("/api/requests/{identifier}/evidence")
def upload_evidence(identifier: int, file: UploadFile = File(), uid=Depends(actor)):
    svc.require(not settings.read_only, "Secondary is read-only", "READ_ONLY", 403)
    content = file.file.read(5*1024*1024+1)
    svc.require(0 < len(content) <= 5*1024*1024, "Photo must be no larger than 5 MiB", "INVALID_EVIDENCE", 422)
    try:
        image = Image.open(io.BytesIO(content)); image.verify()
        svc.require(image.width*image.height <= 20_000_000, "Photo exceeds the supported image dimensions", "INVALID_EVIDENCE", 422)
        content_type = {"JPEG": "image/jpeg", "PNG": "image/png"}.get(image.format)
        svc.require(content_type is not None, "Use a PNG or JPEG photo", "INVALID_EVIDENCE", 422)
    except (UnidentifiedImageError, OSError, Image.DecompressionBombError):
        raise svc.DomainError("INVALID_EVIDENCE", "Invalid image file", 422)
    with db.Session() as s:
        db.begin_write(s)
        r = svc.get(s, Request, identifier, True); u = s.get(User, uid); svc.operating(s, u, r)
        svc.require(r.kind == "ASSET" and r.state in ["ISSUED", "IN_USE"], "Evidence belongs to an active asset issue")
        digest = hashlib.sha256(content).hexdigest()
        existing = s.scalar(select(Evidence).where(Evidence.request_id == r.id, Evidence.actor_id == uid, Evidence.sha256 == digest))
        if existing:
            return {"id": existing.id}
        eid = secrets.token_hex(24)
        try:
            object_store().put(eid, content, content_type)
        except Exception:
            raise svc.DomainError("EVIDENCE_UPLOAD_FAILED", "Photo could not be stored; inspection remains unchanged", 503)
        s.add(Evidence(id=eid, request_id=r.id, actor_id=u.id, storage_key=eid, content_type=content_type, sha256=digest))
        svc.audit(s, u, "EVIDENCE_UPLOADED", request=r, details={"evidence_id": eid})
        try:
            s.commit()
        except SQLAlchemyError:
            s.rollback()
            try:
                object_store().delete(eid)
            except Exception:
                # An operator can retry this exact orphan key after checking the
                # SQL reference is absent. Never delete a referenced evidence blob.
                settings.local_dir.mkdir(parents=True, exist_ok=True)
                with (settings.local_dir / "orphan-evidence.jsonl").open("a", encoding="utf-8") as journal:
                    journal.write(json.dumps({"key": eid, "store": settings.object_store})+"\n")
            raise
        return {"id": eid}


@app.get("/api/evidence/{identifier}")
def read_evidence(identifier: str, uid=Depends(actor)):
    with db.Session() as s:
        e = s.get(Evidence, identifier); svc.require(e is not None, "Evidence not found", "NOT_FOUND", 404)
        r = s.get(Request, e.request_id); svc.visible_project(s, s.get(User, uid), r.project_id)
        return Response(object_store().read(e.storage_key), media_type=e.content_type, headers={"Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff"})


@app.get("/api/notifications", response_model=list[NotificationView])
def notifications(uid=Depends(actor)):
    with db.Session() as s:
        try:
            return sorted(document_store(s).list("notifications", uid), key=lambda x: x["event_id"], reverse=True)
        except Exception:
            raise svc.DomainError("DOCUMENT_STORE_UNAVAILABLE", "Notifications are temporarily unavailable; request state is unchanged", 503)


@app.post("/api/demand")
def demand(body: Quantity, uid=Depends(actor), idempotency_key: str = Header(default="")):
    def work(s, u):
        svc.require("STUDENT" in u.roles, "Student role required", "FORBIDDEN", 403)
        item = svc.get(s, Item, body.item_id)
        svc.require(not svc.plan(s, [body])["feasible"], "Requested quantity is available", "AVAILABLE_NOW")
        a = svc.audit(s, u, "UNMET_DEMAND", details=body.model_dump())
        svc.emit(s, "UNMET_DEMAND", [], details={**body.model_dump(), "name": item.name}, key=f"audit:{a.id}")
        return {"recorded": True}
    return command(uid, "demand", idempotency_key, body.model_dump(), work)


@app.get("/api/alternatives/{item_id}", response_model=list[ItemView])
def alternatives(item_id: int, uid=Depends(actor)):
    with db.Session() as s:
        item = svc.get(s, Item, item_id)
        # Curated mapping and explicit technical metadata filter; no model invents candidates.
        return [c for c in svc.catalogue(s) if c["id"] in item.alternative_ids and c["available"] > 0 and c["specs"].get("function") == item.specs.get("function") and c["specs"].get("interface") == item.specs.get("interface")]


@app.post("/api/demand/unstocked")
def unstocked_demand(body: UnstockedDemandInput, uid=Depends(actor), idempotency_key: str = Header(default="")):
    def work(s, u):
        svc.require("STUDENT" in u.roles, "Student role required", "FORBIDDEN", 403)
        existing = next((i for i in s.scalars(select(Item)) if i.name.casefold() == body.component_name.casefold()), None)
        svc.require(existing is None, "This item exists in the catalogue; use its availability and quantity workflow", "CATALOGUE_ITEM_EXISTS")
        details = {"item_id": None, "component_name": body.component_name, "quantity": body.quantity}
        a = svc.audit(s, u, "UNMET_DEMAND", details=details)
        svc.emit(s, "UNMET_DEMAND", [], details=details, key=f"audit:{a.id}")
        return {"recorded": True, "inventory_created": False}
    return command(uid, "unstocked-demand", idempotency_key, body.model_dump(), work)


@app.get("/api/incidents")
def incidents(uid=Depends(actor)):
    with db.Session() as s:
        u = s.get(User, uid)
        svc.require(bool(set(u.roles) & {"HOD", "MENTOR", "INCHARGE"}), "Authorized faculty role required", "FORBIDDEN", 403)
        return [{"id": i.id, "request_id": i.request_id, "project_id": i.project_id, "details": i.details, "attribution": i.attribution, "created_at": serialize_time(i.created_at)} for i in s.scalars(select(Incident).order_by(Incident.id.desc())) if svc.can_view_project(s, u, s.get(Project, i.project_id))]


@app.get("/api/reports/usage")
def report(uid=Depends(actor)):
    with db.Session() as s:
        svc.require("HOD" in s.get(User, uid).roles, "HoD departmental visibility required", "FORBIDDEN", 403)
        query = select(Item.name, func.sum(RequestLine.quantity).label("units"), func.count(func.distinct(Request.id)).label("requests")).join(RequestLine, RequestLine.item_id == Item.id).join(Request, Request.id == RequestLine.request_id).where(Request.issued_at.is_not(None)).group_by(Item.id, Item.name).order_by(Item.name)
        return [{"item": name, "issued_quantity": units, "requests": count} for name, units, count in s.execute(query)]


@app.get("/api/reports/demand")
def demand_report(uid=Depends(actor)):
    with db.Session() as s:
        svc.require("HOD" in s.get(User, uid).roles, "HoD departmental visibility required", "FORBIDDEN", 403)
        store = document_store(s)
        if isinstance(store, MongoDocumentStore):
            return store.demand_summary()
        totals = {}
        for d in store.list("demand"):
            identity = d["item_id"] if d.get("item_id") is not None else d["component_name"]
            row = totals.setdefault(identity, {"_id": identity, "requested": 0, "occurrences": 0})
            row["requested"] += d["quantity"]; row["occurrences"] += 1
        return sorted(totals.values(), key=lambda x: (-x["requested"], str(x["_id"])))


@app.get("/api/capabilities")
def capabilities(uid=Depends(actor)):
    return {"whole_request_atomic_issue": True, "synthetic_auth": True, "queue_enrollment": True, "reservation_fulfilment": {"available": False, "decision": "OD-04", "reason": "Inventory hold/approval bridge unresolved"}, "retained_in_project": {"available": False, "decision": "OD-16", "reason": "Retention authority unresolved"}, "numeric_repo": {"available": False, "decision": "OD-13", "reason": "Conflicting score scope"}, "ai_provider": {"available": False, "decision": "OD-18", "reason": "External adapter contract absent; curated alternatives available"}, "calendar_reminders": {"available": False, "decision": "OD-11", "reason": "Calendar/catch-up rules unresolved"}, "document_store": settings.document_store}


if settings.frontend_dir.exists():
    app.mount("/assets", StaticFiles(directory=settings.frontend_dir / "assets"), name="assets")

    @app.get("/{path:path}", include_in_schema=False)
    def spa(path: str):
        if path.startswith("api/"):
            return JSONResponse(status_code=404, content={"error": {"code": "NOT_FOUND", "message": "Unknown API route", "decision": None}})
        return FileResponse(settings.frontend_dir / "index.html")
