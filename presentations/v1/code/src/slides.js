/**
 * LabTrack pitch-deck content.
 *
 * Source of truth: LabTrack_COMPLETE_Master_Context_Doc.md.
 * Labelling rule (from the doc): never present an assumption as institutional fact.
 *   confirmed  = stated/observed by the project team or official rubric
 *   assumption = V1 working assumption
 *   pending    = needs faculty / college confirmation
 *   proposed   = our design proposal, submitted for approval
 *   future     = explicitly out of V1 scope
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
  confirmed: (t = 'Confirmed by team') => `<span class="badge b-confirmed">${t}</span>`,
  assumption: (t = 'V1 assumption') => `<span class="badge b-assumption">${t}</span>`,
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
        <span class="mono muted">PROJECT PROPOSAL · FOR FACULTY APPROVAL</span>
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
      ${head('Before we begin', 'What we are asking you to approve', 'This is a proposal, not a finished system. Every statement is labelled so that nothing we assumed is mistaken for college policy.')}
      <div class="body">
        <div class="grid g3 reveal">
          <div class="card a-green accent-top"><div class="badges" style="margin-bottom:14px">${B.confirmed('Observed / confirmed')}</div><p>Things the project team has directly observed in the current lab process, or that come from an official rubric.</p></div>
          <div class="card a-amber accent-top"><div class="badges" style="margin-bottom:14px">${B.assumption()}</div><p>Temporary working rules so development can start. They are configurable and will be replaced by your answers.</p></div>
          <div class="card a-rose accent-top"><div class="badges" style="margin-bottom:14px">${B.pending()}</div><p>Institutional decisions only faculty / college can make. Collected as questions at the end of the deck.</p></div>
          <div class="card a-blue accent-top"><div class="badges" style="margin-bottom:14px">${B.proposed()}</div><p>Our technical design choices: architecture, data model, tech stack. Open to feedback.</p></div>
          <div class="card a-violet accent-top"><div class="badges" style="margin-bottom:14px">${B.future()}</div><p>Ideas we discussed but are deliberately <b>not</b> building in V1.</p></div>
          <div class="card a-teal accent-top"><h3>Core principle</h3><p>Automate the work lab assistants already do by hand, <b style="color:var(--text)">without changing departmental policy</b> unless that policy is explicitly authorised.</p></div>
        </div>
      </div>`,
  },

  /* 03 — Current manual process */
  {
    title: 'Current manual process',
    html: `
      <div class="slide-badge">${B.confirmed('Observed by team')}</div>
      ${head('The problem', 'Today, lab hardware runs on email, notebooks and memory', 'The process we observed for a student project that needs components:')}
      <div class="body" style="gap:26px">
        <div class="reveal">${flow([
          { k: 'STEP 1', t: 'Student emails assistant + faculty', cls: 'manual' },
          { k: 'STEP 2', t: 'Assistant checks availability by hand', cls: 'manual' },
          { k: 'STEP 3', t: 'Reply with pickup info', cls: 'manual' },
          { k: 'STEP 4', t: 'Physical collection', cls: 'manual' },
          { k: 'STEP 5', t: 'Entry in notebook', cls: 'manual' },
        ])}</div>
        <div class="reveal">${flow([
          { k: 'STEP 6', t: 'Deadline given verbally / by email', cls: 'manual' },
          { k: 'STEP 7', t: 'Deadline tracked manually', cls: 'manual' },
          { k: 'STEP 8', t: 'Reminder emails sent by hand', cls: 'manual' },
          { k: 'STEP 9', t: 'Return + physical check', cls: 'manual' },
          { k: 'STEP 10', t: 'Defects handled by ad-hoc email', cls: 'manual' },
        ])}</div>
        <div class="grid g3 reveal" style="margin-top:8px">
          <div class="card a-amber"><h3>Inventory</h3><p>Partly maintained in <b style="color:var(--text)">Excel</b>, updated manually.</p></div>
          <div class="card a-amber"><h3>Issue history</h3><p>Partly kept in <b style="color:var(--text)">physical notebooks</b>.</p></div>
          <div class="card a-amber"><h3>Reservations</h3><p><b style="color:var(--text)">No unified queue</b> for components that are already issued.</p></div>
        </div>
      </div>`,
  },

  /* 04 — Pain points */
  {
    title: 'Who it hurts',
    html: `
      <div class="slide-badge">${B.confirmed('Observed by team')}</div>
      ${head('Consequences', 'Everyone pays for the missing system')}
      <div class="body">
        <div class="grid g4 reveal" style="flex:1">
          <div class="card a-teal"><div class="icon">${I.wrench}</div><h3>Lab assistants</h3><ul>
            <li>Manual availability checks</li><li>Repeated email threads</li><li>Notebook entries</li><li>Tracking many due dates</li><li>Manual reminders</li><li>Defect / loss records by hand</li></ul></div>
          <div class="card a-blue"><div class="icon">${I.user}</div><h3>Students</h3><ul>
            <li>Can't see what's available</li><li>Don't know which lab has it</li><li>Don't know whom to ask</li><li>No request status</li><li>No reservation queue</li><li>No borrowing history</li></ul></div>
          <div class="card a-violet"><div class="icon">${I.users}</div><h3>Faculty</h3><ul>
            <li>Requests buried in email</li><li>Project info fragmented</li><li>Approval status not central</li><li>Overdue cases need manual follow-up</li><li>No defect / penalty view</li></ul></div>
          <div class="card a-amber"><div class="icon">${I.building}</div><h3>Department</h3><ul>
            <li>Records split across Excel and notebooks</li><li>Weak traceability</li><li>Unmet demand is invisible</li><li>No utilisation insight</li><li>Weaker accountability</li></ul></div>
        </div>
      </div>`,
  },

  /* 05 — Before / After */
  {
    title: 'Before → After',
    html: `
      ${head('The proposal', 'One system for the entire component lifecycle', 'LabTrack is <b style="color:var(--text)">not</b> an inventory CRUD app. It digitises the full journey from project requirement to return and accountability.')}
      <div class="body center" style="display:flex">
        <div class="vs reveal" style="width:100%">
          <div class="card"><div class="eyebrow" style="color:var(--rose)">Before</div><div class="chips">
            <span class="chip bad">Email threads</span><span class="chip bad">Physical notebook</span><span class="chip bad">Excel inventory</span>
            <span class="chip bad">Manual reminders</span><span class="chip bad">Informal reservations</span><span class="chip bad">Ad-hoc defect handling</span></div></div>
          <div class="mid">LabTrack<br/><span style="font-size:16px;font-weight:500">centralised lifecycle</span></div>
          <div class="card"><div class="eyebrow">After</div><div class="chips">
            <span class="chip good">Visibility</span><span class="chip good">Traceability</span><span class="chip good">Automation</span>
            <span class="chip good">Accountability</span><span class="chip good">FIFO reservations</span><span class="chip good">Demand insight</span></div></div>
        </div>
      </div>
      <p class="footer-note">No performance-improvement numbers are claimed. Impact will only be reported if measured.</p>`,
  },

  /* 06 — Scale */
  {
    title: 'Target environment',
    html: `
      <div class="slide-badge">${B.confirmed('Approximate, per team')}</div>
      ${head('Scale', 'Sized for one department, built to move')}
      <div class="body">
        <div class="grid g4 reveal">
          <div class="card stat a-teal"><div class="num grad-text">8–10</div><div class="lbl">Labs</div></div>
          <div class="card stat"><div class="num grad-text">10–12</div><div class="lbl">Lab assistants</div></div>
          <div class="card stat"><div class="num grad-text">700–800</div><div class="lbl">Students</div></div>
          <div class="card stat"><div class="num grad-text">5–10</div><div class="lbl">Expected concurrent users</div></div>
        </div>
        <div class="grid g3 reveal" style="margin-top:26px">
          <div class="card a-blue"><h3>Prototype first</h3><p>V1 is a working prototype for demonstration and evaluation. Department adoption is a goal, <b style="color:var(--text)">not</b> an approval we have.</p></div>
          <div class="card a-blue"><h3>Web first</h3><p>A responsive web application. A native mobile app and Play Store release are future scope.</p></div>
          <div class="card a-blue"><h3>Portable</h3><p>Demonstrated on a cloud VM with synthetic data, and designed to move to college infrastructure if that's approved.</p></div>
        </div>
      </div>`,
  },

  /* 07 — Users & roles */
  {
    title: 'Users & roles',
    html: `
      ${head('Who uses it', 'Four roles, each with clear authority')}
      <div class="body">
        <div class="grid g4 reveal" style="flex:1">
          <div class="card a-blue accent-top"><div class="icon">${I.user}</div><h3>Student</h3><ul>
            <li>Create project, add team</li><li>Pick faculty mentor</li><li>Search catalogue &amp; availability</li><li>Request / reserve</li><li>Track due dates, extend</li><li>History, penalties, REPO</li></ul></div>
          <div class="card a-violet accent-top"><div class="icon">${I.users}</div><h3>Faculty</h3><ul>
            <li>Sees <b style="color:var(--text)">only</b> relevant projects</li><li>Approve / reject / modify</li><li>Overdue notifications</li><li>Escalation &amp; extensions</li><li>Defect / penalty visibility</li></ul></div>
          <div class="card a-teal accent-top"><div class="icon">${I.wrench}</div><h3>Lab Assistant</h3><ul>
            <li><b style="color:var(--text)">Authority over physical inventory</b></li><li>Verify &amp; issue items</li><li>Pick the actual asset</li><li>Set duration</li><li>Inspect returns, log defects</li><li>Transfers, FIFO override</li></ul></div>
          <div class="card a-amber accent-top"><div class="icon">${I.shield}</div><h3>Admin</h3><ul>
            <li>Users, roles, labs</li><li>Components &amp; assets</li><li>Config &amp; Excel import</li><li>Logs &amp; demo data</li><li>Role can be <b style="color:var(--text)">handed over</b>, not tied to one person</li></ul></div>
        </div>
        <div class="row reveal" style="margin-top:18px;align-items:center;gap:14px">${B.pending('HoD role in the approval chain: UAQ5')}<span class="muted small">The HoD's role in approvals and escalation is still to be confirmed. See the questions section.</span></div>
      </div>`,
  },

  /* 08 — Lifecycle */
  {
    title: 'End-to-end lifecycle',
    html: `
      ${head('The core idea', 'One project, one traceable lifecycle', 'Requests are tied to a <b style="color:var(--text)">project</b> (team + mentor + requirements), not sent as one-off student emails.')}
      <div class="body" style="justify-content:center">
        <div class="lifecycle reveal">
          <div class="node">Project created<span>team + mentor</span></div>
          <div class="node">Requirements<span>from catalogue</span></div>
          <div class="node">Availability check<span>qty · lab · assistant</span></div>
          <div class="node">Request<span>available items only</span></div>
          <div class="node">Approval<span>faculty workflow</span></div>
          <div class="node">Physical issue<span>by lab assistant</span></div>
          <div class="node">Active tracking<span>due date set</span></div>
          <div class="node phase-b">Reminders<span>scheduled</span></div>
          <div class="node phase-b">Extension<span>separate record</span></div>
          <div class="node phase-b">Reservation<span>FIFO queue</span></div>
          <div class="node phase-c">Return<span>student hands back</span></div>
          <div class="node phase-c">Inspection<span>condition + evidence</span></div>
          <div class="node phase-c">Defect / penalty<span>if applicable</span></div>
          <div class="node phase-c">History<span>never overwritten</span></div>
        </div>
        <div class="legend reveal" style="margin-top:26px">
          <span class="chip"><span class="mono" style="color:var(--teal)">■</span> Request &amp; issue</span>
          <span class="chip"><span class="mono" style="color:var(--blue)">■</span> Accountability while issued</span>
          <span class="chip"><span class="mono" style="color:var(--violet)">■</span> Return &amp; closure</span>
        </div>
      </div>`,
  },

  /* 09 — Inventory model */
  {
    title: 'Inventory model',
    html: `
      ${head('Data model', 'Component Type ≠ Physical Asset', 'Not every resistor needs a serial number, but every Arduino needs its own history.')}
      <div class="body">
        <div class="grid g2 reveal">
          <div class="card a-blue"><div class="eyebrow" style="color:var(--blue)">Component type</div><h3>The general item</h3><p>Arduino Uno · ESP32 · Ultrasonic sensor · Resistor · LED · Jumper wire</p><p style="margin-top:8px">Holds category, description, technical specs and alternatives.</p></div>
          <div class="card a-teal"><div class="eyebrow">Physical asset</div><h3>One real unit</h3><p class="mono" style="color:var(--text)">ARDUINO-001 · ARDUINO-002 · ESP32-014</p><p style="margin-top:8px">Has its own current lab, status, issue history, defects and transfers. Internal ID is unique; the manufacturer serial is optional.</p></div>
        </div>
        <div class="grid g3 reveal" style="margin-top:22px">
          <div class="card a-teal accent-top"><div class="icon">${I.hash}</div><h3>Individually tracked</h3><p>Arduino, ESP32, Raspberry Pi and other higher-value boards where unit-level history matters.</p></div>
          <div class="card a-blue accent-top"><div class="icon">${I.layers}</div><h3>Quantity tracked</h3><p>Resistors, capacitors, LEDs, jumper wires: only counts are tracked.</p></div>
          <div class="card a-violet accent-top"><div class="icon">${I.drop}</div><h3>Consumable</h3><p>Items not expected back. <span style="color:var(--rose)">Exact classification: UAQ7.</span></p></div>
        </div>
      </div>`,
  },

  /* 10 — Availability & request rules */
  {
    title: 'Availability & requests',
    html: `
      <div class="slide-badge">${B.assumption('V1 rule')}</div>
      ${head('Request logic', 'Unavailable items are never sent as normal requests')}
      <div class="body">
        <div class="grid g3 reveal" style="flex:1">
          <div class="card a-green accent-top"><div class="icon">${I.check}</div><h3>Available</h3><p>Shows quantity, current lab, responsible assistant and specs.</p><p style="margin-top:14px;color:var(--text)"><b>→ Student can request it</b></p></div>
          <div class="card a-amber accent-top"><div class="icon">${I.users}</div><h3>Exists but currently issued</h3><p>Shows status and expected return.</p><p style="margin-top:14px;color:var(--text)"><b>→ Join the FIFO reservation queue</b></p><p class="small" style="margin-top:8px">The assistant can override the order, but must record who, why and when.</p></div>
          <div class="card a-rose accent-top"><div class="icon">${I.x}</div><h3>Not stocked</h3><p>Shows unavailable and suggests alternatives.</p><p style="margin-top:14px;color:var(--text)"><b>→ If there's no usable alternative, log it as unmet demand</b></p><p class="small" style="margin-top:8px">This is demand insight only, not procurement.</p></div>
        </div>
        <div class="card reveal" style="margin-top:22px;padding:18px 24px">
          <div class="row" style="align-items:center;gap:12px;flex-wrap:wrap">
            <span class="mono small muted" style="margin-right:6px">AVAILABILITY STATES</span>
            <span class="chip">Available</span><span class="chip">Insufficient qty</span><span class="chip">Currently issued</span><span class="chip">Reserved</span>
            <span class="chip">Defective</span><span class="chip">Under repair</span><span class="chip">Out / unavailable</span><span class="chip">Not stocked</span>
          </div>
        </div>
      </div>`,
  },

  /* 11 — Approval & issuance */
  {
    title: 'Approval & physical issue',
    html: `
      <div class="slide-badge">${B.pending('Workflow: UAQ5')}</div>
      ${head('Workflow', 'Approval is configurable. Physical issue stays human.', 'The temporary V1 route, which will be replaced by whatever policy you confirm:')}
      <div class="body" style="gap:28px">
        <div class="reveal">${flow([
          { k: 'SUBMIT', t: 'Student' },
          { k: 'REVIEW', t: 'Faculty mentor', cls: 'hl a-violet' },
          { k: 'IF REQUIRED', t: 'HoD', cls: 'hl a-amber' },
          { k: 'RETURNS TO', t: 'Faculty', cls: 'hl a-violet' },
          { k: 'VERIFY', t: 'Lab Assistant', cls: 'hl a-teal' },
          { k: 'ISSUE', t: 'Physical hand-over', cls: 'hl a-teal' },
        ])}</div>
        <div class="grid g3 reveal">
          <div class="card a-violet"><h3>Faculty can</h3><ul><li>Approve</li><li>Reject (student is notified)</li><li>Modify quantities / items</li></ul></div>
          <div class="card a-teal"><h3>At issue, the assistant</h3><ul><li>Physically verifies the items</li><li>Selects the actual asset (e.g. ARDUINO-007)</li><li>Sets the duration, which creates an <b style="color:var(--text)">issue transaction</b></li></ul></div>
          <div class="card a-rose"><h3>Open questions</h3><ul><li>Is HoD approval always needed?</li><li>Do multiple mentors have equal authority?</li><li>Can approval be revoked?</li></ul></div>
        </div>
        <p class="reveal muted small">The route is stored as configuration, so changing policy won't need code changes.</p>
      </div>`,
  },

  /* 12 — Reminders, extensions, escalation */
  {
    title: 'Due dates, reminders & extensions',
    html: `
      <div class="slide-badge">${B.assumption('Timings: UAQ12 / UAQ16')}</div>
      ${head('Accountability', 'Reminders run automatically')}
      <div class="body">
        <div class="timeline reveal">
          <div class="tick" style="--c:var(--teal)"><div class="dot"></div><b>T − 7</b><span>days before due</span></div>
          <div class="tick" style="--c:var(--teal)"><div class="dot"></div><b>T − 3</b><span>days before</span></div>
          <div class="tick" style="--c:var(--blue)"><div class="dot"></div><b>T − 1</b><span>day before</span></div>
          <div class="tick" style="--c:var(--amber)"><div class="dot"></div><b>Due</b><span>on due date</span></div>
          <div class="tick" style="--c:var(--rose)"><div class="dot"></div><b>Daily</b><span>while overdue</span></div>
        </div>
        <div class="grid g3 reveal" style="margin-top:44px">
          <div class="card a-blue"><div class="icon">${I.bell}</div><h3>Channels</h3><p>In-app notifications, plus automated email from a dedicated project address. Reminders stop on return or on an approved extension.</p></div>
          <div class="card a-violet"><div class="icon">${I.spark}</div><h3>Extensions</h3><p>A separate record: request → approval → assistant updates the due date. History is kept, and approved time doesn't count as late.</p></div>
          <div class="card a-amber"><div class="icon">${I.users}</div><h3>Overdue escalation</h3><p>The assistant monitors and decides whether to notify faculty. Faculty decide whether to escalate to the HoD. This is human judgement, not automatic.</p></div>
        </div>
      </div>`,
  },

  /* 13 — Return, defects, penalties, REPO */
  {
    title: 'Return, inspection & penalties',
    html: `
      ${head('Closure', 'Every return is inspected and recorded')}
      <div class="body" style="gap:24px">
        <div class="reveal">${flow([
          { t: 'Student returns' },
          { t: 'Assistant inspects', cls: 'hl a-teal' },
          { t: 'Condition recorded' },
          { t: 'Photo evidence if needed' },
          { t: 'Inventory updated', cls: 'hl a-teal' },
          { t: 'Student acknowledged' },
        ])}</div>
        <div class="grid g3 reveal">
          <div class="card a-rose accent-top"><h3>Defect / damage / loss</h3><p>Records the asset, student, project, original issue, who found it, description, evidence and repair status. The asset moves to Defective, Under repair or Unavailable. <b style="color:var(--text)">History is kept.</b></p></div>
          <div class="card a-amber accent-top"><h3>Penalties</h3><p>Records for late return, damage or loss. The assistant records them; faculty or admin can waive or reduce. No payment gateway.</p><div style="margin-top:12px">${B.pending('Amounts / formula: UAQ13')}</div></div>
          <div class="card a-violet accent-top"><h3>REPO: reputation score</h3><p>Proposed. Built from on-time returns, late returns, damage and extensions. It must be explainable, transparent and auditable.</p><div style="margin-top:12px">${B.pending('Should it exist? UAQ15')}</div></div>
        </div>
      </div>`,
  },

  /* 14 — AI boundary */
  {
    title: 'AI: advisory only',
    html: `
      ${head('Intelligence', 'AI helps students choose. The database decides.', 'AI is deliberately a small part of the system. It is not what the project is about.')}
      <div class="body">
        <div class="grid g2 reveal" style="flex:1">
          <div class="card a-green accent-top"><div class="icon">${I.check}</div><h3>AI may</h3><ul>
            <li>Explain what a component is and does</li><li>Interpret a student's project requirement</li><li>Suggest possible alternatives</li><li>Help students compare component choices</li></ul>
            <p class="small" style="margin-top:16px">Suggestions are grounded in the real catalogue, so only items that actually exist are shown.</p></div>
          <div class="card a-rose accent-top"><div class="icon">${I.x}</div><h3>AI may never</h3><ul>
            <li>Decide whether an item exists</li><li>Override inventory or status</li><li>Issue components or approve requests</li><li>Change reservation order</li><li>Decide penalties</li><li>Act as institutional authority</li></ul></div>
        </div>
        <div class="card reveal" style="margin-top:20px;padding:18px 24px"><div class="row" style="align-items:center;gap:16px"><div class="icon a-teal" style="margin:0">${I.chart}</div><p><b style="color:var(--text)">Unmet-demand insight</b>: repeated requests for unstocked items are grouped together so the department can see what's in demand. Plain database aggregation, no AI needed.</p></div></div>
      </div>`,
  },

  /* 15 — Architecture */
  {
    title: 'Proposed architecture',
    html: `
      <div class="slide-badge">${B.proposed()}</div>
      ${head('Architecture', 'Python backend, SQL + NoSQL, web client')}
      <div class="body">
        <div class="arch reveal">
          <div class="col">
            <div class="layer-title">Clients</div>
            <div class="box primary a-blue" style="--accent:var(--blue)"><b>Web UI</b><span>React SPA, with role-specific dashboards for Student, Faculty, Lab Assistant and Admin</span></div>
            <div class="box"><b>Email inbox</b><span>Automated mail from a dedicated project address</span></div>
            <div class="layer-title" style="margin-top:8px">External</div>
            <div class="box"><b>SMTP service</b><span>Outbound reminders &amp; notifications</span></div>
            <div class="box"><b>LLM API</b><span>Advisory only, behind an adapter</span></div>
            <div class="box"><b>Excel files</b><span>Import of existing inventory</span></div>
          </div>
          <div class="api-shell">
            <div class="api-head"><b>Python API · FastAPI</b><span class="mono small muted">REST · JSON · JWT</span></div>
            <div class="modules">
              <div class="box"><b>Auth &amp; RBAC</b><span>Replaceable auth, enforced on the server</span></div>
              <div class="box"><b>Projects &amp; Teams</b><span>Members, mentors, requirements</span></div>
              <div class="box"><b>Catalogue &amp; Assets</b><span>Types, units, tracking modes</span></div>
              <div class="box"><b>Workflow engine</b><span>Configurable approval routing</span></div>
              <div class="box"><b>Issue &amp; Return</b><span>Transactions, inspection, defects</span></div>
              <div class="box"><b>Reservations</b><span>FIFO queue + audited override</span></div>
              <div class="box"><b>Scheduler</b><span>Reminder &amp; overdue jobs</span></div>
              <div class="box"><b>Notifications</b><span>In-app + email dispatch</span></div>
              <div class="box"><b>Analytics</b><span>Demand, utilisation, history</span></div>
              <div class="box"><b>AI adapter</b><span>Grounded in catalogue, read-only</span></div>
            </div>
          </div>
          <div class="col">
            <div class="layer-title">Data</div>
            <div class="box primary" style="--accent:var(--teal);flex:1"><b>PostgreSQL</b><span>System of record for transactional data: users, projects, components, assets, issues, reservations, extensions, penalties.</span><span style="margin-top:8px;color:var(--teal)">Constraints · joins · stored procedures</span></div>
            <div class="box primary" style="--accent:var(--violet);flex:1"><b>MongoDB</b><span>Event and document data: audit trail, notifications, unmet-demand events, AI interaction logs, inspection evidence metadata.</span><span style="margin-top:8px;color:var(--violet)">Aggregation pipelines</span></div>
            <div class="box"><b>Deployment</b><span>Cloud VM with synthetic data → college VM if approved</span></div>
          </div>
        </div>
      </div>`,
  },

  /* 16 — Why SQL + NoSQL */
  {
    title: 'Data strategy',
    html: `
      <div class="slide-badge">${B.proposed()}</div>
      ${head('Data strategy', 'Each database does the job it is best at', 'Not bolted on for marks: the split follows the shape of the data.')}
      <div class="body">
        <div class="grid g2 reveal">
          <div class="card a-teal accent-top"><div class="icon">${I.db}</div><h3>PostgreSQL: must be consistent</h3>
            <ul><li>Two students can't be issued the same asset (unique IDs, constraints, row locks)</li>
            <li><b style="color:var(--text)">Stored procedure</b> for issuing: check availability, lock the asset, create the issue, all in one transaction</li>
            <li><b style="color:var(--text)">Joins</b>: project → members → requests → issues → assets → lab</li>
            <li><b style="color:var(--text)">Subqueries / GROUP BY</b>: overdue issues per lab, students with repeated late returns</li></ul></div>
          <div class="card a-violet accent-top"><div class="icon">${I.layers}</div><h3>MongoDB: append-heavy, flexible</h3>
            <ul><li>Audit events with differing payloads (approval, override, transfer, role change)</li>
            <li>Notification history per user</li>
            <li><b style="color:var(--text)">Aggregation pipeline</b>: most-requested unstocked components per month</li>
            <li><b style="color:var(--text)">Aggregation pipeline</b>: reservation wait time and return delay distributions</li></ul></div>
        </div>
        <div class="card reveal" style="margin-top:22px;padding:18px 24px"><p><b style="color:var(--text)">Rule:</b> PostgreSQL is the single authority for inventory and workflow state. MongoDB never decides availability; it records and analyses what happened.</p></div>
      </div>`,
  },

  /* 17 — Security */
  {
    title: 'Security & data protection',
    html: `
      ${head('Security', 'Least privilege, full audit trail, no real PII off-campus')}
      <div class="body">
        <div class="grid g3 reveal" style="flex:1">
          <div class="card a-teal"><div class="icon">${I.shield}</div><h3>Access control</h3><ul><li>Server-side RBAC on every endpoint</li><li>Students see only their own projects</li><li>Faculty see only their mentored projects</li><li>Assistants see only their assigned labs</li></ul></div>
          <div class="card a-blue"><div class="icon">${I.hash}</div><h3>Input &amp; data safety</h3><ul><li>Validation on every input</li><li>Parameterised queries only (no SQL injection)</li><li>Hashed passwords, rate-limited login</li><li>Restricted evidence uploads</li><li>APIs return only the fields needed</li></ul></div>
          <div class="card a-violet"><div class="icon">${I.book}</div><h3>Auditability</h3><ul><li>Approvals, issues, overrides, transfers, penalties and role changes are all logged</li><li>Transactions are never silently overwritten</li><li>Admin is a transferable role</li></ul></div>
        </div>
        <div class="grid g2 reveal" style="margin-top:20px">
          <div class="card a-amber"><h3>Cloud demo uses synthetic data only</h3><p>No real student PII on external servers until college privacy policy is known (UAQ17).</p></div>
          <div class="card a-rose"><h3>Authentication is replaceable</h3><p>V1 uses local login: PRN for students, institutional email for staff. College SSO can be added later (UAQ1).</p></div>
        </div>
      </div>`,
  },

  /* 18 — Live demo */
  {
    title: 'Running example',
    html: `
      ${head('Live demonstration', 'One project, start to finish', 'What we will show live on the cloud deployment:')}
      <div class="body" style="gap:22px">
        <div class="reveal">${flow([
          { k: 'STUDENT', t: 'Create project, add team &amp; mentor' },
          { k: 'STUDENT', t: 'Add Arduino Uno ×2, Ultrasonic ×4' },
          { k: 'SYSTEM', t: 'Shows availability, lab, assistant, alternatives', cls: 'hl a-teal' },
          { k: 'FACULTY', t: 'Approve (HoD if configured)', cls: 'hl a-violet' },
          { k: 'ASSISTANT', t: 'Verify, pick assets, set duration', cls: 'hl a-teal' },
        ])}</div>
        <div class="reveal">${flow([
          { k: 'SYSTEM', t: 'Due date on dashboard, reminder fires', cls: 'hl a-blue' },
          { k: 'STUDENT', t: 'Request extension, then approved' },
          { k: 'STUDENT', t: 'Return components' },
          { k: 'ASSISTANT', t: 'Inspect: Working / Defective', cls: 'hl a-teal' },
          { k: 'SYSTEM', t: 'Inventory updated, history + REPO', cls: 'hl a-blue' },
        ])}</div>
        <div class="grid g2 reveal">
          <div class="card a-amber"><h3>Exception: already issued</h3><p>A second student sees "Currently issued" and reserves the item. On return, the first person in the FIFO queue is offered it.</p></div>
          <div class="card a-rose"><h3>Exception: not stocked</h3><p>The system suggests an alternative from the catalogue, or logs unmet demand that appears on the analytics dashboard.</p></div>
        </div>
      </div>`,
  },

  /* 19 — Academic mapping */
  {
    title: 'Academic mapping',
    html: `
      ${head('Academic relevance', 'One application covers both CCE and DCDS')}
      <div class="body">
        <div class="row reveal" style="flex:1;gap:26px">
          <div class="card fill" style="padding:22px 10px 10px">
            <div class="eyebrow" style="padding-left:18px">DCDS Lab ESE · 10 marks · 40%</div>
            <table class="t">
              <thead><tr><th>Criterion</th><th style="text-align:center">Marks</th><th>In LabTrack</th></tr></thead>
              <tbody>
                <tr><td>Application design</td><td class="marks">2</td><td>Full role-based lifecycle, modular services</td></tr>
                <tr><td>Python implementation</td><td class="marks">2</td><td>Classes, exceptions, modules, Excel file import</td></tr>
                <tr><td>SQL + NoSQL integration</td><td class="marks">2</td><td>PostgreSQL + MongoDB with a clear split</td></tr>
                <tr><td>Advanced querying</td><td class="marks">2</td><td>Joins, subqueries, stored procedures, aggregation pipelines</td></tr>
                <tr><td>Code &amp; documentation</td><td class="marks">1</td><td>Docs, clear UI, structured repo</td></tr>
                <tr><td>Testing &amp; security</td><td class="marks">1</td><td>Unit/API tests, validation, RBAC</td></tr>
              </tbody>
            </table>
          </div>
          <div class="card" style="width:500px;padding:22px 10px 10px">
            <div class="eyebrow" style="padding-left:18px">CCE · 30 marks · CO3 / CO4</div>
            <table class="t">
              <thead><tr><th>Component</th><th style="text-align:center">Marks</th></tr></thead>
              <tbody>
                <tr><td>Topic submission</td><td class="marks">5</td></tr>
                <tr><td>Research / literature survey</td><td class="marks">5</td></tr>
                <tr><td>Presentation skills</td><td class="marks">5</td></tr>
                <tr><td>Running example (live cloud)</td><td class="marks">10</td></tr>
                <tr><td>Viva</td><td class="marks">5</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>`,
  },

  /* 20 — Plan */
  {
    title: 'Delivery plan',
    html: `
      <div class="slide-badge">${B.proposed('Proposed plan')}</div>
      ${head('Timeline', 'Working back from the DCDS ESE (26–30 Oct 2026)')}
      <div class="body">
        <div class="grid g4 reveal" style="flex:1">
          <div class="card a-teal accent-top"><div class="eyebrow">Week 1</div><h3>Foundation</h3><ul><li>Faculty answers to P0 questions</li><li>Requirements &amp; schema docs</li><li>DB schema, auth, RBAC</li><li>Catalogue, assets, Excel import</li></ul></div>
          <div class="card a-blue accent-top"><div class="eyebrow" style="color:var(--blue)">Week 2</div><h3>Core lifecycle</h3><ul><li>Projects &amp; teams</li><li>Request → approval → issue</li><li>Issue stored procedure</li><li>Role dashboards</li></ul></div>
          <div class="card a-violet accent-top"><div class="eyebrow" style="color:var(--violet)">Week 3</div><h3>Accountability</h3><ul><li>Reminders, extensions</li><li>FIFO reservations</li><li>Return, inspection, defects</li><li>Audit + Mongo analytics</li></ul></div>
          <div class="card a-amber accent-top"><div class="eyebrow" style="color:var(--amber)">Week 4</div><h3>Harden &amp; ship</h3><ul><li>AI advisory layer</li><li>Tests, validation, security</li><li>Cloud deployment</li><li>Docs + demo rehearsal</li></ul></div>
        </div>
        <div class="card reveal" style="margin-top:20px;padding:18px 24px"><p><b style="color:var(--text)">If time runs short, these are cut first:</b> REPO scoring, AI suggestions and asset transfers. The core lifecycle and the database requirements are never cut.</p></div>
      </div>`,
  },

  /* 21 — Out of scope */
  {
    title: 'Not in V1',
    html: `
      <div class="slide-badge">${B.future()}</div>
      ${head('Scope discipline', 'What we are deliberately not building')}
      <div class="body">
        <div class="grid g4 reveal">
          ${['Native mobile app / Play Store', 'Cabinet / shelf / drawer locations', 'Full procurement workflow', 'Payment handling', 'Formal dispute resolution', 'Enterprise accounting', 'Full college SSO (until confirmed)', 'Cross-department sharing', 'Warranty management', 'Advanced analytics / AI', 'Full notebook-history migration', 'Real student data on cloud']
            .map((t) => `<div class="card a-violet" style="padding:20px 22px"><p style="color:var(--text)">${t}</p></div>`).join('')}
        </div>
        <p class="lead reveal" style="margin-top:28px">V1 is deliberately small and complete rather than big and half-built. Everything here can be added later without changing the core data model.</p>
      </div>`,
  },

  /* 22 — P0 questions */
  {
    title: 'Questions: must resolve (P0)',
    html: `
      <div class="slide-badge">${B.pending('P0: needed before build')}</div>
      ${head('Decisions we need from you', 'Policy questions that change the data model')}
      <div class="body">
        <div class="grid g4 reveal" style="gap:14px">
          <div class="card q"><div class="qid">UAQ5 · APPROVAL</div><h3>Exact approval route</h3><p>Is HoD approval always required? Equal-authority mentors? Can approval be revoked? Who is the final approver before the assistant?</p></div>
          <div class="card q"><div class="qid">UAQ12 · BORROWING</div><h3>Duration &amp; extensions</h3><p>Official borrowing period, extension rules, maximum extensions, who approves them.</p></div>
          <div class="card q"><div class="qid">UAQ13 · PENALTIES</div><h3>Late / damage / loss</h3><p>Rules, formulas, replacement cost, who can waive or reduce, appeals.</p></div>
          <div class="card q"><div class="qid">UAQ16 · REMINDERS</div><h3>Reminders &amp; escalation</h3><p>Official timings, escalation thresholds and recipients, HoD involvement.</p></div>
          <div class="card q"><div class="qid">UAQ7 · TRACKING</div><h3>Item classification</h3><p>Which items are individual, quantity-tracked or consumable (wires, resistors, LEDs…)?</p></div>
          <div class="card q"><div class="qid">UAQ8 · IDs</div><h3>Existing identifiers</h3><p>Which assets have serials, department IDs or asset codes that we must keep?</p></div>
          <div class="card q"><div class="qid">UAQ1 · AUTH</div><h3>Authentication / SSO</h3><p>Which college identity system exists, and can LabTrack integrate with it?</p></div>
          <div class="card q"><div class="qid">UAQ2 · MASTER DATA</div><h3>Student / staff datasets</h3><p>Can we get authorised read access, or should we use synthetic data?</p></div>
          <div class="card q"><div class="qid">UAQ17 · PRIVACY</div><h3>PII &amp; external cloud</h3><p>Policies for student data, cloud hosting, backups, email and logs.</p></div>
          <div class="card q"><div class="qid">UAQ18 · INFRA</div><h3>College infrastructure</h3><p>Is a server/VM, database, DNS, HTTPS or internal network available for production?</p></div>
          <div class="card q a-amber" style="grid-column: span 2"><div class="qid" style="color:var(--amber)">ACADEMIC · TEAM STRUCTURE</div><h3>DCDS team-size requirement</h3><p>The DCDS rubric expects a 4-member team from the same division. Two members are currently building the software. How should this be handled for registration?</p></div>
        </div>
      </div>`,
  },

  /* 23 — P1/P2 questions */
  {
    title: 'Questions: should resolve (P1 / P2)',
    html: `
      <div class="slide-badge">${B.pending('P1 / P2')}</div>
      ${head('Operational & governance', 'Questions we can work around for now, but need answered')}
      <div class="body">
        <div class="grid g4 reveal" style="gap:14px">
          <div class="card q p1"><div class="qid">UAQ3 · P1</div><h3>Staff IDs</h3><p>Do faculty and assistants have institutional IDs besides email?</p></div>
          <div class="card q p1"><div class="qid">UAQ4 · P1</div><h3>Lab ↔ assistant mapping</h3><p>Multiple assistants per lab? Multiple labs per assistant?</p></div>
          <div class="card q p1"><div class="qid">UAQ6 · P1</div><h3>Unmet demand</h3><p>What to record, who reviews it, should it feed procurement discussion?</p></div>
          <div class="card q p1"><div class="qid">UAQ10 · P1</div><h3>Asset transfers</h3><p>Who authorises moving equipment between labs?</p></div>
          <div class="card q p1"><div class="qid">UAQ11 · P1</div><h3>Reservations</h3><p>How long a reservation stays valid; what happens if it isn't collected; category-level reservations?</p></div>
          <div class="card q p1"><div class="qid">UAQ14 · P1</div><h3>Return inspection</h3><p>Which parameters must the assistant record?</p></div>
          <div class="card q p1"><div class="qid">UAQ15 · P1</div><h3>REPO score</h3><p>Should it exist? Formula, effects, override, challenge process?</p></div>
          <div class="card q p1"><div class="qid">UAQ19 · P1</div><h3>Retention</h3><p>How long to keep backups, audit logs, issue and penalty history?</p></div>
          <div class="card q p1"><div class="qid">UAQ20 · P1</div><h3>Cross-department</h3><p>Can equipment be shared between departments? Who owns it?</p></div>
          <div class="card q p1"><div class="qid">UAQ21 · P1</div><h3>Demand recipients</h3><p>Who should see unmet-demand reports?</p></div>
          <div class="card q p2"><div class="qid">UAQ22 · P2</div><h3>Long-term ownership</h3><p>After adoption, who maintains, administers and recovers the system?</p></div>
          <div class="card q a-teal"><div class="qid" style="color:var(--teal)">UNTIL ANSWERED</div><h3>Our default</h3><p>We use the V1 assumption, make it configurable, and label it as pending.</p></div>
        </div>
      </div>`,
  },

  /* 24 — The ask */
  {
    title: 'The ask',
    html: `
      ${head('Approval request', 'What we need today')}
      <div class="body" style="justify-content:center">
        <div class="grid g2 reveal">
          <div class="card a-teal accent-top"><div class="icon">${I.check}</div><h3>1 · Approve the topic</h3><p>LabTrack as our unified CCE and DCDS project.</p></div>
          <div class="card a-blue accent-top"><div class="icon">${I.layers}</div><h3>2 · Approve the architecture</h3><p>Python (FastAPI) + PostgreSQL + MongoDB + web UI, deployed on a cloud VM with synthetic data.</p></div>
          <div class="card a-rose accent-top"><div class="icon">${I.users}</div><h3>3 · Answer or route the P0 questions</h3><p>Or point us to the person who owns each policy (lab in-charge, HoD, IT).</p></div>
          <div class="card a-amber accent-top"><div class="icon">${I.building}</div><h3>4 · Allow lab-assistant input</h3><p>A short session with one lab assistant to validate the workflow and inventory classification.</p></div>
        </div>
        <p class="pitch reveal" style="margin-top:44px">LabTrack turns fragmented laboratory hardware handling into a <span class="grad-text">traceable digital lifecycle</span>, from requirement to return.</p>
      </div>`,
  },

  /* 25 — Thank you */
  {
    title: 'Thank you',
    cls: 'title-slide',
    html: `
      <div class="logo reveal">
        <div class="logo-mark"><svg viewBox="0 0 24 24"><path d="M6 4v16h12"/><circle cx="13" cy="10" r="2.4"/></svg></div>
        <span class="mono muted">LABTRACK · PROJECT PROPOSAL</span>
      </div>
      <h1 class="reveal" style="font-size:110px">Thank you.</h1>
      <p class="subtitle reveal">Questions &amp; feedback welcome.</p>
      <div class="legend reveal" style="margin-top:30px">${B.confirmed('Observed')}${B.assumption()}${B.pending()}${B.proposed('Proposed')}${B.future()}</div>`,
  },
];
