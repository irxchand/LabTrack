# LabTrack SDD self-review

Version 0.1 | REVIEW_DRAFT | SDD_READY_FOR_VALIDATION | 2026-10-16T00:32:23+05:30

The user explicitly requested SDD-first authoring. This review does not claim Gate1 approval; the historical gate remains false. Canonical promotion/implementation remain unapproved. Pitch contributes zero product requirements. Source findings/authority remain in the six discovery artifacts; later execution selections and the whole-request clarification are distinguished from policy approval.

## Mechanical audit

| Check | Result |
|---|---|
| Original numbered sections | 43/43, sections0–42 preserved |
| All supplied Markdown headings | 101/101 preserved verbatim and in order |
| Added design sections | 43 as-built comparison;44 review boundary; operation/detail subsections |
| Stable ledger IDs | 85/85 explicitly mapped in §35.1; no extra REQ IDs |
| Executable operation families | 20 records, each33/33 required template fields |
| Minimum recovery cases | All22 source cases represented, plus policy/stale-session cases |
| Whole-request scope | Explicit USER_CONFIRMED across all labs |
| Numeric REPO conflict | Preserved as conflicted candidate, no silent scope selection |
| Approval claims | Review draft; both approval records remain false |

Mechanical checks establish representation, not correctness of unresolved business policy. Operation records group closely related commands (e.g. extension request/decision, evidence upload/read) and identify differences, shared-contract inheritance and policy gaps. They are draft contracts, not evidence that every branch is implemented or tested.

## Required 15-point protocol audit

| Protocol check | Finding / evidence |
|---|---|
|1 Baseline exists|PASS all101 headings, mapping below|
|2 Additions justified|PASS §43 separates as-built truth;§44 defines validation boundary; detailed contracts implement protocol depth|
|3 Approved requirements represented|85 extracted requirements represented; none falsely described as Gate1-approved|
|4 No invented product requirement|No new REQ IDs; technical conventions explicitly labeled; named OPEN policy remains blocked|
|5 No approved rule disappears|Whole-request clarification included; scope/roles/routes/quantity/history retained; source exclusions explicit|
|6 State transitions|§9 request/asset/reservation/extension; state compression mapped; queue/retention gaps remain OPEN|
|7 Authorization|§4 matrix,§28 security, each operation actor/guards; combined-role policy blocked|
|8 Data ownership|§23 SQL truth/audit/outbox; Mongo projections; private object metadata; no AI authority|
|9 Failures|§29 detection/safe-state/retry/idempotency/audit/test; no physical rollback fiction|
|10 Concurrency|§10–17 stable locks and request aggregate; claim/issue/cancel/return/extension races; actual MySQL runtime unverified|
|11 Contracts|§23 fields/keys/relations;§24 routes/error/serialization;§21 event/delivery;§27 storage;§22 external AI contract visibly missing|
|12 Tests traceable|REQ→section→OP→required tests/acceptance; measured evidence separated in§31; no fabricated full run|
|13 Prototype/production|§1,25–28,37 explicit local/synthetic vs institutional; cloud readiness unclaimed|
|14 Open decisions|All22 OD entries addressed in§38, including partially resolved OD-10|
|15 Historical rules|Pitch excluded; stale notification wording disclosed; no obsolete tech/policy reactivation|

## Cross-system consistency findings

1. Whole-request issue requires all-lab inventory atomicity. A one-Assistant prototype path does not resolve staggered physical handover; OD-10 remains material. SQL cannot undo physical custody.
2. Request cancellation after issue is forbidden; only return/reconciliation closes custody. Retention never decrements again. Repair conserves total.
3. Current claim/stage/purpose compression needs desired/as-built contract reconciliation; documentation does not silently change OpenAPI.
4. General HoD overwrite and scoped Assistant FIFO override coexist only within defined invariant-preserving actions. Arbitrary editor/reorder is not approved.
5. Stock plans are not holds.24h reservation expiry cannot run without anchor/hold/approval policy.48h approval expiry is separate; exact issue-at-deadline guard needs code verification.
6. Pending extension never changes current due. Reminder obligations must use current due version; calendar/catch-up semantics remain undefined.
7. Numeric REPO/NLP scope contradicts incident-only/future passages; uncertain attribution/team liability/defect severity/correction recurrence remain unresolved. No auto restriction or monetary penalty.
8. SQL domain/audit/outbox commit together. Mongo/email failure cannot reverse approval/issue; external email ambiguity is UNKNOWN, not exactly-once guaranteed.
9. Advisory AI cannot approve/mutate inventory/FIFO; unknown/stale suggestions fail validation and fallback is deterministic.
10. Prototype AuthProvider does not claim official SSO. Known stale logout-refresh UI race is recorded, not fixed by this documentation change.
11. Single-writer cloud topology is a requirement, not proof of provisioned deployment or fencing. MySQL/Mongo, actual cloud adapters and restore are unverified.
12. Existing execution traceability has stale SDD wording/missing validation-report references. Those entries are not acceptance evidence; current SDD/review/active state supersede status only.

## Completeness and readiness limits

Significant operation families cover identity, project, discovery/planning, submission, approvals, claims, issue, cancellation, extension, queue, return, acknowledgement, evidence, retention/repair/correction, alternatives/demand, delivery, scheduler, reports and offline data. The33-field records cover what/who/trigger/preconditions/authorization/input/validation/normal/decision/state/persistence/transactions/events/notifications/audit/failure/retry/idempotency/compensation/security/tests/acceptance/evidence. Shared transaction/concurrency/stale-data rules are explicit in contract C and corresponding sections. N/A is justified for reads/no independent external effects; OPEN remains a policy gap.

Not all capabilities are implementation-ready. OD-04/05/06/07/08/09/10/11/13/15/16/17/18/21 retain affected gaps. Engineering choices resolve selected technical subquestions but cannot close institutional policy. No additional code, contracts or presentation work was performed during SDD authoring. No new implementation plan is approved. The user must validate/correct the review draft and outstanding decisions before canonical approval.

## Supplied minimum-structure preservation evidence

| Original heading (verbatim) | SDD line |
|---|---|
| # LabTrack — Software Design Document (SDD) | 1 |
| ## Deterministic Execution Template | 2 |
| # 0. DOCUMENT CONTROL | 12 |
| ## 0.1 Source-of-Truth Hierarchy | 38 |
| # 1. IMPLEMENTATION MATURITY TAGS | 50 |
| # 2. SYSTEM IDENTITY | 67 |
| # 3. PROJECT MODEL | 98 |
| ## 3.1 Project Identity | 107 |
| ### Project ID | 109 |
| ### Project Name | 119 |
| ## 3.2 Project Fields | 125 |
| ## 3.3 Project Permissions | 140 |
| # 4. USERS AND ROLES | 148 |
| ## 4.1 Student | 167 |
| ## 4.2 Faculty Mentor | 189 |
| ## 4.3 Lab In-Charge | 196 |
| ## 4.4 Lab Assistant | 203 |
| ## 4.5 HoD | 212 |
| ## 4.6 Technical/System Admin | 221 |
| # 5. INVENTORY MODEL | 228 |
| ## 5.1 Assets | 237 |
| ## 5.2 Consumables | 249 |
| # 6. PROJECT/COMPONENT REQUIREMENT ENTRY | 271 |
| # 7. MINIMUM-LAB FULFILMENT | 293 |
| ## 7.1 Objective | 302 |
| ## 7.2 Secondary objective | 306 |
| ## 7.3 Tertiary deterministic tie-breaker | 310 |
| ## 7.4 Exact V1 algorithm | 314 |
| ## 7.5 Feasibility | 326 |
| # 8. APPROVAL WORKFLOW | 336 |
| ## 8.1 Consumable | 343 |
| ## 8.2 Asset | 353 |
| ## 8.3 Asset purpose | 357 |
| # 9. CANONICAL STATE MODEL | 368 |
| ## 9.1 Request states | 391 |
| ## 9.2 Reservation states | 402 |
| ## 9.3 Asset states | 411 |
| ## 9.4 Extension states | 429 |
| # 10. REQUEST / APPROVAL EXECUTION CONTRACT | 437 |
| ## 10.1 Example: Faculty Approval | 459 |
| # 11. PHYSICAL ISSUE CONTRACT | 483 |
| ## 11.1 Consumable issue | 492 |
| ## 11.2 Asset issue/use | 506 |
| ## 11.3 Failure | 518 |
| # 12. PROJECT/REQUEST CANCELLATION | 528 |
| # 13. RESERVATION | 553 |
| # 14. APPROVED-BUT-NOT-COLLECTED EXPIRY | 572 |
| # 15. BORROWING / USAGE DURATION | 590 |
| # 16. EXTENSIONS | 602 |
| # 17. RETURN / INSPECTION | 617 |
| ## 17.1 Asset inspection | 626 |
| ## 17.2 Consumable inspection | 642 |
| ## 17.3 Reconciliation | 658 |
| # 18. RETAINED IN PROJECT | 682 |
| # 19. DEFECT / DAMAGE / LOSS | 701 |
| # 20. EXPLAINABLE REPO INDEX | 725 |
| ## 20.1 Purpose | 732 |
| ## 20.2 NLP layer | 736 |
| ## 20.3 Incident contribution | 744 |
| ## 20.4 Repeated-offender flag | 773 |
| ## 20.5 Correction | 777 |
| ## 20.6 Explainability output | 783 |
| # 21. NOTIFICATION ARCHITECTURE | 801 |
| ## 21.1 Event flow | 810 |
| ## 21.2 Recipient matrix | 816 |
| ## 21.3 Email approval | 835 |
| # 22. AI RECOMMENDATION ARCHITECTURE | 850 |
| # 23. DATA ARCHITECTURE | 880 |
| ## 23.1 MySQL — authoritative state | 916 |
| ## 23.2 MongoDB — document/event/analytics state | 936 |
| # 24. API CONTRACT | 948 |
| # 25. TECHNOLOGY SELECTION & RATIONALE | 988 |
| ## 25.1 Stack | 1010 |
| # 26. CLOUD / DEPLOYMENT | 1033 |
| ## Primary V1 roles | 1042 |
| # 27. OBJECT STORAGE | 1058 |
| # 28. SECURITY | 1084 |
| # 29. ERROR / RECOVERY CATALOG | 1108 |
| # 30. SCHEDULER | 1180 |
| # 31. TESTING CONTRACT | 1207 |
| ## Every feature requires | 1214 |
| ## Phase gates | 1225 |
| ### Local edit | 1227 |
| ### Commit | 1230 |
| ### PR/merge | 1233 |
| ### Phase gate | 1236 |
| ### Nightly | 1239 |
| ### Demo/release | 1242 |
| # 32. ARCHITECTURE GUARDRAILS | 1247 |
| # 33. PHASE IMPLEMENTATION TEMPLATE | 1266 |
| # 34. DETERMINISTIC OPERATION TEMPLATE | 1301 |
| # 35. TRACEABILITY | 2088 |
| # 36. ACADEMIC MAPPING | 2194 |
| ## DCDS | 2201 |
| ## CCE | 2220 |
| # 37. PROTOTYPE → PRODUCTION MATRIX | 2235 |
| # 38. OPEN DECISION REGISTER | 2254 |
| # 39. ADR / CHANGE CONTROL | 2304 |
| # 40. AGENT EXECUTION CONTRACT | 2321 |
| # 41. IMPLEMENTATION READINESS GATE | 2351 |
| # 42. FINAL DESIGN RULE | 2374 |

## Source snapshot

SHA-256, raw file bytes. No pitch source is used.

| Path | SHA-256 |
|---|---|
| docs/ASTRA/ASTRA_MASTER_PROMPT.txt | d11e8b8ead18eedd5495ffe3fb039d24dde7ce1dc38431d61a932acfd859b5e0 |
| docs/LabTrack_MASTER_CONTEXT.md | b522046dc97bab0e8a04bd7716acdffae88397bd59a3370c6b9d2d4767e36b33 |
| docs/LabTrack_SDD_DETERMINISTIC_TEMPLATE.md | 930579fc3b30c715d6ebeaa1f0d58bd099836d7a1f97824d5a6064d0dc5b1149 |
| docs/ASTRA/00_SOURCE_MANIFEST.md | 0185c06bd7ca38f8411f7c538b8fa88b9ece183cfb46527a0304a979031bbd6f |
| docs/ASTRA/01_REFERENCE_GRAPH.md | 55342e604f5ec13a7b2ff3d3c4da5aaf589055c211c43a3143ffdd5a98269172 |
| docs/ASTRA/02_REQUIREMENT_LEDGER.md | 6b7aa20305ba3aa2f66eb6d03caacfbdb057eb8dc1f7f8d23a408cece88a19ce |
| docs/ASTRA/03_RECONCILIATION_REPORT.md | 8c119848527346b98e20f534c7434dfc42d031ad672f3b55e59224c07d102049 |
| docs/ASTRA/04_CONTEXT_REVIEW.md | ee426b9e3f434c438be77036e2815f3faefe714b5c543b973341c11bd476d95e |
| docs/ASTRA/05_OPEN_DECISIONS.md | a43dfd8e19445d8ef2c5e0a65c05e3c9390cf3ba9ce1b38e5f439e995697987d |
| docs/ASTRA/APPROVAL_GATE.yaml | bb0b2527e6ed4bad306fcba1184cf4cd9277875b72a53ae5b1eaa1471a5a8fdd |
| docs/ASTRA/EXECUTION_AUTHORIZATION.md | 305f59eefec34aba4aa073a296e2a3b7292cf8e56596d41878f4976150fa202b |
| docs/EXECUTION_DECISIONS.md | cd25285da0312bb0bda786e272803fd8666ac4a4b3d12fb912bbf468a7b7b16f |
| contracts/openapi.yaml | 16a1e761a56d6fbdb24b29b66b929bd9dc534cd918e59791b650f605f0c77f08 |
| docs/ASTRA/SDD_AUTHORING_AUTHORIZATION.md | 0c7ee9875a7def9092ed11336a5cf889b1aae92910fbbe0ac8e17ac36a7b5500 |


## Explicit user approval — 2026-10-16

At 2026-10-16T03:44:36+05:30, the user replied **“IT IS APPROVED”**. This approves the delivered SDD and its documented boundaries. State is now SDD_APPROVED; prior review text above is the historical authoring/self-audit snapshot. The reviewed draft is archived in approvals/LabTrack_SDD_v0.1_REVIEWED.md (SHA-256 2cace409a0f1f437a41be193693355cdc4289013d51b1f6fa113c3225dff4528). Canonical metadata/readiness wording was updated without selecting any OPEN business policy. All101 supplied headings remain in order and all85 requirement mappings remain present. Current canonical SHA-256: b00c08352665e7c255233641816fa98e4c573ddc1d8c147f2ca7f81a29c76b6c. The later technical session-race correction conforms to the design; execution status is in ../VALIDATION_REPORT.md.
