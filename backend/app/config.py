import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MONGODB_URI = os.getenv("MONGODB_URI")
FIREBASE_SERVICE_ACCOUNT_PATH = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "firebase-service-account.json")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set in environment")
if not MONGODB_URI:
    raise ValueError("MONGODB_URI is not set in environment")

DATABASE_NAME = 'civic_rights_navigator'
