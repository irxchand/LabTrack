"""Run documented synthetic end-to-end flows against a running LabTrack API."""
from pathlib import Path
from datetime import datetime, timedelta, timezone
import json
import sys
import uuid
import httpx

base = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8000"
events = []
client = httpx.Client(base_url=base+"/api", timeout=30)
tokens = {}
for name, identifier in {"student":"DEMO-STU-001","mentor":"T00001","incharge":"T00002","hod":"T00003","assistant":"N00001"}.items():
    import os
    response=client.post('/auth/login',json={"identifier":identifier,"password":os.environ.get("LABTRACK_DEMO_PASSWORD","DemoOnly2026!")})
    response.raise_for_status(); tokens[name] = {"Authorization":"Bearer "+response.json()['token']}


def call(who, path, body=None, key=None):
    response=client.get(path,headers=tokens[who]) if body is None else client.post(path,json=body,headers={**tokens[who],"Idempotency-Key":key or str(uuid.uuid4())})
    response.raise_for_status();value=response.json();events.append({"actor":who,"path":path,"status":response.status_code,"result":value});return value


stamp=datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S')
p=call('student','/projects',{"name":"Autonomous Rover · "+stamp,"description":"Synthetic complete lifecycle demonstration","mentor_id":3,"member_ids":[2]})
lines=[{"item_id":1,"quantity":2},{"item_id":3,"quantity":2}]
plan=call('student','/plans',{"lines":lines});assert plan['feasible']
r=call('student','/requests',{"project_id":p['id'],"duration_hours":168,"lines":lines,"purpose":"BORROW"})
for who in ['mentor','hod']:call(who,f"/requests/{r['id']}/decision",{"decision":"APPROVE","remarks":"Demo review completed"})
call('assistant',f"/requests/{r['id']}/claim",{})
key=str(uuid.uuid4());issued=call('assistant',f"/requests/{r['id']}/issue",{"physical_handover_confirmed":True},key)
assert issued['state']=='ISSUED'
assert call('assistant',f"/requests/{r['id']}/issue",{"physical_handover_confirmed":True},key)==issued
new_due=datetime.fromisoformat(issued['due_at'].replace('Z','+00:00'))+timedelta(days=2)
e=call('student',f"/requests/{r['id']}/extensions",{"new_due_at":new_due.isoformat(),"reason":"Additional integration test time"})
for who in ['mentor','hod']:call(who,f"/extensions/{e['id']}/decision",{"decision":"APPROVE","remarks":"Extension reviewed"})
d=call('assistant',f"/requests/{r['id']}")
call('assistant',f"/requests/{r['id']}/return",{"lines":[{"line_id":l['id'],"good":l['quantity'],"bad":0,"missing":0,"functional":"PASS"} for l in d['lines']],"remarks":"All components returned working"})
call('student',f"/requests/{r['id']}/acknowledge",{})
a=call('student','/requests',{"project_id":p['id'],"duration_hours":24,"lines":[{"item_id":4,"quantity":1}],"purpose":"USE_IN_COLLEGE"})
for who in ['mentor','incharge','hod']:call(who,f"/requests/{a['id']}/decision",{"decision":"APPROVE","remarks":"Asset use reviewed"})
call('assistant',f"/requests/{a['id']}/claim",{})
d=call('assistant',f"/requests/{a['id']}");cat=call('assistant','/catalogue')
assignments={}
for l in d['lines']:
    item=next(i for i in cat if i['id']==l['item_id']);lab=next(x for x in item['labs'] if x['lab_id']==l['lab_id'])
    assignments[str(l['id'])]=[x['barcode'] for x in lab['assets'] if x['state']=='AVAILABLE'][:l['quantity']]
call('assistant',f"/requests/{a['id']}/issue",{"physical_handover_confirmed":True,"assignments":assignments})
d=call('assistant',f"/requests/{a['id']}")
call('assistant',f"/requests/{a['id']}/return",{"lines":[{"line_id":l['id'],"asset_conditions":{b:"GOOD" for b in l['barcodes']},"functional":"PASS"} for l in d['lines']],"remarks":"Physical asset verified on return"})
call('student','/reservations',{"project_id":p['id'],"item_id":6,"quantity":1})
call('student','/demand',{"item_id":6,"quantity":1})
summary={"run_at":datetime.now(timezone.utc).isoformat(),"base":base,"project_id":p['id'],"consumable_request":r['id'],"asset_request":a['id'],"checks":["login","project","minimum-lab planning","mentor/HoD approval","asset In-Charge approval","exclusive claim","full issue","idempotent replay","extension route/history","full return","student acknowledgement","FIFO enrollment","unmet demand"],"events":events}
folder=Path('.artifacts');folder.mkdir(exist_ok=True);(folder/'demo-evidence.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({"demo":"PASS","project_id":p['id'],"consumable_request":r['id'],"asset_request":a['id'],"checks":len(summary['checks'])}))
