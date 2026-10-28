"""
LabTrack — Aiven MySQL Integration & Migration Verification Test
Validates that FastAPI, SQLAlchemy, and MySQL Stored Procedures operate seamlessly
against the remote cloud-hosted Aiven MySQL database.
"""
import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text
from src.backend.labtrack.api import app
from src.backend.labtrack import db
from src.backend.labtrack.models import Base


def _require_mysql_integration():
    if not os.environ.get("LABTRACK_TEST_MYSQL_URL"):
        pytest.skip("LABTRACK_TEST_MYSQL_URL not configured")
    if db.engine.dialect.name != "mysql":
        pytest.skip("Configured test runtime is not using MySQL")


def test_mysql_integration_guard_skips_without_env(monkeypatch):
    monkeypatch.delenv("LABTRACK_TEST_MYSQL_URL", raising=False)
    with pytest.raises(pytest.skip.Exception):
        _require_mysql_integration()


@pytest.mark.integration
def test_mysql_dialect_active():
    """Verify that SQLAlchemy engine dialect is MySQL."""
    _require_mysql_integration()
    assert db.engine.dialect.name == "mysql", f"Expected MySQL dialect, got {db.engine.dialect.name}"


@pytest.mark.integration
def test_api_health_mysql():
    """Verify that /api/health reports MySQL SQL profile."""
    _require_mysql_integration()
    client = TestClient(app)
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["sql"] == "mysql"


@pytest.mark.integration
def test_stored_procedure_execution():
    """Verify that CALL labtrack_usage_by_lab() runs and returns aggregated records."""
    _require_mysql_integration()
    with db.Session() as session:
        result = session.connection().execute(text("CALL labtrack_usage_by_lab();")).fetchall()
        assert len(result) > 0
        # Inspect columns returned by procedure
        row = result[0]
        assert hasattr(row, "lab_name") or "lab_name" in row._mapping
        assert hasattr(row, "component") or "component" in row._mapping


@pytest.mark.integration
def test_reports_usage_api():
    """Verify that /api/reports/usage runs multi-table join query against MySQL."""
    _require_mysql_integration()
    client = TestClient(app)
    login_res = client.post("/api/auth/login", json={"identifier": "T00003", "password": "LabTrackDemo2026!"})
    assert login_res.status_code == 200
    token = login_res.json()["token"]

    res = client.get("/api/reports/usage", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    items = res.json()
    assert isinstance(items, list)
    assert len(items) > 0
    assert "item" in items[0]
    assert "issued_quantity" in items[0]
