# Mock State Backup (Saved on 2026-10-19)

This directory contains the full snapshot of the previous mock state, loans, historical requisitions, and database events before transitioning to the clean-slate testing environment.

## Contained Artifacts:
1. `mockData.js` (128 KB) - Complete mock dataset containing the historical 10+ requisitions (`REQ-2026-102` through `110`, `446`, `512`), active loans, and audit traces.
2. `labtrack.db` (307 KB) - SQLite database file containing all 22 relational tables and previous operational records.
3. `requisition_events.json` (16.6 KB) - Complete log of previous requisition lifecycle webhook and notification events.

## Restoring Previous Mock State:
To restore the previous mock state:
1. Copy `utilities/mockstate/mockData.js` back to `src/data/mockData.js`.
2. Copy `utilities/mockstate/labtrack.db` back to `.local/labtrack.db`.
3. In `LabDataContext.jsx` and `custody.api.js`, set `CURRENT_SCHEMA_VERSION = 'v12_clean_slate_2026'`.
