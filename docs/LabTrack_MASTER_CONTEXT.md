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

The project team described the approximate environment as:

- **8–10 labs**
- **10–12 lab assistants**
- **700–800 students**
- Maximum expected concurrent users: approximately **5–10**

The system is initially a **prototype**.

The project has a potential long-term goal of **department adoption**, but adoption is not to be presented as already approved.

Current inventory is partly in **Excel**.

Current issue history is partly in **notebooks**.

---

# PART D — PROJECT GOALS

The system is intended to:

1. Centralize component information.
2. Make availability visible.
3. Show component location.
4. Show responsible lab assistant.
5. Organize component requirements by project.
6. Support student teams.
7. Support faculty mentors.
8. Support controlled component requests.
9. Support approval workflows.
10. Give lab assistants physical issuance authority.
11. Track active issues.
12. Track due dates.
13. Automate reminders.
14. Support extensions.
15. Support reservations.
16. Support FIFO reservation queues.
17. Record returns.
18. Record return condition.
19. Track defects.
20. Track losses.
21. Support penalties.
22. Maintain issue history.
23. Maintain asset history.
24. Maintain reservation history.
25. Maintain extension history.
26. Maintain transfer history.
27. Maintain audit history.
28. Provide in-app notifications.
29. Provide email notifications.
30. Record unmet demand.
31. Provide basic demand intelligence.
32. Introduce the proposed REPO/reputation concept.
33. Provide limited AI assistance.
34. Keep actual inventory authoritative in the database.
35. Support eventual migration from cloud demonstration to college infrastructure.

---

# PART E — USERS AND ACCESS

# E1. Student

A student should be able to:

- Log in.
- View their profile.
- Create a project.
- View/manage their projects.
- Add team members.
- Select a faculty mentor.
- Enter/select component requirements.
- Search components.
- View component details.
- View technical specifications.
- View availability.
- View quantity.
- View lab.
- View lab assistant.
- View alternatives.
- Request available components.
- View unavailable components.
- Reserve currently-issued components.
- View reservation position/queue.
- View active issues.
- View due dates.
- Request an extension.
- Receive notifications.
- Receive emails.
- Return components.
- View issue history.
- View project/component history.
- View penalties.
- View REPO/reputation information.

---

# E2. Student Data

Expected student information:

- Name
- PRN
- Batch
- Branch
- Email
- Section
- Phone

PRN is intended to be the primary student identifier.

A PRN convention was described:

- `25` = batch
- `60` = AIML
- `70` = R&A
- `10` = Civil
- `50` = Mechanical
- `20` = CSE
- `30` = E&TC

This is a project-context convention and must not be presented as officially verified until checked against the college dataset.

The intended direction is for student information to be fetched from an authoritative college/faculty dataset rather than manually entered.

If such a dataset cannot be accessed during development, dummy/synthetic data can be used.

---

# E3. Faculty

Faculty should be able to:

- Log in.
- View projects relevant to them.
- View project members.
- View project requirements.
- View component requests.
- Approve requests.
- Reject requests.
- Modify requests.
- Receive notifications.
- Receive email notifications.
- View issue information.
- Receive overdue notifications.
- Participate in escalation.
- Participate in extension approval where required.
- View project/component history.
- Receive defect/penalty information.
- Potentially revoke approval where policy permits.

Faculty should not automatically see all student projects.

Faculty visibility should be scoped to relevant projects/mentorship/authorized access.

---

# E4. Lab Assistant

The lab assistant is the operational authority for physical inventory.

Capabilities:

- View assigned labs.
- View inventory.
- View component availability.
- View approved requests.
- Physically check components.
- Physically verify inventory before issue.
- Select actual physical asset when applicable.
- Issue components.
- Set borrowing duration.
- Modify borrowing duration where permitted.
- View active issues.
- Monitor overdue issues.
- Trigger/perform escalation where authorized.
- Manage reservations.
- Override reservation order where authorized.
- Record reservation override justification.
- Transfer assets between labs.
- Record transfer history.
- Inspect returned components.
- Record condition.
- Add remarks.
- Upload photos/evidence.
- Record defects.
- Record damage.
- Record loss.
- Mark items under repair.
- Maintain inventory.
- Record penalties.
- Communicate with students/faculty.

Physical issuance should remain under lab-assistant control.

---

# E5. Admin

For V1, the project/admin team requires full access for:

- Development
- Testing
- Debugging
- Demonstration
- Data setup
- System configuration

Potential admin functions:

- Manage users.
- Manage roles.
- Manage labs.
- Manage lab assistants.
- Manage faculty.
- Manage students.
- Manage components.
- Manage physical assets.
- Manage categories.
- Manage configurations.
- Manage logs.
- Import data.
- Seed demo data.
- Maintain mappings.

## Future administrator ownership

The project should not hard-code the current developer/project creator as permanent administrator.

Future ownership should allow:

1. New administrator to be promoted.
2. Administrator to be verified.
3. Existing administrator to transfer responsibility.
4. Old administrator to be deactivated where appropriate.

Admin is therefore a role/state, not a permanent personal identity.

---

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

A major design distinction is:

## G1. Component Type

Represents the general item/type.

Examples:
- Arduino Uno
- ESP32
- Ultrasonic Sensor
- Resistor
- Capacitor
- LED
- Jumper Wire

## G2. Physical Asset

Represents an individual physical unit.

Examples:
- ARDUINO-001
- ARDUINO-002
- ESP32-014

The system should not treat every component as an individual serialized asset.

---

# PART H — THREE INVENTORY TRACKING MODES

## H1. Individually tracked

Suitable examples:
- Arduino boards
- ESP32 boards
- Raspberry Pi
- High-value boards
- Other hardware where physical-unit history matters

Each asset can have an internal department/system ID.

Example:
`ARDUINO-001`

Manufacturer serial number/ID is stored separately and can be nullable.

Database must enforce uniqueness.

---

## H2. Quantity tracked

Suitable examples:
- Resistors
- Capacitors
- LEDs
- Jumper wires
- Other common/basic utilities

The system tracks quantity.

---

## H3. Consumable

Some materials may be consumable.

Exact classification must be confirmed.

---

# PART I — LAB MAPPING

Initial V1 working assumption:

- A lab has one primary responsible assistant.
- One assistant can potentially manage multiple labs.

This is subject to UAQ4.

Each physical asset has a current lab.

Assets may move between labs.

The system should preserve transfer history.

Detailed cabinet/shelf/drawer tracking is not required for V1.

---

# PART J — COMPONENT DISCOVERY

Students should select/search from a controlled component catalog.

Do not rely primarily on arbitrary free-text component names.

Component display should include, where applicable:

- Component name
- Category
- Description
- Technical specifications
- Availability
- Quantity
- Current lab
- Lab assistant
- Current status
- Tracking mode
- Alternatives

---

# PART K — AVAILABILITY

Useful V1 availability states:

1. Available
2. Insufficient quantity
3. Currently issued
4. Reserved
5. Defective
6. Under repair
7. Out/unavailable
8. Not stocked / non-existent

---

# PART L — REQUEST LOGIC

When a student adds a component requirement:

1. System checks inventory.
2. System checks current availability.
3. System identifies available quantity/assets.
4. System shows location.
5. System shows responsible lab assistant.
6. System can show alternatives.
7. If available, student can request it.
8. If currently issued, student can reserve it.
9. If not stocked, system can record unmet demand.

## Critical latest V1 rule

**Unavailable components should not be submitted as normal issue requests.**

If a component is unavailable:
- Show its status.
- Show alternatives if possible.
- Offer reservation if the component exists but is currently issued.
- Record unmet demand if it is genuinely not stocked.

---

# PART M — ALTERNATIVE COMPONENTS

The system may suggest alternatives.

The alternatives mechanism can use AI in V1.

However:

**AI is advisory only.**

The system/database must remain authoritative for:
- Actual inventory.
- Actual availability.
- Physical asset status.
- Issuance.
- Approval.
- Reservation order.
- Penalties.

---

# PART N — AI SCOPE

The user explicitly does not want this to become a huge LLM project.

AI should have a narrow, useful role.

Potential V1 AI functions:

### Component explanation
Explain what a component is/does.

### Requirement understanding
Interpret a student's project/component requirement.

### Alternative suggestion
Suggest possible alternatives.

### Student assistance
Help students understand component choices.

AI should not:
- Decide whether an item exists.
- Override inventory.
- Issue components.
- Approve requests.
- Change reservation priority.
- Decide penalties.
- Set official status.
- Act as the institutional authority.

---

# PART O — APPROVAL WORKFLOW

Temporary V1 workflow:

**Student → Faculty → HoD → Faculty → Lab Assistant → Physical Issue**

This is not yet confirmed as official college policy.

## Current V1 interpretation

1. Student submits request.
2. Faculty reviews.
3. HoD approval occurs where required by the V1 flow.
4. Faculty receives/continues the workflow.
5. Lab assistant receives the approved request.
6. Lab assistant physically verifies.
7. Lab assistant issues.

Faculty may:
- Approve
- Reject
- Modify

Rejection informs the student.

Multiple faculty/equal-authority handling was discussed as:
- Multiple faculty may have equal authority.
- If one faculty member acts, others can be informed.

This remains subject to faculty confirmation.

---

# PART P — PHYSICAL ISSUE

After final required approvals:

1. Lab assistant receives approved request.
2. Lab assistant physically checks the requested items.
3. For individually tracked items, lab assistant selects the actual physical asset.
4. Issue transaction is created.
5. Duration/due date is assigned.
6. Component becomes actively issued.
7. Student/faculty receive acknowledgement.
8. Due-date/reminder lifecycle starts.

Issue is a transaction, not just a property of the component.

---

# PART Q — ISSUE TRANSACTION HISTORY

An issue should preserve information such as:

- Student
- Project
- Component type
- Physical asset where applicable
- Quantity
- Issuing lab
- Issuing lab assistant
- Issue date
- Due date
- Return date
- Current status
- Extension records
- Return inspection
- Defect records
- Penalty records
- Relevant approval records

The system should preserve historical transactions rather than overwrite them.

---

# PART R — BORROWING DURATION

V1 should use a configurable default duration.

Lab assistants may be allowed to modify it for edge cases.

Exact official borrowing duration is unresolved.

---

# PART S — EXTENSIONS

Student can request an extension.

Extension should be a separate record.

Conceptual flow:

**Student → Extension Request → Required Approval → Lab Assistant Updates Due Date**

If approved:
- New due date is recorded.
- Extension history is preserved.
- Approved extension period is not treated as late.

Exact policy is unresolved.

---

# PART T — REMINDERS

Temporary V1 schedule:

- 7 days before due date
- 3 days before
- 1 day before
- On due date
- Daily after due date while overdue

Continue until:
- Returned, or
- Extension approved

If extension is approved, the approved extension period should be respected.

Exact institutional timing is UAQ16.

---

# PART U — OVERDUE ESCALATION

Temporary V1:

**Overdue → Lab Assistant monitors → Lab Assistant decides faculty notification → Faculty decides HoD escalation**

Important:
The lab assistant is not automatically required to escalate every overdue item at the same stage; the current V1 concept gives operational judgment to the assistant.

Exact official policy is unresolved.

---

# PART V — RESERVATION

Reservation is primarily for components/assets that:
- Exist in inventory.
- Are currently issued/unavailable.

V1 uses FIFO.

Example:

Student A has Arduino-001.

Student B wants it and reserves.

Student C wants it later and reserves.

After return:
Student B receives first opportunity.

## Reservation override

Lab assistant may override FIFO if authorized.

Override must preserve:
- Who overrode.
- Why.
- When.
- Affected reservation.
- Relevant communication.

Faculty does not have a direct system override in V1; faculty can contact the lab assistant.

Exact expiry/non-collection policy is unresolved.

---

# PART W — RETURN

Return flow:

**Student returns → Lab Assistant inspects → Condition recorded → Evidence if required → Return recorded → Inventory updated → Student acknowledgement**

Potential statuses:
- Working
- Damaged
- Defective
- Lost
- Under Repair
- Unavailable

Exact official inspection parameters remain unresolved.

---

# PART X — DEFECT / DAMAGE / LOSS

When a returned component is defective/damaged/lost, the system should record:

- Component/asset
- Student
- Project
- Original issue
- Date/time
- Who identified the problem
- Description
- Condition
- What happened
- Photo/evidence
- Remarks
- Repair status
- Penalty status if applicable

Defective equipment can move into:
- Defective
- Under Repair
- Unavailable

History must remain.

---

# PART Y — PENALTIES

V1 supports penalty records for:

- Late return
- Damage
- Loss

Potential fields:
- Student
- Issue
- Component/asset
- Reason
- Assessed penalty
- Authority
- Status
- Remarks
- Waiver/reduction/override

No payment gateway is required.

Temporary V1 authority:
- Lab assistant records/assesses.
- Faculty/admin may waive/reduce/override where authorized.

Exact formulas and amounts are unresolved.

Do not invent a penalty amount.

---

# PART Z — REPO / REPUTATION

REPO was defined in project discussions as a proposed **reputation score**.

Possible inputs:
- On-time return behavior
- Late returns
- Damaged items
- Lost items
- Extension behavior
- Borrowing history

Possible future effects:
- Borrowing eligibility
- Reservation priority
- Reliability indication

Exact formula and authority are unresolved.

REPO should be:
- Explainable.
- Transparent.
- Auditable.
- Consistent.

---

# PART AA — NOTIFICATIONS

Two notification channels:

## In-app
- Request status
- Approval
- Issue
- Reminder
- Overdue
- Extension
- Reservation
- Defect
- Penalty
- Escalation

## Email

Dedicated project/system email should send automated emails.

Possible recipients:
- Student
- Faculty
- Lab Assistant
- HoD

Email should also serve as a communication record where appropriate.

---

# PART AB — UNMET DEMAND

There is no full procurement system in V1.

If a required component:
- Is not in inventory, and
- Has no usable alternative,

the system records unmet demand.

The department can later see:
- What components are repeatedly requested.
- How often demand occurs.
- Which missing components may warrant attention.

This is **demand intelligence**, not procurement execution.

---

# PART AC — DATA MIGRATION

Existing inventory:
- Excel.

Existing historical issue data:
- Notebooks.

V1:
- Excel import should be supported.
- Complete historical notebook migration is not required.
- New digital records should become the new structured history.
- Dummy/synthetic data can be used for demonstration.

---

# PART AD — AUTHENTICATION

Authentication is currently unresolved.

Desired eventual direction:
- College identity/SSO.

V1 authentication should be replaceable.

Student:
- PRN = primary identity.

Staff:
- Institutional email is a temporary assumption unless official staff ID is available.

---

# PART AE — MASTER DATA

Desired authoritative datasets:

- Student data
- Faculty data
- Lab-assistant data
- Department data
- Batch/branch/section data
- Lab data

The team wants student data to be fetched automatically from a faculty/college dataset if authorized access is available.

If access is not available:
- Use dummy data for demo.

Do not fabricate a real college integration.

---

# PART AF — CLOUD

V1 direction:

**Cloud VM/server → Dummy/safe data → CCE demo → Department review → College infrastructure**

The user wants cloud deployment for the CCE demonstration.

The application should be portable to a college-managed server/VM later.

Real student PII should not be placed on external infrastructure until college privacy/security requirements are known.

---

# PART AG — SECURITY

Desired principles:

- Role-based access.
- Students only see authorized student/project records.
- Faculty see relevant projects.
- Lab assistants see assigned labs/inventory.
- Admin has elevated privileges.
- Important actions are auditable.
- Avoid unnecessary PII duplication.
- Use synthetic data for external demos until authorized.
- Database constraints prevent invalid duplicate IDs.
- Historical transactions should not be silently overwritten.

---

# PART AH — AUDIT TRAIL

Important events should be historical/auditable:

- Approval
- Rejection
- Modification
- Issue
- Return
- Extension
- Reservation
- Reservation override
- Asset transfer
- Defect
- Penalty
- REPO change
- Admin configuration
- Role change
- User mapping changes

Audit retention is unresolved.

---

# PART AI — ASSET TRANSFERS

An asset may move:

**Lab A → Lab B**

Transfer should record:
- Asset
- Previous lab
- New lab
- Transfer date/time
- Person/action authority
- Reason where applicable

The system should retain transfer history.

Exact authorization is UAQ10.

---

# PART AJ — CROSS-DEPARTMENT

Future-capable, but not primary V1.

Potential future:
- Cross-department users.
- Cross-department equipment.
- Inter-department transfers.

Exact policy is unresolved.

---

# PART AK — FUTURE SCOPE

Explicit future directions discussed:

- Native mobile app.
- Play Store deployment.
- Detailed cabinet/shelf/drawer location.
- Full procurement workflow.
- Payment handling.
- Formal dispute resolution.
- Enterprise accounting.
- Advanced AI.
- Full SSO after confirmation.
- Cross-department governance.
- Detailed warranty management.
- Advanced analytics.

Do not present these as V1 requirements unless explicitly moved into scope.

---

# PART AL — PROJECT TIMELINE / TEAM

Current team discussed:
- 2 people.
- Ishaan.
- One strong frontend teammate.

Initial implementation target discussed:
- Approximately 15 days.

Important academic constraint discussed:
- DCDS registration/rubric originally requires a **4-member team** and same division.
- The implementation team currently consists of the user + frontend teammate.
- This is an academic/team-structure constraint that must be kept distinct from who is actually implementing the software.

Do not silently resolve this contradiction.

---

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

The strongest live demonstration:

## Scenario

A student has an academic project.

### Stage 1
Student logs in.

### Stage 2
Creates project.

### Stage 3
Adds multiple team members.

### Stage 4
Selects faculty mentor.

### Stage 5
Adds components:
- Arduino Uno × 2
- Ultrasonic Sensor × 4
- Other relevant items.

### Stage 6
System checks availability.

### Stage 7
System shows:
- Availability.
- Quantity.
- Lab.
- Lab assistant.
- Specifications.
- Alternatives.

### Stage 8
Student requests available items.

### Stage 9
Faculty reviews.

### Stage 10
HoD approval occurs if required by configured workflow.

### Stage 11
Lab assistant receives approved request.

### Stage 12
Lab assistant physically checks the components.

### Stage 13
Assistant selects actual assets where applicable.

### Stage 14
Assistant sets duration.

### Stage 15
Issue is recorded.

### Stage 16
Student/faculty receive notification.

### Stage 17
Dashboard shows active issue and due date.

### Stage 18
Reminder is generated.

### Stage 19
Student requests extension.

### Stage 20
Extension is approved/rejected.

### Stage 21
If approved, due date changes and extension history is retained.

### Stage 22
Student returns components.

### Stage 23
Lab assistant inspects.

### Stage 24
Assistant records Working or Defective/Damaged/etc.

### Stage 25
Inventory updates.

### Stage 26
Issue closes.

### Stage 27
History is retained.

### Stage 28
Penalty/REPO is updated where applicable.

---

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
Student / Faculty / Lab Assistant / Admin.

### 6. Lifecycle
Project → Requirement → Availability → Approval → Issue → Track → Return.

### 7. Accountability
Reminders → Extension → Overdue → Inspection → Penalty/REPO.

### 8. Inventory model
Component Type vs Physical Asset.

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
System Users and Roles

## Slide 7
End-to-End Component Lifecycle

## Slide 8
Project-Based Component Management

## Slide 9
Inventory Model:
Component Type vs Physical Asset

## Slide 10
Availability, Requests and Reservations

## Slide 11
Approval and Physical Issuance

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

The following questions were consolidated from the project discussions.

## UAQ1 — Authentication / SSO

What authentication/SSO system does the college use, what integration method is available, and what permissions can LabTrack obtain?

---

## UAQ2 — Master Data

What authorized student/faculty/lab-assistant master datasets exist, and what API/read access can the project obtain?

---

## UAQ3 — Staff IDs

Do faculty and lab assistants have institutional IDs in addition to their college email addresses?

---

## UAQ4 — Lab/Assistant Mapping

Can one lab have multiple assistants, and can one assistant officially manage multiple labs?

---

## UAQ5 — Approval Workflow

What is the exact approval policy?

Specifically:
- Is HoD approval always required?
- When is it required?
- What triggers it?
- Can multiple faculty approve?
- Are multiple faculty equal authority?
- What happens if one approves and another rejects?
- Can faculty modify requests?
- Can faculty revoke approval?
- Who is the final authority before the lab assistant?
- What exactly is the final routing?

---

## UAQ6 — Unavailable Components / Demand

When a component is unavailable:
- What should be recorded?
- Should demand be aggregated?
- Who reviews it?
- Is this only informational?
- Does it trigger procurement discussion?
- What fields should be retained for demand analysis?

---

## UAQ7 — Tracking Classification

Which hardware should be:
- Individually tracked?
- Quantity tracked?
- Consumable?

Especially clarify common utilities such as:
- Wires
- Resistors
- Capacitors
- LEDs
- Similar basic items.

---

## UAQ8 — Existing IDs

Which assets/components currently have:
- Manufacturer serial numbers?
- Department IDs?
- Existing asset codes?
- Other identification conventions?

Which identifiers must be preserved?

---

## UAQ9 — Individual Asset History

Which asset classes require individual physical-unit history?

What qualifies an item as:
- High-value?
- Individually tracked?
- Individually accountable?

---

## UAQ10 — Asset Transfers

Can equipment move between labs?

If yes:
- Who authorizes it?
- Who records it?
- Is faculty approval required?
- Should both source and destination assistants approve?
- What history must be preserved?

---

## UAQ11 — Reservation

How long does a reservation remain valid?

What happens if a student does not collect the item?

Are category-level reservations allowed, or only reservations against a specific physical asset/component?

---

## UAQ12 — Borrowing / Extension

What are the official:
- Borrowing durations?
- Extension rules?
- Maximum extensions?
- Non-extendable categories?
- Extension authority?
- Due-date modification rules?

---

## UAQ13 — Penalties

What are the official:
- Late-return rules?
- Damage rules?
- Loss rules?
- Penalty formulas?
- Replacement-cost rules?
- Approval authority?
- Waiver rules?
- Reduction rules?
- Appeal/dispute rules?

---

## UAQ14 — Return Inspection

What exact parameters must the lab assistant record?

For example:
- Physical condition?
- Functional test?
- Missing parts?
- Visible damage?
- Accessories?
- Photographs?
- Remarks?
- Test result?

The examples are questions, not assumptions.

---

## UAQ15 — REPO

Should the REPO/reputation concept officially exist?

If yes:
- Formula?
- Factors?
- Score range?
- Update frequency?
- Effect on borrowing?
- Effect on reservation?
- Who can override?
- Can a student challenge it?

---

## UAQ16 — Reminders / Escalation

What are the exact official:
- Reminder timings?
- Overdue timings?
- Escalation thresholds?
- Escalation recipients?
- Escalation authority?
- HoD involvement?

---

## UAQ17 — Privacy / Security / External Cloud

What college policies apply to:
- Student PII?
- Faculty information?
- External cloud hosting?
- Database storage?
- Backups?
- Email transmission?
- Logs?
- Authentication data?

---

## UAQ18 — College Infrastructure

What infrastructure can the college provide for eventual production?

Specifically:
- Server/VM?
- Storage?
- Database?
- Network?
- Firewall?
- DNS?
- HTTPS?
- Internal-only access?
- Internet access?

---

## UAQ19 — Backup / Audit Retention

How long must:
- Backups
- Audit logs
- Issue history
- Penalty history
- User activity history

be retained?

---

## UAQ20 — Cross-Department

Can equipment be shared between departments?

If yes:
- Who can request?
- Who can approve?
- Who owns the asset?
- Who handles transfer?
- What happens if damaged/lost?

---

## UAQ21 — Unmet-Demand Recipients

Who should receive/view unmet-demand information?

Possibilities discussed conceptually include department/lab administration, but no recipient is confirmed.

---

## UAQ22 — Long-Term Ownership

After adoption:
- Who maintains user mappings?
- Who handles failures?
- Who handles database recovery?
- Who becomes system administrator?
- Who maintains the application?

---

# PART AV — QUESTION PRIORITY

## P0 — MUST RESOLVE

- UAQ5 — Approval
- UAQ7 — Tracking model
- UAQ8 — IDs
- UAQ12 — Borrowing/extension
- UAQ13 — Penalties
- UAQ16 — Reminders/escalation
- UAQ1 — Authentication
- UAQ2 — Master data
- UAQ17 — Privacy/cloud
- UAQ18 — College infrastructure

## P1 — SHOULD RESOLVE

- UAQ3
- UAQ4
- UAQ6
- UAQ10
- UAQ11
- UAQ14
- UAQ15
- UAQ19
- UAQ20
- UAQ21

## P2 — LATER

- UAQ22

---

# PART AW — FACULTY DISCUSSION ORDER

Recommended sequence:

## Policy
1. Approval
2. Borrowing
3. Extension
4. Penalties
5. Overdue/escalation
6. Inventory classification

## Institutional integration
7. Authentication
8. Master data
9. Privacy/cloud
10. College infrastructure

## Operational
11. Assistant/lab mapping
12. Reservations
13. Inspection
14. Transfers
15. Demand logging

## Governance/future
16. REPO
17. Audit retention
18. Cross-department
19. Long-term ownership

---

# PART AX — WHAT MUST NOT BE INVENTED IN THE PPT

Never invent:

- Official college policy.
- Official approval chain.
- Faculty names.
- Official borrowing duration.
- Penalty amount.
- REPO formula.
- Official SSO.
- Real college API.
- Production server.
- College approval.
- Adoption status.
- Measured performance improvement.
- User satisfaction percentages.
- Error reduction percentages.
- Procurement decisions.
- Official asset classification.
- Official reservation duration.

If unknown, label it:
- Pending faculty confirmation.
- V1 assumption.
- Proposed.
- Future scope.

---

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

---

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
→ **Availability discovery**
→ **Request**
→ **Approval**
→ **Physical issue**
→ **Due-date tracking**
→ **Reminder**
→ **Extension**
→ **Return**
→ **Inspection**
→ **Inventory update**
→ **History**

And support exception flows:

**Unavailable → Alternative / Reservation / Unmet Demand**

**Overdue → Reminder → Escalation**

**Damaged → Inspection → Defect → Penalty/Repair**

**Issued → Reservation → Return → FIFO next user**

---

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

LabTrack is a proposed centralized web-based laboratory hardware lifecycle management system for a college environment in which component requests, availability checks, issues, due dates, reminders, returns, defects and historical records are currently handled through email, notebooks and partly Excel. The system is intended for approximately 8–10 labs, 10–12 lab assistants and 700–800 students, with a small expected concurrent-user load. Students create project records, add multiple team members, select faculty mentors, discover components, see availability/location/assistant information, request available components, reserve currently-issued components and track active issues. Faculty participate in approval, while lab assistants retain operational control over physical verification, issuance, transfers, return inspection, defects and penalties. The system supports individual asset tracking for hardware such as Arduino/ESP boards, quantity tracking for common components such as resistors and jumper wires, and consumable handling where appropriate. It maintains issue, reservation, extension, transfer, defect, penalty and audit history; provides in-app/email notifications; records unmet demand; and proposes a transparent REPO/reputation concept. AI is intentionally limited to component explanation, requirement interpretation and alternative suggestions, while the database remains authoritative for actual inventory and workflow state. Authentication, institutional datasets, exact approval policy, borrowing duration, penalties, reminder/escalation policy, privacy/cloud policy and production infrastructure remain subject to faculty/college confirmation. The project is being developed as a web-first V1, with cloud demonstration, future mobile/Play Store potential, and eventual portability to college infrastructure. It is also being shaped as a unified academic project for DCDS and CCE requirements, including SQL + NoSQL, Python, advanced querying/data retrieval, UI/code quality, testing/security/error handling, research/literature survey, presentation, running example and viva.

---

# PART BF — ONE-SENTENCE PITCH

> **LabTrack turns fragmented laboratory hardware handling into a traceable digital lifecycle—from project requirements and availability through approval, physical issuance, reminders, reservation, return, inspection and accountability.**

---

# PART BG — AGENT OPERATING INSTRUCTIONS

Any AI agent receiving this document must:

1. Read the entire document before producing the requested artifact.
2. Preserve all project terminology.
3. Preserve the distinction between current facts, assumptions, unresolved questions and future scope.
4. Never invent college policy.
5. Never invent missing technical details.
6. Never claim an unresolved workflow is final.
7. Use the faculty questions when information is missing.
8. Treat database inventory as authoritative.
9. Keep physical lab-assistant authority visible.
10. Keep AI advisory rather than authoritative.
11. Do not turn the project into an AI-only application.
12. Do not describe future scope as current functionality.
13. Do not claim actual impact percentages without measurements.
14. Do not claim official college adoption unless explicitly confirmed.
15. Do not claim official SSO/API access unless explicitly confirmed.
16. Do not invent faculty names or institutional infrastructure.
17. Build PPTs around a coherent problem → solution → workflow → demo → impact story.
18. For faculty-question artifacts, prioritize policy decisions that can alter the data model/workflow.
19. For technical artifacts, do not silently add features outside V1.
20. If new information is later supplied by faculty, update the relevant assumption/question rather than preserving contradictory assumptions.

---

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
- [ ] Users
- [ ] Project-based requirements
- [ ] Component discovery
- [ ] Availability
- [ ] Lab mapping
- [ ] Assistant mapping
- [ ] Request workflow
- [ ] Approval workflow
- [ ] Physical issuance
- [ ] Individual asset tracking
- [ ] Quantity tracking
- [ ] Due dates
- [ ] Reminders
- [ ] Extension
- [ ] Reservation
- [ ] Return
- [ ] Inspection
- [ ] Defect
- [ ] Damage
- [ ] Loss
- [ ] Penalty
- [ ] REPO
- [ ] Notifications
- [ ] Unmet demand
- [ ] Audit history
- [ ] AI boundaries
- [ ] Security/privacy
- [ ] Cloud deployment
- [ ] Running example
- [ ] DCDS relevance
- [ ] CCE requirements
- [ ] Future scope
- [ ] Faculty decisions

---

# PART BJ — FINAL RULE

This is a **complete project context document**, not a prompt to invent missing requirements.

If the information is not specified:

**Do not assume.**

Instead:

**Identify the missing information → map it to the appropriate faculty question → label the item unresolved.**

The purpose of the downstream AI is to make the project clearer and better represented — **not to fabricate requirements.**

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
* **Queue Override Audit:** State preservation and complexity when lab assistants override FIFO queue positions.

### 2. Information Security & RBAC

**LabTrack connection:**
* **Authentication & Authorization:** Token-based session control and server-side RBAC.
* **Access Control Boundaries:** Scoped permissions ensuring students view only their projects, faculty view only mentored projects, and lab assistants manage only assigned labs.
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

