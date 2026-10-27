# LABTRACK / DCDS — PROJECT & TECHNICAL TRUTH (V2)
Use with `00_REFERENCE_ROUTER.md`. This is project context, **not** proof that every current runtime component passes.

## [P01] Identity and audience
**LabTrack: Laboratory Hardware Inventory & Requisition Management System.** Second-Year B.Tech AIML, SIT Pune, Database Concepts for Data Science Lab ESE (10-mark mini-project). Technical audience: DCDS faculty. Its main problem is maintaining consistent records of availability, approval, condition, physical custody, returns and auditability of laboratory equipment across authorized users. Avoid unsupported claims of actual SIT adoption, money saved, or deployment to real campus operations.

Official theory Unit 3 decks show course code `TEE7423`; older Gemini documents mistakenly said `TEE7421` for DCDS, which is associated with CCE in user materials. Do not print a course code without confirming the official DCDSL cover information. The faculty PPTX says `Course: DCDS – ESE Project`.

## [P02] Team and presentation
- **Presenter A (user):** systems architecture, backend engineering, technical integration and design; foreground this expertise in architecture, Python, data flow, transactions, observability and tests.
- **Presenter B (Raghu):** primarily frontend engineering, UX and browser-side live demo.
- **Both:** SQL and MongoDB implementation; do not assign exclusive DB authorship to either.
- Both present; user confirms **live demo**. Duration context: template recommends within 10 minutes; exact speaking/live split may evolve.
- Unknown: group no., formal student names/rolls, faculty guide; use editable placeholders.

## [P03] Domain model / distinguishing value
1. **Dual-class hardware:** barcoded/serialized `Asset` units vs per-lab quantity-tracked `Stock` and consumables, including `good` and `bad` counts.
2. **Project-linked requisitions:** project/member association, availability planning, authorized decisions, claim/stage, issuance and return/inspection.
3. **Roles and policies:** student, mentor/faculty, HoD, laboratory assistant/in-charge. Server-side department restrictions were implemented in inspected older code; latest full UI-to-API proof is awaiting QA.
4. **Auditability:** SQL requests, request lines, audit/outbox records; document and notification projections where enabled.
5. **Data ingestion:** multi-sheet Excel workbook → `openpyxl` → Python transformation → SQLAlchemy ORM → active SQL DB.

## [P04] Authoritative target architecture
```text
React / Vite frontend              [CURRENT UI: user-reported functional; QA PENDING]
      |  HTTP / JSON
      v
FastAPI (Python) API routes        api.py
      |  auth / validation
      v
Domain services / business rules   service.py
      |                                \
      | SQLAlchemy + PyMySQL           \ outbox + worker / PyMongo
      v                                  v
Aiven managed MySQL                  MongoDB Atlas
[CHOSEN TARGET / MIGRATION PENDING]    [USER-REPORTED CLOUD ACTIVE]
      |                                  |
Structured truth: users, labs,         Flexible specs, documents,
items, stock, assets, projects,        notifications, event and
requests, custody, audit/outbox        analytics projections
```
SQL owns authoritative transactional inventory/custody state. MongoDB is the flexible document and event/projection store; do not pretend MySQL and MongoDB share an atomic distributed transaction. For request-created → worker projection, draw **dashed asynchronous event arrow** from the outbox/worker toward MongoDB. The frontend should not connect directly to databases.

`SQLAlchemy` is ORM/query/session library, NOT a DBMS; it does not by itself 'turn Excel into MySQL'. `openpyxl` reads Excel; Python transforms; SQLAlchemy persists via active dialect. Original configured local engine was SQLite (`sqlite:///.local/labtrack.db`). Final presentation should say *cloud MySQL* only if the latest QA/output proves the migration succeeded. Never label a local SQLite screenshot as cloud MySQL.

## [P05] Source-to-feature anchor map (paths are pre-restructure, may move)
| Artifact | Role | Safe to say now |
|---|---|---|
| `src/backend/labtrack/api.py` | FastAPI endpoints: catalogue, projects, requests, SQL usage report, Mongo demand report, health | Relevant routes exist in inspected source |
| `src/backend/labtrack/service.py` | Business policies, validation, approvals, issue/return, transaction orchestration | Substantial Python service code exists |
| `src/backend/labtrack/models.py` | SQLAlchemy ORM tables, PKs/FKs/checks | Tables/constraints exist in inspected snapshot; exact final schema needs verification |
| `src/backend/labtrack/db.py`, `config.py` | SQL dialect selection and session | Old default SQLite; target MySQL not yet proven live |
| `src/backend/labtrack/adapters.py` | MongoDB/local document-store, object/email adapters | Adapter code exists; active selection may vary |
| `src/backend/labtrack/worker.py` | Transactional outbox projections and deliveries | Code exists; actual remote writes need live proof |
| `utilities/sync_master_data.py` | `openpyxl` workbook reading, ORM seeding | File handling exists; a rerun can overwrite operational stock/credentials |
| `database/mysql/reporting.sql` | `labtrack_usage_by_lab()` stored procedure SQL and subquery | Source exists; successful CALL on remote DB awaits proof |
| `database/mongo/analytics.js` | Demand and delivery aggregation examples | Source exists; populated `demand` data needs verification |
| `tests/test_mysql_mongo.py` | Optional real-service integration tests | May be skipped when connection env vars are absent |
| `src/api/*.js` | Historical simulated/localStorage frontend API | Latest Raghu UI QA required before marking all pages DB-backed |

## [P06] Core relational model and known caution
Inspected models include `users`, `labs`, `items`, `stock`, `assets`, `projects`, `members`, `requests`, `request_lines`, `inspections`, `reservations`, `extensions`, `audit`, `outbox`, `idempotency`, `deliveries`, and others. Gemini historically reported 21 SQL tables, but the final version count must be read from the actual DB.

Illustrative relationship chain grounded in earlier models:
- `projects.id` → `requests.project_id`
- `requests.id` → `request_lines.request_id`
- `items.id` → `request_lines.item_id` and `stock.item_id`
- `labs.id` → `request_lines.lab_id` and `stock.lab_id`
- `users.id` → `members.user_id`; `members.project_id` → `projects.id`
- `assets` reference an item and lab; an asset has a unique barcode.

**Important normalization correction:** older ORM shows `stock.id` surrogate PK with `(item_id, lab_id)` unique constraint, *not* a composite PK. Some roles/lab assignments were JSON/list values; do not claim blanket 1NF/BCNF. Analyze actual candidate keys and FDs. Full model should be supplied after migration; use a readable 8–10-entity main ER subgraph, not a 21-table wall.

## [P07] Code, SQL, Mongo concepts suitable for the viva
- Python: classes (`MongoDocumentStore`, ORM models), functions (`plan`, `submit_request`, `issue`, `returned`), exception handling (`DomainError`), file I/O (`openpyxl`), modular separation, REST endpoints.
- MySQL: CREATE TABLE/DDL, SELECT/INSERT/UPDATE and controlled DELETE in test data, INNER/LEFT multi-table JOIN, subqueries/correlated, GROUP BY/HAVING and aggregates, stored procedure execution, views, indexes and EXPLAIN, commit/rollback, row locking, referential/check constraints.
- MongoDB: documents, `find` projection/filter, update/upsert, aggregation `$match/$group/$sort`, GridFS where relevant, index/explain and asynchronous event projection. `$lookup` optional and only when useful.
- Clear business questions: “Which labs have the highest issued units?”, “Which components have no requests?”, “Which component has the highest unmet demand?”, “What happens if two students request the last unit?”

## [P08] Verification/provenance states
`SOURCE-CONFIRMED`: in code/docs, not necessarily executed. `USER-REPORTED`: described as working. `VERIFIED-LIVE`: actual latest output/screenshot/test proves it. `PENDING`: awaiting work/QA. `FUTURE`: SIT roadmap. `DISPUTED`: sources differ.

- **Aiven MySQL**: CHOSEN TARGET, migration in progress according to user; not confirmed live.
- **MongoDB Atlas**: user reports running live; exact aggregation output and backend selected adapter pending confirmation.
- **Frontend**: user reports substantial working site; Raghu evaluating real end-to-end persistence.
- **Tests**: older Gemini reported 61 passed and 2 skipped; do not reuse as latest current pass count after migrations.
- **Transparency CLI**: separate artifact user will design himself; do not depict it as built until evidence arrives.
- **SIT deployment**: deliberate FUTURE PROSPECT, not a deployed or institutionally approved system.

## [P09] Future direction — keep to Slide 11
**Future aspiration: real SIT deployment.** Three credible steps: (1) departmental pilot with institutional identities/permissions and backups, (2) QR/RFID-supported accountable hardware handover, (3) campus-wide inventory coordination and data-driven demand/maintenance forecasting. Long-term engineering Phases 2/3 exist but the PPT should present a clear institution-focused adoption path, not internal sprint management.

## [P10] Avoid unsupported claims
No invented cloud URL, TLS certificate, real SIT usage, barcode scan result, actual query row, run date, delivered mail, frontend persistence, 100% tests, financial value, no security flaws or 3NF/BCNF proof. Use `INSERT VERIFIED ...` placeholders on designed slides until the user uploads runtime evidence. Use synthetic demonstration data, not actual student identity records.
