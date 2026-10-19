# LabTrack — Desktop Structural Layout & Wireframe Specification

## 1. Document Overview

This specification establishes the authoritative multi-screen structural layouts (wireframes) for the **LabTrack Desktop Application** (targeting macOS and Windows workstations via modern browser / Desktop PWA / Tauri).

### Architectural Guardrails Reflected:
1. **Strict 2-Tier Inventory Model:** All screens enforce the division between **Serialized Assets** (individual tracking, loan lifecycle, condition inspection, defect logging) and **Depletable Consumables** (batch quantity tracking, permanent issue, stock decrement without return).
2. **Discrete Multi-Frame Architecture:** Rather than compressing multiple workflows into a single view, each functional module across the route hierarchy is granted its own dedicated, high-density desktop frame.
3. **Role-Based Access Control (RBAC):** Every screen clearly defines its operational boundaries across **Student (Requester)**, **Faculty Mentor (Supervisor)**, **Lab Assistant (Custodian)**, and **Department Admin (Auditor)**.

---

## 2. Global Shell & Persistent Frame Shell

All desktop views share a common outer layout shell comprising a **Persistent Top Context Header** and a **Collapsible Side Navigation Rail**.

### Global Header Specifications:
* **Brand Block:** `LABTRACK` wordmark with active cyan indicator dot.
* **Institutional Context:** Department identifier (`Department: Artificial Intelligence & Machine Learning`).
* **Identity Tag:** Active student PRN or staff ID in monospaced font (`PRN: 202401048` / `STAFF ID: LA-04`).
* **Quick Role Switcher:** Dropdown pill allowing instantaneous role-switching for oral defense, evaluation, and RBAC boundary verification.

### Navigation Rail Items:
* **Core Section:** `Overview`, `Inventory`, `Custody`, `Reliability`, `Projects`.
* **Staff Operations Section:** `Dispatch`, `Approval`, `Defect`.

---

## 3. Dedicated Desktop Screen Wireframes

---

### Frame 1: Master Inventory Registry
* **Route:** `/workspace/inventory`
* **Access Boundary:** All Roles (Student, Faculty Supervisor, Lab Assistant, Department Admin)
* **Purpose:** Hardware catalog discovery, live availability, physical lab coordinates, and batch stock levels.

```text
+----------------------------------------------------------------------------------------------------------------------------------+
| LABTRACK  |  Department: Artificial Intelligence & Machine Learning          |  PRN: 202401048  |  [Role: Student ▾]               |
+-----------+----------------------------------------------------------------------------------------------------------------------+
|           |                                                                                                                      |
| NAV RAIL  | Master Inventory Registry                                                                [+ New Requisition]         |
| --------- | -------------------------------------------------------------------------------------------------------------------- |
| Core:     | [All Items]    [Serialized Assets]    [Consumables]                                                                  |
| - Overview|                                                                                                                      |
| - Inventory| Search: [Search by tag, nomenclature, SKU...    [⌘K]]   Filter Lab: [All Labs ▾]   In-Stock Only: [x]   View: [Table|Grid]  |
| - Custody | -------------------------------------------------------------------------------------------------------------------- |
| - Rel     | TAG ID         NOMENCLATURE                     LOCATION     TYPE         STATUS       QUEUE DEPTH      ACTIONS       |
| - Projects| -------------------------------------------------------------------------------------------------------------------- |
|           | AT-ESP-0104    ESP32-WROOM-32D DevBoard         L2-CB4-R2    Asset        Available    --               [...]         |
| Staff Ops:| AT-JET-0012    NVIDIA Jetson Nano 4GB           L1-RK1-B0    Asset        Allocated    3 Teams          [...]         |
| - Dispatch| AT-UNO-0482    Arduino Uno Rev3                 L2-CB1-R4    Asset        Available    --               [...]         |
| - Approval| CNS-RES-001    10k Ohm 1/4W Resistors (Pack)    L2-BN0-B4    Consumable   In Stock     --               [...]         |
| - Defect  | CNS-JMP-005    Male-to-Female Jumper Wires 40pk L2-BN1-A2    Consumable   In Stock     --               [...]         |
|           | -------------------------------------------------------------------------------------------------------------------- |
|           | Showing 1 - 5 of 1,420 registered items                                                           [Prev] Page 1 [Next]|
+----------------------------------------------------------------------------------------------------------------------------------+
```

---

### Frame 2: Custody & Requisitions Desk
* **Route:** `/workspace/custody`
* **Access Boundary:** Student (Self & Group) | Faculty (Supervised Teams)
* **Purpose:** Active loan tracking, countdown due dates, renewal requests, pending approval status, and disbursed consumable summary.

```text
+----------------------------------------------------------------------------------------------------------------------------------+
| LABTRACK  |  Department: Artificial Intelligence & Machine Learning          |  PRN: 202401048  |  [Role: Student ▾]               |
+-----------+----------------------------------------------------------------------------------------------------------------------+
|           |                                                                                                                      |
| NAV RAIL  | Custody & Requisition Desk                                                               [+ New Requisition]         |
| --------- | -------------------------------------------------------------------------------------------------------------------- |
| Core:     | [Tab 1: Active Borrowings (2)]      [Tab 2: Pending Requests (1)]      [Tab 3: FIFO Queue & Waitlist (1)]                |
| - Overview| -------------------------------------------------------------------------------------------------------------------- |
| - Inv     | Project Group: PRJ-AIML-2026-08 (DCDS Lab)  |  Faculty Mentor: Dr. Anjali Dalvi                                      |
| - Custody | -------------------------------------------------------------------------------------------------------------------- |
| - Rel     | ASSET TAG      ITEM NAME                        CHECKOUT DATE   DUE DATE        REMAINING TIME   STATUS     ACTIONS     |
| - Projects| -------------------------------------------------------------------------------------------------------------------- |
|           | AT-ESP-0104    ESP32-WROOM-32D DevBoard         2026-10-01      2026-10-22      8 Days Left      Normal     [Request Ext] |
| Staff Ops:| AT-UNO-0482    Arduino Uno Rev3                 2026-09-28      2026-10-16      2 Days Left      Imminent   [Request Ext] |
| - Dispatch| -------------------------------------------------------------------------------------------------------------------- |
| - Approval| Consumables Disbursed (Permanent Project Use):                                                                       |
| - Defect  | - CNS-RES-001 (20x 10k Resistors) — Disbursed 2026-10-01 | No return required                                        |
|           | - CNS-JMP-005 (1x 40pk Jumpers)   — Disbursed 2026-10-01 | No return required                                        |
+----------------------------------------------------------------------------------------------------------------------------------+
```

---

### Frame 3: Accountability & Reliability Desk
* **Route:** `/workspace/accountability/reliability`
* **Access Boundary:** Student (Self-Scorecard) | Faculty & Lab Assistants (Verification)
* **Purpose:** Institutional compliance rating gauge (0 to 100 scale), return punctuality rate, defect incident records, and audit log.

```text
+----------------------------------------------------------------------------------------------------------------------------------+
| LABTRACK  |  Department: Artificial Intelligence & Machine Learning          |  PRN: 202401048  |  [Role: Student ▾]               |
+-----------+----------------------------------------------------------------------------------------------------------------------+
|           |                                                                                                                      |
| NAV RAIL  | Student Reliability & Compliance Scorecard                                                                           |
| --------- | -------------------------------------------------------------------------------------------------------------------- |
| Core:     | +------------------------------------+  +--------------------------------------------------------------------------+ |
| - Overview| |        COMPLIANCE RATING           |  | SUMMARY METRICS (Sem 3 - AY 2026)                                        | |
| - Inv     | |                                    |  | - Total Hardware Allocations: 14 Items                                   | |
| - Custody | |            /=========\             |  | - On-Time Return Rate:        94.2%                                      | |
| - Rel     | |           /     94    \            |  | - Technician Defect Reports:  0 Incidents                                | |
| - Projects| |          |   TIER: HIGH  |           |  | - Status: Eligible for Standard FIFO Auto-Approval                        | |
|           | |           \  COMPLIANCE /            |  +--------------------------------------------------------------------------+ |
| Staff Ops:| |            \=========/             |                                                                                |
| - Dispatch| +------------------------------------+                                                                                |
| - Approval| -------------------------------------------------------------------------------------------------------------------- |
| - Defect  | HISTORICAL INCIDENT & RETURN LEDGER                                                                                  |
|           | -------------------------------------------------------------------------------------------------------------------- |
|           | DATE         ASSET TAG      HARDWARE ITEM                    RETURN CONDITION     TECHNICIAN SIGN-OFF   PENALTY      |
|           | 2026-09-20   AT-RP1-0004    Raspberry Pi 4 Model B           Verified Clean (A)   R. Sharma (L1-AI)     None         |
|           | 2026-09-05   AT-SEN-0031    MPU-6050 Accelerometer           Verified Clean (A)   P. Verma (L2-IoT)     None         |
+----------------------------------------------------------------------------------------------------------------------------------+
```

---

### Frame 4: Lab Assistant Dispatch & Check-in Counter
* **Route:** `/workspace/operations/dispatch`
* **Access Boundary:** Lab Assistant (Custodian) Only
* **Purpose:** Keyboard-driven counter terminal for issuing hardware to verified student PRNs and conducting physical return condition inspections.

```text
+----------------------------------------------------------------------------------------------------------------------------------+
| LABTRACK  |  Department: Artificial Intelligence & Machine Learning          |  STAFF ID: LA-04  |  [Role: Lab Assistant ▾]        |
+-----------+----------------------------------------------------------------------------------------------------------------------+
|           |                                                                                                                      |
| NAV RAIL  | Counter Operations Terminal                                  [Mode 1: Dispatch]    [Mode 2: Return / Inspection]     |
| --------- | -------------------------------------------------------------------------------------------------------------------- |
| Core:     | Step 1: Scan / Enter Student PRN: [202401048                                   ]  [Fetch Approved Requisition]     |
| - Overview| -------------------------------------------------------------------------------------------------------------------- |
| - Inv     | Student: Rahul Sharma  |  PRN: 202401048  |  Project: PRJ-AIML-2026-08  |  Mentor Endorsed: YES (Dr. Anjali Dalvi)   |
| - Custody | -------------------------------------------------------------------------------------------------------------------- |
| - Rel     | PRE-APPROVED HARDWARE ITEM      TYPE         QTY    PHYSICAL ASSET TAG ASSIGNMENT               CONFIRM DISPATCH     |
| - Projects| -------------------------------------------------------------------------------------------------------------------- |
|           | ESP32-WROOM-32D DevBoard        Asset        1      [Select Tag: AT-ESP-0104 (L2-CB4-R2) ▾]     [x] Verified Box     |
| Staff Ops:| 10k Ohm 1/4W Resistors          Consumable   20     [Log Quantity: 20 units (L2-BN0-B4)   ]     [x] Disbursed Batch  |
| - Dispatch| -------------------------------------------------------------------------------------------------------------------- |
| - Approval| Check-in Inspection Checklist (When in Return Mode):                                                                |
| - Defect  | [x] Pins Straight & PCB Undamaged   [x] Functional Power Indicator Illuminates   [x] Accessories & Cable Complete    |
|           |                                                                                   [Execute Clean Restock]  [Log Defect]|
+----------------------------------------------------------------------------------------------------------------------------------+
```

---

### Frame 5: Faculty Supervisor Review Desk
* **Route:** `/workspace/operations/approvals`
* **Access Boundary:** Faculty Mentor (Supervisor) Only
* **Purpose:** Academic vetting of student hardware requests, verifying stated project purpose, checking reliability score, and approving allocations.

```text
+----------------------------------------------------------------------------------------------------------------------------------+
| LABTRACK  |  Department: Artificial Intelligence & Machine Learning          |  FACULTY: Dr. A. Dalvi | [Role: Faculty Mentor ▾]       |
+-----------+----------------------------------------------------------------------------------------------------------------------+
|           |                                                                                                                      |
| NAV RAIL  | Academic Requisition Approval Desk                           Pending Reviews: 3 Groups                               |
| --------- | -------------------------------------------------------------------------------------------------------------------- |
| Core:     | Filter by Course: [DCDS Lab - SY AIML ▾]       Filter Urgency: [All Requests ▾]                                      |
| - Overview| -------------------------------------------------------------------------------------------------------------------- |
| - Inv     | DATE        TEAM & COURSE       REQUESTED HARDWARE ITEMS       STATED TECHNICAL PURPOSE       SCORE  ACTIONS         |
| - Custody | -------------------------------------------------------------------------------------------------------------------- |
| - Rel     | 2026-10-14  PRJ-AIML-08         1x ESP32 DevBoard (Asset)      "Implementation of MQTT broker  94.2%  [Approve]       |
| - Projects|             (SY AIML Sem 3)     20x 10k Resistors (Consumable)  and local telemetry node for    (High) [Reject]        |
|           |                                                                 DCDS ESE evaluation task"             [Modify Qty]     |
| Staff Ops:| -------------------------------------------------------------------------------------------------------------------- |
| - Dispatch| 2026-10-13  PRJ-AIML-14         1x NVIDIA Jetson Nano (Asset)  "Edge computer vision model     74.0%  [Approve]       |
| - Approval|             (TY AIML Sem 5)                                    inference pipeline test"        (Flag) [Reject w/ Note] |
| - Defect  |                                                                                                    [Requires Audit] |
+----------------------------------------------------------------------------------------------------------------------------------+
```

---

### Frame 6: Academic Projects Directory
* **Route:** `/workspace/projects`
* **Access Boundary:** All Roles (Student, Faculty, Staff)
* **Purpose:** Group profiles, course code bindings (e.g. `DCDS-SY-AIML`, `CCE-TY`), mentor bindings, hardware custody quotas, and team rosters.

```text
+----------------------------------------------------------------------------------------------------------------------------------+
| LABTRACK  |  Department: Artificial Intelligence & Machine Learning          |  PRN: 202401048  |  [Role: Student ▾]               |
+-----------+----------------------------------------------------------------------------------------------------------------------+
|           |                                                                                                                      |
| NAV RAIL  | Academic Projects & Hardware Custody Directory                                                                        |
| --------- | -------------------------------------------------------------------------------------------------------------------- |
| Core:     | Search: [Search team, student PRN, course code...]           Course: [All Courses ▾]          Status: [Active ▾]    |
| - Overview| -------------------------------------------------------------------------------------------------------------------- |
| - Inv     | PROJECT ID     PROJECT TITLE / DOMAIN           COURSE CODE      FACULTY MENTOR     ACTIVE LOANS   QUOTA   ACTIONS   |
| - Custody | -------------------------------------------------------------------------------------------------------------------- |
| - Rel     | PRJ-AIML-08    IoT Pipeline for Sensor Logging  DCDS-SY-AIML     Dr. Anjali Dalvi   2 Assets       2/3     [View Dossier]|
| - Projects| PRJ-AIML-12    Autonomous Line-Following Robot  CCE-TY-AIML      Dr. Sumanto Dutta  3 Assets       3/3     [View Dossier]|
|           | PRJ-AIML-19    Solar Inverter Telemetry Gateway DCDS-SY-AIML     Dr. Wasim Khan     1 Asset        1/3     [View Dossier]|
| Staff Ops:| -------------------------------------------------------------------------------------------------------------------- |
| - Dispatch| Selected Project Dossier Preview: PRJ-AIML-08                                                                        |
| - Approval| - Team Members: Rahul Sharma (202401048), Priya Nair (202401052), Aman Gupta (202401061)                             |
| - Defect  | - Active Hardware: [AT-ESP-0104 (Due Oct 22)], [AT-UNO-0482 (Due Oct 16)]                                            |
+----------------------------------------------------------------------------------------------------------------------------------+
```

---

## 4. Summary Matrix of Desktop Layout Views

| Frame # | Module / Route | Primary Visual Element | Dominant User Action | 2-Tier Inventory Treatment |
|---|---|---|---|---|
| **Frame 1** | Master Inventory (`/workspace/inventory`) | Dense data table with search and lab filters | Hardware search & Requisition dispatch | Direct tab split: Assets vs. Consumables |
| **Frame 2** | Custody Desk (`/workspace/custody`) | Timeline with countdown status badges | Extension requests & Queue tracking | Assets require return; Consumables show stock decrement |
| **Frame 3** | Reliability Desk (`/workspace/accountability`) | Dynamic compliance arc gauge (0-100) | Review historical compliance ledger | Tracks care & return punctuality of serialized assets |
| **Frame 4** | Dispatch Terminal (`/workspace/operations/dispatch`) | Counter verification & condition checklist | Serialized Tag assignment & Restock/Defect | Serialized tag matching vs. consumable quantity logging |
| **Frame 5** | Approvals Desk (`/workspace/operations/approvals`) | Queue table with team reliability scores | Endorse / Reject hardware allocation | Validates academic need for assets and consumables |
| **Frame 6** | Projects Directory (`/workspace/projects`) | Project dossier card and team rosters | Team roster lookup and quota auditing | Enforces hardware custody quotas per student team |
