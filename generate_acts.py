import fitz  # PyMuPDF
import os

acts = {
    "up_rent_1972": [
        "1. Short title, extent and commencement.—(1) This Act may be called the U.P. Urban Buildings (Regulation of Letting, Rent and Eviction) Act, 1972.",
        "Section 2. Exemptions from operation of Act.—(1) Nothing in this Act shall apply to any building belonging to or vested in the State Government.",
        "3. Definitions.—In this Act, unless the context otherwise requires,—(a) 'tenant' in relation to a building, means the person by whom its rent is payable, and on the tenant's death, his heirs."
    ],
    "rajasthan_rent_2001": [
        "1. Short title, extent and commencement.—(1) This Act may be called the Rajasthan Rent Control Act, 2001.",
        "2. Definitions.—In this Act, unless the subject or context otherwise requires,—(a) 'amenities' includes supply of water and electricity.",
        "Section 3. Chapter not to apply to certain premises.—(1) Nothing contained in Chapters II and III of this Act shall apply to the new premises."
    ],
    "karnataka_rent_1999": [
        "1. Short title, extent and commencement.—(1) This Act may be called the Karnataka Rent Act, 1999.",
        "2. Application of the Act.—(1) Chapters I to III and V to VIII of this Act shall apply to areas specified in the First Schedule.",
        "3. Definitions.—In this Act, unless the context otherwise requires,—(a) 'Court' means the Court of Small Causes."
    ],
    "delhi_rent_1958": [
        "1. Short title, extent and commencement.—(1) This Act may be called the Delhi Rent Control Act, 1958.",
        "2. Definitions.—In this Act, unless the context otherwise requires,—(a) 'basic rent' means the basic rent payable.",
        "Section 3. Act not to apply to certain premises.—Nothing in this Act shall apply—(a) to any premises belonging to the Government."
    ],
    "tamil_nadu_rent_1960": [
        "1. Short title, extent and commencement.—(1) This Act may be called the Tamil Nadu Buildings (Lease and Rent Control) Act, 1960.",
        "2. Definitions.—In this Act, unless the context otherwise requires,—(1) 'building' means any building or hut or part of a building or hut.",
        "3. Notice of vacancy.—(1) Every landlord shall, within seven days after the building becomes vacant, give notice of the vacancy."
    ]
}

os.makedirs("backend/app/knowledge_base/raw_sources", exist_ok=True)

for filename, sections in acts.items():
    doc = fitz.open()
    page = doc.new_page()
    
    y = 50
    for section in sections:
        rect = fitz.Rect(50, y, 550, y + 80)
        page.insert_textbox(rect, section, fontsize=12)
        y += 100
        
    path = f"backend/app/knowledge_base/raw_sources/{filename}.pdf"
    doc.save(path)
    print(f"Generated {path}")
