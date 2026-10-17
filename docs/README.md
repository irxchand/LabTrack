# LabTrack Documentation Hub

Welcome to the centralized documentation repository for **LabTrack** (Hardware Component Availability, Issuance & Tracking System for Robotics & Automation).

This directory is organized into logical, domain-specific categories so developers, faculty mentors, evaluators, and project contributors can quickly find the exact information they need.

---

## Directory Navigation Map

```
docs/
├── README.md                         # This master documentation hub
├── architecture/                     # System design, domain models & technical specifications
│   ├── LabTrack_SDD.md               # Approved Canonical Software Design Document (v0.1)
│   ├── LabTrack_MASTER_CONTEXT.md    # Authoritative business rules, roles, & lifecycle specification
│   └── LabTrack_SDD_DETERMINISTIC_TEMPLATE.md  # Architectural template & operation contract format
├── guides/                           # Practical instructions, setup & demonstration runbooks
│   ├── RUN_GUIDE.md                  # Quick-start developer guide & environment setup
│   └── DEMO_RUNBOOK.md               # Step-by-step evaluator demonstration flow & scenarios
├── execution/                        # Project tracking, verification, & decisions
│   ├── EXECUTION_PLAN.md             # Execution phase roadmap & implementation strategy
│   ├── EXECUTION_DECISIONS.md        # Technical selections & unresolved business policy log
│   ├── EXECUTION_TRACEABILITY.md     # 85-requirement traceability matrix to code & tests
│   └── VALIDATION_REPORT.md          # Measured test results, coverage, & runtime limitations
├── academic/                         # Official university rubrics & literature references
│   ├── DCDSL_Evaluation_Plan.pdf     # Distributed & Cloud Database Systems Lab rubric
│   ├── CCE_Evaluation_Plan.pdf       # Cloud Computing Essentials rubric
│   └── RESEARCH_REFERENCES.md       # Literature citations & industrial system benchmarks
└── ASTRA/                            # Formal governance protocol, ledger & approval gates
    ├── 00_SOURCE_MANIFEST.md         # Cryptographic inventory of all project source materials
    ├── 01_REFERENCE_GRAPH.md         # Dependency graph of all project requirements & entities
    ├── 02_REQUIREMENT_LEDGER.md      # Canonical 85-item stable requirement ledger
    ├── 03_RECONCILIATION_REPORT.md   # Conflict analysis & gap report across sources
    ├── 04_CONTEXT_REVIEW.md          # Rigorous question-by-question discovery audit
    ├── 05_OPEN_DECISIONS.md          # Register of open business & architectural decisions
    ├── SDD_APPROVAL_GATE.yaml        # Cryptographic record of user approval (SDD_APPROVED)
    ├── SDD_REVIEW.md                 # 15-point architectural compliance review of the SDD
    ├── IMPLEMENTATION_PROGRAM.md     # 6-phase end-to-end implementation program
    ├── IMPLEMENTATION_STATE.md       # Real-time implementation & test state ledger
    └── approvals/                    # Immutable archive of prior approval gate snapshots
```

---

## Detailed Directory Guide

### 1. [architecture/](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/architecture/) — Technical Specifications
*Primary Audience: Software Engineers, Architects, Technical Evaluators*
- **[LabTrack_SDD.md](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/architecture/LabTrack_SDD.md)**: The user-approved canonical Software Design Document (v0.1). Contains all 43 baseline sections, data architecture, REST API contracts, state transition matrices, and 20 deterministic operation families (`OP-01` to `OP-20`).
- **[LabTrack_MASTER_CONTEXT.md](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/architecture/LabTrack_MASTER_CONTEXT.md)**: Comprehensive business rules definition covering student project workflows, dual-class inventory rules (consumables vs. assets), multi-stage approval routing, and technical viva preparation.
- **[LabTrack_SDD_DETERMINISTIC_TEMPLATE.md](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/architecture/LabTrack_SDD_DETERMINISTIC_TEMPLATE.md)**: The structural reference baseline establishing the 33-field deterministic operation template.

### 2. [guides/](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/guides/) — Runbooks & Operations
*Primary Audience: Evaluators, Developers running the app locally*
- **[RUN_GUIDE.md](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/guides/RUN_GUIDE.md)**: Step-by-step instructions to set up the Python virtual environment, start the FastAPI backend, run the background worker, build/serve the React frontend, and inspect API docs at `/docs`.
- **[DEMO_RUNBOOK.md](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/guides/DEMO_RUNBOOK.md)**: Scripted walkthrough for a complete live demonstration: student login, project creation, minimum-lab planning, faculty approval, whole-request issue by lab assistant, and asset return inspection.

### 3. [execution/](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/execution/) — Project Tracking & Verification
*Primary Audience: Project Managers, Technical Auditors*
- **[EXECUTION_PLAN.md](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/execution/EXECUTION_PLAN.md)**: High-level implementation plan covering foundation, workflows, client application, integration, and demonstration milestones.
- **[EXECUTION_DECISIONS.md](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/execution/EXECUTION_DECISIONS.md)**: Real-time record of technical decisions (e.g., single SQL transaction wrapper, SQLite local profile) and explicit boundaries for open business policies (`OD-01` to `OD-22`).
- **[EXECUTION_TRACEABILITY.md](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/execution/EXECUTION_TRACEABILITY.md)**: Direct mapping between all 85 requirement ledger items and their concrete implementation files and automated test cases.
- **[VALIDATION_REPORT.md](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/execution/VALIDATION_REPORT.md)**: Empirical test results report detailing passing backend test counts, frontend build results, browser session tests, and unverified service boundaries.

### 4. [academic/](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/academic/) — Course Evaluation & Research
*Primary Audience: University Faculty, Academic Evaluators*
- **[DCDSL_Evaluation_Plan.pdf](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/academic/DCDSL_Evaluation_Plan.pdf)**: Official rubric for Distributed and Cloud Database Systems Lab (SQL, NoSQL, advanced queries, transactions, security).
- **[CCE_Evaluation_Plan.pdf](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/academic/CCE_Evaluation_Plan.pdf)**: Official rubric for Cloud Computing Essentials (topic, research, presentation, running example, viva).
- **[RESEARCH_REFERENCES.md](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/academic/RESEARCH_REFERENCES.md)**: Academic citations and industrial benchmarks (Snipe-IT asset tracking, IEEE inventory models).

### 5. [ASTRA/](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/ASTRA/) — Governance & Audit Gates
*Primary Audience: AI Engineering Agents, Quality Auditors*
- **[02_REQUIREMENT_LEDGER.md](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/ASTRA/02_REQUIREMENT_LEDGER.md)**: 85 stable, immutable requirements extracted from source documents.
- **[SDD_APPROVAL_GATE.yaml](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/ASTRA/SDD_APPROVAL_GATE.yaml)**: Cryptographic state machine artifact recording user approval (`SDD_APPROVED`), source file hashes, and authorization boundaries.
- **[IMPLEMENTATION_PROGRAM.md](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/ASTRA/IMPLEMENTATION_PROGRAM.md)**: Master 6-phase implementation program derived from SDD §33.
- **[IMPLEMENTATION_STATE.md](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/ASTRA/IMPLEMENTATION_STATE.md)**: Cumulative execution record tracking phase completion, test suites, and open policy boundaries.

---

## Authority & Precedence

When interpreting technical decisions or resolving questions, apply the following order of truth:
1. **Explicit current user instruction**
2. **Approved SDD (`docs/architecture/LabTrack_SDD.md`)**
3. **Master Context (`docs/architecture/LabTrack_MASTER_CONTEXT.md`)**
4. **Requirement Ledger (`docs/ASTRA/02_REQUIREMENT_LEDGER.md`)**
5. **Open Decision Register (`docs/ASTRA/05_OPEN_DECISIONS.md`)**
