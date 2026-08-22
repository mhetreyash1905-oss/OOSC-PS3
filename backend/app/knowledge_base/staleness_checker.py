import os
import sys
import logging
import asyncio
from typing import List, Dict
import datetime

# Add the project root to sys.path so we can import app modules
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from google import genai
from google.genai import types
from app.config import GEMINI_API_KEY

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = genai.Client(api_key=GEMINI_API_KEY)

# A sample list of tracked acts and the date they were last ingested/verified
TRACKED_ACTS = [
    {"name": "Consumer Protection Act, 2019", "last_ingested": "2024-01-01"},
    {"name": "Right to Information Act, 2005", "last_ingested": "2024-01-01"},
    {"name": "Digital Personal Data Protection Act, 2023", "last_ingested": "2024-01-01"},
    {"name": "Right to Education Act, 2009", "last_ingested": "2024-01-01"},
    {"name": "Maharashtra Rent Control Act, 1999", "last_ingested": "2024-01-01"},
]

async def check_act_staleness(act_name: str, last_ingested_date: str) -> Dict[str, str]:
    """
    Uses Gemini with Google Search to check if an Act has been amended or repealed since the last ingested date.
    """
    logger.info(f"Checking staleness for: {act_name} (Last ingested: {last_ingested_date})")
    
    prompt = f"""
    You are an automated legal knowledge base maintainer.
    Your task is to determine if the Indian law "{act_name}" has had any new major amendments, notifications, rules, or has been repealed since {last_ingested_date}.
    
    Use Google Search to find recent news articles, PRS Legislative Research updates, or government gazette notifications regarding this act after {last_ingested_date}.
    
    Respond in a short, structured summary:
    STATUS: [STABLE or POTENTIALLY_STALE]
    DETAILS: [Brief explanation of what changed, or "No major amendments found."]
    """
    
    try:
        response = await asyncio.to_thread(
            client.models.generate_content,
            model='gemini-3.6-flash',
            contents=[types.Content(role="user", parts=[types.Part.from_text(text=prompt)])],
            config=types.GenerateContentConfig(
                tools=[{"googleSearch": {}}],
                temperature=0.1
            )
        )
        return {
            "act": act_name,
            "status": "success",
            "result": response.text
        }
    except Exception as e:
        logger.error(f"Failed to check staleness for {act_name}: {e}")
        return {
            "act": act_name,
            "status": "error",
            "result": str(e)
        }

async def run_staleness_checks():
    logger.info("Starting lightweight staleness checks via Gemini Search...")
    results = []
    for act in TRACKED_ACTS:
        res = await check_act_staleness(act["name"], act["last_ingested"])
        results.append(res)
        print(f"\n--- {act['name']} ---")
        print(res["result"])
    
    logger.info("Staleness check complete.")
    return results

if __name__ == "__main__":
    asyncio.run(run_staleness_checks())
