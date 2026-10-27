from pathlib import Path
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from .config import settings


def make_engine(url):
    connect_args = {}
    if url.startswith("sqlite"):
        settings.local_dir.mkdir(parents=True, exist_ok=True)
        connect_args = {"check_same_thread": False, "timeout": 30}
    elif "mysql" in url:
        connect_args = {"ssl": {"ssl_disabled": False}}
    engine = create_engine(url, pool_pre_ping=True, connect_args=connect_args)
    if url.startswith("sqlite"):
        @event.listens_for(engine, "connect")
        def configure(dbapi_connection, _):
            dbapi_connection.execute("PRAGMA foreign_keys=ON")
            dbapi_connection.execute("PRAGMA busy_timeout=30000")
    return engine


engine = make_engine(settings.database_url)
Session = sessionmaker(bind=engine, expire_on_commit=False)


def begin_write(session):
    if session.bind.dialect.name == "sqlite":
        # Serialize local writes; real MySQL uses explicit FOR UPDATE row locks.
        session.connection().exec_driver_sql("BEGIN IMMEDIATE")
