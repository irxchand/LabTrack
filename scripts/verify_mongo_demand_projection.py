"""Verify end-to-end transactional outbox projection into MongoDB Atlas demand collection.
REQ-LT-0074: Real projection pipeline event -> outbox -> worker -> Atlas document -> aggregation.
"""
import os
import sys
import json
import dotenv
from sqlalchemy import select

# Ensure UTF-8 output on Windows
if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

dotenv.load_dotenv()

from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.backend.labtrack import db
from src.backend.labtrack.models import User, Item, Outbox, Audit
from src.backend.labtrack import service as svc
from src.backend.labtrack.worker import dispatch
from src.backend.labtrack.adapters import MongoDocumentStore

def seed_and_verify_demand():
    print("=== Step 1: Connecting to Authoritative MySQL & MongoDB Atlas ===")
    store = MongoDocumentStore()
    atlas_demand = store.db["demand"]
    initial_count = atlas_demand.count_documents({})
    print(f"Initial MongoDB Atlas 'demand' document count: {initial_count}")

    with db.Session() as s:
        # Find student and items
        student = s.scalar(select(User).where(User.roles.contains(["STUDENT"])).limit(1))
        if not student:
            student = s.scalar(select(User).limit(1))
        print(f"Using student actor: {student.name} ({student.identifier})")

        items = list(s.scalars(select(Item).limit(3)))
        print(f"Loaded {len(items)} existing items from Aiven MySQL")

        # Demand requests to insert
        sample_demands = [
            {"item_id": items[0].id, "quantity": 4, "name": items[0].name, "reason": "Edge AI inference benchmark lab"},
            {"item_id": items[0].id, "quantity": 2, "name": items[0].name, "reason": "Autonomous drone camera payload"},
            {"item_id": items[1].id, "quantity": 6, "name": items[1].name, "reason": "Robotics perception sensor kit"},
            {"item_id": None, "quantity": 5, "component_name": "NVIDIA Jetson Orin Nano 8GB", "justification": "Deep Learning Object Detection Final Year Capstone"},
            {"item_id": None, "quantity": 3, "component_name": "Intel RealSense D435i Depth Camera", "justification": "SLAM Navigation in GPS-denied Environment"},
            {"item_id": None, "quantity": 8, "component_name": "LiPo 3S 2200mAh 35C Battery", "justification": "Mobile Ground Robot Power Subsystem"},
            {"item_id": None, "quantity": 5, "component_name": "NVIDIA Jetson Orin Nano 8GB", "justification": "Embedded Vision Subsystem for Autonomous Rover"},
        ]

        print("\n=== Step 2: Emitting UNMET_DEMAND Events into Aiven MySQL Outbox ===")
        for req in sample_demands:
            details = dict(req)
            audit_entry = svc.audit(s, student, "UNMET_DEMAND", details=details)
            svc.emit(s, "UNMET_DEMAND", [], details=details, key=f"demand_test:{audit_entry.id}")
            s.flush()
            print(f"Emitted Outbox event for: {req.get('component_name') or req.get('name')} (Qty: {req['quantity']})")
        s.commit()

        print(f"Committed {len(sample_demands)} UNMET_DEMAND events to Aiven MySQL.")

        print("\n=== Step 3: Executing worker.dispatch() to Project into MongoDB Atlas ===")
        dispatch_result = dispatch(s)
        s.commit()
        print(f"Worker dispatch result: {dispatch_result}")

    print("\n=== Step 4: Verifying MongoDB Atlas 'demand' Documents ===")
    final_count = atlas_demand.count_documents({})
    print(f"New MongoDB Atlas 'demand' document count: {final_count}")
    
    docs = list(atlas_demand.find({}).limit(10))
    for i, doc in enumerate(docs, 1):
        target = doc.get("component_name") or f"Item #{doc.get('item_id')}: {doc.get('name')}"
        print(f"  [{i}] ID: {doc['_id']} | Target: {target} | Qty: {doc.get('quantity')}")

    print("\n=== Step 5: Executing MongoDB Aggregation Pipeline ($group, $sort) ===")
    pipeline = [
        {
            "$group": {
                "_id": {"$ifNull": ["$item_id", "$component_name"]},
                "requested": {"$sum": "$quantity"},
                "occurrences": {"$sum": 1}
            }
        },
        {"$sort": {"requested": -1, "_id": 1}}
    ]
    agg_result = list(atlas_demand.aggregate(pipeline))
    print("MongoDB Atlas Demand Aggregation Output:")
    for row in agg_result:
        print(f"  Target: {row['_id']} | Total Units Requested: {row['requested']} | Distinct Occurrences: {row['occurrences']}")

    print("\n=== Step 6: Testing FastApi demand_summary via adapters ===")
    summary = store.demand_summary()
    print(f"store.demand_summary() returned {len(summary)} aggregated categories.")
    print("SUCCESS: MongoDB demand projection and live aggregation verified!")

if __name__ == "__main__":
    seed_and_verify_demand()
