# LabTrack — Hardware Component Availability, Issuance & Tracking System

> **One-line description:** Turning fragmented laboratory hardware handling into a traceable digital lifecycle—from project requirements and availability through approval, physical issuance, reminders, reservation, return, inspection, and accountability.

**Current Status (2026-10-16):** Defined synthetic-data web prototype implemented and locally verified. Phase 01 sealed. The SDD is the user-approved canonical project baseline (`docs/architecture/LabTrack_SDD.md`). See [Run Guide](docs/guides/RUN_GUIDE.md), [Validation Report](docs/execution/VALIDATION_REPORT.md), [Documentation Hub](docs/README.md), and [Active State](ACTIVE_STATE.md).

---

## 1. Repository Structure

```
LabTrack/
├── README.md                          # Repository instructions & developer/agent entry point
├── AGENT_LOG.md                       # Chronological continuity log for AI agents
├── ACTIVE_STATE.md                    # Current active engineering state
├── .gitignore                         # Git exclusion rules (dependencies, secrets, personal files)
│
├── docs/                              # Project documentation hub (see docs/README.md)
│   ├── README.md                      # Master documentation navigation hub & index
│   ├── architecture/                  # Canonical SDD, Master Context, and structural templates
│   ├── guides/                        # Operational Run Guide and Evaluator Demo Runbook
│   ├── execution/                     # Execution plan, decisions, traceability, and validation report
│   ├── academic/                      # Course evaluation rubrics (DCDS, CCE) and research references
│   └── ASTRA/                         # Protocol compliance, requirement ledger, and approval gates
│
├── implementation_plans/              # Phase-by-phase implementation plans & validation reports
│   └── phase_01/                      # Phase 01 implementation plan & validation report
│
├── presentations/                     # Presentation artifacts and pitch-deck projects ONLY
│   ├── v1/                            # Presentation version 1 (baseline)
│   ├── v1.1/                          # Presentation version 1.1 (fact-checked & refined)
│   └── v2/                            # Presentation version 2 (22-slide editable PPTX & HTML viewer)
│
├── src/backend/                       # FastAPI, domain services, SQL models and adapters
├── src/frontend/                      # React/Vite/TypeScript web application
├── tests/                             # Unit, workflow, foundation, concurrency and adapter checks
├── contracts/                         # OpenAPI 3.1 contract specification
├── alembic/                           # Versioned relational schema migrations
├── database/                          # MySQL routines and MongoDB aggregation pipelines
└── scripts/                           # Demo flow, browser regressions, and export utilities
```

---

## 2. Context Bootstrap for AI Agents and Contributors

Before making any substantive design, architectural, or code changes:

1. **Read [`docs/README.md`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/README.md)**: Master documentation index.
2. **Read [`docs/architecture/LabTrack_MASTER_CONTEXT.md`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/architecture/LabTrack_MASTER_CONTEXT.md)**: Authoritative master context document.
3. **Read [`docs/architecture/LabTrack_SDD.md`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/architecture/LabTrack_SDD.md)**: Approved canonical software design document.
4. **Read [`AGENT_LOG.md`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/AGENT_LOG.md)**: Check recent decisions, changes, open items, and continuity notes.

---

## 3. Source-of-Truth Hierarchy

When resolving requirements, architecture, or policy conflicts, follow this strict priority order:

1. **Faculty / College-Confirmed Requirements** *(Authoritative institutional rules)*
2. **Explicitly Confirmed Project Decisions** *(Direct team agreements confirmed by user)*
3. **V1 Assumptions** *(Temporary operational conventions adopted to enable development)*
4. **Future-Scope Ideas** *(Concepts discussed for future iterations; out of V1 scope)*
5. **Agent Inference** *(Agent suggestions; must NEVER be silently elevated into a project requirement)*

---

## 4. Status Terminology

All project features, workflows, and policy rules must be explicitly classified with one of the following labels:

- `Confirmed`: Directly observed by the project team or established by official academic rubric.
- `V1 assumption`: Temporary operational rule for development; configurable and replaceable upon faculty response.
- `Pending faculty confirmation`: Institutional decision requiring college approval (mapped to UAQ1–UAQ22).
- `Future scope`: Planned for post-V1 roadmap (e.g., native mobile apps, Play Store release, automated procurement).
- `Deprecated`: Superseded by newer confirmed requirements.

---

## 5. File Naming Contract

To maintain a clean, navigable codebase, all contributors and agents must follow these naming rules:

- **General**: Use descriptive names. Prefer `PascalCase` or clear `TitleCase` for top-level documentation (e.g., `LabTrack_MASTER_CONTEXT.md`, `LabTrack_Faculty_Questions.md`).
- **Forbidden Names**: Never use ambiguous names such as `final.md`, `new.md`, `latest.md`, `updated_final.pdf`, or `test2.js`.
- **Academic Rubrics**: Retain official document titles without obscuring their identity (`DCDSL Evaluation Plan_with detailed rubrics.pdf`).
- **Presentations**: Versioned under `presentations/<version>/` (e.g. `presentations/v1/`). Source code lives in `presentations/<version>/code/` and compiled PDF exports live in `presentations/<version>/pdf/` (e.g. `presentations/v1/pdf/LabTrack_Pitch_Deck_v1.pdf`).
- **Source Code**: All application code belongs in `src/`. Automated tests belong in `tests/`. Standalone operational scripts belong in `scripts/`.
- **Privacy & Exclusions**: Personal credentials, local secrets, environment settings, and temporary build outputs must never be committed to Git and are excluded via `.gitignore`.

---

## 6. AI Agent Workflow Contract

Every AI agent working in this repository must follow this sequence:

1. **Read [`README.md`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/README.md)** (this entry point).
2. **Read [`docs/LabTrack_MASTER_CONTEXT.md`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/LabTrack_MASTER_CONTEXT.md)**.
3. **Read [`AGENT_LOG.md`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/AGENT_LOG.md)**.
4. **Inspect** the targeted files and verify dependencies.
5. **Implement** only the requested change, respecting scope boundaries.
6. **Update [`AGENT_LOG.md`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/AGENT_LOG.md)** with a concise summary of changes, decisions, and open items.
7. **Never** silently convert assumptions or inferences into confirmed project requirements.

---

## 7. Current Project State

- **Stage**: Local execution prototype verified; deployment/integration in progress. Current authorization is [execution override](docs/ASTRA/EXECUTION_OVERRIDE_2026-10-16.md).
- **Pitch Deck V1 (Baseline)**: 25-slide deck in [`presentations/v1/code/`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/presentations/v1/code/) with PDF in [`presentations/v1/pdf/LabTrack_Pitch_Deck_v1.pdf`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/presentations/v1/pdf/LabTrack_Pitch_Deck_v1.pdf).
- **Pitch Deck V1.1 (Refined)**: 26-slide refined deck in [`presentations/v1.1/code/`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/presentations/v1.1/code/) with PDF in [`presentations/v1.1/pdf/LabTrack_Pitch_Deck_v1.1.pdf`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/presentations/v1.1/pdf/LabTrack_Pitch_Deck_v1.1.pdf).
- **Implementation**: Application source is in `src/backend/` and `src/frontend/`. See [validation report](docs/execution/VALIDATION_REPORT.md) for actual outcomes, blocked policy and unverified services.
- **Current presentation**:22-slide editable PPTX and offline browser viewer in `presentations/v2/output/`; historical pitch versions are preserved and carry no product authority.
- **SDD**: [Approved canonical baseline](docs/architecture/LabTrack_SDD.md), state SDD_APPROVED; explicit user approval recorded in ASTRA gates, with unresolved policy boundaries retained.

---

## 8. Explicit Current Boundary

> **IMPORTANT:** Preserve pitch versions V1/V1.1. Current project/presentation execution is authorized; unresolved business policy cannot be invented. SDD approval remains separate from execution authorization. Use current requirements and the design draft, never pitch architecture, to guide implementation.
