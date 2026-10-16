"""Relational business truth. REQ-LT-0001..0067; see execution traceability."""
from datetime import datetime, timezone
from sqlalchemy import Boolean, CheckConstraint, DateTime, ForeignKey, Integer, JSON, String, Text, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


def utcnow():
    # UTC-naive database timestamps are serialized with Z at the API boundary.
    return datetime.now(timezone.utc).replace(tzinfo=None)


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    identifier: Mapped[str] = mapped_column(String(40), unique=True)
    email: Mapped[str] = mapped_column(String(200), unique=True)
    password_hash: Mapped[str] = mapped_column(String(200))
    roles: Mapped[list] = mapped_column(JSON)
    lab_ids: Mapped[list] = mapped_column(JSON, default=list)
    active: Mapped[bool] = mapped_column(Boolean, default=True)


class AuthSession(Base):
    __tablename__ = "auth_sessions"
    token_hash: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    expires_at: Mapped[datetime] = mapped_column(DateTime)


class Lab(Base):
    __tablename__ = "labs"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    incharge_id: Mapped[int] = mapped_column(ForeignKey("users.id"))


class Item(Base):
    __tablename__ = "items"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    kind: Mapped[str] = mapped_column(String(20))
    category: Mapped[str] = mapped_column(String(50))
    description: Mapped[str] = mapped_column(Text, default="")
    brand: Mapped[str] = mapped_column(String(100), default="")
    specs: Mapped[dict] = mapped_column(JSON, default=dict)
    alternative_ids: Mapped[list] = mapped_column(JSON, default=list)
    __table_args__ = (CheckConstraint("kind IN ('ASSET','CONSUMABLE')", name="ck_item_kind"),)


class Stock(Base):
    __tablename__ = "stock"
    id: Mapped[int] = mapped_column(primary_key=True)
    item_id: Mapped[int] = mapped_column(ForeignKey("items.id"))
    lab_id: Mapped[int] = mapped_column(ForeignKey("labs.id"))
    good: Mapped[int] = mapped_column(Integer)
    bad: Mapped[int] = mapped_column(Integer, default=0)
    __table_args__ = (UniqueConstraint("item_id", "lab_id"), CheckConstraint("good >= 0 AND bad >= 0", name="ck_stock_nonnegative"))


class Asset(Base):
    __tablename__ = "assets"
    id: Mapped[int] = mapped_column(primary_key=True)
    item_id: Mapped[int] = mapped_column(ForeignKey("items.id"))
    lab_id: Mapped[int] = mapped_column(ForeignKey("labs.id"))
    barcode: Mapped[str] = mapped_column(String(80), unique=True)
    default_id: Mapped[str] = mapped_column(String(80))
    bill_number: Mapped[str] = mapped_column(String(80))
    state: Mapped[str] = mapped_column(String(40), default="AVAILABLE")


class Project(Base):
    __tablename__ = "projects"
    __table_args__ = {"sqlite_autoincrement": True}
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(160))
    description: Mapped[str] = mapped_column(Text, default="")
    lead_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    mentor_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)


class Member(Base):
    __tablename__ = "members"
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"), primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)


class Request(Base):
    __tablename__ = "requests"
    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    kind: Mapped[str] = mapped_column(String(20))
    purpose: Mapped[str] = mapped_column(String(30))
    duration_hours: Mapped[float]
    state: Mapped[str] = mapped_column(String(40), default="MENTOR_REVIEW")
    incharge_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    claimed_by: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    issued_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    due_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    due_version: Mapped[int] = mapped_column(Integer, default=0)
    acknowledged_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)


class RequestLine(Base):
    __tablename__ = "request_lines"
    id: Mapped[int] = mapped_column(primary_key=True)
    request_id: Mapped[int] = mapped_column(ForeignKey("requests.id"))
    item_id: Mapped[int] = mapped_column(ForeignKey("items.id"))
    lab_id: Mapped[int] = mapped_column(ForeignKey("labs.id"))
    quantity: Mapped[int] = mapped_column(Integer)
    asset_ids: Mapped[list] = mapped_column(JSON, default=list)
    __table_args__ = (CheckConstraint("quantity > 0", name="ck_line_quantity"), UniqueConstraint("request_id", "item_id", "lab_id"))


class Extension(Base):
    __tablename__ = "extensions"
    id: Mapped[int] = mapped_column(primary_key=True)
    request_id: Mapped[int] = mapped_column(ForeignKey("requests.id"))
    new_due_at: Mapped[datetime] = mapped_column(DateTime)
    old_due_at: Mapped[datetime] = mapped_column(DateTime)
    state: Mapped[str] = mapped_column(String(40), default="MENTOR_REVIEW")
    reason: Mapped[str] = mapped_column(Text)


class Reservation(Base):
    __tablename__ = "reservations"
    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    item_id: Mapped[int] = mapped_column(ForeignKey("items.id"))
    quantity: Mapped[int] = mapped_column(Integer)
    state: Mapped[str] = mapped_column(String(40), default="WAITING_FIFO")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    ready_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    __table_args__ = (CheckConstraint("quantity > 0", name="ck_reservation_quantity"), {"sqlite_autoincrement": True})


class Inspection(Base):
    __tablename__ = "inspections"
    id: Mapped[int] = mapped_column(primary_key=True)
    request_id: Mapped[int] = mapped_column(ForeignKey("requests.id"), unique=True)
    actor_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    details: Mapped[list] = mapped_column(JSON)
    remarks: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)


class Incident(Base):
    __tablename__ = "incidents"
    id: Mapped[int] = mapped_column(primary_key=True)
    request_id: Mapped[int] = mapped_column(ForeignKey("requests.id"))
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    actor_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    details: Mapped[dict] = mapped_column(JSON)
    attribution: Mapped[str] = mapped_column(String(30), default="NOT_DETERMINED")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)


class Evidence(Base):
    __tablename__ = "evidence"
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    request_id: Mapped[int] = mapped_column(ForeignKey("requests.id"))
    actor_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    storage_key: Mapped[str] = mapped_column(String(200))
    content_type: Mapped[str] = mapped_column(String(50))
    sha256: Mapped[str] = mapped_column(String(64))


class Audit(Base):
    __tablename__ = "audit"
    id: Mapped[int] = mapped_column(primary_key=True)
    request_id: Mapped[int | None] = mapped_column(ForeignKey("requests.id"), nullable=True)
    project_id: Mapped[int | None] = mapped_column(ForeignKey("projects.id"), nullable=True)
    actor_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    action: Mapped[str] = mapped_column(String(80))
    previous_state: Mapped[str | None] = mapped_column(String(40), nullable=True)
    new_state: Mapped[str | None] = mapped_column(String(40), nullable=True)
    details: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)


class Outbox(Base):
    __tablename__ = "outbox"
    id: Mapped[int] = mapped_column(primary_key=True)
    event_key: Mapped[str] = mapped_column(String(180), unique=True)
    payload: Mapped[dict] = mapped_column(JSON)
    dispatched: Mapped[bool] = mapped_column(Boolean, default=False)
    attempts: Mapped[int] = mapped_column(Integer, default=0)
    last_error: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)


class Idempotency(Base):
    __tablename__ = "idempotency"
    key: Mapped[str] = mapped_column(String(200), primary_key=True)
    fingerprint: Mapped[str] = mapped_column(String(64))
    result: Mapped[dict] = mapped_column(JSON)


class LocalDocument(Base):
    """Explicit offline projection adapter, not the production NoSQL store."""
    __tablename__ = "local_documents"
    id: Mapped[str] = mapped_column(String(200), primary_key=True)
    collection: Mapped[str] = mapped_column(String(80))
    payload: Mapped[dict] = mapped_column(JSON)


class Delivery(Base):
    __tablename__ = "deliveries"
    id: Mapped[str] = mapped_column(String(200), primary_key=True)
    state: Mapped[str] = mapped_column(String(30), default="PENDING")
    error: Mapped[str | None] = mapped_column(Text, nullable=True)


# Application-level append-only enforcement, in addition to exposing no audit
# mutation endpoint. Database administration is outside normal app workflows.
from sqlalchemy import event


@event.listens_for(Audit, "before_update")
@event.listens_for(Audit, "before_delete")
def immutable_audit(mapper, connection, target):
    raise ValueError("Raw audit records are append-only; add a compensating event")
