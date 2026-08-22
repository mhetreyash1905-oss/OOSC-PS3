import os
import sys
import argparse
import requests
from app.knowledge_base.pdf_parser import parse_pdf_to_sections

RAW_SOURCES_DIR = os.path.join(os.path.dirname(__file__), "raw_sources")

def download_pdf(url: str, filename: str) -> str:
    if not os.path.exists(RAW_SOURCES_DIR):
        os.makedirs(RAW_SOURCES_DIR)
        
    filepath = os.path.join(RAW_SOURCES_DIR, filename)
    print(f"Downloading {url} to {filepath}...")
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    response = requests.get(url, headers=headers, stream=True)
    response.raise_for_status()
    
    with open(filepath, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
            
    print("Download complete.")
    return filepath

def main():
    parser = argparse.ArgumentParser(description="Fetch and inspect legal PDFs.")
    parser.add_argument("url_or_path", help="URL to download or local path (if --local is used)")
    parser.add_argument("filename", nargs="?", help="Filename to save as (required if URL)")
    parser.add_argument("--local", action="store_true", help="Use local file instead of downloading")
    
    args = parser.parse_args()
    
    if args.local:
        pdf_path = args.url_or_path
        if not os.path.exists(pdf_path):
            print(f"Error: Local file not found at {pdf_path}")
            sys.exit(1)
    else:
        if not args.filename:
            print("Error: filename is required when downloading from a URL")
            sys.exit(1)
        pdf_path = download_pdf(args.url_or_path, args.filename)
        
    print(f"Inspecting PDF: {pdf_path}")
    sections = parse_pdf_to_sections(pdf_path)
    
    if not sections:
        print("\n" + "!" * 80)
        print("WARNING: Zero sections were found!")
        print("The section heading regex likely doesn't match this document's format.")
        print("You may need to manually tune the regex in pdf_parser.py for this document type.")
        print("!" * 80 + "\n")
        
        # Explicit check for text layer to help debugging
        import pymupdf
        doc = pymupdf.open(pdf_path)
        if len(doc) > 0:
            first_page_text = doc[0].get_text("text").strip()
            if not first_page_text:
                print("DEBUG: The first page returned empty text. This might be a SCANNED PDF without an OCR text layer!")
            else:
                print(f"DEBUG: The PDF has a text layer, but regex failed. First 200 chars:\n{first_page_text[:200]}")
        sys.exit(1)
        
    print(f"\nSuccessfully parsed {len(sections)} sections.\n")
    for s in sections:
        print(f"Section {s.section_number}: {s.section_title}")
        print(f"References: {s.references}")
        print(f"Text Preview: {s.text[:150].replace(chr(10), ' ')}...\n")

if __name__ == "__main__":
    main()
