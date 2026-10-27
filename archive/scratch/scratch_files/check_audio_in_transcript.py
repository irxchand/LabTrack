import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

path = r'C:\Users\irxchand\.gemini\antigravity-ide\brain\ce816485-2b76-46e1-8409-bfc18536db37\.system_generated\logs\transcript_full.jsonl'

with open(path, 'r', encoding='utf-8') as f:
    lines = [json.loads(l) for l in f]

print("=== CHECKING FOR ANY AUDIO / VOICE / ATTACHMENTS ===")
for i, step in enumerate(lines):
    s = json.dumps(step)
    for kw in ['audio', 'voice', 'sound', 'speech', 'recording', 'media', 'input']:
        if kw in s.lower() and step.get('type') != 'CODE_ACTION':
            print(f"Step {step.get('step_index')} matched {kw}: type={step.get('type')}, source={step.get('source')}")

print("\n=== DETAILED STEP 0 ===")
print(json.dumps(lines[0], indent=2))
