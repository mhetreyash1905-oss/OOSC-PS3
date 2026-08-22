import re
import pymupdf
from dataclasses import dataclass
from typing import List, Optional, Tuple

@dataclass
class ParsedSection:
    section_number: str
    section_title: str
    text: str
    references: List[str]
    page_number: Optional[int] = None

def extract_raw_text(pdf_path: str) -> str:
    """Extract raw text across all pages in a PDF."""
    doc = pymupdf.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text("text") + "\n"
    return text

def extract_text_with_page_map(pdf_path: str) -> List[Tuple[int, str]]:
    """Return a list of (page_number, text) pairs for the PDF."""
    doc = pymupdf.open(pdf_path)
    pages_text = []
    for page_num, page in enumerate(doc, start=1):
        pages_text.append((page_num, page.get_text("text")))
    return pages_text

def parse_sections(full_text: str) -> List[ParsedSection]:
    """Parse text into sections using legal heading regex and extract references."""
    # Split on lines starting with optional "Section ", numbers, optional letter, and a period
    heading_pattern = r'^(?:Section\s+)?(\d+[A-Z]?)\.\s+'
    parts = re.split(heading_pattern, full_text, flags=re.MULTILINE)
    
    sections = []
    # Cross-reference regex: e.g., "section 6(1)", "Section 7"
    ref_pattern = r'(?i)\bsection\s+(\d+[A-Z]?(?:\(\d+[a-z]?\))?)'
    
    for i in range(1, len(parts), 2):
        sec_num = parts[i]
        content = parts[i+1]
        
        # Heuristic for title: read until em-dash, en-dash, literal dash, or period/newline
        content_clean = content.strip().lstrip('%!').strip()
        title_match = re.match(r'^(.*?)(?:.—|—|-|\.\s|\n)', content_clean)
        title = title_match.group(1).strip() if title_match else ""
        
        text = content.strip()
        
        # Extract and deduplicate references
        refs = re.findall(ref_pattern, text)
        unique_refs = list(dict.fromkeys(refs))
        
        sections.append(ParsedSection(
            section_number=sec_num,
            section_title=title,
            text=text,
            references=unique_refs
        ))
        
    return sections

def parse_pdf_to_sections(pdf_path: str) -> List[ParsedSection]:
    """Extract text from a PDF and parse it into structured sections."""
    text = extract_raw_text(pdf_path)
    return parse_sections(text)

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python -m app.knowledge_base.pdf_parser <path_to_pdf>")
        sys.exit(1)
        
    pdf_path = sys.argv[1]
    sections = parse_pdf_to_sections(pdf_path)
    
    print(f"Total sections found: {len(sections)}\n")
    for s in sections[:5]:
        print(f"Section {s.section_number}: {s.section_title}")
        print(f"References: {s.references}")
        print(f"Text Preview: {s.text[:200].replace(chr(10), ' ')}...\n")
