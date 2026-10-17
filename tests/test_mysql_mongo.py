"""Opt-in real-service validation; never fall back and pretend it passed."""
import os
import pytest
from sqlalchemy import create_engine, text
from pymongo import MongoClient


@pytest.mark.integration
def test_mysql_connection_and_reporting_routine():
    url=os.environ.get('LABTRACK_TEST_MYSQL_URL')
    if not url:pytest.skip('LABTRACK_TEST_MYSQL_URL not configured')
    engine=create_engine(url)
    assert engine.url.database.endswith('_test'), 'Integration tests require an explicitly named _test database'
    with engine.connect() as s:
        version=s.execute(text('SELECT VERSION()')).scalar()
        assert version.startswith('8.4')
        rows=s.execute(text('CALL labtrack_usage_by_lab()')).all()
        assert rows is not None
    engine.dispose()


@pytest.mark.integration
def test_mongo_idempotent_projection_and_aggregation():
    url=os.environ.get('LABTRACK_TEST_MONGO_URL')
    if not url:pytest.skip('LABTRACK_TEST_MONGO_URL not configured')
    client=MongoClient(url,serverSelectionTimeoutMS=2000)
    db=client.labtrack_test
    db.command('ping')
    payload={'item_id':99,'quantity':3}
    for _ in range(2):db.demand.update_one({'_id':'test:dedup'},{'$set':payload},upsert=True)
    assert db.demand.count_documents({'_id':'test:dedup'})==1
    assert list(db.demand.aggregate([{'$match':{'_id':'test:dedup'}},{'$group':{'_id':'$item_id','quantity':{'$sum':'$quantity'}}}]))==[{'_id':99,'quantity':3}]
    db.demand.delete_one({'_id':'test:dedup'})
    client.close()
