from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from datetime import datetime
from bson import ObjectId
from app.auth.dependencies import get_current_user
from app.database import sessions_collection
from app.agents.intake import process_intake_message

router = APIRouter(prefix="/platform", tags=["Platform"])

class IntakeRequest(BaseModel):
    session_id: str
    message: str

class SessionRequest(BaseModel):
    session_id: str

@router.get("/sessions/history")
async def get_session_history(current_user: dict = Depends(get_current_user)):
    """Return the user's past sessions for the sidebar history list."""
    cursor = sessions_collection.find(
        {"user_id": current_user["user_id"]},
        {"intake_history": 1, "status": 1, "created_at": 1, "intake": 1}
    ).sort("created_at", -1).limit(30)
    
    sessions = []
    async for session in cursor:
        # Build a short title from the first user message or intake category
        title = "New Chat"
        history = session.get("intake_history", [])
        for msg in history:
            if msg.get("role") == "user":
                title = msg["content"][:60]
                break
        
        intake = session.get("intake")
        if intake and intake.get("category"):
            category = intake["category"].replace("_", " ").title()
        else:
            category = None

        if title != "New Chat":
            sessions.append({
                "session_id": str(session["_id"]),
                "title": title,
                "category": category,
                "status": session.get("status", "intake"),
                "created_at": session.get("created_at", "").isoformat() if session.get("created_at") else None,
            })
    
    return {"sessions": sessions}

@router.get("/sessions/{session_id_str}")
async def get_session(session_id_str: str, current_user: dict = Depends(get_current_user)):
    try:
        session_id = ObjectId(session_id_str)
    except:
        raise HTTPException(status_code=400, detail="Invalid session_id format")

    session = await sessions_collection.find_one({"_id": session_id, "user_id": current_user["user_id"]})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    session["session_id"] = str(session["_id"])
    session.pop("_id")
    session.pop("user_id")
    if "created_at" in session and session["created_at"]:
        session["created_at"] = session["created_at"].isoformat()
        
    return session

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
async def intake_message(request: IntakeRequest, current_user: dict = Depends(get_current_user)):
    try:
        session_id = ObjectId(request.session_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid session_id format")

    session = await sessions_collection.find_one({"_id": session_id, "user_id": current_user["user_id"]})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if session["status"] != "intake":
        raise HTTPException(status_code=400, detail=f"Session is in '{session['status']}' state, not 'intake'")

    history = session.get("intake_history", [])
    ai_response = await process_intake_message(history, request.message)
    new_history = history + [{"role": "user", "content": request.message}]
    
    if not ai_response.get("is_complete"):
        agent_msg = ai_response.get("agent_message", "Could you provide more details?")
        new_history.append({"role": "agent", "content": agent_msg})
        await sessions_collection.update_one(
            {"_id": session_id},
            {"$set": {"intake_history": new_history}}
        )
        return {"status": "in_progress", "agent_message": agent_msg}
    else:
        intake_data = {
            "category": ai_response.get("category"),
            "location": ai_response.get("location"),
            "facts": ai_response.get("facts"),
            "desired_outcome": ai_response.get("desired_outcome"),
            "specific_details": ai_response.get("specific_details")
        }
        await sessions_collection.update_one(
            {"_id": session_id},
            {"$set": {
                "intake_history": new_history,
                "intake": intake_data,
                "status": "rights"
            }}
        )
        return {"status": "complete", "intake_data": intake_data}

@router.post("/rights")
async def rights(request: SessionRequest, current_user: dict = Depends(get_current_user)):
    try:
        session_id = ObjectId(request.session_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid session_id format")

    session = await sessions_collection.find_one({"_id": session_id, "user_id": current_user["user_id"]})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if session["status"] not in ["rights", "recommendation", "drafting", "complete"]:
        raise HTTPException(status_code=400, detail="Session is not ready for rights explanation")

    if not session.get("rights_explanation"):
        from app.agents.rights_navigator import generate_rights_explanation
        explanation_data = await generate_rights_explanation(session["intake"])
        
        await sessions_collection.update_one(
            {"_id": session_id},
            {"$set": {
                "rights_explanation": explanation_data,
                "status": "recommendation"
            }}
        )
        return explanation_data
    
    return session["rights_explanation"]

@router.post("/recommend")
async def recommend(request: SessionRequest, current_user: dict = Depends(get_current_user)):
    try:
        session_id = ObjectId(request.session_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid session_id format")

    session = await sessions_collection.find_one({"_id": session_id, "user_id": current_user["user_id"]})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if session["status"] not in ["recommendation", "drafting", "complete"]:
        raise HTTPException(status_code=400, detail="Session is not ready for recommendation")

    if not session.get("recommendation"):
        from app.agents.action_recommender import generate_recommendation
        recommendation_data = await generate_recommendation(session["intake"], session["rights_explanation"])
        
        await sessions_collection.update_one(
            {"_id": session_id},
            {"$set": {
                "recommendation": recommendation_data,
                "status": "drafting"
            }}
        )
        return recommendation_data
    
    return session["recommendation"]

@router.post("/draft-rti")
async def draft_rti(request: SessionRequest, current_user: dict = Depends(get_current_user)):
    try:
        session_id = ObjectId(request.session_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid session_id format")

    session = await sessions_collection.find_one({"_id": session_id, "user_id": current_user["user_id"]})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if session["status"] not in ["drafting", "complete"]:
        raise HTTPException(status_code=400, detail="Session is not ready for RTI drafting")

    if not session.get("rti_document"):
        from app.agents.rti_drafter import draft_rti_application
        rti_data = await draft_rti_application(session["intake"], session.get("recommendation", {}), current_user.get("email", "Citizen"))
        
        await sessions_collection.update_one(
            {"_id": session_id},
            {"$set": {
                "rti_document": rti_data,
                "status": "complete"
            }}
        )
        return rti_data
    
    return session["rti_document"]

@router.get("/download-rti/{session_id_str}")
async def download_rti(session_id_str: str, current_user: dict = Depends(get_current_user)):
    try:
        session_id = ObjectId(session_id_str)
    except:
        raise HTTPException(status_code=400, detail="Invalid session_id format")

    session = await sessions_collection.find_one({"_id": session_id, "user_id": current_user["user_id"]})
    if not session or not session.get("rti_document"):
        raise HTTPException(status_code=404, detail="RTI Document not found")

    from app.pdf.generator import generate_rti_pdf
    pdf_bytes = generate_rti_pdf(session["rti_document"])
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="RTI_Application_{session_id_str}.pdf"'
        }
    )
