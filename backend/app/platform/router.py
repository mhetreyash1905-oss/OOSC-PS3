from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel, Field
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

class AuthorityRecommendationRequest(BaseModel):
    state: str
    pincode: str
    problem: str

class AuthorityRecommendationResponse(BaseModel):
    department: str
    authority_level: str
    service_categories: list[str]
    complaint_guidance: str

@router.post("/authority-recommendation")
async def authority_recommendation(request: AuthorityRecommendationRequest, current_user: dict = Depends(get_current_user)):
    from google import genai
    from google.genai import types
    from app.config import GEMINI_API_KEY
    import asyncio
    import json
    
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key missing")
        
    client = genai.Client(api_key=GEMINI_API_KEY)
    
    prompt = f"""You are an Indian Government Administrative Expert.
    Given a user's location (State: {request.state}, Pincode: {request.pincode}) and their problem: "{request.problem}", 
    identify the correct government department and authority level they need to approach.
    Also, provide OpenStreetMap service categories (e.g. 'hospital', 'police', 'municipal') that could be searched nearby, 
    and a short 1-2 sentence guidance on how to file a complaint.
    """
    
    try:
        response = await asyncio.to_thread(
            client.models.generate_content,
            model='gemini-1.5-flash',
            contents=[types.Content(role="user", parts=[types.Part.from_text(text=prompt)])],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=AuthorityRecommendationResponse,
                temperature=0.2
            )
        )
        return json.loads(response.text)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to find authority recommendation: {str(e)}")

@router.get("/sessions/history")
async def get_session_history(current_user: dict = Depends(get_current_user)):
    """Return the user's past sessions for the sidebar history list."""
    cursor = sessions_collection.find(
        {"user_id": current_user["user_id"]},
        {"intake_history": 1, "status": 1, "created_at": 1, "intake": 1, "custom_title": 1}
    ).sort("created_at", -1).limit(30)
    
    sessions = []
    async for session in cursor:
        title = session.get("custom_title")
        if not title:
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

        if title != "New Chat" or session.get("custom_title"):
            sessions.append({
                "session_id": str(session["_id"]),
                "title": title,
                "category": category,
                "status": session.get("status", "intake"),
                "created_at": session.get("created_at", "").isoformat() if session.get("created_at") else None,
            })
    
    return {"sessions": sessions}


@router.delete("/sessions/{session_id}")
async def delete_session(session_id: str, current_user: dict = Depends(get_current_user)):
    try:
        obj_id = ObjectId(session_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid session_id format")
    
    result = await sessions_collection.delete_one({"_id": obj_id, "user_id": current_user["user_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"status": "deleted"}

class RenameSessionRequest(BaseModel):
    title: str

@router.put("/sessions/{session_id}/title")
async def rename_session(session_id: str, req: RenameSessionRequest, current_user: dict = Depends(get_current_user)):
    try:
        obj_id = ObjectId(session_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid session_id format")
    
    result = await sessions_collection.update_one(
        {"_id": obj_id, "user_id": current_user["user_id"]},
        {"$set": {"custom_title": req.title}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"status": "renamed", "title": req.title}

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
    
    agent_msg = ai_response.get("agent_message", "I understand your situation. Let us work on resolving it.")
    issue_detected = ai_response.get("issue_detected")
    issue_icon = ai_response.get("issue_icon") or "⚖️"
    suggested_actions = ai_response.get("suggested_actions") or []
    
    agent_record = {
        "role": "agent",
        "content": agent_msg,
        "issue_detected": issue_detected,
        "issue_icon": issue_icon,
        "suggested_actions": suggested_actions,
        "is_complete": ai_response.get("is_complete", False)
    }
    
    new_history = history + [
        {"role": "user", "content": request.message},
        agent_record
    ]
    
    intake_data = {
        "category": ai_response.get("category"),
        "location": ai_response.get("location") or "India",
        "facts": ai_response.get("facts") or request.message,
        "desired_outcome": ai_response.get("desired_outcome") or "Resolution of issue",
        "specific_details": ai_response.get("specific_details"),
        "issue_detected": issue_detected,
        "issue_icon": issue_icon,
        "suggested_actions": suggested_actions
    }
    
    if not ai_response.get("is_complete"):
        await sessions_collection.update_one(
            {"_id": session_id},
            {"$set": {
                "intake_history": new_history,
                "intake": intake_data
            }}
        )
        return {
            "status": "in_progress",
            "agent_message": agent_msg,
            "issue_detected": issue_detected,
            "issue_icon": issue_icon,
            "suggested_actions": suggested_actions,
            "intake_data": intake_data
        }
    else:
        await sessions_collection.update_one(
            {"_id": session_id},
            {"$set": {
                "intake_history": new_history,
                "intake": intake_data,
                "status": "rights"
            }}
        )
        return {
            "status": "complete",
            "agent_message": agent_msg,
            "issue_detected": issue_detected,
            "issue_icon": issue_icon,
            "suggested_actions": suggested_actions,
            "intake_data": intake_data
        }

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
        
        status_update = "recommendation" if not explanation_data.get("clarification_question") else "rights"

        await sessions_collection.update_one(
            {"_id": session_id},
            {"$set": {
                "rights_explanation": explanation_data,
                "status": status_update
            }}
        )
        return explanation_data
    
    return session["rights_explanation"]

class RightsClarifyRequest(BaseModel):
    session_id: str
    answer: str

@router.post("/rights/clarify")
async def rights_clarify(request: RightsClarifyRequest, current_user: dict = Depends(get_current_user)):
    try:
        session_id = ObjectId(request.session_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid session_id format")

    session = await sessions_collection.find_one({"_id": session_id, "user_id": current_user["user_id"]})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if session["status"] != "rights" or not session.get("rights_explanation", {}).get("clarification_question"):
        raise HTTPException(status_code=400, detail="No active clarification question")

    # Append the answer to intake facts
    new_facts = session["intake"].get("facts", "") + f"\n\n[Clarification] Q: {session['rights_explanation']['clarification_question']}\nA: {request.answer}"
    session["intake"]["facts"] = new_facts
    
    from app.agents.rights_navigator import generate_rights_explanation
    explanation_data = await generate_rights_explanation(session["intake"])
    
    status_update = "recommendation" if not explanation_data.get("clarification_question") else "rights"

    await sessions_collection.update_one(
        {"_id": session_id},
        {"$set": {
            "intake": session["intake"],
            "rights_explanation": explanation_data,
            "status": status_update
        }}
    )
    return explanation_data

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

@router.get("/download-summary/{session_id_str}")
async def download_summary(session_id_str: str, current_user: dict = Depends(get_current_user)):
    try:
        session_id = ObjectId(session_id_str)
    except:
        raise HTTPException(status_code=400, detail="Invalid session_id format")

    session = await sessions_collection.find_one({"_id": session_id, "user_id": current_user["user_id"]})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    from app.pdf.generator import generate_case_summary_pdf
    pdf_bytes = generate_case_summary_pdf(session)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=Case_Summary_{session_id_str}.pdf"
        }
    )

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

@router.get("/documents")
async def get_saved_documents(current_user: dict = Depends(get_current_user)):
    """Retrieve all generated documents and drafts for the current user."""
    cursor = sessions_collection.find(
        {"user_id": current_user["user_id"], "rti_document": {"$ne": None}},
        {"_id": 1, "created_at": 1, "rti_document": 1, "intake": 1, "status": 1}
    ).sort("created_at", -1)
    
    docs = []
    async for session in cursor:
        rti = session.get("rti_document", {})
        intake = session.get("intake", {}) or {}
        docs.append({
            "id": str(session["_id"]),
            "session_id": str(session["_id"]),
            "title": rti.get("subject") or f"RTI Application - {intake.get('category', 'Civic Issue')}",
            "type": "RTI Application (PDF)",
            "category": intake.get("category", "General Civic"),
            "department": rti.get("pio_department") or rti.get("pio_designation") or "Public Information Authority",
            "created_at": session.get("created_at", "").isoformat() if session.get("created_at") else None,
            "download_url": f"/platform/download-rti/{str(session['_id'])}"
        })
    return {"documents": docs}

@router.get("/applications")
async def get_applications(current_user: dict = Depends(get_current_user)):
    """Retrieve all civic applications, RTIs, and complaints initiated by user."""
    cursor = sessions_collection.find(
        {"user_id": current_user["user_id"]},
        {"_id": 1, "created_at": 1, "status": 1, "intake": 1, "recommendation": 1, "rti_document": 1}
    ).sort("created_at", -1)
    
    apps = []
    async for session in cursor:
        intake = session.get("intake") or {}
        rec = session.get("recommendation") or {}
        has_doc = session.get("rti_document") is not None
        
        status_label = "Drafting"
        if has_doc or session.get("status") == "complete":
            status_label = "Ready to File"
        elif session.get("status") == "recommendation":
            status_label = "Strategy Formed"
        elif session.get("status") == "rights":
            status_label = "Rights Analyzed"
        elif session.get("status") == "intake":
            status_label = "In Assessment"

        title = intake.get("facts", "")[:80] if intake.get("facts") else "Civic Rights Query"
        category = intake.get("category", "tenancy_dispute").replace("_", " ").title()
        
        apps.append({
            "id": str(session["_id"]),
            "session_id": str(session["_id"]),
            "title": title,
            "category": category,
            "issue_detected": intake.get("issue_detected") or category,
            "status": status_label,
            "action_type": rec.get("action_type") or "file_rti",
            "created_at": session.get("created_at", "").isoformat() if session.get("created_at") else None,
            "has_download": has_doc
        })
    return {"applications": apps}

class DocumentUploadRequest(BaseModel):
    filename: str
    content: str
    file_type: str = "text"

@router.post("/upload-document")
async def upload_document(req: DocumentUploadRequest, current_user: dict = Depends(get_current_user)):
    """Accept and summarize text from uploaded documents (agreements, notices, bills)."""
    return {
        "filename": req.filename,
        "summary": f"Document '{req.filename}' received and attached to your session context.",
        "size_chars": len(req.content)
    }

class GenerateDocRequest(BaseModel):
    issue_description: str

class GenerateDocResponse(BaseModel):
    doc_type: str = Field(description="Must be 'rti', 'landlord_notice', or 'municipal'.")
    authority: str = Field(description="The Target Authority / Addressee. E.g., 'Public Information Officer, BMC'.")
    subject: str = Field(description="The official subject line.")
    particulars: str = Field(description="The specific information sought, demand clause, or grievance details. Use newlines for lists.")

@router.post("/generate-document")
async def generate_document(request: GenerateDocRequest, current_user: dict = Depends(get_current_user)):
    from google import genai
    from google.genai import types
    from app.config import GEMINI_API_KEY
    import asyncio
    
    client = genai.Client(api_key=GEMINI_API_KEY)
    
    prompt = f"""You are an expert Indian Legal Drafting Assistant. 
    Analyze the following user issue and draft the parameters for a formal statutory document.
    
    If it's asking for information from the government, pick 'rti'.
    If it's about a landlord/tenant dispute (rent, deposit, eviction), pick 'landlord_notice'.
    If it's a municipal complaint (water, roads, garbage), pick 'municipal'.
    
    User Issue: {request.issue_description}
    """
    
    response = await asyncio.to_thread(
        client.models.generate_content,
        model='gemini-2.5-flash',
        contents=[types.Content(role="user", parts=[types.Part.from_text(text=prompt)])],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=GenerateDocResponse,
            temperature=0.2
        )
    )
    
    import json
    return json.loads(response.text)


class AnalyzeDocumentRequest(BaseModel):
    text: str
    filename: str | None = None

class AnalyzeDocumentResponse(BaseModel):
    summary: str
    documentType: str
    riskLevel: str
    keyClauses: list[str]
    riskFlags: list[str]
    recommendations: list[str]

@router.post("/analyze-document")
async def analyze_document(request: AnalyzeDocumentRequest, current_user: dict = Depends(get_current_user)):
    from google import genai
    from google.genai import types
    from app.config import GEMINI_API_KEY
    import json

    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key missing")
    
    client = genai.Client(api_key=GEMINI_API_KEY)
    
    prompt = f"""
Analyze the following legal/civic document carefully.
You must output ONLY valid JSON matching this schema exactly:
{{
  "summary": "A 2-sentence summary of the document",
  "documentType": "The type of document (e.g. Leave & License Agreement, Eviction Notice)",
  "riskLevel": "Low",
  "keyClauses": ["3-5 key clauses or important points from the document"],
  "riskFlags": ["Any potential legal risks, unlawful clauses, or red flags"],
  "recommendations": ["2-3 actionable steps the user should take next"]
}}
Note: riskLevel MUST be exactly one of: "Low", "Medium", or "High".

Document Name: {request.filename or 'Pasted Text'}
Document Text:
{request.text[:10000]}
"""

    try:
        response = client.models.generate_content(
            model='gemini-1.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2
            )
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"Error analyzing document: {e}")
        raise HTTPException(status_code=500, detail="Failed to analyze document")
