"""
Diagnostics script — run from backend/ directory:
  .venv/Scripts/python test_diagnostics.py
"""
import asyncio
import sys

def test_rag():
    print("\n=== RAG Retrieval Test ===")
    try:
        from app.knowledge_base.retriever import KnowledgeBaseRetriever
        r = KnowledgeBaseRetriever()
        
        async def _run():
            chunks = await r.retrieve("tenant eviction without notice mumbai", n_results=3)
            return chunks
        
        chunks = asyncio.run(_run())
        print(f"OK — {len(chunks)} chunks returned")
        for c in chunks:
            st = c.metadata.get("source_type", "?")
            print(f"  [{st}] {c.source_document} | {c.section_title[:55]}")
        return True
    except Exception as e:
        print(f"FAIL — {e}")
        return False

def test_gemini():
    print("\n=== Gemini API Test ===")
    try:
        from app.config import GEMINI_API_KEY
        from google import genai
        client = genai.Client(api_key=GEMINI_API_KEY)
        r = client.models.generate_content(
            model="gemini-3.6-flash",
            contents="Reply with exactly: GEMINI_OK"
        )
        print(f"OK — response: {r.text.strip()}")
        return True
    except Exception as e:
        print(f"FAIL — {e}")
        return False

def test_intake_agent():
    print("\n=== Intake Agent End-to-End Test ===")
    try:
        from app.agents.intake import process_intake_message
        result = asyncio.run(process_intake_message(
            chat_history=[],
            new_message="I was evicted by my landlord without notice in Mumbai. I had no rents due."
        ))
        print(f"OK — is_complete={result.get('is_complete')}, category={result.get('category')}")
        if not result.get("is_complete"):
            print(f"  Follow-up question: {result.get('agent_message')}")
        return True
    except Exception as e:
        print(f"FAIL — {e}")
        return False

def test_network():
    print("\n=== Network Connectivity Test ===")
    try:
        import socket
        socket.setdefaulttimeout(5)
        socket.getaddrinfo("generativelanguage.googleapis.com", 443)
        print("OK — can resolve generativelanguage.googleapis.com")
        return True
    except Exception as e:
        print(f"FAIL — DNS/network issue: {e}")
        print("  -> The backend MUST have internet access to reach the Gemini API.")
        print("  -> Try: ping generativelanguage.googleapis.com")
        return False

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()

    results = {
        "network":  test_network(),
        "rag":      test_rag(),
        "gemini":   test_gemini(),
        "intake":   test_intake_agent(),
    }

    print("\n=== Summary ===")
    for name, ok in results.items():
        status = "PASS" if ok else "FAIL"
        print(f"  {status}  {name}")

    sys.exit(0 if all(results.values()) else 1)
