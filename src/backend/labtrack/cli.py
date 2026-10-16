"""Offline synthetic setup/export; does not grant a live inventory-admin role."""
import argparse
import csv
import json
import os
from pathlib import Path
import re
from sqlalchemy import select
from . import db
from .auth import password_hash
from .models import User, Lab, Item, Stock, Asset
from .worker import dispatch, expire_approved


def seed(path):
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    # Entire file is validated before opening the transaction.
    from pydantic import BaseModel, ConfigDict, Field
    class UserFixture(BaseModel):
        model_config = ConfigDict(extra="forbid")
        id: int
        name: str
        identifier: str
        email: str
        roles: list[str]
        lab_ids: list[int] = Field(default_factory=list)
    users = [UserFixture(**u) for u in data["users"]]
    if any(not u.email.endswith("@example.invalid") for u in users):
        raise ValueError("Synthetic fixture import only: use @example.invalid addresses")
    if any(int(s["good"]) < 0 or int(s.get("bad", 0)) < 0 for s in data["stock"]):
        raise ValueError("Fixture stock must be nonnegative")
    user_ids = {u.id for u in users}; lab_ids = {x["id"] for x in data["labs"]}; item_ids = {x["id"] for x in data["items"]}
    if len(user_ids) != len(users):
        raise ValueError("Duplicate users")
    for lab in data["labs"]:
        if lab["incharge_id"] not in user_ids:
            raise ValueError("Unknown lab faculty")
    for user in users:
        if set(user.roles) & {"MENTOR", "INCHARGE", "HOD"} and not re.fullmatch(r"T\d{5}", user.identifier):
            raise ValueError("Faculty identifier must be T plus five digits")
        if "ASSISTANT" in user.roles and not re.fullmatch(r"N\d{5}", user.identifier):
            raise ValueError("Staff identifier must be N plus five digits")
        if "INCHARGE" in user.roles and sum(lab["incharge_id"] == user.id for lab in data["labs"]) > 2:
            raise ValueError("Lab In-Charge cannot be assigned more than two labs")
    for row in data["stock"]+data["assets"]:
        if row["lab_id"] not in lab_ids or row["item_id"] not in item_ids:
            raise ValueError("Unknown fixture item/lab")
    password = os.environ.get("LABTRACK_DEMO_PASSWORD", "DemoOnly2026!")
    with db.Session() as s:
        db.begin_write(s)
        if s.scalar(select(User.id).limit(1)) is not None:
            raise ValueError("Database already has users; seed never overwrites existing truth")
        s.add_all(User(**u.model_dump(), password_hash=password_hash(password)) for u in users); s.flush()
        s.add_all(Lab(**x) for x in data["labs"]); s.flush()
        s.add_all(Item(**x) for x in data["items"]); s.flush()
        s.add_all(Stock(**x) for x in data["stock"])
        s.add_all(Asset(**x) for x in data["assets"])
        s.commit()
    return {"seeded": True, "users": len(users), "synthetic_only": True}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=["seed", "dispatch", "export-catalogue"])
    parser.add_argument("--file", default="fixtures/demo.json")
    args = parser.parse_args()
    if args.action == "seed":
        print(json.dumps(seed(args.file)))
    elif args.action == "dispatch":
        with db.Session() as s:
            db.begin_write(s); expired = expire_approved(s); result = dispatch(s); s.commit(); print(json.dumps({**result, "expired_approvals": expired}))
    else:
        from .service import catalogue
        with db.Session() as s, open(args.file, "w", newline="", encoding="utf-8") as file:
            writer = csv.DictWriter(file, fieldnames=["id", "name", "kind", "category", "available"])
            writer.writeheader()
            for item in catalogue(s):
                writer.writerow({key: item[key] for key in writer.fieldnames})


if __name__ == "__main__":
    main()
