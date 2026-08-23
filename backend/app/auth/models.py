from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class UserProfileCreate(BaseModel):
    """
    Sent by the frontend after Firebase creates the account (email/password or Google).
    The Firebase ID token is verified separately via the Authorization header.
    All fields are optional so Google sign-in can omit them and get sensible defaults.
    """
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    gender: Optional[str] = "prefer-not-to-say"
    phone: Optional[str] = None


class UserInDB(BaseModel):
    id: str
    email: str
    created_at: datetime


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    gender: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None
