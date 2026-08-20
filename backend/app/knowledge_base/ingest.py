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
    total_docs = 0
    total_chunks = 0
    
    for doc_path in doc_paths:
        total_docs += 1
        with open(doc_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        lines = content.split('\n')
        
        current_section = None
        current_text = []
        
        chunks = []
        for line in lines:
            if line.startswith('### '):
                if current_section and current_text:
                    chunks.append({
                        'title': current_section,
                        'text': '\n'.join(current_text).strip()
                    })
                current_section = line.replace('### ', '').strip()
                current_text = [line]
            elif current_section:
                current_text.append(line)
                
        if current_section and current_text:
            chunks.append({
                'title': current_section,
                'text': '\n'.join(current_text).strip()
            })
            
        filename = os.path.basename(doc_path)
        
        for idx, chunk in enumerate(chunks):
            total_chunks += 1
            embedding = model.encode(chunk['text']).tolist()
            
            metadata = {
                "source_document": filename,
                "section_title": chunk['title'],
                "chunk_index": idx
            }
            
            # Print sample chunk
            if total_chunks == 1:
                print(f"Sample chunk: {chunk['title']}")
                print(f"Text: {chunk['text'][:100]}...")
                
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
