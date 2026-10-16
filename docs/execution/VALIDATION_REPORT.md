# LabTrack execution validation and handoff

Updated: 2026-10-16 (Asia/Calcutta). Project execution and presentation execution are explicitly authorized by ASTRA/EXECUTION_OVERRIDE_2026-10-16.md. The SDD remains an unapproved review draft; neither gate has been approved or promoted. Pitch material contributes no product/architecture requirements.

## Project status

**Defined local prototype: implemented and verified. Overall deployment/integration: in progress.** The current application supports synthetic authentication, project/membership creation, catalogue availability, exact minimum-lab planning, single-class faculty/HoD routing, exclusive claims, entire-request issue across all labs, full ordinary inspection/return, future-due extensions, pre-issue cancellation, FIFO enrollment/cancellation, private evidence, incident history, notification projections, curated alternatives and unmet-demand reporting. Policy-dependent branches remain explicitly unavailable. Deployment artifacts exist; live multi-cloud operation is not complete.

## Validation evidence

| Check | Actual result | Evidence / limitation |
|---|---|---|
| Full backend baseline | 28 passed, 2 skipped | .artifacts/backend-tests.xml; skipped MySQL/Mongo URLs not configured; historical baseline, not rerun for UI-only fix |
| Additional backend cases | 4 distinct cases passed in separate supplemental runs | tests/test_projection_features.py: demand without inventory creation, live alternative validation, durable external intent/replay, failed-SQL upload compensation; not a fabricated combined full-suite run |
| Coverage at baseline | 86% | .artifacts/coverage.json; no production/service coverage claim |
| Alembic/seed/schema | Upgrade, synthetic seed, migration check passed earlier | SQLite local profile; MySQL engine not exercised |
| Frontend final build | PASS | TypeScript check and Vite6.4.4 production build on2026-10-16 |
| Dependency audit | Earlier npm audit reported0 vulnerabilities | Snapshot result, not an ongoing security guarantee |
| API demonstration | 13 checks passed | .artifacts/demo-evidence.json; synthetic consumable/asset lifecycles and replay; prior backend build |
| Final browser lifecycle | PASS, request7,12 screenshots | .artifacts/browser/browser-evidence.json; project, asset route, claim, issue, inspection, history, FIFO, notifications and responsive viewport; no browser exceptions |
| Additional browser features | PASS,7 checks | .artifacts/browser/feature-evidence.json; alternatives, unstocked demand, projection/reporting, incidents, mobile sign-out |
| Delayed-session regression | PASS,3 deterministic scenarios | .artifacts/browser/session-regression.json; delayed old401, delayed old-success, transient503 refresh; current login survives |
| Editable PowerPoint | 22 slides; integrity/layout/import checks passed | .artifacts/presentation-build/validation-v2.2.json; final file hash matches; all slides visually inspected during authoring; native PowerPoint not exercised |
| Browser presentation | PASS | .artifacts/presentation-build/browser-validation.json; all22 embedded images decode, controls, keyboard navigation, source notes, mobile overflow and exception checks |

The intermediate browser failures exposed a stale logout-refresh race and a temporary UTF-8 serialization defect while editing. Both were corrected before the final successful build and browser reruns. Those failed attempts are not described as passing. The old SDD as-built snapshot records the earlier race; this report supersedes its execution status, without approving or changing design policy.

## Technical correction in this continuation

Workspace refreshes carry a session generation and sequence. Responses from an older login or superseded refresh cannot overwrite a newer workspace. Sign-out revokes the session without invoking the mutation helper's refresh. Login/logout clear role-specific data and open forms. API errors preserve HTTP status; only current401 invalidates login, while transient failures show an error without logging out. Notices/action completion also check the originating session. This is a technical implementation of the existing auth boundary, not new business policy.

## Presentation status

**Completed for the current local-prototype scope.** Version2.2 contains22 slides with editable text/tables, actual synthetic application screenshots and source notes. The self-contained HTML viewer uses the corresponding artifact-tool renders, requires no network/dependencies, and preserves source notes. Keyboard: arrows/PageUp/PageDown, Home/End, N for notes, F for fullscreen. PPTX remains the editable version; HTML slide images are a presentation viewer, not editable slide objects.

Artifacts: presentations/v2/output/LabTrack_Execution_Presentation_v2.2.pptx and .html. Historical v1/v1.1 are preserved. The deck accurately discloses local adapters, pending policies and unavailable cloud integration rather than claiming deployment or measured institutional gains.

## Demo status

**Working local synthetic demo**, served at http://127.0.0.1:8000 with API documentation at /docs. Use RUN_GUIDE.md and DEMO_RUNBOOK.md. Outbox worker supports local notification/demand projection; mail previews remain local JSON, no real email. Demo scripts create new records rather than erase history. Default synthetic credentials are in the run guide, not institutional accounts. Existing backend and local worker are running at handoff; commands in the guide reproduce them after restart.

## Material policy blockers

- OD-04: reservation24h anchor, stock holds, scarcity/head-of-line behavior and fulfilment/approval bridge.
- OD-05/06/07/08/09: submitted revisions/lead custody; mixed-class/multiple In-Charge/role overlap; abandoned claims; safe overwrite/FIFO reorder; hold-aware replan/reapproval.
- OD-10: multi-operator physical coordination/recovery. **Entire-request atomicity across all labs is already user-confirmed.**
- OD-11: calendar/day/catch-up semantics and late extensions. Existing due remains authoritative until approval.
- OD-13: numeric REPO/NLP scope conflict, individual/team attribution, uncertain contribution, defect severity and correction recurrence. No automatic blame/fine/restriction.
- OD-15/16/17: online maintenance/demand readership, partial/cross-lab return, retention/repair/dispute authority, evidence exceptions/retention/deletion.
- OD-18/21: external AI contract and cloud services/budget/fencing/backup/RPO/RTO. Institutional SSO/master data/privacy remain deferred.

These block their affected branch, not independently executable work or presentation. Engineering selections and original decisions are in EXECUTION_DECISIONS.md; source requirements are in ASTRA/02_REQUIREMENT_LEDGER.md; implementation mapping is EXECUTION_TRACEABILITY.md.

## Remaining technical limitations

Actual MySQL8.4/Mongo8 services, Docker container execution, live Gmail/S3/BrowserAPIFree, cloud promotion/fencing and restore were not verified. Current local tests use SQLite/local projections; they do not prove InnoDB locking or satisfy live SQL+NoSQL integration evidence. No cloud resources/accounts/budget were supplied or provisioned. Production session hardening, DB audit grants, retention, observability and operator reconciliation runbooks need later validation. No production-readiness or canonical SDD claim is made.


## Subsequent SDD approval — 2026-10-16

The user explicitly replied “IT IS APPROVED”. The SDD is now the approved canonical project baseline (SDD_APPROVED); both gate records preserve exact approval evidence and scope. Earlier unapproved-status wording in this execution report is historical. This approval changes no test/deployment results and selects no unresolved business alternatives. OPEN/CONFLICTED/DEFERRED boundaries remain in force. See ASTRA/SDD_APPROVAL_GATE.yaml and archived reviewed draft/prior gates in ASTRA/approvals/.
