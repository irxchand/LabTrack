import hashlib
import hmac
import secrets
from datetime import timedelta
from typing import Protocol
from sqlalchemy import select
from .models import AuthSession, User, utcnow


def password_hash(password, salt=None):
    salt = salt or secrets.token_hex(16)
    value = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 310_000).hex()
    return f"pbkdf2_sha256${salt}${value}"


def verify_password(password, stored):
    return hmac.compare_digest(password_hash(password, stored.split("$")[1]), stored)


class AuthProvider(Protocol):
    def authenticate(self, session, identifier: str, password: str): ...


class SyntheticAuthProvider:
    def authenticate(self, session, identifier, password):
        user = session.scalar(select(User).where(User.identifier == identifier))
        if not user or not user.active or "SYSTEM" in user.roles or not verify_password(password, user.password_hash):
            return None
        return user


def issue_token(session, user, hours):
    token = secrets.token_urlsafe(40)
    session.add(AuthSession(token_hash=hashlib.sha256(token.encode()).hexdigest(), user_id=user.id, expires_at=utcnow()+timedelta(hours=hours)))
    return token


def token_user(session, token):
    record = session.get(AuthSession, hashlib.sha256(token.encode()).hexdigest())
    if not record or record.expires_at <= utcnow():
        return None
    user = session.get(User, record.user_id)
    return user if user and user.active else None
