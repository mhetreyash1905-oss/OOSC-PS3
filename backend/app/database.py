import logging
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGODB_URI, DATABASE_NAME

logger = logging.getLogger(__name__)

client = AsyncIOMotorClient(MONGODB_URI, serverSelectionTimeoutMS=3000)
db = client[DATABASE_NAME]

users_collection = db["users"]
sessions_collection = db["sessions"]
knowledge_base_meta_collection = db["knowledge_base_meta"]

async def verify_connection():
    try:
        await client.admin.command('ping')
        return True
    except Exception as e:
        logger.warning(f"MongoDB connection check failed: {e}")
        return False
