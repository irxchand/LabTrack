/**
 * LabTrack DCDS Presentation — Canva Template Replicated Slides
 * 
 * Replicating: Canva "White, Blue and Grey Modern Startup Pitch Deck"
 * Palette: Ambient White/Blue/Grey Mesh, Deep Charcoal (#2c3036), Accent Blue (#2563eb), Matte Slate Dark Cards (#393d45)
 * Typography: Inter 800/900 (Bold, Tight tracking), Inter (Clean body), JetBrains Mono
 * Strict academic alignment: DCDS Lab ESE (10 Marks / 40% Weightage), SY AIML 2025–29, SIT Pune
 */

export const slides = [
  /* 01 — Cover / Title (Canva Slide 1 style) */
  {
    title: 'LabTrack: Hardware Availability & Tracking System',
    html: `
      <div class="canva-topbar">
        <div class="topbar-logo">
          <svg class="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          <span>LabTrack</span>
        </div>
        <div class="topbar-tag">Department of AI &amp; ML · SIT Pune</div>
      </div>
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 10px 0 20px 0;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px;">
          <div>
            <h1 style="font-family: var(--display); font-size: 112px; font-weight: 900; letter-spacing: -0.05em; line-height: 0.9; color: var(--text-dark);">
              LabTrack.
            </h1>
          </div>
          <div style="max-width: 480px; text-align: right;">
            <div style="font-family: var(--display); font-size: 26px; font-weight: 800; color: var(--text-dark); line-height: 1.2; margin-bottom: 8px;">
              Hardware Availability &amp; Tracking System
            </div>
            <p style="font-size: 15px; color: var(--text-muted); line-height: 1.5;">
              DCDS Lab ESE Miniproject · Python with Advanced MySQL &amp; MongoDB Integration
            </p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
          <div class="canva-big-box" style="padding: 20px 24px; border-radius: var(--radius-lg);">
            <div style="font-family: var(--mono); font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;">COURSE &amp; SEMESTER</div>
            <div style="font-family: var(--display); font-size: 16px; font-weight: 800; color: var(--text-dark);">DCDS Lab · SY Sem 3</div>
          </div>
          <div class="canva-big-box" style="padding: 20px 24px; border-radius: var(--radius-lg);">
            <div style="font-family: var(--mono); font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;">DATABASE ARCHITECTURE</div>
            <div style="font-family: var(--display); font-size: 16px; font-weight: 800; color: var(--text-dark);">MySQL 8.0 + MongoDB 7.0</div>
          </div>
          <div class="canva-big-box" style="padding: 20px 24px; border-radius: var(--radius-lg);">
            <div style="font-family: var(--mono); font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;">EVALUATION TARGET</div>
            <div style="font-family: var(--display); font-size: 16px; font-weight: 800; color: var(--text-dark);">26–30 October 2026</div>
          </div>
          <div class="canva-big-box" style="padding: 20px 24px; border-radius: var(--radius-lg);">
            <div style="font-family: var(--mono); font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;">FACULTY EVALUATORS</div>
            <div style="font-family: var(--display); font-size: 15px; font-weight: 800; color: var(--text-dark);">Dr. Dalvi · Dr. Dutta · Dr. Khan</div>
          </div>
        </div>
      </div>
      <div class="canva-footer">
        <div class="footer-left"><span>SY AIML Batch 2025–29</span><span>Python-Based Data-Driven Application</span></div>
        <div class="footer-right">01 / 24</div>
      </div>
    `
  },

  /* 02 — Today's Agenda (Canva Slide 2 style) */
  {
    title: "Today's Agenda",
    html: `
      <div class="canva-topbar">
        <div class="topbar-logo"><svg class="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span>LabTrack</span></div>
        <div class="topbar-tag">DCDS Presentation Roadmap</div>
      </div>
      <div class="canva-split">
        <div class="split-left">
          <div>
            <h2 class="split-hero-title">Today’s<br>Agenda</h2>
            <p class="split-hero-desc">
              A comprehensive walkthrough of LabTrack’s hardware availability engine, domain classification, dual-store architecture, and DCDS rubric mapping.
            </p>
          </div>
          <div class="canva-pill" style="width: fit-content;"><span>8 Core Presentation Tracks</span></div>
        </div>
        <div class="canva-big-box" style="display: flex; flex-direction: column; justify-content: space-around;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 18px;">
            <div style="display: flex; align-items: center; gap: 14px;"><span class="canva-num-pill">01</span><span style="font-size: 15px; font-weight: 700;">Problem Statement</span></div>
            <div style="display: flex; align-items: center; gap: 14px;"><span class="canva-num-pill">02</span><span style="font-size: 15px; font-weight: 700;">Hardware Availability Core</span></div>
            <div style="display: flex; align-items: center; gap: 14px;"><span class="canva-num-pill">03</span><span style="font-size: 15px; font-weight: 700;">Assets vs. Consumables Split</span></div>
            <div style="display: flex; align-items: center; gap: 14px;"><span class="canva-num-pill">04</span><span style="font-size: 15px; font-weight: 700;">Lab Custody &amp; Issuing Lab</span></div>
            <div style="display: flex; align-items: center; gap: 14px;"><span class="canva-num-pill">05</span><span style="font-size: 15px; font-weight: 700;">MySQL &amp; MongoDB Dual Storage</span></div>
            <div style="display: flex; align-items: center; gap: 14px;"><span class="canva-num-pill">06</span><span style="font-size: 15px; font-weight: 700;">Advanced SQL &amp; Stored Procs</span></div>
            <div style="display: flex; align-items: center; gap: 14px;"><span class="canva-num-pill">07</span><span style="font-size: 15px; font-weight: 700;">Python OOP &amp; Prototype Demo</span></div>
            <div style="display: flex; align-items: center; gap: 14px;"><span class="canva-num-pill">08</span><span style="font-size: 15px; font-weight: 700;">Rubric Alignment &amp; Discussion</span></div>
          </div>
        </div>
      </div>
      <div class="canva-footer">
        <div class="footer-left"><span>Section 1 · Overview</span></div>
        <div class="footer-right">02 / 24</div>
      </div>
    `
  },

  /* 03 — Problem Statement (Canva Slide 4 Dark Card style) */
  {
    title: 'Problem Statement',
    cls: 'dark-slide',
    html: `
      <div class="canva-topbar">
        <div class="topbar-logo"><svg class="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span>LabTrack</span></div>
        <div class="topbar-tag">The Missing Data Foundation</div>
      </div>
      <div style="margin-bottom: 20px;">
        <h2 class="canva-heading">Problem Statement</h2>
        <p class="canva-subtitle">
          Manual spreadsheets, paper registers, and informal emails prevent real-time availability tracking and custody management.
        </p>
      </div>
      <div class="slide-body">
        <div class="canva-big-box-dark" style="flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; padding: 40px;">
          <div style="border-right: 1px solid var(--canva-dark-divider); padding-right: 24px; display: flex; flex-direction: column;">
            <div class="canva-bullet-tag">PROBLEM 1</div>
            <h3 style="font-family: var(--display); font-size: 22px; font-weight: 800; margin-bottom: 12px; color: #ffffff;">Isolated Records</h3>
            <p style="font-size: 14px; line-height: 1.6; color: var(--text-white-muted);">
              Inventory is partly recorded in static Excel sheets and partly written in physical notebooks across separate departmental labs. Updates are manual, unlinked, and prone to silent discrepancies.
            </p>
          </div>
          <div style="border-right: 1px solid var(--canva-dark-divider); padding-right: 24px; display: flex; flex-direction: column;">
            <div class="canva-bullet-tag">PROBLEM 2</div>
            <h3 style="font-family: var(--display); font-size: 22px; font-weight: 800; margin-bottom: 12px; color: #ffffff;">Invisible Availability</h3>
            <p style="font-size: 14px; line-height: 1.6; color: var(--text-white-muted);">
              Students and mentors cannot query whether a component is in stock, currently issued to another team, under repair, or located in a specific lab without physically walking into each lab.
            </p>
          </div>
          <div style="display: flex; flex-direction: column;">
            <div class="canva-bullet-tag">PROBLEM 3</div>
            <h3 style="font-family: var(--display); font-size: 22px; font-weight: 800; margin-bottom: 12px; color: #ffffff;">Lost Custody &amp; Issuing Lab</h3>
            <p style="font-size: 14px; line-height: 1.6; color: var(--text-white-muted);">
              When hardware is returned damaged or unreturned, records fail to capture which lab originally issued it, who authorized the handover, and the student's historical borrowing reliability.
            </p>
          </div>
        </div>
      </div>
      <div class="canva-footer">
        <div class="footer-left"><span>Section 1 · Baseline</span></div>
        <div class="footer-right">03 / 24</div>
      </div>
    `
  },

  /* 04 — Existing Manual Workflow (Canva Split Flow style) */
  {
    title: 'Existing Manual Workflow vs. Lost Data Points',
    html: `
      <div class="canva-topbar">
        <div class="topbar-logo"><svg class="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span>LabTrack</span></div>
        <div class="topbar-tag">Workflow Analysis</div>
      </div>
      <div class="canva-split">
        <div class="split-left">
          <div>
            <h2 class="split-hero-title">Existing<br>Manual<br>Workflow</h2>
            <p class="split-hero-desc">
              At every stage of the legacy handover, critical operational and analytical data is lost or permanently unrecorded.
            </p>
          </div>
          <div class="canva-big-box" style="padding: 20px 24px; border-radius: var(--radius-lg);">
            <div style="font-weight: 800; font-size: 15px; color: var(--accent-rose); margin-bottom: 4px;">The Missing System</div>
            <div style="font-size: 13.5px; color: var(--text-muted); line-height: 1.45;">Zero audit trail, zero concurrent locking, invisible unmet demand.</div>
          </div>
        </div>
        <div class="canva-big-box" style="display: flex; flex-direction: column; justify-content: space-around;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid var(--canva-border-subtle);">
            <div style="display: flex; gap: 16px; align-items: center;">
              <span class="canva-num-pill">01</span>
              <div><div style="font-weight: 800; font-size: 15px;">Student Emails Faculty</div><div style="font-size: 13px; color: var(--text-muted);">Unstructured text requests buried in email threads</div></div>
            </div>
            <span class="canva-pill" style="color: var(--accent-rose); border-color: var(--accent-rose); font-size: 12px;">Lost: Unmet Demand</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid var(--canva-border-subtle);">
            <div style="display: flex; gap: 16px; align-items: center;">
              <span class="canva-num-pill">02</span>
              <div><div style="font-weight: 800; font-size: 15px;">Assistant Checks Shelves by Hand</div><div style="font-size: 13px; color: var(--text-muted);">Physical shelf inspections; cross-lab stock unknown</div></div>
            </div>
            <span class="canva-pill" style="color: var(--accent-rose); border-color: var(--accent-rose); font-size: 12px;">Lost: Multi-Lab State</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid var(--canva-border-subtle);">
            <div style="display: flex; gap: 16px; align-items: center;">
              <span class="canva-num-pill">03</span>
              <div><div style="font-weight: 800; font-size: 15px;">Handwritten Register Entry</div><div style="font-size: 13px; color: var(--text-muted);">Physical notebook records without barcode scanning</div></div>
            </div>
            <span class="canva-pill" style="color: var(--accent-rose); border-color: var(--accent-rose); font-size: 12px;">Lost: Issuing Lab ID</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; gap: 16px; align-items: center;">
              <span class="canva-num-pill">04</span>
              <div><div style="font-weight: 800; font-size: 15px;">Ad-hoc Return &amp; Verbal Check</div><div style="font-size: 13px; color: var(--text-muted);">Returned without formal defect classification</div></div>
            </div>
            <span class="canva-pill" style="color: var(--accent-rose); border-color: var(--accent-rose); font-size: 12px;">Lost: Condition Audit</span>
          </div>
        </div>
      </div>
      <div class="canva-footer">
        <div class="footer-left"><span>Section 1 · Baseline</span></div>
        <div class="footer-right">04 / 24</div>
      </div>
    `
  },

  /* 05 — Proposed System & Core Value Proposition (Canva Slide 5 style) */
  {
    title: 'Proposed Solution & Core Value Proposition',
    html: `
      <div class="canva-topbar">
        <div class="topbar-logo"><svg class="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span>LabTrack</span></div>
        <div class="topbar-tag">System Proposition</div>
      </div>
      <div class="canva-split">
        <div class="split-left">
          <div>
            <h2 class="split-hero-title">Our<br>Core Value<br>Proposition</h2>
            <p class="split-hero-desc">
              "LabTrack provides a centralized, database-backed system to determine what laboratory hardware exists, where it is, who is responsible for it, whether it is available, how it is issued/used, and how its lifecycle is recorded."
            </p>
          </div>
          <div class="canva-pill" style="width: fit-content;"><span>Database-Driven Engineering</span></div>
        </div>
        <div class="canva-big-box" style="display: flex; flex-direction: column; justify-content: space-around;">
          <div style="display: flex; gap: 18px; align-items: flex-start; padding-bottom: 16px; border-bottom: 1px solid var(--canva-border-subtle);">
            <span class="canva-num-pill">01</span>
            <div>
              <h4 style="font-family: var(--display); font-size: 18px; font-weight: 800; margin-bottom: 4px;">Hardware Availability Engine</h4>
              <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5;">
                Real-time query engine reporting total stock, usable units, bad counts, current lab location, and responsible Lab In-Charge.
              </p>
            </div>
          </div>
          <div style="display: flex; gap: 18px; align-items: flex-start; padding-bottom: 16px; border-bottom: 1px solid var(--canva-border-subtle);">
            <span class="canva-num-pill">02</span>
            <div>
              <h4 style="font-family: var(--display); font-size: 18px; font-weight: 800; margin-bottom: 4px;">Dual Hardware Tracking Model</h4>
              <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5;">
                Barcode tracking for high-value physical assets; quantity batch maintenance for common electronic consumables.
              </p>
            </div>
          </div>
          <div style="display: flex; gap: 18px; align-items: flex-start;">
            <span class="canva-num-pill">03</span>
            <div>
              <h4 style="font-family: var(--display); font-size: 18px; font-weight: 800; margin-bottom: 4px;">Dual Database Storage</h4>
              <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5;">
                MySQL 8 for authoritative transactional state and row locks; MongoDB 7 for append-only audit streams and demand analytics.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="canva-footer">
        <div class="footer-left"><span>Section 2 · Core Architecture</span></div>
        <div class="footer-right">05 / 24</div>
      </div>
    `
  },

  /* 06 — From Physical Hardware to Traceable Data (The Central Heart Slide) */
  {
    title: 'From Physical Hardware to Traceable Data',
    html: `
      <div class="canva-topbar">
        <div class="topbar-logo"><svg class="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span>LabTrack</span></div>
        <div class="topbar-tag">The Heart of the DCDS Story</div>
      </div>
      <div style="margin-bottom: 18px;">
        <h2 class="canva-heading">From Physical Hardware to Traceable Data</h2>
        <p class="canva-subtitle">
          How physical equipment transitions into structured relational records in MySQL and immutable event logs in MongoDB.
        </p>
      </div>
      <div class="slide-body">
        <div class="canva-big-box" style="flex: 1; display: flex; flex-direction: column; justify-content: space-around;">
          <div>
            <div style="font-family: var(--display); font-size: 13px; font-weight: 800; text-transform: uppercase; color: var(--text-muted); margin-bottom: 10px;">
              PHASE 1: HARDWARE IDENTIFICATION &amp; LAB RESPONSIBILITY
            </div>
            <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px;">
              <div class="canva-pill-card" style="padding: 14px; text-align: center; border-radius: var(--radius-md);"><span style="font-size: 11px; font-weight: 800; color: var(--text-muted);">01</span><div style="font-weight: 800; font-size: 13.5px; margin-top: 4px;">Physical Unit</div></div>
              <div class="canva-pill-card" style="padding: 14px; text-align: center; border-radius: var(--radius-md);"><span style="font-size: 11px; font-weight: 800; color: var(--text-muted);">02</span><div style="font-weight: 800; font-size: 13.5px; margin-top: 4px;">Category</div></div>
              <div class="canva-pill-card" style="padding: 14px; text-align: center; border-radius: var(--radius-md); background: #ffffff;"><span style="font-size: 11px; font-weight: 800; color: var(--accent-blue);">03</span><div style="font-weight: 800; font-size: 13.5px; color: var(--accent-blue); margin-top: 4px;">Asset vs Consumable</div></div>
              <div class="canva-pill-card" style="padding: 14px; text-align: center; border-radius: var(--radius-md);"><span style="font-size: 11px; font-weight: 800; color: var(--text-muted);">04</span><div style="font-weight: 800; font-size: 13.5px; margin-top: 4px;">Barcode / Qty</div></div>
              <div class="canva-pill-card" style="padding: 14px; text-align: center; border-radius: var(--radius-md);"><span style="font-size: 11px; font-weight: 800; color: var(--text-muted);">05</span><div style="font-weight: 800; font-size: 13.5px; margin-top: 4px;">Lab Location</div></div>
              <div class="canva-pill-card" style="padding: 14px; text-align: center; border-radius: var(--radius-md);"><span style="font-size: 11px; font-weight: 800; color: var(--text-muted);">06</span><div style="font-weight: 800; font-size: 13.5px; margin-top: 4px;">Lab In-Charge</div></div>
            </div>
          </div>

          <div style="display: flex; justify-content: center; align-items: center; gap: 14px;">
            <div style="height: 1.5px; flex: 1; background: var(--canva-border-subtle);"></div>
            <span class="canva-pill" style="font-size: 12px;">FASTAPI BUSINESS LOGIC · MYSQL 8.0 ATOMIC COMMIT</span>
            <div style="height: 1.5px; flex: 1; background: var(--canva-border-subtle);"></div>
          </div>

          <div>
            <div style="font-family: var(--display); font-size: 13px; font-weight: 800; text-transform: uppercase; color: var(--text-muted); margin-bottom: 10px;">
              PHASE 2: TRANSACTION EXECUTION, ACTIVE TRACKING &amp; AUDIT LOGGING
            </div>
            <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px;">
              <div class="canva-pill-card" style="padding: 14px; text-align: center; border-radius: var(--radius-md);"><span style="font-size: 11px; font-weight: 800; color: var(--text-muted);">07</span><div style="font-weight: 800; font-size: 13.5px; margin-top: 4px;">Live Availability</div></div>
              <div class="canva-pill-card" style="padding: 14px; text-align: center; border-radius: var(--radius-md);"><span style="font-size: 11px; font-weight: 800; color: var(--text-muted);">08</span><div style="font-weight: 800; font-size: 13.5px; margin-top: 4px;">HoD Approval</div></div>
              <div class="canva-pill-card" style="padding: 14px; text-align: center; border-radius: var(--radius-md); background: #ffffff;"><span style="font-size: 11px; font-weight: 800; color: var(--accent-blue);">09</span><div style="font-weight: 800; font-size: 13.5px; color: var(--accent-blue); margin-top: 4px;">Issuing Lab Saved</div></div>
              <div class="canva-pill-card" style="padding: 14px; text-align: center; border-radius: var(--radius-md);"><span style="font-size: 11px; font-weight: 800; color: var(--text-muted);">10</span><div style="font-weight: 800; font-size: 13.5px; margin-top: 4px;">T-5 / Overdue</div></div>
              <div class="canva-pill-card" style="padding: 14px; text-align: center; border-radius: var(--radius-md);"><span style="font-size: 11px; font-weight: 800; color: var(--text-muted);">11</span><div style="font-weight: 800; font-size: 13.5px; margin-top: 4px;">Condition Audit</div></div>
              <div class="canva-pill-card" style="padding: 14px; text-align: center; border-radius: var(--radius-md);"><span style="font-size: 11px; font-weight: 800; color: var(--text-muted);">12</span><div style="font-weight: 800; font-size: 13.5px; margin-top: 4px;">MongoDB Telemetry</div></div>
            </div>
          </div>
        </div>
      </div>
      <div class="canva-footer">
        <div class="footer-left"><span>Section 2 · Core Data Model</span></div>
        <div class="footer-right">06 / 24</div>
      </div>
    `
  },

  /* 07 — Component Classification: Assets vs Consumables (Canva Slide 8 style) */
  {
    title: 'Component Classification: Assets vs. Consumables',
    cls: 'dark-slide',
    html: `
      <div class="canva-topbar">
        <div class="topbar-logo"><svg class="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span>LabTrack</span></div>
        <div class="topbar-tag">Faculty-Verified Domain Model</div>
      </div>
      <div style="margin-bottom: 20px;">
        <h2 class="canva-heading">Component Classification</h2>
        <p class="canva-subtitle">
          Faculty specifically ruled that Assets and Consumables are treated completely differently across inventory models and operational procedures.
        </p>
      </div>
      <div class="slide-body">
        <div class="canva-big-box-dark" style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; padding: 40px;">
          <div style="border-right: 1px solid var(--canva-dark-divider); padding-right: 32px; display: flex; flex-direction: column;">
            <div class="canva-bullet-tag">ASSETS (High-Value / Barcode)</div>
            <p style="font-size: 14px; color: var(--text-white-muted); margin-bottom: 16px; line-height: 1.5;">
              Valuable, shared laboratory machinery and instrumentation. Unit-level verification takes highest precedence.
            </p>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 13.5px; color: var(--text-white-muted); flex: 1;">
              <li>• <strong>Examples:</strong> Robotic Arm, PLC, Intel Depth Camera, Spectrum Analyzer, 3D Printer.</li>
              <li>• <strong>Barcode Tracking:</strong> Every physical asset has a unique internal barcode ID.</li>
              <li>• <strong>In-Lab Policy:</strong> Generally <em>NOT</em> issued directly to students for home take-out; operated inside lab.</li>
              <li>• <strong>Custody:</strong> Bound directly to a specific Lab and its designated Lab In-Charge faculty.</li>
            </ul>
            <div style="margin-top: 14px; font-family: var(--mono); font-size: 12px; color: #93c5fd;">
              Relational: <code>assets</code> table with individual row locks.
            </div>
          </div>

          <div style="display: flex; flex-direction: column;">
            <div class="canva-bullet-tag">CONSUMABLES (Common / Quantity)</div>
            <p style="font-size: 14px; color: var(--text-white-muted); margin-bottom: 16px; line-height: 1.5;">
              Common electronic modules and passive components maintained strictly by pooled batch counts per lab.
            </p>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 13.5px; color: var(--text-white-muted); flex: 1;">
              <li>• <strong>Classes:</strong> Sensor, Microcontroller, Microprocessor, Motors, Comm Modules, Battery, Misc.</li>
              <li>• <strong>Sensors &amp; Actuators:</strong> Explicitly treated as consumables (not individually asset-tracked).</li>
              <li>• <strong>Descriptive Fields:</strong> Description, Brand, Range (e.g. ultrasonic 2cm–400cm, DHT11 temp/humidity).</li>
              <li>• <strong>Counting:</strong> Pooled batch totals without individual barcode stickers per component.</li>
            </ul>
            <div style="margin-top: 14px; font-family: var(--mono); font-size: 12px; color: #93c5fd;">
              Relational: <code>consumable_stocks</code> table tracking total counts and condition pools.
            </div>
          </div>
        </div>
      </div>
      <div class="canva-footer">
        <div class="footer-left"><span>Section 2 · Domain Model</span></div>
        <div class="footer-right">07 / 24</div>
      </div>
    `
  },

  /* 08 — Asset Tracking, Barcode Identification & Permissions (Canva Slide 9 style) */
  {
    title: 'Asset Tracking, Barcode Identification & Permissions',
    html: `
      <div class="slide-topbar">
        <div class="topbar-logo"><svg class="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span>LabTrack</span></div>
        <div class="topbar-tag">Asset Domain Rules</div>
      </div>
      <div style="margin-bottom: 20px;">
        <h2 class="canva-heading">Asset Tracking, Barcodes &amp; Permissions</h2>
        <p class="canva-subtitle">
          Distinguishing Component Types from Physical Barcodes, enforcing separate Use vs. Issue permissions, and capturing procurement metadata.
        </p>
      </div>
      <div class="slide-body">
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; flex: 1;">
          <div class="canva-pill-card">
            <div class="canva-pill-card-header"><span class="canva-num-pill">01</span><h3>Type ≠ Physical Asset</h3></div>
            <p style="margin-bottom: 14px;">A single Component Type holds specifications; physical units hold barcode identifiers.</p>
            <div style="background: #ffffff; padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--canva-border-dark); font-family: var(--mono); font-size: 12px; line-height: 1.6; flex: 1;">
              <strong>Component:</strong> Intel RealSense D435i<br>
              <strong>Barcode ID:</strong> SIT-DCDS-CAM-0042<br>
              <strong>Holding Lab:</strong> Robotics Lab (L-102)<br>
              <strong>Status:</strong> AVAILABLE
            </div>
          </div>

          <div class="canva-pill-card">
            <div class="canva-pill-card-header"><span class="canva-num-pill">02</span><h3>Use vs. Issue Permissions</h3></div>
            <p style="margin-bottom: 14px;">Faculty confirmed these are completely distinct operational permissions:</p>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 13.5px; flex: 1;">
              <li>• <strong>Permission to USE:</strong> Authorizes a student team to operate an asset inside the lab.</li>
              <li>• <strong>Permission to ISSUE:</strong> Authorizes physical counter checkout and custody handover.</li>
            </ul>
          </div>

          <div class="canva-pill-card">
            <div class="canva-pill-card-header"><span class="canva-num-pill">03</span><h3>Procurement Reference</h3></div>
            <p style="margin-bottom: 14px;">Optional purchase identifiers stored when available to support institutional audits:</p>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 13.5px; flex: 1;">
              <li>• Bill Number (e.g. <code>BILL/2025/089</code>)</li>
              <li>• Purchase Order (PO) Number</li>
              <li>• College CPR Asset Number</li>
            </ul>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 8px;">*Optional: non-breaking if unrecorded.</div>
          </div>
        </div>
      </div>
      <div class="canva-footer">
        <div class="footer-left"><span>Section 2 · Identifiers</span></div>
        <div class="footer-right">08 / 24</div>
      </div>
    `
  },

  /* 09 — Consumable Quantity & Condition Management */
  {
    title: 'Consumable Quantity & Condition Management',
    html: `
      <div class="canva-topbar">
        <div class="topbar-logo"><svg class="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span>LabTrack</span></div>
        <div class="topbar-tag">Inventory Counting Logic</div>
      </div>
      <div class="canva-split">
        <div class="split-left">
          <div>
            <h2 class="split-hero-title">Consumable<br>Stock &amp;<br>Condition</h2>
            <p class="split-hero-desc">
              Managing electronic sensors, microcontrollers, and actuators with pooled counts and explicit good vs. bad condition separation.
            </p>
          </div>
          <div class="canva-big-box" style="padding: 22px 26px; border-radius: var(--radius-lg);">
            <div style="font-weight: 800; font-size: 15px; color: var(--accent-emerald); margin-bottom: 4px;">The Mandatory Physical Counting Rule</div>
            <div style="font-size: 13.5px; color: var(--text-dark); line-height: 1.45;">
              <strong>Total Physical Stock = Usable + Active Loans + Bad (Defective)</strong>. Bad units do not reduce physical tally.
            </div>
          </div>
        </div>
        <div class="canva-big-box" style="display: flex; flex-direction: column; justify-content: space-around;">
          <div>
            <h4 style="font-family: var(--display); font-size: 17px; font-weight: 800; margin-bottom: 8px;">Consumable Descriptive Metadata</h4>
            <p style="font-size: 13.5px; color: var(--text-muted); margin-bottom: 10px;">For common components with multiple varieties, the database stores concise attributes:</p>
            <table class="canva-clean-table">
              <thead><tr><th>Category</th><th>Example Component</th><th>Stored Metadata Attributes</th></tr></thead>
              <tbody>
                <tr><td><strong>Sensor</strong></td><td>Ultrasonic Distance Sensor</td><td>Brand: HC-SR04 · Range: 2cm–400cm · Voltage: 5V</td></tr>
                <tr><td><strong>Microcontroller</strong></td><td>ESP32 Development Board</td><td>Brand: Espressif · Dual Core · Wi-Fi + BLE</td></tr>
                <tr><td><strong>Motor</strong></td><td>Standard Servo 9g</td><td>Brand: TowerPro SG90 · Torque: 1.8 kg-cm · 180°</td></tr>
              </tbody>
            </table>
          </div>
          <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--canva-border-subtle);">
            <h4 style="font-family: var(--display); font-size: 16px; font-weight: 800; margin-bottom: 4px;">Bad Consumable Tracking</h4>
            <p style="font-size: 13.5px; color: var(--text-dark); line-height: 1.5;">
              Faculty confirmed: bad consumables may or may not be individually tracked. LabTrack maintains pooled bad counts in MySQL and streams burnt-sensor defect logs to MongoDB.
            </p>
          </div>
        </div>
      </div>
      <div class="canva-footer">
        <div class="footer-left"><span>Section 2 · Inventory Logic</span></div>
        <div class="footer-right">09 / 24</div>
      </div>
    `
  },

  /* 10 — Laboratory Responsibility & Governance */
  {
    title: 'Laboratory Responsibility & Administrative Structure',
    html: `
      <div class="canva-topbar">
        <div class="topbar-logo"><svg class="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span>LabTrack</span></div>
        <div class="topbar-tag">Organizational Model</div>
      </div>
      <div style="margin-bottom: 20px;">
        <h2 class="canva-heading">Laboratory Responsibility &amp; Governance</h2>
        <p class="canva-subtitle">
          Clear distinction between Lab In-Charges, Lab Assistants, and Faculty Mentors, backed by institutional Master Data.
        </p>
      </div>
      <div class="slide-body">
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; flex: 1;">
          <div class="canva-pill-card">
            <div class="canva-pill-card-header"><span class="canva-num-pill">01</span><h3>Lab In-Charge (Faculty)</h3></div>
            <p style="margin-bottom: 12px; font-weight: 600;">Academic Custodian</p>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 13.5px; flex: 1;">
              <li>• Direct academic custodian for laboratory hardware.</li>
              <li>• <strong>Faculty Limit:</strong> Responsible for <strong>1 lab or maximum 2 labs</strong>.</li>
              <li>• Oversees asset maintenance and laboratory integrity.</li>
            </ul>
          </div>

          <div class="canva-pill-card">
            <div class="canva-pill-card-header"><span class="canva-num-pill">02</span><h3>Lab Assistant (Staff)</h3></div>
            <p style="margin-bottom: 12px; font-weight: 600;">Operational Custodian</p>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 13.5px; flex: 1;">
              <li>• Operational custodian executing issues and check-ins.</li>
              <li>• <strong>Faculty Rule:</strong> <strong>Can manage and work across multiple labs</strong>.</li>
              <li>• Verifies asset barcode integrity and records condition.</li>
            </ul>
          </div>

          <div class="canva-pill-card">
            <div class="canva-pill-card-header"><span class="canva-num-pill">03</span><h3>Faculty Mentor</h3></div>
            <p style="margin-bottom: 12px; font-weight: 600;">Project Guide</p>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 13.5px; flex: 1;">
              <li>• Strictly separate entity from Lab In-Charge in schema.</li>
              <li>• Bound to student <em>projects</em>, not physical labs.</li>
              <li>• Vets student component requirements for academic validity.</li>
            </ul>
          </div>
        </div>

        <div class="canva-big-box" style="margin-top: 16px; padding: 18px 26px; border-radius: var(--radius-lg);">
          <div style="font-size: 14px; color: var(--text-dark);">
            <strong>Institutional Master Data:</strong> Coordinated through College IT Administration. Teacher IDs adhere to <code>T + 5 digits</code> (e.g. <code>T10482</code>); Staff IDs adhere to <code>N + 5 digits</code> (e.g. <code>N04912</code>).
          </div>
        </div>
      </div>
      <div class="canva-footer">
        <div class="footer-left"><span>Section 3 · Governance</span></div>
        <div class="footer-right">10 / 24</div>
      </div>
    `
  },

  /* 11 — Approval Hierarchy & HoD Overwrite Authority (Canva Slide 3 Dark Card style) */
  {
    title: 'Approval Hierarchy & HoD Overwrite Authority',
    cls: 'dark-slide',
    html: `
      <div class="canva-topbar">
        <div class="topbar-logo"><svg class="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span>LabTrack</span></div>
        <div class="topbar-tag">Authorization &amp; Security</div>
      </div>
      <div style="margin-bottom: 20px;">
        <h2 class="canva-heading">Approval Hierarchy &amp; HoD Overwrite Authority</h2>
        <p class="canva-subtitle">
          Faculty-verified rule: Head of Department verifies final approval for almost all components and holds exclusive overwrite access.
        </p>
      </div>
      <div class="slide-body">
        <div class="canva-big-box-dark" style="flex: 1; display: flex; flex-direction: column; justify-content: space-around;">
          <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px;">
            <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius-md); padding: 14px; text-align: center;"><span style="font-size: 11px; font-family: var(--mono); color: var(--text-white-muted);">STEP 1</span><div style="font-weight: 800; margin-top: 4px;">Student Team</div><div style="font-size: 12px; color: var(--text-white-muted);">Submits request</div></div>
            <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius-md); padding: 14px; text-align: center;"><span style="font-size: 11px; font-family: var(--mono); color: var(--text-white-muted);">STEP 2</span><div style="font-weight: 800; margin-top: 4px;">Faculty Mentor</div><div style="font-size: 12px; color: var(--text-white-muted);">Reviews necessity</div></div>
            <div style="background: rgba(37, 99, 235, 0.25); border: 1.5px solid #60a5fa; border-radius: var(--radius-md); padding: 14px; text-align: center;"><span style="font-size: 11px; font-family: var(--mono); color: #93c5fd;">STEP 3 · FINAL GATE</span><div style="font-weight: 800; color: #93c5fd; margin-top: 4px;">HoD Approval</div><div style="font-size: 12px; color: #bfdbfe;">Final sign-off</div></div>
            <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius-md); padding: 14px; text-align: center;"><span style="font-size: 11px; font-family: var(--mono); color: var(--text-white-muted);">STEP 4</span><div style="font-weight: 800; margin-top: 4px;">Lab Assistant</div><div style="font-size: 12px; color: var(--text-white-muted);">Holding lab verify</div></div>
            <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius-md); padding: 14px; text-align: center;"><span style="font-size: 11px; font-family: var(--mono); color: var(--text-white-muted);">STEP 5</span><div style="font-weight: 800; margin-top: 4px;">Issue / Use</div><div style="font-size: 12px; color: var(--text-white-muted);">Custody logged</div></div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 10px;">
            <div style="padding: 20px; background: rgba(220, 38, 38, 0.15); border: 1px solid rgba(220, 38, 38, 0.4); border-radius: var(--radius-md);">
              <div style="font-family: var(--display); font-size: 18px; font-weight: 800; color: #fca5a5; margin-bottom: 6px;">The HoD Overwrite Privilege</div>
              <p style="font-size: 13.5px; color: var(--text-white-muted); line-height: 1.5;">
                The Head of Department is the <strong>only role with overwrite access</strong> in the system. HoD can override reservation order, modify approved allocations, or authorize emergency issuance.
              </p>
            </div>
            <div style="padding: 20px; background: rgba(37, 99, 235, 0.15); border: 1px solid rgba(37, 99, 235, 0.4); border-radius: var(--radius-md);">
              <div style="font-family: var(--display); font-size: 18px; font-weight: 800; color: #93c5fd; margin-bottom: 6px;">RBAC Security Guardrails</div>
              <p style="font-size: 13.5px; color: var(--text-white-muted); line-height: 1.5;">
                Ordinary faculty, assistants, and students <strong>never possess overwrite permissions</strong>. Every HoD overwrite event is permanently streamed to MongoDB audit collections with mandatory justification metadata.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="canva-footer">
        <div class="footer-left"><span>Section 3 · Authorization</span></div>
        <div class="footer-right">11 / 24</div>
      </div>
    `
  },

  /* 12 — Issuing-Lab Traceability & Reminder Schedule (Canva Slide 11 style) */
  {
    title: 'Issuing-Lab Traceability & Reminder Schedule',
    html: `
      <div class="canva-topbar">
        <div class="topbar-logo"><svg class="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span>LabTrack</span></div>
        <div class="topbar-tag">Mandatory Data Tracking</div>
      </div>
      <div style="margin-bottom: 20px;">
        <h2 class="canva-heading">Issuing-Lab Traceability &amp; Email Reminders</h2>
        <p class="canva-subtitle">
          Every transaction permanently records the issuing lab, and background scheduler enforces the faculty-verified T-5 reminder policy.
        </p>
      </div>
      <div class="slide-body">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; flex: 1;">
          <div class="canva-big-box" style="display: flex; flex-direction: column;">
            <div class="canva-pill" style="margin-bottom: 12px; width: fit-content;">MANDATORY DATA ATTRIBUTE</div>
            <h3 style="font-family: var(--display); font-size: 20px; font-weight: 800; margin-bottom: 8px;">"Which Lab Issued This Component?"</h3>
            <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5; margin-bottom: 12px;">
              Faculty emphasized that tracking the issuing lab is mandatory for inter-lab inventory integrity:
            </p>
            <div style="background: #ffffff; padding: 16px; border-radius: var(--radius-sm); border: 1.5px solid var(--canva-border-dark); font-family: var(--mono); font-size: 12.5px; line-height: 1.6; flex: 1;">
              <strong>Issue Transaction Record:</strong><br>
              • Student ID &amp; Team Members<br>
              • Project ID &amp; Faculty Mentor ID<br>
              • Component ID &amp; Asset Barcode<br>
              • <strong style="color: var(--accent-blue);">Issuing Lab ID (e.g. LAB-IOT-02)</strong><br>
              • Issuing Authority Staff ID (N-Series)<br>
              • HoD Approval Reference ID<br>
              • Issue Date &amp; Assigned Due Date
            </div>
          </div>

          <div class="canva-big-box" style="display: flex; flex-direction: column; justify-content: space-around;">
            <div class="canva-pill" style="margin-bottom: 12px; width: fit-content;">FACULTY-VERIFIED SCHEDULE</div>
            <h3 style="font-family: var(--display); font-size: 20px; font-weight: 800; margin-bottom: 8px;">Automated Email Reminders</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; align-items: center; gap: 14px; padding: 14px 18px; background: #ffffff; border: 1.5px solid var(--canva-border-dark); border-radius: var(--radius-sm);">
                <span class="canva-num-pill" style="min-width: 100px;">T − 5 Days</span>
                <span style="font-size: 13.5px; font-weight: 600;">First automated reminder email sent to student team &amp; mentor.</span>
              </div>
              <div style="display: flex; align-items: center; gap: 14px; padding: 14px 18px; background: #ffffff; border: 1.5px solid var(--canva-border-dark); border-radius: var(--radius-sm);">
                <span class="canva-num-pill" style="min-width: 100px;">Due Date</span>
                <span style="font-size: 13.5px; font-weight: 600;">Physical return expected at the original issuing lab counter.</span>
              </div>
              <div style="display: flex; align-items: center; gap: 14px; padding: 14px 18px; background: #fee2e2; border: 1.5px solid var(--accent-rose); border-radius: var(--radius-sm);">
                <span class="canva-num-pill" style="min-width: 100px; color: var(--accent-rose); border-color: var(--accent-rose);">Daily Overdue</span>
                <span style="font-size: 13.5px; color: var(--accent-rose); font-weight: 700;">Daily automated overdue alert sent until item is checked in.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="canva-footer">
        <div class="footer-left"><span>Section 3 · Traceability</span></div>
        <div class="footer-right">12 / 24</div>
      </div>
    `
  },

  /* 13 — Return Inspection & Repeated Offender Identification */
  {
    title: 'Return Inspection & Repeated Offender Tracking',
    html: `
      <div class="canva-topbar">
        <div class="topbar-logo"><svg class="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span>LabTrack</span></div>
        <div class="topbar-tag">Accountability Engine</div>
      </div>
      <div class="canva-split">
        <div class="split-left">
          <div>
            <h2 class="split-hero-title">Return &amp;<br>Offender<br>Tracking</h2>
            <p class="split-hero-desc">
              Closing the loop with condition audits, physical defect recording, and automated identification of chronic overdue/damage patterns.
            </p>
          </div>
          <div class="canva-pill" style="width: fit-content;"><span>Explainable Governance</span></div>
        </div>
        <div class="canva-big-box" style="display: flex; flex-direction: column; justify-content: space-around;">
          <div style="display: flex; gap: 18px; align-items: flex-start; padding-bottom: 16px; border-bottom: 1px solid var(--canva-border-subtle);">
            <span class="canva-num-pill">01</span>
            <div>
              <h4 style="font-family: var(--display); font-size: 18px; font-weight: 800; margin-bottom: 4px;">Physical Return Inspection</h4>
              <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5;">
                Assistant tests hardware at the counter. Working items reset to <code>AVAILABLE</code>; damaged items transition to <code>UNDER_REPAIR</code> with photo evidence and defect notes. Consumable damages increment the <em>bad count</em> pool.
              </p>
            </div>
          </div>
          <div style="display: flex; gap: 18px; align-items: flex-start;">
            <span class="canva-num-pill">02</span>
            <div>
              <h4 style="font-family: var(--display); font-size: 18px; font-weight: 800; margin-bottom: 4px;">Repeated Offender Identification</h4>
              <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5;">
                Faculty approved feature surfacing students with &gt; 2 overdue returns or repeated burnouts. Appears as an advisory badge on mentor and HoD approval dashboards without relying on a black-box numerical score.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="canva-footer">
        <div class="footer-left"><span>Section 3 · Closure</span></div>
        <div class="footer-right">13 / 24</div>
      </div>
    `
  },

  /* 14 — Dual Data Storage: MySQL vs MongoDB Architecture */
  {
    title: 'Dual Data Storage: MySQL vs MongoDB Architecture',
    html: `
      <div class="canva-topbar">
        <div class="topbar-logo"><svg class="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span>LabTrack</span></div>
        <div class="topbar-tag">Database Architecture</div>
      </div>
      <div class="canva-split">
        <div class="split-left">
          <div>
            <h2 class="split-hero-title">Dual Data<br>Architecture</h2>
            <p class="split-hero-desc">
              The database split is driven strictly by data shape: authoritative transactional relational state in MySQL vs. append-heavy event telemetry in MongoDB.
            </p>
          </div>
          <div class="canva-pill" style="width: fit-content;"><span>Zero Bolted-On Features</span></div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div class="canva-big-box" style="display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span class="canva-pill" style="padding: 4px 12px;">MYSQL 8.0</span>
              <span style="font-family: var(--mono); font-size: 11px; font-weight: 700;">ACID CORE</span>
            </div>
            <h3 style="font-family: var(--display); font-size: 20px; font-weight: 800; margin-bottom: 6px;">System of Record</h3>
            <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">Transactional consistency, foreign keys, row locks.</p>
            <div style="background: #ffffff; padding: 12px 14px; border-radius: var(--radius-sm); border: 1.5px solid var(--canva-border-dark); font-size: 12px; line-height: 1.6; flex: 1;">
              • Users, Students, Faculty, Staff<br>
              • Labs &amp; Lab In-Charge mappings<br>
              • Projects, Members, Faculty Mentors<br>
              • Component catalogue &amp; Barcode Assets<br>
              • Consumable stock pools (total, bad)<br>
              • Active issue records &amp; Issuing Lab ID<br>
              • Stored procedure atomic checkout
            </div>
          </div>

          <div class="canva-big-box" style="display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span class="canva-pill" style="padding: 4px 12px;">MONGODB 7.0</span>
              <span style="font-family: var(--mono); font-size: 11px; font-weight: 700;">EVENT STORE</span>
            </div>
            <h3 style="font-family: var(--display); font-size: 20px; font-weight: 800; margin-bottom: 6px;">Event &amp; Telemetry Store</h3>
            <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">High-write throughput for polymorphic records.</p>
            <div style="background: #ffffff; padding: 12px 14px; border-radius: var(--radius-sm); border: 1.5px solid var(--canva-border-dark); font-size: 12px; line-height: 1.6; flex: 1;">
              • Immutable audit trail (approvals, HoD)<br>
              • Notification history (T-5 &amp; daily overdue)<br>
              • Unmet-demand event logging<br>
              • Return inspection defect metadata<br>
              • Aggregation pipelines for analytics<br>
              • <em>Never decides inventory availability</em>
            </div>
          </div>
        </div>
      </div>
      <div class="canva-footer">
        <div class="footer-left"><span>Section 4 · Data Storage</span></div>
        <div class="footer-right">14 / 24</div>
      </div>
    `
  },

  /* 15 — MySQL Relational Schema Design */
  {
    title: 'MySQL Relational Schema Design',
    html: `
      <div class="canva-topbar">
        <div class="topbar-logo"><svg class="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span>LabTrack</span></div>
        <div class="topbar-tag">Relational Engineering</div>
      </div>
      <div style="margin-bottom: 20px;">
        <h2 class="canva-heading">MySQL Relational Schema: 3NF Tables</h2>
        <p class="canva-subtitle">
          Fully normalized 3NF schema enforcing foreign keys, barcode uniqueness, and issuing-lab persistence.
        </p>
      </div>
      <div class="slide-body">
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; flex: 1;">
          <div class="canva-pill-card">
            <div class="canva-pill" style="margin-bottom: 12px; width: fit-content;">USERS &amp; LABS</div>
            <ul style="list-style: none; font-family: var(--mono); font-size: 12px; line-height: 1.7; color: var(--text-dark);">
              <li><strong>users</strong> (<span style="color: var(--accent-blue);">user_id</span>, name, email, role, institutional_id)</li>
              <li><strong>faculty_details</strong> (<span style="color: var(--accent-blue);">faculty_id</span>, department)</li>
              <li><strong>labs</strong> (<span style="color: var(--accent-blue);">lab_id</span>, lab_name, location, incharge_id)</li>
              <li><strong>lab_staff_assignments</strong> (<span style="color: var(--accent-blue);">id</span>, lab_id, staff_id)</li>
            </ul>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 10px;">In-Charge strictly 1 or max 2 labs via FK check.</div>
          </div>

          <div class="canva-pill-card">
            <div class="canva-pill" style="margin-bottom: 12px; width: fit-content;">CATALOGUE &amp; INVENTORY</div>
            <ul style="list-style: none; font-family: var(--mono); font-size: 12px; line-height: 1.7; color: var(--text-dark);">
              <li><strong>component_categories</strong> (<span style="color: var(--accent-emerald);">cat_id</span>, name, type)</li>
              <li><strong>components</strong> (<span style="color: var(--accent-emerald);">comp_id</span>, cat_id, name, desc, brand)</li>
              <li><strong>assets</strong> (<span style="color: var(--accent-emerald);">asset_id</span>, comp_id, barcode, current_lab_id, status, bill_no)</li>
              <li><strong>consumable_stocks</strong> (<span style="color: var(--accent-emerald);">id</span>, comp_id, lab_id, total_qty, bad_qty)</li>
            </ul>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 10px;">Barcodes have UNIQUE constraints.</div>
          </div>

          <div class="canva-pill-card">
            <div class="canva-pill" style="margin-bottom: 12px; width: fit-content;">TRANSACTIONS &amp; CUSTODY</div>
            <ul style="list-style: none; font-family: var(--mono); font-size: 12px; line-height: 1.7; color: var(--text-dark);">
              <li><strong>projects</strong> (<span style="color: var(--accent-amber);">project_id</span>, title, mentor_id, division)</li>
              <li><strong>requests</strong> (<span style="color: var(--accent-amber);">req_id</span>, project_id, comp_id, qty, status)</li>
              <li><strong>approvals</strong> (<span style="color: var(--accent-amber);">app_id</span>, req_id, hod_id, approved_at)</li>
              <li><strong>issue_transactions</strong> (<span style="color: var(--accent-amber);">issue_id</span>, student_id, comp_id, asset_id, <strong style="color: var(--accent-blue);">issuing_lab_id</strong>, due_date)</li>
            </ul>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 10px;">Preserves issuing lab on every issue record.</div>
          </div>
        </div>
      </div>
      <div class="canva-footer">
        <div class="footer-left"><span>Section 4 · Relational DDL</span></div>
        <div class="footer-right">15 / 24</div>
      </div>
    `
  },

  /* 16 — MongoDB Document Collections & Event Telemetry */
  {
    title: 'MongoDB Document Collections & Event Telemetry',
    html: `
      <div class="canva-topbar">
        <div class="topbar-logo"><svg class="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span>LabTrack</span></div>
        <div class="topbar-tag">NoSQL Document Design</div>
      </div>
      <div style="margin-bottom: 20px;">
        <h2 class="canva-heading">MongoDB Document Collections &amp; Event Telemetry</h2>
        <p class="canva-subtitle">
          Every collection in MongoDB serves an actual project reason: schema flexibility for polymorphic logs and append-only event auditing.
        </p>
      </div>
      <div class="slide-body">
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; flex: 1;">
          <div class="canva-big-box" style="display: flex; flex-direction: column; padding: 24px;">
            <div class="canva-pill" style="margin-bottom: 10px; width: fit-content;">audit_events</div>
            <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 10px;">Captures approval transitions, issues, and HoD overwrites.</p>
            <div class="canva-code" style="flex: 1;">
{
  <span class="kw">"_id"</span>: <span class="str">"6701...9a"</span>,
  <span class="kw">"event_type"</span>: <span class="str">"HOD_OVERWRITE"</span>,
  <span class="kw">"actor_id"</span>: <span class="str">"T10001"</span>,
  <span class="kw">"target_asset"</span>: <span class="str">"SIT-CAM-0042"</span>,
  <span class="kw">"issuing_lab"</span>: <span class="str">"LAB-ROBOTICS"</span>,
  <span class="kw">"reason"</span>: <span class="str">"Competition prep"</span>,
  <span class="kw">"timestamp"</span>: <span class="kw">ISODate</span>(...)
}
            </div>
          </div>

          <div class="canva-big-box" style="display: flex; flex-direction: column; padding: 24px;">
            <div class="canva-pill" style="margin-bottom: 10px; width: fit-content;">unmet_demand_events</div>
            <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 10px;">Logs queries for unstocked items to guide procurement.</p>
            <div class="canva-code" style="flex: 1;">
{
  <span class="kw">"_id"</span>: <span class="str">"6701...b2"</span>,
  <span class="kw">"student_id"</span>: <span class="str">"PRN2502001"</span>,
  <span class="kw">"component_queried"</span>: <span class="str">"Jetson Nano"</span>,
  <span class="kw">"category"</span>: <span class="str">"Microprocessor"</span>,
  <span class="kw">"requested_qty"</span>: <span class="num">2</span>,
  <span class="kw">"status"</span>: <span class="str">"NOT_STOCKED"</span>,
  <span class="kw">"date"</span>: <span class="kw">ISODate</span>(...)
}
            </div>
          </div>

          <div class="canva-big-box" style="display: flex; flex-direction: column; padding: 24px;">
            <div class="canva-pill" style="margin-bottom: 10px; width: fit-content;">notification_logs</div>
            <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 10px;">Tracks email dispatches across T-5 and daily overdue.</p>
            <div class="canva-code" style="flex: 1;">
{
  <span class="kw">"_id"</span>: <span class="str">"6701...c4"</span>,
  <span class="kw">"recipient_email"</span>: <span class="str">"team@sit.edu"</span>,
  <span class="kw">"type"</span>: <span class="str">"T_MINUS_5_REMINDER"</span>,
  <span class="kw">"due_date"</span>: <span class="str">"2026-10-28"</span>,
  <span class="kw">"issue_ref_id"</span>: <span class="num">1042</span>,
  <span class="kw">"smtp_response"</span>: <span class="str">"250 OK"</span>
}
            </div>
          </div>
        </div>
      </div>
      <div class="canva-footer">
        <div class="footer-left"><span>Section 4 · MongoDB Schema</span></div>
        <div class="footer-right">16 / 24</div>
      </div>
    `
  },

  /* 17 — Advanced SQL: Multi-Table Joins & Correlated Subqueries */
  {
    title: 'Advanced SQL Querying: Joins & Subqueries',
    html: `
      <div class="canva-topbar">
        <div class="topbar-logo"><svg class="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span>LabTrack</span></div>
        <div class="topbar-tag">Advanced SQL · DCDS Criterion 4</div>
      </div>
      <div style="margin-bottom: 20px;">
        <h2 class="canva-heading">Multi-Table Relational JOINs &amp; Subqueries</h2>
        <p class="canva-subtitle">
          Real, runnable MySQL queries powering LabTrack's multi-lab tracking, active loans, and repeated offender detection.
        </p>
      </div>
      <div class="slide-body">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; flex: 1;">
          <div class="canva-big-box" style="display: flex; flex-direction: column; padding: 28px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span class="canva-pill">QUERY 1: 6-TABLE JOIN</span>
              <span style="font-size: 12px; font-family: var(--mono); color: var(--text-muted);">Active Asset Traceability</span>
            </div>
            <div class="canva-code" style="flex: 1;">
<span class="kw">SELECT</span> i.issue_id, u.name <span class="kw">AS</span> student, p.title <span class="kw">AS</span> project,
       c.name <span class="kw">AS</span> component, a.barcode, l.lab_name <span class="kw">AS</span> issuing_lab,
       f.name <span class="kw">AS</span> lab_incharge, i.due_date
<span class="kw">FROM</span> issue_transactions i
<span class="kw">JOIN</span> users u <span class="kw">ON</span> i.student_id = u.user_id
<span class="kw">JOIN</span> projects p <span class="kw">ON</span> i.project_id = p.project_id
<span class="kw">JOIN</span> assets a <span class="kw">ON</span> i.asset_id = a.asset_id
<span class="kw">JOIN</span> components c <span class="kw">ON</span> a.comp_id = c.comp_id
<span class="kw">JOIN</span> labs l <span class="kw">ON</span> i.issuing_lab_id = l.lab_id
<span class="kw">JOIN</span> users f <span class="kw">ON</span> l.incharge_id = f.user_id
<span class="kw">WHERE</span> i.status = <span class="str">'ACTIVE'</span>;
            </div>
          </div>

          <div class="canva-big-box" style="display: flex; flex-direction: column; padding: 28px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span class="canva-pill">QUERY 2: CORRELATED SUBQUERY</span>
              <span style="font-size: 12px; font-family: var(--mono); color: var(--text-muted);">Repeated Offender Detection</span>
            </div>
            <div class="canva-code" style="flex: 1;">
<span class="kw">SELECT</span> u.user_id, u.name, <span class="fn">COUNT</span>(i.issue_id) <span class="kw">AS</span> overdue_count,
       <span class="fn">SUM</span>(<span class="fn">DATEDIFF</span>(<span class="fn">CURDATE</span>(), i.due_date)) <span class="kw">AS</span> total_days_late
<span class="kw">FROM</span> users u
<span class="kw">JOIN</span> issue_transactions i <span class="kw">ON</span> u.user_id = i.student_id
<span class="kw">WHERE</span> i.status = <span class="str">'ACTIVE'</span> <span class="kw">AND</span> i.due_date &lt; <span class="fn">CURDATE</span>()
<span class="kw">GROUP BY</span> u.user_id, u.name
<span class="kw">HAVING</span> <span class="fn">COUNT</span>(i.issue_id) &gt;= <span class="num">2</span>
<span class="kw">ORDER BY</span> total_days_late <span class="kw">DESC</span>;
            </div>
          </div>
        </div>
      </div>
      <div class="canva-footer">
        <div class="footer-left"><span>Section 4 · Joins &amp; Subqueries</span></div>
        <div class="footer-right">17 / 24</div>
      </div>
    `
  },

  /* 18 — Advanced SQL: Stored Procedures & Transactions (Canva Dark Card style) */
  {
    title: 'Advanced SQL: Stored Procedures & Transactions',
    cls: 'dark-slide',
    html: `
      <div class="canva-topbar">
        <div class="topbar-logo"><svg class="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span>LabTrack</span></div>
        <div class="topbar-tag">Advanced SQL · Stored Procedures</div>
      </div>
      <div style="margin-bottom: 20px;">
        <h2 class="canva-heading">Atomic Issuance Stored Procedure in MySQL</h2>
        <p class="canva-subtitle">
          Eliminates race conditions by locking the physical asset row and inserting the issue transaction in one atomic commit.
        </p>
      </div>
      <div class="slide-body">
        <div class="canva-big-box-dark" style="flex: 1; display: grid; grid-template-columns: 6fr 4fr; gap: 32px; padding: 36px;">
          <div style="display: flex; flex-direction: column;">
            <div style="font-family: var(--display); font-size: 15px; font-weight: 800; color: #93c5fd; margin-bottom: 8px;">MySQL Stored Procedure: sp_issue_asset</div>
            <div class="canva-code" style="flex: 1; background: #22262d; border-color: rgba(255,255,255,0.15);">
<span class="kw">DELIMITER</span> //
<span class="kw">CREATE PROCEDURE</span> sp_issue_asset(
  <span class="kw">IN</span> p_barcode <span class="kw">VARCHAR</span>(<span class="num">64</span>), <span class="kw">IN</span> p_student_id <span class="kw">INT</span>,
  <span class="kw">IN</span> p_project_id <span class="kw">INT</span>, <span class="kw">IN</span> p_issuing_lab_id <span class="kw">INT</span>, <span class="kw">IN</span> p_due_date <span class="kw">DATE</span>
)
<span class="kw">BEGIN</span>
  <span class="kw">DECLARE</span> v_asset_id <span class="kw">INT</span>;
  <span class="kw">DECLARE</span> v_status <span class="kw">VARCHAR</span>(<span class="num">20</span>);

  <span class="kw">START TRANSACTION</span>;
  <span class="cm">-- Lock the asset row to eliminate race conditions</span>
  <span class="kw">SELECT</span> asset_id, status <span class="kw">INTO</span> v_asset_id, v_status
  <span class="kw">FROM</span> assets <span class="kw">WHERE</span> barcode = p_barcode <span class="kw">FOR UPDATE</span>;

  <span class="kw">IF</span> v_status != <span class="str">'AVAILABLE'</span> <span class="kw">THEN</span>
    <span class="kw">ROLLBACK</span>;
    <span class="kw">SIGNAL SQLSTATE</span> <span class="str">'45000'</span> <span class="kw">SET MESSAGE_TEXT</span> = <span class="str">'Asset not available'</span>;
  <span class="kw">ELSE</span>
    <span class="kw">INSERT INTO</span> issue_transactions(student_id, asset_id, project_id, issuing_lab_id, due_date, status)
    <span class="kw">VALUES</span>(p_student_id, v_asset_id, p_project_id, p_issuing_lab_id, p_due_date, <span class="str">'ACTIVE'</span>);
    <span class="kw">UPDATE</span> assets <span class="kw">SET</span> status = <span class="str">'ISSUED'</span> <span class="kw">WHERE</span> asset_id = v_asset_id;
    <span class="kw">COMMIT</span>;
  <span class="kw">END IF</span>;
<span class="kw">END</span> //
<span class="kw">DELIMITER</span> ;
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 18px; justify-content: center;">
            <div style="padding: 22px; background: rgba(5, 150, 105, 0.15); border: 1px solid rgba(5, 150, 105, 0.4); border-radius: var(--radius-md);">
              <h4 style="font-family: var(--display); font-size: 17px; font-weight: 800; color: #6ee7b7; margin-bottom: 6px;">Pessimistic Row Locking</h4>
              <p style="font-size: 13.5px; color: var(--text-white-muted); line-height: 1.55;">
                <code>SELECT ... FOR UPDATE</code> locks the physical unit so concurrent checkout requests from two assistants cannot both succeed.
              </p>
            </div>
            <div style="padding: 22px; background: rgba(37, 99, 235, 0.15); border: 1px solid rgba(37, 99, 235, 0.4); border-radius: var(--radius-md);">
              <h4 style="font-family: var(--display); font-size: 17px; font-weight: 800; color: #93c5fd; margin-bottom: 6px;">Issuing Lab Verification</h4>
              <p style="font-size: 13.5px; color: var(--text-white-muted); line-height: 1.55;">
                Procedure permanently bonds <code>issuing_lab_id</code> with the active transaction row, satisfying DCDS criteria for transaction safety.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="canva-footer">
        <div class="footer-left"><span>Section 4 · Transaction Control</span></div>
        <div class="footer-right">18 / 24</div>
      </div>
    `
  },

  /* 19 — Advanced NoSQL: MongoDB Aggregation Pipelines */
  {
    title: 'Advanced NoSQL: MongoDB Aggregation Pipelines',
    html: `
      <div class="canva-topbar">
        <div class="topbar-logo"><svg class="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span>LabTrack</span></div>
        <div class="topbar-tag">Advanced NoSQL · DCDS Criterion 4</div>
      </div>
      <div style="margin-bottom: 20px;">
        <h2 class="canva-heading">MongoDB Multi-Stage Aggregation Pipelines</h2>
        <p class="canva-subtitle">
          Real document aggregation pipelines generating unmet-demand analytics and HoD overwrite security audits.
        </p>
      </div>
      <div class="slide-body">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; flex: 1;">
          <div class="canva-big-box" style="display: flex; flex-direction: column; padding: 28px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span class="canva-pill">PIPELINE 1: UNMET DEMAND</span>
              <span style="font-size: 12px; font-family: var(--mono); color: var(--text-muted);">$group &amp; $sort</span>
            </div>
            <div class="canva-code" style="flex: 1;">
db.unmet_demand_events.aggregate([
  { <span class="kw">$match</span>: { status: <span class="str">"NOT_STOCKED"</span> } },
  { <span class="kw">$group</span>: {
      _id: { comp: <span class="str">"$component_queried"</span>, cat: <span class="str">"$category"</span> },
      total_requests: { <span class="kw">$sum</span>: <span class="num">1</span> },
      total_qty_needed: { <span class="kw">$sum</span>: <span class="str">"$requested_qty"</span> }
  } },
  { <span class="kw">$sort</span>: { total_qty_needed: <span class="num">-1</span> } },
  { <span class="kw">$limit</span>: <span class="num">5</span> }
]);
            </div>
          </div>

          <div class="canva-big-box" style="display: flex; flex-direction: column; padding: 28px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span class="canva-pill">PIPELINE 2: HOD OVERWRITE AUDIT</span>
              <span style="font-size: 12px; font-family: var(--mono); color: var(--text-muted);">$match &amp; $project</span>
            </div>
            <div class="canva-code" style="flex: 1;">
db.audit_events.aggregate([
  { <span class="kw">$match</span>: { event_type: <span class="str">"HOD_OVERWRITE"</span> } },
  { <span class="kw">$project</span>: {
      actor_id: <span class="num">1</span>, target_asset: <span class="num">1</span>, issuing_lab: <span class="num">1</span>, reason: <span class="num">1</span>,
      formatted_time: { <span class="kw">$dateToString</span>: { format: <span class="str">"%Y-%m-%d %H:%M"</span>, date: <span class="str">"$timestamp"</span> } }
  } },
  { <span class="kw">$sort</span>: { timestamp: <span class="num">-1</span> } }
]);
            </div>
          </div>
        </div>
      </div>
      <div class="canva-footer">
        <div class="footer-left"><span>Section 4 · Aggregations</span></div>
        <div class="footer-right">19 / 24</div>
      </div>
    `
  },

  /* 20 — Python Implementation Architecture (Canva Slide 6 4-Grid style) */
  {
    title: 'Python Implementation Architecture',
    html: `
      <div class="canva-topbar">
        <div class="topbar-logo"><svg class="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span>LabTrack</span></div>
        <div class="topbar-tag">Python Architecture · DCDS Criterion 2</div>
      </div>
      <div style="margin-bottom: 20px;">
        <h2 class="canva-heading">Modular Python Implementation &amp; Domain Classes</h2>
        <p class="canva-subtitle">
          Python application layer structured with OOP domain classes, custom exceptions, Excel file ingestion, and dual-database connectors.
        </p>
      </div>
      <div class="slide-body">
        <div style="display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 20px; flex: 1;">
          <div class="canva-pill-card">
            <div class="canva-pill-card-header"><span class="canva-num-pill">01</span><h3>OOP Domain Classes</h3></div>
            <p>Domain models encapsulating business logic: <code>AssetUnit</code> (barcode, status, holding lab), <code>ConsumableBatch</code> (pooled stock math), <code>ProjectContext</code> (mentors), and <code>IssueTransaction</code>.</p>
          </div>
          <div class="canva-pill-card">
            <div class="canva-pill-card-header"><span class="canva-num-pill">02</span><h3>Custom Exception Hierarchy</h3></div>
            <p>Granular error handling: <code>LabTrackException</code>, <code>AssetUnavailableError</code>, <code>UnauthorizedOverrideError</code>, and <code>ConsumableDepletedError</code> mapping cleanly to HTTP 4xx/5xx status codes.</p>
          </div>
          <div class="canva-pill-card">
            <div class="canva-pill-card-header"><span class="canva-num-pill">03</span><h3>Excel Ingestion Pipeline</h3></div>
            <p>File handling via <code>pandas</code> and <code>openpyxl</code>: parses legacy departmental spreadsheets, validates unique barcode identifiers, and normalizes records into MySQL tables.</p>
          </div>
          <div class="canva-pill-card">
            <div class="canva-pill-card-header"><span class="canva-num-pill">04</span><h3>Dual Database Connectors</h3></div>
            <p>Decoupled repository pattern: <code>mysql-connector-python</code> with pooled connections for ACID operations; <code>pymongo</code> / <code>motor</code> for asynchronous event dispatches.</p>
          </div>
        </div>
      </div>
      <div class="canva-footer">
        <div class="footer-left"><span>Section 5 · Python Engineering</span></div>
        <div class="footer-right">20 / 24</div>
      </div>
    `
  },

  /* 21 — Testing, Validation, Security & Error Handling */
  {
    title: 'Testing, Validation, Security & Error Handling',
    html: `
      <div class="canva-topbar">
        <div class="topbar-logo"><svg class="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span>LabTrack</span></div>
        <div class="topbar-tag">Security &amp; Quality · DCDS Criterion 6</div>
      </div>
      <div style="margin-bottom: 20px;">
        <h2 class="canva-heading">Testing, Validation, Security &amp; Error Handling</h2>
        <p class="canva-subtitle">
          Defensive coding practices ensuring input integrity, SQL injection prevention, role protection, and automated test coverage.
        </p>
      </div>
      <div class="slide-body">
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; flex: 1;">
          <div class="canva-pill-card">
            <div class="canva-pill" style="margin-bottom: 12px; width: fit-content;">AUTHORIZATION GUARDS</div>
            <h3 style="margin-bottom: 8px;">Server-Side RBAC &amp; HoD Lock</h3>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 13.5px; flex: 1;">
              <li>• <strong>JWT Claims:</strong> Verified on every protected endpoint.</li>
              <li>• <strong>HoD Barrier:</strong> Overwrite endpoints verify <code>role == 'HOD'</code> at controller layer before DB execution.</li>
              <li>• <strong>Asset Guard:</strong> Separate validation for asset use vs. asset checkout.</li>
            </ul>
          </div>

          <div class="canva-pill-card">
            <div class="canva-pill" style="margin-bottom: 12px; width: fit-content;">INPUT &amp; SQL SAFETY</div>
            <h3 style="margin-bottom: 8px;">Parameterized Queries</h3>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 13.5px; flex: 1;">
              <li>• <strong>SQL Injection Prevention:</strong> 100% of queries execute via parameterized placeholders (<code>%s</code>).</li>
              <li>• <strong>Pydantic Schemas:</strong> Type validation for barcodes, quantities (&gt; 0), and institutional IDs.</li>
              <li>• <strong>DB Constraints:</strong> Foreign keys and <code>CHECK (total_qty &gt;= bad_qty)</code>.</li>
            </ul>
          </div>

          <div class="canva-pill-card">
            <div class="canva-pill" style="margin-bottom: 12px; width: fit-content;">AUTOMATED TESTING</div>
            <h3 style="margin-bottom: 8px;">Pytest Concurrency Suite</h3>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 13.5px; flex: 1;">
              <li>• <strong>Unit Tests:</strong> Verify stock formula math and exception handling.</li>
              <li>• <strong>Integration Tests:</strong> Validate rollback behavior on unavailable hardware.</li>
              <li>• <strong>Concurrency Tests:</strong> Simulates parallel checkouts to prove row-lock safety.</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="canva-footer">
        <div class="footer-left"><span>Section 5 · Robustness</span></div>
        <div class="footer-right">21 / 24</div>
      </div>
    `
  },

  /* 22 — Working Prototype & Running Example Scenario */
  {
    title: 'Working Prototype & Running Example Scenario',
    html: `
      <div class="canva-topbar">
        <div class="topbar-logo"><svg class="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span>LabTrack</span></div>
        <div class="topbar-tag">Live Demonstration Scenario</div>
      </div>
      <div style="margin-bottom: 20px;">
        <h2 class="canva-heading">End-to-End Running Prototype Walkthrough</h2>
        <p class="canva-subtitle">
          Demonstrating a complete 10-stage hardware lifecycle from login through HoD approval to return inspection.
        </p>
      </div>
      <div class="slide-body">
        <div class="canva-big-box" style="flex: 1; display: flex; flex-direction: column; justify-content: space-around;">
          <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px;">
            <div class="canva-pill-card" style="padding: 16px; text-align: center; border-radius: var(--radius-md);"><span style="font-size: 11px; font-weight: 800; color: var(--text-muted);">STAGE 01</span><div style="font-weight: 800; font-size: 13.5px; margin-top: 4px;">Auth &amp; Master Data</div><div style="font-size: 11.5px; color: var(--text-muted);">Teacher ID T10482</div></div>
            <div class="canva-pill-card" style="padding: 16px; text-align: center; border-radius: var(--radius-md);"><span style="font-size: 11px; font-weight: 800; color: var(--text-muted);">STAGE 02</span><div style="font-weight: 800; font-size: 13.5px; margin-top: 4px;">Project Selection</div><div style="font-size: 11.5px; color: var(--text-muted);">Project #12 &amp; Mentor</div></div>
            <div class="canva-pill-card" style="padding: 16px; text-align: center; border-radius: var(--radius-md); background: #ffffff;"><span style="font-size: 11px; font-weight: 800; color: var(--accent-blue);">STAGE 03</span><div style="font-weight: 800; font-size: 13.5px; color: var(--accent-blue); margin-top: 4px;">Catalogue Query</div><div style="font-size: 11.5px; color: var(--accent-blue);">Live stock check</div></div>
            <div class="canva-pill-card" style="padding: 16px; text-align: center; border-radius: var(--radius-md);"><span style="font-size: 11px; font-weight: 800; color: var(--text-muted);">STAGE 04</span><div style="font-weight: 800; font-size: 13.5px; margin-top: 4px;">Holding Lab Shown</div><div style="font-size: 11.5px; color: var(--text-muted);">Robotics Lab L-102</div></div>
            <div class="canva-pill-card" style="padding: 16px; text-align: center; border-radius: var(--radius-md);"><span style="font-size: 11px; font-weight: 800; color: var(--text-muted);">STAGE 05</span><div style="font-weight: 800; font-size: 13.5px; margin-top: 4px;">Mentor Review</div><div style="font-size: 11.5px; color: var(--text-muted);">Academic vetting</div></div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-top: 12px;">
            <div class="canva-pill-card" style="padding: 16px; text-align: center; border-radius: var(--radius-md);"><span style="font-size: 11px; font-weight: 800; color: var(--accent-blue);">STAGE 06</span><div style="font-weight: 800; font-size: 13.5px; margin-top: 4px;">HoD Final Approval</div><div style="font-size: 11.5px; color: var(--text-muted);">Final sign-off</div></div>
            <div class="canva-pill-card" style="padding: 16px; text-align: center; border-radius: var(--radius-md); background: #ffffff;"><span style="font-size: 11px; font-weight: 800; color: var(--accent-blue);">STAGE 07</span><div style="font-weight: 800; font-size: 13.5px; color: var(--accent-blue); margin-top: 4px;">Counter Issuance</div><div style="font-size: 11.5px; color: var(--accent-blue);">Issuing Lab saved</div></div>
            <div class="canva-pill-card" style="padding: 16px; text-align: center; border-radius: var(--radius-md);"><span style="font-size: 11px; font-weight: 800; color: var(--text-muted);">STAGE 08</span><div style="font-weight: 800; font-size: 13.5px; margin-top: 4px;">T-5 Reminder Fires</div><div style="font-size: 11.5px; color: var(--text-muted);">Automated email</div></div>
            <div class="canva-pill-card" style="padding: 16px; text-align: center; border-radius: var(--radius-md);"><span style="font-size: 11px; font-weight: 800; color: var(--text-muted);">STAGE 09</span><div style="font-weight: 800; font-size: 13.5px; margin-top: 4px;">Condition Audit</div><div style="font-size: 11.5px; color: var(--text-muted);">Working vs Bad</div></div>
            <div class="canva-pill-card" style="padding: 16px; text-align: center; border-radius: var(--radius-md);"><span style="font-size: 11px; font-weight: 800; color: var(--text-muted);">STAGE 10</span><div style="font-weight: 800; font-size: 13.5px; margin-top: 4px;">MongoDB Audit Log</div><div style="font-size: 11.5px; color: var(--text-muted);">Telemetry saved</div></div>
          </div>
        </div>
      </div>
      <div class="canva-footer">
        <div class="footer-left"><span>Section 6 · Live Prototype</span></div>
        <div class="footer-right">22 / 24</div>
      </div>
    `
  },

  /* 23 — DCDS Lab ESE Rubric Alignment Scorecard */
  {
    title: 'DCDS Lab ESE Rubric Alignment Scorecard',
    html: `
      <div class="canva-topbar">
        <div class="topbar-logo"><svg class="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span>LabTrack</span></div>
        <div class="topbar-tag">Academic Rubric Compliance</div>
      </div>
      <div style="margin-bottom: 20px;">
        <h2 class="canva-heading">DCDS Lab ESE Rubric Alignment (10 Marks / 40%)</h2>
        <p class="canva-subtitle">
          Direct mapping of LabTrack architectural deliverables to the official 6 evaluation parameters.
        </p>
      </div>
      <div class="slide-body">
        <div class="canva-big-box" style="padding: 20px; flex: 1; display: flex; flex-direction: column;">
          <table class="canva-clean-table" style="flex: 1;">
            <thead>
              <tr>
                <th style="width: 22%;">Official Evaluation Parameter</th>
                <th style="width: 8%; text-align: center;">Max</th>
                <th style="width: 44%;">Expected "Excellent" Functionality (From Rubric)</th>
                <th style="width: 26%;">LabTrack Deliverable Evidence</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>1. Application Design &amp; Functionality</strong></td>
                <td style="text-align: center; font-weight: 800; color: var(--accent-blue);">2.0</td>
                <td>Fully functional application meeting all requirements with intuitive workflow and proper modular design.</td>
                <td>Centralized lifecycle, 4-role RBAC, HoD final gate, issuing-lab custody tracking.</td>
              </tr>
              <tr>
                <td><strong>2. Python Programming Implementation</strong></td>
                <td style="text-align: center; font-weight: 800; color: var(--accent-blue);">2.0</td>
                <td>Efficient use of Python concepts: functions, classes, exception handling, file handling, modular coding.</td>
                <td>FastAPI ASGI routers, domain entity classes, custom exception hierarchy, Excel ingestion via pandas.</td>
              </tr>
              <tr>
                <td><strong>3. Database Integration (SQL &amp; NoSQL)</strong></td>
                <td style="text-align: center; font-weight: 800; color: var(--accent-blue);">2.0</td>
                <td>Seamless integration with SQL/NoSQL database, proper connectivity, and data manipulation.</td>
                <td>MySQL 8.0 (system of record) + MongoDB 7.0 (event stream) with clear architectural separation.</td>
              </tr>
              <tr>
                <td><strong>4. Advanced Database Querying &amp; Retrieval</strong></td>
                <td style="text-align: center; font-weight: 800; color: var(--accent-blue);">2.0</td>
                <td>Effective use of advanced queries: Joins, Nested Queries, Aggregations, Grouping, Stored Procedures, MongoDB Pipeline.</td>
                <td>6-table relational JOINs, correlated subqueries, MySQL atomic <code>sp_issue_asset</code>, MongoDB <code>$group</code> pipelines.</td>
              </tr>
              <tr>
                <td><strong>5. Code Quality, Documentation &amp; UI</strong></td>
                <td style="text-align: center; font-weight: 800; color: var(--accent-blue);">1.0</td>
                <td>Well-structured code, proper comments, meaningful variable names, clear output/interface, complete docs.</td>
                <td>PEP 8 compliance, Pydantic type annotations, interactive Swagger docs, master context specification.</td>
              </tr>
              <tr>
                <td><strong>6. Testing, Validation, Security &amp; Error Handling</strong></td>
                <td style="text-align: center; font-weight: 800; color: var(--accent-blue);">1.0</td>
                <td>Comprehensive testing, input validation, and robust error handling implemented.</td>
                <td>Pytest suite, parameterized queries, HoD-only overwrite guardrails, database foreign key constraints.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="canva-footer">
        <div class="footer-left"><span>Section 6 · Evaluation</span></div>
        <div class="footer-right">23 / 24</div>
      </div>
    `
  },

  /* 24 — Where Should We Improve? (Canva Closing Review style) */
  {
    title: 'Where Should We Improve? Faculty Discussion',
    html: `
      <div class="canva-topbar">
        <div class="topbar-logo"><svg class="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span>LabTrack</span></div>
        <div class="topbar-tag">Faculty Design Review</div>
      </div>
      <div class="canva-split">
        <div class="split-left">
          <div>
            <h2 class="split-hero-title">Where<br>Should We<br>Improve?</h2>
            <p class="split-hero-desc">
              Targeted questions for Dr. Anjali Dalvi, Dr. Sumanto Dutta, and Dr. Wasim Khan to refine our database models and operational procedures.
            </p>
          </div>
          <div class="canva-pill" style="width: fit-content;"><span>Design Review Session</span></div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 18px;">
          <div class="canva-big-box" style="padding: 24px; border-left: 5px solid var(--accent-blue);">
            <div style="font-family: var(--display); font-size: 16px; font-weight: 800; color: var(--accent-blue); margin-bottom: 6px;">1. Consumable Boundary</div>
            <p style="font-size: 13.5px; color: var(--text-dark); line-height: 1.5;">
              Should higher-end sensor modules (e.g. LiDAR or IMUs) remain classified as consumables by count, or transition to barcode-tracked assets based on unit price?
            </p>
          </div>
          <div class="canva-big-box" style="padding: 24px; border-left: 5px solid var(--accent-emerald);">
            <div style="font-family: var(--display); font-size: 16px; font-weight: 800; color: var(--accent-emerald); margin-bottom: 6px;">2. Bad-Consumable Tracking</div>
            <p style="font-size: 13.5px; color: var(--text-dark); line-height: 1.5;">
              For damaged sensors, is maintaining a pooled count per lab (Total = Usable + Bad) sufficient, or should assistant inspection log formal disposal batch records?
            </p>
          </div>
          <div class="canva-big-box" style="padding: 24px; border-left: 5px solid var(--accent-rose);">
            <div style="font-family: var(--display); font-size: 16px; font-weight: 800; color: var(--accent-rose); margin-bottom: 6px;">3. HoD Overwrite Logging</div>
            <p style="font-size: 13.5px; color: var(--text-dark); line-height: 1.5;">
              When the HoD executes an operational overwrite, what mandatory fields should the audit collection enforce (e.g. textual reason, mentor notification)?
            </p>
          </div>
          <div class="canva-big-box" style="padding: 24px; border-left: 5px solid var(--accent-amber);">
            <div style="font-family: var(--display); font-size: 16px; font-weight: 800; color: var(--accent-amber); margin-bottom: 6px;">4. Repeated Offender Policy</div>
            <p style="font-size: 13.5px; color: var(--text-dark); line-height: 1.5;">
              When a student exceeds overdue thresholds, should the system temporarily block new requests automatically, or simply display an advisory warning to faculty?
            </p>
          </div>
        </div>
      </div>
      <div class="canva-footer">
        <div class="footer-left"><span>Section 7 · Faculty Discussion &amp; Feedback</span><span>Thank you for your time and guidance.</span></div>
        <div class="footer-right">24 / 24</div>
      </div>
    `
  }
];
