from fastapi import APIRouter, Depends
from datetime import datetime
from app.auth.dependencies import get_current_user
from app.database import sessions_collection

router = APIRouter(prefix="/platform", tags=["Platform"])

@router.post("/session/start")
async def start_session(current_user: dict = Depends(get_current_user)):
    session_doc = {
        'user_id': current_user["user_id"],
        'created_at': datetime.utcnow(),
        'status': 'intake',
        'intake': None,
        'intake_history': [],
        'rights_explanation': None,
        'recommendation': None,
        'rti_document': None,
    }
    result = await sessions_collection.insert_one(session_doc)
    return {"session_id": str(result.inserted_id)}

@router.post("/intake/message")
async def intake_message(current_user: dict = Depends(get_current_user)):
    return {"message": "Intake endpoint ready", "status": "placeholder"}

@router.post("/rights")
async def rights(current_user: dict = Depends(get_current_user)):
    return {"message": "Rights endpoint placeholder"}

@router.post("/recommend")
async def recommend(current_user: dict = Depends(get_current_user)):
    return {"message": "Recommend endpoint placeholder"}

@router.post("/draft-rti")
async def draft_rti(current_user: dict = Depends(get_current_user)):
    return {"message": "Draft RTI endpoint placeholder"}

@router.get("/download-rti/{session_id}")
async def download_rti(session_id: str, current_user: dict = Depends(get_current_user)):
    return {"message": f"Download RTI for session {session_id} placeholder"}
