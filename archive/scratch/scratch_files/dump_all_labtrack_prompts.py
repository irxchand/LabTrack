import os
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

brain_dir = r'C:\Users\irxchand\.gemini\antigravity-ide\brain'

convo_ids = [
    ("684009ea-b1de-46eb-bcfd-a7fce5dfdfcb", "Early Prototype & Discovery"),
    ("c31a21a4-02f0-495a-8657-5aa518c8a104", "SDD Architecture & Gate Approval"),
    ("ae88f8db-6a1e-4a33-906f-bb7b64bd670d", "Phase 01 Foundation & Relational Schema"),
    ("08c457f2-b3da-49b7-9831-37db33f835c8", "Phase 02 Catalogue & Project Governance"),
    ("1917007c-b776-445d-9804-7e060de2d371", "Phase 02 Continuation"),
    ("36442b3a-0953-40a4-af82-b161c5946175", "Student Department Governance & Roster Sync"),
    ("62a185ce-2cd2-4ca7-97e6-f743f2544a0d", "Phase 03 Approvals, Live SMTP, Live Demo, Presentations & PDF Export"),
    ("15867742-4580-4146-b4c3-c1ee2b20fafc", "Screen Recording 025148 Deep Dive"),
    ("e96048c7-8510-4537-bc3f-ca136488ff75", "Return Lifecycle Reconciliation"),
    ("af7fc027-33cd-4af3-9a0a-8f2b035fa98d", "CCE v3 Slide Deck Refinement"),
    ("47823253-8823-4ff2-afdf-5fd71fb47cee", "Final Sealing & Handover")
]

for cid, desc in convo_ids:
    full_log = os.path.join(brain_dir, cid, '.system_generated', 'logs', 'transcript_full.jsonl')
    if not os.path.exists(full_log):
        full_log = os.path.join(brain_dir, cid, '.system_generated', 'logs', 'transcript.jsonl')
    
    if os.path.exists(full_log):
        prompts = []
        with open(full_log, 'r', encoding='utf-8', errors='ignore') as f:
            for line in f:
                try:
                    d = json.loads(line)
                    if d.get('type') == 'USER_INPUT':
                        prompts.append((d.get('step_index'), d.get('created_at'), d.get('content', '')))
                except Exception:
                    pass
        print(f"\n=======================================================")
        print(f"[{cid}] {desc} — Total Prompts: {len(prompts)}")
        print(f"=======================================================")
        for sidx, cat, ctxt in prompts:
            print(f"--- Step {sidx} ({cat}) ---")
            print(ctxt.strip()[:400])
            print("...")
