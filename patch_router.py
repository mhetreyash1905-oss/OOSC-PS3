import re

with open('backend/app/platform/router.py', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '{"intake_history": 1, "status": 1, "created_at": 1, "intake": 1}',
    '{"intake_history": 1, "status": 1, "created_at": 1, "intake": 1, "custom_title": 1}'
)

old_title_logic = '''        # Build a short title from the first user message or intake category
        title = "New Chat"
        history = session.get("intake_history", [])
        for msg in history:
            if msg.get("role") == "user":
                title = msg["content"][:60]
                break'''
new_title_logic = '''        title = session.get("custom_title")
        if not title:
            title = "New Chat"
            history = session.get("intake_history", [])
            for msg in history:
                if msg.get("role") == "user":
                    title = msg["content"][:60]
                    break'''
content = content.replace(old_title_logic, new_title_logic)

content = content.replace(
    'if title != "New Chat":',
    'if title != "New Chat" or session.get("custom_title"):'
)

endpoints = '''
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
'''

content = content.replace(
    '@router.get("/sessions/{session_id_str}")',
    endpoints + '\n@router.get("/sessions/{session_id_str}")'
)

with open('backend/app/platform/router.py', 'w', encoding='utf-8') as f:
    f.write(content)
print('Patched backend router!')
