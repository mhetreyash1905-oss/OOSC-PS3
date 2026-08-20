from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from bson import ObjectId
from app.auth.models import UserRegister, UserLogin, TokenResponse, UserInDB
from app.auth.utils import hash_password, verify_password, create_access_token
from app.database import users_collection
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
async def register(user: UserRegister):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user.password)
    user_doc = {
        "email": user.email,
        "password": hashed_password,
        "created_at": datetime.utcnow()
    }
    
    result = await users_collection.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    access_token = create_access_token(user_id=user_id, email=user.email)
    return {"access_token": access_token, "token_type": "bearer", "email": user.email}

@router.post("/login", response_model=TokenResponse)
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    user_id = str(db_user["_id"])
    access_token = create_access_token(user_id=user_id, email=user.email)
    
    return {"access_token": access_token, "token_type": "bearer", "email": user.email}

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {"email": current_user["email"], "id": current_user["user_id"]}
