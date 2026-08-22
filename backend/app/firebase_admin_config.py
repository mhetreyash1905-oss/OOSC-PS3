import firebase_admin
from firebase_admin import credentials, auth
import os
import logging

logger = logging.getLogger(__name__)

_firebase_initialized = False
_allow_unverified_dev_tokens = os.getenv("ALLOW_UNVERIFIED_DEV_TOKENS", "false").lower() == "true"

def _initialize_firebase():
    global _firebase_initialized
    if not _firebase_initialized and not firebase_admin._apps:
        service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "firebase-service-account.json")
        if os.path.exists(service_account_path):
            try:
                cred = credentials.Certificate(service_account_path)
                firebase_admin.initialize_app(cred)
                _firebase_initialized = True
                logger.info("Firebase Admin SDK initialized with service account.")
            except Exception as e:
                logger.warning(f"Could not load service account from {service_account_path}: {e}")
                firebase_admin.initialize_app()
                _firebase_initialized = True
        else:
            try:
                firebase_admin.initialize_app()
                _firebase_initialized = True
                logger.info("Firebase Admin SDK initialized with default project credentials.")
            except Exception as e:
                logger.warning(f"Firebase Admin SDK initialization skipped: {e}")

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
        if _allow_unverified_dev_tokens:
            try:
                import jwt
                decoded = jwt.decode(id_token, options={"verify_signature": False})
                if "user_id" in decoded or "sub" in decoded:
                    logger.warning("Accepted an unverified Firebase token because ALLOW_UNVERIFIED_DEV_TOKENS is enabled.")
                    return {
                        "uid": decoded.get("user_id") or decoded.get("sub"),
                        "email": decoded.get("email", "citizen@civicsaathi.in"),
                        **decoded
                    }
            except Exception:
                pass
        raise ValueError(f"Invalid Firebase token: {e}")
