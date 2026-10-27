import os
import json
import sys
import datetime

sys.stdout.reconfigure(encoding='utf-8')

brain_dir = r'C:\Users\irxchand\.gemini\antigravity-ide\brain'

convo_ids = [
    "684009ea-b1de-46eb-bcfd-a7fce5dfdfcb",
    "c31a21a4-02f0-495a-8657-5aa518c8a104",
    "ae88f8db-6a1e-4a33-906f-bb7b64bd670d",
    "08c457f2-b3da-49b7-9831-37db33f835c8",
    "1917007c-b776-445d-9804-7e060de2d371",
    "36442b3a-0953-40a4-af82-b161c5946175",
    "62a185ce-2cd2-4ca7-97e6-f743f2544a0d",
    "15867742-4580-4146-b4c3-c1ee2b20fafc",
    "e96048c7-8510-4537-bc3f-ca136488ff75",
    "af7fc027-33cd-4af3-9a0a-8f2b035fa98d",
    "47823253-8823-4ff2-afdf-5fd71fb47cee"
]

all_convo_data = []

for cid in convo_ids:
    full_log = os.path.join(brain_dir, cid, '.system_generated', 'logs', 'transcript_full.jsonl')
    if not os.path.exists(full_log):
        full_log = os.path.join(brain_dir, cid, '.system_generated', 'logs', 'transcript.jsonl')
    
    if os.path.exists(full_log):
        user_prompts = []
        assistant_summaries = []
        with open(full_log, 'r', encoding='utf-8', errors='ignore') as f:
            for line in f:
                try:
                    d = json.loads(line)
                    if d.get('type') == 'USER_INPUT':
                        user_prompts.append({
                            'step': d.get('step_index'),
                            'created_at': d.get('created_at'),
                            'content': d.get('content', '')
                        })
                    elif d.get('type') == 'PLANNER_RESPONSE' and d.get('content'):
                        assistant_summaries.append({
                            'step': d.get('step_index'),
                            'created_at': d.get('created_at'),
                            'content': d.get('content', '')
                        })
                except Exception:
                    pass
        all_convo_data.append({
            'cid': cid,
            'user_prompts': user_prompts,
            'assistant_summaries': assistant_summaries
        })

print(f"Loaded {len(all_convo_data)} conversations.")
for c in all_convo_data:
    print(f"=== Convo {c['cid']}: {len(c['user_prompts'])} user prompts, {len(c['assistant_summaries'])} assistant responses ===")
    for p in c['user_prompts']:
        print(f"  [Step {p['step']}] Date: {p['created_at']}")
        print(f"  Content: {p['content'][:150].strip()}...\n")
