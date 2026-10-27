# ASTRA open decision register

Version: 1.0 | 2026-10-07 | AWAITING_USER_VALIDATION

Every item is OPEN. Named owners are source-recorded project/institutional responsibility or proposed routing for validation, not delegated work. “Blocks SDD” means blocks a complete deterministic specification in the affected area; all authoring is independently blocked by Gate 1 until explicit validation. Production-only details can remain deferred with an explicit boundary. No alternative below is selected merely by being listed first.

## OD-01 — SDD structural identity

- **Decision/question:** Is SRC-03 the original supplied structural reference, or is another original missing?
- **Reason it matters:** Only one equivalent structure found; literal phrase exists only in protocol. SRC-03 says Execution Baseline but no ASTRA approval exists.
- **Evidence/finding:** F-01; SRC-01 SDD STRUCTURAL AUTHORITY asks for original Standard SDD Structure; SRC-03 title and sections 0–42 provide an equivalent deterministic template.
- **Affected requirements:** REQ-LT-0081, REQ-LT-0082.
- **Affected architecture:** Persistent review and approval records.
- **Current alternatives:** SRC-03 entire structure versus another user-supplied reference; no replacement invented.
- **Current assumption/interpretation (not approved):** Preserve entire template as minimum candidate baseline. Current user gate and SRC-01 override any implication of approval from template title.
- **Decision owner:** User / Ishaan.
- **Blocks SDD authoring:** Yes: structural identity confirmation.
- **Status:** OPEN — awaiting explicit validation/decision.
- **Resolution / decision date / approval evidence:** None.

## OD-02 — Current-source authority and raw-note limits

- **Decision/question:** Do current working-copy decisions accurately capture subsequent user/faculty clarifications?
- **Reason it matters:** Notes say HoD for almost all components and bad consumables can be tracked or not; context specifies all normal requests and bad tracking enabled, plus many later decisions absent from raw notes.
- **Evidence/finding:** F-02; SRC-04 raw faculty notes versus SRC-02 A3/AW/BL and SRC-03; current working copy differs from HEAD.
- **Affected requirements:** REQ-LT-0001, REQ-LT-0011, REQ-LT-0014, REQ-LT-0072, REQ-LT-0082, REQ-LT-0084.
- **Affected architecture:** Catalogue, asset, per-lab stock; Department/product boundary; Persistent review and approval records.
- **Current alternatives:** Validate recorded current decisions; identify specific corrections or supporting minutes.
- **Current assumption/interpretation (not approved):** Use current context as recorded project understanding, not proof every detail is faculty-confirmed. Do not infer undocumented exceptions; request validation of expanded rules.
- **Decision owner:** User / Ishaan; faculty where institutional.
- **Blocks SDD authoring:** Yes: source authority and conflicted core rules.
- **Status:** OPEN — awaiting explicit validation/decision.
- **Resolution / decision date / approval evidence:** None.

## OD-03 — Recipient matrix inconsistency

- **Decision/question:** Confirm AA6 supersedes UAQ16 open wording and clarify record-only versus delivered recipients
- **Reason it matters:** Same context labels recipient mapping both open and locked; Mentor rejection wording differs between AA6 and template.
- **Evidence/finding:** F-03; SRC-02 UAQ16 says escalation mapping still requires final rule; U/AA6/UAQ32 explicitly lock recipient matrix; SRC-03 §21 broadly corroborates.
- **Affected requirements:** REQ-LT-0034, REQ-LT-0056.
- **Affected architecture:** SQL outbox, Mongo in-app/delivery, EmailProvider; Scheduler, due-date version, notification obligation.
- **Current alternatives:** AA6 current matrix; revised matrix; no inference of extra recipients.
- **Current assumption/interpretation (not approved):** UAQ32 explicitly names AA6 normative, so tentatively prefer AA6 as recorded current intent; this is not a silently approved resolution.
- **Decision owner:** User / Ishaan.
- **Blocks SDD authoring:** Yes for final notification specification.
- **Status:** OPEN — awaiting explicit validation/decision.
- **Resolution / decision date / approval evidence:** None.

## OD-04 — Reservation, hold and approval clocks

- **Decision/question:** When does 24h start, what is held, at what inventory/lab level, how are partial shortages/head-of-line blocking handled, and what approval is needed after FULFILABLE?
- **Reason it matters:** 24h reservation expiry lacks start anchor; approval has 48h window; holds are released but creation/ownership/stock effect undefined; no exact reservation-to-approval bridge.
- **Evidence/finding:** F-04; SRC-02 V/U1/L1/UAQ26; SRC-03 §§13–14.
- **Affected requirements:** REQ-LT-0019, REQ-LT-0025, REQ-LT-0035, REQ-LT-0036, REQ-LT-0037, REQ-LT-0039.
- **Affected architecture:** Fulfilment plan; lab/stock; Queue, possible hold, stock/type; Request, approval timeline; Request/reservation/hold.
- **Current alternatives:** Queue-age versus ready-for-collection clock; priority-only versus quantity/unit hold; request/order or reservation-level scope.
- **Current assumption/interpretation (not approved):** Keep both configurable durations, but do not choose their start or precedence. A queue place is not evidence of a stock hold.
- **Decision owner:** User / Ishaan; faculty for queue policy.
- **Blocks SDD authoring:** Yes for reservation/expiry semantics.
- **Status:** OPEN — awaiting explicit validation/decision.
- **Resolution / decision date / approval evidence:** None.

## OD-05 — Project revisions and membership authority

- **Decision/question:** Which changes invalidate approvals, who can transfer lead or submit on behalf, and how does membership affect custody?
- **Reason it matters:** Lead submission is recorded; lead transfer, member consent/removal, number of mentors and edits after submission are not fully specified.
- **Evidence/finding:** F-05; SRC-02 F/UAQ23; SRC-03 §3.
- **Affected requirements:** REQ-LT-0002, REQ-LT-0003, REQ-LT-0004, REQ-LT-0023.
- **Affected architecture:** Project, membership, requirements; Request, approval timeline.
- **Current alternatives:** Immutable submitted revision with resubmission versus controlled amendment/reapproval; mentor multiplicity rules.
- **Current assumption/interpretation (not approved):** Do not infer that editing a submitted requirement preserves prior approval.
- **Decision owner:** User / Ishaan.
- **Blocks SDD authoring:** Yes for project/request lifecycle.
- **Status:** OPEN — awaiting explicit validation/decision.
- **Resolution / decision date / approval evidence:** None.

## OD-06 — Approval state granularity and role overlap

- **Decision/question:** Are requests split by class/lab, who reviews multi-lab assets, can one person perform successive approvals, and what does rejection affect?
- **Reason it matters:** Class-specific review collapses into REVIEW; mixed-class/multi-lab requests, multiple In-Charges, rejection scope and combined roles lack deterministic paths.
- **Evidence/finding:** F-06; SRC-02 Q0/O/E3/UAQ5; SRC-03 §§8–10.
- **Affected requirements:** REQ-LT-0007, REQ-LT-0009, REQ-LT-0020, REQ-LT-0021, REQ-LT-0023, REQ-LT-0024, REQ-LT-0025, REQ-LT-0055.
- **Affected architecture:** Affected record and append-only audit; Order, issue, stock/asset, SQL transaction; Request, approval timeline.
- **Current alternatives:** Separate linked child requests versus one aggregate with parallel reviews; explicit per-stage approval regardless of person.
- **Current assumption/interpretation (not approved):** Preserve both routes and normal HoD final approval. Same person holding two roles is configurable, but bypassing a stage is not authorized.
- **Decision owner:** User / Ishaan; faculty.
- **Blocks SDD authoring:** Yes for approval state model.
- **Status:** OPEN — awaiting explicit validation/decision.
- **Resolution / decision date / approval evidence:** None.

## OD-07 — Operational claims

- **Decision/question:** How is an abandoned claim released/reassigned, and can another assistant complete it?
- **Reason it matters:** First authorized claim is specified; abandoned claim, expiry/reassignment and claim/issue races lack recovery policy.
- **Evidence/finding:** F-07; SRC-02 UAQ24/27; SRC-03 §§4.4/11.
- **Affected requirements:** REQ-LT-0008, REQ-LT-0026.
- **Affected architecture:** Operational order and lab mapping; Order, issue, stock/asset, SQL transaction.
- **Current alternatives:** Manual authorized reassignment versus configured lease; retain claim until explicit release.
- **Current assumption/interpretation (not approved):** Single ownership intent is clear; no lease duration or stealing rule is inferred.
- **Decision owner:** User / Ishaan.
- **Blocks SDD authoring:** Yes for operational ownership/recovery.
- **Status:** OPEN — awaiting explicit validation/decision.
- **Resolution / decision date / approval evidence:** None.

## OD-08 — Overwrite versus scoped FIFO override

- **Decision/question:** Confirm scoped FIFO exception and how HoD correction preserves stock, prior approvals and physical-event truth
- **Reason it matters:** HoD-only overwrite coexists with Assistant FIFO override; broad overwrite coexists with immutable history and physical terminal events.
- **Evidence/finding:** F-08; SRC-02 E6/V/AG; SRC-03 §§4.4/4.5/13/28.
- **Affected requirements:** REQ-LT-0009, REQ-LT-0038, REQ-LT-0064.
- **Affected architecture:** Affected record and append-only audit; Queue, possible hold, stock/type.
- **Current alternatives:** Scoped actions plus audited compensating corrections versus a newly defined broader override policy.
- **Current assumption/interpretation (not approved):** Tentatively distinguish explicit scoped queue action from general overwrite. Preserve append-only historical correction; broad access does not specify every legal physical correction.
- **Decision owner:** User / Ishaan; faculty.
- **Blocks SDD authoring:** Yes for permission/invariant boundary.
- **Status:** OPEN — awaiting explicit validation/decision.
- **Resolution / decision date / approval evidence:** None.

## OD-09 — Fulfilment allocation precision

- **Decision/question:** Define per-component allocation ordering, available q after holds, asset participation and replan effects on In-Charge approval
- **Reason it matters:** Subset objective/tie-break are given, but allocation from selected labs uses undefined concentration order; first feasible subset wording can be misread as skipping equal-size comparison; asset feasibility/hold exclusion unclear.
- **Evidence/finding:** F-09; SRC-02 I1/K/L; SRC-03 §7.
- **Affected requirements:** REQ-LT-0016, REQ-LT-0017, REQ-LT-0018, REQ-LT-0019, REQ-LT-0021.
- **Affected architecture:** Catalogue and availability boundary; Fulfilment plan; lab/stock; Request, approval timeline.
- **Current alternatives:** Enumerate all equal-size feasible subsets then score; choose explicit allocation policy; reapprove versus preserve authorization on replan.
- **Current assumption/interpretation (not approved):** Use minimum cardinality then stated score then lab ID as recorded intent; do not invent per-line allocation order or asset-count rules.
- **Decision owner:** User / Ishaan.
- **Blocks SDD authoring:** Yes for deterministic planning.
- **Status:** OPEN — awaiting explicit validation/decision.
- **Resolution / decision date / approval evidence:** None.

## OD-10 — Multi-lab physical issue atomicity

- **Decision/question:** Is all-or-reject per lab order or whole project request, and what happens if one lab has already handed items over?
- **Reason it matters:** All-or-reject is stated at approved-order level; orders group by lab but request may span labs. SQL atomicity cannot undo hardware already handed over at another lab.
- **Evidence/finding:** F-10; SRC-02 I1/P/L1/BL6; SRC-03 §11.
- **Affected requirements:** REQ-LT-0014, REQ-LT-0015, REQ-LT-0024, REQ-LT-0026, REQ-LT-0027, REQ-LT-0028, REQ-LT-0035, REQ-LT-0039, REQ-LT-0040, REQ-LT-0043.
- **Affected architecture:** Catalogue, asset, per-lab stock; Order, issue, stock/asset, SQL transaction; Queue, possible hold, stock/type; Request/reservation/hold; Return, inspection, original issue, asset/stock.
- **Current alternatives:** Per-lab child-order atomicity with aggregate progress versus coordinated whole-request issue; explicit physical compensation.
- **Current assumption/interpretation (not approved):** No automatic partial fulfilment is retained. Aggregate/order boundary and physical handover recovery remain undefined.
- **Decision owner:** User / Ishaan; lab/faculty.
- **Blocks SDD authoring:** Yes for issue/cancel/return aggregate semantics.
- **Status:** OPEN — awaiting explicit validation/decision.
- **Resolution / decision date / approval evidence:** None.

## OD-11 — Time, extensions and reminder recovery

- **Decision/question:** What timezone/day semantics apply, which due-date version owns obligations, can overdue extensions be approved, and does restart send every missed reminder?
- **Reason it matters:** Day 0 overdue versus daily after due, timezone/cutoffs, late approvals, extension/return races, old notification versions and catch-up policy undefined.
- **Evidence/finding:** F-11; SRC-02 R/S/T/U/U1/V/BL10; SRC-03 §30.
- **Affected requirements:** REQ-LT-0030, REQ-LT-0031, REQ-LT-0032, REQ-LT-0033, REQ-LT-0034, REQ-LT-0037, REQ-LT-0068.
- **Affected architecture:** Extension and due-date history; Issue/use due-date version; Queue, possible hold, stock/type; Scheduler, due-date version, notification obligation.
- **Current alternatives:** Elapsed-hour versus calendar-day thresholds; consolidated versus per-obligation catch-up; explicit version-aware suppression.
- **Current assumption/interpretation (not approved):** 5-day pre-due and daily post-due intent is clear; 7d/24h/48h/2-extension values stay configurable. Chat timezone is not automatically system policy.
- **Decision owner:** User / Ishaan.
- **Blocks SDD authoring:** Yes for scheduling/extension behavior.
- **Status:** OPEN — awaiting explicit validation/decision.
- **Resolution / decision date / approval evidence:** None.

## OD-12 — Audit/outbox/delivery durability

- **Decision/question:** Where is canonical audit, how are delivery/replay/idempotency keys retained, and what happens on Mongo outage or ambiguous Gmail send?
- **Reason it matters:** Audit must be atomic with SQL mutation but Mongo also holds activity/events; canonical audit residence, event schemas, consumer recovery and external-email ambiguous acknowledgement are unspecified.
- **Evidence/finding:** F-12; SRC-02 L1/AA/AG/BL2/BL3; SRC-03 §§11/21/23.
- **Affected requirements:** REQ-LT-0027, REQ-LT-0029, REQ-LT-0052, REQ-LT-0053, REQ-LT-0054, REQ-LT-0055, REQ-LT-0064, REQ-LT-0067, REQ-LT-0068, REQ-LT-0079.
- **Affected architecture:** Affected record and append-only audit; Error catalog, tests, traceability; MySQL and MongoDB; Order, issue, stock/asset, SQL transaction; Request, approval timeline; SQL outbox, Mongo in-app/delivery, EmailProvider; Scheduler, due-date version, notification obligation.
- **Current alternatives:** Durable SQL audit plus Mongo projection versus another transactionally backed audit representation; explicit at-least-once delivery recovery policy.
- **Current assumption/interpretation (not approved):** SQL domain truth/outbox and independent delivery are recorded. Do not claim exactly-once external email from a deduplication key alone.
- **Decision owner:** Ishaan / technical owner.
- **Blocks SDD authoring:** Yes for durability/error contracts.
- **Status:** OPEN — awaiting explicit validation/decision.
- **Resolution / decision date / approval evidence:** None.

## OD-13 — REPO scope and mathematical semantics

- **Decision/question:** Confirm score/NLP V1 scope; if included settle uncertain attribution, missing severity, per-student/team liability and recurrence/correction semantics
- **Reason it matters:** Current document says numeric score not required/future yet locks formula and threshold. Confirmed-only language conflicts with A=0.5 uncertain contributions. No severity for DEFECT_WHEN_STUDENT_ATTRIBUTABLE; recurrence recomputation after void unclear.
- **Evidence/finding:** F-13; SRC-02 A3/UAQ15/AK/AW19 versus Z/UAQ29/AW48–50/BE; SRC-03 §20 supports score.
- **Affected requirements:** REQ-LT-0046, REQ-LT-0047, REQ-LT-0048, REQ-LT-0049, REQ-LT-0050, REQ-LT-0051.
- **Affected architecture:** Incident ledger; optional score.
- **Current alternatives:** Incident-only flag; formula without NLP; full recorded explainable score/NLP with corrected rules.
- **Current assumption/interpretation (not approved):** Keep incident history and nonpunitive authorized visibility; numeric score/NLP remain conflicted candidates, not silently adopted. Detailed later wording suggests intent but lacks dated precedence proof.
- **Decision owner:** User / Ishaan; faculty for accountability policy.
- **Blocks SDD authoring:** Yes for accountability scope.
- **Status:** OPEN — awaiting explicit validation/decision.
- **Resolution / decision date / approval evidence:** None.

## OD-14 — Prototype authentication and identity integration

- **Decision/question:** What prototype login/session model is intended; how are role changes/revocations applied? Production SSO/master-data source remains deferred
- **Reason it matters:** AuthProvider is locked boundary, but no prototype session/token/login/revocation specification or institutional API exists.
- **Evidence/finding:** F-14; SRC-02 AD/E2/AE/UAQ1/2; SRC-03 §§25/28/37.
- **Affected requirements:** REQ-LT-0005, REQ-LT-0006, REQ-LT-0010, REQ-LT-0054, REQ-LT-0061, REQ-LT-0062, REQ-LT-0063, REQ-LT-0083.
- **Affected architecture:** API authorization/project/lab scope; Persistent review and approval records; SQL outbox, Mongo in-app/delivery, EmailProvider; User, roles, mappings, AuthProvider.
- **Current alternatives:** Explicit local synthetic login/session model versus controlled demo identity selection with server-side authorization; future IT SSO adapter.
- **Current assumption/interpretation (not approved):** Synthetic V1 adapter is sufficient boundary intent; historical pitch login/JWT details have zero authority.
- **Decision owner:** Ishaan; IT administrator for production.
- **Blocks SDD authoring:** Yes for V1 auth specification; production protocol No.
- **Status:** OPEN — awaiting explicit validation/decision.
- **Resolution / decision date / approval evidence:** None.

## OD-15 — Inventory administration and analytics access

- **Decision/question:** Which existing roles maintain catalogue/stock/compatibility mappings and view demand? What fields/visibility can students see?
- **Reason it matters:** Central Store is not user role but intended demand recipient; authorized inventory administrators not mapped to exact roles; stock correction/catalogue/compatibility ownership undefined.
- **Evidence/finding:** F-15; SRC-02 E7/O/M/AB/AG/UAQ21/25.
- **Affected requirements:** REQ-LT-0010, REQ-LT-0012, REQ-LT-0013, REQ-LT-0022, REQ-LT-0048, REQ-LT-0056, REQ-LT-0060, REQ-LT-0063.
- **Affected architecture:** API authorization/project/lab scope; Catalogue, asset, per-lab stock; Incident ledger; optional score; Request, approval timeline; SQL outbox, Mongo in-app/delivery, EmailProvider; Unmet-demand events and Mongo analytics; User, roles, mappings, AuthProvider.
- **Current alternatives:** Explicit existing-role permission matrix versus user-authorized new role; no default choice.
- **Current assumption/interpretation (not approved):** Do not invent Central Store user or give unrestricted inventory writes to technical admin.
- **Decision owner:** User / Ishaan; departmental owner.
- **Blocks SDD authoring:** Yes for administration/access model.
- **Status:** OPEN — awaiting explicit validation/decision.
- **Resolution / decision date / approval evidence:** None.

## OD-16 — Return, repair, retention and custody closure

- **Decision/question:** Who approves retention/repair, how is custody assigned to team members, and can issues close before acknowledgement or after staged returns?
- **Reason it matters:** Inspection fields and stock arithmetic specified, but partial/staged returns, excess returns, return-to-other-lab, acknowledgement refusal, retained-project approver and repair verifier unclear.
- **Evidence/finding:** F-16; SRC-02 W/X/Q/UAQ14; SRC-03 §§17–19.
- **Affected requirements:** REQ-LT-0040, REQ-LT-0041, REQ-LT-0042, REQ-LT-0043, REQ-LT-0044, REQ-LT-0045, REQ-LT-0046, REQ-LT-0065.
- **Affected architecture:** Asset or good/bad stock, repair history; Incident ledger; optional score; Issue closure, project and inventory; ObjectStorageAdapter and metadata; Return, inspection, original issue, asset/stock.
- **Current alternatives:** Per-line cumulative reconciliation versus one final return; explicit retention authorization and acknowledgement semantics.
- **Current assumption/interpretation (not approved):** Retained item stays unavailable with no second decrement. Closed-as-returned wording must not restore availability; physical return and administrative closure are distinct.
- **Decision owner:** User / Ishaan; lab/faculty.
- **Blocks SDD authoring:** Yes for reconciliation state model.
- **Status:** OPEN — awaiting explicit validation/decision.
- **Resolution / decision date / approval evidence:** None.

## OD-17 — Evidence storage and retention

- **Decision/question:** Define V1 evidence failure/exception semantics and access rules; leave institutional retention durations explicitly deferred if intended
- **Reason it matters:** S3 adapter and metadata boundary specified; upload failure, authorization, size/type constraints, orphan cleanup, exception authority and retention durations absent.
- **Evidence/finding:** F-17; SRC-02 W1/AG/UAQ19/33; SRC-03 §27/29.
- **Affected requirements:** REQ-LT-0065, REQ-LT-0079, REQ-LT-0083.
- **Affected architecture:** Error catalog, tests, traceability; ObjectStorageAdapter and metadata; Persistent review and approval records.
- **Current alternatives:** Upload-before-finalize versus pending-evidence flow; configured authorized exception; later production retention policy.
- **Current assumption/interpretation (not approved):** Do not silently complete damaged-asset inspection without required evidence or an authorized exception.
- **Decision owner:** Ishaan; institutional owner for retention.
- **Blocks SDD authoring:** Yes for V1 upload semantics; production durations No.
- **Status:** OPEN — awaiting explicit validation/decision.
- **Resolution / decision date / approval evidence:** None.

## OD-18 — Optional AI scope and missing adapter

- **Decision/question:** Is AI required in demo, what happens when absent, and where is adapter contract? Who validates compatibility metadata?
- **Reason it matters:** AI called optional/not priority while BrowserAPIFree selected and AI ranking appears in alternatives pipeline; no BrowserAPIFree source/contract in repo.
- **Evidence/finding:** F-18; SRC-02 N/AK/BL1 and M/UAQ31; SRC-03 §22.
- **Affected requirements:** REQ-LT-0051, REQ-LT-0057, REQ-LT-0058, REQ-LT-0059.
- **Affected architecture:** Curated mappings, LLM adapter, live validator; Incident ledger; optional score.
- **Current alternatives:** Deterministic-only baseline with optional adapter versus required advisory feature; explicit offline/error fallback.
- **Current assumption/interpretation (not approved):** Adapter choice is recorded intent, not verified capability. Deterministic candidate/DB guardrails apply if enabled; implementation detail cannot silently make optional AI mandatory.
- **Decision owner:** User / Ishaan.
- **Blocks SDD authoring:** Yes for AI scope; adapter detail blocks enabled integration only.
- **Status:** OPEN — awaiting explicit validation/decision.
- **Resolution / decision date / approval evidence:** None.

## OD-19 — Data import/export and academic query evidence

- **Decision/question:** Which seed/import/export operations and meaningful procedure/aggregation/report will demonstrate academic requirements?
- **Reason it matters:** Excel import deferred while controlled Python import/export is required; exact file format, validation/rollback, procedures/pipelines and operational reporting scope undefined.
- **Evidence/finding:** F-19; SRC-02 AC/BL11; SRC-03 §36; SRC-05 pp2–3.
- **Affected requirements:** REQ-LT-0060, REQ-LT-0061, REQ-LT-0073, REQ-LT-0074.
- **Affected architecture:** Evidence, queries/reports, documentation; Unmet-demand events and Mongo analytics; User, roles, mappings, AuthProvider.
- **Current alternatives:** CSV/JSON controlled prototype data flow versus approved Excel subset; explicitly selected domain reports.
- **Current assumption/interpretation (not approved):** File handling need not imply full Excel/notebook migration. Do not choose business reports merely to satisfy a rubric by invention.
- **Decision owner:** Ishaan / academic project owners.
- **Blocks SDD authoring:** Yes for application data/academic feature scope.
- **Status:** OPEN — awaiting explicit validation/decision.
- **Resolution / decision date / approval evidence:** None.

## OD-20 — Missing contracts and readiness overclaim

- **Decision/question:** Resolve recorded business gaps, then define API generation authority, event/error schemas and measurable acceptance/reliability criteria during approved design
- **Reason it matters:** No API/schema/migration/test artifacts exist; operation error states, validation limits and measurable service targets incomplete. No core questions claim is not supported by audit.
- **Evidence/finding:** F-20; SRC-02 AV claims no core questions remain; BL15/BM require deterministic details; SRC-03 §§24/29/34/38/41; actual SRC-10 only placeholder.
- **Affected requirements:** REQ-LT-0066, REQ-LT-0067, REQ-LT-0079, REQ-LT-0080, REQ-LT-0085.
- **Affected architecture:** Error catalog, tests, traceability; MySQL and MongoDB; Persistent review and approval records; REST/OpenAPI and generated clients.
- **Current alternatives:** FastAPI-generated snapshot versus contract-first workflow with one canonical authority; agreed quality targets rather than invented SLA.
- **Current assumption/interpretation (not approved):** Mark DESIGN-INCOMPLETE, not implemented or implementation-ready. Paths in template are requirements to produce later, not existing files.
- **Decision owner:** Ishaan / user.
- **Blocks SDD authoring:** Yes for deterministic SDD; API detail can be designed only after gate.
- **Status:** OPEN — awaiting explicit validation/decision.
- **Resolution / decision date / approval evidence:** None.

## OD-21 — Deployment and single-writer recovery

- **Decision/question:** Confirm three-cloud demo extent and operational limits; define controlled promotion, backup restore and readiness evidence
- **Reason it matters:** AWS/Azure/GCP roles specified but services/budget/network/backup/restore/promotion fencing/RPO/RTO unspecified; SCHEDULER_ENABLED alone is not split-brain protection.
- **Evidence/finding:** F-21; SRC-02 AF/AK/BL12/C; SRC-03 §26/30.
- **Affected requirements:** REQ-LT-0068, REQ-LT-0069, REQ-LT-0070, REQ-LT-0071, REQ-LT-0076, REQ-LT-0078, REQ-LT-0083.
- **Affected architecture:** Containers, cloud adapters, scheduler; Department/product boundary; Evidence, queries/reports, documentation; Persistent review and approval records; Scheduler, due-date version, notification obligation.
- **Current alternatives:** Recorded three environments with isolated secondary data versus explicitly revised demonstration scope; manual fenced promotion.
- **Current assumption/interpretation (not approved):** Record chosen roles without redesigning stack or claiming deployed/DR capability. Approximate broader scope is not measured R&A capacity.
- **Decision owner:** User / Ishaan; institutional IT for production.
- **Blocks SDD authoring:** Yes for deployment demonstration boundary; production infrastructure No.
- **Status:** OPEN — awaiting explicit validation/decision.
- **Resolution / decision date / approval evidence:** None.

## OD-22 — Academic provenance, team and dates

- **Decision/question:** Confirm registration evidence and intended delivery target; identify actual literature sources/full syllabus if needed for coverage
- **Reason it matters:** Four-member/same-division registration claim absent in supplied rubric; about-15-day target undated; CCE tentative 19 Oct and DCDS 26–30 Oct; no actual cited literature bibliography/full syllabus.
- **Evidence/finding:** F-22; SRC-02 AL/AN versus SRC-05 pp1–3 and SRC-06 pp1–2.
- **Affected requirements:** REQ-LT-0073, REQ-LT-0075, REQ-LT-0076, REQ-LT-0077, REQ-LT-0083.
- **Affected architecture:** Evidence, queries/reports, documentation; Persistent review and approval records.
- **Current alternatives:** Existing implementation owners retained; obtain academic registration clarification; use official tentative dates until changed.
- **Current assumption/interpretation (not approved):** Treat official PDFs as academic authority, team registration as unverified, dates as tentative. Cloud and all-provider demonstration are project goals, not PDF mandates.
- **Decision owner:** User / academic faculty.
- **Blocks SDD authoring:** No for prototype core design; Yes if scope/deadline depends on it.
- **Status:** OPEN — awaiting explicit validation/decision.
- **Resolution / decision date / approval evidence:** None.

## Production-only deferrals retained from original UAQs

| Existing UAQ | Open subject | Decision mapping | V1 boundary |
|---|---|---|---|
| UAQ1 | Institutional SSO/protocol/session integration | OD-14 | Synthetic replaceable auth now; V1 session contract still needed |
| UAQ2 | Institutional master-data source/sync | OD-14/19 | Synthetic replaceable dataset; controlled import scope still needed |
| UAQ9+ | Additional institutional asset-history fields | OD-16/20 | Preserve current unit/transaction history |
| UAQ16+ | Production recipient changes | OD-03/11 | Validate recorded V1 matrix; do not invent future policy |
| UAQ17 | Production PII/security/cloud approval | OD-14/17/21 | Synthetic cloud prototype only |
| UAQ18 | College server/VM infrastructure | OD-21 | Portable prototype; no production rollout claim |
| UAQ19 | Audit/backup retention duration | OD-12/17/21 | No invented retention period; V1 backup/recovery semantics still open |
| UAQ22 | Long-term institutional ownership | OD-22 | Do not hard-code developers as permanent owners |
| UAQ33+ | Photo retention duration | OD-17 | Replaceable storage; V1 evidence correctness still required |

## Immediate validation focus

1. Confirm SRC-03 is the intended structural baseline and SRC-02/SRC-03 represent current recorded decisions (OD-01/02).
2. Resolve REPO/NLP scope and stale recipient wording (OD-03/13/18).
3. Clarify reservation/hold clocks, mixed/multi-lab approval and physical issue/return boundaries (OD-04/06/09/10/16).
4. Confirm remaining questions are genuine gaps, or point to the missing existing decisions. V1 integration/technical choices must be explicitly delegated to later design rather than silently inferred.

Approval is not recorded by creation of this register. No new decision is considered accepted.
