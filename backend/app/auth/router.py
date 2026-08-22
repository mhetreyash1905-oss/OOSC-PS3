from __future__ import annotations
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from app.auth.models import UserProfileCreate, UserUpdate
from app.database import users_collection
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


def _parse_display_name(display_name: str | None) -> tuple[str, str]:
    """Split Firebase displayName (e.g. 'John Doe') into (first, last)."""
    if not display_name:
        return "User", ""
    parts = display_name.strip().split(" ", 1)
    first = parts[0]
    last = parts[1] if len(parts) > 1 else ""
    return first, last


@router.post("/register", status_code=201)
async def register(profile: UserProfileCreate, current_user: dict = Depends(get_current_user)):
    """
    Called by the frontend immediately after Firebase creates the account
    (via email/password OR Google sign-in).
    The Firebase ID token is already verified by get_current_user.
    Saves the user's profile to MongoDB keyed by Firebase UID.
    This endpoint is idempotent — safe to call on every Google sign-in.
    """
    uid = current_user["user_id"]
    email = current_user["email"]

    existing = await users_collection.find_one({"_id": uid})
    if existing:
        # Already has a profile — return it (idempotent for Google sign-ins)
        return {
            "id": uid,
            "email": email,
            "first_name": existing.get("first_name", ""),
            "last_name": existing.get("last_name", ""),
            "gender": existing.get("gender", ""),
        }

    # Derive name: prefer explicitly provided values, fall back to Firebase displayName
    firebase_display_name = current_user.get("display_name") or current_user.get("name")
    fb_first, fb_last = _parse_display_name(firebase_display_name)

    first_name = profile.first_name or fb_first
    last_name = profile.last_name or fb_last
    gender = profile.gender or "prefer-not-to-say"

    user_doc = {
        "_id": uid,
        "email": email,
        "first_name": first_name,
        "last_name": last_name,
        "gender": gender,
        "avatar": "",
        "bio": "",
        "created_at": datetime.utcnow(),
    }

    await users_collection.insert_one(user_doc)

    return {
        "id": uid,
        "email": email,
        "first_name": first_name,
        "last_name": last_name,
        "gender": gender,
    }


@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    uid = current_user["user_id"]
    db_user = await users_collection.find_one({"_id": uid})
    if not db_user:
        raise HTTPException(status_code=404, detail="User profile not found")
    return {
        "email": db_user.get("email"),
        "id": db_user.get("_id"),
        "first_name": db_user.get("first_name", ""),
        "last_name": db_user.get("last_name", ""),
        "gender": db_user.get("gender", ""),
        "avatar": db_user.get("avatar", ""),
        "bio": db_user.get("bio", ""),
    }


@router.put("/me")
async def update_me(update_data: UserUpdate, current_user: dict = Depends(get_current_user)):
    uid = current_user["user_id"]

    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}

    if not update_dict:
        return {"message": "No data provided to update"}

    result = await users_collection.update_one(
        {"_id": uid},
        {"$set": update_dict}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "Profile updated successfully"}
