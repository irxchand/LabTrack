"""
LabTrack — Aiven MySQL Integration & Migration Verification Test
Validates that FastAPI, SQLAlchemy, and MySQL Stored Procedures operate seamlessly
against the remote cloud-hosted Aiven MySQL database.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text
from src.backend.labtrack.api import app
from src.backend.labtrack import db
from src.backend.labtrack.models import Base


def test_mysql_dialect_active():
    """Verify that SQLAlchemy engine dialect is MySQL."""
    assert db.engine.dialect.name == "mysql", f"Expected MySQL dialect, got {db.engine.dialect.name}"


def test_api_health_mysql():
    """Verify that /api/health reports MySQL SQL profile."""
    client = TestClient(app)
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["sql"] == "mysql"


def test_stored_procedure_execution():
    """Verify that CALL labtrack_usage_by_lab() runs and returns aggregated records."""
    with db.Session() as session:
        result = session.connection().execute(text("CALL labtrack_usage_by_lab();")).fetchall()
        assert len(result) > 0
        # Inspect columns returned by procedure
        row = result[0]
        assert hasattr(row, "lab_name") or "lab_name" in row._mapping
        assert hasattr(row, "component") or "component" in row._mapping


def test_reports_usage_api():
    """Verify that /api/reports/usage runs multi-table join query against MySQL."""
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
