import os
import logging
import json
import asyncio
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import Optional, List

logger = logging.getLogger(__name__)

from app.config import GEMINI_API_KEY
# Initialize the client.
client = genai.Client(api_key=GEMINI_API_KEY)

class IntakeResponse(BaseModel):
    is_complete: bool = Field(description="True if you have gathered enough information to classify the issue and extract all required fields. False if you still need to ask a clarifying question.")
    agent_message: Optional[str] = Field(description="Empathetic response or clarifying question to the user in a natural, supportive tone.")
    issue_detected: Optional[str] = Field(description="The detected civic or legal issue title, e.g. 'Tenant–Landlord Dispute', 'Municipal Civic Service Issue', 'RTI & Public Information Request', 'Property & Rent Dispute', or 'General Civic Issue'.")
    issue_icon: Optional[str] = Field(description="An appropriate single emoji icon representing the issue, e.g. '🏠' for tenancy, '🏛️' for municipal, '📜' for RTI, '⚖️' for legal.")
    suggested_actions: Optional[List[str]] = Field(description="A concise list of 3-5 immediate practical steps the user should consider (e.g. 'Check your rental agreement', 'Send a written demand', 'Preserve payment records', 'Approach the appropriate grievance/legal forum if unresolved').")
    category: Optional[str] = Field(description="Must be 'tenant_dispute', 'municipal_civic', or 'out_of_scope'.")
    location: Optional[str] = Field(description="City and State in India if identified or inferred.")
    facts: Optional[str] = Field(description="Clear summary of the user's issue facts.")
    desired_outcome: Optional[str] = Field(description="What the user wants to achieve.")
    specific_details: Optional[str] = Field(description="Any extra category-specific details (e.g., lease duration, deposit amount, specific failing municipal service).")

SYSTEM_PROMPT = """You are CivicSaathi (Civic Rights Navigator), an intelligent AI Civic and Legal Assistant designed to assist Indian citizens with tenancy problems, municipal issues, and RTI (Right to Information) processes.

You can comprehend user inputs in English, Hindi, and Hinglish (e.g., "Mere landlord ne security deposit wapas nahi kiya", "Pani ki problem hai colony me", "Landlord is evicting without notice").

For EVERY user query:
1. Always identify the detected issue and provide:
   - `issue_detected`: e.g., "Tenant–Landlord Dispute", "Municipal Civic Service Issue", "RTI & Public Records Request".
   - `issue_icon`: e.g., "🏠" for tenancy/landlord issues, "🏛️" for municipal/civic issues, "📜" for RTI.
   - `suggested_actions`: 3 to 4 actionable, practical steps under "You may want to:" (e.g., "Check your rental agreement", "Send a written demand notice", "Preserve payment records & receipts", "Approach the appropriate grievance/legal forum if unresolved").
   - `agent_message`: An empathetic, clear response acknowledging their exact situation (e.g. "I understand your situation. Security deposit withholding by landlords without valid justification is a common issue under tenancy frameworks.").

2. Classify into:
   - `category`: 'tenant_dispute' (rent, eviction, security deposit, repairs, tenancy), 'municipal_civic' (water, roads, garbage, sanitation, municipal inaction, RTI for civic records), or 'out_of_scope' (criminal, matrimonial, etc.).

3. If the user provided enough detail about what occurred (e.g., landlord refused to return deposit, or municipal authority not repairing water pipeline):
   - Set `is_complete` = True so the user can immediately click "Create Action Plan" to view grounded legal rights, statutory provisions, and draft an official notice/RTI.
   - If critical information is missing, you can set `is_complete` = False and ask a helpful clarifying question (e.g., "Which city/state are you located in?" or "Do you have a written rental agreement?").

Always maintain an empathetic, reassuring, and professional tone.
"""

async def process_intake_message(chat_history: List[dict], new_message: str) -> dict:
    """
    Takes the chat history and the new user message, sends it to Gemini, 
    and returns the structured IntakeResponse as a dictionary.
    """
    contents = []
    
    # Format history for the Gemini API
    for msg in chat_history:
        role = "user" if msg["role"] == "user" else "model"
        contents.append(types.Content(role=role, parts=[types.Part.from_text(text=msg["content"])]))
    
    # Append the latest message
    contents.append(types.Content(role="user", parts=[types.Part.from_text(text=new_message)]))

    try:
        response = await asyncio.to_thread(
            client.models.generate_content,
            model='gemini-2.5-flash',
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                response_mime_type="application/json",
                response_schema=IntakeResponse,
                temperature=0.2,
            )
        )
        
        result = json.loads(response.text)
        return result
    except Exception as e:
        logger.error(f"Error in Gemini Intake API: {e}")
        # Fallback response if API fails or rate limits
        return {
            "is_complete": True,
            "agent_message": "I understand your situation. Let me help you navigate your civic and legal options.",
            "issue_detected": "Civic / Tenancy Issue",
            "issue_icon": "🏠",
            "suggested_actions": [
                "Review relevant documents and agreements",
                "Send a formal written communication",
                "Preserve all transaction and communication records",
                "Proceed with an Action Plan for legal rights analysis"
            ],
            "category": "tenant_dispute" if ("landlord" in new_message.lower() or "rent" in new_message.lower() or "deposit" in new_message.lower()) else "municipal_civic",
            "location": "India",
            "facts": new_message,
            "desired_outcome": "Resolution and recovery/redressal"
        }
