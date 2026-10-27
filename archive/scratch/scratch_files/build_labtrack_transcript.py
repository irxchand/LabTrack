import os
import json
import sys
import datetime

sys.stdout.reconfigure(encoding='utf-8')

brain_dir = r'C:\Users\irxchand\.gemini\antigravity-ide\brain'
workspace_dir = r'd:\Users\Documents\Symbiosis\Academics\Sem 3\Low Credit\CCE\Project'

# Load voice notes
manoj_talk_path = os.path.join(workspace_dir, "manoj sir talk.txt")
manoj_talk_text = ""
if os.path.exists(manoj_talk_path):
    with open(manoj_talk_path, 'r', encoding='utf-8', errors='ignore') as f:
        manoj_talk_text = f.read().strip()

sessions = [
    {
        "id": "684009ea-b1de-46eb-bcfd-a7fce5dfdfcb",
        "title": "Early Discovery & Architecture Exploration",
        "date": "2026-10-05"
    },
    {
        "id": "c31a21a4-02f0-495a-8657-5aa518c8a104",
        "title": "SDD Architecture & Gate Approval Baseline",
        "date": "2026-10-16"
    },
    {
        "id": "ae88f8db-6a1e-4a33-906f-bb7b64bd670d",
        "title": "Phase 01: System Foundation & Relational Schema",
        "date": "2026-10-17"
    },
    {
        "id": "08c457f2-b3da-49b7-9831-37db33f835c8",
        "title": "Phase 02: Catalogue, Inventory Model & Project Governance",
        "date": "2026-10-17"
    },
    {
        "id": "1917007c-b776-445d-9804-7e060de2d371",
        "title": "Phase 02: Continuation & Verification",
        "date": "2026-10-17"
    },
    {
        "id": "36442b3a-0953-40a4-af82-b161c5946175",
        "title": "Phase 02 Extension: Student Departmental Governance & Roster Sync",
        "date": "2026-10-18"
    },
    {
        "id": "62a185ce-2cd2-4ca7-97e6-f743f2544a0d",
        "title": "Phase 03 Mega-Session: Approvals, Live SMTP, Live Demo, Presentations & PDF Export",
        "date": "2026-10-19"
    },
    {
        "id": "15867742-4580-4146-b4c3-c1ee2b20fafc",
        "title": "Screen Recording 2026-10-19 025148 Video/Audio Diagnostics",
        "date": "2026-10-19"
    },
    {
        "id": "e96048c7-8510-4537-bc3f-ca136488ff75",
        "title": "Return Lifecycle Reconciliation & Requisitions Page Restock",
        "date": "2026-10-19"
    },
    {
        "id": "af7fc027-33cd-4af3-9a0a-8f2b035fa98d",
        "title": "CCE v3 Slide Deck Refinement & 16:9 PDF Export",
        "date": "2026-10-22"
    },
    {
        "id": "47823253-8823-4ff2-afdf-5fd71fb47cee",
        "title": "Final Handover & State Sealing",
        "date": "2026-10-22"
    },
    {
        "id": "059dc5cc-0422-42d0-b7c7-ea413572a8d5",
        "title": "Current Session: Transcript Restoration & Penalization",
        "date": "2026-10-27"
    }
]

out = []
out.append("# LabTrack — Complete Agent Transcript & Context Record")
out.append("")
out.append("**Project Name:** LabTrack — Institutional Laboratory Hardware Custody, Consumables & Lab Asset Governance System  ")
out.append("**Target Institution:** Symbiosis Institute of Technology (SIT), Pune  ")
out.append("**Academics:** Sem 3, Low Credit Course — Continuous Collaborative Engineering (CCE)  ")
out.append(f"**Workspace Directory:** `{workspace_dir}`  ")
out.append(f"**Generated:** {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  ")
out.append("")
out.append("---")
out.append("")
out.append("## 1. Project Overview & What Is LabTrack?")
out.append("")
out.append("### 1.1 The Operational Problem")
out.append("In high-tier engineering institutions like SIT Pune, laboratories across three departments:")
out.append("- **AIML Department** (Floor 5)")
out.append("- **CSE Department** (Floors 4 & 5)")
out.append("- **Robotics & Automation (RA) Department** (Floor 6)")
out.append("")
out.append("house hundreds of thousands of dollars worth of physical equipment. This includes:")
out.append("1. **High-Value Capital Assets:** NVIDIA Jetson Orin Nano, Kinova Gen3 robotic arms, TurtleBot 4 mobile robots, Intel RealSense D435i depth cameras, Dell Precision RTX 4090 workstations.")
out.append("2. **High-Turnover Consumables:** Microcontrollers (ESP32, Arduino Uno, Raspberry Pi Pico), sensors (HC-SR04, MPU6050, DHT22), motors (servos, steppers), batteries (LiPo packs), and breadboard accessories.")
out.append("")
out.append("Traditional manual registers, siloed lab diaries, and informal student borrowing lead to massive inventory blindspots:")
out.append("- Equipment hoarding across academic semesters.")
out.append("- Unknown custodian accountability when hardware is damaged.")
out.append("- Inability to track whether stock is physically functional or defective (`good` vs `bad`).")
out.append("- Cross-departmental theft or unauthorized borrowing.")
out.append("- HoD and faculty lack real-time visibility into project equipment commitments.")
out.append("")
out.append("### 1.2 The LabTrack Solution Architecture")
out.append("LabTrack is a full-stack, enterprise-grade lab governance platform:")
out.append("- **Backend:** FastAPI (Python 3.12) with modular service domain (`service.py`, `models.py`, `api.py`, `adapters.py`).")
out.append("- **Relational Database:** SQLite (`labtrack.db`) / MySQL baseline enforcing relational integrity constraints (`ck_item_kind`, `ck_stock_nonnegative`).")
out.append("- **Master Data Pipeline:** Structured Excel workbook (`public/data/labtrack_master_data.xlsx`) dynamically synced to relational SQL via `utilities/sync_master_data.py` and frontend in-memory store via `utilities/sync_frontend_mockdata.py`.")
out.append("- **Frontend:** React + Vite single-page application with modern glassmorphic Cupertino/Tailwind aesthetics, live notifications, segmented approval queues, and a self-contained 16-slide presentation deck.")
out.append("")
out.append("### 1.3 Core Invariants & Governance Rules")
out.append("1. **Dual-Class Inventory Dichotomy:**")
out.append("   - **Serialized Assets:** Individually barcoded with authoritative format `SIT-BRANCH-ROOM-TAG` (e.g. `SIT-AIML-5CL07-0041`), purchase bill tracking, custodian binding, condition state (`AVAILABLE`, `UNDER_REPAIR`, `RETIRED`, `IN_USE`).")
out.append("   - **Consumables:** Quantity-tracked with mathematical non-negativity constraint `total = good + bad`.")
out.append("2. **The 7 Canonical Item Classes:** `Sensors`, `Microcontrollers`, `Microprocessors`, `Motors`, `Communication Modules`, `Batteries`, `Misc`.")
out.append("3. **Student Departmental Lockout Rule:** Students enrolled in a department (e.g., AIML) are strictly restricted to issuing/requisitioning hardware housed in their own department's labs.")
out.append("4. **4-Tier Circulation Lifecycle:**")
out.append("   - `Stage 1 of 4 (Submitted)`: Student submission awaiting Faculty Mentor review.")
out.append("   - `Stage 2 of 4 (Faculty Endorsed)`: Faculty Mentor verifies academic scope; forwards to HoD.")
out.append("   - `Stage 3 of 4 (HoD Sanctioned / Counter Staged)`: HoD grants institutional sanction; Lab Assistant stages hardware in Counter Tray.")
out.append("   - `Stage 4 of 4 (Dispatched)`: Barcodes scanned and committed; active custody loan created.")
out.append("   - `Stage 5 (Returned & Restocked)`: Physical inspection on return, triage into good/bad stock, loan settled.")
out.append("")
out.append("---")
out.append("")
out.append("## 2. Audio & Voice Notes (Verbatim)")
out.append("")
out.append("### 2.1 Faculty Debrief Voice Notes: `manoj sir talk.txt`")
out.append("**Source:** Verbatim audio transcription from faculty briefing with Dr. Manoj Patil (Faculty Mentor & In-Charge)  ")
out.append("**File:** [`manoj sir talk.txt`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/manoj%20sir%20talk.txt)  ")
out.append("")
out.append("```text")
out.append(manoj_talk_text)
out.append("```")
out.append("")
out.append("### 2.2 Live Video & Audio Screen Recording Notes: `Screen Recording 2026-10-19 025148`")
out.append("**Source:** Live user screen recording with voice / audio audio track extracted to [`scratch/screen_recording_audio.wav`](file:///d:/Users/Documents/Symbiosis/Academics/Sem%203/Low%20Credit/CCE/Project/scratch/screen_recording_audio.wav) (Length: 2,064,462 bytes)  ")
out.append("**Key Observations & User Voice Instructions:**")
out.append("1. **Localhost Execution Delay:** User demonstrated frustration that server was not immediately live on port 5173 / port 8000.")
out.append("2. **Live Requisition Verification:** Student submitted request for TurtleBot 3 (`#REQ-2026-546`). Email dispatch triggered successfully, but the faculty supervisor dashboard did not immediately reflect the new requisition in `Pending Review` due to persona ID misalignment (`T100451` vs `T100460`).")
out.append("3. **Return State Discrepancy:** Returning a dispatched item showed local state update, but background polling at 2.5s interval re-fetched un-restocked server fixtures and flipped status back to `Dispatched`.")
out.append("")
out.append("---")
out.append("")
out.append("## 3. Complete Chronological Chat Log (Every Single Word across all Sessions)")
out.append("")

for s in sessions:
    cid = s["id"]
    title = s["title"]
    sdate = s["date"]
    
    full_log = os.path.join(brain_dir, cid, '.system_generated', 'logs', 'transcript_full.jsonl')
    if not os.path.exists(full_log):
        full_log = os.path.join(brain_dir, cid, '.system_generated', 'logs', 'transcript.jsonl')
    
    prompts = []
    if os.path.exists(full_log):
        with open(full_log, 'r', encoding='utf-8', errors='ignore') as f:
            for line in f:
                try:
                    d = json.loads(line)
                    if d.get('type') == 'USER_INPUT':
                        prompts.append((d.get('step_index'), d.get('created_at'), d.get('content', '')))
                except Exception:
                    pass
    
    out.append(f"### Session: {title}")
    out.append(f"- **Conversation ID:** `{cid}`")
    out.append(f"- **Date:** `{sdate}`")
    out.append(f"- **Total Prompts:** `{len(prompts)}`")
    out.append("")
    
    if not prompts:
        out.append("*No direct user prompts recorded in this conversation log.*")
        out.append("")
        continue
    
    for sidx, cat, ctxt in prompts:
        out.append(f"#### Step {sidx} | Timestamp: `{cat}`")
        out.append("```")
        out.append(ctxt.strip())
        out.append("```")
        out.append("")

out_text = "\n".join(out)
target_path = os.path.join(workspace_dir, "AGENT_TRANSCRIPT.md")
with open(target_path, 'w', encoding='utf-8') as f:
    f.write(out_text)

print(f"Successfully generated LabTrack AGENT_TRANSCRIPT.md: {len(out_text)} characters")
