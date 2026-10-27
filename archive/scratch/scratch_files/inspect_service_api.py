import inspect
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.abspath("src/backend"))

import labtrack.service as svc
import labtrack.api as api
import labtrack.models as models
import labtrack.adapters as adapters
import labtrack.auth as auth

print("=== 1. SERVICE FUNCTIONS ===")
funcs = [name for name, obj in inspect.getmembers(svc, inspect.isfunction)]
print("Total service functions:", len(funcs))
for f in funcs:
    print(f"  svc.{f}")

print("\n=== 2. API ROUTES ===")
for route in api.app.routes:
    methods = getattr(route, 'methods', None)
    path = getattr(route, 'path', None)
    endpoint = getattr(route, 'endpoint', None)
    name = endpoint.__name__ if endpoint else None
    if methods:
        print(f"  {','.join(methods):<8s} {path:<35s} -> {name}")
