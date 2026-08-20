import os
import json
import logging
from google import genai
from google.genai import types
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)
client = genai.Client()

class ActionRecommendation(BaseModel):
    action_type: str = Field(description="Must be 'file_rti' or 'other'. Always prefer 'file_rti' if the user needs information from a government/public authority.")
    recommendation_text: str = Field(description="A clear, plain-language explanation of what the user should do next.")
    rti_info_requested: str | None = Field(description="If action_type is 'file_rti', summarize exactly what information they should ask for in the RTI application.")

async def generate_recommendation(intake_data: dict, rights_data: dict) -> dict:
    prompt = """You are an action recommender for the Civic Rights Navigator. 
    Based on the user's facts and the explained rights, determine the best next step.
    If the issue involves a public authority (municipal body, rent controller, government), recommend filing an RTI application to obtain records or status updates.
    Output JSON strictly matching the schema."""
    
    user_msg = f"Facts: {json.dumps(intake_data)}\nRights Explained: {rights_data.get('explanation')}"
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash-lite',
            contents=[types.Content(role="user", parts=[types.Part.from_text(text=user_msg)])],
            config=types.GenerateContentConfig(
                system_instruction=prompt,
                response_mime_type="application/json",
                response_schema=ActionRecommendation,
                temperature=0.1
            )
        )
        return json.loads(response.text)
    except Exception as e:
        logger.error(f"Error in Action Recommender API: {e}")
        raise e
