import os
import json
import sys
import datetime

sys.stdout.reconfigure(encoding='utf-8')

brain_dir = r'C:\Users\irxchand\.gemini\antigravity-ide\brain'
target_workspace = r"d:\Users\Documents\Symbiosis\Academics\Sem 3\Low Credit\CCE\Project".lower()

all_matches = []

for entry in os.listdir(brain_dir):
    full_path = os.path.join(brain_dir, entry)
    if os.path.isdir(full_path):
        log_file = os.path.join(full_path, '.system_generated', 'logs', 'transcript.jsonl')
        if os.path.exists(log_file):
            try:
                with open(log_file, 'r', encoding='utf-8', errors='ignore') as f:
                    content_chunk = f.read(20000).lower()
                    if target_workspace in content_chunk or 'labtrack' in content_chunk or 'irxchand/labtrack' in content_chunk:
                        mtime = os.path.getmtime(log_file)
                        all_matches.append((entry, mtime, log_file))
            except Exception:
                pass

all_matches.sort(key=lambda x: x[1])
print(f"Total matching conversations (broad): {len(all_matches)}")
for cid, mtime, lf in all_matches:
    dt = datetime.datetime.fromtimestamp(mtime).strftime('%Y-%m-%d %H:%M:%S')
    print(f"ID: {cid} | Modified: {dt}")
