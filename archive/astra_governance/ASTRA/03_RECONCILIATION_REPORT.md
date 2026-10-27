# ASTRA reconciliation report

Version: 1.0 | 2026-10-07 | AWAITING_USER_VALIDATION

Scope: current non-pitch sources, raw discussion evidence, academic authorities, historical repository log and working-copy state. **Pitch artifacts are excluded from requirements/architecture reconciliation by USER-02. Their discrepancies are not decisions for the user to resolve.** No upstream source has been rewritten to conceal a conflict.

## Authority applied

SRC-05/06 are official academic evaluation authority, not departmental workflow policy. SRC-04 is raw faculty-discussion evidence with limited wording. SRC-02 reports subsequent faculty/user decisions but mixes older and newer statements without per-decision dates. SRC-03 has minimum structural authority and overlapping behavioral claims, not proof of ASTRA approval. SRC-08 is execution history, not permission to implement now. Current user instructions/SRC-01 govern the gate. A more detailed or later-positioned passage is not automatically a more authoritative passage.

## F-01 — SDD structural identity [AMBIGUOUS]

- **Source A / Source B / location:** SRC-01 SDD STRUCTURAL AUTHORITY asks for original Standard SDD Structure; SRC-03 title and sections 0–42 provide an equivalent deterministic template.
- **Exact conflict or gap:** Only one equivalent structure found; literal phrase exists only in protocol. SRC-03 says Execution Baseline but no ASTRA approval exists.
- **Authority of sources:** Apply the source-specific hierarchy above; competing passages inside SRC-02 share claimed current authority and lack separate dated approval evidence. Missing details have no authoritative value to select.
- **Current interpretation and precedence reason:** Preserve entire template as minimum candidate baseline. Current user gate and SRC-01 override any implication of approval from template title.
- **User confirmation required:** Yes, for the specific question in OD-01; no resolution is recorded.
- **Affected requirements:** REQ-LT-0081, REQ-LT-0082.
- **Decision:** OD-01.

## F-02 — Current-source authority and raw-note limits [AMBIGUOUS]

- **Source A / Source B / location:** SRC-04 raw faculty notes versus SRC-02 A3/AW/BL and SRC-03; current working copy differs from HEAD.
- **Exact conflict or gap:** Notes say HoD for almost all components and bad consumables can be tracked or not; context specifies all normal requests and bad tracking enabled, plus many later decisions absent from raw notes.
- **Authority of sources:** Apply the source-specific hierarchy above; competing passages inside SRC-02 share claimed current authority and lack separate dated approval evidence. Missing details have no authoritative value to select.
- **Current interpretation and precedence reason:** Use current context as recorded project understanding, not proof every detail is faculty-confirmed. Do not infer undocumented exceptions; request validation of expanded rules.
- **User confirmation required:** Yes, for the specific question in OD-02; no resolution is recorded.
- **Affected requirements:** REQ-LT-0001, REQ-LT-0011, REQ-LT-0014, REQ-LT-0072, REQ-LT-0082, REQ-LT-0084.
- **Decision:** OD-02.

## F-03 — Recipient matrix inconsistency [CONFLICT]

- **Source A / Source B / location:** SRC-02 UAQ16 says escalation mapping still requires final rule; U/AA6/UAQ32 explicitly lock recipient matrix; SRC-03 §21 broadly corroborates.
- **Exact conflict or gap:** Same context labels recipient mapping both open and locked; Mentor rejection wording differs between AA6 and template.
- **Authority of sources:** Apply the source-specific hierarchy above; competing passages inside SRC-02 share claimed current authority and lack separate dated approval evidence. Missing details have no authoritative value to select.
- **Current interpretation and precedence reason:** UAQ32 explicitly names AA6 normative, so tentatively prefer AA6 as recorded current intent; this is not a silently approved resolution.
- **User confirmation required:** Yes, for the specific question in OD-03; no resolution is recorded.
- **Affected requirements:** REQ-LT-0034, REQ-LT-0056.
- **Decision:** OD-03.

## F-04 — Reservation, hold and approval clocks [MISSING]

- **Source A / Source B / location:** SRC-02 V/U1/L1/UAQ26; SRC-03 §§13–14.
- **Exact conflict or gap:** 24h reservation expiry lacks start anchor; approval has 48h window; holds are released but creation/ownership/stock effect undefined; no exact reservation-to-approval bridge.
- **Authority of sources:** Apply the source-specific hierarchy above; competing passages inside SRC-02 share claimed current authority and lack separate dated approval evidence. Missing details have no authoritative value to select.
- **Current interpretation and precedence reason:** Keep both configurable durations, but do not choose their start or precedence. A queue place is not evidence of a stock hold.
- **User confirmation required:** Yes, for the specific question in OD-04; no resolution is recorded.
- **Affected requirements:** REQ-LT-0019, REQ-LT-0025, REQ-LT-0035, REQ-LT-0036, REQ-LT-0037, REQ-LT-0039.
- **Decision:** OD-04.

## F-05 — Project revisions and membership authority [MISSING]

- **Source A / Source B / location:** SRC-02 F/UAQ23; SRC-03 §3.
- **Exact conflict or gap:** Lead submission is recorded; lead transfer, member consent/removal, number of mentors and edits after submission are not fully specified.
- **Authority of sources:** Apply the source-specific hierarchy above; competing passages inside SRC-02 share claimed current authority and lack separate dated approval evidence. Missing details have no authoritative value to select.
- **Current interpretation and precedence reason:** Do not infer that editing a submitted requirement preserves prior approval.
- **User confirmation required:** Yes, for the specific question in OD-05; no resolution is recorded.
- **Affected requirements:** REQ-LT-0002, REQ-LT-0003, REQ-LT-0004, REQ-LT-0023.
- **Decision:** OD-05.

## F-06 — Approval state granularity and role overlap [MISSING]

- **Source A / Source B / location:** SRC-02 Q0/O/E3/UAQ5; SRC-03 §§8–10.
- **Exact conflict or gap:** Class-specific review collapses into REVIEW; mixed-class/multi-lab requests, multiple In-Charges, rejection scope and combined roles lack deterministic paths.
- **Authority of sources:** Apply the source-specific hierarchy above; competing passages inside SRC-02 share claimed current authority and lack separate dated approval evidence. Missing details have no authoritative value to select.
- **Current interpretation and precedence reason:** Preserve both routes and normal HoD final approval. Same person holding two roles is configurable, but bypassing a stage is not authorized.
- **User confirmation required:** Yes, for the specific question in OD-06; no resolution is recorded.
- **Affected requirements:** REQ-LT-0007, REQ-LT-0009, REQ-LT-0020, REQ-LT-0021, REQ-LT-0023, REQ-LT-0024, REQ-LT-0025, REQ-LT-0055.
- **Decision:** OD-06.

## F-07 — Operational claims [MISSING]

- **Source A / Source B / location:** SRC-02 UAQ24/27; SRC-03 §§4.4/11.
- **Exact conflict or gap:** First authorized claim is specified; abandoned claim, expiry/reassignment and claim/issue races lack recovery policy.
- **Authority of sources:** Apply the source-specific hierarchy above; competing passages inside SRC-02 share claimed current authority and lack separate dated approval evidence. Missing details have no authoritative value to select.
- **Current interpretation and precedence reason:** Single ownership intent is clear; no lease duration or stealing rule is inferred.
- **User confirmation required:** Yes, for the specific question in OD-07; no resolution is recorded.
- **Affected requirements:** REQ-LT-0008, REQ-LT-0026.
- **Decision:** OD-07.

## F-08 — Overwrite versus scoped FIFO override [AMBIGUOUS]

- **Source A / Source B / location:** SRC-02 E6/V/AG; SRC-03 §§4.4/4.5/13/28.
- **Exact conflict or gap:** HoD-only overwrite coexists with Assistant FIFO override; broad overwrite coexists with immutable history and physical terminal events.
- **Authority of sources:** Apply the source-specific hierarchy above; competing passages inside SRC-02 share claimed current authority and lack separate dated approval evidence. Missing details have no authoritative value to select.
- **Current interpretation and precedence reason:** Tentatively distinguish explicit scoped queue action from general overwrite. Preserve append-only historical correction; broad access does not specify every legal physical correction.
- **User confirmation required:** Yes, for the specific question in OD-08; no resolution is recorded.
- **Affected requirements:** REQ-LT-0009, REQ-LT-0038, REQ-LT-0064.
- **Decision:** OD-08.

## F-09 — Fulfilment allocation precision [AMBIGUOUS]

- **Source A / Source B / location:** SRC-02 I1/K/L; SRC-03 §7.
- **Exact conflict or gap:** Subset objective/tie-break are given, but allocation from selected labs uses undefined concentration order; first feasible subset wording can be misread as skipping equal-size comparison; asset feasibility/hold exclusion unclear.
- **Authority of sources:** Apply the source-specific hierarchy above; competing passages inside SRC-02 share claimed current authority and lack separate dated approval evidence. Missing details have no authoritative value to select.
- **Current interpretation and precedence reason:** Use minimum cardinality then stated score then lab ID as recorded intent; do not invent per-line allocation order or asset-count rules.
- **User confirmation required:** Yes, for the specific question in OD-09; no resolution is recorded.
- **Affected requirements:** REQ-LT-0016, REQ-LT-0017, REQ-LT-0018, REQ-LT-0019, REQ-LT-0021.
- **Decision:** OD-09.

## F-10 — Multi-lab physical issue atomicity [AMBIGUOUS]

- **Source A / Source B / location:** SRC-02 I1/P/L1/BL6; SRC-03 §11.
- **Exact conflict or gap:** All-or-reject is stated at approved-order level; orders group by lab but request may span labs. SQL atomicity cannot undo hardware already handed over at another lab.
- **Authority of sources:** Apply the source-specific hierarchy above; competing passages inside SRC-02 share claimed current authority and lack separate dated approval evidence. Missing details have no authoritative value to select.
- **Current interpretation and precedence reason:** No automatic partial fulfilment is retained. Aggregate/order boundary and physical handover recovery remain undefined.
- **User confirmation required:** Yes, for the specific question in OD-10; no resolution is recorded.
- **Affected requirements:** REQ-LT-0014, REQ-LT-0015, REQ-LT-0024, REQ-LT-0026, REQ-LT-0027, REQ-LT-0028, REQ-LT-0035, REQ-LT-0039, REQ-LT-0040, REQ-LT-0043.
- **Decision:** OD-10.

## F-11 — Time, extensions and reminder recovery [MISSING]

- **Source A / Source B / location:** SRC-02 R/S/T/U/U1/V/BL10; SRC-03 §30.
- **Exact conflict or gap:** Day 0 overdue versus daily after due, timezone/cutoffs, late approvals, extension/return races, old notification versions and catch-up policy undefined.
- **Authority of sources:** Apply the source-specific hierarchy above; competing passages inside SRC-02 share claimed current authority and lack separate dated approval evidence. Missing details have no authoritative value to select.
- **Current interpretation and precedence reason:** 5-day pre-due and daily post-due intent is clear; 7d/24h/48h/2-extension values stay configurable. Chat timezone is not automatically system policy.
- **User confirmation required:** Yes, for the specific question in OD-11; no resolution is recorded.
- **Affected requirements:** REQ-LT-0030, REQ-LT-0031, REQ-LT-0032, REQ-LT-0033, REQ-LT-0034, REQ-LT-0037, REQ-LT-0068.
- **Decision:** OD-11.

## F-12 — Audit/outbox/delivery durability [MISSING]

- **Source A / Source B / location:** SRC-02 L1/AA/AG/BL2/BL3; SRC-03 §§11/21/23.
- **Exact conflict or gap:** Audit must be atomic with SQL mutation but Mongo also holds activity/events; canonical audit residence, event schemas, consumer recovery and external-email ambiguous acknowledgement are unspecified.
- **Authority of sources:** Apply the source-specific hierarchy above; competing passages inside SRC-02 share claimed current authority and lack separate dated approval evidence. Missing details have no authoritative value to select.
- **Current interpretation and precedence reason:** SQL domain truth/outbox and independent delivery are recorded. Do not claim exactly-once external email from a deduplication key alone.
- **User confirmation required:** Yes, for the specific question in OD-12; no resolution is recorded.
- **Affected requirements:** REQ-LT-0027, REQ-LT-0029, REQ-LT-0052, REQ-LT-0053, REQ-LT-0054, REQ-LT-0055, REQ-LT-0064, REQ-LT-0067, REQ-LT-0068, REQ-LT-0079.
- **Decision:** OD-12.

## F-13 — REPO scope and mathematical semantics [CONFLICT]

- **Source A / Source B / location:** SRC-02 A3/UAQ15/AK/AW19 versus Z/UAQ29/AW48–50/BE; SRC-03 §20 supports score.
- **Exact conflict or gap:** Current document says numeric score not required/future yet locks formula and threshold. Confirmed-only language conflicts with A=0.5 uncertain contributions. No severity for DEFECT_WHEN_STUDENT_ATTRIBUTABLE; recurrence recomputation after void unclear.
- **Authority of sources:** Apply the source-specific hierarchy above; competing passages inside SRC-02 share claimed current authority and lack separate dated approval evidence. Missing details have no authoritative value to select.
- **Current interpretation and precedence reason:** Keep incident history and nonpunitive authorized visibility; numeric score/NLP remain conflicted candidates, not silently adopted. Detailed later wording suggests intent but lacks dated precedence proof.
- **User confirmation required:** Yes, for the specific question in OD-13; no resolution is recorded.
- **Affected requirements:** REQ-LT-0046, REQ-LT-0047, REQ-LT-0048, REQ-LT-0049, REQ-LT-0050, REQ-LT-0051.
- **Decision:** OD-13.

## F-14 — Prototype authentication and identity integration [MISSING]

- **Source A / Source B / location:** SRC-02 AD/E2/AE/UAQ1/2; SRC-03 §§25/28/37.
- **Exact conflict or gap:** AuthProvider is locked boundary, but no prototype session/token/login/revocation specification or institutional API exists.
- **Authority of sources:** Apply the source-specific hierarchy above; competing passages inside SRC-02 share claimed current authority and lack separate dated approval evidence. Missing details have no authoritative value to select.
- **Current interpretation and precedence reason:** Synthetic V1 adapter is sufficient boundary intent; historical pitch login/JWT details have zero authority.
- **User confirmation required:** Yes, for the specific question in OD-14; no resolution is recorded.
- **Affected requirements:** REQ-LT-0005, REQ-LT-0006, REQ-LT-0010, REQ-LT-0054, REQ-LT-0061, REQ-LT-0062, REQ-LT-0063, REQ-LT-0083.
- **Decision:** OD-14.

## F-15 — Inventory administration and analytics access [MISSING]

- **Source A / Source B / location:** SRC-02 E7/O/M/AB/AG/UAQ21/25.
- **Exact conflict or gap:** Central Store is not user role but intended demand recipient; authorized inventory administrators not mapped to exact roles; stock correction/catalogue/compatibility ownership undefined.
- **Authority of sources:** Apply the source-specific hierarchy above; competing passages inside SRC-02 share claimed current authority and lack separate dated approval evidence. Missing details have no authoritative value to select.
- **Current interpretation and precedence reason:** Do not invent Central Store user or give unrestricted inventory writes to technical admin.
- **User confirmation required:** Yes, for the specific question in OD-15; no resolution is recorded.
- **Affected requirements:** REQ-LT-0010, REQ-LT-0012, REQ-LT-0013, REQ-LT-0022, REQ-LT-0048, REQ-LT-0056, REQ-LT-0060, REQ-LT-0063.
- **Decision:** OD-15.

## F-16 — Return, repair, retention and custody closure [MISSING]

- **Source A / Source B / location:** SRC-02 W/X/Q/UAQ14; SRC-03 §§17–19.
- **Exact conflict or gap:** Inspection fields and stock arithmetic specified, but partial/staged returns, excess returns, return-to-other-lab, acknowledgement refusal, retained-project approver and repair verifier unclear.
- **Authority of sources:** Apply the source-specific hierarchy above; competing passages inside SRC-02 share claimed current authority and lack separate dated approval evidence. Missing details have no authoritative value to select.
- **Current interpretation and precedence reason:** Retained item stays unavailable with no second decrement. Closed-as-returned wording must not restore availability; physical return and administrative closure are distinct.
- **User confirmation required:** Yes, for the specific question in OD-16; no resolution is recorded.
- **Affected requirements:** REQ-LT-0040, REQ-LT-0041, REQ-LT-0042, REQ-LT-0043, REQ-LT-0044, REQ-LT-0045, REQ-LT-0046, REQ-LT-0065.
- **Decision:** OD-16.

## F-17 — Evidence storage and retention [MISSING]

- **Source A / Source B / location:** SRC-02 W1/AG/UAQ19/33; SRC-03 §27/29.
- **Exact conflict or gap:** S3 adapter and metadata boundary specified; upload failure, authorization, size/type constraints, orphan cleanup, exception authority and retention durations absent.
- **Authority of sources:** Apply the source-specific hierarchy above; competing passages inside SRC-02 share claimed current authority and lack separate dated approval evidence. Missing details have no authoritative value to select.
- **Current interpretation and precedence reason:** Do not silently complete damaged-asset inspection without required evidence or an authorized exception.
- **User confirmation required:** Yes, for the specific question in OD-17; no resolution is recorded.
- **Affected requirements:** REQ-LT-0065, REQ-LT-0079, REQ-LT-0083.
- **Decision:** OD-17.

## F-18 — Optional AI scope and missing adapter [AMBIGUOUS]

- **Source A / Source B / location:** SRC-02 N/AK/BL1 and M/UAQ31; SRC-03 §22.
- **Exact conflict or gap:** AI called optional/not priority while BrowserAPIFree selected and AI ranking appears in alternatives pipeline; no BrowserAPIFree source/contract in repo.
- **Authority of sources:** Apply the source-specific hierarchy above; competing passages inside SRC-02 share claimed current authority and lack separate dated approval evidence. Missing details have no authoritative value to select.
- **Current interpretation and precedence reason:** Adapter choice is recorded intent, not verified capability. Deterministic candidate/DB guardrails apply if enabled; implementation detail cannot silently make optional AI mandatory.
- **User confirmation required:** Yes, for the specific question in OD-18; no resolution is recorded.
- **Affected requirements:** REQ-LT-0051, REQ-LT-0057, REQ-LT-0058, REQ-LT-0059.
- **Decision:** OD-18.

## F-19 — Data import/export and academic query evidence [MISSING]

- **Source A / Source B / location:** SRC-02 AC/BL11; SRC-03 §36; SRC-05 pp2–3.
- **Exact conflict or gap:** Excel import deferred while controlled Python import/export is required; exact file format, validation/rollback, procedures/pipelines and operational reporting scope undefined.
- **Authority of sources:** Apply the source-specific hierarchy above; competing passages inside SRC-02 share claimed current authority and lack separate dated approval evidence. Missing details have no authoritative value to select.
- **Current interpretation and precedence reason:** File handling need not imply full Excel/notebook migration. Do not choose business reports merely to satisfy a rubric by invention.
- **User confirmation required:** Yes, for the specific question in OD-19; no resolution is recorded.
- **Affected requirements:** REQ-LT-0060, REQ-LT-0061, REQ-LT-0073, REQ-LT-0074.
- **Decision:** OD-19.

## F-20 — Missing contracts and readiness overclaim [MISSING]

- **Source A / Source B / location:** SRC-02 AV claims no core questions remain; BL15/BM require deterministic details; SRC-03 §§24/29/34/38/41; actual SRC-10 only placeholder.
- **Exact conflict or gap:** No API/schema/migration/test artifacts exist; operation error states, validation limits and measurable service targets incomplete. No core questions claim is not supported by audit.
- **Authority of sources:** Apply the source-specific hierarchy above; competing passages inside SRC-02 share claimed current authority and lack separate dated approval evidence. Missing details have no authoritative value to select.
- **Current interpretation and precedence reason:** Mark DESIGN-INCOMPLETE, not implemented or implementation-ready. Paths in template are requirements to produce later, not existing files.
- **User confirmation required:** Yes, for the specific question in OD-20; no resolution is recorded.
- **Affected requirements:** REQ-LT-0066, REQ-LT-0067, REQ-LT-0079, REQ-LT-0080, REQ-LT-0085.
- **Decision:** OD-20.

## F-21 — Deployment and single-writer recovery [MISSING]

- **Source A / Source B / location:** SRC-02 AF/AK/BL12/C; SRC-03 §26/30.
- **Exact conflict or gap:** AWS/Azure/GCP roles specified but services/budget/network/backup/restore/promotion fencing/RPO/RTO unspecified; SCHEDULER_ENABLED alone is not split-brain protection.
- **Authority of sources:** Apply the source-specific hierarchy above; competing passages inside SRC-02 share claimed current authority and lack separate dated approval evidence. Missing details have no authoritative value to select.
- **Current interpretation and precedence reason:** Record chosen roles without redesigning stack or claiming deployed/DR capability. Approximate broader scope is not measured R&A capacity.
- **User confirmation required:** Yes, for the specific question in OD-21; no resolution is recorded.
- **Affected requirements:** REQ-LT-0068, REQ-LT-0069, REQ-LT-0070, REQ-LT-0071, REQ-LT-0076, REQ-LT-0078, REQ-LT-0083.
- **Decision:** OD-21.

## F-22 — Academic provenance, team and dates [UNSUPPORTED]

- **Source A / Source B / location:** SRC-02 AL/AN versus SRC-05 pp1–3 and SRC-06 pp1–2.
- **Exact conflict or gap:** Four-member/same-division registration claim absent in supplied rubric; about-15-day target undated; CCE tentative 19 Oct and DCDS 26–30 Oct; no actual cited literature bibliography/full syllabus.
- **Authority of sources:** Apply the source-specific hierarchy above; competing passages inside SRC-02 share claimed current authority and lack separate dated approval evidence. Missing details have no authoritative value to select.
- **Current interpretation and precedence reason:** Treat official PDFs as academic authority, team registration as unverified, dates as tentative. Cloud and all-provider demonstration are project goals, not PDF mandates.
- **User confirmation required:** Yes, for the specific question in OD-22; no resolution is recorded.
- **Affected requirements:** REQ-LT-0073, REQ-LT-0075, REQ-LT-0076, REQ-LT-0077, REQ-LT-0083.
- **Decision:** OD-22.

## Additional consistency findings

- **F-23 [CONFIRMED]** SRC-02 W3/W4 and SRC-03 §§17/18 consistently define active physical lab stock. An issued consumable has already left stock; retention must not decrement it again. The master summary BE wording “reduced/decommissioned” must be read against explicit no-second-decrement rule, not as a second mutation (OD-16).
- **F-24 [OUTDATED]** SRC-02 AW repeats numbering 26–43; repeated stack, expiry, duration and notification statements are consolidated once in the ledger. AW19 still conflicts with AW48–50 and remains F-13. Duplicates do not gain authority through repetition.
- **F-25 [OUTDATED]** SRC-07 README and SRC-08 older entries predate current faculty-context changes and do not list every untracked document. Historical “next scaffold”/P0-open instructions are not current authorization to implement. Preserve history; this task appends an explicit gate entry only.
- **F-26 [DEPRECATED]** SRC-02 BJ explicitly deprecates old approval loop, PostgreSQL-as-current, three-mode inventory and 7/3/1 reminders. This finding is sourced from the master context, not pitch. No old rule is reactivated.
- **F-27 [UNSUPPORTED]** SRC-02 AK says an established BrowserAPIFree architecture already exists, but its implementation/contract is absent here. A selected adapter is not verified operational evidence (OD-18).
- **F-28 [CONFIRMED]** SRC-10 is an empty placeholder; no product tests, schema, contracts or deployments exist. Implementation-versus-document behavior comparison is **not executable**, rather than “passed.” Presentation code is not the application.
- **F-29 [DERIVED]** SQL transactions alone cannot make multi-lab physical handover reversible. F-10 requires an explicit approved-order boundary and physical failure policy; this is an audit concern, not an invented saga design.
- **F-30 [AMBIGUOUS]** SRC-02 Z says the NLP model cannot increase score above base severity, while the full recurrence formula can exceed base severity: S=50, A=N=D=1, R=1.5 gives C=75. This may mean NLP alone is bounded (N≤1), which is consistent; it must not be generalized to a bound on whole incident contribution without confirmation (OD-13). Overall formula is [0,100), despite “0–100” presentation shorthand.
- **F-31 [MISSING]** SRC-02 says repeated incidents are attributable to a student while projects have several members. Borrower/custodian identity and allocation of team responsibility are not resolved by the project membership list (OD-05/13/16).

## Cross-system consistency audit

These are source/model checks, not executed application tests. PASS-INTENT means documents state a coherent invariant; it does not prove implementation correctness. GAP means a plausible counterexample remains unspecified and has a linked decision.

| Check / counterexample | Result | Evidence / finding |
|---|---|---|
| Student, outsider or technical admin approves or mutates inventory | PASS-INTENT, permission matrix incomplete | SRC-02 E/O/AG; F-14/15 |
| HoD final approval occurs without earlier normal stage | GAP: normal sequence known, overwrite/overlapping-role semantics unclear | F-06/08 |
| Same asset or consumable quantity issued twice | PASS-INTENT: live SQL locking and idempotency; exact key/recovery contract absent | SRC-02 L1; F-10/12 |
| Two assistants claim same order or abandoned claim blocks all work | GAP | F-07 |
| Reservation expires while waiting, or approval expires while its reservation still authorizes collection | GAP: independent timer/hold semantics | F-04/11 |
| Cancel races with issue, or request spans already-issued and unissued lab orders | GAP | F-10 |
| Retention decrements inventory twice or makes retained items available | PASS-INTENT: explicitly forbidden | F-23; REQ-LT-0045 |
| Replayed or staged return restores more than originally issued | GAP: aggregate reconciliation/idempotency detail | F-10/12/16 |
| Historical audit is edited by broad HoD overwrite | PASS-INTENT: append-only history; correction semantics incomplete | SRC-02 AG; F-08/12 |
| Old email/notification authorizes approval or changes business state | PASS-INTENT: website/live SQL authority | SRC-02 AA; F-12 |
| AI invents available stock or mutates business truth | PASS-INTENT: prohibited; optional/offline behavior undefined | SRC-02 M/N; F-18 |
| Uncertain attribution generates score/flag despite confirmed-only wording | GAP / CONFLICT | F-13/30/31 |
| Extension approval races with reminders/return and sends stale overdue notice | GAP | F-11 |
| Mongo outage prevents atomic audit/outbox or email retry sends duplicate externally | GAP | F-12 |
| Primary restart/promotion permits two writers or schedulers | GAP: one-primary invariant declared, fencing absent | F-21 |
| Production uses synthetic identities/configuration as permanent institutional policy | PASS-INTENT: replaceable boundaries; deployment authorization still deferred | SRC-02 AC/BK; F-14/21 |
| Asset use permission never reconciles physical custody | PASS-INTENT: UAQ28 requires real checkout | REQ-LT-0024 |
| Three-provider cloud setup or four-person registration falsely attributed to rubric | UNSUPPORTED attribution prevented | F-22 |

## Result

Discovery/reconciliation is sufficient to request human review, **not to claim deterministic design completeness**. Core rules have meaningful support, but the claim that no V1 product questions remain is contradicted by the documented gaps. No conflict has been silently resolved and no pitch behavior has been adopted. Completeness coverage and undefined fields are recorded in 04_CONTEXT_REVIEW.md; decisions are in 05_OPEN_DECISIONS.md.
