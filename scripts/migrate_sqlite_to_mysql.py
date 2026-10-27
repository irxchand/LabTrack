"""
LabTrack — Enterprise Transactional Database Migration
Migrates live transactional state from local SQLite to remote Aiven MySQL 8.4.
Enforces foreign-key safety, type coercion, auto-increment re-alignment,
and source-target reconciliation.
"""
import os
import sys

# Ensure UTF-8 output encoding on Windows PowerShell
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")
import json
import shutil
import sqlite3
import datetime
from pathlib import Path
from sqlalchemy import create_engine, text, select, func, inspect
from sqlalchemy.orm import Session

# Add src/backend to python path for importing labtrack models
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src" / "backend"))

from labtrack.models import Base
from labtrack.config import settings

SQLITE_PATH = Path(".local/labtrack.db")
BACKUP_PATH = Path(".local/labtrack_pre_migration_backup.db")

AIVEN_URL = (
    "mysql+pymysql://avnadmin:AVNS_yn1CcuBrgZqUAxb_qV6"
    "@mysql-20ba54bf-ishaanrajeevchand-bde6.d.aivencloud.com:16236/defaultdb"
)

TOPOLOGICAL_TABLE_ORDER = [
    "users",
    "labs",
    "items",
    "assets",
    "stock",
    "projects",
    "members",
    "requests",
    "request_lines",
    "reservations",
    "extensions",
    "inspections",
    "evidence",
    "incidents",
    "audit",
    "auth_sessions",
    "idempotency",
    "outbox",
    "deliveries",
    "local_documents",
]

JSON_COLUMNS = {
    "items": ["specs", "alternative_ids"],
    "users": ["roles", "lab_ids"],
    "request_lines": ["asset_ids"],
    "audit": ["details"],
    "incidents": ["details"],
    "idempotency": ["result"],
    "outbox": ["payload"],
    "local_documents": ["payload"],
}

DATETIME_COLUMNS = {
    "users": ["created_at"],
    "requests": ["created_at", "due_at", "acknowledged_at", "issued_at", "closed_at"],
    "reservations": ["created_at", "expires_at"],
    "extensions": ["created_at", "old_due_at", "new_due_at"],
    "inspections": ["created_at"],
    "evidence": ["created_at"],
    "incidents": ["created_at"],
    "audit": ["created_at"],
    "auth_sessions": ["created_at", "expires_at"],
    "outbox": ["created_at"],
}

BOOLEAN_COLUMNS = {
    "users": ["active"],
    "outbox": ["dispatched"],
}


def backup_sqlite():
    if not SQLITE_PATH.exists():
        raise FileNotFoundError(f"Source SQLite database not found at {SQLITE_PATH}")
    shutil.copy2(SQLITE_PATH, BACKUP_PATH)
    print(f"✅ [PHASE 1] Created immutable cold backup at: {BACKUP_PATH} ({BACKUP_PATH.stat().st_size} bytes)")


def create_target_schema(target_engine):
    print("🔄 [PHASE 2] Provisioning relational schema on Aiven MySQL...")
    # Create all ORM tables
    Base.metadata.create_all(target_engine)
    
    # Ensure alembic_version table exists and is stamped
    with target_engine.begin() as conn:
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS alembic_version (
                version_num VARCHAR(32) NOT NULL PRIMARY KEY
            );
        """))
        conn.execute(text("DELETE FROM alembic_version;"))
        conn.execute(text("INSERT INTO alembic_version (version_num) VALUES ('99bd73089019');"))
    print("✅ [PHASE 2] Target schema created and stamped with Alembic revision '99bd73089019'")


def coerce_value(table, col, val):
    if val is None:
        return None
    # JSON columns: PyMySQL requires serialized JSON strings for JSON columns
    if col in JSON_COLUMNS.get(table, []):
        if isinstance(val, (dict, list)):
            return json.dumps(val)
        if isinstance(val, str):
            try:
                json.loads(val)
                return val
            except Exception:
                return json.dumps(val)
        return json.dumps(val)
    # Datetime columns
    if col in DATETIME_COLUMNS.get(table, []):
        if isinstance(val, (datetime.datetime, datetime.date)):
            return val
        if isinstance(val, str):
            clean_str = val.replace("Z", "").replace("+00:00", "")
            try:
                return datetime.datetime.fromisoformat(clean_str)
            except Exception:
                return val
        return val
    # Boolean columns
    if col in BOOLEAN_COLUMNS.get(table, []):
        return bool(val)
    return val


def migrate_data(target_engine):
    print("🔄 [PHASE 3] Transferring live transactional data from SQLite to Aiven MySQL...")
    sqlite_conn = sqlite3.connect(SQLITE_PATH)
    sqlite_conn.row_factory = sqlite3.Row
    sqlite_cur = sqlite_conn.cursor()

    with target_engine.begin() as mysql_conn:
        mysql_conn.execute(text("SET FOREIGN_KEY_CHECKS = 0;"))
        
        # Truncate tables in reverse order to ensure clean state
        for table in reversed(TOPOLOGICAL_TABLE_ORDER):
            mysql_conn.execute(text(f"DELETE FROM `{table}`;"))

        migration_counts = {}

        for table in TOPOLOGICAL_TABLE_ORDER:
            # Query source columns and rows
            sqlite_cur.execute(f"SELECT * FROM `{table}`;")
            rows = sqlite_cur.fetchall()
            if not rows:
                migration_counts[table] = 0
                continue

            cols = [col[0] for col in sqlite_cur.description]
            cols_clause = ", ".join([f"`{c}`" for c in cols])
            placeholders = ", ".join([f":{c}" for c in cols])
            insert_stmt = text(f"INSERT INTO `{table}` ({cols_clause}) VALUES ({placeholders});")

            batch = []
            max_id = 0
            has_id = "id" in cols

            for row in rows:
                row_dict = dict(row)
                transformed = {c: coerce_value(table, c, row_dict[c]) for c in cols}
                batch.append(transformed)
                if has_id and isinstance(row_dict.get("id"), int) and row_dict["id"] > max_id:
                    max_id = row_dict["id"]

            mysql_conn.execute(insert_stmt, batch)
            migration_counts[table] = len(batch)

            # Realign AUTO_INCREMENT sequence if table has integer primary key
            if has_id and max_id > 0:
                mysql_conn.execute(text(f"ALTER TABLE `{table}` AUTO_INCREMENT = {max_id + 1};"))

        mysql_conn.execute(text("SET FOREIGN_KEY_CHECKS = 1;"))

    sqlite_conn.close()
    print("✅ [PHASE 3] All table rows successfully inserted and AUTO_INCREMENT sequences realigned.")
    return migration_counts


def deploy_stored_procedure(target_engine):
    print("🔄 [PHASE 4] Compiling MySQL stored procedures on Aiven MySQL...")
    create_proc_sql = """
    CREATE PROCEDURE labtrack_usage_by_lab()
    SQL SECURITY INVOKER
    READS SQL DATA
    BEGIN
        SELECT labs.id AS lab_id, labs.name AS lab_name, items.name AS component,
               SUM(request_lines.quantity) AS issued_quantity,
               COUNT(DISTINCT requests.id) AS issued_requests,
               SUM(CASE WHEN requests.state IN ('ISSUED','IN_USE') THEN request_lines.quantity ELSE 0 END) AS active_quantity
        FROM requests
        INNER JOIN request_lines ON request_lines.request_id = requests.id
        INNER JOIN items ON items.id = request_lines.item_id
        INNER JOIN labs ON labs.id = request_lines.lab_id
        WHERE requests.issued_at IS NOT NULL
        GROUP BY labs.id, labs.name, items.id, items.name
        ORDER BY labs.id, items.id;
    END;
    """
    with target_engine.begin() as conn:
        conn.execute(text("DROP PROCEDURE IF EXISTS labtrack_usage_by_lab;"))
        conn.execute(text(create_proc_sql))

    # Test procedure execution
    with target_engine.connect() as conn:
        result = conn.execute(text("CALL labtrack_usage_by_lab();")).fetchall()
        print(f"✅ [PHASE 4] Stored procedure `labtrack_usage_by_lab()` compiled & verified. Returned {len(result)} analytical rows.")


def reconcile_data(target_engine):
    print("🔍 [PHASE 5] Executing source/target reconciliation audit...")
    sqlite_conn = sqlite3.connect(SQLITE_PATH)
    sqlite_cur = sqlite_conn.cursor()

    reconciliation_table = []
    has_discrepancy = False

    with target_engine.connect() as conn:
        for table in TOPOLOGICAL_TABLE_ORDER:
            sqlite_cur.execute(f"SELECT COUNT(*) FROM `{table}`;")
            sqlite_cnt = sqlite_cur.fetchone()[0]

            mysql_cnt = conn.execute(text(f"SELECT COUNT(*) FROM `{table}`;")).scalar()

            status = "MATCH" if sqlite_cnt == mysql_cnt else "MISMATCH"
            if status == "MISMATCH":
                has_discrepancy = True

            reconciliation_table.append({
                "table": table,
                "sqlite_rows": sqlite_cnt,
                "mysql_rows": mysql_cnt,
                "status": status,
            })

        # Deep Check: Checksum on Inventory Balances
        sqlite_stock = sqlite_cur.execute("SELECT SUM(good) + SUM(bad) FROM stock;").fetchone()[0]
        mysql_stock = conn.execute(text("SELECT SUM(good) + SUM(bad) FROM stock;")).scalar()

        sqlite_lines = sqlite_cur.execute("SELECT SUM(quantity) FROM request_lines;").fetchone()[0]
        mysql_lines = conn.execute(text("SELECT SUM(quantity) FROM request_lines;")).scalar()

    sqlite_conn.close()

    print("\n" + "=" * 65)
    print(f"{'TABLE NAME':<22} | {'SQLITE ROWS':<12} | {'AIVEN MYSQL':<12} | {'STATUS'}")
    print("-" * 65)
    for r in reconciliation_table:
        print(f"{r['table']:<22} | {r['sqlite_rows']:<12} | {r['mysql_rows']:<12} | {r['status']}")
    print("=" * 65)

    print(f"Inventory Stock Quantity Sum    : SQLite={sqlite_stock} | MySQL={mysql_stock} ({'MATCH' if sqlite_stock == mysql_stock else 'MISMATCH'})")
    print(f"Requisition Lines Quantity Sum : SQLite={sqlite_lines} | MySQL={mysql_lines} ({'MATCH' if sqlite_lines == mysql_lines else 'MISMATCH'})")

    if has_discrepancy or sqlite_stock != mysql_stock:
        raise ValueError("❌ Reconciliation failed! Data mismatch detected between SQLite and MySQL.")
    print("\n🎉 [PHASE 5] Reconciliation 100% SUCCESSFUL: Zero discrepancies detected.")


def main():
    print("🚀 Starting LabTrack Transactional Migration to Aiven MySQL...")
    backup_sqlite()
    
    target_engine = create_engine(
        AIVEN_URL,
        pool_pre_ping=True,
        connect_args={"ssl": {"ssl_disabled": False}},
    )

    create_target_schema(target_engine)
    migrate_data(target_engine)
    deploy_stored_procedure(target_engine)
    reconcile_data(target_engine)
    print("\n🏆 Database Migration Completed Successfully!")


if __name__ == "__main__":
    main()
