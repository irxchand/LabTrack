"""
LabTrack DCDSL Final Academic Project Report - Refined Chapters 1 to 5
High-fidelity academic narrative, structured technical tables, and engineering diagrams.

COMPLIANCE:
- ZERO em dashes (\u2014) in any string.
- Embedded Figure 1 (System Architecture), Figure 2 (Requisition Lifecycle), Figure 3 (Conceptual ER).
- All code identifiers protected from Word proofing underlines (<w:noProof/>).
- Table repeated headers (<w:tblHeader/>) and no-split rows (<w:cantSplit/>).
"""

from generate_dcds_report_refined import (
    add_chapter_title, add_heading2, add_heading3, add_body_paragraph,
    add_bullet_point, add_code_snippet, add_table_data, add_figure_image
)

def build_chapter_1(doc):
    """Chapter 1: Introduction."""
    add_chapter_title(doc, 1, "Introduction", add_break=False)

    add_heading2(doc, "1.1 Context and Institutional Background")
    add_body_paragraph(
        doc,
        "Modern higher technical education in Artificial Intelligence and Machine Learning (AI&ML), Robotics, "
        "and Embedded Systems requires intensive practical exposure to specialized, high-performance hardware. "
        "At Symbiosis Institute of Technology (SIT Pune), undergraduate and postgraduate engineering students engage in "
        "rigorous laboratory experiments, capstone research projects, and competitive hackathons. These technical "
        "endeavors necessitate continuous access to costly, fragile, and scarce hardware assets. Such components "
        "range from basic prototyping microcontrollers and discrete sensor arrays to advanced Edge AI computing platforms "
        "including the NVIDIA Jetson Nano, Jetson Orin series, Intel RealSense depth sensors, digital storage oscilloscopes, "
        "and autonomous robotic research kits like the TurtleBot 3."
    )
    add_body_paragraph(
        doc,
        "Historically, engineering departments manage laboratory hardware through localized paper ledgers, "
        "disparate spreadsheets, or manual physical sign-out slips maintained by laboratory attendants. "
        "While viable for small inventories of low-cost passive components, traditional manual approaches break "
        "down catastrophically when applied across modern multi-laboratory academic departments. In an institutional "
        "environment with more than ten distinct laboratory spaces spanning multiple departmental floors, physical "
        "custody tracking becomes fragmented. Students frequently encounter phantom stock, where an online spreadsheet "
        "or verbal confirmation suggests component availability, yet physical units are missing, damaged, or "
        "unaccounted for. Concurrently, faculty mentors face administrative overhead in signing manual authorization slips, "
        "and departmental heads lack real-time visibility into equipment utilization rates and unmet component demand."
    )

    add_heading2(doc, "1.2 Platform Overview: LabTrack")
    add_body_paragraph(
        doc,
        "To resolve these institutional bottlenecks, the LabTrack platform was engineered as an enterprise-grade, "
        "polyglot hardware lifecycle, requisition, and custody governance system. LabTrack replaces manual record-keeping "
        "with an authoritative digital operating environment that bridges student project workflows with faculty governance "
        "and physical counter operations."
    )
    add_body_paragraph(
        doc,
        "The platform introduces end-to-end digital lifecycle governance across every stage of institutional hardware "
        "utilization:",
        bold_prefix="Core Operational Scope:"
    )
    add_bullet_point(
        doc,
        "Centralized multi-lab hardware catalogue categorizing components by engineering tier, functional kind (ASSET vs CONSUMABLE), "
        "and real-time per-lab physical balances.",
        bold_prefix="Catalogue & Inventory Governance:"
    )
    add_bullet_point(
        doc,
        "Formal student research project groupings, cart-based multi-item requisitions, duration bounds, and academic justification.",
        bold_prefix="Requisition Workflows:"
    )
    add_bullet_point(
        doc,
        "Role-based multi-tier approval state machine routing orders through Project Mentors, Lab In-Charges, and Head of Department.",
        bold_prefix="Multi-Tier Approvals:"
    )
    add_bullet_point(
        doc,
        "Strict physical counter verification, barcoded asset binding, digital issuance, and technical return inspection with condition grading.",
        bold_prefix="Custody Handover & Return:"
    )
    add_bullet_point(
        doc,
        "Asynchronous projection of out-of-stock student requisitions to quantify unfulfilled hardware demand for departmental budgeting.",
        bold_prefix="Unmet Demand Analytics:"
    )

    add_heading2(doc, "1.3 Multi-Model Polyglot Architecture")
    add_body_paragraph(
        doc,
        "A foundational achievement of the LabTrack system is its dual-database polyglot persistence architecture. "
        "Recognizing that distinct institutional data models require divergent storage guarantees, LabTrack combines an "
        "authoritative relational database with an analytical document store:"
    )
    add_bullet_point(
        doc,
        "Aiven Cloud MySQL 8.4 Enterprise serves as the authoritative source of truth for transactional state, "
        "institutional identity, role-based permissions, financial custody, row-level inventory locks, and immutable compliance audits. "
        "It enforces strict ACID semantics, preventing double-allocation and ensuring complete data integrity.",
        bold_prefix="Authoritative Relational Engine (Aiven MySQL 8.4):"
    )
    add_bullet_point(
        doc,
        "MongoDB Atlas v7.0 operates alongside the relational core to manage polymorphic component datasheets, "
        "real-time student event notification streams, and asynchronous unmet demand projections. It utilizes multi-stage "
        "aggregation pipelines to summarize procurement signals without placing analytical load on the transactional relational core.",
        bold_prefix="Analytical Document Store (MongoDB Atlas v7.0):"
    )

    add_heading2(doc, "1.4 Scope and Objectives")
    add_body_paragraph(
        doc,
        "The objective of this academic project is to design, implement, and validate a production-ready institutional "
        "hardware management platform fulfilling the requirements of the Database Concepts for Data Science Lab (DCDS) "
        "curriculum at Symbiosis Institute of Technology. The platform satisfies all requirements of conceptual ER modeling, "
        "relational schema normalization up to Boyce-Codd Normal Form (BCNF), physical MySQL DDL implementation, complex relational "
        "JOINs, subqueries, stored procedures, database views, execution plan optimization, and multi-model document aggregation."
    )

def build_chapter_2(doc):
    """Chapter 2: Problem Statement."""
    add_chapter_title(doc, 2, "Problem Statement")

    add_heading2(doc, "2.1 Existing Institutional Challenges")
    add_body_paragraph(
        doc,
        "Academic engineering institutions frequently invest substantial capital into cutting-edge computing and "
        "embedded laboratory hardware. However, institutional return on investment and student productivity are severely "
        "hampered by the absence of an integrated, automated custody and inventory platform. Field observations and "
        "workflow audits within the Department of Artificial Intelligence & Machine Learning at SIT Pune revealed "
        "five critical operational failure modes in conventional manual workflows:"
    )

    add_heading3(doc, "1. Decentralized Inventory Silos and Visibility Gaps")
    add_body_paragraph(
        doc,
        "Engineering departments comprise specialized laboratories distributed across multiple physical floors, including "
        "the Robotics Lab, Automation Lab, AI Project Lab, Microcontroller and Embedded Systems Lab (MIOT), Software Engineering "
        "Lab, and Cloud Computing Lab. Each laboratory historically maintains an independent register or spreadsheet. "
        "Because there is no centralized database synchronizing inventory across rooms, students and faculty are unaware of "
        "surplus components located in adjacent laboratories. For instance, while one laboratory experiences a critical shortage "
        "of motor drivers or depth cameras for an ongoing hackathon, another laboratory may hold idle, unutilized stock."
    )

    add_heading3(doc, "2. The 'Phantom Stock' Problem and Inaccurate Balances")
    add_body_paragraph(
        doc,
        "Manual record-keeping creates severe discrepancies between recorded paper balances and actual physical stock. "
        "When hardware components are burned out during bench testing, cannibalized for spare parts, or misplaced during "
        "extended capstone projects, records are rarely updated synchronously. Students invest days designing circuit schematics "
        "around supposedly available microcontrollers, only to discover at the lab counter that the recorded units are physically "
        "missing or functionally defective."
    )

    add_heading3(doc, "3. Approval Friction and Administrative Bottlenecks")
    add_body_paragraph(
        doc,
        "Requisition procedures traditionally require paper requisition slips physically endorsed by multiple academic stakeholders: "
        "the student team lead, the faculty project mentor, the laboratory in-charge, and occasionally the Head of Department. "
        "Because faculty schedules are divided between lecture halls, research meetings, and departmental committees, students "
        "frequently spend two to five working days tracking down signatures. This latency halts project development cycles."
    )

    add_heading3(doc, "4. Custody Tracking and Accountability Deficits")
    add_body_paragraph(
        doc,
        "Standard paper registers record that a component type was issued, but fail to track the specific physical unit "
        "via unique serial numbers or barcodes. When hardware is returned with bent GPIO pins, cracked lens assemblies, or "
        "missing cables, it is virtually impossible to attribute the damage to a specific student group or project tenure. "
        "This absence of accountability accelerates equipment attrition and exhausts departmental maintenance budgets."
    )

    add_heading3(doc, "5. Procurement Blindspots Regarding Unmet Student Demand")
    add_body_paragraph(
        doc,
        "When students request hardware components that are currently out of stock or not yet stocked in departmental inventory, "
        "the requisition is simply turned away at the laboratory counter. Institutional leadership has no quantitative record of "
        "these unfulfilled requests. Consequently, annual departmental budget allocation and hardware procurement remain reactive "
        "and speculative rather than data-driven."
    )

    add_heading2(doc, "2.2 Formal Problem Formulation")
    add_body_paragraph(
        doc,
        "The problem addressed by this project can be formally stated as follows:",
        bold_prefix="Problem Statement:"
    )
    add_body_paragraph(
        doc,
        "\"To design, engineer, and deploy an automated, role-governed, polyglot hardware lifecycle platform that eliminates "
        "institutional inventory silos, enforces strict multi-tier academic approval workflows, establishes verifiable "
        "barcode-level custody traceability, guarantees transactional inventory integrity through ACID relational mechanisms, "
        "and aggregates unfulfilled student component demand through asynchronous document projections for data-driven departmental governance.\""
    )

def build_chapter_3(doc):
    """Chapter 3: System Architecture and Modules."""
    add_chapter_title(doc, 3, "System Architecture and Modules")

    add_heading2(doc, "3.1 System Architecture Overview")
    add_body_paragraph(
        doc,
        "LabTrack is engineered following a clean Modular Monolith architectural pattern. It couples a responsive single-page "
        "React frontend with a high-performance Python FastAPI backend, supported by a dual-engine persistence layer "
        "(Aiven Cloud MySQL 8.4 Enterprise and MongoDB Atlas v7.0). An asynchronous Transactional Outbox Worker bridges the "
        "two databases, guaranteeing eventual consistency without distributed transaction overhead."
    )

    add_figure_image(doc, ".artifacts/diagrams/figure1_system_architecture.png", "3.1",
                     "LabTrack Layered Modular Monolith and Polyglot Persistence Architecture", width_in=6.2)

    add_body_paragraph(
        doc,
        "As illustrated in Figure 3.1, the persistence architecture strictly isolates transactional operations from analytical telemetry:",
        bold_prefix="Dual Persistence Rationale:"
    )
    add_bullet_point(
        doc,
        "Aiven Cloud MySQL 8.4 Enterprise acts as the authoritative relational store. It maintains the canonical 20-table "
        "schema, executes row-level locked inventory transactions, and persists the append-only audit ledger.",
        bold_prefix="Authoritative Relational Core:"
    )
    add_bullet_point(
        doc,
        "MongoDB Atlas v7.0 operates as an analytical document store. It maintains polymorphic hardware datasheets, "
        "streams real-time user notification events, and runs multi-stage aggregation pipelines across unmet student demand.",
        bold_prefix="Analytical Document Store:"
    )

    add_heading2(doc, "3.2 Subsystem Modules and Structured Responsibilities")
    add_body_paragraph(
        doc,
        "The application domain is organized into eight highly cohesive subsystem modules. Table 3.1 delineates their "
        "inputs, processing logic, outputs, and backing database tables:"
    )

    headers = ["#", "Module Name", "Inputs", "Processing Logic", "Outputs", "Backing Tables"]
    rows = [
        ["1", "Identity & RBAC", "PRN/Staff ID, password, role tokens", "PBKDF2 credential verification, 8-hour bearer session hashing", "Auth token, user profile, role claims", "users, auth_sessions"],
        ["2", "Hardware Inventory", "Catalogue queries, category filters, item specs", "Polymorphic spec parsing, per-lab stock allocation, barcode generation", "Stock counts, item details, asset records", "items, stock, assets, labs"],
        ["3", "Research Projects", "Project title, description, mentor ID, member PRNs", "Team lead assignment, mentor association, member uniqueness checks", "Active project entity, member links", "projects, members"],
        ["4", "Requisition & Approvals", "Requisition cart, purpose, duration hours", "State machine transition, Tier-2 cost escalation check, due date calculation", "Order state (MENTOR_REVIEW -> APPROVED)", "requests, request_lines, extensions"],
        ["5", "Counter Custody", "Claim action, scanned asset barcodes", "Pessimistic stock locking, barcode validation, status transition to ISSUED", "Active loan record, decremented good stock", "requests, request_lines, assets, stock"],
        ["6", "Return & Inspection", "Returned assets, condition grades, technical remarks", "Functional grading (PASS/FAIL), good/bad stock balance restoration", "Inspection report, updated stock, closed order", "inspections, incidents, evidence, stock"],
        ["7", "Audit & Compliance", "State mutation events, actor ID, client IP", "Append-only trigger enforcement, immutability check, JSON diff logging", "Immutable audit row, tamper-evident log", "audit, idempotency"],
        ["8", "Outbox & Demand Worker", "Out-of-stock events, unstocked item requests", "Row locking (SKIP LOCKED), async HTTP/TLS dispatch, MongoDB upsert", "Dispatched outbox row, MongoDB demand doc", "outbox, deliveries, mongo.demand"]
    ]
    add_table_data(doc, headers, rows, col_widths=[0.3, 1.2, 1.1, 1.6, 1.1, 1.2],
                   caption="Table 3.1: LabTrack Subsystem Modules, Processing Logic, and Backing Tables")

def build_chapter_4(doc):
    """Chapter 4: Functional Requirements."""
    add_chapter_title(doc, 4, "Functional Requirements")

    add_heading2(doc, "4.1 User Role Matrix")
    add_body_paragraph(
        doc,
        "LabTrack enforces a strict Role-Based Access Control (RBAC) model reflecting institutional academic hierarchy. "
        "Five distinct user roles are supported, each possessing explicit functional privileges and workflow boundaries:"
    )

    headers = ["Role Identifier", "Institutional Role", "Operational Responsibilities & System Permissions"]
    rows = [
        ["STUDENT", "Student Investigator", "Form research projects, assemble team members, browse catalogue, submit requisitions, track approval states, queue for out-of-stock items."],
        ["MENTOR", "Faculty Project Mentor", "Review student project proposals, endorse technical requisition justifications, approve loan tenures, monitor active group hardware."],
        ["INCHARGE", "Laboratory In-Charge", "Oversee physical laboratory rooms, manage component stock, approve component allocations, review return inspections and incident escalations."],
        ["ASSISTANT", "Laboratory Assistant", "Operate laboratory service counters, claim approved orders, scan asset barcodes during physical issuance, conduct return inspections, record pass/fail grades."],
        ["HOD", "Head of Department", "Grant final Tier-2 authorization for high-value hardware assets (SBCs, GPUs, cameras), access department-wide inventory health and demand analytics."]
    ]
    add_table_data(doc, headers, rows, col_widths=[1.2, 1.6, 3.7], caption="Table 4.1: Institutional Role Matrix and Operational Permissions")

    add_heading2(doc, "4.2 Hardware Requisition Lifecycle Workflow")
    add_body_paragraph(
        doc,
        "Hardware requisition follows a multi-tier governance state machine. Figure 4.1 illustrates the complete workflow "
        "from student cart assembly through faculty endorsements, counter handover, active custody, and technical return inspection:"
    )

    add_figure_image(doc, ".artifacts/diagrams/figure2_requisition_lifecycle.png", "4.1",
                     "LabTrack End-to-End Hardware Requisition, Multi-Tier Approval, and Return Custody Lifecycle", width_in=6.4)

    add_heading2(doc, "4.3 Functional Requirements Specification")
    add_body_paragraph(
        doc,
        "The functional requirements of the LabTrack platform are categorized into discrete functional areas. "
        "Each requirement is formally assigned a unique identifier:"
    )

    req_headers = ["Req ID", "Category", "Functional Description & Acceptance Criteria"]
    req_rows = [
        ["REQ-AUTH-01", "Authentication", "System shall authenticate institutional users via unique PRN/Staff identifier and password using PBKDF2 hashing."],
        ["REQ-AUTH-02", "Session Management", "System shall issue cryptographically random 8-hour bearer tokens stored as SHA-256 hashes in auth_sessions."],
        ["REQ-INV-01", "Catalogue Browsing", "System shall provide real-time search, category filtering, and polymorphic specification viewing across all hardware items."],
        ["REQ-INV-02", "Stock Balances", "System shall maintain segregated good and defective stock counts per laboratory room, enforcing non-negativity."],
        ["REQ-INV-03", "Asset Barcoding", "System shall track individualized, trackable hardware units (ASSET kind) via globally unique alphanumeric barcodes."],
        ["REQ-PROJ-01", "Project Formation", "Students shall create research projects with designated team leads and associate up to four peer members."],
        ["REQ-REQ-01", "Requisition Cart", "Student teams shall assemble multi-item requisition carts specifying requested quantities, source labs, and loan durations."],
        ["REQ-REQ-02", "Approval Workflow", "System shall route submitted orders through sequential states: SUBMITTED -> MENTOR_REVIEW -> INCHARGE_REVIEW -> APPROVED."],
        ["REQ-REQ-03", "HoD Tier-2 Escalation", "System shall automatically escalate requisitions containing Tier-2 high-cost components (e.g. Jetson Nano) to HoD review."],
        ["REQ-ISS-01", "Counter Claiming", "Laboratory assistants shall atomically claim approved orders to prevent concurrent handover processing across desks."],
        ["REQ-ISS-02", "Physical Handover", "System shall require scanning/selection of exact asset barcodes before confirming issuance, atomically decrementing good stock."],
        ["REQ-RET-01", "Return Inspection", "System shall capture a technical return inspection recording component functional status (PASS/FAIL) and remarks."],
        ["REQ-RET-02", "Inventory Reconciliation", "System shall increment good stock upon PASS inspection or defective bad stock upon FAIL inspection."],
        ["REQ-AUD-01", "Compliance Ledger", "System shall write immutable audit rows for every state transition, recording actor ID, timestamp, and payload diff."],
        ["REQ-DEM-01", "Unmet Demand Projection", "System shall write outbox events when requested stock is unavailable and project demand documents into MongoDB Atlas."]
    ]
    add_table_data(doc, req_headers, req_rows, col_widths=[1.2, 1.5, 3.8], caption="Table 4.2: Comprehensive Functional Requirements Specification")

    add_heading2(doc, "4.4 Non-Functional Requirements")
    add_bullet_point(
        doc,
        "All data transmission between client and cloud endpoints is encrypted using TLS 1.3. Relational databases enforce strict parameterized queries.",
        bold_prefix="Security & Data Protection:"
    )
    add_bullet_point(
        doc,
        "Database transactions enforce ACID guarantees. Stock decrement and allocation employ pessimistic locking (SELECT ... FOR UPDATE) to prevent race conditions.",
        bold_prefix="Data Integrity & Concurrency:"
    )
    add_bullet_point(
        doc,
        "Primary key and indexed secondary key lookups execute within sub-5ms latency on the cloud MySQL instance.",
        bold_prefix="Performance & Scalability:"
    )
    add_bullet_point(
        doc,
        "Idempotency keys on state-mutating API requests guarantee that network retries never result in duplicate hardware deductions.",
        bold_prefix="Reliability & Fault Tolerance:"
    )

def build_chapter_5(doc):
    """Chapter 5: Entities, Relationships and Attributes."""
    add_chapter_title(doc, 5, "Entities, Relationships and Attributes")

    add_heading2(doc, "5.1 Conceptual ER Model (Chen Notation)")
    add_body_paragraph(
        doc,
        "The conceptual design of the LabTrack persistence model is constructed using formal Chen notation, "
        "as prescribed by the Symbiosis Institute of Technology DCDS curriculum. Entities are depicted as rectangles, "
        "relationships as diamonds, attributes as ovals, and primary keys with underlined labels. "
        "Figure 5.1 illustrates the conceptual Entity-Relationship diagram:"
    )

    add_figure_image(doc, ".artifacts/diagrams/figure3_conceptual_er_chen.png", "5.1",
                     "LabTrack Conceptual Entity-Relationship Model in Formal Chen Notation", width_in=6.4)

    add_heading2(doc, "5.2 Cardinalities, Participation, and Business Rules")
    add_body_paragraph(
        doc,
        "The structural relationships between conceptual entities reflect institutional academic rules and physical depot constraints:"
    )
    add_bullet_point(
        doc,
        "A faculty member can mentor N research projects; a student may lead at most one active project at a time. "
        "Total participation is optional on the user side (e.g. administrative staff do not lead projects).",
        bold_prefix="Users to Projects (1:N, Optional):"
    )
    add_bullet_point(
        doc,
        "Modeled via the associative relation members with composite primary key (project_id, user_id). "
        "Every project must contain at least one lead student and up to four collaborative team members.",
        bold_prefix="Projects to Members (M:N Associative):"
    )
    add_bullet_point(
        doc,
        "Every laboratory room is strictly governed by exactly one designated faculty In-Charge (labs.incharge_id -> users.id). "
        "A faculty member may oversee at most two institutional laboratories.",
        bold_prefix="Labs to In-Charge Faculty (N:1, Mandatory):"
    )
    add_bullet_point(
        doc,
        "An item catalogue definition links to multiple per-lab stock balance records. Composite uniqueness UNIQUE(item_id, lab_id) "
        "guarantees one authoritative balance row per item-lab pair.",
        bold_prefix="Items to Stock (1:N, Mandatory):"
    )
    add_bullet_point(
        doc,
        "Hardware allocations never allow negative balances: good >= 0 and bad >= 0. Stock decrement operations acquire "
        "pessimistic row-level locks (SELECT ... FOR UPDATE) inside atomic transactions.",
        bold_prefix="Stock Integrity Constraint:"
    )
    add_bullet_point(
        doc,
        "Upon physical return of borrowed equipment, a request produces exactly one technical inspection report (1:1 optional). "
        "The foreign key inspections.request_id is constrained as UNIQUE to prevent duplicate inspection records.",
        bold_prefix="Requests to Inspections (1:1):"
    )

    add_heading2(doc, "5.3 Canonical Data Dictionary")
    add_body_paragraph(
        doc,
        "The authoritative relational engine operates on a 20-table schema synchronized via Alembic migration "
        "revision 99bd73089019 on MySQL 8.4 Enterprise. Table 5.1 provides the complete canonical data dictionary:"
    )

    headers = ["#", "Table Name", "Primary Key", "Foreign Keys", "Key Constraints & Semantic Domain"]
    rows = [
        ["1", "users", "id (INT Auto)", "None", "identifier (UNIQUE), email (UNIQUE). Institutional user roster."],
        ["2", "auth_sessions", "token_hash (VARCHAR 64)", "user_id -> users.id", "8-hour token expiry, server-side session state."],
        ["3", "labs", "id (INT Auto)", "incharge_id -> users.id", "lab_code (nullable string), Floor/wing bounds. Physical lab rooms."],
        ["4", "items", "id (INT Auto)", "None", "CHECK (kind IN ('ASSET', 'CONSUMABLE')), category index."],
        ["5", "stock", "id (INT Auto)", "item_id -> items.id, lab_id -> labs.id", "UNIQUE(item_id, lab_id), CHECK(good>=0 AND bad>=0)."],
        ["6", "assets", "id (INT Auto)", "item_id -> items.id, lab_id -> labs.id", "barcode (UNIQUE), physical serialized hardware state ENUM."],
        ["7", "projects", "id (INT Auto)", "lead_id -> users.id, mentor_id -> users.id", "Academic research project groups and capstone teams."],
        ["8", "members", "(project_id, user_id)", "project_id -> projects.id, user_id -> users.id", "Associative relation linking students to research projects."],
        ["9", "requests", "id (INT Auto)", "project_id -> projects.id, incharge_id, claimed_by", "Lifecycle state machine enum, duration, due timestamp."],
        ["10", "request_lines", "id (INT Auto)", "request_id -> requests.id, item_id, lab_id", "UNIQUE(request_id, item_id, lab_id), CHECK(quantity>0)."],
        ["11", "extensions", "id (INT Auto)", "request_id -> requests.id", "Multi-tier loan tenure extension approval records."],
        ["12", "reservations", "id (INT Auto)", "project_id -> projects.id, item_id -> items.id", "FIFO waiting queue for out-of-stock components."],
        ["13", "inspections", "id (INT Auto)", "request_id -> requests.id (UNIQUE), actor_id", "1:1 return inspection, condition grading, remarks."],
        ["14", "incidents", "id (INT Auto)", "request_id -> requests.id, project_id, actor_id", "Hardware breakage, loss, or damage incident reports."],
        ["15", "evidence", "id (VARCHAR 64)", "request_id -> requests.id, actor_id -> users.id", "Cryptographic SHA-256 checksums and damage photo keys."],
        ["16", "audit", "id (INT Auto)", "actor_id, request_id, project_id", "Append-only immutable institutional compliance ledger."],
        ["17", "outbox", "id (INT Auto)", "None", "event_key (UNIQUE), dispatched flag for NoSQL pipeline."],
        ["18", "idempotency", "key (VARCHAR 200)", "None", "SHA-256 payload fingerprint, duplicate execution blocker."],
        ["19", "deliveries", "id (VARCHAR 200)", "None", "External notification delivery tracking ledger."],
        ["20", "local_documents", "id (VARCHAR 200)", "None", "Key-value JSON cache for resilient offline fallback."]
    ]
    add_table_data(doc, headers, rows, col_widths=[0.4, 1.3, 1.4, 1.6, 1.8], caption="Table 5.1: Canonical Data Dictionary (Aiven Cloud MySQL 8.4 Relational Schema)")

print("Refined Chapters 1-5 loaded successfully.")
