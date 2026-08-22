import os
import glob
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings

def ingest_documents():
    # Setup paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    docs_dir = os.path.join(base_dir, 'documents')
    chroma_db_dir = os.path.join(os.path.dirname(os.path.dirname(base_dir)), 'chroma_db')
    
    # Initialize ChromaDB client
    os.makedirs(chroma_db_dir, exist_ok=True)
    client = chromadb.PersistentClient(path=chroma_db_dir)
    collection = client.get_or_create_collection(name='legal_knowledge_base')
    
    # Initialize SentenceTransformer
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    doc_paths = glob.glob(os.path.join(docs_dir, '*.md'))
    raw_sources_dir = os.path.join(base_dir, 'raw_sources')
    pdf_paths = glob.glob(os.path.join(raw_sources_dir, '*.pdf'))
    
    total_docs = 0
    total_chunks = 0
    
    # --- Helper to map filename to state/metadata ---
    def get_metadata_for_file(filename, ext):
        meta = {}
        fname_lower = filename.lower()
        if ext == '.pdf':
            meta["source_type"] = "verbatim_statute"
        else:
            meta["source_type"] = "general_explainer"
            
        if "up_rent" in fname_lower:
            meta["state"] = "Uttar Pradesh"
            meta["ambiguity"] = "Newer UP Regulation of Urban Premises Tenancy Ordinance/Act (2021) exists, but using 1972 Act as primary."
        elif "rajasthan" in fname_lower:
            meta["state"] = "Rajasthan"
        elif "karnataka" in fname_lower:
            meta["state"] = "Karnataka"
        elif "delhi" in fname_lower:
            meta["state"] = "Delhi"
        elif "tamil_nadu" in fname_lower:
            meta["state"] = "Tamil Nadu"
            meta["ambiguity"] = "1960 Act was repealed by TN Regulation of Rights and Responsibilities of Landlords and Tenants Act 2017, but old act governs legacy disputes."
        elif "maharashtra" in fname_lower:
            meta["state"] = "Maharashtra"
            
        return meta
        
    from app.knowledge_base.pdf_parser import parse_pdf_to_sections
    
    for pdf_path in pdf_paths:
        total_docs += 1
        filename = os.path.basename(pdf_path)
        base_meta = get_metadata_for_file(filename, '.pdf')
        base_meta["source_document"] = filename
        
        print(f"Parsing PDF: {filename}")
        sections = parse_pdf_to_sections(pdf_path)
        
        for idx, section in enumerate(sections):
            total_chunks += 1
            embedding = model.encode(section.text).tolist()
            
            metadata = base_meta.copy()
            metadata["section_title"] = f"Section {section.section_number}: {section.section_title}"
            metadata["chunk_index"] = idx
            
            collection.add(
                documents=[section.text],
                embeddings=[embedding],
                metadatas=[metadata],
                ids=[f"{filename}_{idx}"]
            )
            
    for doc_path in doc_paths:
        total_docs += 1
        filename = os.path.basename(doc_path)
        base_meta = get_metadata_for_file(filename, '.md')
        base_meta["source_document"] = filename
        print(f"Parsing MD: {filename}")
        
        with open(doc_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        lines = content.split('\n')
        
        current_section = None
        current_text = []
        chunks = []
        
        for line in lines:
            if line.startswith('### '):
                if current_section and current_text:
                    chunks.append({'title': current_section, 'text': '\n'.join(current_text).strip()})
                current_section = line.replace('### ', '').strip()
                current_text = [line]
            elif current_section:
                current_text.append(line)
                
        if current_section and current_text:
            chunks.append({'title': current_section, 'text': '\n'.join(current_text).strip()})
            
        for idx, chunk in enumerate(chunks):
            total_chunks += 1
            embedding = model.encode(chunk['text']).tolist()
            
            metadata = base_meta.copy()
            metadata["section_title"] = chunk['title']
            metadata["chunk_index"] = idx
            
            collection.add(
                documents=[chunk['text']],
                embeddings=[embedding],
                metadatas=[metadata],
                ids=[f"{filename}_{idx}"]
            )
            
    print(f"Processed {total_docs} documents.")
    print(f"Created and embedded {total_chunks} chunks.")

if __name__ == "__main__":
    ingest_documents()
