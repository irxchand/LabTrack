# LABTRACK — COMPLETE MASTER CONTEXT & SOURCE-OF-TRUTH DOCUMENT
## For PPT Generation, Faculty Discussion, Project Planning, Academic Mapping, and Downstream AI Agents

> **Purpose of this document:** This is a detailed context pack for any AI agent that must understand the LabTrack project before producing a PPT, project proposal, faculty-question sheet, workflow, requirements document, UI plan, academic mapping, or similar artifact.
>
> **Important:** This document intentionally distinguishes:
> 1. Things explicitly stated/observed by the project team.
> 2. V1 decisions/temporary assumptions made for development.
> 3. Questions that must be answered by faculty/college.
> 4. Future scope.
>
> **Do not silently convert an assumption into an institutional fact.**
>
> **Do not invent information that is not present here.**
>
> **If a faculty/college answer later conflicts with a V1 assumption, the faculty/college answer becomes authoritative.**

---

# PART A — PROJECT IDENTITY AND CONTEXT

## A1. Project Name

Working name:

**LabTrack**

Working description:

**LabTrack — Hardware Component Availability, Issuance & Tracking System**

The name is a working name unless formally finalized.

---

## A2. What the Project Is

LabTrack is a proposed centralized system for managing the lifecycle of laboratory hardware/components used by students for academic projects.

The project is intended to digitize and automate the work currently performed through a combination of:

- Email
- Manual availability checking
- Physical notebooks
- Excel inventory
- Manual issue records
- Manual due-date tracking
- Manual reminder emails
- Manual return inspection
- Manual defect/loss handling
- Informal reservation handling
- Manual escalation
- Manual penalty handling

The project is **not intended to be only an inventory CRUD system**.

The central concept is the complete lifecycle:

**Project Requirement → Component Discovery → Availability Check → Request → Approval → Physical Issue → Active Tracking → Reminder / Extension / Reservation → Return → Inspection → Defect/Penalty Handling → Inventory Update → History**

---

## A3. Faculty Discussion Clarification Record — Manoj Sir Discussion

The faculty discussion began with the project introduction and PPT, including the **hardware availability/tracking problem**, **how the data is stored**, and the **prototype**. The points below are the latest faculty-informed project understanding and supersede conflicting older V1 assumptions.

### Confirmed/current understanding

- Current departmental scope is **Robotics and Automation (R&A) only**. The central inventory/database contains R&A inventory only.
- The inventory model has **two primary classes: Assets and Consumables**.
- **Assets** are individually identifiable institutional hardware and are barcode tracked.
- Each asset has a **SIT Barcode, Default ID, and Bill Number**. A bill number may be shared by multiple assets from the same procurement lot and is not assumed to be unique per physical unit.
- Examples of assets discussed: **Turtle Bot, Robotic Arm, Intel Depth Camera, Jetson Nano, and PLC**.
- **SIT Barcode is the primary system lookup/identity key for an asset**. Default ID remains an institutional/default identifier. Bill Number is procurement metadata.
- **Consumables are quantity-tracked, returnable items**, not disposable/one-time-use items. They are not individually identified because their unit value is comparatively low.
- Sensors and actuators are treated as consumables in the current R&A model.
- Consumable classes include **Sensor, MC, Microprocessor, Motors, Misc, Communication Module, and Battery**.
- Consumable quantities are maintained **per lab**. Central Store is the department's central inventory/management entity; physical issuance still occurs from labs.
- Bad consumables are tracked in the current model. **Good quantity, bad quantity, and total physical quantity are maintained**, with total physical quantity = good + bad.
- Sensor metadata may include **description, brand and range**. Detailed description is only important where the variety of consumables is high.
- **Faculty Mentor** and **Lab In-Charge** are distinct faculty relationships/roles.
- A **Lab In-Charge is a faculty role** responsible for one lab or at most two labs.
- A **Lab Assistant can manage multiple labs** and performs the physical issue/return work for the labs assigned to them.
- **HoD is a first-class system role** with Super Access within the R&A application, visibility of all projects, broad permissions, and the **only overwrite access**.
- **All normal requests reach the HoD for final approval** in the current system design.
- **Consumable request flow:** Student → Faculty Mentor → Central Store → HoD → Lab Assistant of the issuing lab → physical issue / quantity update.
- **Asset request flow:** Student → Faculty Mentor → relevant Lab In-Charge (faculty) → HoD → Lab Assistant of the issuing lab → physical asset handling.
- For assets, **asset use and asset issuance are separate permissions/approval purposes**. The asset request identifies whether the student is seeking permission to use the asset in college or to take it outside/home; the approval route/purpose is distinguished accordingly.
- Assets are generally not treated like ordinary student-borrowed consumables; the relevant Lab In-Charge and Lab Assistant control asset handling.
- The system must select the issuing arrangement so that the **minimum number of labs** is used to satisfy a multi-component project request, subject to actual availability.
- Reservation applies to **both Assets and Consumables**. For assets, the reservation is for an **asset type first**, after which a specific physical asset is assigned manually or from available matching assets.
- Reservation order is **FIFO**. Reservation expiration is time-based, with the exact expiry duration still configurable.
- Borrowing/usage duration is **determined by the student/project requirement and department decision**, rather than a universal hard-coded duration.
- Components can follow a legitimate **Retained in Project** closure path: the project is handed over to the department as a project, the issue is closed as returned, the component/asset is removed/decommissioned from active inventory, and the physical item remains stored with that project.
- The reminder policy is **5 days before due date and every day after due date** while overdue.
- Formal overdue escalation occurs after **N = 7 overdue days** in the current V1 configuration.
- Reminder emails are sent to the **student and relevant lab personnel**.
- The repeated-offender feature is approved. Repeated-offender information is visible to **authorized Faculty, HoD and Lab In-Charge** users; no numeric reputation/penalty formula is required for the current scope.
- **Automated penalty calculation is out of current scope**.
- Asset-to-lab transfer is **not a V1 requirement**.
- Unmet-demand information is intended for **central inventory management / Central Store**.
- Authentication is coordinated through the **IT administrator**, but the exact institutional authentication protocol is not required for the current prototype. The application should therefore use a replaceable authentication boundary and dummy authentication/data during V1.
- All prototype users, students, faculty, labs, components and inventory records are **dummy/synthetic data**.
- Cloud deployment with dummy data is permitted for the current project demonstration.
- MySQL is the current SQL direction. MongoDB/NoSQL remains required for the DCDS academic integration.
- AI is **not a priority** and remains optional/advisory.
- Bill/purchase/CPR references are useful inventory metadata and should be supported where available.

The discussion resolved the major workflow, role, inventory, identification, reservation, reminder, scope and prototype-data decisions. Remaining open items are limited to institutional or policy details that were not explicitly specified, and are retained in PART AU.

# PART A3 — PROJECT IDENTITY WITHIN THE SYSTEM

Every LabTrack project is a first-class record and must have both a **Project ID** and a **Project Name**.

### Project ID

- Format: `PROJ-000001`, `PROJ-000002`, ...
- Generated sequentially by the system/database.
- Immutable after creation.
- Never reused after deletion/archival.
- The sequence is global within the LabTrack deployment.
- Project ID is the stable machine/reference identifier used in requests, approvals, issues, notifications, audit records and reports.

### Project Name

- Required human-readable name.
- May be edited only by the authorized project manager/lead according to the project-editing rules below.
- Project Name is not the unique system identifier; Project ID remains authoritative.

Every downstream artifact that references a project should display both where useful: `PROJ-000001 — Autonomous Rover`.

# PART B — ORIGINAL PROBLEM AS UNDERSTOOD

## B1. Existing Manual Process

The process described by the project team is:

1. A student/team has a project.
2. The student emails the lab assistant and concerned faculty with the project/component requirements.
3. The lab assistant manually checks availability.
4. If components are available, the lab assistant replies with pickup information.
5. The student physically collects the components.
6. The lab assistant records the issue in a notebook.
7. The student receives a deadline.
8. The lab assistant manually tracks the deadline.
9. The lab assistant sends reminder emails.
10. The student returns the components.
11. The lab assistant physically checks the components.
12. If a component is damaged/defective/missing, additional manual communication and departmental handling occurs.
13. Inventory and records must be updated manually.
14. Students who want components that are already issued do not have a unified digital reservation/queue mechanism.

---

## B2. Problems Identified

### For lab assistants

- Manual availability checking.
- Repeated email communication.
- Manual notebook entries.
- Manual deadline tracking.
- Manual reminder generation.
- Difficulty tracking many active issues.
- Manual reservation handling.
- Manual return inspection records.
- Manual defect/loss tracking.
- Manual penalty handling.
- Difficulty maintaining one reliable history.

### For students

- No centralized inventory discovery.
- They may not know whether a component is available.
- They may not know which lab has it.
- They may not know the responsible lab assistant.
- Requests are email-driven.
- Approval status is not centralized.
- No unified reservation queue.
- No unified borrowing history.
- No centralized due-date tracking.

### For faculty

- Requests arrive through email.
- Project/component information is fragmented.
- Approval status is not centralized.
- Overdue cases require manual communication.
- Defect/penalty information is not centralized.

### For department

- Inventory is partly distributed across Excel/manual records.
- Historical issues are partly in notebooks.
- There is limited centralized traceability.
- Repeated unmet demand is difficult to analyze.
- Utilization/demand intelligence is difficult.
- Accountability is weaker when records are distributed.

---

# PART C — TARGET ENVIRONMENT

The project team previously described an approximate environment of:

- **8–10 labs**
- **10–12 lab assistants**
- **700–800 students**
- Maximum expected concurrent users: approximately **5–10**

These figures describe the broader operating environment. The **current system/database boundary is one department: Robotics and Automation (R&A)**.

### Current scope

- The current prototype is department-scoped to **R&A**.
- The central inventory database should contain **R&A components/assets only**.
- Cross-department inventory sharing is outside the current scope.
- Long-term adoption remains a goal, not an approved institutional rollout.

Current inventory is partly in **Excel**.

Current issue history is partly in **notebooks**.

# PART D — PROJECT GOALS

The system is intended to:

1. Centralize Robotics and Automation inventory information.
2. Make availability and category information visible.
3. Show relevant component specifications.
4. Show relevant lab/location and responsible staff information.
5. Organize requirements around projects and student teams.
6. Support Faculty Mentors in request review.
7. Distinguish **Assets** from **Consumables**.
8. Track assets individually through institutional identifiers.
9. Track consumables by aggregate quantity.
10. Route requests through class-specific workflows.
11. Provide HoD super access and overwrite authority.
12. Preserve Lab In-Charge authority for asset workflows.
13. Preserve Lab Assistant operational authority for physical inventory processing.
14. Track issuing lab/source for issued components/assets.
15. Track active transactions and due dates.
16. Send confirmed reminders.
17. Support extension, reservation, return and reconciliation features under the current configurable workflow.
18. Preserve defect, damage, loss and historical accountability records where applicable; automated penalty calculation is out of current scope.
19. Support the repeated-offender direction without inventing a score formula.
20. Provide unmet-demand and usage intelligence.
21. Keep AI advisory and non-authoritative.
22. Keep the database authoritative for actual inventory state.
23. Use **MySQL 8.4 + SQLAlchemy 2.x + Alembic** as the current SQL stack, with MongoDB/NoSQL for the DCDS integration.
24. Support cloud demonstration across a provider-portable architecture and eventual migration to approved college infrastructure.
25. Use an event-driven notification model in which one authoritative domain event can fan out to in-app/web and email channels.
26. Keep the web application as the primary client and preserve a future path to a mobile application without rewriting the backend.

# PART E — USERS AND ACCESS

# E1. Student

A student should be able to:

- Log in and view their profile.
- Create/manage projects and add team members.
- Select a Faculty Mentor.
- Enter/select component requirements.
- Search the R&A catalogue.
- See availability/quantity **during requirement entry/request creation**.
- See the labs that can fulfil the request where applicable.
- Submit requests through the Faculty Mentor workflow.
- Reserve unavailable/issued items where reservation rules permit.
- View active issues, due dates and notifications.
- Request an extension where permitted.
- Return components where applicable.
- Choose/enter the required usage or borrowing duration; final acceptance remains subject to departmental approval.
- View relevant history and repeated-offender information only to the extent authorized.

---

# E2. Student / Institutional Data

Expected student information:

- Name
- PRN
- Batch
- Branch
- Email
- Section
- Phone

PRN remains the intended primary student identifier. A previously discussed PRN encoding is project context only and must still be validated against authoritative college data.

For the current prototype, **all student/institutional data is dummy/synthetic** and must be structured so it can later be replaced by an institutional dataset without changing the application workflow or schema unnecessarily.

Known identifier formats:

- Teacher ID: `T` + **5 digits**
- Staff ID: `N` + **5 digits**

---

# E3. Faculty

Faculty capabilities include:

- View projects relevant to their role.
- View project members and requirements.
- Act as **Faculty Mentor** for projects.
- **Approve or reject** the request at the Faculty Mentor stage.
- Review the request before HoD final approval.
- Participate in the class-specific request flow.
- Receive relevant notifications.

## Faculty Mentor vs Lab In-Charge

These are **distinct roles/entities**.

- **Faculty Mentor:** faculty member associated with the student's project and the first faculty review/decision point.
- **Lab In-Charge:** faculty role attached to one or at most two labs and used as the asset-side review/authority point.

Whether the same person can hold both relationships is not required to be decided for the prototype and should remain data-configurable.

---

# E4. Lab In-Charge

The **Lab In-Charge is a faculty role**.

Confirmed/current understanding:

- Responsible for **one lab or a maximum of two labs**.
- Handles the **asset-side request review/decision** instead of Central Store.
- The request then proceeds to the HoD for final approval.
- Associated with relevant asset/lab responsibility.
- Asset verification is especially important.
- **Asset use and asset issuance are separate permissions/approval purposes**.
- After HoD approval, the physical request is routed to the **Lab Assistant of the issuing lab**.

---

# E5. Lab Assistant

The Lab Assistant is the operational physical-inventory role.

Confirmed/current understanding:

- Can manage **multiple labs**.
- Receives approved operational orders for the relevant lab.
- Does not decide the upstream approval path; the system sends the Lab Assistant the approved order to execute.
- Performs physical verification and issue/return processing.
- Tracks the source/issuing lab.
- For assets, verifies the specific physical unit using the institutional asset identifiers.
- For consumables, performs the quantity-based issue/update.
- Handles physical return/reconciliation and recorded condition where applicable.

**Lab Assistant does not have HoD overwrite access.**

---

# E6. HoD

The **HoD is a first-class system role** and must be represented separately from generic faculty/admin roles.

Confirmed/current characteristics:

- **Super Access** across the current R&A application.
- Can **see all R&A projects**.
- Has broad application permissions.
- Is the **only role with overwrite access**.
- Receives **all normal request paths for final approval** in the current design.
- Can pass/approve/reject requests and directly modify records under the overwrite authority where needed.

The detailed technical implementation of overwrite must remain auditable, but no narrower field-by-field restriction is required for the current prototype.

---

# E7. Technical / System Admin

The technical/admin role is distinct from institutional HoD authority.

For the prototype, it may be used for development, testing, debugging, seed-data loading, configuration and deployment. It must not be treated as a replacement for the institutional approval roles.

The eventual institutional user/role mappings must be replaceable without rewriting the application's business logic.

# PART F — PROJECT STRUCTURE

A **Project** should be a first-class concept.

A project can have:

- Project name
- Project description/details
- Multiple student members
- Faculty mentor(s) as permitted
- Component requirements
- Component requests
- Issue history
- Return/history information

The system should be project-centric rather than treating component requests as disconnected student actions.

Conceptual relationship:

**Project → Students → Faculty → Component Requirements → Requests → Issues**

---

# PART G — INVENTORY MODEL

The faculty discussion establishes **two primary inventory classes**:

## G1. Assets

Assets are individually identifiable institutional hardware.

Examples:
- Turtle Bot
- Robotic Arm
- Intel Depth Camera
- Jetson Nano
- PLC

Each asset has the existing institutional metadata discussed by faculty:

- **SIT Barcode** — primary system lookup/identity key
- **Default ID** — institutional/default identifier
- **Bill Number** — procurement reference; may be shared by many assets in the same lot

Assets are barcode tracked. Asset verification and physical traceability are especially important.

Assets are generally not ordinary student-consumable issues. The system distinguishes **asset use permission** from **asset issuance/take-out permission**.

---

## G2. Consumables

Consumables are **quantity-tracked, returnable items** rather than disposable/one-time-use items.

Current faculty-confirmed rules:

- Sensors are consumables.
- Actuators are consumables.
- Consumables are not individually identified in normal tracking.
- Consumable classes include:
  - Sensor
  - MC
  - Microprocessor
  - Motors
  - Misc
  - Communication Module
  - Battery
- Quantity is maintained **per lab**.
- Central Store is the department's central inventory/management entity; physical issuance still happens from labs.
- Bad consumables are tracked in the current model.
- **Good quantity + bad quantity = total physical quantity**.
- Sensor details may include description, brand and range.
- Detailed consumable descriptions are mainly useful when variety is high.

---

## G3. Component Catalogue vs Physical Asset

The catalogue/component entity represents the type/class of item stocked by R&A.

For **Assets**, the catalogue type is linked to separate physical-asset records carrying SIT Barcode, Default ID and Bill Number.

For **Consumables**, the catalogue type is linked to aggregate per-lab quantities rather than one record per physical unit.

The model must not force individual physical tracking onto consumables.

# PART H — IDENTIFICATION AND QUANTITY RULES

## H1. Asset identifiers

Preserve the institutional identifiers:

- **SIT Barcode — primary system lookup/identity key**
- Default ID
- Bill Number

The application may use its own technical database primary key internally, but business logic and UI lookup should preserve the institutional identifiers. SIT Barcode is the primary physical-asset lookup key.

## H2. Consumable quantity

Maintain aggregate quantity **per lab** for each consumable item/class in the R&A inventory.

Maintain:

- Good quantity
- Bad quantity
- Total physical quantity = Good + Bad

Consumables are not individually numbered for normal issue tracking.

## H3. Procurement references

Bill number tracking is useful inventory metadata. CPR/purchase-number annotations are useful where available. Bill number uniqueness must not be assumed.

# PART I — LAB MAPPING

Current departmental model:

- Scope is **Robotics and Automation only**.
- A **Lab In-Charge is a faculty role** for one lab or a maximum of two labs.
- A **Lab Assistant can manage multiple labs**.
- Assets are associated with their relevant lab and Lab In-Charge faculty.
- Consumables have **per-lab quantities**, while Central Store provides the central departmental inventory-management view.
- Every issue transaction must preserve **which lab the component/asset was issued from**.
- Asset transfer between labs is **not a V1 requirement**.

Detailed shelf/cabinet/bin tracking is not established as a current requirement.

---

## I1. Minimum-Lab Fulfilment Algorithm

### Objective

For a project requesting multiple component types, LabTrack should fulfil the request using the **minimum possible number of labs**, subject to actual stock availability.

Example intent:

- 10 component types are needed.
- If Lab A can supply all 10, issue from Lab A only.
- If Lab A supplies 6, Lab B supplies 4, and no smaller lab set can satisfy all requirements, use Lab A + Lab B rather than distributing the issue across more labs.

### Inputs

For each required component type `c`:

- `r[c]` = quantity required.

For each lab `l`:

- `q[l,c]` = good quantity of component `c` available in lab `l`.

### Feasibility rule

A selected lab set `S` is feasible when, for every required component `c`:

`Σ min(q[l,c], r[c]) for l in S  ≥  r[c]`

If any component does not have enough total good stock across all labs, the student is informed immediately that the requested quantity is unavailable. The system should not fabricate a fulfilment plan.

### Exact prototype algorithm

Because the current environment is only about **8–10 labs**, the prototype can use an exact subset-search algorithm:

1. Check total departmental availability for every requested component.
2. If any requested quantity is unavailable, mark that component as unavailable and inform the student during request entry.
3. Generate lab subsets in increasing order of subset size.
4. For each subset, test the feasibility rule above.
5. The **first feasible subset is a minimum-cardinality lab set**.
6. If multiple feasible subsets have the same number of labs, maximize a deterministic **stock-concentration score**: `Σ_c Σ_l∈S min(q[l,c], r[c])`. This favors lab sets that can supply more of the requested quantities from the selected labs and therefore better concentration.
7. If the score is still tied, use a deterministic ascending lab identifier/order as the final tie-break.
8. Allocate each requested component from the selected labs using the selected concentration order; never exceed available good quantity.
9. Produce the operational orders grouped by issuing lab.

For `L` labs, exhaustive search checks at most `2^L` subsets; with 8–10 labs this is small enough for the prototype.

### Scalable formulation

For a larger future deployment, the same problem can be represented as a **0–1 optimization / quantity-constrained set-cover problem** with binary variable `x[l]` indicating whether lab `l` is selected. The primary objective is:

`minimize Σ x[l]`

with the secondary objective of maximizing the stock-concentration score above.

A greedy fallback can be used for very large lab counts by repeatedly selecting the lab with the highest weighted remaining-demand coverage until all requirements are satisfied.

### Important business rules

- The algorithm optimizes **number of issuing labs first**.
- The second objective is **maximum concentration/quantity capacity among equally sized lab sets**.
- It must never select a lab merely because it is convenient if the required quantity is not actually available there.
- The algorithm's result is a **planning allocation**, not a guarantee of physical fulfilment. The Lab Assistant performs the final live stock/asset verification at issue time.

# PART J — COMPONENT DISCOVERY

Students should search/select from the **R&A department catalogue**.

During requirement entry/request creation, the system should check availability **on the spot**.

Where applicable, show:

- Component name
- Category/class
- Description
- Technical specifications
- Brand
- Range for sensors where relevant
- Available quantity / availability
- Candidate labs
- Suggested minimum-lab fulfilment plan
- Reservation option where applicable
- Alternatives

If the requested quantity is unavailable, the student is informed during entry instead of discovering the shortage only after submitting the request.

# PART K — AVAILABILITY

Availability is class-specific.

## Assets

Useful states include:

1. Available for authorized use/issuance
2. Currently in use / unavailable
3. Reserved
4. Defective
5. Under repair
6. Out/unavailable

For assets, the catalogue request is for an **asset type first**. After approval, a specific physical asset is assigned either manually or from matching available assets.

## Consumables

Availability is quantity-based and **per lab**.

Useful states include:

1. Sufficient quantity available
2. Insufficient quantity
3. Out of stock
4. Good quantity / bad quantity / total physical quantity shown as appropriate

The database remains authoritative for actual inventory state.

# PART L — REQUEST LOGIC

When a student enters a component requirement, the system should query the inventory immediately.

1. Identify the catalogue item/class in the R&A inventory.
2. Determine whether the request is an Asset or Consumable.
3. Check current authoritative availability/quantity.
4. Inform the student immediately if the requested quantity is unavailable.
5. For available consumables, calculate the **minimum-lab fulfilment plan**.
6. For assets, identify the requested asset type and show matching availability.
7. The student submits the project requirement/request.
8. The request first reaches the **Faculty Mentor**.
9. The request then follows the relevant class-specific route.

## Consumable request path

**Student → Faculty Mentor → Central Store (availability/management) → HoD → Lab Assistant of selected issuing lab → Physical Issue**

## Asset request path

**Student → Faculty Mentor → relevant Lab In-Charge (Faculty) → HoD → Lab Assistant of issuing lab → Physical Asset Handling**

### Asset use vs asset issuance

The asset request captures the purpose:

- **Use in college/lab:** permission to use the asset under the approved department workflow.
- **Take home / outside college:** separate issuance permission with its own approval purpose.

These are separate permission concepts even though both ultimately use the same physical asset records.

### Unavailable components

- Availability is shown during request entry.
- Do not treat unavailable stock as an immediately issuable request.
- A reservation may be created for an existing but currently unavailable/issued component, subject to reservation rules.
- Unstocked demand can be logged for Central Store / inventory management.

# PART L1 — ISSUE-TIME REVALIDATION AND CONCURRENCY

Availability shown during request entry is informative for planning; it does not reserve stock automatically. The authoritative check occurs again at physical issue.

## Consumables

At issue time, the backend must perform an atomic MySQL transaction that:

1. Locks the relevant per-lab stock rows using the database transaction/row-locking mechanism.
2. Re-reads current good quantity.
3. Verifies the approved allocation is still fulfilable.
4. Updates inventory only when the full requested quantity can be issued.
5. Creates the issue transaction, audit event and notification outbox event in the same transaction.
6. Commits atomically; otherwise rolls back.

## Assets

At issue time, the backend locks/revalidates the selected physical asset record and verifies that it is still available/assignable and belongs to the expected issuing lab.

## Race condition outcome

If stock/asset availability changed after approval because another request was physically issued first:

- The approved request can be marked **`FULFILMENT_FAILED_STOCK`** at issue time.
- The system does **not automatically partially fulfil** the approved request.
- The student receives a status notification and can start a new request/reservation if appropriate.
- The failed fulfilment is audited.
- Any stock that was successfully issued to another transaction remains authoritative.

Duplicate submission/retry of the same state-changing API request must be idempotent where practical, using a request/idempotency key so the same issue cannot be committed twice.

# PART M — ALTERNATIVE COMPONENTS

The system may show technically reasonable alternatives, but alternatives must be **grounded in actual LabTrack catalogue/inventory data**.

The V1 architecture uses a three-step process:

1. **Curated compatibility/alternative mapping** maintained in the component catalogue.
2. **Deterministic metadata filtering** using function/type and relevant technical constraints (for example interface/protocol, voltage, range and other fields where supplied).
3. **AI explanation/ranking** of the already-filtered candidates.

The AI must not invent a candidate component that is not present in the filtered catalogue result. Every alternative displayed to the student must be revalidated against the live authoritative MySQL inventory before display.

When an alternative exists in actual inventory, the user-facing language should explicitly distinguish inventory fact from AI explanation, e.g. **“We currently have JSN-SR04T available; you may consider it as an alternative because…”**.

Compatibility mappings are data/configuration, not hard-coded in the LLM prompt. They are versioned/auditable and can be reviewed by authorized inventory administrators.

# PART N — AI SCOPE

The faculty discussion explicitly says **AI is not a priority**.

AI should remain optional/advisory. Potential uses:

- Explain a component.
- Interpret a student's requirement.
- Suggest possible alternatives.
- Help students understand differences between catalogue items.

AI integration baseline:

**LabTrack Recommendation Service → LLM Adapter → BrowserAPIFree → ChatGPT**

Inventory context is published as an initial snapshot and later delta updates. A final **Recommendation Validator** checks every candidate against live MySQL state before the result is shown.

Each recommendation should retain enough provenance for debugging/audit: context snapshot/version, model/provider configuration, request ID, generated recommendation, validation result and timestamp.

AI must not:

- Decide inventory truth.
- Override inventory.
- Approve requests.
- Issue components.
- Change reservation priority.
- Decide official institutional status.
- Replace Faculty Mentor, Lab In-Charge, Lab Assistant or HoD authority.

# PART O — APPROVAL WORKFLOW

The old approval loop is **deprecated**. The current workflow is class-specific and has a mandatory HoD final stage.

## Consumables

**Student → Faculty Mentor (Approve/Reject) → Central Store (Availability/Management) → HoD (Final Approval) → Lab Assistant of selected issuing lab → Issue**

## Assets

**Student → Faculty Mentor (Approve/Reject) → Lab In-Charge (Faculty: review/decision) → HoD (Final Approval) → Lab Assistant of issuing lab → Asset Handling**

### HoD authority

- First-class application role.
- Super Access within the current R&A application.
- Sees all R&A projects.
- Receives all normal requests for final approval.
- Only role with overwrite access.
- Can pass/approve/reject requests and make direct record changes under the overwrite authority.

### Other authority distinctions

- Faculty Mentor = first faculty decision point for project requests.
- Lab In-Charge = asset-side faculty decision point.
- Central Store = consumable inventory-management entity, **not a separate user role**.
- Lab Assistant = physical operational role that executes the approved order for the relevant lab.
- Technical Admin = system/development authority, not a substitute for institutional approval authority.

# PART P — PHYSICAL PROCESSING

## Consumables

1. The Lab Assistant receives the approved order for the selected issuing lab.
2. The Lab Assistant checks the physical stock.
3. The Lab Assistant issues the ordered quantity.
4. The transaction records the issuing lab and issued quantity.
5. The per-lab good quantity is updated.
6. The issue receives its applicable due date.

Consumables remain **returnable**. “Consumable” means the item is quantity-tracked rather than individually tracked; it does not mean disposable.

## Assets

1. The approved asset order reaches the Lab Assistant of the relevant lab.
2. The specific physical asset is verified using the **SIT Barcode** (primary lookup) and/or Default ID.
3. The system records the asset's lab and the issuing lab.
4. The transaction is recorded as either authorized **use** or **issuance/take-out**, according to the approved purpose.
5. Asset history remains tied to the physical unit.

Physical execution remains with the relevant Lab Assistant unless the institutional process later specifies otherwise.

# PART Q0 — CANONICAL STATE MODEL

The SDD and implementation must not invent workflow states ad hoc. The following state families are normative. A single record may have a request state plus a transaction/physical state where applicable.

## Request lifecycle

`DRAFT` → `SUBMITTED` → class-specific review stage → `HOD_REVIEW` → `APPROVED` → `FULFILMENT_PENDING` → `ISSUED/IN_USE` → closure

Terminal/exception states include:

- `REJECTED`
- `CANCELLED`
- `APPROVED_EXPIRED_BEFORE_ISSUE`
- `FULFILMENT_FAILED_STOCK`
- `CLOSED`

## Reservation lifecycle

`WAITING_FIFO` → `FULFILABLE` → `FULFILLED`

Exception/terminal states:

- `EXPIRED`
- `CANCELLED`

## Asset physical lifecycle

`AVAILABLE` → `RESERVED` / `IN_USE` / `ISSUED_OUT` → `AVAILABLE` or `DEFECTIVE` / `UNDER_REPAIR` / `LOST` / `RETAINED_IN_PROJECT`.

## Consumable stock lifecycle

Consumables are not assigned per unit. Their authoritative state is their per-lab numeric quantities:

`good_quantity`, `bad_quantity`, `total_physical_quantity = good + bad`.

Issued quantity is removed from active lab stock until returned, retained in project, or lost.

## Extension lifecycle

`REQUESTED` → `APPROVED` or `REJECTED`; an approved extension creates a new dated event and due-date version. It never deletes the previous due date.

# PART Q — ISSUE / USAGE TRANSACTION HISTORY

A transaction should preserve, where applicable:

- Student
- Project
- Component/type
- Asset identifier where applicable
- Quantity where applicable
- Issuing lab/source
- Issuing lab assistant where applicable
- Use vs issuance purpose for assets
- Issue/use date
- Requested/approved duration
- Due date
- Return date
- Current status
- Reservation relationship where applicable
- Extension records
- Inspection/condition
- Defect/damage/loss records where applicable
- Penalty records where applicable
- Approval records

Historical transactions must not be silently overwritten. HoD overwrite actions themselves must be auditable.

# PART R — BORROWING / USAGE DURATION

There is **no universal hard-coded borrowing period** in the current model.

The **student selects the requested usage/borrowing duration** during request creation. The request stores that duration and the due date is calculated from the approved issue/use start time. Faculty Mentor/Lab In-Charge approval is approve/reject; they do not silently rewrite the duration. The HoD may use the existing overwrite authority to correct/alter the approved record, but such changes must be audited.

The prototype keeps duration rules configurable so a later institutional maximum or category rule can be introduced without rewriting the workflow.

# PART S — EXTENSIONS

Extensions follow the **same approval/authority process as the relevant original request path** unless a later institutional rule specifies an exception.

The requested revised duration/due date must be recorded as an extension event rather than silently replacing history.

V1 demo configuration allows **up to 2 extensions**. This is a demo configuration value, not a permanent institutional rule. An extension request does not pause the current due date or reminders; the existing due date remains authoritative until/if the extension is approved. An approved extension creates a new due-date version and audit event.

# PART T — REMINDERS

The faculty discussion confirmed:

- **5 days before the due date**
- **Every day after the due date** while overdue

Current V1 reminder recipients:
- Student
- Relevant lab personnel

These values must be configuration-driven, not hard-coded into the reminder engine.

# PART U1 — APPROVED-BUT-NOT-COLLECTED EXPIRY

An approved request that is not physically collected must not remain indefinitely in an approved state.

V1 demo configuration:

- **Collection/issue window:** 48 hours after approval.
- After the window, the request becomes `APPROVED_EXPIRED_BEFORE_ISSUE`.
- Any temporary hold/reservation associated with that approval is released according to the reservation rules.
- The student is notified and may submit a new request/reservation.
- Expiry is audited.

The 48-hour value is configuration, not institutional policy.

# PART U — OVERDUE ESCALATION

Current V1 decision:

- Automated reminder continues daily after the due date.
- **Overdue day 0–4:** Student + Lab Assistant are notified.
- **From overdue day 5:** Student + Lab Assistant + relevant Faculty Mentor are notified.
- **At overdue day 7:** Student + Faculty Mentor + relevant Lab In-Charge + Lab Assistant + HoD are notified and the case is formally escalated.

The recipient calculation is role-based from the authoritative project/request/lab mappings, not a hard-coded email list.

# PART V — RESERVATION

Reservation applies to **both Assets and Consumables**.

## General rule

A reservation represents a student's place for inventory that exists but is currently unavailable/issued.

**FIFO is the official ordering rule.**

## Assets

Students reserve an **asset type first**. After the reservation becomes fulfilable, a specific matching physical asset is assigned either:

- Manually by authorized lab personnel, or
- Automatically from currently available matching assets.

The specific asset assignment is recorded once made.

## Consumables

Reservations apply to the requested consumable item/quantity at the relevant inventory level.

## Reservation expiry

V1 reservation expiry is **24 hours**. The value remains configuration-driven so the institution can change it later without code changes.

When a reservation reaches expiry without fulfilment/collection, the system sets it to `EXPIRED`, records an audit event, releases the reservation's priority, and allows the next FIFO reservation to proceed.

## Reservation priority override

FIFO remains the default ordering rule. A FIFO override is permitted only by:

- **Lab Assistant**, with a mandatory reason and audit record; or
- **HoD**, under Super Access, with mandatory audit record.

The system must record the previous queue position, new queue position, actor, role, reason and timestamp.

# PART W — RETURN / RECONCILIATION

Return/reconciliation applies to **both Assets and Consumables**. The inspection depth differs by class because Assets are individually tracked physical units while Consumables are quantity-tracked.

Normal return flow:

**Student/project returns → Lab Assistant inspects/reconciles → class-specific inspection recorded → return/closure recorded → inventory/asset state updated → student acknowledgement → audit + notification event**

## W1. Asset inspection

For an **Asset**, record:

- SIT Barcode / physical asset identifier
- Functional test: `PASS`, `FAIL`, or `NOT_TESTED`
- Physical condition: `GOOD`, `DAMAGED`, `DEFECTIVE`, or `MISSING/LOST` as applicable
- Missing parts/accessories: yes/no + details
- Visible damage: yes/no + details
- Photo evidence: supported for the physical asset; required for damage/defect cases in V1 unless a configured exception applies
- Remarks
- Inspection actor and timestamp

Asset inspection is tied to the physical unit and becomes part of that asset's lifetime history.

## W2. Consumable inspection

For a **Consumable**, record at quantity level:

- Quantity expected to be returned
- Quantity physically returned
- Quantity classified as good
- Quantity classified as bad/defective
- Quantity missing/lost
- Functional status where the component type is functional-testable (for example sensors/actuators): `PASS`, `FAIL`, `NOT_TESTED`
- Remarks
- Inspection actor and timestamp

Per-unit asset-style identity is not introduced for consumables. **No photo is required as a standard consumable inspection field in V1**; the inspection remains quantity-oriented.

## W3. Inventory reconciliation rules

For consumables, active lab stock is defined by **good + bad physical quantities currently present in the lab**. Issued items are removed from the lab's active stock at issue time. Therefore:

- Issue good quantity `Q` → `good -= Q`, `total -= Q`.
- Return good quantity `Q` → `good += Q`, `total += Q`.
- Return bad quantity `Q` → `bad += Q`, `total += Q`.
- Missing/lost quantity is not re-added.
- Reclassifying repaired bad stock to good moves quantity from `bad` to `good` without changing `total`.

For Assets:

- Issue/use changes the physical asset from an available state into an active-use/issued state.
- Normal return with acceptable condition makes the asset available again.
- Damage/defect changes the asset to `DEFECTIVE` or `UNDER_REPAIR`.
- Loss changes the asset to `LOST`.
- Repair completion can return the asset to `AVAILABLE` after authorized verification.

## W4. Retained in Project

There is a distinct legitimate closure class:

**Project is handed over to the department as a project → the issue is marked returned/closed → the item remains physically associated with that project and is no longer part of active inventory availability.**

The system exposes an explicit state/action **`RETAINED_IN_PROJECT`**.

Important reconciliation rule: retention **does not perform a second inventory decrement**. The item was already removed from active inventory when issued; the retained closure changes the transaction/asset state and permanently prevents it from reappearing as available stock.

- For **Consumables**, the already-issued quantity remains excluded from active lab good/bad stock.
- For **Assets**, the physical asset remains in the asset register with state `RETAINED_IN_PROJECT` and remains unavailable for normal issuance. Its full history is preserved.

# PART X — DEFECT / DAMAGE / LOSS

When a returned component/asset is defective/damaged/lost, the system records the corresponding **inspection/incident event** rather than silently changing inventory. The event includes:

- Component/asset
- Student
- Project
- Original issue
- Date/time
- Who identified the problem
- Incident type
- Description
- Condition
- What happened
- Photo/evidence for assets where applicable/required
- Remarks
- Repair status where relevant
- Attributable-to-student flag where responsibility is explicitly established

Defective equipment can move into:
- Defective
- Under Repair
- Unavailable

History must remain.

Automated penalty calculation is **out of current scope**.

# PART Y — PENALTIES / REPEATED OFFENDERS

Formal monetary penalty calculation is **not part of the current V1 scope**.

The system may retain incident information such as late return, damage or loss for historical/accountability purposes, but it must not invent a monetary penalty or automatic payment consequence.

The repeated-offender/REPO feature is now an **informational accountability score**, not an automatic punishment mechanism. It must be explainable, auditable and non-authoritative.

# PART Z — EXPLAINABLE REPO / ACCOUNTABILITY INDEX

V1 introduces an **Explainable REPO Index (0–100)** to summarize confirmed accountability incidents. The score is informational only. It does not automatically reject, penalize, block borrowing, change FIFO priority or alter approval authority.

## Z1. Qualifying incident ledger

Qualifying incident types may include:

- `LATE_RETURN`
- `MISSING_PART`
- `MINOR_DAMAGE`
- `MAJOR_DAMAGE`
- `LOSS`
- `UNAUTHORIZED_USE`
- `DEFECT_WHEN_STUDENT_ATTRIBUTABLE`

An incident that is determined to be normal wear, manufacturing defect, lab fault or otherwise not attributable to the student contributes **zero** to the score.

## Z2. NLP assistance on remarks

When an incident contains remarks, V1 may run an **explainable NLP classifier** over the remarks to estimate the probability that the text supports a student-attributable cause.

Preferred implementation:

**TF-IDF features → Logistic Regression classifier → `p_fault`**

The classifier is trained/evaluated on a small labelled set of synthetic/project incident remarks for the prototype. TF-IDF provides transparent lexical features and logistic regression provides probability estimates and inspectable coefficients; both are standard capabilities supported by scikit-learn.

The NLP model is **advisory only**. It cannot create a qualifying incident, override a human attribution decision, or increase a score above the base severity of a confirmed incident.

If there are no remarks, the NLP factor is neutral.

## Z3. Incident contribution formula

For incident `i`:

`C_i = S_i × A_i × N_i × D_i × R_i`

Where:

- `S_i` = configurable base severity.
- `A_i` = human attribution factor: `0` not attributable, `0.5` uncertain, `1` confirmed attributable.
- `N_i` = NLP confidence factor. With remarks: `0.75 + 0.25 × p_fault`. Without remarks: `1.0` (neutral).
- `D_i` = time-decay factor: `0.5^(age_days / 90)`. The incident contribution therefore halves every 90 days.
- `R_i` = recurrence multiplier: `1 + 0.10 × min(previous_confirmed_incidents_in_180_days, 5)`

Recommended V1 severity defaults:

| Incident | `S_i` |
|---|---:|
| Late return | 10 |
| Missing part | 20 |
| Minor damage | 20 |
| Major damage | 35 |
| Unauthorized use | 40 |
| Loss | 50 |

These are **V1 configuration values**, not institutional penalty amounts.

The overall raw accountability evidence is:

`E = Σ C_i`

The bounded score is:

`REPO = 100 × (1 − e^(−E / 100))`

The formula is monotonic in severity, attribution, recurrence and recent incidents, remains bounded in `[0,100)`, and gives progressively less influence to old incidents.

## Z4. Repeated-offender flag

The flag is derived rather than manually maintained. V1 uses:

**Repeated Offender =** `2 or more confirmed attributable incidents within the previous 180 days` **OR** `REPO ≥ 35`.

This flag is visible to authorized Faculty, HoD and Lab In-Charge users.

## Z5. Corrections and explainability

A confirmed incident may be voided/corrected only by the **HoD** in V1, with mandatory reason and audit trail. Voiding an incident triggers deterministic recomputation of the student's REPO Index.

The system should expose a score explanation containing:

- current score
- incident list contributing to the score
- each incident severity
- attribution factor
- NLP remark classification/confidence where used
- time-decay factor
- recurrence multiplier
- resulting incident contribution
- timestamp of score calculation

The score must never be presented as a disciplinary verdict.

# PART AA — NOTIFICATIONS

Notifications are **event-driven**. Email is **not** the source of notification truth. A domain event generated by LabTrack is the single trigger that can fan out to multiple delivery channels.

## AA1. Canonical event flow

**Authoritative domain transaction → transactional outbox event → Notification Service → in-app notification + email delivery record**

The request/approval/inventory database state remains authoritative. The notification subsystem is a delivery mechanism and must never decide request state.

The outbox event is written in the same SQL transaction as the domain change so that a successful approval/issue/return cannot be committed without its notification event being recorded. Delivery may retry independently.

## AA2. In-app / web notifications

The web application exposes a notification center for the current user. A future mobile client consumes the same notification API. Mobile push may be added later as another delivery adapter; it is not required for V1.

Events include:

- Request submitted / status changed
- Approval/rejection
- Issue/use
- Reminder
- Overdue
- Extension decision
- Reservation created / became fulfillable / expired
- Return/reconciliation
- Defect/damage/loss
- Repeated-offender/accountability information where authorized
- Escalation
- Issue-time fulfilment failure

## AA3. Email

The same event that creates the in-app notification may also create an email delivery task. Email is one channel, not the master record.

A single dedicated LabTrack sender account is used for V1 through a provider adapter (initially Gmail API).

Each email that refers to a request/approval contains:

- Request ID
- Current status at time of sending
- Relevant summary
- Recipient-specific reason/context
- **Live LabTrack request link** that opens the authoritative current state

Opening an old email must never be treated as proof that the request is still in the old state.

## AA4. Delivery failure rules

- A failed email must **not roll back** the approved domain transaction.
- In-app notification creation must not depend on successful email delivery.
- Email retries are tracked separately.
- Duplicate delivery for the same notification event/recipient/channel must be prevented by an idempotent delivery key.

## AA5. Approval tracking

The website must provide a **request approval timeline** showing, at minimum:

`Submitted → Faculty Mentor decision → class-specific review/management stage → HoD decision → operational routing → issue/use`

Each timeline entry records actor, role, timestamp, action, remarks where applicable, previous state and new state.

Email and in-app notifications link to the same request timeline. **Approval/rejection actions themselves occur on the LabTrack website in V1.** Email is a tracking/deep-link channel, not a second authorization system.

After a website approval/rejection/forward action is completed, a new authoritative domain event is emitted and the resulting status is sent to the applicable notification recipients and next workflow actor(s).

## AA6. V1 notification recipient matrix

| Event | Recipients |
|---|---|
| Request submitted | Student + Faculty Mentor |
| Faculty Mentor approve/forward | Student + next required workflow actor(s) |
| Faculty Mentor reject | Student + relevant Faculty Mentor record + next actors are not notified |
| Asset Lab In-Charge decision | Student + Faculty Mentor + next required workflow actor(s) |
| HoD approve/reject/overwrite | Student + Faculty Mentor + relevant Lab In-Charge where applicable + relevant Lab Assistant + HoD audit/record |
| Issue/use completed | Student + Faculty Mentor + relevant Lab In-Charge where applicable + Lab Assistant + HoD |
| Return/reconciliation completed | Student + Faculty Mentor + relevant Lab In-Charge where applicable + Lab Assistant |
| Extension request submitted/decided | Student + Faculty Mentor + relevant Lab In-Charge where applicable + next approval actor |
| Reservation created/fulfilled/expired/overridden | Student + relevant Faculty + relevant Lab Assistant; HoD included for audited override events |
| Overdue days 0–4 | Student + Lab Assistant |
| Overdue from day 5 | Student + Lab Assistant + Faculty Mentor |
| Overdue day 7 escalation | Student + Faculty Mentor + Lab In-Charge + Lab Assistant + HoD |
| Damage/defect/loss recorded | Student + Faculty Mentor + relevant Lab In-Charge + Lab Assistant; HoD when escalation/overwrite is required |
| Issue-time fulfilment failure | Student + relevant Faculty + Lab Assistant + HoD |

The matrix is implemented from role/entity relationships, not hard-coded email addresses. Each event can create both an in-app notification and an email delivery record.

# PART AB — UNMET DEMAND

There is no full procurement system in V1.

If a required component is not sufficiently stocked across the R&A labs, the system informs the student during requirement entry and may record the unmet demand.

Unmet-demand information is intended for **Central Store / central inventory management**.

The system may later aggregate:

- Repeatedly requested missing components.
- Frequency of unmet demand.
- Quantity requested but not available.

This is demand intelligence, not procurement execution.

# PART AC — DATA MIGRATION AND PROTOTYPE DATA

Existing source context:
- Inventory may originate from Excel.
- Historical issue records may exist in notebooks.

Current prototype policy:

- **All users, faculty, labs, projects, components, assets and inventory data are dummy/synthetic.**
- No real student/faculty PII is required for the cloud prototype.
- Seed/demo data must be stored outside core business logic so it can be replaced without changing workflows.
- Excel import can be supported later; complete notebook migration is not required for the prototype.

## AC1. Replaceability / Configuration Principle

The system must be designed so that **dummy data and V1 assumptions are replaceable rather than hard-coded**.

This includes:

- Users and role mappings
- Student/faculty/lab master data
- Asset identifiers
- Component catalogue
- Per-lab consumable quantities
- Asset inventory
- Reminder timing
- Overdue escalation threshold
- Reservation expiry
- Borrowing/usage duration rules
- Extension rules
- Approval/role mappings where policy later changes
- Cloud/deployment configuration

### Recommended implementation boundary

Use separate, replaceable layers for:

1. **Master/seed data** — fixtures, CSV/JSON import, or database seed scripts for the prototype.
2. **Configuration/policy data** — database/configuration records rather than constants scattered through code.
3. **Institutional adapters** — interfaces for authentication and future master-data integration.
4. **Business logic** — operates on normalized internal entities and should not depend on dummy IDs or fake names.
5. **UI** — reads real data through services/APIs rather than embedding sample records.

The prototype must therefore be a **drop-in-demonstration implementation**, not a disposable mock that requires rewriting to connect real data later.

# PART AD — AUTHENTICATION

Authentication is coordinated through the **IT administrator**.

For the current prototype, the exact institutional authentication mechanism is intentionally deferred. The application uses a **replaceable `AuthProvider` interface** and synthetic identities.

The prototype is fully web-based. The future mobile application will reuse the same authentication boundary and backend API rather than creating a separate authentication system.

The prototype authentication implementation is independent of Firebase/Auth0-style vendor coupling. The exact token/session implementation is part of the implementation baseline, but it must remain behind the adapter so institutional SSO/OIDC can replace it later.

This allows the project to satisfy the CCE/DCDS prototype requirements now while leaving the institutional authentication implementation swappable later.

# PART AE — MASTER DATA

Institutional master data is expected to exist, and the prototype uses dummy/synthetic data.

Known identifier formats:

- Teacher ID: `T` + 5 digits
- Staff ID: `N` + 5 digits

For the prototype, the exact college API/dataset is **not required**. The schema and import boundary should nevertheless be designed so a future authoritative dataset can replace the seed data without changing the business rules.

The central inventory database is currently **R&A-only**.

# PART AF — CLOUD

The project will use a **portable multi-cloud architecture** so that AWS, Azure and GCP can all be demonstrated without introducing three competing authoritative databases.

## AF1. V1 cloud roles

- **AWS — Primary live environment:** authoritative prototype application, MySQL/MongoDB and the active scheduler/notification dispatcher.
- **Azure — Staging / DR-ready environment:** same containerized application build, isolated demo/staging data by default; scheduler disabled unless deliberately promoted.
- **GCP — Analytics / read-only demonstration environment:** same application capabilities where useful, plus sanitized/read-only analytics or event-derived views; it does not become an independent inventory authority.

## AF2. Data ownership rule

There is **one authoritative transactional writer** for a given environment. V1 does not use active-active multi-cloud writes for inventory, approvals or issues.

The application may send one-way event/analytics data from the primary environment to secondary environments, but secondary environments must not silently write back contradictory inventory state.

## AF3. Scheduler rule

Only the active primary environment runs the reminder/expiry scheduler. Secondary deployments keep `SCHEDULER_ENABLED=false` unless deliberately promoted. This prevents duplicate reminders.

## AF4. Infrastructure portability

Application code is provider-neutral. Docker images are the portable deployment unit. Terraform/provider modules may provision the provider-specific infrastructure.

The exact production college server/VM remains institutionally unresolved.

# PART AG — SECURITY

Current security principles:

- Role-based access is enforced **server-side**, not merely by hiding UI controls.
- Students only see authorized student/project records.
- Faculty see projects relevant to their role.
- Lab In-Charge can act on relevant asset workflows.
- Lab Assistants manage assigned labs.
- HoD has Super Access within R&A and is the only role with overwrite access.
- Technical Admin access remains distinct from institutional HoD authority.
- Important actions are auditable.
- Synthetic data is used for the external/cloud prototype.
- Historical transactions are never silently overwritten; HoD overwrite/correction actions remain auditable with before/after values.
- Raw audit events are append-only; correction creates a new compensating event rather than editing the historical audit record.
- Hard deletion of transactional history is prohibited in normal application workflows. Use status/void/archive semantics.
- Secrets/API keys are stored outside source code via environment/secret management.
- Inspection photos for Assets are stored through an object-storage adapter; only metadata/secure references are stored in application records.

# PART AH — AUDIT TRAIL

Important events should be historical/auditable:

- Approval
- Rejection
- Modification
- HoD overwrite
- Issue
- Use
- Return
- Retained-in-project closure
- Extension
- Reservation
- Reservation expiry
- Defect
- Damage/loss records
- Repeated-offender changes
- Admin configuration changes
- Role changes
- User mapping changes

The faculty discussion confirmed the need for auditability, but did not establish a formal retention duration. Retention policy remains configurable/unresolved.

# PART AI — ASSET TRANSFERS

**Asset-to-lab transfer is out of V1 scope.**

The system should not implement a normal asset-transfer workflow in the current prototype. The asset's current lab and issuing lab remain part of the authoritative asset/transaction record.

# PART AJ — CROSS-DEPARTMENT

Cross-department sharing is **outside the current scope**.

The central inventory database is limited to **Robotics and Automation** in the current design.

Future multi-department support would need separate ownership/visibility/approval/transfer rules.

# PART AK — FUTURE SCOPE

## Current technical direction — LOCKED V1 ARCHITECTURE

The following technical stack is now the selected V1 direction unless explicitly changed by the user or a later architectural decision record (ADR):

- **Backend:** Python + FastAPI + Pydantic.
- **Frontend:** React + Vite + TypeScript.
- **API style:** REST + OpenAPI, with the OpenAPI contract treated as the canonical frontend/backend interface.
- **SQL database:** **MySQL 8.4 with InnoDB**.
- **ORM:** SQLAlchemy 2.x.
- **Schema migration:** Alembic.
- **NoSQL:** MongoDB for notifications, audit/event records, AI recommendation records, unmet-demand analytics and operational telemetry; MongoDB is never authoritative for inventory, approval or issue state.
- **Cache/queue:** Redis is **not used in V1**.
- **Scheduler:** APScheduler/simple scheduled-job layer in the primary deployment.
- **Email:** Gmail API through a replaceable `EmailProvider` adapter using one dedicated LabTrack sender account.
- **Authentication:** replaceable `AuthProvider`; V1 prototype uses synthetic identities and web-based authentication rather than Firebase/Auth0 coupling.
- **AI integration:** BrowserAPIFree adapter → ChatGPT; provider/model details remain configuration rather than domain logic.
- **Containers:** Docker.
- **Local/demo orchestration:** Docker Compose where a VM/self-hosted environment is used. The same immutable container images may be deployed through cloud-provider-native container services later.
- **CI/CD:** GitHub Actions.
- **Future mobile client:** Capacitor wrapping the same React web application/backend contract.
- **Infrastructure as code:** Terraform/provider modules are the preferred path for reproducible AWS/Azure/GCP deployment.

### Technology-selection principle

The SDD must explicitly document **why each selected technology was chosen**, which alternatives were considered, why the alternatives were not selected, the trade-offs, and the replacement boundary. The model must not make this decision again during implementation.

### Why this stack

- **FastAPI** keeps the backend Python-native for an AIML/DCDS project while providing strong request validation and an OpenAPI-first API boundary.
- **React + Vite + TypeScript** provides a clean standalone frontend without introducing a second backend/runtime into the architecture; it also preserves a direct path to mobile packaging.
- **REST + OpenAPI** gives a stable, explicit contract that supports parallel frontend/backend development and generated TypeScript client types.
- **MySQL 8.4/InnoDB** is selected because the project needs strong relational integrity, transactions, foreign keys, joins, aggregation and concurrency control, while the faculty-approved project direction already uses MySQL. PostgreSQL is a valid alternative but does not provide enough additional value for this V1 to justify changing the selected direction.
- **SQLAlchemy + Alembic** separates persistence mapping and migrations from business rules and avoids scattering raw SQL throughout the application.
- **MongoDB** is deliberately limited to event/document-oriented concerns so the DCDS NoSQL requirement is genuine without creating dual sources of truth for inventory.
- **No Redis in V1** prevents unnecessary infrastructure complexity because the current scale does not require a distributed cache/queue.
- **APScheduler** is sufficient for a single active scheduler and the defined reminder/expiry jobs; a distributed queue is deferred until demonstrated need.
- **Gmail API via an adapter** provides a practical prototype sender while keeping the domain independent of the email provider.
- **BrowserAPIFree** is selected because the project already has an established browser-based AI integration architecture; LabTrack only needs to supply inventory context and validate the response against the live database.
- **Docker** makes local, VM and cloud execution reproducible.
- **GitHub Actions** fits the existing GitHub-based workflow and can enforce validation before merge/deployment.
- **Capacitor** keeps the web-first product viable while providing a later route to packaged mobile applications without rewriting the application backend.

Explicit future directions include:

- Native mobile app.
- Play Store deployment.
- Detailed cabinet/shelf/drawer location.
- Full procurement workflow.
- Formal penalty/payment handling if later authorized.
- Formal reputation scoring if later authorized.
- Production institutional SSO/authentication after IT integration is defined.
- College-managed deployment/infrastructure.
- Cross-department governance.
- Advanced AI.
- Detailed warranty management.
- Advanced analytics.

Do not present these as current requirements unless explicitly moved into scope.


# PART AL — PROJECT TIMELINE / TEAM

Current implementation team:
- **Ishaan — Project Lead / Architecture / Backend / Database / Integration / technical coordination.**
- **Raghu — Frontend Lead / UI implementation and selected supporting work that is delegated by the Project Lead.**

Ishaan remains the final technical decision owner for the implementation unless a decision is explicitly delegated. Raghu owns the frontend implementation boundary and may take selected cross-cutting tasks assigned by Ishaan where that accelerates delivery.

Initial implementation target discussed:
- Approximately 15 days.

Important academic constraint discussed:
- DCDS registration/rubric originally requires a **4-member team** and same division.
- The implementation team is currently the lead + frontend teammate.
- This is an academic/team-structure constraint that must remain distinct from software implementation ownership.

Do not invent additional implementation owners.

# PART AM — DCDS ACADEMIC REQUIREMENTS

The project is being shaped partly to maximize DCDS evaluation.

Database Concepts for Data Science Lab — ESE Miniproject
1. Course Details
Department: Artificial Intelligence and Machine Learning
Batch: 2025–29
Course: Database Concepts for Data Science Lab
Credits: 1
Year / Semester: SY / Semester 3
Faculty:
Dr. Anjali Dalvi
Dr. Sumanto Dutta
Dr. Wasim Khan
2. ESE Component
Component: ESE – Miniproject
Project: Python-Based Data-Driven Application Development with Advanced SQL and NoSQL Integration
COs: CO1, CO2, CO3, CO4, CO5
Maximum Marks: 10
Weightage: 40%
Tentative Date: 26–30 October 2026
3. ESE Evaluation Rubric — 10 Marks
Evaluation Criteria	Marks
Application Design & Functionality	2
Python Programming Implementation	2
Database Integration — SQL & NoSQL	2
Advanced Database Querying & Data Retrieval	2
Code Quality & Documentation	1
Testing, Validation, Security & Error Handling	1
Total	10
Performance Levels
Excellent: Full marks / strongest implementation
Good: Minor issues
Satisfactory: Basic implementation with limitations
Needs Improvement: Incomplete, incorrect, or poorly implemented
4. Detailed Evaluation Requirements
4.1 Application Design & Functionality — 2 Marks

Excellent:

Fully functional application
Meets all requirements
Intuitive workflow
Proper modular design

Good:

Functional application with minor issues

Satisfactory:

Basic functionality implemented
Limited features

Needs Improvement:

Incomplete or non-functional application
4.2 Python Programming Implementation — 2 Marks

The project should demonstrate:

Functions
Classes
Exception handling
File handling
Modular coding
Efficient use of Python concepts

Excellent: Efficient and well-structured Python implementation
Good: Good Python usage with minor issues
Satisfactory: Basic implementation with limited best practices
Needs Improvement: Poor coding practices and significant errors

4.3 Database Integration — 2 Marks

The project must demonstrate SQL + NoSQL integration.

Expected:

Proper database connectivity
Data insertion/manipulation
Data retrieval
Seamless interaction between application and databases

Excellent: Seamless SQL/NoSQL integration with proper connectivity and data manipulation
Good: Working integration with minor issues
Satisfactory: Basic connectivity with limited operations
Needs Improvement: Poor or incorrect database integration

4.4 Advanced Database Querying & Data Retrieval — 2 Marks

The project should use advanced database operations such as:

SQL:

Joins
Nested/Subqueries
Aggregations
Grouping
Stored Procedures

NoSQL / MongoDB:

MongoDB Aggregation Pipeline
Advanced data retrieval operations

Excellent: Effective use of advanced queries
Good: Good use with minor errors
Satisfactory: Mainly basic CRUD with limited advanced querying
Needs Improvement: Incorrect or overly simplistic queries

4.5 Code Quality, Documentation & Output Presentation — 1 Mark

Expected:

Well-structured code
Proper comments
Meaningful variable names
Clear output/interface
Complete documentation
Good presentation of results

Excellent: Well-structured, documented and clearly presented
Good: Good documentation with minor gaps
Satisfactory: Limited documentation and basic presentation
Needs Improvement: Poor documentation and unclear output

4.6 Testing, Validation, Security & Error Handling — 1 Mark

Expected:

Comprehensive testing
Input validation
Robust error handling
Security considerations
Validation of application outputs

Excellent: Comprehensive testing, validation and robust error handling
Good: Adequate testing and validation
Satisfactory: Basic testing with limited validation
Needs Improvement: Minimal/no testing or error handling

5. What the Project Must Demonstrate

To score well, the project should essentially combine:

Python Application
↓
SQL Database + NoSQL Database
↓
CRUD Operations
↓
Advanced SQL Queries
↓
MongoDB Aggregation Pipeline
↓
Data Retrieval & Analysis
↓
Validation + Error Handling + Security
↓
Clean UI/Output + Documentation + Testing

Critical scoring areas
2 marks: Application
2 marks: Python
2 marks: SQL + NoSQL integration
2 marks: Advanced queries
1 mark: Code/documentation/presentation
1 mark: Testing/validation/security/error handling

Total = 10 marks | Weightage = 40% | Tentative ESE: 26–30 October 2026

The DCDS areas explicitly discussed include:

1. **Application Design & Functionality**
2. **Python Programming Implementation**
3. **SQL & NoSQL Database Integration**
4. **Advanced Database Querying & Data Retrieval**
5. **Code Quality & UI**
6. **Testing / Validation / Security / Error Handling**

Important project direction:
- SQL + NoSQL are required for the DCDS target.
- The project should be designed so that the academic database requirements can be demonstrated rather than bolted on superficially.
- Advanced database querying/data retrieval should be meaningful to the LabTrack use case.
- Python should be a genuine part of implementation where applicable.
- Testing, validation, security and error handling should be demonstrable.

Do not invent exact rubric percentages unless the official rubric is supplied.

---

# PART AN — CCE ACADEMIC REQUIREMENTS

CCE was explicitly discussed as requiring a presentation/viva-oriented project submission.

The known CCE evaluation structure discussed was:

### Presentations and Viva — CO3 / CO4 — 30 marks

Components:

1. **Topic Submission — 5 marks**
2. **Research / Literature Survey — 5 marks**
3. **Presentation Skills — 5 marks**
4. **Running Example — 10 marks**
5. **Viva — 5 marks**

Therefore the LabTrack PPT should not merely describe the application.

It should support:
- Clear topic/problem definition.
- Research/literature survey.
- Strong presentation.
- A running/live example.
- Viva questions and defensible technical decisions.

The user explicitly wants the project to be **live on cloud for CCE**.

The user also wants to use the **whole relevant syllabus** where practical.

Do not invent syllabus topics that have not been supplied.

---

# PART AO — CCE / DCDS UNIFIED PROJECT STRATEGY

The user wants one unified project rather than separate unrelated mini-projects.

The intended direction is:

**One real LabTrack application that simultaneously provides:**
- Real departmental value.
- DCDS technical coverage.
- CCE presentation/research/running-example coverage.
- Cloud deployment demonstration.
- Future mobile/Play Store potential.

The project should not be artificially split into unrelated components merely to satisfy subjects.

---

# PART AP — RUNNING DEMO

The strongest demonstration should make the **Assets vs Consumables** distinction, **on-the-spot availability check**, **minimum-lab fulfilment**, and **class-specific role routing** visible.

## Scenario

A student has an academic project in the Robotics and Automation department and needs multiple component types.

### Requirement entry and lab minimization

1. Student logs in and creates/selects a project.
2. Adds team members and selects a Faculty Mentor.
3. Enters the required component types and quantities.
4. The system immediately checks current per-lab inventory.
5. If any required quantity is unavailable across the department, the student is informed immediately.
6. If the request is fulfillable, the system computes the minimum number of labs needed and groups the eventual physical issue orders by issuing lab.

### Consumable branch

1. Student submits the consumable requirements.
2. Faculty Mentor **approves or rejects**.
3. The request reaches **Central Store for inventory/availability management**.
4. HoD performs **final approval**.
5. The approved order is routed to the **Lab Assistant of the selected issuing lab**.
6. Lab Assistant physically checks and issues the ordered quantity.
7. The system records the issuing lab, issued quantity, applicable duration/due date and transaction history.
8. Reminder is sent **5 days before due date**.
9. After the due date, reminder is sent **every day** while overdue.
10. Formal escalation begins after **7 overdue days** in the current V1 configuration.
11. The student later returns the items, or the issue follows the **Retained in Project** closure path where the project is handed over to the department.

### Asset branch

1. Student enters an asset requirement such as **Turtle Bot, Robotic Arm, Intel Depth Camera or Jetson Nano**.
2. The system checks availability and the student selects the intended asset purpose:
   - **Use in college/lab**, or
   - **Take-home / outside-college issuance**.
3. Faculty Mentor approves or rejects the project request.
4. The request routes to the relevant **Lab In-Charge (faculty)** for asset-side review/decision.
5. HoD performs **final approval**.
6. The approved order goes to the Lab Assistant of the issuing lab.
7. The system assigns a specific physical asset of the approved type, either manually or from available matching assets.
8. The Lab Assistant verifies the physical asset using its **SIT Barcode** / Default ID.
9. The system records the use/issuance purpose, issuing lab and asset history.

# PART AQ — ALTERNATIVE DEMO

Show what happens when a requested component is unavailable.

## Existing but currently issued
System:
- Shows currently issued.
- Shows reservation option.
- Adds student to FIFO queue.

## Not stocked
System:
- Shows unavailable.
- Suggests alternative if possible.
- Logs unmet demand if no useful alternative exists.

## AI
AI can explain why an alternative may be suitable.

Database remains authoritative.

---

# PART AR — PPT STORY

The PPT should NOT be a list of database tables.

The story should be:

### 1. Real problem
Laboratory hardware is handled through fragmented manual processes.

### 2. Current process
Email → Manual check → Notebook → Issue → Manual reminders → Return.

### 3. Consequences
Manual workload, poor visibility, weak traceability, overdue problems, reservation problems, defect/loss tracking problems.

### 4. Solution
LabTrack centralizes the lifecycle.

### 5. Users
Student / Faculty Mentor / Lab In-Charge / Lab Assistant / HoD / Technical Admin.

### 6. Lifecycle
Project → Requirement → Availability → Faculty Mentor Review → Class-specific Routing → HoD Final Approval → Operational Processing → Track → Return/Reconciliation.

### 7. Accountability
Reminders → Extension → Overdue → Inspection/Reconciliation → Penalty/Repeated-Offender handling.

### 8. Inventory model
Two classes: **Assets vs Consumables**. Assets are individually barcode/identifier tracked; consumables are quantity managed.

### 9. Intelligence
Alternative suggestions and unmet-demand intelligence.

### 10. AI
Advisory layer, not authority.

### 11. Running example
One project through the complete lifecycle.

### 12. Academic relevance
DCDS + CCE.

### 13. Deployment
Cloud demo → potential college infrastructure.

### 14. Faculty decisions
Unresolved institutional policy questions.

---

# PART AS — SUGGESTED PPT STRUCTURE

## Slide 1
**LabTrack**
Hardware Component Availability, Issuance & Tracking System

## Slide 2
The Current Problem

## Slide 3
Current Manual Workflow

## Slide 4
Why the Current Workflow Does Not Scale Well

## Slide 5
Proposed LabTrack Solution

## Slide 6
System Users and Roles — Student / Faculty Mentor / Lab In-Charge / Lab Assistant / HoD / Technical Admin

## Slide 7
Class-Specific Request Workflow

## Slide 8
Project-Based Component Management

## Slide 9
Inventory Model:
Assets vs Consumables

## Slide 10
Availability, Requests and Reservations

## Slide 11
Approval and Physical Processing — HoD Final Approval

## Slide 12
Due Dates, Reminders and Extensions

## Slide 13
Return, Inspection, Defect and Penalty Handling

## Slide 14
History, Auditability and REPO

## Slide 15
Notifications and Unmet Demand

## Slide 16
AI-Assisted Student Support

## Slide 17
Security / Data / Deployment

## Slide 18
Running Example / Live Demo

## Slide 19
Academic Relevance — DCDS + CCE

## Slide 20
Future Scope

## Slide 21
Faculty Decisions / Questions

## Slide 22
Closing

This is a suggested structure, not a mandatory final slide count.

---

# PART AT — PPT VISUAL LANGUAGE

The PPT should look like a serious engineering project.

Preferred:
- Workflow diagrams.
- State/lifecycle diagrams.
- Role diagrams.
- Before/after comparison.
- UI screenshots/mockups.
- Component/asset visualization.
- Timeline/status visualization.
- Simple architecture diagrams if architecture is later provided.
- Minimal text per slide.
- Strong hierarchy.

Avoid:
- Generic AI stock imagery.
- Excessive paragraphs.
- Generic “smart campus” buzzwords.
- Unsupported metrics.
- Fake statistics.
- Pretending unresolved policies are finalized.
- Making AI the entire identity of the project.

Strong visual:

**BEFORE**
Email + Notebook + Excel + Manual Reminder

↓

**LABTRACK**
Centralized Lifecycle

↓

**AFTER**
Visibility + Traceability + Automation + Accountability

---

# PART AU — FACULTY QUESTIONS: COMPLETE UAQ SET

The original 22 UAQs are retained so no institutional question is lost. Each item now reflects the answers received from the latest faculty/project discussion and the user's subsequent clarifications.

Status labels: **ANSWERED / CONFIRMED**, **PARTIALLY ANSWERED**, **CONFIGURABLE / DEFERRED**, **UNRESOLVED**, **CURRENT-SCOPE DECISION**.

## UAQ1 — Authentication / SSO — CONFIGURABLE / DEFERRED

**Current decision:** The prototype does not need the exact institutional SSO/API now. Authentication must be implemented behind a replaceable adapter/interface using dummy identities.

**Still institutionally unresolved:** exact IT authentication protocol, integration/API and production session/token mechanism.

---

## UAQ2 — Master Data — CONFIGURABLE / DEFERRED

**Current decision:** Prototype uses dummy/synthetic student, faculty, staff, lab and inventory data. The system must be designed so these datasets can later be replaced without rewriting business logic.

**Still institutionally unresolved:** exact authoritative source/API and synchronization mechanism.

---

## UAQ3 — Staff IDs — ANSWERED / CONFIRMED

- Teacher ID: `T` + 5 digits.
- Staff ID: `N` + 5 digits.

---

## UAQ4 — Lab/Assistant Mapping — ANSWERED / CONFIRMED

- Lab In-Charge is a faculty role for **one lab or maximum two labs**.
- Lab Assistant can manage **multiple labs**.
- Approved physical requests are routed to the Lab Assistant of the issuing lab.

Detailed reassignment rules are not required for the prototype and should remain data-configurable.

---

## UAQ5 — Approval Workflow — ANSWERED / CONFIRMED

### Consumables
**Student → Faculty Mentor (Approve/Reject) → Central Store (Availability/Management) → HoD (Final Approval) → Lab Assistant of selected issuing lab → Issue**

### Assets
**Student → Faculty Mentor (Approve/Reject) → Lab In-Charge (Faculty: review/decision) → HoD (Final Approval) → Lab Assistant of issuing lab → Asset Handling**

Confirmed:
- HoD is a first-class Super Access role.
- HoD sees all R&A projects.
- HoD is the only role with overwrite access.
- HoD is the final approval stage for normal requests.
- Faculty Mentor and Lab In-Charge are distinct roles.
- Central Store is an inventory-management entity, not an application role.
- The earlier Faculty → HoD → Faculty loop is deprecated.

---

## UAQ6 — Unavailable Components / Demand — ANSWERED / CONFIRMED

- Availability is checked **during requirement entry/request creation**.
- The student is informed immediately when the requested quantity is unavailable.
- Unmet-demand information is intended for **Central Store / central inventory management**.
- Reservation can be used for existing but currently unavailable/issued inventory.

The exact analytics/aggregation presentation remains an implementation detail.

---

## UAQ7 — Tracking Classification — ANSWERED / CONFIRMED

Two primary classes:

**Assets:** individually identified and barcode tracked.

**Consumables:** quantity tracked per lab, returnable, not individually identified. Sensors and actuators are consumables. Classes: Sensor, MC, Microprocessor, Motors, Misc, Communication Module, Battery.

Bad consumables are tracked. Total physical quantity = good + bad.

---

## UAQ8 — Existing IDs — ANSWERED / CONFIRMED

For assets:
- **SIT Barcode — primary system lookup/identity key**
- Default ID
- Bill Number, potentially shared across multiple assets in a procurement lot

Teacher/staff IDs:
- `T` + 5 digits
- `N` + 5 digits

No additional institutional identifier is required for the current prototype unless later supplied.

---

## UAQ9 — Individual Asset History — ANSWERED / CONFIRMED at model level

Assets are individually identified and their history is tied to the specific physical asset.

The transaction history must preserve the asset identifier, issuing lab, use/issuance purpose, approvals, dates, returns/reconciliation and condition events where applicable.

---

## UAQ10 — Asset Transfers — CURRENT-SCOPE DECISION

**Asset-to-lab transfer is out of V1 scope.**

Do not implement a transfer workflow in the current prototype.

---

## UAQ11 — Reservation — ANSWERED / CONFIRMED

- Applies to **both Assets and Consumables**.
- FIFO ordering is confirmed.
- Asset reservations are for an **asset type first**, followed later by specific physical-asset assignment manually or from matching available assets.
- **V1 reservation expiry = 24 hours**, implemented as configuration.
- FIFO override is allowed for **Lab Assistant with mandatory reason + audit** and **HoD with audit**.

---

## UAQ12 — Borrowing / Extension — ANSWERED for V1 execution

- The **student selects the requested borrowing/usage duration**.
- Faculty Mentor/Lab In-Charge approve or reject; they do not silently modify the requested duration.
- HoD may use overwrite authority to correct/alter the approved record, with audit.
- Extensions follow the same relevant approval process as the original request.
- **V1 demo maximum = 2 extensions**; the value is configurable.
- An extension request does not pause the current due date/reminder cycle until approval.

Long-term institutional maximum-duration rules remain deferred.

---

## UAQ13 — Penalties — CURRENT-SCOPE DECISION

- Automated penalty calculation is **out of current scope**.
- No numeric penalty formula or monetary amount should be invented.
- Incident history may still be recorded for accountability.
- Repeated-offender visibility is retained as the current accountability feature.

---

## UAQ14 — Return Inspection / Retained-in-Project — ANSWERED for V1 execution

Confirmed closure paths include:

1. Normal physical return/reconciliation.
2. **Retained in Project**.

Asset inspection records physical-unit verification, condition, functional status, missing parts/accessories, visible damage, photo evidence for the asset, remarks, actor and timestamp.

Consumable inspection records expected/returned/good/bad/missing quantities, functional status where relevant, remarks, actor and timestamp.

The retained-in-project closure does **not** perform a second stock decrement; the item was already removed from active availability at issue time.


---

## UAQ15 — REPO / Repeated Offenders — PARTIALLY LOCKED / threshold still open

A formal numeric REPO score is **not required in current V1**.

Repeated-offender information is derived from confirmed accountability incidents and is visible to authorized **Faculty, HoD and Lab In-Charge** users.

No automatic borrowing restriction or reservation-priority change is allowed from the flag alone.

Still requires a final V1 rule for: qualifying-incident threshold/window and who may void/clear a confirmed incident.

---

## UAQ16 — Reminders / Escalation — PARTIALLY ANSWERED / V1 timing locked

Confirmed:
- 5 days before due date.
- Every day after due date while overdue.
- Reminder recipients: **Student + relevant lab personnel**.
- Formal escalation threshold: **7 overdue days** for the current V1 configuration.

Still requires a final V1 escalation recipient/authority mapping.

---

## UAQ17 — Privacy / Security / External Cloud — CONFIGURABLE / DEFERRED

Current prototype decision:
- Use **dummy/synthetic data only**.
- Cloud deployment is permitted for the prototype.
- Do not use real student/faculty PII externally without future institutional authorization.

Production privacy/security policy remains institutionally unresolved.

---

## UAQ18 — College Infrastructure — CONFIGURABLE / DEFERRED

The prototype proceeds with scalable portable architecture and cloud deployment rather than waiting for the final college server/VM specification.

Future college infrastructure details remain unresolved and are not required to block the prototype.

---

## UAQ19 — Backup / Audit Retention — PARTIALLY ANSWERED

Important actions must be auditable, including approvals, HoD overwrite, issue/use, return, reservation, extension, retained-in-project closure and configuration changes.

Formal retention duration remains unresolved/configurable.

---

## UAQ20 — Cross-Department — CURRENT-SCOPE DECISION

Current system and central database are **R&A-only**.

Cross-department sharing is out of scope.

---

## UAQ21 — Unmet-Demand Recipients — ANSWERED / CONFIRMED

Unmet-demand information is intended for **Central Store / central inventory management**.

---

## UAQ22 — Long-Term Ownership — DEFERRED / NON-BLOCKING

Long-term institutional ownership is not required to be resolved for the prototype. The system should nevertheless avoid hard-coding the developers as permanent owners and should keep administration/configuration transferable.

## UAQ23 — Project Editing / Submission Authority — ANSWERED / LOCKED

- Ishaan is the implementation/project lead, but application users are governed separately.
- Each student project has a **Project Lead** role at the project level.
- Project Lead may edit project metadata, manage project membership according to project rules, edit requirements and submit/withdraw project requests before physical issue.
- Other project members may view the project and contribute requirements but cannot silently submit/modify the authoritative request unless granted project-lead permission.
- All material project/request changes are audited.

---

## UAQ24 — Faculty / Lab Mapping Multiplicity — ANSWERED / LOCKED for V1

- A lab may have multiple Lab Assistants.
- A Lab Assistant may manage multiple labs.
- A Lab In-Charge remains limited to one or at most two labs.
- When multiple Lab Assistants are assigned to the issuing lab, the approved operational order is notified to all assigned assistants and the first authorized assistant to **claim** it becomes the operational owner.
- Claim/assignment is audited.
- Staff mapping administration remains configurable and institutional; V1 does not invent a separate reassignment policy.

---

## UAQ25 — Central Store Stage Semantics — ANSWERED / LOCKED

Central Store is an **inventory-management/system stage**, not a separate user role in V1. The stage records/validates consumable inventory and fulfilment planning before HoD final approval. Physical issue remains the Lab Assistant's operational responsibility.

---

## UAQ26 — Request / Reservation Cancellation — ANSWERED / LOCKED

Student cancellation is allowed for:

- `DRAFT`
- `SUBMITTED` / pending approval
- `APPROVED` but not yet physically issued
- `WAITING_FIFO` reservations

Cancellation creates a terminal `CANCELLED` state, an audit event, releases any reservation hold, advances the FIFO queue where applicable, and emits the relevant notification. After physical issue/use begins, the student cannot cancel the issue; the process is closed through return/reconciliation instead.

---

## UAQ27 — Asset Assignment Authority — ANSWERED / LOCKED

The **Lab Assistant of the issuing lab** makes/confirm the specific physical asset assignment at the operational stage. The system may present matching available assets, but the assistant verifies the actual unit using SIT Barcode/Default ID. HoD retains overwrite authority and auditability.

---

## UAQ28 — Asset “Use in College” Transaction Semantics — ANSWERED / LOCKED

**Option A is locked.** An approved `USE_IN_COLLEGE` asset request creates an actual use/checkout transaction with issue/start timestamp, requested/approved duration, due time and required physical return/reconciliation. This preserves the physical asset's lifecycle and audit trail.

---

## UAQ29 — Repeated-Offender / REPO Rule — ANSWERED / LOCKED

V1 uses the Explainable REPO Index defined in PART Z. The repeated-offender flag is derived when **2 or more confirmed attributable incidents occur within 180 days OR REPO ≥ 35**. The HoD may void/correct a confirmed incident with mandatory reason and audit. The score is then deterministically recomputed. The flag/score is informational only and does not automatically restrict borrowing, reservations or approval.

---

## UAQ30 — Approval by Email — ANSWERED / LOCKED

**Option A is locked.** Email provides status and a live deep link to LabTrack. Approve/Reject occurs on the website. After the action, a new domain event triggers a follow-up email/in-app notification to the next relevant actors and records the updated request timeline.

---

## UAQ31 — Alternative Component Compatibility Rules — ANSWERED / LOCKED

V1 uses **curated alternative/compatibility mappings + deterministic metadata filters + AI explanation/ranking**. AI cannot create a candidate outside the deterministic candidate set. Live MySQL validation is required before a recommendation is displayed.

---

## UAQ32 — Notification Recipient Matrix — ANSWERED / LOCKED for V1

The recipient matrix in PART AA is normative for V1. Notifications are role/entity based and originate from the authoritative domain event. Email and in-app delivery are parallel outputs of the same event.

---

## UAQ33 — Inspection Photo Storage / Retention — ANSWERED for V1 architecture

V1 asset inspection photos are stored through a provider-neutral **ObjectStorageAdapter**. The initial implementation uses **AWS S3**; the adapter boundary permits Azure Blob Storage and Google Cloud Storage later. The application DB stores object metadata/reference, not binary image content. Retention duration remains a production/institutional configuration item.

---

# PART AV — QUESTION PRIORITY

After the latest answers, the remaining questions are primarily **institutional integration/configuration items rather than core product-model gaps**.

## P0 — BLOCKING ONLY FOR PRODUCTION / INSTITUTIONAL ADOPTION

- UAQ1 — Production authentication/SSO details
- UAQ2 — Authoritative master-data source/API
- UAQ17 — Production privacy/security/cloud policy
- UAQ18 — College production infrastructure

## P1 — IMPLEMENTATION-BLOCKING / MUST DECIDE BEFORE FULL CODE

No core product-behavior questions remain in the current V1 decision register. The formerly P1 implementation questions (UAQ23–UAQ33 except retention) are now locked in the current project context.

## P1 — CONFIGURATION / PRODUCTION POLICY DETAILS

- UAQ9 — Detailed institutional asset-history extensions beyond V1
- UAQ16 — Production escalation-recipient changes beyond the V1 matrix
- UAQ19 — Audit/backup retention duration
- UAQ33 — Production inspection-photo retention duration

## P2 — FUTURE GOVERNANCE

- UAQ22 — Long-term institutional ownership
- Future cross-department governance beyond current R&A-only scope

UAQ11 and UAQ12 are no longer open for V1 execution: reservation expiry is 24 hours and the V1 demo allows up to 2 extensions.

# PART AW — CURRENTLY LOCKED PRODUCT DECISIONS

The following should be treated as **locked current requirements/decisions** unless faculty or the user explicitly changes them:

1. R&A-only inventory/database scope.
2. Assets vs Consumables as the two primary inventory classes.
3. SIT Barcode as primary asset lookup/identity.
4. Per-lab quantity tracking for consumables.
5. Sensors and actuators are consumables.
6. Bad consumable tracking enabled; total physical = good + bad.
7. Faculty Mentor approves/rejects first.
8. Asset route uses Lab In-Charge before HoD.
9. Consumable route uses Central Store before HoD.
10. HoD is mandatory final approval stage for normal requests.
11. HoD has Super Access and is the only overwrite authority.
12. Approved requests go to the Lab Assistant of the issuing lab.
13. Asset use and take-home issuance are separate permission purposes.
14. Minimum-lab fulfilment optimization is required.
15. Asset transfer is out of V1.
16. Reservations cover both Assets and Consumables and use FIFO.
17. Reminder timing is 5 days before + daily after due.
18. Current overdue escalation threshold is 7 days.
19. Repeated-offender visibility is approved; numeric REPO/automatic penalties are not required in V1.
20. Retained-in-project is a distinct closure path.
21. Dummy/synthetic data is used for the entire prototype.
22. All dummy data and V1 assumptions must be replaceable/configurable.
23. MySQL is the current SQL direction; MongoDB/NoSQL remains for DCDS.
24. Cloud deployment is for the prototype with dummy data.
25. AI remains optional/advisory and not a priority.
26. Frontend = React + Vite + TypeScript.
27. Backend = FastAPI + Pydantic.
28. API = REST + OpenAPI with generated frontend contract types.
29. SQL = MySQL 8.4/InnoDB + SQLAlchemy 2.x + Alembic.
30. MongoDB is limited to document/event/analytics concerns; MySQL remains authoritative.
31. Redis is excluded from V1.
32. Notifications originate from authoritative domain events and fan out to in-app/web + email; email is never the notification source of truth.
33. Approval actions occur on the LabTrack website; email contains a live request link and updated status.
34. Reservation expiry = 24 hours in V1.
35. Approved-but-not-collected expiry = 48 hours in V1 demo configuration.
36. FIFO override may be performed by Lab Assistant with reason/audit and by HoD with audit.
37. Student selects requested borrowing/usage duration.
38. V1 demo allows up to 2 extensions.
39. Issue-time concurrency revalidation is mandatory; no automatic partial fulfilment.
40. Return inspection applies to both Assets and Consumables with class-specific fields; asset photo evidence is supported.
41. Use-in-college asset requests are real use/checkout transactions requiring return reconciliation.
42. Project has a sequential immutable Project ID (`PROJ-000001`...) and a required Project Name.
43. Project-level Project Lead controls project editing/submission; implementation Project Lead is Ishaan and frontend ownership is Raghu.
44. Multiple Lab Assistants can be assigned to a lab; approved operational orders notify all, first authorized assistant claims the order.
45. Central Store is a system/inventory-management stage, not an application user role.
46. Student cancellation is allowed before physical issue; issued transactions close by return/reconciliation, not cancellation.
47. Specific physical asset assignment is performed/confirmed by the Lab Assistant of the issuing lab.
48. Explainable REPO Index is 0–100 and informational only; human attribution is authoritative; NLP remarks classification is advisory.
49. REPO repeated-offender flag = 2 confirmed attributable incidents within 180 days OR REPO >= 35.
50. HoD may void/correct confirmed accountability incidents with reason and audit; REPO recomputes deterministically.
51. Alternative recommendations use curated compatibility mappings + deterministic metadata filtering + AI explanation/ranking + live MySQL validation.
52. Asset inspection photos use provider-neutral object storage with AWS S3 as V1 adapter; Azure Blob/GCS remain replaceable adapters.
53. Multi-cloud roles: AWS primary, Azure staging/DR-ready, GCP analytics/read-only; one authoritative write environment.
54. Docker + GitHub Actions are the standard packaging/CI path; Terraform is the preferred IaC layer.

26. Backend = FastAPI + Pydantic.
27. Frontend = React + Vite + TypeScript.
28. API = REST + OpenAPI with generated frontend contract types.
29. SQL = MySQL 8.4/InnoDB + SQLAlchemy 2.x + Alembic.
30. MongoDB is limited to document/event/analytics concerns; MySQL remains authoritative.
31. Redis is excluded from V1.
32. Notifications originate from domain events and fan out to in-app/web + email; email is never the source of notification truth.
33. Email approval/status notifications contain live request links to the LabTrack website.
34. Reservation expiry = 24 hours in V1 configuration.
35. Approved-but-not-collected expiry = 48 hours in V1 demo configuration.
36. FIFO override may be performed by Lab Assistant with reason/audit and by HoD with audit.
37. Student selects requested borrowing/usage duration.
38. V1 demo allows up to 2 extensions.
39. Issue-time concurrency revalidation is mandatory; no automatic partial fulfilment.
40. Return inspection applies to both Assets and Consumables with class-specific fields; asset photo evidence is supported.
41. Future mobile client uses Capacitor against the same backend/API.
42. Multi-cloud V1 architecture is AWS primary, Azure staging/DR-ready, GCP analytics/read-only, with a single authoritative write environment.
43. Docker + GitHub Actions are the standard packaging/CI path; Terraform is the preferred reproducible infrastructure layer.


# PART AX — WHAT MUST NOT BE INVENTED IN THE PPT

Never invent:

- Official college policy not yet confirmed.
- Official production SSO/API details.
- Real student/faculty identities when using the prototype.
- Penalty amounts or automatic monetary consequences.
- A universal borrowing duration that has not been chosen.
- Asset transfers as a current V1 feature.
- College production infrastructure.
- Official adoption status.
- Measured impact percentages.
- AI authority over inventory/approval.

Current V1 values such as **7 overdue days** may be presented as **configurable project decisions**, not immutable institutional law.

# PART AY — CLAIMS THAT REQUIRE ACTUAL MEASUREMENT

Do not claim:

- 100% automation.
- Zero errors.
- 50% faster.
- 80% workload reduction.
- Guaranteed availability.
- Guaranteed alternative compatibility.
- AI-driven procurement prediction.
- Fully autonomous lab management.

If the team later measures these, the measured methodology and results can be presented.


# PART AZ — IMPORTANT PRODUCT PRINCIPLE

The core product principle is:

> **Automate the work lab assistants currently perform manually without changing departmental policy unless that policy has been explicitly authorized.**

When policy is unknown:

**Current understanding → V1 temporary assumption → Faculty clarification → Confirmed requirement → System update**

---

# PART BA — PROJECT SUCCESS CRITERIA

A strong V1 should allow a student/team to go through:

**Project creation**
→ **Requirement entry**
→ **On-the-spot availability check**
→ **Minimum-lab fulfilment planning**
→ **Faculty Mentor review**
→ **Class-specific routing**
→ **HoD final approval**
→ **Lab Assistant operational issue**
→ **Due-date tracking**
→ **Reminder**
→ **Extension**
→ **Return / Retained in Project**
→ **Inspection / Reconciliation**
→ **Inventory update**
→ **History**

And support exception flows:

**Unavailable → Inform Student / Alternative / Reservation / Unmet Demand**

**Overdue → Reminder → 7-Day Escalation**

**Damaged/Lost → Inspection/Reconciliation → Historical Record**

**Issued → Reservation → Return → FIFO next user**

The implementation should remain **replaceable/configurable**: dummy users, master data, inventory, policy thresholds and institutional adapters must be swappable without redesigning the core business logic.

# PART BB — FUTURE MOBILE / PLAY STORE

The user wants:

- Web application first.
- Mobile application later.
- Potential Play Store deployment.

Do not treat the mobile application as a V1 dependency.

---

# PART BC — DEPLOYMENT TARGET

Short-term:
**Cloud-hosted demonstration**

Long-term:
**College-managed server/VM if available and approved**

The application should therefore be portable.

---

# PART BD — ACADEMIC PROJECT POSITIONING

The project should simultaneously demonstrate:

## Real-world relevance
Solves a genuine laboratory operations problem.

## Software engineering
Workflow, roles, validation, error handling, security, testing.

## Database systems
SQL + NoSQL integration and advanced querying/data retrieval for DCDS.

## Python
Meaningful Python implementation where applicable.

## CCE
- Topic submission
- Research/literature survey
- Presentation
- Running example
- Viva

## Cloud
Live cloud deployment for demonstration.

The project should remain one unified application.

---

# PART BE — ONE-PARAGRAPH MASTER SUMMARY

LabTrack is a proposed centralized web-based laboratory hardware lifecycle management system for the **Robotics and Automation department** in an environment where availability, requests, issue records, due dates, reminders, returns and accountability are currently handled through email, notebooks and partly Excel. The current inventory model has **two primary classes: Assets and Consumables**. Assets such as Turtle Bot, Robotic Arm, Intel Depth Camera, Jetson Nano and PLC are individually identified using their **SIT Barcode (primary system lookup key), Default ID and Bill Number**, with bill numbers potentially shared across procurement lots. Consumables—including sensors and actuators—are **returnable, quantity-managed items** tracked per lab rather than individually identified; bad items are tracked and total physical quantity is maintained as good + bad. Student requests begin with a **Faculty Mentor** and then follow class-specific routing: **Consumables → Central Store (inventory management) → HoD → Lab Assistant of the selected issuing lab**, while **Assets → Lab In-Charge (faculty) → HoD → Lab Assistant of the issuing lab**. The Lab In-Charge is responsible for one or at most two labs, Lab Assistants can manage multiple labs, and the **HoD is a first-class Super Access role who sees all R&A projects and is the only role with overwrite access**. For assets, use-in-college and take-home issuance are distinct approval purposes, and a specific physical asset is assigned after asset-type approval. The system checks availability during request entry and computes a **minimum-lab fulfilment plan** so multi-component requests are fulfilled from the fewest possible labs while respecting per-lab stock. Reservations apply to both classes, use FIFO, and expire after a configurable period. Borrowing/usage duration is determined by the student/project requirement and departmental decision. Return includes normal return/reconciliation and a distinct **Retained in Project** closure, in which the issue is closed, active inventory is reduced/decommissioned, and the physical item remains with the departmental project. Reminders are sent 5 days before due date and daily thereafter; formal escalation begins after 7 overdue days in the current V1 configuration. Repeated-offender information is visible to authorized Faculty, HoD and Lab In-Charge users, while automated monetary penalty calculation is outside current scope; the informational Explainable REPO Index is current V1 scope. The current prototype uses **only dummy/synthetic data** and must be designed so users, master data, inventory, policy values, authentication and deployment configuration can later be replaced without rewriting business logic. The selected technical stack is React + Vite + TypeScript on FastAPI/Pydantic with REST/OpenAPI, MySQL 8.4/InnoDB + SQLAlchemy/Alembic for authoritative transactional state, MongoDB for notification/event/analytics documents, Docker/GitHub Actions for reproducible delivery, and BrowserAPIFree → ChatGPT as the initial advisory AI adapter. Notifications are event-driven and fan out to in-app/web plus email through a dedicated sender account. The prototype is web-first with a future Capacitor mobile path and a provider-portable AWS/Azure/GCP deployment model using one authoritative write environment.

# PART BF — ONE-SENTENCE PITCH

> **LabTrack turns Robotics and Automation department hardware handling into a traceable digital lifecycle by separating barcode-tracked assets from per-lab quantity-managed consumables, minimizing the number of issuing labs, and routing every request through the appropriate faculty, HoD and operational authority.**

# PART BG — AGENT OPERATING INSTRUCTIONS

Any AI agent receiving this document must:

1. Read the entire document before producing the requested artifact.
2. Preserve all project terminology.
3. Preserve the distinction between confirmed requirements, current project decisions, assumptions, unresolved policy and future scope.
4. Never invent college policy.
5. Never invent missing technical details.
6. Never treat a dummy value as an institutional value.
7. Treat current prototype data as replaceable seed data.
8. Treat V1 policy values as configurable rather than hard-coded where possible.
9. Keep authentication and future institutional master-data integration behind replaceable interfaces/adapters.
10. Treat the database inventory as authoritative.
11. Preserve the distinction between Assets and Consumables.
12. Preserve the class-specific approval workflows and HoD final approval.
13. Keep physical Lab Assistant authority visible.
14. Keep AI advisory rather than authoritative; AI is not a priority feature.
15. Do not describe future scope as current functionality.
16. Do not claim actual impact percentages without measurements.
17. Do not claim official college adoption unless explicitly confirmed.
18. Do not claim official SSO/API access unless explicitly confirmed.
19. Do not invent faculty names or institutional infrastructure.
20. Preserve historical transactions; do not silently overwrite history.
21. Use the minimum-lab fulfilment algorithm described in PART I when generating request/issue logic.
22. When later institutional data becomes available, prefer data/configuration replacement over business-logic rewrites.
23. Before coding a workflow, read its normative state/transition/error specification from the SDD.
24. Do not invent normal business behavior where the SDD/open-decision register is silent.
25. If an unexpected runtime error occurs, diagnose and handle it without changing the intended business policy.
26. Any new behavior required because the current SDD is incomplete must be recorded as an open decision/ADR before becoming a permanent requirement.
27. If new information is later supplied by faculty, update the relevant assumption/question rather than preserving contradictory assumptions.

# PART BH — SOURCE-OF-TRUTH HIERARCHY

When resolving conflicts, use this order:

1. **Explicit faculty/college-confirmed policy**
2. **Explicit current project decision confirmed by the user**
3. **Current V1 assumption**
4. **Future-scope idea**
5. **Agent inference**

The agent must not elevate level 5 into a requirement.

---

# PART BI — FINAL CHECKLIST BEFORE A PPT IS GENERATED

The agent should verify that the PPT covers, where relevant:

- [ ] Real current problem
- [ ] Existing manual process
- [ ] Users: Student / Faculty Mentor / Lab In-Charge / Lab Assistant / HoD / Technical Admin
- [ ] Project-based requirements
- [ ] R&A-only scope
- [ ] Component discovery
- [ ] Availability
- [ ] Asset vs Consumable model
- [ ] Asset SIT Barcode / Default ID / Bill Number
- [ ] Consumable quantity + classes
- [ ] Lab / Lab In-Charge mapping + selected issuing lab
- [ ] Lab Assistant mapping
- [ ] Class-specific request workflow
- [ ] HoD Super Access / final approval / overwrite authority
- [ ] Approval workflow
- [ ] Physical processing / asset-use vs take-home issuance distinction
- [ ] Individual asset tracking / SIT Barcode lookup
- [ ] Per-lab consumable quantity tracking + good/bad/total
- [ ] Due dates
- [ ] Reminders
- [ ] Extension
- [ ] Reservation
- [ ] Return
- [ ] Asset inspection (physical unit + photo evidence)
- [ ] Consumable inspection (quantity-level)
- [ ] Defect
- [ ] Damage
- [ ] Loss
- [ ] Penalty
- [ ] REPO
- [ ] Notifications
- [ ] Unmet demand → Central Store
- [ ] Audit history / HoD overwrite auditability
- [ ] AI boundaries
- [ ] Security/privacy
- [ ] Cloud deployment
- [ ] Running example
- [ ] DCDS relevance
- [ ] CCE requirements
- [ ] Future scope
- [ ] Faculty decisions / configurable unresolved policies

---

# PART BJI — IMPLEMENTATION-READINESS CHECKLIST

Before any coding phase is marked READY, verify that the SDD explicitly defines:

- [ ] Technology stack and rationale
- [ ] Exact database ownership boundaries (MySQL vs MongoDB)
- [ ] API contract location and generation process
- [ ] Role/permission matrix
- [ ] Canonical state machines
- [ ] Minimum-lab algorithm + tie-breaker
- [ ] Issue-time concurrency and no-partial-fulfilment rule
- [ ] Reservation FIFO + override policy + expiry
- [ ] Approved-but-not-collected expiry
- [ ] Borrowing duration input + extension semantics
- [ ] Asset vs consumable return inspection schemas
- [ ] Retained-in-project reconciliation semantics
- [ ] Accountability/REPO maintenance rules
- [ ] Notification event → in-app/email fan-out
- [ ] Approval timeline and email tracking
- [ ] Email provider adapter and sender account boundary
- [ ] AI context synchronization + live validator
- [ ] Alternative compatibility candidate policy
- [ ] Cloud/provider roles and single-writer rule
- [ ] Scheduler idempotency/recovery
- [ ] Object storage for inspection evidence
- [ ] Security/authorization enforcement
- [ ] SQL stored procedure(s) and Mongo aggregation(s) for DCDS
- [ ] File import/export behavior
- [ ] Error catalog and recovery behavior
- [ ] Test cases per workflow and exception
- [ ] Prototype → production replacement matrix

**No implementation agent should fill any unchecked item by invention.** It remains an explicit open decision until resolved.

---

# PART BJ — FINAL RULE

## Deprecated statements that must not be reused

- Old approval loop: **Student → Faculty → HoD → Faculty → Lab Assistant**.
- Old generic role model that excluded HoD.
- Old three-mode primary inventory model. The current primary classification is **Assets vs Consumables**.
- Old reminder schedule of **7/3/1 days**.
- Any PostgreSQL-as-current implementation statement; current SQL direction is **MySQL**.
- Any claim that the current central database is college-wide or multi-department; current scope is **Robotics and Automation only**.
- Any statement that consumables are disposable/one-time-use by definition.
- Any V1 asset-transfer workflow.
- Any claim that the REPO Index is a monetary penalty or automatically blocks access.
- Any hard-coded dummy identities, quantities, policy durations or institutional authentication assumptions.

This is a **complete project context document**, not a prompt to invent missing requirements.

If the information is not specified:

**Do not assume.**

Instead:

**Identify the missing information → map it to the appropriate faculty question → label the item unresolved or configurable.**

The purpose of the downstream AI is to make the project clearer and better represented — **not to fabricate requirements.**

# PART BK — PROTOTYPE-FIRST, REPLACEABLE ARCHITECTURE PRINCIPLE

LabTrack is being built as a **real application prototype with replaceable data and policy boundaries**, not as a disposable demo with hard-coded sample values.

## BK1. Dummy Data Must Be Replaceable

All prototype identities and inventory data are synthetic. The following must be seed/import data rather than hard-coded application constants:

- Students
- Faculty / Faculty Mentors
- Lab In-Charges
- Lab Assistants
- HoD account
- Labs
- Component catalogue
- Assets and SIT Barcodes
- Default IDs
- Bill Numbers
- Per-lab consumable quantities
- Projects and sample requests

## BK2. V1 Assumptions Must Be Configurable

The following are current project/configuration values rather than values that should be scattered through the code:

- 5-day pre-due reminder
- Daily overdue reminder
- 7-day escalation threshold
- Reservation expiry duration
- Borrowing/usage duration rules
- Extension rules
- Role-to-lab mappings
- Availability/fulfilment parameters
- Future authentication integration settings

## BK3. Replace Interfaces, Not Business Logic

The application should separate:

**Data source** → **Domain/business rules** → **Workflow/authorization** → **API/UI**

Institutional integration later should replace the data/authentication adapters rather than requiring a rewrite of the core lifecycle logic.

## BK4. Prototype Goal

A future move from:

**Dummy Data + Prototype Auth + Cloud Demo**

to:

**Real Institutional Data + IT Authentication + College Infrastructure**

should primarily involve configuration, seed-data replacement and adapter integration—not rewriting the project's core workflows.


# PART BL — LOCKED TECHNICAL BASELINE & SDD EXECUTION CONTRACT

This section exists specifically to prevent downstream AI agents from re-deciding architecture or inventing missing workflow behavior during implementation. The future SDD must promote these rules into normative architecture/business specifications.

## BL1. Selected application stack

| Layer | Selected technology | Decision status |
|---|---|---|
| Frontend | React + Vite + TypeScript | LOCKED |
| Backend | Python + FastAPI + Pydantic | LOCKED |
| API | REST + OpenAPI | LOCKED |
| SQL | MySQL 8.4 / InnoDB | LOCKED |
| ORM | SQLAlchemy 2.x | LOCKED |
| SQL migrations | Alembic | LOCKED |
| NoSQL | MongoDB | LOCKED |
| Authentication | Replaceable AuthProvider; synthetic V1 auth | LOCKED BOUNDARY |
| Notifications | Event-driven Notification Service + transactional outbox | LOCKED |
| Email | Gmail API through EmailProvider adapter | LOCKED INITIAL ADAPTER |
| Scheduler | APScheduler/simple scheduler | LOCKED V1 |
| AI | BrowserAPIFree → ChatGPT through LLM adapter | LOCKED INITIAL ADAPTER |
| Containers | Docker | LOCKED |
| Local/VM orchestration | Docker Compose | LOCKED V1 OPTION |
| CI/CD | GitHub Actions | LOCKED |
| Redis | Not used in V1 | LOCKED V1 EXCLUSION |
| Mobile | Capacitor around the same web application | FUTURE / PREPARED |
| IaC | Terraform/provider modules | SELECTED APPROACH |

## BL2. Database responsibility boundary

### MySQL = authoritative business state

MySQL owns:

- users and role assignments
- projects and members
- component catalogue
- labs and lab mappings
- assets
- per-lab consumable stock
- requests
- approvals
- request/transaction state
- issues/use
- reservations
- returns/reconciliation
- extensions
- accountability incidents/repeated-offender source records
- configuration/policy values that affect business behavior
- outbox events

### MongoDB = document/event/analytics state

MongoDB owns:

- in-app notification documents and delivery state
- append-oriented activity/event records where appropriate
- AI recommendation records/provenance
- unmet-demand analytics/events
- operational telemetry/analytics that does not define transactional truth

MongoDB must never be used as the authoritative source for current inventory quantity, approval status or physical asset state.

## BL3. Notification architecture

A single authoritative domain event can produce:

`Domain change → SQL outbox event → Notification Service → In-app notification + Email delivery`

The notification service must be idempotent. Delivery failure must not reverse the business transaction.

## BL4. Approval tracking

Every request has a canonical timeline. Notifications do not create a second approval system. Email and in-app notifications both resolve back to the same authoritative request record/timeline.

## BL5. Physical reconciliation contract

**Assets and Consumables both have return/inspection flows.** The inspection schema is class-aware. Asset inspection includes physical-unit identification and photo evidence; consumable inspection is quantity-oriented and uses good/bad/missing quantities plus functional status where applicable.

## BL6. No automatic partial issue

The system may plan multi-lab fulfilment, but once approval is granted it must **not automatically partially fulfil** the approved request because of a later stock race. Physical issue is all-or-reject at the approved-order level unless an explicit future policy changes this.

## BL7. Concurrency contract

The final inventory/asset check occurs under an authoritative SQL transaction at physical issue. Stock rows/asset records are revalidated and locked before mutation. A failed live recheck yields `FULFILMENT_FAILED_STOCK` and no partial issue.

## BL8. Error-handling philosophy

For each workflow step, the future SDD must predefine:

- Preconditions
- Inputs
- Validation rules
- State transition
- Database writes
- Audit events
- Notification events
- External side effects
- Failure modes
- Rollback/compensation behavior
- User-facing error state
- Retry/idempotency behavior

An implementation agent may handle **unforeseen errors**, but must not invent normal business behavior that should have been written in the SDD.

## BL9. Minimum required error cases

The SDD must define concrete handling for, at minimum:

1. insufficient stock at requirement entry
2. stock changed after approval
3. asset became unavailable after approval
4. duplicate request submission
5. duplicate issue attempt
6. expired approved-but-not-collected request
7. expired reservation
8. invalid/expired extension request
9. unauthorized action
10. role/lab mapping mismatch
11. invalid SIT Barcode / unknown asset
12. invalid quantity / negative quantity / excess quantity
13. database transaction failure / deadlock retry
14. MongoDB notification-store outage
15. email-provider outage or rejection
16. scheduler restart / missed job recovery
17. AI provider unavailable / timeout / malformed response
18. stale AI inventory context
19. file-import validation failure
20. inspection evidence upload failure
21. duplicate notification delivery
22. cloud-instance restart

## BL10. Scheduler recovery rule

Reminder/expiry jobs must be idempotent and recoverable. On restart, the primary scheduler scans for due obligations that have not yet produced a delivery/processing record and catches up without duplicating prior sends.

## BL11. Academic database features are first-class, not decorative

To satisfy DCDS meaningfully, the implementation plan must include:

- meaningful SQL joins
- nested/subqueries
- aggregations/grouping
- at least one meaningful MySQL stored procedure used or demonstrated by the application/reporting layer
- MongoDB aggregation pipeline(s) for unmet-demand / usage / notification analytics
- Python file handling through a controlled import/export workflow (e.g. CSV/JSON seed/import and export)
- input validation, exception handling, modular classes/functions and security validation

The exact procedures/pipelines will be specified in the SDD and implementation plan rather than invented during coding.

## BL12. Multi-cloud execution contract

- The same versioned application container images must be deployable to AWS/Azure/GCP.
- Only one environment is authoritative for writes at a time.
- Secondary environments may consume sanitized/read-only data/events.
- Only the active primary runs notification/expiry scheduling.
- Failover is a controlled promotion operation in V1, not automatic active-active consensus.

## BL13. Mobile contract

The V1 UI is web-first. No mobile-specific business rules are allowed. Future Capacitor packaging consumes the same REST/OpenAPI contract and authentication boundary.

## BL14. Technology decision documentation requirement

The future SDD must include a **Technology Selection & Rationale** table for every major component:

**Requirement → Candidates considered → Selected technology → Why selected → Why alternatives were not selected → Trade-offs → Replaceability/migration path → DCDS/CCE relevance**.

## BL15. Requirement completeness rule

Every executable requirement in the SDD must end in a machine-executable specification pattern:

**Actor + Preconditions + Input + Validation + Decision rule + State transition + Data mutation + Audit event + Notification event + Failure behavior + Recovery/retry + Test cases + Evidence artifact**.

If any field is missing, the item is **not implementation-ready** and must remain in the open-decision register rather than being guessed by an agent.

# SECTION — TECHNICAL DEPTH & VIVA STRATEGY

## Objective

Position LabTrack not merely as a basic inventory CRUD app, but as a technically deep software engineering project that highlights core computer science concepts during evaluation and viva.

> **Technical Frame:**  
> **LabTrack = Laboratory Hardware Lifecycle Management**  
> *powered technically by*  
> **Data Structures + Algorithms + Security + AI + Data Mining + Systems Concepts**

---

## 1. TECHNICAL DISCUSSION AREAS

### 1. Data Structures & Algorithms (DS & DAA)

**LabTrack connection:**
* **FIFO Reservation Queue:** Enqueue/dequeue logic, state tracking, and ordering guarantees.
* **Search & Indexing:** Efficient component catalog lookups and filter handling.
* **Minimum-Lab Fulfilment:** Quantity-constrained minimum set selection for multi-component project requests.
* **Queue Override Audit:** State preservation and complexity when lab assistants override FIFO queue positions.

#### Minimum-Lab Fulfilment Problem

Given required quantities `r[c]` and per-lab stock `q[l,c]`, select the smallest set of labs whose combined stock can satisfy every requested component quantity. For the current 8–10 lab environment, the prototype can solve this exactly by enumerating lab subsets in increasing size; the first feasible subset is optimal. For larger deployments, the same formulation can use 0–1 optimization or a greedy maximum-coverage heuristic.

### 2. Information Security & RBAC

**LabTrack connection:**
* **Authentication & Authorization:** Token-based session control and server-side RBAC.
* **Access Control Boundaries:** Scoped permissions ensuring students view authorized project records, Faculty Mentors view relevant projects, Lab In-Charges act on relevant asset workflows, Lab Assistants manage assigned labs, and the HoD has super access within the R&A application.
* **Input Validation & Auditability:** Parameterized database queries (SQL injection prevention) and append-only audit trail logging.

### 3. Artificial Intelligence & Guardrails

**LabTrack connection:**
* **Requirement Interpretation:** Mapping student project requirements to catalog items.
* **Semantic Alternative Suggestion:** Advisory recommendation engine grounded strictly in active inventory to eliminate hallucinations.
* **AI vs Rule-Based Boundaries:** AI remains read-only advisory while database triggers and backend services retain institutional authority.

### 4. Data Mining & Unmet-Demand Analytics

**LabTrack connection:**
* **Demand Mining:** Aggregating repeated requests for unstocked components to inform departmental procurement.
* **Usage & Trend Analysis:** Utilization distributions and return-delay pattern tracking.

### 5. Operating Systems & Concurrency

**LabTrack connection:**
* **Scheduled Jobs:** Asynchronous reminder dispatching and automated overdue checks.
* **Concurrency & Race Conditions:** Atomic database transactions and stored procedures to prevent double-issuance of physical assets.

---

## 2. VIVA PREPARATION STRATEGY

Be prepared to explain the implementation mechanics behind each technical area:

* **Reservation:** Queue representation, complexity of operations, and concurrency locks.
* **AI Engine:** Grounding methodology, prompt construction, and context restriction.
* **Security:** RBAC design, secret management, and audit log immutability.
* **Analytics:** Aggregation pipeline performance and historical trend calculation.


# PART BM — DETERMINISTIC SDD BUILD STANDARD

The SDD is the implementation contract. It must define the normal path and expected exceptions before coding begins. A coding agent may make an implementation choice only where the SDD explicitly permits a replaceable implementation choice.

Every executable requirement must be written using this canonical specification block:

```text
REQ-ID:
TITLE:
STATUS: CORE | CONFIGURABLE | ADAPTER | PROTOTYPE | PRODUCTION | FUTURE | DEPRECATED
OWNER:
ACTOR(S):
PRECONDITIONS:
INPUTS:
AUTHORIZATION:
VALIDATION:
NORMAL FLOW:
DECISION RULES:
STATE TRANSITION:
SQL MUTATION:
MONGODB MUTATION (if any):
OUTBOX / DOMAIN EVENT:
IN-APP NOTIFICATION:
EMAIL NOTIFICATION:
EXTERNAL SIDE EFFECTS:
AUDIT RECORD:
FAILURE MODES:
ROLLBACK / COMPENSATION:
RETRY / IDEMPOTENCY:
USER-FACING RESULT:
SECURITY CONSTRAINTS:
TEST CASES:
ACCEPTANCE CRITERIA:
EVIDENCE ARTIFACT:
TRACEABILITY:
```

### Determinism rule

An implementation agent must not infer a missing business rule from UI appearance, code conventions, conversation history or common industry practice. If a field above is genuinely not specified, the item is marked **OPEN DECISION** and coding stops at that boundary.

### Error-accounting rule

Agents are expected to handle **unforeseen runtime failures**. They are not expected to invent **unforeseen business policy**. Runtime handling may add defensive validation, retries, logging and safe failure states, but must preserve the normative business rules.

### Agent handoff rule

Every implementation session must read the relevant SDD section, consume the canonical API contract, verify ownership, implement only the assigned scope, run the defined tests, record deviations/errors, update `ACTIVE_STATE.md`, and commit/push the context update.

### Decision immutability rule

When a decision changes, the old rule becomes **DEPRECATED**, the new rule gets a dated decision/ADR entry, the state model and contracts are updated together, and impacted tests are identified before implementation continues.

