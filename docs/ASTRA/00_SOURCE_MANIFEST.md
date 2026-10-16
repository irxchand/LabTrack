# ASTRA source manifest

Version: 1.0 | Review date: 2026-10-07 (Asia/Calcutta) | State: AWAITING_USER_VALIDATION

## Explicit user direction

USER-01: Discovery and understanding only; no canonical SDD, implementation code, implementation plan, or passage beyond Gate 1. USER-02 (2026-10-07): “DON'T FOLLOW PITCH, THOSE WERE JUST FOR PITCH”. All presentation artifacts are provenance-only, with zero authority over requirements or architecture. These instructions are persisted here because conversation memory is not a durable project source.

## Discovery coverage and authority

30 first-party files were discovered recursively, including hidden/untracked files, before this review. All project documents outside presentations were read; both academic PDFs were text-extracted and all pages visually inspected. The v1.1 pitch was inspected before USER-02; further substantive pitch analysis was stopped on that instruction. Presentation code/configuration was inspected only to establish that it runs slides, not LabTrack. No external source was imported as product truth.

The current Git HEAD is `db923ad299de5ce494b87658be224062ec2829b0` (2026-10-05). At discovery SRC-02 was modified, SRC-01/SRC-03/SRC-04 were untracked. Working-copy content, not HEAD alone, is the review baseline. No approval history or dated ADR corroborating each “LOCKED” addition was found. “Recorded current decision” is therefore distinguished from newly validated user approval. Faculty/college evidence precedes recorded user decisions, then configuration/assumptions, future scope, history and inference. Authority is evaluated by claim, not filename.

| ID | Path | Type | Authority class | Version/status | Normative/informational | Constrains architecture? | Defines behavior? | Purpose and relationships |
|---|---|---|---|---|---|---|---|---|
| SRC-01 | docs/ASTRA/ASTRA_MASTER_PROMPT.txt | Protocol | PROCESS_AUTHORITY | Current; user-invoked | Normative process | Yes | No | Controls discovery and approval gates; governs all ASTRA outputs |
| SRC-02 | docs/LabTrack_MASTER_CONTEXT.md | Product context | CANONICAL_PRODUCT_TRUTH | Current working copy; internally conflicted | Normative candidate; section-level authority | Yes | Yes | Consolidates faculty discussion and recorded project decisions; compared with SRC-03/04/05/06 |
| SRC-03 | docs/LabTrack_SDD_DETERMINISTIC_TEMPLATE.md | Supplied SDD template | SDD_STRUCTURAL_REFERENCE | Current supplied working copy; undated | Normative minimum structure; behavior subject to reconciliation | Yes | Yes, subject to reconciliation | Equivalent structural reference; sections 0–42; overlaps SRC-02; not an ASTRA-approved canonical SDD |
| SRC-04 | manoj sir talk.txt | Raw discussion notes | ACADEMIC_AUTHORITY | Undated faculty-discussion record | Evidence of faculty statements; terse and ambiguous | Yes | Yes, within explicit wording | Raw support for SRC-02 A3; not independent support for every later addition |
| SRC-05 | docs/DCDSL Evaluation Plan_with detailed rubrics.pdf | Official academic rubric | ACADEMIC_AUTHORITY | Batch 2025–29; tentative ESE 26–30 October 2026 | Normative academic evaluation | Yes | No institutional workflow policy | 4 pages (p4 blank); validates academic claims in SRC-02 AM |
| SRC-06 | docs/Evaluation_Plan_Cloud_Computing_Essentials.pdf | Official academic rubric | ACADEMIC_AUTHORITY | Batch 2025–29; tentative presentation 19 October 2026 | Normative academic evaluation | Yes | No institutional workflow policy | 2 pages; validates SRC-02 AN; does not mandate three cloud providers |
| SRC-07 | README.md | Repository entry point | TECHNICAL_REFERENCE | Current navigation; status partly stale | Normative repository conventions; informational status | Yes, repository organization | No independent product policy | Names SRC-02 as context; requires SRC-08 continuity updates |
| SRC-08 | AGENT_LOG.md | Agent continuity log | EXECUTION_HISTORY | Entries 3/5 October 2026; appended by this review | Informational history; current entry records gate | No independent product architecture | No | Historical open items must not override current context or user gate |
| SRC-09 | .gitignore | Repository configuration | TECHNICAL_REFERENCE | Current | Normative Git exclusions | No product constraint | No | Excludes dependencies, build outputs and secrets |
| SRC-10 | src/.gitkeep | Application placeholder | CURRENT_IMPLEMENTATION | Current empty placeholder | Informational evidence of absence | No implemented architecture | No implemented behavior | No application code exists |
| SRC-11 | presentations/v1.1/code/.gitignore | Presentation tooling/source | HISTORICAL_REFERENCE | v1 or v1.1; pitch only | Informational only; explicitly excluded by user | No | No | Pitch provenance only. No requirement or architecture edge is permitted. |
| SRC-12 | presentations/v1.1/code/export-pdf.js | Presentation tooling/source | HISTORICAL_REFERENCE | v1 or v1.1; pitch only | Informational only; explicitly excluded by user | No | No | Pitch provenance only. No requirement or architecture edge is permitted. |
| SRC-13 | presentations/v1.1/code/index.html | Presentation tooling/source | HISTORICAL_REFERENCE | v1 or v1.1; pitch only | Informational only; explicitly excluded by user | No | No | Pitch provenance only. No requirement or architecture edge is permitted. |
| SRC-14 | presentations/v1.1/code/package-lock.json | Presentation tooling/source | HISTORICAL_REFERENCE | v1 or v1.1; pitch only | Informational only; explicitly excluded by user | No | No | Pitch provenance only. No requirement or architecture edge is permitted. |
| SRC-15 | presentations/v1.1/code/package.json | Presentation tooling/source | HISTORICAL_REFERENCE | v1 or v1.1; pitch only | Informational only; explicitly excluded by user | No | No | Pitch provenance only. No requirement or architecture edge is permitted. |
| SRC-16 | presentations/v1.1/code/public/favicon.svg | Presentation tooling/source | HISTORICAL_REFERENCE | v1 or v1.1; pitch only | Informational only; explicitly excluded by user | No | No | Pitch provenance only. No requirement or architecture edge is permitted. |
| SRC-17 | presentations/v1.1/code/src/main.js | Presentation tooling/source | HISTORICAL_REFERENCE | v1 or v1.1; pitch only | Informational only; explicitly excluded by user | No | No | Pitch provenance only. No requirement or architecture edge is permitted. |
| SRC-18 | presentations/v1.1/code/src/slides.js | Presentation tooling/source | HISTORICAL_REFERENCE | v1 or v1.1; pitch only | Informational only; explicitly excluded by user | No | No | Pitch provenance only. No requirement or architecture edge is permitted. |
| SRC-19 | presentations/v1.1/code/src/style.css | Presentation tooling/source | HISTORICAL_REFERENCE | v1 or v1.1; pitch only | Informational only; explicitly excluded by user | No | No | Pitch provenance only. No requirement or architecture edge is permitted. |
| SRC-20 | presentations/v1.1/pdf/LabTrack_Pitch_Deck_v1.1.pdf | Presentation export | HISTORICAL_REFERENCE | v1 or v1.1; pitch only | Informational only; explicitly excluded by user | No | No | Pitch provenance only. No requirement or architecture edge is permitted. |
| SRC-21 | presentations/v1/code/.gitignore | Presentation tooling/source | HISTORICAL_REFERENCE | v1 or v1.1; pitch only | Informational only; explicitly excluded by user | No | No | Pitch provenance only. No requirement or architecture edge is permitted. |
| SRC-22 | presentations/v1/code/export-pdf.js | Presentation tooling/source | HISTORICAL_REFERENCE | v1 or v1.1; pitch only | Informational only; explicitly excluded by user | No | No | Pitch provenance only. No requirement or architecture edge is permitted. |
| SRC-23 | presentations/v1/code/index.html | Presentation tooling/source | HISTORICAL_REFERENCE | v1 or v1.1; pitch only | Informational only; explicitly excluded by user | No | No | Pitch provenance only. No requirement or architecture edge is permitted. |
| SRC-24 | presentations/v1/code/package-lock.json | Presentation tooling/source | HISTORICAL_REFERENCE | v1 or v1.1; pitch only | Informational only; explicitly excluded by user | No | No | Pitch provenance only. No requirement or architecture edge is permitted. |
| SRC-25 | presentations/v1/code/package.json | Presentation tooling/source | HISTORICAL_REFERENCE | v1 or v1.1; pitch only | Informational only; explicitly excluded by user | No | No | Pitch provenance only. No requirement or architecture edge is permitted. |
| SRC-26 | presentations/v1/code/public/favicon.svg | Presentation tooling/source | HISTORICAL_REFERENCE | v1 or v1.1; pitch only | Informational only; explicitly excluded by user | No | No | Pitch provenance only. No requirement or architecture edge is permitted. |
| SRC-27 | presentations/v1/code/src/main.js | Presentation tooling/source | HISTORICAL_REFERENCE | v1 or v1.1; pitch only | Informational only; explicitly excluded by user | No | No | Pitch provenance only. No requirement or architecture edge is permitted. |
| SRC-28 | presentations/v1/code/src/slides.js | Presentation tooling/source | HISTORICAL_REFERENCE | v1 or v1.1; pitch only | Informational only; explicitly excluded by user | No | No | Pitch provenance only. No requirement or architecture edge is permitted. |
| SRC-29 | presentations/v1/code/src/style.css | Presentation tooling/source | HISTORICAL_REFERENCE | v1 or v1.1; pitch only | Informational only; explicitly excluded by user | No | No | Pitch provenance only. No requirement or architecture edge is permitted. |
| SRC-30 | presentations/v1/pdf/LabTrack_Pitch_Deck_v1.pdf | Presentation export | HISTORICAL_REFERENCE | v1 or v1.1; pitch only | Informational only; explicitly excluded by user | No | No | Pitch provenance only. No requirement or architecture edge is permitted. |

## Absence and exclusions

- `src/` contains only `.gitkeep`; no app implementation or observed runtime behavior exists.
- No `tests/`, database definitions, migrations, schema files, `contracts/`, OpenAPI artifact, app dependency manifest, Docker/Compose, Terraform, CI workflow, deployment manifest, ADR directory or `ACTIVE_STATE.md` was found. Paths mentioned in the template are future references, not existing contracts.
- Ignored `presentations/v1/code/node_modules/`, `presentations/v1.1/code/node_modules/` and their `dist/` folders are generated dependencies/build outputs. Their presence was inventoried; third-party files were not promoted into project requirements. `.git/` was inspected through status/log/HEAD, not object-by-object.
- No repository `AGENTS.md` was found. Root README and continuity-log conventions were followed.
- No original institutional dataset, inventory spreadsheet, notebook scan, authentication contract, BrowserAPIFree integration source, signed faculty minutes, full syllabus or cited research bibliography was found.

## SDD structural discovery

SRC-03 is the only discovered equivalent SDD structural specification: its contents explicitly define LabTrack SDD sections 0–42, a deterministic operation block, traceability, testing and readiness requirements. No separate document containing the literal “Standard SDD Structure” was found outside the protocol referring to it. This is a content-based identification, not proof that a different original reference never existed. OD-01 requests confirmation of identity. The entire heading tree is preserved in the reference graph as the MINIMUM baseline, not an upper bound. Its “Execution Baseline” label does not bypass the current user-required ASTRA gate.

## Source hashes (SHA-256 at discovery)

SRC-08 receives an append-only continuity entry during this task; Gate 1 records its final hash separately. All other discovery-source bytes must remain unchanged.

| Source | SHA-256 |
|---|---|
| SRC-01 | `d11e8b8ead18eedd5495ffe3fb039d24dde7ce1dc38431d61a932acfd859b5e0` |
| SRC-02 | `b522046dc97bab0e8a04bd7716acdffae88397bd59a3370c6b9d2d4767e36b33` |
| SRC-03 | `930579fc3b30c715d6ebeaa1f0d58bd099836d7a1f97824d5a6064d0dc5b1149` |
| SRC-04 | `debcc2b5f4528cedfd47a000bfeeb8ba23277151348959f0ce186ff401611d16` |
| SRC-05 | `ec95ce40c948c0fa8c2de352ef0502d77fac9c41038fcc3c5fa61cf66adfef3e` |
| SRC-06 | `a79e0aeffbfadb854e0e37ccb570a8f774440a49b5599f0797f64befbfeb1ff0` |
| SRC-07 | `c783b36b784fefd1ddebf66b8f51c397b8ccdd6238dffb42c0872119bc916383` |
| SRC-08 | `9a5b391e4096a8031fd6d48d93a32a1545c228b62bf5cfef604cad43ad423b39` |
| SRC-09 | `1ad361c185f40d9064a4c0165292d82dca0fb0f5ea8b45ba15f28966d243f6eb` |
| SRC-10 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| SRC-11 | `d50ab07e11fa4bf3b1c7c3312e1d7baeab56cca756832ccf40476823ad2a38b7` |
| SRC-12 | `265a25414621b368aca1182837eb2b7e25a37083a35e824b586823182c3c8109` |
| SRC-13 | `e604fccbe1a782276079bfb6fbbd0a29284b42d654adc63c2a88132e353f65f1` |
| SRC-14 | `3b5a6dd580715d4f6766f85d8d3e1bb8118dfa02a4610a3d90a249fe45de749b` |
| SRC-15 | `9d58b691b1b1125036659aa429ffd95fe9af74526b5e422ce09f75dc0413d746` |
| SRC-16 | `008c45a2e86dd80ca00d2832eec63c5ee84c2a58bd2bc229b066428394897ab9` |
| SRC-17 | `8fff243b9e0cc4bfaed1f093a43eb4234fe8ee2dc0fab6d41f269a3ac13a9012` |
| SRC-18 | `faee52f984a4e553f9ca14ba7fd13829df56b8495d188bd8937d28fc67a50fc4` |
| SRC-19 | `a1d385668f08d91716874261ab222d5d3b707a499eb869cd9d975a3d0ccb934e` |
| SRC-20 | `93d08446039fb1ce85948755cb7ed2718538838736cdabdb243fc533d5a5a56f` |
| SRC-21 | `d50ab07e11fa4bf3b1c7c3312e1d7baeab56cca756832ccf40476823ad2a38b7` |
| SRC-22 | `846772e4fb26f22678598281cb6ee8740c0a25a63bfb434f0829e3fe593dbae9` |
| SRC-23 | `e604fccbe1a782276079bfb6fbbd0a29284b42d654adc63c2a88132e353f65f1` |
| SRC-24 | `3b5a6dd580715d4f6766f85d8d3e1bb8118dfa02a4610a3d90a249fe45de749b` |
| SRC-25 | `9d58b691b1b1125036659aa429ffd95fe9af74526b5e422ce09f75dc0413d746` |
| SRC-26 | `008c45a2e86dd80ca00d2832eec63c5ee84c2a58bd2bc229b066428394897ab9` |
| SRC-27 | `8fff243b9e0cc4bfaed1f093a43eb4234fe8ee2dc0fab6d41f269a3ac13a9012` |
| SRC-28 | `1707e76ee5db4cadf4c987466b619d4ece2ee4562b23b7f2bfdda03c129875c1` |
| SRC-29 | `14c4414993d3f18e16d9c5f4b0031fa11e681523bb00522cbf17b767b8b53ddb` |
| SRC-30 | `dc288f4a3e62562d599eca22e9e52f163d3384585d9c44e4189cb41634604e24` |

## Derived review artifacts

The six numbered ASTRA Markdown files are version 1.0 derived analysis, not independent product authority. `APPROVAL_GATE.yaml` records the exact reviewed source/artifact hashes and an empty validated set until explicit approval. Generated findings must never be cited as proof that the user made a new decision. Source authority remains with the original evidence and explicit validation.
