import re

with open('backend/app/platform/router.py', 'r', encoding='utf-8') as f:
    content = f.read()

new_endpoint = '''
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
            model='gemini-2.5-flash',
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
'''

content = content + "\n" + new_endpoint

with open('backend/app/platform/router.py', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched backend with document analyzer endpoint")
