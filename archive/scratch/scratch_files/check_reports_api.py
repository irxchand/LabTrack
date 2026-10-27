import re

with open(r'src\backend\labtrack\api.py', 'r', encoding='utf-8') as f:
    text = f.read()

for m in re.finditer(r'@app\.(get|post)\([\'"]/api/reports/[^\'"]+', text):
    start = m.start()
    print(text[start:start+1200])
    print('='*50)
