"""Transactional outbox projection. No business calendar is inferred here."""
from sqlalchemy import select
from .models import Outbox, Delivery, User
from .adapters import document_store, email_provider
from .config import settings


def expire_approved(session):
    from datetime import timedelta
    from .models import Request, utcnow
    from .service import change
    system = next((u for u in session.scalars(select(User)) if "SYSTEM" in u.roles and u.active), None)
    if system is None:
        return 0
    expired = list(session.scalars(select(Request).where(Request.state == "APPROVED", Request.approved_at <= utcnow()-timedelta(hours=settings.collection_hours)).order_by(Request.id).with_for_update(skip_locked=True)))
    for request in expired:
        change(session, system, request, "APPROVED_EXPIRED_BEFORE_ISSUE", "APPROVAL_EXPIRED")
    return len(expired)


def durable_external_send(delivery_id, recipient, payload):
    """Persist send intent BEFORE Gmail; interrupted intent needs operator review.

    A provider timeout cannot establish whether Gmail accepted a message. We do
    not claim external exactly-once delivery or automatically repeat that send.
    """
    from . import db
    from sqlalchemy.exc import IntegrityError
    with db.Session() as s:
        db.begin_write(s)
        row = s.scalar(select(Delivery).where(Delivery.id == delivery_id).with_for_update())
        if row is not None and row.state == "SENT":
            return None
        if row is not None and row.state in ["SENDING", "UNKNOWN"]:
            row.state = "UNKNOWN"; s.commit()
            return "email:ambiguous-send-requires-operator"
        if row is None:
            row = Delivery(id=delivery_id); s.add(row)
        row.state = "SENDING"
        try:
            s.commit()
        except IntegrityError:
            s.rollback()
            return "email:concurrent-delivery"
    state, error = "SENT", None
    try:
        email_provider().send(delivery_id, recipient, payload)
    except ValueError as exc:
        # Provider validates configuration before invoking the network.
        state, error = "PENDING", type(exc).__name__
    except Exception as exc:
        state, error = "UNKNOWN", type(exc).__name__
    with db.Session() as s:
        db.begin_write(s)
        row = s.scalar(select(Delivery).where(Delivery.id == delivery_id).with_for_update())
        row.state, row.error = state, error
        s.commit()
    return "email:"+error if error else None


def dispatch(session):
    store = document_store(session)
    processed = 0
    for event in session.scalars(select(Outbox).where(Outbox.dispatched.is_(False)).order_by(Outbox.id).limit(100).with_for_update(skip_locked=True)):
        event.attempts += 1
        errors = []
        if event.payload["event"] == "UNMET_DEMAND":
            try:
                store.put("demand", f"demand:{event.id}", event.payload["details"])
            except Exception as exc:
                errors.append(type(exc).__name__)
        for uid in event.payload["recipients"]:
            payload = {**event.payload, "user_id": uid, "event_id": event.id, "link": f"/requests/{event.payload['request_id']}" if event.payload.get("request_id") else "/", "created_at": event.created_at.isoformat()+"Z"}
            try:
                store.put("notifications", f"notification:{event.id}:{uid}", payload)
            except Exception as exc:
                errors.append("document:"+type(exc).__name__)
            delivery_id = f"email:{event.id}:{uid}"
            if settings.email_provider == "gmail":
                # Release the projection transaction before the independently
                # durable provider intent transaction. Replayed projection is safe.
                session.commit()
                user = session.get(User, uid)
                error = durable_external_send(delivery_id, user.email, payload)
                if error:
                    errors.append(error)
                delivery = session.get(Delivery, delivery_id)
                session.refresh(delivery)
                try:
                    store.put("deliveries", delivery_id, {"event_id": event.id, "user_id": uid, "channel": "EMAIL", "state": delivery.state})
                except Exception as exc:
                    errors.append("delivery-projection:"+type(exc).__name__)
                continue
            delivery = session.get(Delivery, delivery_id)
            if delivery is None:
                delivery = Delivery(id=delivery_id)
                session.add(delivery); session.flush()
            if delivery.state in ["UNKNOWN", "SENDING"]:
                # A persisted SENDING from an interrupted external worker is ambiguous.
                delivery.state = "UNKNOWN"
                errors.append("email:ambiguous-send-requires-operator")
                continue
            if delivery.state == "SENT":
                continue
            user = session.get(User, uid)
            try:
                email_provider().send(delivery_id, user.email, payload)
                delivery.state = "SENT"; delivery.error = None
            except Exception as exc:
                # No blind retry after a network-ambiguous send; local/config failures retry.
                delivery.state = "UNKNOWN" if type(exc).__name__ in ["ReadTimeout", "WriteTimeout", "RemoteProtocolError"] else "PENDING"
                delivery.error = type(exc).__name__
                errors.append("email:"+type(exc).__name__)
            try:
                store.put("deliveries", delivery_id, {"event_id": event.id, "user_id": uid, "channel": "EMAIL", "state": delivery.state})
            except Exception as exc:
                errors.append("delivery-projection:"+type(exc).__name__)
        event.dispatched = not errors
        event.last_error = "; ".join(errors) or None
        if not errors:
            processed += 1
    return {"processed": processed}
