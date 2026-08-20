"""
End-to-end verification of Step 4: Grounded Rights Navigator.

Tests:
  1. ChromaDB retrieval returns relevant chunks
  2. Gemini returns structured RightsResponse (explanation + citations + confidence)
  3. Citations are present with [Source: X] inline markers
  4. Disclaimer is present at the end of the explanation
  5. Confidence level is reported ('high', 'medium', or 'low')
"""
import asyncio
import json
import os
import sys
from dotenv import load_dotenv

# Load .env before any app imports
load_dotenv()

from app.agents.rights_navigator import generate_rights_explanation

# --- Test Cases ---
TEST_CASES = [
    {
        "name": "Tenant Deposit Dispute (high confidence expected)",
        "intake": {
            "category": "tenant_dispute",
            "location": "Mumbai, Maharashtra",
            "facts": "My landlord has not returned my security deposit of Rs. 50,000 even though I vacated the flat 3 months ago and handed over the keys. There is no damage to the property.",
            "desired_outcome": "Get my security deposit back",
            "specific_details": "Leave and License agreement, 11-month term, deposit was 2 months rent"
        }
    },
    {
        "name": "Municipal Garbage Issue (high confidence expected)",
        "intake": {
            "category": "municipal_civic",
            "location": "Pune, Maharashtra",
            "facts": "Garbage has not been collected in my ward for the past 3 weeks. I have filed complaints with the ward office but nothing has been done.",
            "desired_outcome": "Get regular garbage collection restored and know what action was taken on my complaint",
            "specific_details": "Ward office complaint ID: PUN-2024-1234"
        }
    },
    {
        "name": "Out-of-scope / Low Coverage (low confidence expected)",
        "intake": {
            "category": "tenant_dispute",
            "location": "Delhi, Delhi",
            "facts": "My neighbor is playing loud music every night after 11 PM. The police refuse to take action.",
            "desired_outcome": "Stop the noise pollution",
            "specific_details": "Noise continues past midnight daily"
        }
    },
]

def check_result(name: str, result: dict) -> list[str]:
    """Validate a single RightsResponse and return a list of issues found."""
    issues = []

    # 1. Check explanation exists and is non-empty
    explanation = result.get("explanation", "")
    if not explanation:
        issues.append("❌ Explanation is EMPTY")
    else:
        print(f"  ✅ Explanation present ({len(explanation)} chars)")

    # 2. Check inline citations [Source: X]
    import re
    source_refs = re.findall(r'\[Source:\s*(\d+)\]', explanation)
    confidence = result.get("confidence", "")

    if source_refs:
        print(f"  ✅ Inline citations found: {len(source_refs)} references → IDs: {list(set(source_refs))}")
    elif confidence == 'low':
        print(f"  ✅ No inline citations found, but confidence is low (expected)")
    else:
        issues.append("❌ No inline [Source: X] citations found in explanation text")

    # 3. Check citations array
    citations = result.get("citations", [])
    if citations:
        print(f"  ✅ Citations array has {len(citations)} entries")
        for cite in citations:
            has_required = all(k in cite for k in ("id", "document", "section", "text"))
            if not has_required:
                issues.append(f"  ❌ Citation {cite.get('id','?')} missing required fields")
            else:
                print(f"     📚 [{cite['id']}] {cite['document']} → {cite['section']}")
    elif confidence == 'low':
        print(f"  ✅ Citations array is EMPTY, but confidence is low (expected)")
    else:
        issues.append("❌ Citations array is EMPTY")

    # 4. Check disclaimer
    disclaimer_text = "not a substitute for a lawyer"
    if disclaimer_text.lower() in explanation.lower():
        print(f"  ✅ Disclaimer present")
    else:
        issues.append("❌ Required disclaimer NOT found in explanation")

    # 5. Check confidence
    confidence = result.get("confidence", "")
    if confidence in ("high", "medium", "low"):
        print(f"  ✅ Confidence level: {confidence}")
    else:
        issues.append(f"❌ Invalid confidence value: '{confidence}'")

    return issues


async def main():
    print("=" * 70)
    print("STEP 4 VERIFICATION: Grounded Rights Navigator")
    print("=" * 70)

    all_issues = []

    for i, tc in enumerate(TEST_CASES, 1):
        print(f"\n{'-' * 60}")
        print(f"Test {i}/{len(TEST_CASES)}: {tc['name']}")
        print(f"{'-' * 60}")

        try:
            result = await generate_rights_explanation(tc["intake"])
            issues = check_result(tc["name"], result)
            all_issues.extend(issues)

            # Print first 300 chars of explanation for inspection
            expl = result.get("explanation", "")
            print(f"\n  📝 Explanation preview:")
            preview = expl[:400].replace('\n', '\n     ')
            print(f"     {preview}...")

        except Exception as e:
            msg = f"❌ EXCEPTION in '{tc['name']}': {e}"
            print(f"  {msg}")
            all_issues.append(msg)

    # Summary
    print(f"\n{'=' * 70}")
    print("SUMMARY")
    print(f"{'=' * 70}")
    if not all_issues:
        print("✅ ALL CHECKS PASSED — Step 4 is fully functional!")
    else:
        print(f"⚠️  {len(all_issues)} issue(s) found:")
        for issue in all_issues:
            print(f"   {issue}")

    return len(all_issues) == 0


if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
