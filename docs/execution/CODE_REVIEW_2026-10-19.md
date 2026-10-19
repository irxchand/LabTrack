# Code and runtime review — 19 October 2026

Scope: current working tree, including uncommitted changes. Read-only inspection of application data; isolated browser reproductions used a fresh temporary browser context. No email was sent, live business transaction created, or application bug fixed during this review. Other work may be editing this checkout; line references describe the reviewed snapshot.

## Runtime evidence

| Component | Observed result | Meaning |
| --- | --- | --- |
| Root React/Vite website, port 5173 | HTTP 200; production build passed | UI runs and compiles; this is not backend workflow validation |
| Presentation, port 5174 | HTTP 200 | Presentation available |
| FastAPI, port 8000 | Health HTTP 200 | Running backend; health executes a SQL query |
| Active SQL engine | Health reports SQLite | MySQL is not the database used by the running API |
| MongoDB | Configured remote ping passed; 78 notifications, 77 delivery documents, 0 demand documents | Real service and existing projections present; new end-to-end projection correctness not exercised |
| Local DB ports | 3306/3307/27017/27018 closed | No listeners on tested local ports; remote Mongo is independently reachable |
| Email | Health reports SMTP | Real provider configured; delivery not exercised in this review |
| SQL data | 73 users, 15 projects, 12 requests, 55 outbox entries, 203 delivery records | Existing backend data exists independently of browser storage |
| Outbox snapshot | 53 dispatched, 2 pending; deliveries 202 SENT, 1 UNKNOWN | Historical delivery state exists; UNKNOWN needs reconciliation, not an assumption of failure or success |
| Scheduling | Current config disables API scheduler; no run_worker process found in process inventory | Automatic ongoing processing was not established |
| Object storage | Current config uses local storage | S3 operation not established |

## Findings, highest priority first

### F1 — P1: Main website workflows do not use authoritative backend state

`src/api/client.js:29`, `src/api/custody.api.js:96`, `src/api/inventory.api.js:37`, and `src/api/accountability.api.js` implement simulated calls backed by localStorage. Root login also uses browser data. A request created in one browser profile is not an authoritative SQL request and cannot be shared reliably with a faculty member on another device. Local refresh persistence is not central persistence. Dispatch updates loan, asset and inventory stores separately without the backend's atomic issue operation.

Fix: integrate the root client with the existing authenticated FastAPI contracts, including numeric/backend identifiers, canonical states and idempotency keys. Preserve the website UI. The separate `src/frontend/src/api.ts` already demonstrates actual HTTP integration.

### F2 — P1: Login accepts universal passwords and even mask characters

`src/services/mysqlAuthService.js:225–229` accepts `password123`, the global demo password, or a literal string of password bullets for any matched active account. The service uses `this.accounts.find`, never a MySQL connection. AuthContext labels the result MySQL and installs a mock token.

Reproduced in an isolated browser: a HoD seed identifier plus twelve password-mask bullets returns success. This is not genuine authentication or a secure authorization boundary.

Fix: use `/api/auth/login` and server-validated sessions; remove these acceptance shortcuts from the application authentication path.

### F3 — P1: HoD approval does not advance the website request state

`src/api/custody.api.js:168–186` always sets `Faculty Endorsed`, regardless of actor or prior state. `ApprovalsQueuePage.jsx` routes HoD, mentor and override actions through this same method. Actors are hardcoded to a different faculty account. There is no class-specific approval transition in this API.

Reproduced: first approval = `Faculty Endorsed`; second approval = `Faculty Endorsed`. The backend separately implements MENTOR_REVIEW / INCHARGE_REVIEW / HOD_REVIEW / APPROVED. The UI therefore cannot demonstrate that backend authorization chain merely by switching roles.

Fix: route decisions to the server and render the returned state and timeline.

### F4 — P1: Defective returns subtract good stock twice

`src/api/inventory.api.js:101–126` subtracts one available unit for Allocated, then subtracts another for Maintenance. `LabDataContext.jsx` calls these in sequence when an issued unit returns defective. The second subtraction removes an unrelated available unit. Per-lab state also diverges: allocation does not decrement labBreakdown, while return/maintenance changes the first lab regardless of the issuing lab.

Reproduced with a fresh browser store: 30 good / 4 bad becomes 28 good / 5 bad after one issue and defective return. Expected available count after this sequence is 29 good / 5 bad.

Fix: reconcile the issued quantity against the recorded issuing lab and unit in one server transaction. Do not implement stock accounting as generic status setters.

### F5 — P1: Unauthenticated endpoints send externally visible email

`src/backend/labtrack/api.py:119–181` exposes requisition-event and test-email POST routes without `Depends(actor)` or other authorization dependencies (confirmed by route dependency inspection). The requisition endpoint accepts invented names, events and request IDs and sends immediately to a configured target. It neither validates an existing request nor records durable outbox intent, and each retry receives a random identifier.

Any reachable caller can trigger misleading/duplicate messages. No external email call was used to verify this finding.

Fix: derive lifecycle messages from authorized domain changes and their outbox. Restrict or remove test-email from deployed APIs.

### F6 — P1: SMTP delivery bypasses durable external-send handling

`src/backend/labtrack/worker.py:79` uses durable_external_send only for Gmail. SMTP goes through lines 94–118, invoking the external send before the surrounding transaction commits its SENT state. A crash or rollback after SMTP acceptance permits a later duplicate send. SMTP timeout/disconnect classes also do not match the limited HTTP timeout class-name list used to classify ambiguity.

Fix: use durable send-intent handling for every external network provider, and classify SMTP ambiguous outcomes explicitly. Keep local file delivery separate. This failure mode is established by control flow, not an induced live email failure.

### F7 — P2: UI claims email success on HTTP failures

`src/context/LabDataContext.jsx:454–480` and the approval/rejection equivalents await fetch but never inspect response.ok. Fetch resolves normally for a 500 response; even network exceptions are caught and followed by an unconditional 'Email Dispatched' toast.

Fix: show persisted notification/delivery state. A successful business action must be distinguished from pending or failed email delivery.

### F8 — P2: Selected borrowing duration is discarded

`RequisitionDrawer.jsx:61,94` stores durationDays but submits only purpose and project ID. `custody.api.js:101` then sets the needed date to 14 days unconditionally. Choosing three days or one month has no effect on the saved request.

Fix: pass validated duration to the backend request and use its canonical due-date behavior.

### F9 — P2: Quantity modification ignores the edited quantities

`ApprovalsQueuePage.jsx:427–435` passes updatedComponents as a third argument to approveRequisition, but `LabDataContext.jsx:486` accepts only (reqId, notes). The quantity edits are discarded and the action instead endorses the request with the approver name as notes.

Fix: wire a defined quantity-amendment operation, or remove the action until the amendment policy/API supports it. Do not silently approve unchanged data.

### F10 — P2: Extension action invents immediate student approval

`src/api/custody.api.js:62–85` directly modifies dueDate and labels it auto-approved. The backend implements explicit approval stages and limits. The root UI therefore grants a policy the backend does not allow.

Fix: submit an extension request and render its pending state until the authorized server transition approves it.

### F11 — P2: Reliability and audit integrity displays are simulated

`src/api/accountability.api.js:49–79` returns hardcoded reliability scores and metrics rather than deriving them from incidents. Its audit helper and the custody audit helper generate random strings prefixed with `sha256:`; these are not hashes of the record and cannot verify integrity. They also insert hardcoded actor names.

Fix: label fixture-only values explicitly until real incident projections are integrated. Render server-derived actor/event records; only claim a checksum if it is actually computed and checked.

## Implemented versus unverified

- Implemented backend code: synthetic hashed-password auth, persistent sessions, project membership, minimum-lab planning, class-specific approval transitions, operational claims, whole-request issue, inspection/return, extensions, FIFO enrollment, evidence access, audit and outbox. Test results below qualify the verified environment.
- Implemented root UI: department navigation, catalogue presentation, project screens, approval/dispatch/return screens. Core mutations are browser simulations with a direct email bridge.
- Backend explicitly unavailable in `/api/capabilities`: reservation fulfilment, retained-in-project closure, numeric REPO, external AI provider and calendar reminders. Screens or mock scores must not be presented as those backend capabilities.
- MongoDB is reachable now. MySQL is not the running API engine. Cloud deployment, S3, provider failover and production concurrency were not demonstrated.
- Health checks SQL only; the reported `documents: mongo` and `email: smtp` fields name configured providers, not their health. Mongo was checked separately.
- Live unauthenticated GET requests to requests, projects and notifications return HTTP 401, confirming that those backend routes enforce authentication. This does not protect the separate email bridge routes.

## Validation

Browser reproduction evidence: `.artifacts/code-review-browser.json`. All browser mutations were confined to an ephemeral profile and did not call the notification bridge. Backend pytest uses temporary SQLite databases and local adapters per tests/conftest.py. Live service tests are opt-in and separate.

Fresh validation: **61 passed, 2 skipped, 0 failed in 397.77 seconds**. The two skipped tests require dedicated MySQL/Mongo test URLs. One dependency deprecation warning. JUnit evidence: `.artifacts/review-tests.xml`. Root frontend build passed (large-bundle warning); separate TypeScript frontend typecheck and production build also passed. These passing backend tests do not cover the root browser mocks or prove live MySQL integration.

## Recommended implementation sequence

1. Unify the main UI with authenticated backend requests and canonical IDs/states.
2. Remove authentication bypasses and unauthenticated email send paths.
3. Demonstrate the backend approval, issue and return lifecycle from the polished website across two independent browser sessions.
4. Correct duration, amendment and extension UI contracts; retire duplicate local accounting code.
5. Make SMTP outbox processing durable and run an observable worker.
6. Exercise MySQL and Mongo integration against dedicated test databases, then deploy one cloud environment and rehearse the exact live demonstration.
