from concurrent.futures import ThreadPoolExecutor
from datetime import timedelta
import io
import uuid
import pytest
from PIL import Image
from sqlalchemy import select, func
from labtrack import db
from labtrack.models import Stock, Request, User, Audit, Outbox, Incident, Asset, utcnow
from labtrack.worker import dispatch
from labtrack.config import settings


def post(client, path, headers, data=None, key=None):
    return client.post('/api'+path, json=data or {}, headers={**headers, 'Idempotency-Key': key or str(uuid.uuid4())})


def project(client, h, name='Autonomous Rover'):
    r = post(client, '/projects', h['student'], {'name': name, 'description': 'Synthetic rover project', 'mentor_id': 3, 'member_ids': []})
    assert r.status_code == 200, r.text
    return r.json()['id']


def request(client, h, lines=None, purpose='BORROW'):
    p = project(client, h)
    r = post(client, '/requests', h['student'], {'project_id': p, 'duration_hours': 168, 'purpose': purpose, 'lines': lines or [{'item_id': 1, 'quantity': 2}, {'item_id': 3, 'quantity': 2}]})
    assert r.status_code == 200, r.text
    return r.json()['id']


def approve(client, h, rid, asset=False):
    for who in ['mentor']+(['incharge'] if asset else [])+['hod']:
        r = post(client, f'/requests/{rid}/decision', h[who], {'decision': 'APPROVE', 'remarks': 'Verified'})
        assert r.status_code == 200, r.text


def issued(client, h, lines=None, purpose='BORROW'):
    rid = request(client, h, lines, purpose)
    approve(client, h, rid, purpose != 'BORROW')
    assert post(client, f'/requests/{rid}/claim', h['assistant']).status_code == 200
    body = {'assignments': {}, 'physical_handover_confirmed': True}
    if purpose != 'BORROW':
        detail = client.get(f'/api/requests/{rid}', headers=h['assistant']).json()
        cat = client.get('/api/catalogue', headers=h['assistant']).json()
        for l in detail['lines']:
            item = next(x for x in cat if x['id'] == l['item_id'])
            lab = next(x for x in item['labs'] if x['lab_id'] == l['lab_id'])
            body['assignments'][str(l['id'])] = [a['barcode'] for a in lab['assets'] if a['state'] == 'AVAILABLE'][:l['quantity']]
    result = post(client, f'/requests/{rid}/issue', h['assistant'], body)
    assert result.status_code == 200, result.text
    return rid


def test_complete_consumable_lifecycle_and_audit(client, headers):
    h = headers; rid = issued(client, h)
    d = client.get(f'/api/requests/{rid}', headers=h['student']).json()
    assert d['state'] == 'ISSUED' and d['due_version'] == 1
    assert [a['action'] for a in d['timeline']][:4] == ['REQUEST_SUBMITTED', 'CENTRAL_STORE_VALIDATED', 'MENTOR_APPROVED', 'HOD_APPROVED']
    payload = {'lines': [{'line_id': l['id'], 'good': l['quantity'], 'bad': 0, 'missing': 0, 'functional': 'PASS'} for l in d['lines']], 'remarks': 'Returned working'}
    before = client.get('/api/catalogue', headers=h['student']).json()
    result = post(client, f'/requests/{rid}/return', h['assistant'], payload, 'return-1')
    assert result.json()['state'] == 'CLOSED'
    assert post(client, f'/requests/{rid}/return', h['assistant'], payload, 'return-1').json() == result.json()
    assert post(client, f'/requests/{rid}/return', h['assistant'], payload).status_code == 409
    assert post(client, f'/requests/{rid}/acknowledge', h['student']).status_code == 200
    after = client.get('/api/catalogue', headers=h['student']).json()
    assert sum(i['available'] for i in after) > sum(i['available'] for i in before)
    assert post(client, f'/requests/{rid}/cancel', h['student']).status_code == 409


def test_in_college_asset_route_barcode_return(client, headers):
    h = headers; rid = issued(client, h, [{'item_id': 4, 'quantity': 1}], 'USE_IN_COLLEGE')
    d = client.get(f'/api/requests/{rid}', headers=h['assistant']).json()
    assert d['state'] == 'IN_USE'
    assert 'INCHARGE_DECISION' in [a['action'] for a in d['timeline']]
    body = {'lines': [{'line_id': l['id'], 'asset_conditions': {b: 'GOOD' for b in l['barcodes']}, 'functional': 'PASS'} for l in d['lines']]}
    assert post(client, f'/requests/{rid}/return', h['assistant'], body).json()['state'] == 'CLOSED'
    with db.Session() as s:
        assert all(a.state == 'AVAILABLE' for a in s.scalars(select(Asset)))


def test_whole_request_shortage_never_partially_mutates(client, headers):
    h = headers
    rid = request(client, h, [{'item_id': 1, 'quantity': 10}, {'item_id': 3, 'quantity': 5}])
    approve(client, h, rid)
    post(client, f'/requests/{rid}/claim', h['assistant'])
    with db.Session() as s:
        s.scalar(select(Stock).where(Stock.item_id == 3, Stock.lab_id == 2)).good = 0
        s.commit()
        before = [(x.id, x.good, x.bad) for x in s.scalars(select(Stock).order_by(Stock.id))]
    r = post(client, f'/requests/{rid}/issue', h['assistant'], {'physical_handover_confirmed': True})
    assert r.json()['state'] == 'FULFILMENT_FAILED_STOCK'
    with db.Session() as s:
        assert before == [(x.id, x.good, x.bad) for x in s.scalars(select(Stock).order_by(Stock.id))]
        assert s.get(Request, rid).issued_at is None


def test_exclusive_claim_race(client, headers):
    rid = request(client, headers); approve(client, headers, rid)
    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(lambda who: post(client, f'/requests/{rid}/claim', headers[who]).status_code, ['assistant', 'assistant2']))
    assert sorted(results) == [200, 409]


def test_concurrent_stock_competition_and_idempotent_issue(client, headers):
    h = headers; r1 = request(client, h, [{'item_id': 1, 'quantity': 8}]); r2 = request(client, h, [{'item_id': 1, 'quantity': 8}])
    for rid in [r1, r2]:
        approve(client, h, rid); post(client, f'/requests/{rid}/claim', h['assistant'])
    body = {'physical_handover_confirmed': True}
    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(lambda rid: post(client, f'/requests/{rid}/issue', h['assistant'], body, f'issue-{rid}').json(), [r1,r2]))
    assert sorted(x['state'] for x in results) == ['FULFILMENT_FAILED_STOCK','ISSUED']
    winner = next(x for x in results if x['state'] == 'ISSUED')['id']
    assert post(client, f'/requests/{winner}/issue', h['assistant'], body, f'issue-{winner}').json()['state'] == 'ISSUED'
    with db.Session() as s:
        assert sum(s.scalars(select(Stock.good).where(Stock.item_id == 1))) == 5


@pytest.mark.parametrize('who',['student','outsider','assistant','admin','hod'])
def test_no_actor_can_skip_assigned_mentor_stage(client, headers, who):
    rid = request(client, headers)
    assert post(client, f'/requests/{rid}/decision', headers[who], {'decision':'APPROVE'}).status_code == 403


def test_project_isolation_and_idempotency_payload_binding(client, headers):
    h = headers; p = project(client,h)
    assert client.get('/api/projects',headers=h['outsider']).json()==[]
    payload={'project_id':p,'duration_hours':24,'lines':[{'item_id':1,'quantity':1}]}
    r=post(client,'/requests',h['student'],payload,'same-key')
    assert post(client,'/requests',h['student'],payload,'same-key').json()==r.json()
    assert post(client,'/requests',h['student'],{**payload,'duration_hours':48},'same-key').status_code==409
    assert client.get('/api/requests/'+str(r.json()['id']),headers=h['outsider']).status_code==403


def test_plan_optimizes_labs_and_does_not_mutate(client, headers):
    h = headers
    before = client.get('/api/catalogue',headers=h['student']).json()
    p=post(client,'/plans',h['student'],{'lines':[{'item_id':1,'quantity':4},{'item_id':3,'quantity':4}]}).json()
    assert p['labs']==[2] and p['planning_only'] is True
    assert client.get('/api/catalogue',headers=h['student']).json()==before
    shortage=post(client,'/plans',h['student'],{'lines':[{'item_id':1,'quantity':99}]}).json()
    assert shortage['feasible'] is False and shortage['allocations']==[]


def test_reservation_fifo_membership_and_cancellation(client, headers):
    h=headers;p=project(client,h)
    a=post(client,'/reservations',h['student'],{'project_id':p,'item_id':6,'quantity':1}).json()
    assert a['state']=='WAITING_FIFO'
    assert post(client,'/reservations',h['student'],{'project_id':p,'item_id':6,'quantity':1}).status_code==409
    assert post(client,f"/reservations/{a['id']}/cancel",h['outsider']).status_code==403
    assert post(client,f"/reservations/{a['id']}/cancel",h['student']).json()['state']=='CANCELLED'


def test_extension_preserves_due_date_until_full_route(client, headers):
    h=headers;rid=issued(client,h)
    before=client.get(f'/api/requests/{rid}',headers=h['student']).json()
    with db.Session() as s: due=s.get(Request,rid).due_at+timedelta(days=2)
    e=post(client,f'/requests/{rid}/extensions',h['student'],{'new_due_at':due.isoformat()+'Z','reason':'Project testing'}).json()['id']
    assert client.get(f'/api/requests/{rid}',headers=h['student']).json()['due_at']==before['due_at']
    for who in ['mentor','hod']:
        assert post(client,f'/extensions/{e}/decision',h[who],{'decision':'APPROVE'}).status_code==200
    after=client.get(f'/api/requests/{rid}',headers=h['student']).json()
    assert after['due_version']==2 and after['extensions'][0]['old_due_at']==before['due_at']


def test_asset_damage_requires_evidence_and_no_auto_blame(client, headers):
    h=headers;rid=issued(client,h,[{'item_id':4,'quantity':1}],'USE_IN_COLLEGE')
    d=client.get(f'/api/requests/{rid}',headers=h['assistant']).json();line=d['lines'][0]
    body={'lines':[{'line_id':line['id'],'asset_conditions':{line['barcodes'][0]:'DAMAGED'},'functional':'FAIL'}]}
    assert post(client,f'/requests/{rid}/return',h['assistant'],body).status_code==422
    image=Image.new('RGB',(10,10),'white');buffer=io.BytesIO();image.save(buffer,format='PNG')
    e=client.post(f'/api/requests/{rid}/evidence',headers=h['assistant'],files={'file':('damage.png',buffer.getvalue(),'image/png')})
    assert e.status_code==200,e.text
    body['lines'][0]['evidence_ids']=[e.json()['id']]
    assert post(client,f'/requests/{rid}/return',h['assistant'],body).json()['incidents_recorded']==1
    assert client.get('/api/incidents',headers=h['student']).status_code==403
    assert client.get('/api/incidents',headers=h['hod']).json()[0]['attribution']=='NOT_DETERMINED'
    assert client.get('/api/evidence/'+e.json()['id'],headers=h['outsider']).status_code==403


def test_outbox_replay_and_channel_failure_does_not_reverse_domain(client, headers, monkeypatch):
    import labtrack.worker as worker
    rid=issued(client,headers)
    class BrokenMail:
        def send(self,*args):raise ValueError('offline')
    monkeypatch.setattr(worker,'email_provider',lambda:BrokenMail())
    with db.Session() as s:dispatch(s);s.commit()
    assert client.get('/api/notifications',headers=headers['student']).json()
    with db.Session() as s:
        assert s.get(Request,rid).state=='ISSUED'
        assert s.scalar(select(func.count()).select_from(Outbox).where(Outbox.dispatched.is_(False)))>0
    from labtrack.adapters import LocalEmailProvider
    monkeypatch.setattr(worker,'email_provider',lambda:LocalEmailProvider())
    with db.Session() as s:dispatch(s);s.commit()
    before=client.get('/api/notifications',headers=headers['student']).json()
    with db.Session() as s:dispatch(s);s.commit()
    assert client.get('/api/notifications',headers=headers['student']).json()==before


def test_unresolved_policy_fails_without_mutation(client, headers):
    h=headers;rid=request(client,h)
    r=post(client,f'/requests/{rid}/retained',h['student'])
    assert r.status_code==409 and r.json()['error']['decision']=='OD-16'
    with db.Session() as s:assert s.get(Request,rid).state=='MENTOR_REVIEW'
    p=project(client,h)
    r=post(client,'/requests',h['student'],{'project_id':p,'duration_hours':24,'lines':[{'item_id':1,'quantity':1},{'item_id':4,'quantity':1}]})
    assert r.json()['error']['decision']=='OD-06'


@pytest.mark.parametrize('quantity',[0,-1,1.2,True])
def test_invalid_quantities_rejected(client, headers, quantity):
    assert post(client,'/plans',headers['student'],{'lines':[{'item_id':1,'quantity':quantity}]}).status_code==422


def test_auth_revocation_and_secondary_read_only(client, headers, monkeypatch):
    assert client.get('/api/catalogue').status_code==401
    with db.Session() as s:s.get(User,2).active=False;s.commit()
    assert client.get('/api/catalogue',headers=headers['outsider']).status_code==401
    monkeypatch.setattr(settings,'read_only',True)
    assert post(client,'/projects',headers['student'],{'name':'x','mentor_id':3}).status_code==403


def test_invalid_import_is_atomic(client, tmp_path):
    import json
    from pathlib import Path
    from labtrack.cli import seed
    data=json.loads(Path('fixtures/demo.json').read_text(encoding='utf-8'));data['stock'][0]['good']=-1
    path=tmp_path/'invalid.json';path.write_text(json.dumps(data),encoding='utf-8')
    with pytest.raises(ValueError,match='nonnegative'):seed(path)


def test_failed_functional_test_cannot_restore_asset_availability(client, headers):
    h=headers;rid=issued(client,h,[{'item_id':4,'quantity':1}],'USE_IN_COLLEGE')
    line=client.get(f'/api/requests/{rid}',headers=h['assistant']).json()['lines'][0]
    response=post(client,f'/requests/{rid}/return',h['assistant'],{'lines':[{'line_id':line['id'],'asset_conditions':{line['barcodes'][0]:'GOOD'},'functional':'FAIL'}]})
    assert response.status_code==422
    with db.Session() as s:assert s.get(Request,rid).state=='IN_USE'


def test_external_email_send_intent_survives_ambiguous_timeout(client, monkeypatch):
    import httpx
    import labtrack.worker as worker
    from labtrack.models import Delivery
    class AmbiguousProvider:
        calls=0
        def send(self,*args):
            self.calls+=1
            raise httpx.ReadTimeout('Ambiguous after network send')
    provider=AmbiguousProvider();monkeypatch.setattr(worker,'email_provider',lambda:provider)
    assert worker.durable_external_send('external-test','student1@example.invalid',{'event':'TEST'})
    assert worker.durable_external_send('external-test','student1@example.invalid',{'event':'TEST'})
    assert provider.calls==1
    with db.Session() as s:assert s.get(Delivery,'external-test').state=='UNKNOWN'


def test_raw_audit_records_are_append_only(client, headers):
    project(client,headers)
    with db.Session() as s:
        record=s.scalar(select(Audit));record.action='ERASE_HISTORY'
        with pytest.raises(ValueError,match='append-only'):s.commit()


def test_approved_collection_expiry_once_without_stock_change(client, headers):
    from labtrack.worker import expire_approved
    rid=request(client,headers);approve(client,headers,rid)
    with db.Session() as s:
        s.get(Request,rid).approved_at=utcnow()-timedelta(hours=49);s.commit()
        quantities=list(s.scalars(select(Stock.good)))
        assert expire_approved(s)==1;s.commit()
        assert expire_approved(s)==0;s.commit()
        assert s.get(Request,rid).state=='APPROVED_EXPIRED_BEFORE_ISSUE'
        assert list(s.scalars(select(Stock.good)))==quantities


def test_wrong_barcode_leaves_request_and_stock_unchanged(client, headers):
    h=headers;rid=request(client,h,[{'item_id':4,'quantity':1}],'USE_IN_COLLEGE');approve(client,h,rid,True)
    post(client,f'/requests/{rid}/claim',h['assistant'])
    line=client.get(f'/api/requests/{rid}',headers=h['assistant']).json()['lines'][0]
    response=post(client,f'/requests/{rid}/issue',h['assistant'],{'physical_handover_confirmed':True,'assignments':{str(line['id']):['SIT-UNKNOWN']}})
    assert response.status_code==422
    with db.Session() as s:
        assert s.get(Request,rid).state=='APPROVED'
        assert all(a.state=='AVAILABLE' for a in s.scalars(select(Asset)))


def test_student_departmental_restriction_blocks_cross_dept_issue(client, headers):
    from labtrack.models import Lab
    # Assign branch 'AIML' to student, lab 1 to 'AIML', and lab 2 to 'RA'
    with db.Session() as s:
        student = s.get(User, 1)
        student.branch = "AIML"
        lab1 = s.get(Lab, 1)
        lab1.branch = "AIML"
        lab2 = s.get(Lab, 2)
        lab2.branch = "RA"
        s.commit()

    p = project(client, headers)
    # Item 2 is only stocked in lab 2 (RA lab in fixtures/demo.json: lab_id 2 has good=4, lab 1 has 0)
    # AIML student attempting to requisition item 2 from RA lab must be blocked with 403
    r = post(client, '/requests', headers['student'], {
        'project_id': p,
        'duration_hours': 168,
        'purpose': 'BORROW',
        'lines': [{'item_id': 2, 'quantity': 1}]
    })
    assert r.status_code == 403, r.text
    assert "CROSS_DEPT_PROHIBITED" in r.text or "Cross-Department" in r.text

    # Requisitioning item 1 (stocked in lab 1 AIML with good=8) must succeed
    r2 = post(client, '/requests', headers['student'], {
        'project_id': p,
        'duration_hours': 168,
        'purpose': 'BORROW',
        'lines': [{'item_id': 1, 'quantity': 1}]
    })
    assert r2.status_code == 200, r2.text

