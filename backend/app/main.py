from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pymongo.errors import PyMongoError
from google.api_core.exceptions import GoogleAPIError
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

@app.exception_handler(PyMongoError)
async def mongodb_error_handler(request: Request, exc: PyMongoError):
    logger.error("MongoDB request failed: %s", exc)
    return JSONResponse(status_code=503, content={"detail": "The data service is temporarily unavailable. Please try again."})

@app.exception_handler(GoogleAPIError)
async def google_api_error_handler(request: Request, exc: GoogleAPIError):
    logger.error("Google API request failed: %s", exc)
    return JSONResponse(status_code=503, content={"detail": "The analysis service is temporarily unavailable. Please try again."})

@app.on_event("startup")
async def startup_event():
    logger.info("Verifying MongoDB connection...")
    connected = await verify_connection()
    if connected:
        logger.info("Successfully connected to MongoDB.")
    else:
        logger.warning("MongoDB is currently not reachable. Note: Configure MONGODB_URI in backend/.env with your Atlas cluster string.")

@app.get("/")
async def health_check():
    return {"status": "healthy", "service": "Civic Rights Navigator API"}
