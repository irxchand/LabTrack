# LABTRACK / DCDS — OFFICIAL SLIDE MAP, RUBRIC & UNIT 3 (V2)
Use with router `00`. The uploaded official PPTX has **13 slides and 16:9 canvas**. Its slide order and headings are binding. The main-content framing below is suggested, while the template's explicitly required topics are non-negotiable.

## [RUBRIC] Official faculty criteria — 2 + 2 + 2 + 2 + 1 + 1 = 10
| Code | Criterion | Marks | Best proof | Main slides |
|---|---|---:|---|---|
| R1 | Application Design & Functionality | 2 | User roles, requisition journey, genuine browser/backend results | 2–4,9 |
| R2 | Python Programming Implementation | 2 | `api.py`, `service.py`, `models.py`, `adapters.py`, exception + `openpyxl` file handling | 4–5,8–9 |
| R3 | SQL + NoSQL Database Integration | 2 | Both actual connections, CRUD/read/write and data ownership | 4–5,8–9 |
| R4 | Advanced Database Querying & Retrieval | 2 | joins, nested queries, aggregates/grouping, stored procedures, Mongo aggregate pipeline | 7–9 |
| R5 | Code Quality, Documentation & UI | 1 | Clear modules, project report, comprehensible working screens, diagrams | 4–9,12 |
| R6 | Testing, Validation, Security & Error Handling | 1 | tests with observed outcomes, rejected invalid/unauthorized actions | 9–10 |
Do not relabel this as five criteria worth 2 each, and do not claim a self-predicted mark. The official rubric's “Excellent” label means demonstrable performance, not the amount of theory on slides.

## [UNIT3] Academic linkages from three faculty decks
- **Database Design and Analysis:** information/database application lifecycle; stakeholder views; requirements; conceptual→logical→physical design; DBMS selection; transaction design/commit/rollback; data conversion/ETL; validation/testing; operational maintenance.
- **Presentation-2 / Functional Dependencies:** functional dependencies X→Y, partial and transitive dependencies, insertion/update/deletion anomalies, 1NF, 2NF, 3NF, BCNF, multivalued dependency/4NF. Show only real, relevant dependencies on main slides; detailed proofs belong in report/viva backup.
- **NoSQL Fundamentals and MongoDB:** SQL vs NoSQL/polyglot persistence, BSON documents, embedding, CRUD/find/filter/projection, indexing and `explain()`, aggregate pipelines, replica/consistency concepts. Avoid sweeping inaccurate “NoSQL has no ACID” or categorical CAP claims.
- **Priority:** Main PPT covers theory through *implemented examples*; no slide-length textbook definitions.

## [STORY] Central through-line
**ONE REQUISITION → TWO DATA STORES → TRACEABLE CUSTODY.** Follow a representative request from the UI into FastAPI/Python, transactional MySQL, async MongoDB projections and controlled error/test. Evidence may not yet be available; annotate as `PENDING` and do not invent.

## [S01] Exact official heading: `DCDS ESE PROJECT PRESENTATION`
Hero name `LabTrack`; subtitle `Laboratory Hardware Inventory & Requisition Management`. Group details, names/roll nos., division, guide are editable blanks until supplied. Graphic: minimal hardware icon → requisition → data layers, not an imaginary real campus screenshot. Speakers: Both. Rationale: establishes identity, no unsupported metrics.

## [S02] `Problem Statement & Motivation`
Suggested 3 pointer fragments:
- `Fragmented hardware availability across laboratories`
- `Approval, custody and condition records difficult to reconcile`
- `Students, mentors, HoDs and lab staff need shared visibility`
Visual: three isolated records converging into one traceable lifecycle. Phrase as general operational problem, not verified defects at SIT. **R1**.

## [S03] `Objectives & Scope`
Five compact measurable/testable objective labels: `Track assets and consumables`; `Enforce role-governed requests`; `Persist relational custody`; `Project documents and analytics`; `Validate rules and errors`. Include an in-scope/out-of-scope micro-strip. Future SIT deployment is NOT current scope. **R1 R2 R3 R6**.

## [S04] `System Overview / Proposed Solution`
Diagram: **React/Vite → FastAPI/Python services → SQLAlchemy → Aiven MySQL [status as verified]**; separate **worker/PyMongo → MongoDB Atlas** document branch. Tiny process row: request → authorize → approve → issue → return. Diagram should denote SQL truth vs NoSQL projections and asynchronous outbox; preserve editable arrows. Status qualifier if MySQL not migrated. **R1 R2 R3**.

## [S05] `Requirements & Technology Stack`
Compact columns `Layer | Tool | Purpose`: React+Vite / UI; FastAPI+Python / endpoints+business rules; SQLAlchemy+PyMySQL / relational transactions; MySQL / structured authoritative data; PyMongo+MongoDB Atlas / flexible docs; openpyxl / Excel ETL; pytest / validation. Micro-rationale “MySQL: referential integrity + procedure; Mongo: flexible BSON + projections.” Avoid logos-only slide. **R2 R3 / DBMS selection**.

## [S06] `Database Design – ER Diagram`
Hero readable core Crow's Foot ER subgraph, e.g. `users`, `projects`, `members`, `requests`, `request_lines`, `items`, `labs`, `stock`, `assets` from final verified schema. Label PK/FK/unique; emphasize `item` vs `asset`, `stock` per lab. Do not invent attributes or claim composite stock PK. Use verified output or labeled diagram placeholder. **R3 R5 / conceptual design**.

## [S07] `Relational Schema & Normalization`
One relational key map + one miniature unnormalized→normalized example; only 2–3 actual dependencies (`request_id → project_id, state`; `item_id → item fields`; relationship to request_lines) once columns are checked. Explain deletion/update anomaly avoided with 1 line. Show 1NF→2NF→3NF as annotated process, BCNF only if proven. Small constraints chips `PK`, `FK`, `CHECK`, `UNIQUE`. **R3 R4 R5 / logical design**.

## [S08] `Implementation & SQL Operations`
Technical hero. Native editable panels: **MySQL** (short actual INNER/LEFT JOIN or GROUP BY/HAVING or `CALL labtrack_usage_by_lab()`) and **MongoDB** (`$match` → `$group` → `$sort` actual aggregate). Add 1-line Python adapter `SQLAlchemy Session / PyMongo` and genuine output slots. Do NOT pretend 10 full queries fit on one slide: use 2 exemplary executable queries in PPT, complete advanced-query pack in report/live demo. For no verified outputs: `INSERT VERIFIED MYSQL RESULT`/`INSERT VERIFIED ATLAS RESULT`. **R2 R3 R4**.

## [S09] `Results / Screenshots / Demonstration`
Four-piece evidence chain: frontend screenshot → HTTP route/status → verified MySQL row → verified Mongo document/event output; same safe demo request ID if real. Add brief reload/persistence cue only if tested. This is live-demo handoff, not staged fake server log. **R1 R2 R3 R4 R5**.

## [S10] `Testing & Validation`
~4 observed cases, each `input → expected → actual`: normal requisition, unauthorized access, invalid stock/foreign key, DB persistence or rollback, plus latest current pytest result. Blank actual/status when not supplied; no fabricated green PASS. Include database test separation and note previously skipped integration tests if relevant. **R6**.

## [S11] `Conclusion & Future Scope`
Two headers: `Demonstrated` (only verified achievements) and `Future — SIT Deployment`. Three future lanes maximum: `Departmental SIT pilot + identity/backup`; `QR/RFID custody`; `Campus-wide analytics and hardware-demand forecasting`. No implication SIT approval exists. **R1 and aspirational direction**.

## [S12] `References & Q&A`
Compact real sources: faculty unit decks, official syllabus/rubric/template, actual used software docs and internal project design docs. IEEE-style or consistent short citations; no invented titles/dates, no private repo link represented as universally accessible. Closing `Questions?`. Both speakers.

## [S13] `Final Submission Checklist`
Must retain exact official section, keep minimally designed. Confirm **report Moodle**, **PPT Moodle**, **readable ER/schema/sample/query screenshots**, **all group members explain own contributions**, **10-minute rehearsal**. Unsubmitted items remain unchecked/pending; do not label submitted unless user confirms. Not normally spoken except as brief closure.

## [CONTENT RULE] Spoken versus displayed material
Each slide must be a speaking aid: **1 meaningful heading, a short takeaway, about 3–5 concise pointer fragments**, and **one major diagram/evidence object**. Technical slides may use labels/short code in place of bullets. No paragraphs to be read aloud. Put fuller explanations in presenter notes or accompanying short script, NOT main slide.
