# LabTrack — AI Agent Continuity Log

This file is a high-density, chronological record of decisions, file reorganizations, and project state transitions for downstream AI agents. Every agent completing meaningful work must append a new entry following the template below.

---

## 2026-10-05 — LabTrack Pitch Deck V1.1 Release

**Summary**
Created and compiled LabTrack Pitch Deck V1.1 (`presentations/v1.1/`) incorporating 24 comprehensive factual, architectural, domain-model, and academic defensibility fixes without modifying the V1 baseline. Generated `presentations/v1.1/pdf/LabTrack_Pitch_Deck_v1.pdf` (26 slides).

**Decisions**
- Preserved `presentations/v1/` as an immutable baseline.
- Added new "Why LabTrack is more than inventory" conceptual ladder slide.
- Added new "Research Context & Literature Survey" slide satisfying CCE evaluation requirements.
- Restructured lifecycle into a branching model from Active Issue (Reminders, Extensions, FIFO Reservations).
- Explicitly separated state model into Catalogue Stock Status, Physical Inventory State, and Request/Reservation State.
- Grounded AI advisory capabilities with database validation flow and strict "never inventory authority" guardrail.
- Standardized DCDS Lab ESE rubric mapping to the official 10 marks / 40% criteria.
- Condensed faculty decisions to the top 8 P0 institutional policy questions.

**Changes**
- Created `presentations/v1.1/code/` with updated `src/slides.js`, `src/style.css`, and `export-pdf.js`.
- Generated `presentations/v1.1/pdf/LabTrack_Pitch_Deck_v1.1.pdf` (26 slides, 2.8 MB).
- Verified clean build (`npm run build`) and clean headless Puppeteer export.

**Open Items**
- Present V1.1 deck for faculty review and obtain guidance on P0 policy decisions (UAQ1, UAQ5, UAQ7, UAQ12, UAQ13, UAQ16, UAQ17, UAQ18).
- Proceed to application scaffold in `src/`.

**Next Context**
Both V1 (`presentations/v1/`) and V1.1 (`presentations/v1.1/`) artifacts are available and tracked in the repository.

---

## 2026-10-03 — GitHub Repository Created and Initial Push

**Summary**
Created public GitHub repository `irxchand/LabTrack` using `gh` CLI with authenticated credentials. Initialized Git locally on `main` branch, configured remote origin `https://github.com/irxchand/LabTrack.git`, committed all baseline documentation, presentation files, and `src/.gitkeep`, and pushed to GitHub.

**Decisions**
- Repository URL: `https://github.com/irxchand/LabTrack`.
- Default branch: `main`.

**Changes**
- Initialized local Git repository (`git init -b main`).
- Added remote origin `https://github.com/irxchand/LabTrack.git`.
- Committed and pushed initial baseline commit.

**Open Items**
- Frontend teammate reviewing deck UI and content.
- Architectural planning and backend setup in `src/`.

**Next Context**
The project repository is live on GitHub at `https://github.com/irxchand/LabTrack`.

---

## 2026-10-03 — CCE Evaluation Plan Added to Documentation

**Summary**
Registered the newly added CCE evaluation document `docs/Evaluation_Plan_Cloud_Computing_Essentials.pdf` into the project repository structure and updated `README.md`.

**Decisions**
- `docs/Evaluation_Plan_Cloud_Computing_Essentials.pdf` is tracked as an official academic reference alongside `docs/DCDSL Evaluation Plan_with detailed rubrics.pdf`.

**Changes**
- Updated `README.md` repository tree to include `Evaluation_Plan_Cloud_Computing_Essentials.pdf` under `docs/`.

**Open Items**
- Frontend teammate reviewing deck UI and content.
- Architectural planning and backend setup in `src/`.

**Next Context**
Documentation under `docs/` now includes both DCDS and CCE evaluation plans.

---

## 2026-10-03 — Complete Removal of Personal Documents Context

**Summary**
Removed all remaining references to personal documents, marksheets, degree certificates, and CVs across repository documentation and the master context file. Refactored the final section of `docs/LabTrack_MASTER_CONTEXT.md` into a clean, technical viva strategy focusing on core computer science topics (Data Structures, Security, AI Guardrails, Data Mining, Concurrency) without any reference to academic transcripts.

**Decisions**
- Zero references to personal documents, marksheets, or external credentials remain anywhere in the project documentation or codebase.
- `.gitignore` retains standard patterns excluding credentials, secrets, build artifacts, and media.
- The master context's viva section focuses exclusively on software engineering depth areas.

**Changes**
- Updated `docs/LabTrack_MASTER_CONTEXT.md` to replace marksheet-based strategy with a pure Technical Depth & Viva Strategy section.
- Updated `README.md` to remove all references to personal document folders or academic credential files.
- Updated `.gitignore` to use clean, standard development exclusion rules.

**Open Items**
- Frontend teammate reviewing deck UI and content.
- Architectural planning and backend setup in `src/`.

**Next Context**
The repository is completely clean of any personal document references. Next steps focus on architecture planning for `src/`.

---

## 2026-10-03 — Presentation Versioning & Code/PDF Separation

**Summary**
Refined the presentation directory structure to enforce explicit versioning (`presentations/v1/`) and separate the interactive presentation code from compiled PDF exports. The Vite project now resides in `presentations/v1/code/` and the compiled PDF lives in `presentations/v1/pdf/LabTrack_Pitch_Deck_v1.pdf`. The headless PDF generator script and README documentation were updated accordingly.

**Decisions**
- Presentation assets follow explicit version directories: `presentations/<version>/`.
- Web application code lives under `code/` within each version folder (`presentations/v1/code/`).
- Compiled PDF exports live under `pdf/` within each version folder (`presentations/v1/pdf/LabTrack_Pitch_Deck_v1.pdf`).
- Neither presentation source code nor exported PDFs reside directly at the root of `presentations/` or `docs/`.

**Changes**
- Moved Vite presentation project to `presentations/v1/code/`.
- Moved compiled presentation PDF to `presentations/v1/pdf/LabTrack_Pitch_Deck_v1.pdf`.
- Updated `presentations/v1/code/export-pdf.js` to output to `../pdf/LabTrack_Pitch_Deck_v1.pdf`.
- Verified clean build (`npm run build`) in `presentations/v1/code/`.
- Updated `README.md` directory tree and naming contracts.

**Open Items**
- Frontend teammate reviewing deck UI and content.
- Architectural planning and backend setup in `src/`.

**Next Context**
Presentation files are strictly organized into `presentations/v1/code/` and `presentations/v1/pdf/`. Do not edit presentation contents without explicit user direction.

---

## 2026-10-03 — Repository Structure & Context Baseline Setup

**Summary**
Standardized the LabTrack repository structure to separate core documentation, presentation assets, and future application source code. The master context document was renamed to `docs/LabTrack_MASTER_CONTEXT.md` to serve as the singular deep source of truth. An empty `src/` directory with a `.gitkeep` placeholder was established for future application code without prematurely locking in framework implementations.

**Decisions**
- `docs/` is strictly reserved for project specifications and official academic rubrics.
- `src/` is the sole future home for application implementation code.
- Pitch Deck content and UI are frozen from agent modification while a frontend teammate performs independent refinement.

**Changes**
- Renamed `docs/LabTrack_COMPLETE_Master_Context_Doc.md` → `docs/LabTrack_MASTER_CONTEXT.md`.
- Copied official rubric `DCDSL Evaluation Plan_with detailed rubrics.pdf` → `docs/`.
- Created `src/.gitkeep`.
- Created comprehensive root `.gitignore` covering node modules, python venv/cache, and secrets.
- Created `README.md` containing repository navigation, hierarchy, terminology, naming contracts, and agent guidelines.
- Created `AGENT_LOG.md`.

**Open Items**
- Finalize application technology stack and framework selection (FastAPI vs alternative).
- Finalize specific MongoDB schema and role (audit logs, telemetry, unmet-demand analytics).
- Obtain faculty / college resolution on Priority 0 questions (UAQ1, UAQ2, UAQ5, UAQ7, UAQ8, UAQ12, UAQ13, UAQ16, UAQ17, UAQ18).
- Resolve academic 4-member team registration requirement vs 2-member implementation team.

**Next Context**
The repository baseline is fully established and clean. The pitch deck is currently under external review by a frontend teammate—do not edit files in `presentations/` unless specifically directed. Next development steps will focus on addressing architectural planning and backend setup in `src/`.
