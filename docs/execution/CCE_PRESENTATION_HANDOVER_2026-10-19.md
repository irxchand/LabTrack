# CCE presentation handover — 19 October 2026

## Purpose

This note records the decisions behind the LabTrack CCE presentation. It is a concise, publishable handover rather than a verbatim private chat log. The historical transcript is in `docs/LABTRACK_CHATS_TRANSCRIPT.md`; credential material has been redacted before publication.

## Faculty-facing position

The CCE presentation should lead with implementation evidence. The faculty should be shown the actual operator interface, the live FastAPI documentation and a server-backed request lifecycle. The deck must clearly state that the root React workflow still uses browser-managed state while the FastAPI service owns separately tested SQL state. This prevents a misleading end-to-end cloud claim.

## Presentation decisions

- Time limit: 12–15 minutes total, including a five-minute live demonstration.
- Visual identity: match the LabTrack website using charcoal, champagne-gold, glass surfaces and locally bundled fonts.
- Evidence: show observed running services, a fresh backend test result (61 passed, 2 opt-in integration checks skipped, 0 failed), a controlled failure case and the remaining integration tasks.
- Scope of the demo: show the root website as interface evidence, then use FastAPI/OpenAPI for authoritative server workflow proof. Do not send SMTP email during the presentation.
- Source honesty: do not claim active MySQL, a fully connected UI/backend lifecycle, cloud deployment, JWT, or production readiness unless verified in the running system.

## Literature-review decisions

`presentations/cce-v3/LITERATURE.md` is the maintained source for the review. It applies authoritative sources to SMTP/outbox notification records, FastAPI, FIFO reservations, transaction isolation, cloud VMs and managed databases, Docker, and Phase 1 security.

One terminology correction is intentional: **SHA-256 is a secure hash for integrity; it is not encryption and must not be used alone for password storage.** The recommended security baseline is TLS, a password-hashing scheme such as Argon2/bcrypt, external secret management, role checks and audit records.

## Implementation priorities from the review

1. Connect root UI authentication and request/approval/custody writes to FastAPI so both layers share authoritative state.
2. Restrict direct email endpoints and use a durable outbox plus delivery worker.
3. Put inventory return reconciliation on the server to protect good/bad quantities.
4. Validate the intended MySQL and worker deployment environments before presenting them as operational.

## Deliverables

- `presentations/cce-v3/`: Vite CCE deck with speaker notes, controls, rubric map and live-demo links.
- `presentations/cce-v3/LITERATURE.md`: annotated literature review with direct authoritative sources.
- `docs/execution/CODE_REVIEW_2026-10-19.md`: implementation and runtime review.
- `docs/LABTRACK_CHATS_TRANSCRIPT.md`: historical project transcript, with credential material redacted.
