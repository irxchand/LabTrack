from pathlib import Path
from typing import Literal
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="LABTRACK_", env_file=".env", extra="ignore")
    database_url: str = "sqlite:///.local/labtrack.db"
    document_store: Literal["local", "mongo"] = "local"
    mongo_url: str = "mongodb://localhost:27017"
    mongo_database: str = "labtrack"
    email_provider: Literal["local", "gmail"] = "local"
    gmail_access_token: str = ""
    email_sender: str = "labtrack@example.invalid"
    object_store: Literal["local", "s3"] = "local"
    s3_bucket: str = ""
    local_dir: Path = Path(".local")
    frontend_dir: Path = Path("src/frontend/dist")
    session_hours: int = 8
    max_extensions: int = 2
    collection_hours: int = 48
    reservation_hours: int = 24
    reservation_expiry_anchor: str = "UNRESOLVED"
    scheduler_enabled: bool = False
    read_only: bool = False


settings = Settings()
