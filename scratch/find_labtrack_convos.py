import os
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

brain_dir = r'C:\Users\irxchand\.gemini\antigravity-ide\brain'
target_workspace = r"d:\Users\Documents\Symbiosis\Academics\Sem 3\Low Credit\CCE\Project".lower()

labtrack_convos = []

for entry in os.listdir(brain_dir):
    full_path = os.path.join(brain_dir, entry)
    if os.path.isdir(full_path):
        log_file = os.path.join(full_path, '.system_generated', 'logs', 'transcript.jsonl')
        if os.path.exists(log_file):
            try:
                with open(log_file, 'r', encoding='utf-8', errors='ignore') as f:
                    for _ in range(5):
                        line = f.readline()
                        if not line:
                            break
                        if target_workspace in line.lower() or 'labtrack' in line.lower() or 'irxchand/labtrack' in line.lower():
                            mtime = os.path.getmtime(log_file)
                            labtrack_convos.append((entry, mtime, log_file))
                            break
            except Exception:
                pass

labtrack_convos.sort(key=lambda x: x[1])
print(f"Total LabTrack conversations found: {len(labtrack_convos)}")
for cid, mtime, lf in labtrack_convos:
    import datetime
    dt = datetime.datetime.fromtimestamp(mtime).strftime('%Y-%m-%d %H:%M:%S')
    print(f"ID: {cid} | Modified: {dt}")
