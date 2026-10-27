# LabTrack — Hybrid Database Architecture & Specification

## 1. Overview
LabTrack implements an enterprise-grade **Hybrid Multi-Model Database Architecture** designed to meet all criteria of the **Database Concepts for Data Science Lab (DCDSL)** curriculum:

```
┌─────────────────────────────────────────────────────────────┐
│                 LabTrack FastAPI Application                │
└──────────────┬──────────────────────────────┬───────────────┘
               │ SQLAlchemy ORM               │ PyMongo Driver
┌──────────────▼──────────────┐┌──────────────▼───────────────┐
│     Relational MySQL 8.0    ││      MongoDB Atlas Cloud     │
│   (Normalized Master Store) ││     (NoSQL Event Ledger)     │
│   • 21 Normalized Tables    ││   • Requisition Lifecycle    │
│   • 3NF/BCNF Schema Design  ││   • Unmet Component Demand   │
│   • Cascading Foreign Keys  ││   • High-Velocity Notifs     │
│   • Stored Procedures       ││   • Aggregation Pipelines    │
│   • Multi-Table Analytical  ││   • JSON Document Flexibility│
│     INNER/LEFT JOIN Queries ││                              │
└─────────────────────────────┘└──────────────────────────────┘
```

---

## 2. Relational Store (MySQL 8.0 / SQLAlchemy ORM)
* **Schema Definition:** [`database/mysql/schema.sql`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/database/mysql/schema.sql)
* **ORM Entity Models:** [`src/backend/labtrack/models.py`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/src/backend/labtrack/models.py)
* **Migrations:** [`src/backend/migrations/`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/src/backend/migrations) managed via Alembic.

### Key Relational Tables & Normalization:
1. **`users`**: Institutional accounts (PRN, Full Name, Role ENUM, Password Hash, Department, Email, Status).
2. **`labs`**: Physical lab facilities with department ownership and in-charge faculty references.
3. **`items`**: Catalogued hardware components, specifications, threshold levels, and alternative component references.
4. **`assets`**: Serialized individual inventory instances with unique institutional barcodes and current operational state (`AVAILABLE`, `ISSUED`, `MAINTENANCE`, `RETIRED`).
5. **`stock`**: Many-to-many relationship mapping `(item_id, lab_id)` with on-hand quantity counters.
6. **`projects`**: Student capstone and coursework projects, linking student leads and faculty mentors.
7. **`requests` & `request_lines`**: Multi-line hardware requisition slips with state machine tracking (`SUBMITTED`, `ENDORSED`, `SANCTIONED`, `ISSUED`, `CLOSED`).
8. **`loans`**: Active physical custody records linking issued asset barcodes, requisition lines, student custody, and expected return timestamps.
9. **`reservations`**: Advanced component holds for scheduled future coursework slots.
10. **`audits` & `auth_audit_logs`**: Immutable security and operational audit logs tracking all lifecycle transitions.

### Stored Procedures & Advanced SQL:
* **Procedure File:** [`database/mysql/reporting.sql`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/database/mysql/reporting.sql)
* **Analytical Procedure:** `labtrack_usage_by_lab()`:
  Executes a multi-table `INNER JOIN` across `labs`, `requests`, `request_lines`, and `items` with `GROUP BY` aggregation to compute monthly hardware utilization rates per departmental lab.

---

## 3. Document Store (MongoDB Atlas)
* **Aggregation Scripts:** [`database/mongo/analytics.js`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/database/mongo/analytics.js)
* **Backend Adapter:** [`src/backend/labtrack/adapters.py`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/src/backend/labtrack/adapters.py) (`MongoDocumentStore`)

### MongoDB Collections:
1. **`requisition_events`**: Append-only event log capturing real-time state changes for auditability.
2. **`demand`**: Unstocked and unmet student component requests, enabling department HoDs to analyze deficit patterns.
3. **`notifications`**: User-specific notification inbox documents with read/unread statuses.

### Aggregation Pipeline Examples:
* **Demand Aggregation:** Grouping by component name, calculating total requested units and occurrence counts, sorted in descending order (`$group`, `$sum`, `$sort`).

---

## 4. DCDS Rubric Cross-Reference
| DCDS Evaluation Criterion | Marks | LabTrack Implementation Artifact |
| :--- | :--- | :--- |
| **Criterion 1: Problem Definition & Data Model** | 2.0 | [`docs/architecture/LabTrack_SDD.md`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/architecture/LabTrack_SDD.md) & [`docs/database/DATA_DICTIONARY_AND_SCALING.md`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/docs/database/DATA_DICTIONARY_AND_SCALING.md) |
| **Criterion 2: Relational Implementation & Normalization** | 2.0 | [`database/mysql/schema.sql`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/database/mysql/schema.sql) (3NF/BCNF schemas, constraints, indexes) |
| **Criterion 3: NoSQL Database Implementation** | 2.0 | [`database/mongo/analytics.js`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/database/mongo/analytics.js) & MongoDB Atlas live cluster integration |
| **Criterion 4: Advanced Database Querying & Stored Procedures**| 2.0 | [`database/mysql/reporting.sql`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/database/mysql/reporting.sql) (`CALL labtrack_usage_by_lab()`) & multi-table JOINs |
| **Criterion 5: Application Integration & Viva Defense** | 2.0 | Dual-write transactional service layer in [`src/backend/labtrack/service.py`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/src/backend/labtrack/service.py) |
