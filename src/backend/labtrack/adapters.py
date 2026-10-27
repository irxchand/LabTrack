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


class SMTPEmailProvider:
    def send(self, identifier, recipient, payload):
        import smtplib
        import json
        from email.message import EmailMessage

        target_recipient = settings.email_override or recipient
        msg = EmailMessage()
        msg["To"] = target_recipient
        msg["From"] = settings.email_sender or settings.smtp_username
        raw_event = payload.get("event", "NOTIFICATION")
        event_name = raw_event.replace("_", " ").title()
        req_id = payload.get("request_id")
        subject = f"LabTrack · {event_name}"
        if req_id is not None:
            subject += f" (#{req_id})"
        msg["Subject"] = subject
        msg["Message-ID"] = f"<{identifier.replace(':', '.')}@labtrack.invalid>"

        details = payload.get("details", {})
        student_name = details.get("student_name", "")
        student_prn = details.get("student_prn", "")
        project_name = details.get("project_name", "")
        mentor_name = details.get("mentor_name", "")
        technical_purpose = details.get("technical_purpose", "")
        components = details.get("components", [])

        # Plain text content
        plain_lines = [
            "LABTRACK INSTITUTIONAL HARDWARE LIFECYCLE",
            f"Event: {raw_event}",
            f"Request: #{req_id}" if req_id is not None else "",
            f"Student: {student_name} ({student_prn})" if student_name else "",
            f"Project: {project_name}" if project_name else "",
            f"Mentor: {mentor_name}" if mentor_name else "",
            f"Purpose: {technical_purpose}" if technical_purpose else "",
            "",
            "Components:" if components else "",
        ]
        for c in components:
            nom = c.get("nomenclature") or c.get("name") or c.get("itemId")
            qty = c.get("quantity", 1)
            plain_lines.append(f" - {nom} (Qty: {qty})")
        plain_lines.append("")
        plain_lines.append(f"Portal Link: {payload.get('link', '/')}")
        msg.set_content("\n".join(filter(None, plain_lines)))

        # HTML component rows
        comp_rows = ""
        for c in components:
            nom = c.get("nomenclature") or c.get("name") or c.get("itemId")
            qty = c.get("quantity", 1)
            comp_rows += f"""<tr>
              <td style="padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); color: #ffffff;">{nom}</td>
              <td style="padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); color: #c9b8a0; font-weight: bold; text-align: center;">{qty}</td>
            </tr>"""

        comp_table = ""
        if comp_rows:
            comp_table = f"""
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;">
              <thead>
                <tr style="background: rgba(255,255,255,0.05); text-align: left;">
                  <th style="padding: 8px 12px; color: #a1a1aa; font-weight: 600;">Component Nomenclature</th>
                  <th style="padding: 8px 12px; color: #a1a1aa; font-weight: 600; text-align: center;">Qty</th>
                </tr>
              </thead>
              <tbody>{comp_rows}</tbody>
            </table>
            """

        meta_rows = ""
        if student_name:
            meta_rows += f"<p style='margin: 4px 0; color: #a1a1aa; font-size: 13px;'><strong style='color: #ffffff;'>Student:</strong> {student_name} ({student_prn})</p>"
        if project_name:
            meta_rows += f"<p style='margin: 4px 0; color: #a1a1aa; font-size: 13px;'><strong style='color: #ffffff;'>Project:</strong> {project_name}</p>"
        if mentor_name:
            meta_rows += f"<p style='margin: 4px 0; color: #a1a1aa; font-size: 13px;'><strong style='color: #ffffff;'>Faculty Mentor:</strong> {mentor_name}</p>"
        if technical_purpose:
            meta_rows += f"<p style='margin: 4px 0; color: #a1a1aa; font-size: 13px;'><strong style='color: #ffffff;'>Purpose:</strong> {technical_purpose}</p>"

        # HTML alternative content
        html_content = f"""<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #08090d; color: #ffffff; padding: 24px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background: #12131a; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
    <div style="border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 16px; margin-bottom: 20px;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">LABTRACK</h1>
      <span style="font-size: 11px; color: #c9b8a0; text-transform: uppercase; letter-spacing: 0.1em;">Symbiosis Institute of Technology • Automated Lifecycle</span>
    </div>
    <div style="margin-bottom: 16px;">
      <span style="display: inline-block; padding: 4px 12px; background: rgba(201, 184, 160, 0.15); color: #f5e6c8; border: 1px solid rgba(201, 184, 160, 0.3); border-radius: 20px; font-size: 12px; font-weight: 600;">{event_name}</span>
    </div>
    <h3 style="color: #ffffff; margin-top: 0; font-size: 16px;">Requisition #{req_id if req_id is not None else ''} Details</h3>
    <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 16px; margin: 16px 0;">
      {meta_rows}
    </div>
    {comp_table}
    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08);">
      <p style="font-size: 12px; color: #71717a; margin-bottom: 16px;">This is an institutional automated notification from SIT LabTrack.</p>
      <a href="http://localhost:5173{payload.get('link', '#')}" style="display: inline-block; padding: 12px 24px; background: #ffffff; color: #000000; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 13px;">View Request in Workspace</a>
    </div>
  </div>
</body>
</html>"""
        msg.add_alternative(html_content, subtype="html")

        if settings.smtp_port == 465:
            import ssl
            context = ssl.create_default_context()
            with smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, context=context, timeout=15) as server:
                if settings.smtp_username and settings.smtp_password:
                    server.login(settings.smtp_username, settings.smtp_password)
                server.send_message(msg)
        else:
            with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as server:
                if settings.smtp_use_tls:
                    server.starttls()
                if settings.smtp_username and settings.smtp_password:
                    server.login(settings.smtp_username, settings.smtp_password)
                server.send_message(msg)


def email_provider():
    if settings.email_provider == "gmail":
        return GmailEmailProvider()
    if settings.email_provider == "smtp":
        return SMTPEmailProvider()
    return LocalEmailProvider()


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
