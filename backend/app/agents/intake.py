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
client = genai.Client(api_key=GEMINI_API_KEY)

class IntakeResponse(BaseModel):
    is_complete: bool = Field(description="True if you have gathered enough information to classify the issue and extract all required fields. False if you still need to ask a clarifying question.")
    agent_message: Optional[str] = Field(description="Empathetic response or clarifying question to the user in a natural, supportive tone.")
    issue_detected: Optional[str] = Field(description="The detected issue title, e.g. 'Consumer & E-Commerce Dispute', 'Tenant–Landlord Dispute', 'Municipal Civic Service Issue', 'RTI & Public Records Request'.")
    issue_icon: Optional[str] = Field(description="An appropriate single emoji icon representing the issue, e.g. '🛍️' for consumer/e-commerce, '🏠' for tenancy, '🏛️' for municipal, '📜' for RTI, '⚖️' for legal.")
    suggested_actions: Optional[List[str]] = Field(description="A concise list of 3-5 immediate practical steps the user should consider.")
    category: Optional[str] = Field(description="Must be 'consumer_dispute', 'tenant_dispute', 'municipal_civic', 'rti_request', 'labour_dispute', 'disability_rights', or 'out_of_scope'.")
    location: Optional[str] = Field(description="City and State in India if identified or inferred.")
    facts: Optional[str] = Field(description="Clear summary of the user's issue facts.")
    desired_outcome: Optional[str] = Field(description="What the user wants to achieve.")
    specific_details: Optional[str] = Field(description="Any extra category-specific details.")

SYSTEM_PROMPT = """You are CivicSaathi (Civic Rights Navigator), an intelligent AI Civic and Legal Assistant designed to assist Indian citizens with tenancy problems, municipal issues, RTI requests, consumer disputes (Flipkart/Amazon e-commerce refunds, defective products under Consumer Protection Act 2019), and civic rights.

You can comprehend user inputs in English, Hindi, and Hinglish (e.g., "maine flipkart se 15000 ka laptop mangaya and wo broken tha, refund initiate nhi ho raha", "Mere landlord ne security deposit wapas nahi kiya", "Pani ki problem hai colony me").

For EVERY user query:
1. Identify the detected issue accurately:
   - Consumer / E-Commerce (Flipkart, Amazon, defective goods, refund refusal): issue_detected = "Consumer & E-Commerce Dispute (Defective Product / Refund Refusal)", issue_icon = "🛍️", category = "consumer_dispute".
   - Tenancy / Landlord (deposit withholding, eviction notice): issue_detected = "Tenant–Landlord Dispute", issue_icon = "🏠", category = "tenant_dispute".
   - Municipal / Civic (water contamination, road repair, streetlights): issue_detected = "Municipal Civic Service Issue", issue_icon = "🏛️", category = "municipal_civic".
   - RTI (government records, tenders): issue_detected = "RTI & Public Records Request", issue_icon = "📜", category = "rti_request".

2. Provide 3 to 4 actionable, practical steps under suggested_actions:
   - For Consumer / E-Commerce:
     1. "Preserve order invoice, delivery receipts, and photos/videos of defective product"
     2. "Lodge a formal complaint with Flipkart / Seller Grievance Officer"
     3. "File an online grievance on National Consumer Helpline (consumerhelpline.gov.in / Call 1915)"
     4. "Draft a legal notice under Consumer Protection Act 2019 for refund & compensation"

3. Provide an empathetic agent_message addressing their exact situation directly.
4. Set is_complete = True if the user stated what happened.
"""

async def process_intake_message(chat_history: List[dict], new_message: str) -> dict:
    """
    Takes the chat history and the new user message, sends it to Gemini, 
    and returns the structured IntakeResponse as a dictionary.
    """
    contents = []
    
    for msg in chat_history:
        role = "user" if msg["role"] == "user" else "model"
        contents.append(types.Content(role=role, parts=[types.Part.from_text(text=msg["content"])]))
    
    contents.append(types.Content(role="user", parts=[types.Part.from_text(text=new_message)]))

    try:
        response = await asyncio.to_thread(
            client.models.generate_content,
            model='gemini-3.6-flash',
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                response_mime_type="application/json",
                response_schema=IntakeResponse,
                temperature=0.1,
            )
        )
        
        result = json.loads(response.text)
        return result
    except Exception as e:
        logger.error(f"Error in Gemini Intake API: {e}")
        msg_lower = new_message.lower()

        if any(k in msg_lower for k in ["flipkart", "amazon", "laptop", "refund", "broken", "defective", "product", "delivery", "order", "seller", "consumer"]):
            issue_title = "Consumer & E-Commerce Dispute (Defective Product / Refund Refusal)"
            issue_icon = "🛍️"
            cat = "consumer_dispute"
            actions = [
                "Preserve order invoice, delivery receipts, and unboxing photos/videos",
                "Lodge a formal complaint with E-Commerce Grievance Officer",
                "File an online grievance on National Consumer Helpline (consumerhelpline.gov.in / Call 1915)",
                "Draft a legal notice under Consumer Protection Act 2019 for refund & compensation"
            ]
            msg = "I understand your situation. Under the Consumer Protection Act 2019 and E-Commerce Rules 2020, sellers and platforms are legally required to refund or replace defective products."
        elif any(k in msg_lower for k in ["landlord", "rent", "deposit", "evict", "flat", "tenant", "agreement"]):
            issue_title = "Tenant–Landlord Dispute"
            issue_icon = "🏠"
            cat = "tenant_dispute"
            actions = [
                "Review your rental agreement notice and deposit refund clauses",
                "Send a formal written demand notice specifying a 15-day refund deadline",
                "Preserve payment receipts, UPI statements, and key handover proofs",
                "Approach the local Rent Controller or Small Causes Court if unresolved"
            ]
            msg = "I understand your situation. Security deposit withholding by landlords without valid justification is covered under tenancy legal frameworks."
        elif any(k in msg_lower for k in ["water", "road", "drain", "garbage", "pipe", "street", "municipal", "bmc", "bbmp", "mcd"]):
            issue_title = "Municipal & Civic Service Issue"
            issue_icon = "🏛️"
            cat = "municipal_civic"
            actions = [
                "Lodge a complaint on municipal portal (CPGRAMS / local ward office)",
                "Capture geotagged photos of road/water hazard",
                "Draft a Section 6(1) RTI to inspect contractor work order and tender budget",
                "Escalate to Assistant Municipal Commissioner"
            ]
            msg = "I understand your concern regarding municipal service failures. Civic bodies have a statutory obligation to maintain public infrastructure."
        else:
            issue_title = "Civic & Consumer Rights Inquiry"
            issue_icon = "⚖️"
            cat = "general_civic"
            actions = [
                "Review relevant documents and transaction receipts",
                "Send a formal written notice or complaint to the concerned authority",
                "Preserve all transaction and communication records",
                "Proceed with Action Plan for legal rights analysis"
            ]
            msg = "I understand your situation. Let me help you navigate your civic and legal options under relevant Indian statutes."

        return {
            "is_complete": True,
            "agent_message": msg,
            "issue_detected": issue_title,
            "issue_icon": issue_icon,
            "suggested_actions": actions,
            "category": cat,
            "location": "India",
            "facts": new_message,
            "desired_outcome": "Refund, repair, or statutory redressal"
        }
