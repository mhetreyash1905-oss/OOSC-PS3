import os
import json
import logging
import asyncio
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from app.pio_directory import get_pio_details

logger = logging.getLogger(__name__)
client = genai.Client()

class RTIDraft(BaseModel):
    subject: str = Field(description="A formal subject line for the RTI application (e.g., Seeking Information regarding...)")
    information_requested: list[str] = Field(description="A list of 3-5 highly specific, numbered points requesting records, files, or statuses. Do not ask for opinions.")

async def draft_rti_application(intake_data: dict, recommendation: dict, user_email: str) -> dict:
    prompt = """You are an expert RTI drafter specializing in the Right to Information Act 2005. 
    Based on the user's facts and the recommended action, draft the specific information points to request under Section 6(1) of the RTI Act.
    Rules:
    1. Only ask for material records, certified copies, or file statuses. Do not ask 'why' questions or seek opinions.
    2. Be extremely specific based on the user's facts.
    3. Output JSON strictly matching the schema."""
    
    user_msg = f"Facts: {json.dumps(intake_data)}\nRecommended RTI Focus: {recommendation.get('rti_info_requested')}"
    
    try:
        response = await asyncio.to_thread(
            client.models.generate_content,
            model='gemini-2.5-flash',
            contents=[types.Content(role="user", parts=[types.Part.from_text(text=user_msg)])],
            config=types.GenerateContentConfig(
                system_instruction=prompt,
                response_mime_type="application/json",
                response_schema=RTIDraft,
                temperature=0.1
            )
        )
        draft_data = json.loads(response.text)
        
        # Get PIO details based on the category and location
        category = intake_data.get("category", "")
        location = intake_data.get("location", "Unknown Location")
        pio = get_pio_details(category, location)
        
        return {
            "pio_designation": pio["designation"],
            "pio_department": pio["department"],
            "pio_address": pio["address"],
            "applicant_name": "Concerned Citizen", # Placeholder, would come from user profile ideally
            "applicant_email": user_email,
            "subject": draft_data["subject"],
            "information_requested": draft_data["information_requested"]
        }
    except Exception as e:
        logger.error(f"Error in RTI Drafter API: {e}")
        raise e
