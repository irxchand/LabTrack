import hero from '../../../public/labtrack_microcontroller.jpg';
import sensor from '../../../public/images/hardware/hcsr04-ultrasonic.jpg';
import arm from '../../../public/images/hardware/robotic-arm.jpg';

const table = (headers, rows) => `<table><thead><tr>${headers.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const steps = rows => `<ol class="sequence">${rows.map(([title, body]) => `<li><strong>${title}</strong><span>${body}</span></li>`).join('')}</ol>`;

export const slides = [
  // SLIDE 1: Cover
  {
    title: 'LabTrack',
    section: 'Cloud Computing Essentials',
    kind: 'cover',
    time: '0:25',
    html: `
      <div class="cover-copy">
        <p class="eyebrow">CCE IMPLEMENTATION DEMONSTRATION</p>
        <h1>Lab<span>Track</span></h1>
        <p class="subtitle">Hardware lifecycle<br>with tested server workflows.</p>
        <p class="small">Symbiosis Institute of Technology, Pune<br>19 October 2026</p>
      </div>
      <img class="cover-image" src="${hero}" alt="Microcontroller hardware">
      <div class="cover-label">AWS + Azure DR • Multi-Stage Docker (:8000) • 61 Verified Tests</div>
    `,
    notes: 'Open with the actual claim: LabTrack has a polished browser interface and a separately tested FastAPI service. This presentation shows what runs now and the remaining connection work. Do not call the root website an end-to-end database application.'
  },

  // SLIDE 2: Use Case
  {
    title: 'The problem we implemented',
    section: '01 / Use case',
    time: '0:40',
    html: `
      <p class="lead">Laboratory hardware requires availability, approval authority and physical custody records.</p>
      ${steps([
        ['Consumable stock', 'Track good and bad quantities by laboratory. Return reconciliation checks issued quantities: Q_good + Q_bad = Q_issued.'],
        ['Serialized assets', 'Use a SIT barcode (e.g. SIT-ROBOT-0042) and condition history for specific physical units across 1-to-1 custody.'],
        ['Project requests', 'Route academic requests through correct roles: Consumables need Mentor + HoD; Assets need Mentor + Lab In-Charge + HoD.']
      ])}
      <p class="takeaway">The core question: can a team request, receive and return hardware without corrupting inventory?</p>
    `,
    notes: 'Keep this concrete. Use HC-SR04 sensors as consumables and a Jetson Nano or robotic arm as an asset. Source: faculty notes and approved SDD.'
  },

  // SLIDE 3: Literature Review 1
  {
    title: 'Literature review: service and deployment',
    section: '02 / Research basis',
    time: '0:35',
    html: table(
      ['Topic', 'What the literature establishes', 'LabTrack decision'],
      [
        ['SMTP + notification registry', 'SMTP transfers email; it is not a durable event log (RFC 5321)', 'SQL outbox records the event; a worker attempts SMTP delivery'],
        ['FastAPI', 'Validation, dependency injection and security primitives at API boundaries', 'Use role-checked server routes as the workflow authority'],
        ['Cloud VMs + managed DB', 'Compute and database can be isolated in a VPC; managed DBs reduce operational work', 'Cloud target: AWS us-east-1 VPC + private managed RDS MySQL; Azure DR replica'],
        ['Docker (No Kubernetes)', 'Containers package isolated processes; Compose avoids ~$75/mo K8s overhead', 'Multi-stage Dockerfile (node:22-alpine + python:3.12-slim) with non-root uid 10001']
      ]
    ) + `<p class="footnote">Sources: RFC 5321; FastAPI documentation; AWS RDS/EC2 documentation; Docker documentation. Full review: LITERATURE.md.</p>`,
    notes: 'This is literature applied to design, not a feature claim. SMTP is the delivery channel; the outbox and notification records are the registry. The cloud and Docker rows are target architecture. The active API still runs locally with SQLite.'
  },

  // SLIDE 4: Literature Review 2
  {
    title: 'Literature review: correctness and security',
    section: '02 / Research basis',
    time: '0:35',
    html: table(
      ['Topic', 'What the literature establishes', 'LabTrack decision'],
      [
        ['FIFO reservations', 'FIFO preserves fair order but does not reserve stock by itself (AWS SQS)', 'Order comparable requests by time; recheck stock inside the issue transaction'],
        ['Transaction isolation', 'Concurrent operations require an authoritative committed state (ACID)', 'All-or-reject issue and return reconciliation belong on the server'],
        ['SHA-256', 'A hash detects changes; it is NOT encryption (NIST FIPS 180-4)', 'Use only for integrity checks and barcode digests, never standalone password storage'],
        ['Phase 1 security', 'Confidentiality, passwords, secrets and access control need separate controls', 'TLS, Argon2/PBKDF2, secret management, roles, and Azure DR warm backup']
      ]
    ) + `<p class="footnote">Sources: AWS SQS FIFO; PostgreSQL isolation documentation; NIST FIPS 180-4; FastAPI security guidance.</p>`,
    notes: 'Correct “SHAW 256” to SHA-256. It is a one-way integrity hash, not encryption. Do not say LabTrack already has every Phase 1 control unless the actual configuration is demonstrated.'
  },

  // SLIDE 5: What runs today
  {
    title: 'What runs today',
    section: '02 / Current implementation',
    time: '0:45',
    html: table(
      ['Component', 'Observed status', 'Evidence'],
      [
        ['React + Vite website', 'Running at localhost:5173', 'Production build passes; department catalog & multi-role views'],
        ['FastAPI in Docker', 'Running at localhost:8000', 'Container healthcheck passing; OpenAPI Swagger available'],
        ['SQL business state', 'SQLite in active API profile', '73 users, 15 projects, 12 requests during review (ready for MySQL)'],
        ['MongoDB projections', 'Remote service reachable', 'Existing notification and delivery read-model documents'],
        ['CCE presentation', 'Running at localhost:5175', 'This live browser deck with timer and demo shortcuts']
      ]
    ) + `<p class="footnote">Observed on 19 October 2026. Local synthetic data only.</p>`,
    notes: 'Say exactly what is running. The live API health reports SQLite. MongoDB was reached independently and contains existing projection documents. These observations are from the code/runtime review.'
  },

  // SLIDE 6: The implementation boundary
  {
    title: 'The implementation boundary',
    section: '02 / Current implementation',
    time: '0:50',
    html: `
      <div class="architecture">
        <div>
          <span>VISUAL WORKSTATION</span>
          <h3>Root React app</h3>
          <p>Department views, requests, approvals, dispatch and return screens (localhost:5173).</p>
        </div>
        <div>
          <span>AUTHORITATIVE SERVICE</span>
          <h3>FastAPI in Docker</h3>
          <p>Persistent sessions, project access, planning, approvals, issue, return and outbox (port 8000).</p>
        </div>
        <div>
          <span>CURRENT GAP</span>
          <h3>Two state stores</h3>
          <p>Root workflow mutations use browser storage. Backend holds separate SQL state.</p>
        </div>
        <div>
          <span>DEMONSTRATION METHOD</span>
          <h3>Show both layers</h3>
          <p>Use the UI for the operator flow and the API for server-side proof.</p>
        </div>
      </div>
      <p class="takeaway">The next implementation milestone connects the interface to the existing server contracts.</p>
    `,
    notes: 'This is the most important honesty slide. The root client uses simulated calls and localStorage. The backend is separately real and tested. The faculty should see the working backend, while the presentation clearly identifies the integration task.'
  },

  // SLIDE 7: Backend workflow implemented
  {
    title: 'Backend workflow implemented',
    section: '03 / Server logic',
    time: '0:55',
    html: `
      <div class="lifecycle">
        <p><b>01</b> Authenticate (JWT Bearer tokens with verified role claims)</p>
        <p><b>02</b> Create project (Student capstone binds faculty mentor)</p>
        <p><b>03</b> Plan and submit (Minimum-lab allocation reserves quantities)</p>
        <p><b>04</b> Approve by role (Consumables: Mentor→HoD; Assets: Mentor→In-Charge→HoD)</p>
        <p><b>05</b> Claim and issue (Atomic all-or-reject inventory decrement)</p>
        <p><b>06</b> Inspect return (Reconciles good vs bad stock: Q_good + Q_bad = Q_issued)</p>
      </div>
      <p class="takeaway">The backend uses state transitions and authorization checks for every workflow step.</p>
    `,
    notes: 'The backend sequence is implemented and covered by tests. A consumable follows Mentor then HoD. An asset follows Mentor, Lab In-Charge then HoD. Explain Central Store as a system stage for consumables.'
  },

  // SLIDE 8: Inventory rules in code
  {
    title: 'Inventory rules in code',
    section: '03 / Server logic',
    time: '0:45',
    html: `
      <div class="split inventory">
        <div>
          <img src="${sensor}" alt="Ultrasonic sensor">
          <h3>Consumables</h3>
          <p>Per-lab good and bad quantities.<br>Return reconciliation checks issued quantities:<br><code>Q_good + Q_defective = Q_issued</code></p>
        </div>
        <div>
          <img src="${arm}" alt="Robotic arm">
          <h3>Assets</h3>
          <p>Barcode-selected unit (e.g. <code>SIT-ROBOT-0042</code>).<br>Availability and condition change with custody:<br><code>AVAILABLE → RESERVED → ISSUED → RETURNED</code></p>
        </div>
      </div>
      <p class="footnote">The current browser mock has a defective-return accounting bug. The live demonstration must use the backend workflow for inventory proof.</p>
    `,
    notes: 'Do not trigger a defective return in the root mock UI. The review reproduced its double decrement. Use the backend return endpoint or server test to demonstrate inventory logic.'
  },

  // SLIDE 9: Database and event handling
  {
    title: 'Database and event handling',
    section: '04 / Cloud implementation',
    time: '0:45',
    html: table(
      ['Concern', 'Implemented approach', 'Cloud target architecture'],
      [
        ['Transactional business data', 'SQLAlchemy transaction, audit and outbox', 'AWS RDS MySQL Multi-AZ in private VPC; Azure DR replica'],
        ['Notifications and analytics', 'MongoDB document projections', 'MongoDB Atlas on AWS / Azure Cosmos DB read model'],
        ['External email', 'Provider adapter and delivery records', 'AWS SQS FIFO + worker outbox dispatch; not sent live today'],
        ['Repeat commands', 'Idempotency key with stored result', 'Covered by backend tests; caches responses to prevent double-issues']
      ]
    ) + `<p class="takeaway">Business state commits before asynchronous delivery work.</p>`,
    notes: 'Explain why notification failure should not undo hardware issue. Avoid claiming the current SMTP path is fully hardened: the review found an SMTP durable-send gap. This is an implementation discussion, not a production claim.'
  },

  // SLIDE 10: Verified backend evidence
  {
    title: 'Verified backend evidence',
    section: '05 / Validation',
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
          <h3>Coverage includes</h3>
          <ul>
            <li>Authentication and authorization (JWT &amp; PBKDF2)</li>
            <li>Minimum-lab planning and shortages</li>
            <li>Approval routes and role restrictions (403 Forbidden)</li>
            <li>Claims, all-or-reject issue and return reconciliation</li>
            <li>Idempotency, audit, outbox and projections</li>
          </ul>
        </div>
      </div>
      <p class="footnote">Tests use isolated SQLite databases and local adapters. MySQL integration needs its dedicated test environment.</p>
    `,
    notes: 'This is the main evidence slide. The fresh test run on 19 October passed 61 and skipped two explicit MySQL/Mongo service tests. Explain that skipped does not mean failed, and also does not mean validated.'
  },

  // SLIDE 11: Live demonstration
  {
    title: 'Live demonstration',
    section: '06 / Running example',
    kind: 'demo',
    time: '5:00',
    html: `
      <p class="lead">The live session demonstrates a server workflow and the operator interface separately.</p>
      <div class="demo-layout">
        <div>
          ${steps([
            ['Open the interface', 'Show department-aware hardware and role screens (Port 5173).'],
            ['Open API documentation', 'Sign in as DEMO-STU-001 (DemoOnly2026!) and authorize Swagger with JWT (Port 8000).'],
            ['Run one request lifecycle', 'Plan, submit, approve as Mentor (DEMO-FAC-001), and issue consumable request.'],
            ['Show server evidence', 'Open the resulting request, timeline, updated stock count, and outbox records.']
          ])}
        </div>
        <div class="demo-launch">
          <span class="demo-time">5 min</span>
          <a class="primary" data-demo="ui" target="_blank" rel="noopener">Open website ↗</a>
          <a data-demo="api" target="_blank" rel="noopener">Open API documentation ↗</a>
          <p>Credential: <code>DEMO-STU-001</code> / <code>DemoOnly2026!</code><br>Return here after the demonstration.</p>
        </div>
      </div>
    `,
    notes: 'This is the main scoring moment. Start at the website only to show the actual interface. Then open API docs. Login as DEMO-STU-001 with DemoOnly2026!, use the authorization token in Swagger, create/choose a project led by that student, then plan/request. Use T00001, T00003 and N00001 for the backend lifecycle. Prepare new data or use the demo script. Do not send SMTP email. Show API timeline and notification endpoint after worker dispatch if it is already running. The root UI mutation does not create the API request until integration is complete.'
  },

  // SLIDE 12: One failure case (ORIGINAL STRUCTURE, CRISP AND HIGH VISIBILITY)
  {
    title: 'One failure case',
    section: '06 / Running example',
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
    notes: 'Pick one failure case and rehearse it. The shortest is a wrong approver or insufficient stock. Do not show all three. Explain this is why the next task is wiring the UI to those exact server checks.'
  },

  // SLIDE 13: Known integration work
  {
    title: 'Known integration work',
    section: '07 / Engineering status',
    time: '0:50',
    html: table(
      ['Priority', 'Work before faculty submission', 'Reason'],
      [
        ['P1', 'Use backend login and remove browser auth shortcuts', 'Enforce actual server-side JWT session tokens and role authorization'],
        ['P1', 'Replace browser request, approval, dispatch and return writes', 'Connect React UI to FastAPI routes for shared persistent SQL state'],
        ['P1', 'Restrict direct email endpoints and use outbox delivery', 'Worker-driven polling prevents spoofed triggers and mail timeouts'],
        ['P1', 'Use server inventory reconciliation for returns', 'Protect good and bad stock counts; eliminates double-decrement bug'],
        ['P2', 'Docker Compose deployment to AWS EC2 & RDS MySQL', 'Containerized multi-cloud deployment with Azure DR staging replica']
      ]
    ) + `<p class="footnote">No cloud deployment claim until this connected lifecycle works as one application.</p>`,
    notes: 'This turns the review into a credible implementation roadmap. The next build should remove the visible architectural split. Do not promise a multi-cloud deployment for the evaluation.'
  },

  // SLIDE 14: Discussion (Closing)
  {
    title: 'Discussion',
    section: '08 / Viva',
    kind: 'closing',
    time: '0:25',
    html: `
      <div class="big-statement">The implementation exists.<br><em>The interface integration is next.</em></div>
      <p class="lead">LabTrack already demonstrates role-governed hardware workflows at the server layer. The final step brings that authority into the polished operator interface.</p>
      <div class="discussion">
        <span>Why SQL and MongoDB?</span>
        <span>Why an outbox?</span>
        <span>What protects stock?</span>
        <span>What must integrate next?</span>
      </div>
    `,
    notes: 'Close with the real state. Invite questions from Dr. Mahender Reddy and committee members.'
  },

  // SLIDE 15: References and Evidence
  {
    title: 'References and evidence',
    section: 'Appendix / Sources',
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
    notes: 'Open LITERATURE.md if the faculty asks for the review. It includes direct authoritative sources and the project implication for every topic.'
  }
];
