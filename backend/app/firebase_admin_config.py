import firebase_admin
from firebase_admin import credentials, auth
import os
import logging

logger = logging.getLogger(__name__)

_firebase_initialized = False

def _initialize_firebase():
    global _firebase_initialized
    if not _firebase_initialized and not firebase_admin._apps:
        service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "firebase-service-account.json")
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
        _firebase_initialized = True
        logger.info("Firebase Admin SDK initialized.")

_initialize_firebase()

def verify_firebase_token(id_token: str) -> dict:
    """
    Verify a Firebase ID token and return the decoded claims.
    Returns a dict with at minimum 'uid' and 'email'.
    Raises ValueError on invalid/expired tokens.
    """
    try:
        decoded = auth.verify_id_token(id_token)
        return decoded
    except Exception as e:
        logger.warning(f"Firebase token verification failed: {e}")
        raise ValueError(f"Invalid Firebase token: {e}")
