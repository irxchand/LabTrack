# LabTrack demonstration

Use only synthetic accounts. The application is available locally at `http://127.0.0.1:8000` while the session's server is running. Default seed credentials are in `docs/guides/RUN_GUIDE.md`.

## Consumable branch

1. Sign in as `DEMO-STU-001`. Create a project with Mentor `T00001` and optional student member `DEMO-STU-002`.
2. Catalogue: choose HC-SR04 sensors ×2 and DC gear motors ×2. Review the availability/minimum-lab plan; select the project and requested duration. Submit.
3. Sign out, sign in as `T00001`, open the new request and approve. The Central Store system stage is recorded; no Central Store login is needed.
4. Sign in as `T00003` and approve at the HoD stage.
5. Sign in as `N00001`, claim the order, physically verify every line and confirm the full issue. The software creates one due-time version and commits the whole request together.
6. As the student, request a later due time. Mentor then HoD approve; show the old and new due dates in extension history.
7. As Assistant, inspect and reconcile all returned quantities. Good + bad + missing must equal the issued quantity. As student, acknowledge the recorded return.

## Asset branch

1. Student requests Jetson Nano ×1 for **Use in college**. This is a real use/checkout transaction in the application.
2. Approvals: Mentor `T00001` → In-Charge `T00002` → HoD `T00003`.
3. Assistant `N00001` claims the order, selects the matching physical SIT Barcode, verifies the whole handover and issues it.
4. Return: inspect the exact barcode. A functional FAIL cannot make it AVAILABLE. Damaged/defective assets require a PNG/JPEG evidence upload; good returns can be reconciled directly.
5. Show the immutable timeline and the original issuing lab. An inspection finding does not automatically establish student fault or a monetary penalty.

## Exceptions and evidence

- LiDAR Module has zero good stock in the synthetic fixture. Join FIFO or record unmet demand. The queue entry is real; hold/ready/pickup progression is intentionally unavailable pending OD-04.
- Search for an unstocked component name and record unmet demand. This creates an analytics event, not new inventory or a purchase order.
- Explore curated alternatives for HC-SR04; candidates are rechecked against current stock. External AI is not connected.
- The API demo replays an issue command with the same idempotency key and confirms one result.
- Automated tests race two claims and two stock-competing issues, and simulate a shortage in a later multi-lab line. No earlier stock line is partially decremented.
- Run the dispatcher (or leave the local worker running) and show the student's notification centre. Local email JSON is a preview; it is not an externally sent Gmail message.
- HoD Reports shows cumulative issued usage and aggregated unmet demand. Faculty Incidents shows authorized inspection findings without invented blame/score.

`scripts/demo_flow.py` automates both API lifecycles. `scripts/browser_demo.mjs` exercises actual browser forms/role changes and captures desktop/mobile evidence. It uses the bundled Playwright runtime when `LABTRACK_NODE_MODULES` is configured.

## Presentation boundaries

Explain that the run is local and synthetic. Do not claim measured departmental savings, institutional adoption, active calendar reminders, finished reservation fulfilment, numeric REPO/NLP, live MySQL/Mongo testing, cloud deployment or production DR readiness. The presentation's status notes match these boundaries. Pending SDD validation does not block this user-authorized execution track.
