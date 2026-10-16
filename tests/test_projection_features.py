import uuid
from sqlalchemy import select
from labtrack import db
from labtrack.models import Delivery
from labtrack.worker import dispatch
from labtrack.config import settings
from tests.test_workflows import post, issued


def test_unstocked_demand_is_analytics_not_inventory(client, headers):
    h=headers
    before=client.get('/api/catalogue',headers=h['student']).json()
    response=post(client,'/demand/unstocked',h['student'],{'component_name':'Thermal imaging module','quantity':3},'unstocked-1')
    assert response.json()=={'recorded':True,'inventory_created':False}
    assert post(client,'/demand/unstocked',h['student'],{'component_name':'Thermal imaging module','quantity':3},'unstocked-1').json()==response.json()
    with db.Session() as s:dispatch(s);s.commit()
    assert client.get('/api/reports/demand',headers=h['hod']).json()==[{'_id':'Thermal imaging module','requested':3,'occurrences':1}]
    assert client.get('/api/catalogue',headers=h['student']).json()==before
    assert post(client,'/demand/unstocked',h['student'],{'component_name':'Jetson Nano','quantity':1}).status_code==409


def test_curated_alternative_live_validation(client, headers):
    from labtrack.models import Stock
    options=client.get('/api/alternatives/1',headers=headers['student']).json()
    assert [o['id'] for o in options]==[2]
    with db.Session() as s:
        s.scalar(select(Stock).where(Stock.item_id==2)).good=0;s.commit()
    assert client.get('/api/alternatives/1',headers=headers['student']).json()==[]


def test_external_dispatch_uses_durable_intent_and_replays_safely(client, headers, monkeypatch):
    import labtrack.worker as worker
    from labtrack.models import Outbox
    class Provider:
        calls=0
        def send(self,*args):self.calls+=1
    provider=Provider();monkeypatch.setattr(settings,'email_provider','gmail');monkeypatch.setattr(worker,'email_provider',lambda:provider)
    with db.Session() as s:
        s.add(Outbox(event_key='external-delivery-test',payload={'event':'TEST','recipients':[1],'request_id':None,'details':{}}));s.commit()
    with db.Session() as s:dispatch(s);s.commit()
    with db.Session() as s:dispatch(s);s.commit()
    assert provider.calls==1
    with db.Session() as s:assert s.scalar(select(Delivery)).state=='SENT'


def test_evidence_sql_failure_compensates_uploaded_blob(client, headers, monkeypatch):
    import io
    from PIL import Image
    from sqlalchemy.exc import OperationalError
    rid=issued(client,headers,[{'item_id':4,'quantity':1}],'USE_IN_COLLEGE')
    buffer=io.BytesIO();Image.new('RGB',(10,10),'white').save(buffer,format='PNG')
    def fail_commit(self):raise OperationalError('commit',{},RuntimeError('simulated DB failure'))
    monkeypatch.setattr(db.Session.class_,'commit',fail_commit)
    response=client.post(f'/api/requests/{rid}/evidence',headers=headers['assistant'],files={'file':('image.png',buffer.getvalue(),'image/png')})
    assert response.status_code==503
    assert list((settings.local_dir/'evidence').iterdir())==[]
