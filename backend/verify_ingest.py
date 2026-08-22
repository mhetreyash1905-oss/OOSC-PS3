import chromadb
from collections import defaultdict

client = chromadb.PersistentClient(path='chroma_db')
col = client.get_collection('legal_knowledge_base')
print(f'Total chunks: {col.count()}')

results = col.get(include=['metadatas'], limit=200)
per_doc = defaultdict(int)
per_state = defaultdict(int)
source_types = set()

for m in results['metadatas']:
    per_doc[m.get('source_document', '?')] += 1
    per_state[m.get('state', 'Central/General')] += 1
    source_types.add(m.get('source_type', 'unknown'))

print('\nChunks per document:')
for k, v in sorted(per_doc.items()):
    print(f'  {k}: {v}')

print('\nChunks per state:')
for k, v in sorted(per_state.items()):
    print(f'  {k}: {v}')

print('\nSource types seen:', source_types)

print('\nSample metadata (first 3 chunks):')
for m in results['metadatas'][:3]:
    print(f"  doc={m.get('source_document')} | source_type={m.get('source_type')} | state={m.get('state')} | section={m.get('section_title','')[:60]}")
