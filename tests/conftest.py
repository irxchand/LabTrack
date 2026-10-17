import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import sessionmaker
from labtrack import db
from labtrack.api import app
from labtrack.config import settings
from labtrack.models import Base
from labtrack.cli import seed


@pytest.fixture
def client(tmp_path, monkeypatch):
    engine = db.make_engine(f"sqlite:///{tmp_path / 'test.db'}")
    Base.metadata.create_all(engine)
    monkeypatch.setattr(db, "engine", engine)
    monkeypatch.setattr(db, "Session", sessionmaker(bind=engine, expire_on_commit=False))
    monkeypatch.setattr(settings, "local_dir", tmp_path)
    monkeypatch.setattr(settings, "document_store", "local")
    monkeypatch.setattr(settings, "email_provider", "local")
    monkeypatch.setattr(settings, "object_store", "local")
    monkeypatch.setattr(settings, "scheduler_enabled", False)
    monkeypatch.setattr(settings, "read_only", False)
    seed("fixtures/demo.json")
    with TestClient(app) as value:
        yield value
    engine.dispose()


@pytest.fixture
def headers(client):
    users = {}
    for name, identifier in [("student", "DEMO-STU-001"), ("outsider", "DEMO-STU-002"), ("mentor", "T00001"), ("incharge", "T00002"), ("hod", "T00003"), ("assistant", "N00001"), ("assistant2", "N00002"), ("admin", "DEMO-ADMIN")]:
        response = client.post("/api/auth/login", json={"identifier": identifier, "password": "DemoOnly2026!"})
        assert response.status_code == 200, response.text
        users[name] = {"Authorization": "Bearer "+response.json()["token"]}
    return users
