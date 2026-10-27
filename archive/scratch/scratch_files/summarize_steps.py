import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

path = r'C:\Users\irxchand\.gemini\antigravity-ide\brain\ce816485-2b76-46e1-8409-bfc18536db37\.system_generated\logs\transcript_full.jsonl'

with open(path, 'r', encoding='utf-8') as f:
    steps = [json.loads(l) for l in f]

print(f"Total steps: {len(steps)}")
for s in steps:
    idx = s.get('step_index')
    stype = s.get('type')
    src = s.get('source')
    tc = s.get('tool_calls', [])
    tc_str = ", ".join([c.get('name') for c in tc]) if tc else ""
    c_len = len(s.get('content', '')) if s.get('content') else 0
    th_len = len(s.get('thinking', '')) if s.get('thinking') else 0
    print(f"[{idx:3d}] type={stype:<20s} src={src:<15s} th_len={th_len:<5d} c_len={c_len:<6d} tools={tc_str}")
