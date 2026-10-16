import time
import logging
from . import db
from .config import settings
from .worker import dispatch, expire_approved

logging.basicConfig(level=logging.INFO)
if settings.read_only:
    raise SystemExit("Secondary read-only deployment must not run a dispatcher")
while True:
    with db.Session() as session:
        try:
            db.begin_write(session)
            expire_approved(session)
            dispatch(session)
            session.commit()
        except Exception:
            session.rollback()
            logging.exception("Outbox pass failed; committed domain state is unaffected")
    time.sleep(10)
