# Run LabTrack

The current application is a synthetic-data web prototype. Keep the master context and execution decision boundaries visible; blocked policies are not silently implemented.

## Local Windows profile

From the repository root:

```powershell
python -m venv .venv
./.venv/Scripts/python.exe -m pip install -e '.[test]'
./.venv/Scripts/alembic.exe upgrade head
./.venv/Scripts/python.exe -m labtrack.cli seed
./.venv/Scripts/python.exe scripts/export_openapi.py
cd src/frontend
npm ci
npm run types
npm run build
cd ../..
./.venv/Scripts/python.exe -m uvicorn labtrack.api:app --host 127.0.0.1 --port 8000
```

Open http://127.0.0.1:8000. API documentation is at `/docs`. Local profile uses SQLite, local document projections, mail files and evidence files under ignored `.local/`. It does not claim MySQL/MongoDB integration validation. Alternatively run `npm run dev` in `src/frontend`; Vite uses port 5174 and proxies the backend.

Synthetic credentials: `DEMO-STU-001` (lead), `DEMO-STU-002` (other student), `T00001` (mentor), `T00002` (In-Charge), `T00003` (HoD), `N00001`/`N00002` (Assistants), `DEMO-ADMIN` (technical admin). Default seed password is `DemoOnly2026!`; set `LABTRACK_DEMO_PASSWORD` before initial seed to replace it. No real institutional accounts are used. Seed refuses to overwrite a populated database.

Dispatch committed events independently:

```powershell
./.venv/Scripts/python.exe -m labtrack.cli dispatch
```

Local email previews are JSON files under `.local/mail/`; no external email is sent. For continuous outbox delivery, run `python -m labtrack.run_worker` in a separate process. Do not run secondary environments as writers/workers. Automated calendar reminders are intentionally not activated while calendar policy is unresolved.

## MySQL + Mongo container profile

Requires a working Docker Linux engine. Set `LABTRACK_SQL_PASSWORD` and `LABTRACK_SQL_ROOT_PASSWORD` in an ignored `.env` (URL-safe values or properly URL-encoded credentials). Then:

```powershell
docker compose up --build -d
docker compose exec -e LABTRACK_DEMO_PASSWORD=your-demo-password api python -m labtrack.cli seed
```

The API serves the built frontend. MySQL 8.4 owns business truth and outbox. MongoDB receives document projections. Database ports bind loopback for local integration checks. Cloud ingress/TLS, backups, IAM, secrets and storage must be configured for a real environment; this file does not claim deployed cloud resources. Deploy the same image to AWS primary, isolated Azure staging and GCP read-only analytics only after accounts/resources are available. `LABTRACK_READ_ONLY=true` forbids domain writes and dispatcher startup on secondary environments; controlled promotion/fencing remains an operational requirement.

The reporting routine is `database/mysql/reporting.sql`; install with a MySQL client and call `CALL labtrack_usage_by_lab();`. The Mongo aggregation examples are `database/mongo/analytics.js`. API `/api/reports/usage` demonstrates real joins/grouping in both SQL profiles.

## Validation

```powershell
./.venv/Scripts/python.exe -m pytest
./.venv/Scripts/python.exe scripts/demo_flow.py
```

The demo script expects the backend running, uses synthetic accounts and creates new records rather than deleting previous history. Backend tests use isolated temporary databases. See `docs/VALIDATION_REPORT.md` for what was actually run.
