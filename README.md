# LabTrack — Hardware Component Availability, Issuance & Tracking System

> **One-line description:** Turning fragmented laboratory hardware handling into a traceable digital lifecycle—from project requirements and availability through approval, physical issuance, reminders, reservation, return, inspection, and accountability.

**Current Status:** Repository baseline established. Pitch deck source and PDF export structured under `presentations/` (currently under frontend review). Application implementation in `src/` pending final architecture confirmation.

---

## 1. Repository Structure

```
LabTrack/
├── README.md                          # Repository instructions & developer/agent entry point
├── AGENT_LOG.md                       # Chronological continuity log for AI agents
├── .gitignore                         # Git exclusion rules (dependencies, secrets, personal files)
│
├── docs/                              # Project context and authoritative reference materials ONLY
│   ├── LabTrack_MASTER_CONTEXT.md     # Primary source-of-truth context document
│   ├── DCDSL Evaluation Plan_with detailed rubrics.pdf  # Academic evaluation reference (DCDS)
│   └── Evaluation_Plan_Cloud_Computing_Essentials.pdf  # Academic evaluation reference (CCE)
│
├── presentations/                     # Presentation artifacts and pitch-deck projects ONLY
│   ├── v1/                            # Presentation version 1 (baseline)
│   │   ├── code/                      # Interactive presentation web app (Vite project)
│   │   │   ├── src/                   # Presentation slide definitions and design system
│   │   │   ├── index.html             # Presentation stage and controls
│   │   │   ├── export-pdf.js          # Headless PDF export automation script
│   │   │   └── package.json           # Vite project configuration
│   │   └── pdf/                       # Compiled PDF presentation exports
│   │       └── LabTrack_Pitch_Deck_v1.pdf  # Compiled 25-slide baseline deck (PDF)
│   │
│   └── v1.1/                          # Presentation version 1.1 (fact-checked & refined)
│       ├── code/                      # Interactive presentation web app (Vite project)
│       │   ├── src/                   # Refined slide definitions and design system
│       │   ├── index.html             # Presentation stage and controls
│       │   ├── export-pdf.js          # Headless PDF export automation script
│       │   └── package.json           # Vite project configuration
│       └── pdf/                       # Compiled PDF presentation exports
│           └── LabTrack_Pitch_Deck_v1.1.pdf # Compiled 26-slide refined deck (PDF)
│
└── src/                               # Application source code (reserved for implementation)
    └── .gitkeep                       # Placeholder until implementation starts
```

---

## 2. Context Bootstrap for AI Agents and Contributors

Before making any substantive design, architectural, or code changes:

1. **Read [`docs/LabTrack_MASTER_CONTEXT.md`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/LabTrack_MASTER_CONTEXT.md)**: This is the authoritative master context document containing the complete lifecycle, business logic, inventory model, user roles, and faculty questions.
2. **Read [`AGENT_LOG.md`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/AGENT_LOG.md)**: Check recent decisions, changes, open items, and continuity notes.

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

- **Stage**: V1.1 Release & Faculty Proposal Review.
- **Pitch Deck V1 (Baseline)**: 25-slide deck in [`presentations/v1/code/`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/presentations/v1/code/) with PDF in [`presentations/v1/pdf/LabTrack_Pitch_Deck_v1.pdf`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/presentations/v1/pdf/LabTrack_Pitch_Deck_v1.pdf).
- **Pitch Deck V1.1 (Refined)**: 26-slide refined deck in [`presentations/v1.1/code/`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/presentations/v1.1/code/) with PDF in [`presentations/v1.1/pdf/LabTrack_Pitch_Deck_v1.1.pdf`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/presentations/v1.1/pdf/LabTrack_Pitch_Deck_v1.1.pdf).
- **Implementation**: The `src/` directory is reserved for application code. Implementation will proceed following faculty consultation on P0 questions.

---

## 8. Explicit Current Boundary

> **IMPORTANT:** Pitch Deck V1 and V1.1 are version-controlled assets. Do not overwrite V1 baseline when introducing future presentation revisions. Application source implementation in `src/` remains the next active development phase.
