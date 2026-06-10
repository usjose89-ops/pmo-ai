import datetime
from typing import List, Dict, Any, Optional
import uuid

# --- MOCK DEPENDENCIES ---
# In production: from langchain import TextSplitter, ...
# In production: import chromadb

class MockEmbeddingService:
    @staticmethod
    def embed_query(text: str) -> List[float]:
        # Return a dummy vector of dim 1536
        return [0.1] * 10 # Simplified

class MockVectorStore:
    def __init__(self):
        self.documents = {} # id -> {text, metadata, vector}
        
    def add_documents(self, chunks: List[Dict[str, Any]]):
        for chunk in chunks:
            doc_id = str(uuid.uuid4())
            self.documents[doc_id] = {
                "text": chunk["text"],
                "metadata": chunk["metadata"],
                "vector": MockEmbeddingService.embed_query(chunk["text"])
            }
            print(f"[VectorStore] Stored chunk from {chunk['metadata']['source']} (Page {chunk['metadata']['page']})")

    def similarity_search(self, query: str, k: int = 3) -> List[Dict[str, Any]]:
        # Mock retrieval: Return closest docs (Currently just returns top k items)
        # In real DB, this uses cosine similarity
        results = []
        count = 0
        for doc in self.documents.values():
            if count >= k: break
            results.append(doc)
            count += 1
        return results

class RAGPipeline:
    def __init__(self):
        self.vector_store = MockVectorStore()
    
    def chunk_text(self, text: str, source_name: str, chunk_size: int = 1000, overlap: int = 200) -> List[Dict[str, Any]]:
        """
        Splits text into chunks with overlap.
        """
        chunks = []
        start = 0
        text_len = len(text)
        page_num = 1 # Simplified page simulation
        
        while start < text_len:
            end = min(start + chunk_size, text_len)
            chunk_text = text[start:end]
            
            chunks.append({
                "text": chunk_text,
                "metadata": {
                    "source": source_name,
                    "page": page_num,
                    "chunk_id": len(chunks) + 1
                }
            })
            
            # Simulate page break every ~3000 chars roughly
            if start > page_num * 3000:
                page_num += 1
                
            start += (chunk_size - overlap)
            
        return chunks

    def ingest_document(self, file_path: str, raw_text_content: str = None):
        """
        Process a document: Chunk -> Embed -> Store.
        If raw_text_content is provided (for mock), use it. otherwise read file.
        """
        print(f"--- INGESTING: {file_path} ---")
        text = raw_text_content if raw_text_content else "Content of file..."
        
        chunks = self.chunk_text(text, source_name=file_path.split("/")[-1])
        print(f"Generated {len(chunks)} chunks.")
        
        self.vector_store.add_documents(chunks)
        print("Ingestion Complete.\n")

    def query_advisor(self, question: str) -> Dict[str, Any]:
        """
        Retrieves context and generates answer (Mock LLM).
        """
        print(f"--- QUERY: '{question}' ---")
        
        # 1. Retrieve
        context_docs = self.vector_store.similarity_search(question, k=3)
        
        # 2. Build Context String for LLM
        context_text = "\n\n".join([
            f"[Source: {d['metadata']['source']}, Page {d['metadata']['page']}]\n{d['text']}..." 
            for d in context_docs
        ])
        
        # 3. Generate Answer (Mock)
        # In real app: response = openai.ChatCompletion.create(...)
        answer = (
            f"Based on the documents, here is the answer to '{question}':\n\n"
            f"According to {context_docs[0]['metadata']['source']} (Page {context_docs[0]['metadata']['page']}), "
            f"the specific clause regarding this topic is enforced. \n"
            f"(Context derived from retrieved chunk ID {context_docs[0]['metadata'].get('chunk_id')})"
        )
        
        return {
            "question": question,
            "answer": answer,
            "context_used": context_docs
        }
