"""
firebase_config.py
Initializes the Firebase Admin SDK (Auth verification + Firestore) for the
WasteGuide AI backend. Falls back to an in-memory store automatically if
no service account key is present, so the app boots in Demo Mode without
any Firebase project configured.
"""
import os
import uuid
import datetime

USE_FIRESTORE = False
db = None
auth = None

SERVICE_ACCOUNT_PATH = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "serviceAccountKey.json")

try:
    import firebase_admin
    from firebase_admin import credentials, firestore, auth as fb_auth
    import json

    cred = None
    service_account_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")

    if service_account_json:
        # Load directly from environment variable JSON string
        cred = credentials.Certificate(json.loads(service_account_json))
    elif os.path.exists(SERVICE_ACCOUNT_PATH):
        # Load from local credentials file path
        cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)

    if cred:
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        auth = fb_auth
        USE_FIRESTORE = True
except Exception:
    USE_FIRESTORE = False


# ---------------------------------------------------------------------------
# In-memory fallback store (Demo Mode) — mirrors the Firestore document shape
# described in the project spec: waste_logs/{logId} and users/{userId}
# ---------------------------------------------------------------------------
_DEMO_WASTE_LOGS = []
_DEMO_USERS = {}


def verify_id_token(id_token: str):
    """Verifies a Firebase Auth ID token; returns uid or 'demo-user' fallback."""
    if USE_FIRESTORE and id_token:
        try:
            decoded = auth.verify_id_token(id_token)
            return decoded.get("uid")
        except Exception:
            return None
    return "demo-user"


def save_waste_log(user_id: str, log_data: dict) -> dict:
    """Writes a record to waste_logs/{logId} (or the in-memory equivalent)."""
    record = dict(log_data)
    record["log_id"] = str(uuid.uuid4())
    record["user_id"] = user_id
    record["timestamp"] = datetime.datetime.utcnow().isoformat()
    record["date"] = record["timestamp"][:10]

    if USE_FIRESTORE:
        db.collection("waste_logs").document(record["log_id"]).set(record)
    else:
        _DEMO_WASTE_LOGS.append(record)

    return record


def get_waste_logs(user_id: str, limit: int = 50):
    if USE_FIRESTORE:
        docs = (
            db.collection("waste_logs")
            .where("user_id", "==", user_id)
            .stream()
        )
        logs = [d.to_dict() for d in docs]
        logs.sort(key=lambda r: r.get("timestamp", ""), reverse=True)
        return logs[:limit]

    logs = [r for r in _DEMO_WASTE_LOGS if r["user_id"] == user_id]
    return sorted(logs, key=lambda r: r["timestamp"], reverse=True)[:limit]
