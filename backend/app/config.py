import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MONGODB_URI = os.getenv("MONGODB_URI")
JWT_SECRET = os.getenv("JWT_SECRET")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set in environment")
if not MONGODB_URI:
    raise ValueError("MONGODB_URI is not set in environment")
if not JWT_SECRET:
    raise ValueError("JWT_SECRET is not set in environment")

JWT_ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_HOURS = 24
DATABASE_NAME = 'civic_rights_navigator'
