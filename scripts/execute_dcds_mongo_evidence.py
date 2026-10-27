"""Execute and capture complete DCDS Unit 3 MongoDB Atlas evidence.
Includes: Document modeling, CRUD, Queries with Projections & Filters, Aggregations, Indexing/Explain, Projection Pipeline & Idempotency.
"""
import os
import sys
from pathlib import Path
import json
import dotenv
from bson import json_util
import pymongo

# Set UTF-8 encoding
if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

dotenv.load_dotenv()
mongo_url = os.getenv("LABTRACK_MONGO_URL")
mongo_db_name = os.getenv("LABTRACK_MONGO_DATABASE", "labtrack")

if not mongo_url:
    print("ERROR: LABTRACK_MONGO_URL not set in .env")
    sys.exit(1)

client = pymongo.MongoClient(mongo_url, serverSelectionTimeoutMS=5000)
db = client[mongo_db_name]

mongo_evidence = {}

def record_step(title, data):
    print(f"\n--- {title} ---")
    if isinstance(data, list):
        print(f"Result count: {len(data)}")
        for item in data[:3]:
            print(" ", json_util.dumps(item))
        if len(data) > 3:
            print(f"  ... and {len(data) - 3} more items")
    elif isinstance(data, dict):
        print("  Summary:", {k: data[k] for k in list(data.keys())[:5]})
    mongo_evidence[title] = json.loads(json_util.dumps(data))

def main():
    print("=====================================================================")
    print("LABTRACK // DCDS UNIT 3 MONGODB ATLAS EXECUTABLE EVIDENCE RUNNER")
    print("Atlas Cluster:", mongo_url.split("@")[-1].split("/")[0])
    print("Database:", mongo_db_name)
    print("=====================================================================")

    # 1. Document Modeling Inspection
    catalog_sample = db.component_catalog_documents.find_one()
    notification_sample = db.notifications.find_one()
    demand_sample = db.demand.find_one()

    record_step("MODELING_CATALOG_DOCUMENT", catalog_sample or {})
    record_step("MODELING_NOTIFICATION_DOCUMENT", notification_sample or {})
    record_step("MODELING_DEMAND_DOCUMENT", demand_sample or {})

    # 2. CRUD Operations on Safe Test Sub-Namespace
    test_coll = db["dcds_crud_sandbox"]
    test_coll.drop() # clean start

    # 2a. Insert One & Many
    ins_one = test_coll.insert_one({
        "_id": "test:comp:001",
        "name": "Raspberry Pi 5 8GB",
        "category": "Single Board Computers",
        "stock_projection": 12,
        "specs": {"cpu": "Broadcom BCM2712 Quad-core ARM Cortex-A76", "ram_gb": 8, "pcie": "Gen 2.0 x1"},
        "active": True
    })
    ins_many = test_coll.insert_many([
        {
            "_id": "test:comp:002",
            "name": "Arduino GIGA R1 WiFi",
            "category": "Microcontrollers",
            "stock_projection": 5,
            "specs": {"mcu": "STM32H747XI dual core Cortex-M7+M4", "wireless": "Wi-Fi + BLE"},
            "active": True
        },
        {
            "_id": "test:comp:003",
            "name": "LiPo 4S 5000mAh Battery",
            "category": "Power Systems",
            "stock_projection": 2,
            "specs": {"voltage": 14.8, "capacity_mah": 5000, "discharge_c": 50},
            "active": False
        }
    ])
    record_step("CRUD_1_INSERT", {"inserted_one": ins_one.inserted_id, "inserted_many": ins_many.inserted_ids})

    # 2b. Find with Projection & Filter
    find_docs = list(test_coll.find(
        {"active": True, "stock_projection": {"$gte": 5}},
        {"name": 1, "category": 1, "specs.ram_gb": 1, "stock_projection": 1}
    ))
    record_step("CRUD_2_FIND_PROJECTION", find_docs)

    # 2c. Update with Operators ($set, $inc)
    upd_res = test_coll.update_one(
        {"_id": "test:comp:001"},
        {"$inc": {"stock_projection": -1}, "$set": {"last_verified": "2026-10-28T03:50:00Z"}}
    )
    upd_doc = test_coll.find_one({"_id": "test:comp:001"})
    record_step("CRUD_3_UPDATE", {"matched": upd_res.matched_count, "modified": upd_res.modified_count, "updated_doc": upd_doc})

    # 2d. Upsert
    upsert_res = test_coll.update_one(
        {"_id": "test:comp:004"},
        {"$set": {"name": "ESP32-S3 WROOM CAM", "category": "Sensors", "stock_projection": 15}},
        upsert=True
    )
    record_step("CRUD_4_UPSERT", {"upserted_id": upsert_res.upserted_id})

    # 2e. Delete
    del_res = test_coll.delete_one({"_id": "test:comp:004"})
    record_step("CRUD_5_DELETE", {"deleted_count": del_res.deleted_count})

    # Clean sandbox
    test_coll.drop()

    # 3. ADVANCED QUERIES with Comparison & Logical Filtering on Real Demand Collection
    query_complex = list(db.demand.find(
        {
            "$or": [
                {"quantity": {"$gte": 5}},
                {"component_name": {"$regex": "Jetson|Camera", "$options": "i"}}
            ]
        },
        {"_id": 1, "component_name": 1, "name": 1, "quantity": 1, "reason": 1, "justification": 1}
    ).sort("quantity", pymongo.DESCENDING).limit(5))
    record_step("ADVANCED_QUERY_OR_REGEX_SORT", query_complex)

    # 4. AGGREGATION PIPELINE ($match, $group, $sort, $project) on Atlas demand
    pipeline = [
        # Stage 1: Filter out zero or negative quantities if any
        {"$match": {"quantity": {"$gt": 0}}},
        # Stage 2: Group by hardware target
        {
            "$group": {
                "_id": {"$ifNull": ["$component_name", "$name"]},
                "total_requested_units": {"$sum": "$quantity"},
                "request_frequency": {"$sum": 1},
                "max_single_batch": {"$max": "$quantity"},
                "avg_units_per_req": {"$avg": "$quantity"}
            }
        },
        # Stage 3: Project computed fields
        {
            "$project": {
                "_id": 0,
                "hardware_component": "$_id",
                "total_requested_units": 1,
                "request_frequency": 1,
                "max_single_batch": 1,
                "avg_units_per_req": {"$round": ["$avg_units_per_req", 2]}
            }
        },
        # Stage 4: Sort by total units descending
        {"$sort": {"total_requested_units": -1, "hardware_component": 1}}
    ]
    agg_result = list(db.demand.aggregate(pipeline))
    record_step("AGGREGATION_PIPELINE_DEMAND", agg_result)

    # 5. INDEXING & EXPLAIN PLAN ON ATLAS NOTIFICATIONS
    # Ensure compound index on notifications: {user_id: 1, event_id: -1}
    db.notifications.create_index([("user_id", pymongo.ASCENDING), ("event_id", pymongo.DESCENDING)], name="idx_user_event")
    index_list = list(db.notifications.list_indexes())
    record_step("INDEX_NOTIFICATIONS_LIST", index_list)

    # Explain plan for indexed query
    explain_query = db.command(
        "explain",
        {
            "find": "notifications",
            "filter": {"user_id": 1},
            "sort": {"event_id": -1}
        },
        verbosity="executionStats"
    )
    
    stage = explain_query.get("executionStats", {}).get("executionStages", {})
    record_step("EXPLAIN_NOTIFICATIONS_INDEX_SCAN", {
        "stage": stage.get("stage"),
        "indexName": stage.get("indexName") or stage.get("inputStage", {}).get("indexName"),
        "totalDocsExamined": explain_query.get("executionStats", {}).get("totalDocsExamined"),
        "nReturned": explain_query.get("executionStats", {}).get("nReturned"),
        "executionTimeMillis": explain_query.get("executionStats", {}).get("executionTimeMillis")
    })

    # Save output artifacts
    output_path = Path(__file__).resolve().parent.parent / "database" / "mongo" / "execution_evidence.json"
    output_path.write_text(json.dumps(mongo_evidence, indent=2, default=str), encoding="utf-8")
    print(f"\nAll MongoDB Atlas execution evidence saved to {output_path}")

if __name__ == "__main__":
    main()
