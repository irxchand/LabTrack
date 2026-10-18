from datetime import datetime
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field, field_validator


class Input(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class Login(Input):
    identifier: str = Field(min_length=1, max_length=40)
    password: str = Field(min_length=1, max_length=200)


class ProjectInput(Input):
    name: str = Field(min_length=1, max_length=160)
    description: str = Field(default="", max_length=4000)
    mentor_id: int = Field(gt=0)
    member_ids: list[int] = Field(default_factory=list, max_length=100)


class Quantity(Input):
    item_id: int = Field(gt=0)
    quantity: int = Field(gt=0, strict=True, le=2_147_483_647)


class PlanInput(Input):
    lines: list[Quantity] = Field(min_length=1, max_length=100)


class RequestInput(PlanInput):
    project_id: int = Field(gt=0)
    duration_hours: float = Field(gt=0, allow_inf_nan=False)
    purpose: Literal["BORROW", "USE_IN_COLLEGE", "TAKE_OUTSIDE"] = "BORROW"

    @field_validator("duration_hours")
    @classmethod
    def supported_timestamp(cls, value):
        from datetime import timedelta
        from .models import utcnow
        try:
            utcnow()+timedelta(hours=value)
        except OverflowError:
            raise ValueError("Duration is outside the supported timestamp storage range")
        return value


class DecisionInput(Input):
    decision: Literal["APPROVE", "REJECT"]
    remarks: str = Field(default="", max_length=4000)


class IssueInput(Input):
    assignments: dict[int, list[str]] = Field(default_factory=dict)
    physical_handover_confirmed: Literal[True]


class ReturnLine(Input):
    line_id: int = Field(gt=0)
    good: int = Field(default=0, ge=0, strict=True)
    bad: int = Field(default=0, ge=0, strict=True)
    missing: int = Field(default=0, ge=0, strict=True)
    functional: Literal["PASS", "FAIL", "NOT_TESTED"] = "NOT_TESTED"
    asset_conditions: dict[str, Literal["GOOD", "DAMAGED", "DEFECTIVE", "LOST"]] = Field(default_factory=dict)
    missing_parts: str = Field(default="", max_length=2000)
    evidence_ids: list[str] = Field(default_factory=list, max_length=30)


class ReturnInput(Input):
    lines: list[ReturnLine] = Field(min_length=1, max_length=100)
    remarks: str = Field(default="", max_length=4000)


class ExtensionInput(Input):
    new_due_at: datetime
    reason: str = Field(min_length=1, max_length=2000)

    @field_validator("new_due_at")
    @classmethod
    def aware(cls, value):
        if value.tzinfo is None:
            raise ValueError("Timestamp must include timezone")
        return value


class ReservationInput(Quantity):
    project_id: int = Field(gt=0)


class UnstockedDemandInput(Input):
    component_name: str = Field(min_length=1, max_length=160)
    quantity: int = Field(gt=0, strict=True, le=2_147_483_647)


class ErrorDetail(BaseModel):
    code: str
    message: str
    decision: str | None = None


class ErrorEnvelope(BaseModel):
    error: ErrorDetail


class UserView(BaseModel):
    id: int
    name: str
    identifier: str
    email: str | None = None
    roles: list[str]
    lab_ids: list[int]
    department: str | None = None
    designation: str | None = None
    batch: int | None = None
    year_of_study: int | None = None
    branch: str | None = None
    roll_number: str | None = None
    phone: str | None = None


class LoginView(BaseModel):
    token: str
    user: UserView


class ProjectView(BaseModel):
    id: int
    project_code: str
    name: str
    description: str
    lead_id: int
    mentor_id: int
    member_ids: list[int]


class AssetView(BaseModel):
    barcode: str
    state: str
    default_id: str
    bill_number: str


class LabStockView(BaseModel):
    lab_id: int
    lab_name: str
    good: int
    bad: int
    total: int
    branch: str | None = None
    assets: list[AssetView] = Field(default_factory=list)


class ItemView(BaseModel):
    id: int
    name: str
    kind: str
    category: str
    description: str
    brand: str
    specs: dict
    labs: list[LabStockView]
    available: int
    image_url: str | None = None
    cost_tier: str | None = None


class LineView(BaseModel):
    id: int
    item_id: int
    item_name: str
    lab_id: int
    lab_name: str
    quantity: int
    barcodes: list[str]


class TimelineView(BaseModel):
    id: int
    actor: str
    action: str
    previous_state: str | None
    new_state: str | None
    details: dict
    created_at: str


class ExtensionView(BaseModel):
    id: int
    state: str
    old_due_at: str
    new_due_at: str
    reason: str


class RequestView(BaseModel):
    id: int
    project_id: int
    project_name: str
    project_code: str
    mentor_id: int
    lead_id: int
    incharge_id: int | None
    claimed_by: int | None
    kind: str
    purpose: str
    state: str
    duration_hours: float
    due_at: str | None
    due_version: int
    acknowledged_at: str | None
    lines: list[LineView]
    timeline: list[TimelineView]
    extensions: list[ExtensionView]


class ReservationView(BaseModel):
    id: int
    project_id: int
    item_id: int
    item_name: str
    quantity: int
    state: str
    created_at: str


class NotificationView(BaseModel):
    event_id: int
    user_id: int
    event: str
    request_id: int | None
    details: dict
    link: str
    created_at: str
