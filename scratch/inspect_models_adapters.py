import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

print("=== 1. Checking models.py ===")
with open(r"src\backend\labtrack\models.py", "r", encoding="utf-8") as f:
    lines = f.readlines()
    print("Total lines:", len(lines))
    for line in lines:
        if line.startswith("class ") or "__tablename__" in line:
            print(line.strip())

print("\n=== 2. Checking adapters.py (Mongo & Stores) ===")
with open(r"src\backend\labtrack\adapters.py", "r", encoding="utf-8") as f:
    text = f.read()
    print("Total length:", len(text))
    # print class and def lines
    for line in text.split("\n"):
        if line.startswith("class ") or line.startswith("def ") or "mongo" in line.lower():
            print(line.strip())
