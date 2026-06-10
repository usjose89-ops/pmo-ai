from app.services.ai_pipeline import RAGPipeline

def test_rag_pipeline():
    print("=== Testing AI Advisor (RAG Pipeline) ===")
    
    pipeline = RAGPipeline()
    
    # 1. Mock Document Content (Bases Técnicas)
    bases_text = (
        "ARTICULO 45: MULTAS Y SANCIONES.\n"
        "El contratista incurrirá en una multa de 10 UF diarias por atraso en la entrega de informes semanales. "
        "Para atrasos en hitos de obra gruesa, la multa asciende a 50 UF por día de atraso. "
        "Las apelaciones deben realizarse por escrito al Administrador de Contrato dentro de los 5 días hábiles siguientes a la notificación. "
        "No se aceptarán apelaciones por correo electrónico sin carta formal adjunta. "
        # ... Repeats to simulate length
    )
    
    # 2. Ingest
    pipeline.ingest_document("docs/Bases_Administrativas_MEL.pdf", raw_text_content=bases_text)
    
    # 3. Query
    question = "¿Cuál es la multa por atraso en informes?"
    result = pipeline.query_advisor(question)
    
    print("\n[AI RESPONSE]")
    print(result["answer"])
    
    print("\n[CONTEXT USED]")
    for doc in result["context_used"]:
        meta = doc["metadata"]
        print(f"- {meta['source']} (Page {meta['page']}): {doc['text'][:50]}...")

if __name__ == "__main__":
    test_rag_pipeline()
