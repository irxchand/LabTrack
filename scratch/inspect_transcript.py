import json
import os

path = r'C:\Users\irxchand\.gemini\antigravity-ide\brain\ce816485-2b76-46e1-8409-bfc18536db37\.system_generated\logs\transcript_full.jsonl'

print(f"File exists: {os.path.exists(path)}")
with open(path, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        data = json.loads(line)
        stype = data.get('type')
        source = data.get('source')
        content = data.get('content', '')
        tool_calls = data.get('tool_calls', [])
        tc_names = [tc.get('name') for tc in tool_calls] if tool_calls else []
        print(f"Line {idx:3d}: step={data.get('step_index')}, src={source:15s}, type={stype:20s}, cont_len={len(content):6d}, tools={tc_names}")
