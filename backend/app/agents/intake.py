import os
import logging
import json
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
    agent_message: Optional[str] = Field(description="The next clarifying question or empathetic response to the user. Provide this if is_complete is False.")
    category: Optional[str] = Field(description="Must be 'tenant_dispute', 'municipal_civic', or 'out_of_scope'. Required if is_complete is True.")
    location: Optional[str] = Field(description="City and State in India. Required if is_complete is True.")
    facts: Optional[str] = Field(description="Clear summary of what happened. Required if is_complete is True.")
    desired_outcome: Optional[str] = Field(description="What the user wants to achieve. Required if is_complete is True.")
    specific_details: Optional[str] = Field(description="Any extra category-specific details (e.g., lease duration, specific failing service).")

SYSTEM_PROMPT = """You are a legal triage agent for the Civic Rights Navigator.
Your goal is to understand the user's problem and classify it into either 'tenant_dispute' or 'municipal_civic'.
If it doesn't fit those, classify as 'out_of_scope'.

You need to collect:
1. The core facts of what happened.
2. The location (City and State in India).
3. The user's desired outcome.
4. Any specific details (e.g., notice period given, type of civic issue).

Rules:
- Be empathetic, brief, and professional.
- Ask ONE question at a time.
- Do not give legal advice here. Just collect information.
- Once you have all the information, set is_complete=True and fill out the category, location, facts, and desired_outcome fields.
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
        response = client.models.generate_content(
            model='gemini-3.6-flash',
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
        raise e
