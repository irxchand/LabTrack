# LABTRACK / DCDS — REFERENCE ROUTER (V2)
Version: 2026-10-28. Purpose: persistent, *one-time* context for working on **one slide at a time** in a continuous Gemini chat, using the user's actual screenshot and a connected Google Slides creation/editing app if available.

## [INDEX] Which file answers which question?
| Reference | Owns | Consult when |
|---|---|---|
| `00_REFERENCE_ROUTER.md` | Priority, conflict resolution, interactions, document pointers | Every new slide request |
| `01_PROJECT_AND_TECHNICAL_TRUTH.md` | Purpose, architecture, modules, role assignments, implementation status and future vision | Facts, technical terminology, diagram arrows |
| `02_OFFICIAL_SLIDES_RUBRIC_AND_UNIT3.md` | Exact faculty 13-slide sequence, slide-specific story, official marks, Unit 3 mapping | Picking content for any slide |
| `03_STYLE_PROOF_AND_SPEAKING.md` | Template-consistent visual system, pointer density, diagram grammar, evidence placeholders and live-demo story | Layout, editable diagramming, live screenshots, speaking notes |
| `DCDS_ESE_Project_Presentation_Template.pptx` | **Binding physical template: slide order, headings, footer and layout boundaries** | Attach as a separate stage; use as base in Slides |
| New user screenshot of slide N | Most recent visual/layout and intended slide being edited | Each per-slide creation or edit request |
| New user QA/schema/query evidence | Latest verified factual state, overrides earlier provisional runtime assumptions | Before inserting any successful outputs |

Keep these FOUR reference markdown files in the same Gemini chat. The user will upload the faculty PPTX and slide screenshots later. Do not request a new upload of all reference files for every slide. If a new chat starts, context must be uploaded again.

## [PRECEDENCE] Resolve conflicts carefully
1. Official faculty **presentation template** controls the required 13 headings/order and footer; official DCDS **rubric** controls assessment (2+2+2+2+1+1 = 10).
2. Explicit newer user instruction controls style, implementation intent, project ownership and future vision, *not* the truth of unverified executions.
3. New dated, demonstrable test logs, schema dumps, terminal output and QA evidence control actual execution claims.
4. `01_PROJECT_AND_TECHNICAL_TRUTH.md` describes current/recent architecture, with status qualifiers.
5. Slide storyboard and style files control content/layout recommendations, subject to #1–4.
6. Older CCE decks or Gemini-generated summaries are historical references, never stronger than real evidence.

When sources disagree: state the discrepancy in one line and mark the claim `PENDING VERIFICATION`; do not silently choose a convenient success claim. Never convert screenshots of a designed UI or flowchart into evidence that a backend ran.

## [WORK MODE] Distinct states
- **Stage A / Ingest:** Read the 4 docs once; make short reference index, no slide creation.
- **Stage B / Template:** Ingest the faculty PPTX; confirm 13-slide map/constraints, no slide creation.
- **Stage C / Style lock:** Calibrate design, typography, pointer/speaking conventions, no slide creation.
- **Stage D / Slide build:** User supplies screenshot + slide number + Google Slides destination. Build **that one slide only**, preserving faculty heading/order. If authorized connected Google Slides tools are available, create/edit native shapes/text. Otherwise explicitly say creation unavailable and supply a copy-paste-ready slide specification.
- **Stage E / Revision:** Revise only the named slide, not the whole deck.
- **Stage F / Evidence refresh:** When new real artifacts arrive, update only affected slide claims/slots, no automatic redesign unless requested.
- **Stage G / Final audit:** After all slides, audit 13-slide compliance, rubric, editability and truth.

## [INPUT FORMAT] Minimal prompt on each slide
The user normally sends: `Work on Slide 08; use attached screenshot; target Google Slides [link]; build the editable slide.`
Only ask a clarifying question if a blocking fact such as the Google Slides destination or connector permission is missing. Use references by **filename + stable label**: e.g., `02 > [S08]` and `03 > [LAYOUT]`, not full re-pasted context.

## [NONNEGOTIABLE]
- Project content = LabTrack DCDS ESE, not generic equipment database samples.
- PowerPoint template is mandatory; cosmetic redesign is allowed only within its academic structure.
- **Pointers, not theory paragraphs**. Diagrams should carry explanation visually; speaker notes may hold fuller narrative.
- Live **Aiven MySQL** is a chosen target, not verified migrated by existing context. **MongoDB Atlas** is user-reported cloud-active; per-feature operation and aggregates await evidence. **Raghu's frontend QA is pending**. Mark all unproven outputs as placeholders.
- The user leads systems/backend; Raghu leads frontend; database work shared. Live demonstration is expected. Future vision = **SIT institutional deployment**.
- Do not modify LabTrack code, databases, credentials, student records or external infrastructure from slide-design prompts.
- A Google Slides app/connector may or may not be available in Gemini. Do not claim to have created/edited a Google Slides file without a real returned file/link.
- Do not paste sensitive data, live credentials, PRNs, session tokens or personally identifying examples into presentations.
