import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

path = r'C:\Users\irxchand\.gemini\antigravity-ide\brain\ce816485-2b76-46e1-8409-bfc18536db37\.system_generated\logs\transcript_full.jsonl'

with open(path, 'r', encoding='utf-8') as f:
    lines = [json.loads(l) for l in f]

print(f"Total steps: {len(lines)}")
for idx, item in enumerate(lines):
    t = item.get('type')
    src = item.get('source')
    if t == 'USER_INPUT':
        print(f"\n==========================================")
        print(f"=== STEP {item.get('step_index')}: USER_INPUT ===")
        print(f"==========================================")
        print(item.get('content'))
    elif t == 'PLANNER_RESPONSE' and item.get('content'):
        print(f"\n==========================================")
        print(f"=== STEP {item.get('step_index')}: FINAL ASSISTANT RESPONSE ===")
        print(f"==========================================")
        print(f"Length of response: {len(item.get('content'))}")
        print(item.get('content')[:1200])
        print("...\n[TRUNCATED FOR PREVIEW]\n...")
        print(item.get('content')[-800:])
