"""Execute and capture complete DCDS Unit 3 MySQL evidence against live Aiven Cloud MySQL.
Includes: CRUD, Joins, Subqueries, Analytics, Stored Procedure, Views, Indexing/EXPLAIN, Transactions.
"""
import os
import sys
from pathlib import Path
import json
import dotenv
from sqlalchemy import create_engine, text

# Set UTF-8 encoding
if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

dotenv.load_dotenv()
db_url = os.getenv("LABTRACK_DATABASE_URL")
if not db_url:
    print("ERROR: LABTRACK_DATABASE_URL not set in .env")
    sys.exit(1)

engine = create_engine(db_url, pool_pre_ping=True)

evidence_results = {}

def run_query(title, sql_text, params=None):
    print(f"\n--- {title} ---")
    print(f"SQL:\n{sql_text.strip()}\n")
    with engine.connect() as conn:
        result = conn.execute(text(sql_text), params or {})
        if result.returns_rows:
            columns = list(result.keys())
            rows = [dict(zip(columns, row)) for row in result.fetchall()]
            print(f"Returned {len(rows)} rows:")
            for r in rows[:5]:
                print(" ", r)
            if len(rows) > 5:
                print(f"  ... and {len(rows) - 5} more rows")
            evidence_results[title] = {"sql": sql_text, "columns": columns, "rows": rows, "count": len(rows)}
            return rows
        else:
            conn.commit()
            print(f"Executed successfully (rowcount: {result.rowcount})")
            evidence_results[title] = {"sql": sql_text, "affected": result.rowcount}
            return result.rowcount

def main():
    print("=====================================================================")
    print("LABTRACK // DCDS UNIT 3 MYSQL EXECUTABLE EVIDENCE RUNNER")
    print("Endpoint:", db_url.split("@")[-1])
    print("=====================================================================")

    # 1. Compile Views
    views_path = Path(__file__).resolve().parent.parent / "database" / "mysql" / "views.sql"
    if views_path.exists():
        print(f"\nCompiling views from {views_path}...")
        with engine.connect() as conn:
            statements = views_path.read_text(encoding="utf-8").split(";")
            for stmt in statements:
                stmt_clean = stmt.strip()
                if stmt_clean:
                    conn.execute(text(stmt_clean))
            conn.commit()
        print("Views compiled successfully!")

    # 2. CRUD: Insert, Select, Update, Delete on reservations
    run_query(
        "CRUD_1_INSERT",
        """
        INSERT INTO reservations (project_id, item_id, quantity, state, created_at)
        VALUES (1, 1, 3, 'WAITING_FIFO', NOW());
        """
    )
    res = run_query(
        "CRUD_2_SELECT_FILTER_SORT",
        """
        SELECT id, project_id, item_id, quantity, state, created_at
        FROM reservations
        WHERE state = 'WAITING_FIFO'
        ORDER BY created_at DESC
        LIMIT 5;
        """
    )
    last_id = res[0]["id"] if res else 1

    run_query(
        "CRUD_3_UPDATE",
        f"""
        UPDATE reservations
        SET quantity = 4, state = 'ALLOCATED'
        WHERE id = {last_id};
        """
    )

    run_query(
        "CRUD_4_DELETE",
        f"""
        DELETE FROM reservations
        WHERE id = {last_id};
        """
    )

    # 3. JOINS
    run_query(
        "JOIN_1_INNER_JOIN",
        """
        SELECT 
            rl.id AS line_id,
            r.id AS request_id,
            r.state AS request_state,
            i.name AS item_name,
            l.name AS lab_name,
            rl.quantity
        FROM request_lines rl
        INNER JOIN requests r ON r.id = rl.request_id
        INNER JOIN items i ON i.id = rl.item_id
        INNER JOIN labs l ON l.id = rl.lab_id
        ORDER BY rl.id ASC
        LIMIT 5;
        """
    )

    run_query(
        "JOIN_2_LEFT_OUTER_JOIN",
        """
        SELECT 
            l.id AS lab_id,
            l.name AS lab_name,
            COUNT(s.item_id) AS stocked_item_count,
            COALESCE(SUM(s.good), 0) AS total_good_units
        FROM labs l
        LEFT JOIN stock s ON s.lab_id = l.id
        GROUP BY l.id, l.name
        ORDER BY stocked_item_count DESC
        LIMIT 5;
        """
    )

    run_query(
        "JOIN_3_FOUR_WAY_JOIN",
        """
        SELECT 
            r.id AS request_id,
            p.name AS project_name,
            u.name AS lead_student,
            i.name AS hardware_component,
            l.lab_code AS lab_location,
            rl.quantity AS allocated_quantity,
            r.state AS approval_status
        FROM requests r
        INNER JOIN projects p ON p.id = r.project_id
        INNER JOIN users u ON u.id = p.lead_id
        INNER JOIN request_lines rl ON rl.request_id = r.id
        INNER JOIN items i ON i.id = rl.item_id
        INNER JOIN labs l ON l.id = rl.lab_id
        ORDER BY r.id DESC
        LIMIT 5;
        """
    )

    # Ensure realistic active loan state exists for subqueries, procedure, and view
    with engine.begin() as conn:
        conn.execute(text("""
            UPDATE requests 
            SET state = 'ISSUED', 
                issued_at = NOW(), 
                due_at = DATE_ADD(NOW(), INTERVAL 48 HOUR)
            WHERE state = 'APPROVED' 
            LIMIT 2;
        """))

    # 4. SUBQUERIES
    run_query(
        "SUBQUERY_1_NESTED_IN",
        """
        SELECT id, name, lab_code, branch
        FROM labs
        WHERE id IN (
            SELECT DISTINCT rl.lab_id 
            FROM request_lines rl
            INNER JOIN requests r ON r.id = rl.request_id
            WHERE r.state IN ('ISSUED', 'IN_USE')
        )
        ORDER BY id ASC;
        """
    )

    run_query(
        "SUBQUERY_2_CORRELATED",
        """
        SELECT 
            s.id AS stock_id,
            i.name AS item_name,
            l.name AS lab_name,
            s.good AS available_units
        FROM stock s
        INNER JOIN items i ON i.id = s.item_id
        INNER JOIN labs l ON l.id = s.lab_id
        WHERE s.good < (
            SELECT AVG(s2.good) 
            FROM stock s2 
            WHERE s2.item_id = s.item_id
        )
        ORDER BY s.good ASC
        LIMIT 5;
        """
    )

    run_query(
        "SUBQUERY_3_DERIVED_TABLE",
        """
        SELECT 
            dt.category,
            COUNT(dt.id) AS total_items,
            ROUND(AVG(dt.total_stock), 1) AS avg_stock_per_item
        FROM (
            SELECT 
                i.id,
                i.category,
                COALESCE(SUM(s.good), 0) AS total_stock
            FROM items i
            LEFT JOIN stock s ON s.item_id = i.id
            GROUP BY i.id, i.category
        ) AS dt
        GROUP BY dt.category
        ORDER BY total_items DESC;
        """
    )

    # 5. ANALYTICS: SUM, COUNT, AVG, GROUP BY, HAVING
    run_query(
        "ANALYTICS_AGGREGATION_HAVING",
        """
        SELECT 
            i.category,
            COUNT(DISTINCT i.id) AS unique_components,
            SUM(s.good) AS total_good_stock,
            SUM(s.bad) AS total_defective_stock,
            ROUND(AVG(s.good), 2) AS avg_stock_level
        FROM items i
        INNER JOIN stock s ON s.item_id = i.id
        GROUP BY i.category
        HAVING SUM(s.good) > 20
        ORDER BY total_good_stock DESC;
        """
    )

    # 6. STORED PROCEDURE
    run_query(
        "STORED_PROCEDURE_CALL",
        """
        CALL labtrack_usage_by_lab();
        """
    )

    # 7. VIEWS
    run_query(
        "VIEW_1_ACTIVE_LOANS",
        """
        SELECT * FROM v_active_loans_summary LIMIT 5;
        """
    )

    run_query(
        "VIEW_2_INVENTORY_HEALTH",
        """
        SELECT * FROM v_lab_inventory_health ORDER BY operational_health_pct ASC, total_good_stock DESC LIMIT 5;
        """
    )

    # 8. INDEXING & EXPLAIN PLANS
    run_query(
        "EXPLAIN_PRIMARY_KEY_LOOKUP",
        """
        EXPLAIN FORMAT=TREE
        SELECT * FROM users WHERE id = 1;
        """
    )

    run_query(
        "EXPLAIN_UNIQUE_INDEX_IDENTIFIER",
        """
        EXPLAIN FORMAT=TREE
        SELECT * FROM users WHERE identifier = 'DEMO-STU-001';
        """
    )

    run_query(
        "EXPLAIN_COMPOSITE_INDEX_STOCK",
        """
        EXPLAIN FORMAT=TREE
        SELECT * FROM stock WHERE item_id = 1 AND lab_id = 1;
        """
    )

    # 9. TRANSACTIONS & CONCURRENCY
    print("\n--- TRANSACTION_1_COMMIT_ROW_LOCK ---")
    with engine.connect() as conn:
        trans = conn.begin()
        try:
            # Row level lock on stock using FOR UPDATE
            stock_row = conn.execute(
                text("SELECT id, item_id, lab_id, good FROM stock WHERE item_id = 1 AND lab_id = 1 FOR UPDATE;")
            ).fetchone()
            curr_good = stock_row.good
            print(f"Current good stock for item 1, lab 1 before transaction: {curr_good}")
            
            # Decrement 1 unit (simulating stock reservation on issue)
            conn.execute(
                text("UPDATE stock SET good = good - 1 WHERE id = :id;"),
                {"id": stock_row.id}
            )
            trans.commit()
            print("Transaction committed successfully with row-level lock.")
        except Exception as e:
            trans.rollback()
            print("Transaction failed:", e)

    with engine.connect() as conn:
        verify_stock = conn.execute(
            text("SELECT good FROM stock WHERE item_id = 1 AND lab_id = 1;")
        ).scalar()
        print(f"Verified stock after commit: {verify_stock} (expected {curr_good - 1})")
    
    # Restore stock unit for demo balance
    with engine.begin() as conn:
        conn.execute(
            text("UPDATE stock SET good = good + 1 WHERE item_id = 1 AND lab_id = 1;")
        )

    print("\n--- TRANSACTION_2_ROLLBACK_INTEGRITY ---")
    with engine.connect() as conn:
        stock_before = conn.execute(
            text("SELECT good FROM stock WHERE item_id = 1 AND lab_id = 1;")
        ).scalar()
    
    with engine.connect() as conn:
        trans = conn.begin()
        try:
            # Simulate reservation deduction
            conn.execute(
                text("UPDATE stock SET good = good - 5 WHERE item_id = 1 AND lab_id = 1;")
            )
            # Simulated error (e.g. invalid request_line or negative stock constraint)
            print("Simulating integrity exception during multi-step reservation...")
            raise ValueError("SIMULATED_INTEGRITY_VIOLATION: Loan exceeds authorized allocation")
            trans.commit()
        except Exception as e:
            trans.rollback()
            print(f"Caught exception: {e} -> Rolled back transaction successfully.")

    with engine.connect() as conn:
        stock_after = conn.execute(
            text("SELECT good FROM stock WHERE item_id = 1 AND lab_id = 1;")
        ).scalar()
        print(f"Stock before rollback attempt: {stock_before}")
        print(f"Stock after rollback: {stock_after}")
        assert stock_before == stock_after, "Stock integrity violated!"
        print("VERIFIED: Rollback cleanly preserved inventory integrity!")

    # Save output artifacts
    output_path = Path(__file__).resolve().parent.parent / "database" / "mysql" / "execution_evidence.json"
    output_path.write_text(json.dumps(evidence_results, indent=2, default=str), encoding="utf-8")
    print(f"\nAll MySQL execution evidence saved to {output_path}")

if __name__ == "__main__":
    main()
