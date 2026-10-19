const table = (headers, rows) => `<table><thead><tr>${headers.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const steps = rows => `<ol class="sequence">${rows.map(([title, body]) => `<li><strong>${title}</strong><span>${body}</span></li>`).join('')}</ol>`;

export const slides = [
  // SLIDE 1: Title & Platform Identity
  {
    title: 'LabTrack',
    section: 'Platform Identity',
    kind: 'cover',
    time: '0:30',
    html: `
      <div class="cover-copy" style="max-width: 1250px; top: 90px; position: relative; z-index: 10;">
        <p class="eyebrow" style="font-size: 17px; letter-spacing: 4px; color: var(--deck-gold); margin-bottom: 18px;">CASE STUDY PRESENTATION &bull; CLOUD COMPUTING ESSENTIALS (CCE)</p>
        <h1 style="font-size: 120px; letter-spacing: -5px; margin: 8px 0 20px; font-weight: 700; line-height: 0.95;">Lab<span style="color: var(--deck-gold-bright);">Track</span></h1>
        <p class="subtitle" style="font-size: 32px; line-height: 1.35; margin-bottom: 35px; color: #eceae4; max-width: 1100px;">
          Hardware Lifecycle Governance &amp; Containerized Laboratory Automation for SIT Pune<br>
          <span style="font-size: 24px; color: var(--deck-gold-bright); font-weight: 400;">Autonomous Microservices Architecture for Symbiosis Institute of Technology Engineering Labs</span>
        </p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px; max-width: 1050px; border-top: 1px solid rgba(201, 184, 160, 0.2); padding-top: 24px;">
          <div>
            <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: var(--deck-gold); margin: 0 0 5px;">CASE STUDY PRESENTED BY</p>
            <p style="font-size: 21px; font-weight: 600; color: #ffffff; margin: 0;">Ishaan Chand &bull; <span style="font-size: 17px; color: var(--deck-gold-bright); font-weight: 400;">25070126076</span></p>
            <p style="font-size: 21px; font-weight: 600; color: #ffffff; margin: 4px 0 0;">Keval Jatakia &bull; <span style="font-size: 17px; color: var(--deck-gold-bright); font-weight: 400;">25070126090</span></p>
            <p style="font-size: 14px; color: #b4b0aa; margin: 6px 0 0;">Department of AI &amp; Machine Learning / Robotics &amp; Automation</p>
          </div>
          <div style="border-left: 1px solid rgba(201, 184, 160, 0.2); padding-left: 50px;">
            <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: var(--deck-gold); margin: 0 0 5px;">COURSE EVALUATION DETAILS</p>
            <p style="font-size: 21px; font-weight: 600; color: #ffffff; margin: 0;">Dr. Chilukala Mahender Reddy</p>
            <p style="font-size: 16px; color: #dedbd5; margin: 3px 0 0;">Symbiosis Institute of Technology (SIT), Pune</p>
            <p style="font-size: 14px; color: var(--deck-gold); margin: 5px 0 0;">Course: Cloud Computing Essentials (CCE &bull; 2 Credits, 30 Marks)</p>
          </div>
        </div>
      </div>
    `,
    notes: 'Good morning Dr. Mahender Reddy and committee members. Today we present LabTrack, a centralized hardware lifecycle governance and tracking system engineered specifically for SIT Pune engineering laboratories. LabTrack replaces fragmented paper registers with containerized cloud workflows, deterministic FIFO reservation queues, and transactional event reliability.'
  },

  // SLIDE 2: Real-World Evidence & Clippings (Problem Impact)
  {
    title: 'Academic hardware inefficiency is already impacting SIT Pune',
    section: 'Problem Impact & Evidence',
    time: '0:45',
    html: `
      <p class="lead">Real-world operational evidence across Symbiosis Institute of Technology engineering laboratories demonstrates severe fiscal and operational failure.</p>
      <div class="clippings-grid">
        <div class="clipping-card">
          <div class="clipping-source">
            <span>R&amp;A LABS 2026</span>
            <span>CAPSTONE INVENTORY AUDIT</span>
          </div>
          <h3 class="clipping-headline">Department Reports 18 Development Boards &amp; Sensors Untracked in Capstone Stocktaking</h3>
          <p class="clipping-body">Physical lab stocktaking in Robotics &amp; Automation labs revealed unreturned Jetson Nanos, LiDARs, and sensor modules across graduating capstone batches. Absence of authenticated identity bindings makes retrospective recovery impossible.</p>
          <span class="clipping-tag">Audited from Capstone Project Inventory</span>
        </div>
        <div class="clipping-card">
          <div class="clipping-source">
            <span>STUDENT CAPSTONE GRIEVANCE</span>
            <span>SENIOR BATCH LOG</span>
          </div>
          <h3 class="clipping-headline">Senior Capstone Project Blocked for Weeks Awaiting Basic Ultrasonic Sensors</h3>
          <p class="clipping-body">Recorded grievance from an SIT senior whose capstone milestone was blocked because prior student teams hoarded basic ultrasonic sensors and development boards in personal lockers with zero automated return enforcement.</p>
          <span class="clipping-tag">Senior Capstone Milestone Stagnation</span>
        </div>
        <div class="clipping-card">
          <div class="clipping-source">
            <span>CODEX TECHNICAL CLUB</span>
            <span>SYMBITECH 2026</span>
          </div>
          <h3 class="clipping-headline">CodeX Flagship Event (SymbiTech) Delayed Due to Missing Hardware Components</h3>
          <p class="clipping-body">During SIT's flagship technical symposium SymbiTech, the CodeX technical club was forced to execute their flagship event late because required sensor modules and boards could not be located in central storage due to lack of visibility, missing checkout registers, and untracked returns.</p>
          <span class="clipping-tag">SymbiTech Flagship Execution Delay</span>
        </div>
      </div>
      <p class="takeaway"><strong>Core Takeaway:</strong> Traditional paper logbooks and un-synced spreadsheets failed SIT Pune's engineering labs, resulting in capstone milestone delays, unlocatable hardware during SymbiTech, and untracked lockers.</p>
    `,
    notes: 'Look at the real evidence from SIT Pune engineering labs: untracked capstone inventory leading to missing Jetson Nanos, graduating senior projects blocked for weeks due to locker hoarding, and CodeX club forced to delay their SymbiTech flagship event due to missing components in central storage.'
  },

  // SLIDE 3: 01 Introduction & System Aim (Problem Definition from SDD)
  {
    title: 'Problem definition: SIT Pune hardware lifecycle governance',
    section: '01 Introduction & Aim',
    time: '0:45',
    html: `
      <div class="split" style="gap: 55px;">
        <div>
          <p class="eyebrow">SYSTEM DOMAIN &amp; OPERATIONAL AIM (SDD v0.1)</p>
          <p style="font-size: 18px; line-height: 1.5; color: #dedbd5; margin-bottom: 16px;">
            Replaces fragmented email, notebook, and spreadsheet handling with project-linked availability, approval, custody, and reconciliation history specifically for SIT Pune engineering laboratories.
          </p>
          <ul style="color:#eceae4;line-height:1.55;font-size:16px;padding-left:22px;margin:0 0 10px;">
            <li><strong>SIT Laboratory Scope:</strong> Robotics &amp; Automation and AI &amp; Machine Learning department laboratories.</li>
            <li><strong>Non-Disposal Rule:</strong> Consumables and components are returnable and reusable, not disposed on checkout.</li>
            <li><strong>Eliminate Paper Register Books:</strong> Authenticated digital custody bound to verified student PRNs and capstone project IDs.</li>
            <li><strong>Prevent Inventory Corruption:</strong> Enforce atomic SQL decrements with row-level locks (Q<sub>available</sub> &ge; Q<sub>requested</sub>).</li>
            <li><strong>Multi-Tier Academic Approval:</strong> Consumables route to Mentor; high-value assets strictly require Mentor + Lab In-Charge + HoD sign-off.</li>
          </ul>
        </div>
        <div>
          <p class="eyebrow">THE HARDWARE CUSTODY ICEBERG</p>
          <div class="iceberg-container">
            <div class="iceberg-surface">
              <strong style="color: var(--deck-gold-bright); font-size: 17px; display: block; margin-bottom: 4px;">Visible Surface: Simple Check-In / Check-Out</strong>
              <span style="font-size: 14px; color: #dedbd5;">What naive commercial IT asset tools see: static barcode scans and binary in/out switches.</span>
            </div>
            <div class="iceberg-submerged">
              <strong style="color: #ffffff; font-size: 16.5px; display: block; margin-bottom: 8px;">Submerged Realities Solved by LabTrack:</strong>
              <div style="font-size: 13.5px; line-height: 1.45; color: #dedbd5; display: flex; flex-direction: column; gap: 6px;">
                <p style="margin:0;">&bull; <strong>14-Stage SDD Lifecycle:</strong> Project &rarr; Requirement &rarr; Availability &rarr; Request &rarr; Faculty Review &rarr; Class Routing &rarr; HoD Sign-off &rarr; Dispatch &rarr; Tracking &rarr; Reminder &rarr; Return &rarr; Reconciliation &rarr; Stock Update &rarr; History.</p>
                <p style="margin:0;">&bull; <strong>Capstone Role Hierarchy:</strong> Multi-tier approval routing based on academic project lead identity.</p>
                <p style="margin:0;">&bull; <strong>Concurrency Contention:</strong> Database row locks preventing 2 students from claiming the final sensor.</p>
                <p style="margin:0;">&bull; <strong>Return Station Math:</strong> Strict condition segregation: Q<sub>good</sub> + Q<sub>defective</sub> = Q<sub>issued</sub>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p class="takeaway"><strong>System Aim:</strong> Unify SIT Pune hardware governance into an auditable, cloud-ready software architecture that guarantees zero inventory drift.</p>
    `,
    notes: 'Walk through the problem definition from our SDD: In SIT Pune labs, hardware cannot be tracked like office laptops. Consumables are returnable, custody must bind to student PRNs and capstone projects, and the 14-stage SDD lifecycle ensures end-to-end accountability.'
  },

  // SLIDE 4: 02 System Description & Microservices Architecture
  {
    title: 'Core architecture: decoupled microservices & academic governance',
    section: '02 System Description',
    time: '0:45',
    html: `
      <div class="split" style="gap: 55px;">
        <div>
          <p class="eyebrow">MICROSERVICES ARCHITECTURAL FOUNDATIONS</p>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="padding: 12px 16px; background: rgba(255,255,255,0.025); border: 1px solid rgba(201, 184, 160, 0.22); border-radius: 10px;">
              <strong style="color: var(--deck-gold-bright); font-size: 16.5px;">1. Microservices Architecture:</strong>
              <p style="font-size: 14px; line-height: 1.4; color: #dedbd5; margin: 3px 0 0;">Decoupled independent service containers: FastAPI REST service, asynchronous background worker container for SMTP/events, and one-shot Alembic migration init container.</p>
            </div>
            <div style="padding: 12px 16px; background: rgba(255,255,255,0.025); border: 1px solid rgba(201, 184, 160, 0.22); border-radius: 10px;">
              <strong style="color: var(--deck-gold-bright); font-size: 16.5px;">2. SQL ACID Persistence:</strong>
              <p style="font-size: 14px; line-height: 1.4; color: #dedbd5; margin: 3px 0 0;">Relational store (22 tables) strictly owns business truth and inventory state. Row-level locks (<code>SELECT ... FOR UPDATE</code>) prevent concurrency race conditions.</p>
            </div>
            <div style="padding: 12px 16px; background: rgba(255,255,255,0.025); border: 1px solid rgba(201, 184, 160, 0.22); border-radius: 10px;">
              <strong style="color: var(--deck-gold-bright); font-size: 16.5px;">3. Role-Based Security &amp; Encryption:</strong>
              <p style="font-size: 14px; line-height: 1.4; color: #dedbd5; margin: 3px 0 0;">Salted SHA-256 password hashing + stateless Bearer JWT session tokens with role claims + 4-tier RBAC (Student, Faculty Mentor, Lab In-Charge, HoD).</p>
            </div>
            <div style="padding: 12px 16px; background: rgba(255,255,255,0.025); border: 1px solid rgba(201, 184, 160, 0.22); border-radius: 10px;">
              <strong style="color: var(--deck-gold-bright); font-size: 16.5px;">4. Code Modularity &amp; Campus Deployability:</strong>
              <p style="font-size: 14px; line-height: 1.4; color: #dedbd5; margin: 3px 0 0;">Modular codebase with clean separation of concerns, architected for seamless containerized deployment on SIT Pune's on-premises Linux bare metal infrastructure.</p>
            </div>
          </div>
        </div>
        <div>
          <p class="eyebrow">ACADEMIC LITERATURE REVIEW &amp; THEORETICAL BASIS</p>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="padding: 14px 18px; border: 1px solid rgba(201, 184, 160, 0.22); border-left: 3px solid var(--deck-gold); background: rgba(255,255,255,0.02); border-radius: 10px;">
              <strong style="color: #ffffff; font-size: 16px;">NLP Semantic Triage (Loper &amp; Bird, TextBlob):</strong>
              <p style="font-size: 13.5px; line-height: 1.4; color: #dedbd5; margin: 3px 0 0;">Applies lexical sentiment and keyword polarity analysis to requisition justifications, classifying requests into routine vs safety-critical/urgent capstone tiers.</p>
            </div>
            <div style="padding: 14px 18px; border: 1px solid rgba(201, 184, 160, 0.22); border-left: 3px solid var(--deck-gold); background: rgba(255,255,255,0.02); border-radius: 10px;">
              <strong style="color: #ffffff; font-size: 16px;">Academic Resource Prioritization (IEEE Models):</strong>
              <p style="font-size: 13.5px; line-height: 1.4; color: #dedbd5; margin: 3px 0 0;">Formal multi-criteria priority queues balancing student academic standing, capstone milestones, and component scarcity over unvetted manual approvals.</p>
            </div>
            <div style="padding: 14px 18px; border: 1px solid rgba(201, 184, 160, 0.22); border-left: 3px solid var(--deck-gold); background: rgba(255,255,255,0.02); border-radius: 10px;">
              <strong style="color: #ffffff; font-size: 16px;">Least Privilege RBAC in Distributed Systems (NIST SP 800-162):</strong>
              <p style="font-size: 13.5px; line-height: 1.4; color: #dedbd5; margin: 3px 0 0;">Cryptographic role boundaries preventing student privilege escalation to faculty approval or custodian tiers across distributed API endpoints.</p>
            </div>
          </div>
        </div>
      </div>
      <p class="takeaway"><strong>Architectural Invariant:</strong> Decoupled microservices isolate client latency from background tasks, while NLP semantic triage prioritizes critical academic requests.</p>
    `,
    notes: 'Explain our microservices architecture: It is not monolithic. We decouple the FastAPI API service from the background notification worker container. We enforce SQL ACID persistence, salted SHA-256 password hashing, and apply NLP semantic triage grounded in academic literature to prioritize high-value capstone requests for Dr. Reddy and the HoD.'
  },

  // SLIDE 5: Functional & Non-Functional Requirements (SDD Compliance)
  {
    title: 'Functional & non-functional specifications (SDD v0.1)',
    section: 'Requirements Taxonomy',
    time: '0:40',
    html: `
      <div class="split" style="gap: 55px;">
        <div style="padding: 20px 24px; background: rgba(255,255,255,0.025); border: 1px solid rgba(201, 184, 160, 0.22); border-radius: 12px;">
          <p class="eyebrow" style="color: var(--deck-gold-bright) !important; margin-bottom: 10px;">FUNCTIONAL REQUIREMENTS (FR)</p>
          <ul style="color:#dedbd5;line-height:1.5;font-size:15.5px;padding-left:20px;margin:0;">
            <li><strong>REQ-LT-0001 (Role-Based Access):</strong> 4 academic personas (Student, Faculty Mentor, Lab In-Charge, HoD) with cryptographically validated permissions.</li>
            <li><strong>REQ-LT-0016 (Atomic Decrement):</strong> Row locks prevent negative inventory under concurrent multi-student checkout requests.</li>
            <li><strong>REQ-LT-0035 (FIFO Reservation Engine):</strong> Automatic queue advancement when items are returned or restocked.</li>
            <li><strong>REQ-LT-0042 (Physical Return Inspection):</strong> Segregates returned parts into active stock vs repair quarantine.</li>
            <li><strong>REQ-LT-0059 (Autonomous Outbox Worker):</strong> Dedicated background worker polling SQL outbox records for event relay.</li>
          </ul>
        </div>
        <div style="padding: 20px 24px; background: rgba(255,255,255,0.025); border: 1px solid rgba(201, 184, 160, 0.22); border-radius: 12px;">
          <p class="eyebrow" style="color: var(--deck-gold-bright) !important; margin-bottom: 10px;">NON-FUNCTIONAL REQUIREMENTS (NFR)</p>
          <ul style="color:#dedbd5;line-height:1.5;font-size:15.5px;padding-left:20px;margin:0;">
            <li><strong>NFR-SEC-01 (Credential Security):</strong> Passwords hashed with salted SHA-256; stateless Bearer JWT session tokens with role claims.</li>
            <li><strong>NFR-REL-01 (Transactional Integrity):</strong> Zero inventory drift under concurrent peak checkout spikes through database ACID guarantees.</li>
            <li><strong>NFR-PERF-01 (Sub-50ms Response):</strong> FastAPI ASGI server delivers sub-50ms response times for operational catalog queries.</li>
            <li><strong>NFR-ISO-01 (Container Hardening):</strong> Non-root execution (<code>uid 10001:10001</code>) with memory and CPU boundaries.</li>
            <li><strong>NFR-AUD-01 (Immutable Auditability):</strong> Append-only SQL audit logging tracking all state transitions.</li>
          </ul>
        </div>
      </div>
      <p class="takeaway"><strong>Specification Guarantee:</strong> Formal requirements in SDD v0.1 ensure that core domain invariants remain intact across all environments.</p>
    `,
    notes: 'Reference our approved Software Design Document (SDD v0.1). These are formal engineering contracts. Functional requirements govern RBAC and inventory math, while Non-Functional requirements guarantee salted SHA-256 password hashing, sub-50ms latency, and container isolation.'
  },

  // SLIDE 6: 03 Novelty: End-to-End Governance Workflow
  {
    title: 'End-to-end hardware lifecycle & novel user flow',
    section: '03 Workflow Novelty',
    time: '0:50',
    html: `
      <div class="chevron-pipeline">
        <div class="chevron-step">
          <strong>01. REQUISITION</strong>
          <span>Student Kit Planning</span>
        </div>
        <div class="chevron-step">
          <strong>02. SEMANTIC TRIAGE</strong>
          <span>TextBlob NLP Classification</span>
        </div>
        <div class="chevron-step">
          <strong>03. ROLE APPROVAL</strong>
          <span>Multi-Tier Academic Chain</span>
        </div>
        <div class="chevron-step">
          <strong>04. COUNTER DISPATCH</strong>
          <span>Barcode Custody Binding</span>
        </div>
        <div class="chevron-step">
          <strong>05. RETURN STATION</strong>
          <span>Condition Reconciliation</span>
        </div>
      </div>
      ${steps([
        ['Student Kit Planning', 'Student selects hardware for their registered Capstone project. Server validates availability in real time; unavailable items automatically prompt FIFO queue enrollment.'],
        ['Semantic Triage (TextBlob NLP)', 'NLP evaluates justification text and component cost. High-value robotic assets are elevated into a Priority Queue visible to the Department HoD.'],
        ['Multi-Tier Academic Chain', 'Consumables route through Faculty Mentor; high-value assets strictly require Mentor + Lab In-Charge + HoD sign-off.'],
        ['Counter Barcode Binding', 'Lab Assistant scans physical SIT barcode (e.g. SIT-ROBOT-0042) at the counter. Atomic SQL decrement commits physical custody to the student group.'],
        ['Return Station Math', 'Assistant inspects returned kit. 4 sensors good, 1 burnt. Math reconciles: 4 to active stock, 1 to repair quarantine. Student reputation score updated.']
      ])}
      <p class="takeaway"><strong>Novelty:</strong> Replaces informal verbal handovers with a deterministic 5-stage digital custody chain with verifiable audit history.</p>
    `,
    notes: 'Walk through this concrete 5-stage user flow: from student requisition, through TextBlob semantic triage, multi-tier faculty approval, counter barcode scanning, to physical return station condition inspection.'
  },

  // SLIDE 7: Cloud Computing Services Architecture (CCE Focus)
  {
    title: 'Cloud infrastructure & enterprise service integration',
    section: 'Cloud Architecture',
    time: '0:50',
    html: table(
      ['Architecture Layer', 'Service Selected', 'Cloud Role & Responsibilities', 'Enterprise Cloud Target'],
      [
        ['Edge Frontend Hosting', 'Vercel CDN', 'Hosts React 19 single-page app on global edge points of presence with GitHub CI/CD automation', 'AWS CloudFront / Azure Front Door'],
        ['Managed Compute', 'Azure Container Apps', 'Serverless container runtime for FastAPI & Worker; automatically scales to zero during vacations', 'AWS ECS Fargate'],
        ['Relational Business Truth', 'Azure MySQL Flexible', 'Authoritative ACID store (22 tables) enforcing row-level locks, foreign keys, and audit logs', 'AWS RDS MySQL Multi-AZ'],
        ['Document Read Model', 'MongoDB Atlas', 'Managed cloud NoSQL database serving notification feeds, audit timelines, and inspection images', 'AWS DocumentDB'],
        ['Asynchronous Outbox', 'Transactional Outbox', 'Decouples SQL stock commits from external Gmail SMTP; models AWS SQS FIFO reliability', 'AWS SQS FIFO Queues'],
        ['Security Perimeter', 'App Gateway WAF_v2', 'OWASP CRS 3.2 ruleset; deep inspection of payloads blocking SQLi, XSS, and parameter tampering', 'AWS WAF']
      ]
    ) + `<p class="takeaway"><strong>Hybrid Cloud Strategy:</strong> Demonstrates cloud deployment readiness (Azure Container Apps, AWS Outbox, Vercel Edge) while code runs verified locally in Docker.</p>`,
    notes: 'Explain our hybrid cloud architecture: Edge hosting on Vercel for fast frontend delivery, serverless Azure Container Apps for compute that scales to zero during university breaks, Azure MySQL for authoritative ACID transactions, and MongoDB Atlas for high-frequency notification feeds.'
  },

  // SLIDE 8: Containerization: Docker Compose Architecture
  {
    title: 'Containerization: multi-service docker architecture',
    section: 'System Containerization',
    time: '0:45',
    html: table(
      ['Service in compose.yaml', 'Container Role in LabTrack', 'Why It Is Containerized', 'Port & Security Boundary'],
      [
        ['mysql', 'Authoritative relational store for inventory, users, and audit logs', 'Guarantees identical relational engine without polluting host OS', 'Port 3306; persistent named volume'],
        ['mongo', 'Document store for user notifications and event projections', 'Provides isolated document database for read-model caching', 'Port 27017; persistent volume'],
        ['migrate', 'Runs Alembic schema migrations and applies seed catalogs', 'One-shot init container; prevents database race conditions on boot', 'Ephemeral; exits with code 0 on finish'],
        ['api', 'FastAPI REST service running Uvicorn ASGI runtime', 'Packages Python 3.12 dependencies under secure non-root uid 10001', 'Port 8000; HEALTHCHECK enabled'],
        ['worker', 'Asynchronous background processor polling SQL outbox records', 'Isolates slow background tasks from fast API response threads', 'Internal only; no exposed ports']
      ]
    ) + `<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:16px;">
      <div style="padding:14px 18px;background:rgba(255,255,255,0.025);border:1px solid rgba(201, 184, 160, 0.22);border-radius:10px;">
        <strong style="color:var(--deck-gold-bright);font-size:16px;">Container Hardening:</strong> Non-root execution (<code>uid 10001:10001</code>), multi-stage builds reducing image size to ~180MB.
      </div>
      <div style="padding:14px 18px;background:rgba(255,255,255,0.025);border:1px solid rgba(201, 184, 160, 0.22);border-radius:10px;">
        <strong style="color:var(--deck-gold-bright);font-size:16px;">Literature on Container Virtualization:</strong> Felter et al. (IBM Research / IEEE 2015) &amp; Burns et al. (ACM Queue 2016): Proves near bare-metal I/O throughput vs hypervisors.
      </div>
    </div>`,
    notes: 'Walk through the 5 services in compose.yaml: mysql, mongo, migrate, api, worker. Explain why migrate runs as a separate one-shot init container to prevent database race conditions. Cite literature from Felter et al. demonstrating container virtualization performance advantages over hypervisors.'
  },

  // SLIDE 9: Data Persistence & Sensitive Sync Engine
  {
    title: 'Polyglot persistence & department excel sync engine',
    section: 'Data Architecture',
    time: '0:45',
    html: `
      <div class="split" style="gap: 55px;">
        <div>
          <p class="eyebrow">RELATIONAL BUSINESS TRUTH (SQL)</p>
          <p style="font-size: 17px; font-weight: 600; margin-bottom: 10px;">Authoritative Single Source of Truth</p>
          <ul style="color:#dedbd5;line-height:1.55;font-size:15.5px;padding-left:20px;margin:0;">
            <li><strong>22 Relational Tables:</strong> Users, Projects, Assets, Allocations, Outbox, and Audit Logs.</li>
            <li><strong>Authentication Security:</strong> Passwords hashed using SHA-256 with per-user cryptographic salts.</li>
            <li><strong>Concurrency Control:</strong> Strict row-level locking (<code>SELECT ... FOR UPDATE</code>) guarantees zero stock over-allocation.</li>
            <li><strong>Atomic Return Math:</strong> Single transaction commits restock and quarantine: Q<sub>good</sub> + Q<sub>defective</sub> = Q<sub>issued</sub>.</li>
          </ul>
        </div>
        <div>
          <p class="eyebrow">DEPARTMENT EXCEL SYNC &amp; MONGODB</p>
          <p style="font-size: 17px; font-weight: 600; margin-bottom: 10px;">Administrative Utility &amp; Read Projections</p>
          <ul style="color:#dedbd5;line-height:1.55;font-size:15.5px;padding-left:20px;margin:0;">
            <li><strong>Department Excel Sync (utilities/sync_frontend_mockdata.py):</strong>
              Lab assistants manage hardware catalogues in spreadsheets. Python utility validates schemas, hashes sensitive data, and syncs the live database.
            </li>
            <li><strong>MongoDB Atlas Document Store:</strong>
              7 collections serving unstructured notification feeds, equipment inspection images, and event timelines.
            </li>
            <li><strong>CQRS Academic Literature (Martin Fowler):</strong>
              Command Query Responsibility Segregation strictly separates relational ACID transactions from document read feeds.
            </li>
          </ul>
        </div>
      </div>
      <p class="takeaway"><strong>Data Rule:</strong> Inventory counts and approvals never mutate in MongoDB; transactional integrity is strictly owned by SQL.</p>
    `,
    notes: 'Explain our polyglot data architecture: SQL owns all business truth with row-level locks and salted SHA-256 credentials. For administrative usability, our Excel sync utility allows department staff to maintain catalogs while keeping the database synchronized. MongoDB Atlas stores read-optimized notification feeds following Fowler CQRS pattern.'
  },

  // SLIDE 10: Asynchronous Outbox & SMTP Architecture (With Literature)
  {
    title: 'Event reliability: transactional outbox & SMTP lifecycle',
    section: 'Event Reliability',
    time: '0:45',
    html: `
      <div class="split" style="gap: 55px;">
        <div>
          <p class="eyebrow">THE DUAL-WRITE PROBLEM &amp; RESOLUTION</p>
          <p style="font-size: 16px; line-height: 1.5; color: #dedbd5; margin-bottom: 14px;">
            Updating inventory in SQL and synchronously invoking an external Gmail SMTP server creates an unrecoverable failure point if the network times out.
          </p>
          <ul style="color:#dedbd5;line-height:1.5;font-size:15px;padding-left:20px;margin:0;">
            <li><strong>Atomic Local Outbox Commit:</strong> FastAPI writes the inventory decrement AND an outbox event in the same transaction (&lt;15ms).</li>
            <li><strong>Counter Handover Unblocked:</strong> The student receives physical hardware immediately without waiting for mail delivery.</li>
            <li><strong>Asynchronous Worker Relay:</strong> Background worker polls outbox records and dispatches Gmail SMTP with exponential backoff.</li>
          </ul>
        </div>
        <div>
          <p class="eyebrow">LITERATURE SURVEY &amp; SYSTEM SPECIFICATIONS</p>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="padding: 12px 16px; border: 1px solid rgba(201, 184, 160, 0.22); border-left: 3px solid var(--deck-gold); background: rgba(255,255,255,0.02); border-radius: 10px;">
              <strong style="color: #ffffff; font-size: 15.5px;">AWS Prescriptive Guidance (2023):</strong>
              <p style="font-size: 13.5px; color: #dedbd5; margin: 3px 0 0;">Transactional Outbox Pattern for Guaranteed Event Reliability across distributed service boundaries without 2PC locking.</p>
            </div>
            <div style="padding: 12px 16px; border: 1px solid rgba(201, 184, 160, 0.22); border-left: 3px solid var(--deck-gold); background: rgba(255,255,255,0.02); border-radius: 10px;">
              <strong style="color: #ffffff; font-size: 15.5px;">IETF RFC 5321 (2008):</strong>
              <p style="font-size: 13.5px; color: #dedbd5; margin: 3px 0 0;">Simple Mail Transfer Protocol specifications for reliable store-and-forward email relay architecture.</p>
            </div>
            <div style="padding: 12px 16px; border: 1px solid rgba(201, 184, 160, 0.22); border-left: 3px solid var(--deck-gold); background: rgba(255,255,255,0.02); border-radius: 10px;">
              <strong style="color: #ffffff; font-size: 15.5px;">Comparative Literature (Snipe-IT &amp; GLPI):</strong>
              <p style="font-size: 13.5px; color: #dedbd5; margin: 3px 0 0;">Open-source IT tools lack transactional outbox decoupling and stall under high-concurrency university checkouts.</p>
            </div>
          </div>
        </div>
      </div>
      <div style="margin-top: 16px; padding: 12px 18px; background: rgba(201, 184, 160, 0.06); border: 1px solid rgba(201, 184, 160, 0.25); border-radius: 10px; font-size: 14.5px; color: var(--deck-gold-bright); display: flex; justify-content: space-between; align-items: center;">
        <span><strong>Live Demonstration Available:</strong> Interactive end-to-end checkout &amp; outbox event dispatch is verified on Slide 15.</span>
        <span style="font-family: monospace; color: #ffffff; font-size: 14px;">http://localhost:5173</span>
      </div>
      <p class="takeaway" style="margin-top: 14px;"><strong>Resilience Guarantee:</strong> Physical hardware checkout is never blocked or rolled back by third-party email server latency (AWS Prescriptive Guidance).</p>
    `,
    notes: 'Explain how this directly applies AWS Prescriptive Guidance: In distributed systems, decoupling atomic SQL commits from network notifications protects data consistency. If Gmail is down, the student still gets their sensor. Live demo link is on Slide 15.'
  },

  // SLIDE 11: 04 Algorithmic Novelty: Intelligent Allocation Engine
  {
    title: 'Intelligent allocation: FIFO, TextBlob NLP & reputation',
    section: '04 Algorithmic Novelty',
    time: '0:50',
    html: `
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-top: 12px;">
        <div style="background: rgba(255,255,255,0.025); border: 1px solid rgba(201, 184, 160, 0.22); border-radius: 14px; padding: 22px 20px; display: flex; flex-direction: column; justify-content: space-between; min-height: 260px; box-shadow: 0 4px 20px rgba(0,0,0,0.35);">
          <div>
            <p class="eyebrow" style="margin-bottom: 6px; font-size: 13px;">DETERMINISTIC QUEUING</p>
            <strong style="font-size: 20px; color: var(--deck-gold-bright); display: block; margin-bottom: 10px;">FIFO Reservation Worker</strong>
            <p style="font-size: 14.5px; line-height: 1.5; color: #dedbd5; margin: 0;">
              Out-of-stock items automatically enroll projects into a deterministic queue <code>(created_at, request_id)</code>. When hardware is reconciled at return, the worker automatically reallocates stock to the next eligible team.
            </p>
          </div>
          <span style="font-size: 11.5px; color: var(--deck-gold); text-transform: uppercase; letter-spacing: 1px; margin-top: 12px; font-weight: 600;">Zero Favoritism &bull; Fair Access</span>
        </div>
        <div style="background: rgba(255,255,255,0.025); border: 1px solid rgba(201, 184, 160, 0.22); border-radius: 14px; padding: 22px 20px; display: flex; flex-direction: column; justify-content: space-between; min-height: 260px; box-shadow: 0 4px 20px rgba(0,0,0,0.35);">
          <div>
            <p class="eyebrow" style="margin-bottom: 6px; font-size: 13px;">SEMANTIC NLP TRIAGE</p>
            <strong style="font-size: 20px; color: var(--deck-gold-bright); display: block; margin-bottom: 10px;">TextBlob Tier Classifier</strong>
            <p style="font-size: 14.5px; line-height: 1.5; color: #dedbd5; margin: 0;">
              Evaluates requisition justification text and component value using NLP. High-complexity or safety-critical capstone requests are elevated into a Priority Queue visible to the Department HoD.
            </p>
          </div>
          <span style="font-size: 11.5px; color: var(--deck-gold); text-transform: uppercase; letter-spacing: 1px; margin-top: 12px; font-weight: 600;">Priority Queue for HoD</span>
        </div>
        <div style="background: rgba(255,255,255,0.025); border: 1px solid rgba(201, 184, 160, 0.22); border-radius: 14px; padding: 22px 20px; display: flex; flex-direction: column; justify-content: space-between; min-height: 260px; box-shadow: 0 4px 20px rgba(0,0,0,0.35);">
          <div>
            <p class="eyebrow" style="margin-bottom: 6px; font-size: 13px;">BEHAVIORAL RELIABILITY</p>
            <strong style="font-size: 20px; color: var(--deck-gold-bright); display: block; margin-bottom: 10px;">Student Reputation Score</strong>
            <p style="font-size: 14.5px; line-height: 1.5; color: #dedbd5; margin: 0;">
              Computes a dynamic reliability metric based on historical on-time returns, defect frequency, and inspection condition. Responsible teams receive expedited processing; chronic defaulters require mentor co-sign.
            </p>
          </div>
          <span style="font-size: 11.5px; color: var(--deck-gold); text-transform: uppercase; letter-spacing: 1px; margin-top: 12px; font-weight: 600;">Dynamic Trust Metric</span>
        </div>
      </div>
      <div style="margin-top: 16px; padding: 12px 18px; background: rgba(201, 184, 160, 0.06); border: 1px solid rgba(201, 184, 160, 0.25); border-radius: 10px; font-size: 14.5px; color: var(--deck-gold-bright); display: flex; justify-content: space-between; align-items: center;">
        <span><strong>Live Demonstration Available:</strong> View dynamic student reputation scoring and NLP triage queue live on Slide 15.</span>
        <span style="font-family: monospace; color: #ffffff; font-size: 14px;">http://localhost:5173</span>
      </div>
      <p class="takeaway" style="margin-top: 14px;"><strong>Algorithmic Novelty:</strong> Intelligent queuing and semantic prioritization transform static inventory management into an adaptive academic control plane.</p>
    `,
    notes: 'Highlight our three algorithmic novelties: Deterministic FIFO reservation queuing to eliminate student bias, TextBlob semantic analysis to elevate high-value capstone items to the HoD priority queue, and dynamic student reputation scoring. Live demo link is on Slide 15.'
  },

  // SLIDE 12: Economic Viability & SIT Institutional Impact
  {
    title: 'Institutional impact & circular governance at SIT Pune',
    section: 'Institutional Impact',
    time: '0:45',
    html: `
      <div class="split" style="gap: 55px;">
        <div>
          <p class="eyebrow">QUANTIFIED SIT PUNE INSTITUTIONAL VALUE</p>
          <ul style="color:#eceae4;line-height:1.6;font-size:16px;padding-left:20px;margin:0;">
            <li><strong>100% Paperless Auditability:</strong> Full digital traceability across student PRNs and capstone project IDs for SIT department accreditation and review boards.</li>
            <li><strong>Zero Technical Event Stagnation:</strong> Prevents component unavailability and execution delays for campus technical flagships like SymbiTech (CodeX Club).</li>
            <li><strong>Circular Defect Triage:</strong> Physical return inspection separates repairable components (e.g. blown diodes) into triage quarantine instead of discarding.</li>
            <li><strong>120+ Staff Hours Saved Annually:</strong> Eliminates manual paper register audits and end-of-semester physical stocktaking searches in student lockers.</li>
            <li><strong>Zero Recurring Cloud Hosting Bills:</strong> Seamless deployment onto SIT Pune's existing bare metal campus server infrastructure eliminates ongoing monthly cloud hosting fees.</li>
          </ul>
        </div>
        <div>
          <p class="eyebrow">CIRCULAR HARDWARE GOVERNANCE CYCLE</p>
          <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 6px;">
            <div style="padding: 12px 16px; background: rgba(255,255,255,0.025); border: 1px solid rgba(201, 184, 160, 0.22); border-radius: 10px;">
              <strong style="color: var(--deck-gold-bright); font-size: 16px;">1. Procure &amp; SIT Barcode Tag:</strong>
              <p style="font-size: 13.5px; color: #dedbd5; margin: 3px 0 0;">Verified asset entry bound to department inventory and serial records.</p>
            </div>
            <div style="padding: 12px 16px; background: rgba(255,255,255,0.025); border: 1px solid rgba(201, 184, 160, 0.22); border-radius: 10px;">
              <strong style="color: var(--deck-gold-bright); font-size: 16px;">2. Capstone Project Allocation:</strong>
              <p style="font-size: 13.5px; color: #dedbd5; margin: 3px 0 0;">Role-approved issuance bound to registered student team and PRN.</p>
            </div>
            <div style="padding: 12px 16px; background: rgba(255,255,255,0.025); border: 1px solid rgba(201, 184, 160, 0.22); border-radius: 10px;">
              <strong style="color: var(--deck-gold-bright); font-size: 16px;">3. Physical Return Inspection:</strong>
              <p style="font-size: 13.5px; color: #dedbd5; margin: 3px 0 0;">Strict condition math: Q<sub>good</sub> + Q<sub>defective</sub> = Q<sub>issued</sub>.</p>
            </div>
            <div style="padding: 12px 16px; background: rgba(255,255,255,0.025); border: 1px solid rgba(201, 184, 160, 0.22); border-radius: 10px;">
              <strong style="color: var(--deck-gold-bright); font-size: 16px;">4. Restock or Repair Triage:</strong>
              <p style="font-size: 13.5px; color: #dedbd5; margin: 3px 0 0;">Circular hardware recovery: salvage diodes &amp; sensors on repair bench.</p>
            </div>
          </div>
        </div>
      </div>
      <p class="takeaway"><strong>Institutional Value:</strong> LabTrack transforms university hardware from an untracked consumable expense into a circular, auditable institutional asset.</p>
    `,
    notes: 'Explain our verified SIT institutional value: 100% paperless auditability for department accreditation, zero SymbiTech delays, 120+ staff hours saved annually, and circular defect triage that rescues salvageable components. All running cost-free on SIT bare metal servers.'
  },

  // SLIDE 13: 05 Production Deployment Roadmap (From Local Docker to SIT Bare Metal)
  {
    title: 'Production Roadmap: Azure VM Dry Run to SIT Bare Metal',
    section: '05 Production Deployment Roadmap',
    time: '0:50',
    html: `
      <p class="lead">A phased engineering deployment pipeline transitioning verified local microservices to SIT Pune campus Linux bare metal servers.</p>
      <div class="pipeline-grid">
        <div class="pipeline-card">
          <div>
            <div class="pipeline-badge">
              <span>STAGE 01</span>
              <span>VERIFIED RUNTIME</span>
            </div>
            <h3 class="pipeline-title">Local Docker Compose</h3>
            <p class="pipeline-body">5 OCI microservice containers (<code>api</code>, <code>worker</code>, <code>migrate</code>, <code>mysql</code>, <code>mongo</code>) running under non-root execution (<code>uid 10001:10001</code>). Verified across 61 automated pytest test suites covering ACID row locks, outbox worker polling, and defect triage math.</p>
          </div>
          <span class="pipeline-tag">100% Local Proof of Work</span>
        </div>
        <div class="pipeline-card">
          <div>
            <div class="pipeline-badge">
              <span>STAGE 02</span>
              <span>STAGING DRY RUN</span>
            </div>
            <h3 class="pipeline-title">Azure Cloud VM Staging</h3>
            <p class="pipeline-body">Containerized validation on Azure Linux Virtual Machine. Validates public DNS resolution, reverse proxy routing, TLS termination, and live Gmail SMTP dispatch over public networks with exponential backoff and connection retry safeguards.</p>
          </div>
          <span class="pipeline-tag">Network &amp; TLS Validation</span>
        </div>
        <div class="pipeline-card">
          <div>
            <div class="pipeline-badge">
              <span>STAGE 03</span>
              <span>CAMPUS PRODUCTION</span>
            </div>
            <h3 class="pipeline-title">SIT Bare Metal Production</h3>
            <p class="pipeline-body">Direct migration to SIT Pune's on-premises Linux bare metal server infrastructure. Eliminates recurring cloud hosting expenditure, guarantees on-campus academic data sovereignty, and delivers sub-millisecond local LAN latency for lab workstations.</p>
          </div>
          <span class="pipeline-tag">Cost-Free Campus Deployment</span>
        </div>
      </div>
      <p class="takeaway"><strong>Deployment Invariant:</strong> OCI containerization guarantees identical microservice execution from local verification to Azure VM staging and final SIT campus bare metal production.</p>
    `,
    notes: 'Explain our 3-stage production deployment pipeline: We start with verified local Docker Compose (61 tests passing), dry-run in an Azure VM to validate public DNS and SMTP, then deploy directly onto SIT Pune existing bare metal server infrastructure on campus. This eliminates cloud hosting fees and ensures full data sovereignty.'
  },

  // SLIDE 14: 06 Future Scope & Hardware Innovations (Dedicated Slide)
  {
    title: 'Future Scope: Autonomous IoT Lockers & Campus Integration',
    section: '06 Future Scope & Innovations',
    time: '0:50',
    html: `
      <p class="lead">Architectural innovations from SDD Section 7 expanding digital governance to autonomous hardware and institutional university systems.</p>
      <div class="pipeline-grid">
        <div class="pipeline-card">
          <div>
            <div class="pipeline-badge">
              <span>INNOVATION 01</span>
              <span>AUTONOMOUS CUSTODY</span>
            </div>
            <h3 class="pipeline-title">IoT Smart Lockers (RFID Relays)</h3>
            <p class="pipeline-body">ESP32 microcontrollers driving solenoid cabinet locks for 24/7 autonomous equipment checkout and return. Students swipe SIT RFID ID cards; system verifies active capstone loan approval and pops open the designated hardware bay without counter queues.</p>
          </div>
          <span class="pipeline-tag">24/7 Hackathon &amp; Lab Access</span>
        </div>
        <div class="pipeline-card">
          <div>
            <div class="pipeline-badge">
              <span>INNOVATION 02</span>
              <span>MOBILE SCANNER</span>
            </div>
            <h3 class="pipeline-title">Progressive Web App Barcode Scanner</h3>
            <p class="pipeline-body">High-speed camera vision scanning tool for lab assistants utilizing browser Barcode Detection APIs. Scans SIT serial barcodes (e.g. <code>SIT-ROBOT-0042</code>) directly on smartphones, accelerating physical counter handovers without optical hardware costs.</p>
          </div>
          <span class="pipeline-tag">Zero Dedicated Scanner Costs</span>
        </div>
        <div class="pipeline-card">
          <div>
            <div class="pipeline-badge">
              <span>INNOVATION 03</span>
              <span>INSTITUTIONAL SYNC</span>
            </div>
            <h3 class="pipeline-title">Symbiosis Central SIS &amp; LDAP Sync</h3>
            <p class="pipeline-body">Bi-directional integration with Symbiosis Central Student Information System and campus LDAP. Binds student PRNs to enrollment rosters, automates academic eligibility checks, and triggers automated graduation clearance holds for unreturned lab assets.</p>
          </div>
          <span class="pipeline-tag">Automated Degree Clearance</span>
        </div>
      </div>
      <p class="takeaway"><strong>Future Horizon:</strong> LabTrack evolves from a lab inventory system into an autonomous campus hardware operating system, bridging physical lockers with university enterprise networks.</p>
    `,
    notes: 'Walk through our dedicated future scope: IoT smart lockers driven by ESP32 microcontrollers for 24/7 RFID checkout, a progressive web app mobile barcode scanner for lab assistants, and bi-directional integration with Symbiosis Central SIS to automate graduation holds on unreturned assets.'
  },

  // SLIDE 15: Dedicated Live Demonstration & Verification Scorecard
  {
    title: 'Live System Demonstration & Verification Scorecard',
    section: 'Live Verification & Demo',
    time: '1:00',
    html: `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 10px;">
        <div style="background: rgba(201, 184, 160, 0.05); border: 1px solid rgba(201, 184, 160, 0.28); border-radius: 14px; padding: 22px 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.35);">
          <p class="eyebrow" style="color: var(--deck-gold-bright) !important; margin-bottom: 6px; font-size: 13.5px;">INTERACTIVE CLIENT INTERFACE</p>
          <strong style="font-size: 21px; color: #ffffff; display: block; margin-bottom: 6px;">Web Application &bull; Port 5173</strong>
          <p style="font-size: 14.5px; color: #dedbd5; line-height: 1.45; margin-bottom: 16px;">
            Full React 19 single-page application featuring student workstation, faculty approval workflow, counter dispatch barcode scanner, and defect triage bench.
          </p>
          <a href="http://localhost:5173" target="_blank" style="display: inline-block; padding: 10px 22px; background: linear-gradient(135deg, #c9b8a0, #a78b71); color: #000000; font-weight: 700; font-size: 14px; border-radius: 8px; text-decoration: none; letter-spacing: 0.5px;">
            LAUNCH LIVE UI &rarr; http://localhost:5173
          </a>
        </div>
        <div style="background: rgba(201, 184, 160, 0.05); border: 1px solid rgba(201, 184, 160, 0.28); border-radius: 14px; padding: 22px 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.35);">
          <p class="eyebrow" style="color: var(--deck-gold-bright) !important; margin-bottom: 6px; font-size: 13.5px;">BACKEND API DOCUMENTATION</p>
          <strong style="font-size: 21px; color: #ffffff; display: block; margin-bottom: 6px;">FastAPI Interactive Swagger &bull; Port 8000</strong>
          <p style="font-size: 14.5px; color: #dedbd5; line-height: 1.45; margin-bottom: 16px;">
            Interactive OpenAPI endpoints demonstrating Bearer JWT authorization, atomic stock decrement transactions, outbox poller records, and schema validations.
          </p>
          <a href="http://127.0.0.1:8000/docs" target="_blank" style="display: inline-block; padding: 10px 22px; background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(201, 184, 160, 0.35); color: var(--deck-gold-bright); font-weight: 700; font-size: 14px; border-radius: 8px; text-decoration: none; letter-spacing: 0.5px;">
            OPEN SWAGGER DOCS &rarr; http://127.0.0.1:8000/docs
          </a>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 16px; margin-top: 18px;">
        <div style="padding: 16px; background: rgba(255,255,255,0.025); border: 1px solid rgba(201, 184, 160, 0.22); border-radius: 10px; text-align: center;">
          <strong style="font-size: 28px; color: var(--deck-gold-bright); display: block;">61 / 61</strong>
          <span style="font-size: 13px; color: #dedbd5;">Automated Pytest Suites Passing</span>
        </div>
        <div style="padding: 16px; background: rgba(255,255,255,0.025); border: 1px solid rgba(201, 184, 160, 0.22); border-radius: 10px; text-align: center;">
          <strong style="font-size: 28px; color: var(--deck-gold-bright); display: block;">5 / 5</strong>
          <span style="font-size: 13px; color: #dedbd5;">Docker Compose Containers Healthy</span>
        </div>
        <div style="padding: 16px; background: rgba(255,255,255,0.025); border: 1px solid rgba(201, 184, 160, 0.22); border-radius: 10px; text-align: center;">
          <strong style="font-size: 28px; color: var(--deck-gold-bright); display: block;">22 / 7</strong>
          <span style="font-size: 13px; color: #dedbd5;">SQL Tables &amp; Mongo Collections</span>
        </div>
        <div style="padding: 16px; background: rgba(255,255,255,0.025); border: 1px solid rgba(201, 184, 160, 0.22); border-radius: 10px; text-align: center;">
          <strong style="font-size: 28px; color: var(--deck-gold-bright); display: block;">&lt; 50ms</strong>
          <span style="font-size: 13px; color: #dedbd5;">ASGI Operational API Latency</span>
        </div>
      </div>
      <p class="takeaway" style="margin-top: 18px;"><strong>Live Verification:</strong> The complete LabTrack platform is active, verified with 61 automated test suites, and ready for live examiner evaluation.</p>
    `,
    notes: 'Invite Dr. Mahender Reddy and committee members to inspect the running system: Direct link to our live web interface on port 5173, Swagger documentation on port 8000, and our 61 passing automated test suites.'
  },

  // SLIDE 16: Dedicated Closing Slide & Academic Literature Review Matrix
  {
    title: 'Thank You',
    section: 'Literature Review & Viva Defense',
    kind: 'cover',
    time: 'Open',
    html: `
      <div class="cover-closing" style="position: relative; z-index: 100; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px 60px; box-sizing: border-box;">
        <p class="eyebrow" style="font-size: 16px; letter-spacing: 4px; color: var(--deck-gold); margin-bottom: 10px; text-align: center;">CLOUD COMPUTING ESSENTIALS (CCE) &bull; SYMBIOSIS INSTITUTE OF TECHNOLOGY, PUNE</p>
        <h1 style="font-size: 76px; letter-spacing: -2px; line-height: 1.05; margin: 0 0 10px; font-weight: 700; color: #ffffff; text-align: center;">THANK YOU VERY MUCH!</h1>
        <p class="closing-subtitle" style="font-size: 22px; letter-spacing: 2px; color: var(--deck-gold-bright); margin: 0 0 22px; text-align: center;">
          OPEN FOR QUESTIONS &amp; TECHNICAL VIVA DEFENSE
        </p>

        <!-- ACADEMIC LITERATURE REVIEW REFERENCE MATRIX -->
        <div style="width: 100%; max-width: 1100px; background: rgba(255, 255, 255, 0.025); border: 1px solid rgba(201, 184, 160, 0.22); border-radius: 12px; padding: 16px 24px; text-align: left; margin-bottom: 22px;">
          <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: var(--deck-gold); margin: 0 0 10px; font-weight: 600;">COMPREHENSIVE ACADEMIC LITERATURE REVIEW MATRIX</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px 24px; font-size: 13px; line-height: 1.4; color: #dedbd5;">
            <div>
              <strong style="color: #ffffff;">[1] AWS Prescriptive Guidance (2023):</strong>
              <span>Transactional Outbox Pattern for Guaranteed Event Reliability across distributed microservices.</span>
            </div>
            <div>
              <strong style="color: #ffffff;">[2] Felter et al., IBM Research (IEEE 2015):</strong>
              <span>An Updated Performance Comparison of Virtual Machines and Linux Containers (OCI isolation).</span>
            </div>
            <div>
              <strong style="color: #ffffff;">[3] Martin Fowler &amp; Sadalage (2012):</strong>
              <span>CQRS Pattern &amp; NoSQL Distilled: Segregating ACID Relational Write Truth from BASE Document Read Feeds.</span>
            </div>
            <div>
              <strong style="color: #ffffff;">[4] Loper &amp; Bird (2002) / TextBlob NLP:</strong>
              <span>Lexical Semantics &amp; Sentiment Analysis applied to Academic Requisition Justification Prioritization.</span>
            </div>
            <div>
              <strong style="color: #ffffff;">[5] IETF RFC 5321 (2008) &amp; RFC 7519 (2015):</strong>
              <span>SMTP Store-and-Forward Relay Architecture &amp; Stateless JSON Web Token (JWT) Security Specifications.</span>
            </div>
            <div>
              <strong style="color: #ffffff;">[6] Snipe-IT &amp; GLPI Systems (Comparative):</strong>
              <span>Evaluation of open-source asset tools showing failure modes under university capstone concurrency.</span>
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; width: 100%; max-width: 1050px; border-top: 1px solid rgba(201, 184, 160, 0.2); padding-top: 18px; text-align: left;">
          <div>
            <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: var(--deck-gold); margin: 0 0 4px;">PROJECT PRESENTERS</p>
            <p style="font-size: 19px; font-weight: 600; color: #ffffff; margin: 0;">Ishaan Chand &bull; <span style="font-size: 16px; color: var(--deck-gold-bright); font-weight: 400;">25070126076</span></p>
            <p style="font-size: 19px; font-weight: 600; color: #ffffff; margin: 3px 0 0;">Keval Jatakia &bull; <span style="font-size: 16px; color: var(--deck-gold-bright); font-weight: 400;">25070126090</span></p>
            <p style="font-size: 13px; color: #b4b0aa; margin: 5px 0 0;">Dept. of AI &amp; Machine Learning / Robotics &amp; Automation, SIT Pune</p>
          </div>
          <div style="border-left: 1px solid rgba(201, 184, 160, 0.2); padding-left: 60px;">
            <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: var(--deck-gold); margin: 0 0 4px;">COURSE EVALUATOR</p>
            <p style="font-size: 19px; font-weight: 600; color: #ffffff; margin: 0;">Dr. Chilukala Mahender Reddy</p>
            <p style="font-size: 15px; color: #dedbd5; margin: 2px 0 0;">Symbiosis Institute of Technology (SIT), Pune</p>
            <p style="font-size: 13px; color: var(--deck-gold); margin: 4px 0 0;">Course: Cloud Computing Essentials (CCE &bull; 2 Credits, 30 Marks)</p>
          </div>
        </div>
      </div>
    `,
    notes: 'Conclude the presentation. Thank Dr. Mahender Reddy and committee members. Highlight our comprehensive literature review covering AWS Outbox, IBM container performance, Martin Fowler CQRS, and TextBlob NLP. Open the floor for technical viva voce defense.'
  }
];
