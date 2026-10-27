# LabTrack — Institutional Hardware Lifecycle, Custody & Multi-Model Database System

> **Course:** Database Concepts for Data Science Lab (DCDSL / Sem 3 AIML, SIT Pune)  
> **Evaluators:** Dr. Anjali Dalvi | Dr. Sumanto Dutta | Dr. Wasim Khan  
> **Student Lead:** Ishaan Chand (PRN: 25070126076)  
> **Architecture:** React 18 SPA + Python FastAPI + Hybrid Database (MySQL 8.0 Relational Engine & MongoDB Atlas NoSQL Store)

---

## 1. Executive Summary & Purpose

LabTrack is an institutional hardware asset lifecycle and custody tracking system engineered for engineering departments. It digitizes fragmented, manual component issue ledgers into a secure, auditable, multi-role digital ecosystem:

* **Real-time Inventory & State Tracking:** Tracks component availability across multiple departmental labs with unique serialized barcodes.
* **Multi-Stage Approval Pipeline:** Multi-role workflow requiring student requisition, faculty mentor endorsement, Head of Department (HoD) sanction, and counter dispatch.
* **Hybrid Database Model:** Blends ACID-compliant relational storage in **MySQL 8.0** for transactional integrity with **MongoDB Atlas** for high-velocity event tracking and aggregation analytics.
* **Advanced Database Querying:** Integrates MySQL Stored Procedures, multi-table `INNER`/`LEFT JOIN` queries, and MongoDB aggregation pipelines.

---

## 2. Repository Organization

```
LabTrack/
├── src/                  # Active application source code
│   ├── App.jsx           # Main React component & routing
│   ├── main.jsx          # React SPA frontend entry point
│   ├── components/       # UI components (navigation, forms, 3D hardware canvas)
│   ├── pages/            # Role-guarded dashboard views (custody, inventory, approvals)
│   ├── context/          # React contexts (AuthContext, LabDataContext, NotificationContext)
│   ├── backend/          # FastAPI backend package (labtrack), SQLAlchemy models & worker
│   │   ├── labtrack/     # Application modules (api.py, service.py, models.py, auth.py)
│   │   └── migrations/   # Alembic relational database migrations
│   └── frontend/         # Secondary TypeScript web client
│
├── database/             # Relational & NoSQL database assets
│   ├── mysql/            # MySQL 8.0 DDL schemas and stored procedures
│   │   ├── schema.sql    # Relational table DDL (users, audit logs, indexes)
│   │   └── reporting.sql # MySQL stored procedure (CALL labtrack_usage_by_lab())
│   └── mongo/            # MongoDB Atlas NoSQL scripts
│       └── analytics.js  # Aggregation pipelines ($group, $sum, $sort)
│
├── scripts/              # Operational, testing, and migration utilities
│   ├── demo_flow.py      # Automated demonstration workflow
│   ├── smoke_test.js     # E2E lifecycle smoke test
│   ├── smoke-test-mysql-auth.cjs  # Parameterized SQL security verification
│   ├── smoke-test-excel-auth.cjs  # Roster validation verification
│   └── sync_master_data.py        # Master dataset synchronization
│
├── tests/                # Automated pytest suite (61 tests covering 100% of workflows)
│   ├── conftest.py       # Pytest fixtures and database test harnesses
│   ├── test_workflows.py # End-to-end lifecycle and approval tests
│   └── test_phase_*.py   # Core service, inventory, and transaction tests
│
├── docs/                 # Authoritative documentation hub
│   ├── architecture/     # SDD, Master Context, and system specifications
│   │   ├── LabTrack_SDD.md                    # Approved Software Design Document
│   │   └── LABTRACK_DCDS_MASTER_CONTEXT.md    # Master Context & DCDS Technical Audit
│   ├── database/         # Database architecture and data dictionary
│   │   ├── DATABASE_ARCHITECTURE.md          # Multi-model architecture & DCDS alignment
│   │   └── DATA_DICTIONARY_AND_SCALING.md    # 21-table relational schema & volume estimates
│   ├── academic/         # DCDS rubrics, evaluation plans, and viva playbooks
│   │   └── DCDSL_Evaluation_Plan.pdf         # Official DCDS laboratory rubric (10 Marks)
│   ├── execution/        # Traceability matrices and validation reports
│   └── guides/           # Setup and evaluator runbooks
│       ├── RUN_GUIDE.md      # Detailed developer and operator runbook
│       └── DEMO_RUNBOOK.md   # Step-by-step evaluator presentation guide
│
├── presentations/        # Academic presentation artifacts
│   ├── DCDS/             # Active DCDS ESE presentation deck and report templates
│   └── archive/          # Superseded presentation versions (v1, v1.1, v2, cce-v3)
│
├── fixtures/             # Seed data and test fixtures (demo.json, requisition_events.json)
├── archive/              # Retained historical records, CCE artifacts, and agent logs
│   ├── cce_artifacts/    # Prior semester CCE evaluation PDFs
│   ├── historical_notes/ # Interview transcripts and development notes
│   ├── astra_governance/ # Protocol manifests and decision logs
│   ├── agent_logs/       # Agent transcript continuity logs and penalty audits
│   └── mockstate_backups/# Previous backup datasets
│
├── README.md             # This authoritative project overview
├── pyproject.toml        # Python packaging and dependency specifications
├── package.json          # Node.js frontend dependencies and build scripts
├── alembic.ini           # Alembic relational database migration configuration
├── Dockerfile            # Multi-stage production container build definition
└── compose.yaml          # Multi-container orchestration (FastAPI + MySQL 8.4 + Mongo 8.0)
```

---

## 3. Runtime Entry Points & How to Run

### Option A: Local Development (Quickstart)

#### 1. Backend Service (FastAPI)
```bash
# Activate virtual environment
.venv\Scripts\activate   # On Windows
source .venv/bin/activate # On Linux/macOS

# Install dependencies (if not already installed)
pip install -e .

# Launch FastAPI backend on port 8000
uvicorn src.backend.labtrack.api:app --reload --port 8000
```
* **Interactive OpenAPI Swagger Docs:** `http://localhost:8000/docs`
* **Health Check:** `http://localhost:8000/api/health`

#### 2. Frontend Application (React 18 / Vite)
```bash
# Install node dependencies
npm install

# Start Vite development server on port 5173
npm run dev
```
* **Web Application:** `http://localhost:5173`

---

### Option B: Docker Compose (Full Stack with MySQL & MongoDB)
```bash
# Spin up MySQL 8.4, MongoDB 8.0, migrations, and FastAPI backend
docker compose up -d

# Verify services
docker compose ps
```

---

## 4. Verification & Testing

The repository includes a comprehensive, multi-layer verification suite:

```bash
# 1. Run Python automated test suite (Pytest - 61 tests)
pytest

# 2. Verify React production bundle build (Vite)
npm run build

# 3. Execute MySQL relational authentication smoke test
node scripts/smoke-test-mysql-auth.cjs

# 4. Execute institutional Excel roster smoke test
node scripts/smoke-test-excel-auth.cjs

# 5. Execute End-to-End lifecycle simulation smoke test
node scripts/smoke_test.js
```

---

## 5. DCDS Evaluation Alignment (10/10 Rubric Mapping)

| DCDS Evaluation Criterion | Marks | Evidence & Repository Artifacts |
| :--- | :--- | :--- |
| **1. Problem Definition & Data Model Design** | **2.0** | Comprehensive ER diagrams and document structures documented in [`docs/architecture/LabTrack_SDD.md`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/architecture/LabTrack_SDD.md) and [`docs/database/DATA_DICTIONARY_AND_SCALING.md`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/database/DATA_DICTIONARY_AND_SCALING.md). |
| **2. Relational DB Implementation & Normalization** | **2.0** | 21 relational tables designed in 3NF/BCNF with strict foreign keys and index optimization defined in [`database/mysql/schema.sql`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/database/mysql/schema.sql) and [`src/backend/labtrack/models.py`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/src/backend/labtrack/models.py). |
| **3. NoSQL Database Implementation** | **2.0** | MongoDB Atlas cloud cluster integration with aggregation pipelines implemented in [`database/mongo/analytics.js`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/database/mongo/analytics.js) and [`src/backend/labtrack/adapters.py`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/src/backend/labtrack/adapters.py). |
| **4. Advanced Database Querying & Stored Procedures** | **2.0** | MySQL Stored Procedure `CALL labtrack_usage_by_lab()` in [`database/mysql/reporting.sql`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/database/mysql/reporting.sql), multi-table `INNER JOIN` in `/api/reports/usage`, and MongoDB `$group` aggregation. |
| **5. Application Integration, Hybrid Architecture & Viva** | **2.0** | Live FastAPI backend dual-writing to relational MySQL and MongoDB Atlas with automated test coverage and clean architectural separation. |

---

## 6. Institutional Security Note

All seed rosters and sample identifiers in this repository are synthetic institutional models designed strictly for academic evaluation and software testing. Production deployments must configure external secret managers for all cloud database URIs and credentials.
