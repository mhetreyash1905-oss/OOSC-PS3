import os
import logging
import json
import asyncio
from typing import Dict, Any
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from app.knowledge_base.retriever import KnowledgeBaseRetriever
from app.config import GEMINI_API_KEY

logger = logging.getLogger(__name__)
client = genai.Client(api_key=GEMINI_API_KEY)
retriever = KnowledgeBaseRetriever()

class Citation(BaseModel):
    id: int = Field(description="The citation ID number (e.g., 1, 2) matching the chunk ID.")
    document: str = Field(description="The source document name.")
    section: str = Field(description="The section title.")
    text: str = Field(description="A short snippet of the exact text supporting the claim.")

class RightsResponse(BaseModel):
    explanation: str = Field(description="Plain language explanation of rights. MUST include inline citations like [Source: 1]. MUST end with the disclaimer.")
    citations: list[Citation] = Field(description="List of all citations used in the explanation.")
    confidence: str = Field(description="Confidence level: 'high', 'medium', or 'low' based on how well the chunks cover the user's situation.")

SYSTEM_PROMPT = """You are a legal rights explainer for the Civic Rights Navigator.
You MUST ONLY use the legal text chunks provided below to explain the user's rights.

RULES FOR GROUNDING:
1. For EVERY factual claim or right you explain, you MUST cite the source using the format [Source: X], where X is the ID of the provided chunk.
2. DO NOT use general legal knowledge outside of the provided chunks.
3. Pay attention to the metadata of the provided chunks:
   - If a chunk's `source_type` is `"verbatim_statute"`, it contains the exact text of the law. You should quote from it or treat it as legally binding statute.
   - If a chunk's `source_type` is `"general_explainer"`, it is a helpful summary or guide, but it is NOT the official law. Do not treat it as a verbatim statute.
4. If the provided chunks do not cover the user's specific situation, clearly state: "I don't have sufficient legal text in my knowledge base to address this specific point." and flag confidence as 'low'.
5. YOU ARE STRICTLY PROHIBITED FROM PREDICTING LEGAL OUTCOMES. If the user asks if they will win, you MUST explicitly state: "I cannot predict the outcome of any legal case or tell you if you will win. I can only explain your rights."
6. You MUST end your explanation with this exact disclaimer: "This explains general rights under relevant laws. It is not a substitute for a lawyer."

Provided Legal Chunks:
{chunks_text}
"""

async def generate_rights_explanation(intake_data: Dict[str, Any]) -> dict:
    query = f"{intake_data.get('category', '')} {intake_data.get('facts', '')} {intake_data.get('desired_outcome', '')}"
    
    # Retrieve top 5 chunks
    chunks = await retriever.retrieve(query, n_results=5)
    
    # Format chunks for prompt
    chunks_text = ""
    for i, chunk in enumerate(chunks, 1):
        source_type = chunk.metadata.get("source_type", "unknown")
        state = chunk.metadata.get("state", "Federal/General")
        ambiguity = chunk.metadata.get("ambiguity", "")
        ambiguity_str = f"\nAmbiguity Note: {ambiguity}" if ambiguity else ""
        
        chunks_text += f"\n--- Chunk ID: {i} ---\nDocument: {chunk.source_document}\nState: {state}\nSource Type: {source_type}{ambiguity_str}\nSection: {chunk.section_title}\nText: {chunk.text}\n"
    
    prompt = SYSTEM_PROMPT.format(chunks_text=chunks_text)
    user_message = f"Please explain my rights based on these facts:\nLocation: {intake_data.get('location')}\nFacts: {intake_data.get('facts')}\nGoal: {intake_data.get('desired_outcome')}"
    
    try:
        response = await asyncio.to_thread(
            client.models.generate_content,
            model='gemini-2.5-flash',
            contents=[types.Content(role="user", parts=[types.Part.from_text(text=user_message)])],
            config=types.GenerateContentConfig(
                system_instruction=prompt,
                response_mime_type="application/json",
                response_schema=RightsResponse,
                temperature=0.1,
            )
        )
        
        result = json.loads(response.text)
        
        # Inject the full text of the chunks into the citations for the frontend UI
        for citation in result.get('citations', []):
            chunk_idx = citation['id'] - 1
            if 0 <= chunk_idx < len(chunks):
                citation['full_chunk_text'] = chunks[chunk_idx].text
        
        return result
    except Exception as e:
        logger.error(f"Error in Rights Navigator API: {e}")
        raise e
