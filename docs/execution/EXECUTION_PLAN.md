# LabTrack execution plan

Date: 2026-10-15. Authority: the user's attached “PROJECT EXECUTION + PRESENTATION MODE” instruction, persisted in `docs/ASTRA/EXECUTION_AUTHORIZATION.md`. This execution track is authorized independently of the pending canonical SDD gate. The master context remains the product basis; pitch decks have no product authority.

## Baseline and phases

At entry, `src/` contains only `.gitkeep`. There are no application tests, contracts, database definitions or deployment files. Existing modified/untracked documentation is preserved.

1. Foundation: FastAPI/Pydantic, SQLAlchemy models, Alembic migration, synthetic authentication, seed data, stable errors, transaction wrapper and audit/outbox. REQ-LT-0001–0015, 0052–0055, 0061–0067.
2. Workflows: catalogue, project creation, minimum-lab planning, class-specific approvals, exclusive claims, whole-request atomic issue, ordinary complete returns, extension history, cancellation and FIFO queue entry. REQ-LT-0016–0048. Stop only operations needing open policy.
3. Client: React/Vite/TypeScript, generated API types, role-based screens, availability, approvals/timeline, issue/return, notification centre and visible policy boundaries. REQ-LT-0066.
4. Integration/validation: SQL locking/idempotency, negative authorization, races, failure/replay tests, optional MySQL/Mongo integration profile, provider adapters and container configuration. REQ-LT-0027–0029, 0052–0059, 0068–0070, 0079–0080.
5. Demo: synthetic departmental inventory and role accounts; executable complete consumable and asset lifecycles, shortage and replay scenarios, traceability/evidence report. REQ-LT-0073–0076.
6. Presentation: a new versioned editable deck and browser presentation, grounded in implemented behavior and explicit pending policies. Preserve v1/v1.1. Cover the master context AR–AT guidance and validate every slide.

## Business boundary

The user confirmed on 2026-10-15 that no partial issue applies to the **entire request across all labs**. SQL inventory, issue, audit and outbox commit atomically for the whole request. Actual physical custody must be confirmed together; a failed confirmation must not be represented as completed handover. Multi-operator handover coordination remains open. An Assistant assigned to all selected issuing labs can execute a whole-request confirmation; no automatic partial issuance is exposed.

Mixed asset/consumable approval, multiple asset In-Charges, submitted-request editing, claim reassignment, discretionary overwrite/FIFO reorder, reservation holds/fulfilment, retention approval, attribution/score/NLP and late extensions are not inferred from incomplete policy. Their affected operations return a stable policy-required response until resolved. Ordinary independent paths remain executable.

## Engineering choices authorized by the user

- SQLAlchemy supports MySQL as the deployment authority and an explicitly labelled SQLite local development/test profile when the Docker engine is unavailable. SQLite is not presented as MySQL validation.
- Persist canonical audit in the same SQL transaction as domain state and outbox; Mongo contains projections, never business truth. A local document adapter makes offline demos reproducible. Cloud uses Mongo.
- Opaque synthetic login tokens, PBKDF2 password hashes, server-side token expiry and current-user permission checks behind an AuthProvider boundary. No institutional SSO claim.
- Deterministic minimum-lab subset selection follows I1. Allocation within the selected subset uses stable lab-ID ordering without changing objectives; no automatic replan after approval. Multi-In-Charge asset routing remains blocked.
- Store times in UTC and render locally. Automated business calendar reminders remain disabled until overdue day/catch-up semantics are explicitly configured. Outbox dispatch can run independently.
- API-first: FastAPI generates OpenAPI; its snapshot generates TypeScript types. No separate frontend business authority.
- No real email, paid cloud resources or external AI call is exercised without configuration. Local mail/evidence adapters are explicit demo substitutes; provider implementations remain replaceable.

## Validation and handoff

Run backend tests and frontend type/build checks, then API and browser demo checks. Report separately what ran locally, what ran against MySQL/Mongo, and what could not run. Trace requirements to files/tests in `docs/execution/EXECUTION_TRACEABILITY.md`. Record real blocking policies in `docs/execution/EXECUTION_DECISIONS.md`; do not label a pending SDD gate as an execution blocker.
