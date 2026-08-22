import io
import textwrap
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

def generate_rti_pdf(rti_data: dict) -> bytes:
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    
    # Margin settings
    left_margin = 50
    current_y = height - 50
    
    # Title
    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(width / 2.0, current_y, "Application under Section 6(1) of the Right to Information Act, 2005")
    
    current_y -= 40
    c.setFont("Helvetica", 11)
    
    # To Block
    c.drawString(left_margin, current_y, "To,")
    current_y -= 15
    c.drawString(left_margin, current_y, rti_data.get("pio_designation", "Public Information Officer"))
    current_y -= 15
    c.drawString(left_margin, current_y, rti_data.get("pio_department", ""))
    current_y -= 15
    c.drawString(left_margin, current_y, rti_data.get("pio_address", ""))
    
    current_y -= 40
    # Applicant Block
    c.drawString(left_margin, current_y, f"1. Name of Applicant: {rti_data.get('applicant_name', 'Citizen')}")
    current_y -= 20
    c.drawString(left_margin, current_y, f"2. Contact Email: {rti_data.get('applicant_email', '')}")
    
    current_y -= 40
    # Subject
    c.setFont("Helvetica-Bold", 11)
    subject_lines = textwrap.wrap(f"Subject: {rti_data.get('subject', 'RTI Application')}", width=80)
    for line in subject_lines:
        c.drawString(left_margin, current_y, line)
        current_y -= 15
        
    current_y -= 20
    c.setFont("Helvetica", 11)
    c.drawString(left_margin, current_y, "Please provide the following information / certified copies under the RTI Act, 2005:")
    
    current_y -= 30
    
    # Information Requested Points
    for idx, point in enumerate(rti_data.get("information_requested", []), 1):
        # Wrap long strings so they fit on the page
        wrapped_text = textwrap.wrap(f"{idx}. {point}", width=90)
        for line in wrapped_text:
            if current_y < 100:
                c.showPage()
                current_y = height - 50
                c.setFont("Helvetica", 11)
            
            c.drawString(left_margin + 10, current_y, line)
            current_y -= 15
        current_y -= 10 # Extra spacing between points
        
    if current_y < 150:
        c.showPage()
        current_y = height - 50
        c.setFont("Helvetica", 11)
        
    current_y -= 30
    c.drawString(left_margin, current_y, "Fee Details: Paid Rs. 10/- via Court Fee Stamp / IPO / Online.")
    current_y -= 20
    c.drawString(left_margin, current_y, "Declaration: I declare that I am a citizen of India.")
    
    current_y -= 50
    c.drawString(left_margin, current_y, "Signature: ___________________")
    current_y -= 20
    c.drawString(left_margin, current_y, "Date: ___________________")
    
    c.save()
    buffer.seek(0)
    return buffer.getvalue()

def generate_case_summary_pdf(session: dict) -> bytes:
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    left_margin = 50
    current_y = height - 50

    def draw_text(text, font="Helvetica", size=11, wrap_width=90, spacing=15):
        nonlocal current_y
        c.setFont(font, size)
        # Handle newlines natively
        paragraphs = str(text).split('\n')
        for para in paragraphs:
            if not para.strip():
                current_y -= spacing
                continue
            lines = textwrap.wrap(para, width=wrap_width)
            for line in lines:
                if current_y < 50:
                    c.showPage()
                    current_y = height - 50
                    c.setFont(font, size)
                c.drawString(left_margin, current_y, line)
                current_y -= spacing
            current_y -= 5

    # Title
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(width / 2.0, current_y, "CivicSaathi Case Summary")
    current_y -= 40

    # Basic Info
    intake = session.get("intake", {})
    draw_text("1. Case Overview", font="Helvetica-Bold", size=13)
    draw_text(f"Category: {intake.get('category', 'N/A').replace('_', ' ').title()}")
    draw_text(f"Location: {intake.get('location', 'N/A')}")
    current_y -= 10
    draw_text("Facts of the Case:", font="Helvetica-Bold", size=12)
    draw_text(intake.get('facts', 'No facts provided.'))
    current_y -= 10
    draw_text("Desired Outcome:", font="Helvetica-Bold", size=12)
    draw_text(intake.get('desired_outcome', 'None'))
    
    current_y -= 20
    
    # Rights Explanation
    rights = session.get("rights_explanation", {})
    if rights:
        draw_text("2. Legal Rights Analysis", font="Helvetica-Bold", size=13)
        draw_text(f"Confidence Level: {rights.get('confidence', 'Unknown').upper()}")
        if rights.get('contradiction_warning'):
            draw_text(f"WARNING: {rights['contradiction_warning']}", font="Helvetica-Bold", size=11)
        
        explanation = rights.get('explanation')
        if explanation:
            draw_text(explanation)
        
        current_y -= 10
        citations = rights.get('citations', [])
        if citations:
            draw_text("Citations:", font="Helvetica-Bold", size=12)
            for cite in citations:
                draw_text(f"- [{cite.get('document', '')}] Sec {cite.get('section', '')}: {cite.get('text', '')}")
            
    current_y -= 20
    
    # Recommendations
    rec = session.get("recommendation", {})
    if rec:
        draw_text("3. Recommended Actions", font="Helvetica-Bold", size=13)
        draw_text(f"Primary Strategy: {rec.get('primary_strategy', '')}")
        draw_text(f"Cost Estimate: {rec.get('cost_estimate', '')}")
        draw_text(f"Time Estimate: {rec.get('time_estimate', '')}")
        current_y -= 10
        
        action_steps = rec.get('action_steps', [])
        if action_steps:
            draw_text("Action Steps:", font="Helvetica-Bold", size=12)
            for step in action_steps:
                draw_text(f"- {step.get('title', '')}: {step.get('description', '')}")

    c.save()
    buffer.seek(0)
    return buffer.getvalue()
