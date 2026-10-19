import hero from '../../../public/labtrack_microcontroller.jpg';
import sensor from '../../../public/images/hardware/hcsr04-ultrasonic.jpg';
import arm from '../../../public/images/hardware/robotic-arm.jpg';

const table = (headers, rows) => `<table><thead><tr>${headers.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const steps = rows => `<ol class="sequence">${rows.map(([title, body]) => `<li><strong>${title}</strong><span>${body}</span></li>`).join('')}</ol>`;

export const slides = [
  // SLIDE 1: Cover (Rubric: Topic Submission - 5 Marks)
  {
    title: 'LabTrack',
    section: 'Topic / Platform Identity',
    kind: 'cover',
    time: '0:25',
    html: `
      <div class="cover-copy">
        <p class="eyebrow">CCE IMPLEMENTATION DEMONSTRATION</p>
        <h1>Lab<span>Track</span></h1>
        <p class="subtitle">Hardware lifecycle governance<br>with containerized server workflows.</p>
        <p class="small">Symbiosis Institute of Technology, Pune • Dept. of AI &amp; ML<br>Course: CCE • Evaluator: Dr. Chilukala Mahender Reddy</p>
      </div>
      <img class="cover-image" src="${hero}" alt="Microcontroller hardware">
      <div class="cover-label">Verified Local Runtime (:5173, :8000) • Proposed Target: Azure Container Apps • 61 Tests</div>
    `,
    notes: 'Rubric Criterion: Topic Submission (5 Marks). Pitch: Good morning Dr. Mahender Reddy and committee members. Today we present LabTrack, an inventory and lifecycle governance platform engineered for university IoT and robotics labs. LabTrack combines an interactive operator interface with a containerized FastAPI service running 61 verified test suites, designed for private cloud deployment on Azure Container Apps with disaster recovery replication.'
  },

  // SLIDE 2: Problem Context (Rubric: Topic Submission - 5 Marks)
  {
    title: 'The problem we implemented',
    section: 'Topic / Problem Formulation',
    time: '0:40',
    html: `
      <p class="lead">University hardware labs require availability control, approval authority, and physical custody reconciliation.</p>
      ${steps([
        ['Consumable stock balancing', 'Track good and bad quantities per lab (e.g. HC-SR04 sensors). Physical return station reconciles issued stock: Q_good + Q_defective = Q_issued.'],
        ['Serialized asset custody', 'Bind unique SIT barcodes (e.g. SIT-ROBOT-0042) to student project teams with verifiable 1-to-1 physical custody history.'],
        ['Academic approval authority', 'Enforce hierarchical academic permissions: Consumables route through Mentor + HoD; High-value assets strictly require Mentor + Lab In-Charge + HoD sign-off.']
      ])}
      <p class="takeaway"><strong>Core Question:</strong> Can an academic team request, receive, and return hardware without inventory corruption?</p>
    `,
    notes: 'Rubric Criterion: Topic Submission (5 Marks). Keep it grounded in SIT Pune lab reality: ultrasonic sensors vs a Jetson Nano or robotic arm. Generic IT asset tools fail in universities because they lack student capstone projects, faculty mentor approvals, and return station condition inspection.'
  },

  // SLIDE 3: Literature Survey 1 (Rubric: Research & Literature Survey - 5 Marks)
  {
    title: 'Literature review: service and deployment',
    section: 'Research / Service Architecture',
    time: '0:35',
    html: table(
      ['Topic', 'What the literature establishes', 'LabTrack architectural decision'],
      [
        ['SMTP vs Outbox Registry', 'SMTP transfers email; it is not a durable event log (RFC 5321)', 'SQL outbox records the event atomically; worker attempts asynchronous delivery'],
        ['FastAPI Framework', 'Validation, dependency injection and security primitives at API boundaries', 'Use role-checked server routes as the authoritative workflow engine'],
        ['Cloud VPC & Managed DB', 'Compute and database isolated in private subnets reduce operational load', 'Target: Azure VNet with private MySQL Flexible Server; multi-cloud DR staging'],
        ['Docker (No Kubernetes)', 'Containers package isolated processes; Compose avoids ~$75/mo K8s overhead', 'Multi-stage Dockerfile (node:22-alpine + python:3.12-slim) with non-root uid 10001']
      ]
    ) + `<p class="footnote">Sources: RFC 5321; FastAPI documentation; AWS RDS/EC2 & Docker documentation. Annotated review: LITERATURE.md.</p>`,
    notes: 'Rubric Criterion: Research & Literature Survey (5 Marks). Explain why Docker Compose is chosen over Kubernetes: Kubernetes incurs ~$75/month cluster control-plane cost and etcd latency unnecessary for a localized campus intranet.'
  },

  // SLIDE 4: Literature Survey 2 (Rubric: Research & Literature Survey - 5 Marks)
  {
    title: 'Literature review: correctness and security',
    section: 'Research / Correctness & Security',
    time: '0:35',
    html: table(
      ['Topic', 'What the literature establishes', 'LabTrack architectural decision'],
      [
        ['FIFO reservations', 'FIFO preserves fair order but does not reserve stock by itself (AWS SQS)', 'Order comparable requests by time; recheck stock inside the issue transaction'],
        ['Transaction isolation', 'Concurrent operations require an authoritative committed state (ACID)', 'All-or-reject stock issuance and return reconciliation execute on the server'],
        ['NIST SHA-256 standard', 'A cryptographic hash detects changes; it is NOT encryption (NIST FIPS 180-4)', 'Use strictly for barcode digests and audit integrity (passwords use PBKDF2/Argon2)'],
        ['Phase 1 security', 'Confidentiality, passwords, secrets, and access control need separate layers', 'TLS 1.3, Azure Key Vault secrets, JWT RBAC, and warm disaster recovery replication']
      ]
    ) + `<p class="footnote">Sources: AWS SQS FIFO; PostgreSQL isolation documentation; NIST FIPS 180-4; OWASP FastAPI security guidance.</p>`,
    notes: 'Rubric Criterion: Research & Literature Survey (5 Marks). Defense trap: Never say "SHA-256 encryption." Explain that SHA-256 is a one-way integrity hash, while passwords use salted PBKDF2/Argon2 hashes.'
  },

  // SLIDE 5: Docker Containerization (Rubric: Presentation Skills & Architecture - 5 Marks)
  {
    title: 'Containerization: Docker compose architecture',
    section: 'Architecture / Containerization',
    time: '0:45',
    html: table(
      ['Service in compose.yaml', 'What it does in LabTrack', 'Why it is containerized', 'Target cloud equivalent'],
      [
        ['mysql', 'Authoritative relational store for inventory, users, and audit logs', 'Runs identical MySQL engine locally without polluting host OS', 'Azure Database for MySQL Flexible Server'],
        ['mongo', 'Document store for user notifications and event projections', 'Provides isolated document database for read-model caching', 'MongoDB Atlas (reachable cloud DB) / Cosmos DB'],
        ['migrate', 'Runs Alembic schema migrations and applies seed catalogs', 'One-shot init container; prevents database race conditions on boot', 'CI/CD release phase job'],
        ['api', 'FastAPI REST service running Uvicorn ASGI on port 8000', 'Packages Python 3.12 dependencies under secure non-root uid 10001', 'Azure Container Apps (API container)'],
        ['worker', 'Asynchronous background processor polling SQL outbox records', 'Isolates slow background tasks from fast API response threads', 'Azure Container Apps (Worker replica)']
      ]
    ) + `<p class="footnote">Modular containerized service architecture; not independent microservices. Full host runtime validation pending.</p>`,
    notes: 'Rubric Criterion: Presentation Skills & Architecture (5 Marks). Walk through the 5 services in compose.yaml: mysql, mongo, migrate, api, worker. Explain why migrate runs as a separate one-shot init container to prevent multiple API replicas from creating database race conditions.'
  },

  // SLIDE 6: Target Cloud Architecture (Rubric: Presentation Skills & Architecture - 5 Marks)
  {
    title: 'Target cloud deployment architecture',
    section: 'Architecture / Cloud Deployment Target',
    time: '0:50',
    html: `
      <div class="architecture">
        <div>
          <span>EDGE HOSTING</span>
          <h3>Vercel CDN</h3>
          <p>React 19 single-page app distributed globally over edge points-of-presence for low-latency loading.</p>
        </div>
        <div>
          <span>SECURITY PERIMETER</span>
          <h3>App Gateway WAF_v2</h3>
          <p>OWASP CRS 3.2 ruleset; deep inspection of incoming HTTP payloads before reaching internal VNet.</p>
        </div>
        <div>
          <span>MANAGED COMPUTE</span>
          <h3>Azure Container Apps</h3>
          <p>Serverless containers for FastAPI API &amp; Worker; scales to zero during university vacation periods.</p>
        </div>
        <div>
          <span>PRIVATE PERSISTENCE</span>
          <h3>MySQL Flex &amp; Blob</h3>
          <p>Private endpoint relational database with automated backups; Azure Blob Storage for inspection photos.</p>
        </div>
      </div>
      <p class="takeaway"><strong>Target Design:</strong> Zero Azure resources are currently provisioned. Demonstrates cloud architecture readiness while code runs verified locally.</p>
    `,
    notes: 'Rubric Criterion: Presentation Skills & Architecture (5 Marks). Explain why Azure Container Apps was chosen over raw VMs: College labs are empty during summer vacations. VMs bill 24/7/365, whereas serverless Container Apps scale to zero, optimizing the university budget.'
  },

  // SLIDE 7: Data Architecture (Rubric: Presentation Skills & Architecture - 5 Marks)
  {
    title: 'Data architecture: polyglot persistence',
    section: 'Architecture / Polyglot Data Store',
    time: '0:45',
    html: `
      <div class="split">
        <div>
          <p class="eyebrow">RELATIONAL ACID STORE (SQL)</p>
          <p><strong>Authoritative Single Source of Truth</strong></p>
          <ul style="color:#eceae4;line-height:1.6;font-size:18px;">
            <li>22 tables (Users, Projects, Assets, Allocations, Outbox, Audit).</li>
            <li>Enforces row-level locks so 2 students cannot claim the last unit.</li>
            <li>Stock decrement and return reconciliation execute atomically.</li>
            <li><em>Local: SQLite • Target: Azure MySQL Flexible Server.</em></li>
          </ul>
        </div>
        <div>
          <p class="eyebrow">DOCUMENT PROJECTION STORE (NOSQL)</p>
          <p><strong>CQRS Read-Optimized Views</strong></p>
          <ul style="color:#eceae4;line-height:1.6;font-size:18px;">
            <li>7 verified collections in reachable MongoDB Atlas cloud.</li>
            <li>Stores user notification feeds, audit timelines, and analytics.</li>
            <li>High-frequency polling never slows down core inventory checkout.</li>
            <li><em>Strict rule: MongoDB never updates or owns inventory counts.</em></li>
          </ul>
        </div>
      </div>
      <p class="takeaway"><strong>Architectural Rule:</strong> Inventory counts and approvals never mutate in MongoDB; transactional integrity is strictly owned by SQL.</p>
    `,
    notes: 'Rubric Criterion: Presentation Skills & Architecture (5 Marks). Viva question: Why use both SQL and MongoDB? Answer: Polyglot persistence under CQRS. SQL provides ACID transactions with row-level locks for inventory, while MongoDB Atlas stores read-optimized notification feeds.'
  },

  // SLIDE 8: The Transactional Outbox Pattern (Rubric: Presentation Skills & Architecture - 5 Marks)
  {
    title: 'Event reliability: transactional outbox pattern',
    section: 'Architecture / Transactional Outbox Pattern',
    time: '0:45',
    html: `
      <p class="lead">How LabTrack resolves the distributed "Dual-Write Problem" between database inventory updates and external email notifications.</p>
      ${steps([
        ['The Dual-Write Hazard', 'Updating inventory in the database and immediately calling an external SMTP email server creates a failure point: an email timeout can crash an active request.'],
        ['Atomic Local Outbox Write', 'LabTrack writes the inventory deduction AND an outbox event record into the same SQL transaction. Both commit atomically or both roll back together.'],
        ['Asynchronous Worker Dispatch', 'A separate background worker polls the outbox and attempts Gmail SMTP dispatch. If the mail server is slow, the student STILL gets their physical hardware!']
      ])}
      <p class="takeaway"><strong>Resilience Guarantee:</strong> Physical hardware checkout is never blocked or rolled back by third-party email latency (AWS Prescriptive Guidance).</p>
    `,
    notes: 'Rubric Criterion: Presentation Skills & Architecture (5 Marks). Explain how this directly applies AWS Prescriptive Guidance: In distributed systems, decoupling atomic SQL commits from network notifications protects data consistency.'
  },

  // SLIDE 9: Security Architecture (Rubric: Presentation Skills & Architecture - 5 Marks)
  {
    title: 'Cloud security and role governance',
    section: 'Architecture / Perimeter & Role Security',
    time: '0:40',
    html: table(
      ['Security Pillar', 'Target Cloud Control', 'How It Protects LabTrack'],
      [
        ['Perimeter / WAF', 'Azure Application Gateway WAF_v2', 'Blocks SQL injection, XSS, and payload tampering before requests reach containers.'],
        ['Identity & Access (IAM)', 'FastAPI Bearer JWT Tokens', 'Enforces strict role claims: Students cannot approve their own requests; only Lab In-Charge can dispatch.'],
        ['Secret Management', 'Azure Key Vault', 'Zero hardcoded secrets; database credentials and JWT signing keys injected at startup via Managed Identity.'],
        ['Data Protection', 'TLS 1.3 & AES-256', 'Strict HTTPS externally; TLS to MySQL database; Transparent Data Encryption (TDE) at rest.'],
        ['Integrity Verification', 'NIST FIPS 180-4 SHA-256', 'One-way checksum digests for barcode verification and audit logs (NOT for password encryption).']
      ]
    ) + `<p class="takeaway">Defense-in-depth: Perimeter WAF → Container RBAC → Managed Key Vault → Encrypted Storage.</p>`,
    notes: 'Rubric Criterion: Presentation Skills & Architecture (5 Marks). Explain the Cloud Shared Responsibility Model: Microsoft manages physical datacenters and hypervisors; LabTrack manages role authorization, API validation, and database records.'
  },

  // SLIDE 10: Release Reliability & Rollback (Rubric: Presentation Skills & Architecture - 5 Marks)
  {
    title: 'Release reliability: simulated rollback scenario',
    section: 'Reliability / Release Rollback Scenario',
    time: '0:45',
    html: `
      <div class="lifecycle">
        <p><b>01</b> <strong>Local Feature Build:</strong> Updated barcode scanning feature passes local unit test suites.</p>
        <p><b>02</b> <strong>Container Promotion:</strong> OCI image built in CI and deployed as Azure Container Apps <strong>Revision 2</strong>.</p>
        <p><b>03</b> <strong>Health Probe Failure:</strong> Startup probe passes, but readiness health check <strong>FAILS</strong> (missing DB secret in Key Vault).</p>
        <p><b>04</b> <strong>Traffic Protection:</strong> Container Apps ingress router detects failure: <strong>Zero traffic routed to Revision 2</strong>.</p>
        <p><b>05</b> <strong>Zero Downtime:</strong> 100% of user traffic safely remains on <strong>Revision 1 (Stable)</strong>. Checkout counter operations continue uninterrupted.</p>
        <p><b>06</b> <strong>Telemetry & Fix:</strong> Telemetry inspected in Azure Monitor; configuration fixed; Revision 3 deploys cleanly.</p>
      </div>
      <p class="takeaway"><strong>Reliability Principle:</strong> Container revision isolation and automated readiness probes prevent faulty releases from halting campus lab operations. (Simulated case study).</p>
    `,
    notes: 'Rubric Criterion: Presentation Skills & Architecture (5 Marks). Emphasize: This is a simulated architectural scenario explaining cloud resilience. It proves why Container Apps revision management is superior to in-place VM patching.'
  },

  // SLIDE 11: Current Implementation Evidence (Rubric: Running Example - 10 Marks)
  {
    title: 'Current implementation: verified evidence',
    section: 'Running Example / Current Implementation & Evidence',
    time: '0:45',
    html: `
      <div class="split">
        <div>
          <p class="eyebrow">FRESH TEST RUN</p>
          <div class="metric">61 <span>passed</span></div>
          <p>2 opt-in service checks skipped<br>0 failures<br>397.77 seconds</p>
          <p class="small" style="margin-top:15px;color:#e8d5b7;">Docker Container: Non-root uid 10001 • Healthcheck: PASS</p>
        </div>
        <div>
          <h3>Verified runtime components</h3>
          <ul style="color:#eceae4;line-height:1.6;font-size:18px;">
            <li><strong>React 19 + Vite 8 UI:</strong> Running on port 5173 (student/faculty views).</li>
            <li><strong>FastAPI in Docker:</strong> Running on port 8000 (OpenAPI Swagger live).</li>
            <li><strong>SQLite Relational:</strong> 22 verified tables at <code>.local/labtrack.db</code>.</li>
            <li><strong>MongoDB Atlas:</strong> 7 verified projection collections reachable.</li>
            <li><strong>Notifications:</strong> Gmail SMTP delivery tested as external managed service.</li>
          </ul>
        </div>
      </div>
      <p class="footnote">Tests use isolated SQLite databases and local adapters. Active local runtime distinct from target cloud architecture.</p>
    `,
    notes: 'Rubric Criterion: Running Example (10 Marks). This is your primary empirical evidence slide. 61 tests passing proves the server workflow, role boundaries, and inventory logic are fully functional.'
  },

  // SLIDE 12: Live System Walkthrough (Rubric: Running Example - 10 Marks)
  {
    title: 'Live demonstration: verified workflow',
    section: 'Running Example / Live System Walkthrough',
    kind: 'demo',
    time: '4:30',
    html: `
      <p class="lead">The live session demonstrates a verified server workflow and the operator interface separately.</p>
      <div class="demo-layout">
        <div>
          ${steps([
            ['Open the interface', 'Show department-aware hardware catalog, 3D lab layout, and role dashboards (Port 5173).'],
            ['Open API documentation', 'Sign in as DEMO-STU-001 (DemoOnly2026!) and authorize Swagger with Bearer JWT (Port 8000).'],
            ['Run request lifecycle', 'Submit hardware plan, approve via Faculty Mentor route (DEMO-FAC-001), and execute issue transaction.'],
            ['Show server evidence', 'Inspect resulting SQL request timeline, updated stock count, and outbox event records.']
          ])}
        </div>
        <div class="demo-launch">
          <span class="demo-time">4 min</span>
          <a class="primary" data-demo="ui" target="_blank" rel="noopener">Open website ↗</a>
          <a data-demo="api" target="_blank" rel="noopener">Open API documentation ↗</a>
          <p>Credential: <code>DEMO-STU-001</code> / <code>DemoOnly2026!</code><br>Return here after demonstration.</p>
        </div>
      </div>
    `,
    notes: 'Rubric Criterion: Running Example (10 Marks). This is the highest-weighted moment (10 Marks). Start on port 5173 to show the UI, then switch to port 8000 Swagger to authenticate, submit a requisition, approve as mentor, and show the resulting database commit.'
  },

  // SLIDE 13: Controlled Failure Handling (Rubric: Running Example - 10 Marks)
  {
    title: 'Controlled failure: resilient error handling',
    section: 'Running Example / Controlled Failure Handling',
    time: '0:35',
    html: `
      <p class="lead">A credible engineering system must prove graceful failure handling when an unsafe action is attempted.</p>
      ${steps([
        ['Stock shortage refusal', 'Student requests 50 Ultrasonic sensors when only 12 are available. Server halts in planning with <strong>422 Unprocessable Entity</strong> { shortage: 38, available: 12 }. Request creation blocked.'],
        ['Unauthorized approver', 'Unrelated Faculty B attempts to approve a request for Faculty A\'s capstone team. Server refuses with <strong>403 Forbidden</strong>. Request remains locked in SUBMITTED.'],
        ['Concurrency race refusal', 'A second team claims remaining stock while an issue is in flight. Server triggers atomic transaction rollback with <strong>409 Conflict</strong>. Zero partial kit decrement.']
      ])}
      <p class="takeaway"><strong>System Resilience:</strong> The database and container service defend business rules even if an unauthorized or malformed request is sent.</p>
    `,
    notes: 'Rubric Criterion: Running Example (10 Marks). Demonstrate or explain 422 Unprocessable Entity: when requested quantity exceeds available stock, the server refuses the request with an exact shortage payload.'
  },

  // SLIDE 14: Viva Discussion (Rubric: Viva - 5 Marks)
  {
    title: 'Discussion: architectural defense',
    section: 'Viva / Architectural Trade-offs & Discussion',
    kind: 'closing',
    time: '0:25',
    html: `
      <div class="big-statement">The implementation exists.<br><em>The interface integration is next.</em></div>
      <p class="lead">LabTrack demonstrates verified role-governed hardware workflows and relational transaction integrity locally, with an articulated target cloud architecture on Azure Container Apps.</p>
      <div class="discussion">
        <span>Why PaaS over IaaS / K8s?</span>
        <span>Why an outbox pattern?</span>
        <span>What protects stock?</span>
        <span>What integrates next?</span>
      </div>
    `,
    notes: 'Rubric Criterion: Viva (5 Marks). Close with the real state. The 4 prompt boxes guide the committee: 1. PaaS/ACA scales to zero during vacations and avoids K8s fees; 2. Outbox prevents dual-write email failure rollbacks; 3. SQL row-level locks protect stock; 4. Next milestone connects UI writes to FastAPI.'
  },

  // SLIDE 15: Academic Citations (Rubric: Research & Literature Survey - 5 Marks)
  {
    title: 'References and evidence',
    section: 'Appendix / References & Academic Citations',
    time: 'Reference',
    html: `
      <ol class="references">
        <li>Klensin, J. Simple Mail Transfer Protocol, RFC 5321, IETF, 2008/2010. <a href="https://datatracker.ietf.org/doc/html/rfc5321/" target="_blank" rel="noopener">datatracker.ietf.org</a></li>
        <li>FastAPI. Background Tasks. <a href="https://fastapi.tiangolo.com/tutorial/background-tasks/" target="_blank" rel="noopener">fastapi.tiangolo.com</a></li>
        <li>OWASP. FastAPI Security Cheat Sheet. <a href="https://cheatsheetseries.owasp.org/cheatsheets/FastAPI_Security_Cheat_Sheet.html" target="_blank" rel="noopener">cheatsheetseries.owasp.org</a></li>
        <li>Amazon Web Services. Amazon SQS FIFO queues. <a href="https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-fifo-queues.html" target="_blank" rel="noopener">docs.aws.amazon.com</a></li>
        <li>PostgreSQL Global Development Group. Transaction Isolation, PostgreSQL Documentation. <a href="https://www.postgresql.org/docs/current/transaction-iso.html" target="_blank" rel="noopener">postgresql.org</a></li>
        <li>Amazon Web Services. Amazon EC2 Documentation, Amazon RDS Documentation, and Docker Documentation.</li>
        <li>National Institute of Standards and Technology. Secure Hash Standard (SHS), FIPS PUB 180-4, 2015. <a href="https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf" target="_blank" rel="noopener">nvlpubs.nist.gov</a></li>
        <li>Approved Software Design Document; code-review record; backend test report confirming 61 passing tests.</li>
        <li>Project literature review: presentations/cce-v3/LITERATURE.md.</li>
      </ol>
      <p class="footnote">Full annotated literature review with direct links: presentations/cce-v3/LITERATURE.md.</p>
    `,
    notes: 'Rubric Criterion: Research & Literature Survey (5 Marks). Refer to LITERATURE.md if faculty asks for deep citations. It covers Snipe-IT, GLPI, AWS Outbox, and NIST cryptography standards.'
  }
];
