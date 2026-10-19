import hero from '../../../public/labtrack_microcontroller.jpg';
import sensor from '../../../public/images/hardware/hcsr04-ultrasonic.jpg';
import arm from '../../../public/images/hardware/robotic-arm.jpg';

const table = (headers, rows) => `<table><thead><tr>${headers.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const steps = rows => `<ol class="sequence">${rows.map(([title, body]) => `<li><strong>${title}</strong><span>${body}</span></li>`).join('')}</ol>`;

const bVerified = '<span class="integrity-badge badge-verified">[VERIFIED]</span>';
const bLocal = '<span class="integrity-badge badge-local">[LOCAL]</span>';
const bRepo = '<span class="integrity-badge badge-repo">[REPOSITORY-CONFIGURED]</span>';
const bTarget = '<span class="integrity-badge badge-target">[TARGET CLOUD]</span>';
const bSim = '<span class="integrity-badge badge-simulated">[SIMULATED SCENARIO]</span>';
const bTheory = '<span class="integrity-badge badge-theory">[ACADEMIC THEORY]</span>';

export const slides = [
  // SLIDE 1: Cover
  {
    title: `LabTrack ${bLocal} ${bTarget}`,
    section: 'Cloud Computing Essentials',
    kind: 'cover',
    time: '0:30',
    html: `
      <div class="cover-copy">
        <p class="eyebrow">CCE IMPLEMENTATION DEMONSTRATION</p>
        <h1>Lab<span>Track</span></h1>
        <p class="subtitle">Campus Laboratory Hardware Requisition &amp;<br>Cloud Deployment Architecture</p>
        <p class="small">Symbiosis Institute of Technology, Pune • Dept. of AI &amp; ML<br>Course: CCE • Evaluator: Dr. Chilukala Mahender Reddy</p>
      </div>
      <img class="cover-image" src="${hero}" alt="Microcontroller hardware">
      <div class="cover-label">Verified Local Runtime (:5173, :8000) • Proposed Target: Azure Container Apps</div>
    `,
    notes: '[LOCAL / TARGET CLOUD] Pitch: Good morning Dr. Mahender Reddy. LabTrack is a campus hardware requisition and custody platform built for university labs. We track physical boards, microcontrollers, and sensors through student requests, faculty approvals, and physical return inspections. Today we show our verified local system (React 19 on :5173, FastAPI on :8000 with 22 SQLite tables, MongoDB Atlas, and Gmail SMTP) alongside our target cloud architecture on Azure Container Apps, mapped directly to CCE Units 1-4.'
  },

  // SLIDE 2: Problem Context
  {
    title: `The Problem: Why Campus Labs Lose Hardware ${bTheory}`,
    section: '01 / Campus Problem',
    time: '0:45',
    html: `
      <p class="lead">University engineering labs struggle to track physical hardware custody, leading to stock discrepancies and unrecorded damage.</p>
      ${steps([
        ['Consumable Stock vs Assets', 'Bulk parts (HC-SR04 ultrasonic sensors, jumper wires) are tracked by count per lab. Expensive serialized items (Jetson Nano, robotic arms) require individual SIT barcodes.'],
        ['Academic Approval Authority', 'A student cannot self-issue equipment. Requisitions must route through academic roles: Consumables need Mentor + HoD; Serialized Assets strictly need Mentor + Lab In-Charge + HoD.'],
        ['Return Inspection Math', 'When equipment returns from a project, damaged parts must not vanish silently into stock. Staff must balance: Q_good + Q_defective = Q_issued.']
      ])}
      <div class="takeaway"><strong>Core Question:</strong> Can a university track, approve, dispatch, and inspect hardware without inventory corruption?</div>
    `,
    notes: '[ACADEMIC THEORY] Keep it grounded in SIT Pune lab reality: ultrasonic sensors vs a Jetson Nano or robotic arm. Explain why generic IT asset software fails in universities: it lacks student capstone projects, faculty mentor approvals, and return station condition inspection.'
  },

  // SLIDE 3: The LabTrack Hardware Journey
  {
    title: `The LabTrack Solution: A Real Hardware Journey ${bLocal}`,
    section: '01 / User Workflow',
    time: '0:45',
    html: `
      <div class="lifecycle">
        <p><b>01</b> <strong>Student Requests:</strong> Student creates a project kit requisition (e.g. 5x HC-SR04 sensors, 1x Jetson Nano) bound to their Capstone mentor.</p>
        <p><b>02</b> <strong>Role Approval:</strong> Faculty Mentor reviews and approves; Lab In-Charge signs off on high-value asset allocation.</p>
        <p><b>03</b> <strong>Counter Dispatch:</strong> Lab Assistant scans SIT barcode (<code>SIT-ROBOT-0042</code>) and physically hands over equipment.</p>
        <p><b>04</b> <strong>Return Station:</strong> Assistant inspects returned kit. 4 sensors good, 1 burnt. Math reconciles: 4 to active stock, 1 to repair quarantine.</p>
      </div>
      <div class="takeaway"><strong>System Novelty:</strong> Replaces informal paper register books with an auditable, role-governed digital custody chain.</div>
    `,
    notes: '[LOCAL] Walk through this concrete story: A student requests parts for their AI project, the mentor approves, the lab assistant scans the barcode at the counter, and upon return, burnt sensors are quarantined without corrupting total inventory.'
  },

  // SLIDE 4: Why Cloud Computing for University Labs?
  {
    title: `Why Cloud Computing for University Labs? ${bTheory} ${bTarget}`,
    section: '02 / CCE Unit 1',
    time: '0:40',
    html: table(
      ['Campus Laboratory Challenge', 'Traditional Lab PC Limitation', 'Cloud Computing Architectural Solution'],
      [
        ['Semester Peak Surges', 'Lab PCs crash during capstone submission week when 500 students request kits', `Elastic horizontal scaling (Azure Container Apps autoscale) ${bTarget}`],
        ['Cross-Department Labs', 'AI/ML, Robotics, and E&TC labs have isolated, unshared paper registers', `Centralized Virtual Network (VNet) with shared relational inventory ${bTarget}`],
        ['Hardware Damage Evidence', 'Local hard drive fills up from high-resolution return damage photos', `Durable cloud object storage (Azure Blob Storage) with SAS access ${bTarget}`],
        ['System Availability', 'Power outage on one lab PC halts all equipment checkout', `Managed high-availability database with zone-redundant failover ${bTarget}`]
      ]
    ) + `<div class="takeaway">Cloud computing transitions LabTrack from an isolated lab desktop script into a resilient, department-wide university platform.</div>`,
    notes: '[ACADEMIC THEORY / TARGET CLOUD] Viva question: Why does a college lab need the cloud? Answer: University hardware requisitions are highly cyclical—submission weeks cause huge traffic spikes. The cloud provides rapid elasticity and centralized multi-lab inventory sharing.'
  },

  // SLIDE 5: Cloud Service Models: Why PaaS Fits Campus Budgets
  {
    title: `IaaS vs PaaS: Why Container Apps Fits Campus Budgets ${bTheory} ${bTarget}`,
    section: '02 / CCE Unit 1',
    time: '0:45',
    html: table(
      ['Service Model', 'Campus Operational Reality', 'LabTrack Decision'],
      [
        ['IaaS (Infrastructure as a Service)', 'Requires college technicians to manually patch Linux OS, configure firewalls, and pay for idle VMs 24/7 even during vacations.', 'REJECTED: Unnecessary sysadmin burden and wasted budget during summer breaks.'],
        ['PaaS (Platform as a Service)', 'Cloud provider manages OS patching and scaling; application runs in serverless containers that scale to zero when labs are closed.', `SELECTED TARGET: Azure Container Apps + Azure DB for MySQL Flexible Server ${bTarget}`],
        ['SaaS (Software as a Service)', 'Off-the-shelf third-party utility services integrated over standard APIs.', `EXTERNAL INTEGRATIONS: Gmail SMTP for notifications, MongoDB Atlas for read projections ${bVerified}`]
      ]
    ) + `<div class="takeaway">PaaS eliminates operating system maintenance while serverless container scaling ensures zero compute cost during university vacations.</div>`,
    notes: '[ACADEMIC THEORY / TARGET CLOUD] Examiner favorite: Why not just spin up an Azure VM (IaaS)? Answer: An EC2 or Azure VM bills 24/7 even when labs are empty at 2 AM or during semester breaks. PaaS container apps scale to zero, saving university money.'
  },

  // SLIDE 6: Packaging LabTrack with Docker
  {
    title: `Packaging LabTrack with Docker ${bRepo}`,
    section: '03 / CCE Unit 2',
    time: '0:50',
    html: table(
      ['Container / Service', 'What It Does in LabTrack', 'Why It Is Containerized', 'Target Cloud Equivalent'],
      [
        ['mysql', 'Stores authoritative inventory counts, users, and audit logs', 'Runs identical MySQL engine locally without host installation', `Azure Database for MySQL Flexible Server ${bTarget}`],
        ['mongo', 'Stores read-model projections for notification feeds', 'Provides isolated document database for timeline caching', `MongoDB Atlas / Azure Cosmos DB ${bTarget}`],
        ['migrate', 'Applies Alembic schema migrations and seed data', 'One-shot init container; prevents database race conditions', `CI/CD release phase job ${bTarget}`],
        ['api', 'FastAPI application serving REST endpoints on port 8000', 'Packages Python 3.12 dependencies under secure non-root uid', `Azure Container Apps (API container) ${bTarget}`],
        ['worker', 'Background processor that polls outbox and sends emails', 'Isolates slow background tasks from fast API response threads', `Azure Container Apps (Worker replica) ${bTarget}`]
      ]
    ) + `<p class="footnote">Status: Containerization architecture defined in compose.yaml; full runtime validation pending on local host. Modular containerized architecture, not microservices.</p>`,
    notes: '[REPOSITORY-CONFIGURED] Walk through the actual compose.yaml: mysql, mongo, migrate, api, worker. Emphasize: this is a modular containerized service architecture, not independent microservices.'
  },

  // SLIDE 7: Containers vs. Virtual Machines on Campus
  {
    title: `Containers vs. Virtual Machines on Campus Workstations ${bTheory}`,
    section: '03 / CCE Unit 2',
    time: '0:40',
    html: table(
      ['Comparison Dimension', 'Traditional Virtual Machines (VirtualBox / VMware)', 'Docker Containerization (LabTrack)'],
      [
        ['Kernel & OS Architecture', 'Each VM runs a full 20GB guest operating system kernel', 'Containers share host Linux kernel; isolated via namespaces and cgroups'],
        ['Startup Latency', '3 to 5 minutes to boot OS on an older lab computer', 'Milliseconds: FastAPI process forks instantly inside container namespace'],
        ['Campus Lab Deployment', 'Students must download 30GB VM disk images onto lab PCs', 'Lightweight 250MB OCI image layers; multi-stage build strips build tools'],
        ['Resource Footprint', 'Consumes 4GB to 8GB RAM per VM, slowing down lab machines', 'Consumes <300MB RAM, running smoothly alongside other academic software']
      ]
    ) + `<div class="takeaway">Containers allow LabTrack to run smoothly on university computers without the heavy memory and storage penalty of virtual machines.</div>`,
    notes: '[ACADEMIC THEORY] Viva question: Why use Docker instead of VirtualBox VMs on lab computers? Answer: Virtual machines duplicate entire guest operating systems (20GB+ disks, minutes to boot). Docker containers share the host kernel via cgroups and namespaces, starting in milliseconds with minimal RAM.'
  },

  // SLIDE 8: Relational Integrity & Polyglot Persistence
  {
    title: `Authoritative Inventory Data & Polyglot Persistence ${bVerified} ${bTarget}`,
    section: '04 / CCE Unit 3',
    time: '0:45',
    html: `
      <div class="split">
        <div>
          <p class="eyebrow">RELATIONAL ACID STORE (SQL) ${bVerified}</p>
          <p><strong>Authoritative Single Source of Truth</strong></p>
          <ul style="color:#eceae4;line-height:1.6;font-size:18px;">
            <li>22 tables (Users, Projects, Allocations, Assets, Outbox, Audit).</li>
            <li>Enforces row-level locks so 2 students cannot claim the last sensor simultaneously.</li>
            <li>Defective return reconciliation math executes inside ACID transactions.</li>
            <li><em>Local: SQLite ${bVerified} • Target: Azure MySQL Flexible Server ${bTarget}.</em></li>
          </ul>
        </div>
        <div>
          <p class="eyebrow">DOCUMENT PROJECTION STORE (NOSQL) ${bVerified}</p>
          <p><strong>CQRS Read-Optimized Feeds</strong></p>
          <ul style="color:#eceae4;line-height:1.6;font-size:18px;">
            <li>7 verified collections in reachable MongoDB Atlas cloud ${bVerified}.</li>
            <li>Caches student notification feeds and historical audit timelines.</li>
            <li>High-frequency polling never slows down core inventory checkout.</li>
            <li><em>Strict rule: MongoDB never updates or owns inventory counts.</em></li>
          </ul>
        </div>
      </div>
      <div class="takeaway"><strong>Polyglot Architecture:</strong> Relational SQL guarantees zero hardware count corruption; NoSQL caches fast notification feeds.</div>
    `,
    notes: '[VERIFIED / TARGET CLOUD] Viva question: Why do you have both SQL and MongoDB? Answer: CQRS and polyglot persistence. Hardware inventory requires strict ACID transactions (row-level locking so stock cannot go negative). MongoDB Atlas caches read-only notification feeds without locking SQL tables.'
  },

  // SLIDE 9: The Transactional Outbox Pattern
  {
    title: `The Transactional Outbox Pattern: Protecting Physical Stock ${bVerified} ${bTheory}`,
    section: '04 / CCE Unit 3 &amp; Literature',
    time: '0:45',
    html: `
      <p class="lead">How LabTrack solves the distributed "Dual-Write Problem" between database stock updates and external email alerts.</p>
      ${steps([
        ['The Dual-Write Flaw', 'If the server deducts a sensor in the database and then immediately calls an external SMTP email server, an email timeout or network drop could crash the request.'],
        ['Atomic Local Outbox Write', 'Instead, LabTrack writes the stock deduction AND an outbox event record into the same SQL transaction. Either both succeed or both fail.'],
        ['Asynchronous Worker Dispatch', 'A separate background worker polls the outbox and sends the email via Gmail SMTP. If Gmail is temporarily slow, the student STILL gets their physical hardware!']
      ])}
      <div class="takeaway"><strong>Resilience Rule:</strong> Physical hardware checkout is never blocked or rolled back by slow external email delivery (AWS Prescriptive Guidance).</div>
    `,
    notes: '[VERIFIED / ACADEMIC THEORY] Viva question: What is the dual-write problem and why do you use an outbox? Answer: If we send an email inside the checkout HTTP request, an SMTP timeout could fail the transaction even though the student has the hardware in hand. The outbox commits stock first; the worker sends email asynchronously.'
  },

  // SLIDE 10: Proposed Azure Deployment Architecture
  {
    title: `Target Azure Deployment Architecture ${bTarget}`,
    section: '05 / CCE Unit 3',
    time: '0:50',
    html: `
      <div class="split">
        <div>
          <p class="eyebrow">EDGE &amp; SECURITY INGRESS ${bTarget}</p>
          <ul style="color:#eceae4;line-height:1.7;font-size:18px;">
            <li><strong>Frontend:</strong> React 19 SPA hosted on Vercel Edge CDN for instant page loads.</li>
            <li><strong>Perimeter WAF:</strong> Azure Application Gateway WAF_v2 inspects HTTP traffic.</li>
            <li><strong>TLS Termination:</strong> Inspects OWASP rules and forwards clean requests into VNet.</li>
          </ul>
        </div>
        <div>
          <p class="eyebrow">PRIVATE COMPUTE &amp; DATA TIER ${bTarget}</p>
          <ul style="color:#eceae4;line-height:1.7;font-size:18px;">
            <li><strong>Container Compute:</strong> Azure Container Apps runs FastAPI API &amp; Worker.</li>
            <li><strong>Relational DB:</strong> Azure DB for MySQL Flexible Server on private endpoint.</li>
            <li><strong>Photo Storage:</strong> Azure Blob Storage holds return damage inspection photos.</li>
            <li><strong>Secret Vault:</strong> Azure Key Vault injects passwords via Managed Identity.</li>
          </ul>
        </div>
      </div>
      <div class="takeaway"><strong>Strict Truth:</strong> TARGET ARCHITECTURE ONLY. Zero Azure resources currently provisioned. Demonstrates cloud design readiness.</div>
    `,
    notes: '[TARGET CLOUD] Emphasize VNet isolation: The database and Key Vault have no public IP addresses; they are accessible only via private endpoints inside the Azure Virtual Network.'
  },

  // SLIDE 11: Release Reliability & Zero-Downtime Rollback
  {
    title: `Release Reliability & Rollback: Protecting Lab Operations ${bSim}`,
    section: '06 / CCE Unit 4 &amp; Reliability',
    time: '0:50',
    html: `
      <div class="lifecycle">
        <p><b>01</b> Developer pushes an updated barcode scanning feature; Docker image built in CI.</p>
        <p><b>02</b> Release promoted to Azure Container Apps as <strong>Revision 2</strong> alongside running Revision 1.</p>
        <p><b>03</b> Readiness probe <strong>FAILS</strong> because a database connection environment variable was mistyped.</p>
        <p><b>04</b> Container Apps router detects failure: <strong>Zero traffic routed to Revision 2</strong>.</p>
        <p><b>05</b> 100% of lab staff traffic safely remains on <strong>Revision 1 (Stable)</strong>. Checkout counter never halts.</p>
        <p><b>06</b> Telemetry alert in Azure Monitor alerts team; secret corrected; Revision 3 deploys cleanly.</p>
      </div>
      <div class="takeaway"><strong>Cloud Reliability:</strong> Container revision isolation and automated health probes prevent bad deployments from interrupting lab counter operations. (Simulated case study).</div>
    `,
    notes: '[SIMULATED SCENARIO] Ground this in campus reality: If a bad code update crashes the server at 11 AM when 50 students are at the lab counter, revision isolation ensures the old version stays live and students can still check out their boards.'
  },

  // SLIDE 12: Cloud Security Architecture
  {
    title: `Cloud Security Architecture: Protecting Campus Inventory ${bTarget} ${bVerified}`,
    section: '07 / CCE Unit 4',
    time: '0:45',
    html: table(
      ['Security Layer', 'Cloud Mechanism', 'How It Protects LabTrack'],
      [
        [`Perimeter WAF ${bTarget}`, 'Azure Application Gateway WAF_v2', 'Blocks SQL injection, XSS, and malformed JSON payloads before requests reach our containers.'],
        [`Role Authorization ${bVerified}`, 'FastAPI Bearer JWT Tokens', 'Enforces strict role claims: Students cannot approve their own requests; only Lab In-Charge can dispatch assets.'],
        [`Secret Management ${bTarget}`, 'Azure Key Vault', 'Zero passwords or JWT keys stored in code or Docker images; injected at startup via Managed Identity.'],
        [`Data Protection ${bTarget}`, 'TLS 1.3 & AES-256 Encryption', 'Encrypts requisition data in transit over HTTPS and enables Transparent Data Encryption (TDE) at rest.'],
        [`Integrity Verification ${bVerified}`, 'NIST FIPS 180-4 SHA-256', 'Used for barcode integrity verification and immutable audit logs (NOT for password encryption).']
      ]
    ) + `<div class="takeaway">Defense-in-depth: Perimeter WAF → Container RBAC → Managed Key Vault → Encrypted Storage.</div>`,
    notes: '[TARGET CLOUD / VERIFIED] Explain the Shared Responsibility Model (Unit 4): Microsoft manages physical datacenter security and hypervisors; LabTrack manages role authorization, API validation, and database records.'
  },

  // SLIDE 13: Literature Review: Grounded in Proven Systems
  {
    title: `Literature Review: Grounded in Proven Systems ${bTheory} ${bRepo}`,
    section: '08 / Literature Baseline',
    time: '0:45',
    html: table(
      ['Existing System / Standard', 'Core Industry Pattern', 'LabTrack Academic Innovation'],
      [
        ['Snipe-IT', 'Asset check-in/out, consumable tracking, and custom fieldsets', 'Lacks academic course-project approval matrices (Mentor + Lab In-Charge + HoD).'],
        ['GLPI', 'Equipment reservation scheduling and time-slot booking', 'Complex ITIL ticketing; lacks return station condition inspection math (Q_good + Q_bad = Q_issued).'],
        ['AWS Prescriptive Guidance', 'Transactional Outbox pattern to prevent dual-write database corruption', `Fully adopted in LabTrack: SQL commits stock first; worker dispatches Gmail SMTP asynchronously ${bVerified}.`],
        ['RFC 5321 (SMTP)', 'Defines mail transport as best-effort network delivery', 'Separates transactional inventory commits from external email delivery via background workers.']
      ]
    ) + `<p class="footnote">Full literature review: presentations/cce-v3/LITERATURE.md.</p>`,
    notes: '[ACADEMIC THEORY / REPOSITORY-CONFIGURED] Emphasize: We do not claim LabTrack is the first inventory tool. We show that existing enterprise tools lack academic course-project approval matrices and physical return inspection reconciliation.'
  },

  // SLIDE 14: Implementation Truth Matrix
  {
    title: `Implementation Truth Matrix (Honesty Baseline) ${bVerified} ${bLocal} ${bRepo} ${bTarget}`,
    section: '09 / Verification Status',
    time: '0:45',
    html: table(
      ['Component', 'Classification Category', 'Empirical Verification Status'],
      [
        ['React 19 + Vite 8 UI', `${bVerified} ${bLocal}`, 'Running at localhost:5173 (Student, Faculty, Lab Assistant, HoD, 3D lab layout)'],
        ['FastAPI Backend', `${bVerified} ${bLocal}`, 'Running at 127.0.0.1:8000; OpenAPI Swagger interactive docs; 61 test suites passing'],
        ['SQLite Relational Database', `${bVerified} ${bLocal}`, 'Located at .local/labtrack.db; 22 verified database tables populated with academic seed data'],
        ['MongoDB Atlas Document DB', `${bVerified} EXTERNAL CLOUD`, 'Actual cloud database reachable; 7 verified collections for notification read models'],
        ['Docker Containerization', `${bRepo}`, 'Dockerfile &amp; compose.yaml exist; full Docker runtime verification pending host daemon setup'],
        ['Azure Cloud Deployment', `${bTarget}`, 'Comprehensive architectural design; zero cloud resources currently provisioned'],
        ['Release Rollback Scenario', `${bSim}`, 'Reliability failure model based on Azure Container Apps revision isolation behavior']
      ]
    ) + `<div class="takeaway">Strict academic integrity: Running software is shown on localhost; cloud resources are presented as target engineering designs.</div>`,
    notes: '[VERIFIED / LOCAL / REPOSITORY-CONFIGURED / TARGET CLOUD / SIMULATED SCENARIO] This slide proves absolute academic maturity. Evaluators respect students who clearly differentiate running software from proposed cloud designs.'
  },

  // SLIDE 15: Live System Demonstration Flow
  {
    title: `Live System Demonstration (Localhost Execution) ${bVerified} ${bLocal}`,
    section: '10 / Running Example',
    kind: 'demo',
    time: '4:00',
    html: `
      <p class="lead">The live demonstration showcases verified local software across interface and server layers.</p>
      <div class="demo-layout">
        <div>
          ${steps([
            ['Step 1: Visual Operator Interface', 'Open localhost:5173: Explore department hardware catalog, 3D lab layout, and role dashboards.'],
            ['Step 2: Interactive API Documentation', 'Open 127.0.0.1:8000/docs: Inspect FastAPI OpenAPI Swagger with authenticated JWT Bearer session.'],
            ['Step 3: Submit & Approve Requisition', 'Authenticate as DEMO-STU-001; submit hardware requisition; approve via mentor route (DEMO-FAC-001).'],
            ['Step 4: Inspect Database & Outbox Audit', 'Inspect updated SQLite inventory counts and outbox event records created by the transaction.']
          ])}
        </div>
        <div class="demo-launch">
          <span class="demo-time">4 min</span>
          <a class="primary" data-demo="ui" target="_blank" rel="noopener">Open UI (:5173) ↗</a>
          <a data-demo="api" target="_blank" rel="noopener">Open Swagger (:8000) ↗</a>
          <p>Login: <code>DEMO-STU-001</code> / <code>DemoOnly2026!</code><br>FastAPI Docs: <code>127.0.0.1:8000/docs</code></p>
        </div>
      </div>
    `,
    notes: '[VERIFIED / LOCAL] Launch the demo using the on-screen buttons. First show the polished UI on 5173, then switch to Swagger at 8000/docs to show the verified server transaction.'
  },

  // SLIDE 16: Viva Defense & Discussion
  {
    title: `Viva Defense & Discussion ${bLocal} ${bTarget}`,
    section: '11 / Viva Defense',
    kind: 'closing',
    time: '0:30',
    html: `
      <div class="big-statement">Tested Local Foundation.<br><em>Target Cloud Architecture.</em></div>
      <p class="lead">LabTrack demonstrates verified hardware requisition workflows, role authorization, and relational transaction integrity locally, with a fully articulated Azure Container Apps deployment architecture mapped to CCE Units 1–4.</p>
      <div class="discussion">
        <span>Why PaaS over IaaS / K8s?</span>
        <span>How does Outbox prevent dual writes?</span>
        <span>How does WAF protect the API?</span>
        <span>How do ACA revisions enable rollback?</span>
      </div>
    `,
    notes: '[LOCAL / TARGET CLOUD] Conclude and invite questions from Dr. Mahender Reddy and committee members. The four prompts on screen guide the faculty to ask questions you have thoroughly prepared for.'
  }
];
