import os
import asyncio
from dataclasses import dataclass
from typing import List
from sentence_transformers import SentenceTransformer
import chromadb

@dataclass
class RetrievedChunk:
    text: str
    source_document: str
    section_title: str
    relevance_score: float
    chunk_index: int

class KnowledgeBaseRetriever:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(KnowledgeBaseRetriever, cls).__new__(cls)
            cls._instance._init()
        return cls._instance
        
    def _init(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        base_dir = os.path.dirname(os.path.abspath(__file__))
        chroma_db_dir = os.path.join(os.path.dirname(os.path.dirname(base_dir)), 'chroma_db')
        self.client = chromadb.PersistentClient(path=chroma_db_dir)
        self.collection = self.client.get_collection(name='legal_knowledge_base')

    async def retrieve(self, query: str, n_results: int = 5) -> List[RetrievedChunk]:
        query_embedding = (await asyncio.to_thread(self.model.encode, query)).tolist()
        
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
        
        retrieved_chunks = []
        if results['documents'] and results['documents'][0]:
            for idx in range(len(results['documents'][0])):
                doc = results['documents'][0][idx]
                metadata = results['metadatas'][0][idx]
                distance = results['distances'][0][idx]
                
                chunk = RetrievedChunk(
                    text=doc,
                    source_document=metadata.get('source_document', ''),
                    section_title=metadata.get('section_title', ''),
                    relevance_score=distance,
                    chunk_index=metadata.get('chunk_index', 0)
                )
                retrieved_chunks.append(chunk)
                
        return retrieved_chunks
