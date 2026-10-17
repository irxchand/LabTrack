"""Replaceable document, mail and object boundaries; local substitutes are explicit."""
import base64
import json
from email.message import EmailMessage
from pathlib import Path
from typing import Protocol
import httpx
from pymongo import MongoClient
from sqlalchemy import select
from .models import LocalDocument
from .config import settings


class DocumentStore(Protocol):
    def put(self, collection, identifier, payload): ...
    def list(self, collection, user_id=None): ...


class LocalDocumentStore:
    def __init__(self, session):
        self.session = session

    def put(self, collection, identifier, payload):
        row = self.session.get(LocalDocument, identifier)
        if row is None:
            self.session.add(LocalDocument(id=identifier, collection=collection, payload=payload))
        else:
            row.payload = payload

    def list(self, collection, user_id=None):
        records = [d.payload for d in self.session.scalars(select(LocalDocument).where(LocalDocument.collection == collection))]
        return [d for d in records if user_id is None or d.get("user_id") == user_id]


class MongoDocumentStore:
    def __init__(self):
        self.client = MongoClient(settings.mongo_url, serverSelectionTimeoutMS=2000, connectTimeoutMS=2000)
        self.db = self.client[settings.mongo_database]

    def put(self, collection, identifier, payload):
        self.db[collection].update_one({"_id": identifier}, {"$set": payload}, upsert=True)

    def list(self, collection, user_id=None):
        query = {} if user_id is None else {"user_id": user_id}
        return list(self.db[collection].find(query, {"_id": 0}).limit(1000))

    def demand_summary(self):
        return list(self.db.demand.aggregate([
            {"$group": {"_id": {"$ifNull": ["$item_id", "$component_name"]}, "requested": {"$sum": "$quantity"}, "occurrences": {"$sum": 1}}},
            {"$sort": {"requested": -1, "_id": 1}},
        ]))


def document_store(session):
    return MongoDocumentStore() if settings.document_store == "mongo" else LocalDocumentStore(session)


class EmailProvider(Protocol):
    def send(self, identifier: str, recipient: str, payload: dict): ...


class LocalEmailProvider:
    def send(self, identifier, recipient, payload):
        folder = settings.local_dir / "mail"
        folder.mkdir(parents=True, exist_ok=True)
        path = folder / (identifier.replace(":", "_") + ".json")
        # Deterministic file identity makes local replay harmless.
        path.write_text(json.dumps({"to": recipient, **payload}, ensure_ascii=False, indent=2), encoding="utf-8")


class GmailEmailProvider:
    def send(self, identifier, recipient, payload):
        if not settings.gmail_access_token:
            raise ValueError("Gmail credentials are not configured")
        msg = EmailMessage()
        msg["To"], msg["From"] = recipient, settings.email_sender
        msg["Subject"] = "LabTrack · " + payload["event"].replace("_", " ").title()
        msg["Message-ID"] = f"<{identifier.replace(':', '.')}@labtrack.invalid>"
        msg.set_content(json.dumps(payload, ensure_ascii=False, indent=2))
        raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
        # An ambiguous network outcome is handled by worker UNKNOWN state.
        response = httpx.post("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", headers={"Authorization": f"Bearer {settings.gmail_access_token}"}, json={"raw": raw}, timeout=20)
        response.raise_for_status()


def email_provider():
    return GmailEmailProvider() if settings.email_provider == "gmail" else LocalEmailProvider()


class LocalObjectStorage:
    def put(self, key, content, content_type):
        folder = settings.local_dir / "evidence"
        folder.mkdir(parents=True, exist_ok=True)
        (folder / key).write_bytes(content)

    def read(self, key):
        return (settings.local_dir / "evidence" / key).read_bytes()

    def delete(self, key):
        (settings.local_dir / "evidence" / key).unlink(missing_ok=True)


class S3ObjectStorage:
    def __init__(self):
        import boto3
        self.client = boto3.client("s3")

    def put(self, key, content, content_type):
        self.client.put_object(Bucket=settings.s3_bucket, Key=key, Body=content, ContentType=content_type, ServerSideEncryption="AES256")

    def read(self, key):
        return self.client.get_object(Bucket=settings.s3_bucket, Key=key)["Body"].read()

    def delete(self, key):
        self.client.delete_object(Bucket=settings.s3_bucket, Key=key)


def object_store():
    return S3ObjectStorage() if settings.object_store == "s3" else LocalObjectStorage()
