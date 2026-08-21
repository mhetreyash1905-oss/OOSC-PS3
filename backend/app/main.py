from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.auth.router import router as auth_router
from app.platform.router import router as platform_router
from app.database import verify_connection
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title='Civic Rights Navigator API',
    description='API for Civic Rights Navigator',
    version='1.0.0'
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(platform_router)

@app.on_event("startup")
async def startup_event():
    logger.info("Verifying MongoDB connection...")
    try:
        await verify_connection()
        logger.info("Successfully connected to MongoDB.")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB on startup: {e}")
        raise e

@app.get("/")
async def health_check():
    return {"status": "healthy", "service": "Civic Rights Navigator API"}
