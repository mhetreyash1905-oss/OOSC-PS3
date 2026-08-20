import os
from app.knowledge_base.retriever import KnowledgeBaseRetriever

def verify():
    retriever = KnowledgeBaseRetriever()
    
    queries = [
        'My landlord won\'t return my security deposit',
        'Garbage not collected in my area for weeks',
        'How to file an RTI application',
        'Landlord cut off my water supply',
        'Road in my locality has potholes, no repair for months',
        'What are the grounds for eviction?',
        'RTI fee and timeline',
        'Landlord gave me 7 days to vacate'
    ]
    
    for query in queries:
        print(f"\n{'='*50}\nQuery: {query}\n{'='*50}")
        results = retriever.retrieve(query, n_results=3)
        for i, res in enumerate(results):
            print(f"\nRank {i+1}:")
            print(f"Section Title: {res.section_title}")
            print(f"Source Document: {res.source_document}")
            print(f"Score: {res.relevance_score:.4f}")
            print(f"Text Preview: {res.text[:100]}...")

if __name__ == "__main__":
    verify()
