/**
 * LabTrack pitch-deck content — Version 1.1.
 *
 * Source of truth: docs/LabTrack_MASTER_CONTEXT.md & DCDS / CCE Evaluation Rubrics.
 * Labelling rule: never present an assumption as institutional fact.
 *   confirmed  = observed by team / official rubric
 *   assumption = V1 working assumption (pending confirmation)
 *   pending    = institutional decision for faculty / college
 *   proposed   = proposed technical design for approval
 *   future     = out of V1 scope
 */

const icon = (d) => `<svg viewBox="0 0 24 24">${d}</svg>`;
const I = {
  mail: icon('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
  book: icon('<path d="M4 4h10a4 4 0 014 4v12H8a4 4 0 01-4-4z"/><path d="M4 16a4 4 0 014-4h10"/>'),
  user: icon('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>'),
  users: icon('<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0114 0"/><path d="M16 4.5a3.5 3.5 0 010 7M18 20a7 7 0 00-2.5-5.4"/>'),
  wrench: icon('<path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.5 2.5-2.5-2.5z"/>'),
  building: icon('<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M10 21v-3h4v3"/>'),
  shield: icon('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>'),
  cpu: icon('<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>'),
  layers: icon('<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>'),
  hash: icon('<path d="M5 9h14M5 15h14M10 4L8 20M16 4l-2 16"/>'),
  drop: icon('<path d="M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z"/>'),
  spark: icon('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>'),
  x: icon('<path d="M6 6l12 12M18 6L6 18"/>'),
  check: icon('<path d="M5 12l5 5 9-10"/>'),
  chart: icon('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
  bell: icon('<path d="M6 16V11a6 6 0 0112 0v5l2 2H4z"/><path d="M10 21h4"/>'),
  cloud: icon('<path d="M7 18a5 5 0 01-.6-9.96A6 6 0 0118 9a4.5 4.5 0 01-.5 9z"/>'),
  db: icon('<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>'),
};

const B = {
  confirmed: (t = 'Observed / Confirmed') => `<span class="badge b-confirmed">${t}</span>`,
  assumption: (t = 'V1 assumption — pending confirmation') => `<span class="badge b-assumption">${t}</span>`,
  pending: (t = 'Pending faculty confirmation') => `<span class="badge b-pending">${t}</span>`,
  proposed: (t = 'Proposed — for approval') => `<span class="badge b-proposed">${t}</span>`,
  future: (t = 'Future scope') => `<span class="badge b-future">${t}</span>`,
};

const head = (eyebrow, title, lead = '') => `
  <header class="head">
    <div class="eyebrow reveal">${eyebrow}</div>
    <h2 class="reveal">${title}</h2>
    ${lead ? `<p class="lead reveal">${lead}</p>` : ''}
  </header>`;

const flow = (steps, cls = '') =>
  `<div class="flow ${cls}">${steps
    .map((s) => `<div class="step ${s.cls || ''}">${s.k ? `<small>${s.k}</small>` : ''}${s.t}</div>`)
    .join('<div class="arrow"></div>')}</div>`;

export const slides = [
  /* 01 — Title */
  {
    title: 'LabTrack',
    cls: 'title-slide',
    html: `
      <svg class="orbit" viewBox="0 0 760 760" aria-hidden="true">
        <circle cx="380" cy="380" r="370"/><circle cx="380" cy="380" r="280"/><circle cx="380" cy="380" r="190"/>
        <g class="spin"><circle cx="380" cy="10" r="7" fill="#2ee6c5" stroke="none"/><circle cx="750" cy="380" r="4" fill="#5b8cff" stroke="none"/></g>
        <g class="spin r"><circle cx="380" cy="100" r="6" fill="#a78bfa" stroke="none"/><circle cx="100" cy="380" r="4" fill="#2ee6c5" stroke="none"/></g>
        <g class="spin"><circle cx="570" cy="380" r="5" fill="#fbbf5a" stroke="none"/></g>
      </svg>
      <div class="logo reveal">
        <div class="logo-mark"><svg viewBox="0 0 24 24"><path d="M6 4v16h12"/><circle cx="13" cy="10" r="2.4"/></svg></div>
        <span class="mono muted">PROJECT PROPOSAL · VERSION 1.1 · FOR FACULTY APPROVAL</span>
      </div>
      <h1 class="reveal"><span class="grad-text">LabTrack</span></h1>
      <p class="subtitle reveal">Hardware Component Availability, Issuance &amp; Tracking System</p>
      <p class="lead reveal">Turning fragmented laboratory hardware handling into a traceable digital lifecycle.</p>
      <div class="meta reveal">
        <span class="chip">SY · Semester 3 · AIML 2025–29</span>
        <span class="chip">CCE Presentation &amp; Viva</span>
        <span class="chip">DCDS Lab ESE Miniproject</span>
      </div>`,
  },

  /* 02 — How to read this deck */
  {
    title: 'How to read this deck',
    html: `
      ${head('Before we begin', 'What we are asking you to approve', 'This is a proposal, not a finished system. Every statement is labelled so that working assumptions are never mistaken for college policy.')}
      <div class="body">
        <div class="grid g3 reveal">
          <div class="card a-green accent-top"><div class="badges" style="margin-bottom:14px">${B.confirmed('Observed / confirmed')}</div><p>Things directly observed in the current lab process, or specified in the official evaluation rubrics.</p></div>
          <div class="card a-amber accent-top"><div class="badges" style="margin-bottom:14px">${B.assumption()}</div><p>Temporary working rules so development can begin. They are configurable and will be replaced by institutional answers.</p></div>
          <div class="card a-rose accent-top"><div class="badges" style="margin-bottom:14px">${B.pending()}</div><p>Institutional decisions only faculty / college authorities can make. Collected in the decision questionnaire.</p></div>
          <div class="card a-blue accent-top"><div class="badges" style="margin-bottom:14px">${B.proposed()}</div><p>Our proposed technical design: architecture, data model, and technology stack. Open to technical feedback.</p></div>
          <div class="card a-violet accent-top"><div class="badges" style="margin-bottom:14px">${B.future()}</div><p>Valuable extensions deliberately deferred outside the V1 implementation boundary.</p></div>
          <div class="card a-teal accent-top"><h3>Core principle</h3><p>Automate the workflow lab assistants and students already perform, <b style="color:var(--text)">without modifying departmental policy</b> unless explicitly authorised.</p></div>
        </div>
      </div>`,
  },

  /* 03 — Current manual process (Fix 1: "manual records" instead of "memory") */
  {
    title: 'Current manual process',
    html: `
      <div class="slide-badge">${B.confirmed('Observed by team')}</div>
      ${head('The problem', 'Today, lab hardware is handled through email, notebooks and manual records', 'The process observed for academic projects requiring hardware components:')}
      <div class="body" style="gap:24px">
        <div class="reveal">${flow([
          { k: 'STEP 1', t: 'Student emails assistant + mentor', cls: 'manual' },
          { k: 'STEP 2', t: 'Assistant checks stock by hand', cls: 'manual' },
          { k: 'STEP 3', t: 'Reply with pickup availability', cls: 'manual' },
          { k: 'STEP 4', t: 'Physical collection at lab', cls: 'manual' },
          { k: 'STEP 5', t: 'Manual entry in notebook', cls: 'manual' },
        ])}</div>
        <div class="reveal">${flow([
          { k: 'STEP 6', t: 'Deadline given verbally / by email', cls: 'manual' },
          { k: 'STEP 7', t: 'Deadline tracked manually', cls: 'manual' },
          { k: 'STEP 8', t: 'Follow-up reminders sent by hand', cls: 'manual' },
          { k: 'STEP 9', t: 'Physical return & condition check', cls: 'manual' },
          { k: 'STEP 10', t: 'Defects handled via ad-hoc threads', cls: 'manual' },
        ])}</div>
        <div class="grid g3 reveal" style="margin-top:6px">
          <div class="card a-amber"><h3>Stock records</h3><p>Partly maintained in <b style="color:var(--text)">Excel spreadsheets</b>, updated manually.</p></div>
          <div class="card a-amber"><h3>Custody history</h3><p>Logged in <b style="color:var(--text)">physical register notebooks</b>.</p></div>
          <div class="card a-amber"><h3>Queuing &amp; demand</h3><p><b style="color:var(--text)">No unified queue</b> for components that are currently issued.</p></div>
        </div>
      </div>`,
  },

  /* 04 — Pain points (Fix 2: "Where the current workflow creates operational friction") */
  {
    title: 'Operational friction',
    html: `
      <div class="slide-badge">${B.confirmed('Observed by team')}</div>
      ${head('Consequences', 'Where the current workflow creates operational friction')}
      <div class="body">
        <div class="grid g4 reveal" style="flex:1">
          <div class="card a-teal"><div class="icon">${I.wrench}</div><h3>Lab Assistants</h3><ul>
            <li>Manual availability verification</li><li>Repetitive email inquiries</li><li>Physical register maintenance</li><li>Manual due date tracking</li><li>Manual reminder drafting</li><li>Handwritten defect &amp; loss logs</li></ul></div>
          <div class="card a-blue"><div class="icon">${I.user}</div><h3>Students</h3><ul>
            <li>No live stock visibility</li><li>Unclear which lab holds assets</li><li>Unclear inquiry routing</li><li>No request progress status</li><li>No structured reservation queue</li><li>No verifiable borrowing history</li></ul></div>
          <div class="card a-violet"><div class="icon">${I.users}</div><h3>Faculty Mentors</h3><ul>
            <li>Requests fragmented in inbox</li><li>Project context disconnected</li><li>No central approval log</li><li>Overdue cases require manual check</li><li>No visibility on defects or damage</li></ul></div>
          <div class="card a-amber"><div class="icon">${I.building}</div><h3>Department</h3><ul>
            <li>Split records (Excel vs notebooks)</li><li>Incomplete asset traceability</li><li>Unmet component demand invisible</li><li>No equipment utilisation data</li><li>Weak institutional accountability</li></ul></div>
        </div>
      </div>`,
  },

  /* 05 — Before / After */
  {
    title: 'Before → After',
    html: `
      ${head('The proposal', 'One system for the entire component lifecycle', 'LabTrack digitises the journey from project requirement to return, defect logging, and accountability.')}
      <div class="body center" style="display:flex">
        <div class="vs reveal" style="width:100%">
          <div class="card"><div class="eyebrow" style="color:var(--rose)">Current state</div><div class="chips">
            <span class="chip bad">Email threads</span><span class="chip bad">Physical notebook</span><span class="chip bad">Excel inventory</span>
            <span class="chip bad">Manual reminders</span><span class="chip bad">Informal reservations</span><span class="chip bad">Ad-hoc defect handling</span></div></div>
          <div class="mid">LabTrack<br/><span style="font-size:16px;font-weight:500">centralised lifecycle</span></div>
          <div class="card"><div class="eyebrow">Proposed state</div><div class="chips">
            <span class="chip good">Live visibility</span><span class="chip good">Unit traceability</span><span class="chip good">Automated reminders</span>
            <span class="chip good">Custody accountability</span><span class="chip good">FIFO reservations</span><span class="chip good">Unmet demand insight</span></div></div>
        </div>
      </div>
      <p class="footer-note">Note: No performance improvements are asserted as fact. Impact will be reported only when empirically measured.</p>`,
  },

  /* 06 — WHY LABTRACK IS MORE THAN INVENTORY (New Core Slide) */
  {
    title: 'More than inventory',
    html: `
      ${head('Domain model', 'Why LabTrack is more than an inventory system', 'Traditional inventory answers what exists. LabTrack governs academic context, workflow authority, and physical custody.')}
      <div class="body">
        <div class="ladder reveal">
          <div class="ladder-step" style="--accent:var(--dim)">
            <div class="l-key">01 · Stock</div>
            <div class="l-term">Inventory</div>
            <div class="l-q">What exists?</div>
            <div class="l-desc">Item types, specifications, and total counts across department labs.</div>
          </div>
          <div class="ladder-step" style="--accent:var(--teal)">
            <div class="l-key">02 · Context</div>
            <div class="l-term">Project</div>
            <div class="l-q">Who needs it &amp; why?</div>
            <div class="l-desc">Student team, academic purpose, and assigned faculty mentor.</div>
          </div>
          <div class="ladder-step" style="--accent:var(--violet)">
            <div class="l-key">03 · Governance</div>
            <div class="l-term">Workflow</div>
            <div class="l-q">Who approved it?</div>
            <div class="l-desc">Configurable multi-tier faculty review and authorization.</div>
          </div>
          <div class="ladder-step" style="--accent:var(--blue)">
            <div class="l-key">04 · Identity</div>
            <div class="l-term">Asset</div>
            <div class="l-q">Which exact unit?</div>
            <div class="l-desc">Specific serialized physical unit (e.g. ARDUINO-004) carrying unit history.</div>
          </div>
          <div class="ladder-step" style="--accent:var(--amber)">
            <div class="l-key">05 · Custody</div>
            <div class="l-term">Transaction</div>
            <div class="l-q">Who holds it?</div>
            <div class="l-desc">Verified physical handover between assistant and student borrower.</div>
          </div>
          <div class="ladder-step" style="--accent:var(--rose)">
            <div class="l-key">06 · Discipline</div>
            <div class="l-term">Accountability</div>
            <div class="l-q">When is it due?</div>
            <div class="l-desc">Automated reminder schedule, formal extension requests, and overdue flags.</div>
          </div>
          <div class="ladder-step" style="--accent:var(--green)">
            <div class="l-key">07 · Traceability</div>
            <div class="l-term">History</div>
            <div class="l-q">What happened?</div>
            <div class="l-desc">Inspection records, defect logs, and immutable audit trails.</div>
          </div>
        </div>
      </div>`,
  },

  /* 07 — Scale & Scope */
  {
    title: 'Target environment',
    html: `
      <div class="slide-badge">${B.confirmed('Approximate sizing')}</div>
      ${head('Target environment', 'Sized for one department, built for portability')}
      <div class="body">
        <div class="grid g4 reveal">
          <div class="card stat a-teal"><div class="num grad-text">8–10</div><div class="lbl">Department Labs</div></div>
          <div class="card stat"><div class="num grad-text">10–12</div><div class="lbl">Lab Assistants</div></div>
          <div class="card stat"><div class="num grad-text">700–800</div><div class="lbl">Enrolled Students</div></div>
          <div class="card stat"><div class="num grad-text">5–10</div><div class="lbl">Expected Concurrent Users</div></div>
        </div>
        <div class="grid g3 reveal" style="margin-top:24px">
          <div class="card a-blue"><h3>Prototype first</h3><p>V1 is a functional prototype for demonstration and academic evaluation. Department adoption is a goal, <b style="color:var(--text)">not</b> a confirmed mandate.</p></div>
          <div class="card a-blue"><h3>Web responsive</h3><p>Built as a responsive web application. Dedicated native mobile applications remain future scope.</p></div>
          <div class="card a-blue"><h3>Infrastructure portability</h3><p>Demonstrated on a cloud VM using synthetic data, designed for seamless migration to institutional servers upon approval.</p></div>
        </div>
      </div>`,
  },

  /* 08 — Users & roles (Fix 3: HoD role positioning) */
  {
    title: 'Users & roles',
    html: `
      ${head('Who uses it', 'Core application roles + policy-dependent authorities')}
      <div class="body">
        <div class="grid g4 reveal" style="flex:1">
          <div class="card a-blue accent-top"><div class="icon">${I.user}</div><h3>Student</h3><ul>
            <li>Register project &amp; add team members</li><li>Select assigned faculty mentor</li><li>Browse catalogue &amp; real-time stock</li><li>Submit issue / reservation requests</li><li>Track due dates &amp; request extensions</li><li>View borrowing &amp; defect history</li></ul></div>
          <div class="card a-violet accent-top"><div class="icon">${I.users}</div><h3>Faculty Mentor</h3><ul>
            <li>Access <b style="color:var(--text)">authorized projects only</b></li><li>Approve, reject, or modify requests</li><li>Receive overdue notifications</li><li>Review extension requests</li><li>View student custody &amp; defect logs</li></ul></div>
          <div class="card a-teal accent-top"><div class="icon">${I.wrench}</div><h3>Lab Assistant</h3><ul>
            <li><b style="color:var(--text)">Physical inventory authority</b></li><li>Verify &amp; physically issue hardware</li><li>Assign specific serialized asset unit</li><li>Set borrowing duration &amp; due date</li><li>Inspect returns &amp; record defects</li><li>Manage lab stock &amp; queue overrides</li></ul></div>
          <div class="card a-amber accent-top"><div class="icon">${I.shield}</div><h3>System Admin</h3><ul>
            <li>Manage users, roles, and lab locations</li><li>Maintain catalogue &amp; asset metadata</li><li>Configure system parameters &amp; Excel import</li><li>Review system logs &amp; seed demo data</li><li>Role is <b style="color:var(--text)">transferable</b>, not bound to a person</li></ul></div>
        </div>
        <div class="card reveal" style="margin-top:16px;padding:14px 20px;border-color:rgba(251,113,133,0.3)">
          <div class="row" style="align-items:center;gap:14px">
            <div class="badges">${B.pending('Policy authority: UAQ5')}</div>
            <span style="font-size:15px;color:var(--text)"><b style="color:var(--rose)">Head of Department (HoD):</b> Policy-dependent authority for approval/escalation; exact system role and routing rules remain pending faculty confirmation.</span>
          </div>
        </div>
      </div>`,
  },

  /* 09 — Lifecycle (Fix 4: Redesigned branching lifecycle) */
  {
    title: 'End-to-end lifecycle',
    html: `
      ${head('Domain lifecycle', 'One project, one traceable lifecycle', 'Hardware requests are bound to an authorized academic <b style="color:var(--text)">project</b> rather than informal ad-hoc requests.')}
      <div class="body" style="justify-content:center">
        <div class="lc-branch-container reveal">
          <div class="lc-row r6">
            <div class="lifecycle" style="display:contents">
              <div class="node">Project<span>team + mentor</span></div>
              <div class="node">Requirements<span>from catalogue</span></div>
              <div class="node">Availability<span>qty · lab · status</span></div>
              <div class="node">Request<span>available items</span></div>
              <div class="node">Approval<span>faculty review</span></div>
              <div class="node">Physical Issue<span>verified by assistant</span></div>
            </div>
          </div>
          
          <div class="lc-branch-card">
            <div class="b-item">
              <b>Active Issue ├─ Automated Reminders</b>
              <span>Scheduled notices: T-7, T-3, T-1, Due Date, and daily overdue alerts.</span>
            </div>
            <div class="b-item">
              <b>Active Issue ├─ Extension Request</b>
              <span>Formal request → mentor approval → assistant updates transaction due date.</span>
            </div>
            <div class="b-item">
              <b>Active Issue └─ FIFO Reservation</b>
              <span>Other students join queue for currently issued items; notified on return.</span>
            </div>
          </div>

          <div class="lc-row r4">
            <div class="lifecycle" style="display:contents">
              <div class="node phase-c">Return<span>physical handover</span></div>
              <div class="node phase-c">Inspection<span>condition verification</span></div>
              <div class="node phase-c">Closure / Defect<span>resolution &amp; penalty</span></div>
              <div class="node phase-c">History<span>immutable audit log</span></div>
            </div>
          </div>
        </div>

        <div class="legend reveal" style="margin-top:20px">
          <span class="chip"><span class="mono" style="color:var(--teal)">■</span> Sequential request &amp; issue</span>
          <span class="chip"><span class="mono" style="color:var(--blue)">■</span> Concurrent active issue states</span>
          <span class="chip"><span class="mono" style="color:var(--violet)">■</span> Return, inspection &amp; audit closure</span>
        </div>
      </div>`,
  },

  /* 10 — Inventory model (Fix 5: "Individually tracked assets carry their own physical-unit history") */
  {
    title: 'Inventory model',
    html: `
      ${head('Data model', 'Component Type ≠ Physical Asset', 'Separating catalogue definitions from individual physical hardware units.')}
      <div class="body">
        <div class="grid g2 reveal">
          <div class="card a-blue"><div class="eyebrow" style="color:var(--blue)">Component Type</div><h3>Catalogue Definition</h3><p>Arduino Uno · ESP32 · Ultrasonic Sensor HC-SR04 · Resistor · LED</p><p style="margin-top:8px">Defines category, specifications, pinouts, pin compatibility, datasheet links, and catalogue alternatives.</p></div>
          <div class="card a-teal"><div class="eyebrow">Physical Asset</div><h3>Serialized Unit Instance</h3><p class="mono" style="color:var(--text)">ARDUINO-001 · ARDUINO-002 · ESP32-014</p><p style="margin-top:8px">Carries current lab location, operational status, custody history, defect logs, and maintenance records.</p></div>
        </div>
        <div class="grid g3 reveal" style="margin-top:20px">
          <div class="card a-teal accent-top"><div class="icon">${I.hash}</div><h3>Individually Tracked</h3><p><b style="color:var(--text)">Individually tracked assets carry their own physical-unit history.</b> Examples: Arduino, ESP32, Raspberry Pi boards.</p><div style="margin-top:8px">${B.pending('Classification: UAQ7')}</div></div>
          <div class="card a-blue accent-top"><div class="icon">${I.layers}</div><h3>Quantity Tracked</h3><p>Standard components where bulk count matters rather than individual unit history (e.g. passive sensors, discrete ICs).</p></div>
          <div class="card a-violet accent-top"><div class="icon">${I.drop}</div><h3>Consumable Items</h3><p>Components not expected back (e.g. solder wire, discrete resistors, LEDs). Exact rules subject to UAQ7.</p></div>
        </div>
      </div>`,
  },

  /* 11 — Availability & State Model (Fix 6, 7: State separation & FIFO wording) */
  {
    title: 'Availability & state model',
    html: `
      <div class="slide-badge">${B.assumption('V1 rule')}</div>
      ${head('State model', 'Explicit separation of catalogue, asset and request states', 'Unavailable items are never submitted as normal issue requests.')}
      <div class="body">
        <div class="grid g3 reveal" style="flex:1">
          <div class="card a-teal accent-top">
            <div class="eyebrow" style="color:var(--teal)">Catalogue / Stock Status</div>
            <div class="state-category" style="margin-top:10px">
              <div class="state-pill"><span>Stocked</span><small>In Catalogue</small></div>
              <div class="state-pill"><span>Not Stocked</span><small>External / Unstocked</small></div>
            </div>
            <p style="margin-top:14px;font-size:14.5px;color:var(--muted)">Determines whether an item exists in the department catalogue. If unstocked, logged as <b style="color:var(--text)">unmet demand</b>.</p>
          </div>

          <div class="card a-blue accent-top">
            <div class="eyebrow" style="color:var(--blue)">Physical / Inventory State</div>
            <div class="state-category" style="margin-top:10px">
              <div class="state-pill"><span>Available</span><small>In Lab Storage</small></div>
              <div class="state-pill"><span>Issued</span><small>Active Custody</small></div>
              <div class="state-pill"><span>Defective / Repair</span><small>Out of Service</small></div>
              <div class="state-pill"><span>Unavailable</span><small>Decommissioned</small></div>
            </div>
            <p style="margin-top:14px;font-size:14.5px;color:var(--muted)">Reflects the actual physical condition of individual hardware units.</p>
          </div>

          <div class="card a-violet accent-top">
            <div class="eyebrow" style="color:var(--violet)">Request / Reservation State</div>
            <div class="state-category" style="margin-top:10px">
              <div class="state-pill"><span>Fulfillable</span><small>Ready for Request</small></div>
              <div class="state-pill"><span>Reservation Queued</span><small>FIFO Order</small></div>
              <div class="state-pill"><span>Reservation Ready</span><small>Available for Pickup</small></div>
              <div class="state-pill"><span>Expired / Cancelled</span><small>Closed Queue</small></div>
            </div>
            <p style="margin-top:14px;font-size:14.5px;color:var(--muted)"><b style="color:var(--text)">Join the FIFO queue for eligible reservation requests.</b> Expiry &amp; non-collection rules subject to UAQ11.</p>
          </div>
        </div>
      </div>`,
  },

  /* 12 — Approval & physical issue (Fix 8: Approval routing clarity) */
  {
    title: 'Approval & physical issue',
    html: `
      <div class="slide-badge">${B.pending('Routing: UAQ5')}</div>
      ${head('Workflow', 'Approval routing is configurable. Physical issue stays human.', 'V1 proposal: routing is stored as configuration, pending formal faculty confirmation.')}
      <div class="body" style="gap:24px">
        <div class="reveal">${flow([
          { k: 'SUBMIT', t: 'Student Submits' },
          { k: 'REVIEW', t: 'Faculty Mentor Review', cls: 'hl a-violet' },
          { k: 'POLICY CHECK', t: 'HoD (If Configured)', cls: 'hl a-amber' },
          { k: 'APPROVAL', t: 'Approved Request', cls: 'hl a-green' },
          { k: 'VERIFY', t: 'Lab Assistant Verification', cls: 'hl a-teal' },
          { k: 'HANDOVER', t: 'Physical Issue', cls: 'hl a-teal' },
        ])}</div>
        <div class="grid g3 reveal">
          <div class="card a-violet"><h3>Faculty mentor can</h3><ul><li>Approve request</li><li>Reject request with reason</li><li>Modify quantities / component choices</li></ul></div>
          <div class="card a-teal"><h3>At issue, the assistant</h3><ul><li>Physically verifies the requested units</li><li>Selects the specific unit (e.g. ARDUINO-007)</li><li>Sets duration and creates the <b style="color:var(--text)">issue transaction</b></li></ul></div>
          <div class="card a-rose"><h3>Open policy questions</h3><ul><li>Is HoD approval required for high-value items?</li><li>Do multiple mentors have equal authority?</li><li>Can an approval be revoked prior to issue?</li></ul></div>
        </div>
        <p class="reveal muted small">Note: Approval routing is fully configurable in software and will adapt to confirmed departmental rules.</p>
      </div>`,
  },

  /* 13 — Reminders, extensions, escalation (Fix 9: Explicit V1 assumption label) */
  {
    title: 'Due dates, reminders & extensions',
    html: `
      <div class="slide-badge">${B.assumption('Timings: UAQ12 / UAQ16')}</div>
      ${head('Accountability', 'Automated reminder schedule & extension control')}
      <div class="body">
        <div class="timeline reveal">
          <div class="tick" style="--c:var(--teal)"><div class="dot"></div><b>T − 7</b><span>days before</span></div>
          <div class="tick" style="--c:var(--teal)"><div class="dot"></div><b>T − 3</b><span>days before</span></div>
          <div class="tick" style="--c:var(--blue)"><div class="dot"></div><b>T − 1</b><span>day before</span></div>
          <div class="tick" style="--c:var(--amber)"><div class="dot"></div><b>Due Date</b><span>return deadline</span></div>
          <div class="tick" style="--c:var(--rose)"><div class="dot"></div><b>Daily</b><span>while overdue</span></div>
        </div>
        <div class="grid g3 reveal" style="margin-top:40px">
          <div class="card a-blue"><div class="icon">${I.bell}</div><h3>Notification Channels</h3><p>In-app dashboard alerts plus automated email dispatch from dedicated project address. Notices halt upon return or approved extension.</p></div>
          <div class="card a-violet"><div class="icon">${I.spark}</div><h3>Extension Handling</h3><p>Separate auditable record: request → faculty mentor approval → assistant updates due date. Approved extensions do not incur overdue penalties.</p></div>
          <div class="card a-amber"><div class="icon">${I.users}</div><h3>Overdue Escalation</h3><p>Assistant monitors overdue cases; faculty review overdue alerts and decide escalation. Escalation is human-governed, not an automated punishment.</p></div>
        </div>
      </div>`,
  },

  /* 14 — Return, inspection & penalties (Fix 10: Distinguish penalty vs proposed REPO) */
  {
    title: 'Return, inspection & penalties',
    html: `
      ${head('Closure', 'Every return is physically inspected and recorded')}
      <div class="body" style="gap:24px">
        <div class="reveal">${flow([
          { t: 'Student Returns Hardware' },
          { t: 'Assistant Inspects Unit', cls: 'hl a-teal' },
          { t: 'Condition Recorded' },
          { t: 'Photo Evidence (If Damaged)' },
          { t: 'Inventory State Updated', cls: 'hl a-teal' },
          { t: 'Student Acknowledged' },
        ])}</div>
        <div class="grid g3 reveal">
          <div class="card a-rose accent-top"><h3>Defect / Damage / Loss</h3><p>Records asset ID, student, project, original issue date, inspecting assistant, condition description, and optional photo. Moves asset to Defective or Under Repair. <b style="color:var(--text)">Audit history preserved.</b></p></div>
          <div class="card a-amber accent-top"><h3>Penalties (Policy-Dependent)</h3><p>Formal records for unreturned, damaged, or late items. Recorded by assistant; faculty/admin can waive or modify. <b style="color:var(--text)">No online payment gateway</b> in V1.</p><div style="margin-top:10px">${B.pending('Fee / policy: UAQ13')}</div></div>
          <div class="card a-violet accent-top"><h3>REPO: Reputation Score</h3><p><b style="color:var(--text)">Proposed reputation score — formula and effect pending faculty confirmation (UAQ15).</b> Designed to be transparent, explainable, and challengeable.</p><div style="margin-top:10px">${B.pending('Status: Proposed Concept')}</div></div>
        </div>
      </div>`,
  },

  /* 15 — AI boundary (Fix 11: Grounding accuracy & validation flow) */
  {
    title: 'AI: advisory only',
    html: `
      ${head('Intelligence', 'AI helps students choose. The database decides.', 'AI is deliberately a bounded advisory layer, not the source of institutional truth.')}
      <div class="body">
        <div class="grid g2 reveal" style="flex:1">
          <div class="card a-green accent-top"><div class="icon">${I.check}</div><h3>AI May</h3><ul>
            <li>Explain component functionality and pinout concepts</li><li>Interpret student project requirements</li><li>Suggest candidate catalogue alternatives</li><li>Help students compare technical specifications</li></ul>
            <div class="ai-flow">
              <div class="ai-node">Student Requirement</div><div class="ai-arrow">→</div>
              <div class="ai-node">Catalogue Retrieval</div><div class="ai-arrow">→</div>
              <div class="ai-node">DB Record Validation</div><div class="ai-arrow">→</div>
              <div class="ai-node">Display</div>
            </div>
            <p class="small muted" style="margin-top:10px"><b style="color:var(--text)">AI suggestions are generated from catalogue-backed candidates and validated against current database records before being shown.</b></p>
          </div>
          <div class="card a-rose accent-top"><div class="icon">${I.x}</div><h3>AI May Never</h3><ul>
            <li>Determine whether an item exists in stock</li><li>Override inventory or asset availability states</li><li>Issue hardware or approve requests</li><li>Reorder or modify reservation queues</li><li>Decide or calculate financial penalties</li><li>Act as an institutional or departmental authority</li></ul>
            <div class="card" style="margin-top:18px;padding:14px 18px;background:rgba(251,113,133,0.06);border-color:rgba(251,113,133,0.3)">
              <p style="color:var(--text);font-size:14.5px"><b>Core Guardrail:</b> The LLM is never the source of inventory truth.</p>
            </div>
          </div>
        </div>
        <div class="card reveal" style="margin-top:18px;padding:16px 22px"><div class="row" style="align-items:center;gap:16px"><div class="icon a-teal" style="margin:0">${I.chart}</div><p><b style="color:var(--text)">Unmet-Demand Analytics:</b> Repeated requests for unstocked components are aggregated to highlight student demand trends for departmental procurement review. Plain database aggregation — zero AI required.</p></div></div>
      </div>`,
  },

  /* 16 — Architecture (Fix 12: Proposed marking & API phrasing) */
  {
    title: 'Proposed architecture',
    html: `
      <div class="slide-badge">${B.proposed()}</div>
      ${head('Architecture', 'Proposed technical stack: FastAPI, PostgreSQL, MongoDB, React', 'Clean modular architecture separating clients, service layers, and storage.')}
      <div class="body">
        <div class="arch reveal">
          <div class="col">
            <div class="layer-title">Clients &amp; Integrations</div>
            <div class="box primary a-blue" style="--accent:var(--blue)"><b>Web Client (React)</b><span>Single Page Application with role-tailored views for Student, Faculty, Assistant, Admin</span></div>
            <div class="box"><b>Email Service</b><span>Automated notifications from dedicated system email</span></div>
            <div class="layer-title" style="margin-top:8px">External Boundaries</div>
            <div class="box"><b>SMTP Gateway</b><span>Outbound reminders &amp; verification codes</span></div>
            <div class="box"><b>LLM API Adapter</b><span>Read-only catalogue advice adapter</span></div>
            <div class="box"><b>Excel Importer</b><span>Bulk ingestion of existing lab inventories</span></div>
          </div>
          <div class="api-shell">
            <div class="api-head"><b>Python API — FastAPI</b><span class="mono small muted">HTTP API · JSON · JWT Auth</span></div>
            <div class="modules">
              <div class="box"><b>Auth &amp; RBAC</b><span>Server-side token verification &amp; roles</span></div>
              <div class="box"><b>Projects &amp; Teams</b><span>Team members, mentors, requirements</span></div>
              <div class="box"><b>Catalogue &amp; Assets</b><span>Types, units, serialized tracking</span></div>
              <div class="box"><b>Workflow Engine</b><span>Configurable multi-tier approval</span></div>
              <div class="box"><b>Issue &amp; Return</b><span>Atomic issuance, inspection, defects</span></div>
              <div class="box"><b>Reservations</b><span>FIFO queue &amp; audited assistant override</span></div>
              <div class="box"><b>Scheduler</b><span>Automated reminder &amp; overdue cron jobs</span></div>
              <div class="box"><b>Notifications</b><span>In-app badges &amp; email queue dispatch</span></div>
              <div class="box"><b>Analytics</b><span>Demand, utilisation, custody reports</span></div>
              <div class="box"><b>AI Advisory</b><span>Catalogue-grounded candidate advice</span></div>
            </div>
          </div>
          <div class="col">
            <div class="layer-title">Data Storage</div>
            <div class="box primary" style="--accent:var(--teal);flex:1"><b>PostgreSQL</b><span><b>System of Record</b> for transactional data: users, projects, requests, assets, issues, reservations, extensions, penalties.</span><span style="margin-top:8px;color:var(--teal)">Constraints · Foreign Keys · Stored Routines</span></div>
            <div class="box primary" style="--accent:var(--violet);flex:1"><b>MongoDB</b><span><b>Event &amp; Document Store</b>: audit trails, notification logs, unmet-demand events, AI logs, evidence metadata.</span><span style="margin-top:8px;color:var(--violet)">Aggregation Pipelines</span></div>
            <div class="box"><b>Deployment Target</b><span>Cloud VM with synthetic data → College server upon approval</span></div>
          </div>
        </div>
      </div>`,
  },

  /* 17 — Data strategy (Fix 13, 14, 15, 16: Concurrency, routines, DB roles, event consistency) */
  {
    title: 'Data strategy',
    html: `
      <div class="slide-badge">${B.proposed()}</div>
      ${head('Data strategy', 'PostgreSQL owns workflow state. MongoDB stores event records.', 'The split follows the fundamental difference between transactional integrity and event/document workloads.')}
      <div class="body">
        <div class="grid g2 reveal">
          <div class="card a-teal accent-top"><div class="icon">${I.db}</div><h3>PostgreSQL: Transactional System of Record</h3>
            <ul><li><b style="color:var(--text)">Serialized Concurrency:</b> Concurrent issuance is serialized per asset using database constraints, row-level locking and transactional updates.</li>
            <li><b style="color:var(--text)">Controlled Issuance Routine:</b> Database routine validates availability, locks the eligible asset, creates the issue transaction and commits consistently.</li>
            <li><b style="color:var(--text)">Relational Joins:</b> Project → members → requests → issues → physical assets → lab locations.</li>
            <li><b style="color:var(--text)">Aggregations &amp; Subqueries:</b> Overdue issues per lab, students with repeat delays.</li></ul></div>
          <div class="card a-violet accent-top"><div class="icon">${I.layers}</div><h3>MongoDB: Event / Document Analytics Store</h3>
            <ul><li><b style="color:var(--text)">Polymorphic Audit Events:</b> Flexible event payloads (approvals, overrides, transfers, role assignments).</li>
            <li><b style="color:var(--text)">Notification History:</b> Delivery tracking and user notification timelines.</li>
            <li><b style="color:var(--text)">Aggregation Pipelines:</b> Most-requested unstocked components per month for procurement insight.</li>
            <li><b style="color:var(--text)">Turnaround Analytics:</b> Reservation wait-time distributions and asset utilisation rates.</li></ul></div>
        </div>
        <div class="card reveal" style="margin-top:18px;padding:16px 24px"><p><b style="color:var(--text)">Event Consistency Boundary:</b> PostgreSQL remains authoritative. MongoDB records events after the authoritative transaction through reliable event delivery. MongoDB never determines business state.</p></div>
      </div>`,
  },

  /* 18 — Security & data protection (Fix 17: Proposed controls & synthetic data) */
  {
    title: 'Security & data protection',
    html: `
      ${head('Security', 'Proposed controls: least privilege, full audit trail, synthetic cloud data')}
      <div class="body">
        <div class="grid g3 reveal" style="flex:1">
          <div class="card a-teal"><div class="icon">${I.shield}</div><h3>Access Control</h3><ul><li>Server-side RBAC enforced on every API route</li><li>Students see only projects they are authorized to access</li><li>Faculty see only projects they are authorized to access</li><li>Assistants manage only assigned department labs</li></ul></div>
          <div class="card a-blue"><div class="icon">${I.hash}</div><h3>Input &amp; Data Safety</h3><ul><li>Strict schema validation on every payload</li><li>Parameterized SQL and input validation to mitigate SQL injection</li><li>Hashed passwords (bcrypt) &amp; rate-limited auth</li><li>Restricted defect evidence file uploads</li><li>API responses return only necessary data fields</li></ul></div>
          <div class="card a-violet"><div class="icon">${I.book}</div><h3>Auditability</h3><ul><li>Approvals, issues, overrides, transfers, and penalties are permanently logged</li><li>Workflow transactions are never silently overwritten</li><li>Admin role is transferable and auditable</li></ul></div>
        </div>
        <div class="grid g2 reveal" style="margin-top:18px">
          <div class="card a-amber"><h3>Synthetic Cloud Data</h3><p>Cloud demonstration uses synthetic data only. Production handling of institutional PII is subject to college privacy/security approval (UAQ17).</p></div>
          <div class="card a-rose"><h3>Replaceable Authentication</h3><p>V1 uses local login (PRN for students, email for staff). Architecture allows straightforward adapter replacement for College SSO (UAQ1).</p></div>
        </div>
      </div>`,
  },

  /* 19 — Live demo (Fix 18: "Planned live demonstration") */
  {
    title: 'Planned live demonstration',
    html: `
      ${head('Live demonstration', 'Planned live demonstration', 'End-to-end scenario to be demonstrated on the live prototype deployment:')}
      <div class="body" style="gap:20px">
        <div class="reveal">${flow([
          { k: 'STUDENT', t: 'Create project, add team &amp; mentor' },
          { k: 'STUDENT', t: 'Select Arduino Uno ×2, Ultrasonic ×4' },
          { k: 'SYSTEM', t: 'Displays live availability &amp; alternatives', cls: 'hl a-teal' },
          { k: 'FACULTY', t: 'Review &amp; approve project request', cls: 'hl a-violet' },
          { k: 'ASSISTANT', t: 'Verify hardware, assign units, issue', cls: 'hl a-teal' },
        ])}</div>
        <div class="reveal">${flow([
          { k: 'SYSTEM', t: 'Due date set, reminder notification fires', cls: 'hl a-blue' },
          { k: 'STUDENT', t: 'Submit extension request, approved', cls: 'hl a-violet' },
          { k: 'STUDENT', t: 'Physical return to department lab' },
          { k: 'ASSISTANT', t: 'Inspect: Working vs Defective logged', cls: 'hl a-teal' },
          { k: 'SYSTEM', t: 'Inventory updated, audit log &amp; history closed', cls: 'hl a-blue' },
        ])}</div>
        <div class="grid g2 reveal" style="margin-top:6px">
          <div class="card a-amber"><h3>Exception Flow: Currently Issued</h3><p>A second student sees "Currently issued" and joins the FIFO reservation queue. When returned, the first student in queue is notified.</p></div>
          <div class="card a-rose"><h3>Exception Flow: Not Stocked</h3><p>System suggests catalogue alternatives. If unavailable, logs an unmet-demand event for departmental procurement visibility.</p></div>
        </div>
      </div>`,
  },

  /* 20 — Research Context (Fix 20: CCE Literature Survey Slide) */
  {
    title: 'Research context',
    html: `
      <div class="slide-badge">${B.confirmed('CCE Literature Context')}</div>
      ${head('Academic context', 'Research context & existing literature', 'Situating LabTrack within existing laboratory management and resource allocation literature.')}
      <div class="body">
        <div class="grid g2 reveal" style="flex:1">
          <div class="card a-blue accent-top">
            <div class="eyebrow" style="color:var(--blue)">Existing Literature &amp; Systems</div>
            <ul style="margin-top:10px">
              <li><b>Static Inventory Systems:</b> Focus primarily on stock levels and reorder thresholds without academic project context.</li>
              <li><b>General Resource Reservation:</b> Manage room bookings or library assets, lacking multi-week hardware lifecycle and defect tracking.</li>
              <li><b>RFID / IoT Tracking:</b> Focus on hardware localization without integrating multi-tier faculty approval or student team accountability.</li>
            </ul>
          </div>
          <div class="card a-teal accent-top">
            <div class="eyebrow" style="color:var(--teal)">LabTrack's Integrated Focus</div>
            <ul style="margin-top:10px">
              <li><b>Project-Bound Lifecycle:</b> Hardware custody tied to validated academic projects, teams, and faculty mentors.</li>
              <li><b>Multi-Tier Workflow Authority:</b> Configurable faculty review, HoD governance, and physical assistant verification.</li>
              <li><b>Serialized Concurrency &amp; FIFO:</b> Race-condition-free asset issuance with audited reservation queues.</li>
              <li><b>Demand &amp; Accountability Analytics:</b> Unmet demand logging to inform department procurement decisions.</li>
            </ul>
          </div>
        </div>
        <div class="card reveal" style="margin-top:18px;padding:14px 22px">
          <p class="small muted"><b style="color:var(--text)">Synthesis:</b> Rather than asserting an absence of prior work, LabTrack synthesizes inventory tracking, workflow approval, automated reminders, and audit trails into a single unified academic laboratory workflow.</p>
        </div>
      </div>`,
  },

  /* 21 — Academic mapping (Fix 19: Exact DCDS Rubric mapping) */
  {
    title: 'Academic mapping',
    html: `
      ${head('Academic relevance', 'How LabTrack will address the rubric', 'Planned coverage mapped directly to official evaluation guidelines.')}
      <div class="body">
        <div class="row reveal" style="flex:1;gap:24px">
          <div class="card fill" style="padding:20px 10px 10px">
            <div class="eyebrow" style="padding-left:18px">DCDS Lab ESE · 10 Marks · 40% Weightage</div>
            <table class="t">
              <thead><tr><th>Rubric Criterion</th><th style="text-align:center">Marks</th><th>Planned V1 Implementation</th></tr></thead>
              <tbody>
                <tr><td>Application Design &amp; Functionality</td><td class="marks">2</td><td>Role-based dashboards, full lifecycle, modular service architecture</td></tr>
                <tr><td>Python Programming Implementation</td><td class="marks">2</td><td>OOP classes, exception handling, modular packages, Excel ingestion</td></tr>
                <tr><td>Database Integration (SQL &amp; NoSQL)</td><td class="marks">2</td><td>PostgreSQL relational schema + MongoDB event &amp; audit store</td></tr>
                <tr><td>Advanced Database Querying &amp; Retrieval</td><td class="marks">2</td><td>Complex joins, subqueries, grouping, stored routines, Mongo aggregations</td></tr>
                <tr><td>Code Quality, Documentation &amp; UI</td><td class="marks">1</td><td>Clean UI, structured repository, comprehensive markdown context docs</td></tr>
                <tr><td>Testing, Validation, Security &amp; Errors</td><td class="marks">1</td><td>Parameterized queries, server-side RBAC, validation schemas, unit tests</td></tr>
              </tbody>
            </table>
          </div>
          <div class="card" style="width:480px;padding:20px 10px 10px">
            <div class="eyebrow" style="padding-left:18px">CCE Evaluation · 30 Marks · CO3 / CO4</div>
            <table class="t">
              <thead><tr><th>Component</th><th style="text-align:center">Marks</th><th>Coverage</th></tr></thead>
              <tbody>
                <tr><td>Topic Submission</td><td class="marks">5</td><td>Unified CCE + DCDS Proposal</td></tr>
                <tr><td>Research / Literature Survey</td><td class="marks">5</td><td>Literature context &amp; gap analysis</td></tr>
                <tr><td>Presentation Skills</td><td class="marks">5</td><td>Structured slide deck &amp; architecture</td></tr>
                <tr><td>Running Example (Live Cloud)</td><td class="marks">10</td><td>Full cloud prototype demonstration</td></tr>
                <tr><td>Viva Voce</td><td class="marks">5</td><td>Technical defense &amp; Q&amp;A</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>`,
  },

  /* 22 — Timeline & Scope Priorities (Fix 21: Must vs Should vs Cut First) */
  {
    title: 'Delivery plan',
    html: `
      <div class="slide-badge">${B.proposed('Proposed plan')}</div>
      ${head('Timeline', '4-Week delivery plan & feature prioritization', 'Working backwards from the DCDS Lab ESE schedule.')}
      <div class="body">
        <div class="grid g4 reveal" style="flex:1">
          <div class="card a-teal accent-top"><div class="eyebrow">Week 1</div><h3>Foundation</h3><ul><li>Faculty confirmation on P0 rules</li><li>Schema &amp; API specifications</li><li>DB migrations, Auth &amp; RBAC</li><li>Catalogue &amp; Excel importer</li></ul></div>
          <div class="card a-blue accent-top"><div class="eyebrow" style="color:var(--blue)">Week 2</div><h3>Core Lifecycle</h3><ul><li>Project &amp; team management</li><li>Request → approval workflow</li><li>Controlled issuance routine</li><li>Role-tailored dashboards</li></ul></div>
          <div class="card a-violet accent-top"><div class="eyebrow" style="color:var(--violet)">Week 3</div><h3>Accountability</h3><ul><li>Reminder &amp; extension engine</li><li>FIFO reservation queue</li><li>Return &amp; defect inspection</li><li>Audit trails &amp; Mongo pipelines</li></ul></div>
          <div class="card a-amber accent-top"><div class="eyebrow" style="color:var(--amber)">Week 4</div><h3>Harden &amp; Ship</h3><ul><li>AI advisory adapter</li><li>Testing, security &amp; validation</li><li>Cloud prototype deployment</li><li>Documentation &amp; viva prep</li></ul></div>
        </div>
        <div class="card reveal" style="margin-top:18px;padding:16px 24px"><p><b style="color:var(--text)">Scope Discipline (Triage Order):</b> <b>Must-Have:</b> Auth, RBAC, DB schemas, Catalogue, Projects, Requests, Approval, Issue/Return, PostgreSQL, MongoDB, Advanced queries, Security, Cloud VM. <b>Should-Have:</b> FIFO Reservations, Reminders, Extensions, Defect handling. <b>Cut First If Time Runs Short:</b> REPO scoring, AI advisory layer, Asset transfers, advanced analytics. The core lifecycle and DCDS database requirements are never cut.</p></div>
      </div>`,
  },

  /* 23 — Out of scope (Fix 22: Corrected extensibility statement) */
  {
    title: 'Not in V1',
    html: `
      <div class="slide-badge">${B.future()}</div>
      ${head('Scope discipline', 'Deliberately out of scope for V1', 'Strict scope boundaries to ensure timely delivery and rock-solid software quality.')}
      <div class="body">
        <div class="grid g4 reveal">
          ${[
            'Native mobile apps / Play Store release',
            'Cabinet / shelf / drawer sensor bins',
            'Full procurement purchasing workflow',
            'Payment gateway & fine collection',
            'Formal dispute / arbitration tribunals',
            'Enterprise accounting & depreciation',
            'Full college SSO (until confirmed)',
            'Cross-department asset sharing',
            'Manufacturer warranty claims tracking',
            'Heavy predictive ML models',
            'Physical register legacy OCR migration',
            'Real student PII on external servers',
          ].map((t) => `<div class="card a-violet" style="padding:18px 20px"><p style="color:var(--text);font-size:15.5px">${t}</p></div>`).join('')}
        </div>
        <div class="card reveal" style="margin-top:24px;padding:16px 24px;border-color:rgba(167,139,250,0.3)">
          <p class="lead" style="margin:0;font-size:18px"><b style="color:var(--text)">Architectural Extensibility:</b> V1 is intentionally bounded. The core model is designed to remain extensible, although some future features may require additional schema or workflow changes.</p>
        </div>
      </div>`,
  },

  /* 24 — Faculty decisions (Fix 23: Condensed 8 High-Priority Decisions) */
  {
    title: 'Faculty decisions (P0)',
    html: `
      <div class="slide-badge">${B.pending('P0 Decisions')}</div>
      ${head('Decisions we need from you', 'High-priority institutional policy questions (P0)', 'Key decisions required to finalize database constraints and workflow logic.')}
      <div class="body">
        <div class="grid g4 reveal" style="gap:14px;flex:1">
          <div class="card q"><div class="qid">UAQ5 · APPROVAL ROUTE</div><h3>Approval Hierarchy</h3><p>Is HoD approval required for specific assets? Do co-mentors have equal authority? Can approvals be revoked?</p></div>
          <div class="card q"><div class="qid">UAQ12 · BORROWING</div><h3>Duration &amp; Extensions</h3><p>Standard borrowing period (e.g. 14 days)? Maximum allowed extensions? Who approves extensions?</p></div>
          <div class="card q"><div class="qid">UAQ13 · PENALTIES</div><h3>Late / Damage Policy</h3><p>Are financial penalties levied, or purely academic blocks? Who has authority to waive or reduce penalties?</p></div>
          <div class="card q"><div class="qid">UAQ16 · REMINDERS</div><h3>Reminder Schedule</h3><p>Proposed T-7, T-3, T-1 schedule acceptable? At what overdue threshold should mentors/HoD be notified?</p></div>
          <div class="card q"><div class="qid">UAQ7 · TRACKING</div><h3>Item Classification</h3><p>Which items are individually tracked (serialized) vs quantity-tracked vs non-returnable consumables?</p></div>
          <div class="card q"><div class="qid">UAQ8 · ASSET IDS</div><h3>Existing Identifiers</h3><p>Do existing lab registers use legacy barcodes or serial tags that LabTrack must preserve?</p></div>
          <div class="card q"><div class="qid">UAQ1 · AUTHENTICATION</div><h3>Identity &amp; Master Data</h3><p>Can LabTrack integrate with college directory services, or utilize local PRN/email credentials for V1?</p></div>
          <div class="card q"><div class="qid">UAQ17/18 · CLOUD &amp; PRIVACY</div><h3>Hosting &amp; Privacy</h3><p>Cloud demonstration with synthetic data acceptable? Requirements for future internal server deployment?</p></div>
        </div>
        <p class="reveal muted small" style="margin-top:14px">Note: Complete 22-question questionnaire (UAQ1–UAQ22) is documented in the master project context.</p>
      </div>`,
  },

  /* 25 — The ask (Fix 24: "What we need today") */
  {
    title: 'What we need today',
    html: `
      ${head('Approval request', 'What we need today')}
      <div class="body" style="justify-content:center">
        <div class="grid g2 reveal">
          <div class="card a-teal accent-top"><div class="icon">${I.check}</div><h3>1 · Confirm the Project Topic</h3><p>LabTrack as our unified project for both Cloud Computing Essentials (CCE) and DCDS Lab ESE.</p></div>
          <div class="card a-blue accent-top"><div class="icon">${I.layers}</div><h3>2 · Validate the Workflow</h3><p>Review and validate the proposed lifecycle: approval routing, borrowing limits, return inspection, and escalation rules.</p></div>
          <div class="card a-rose accent-top"><div class="icon">${I.users}</div><h3>3 · Confirm Institutional Constraints</h3><p>Provide guidance on authentication, student data privacy, cloud demonstration, and eventual campus deployment.</p></div>
          <div class="card a-amber accent-top"><div class="icon">${I.building}</div><h3>4 · Connect Us with One Lab Assistant</h3><p>Facilitate a short consultation with a lab assistant to review existing register formats and inventory classification.</p></div>
        </div>
        <div class="card reveal" style="margin-top:24px;padding:16px 24px;background:rgba(91,140,255,0.06);border-color:rgba(91,140,255,0.3)">
          <div class="row" style="align-items:center;justify-content:space-between">
            <span style="font-size:16px;color:var(--text)"><b>Proposed Technical Stack:</b> FastAPI (Python) + PostgreSQL + MongoDB + React SPA</span>
            <span class="chip good">Open for Technical Feedback</span>
          </div>
        </div>
        <p class="pitch reveal" style="margin-top:20px;font-size:32px">LabTrack turns fragmented laboratory hardware handling into a <span class="grad-text">traceable digital lifecycle</span>.</p>
      </div>`,
  },

  /* 26 — Thank you */
  {
    title: 'Thank you',
    cls: 'title-slide',
    html: `
      <div class="logo reveal">
        <div class="logo-mark"><svg viewBox="0 0 24 24"><path d="M6 4v16h12"/><circle cx="13" cy="10" r="2.4"/></svg></div>
        <span class="mono muted">LABTRACK · PROJECT PROPOSAL V1.1</span>
      </div>
      <h1 class="reveal" style="font-size:104px">Thank you.</h1>
      <p class="subtitle reveal">Questions, suggestions &amp; feedback welcome.</p>
      <div class="legend reveal" style="margin-top:28px">${B.confirmed('Observed')}${B.assumption('V1 Assumption')}${B.pending('Pending Confirmation')}${B.proposed('Proposed Design')}${B.future('Future Scope')}</div>`,
  },
];
