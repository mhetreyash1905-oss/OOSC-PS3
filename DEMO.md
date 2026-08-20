# Civic Rights Navigator: Hackathon Demo Guide

This document outlines two fully rehearsed "golden path" journeys you can use to demonstrate the platform live at the hackathon. 

> **Tip for Presenters:** The system uses the Google Gemini Free Tier. If you hit a `503 UNAVAILABLE` error during the live demo due to rate limits, simply dismiss the toast error on the UI and click the button again. The error handling is robust enough to retry!

---

## 🎭 Scenario 1: The Tenant Dispute (Rent Control)

**The Persona:** Rahul, a tenant in Mumbai whose landlord is unfairly withholding his security deposit and trying to evict him without notice.
**The Goal:** Show how the AI handles legal extraction, cites the Maharashtra Rent Control Act, and drafts a precise RTI to the Rent Controller's office.

### The Flow:
1. **Login:** Log in as `rahul@example.com` on `http://localhost:3000`.
2. **Step 1 (Intake & Triage):**
   * *User:* "My landlord is refusing to give back my security deposit of Rs 50,000."
   * *Agent:* "I'm sorry to hear that. Could you tell me which city and state you are located in?"
   * *User:* "I'm in Mumbai, Maharashtra."
   * *Agent:* "Thank you. Did your landlord give you any written notice before locking you out or refusing the deposit?"
   * *User:* "No, no notice at least. I just want my money back."
   * *(The agent will now automatically transition to Step 2).*
3. **Step 2 (Rights Explanation):** 
   * The UI will display a plain-English explanation.
   * **Highlight for judges:** Show how the explanation includes inline `[Source: X]` tags. Click "View Full Text" on the Citation Cards on the right to prove the AI is grounded in real sections of the *Maharashtra Rent Control Act, 1999*.
   * **Highlight for judges:** Point to the bottom disclaimer proving the AI refuses to give outcome predictions.
4. **Step 3 (Action Recommender):**
   * Click "View Recommended Action". 
   * The system will recommend filing an RTI to the Rent Controller to check if the landlord has legally registered the leave and license agreement (a requirement in Maharashtra).
5. **Step 4 (RTI Drafting):**
   * Click "Draft RTI Document".
   * Show the preview on the screen. The AI will have drafted 3 specific questions (e.g., *"Please provide a certified copy of the registered Leave and License agreement for..."*).
   * Click **Download PDF** and open the generated file for the judges.

---

## 🎭 Scenario 2: The Civic Service Failure (Municipal)

**The Persona:** Priya, a resident of Pune dealing with a severe public health hazard due to uncollected garbage.
**The Goal:** Demonstrate how the system easily handles a completely different category of law, routing the RTI to the correct municipal body.

### The Flow:
1. **Login:** Log in as `priya@example.com`.
2. **Step 1 (Intake & Triage):**
   * *User:* "The garbage outside my apartment hasn't been collected in 3 weeks and it's causing a huge health risk."
   * *Agent:* "I understand this is a serious health concern. Which city and state are you located in?"
   * *User:* "Pune, Maharashtra."
   * *Agent:* "Have you already filed a complaint with the local municipal corporation?"
   * *User:* "Yes, I filed one online two weeks ago but nobody came."
   * *(The agent completes intake).*
3. **Step 2 (Rights Explanation):**
   * The AI will cite the municipal grievance rules and the citizens' charter.
4. **Step 3 (Action Recommender):**
   * The system recommends an RTI to the Pune Municipal Corporation to demand the status of her specific online complaint.
5. **Step 4 (RTI Drafting):**
   * Click "Draft RTI Document".
   * The drafted RTI is automatically addressed to the **State Public Information Officer, Municipal Corporation / Civic Body, Zonal/Ward Office, Pune, Maharashtra**.
   * The clauses will specifically ask for the *"Action Taken Report (ATR)"* on her previously filed online complaint.
   * Click **Download PDF**.
