# LABTRACK / DCDS — STYLE, PROOF & SPEAKER SYSTEM (V2)
Use with `00_REFERENCE_ROUTER.md`, `02_OFFICIAL_SLIDES_RUBRIC_AND_UNIT3.md` and the uploaded faculty PPTX. This document governs *how* to build ONE editable slide, not what to claim about an unverified runtime.

## [DESIGN] Visual thesis
`LabTrack — precise database/system engineering`. Clean high-end systems-review design, **not** a flashy product launch or heavy textbook presentation. High contrast, disciplined alignment, sparse pointers, attractive crisp flowcharts, clean code/result panels. Preserve official faculty 13-slide headings, footer and requested content. The template wins where visual styling conflicts with a mandatory field.

## [PALETTE] User-approved colors
| Name | Hex | Where |
|---|---|---|
| Midnight navy | `#111827` | Cover, architecture, execution evidence, conclusion/closing if compatible with template |
| Dark slate | `#0F172A` | Dark headings/panels |
| Electric teal | `#23C8B7` | Primary action, selected data-flow arrow, emphasis; success only with proof |
| Deep teal | `#0D9488` | Secondary connector, DB outline, section strip |
| Mist | `#F8FAFC` | Analytical slide background |
| Snow | `#F1F5F9` | Text/panels on dark |
| Steel | `#64748B` | Metadata, neutral labels |
| Hairline | `#CBD5E1` | Borders, unselected connectors |
| Amber | `#E2A24A` | `PENDING`, `UNVERIFIED`, `TARGET` state, never green check |

Prefer dark slides 1,4,9,11,12 and light slides 2,3,5,6,7,8,10,13 **only where this remains coherent with the official PPTX**. Never force color overrides that obscure faculty footer/required headings. In Google Slides use theme colors/custom HEX consistently, not random palette drift.

## [TYPE] Fonts available across PowerPoint / Google Slides
- **Headings:** `Arial` or `Aptos` fallback. Avoid requiring proprietary/unavailable fonts. Use `Arial` as safest Google Slides/PowerPoint cross-platform default; use consistent 28–34pt depending on template typography.
- **Body pointers:** `Arial`, 17–21pt; short verbal cues, not paragraphs. Bold only terms that need emphasis.
- **Code/SQL:** `Consolas` if available, otherwise `Courier New`, 13–16pt; monospaced actual code, max ~6–10 visible lines in total. No 8pt wall of code.
- **Footer:** preserve required faculty footer with legible 9–11pt equivalent, not erased by redesign.
- Keep same title hierarchy/line spacing in all slides.

## [POINTERS] Main text contract — VERY IMPORTANT
- **Main slide is a cue card for spoken explanation**: ideally 3–5 pointers, each 3–9 words (hard ceiling ~12 words unless a required technical label).
- NO theory paragraphs, pseudo-academic introduction sentences, copy-and-pasted lesson definitions, expository bullets or dense prose.
- Exactly one **spoken takeaway**, preferably 6–12 words, may appear beneath the main heading if useful.
- For Slides 6, 7, 8, 9, let diagrams, schema, code and genuine outputs carry the meaning. 1–3 pointer tags are enough.
- Full reasoning goes into 1–3 short **speaker-note prompts** per slide, written as what the two presenters should say, not read verbatim.
- Do not invent numerical results, screenshots, status flags or business adoption metrics to make the slide look complete.

### [POINTER-EXAMPLES] Bad → Good
- BAD: `A relational database uses foreign keys to establish relationships among multiple entities to normalize the database and avoid data redundancy.`
- GOOD: `PK/FK-driven relational integrity`
- BAD: `We have used MongoDB because it is a flexible database which is very powerful at handling unstructured data.`
- GOOD: `Flexible documents: component specs, notifications`
- BAD: `The system then connects to backend servers and accesses the database in a reliable manner.`
- GOOD: `React → FastAPI → SQLAlchemy → MySQL`

## [LAYOUT] Native Google Slides construction rules
- 16:9 same canvas as faculty PPTX (~13.33 × 7.5 in).
- Outer margins ~0.5in, stable title/section/footer anchors from template; do not make new mandatory sections.
- A single primary visual focal point and at most two dominant columns (3 okay for an actual 3-step roadmap).
- Create text, lines, arrows, boxes, flowchart nodes, annotations, tables and highlighted result panels as **editable Google Slides elements**, not rasterized composite pictures. Real user-supplied screenshots may be images within native editable frames.
- Align on visible grid with equal gaps; avoid gradients, lens flares, neon decoration and overbusy background assets.
- The specific slide screenshot uploaded by user controls the starting **composition** and slide-number identity. Improve legibility and completeness; do not blindly replicate a low-quality arrangement when redesign was requested.
- Preserve the official slide's heading, academic placeholders and footer; output should feel like a professional adaptation of the template, not a wholly different deck.

## [DIAGRAM] Crisp diagram grammar
| Entity | Editable visual | Semantics |
|---|---|---|
| Browser / React | rounded rectangle with monitor icon/label | End user action |
| FastAPI/Python | central rectangular processing block | Validation and domain business logic |
| SQLAlchemy | small labelled adapter edge/block | ORM database session/transaction |
| Aiven MySQL | outlined cylinder, teal | **Authoritative transaction state**; amber `TARGET` until confirmed live |
| PyMongo/worker | small adapter and outbox block | Event projection, asynchronous when applicable |
| MongoDB Atlas | document-stack/cylinder distinct from SQL | **Flexible documents/events**, user-reported cloud running |
| Request path | continuous solid arrow | Synchronous API request |
| Outbox→Atlas | dashed arrow | Async projection; not same atomic transaction |
| Future SIT | gray/teal dotted timeline nodes | Aspirational, not active deployment |

- Flowchart max ~6–8 primary nodes per slide; straighten connectors; avoid arrow crossings; consistent corner-radius and arrowheads.
- ER diagrams: readable 8–10 table subgraph, Crow's Foot where editable/possible; label `PK`, `FK`, cardinality and unique association. Do not invent table column names. Full 21-table schema belongs in report/backup.
- Normalization: one **genuine, easily traceable** FD/decomposition example, not a page of 1NF-5NF theory.
- Query presentation: `business question` → `short verified query` → `observed result` (or visibly labelled pending evidence slot).

## [EVIDENCE] Claim classifications and placeholder labels
- `VERIFIED-LIVE`: current actual screenshot, terminal output, query execution, QA/test report from connected runtime. Can show success if truly proven.
- `SOURCE-CONFIRMED`: code/script exists, but execution not proven. Use `Implemented in source / run pending` if relevant.
- `USER-REPORTED`: user describes functional runtime, no direct artifact yet. `Reported working / QA incoming`.
- `PENDING`: work or proof forthcoming; never display invented output.
- `FUTURE`: SIT pilot / QR-RFID / forecasting; show clearly future.
- `DISPUTED`: source disagreement; label neutral and ask for latest evidence.

Exact useful slots:
`[INSERT VERIFIED MY SQL RESULT]` (prefer `[INSERT VERIFIED MYSQL RESULT]`), `[INSERT VERIFIED MONGODB AGGREGATION]`, `[INSERT REAL FRONTEND SCREENSHOT]`, `[INSERT QA REPORT / CURRENT PYTEST OUTPUT]`, `[INSERT FINAL ER DIAGRAM]`, `[INSERT ACTUAL HTTP/DB TRACE]`, `[GROUP / GUIDE DETAILS PENDING]`.

Evidence need not dominate the slide: use a well-designed labeled rectangular slot with corner tags, not large error messages. Screenshots must be user-supplied, not generated imitation; diagrams are conceptual, clearly labeled as such.

## [SPEAKING] Role and 10-minute demo style
**Presenter A**: problem framing, backend/Python architecture, SQL/NoSQL database division, schema, normalization, SQL transaction and error/test analysis.
**Raghu**: frontend journey, UX and on-screen operations; shared SQL/Mongo portions should show both contributed.
**Live demo**: one safe request from UI; show API request if available, MySQL record, Mongo projection when actual event exists, then one controlled unauthorized/invalid operation; no destructive master Excel reimport or simulated success claim. The 10-minute total may include live demo: keep slide speaking compact; slide 13 essentially unspoken.

Suggested order of speech: slides 1–3 ~1m; 4–5 ~1m; 6–7 ~1.5m; 8 ~1m; 9 + live demo ~3.5m; 10–11 ~1m; 12/13 ~1m (flex to actual timer). Avoid hard commitments on timings until trial run.

## [REVIEW] One-slide signoff gates
Before reporting Google Slides creation:
1. Is the **correct numbered slide** from the official template the only slide changed?
2. Are required heading/footer/academic placeholders present, correct, and readable?
3. Does the design match colors/fonts/layout rhythm, not override the official template?
4. Are text elements short spoken cues, not a theory dump?
5. Are all diagrams editable; are arrows and database responsibilities technically honest?
6. Is there any invented outcome, green PASS, query row, screenshot, current Aiven deployment, or fake SIT approval?
7. Does the slide contain source/evidence slots and 1–3 brief optional speaker-note cues?
8. Is the Google Slides link/slide ID real and accessible? If no tool write occurred, state that explicitly.

## [DESIGN LIBRARY] Recommended compositions by slide
- S01: dark split hero; identity left, simple 4-node flow right.
- S02: pain-point columns plus one small transformation arrow.
- S03: five objective cards + scope band.
- S04: center architecture, mini lifecycle below.
- S05: stack table + two DB rationale cards.
- S06: white ER model with one teal-highlighted request path.
- S07: BEFORE/AFTER FD reduction with PK/FK legend.
- S08: left MySQL query/result, right Mongo pipeline/result, thin Python bridge.
- S09: proof board: UI + API + SQL + NoSQL in one trace.
- S10: observed test matrix; amber pending labels where needed.
- S11: three-stage SIT deployment roadmap; future distinct from demonstrated.
- S12: clean `Questions?` plus real sources.
- S13: compact checklist matching faculty wording.
