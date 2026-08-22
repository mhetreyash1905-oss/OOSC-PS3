import re
from dataclasses import dataclass
from typing import List, Optional

@dataclass
class ParsedSection:
    section_number: str
    section_title: str
    text: str
    references: List[str]
    page_number: Optional[int] = None

def parse_sections(full_text: str) -> List[ParsedSection]:
    # Regex to split on "1.", "12A.", "Section 8.", etc. at the start of a line.
    # We use a capture group to keep the section number, which makes re.split return it in the list.
    # Pattern: start of line, optional "Section ", digits, optional letter, literal dot, optional spaces.
    heading_pattern = r'^(?:Section\s+)?(\d+[A-Z]?)\.\s+'
    
    # Split text. Parts will be: [preamble, sec_num1, text1, sec_num2, text2, ...]
    parts = re.split(heading_pattern, full_text, flags=re.MULTILINE)
    
    sections = []
    
    # Reference regex: "Section 7", "section 6(1)", "sections 8 and 9"
    # Keeping it simple for the primary reference
    ref_pattern = r'(?i)\bsection\s+(\d+[A-Z]?(?:\(\d+[a-z]?\))?)'
    
    # Iterate over the split parts. The first element is everything before the first section.
    # Then it alternates: section_number, section_content.
    for i in range(1, len(parts), 2):
        sec_num = parts[i]
        content = parts[i+1]
        
        # Extract title from content (usually the first sentence or up to a dash/newline)
        # Indian Acts often use "Title.—Text" or just newline.
        title_match = re.match(r'^(.*?)(?:.—|—|\.\s|\n)', content)
        title = title_match.group(1).strip() if title_match else ""
        
        text = content.strip()
        
        # Find references
        refs = re.findall(ref_pattern, text)
        # Deduplicate while preserving order
        unique_refs = list(dict.fromkeys(refs))
        
        sections.append(ParsedSection(
            section_number=sec_num,
            section_title=title,
            text=text,
            references=unique_refs
        ))
        
    return sections

if __name__ == "__main__":
    synthetic_text = """
PREAMBLE
This is a synthetic legal document.

1. Short title and commencement.—(1) This Act may be called the Synthetic Act.
(2) It shall come into force on such date as notified.

Section 2. Definitions.—In this Act, unless the context otherwise requires,—
(a) "information" means any material in any form.

3. Right to information.—Subject to the provisions of this Act, all citizens shall have the right to information.
This applies under section 2(a) and also references Section 8.

8. Exemption from disclosure.—(1) Notwithstanding anything contained in this Act, there shall be no obligation to give any citizen information under section 3 if it harms state security.
(2) Subject to section 8(1), this is absolute.
"""
    
    sections = parse_sections(synthetic_text)
    for s in sections:
        print(f"Section: {s.section_number}")
        print(f"Title: {s.section_title}")
        print(f"References: {s.references}")
        print(f"Text Preview: {s.text[:50]}...\n")
