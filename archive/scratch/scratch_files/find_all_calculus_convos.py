import os
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

brain_dir = r'C:\Users\irxchand\.gemini\antigravity-ide\brain'

convo_matches = []
for entry in os.listdir(brain_dir):
    full_path = os.path.join(brain_dir, entry)
    if os.path.isdir(full_path):
        log_file = os.path.join(full_path, '.system_generated', 'logs', 'transcript.jsonl')
        if os.path.exists(log_file):
            try:
                with open(log_file, 'r', encoding='utf-8', errors='ignore') as f:
                    first_line = f.readline()
                    if first_line:
                        d = json.loads(first_line)
                        content = d.get('content', '')
                        if 'calculus' in content.lower() or 'ca buddy' in content.lower():
                            convo_matches.append((entry, content[:200]))
            except Exception:
                pass

print(f"Total matching conversations: {len(convo_matches)}")
for cid, snip in convo_matches:
    print(f"ID: {cid}")
    print(f"Snippet: {snip}...\n")
