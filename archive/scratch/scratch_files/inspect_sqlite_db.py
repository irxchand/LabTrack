import sqlite3
import os

db_path = r".local\labtrack.db"
print("DB Exists:", os.path.exists(db_path))

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cur.fetchall()
    print("Tables in sqlite:", [t[0] for t in tables])
    for t in tables:
        tname = t[0]
        cur.execute(f"SELECT COUNT(*) FROM {tname};")
        count = cur.fetchone()[0]
        print(f"Table '{tname}': {count} rows")
