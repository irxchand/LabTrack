import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

print("=== 1. .env file ===")
if os.path.exists(".env"):
    with open(".env", "r", encoding="utf-8") as f:
        print(f.read())

print("\n=== 2. database/mysql/reporting.sql ===")
if os.path.exists(r"database\mysql\reporting.sql"):
    with open(r"database\mysql\reporting.sql", "r", encoding="utf-8") as f:
        print(f.read())

print("\n=== 3. database/mongo/analytics.js ===")
if os.path.exists(r"database\mongo\analytics.js"):
    with open(r"database\mongo\analytics.js", "r", encoding="utf-8") as f:
        print(f.read())

print("\n=== 4. src/backend/labtrack/db.py ===")
if os.path.exists(r"src\backend\labtrack\db.py"):
    with open(r"src\backend\labtrack\db.py", "r", encoding="utf-8") as f:
        print(f.read())
