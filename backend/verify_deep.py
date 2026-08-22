import chromadb

client = chromadb.PersistentClient(path='chroma_db')
col = client.get_collection('legal_knowledge_base')

# Show UP ambiguity
up = col.get(where={"state": "Uttar Pradesh"}, include=["metadatas", "documents"])
print("=== UP chunks ===")
for i, (m, d) in enumerate(zip(up["metadatas"], up["documents"])):
    print(f"  Section: {m['section_title']}")
    print(f"  Ambiguity: {m.get('ambiguity', 'None')}")
    print(f"  Text preview: {d[:100]}\n")

# Show TN ambiguity
tn = col.get(where={"state": "Tamil Nadu"}, include=["metadatas", "documents"])
print("=== Tamil Nadu chunks ===")
for m, d in zip(tn["metadatas"], tn["documents"]):
    print(f"  Section: {m['section_title']}")
    print(f"  Ambiguity: {m.get('ambiguity', 'None')}")
    print(f"  Text preview: {d[:100]}\n")

# Show maharashtra as general_explainer
mh = col.get(where={"state": "Maharashtra"}, include=["metadatas"])
print("=== Maharashtra source_type ===")
for m in mh["metadatas"][:2]:
    print(f"  source_type={m.get('source_type')} | section={m.get('section_title','')[:60]}")

# Show RTI Act chunk count
rti = col.get(where={"source_document": "rti_act_2005.pdf"}, include=["metadatas"])
print(f"\n=== RTI Act: {len(rti['ids'])} verbatim sections ===")
for m in rti["metadatas"][:3]:
    print(f"  {m['section_title'][:70]}")
