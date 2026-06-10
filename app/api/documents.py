from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List, Dict, Any
import shutil
import os
import uuid
from pathlib import Path
from app.services.pdf_parser import BudgetPDFParser

router = APIRouter()

# Temporary storage for uploads
UPLOAD_DIR = "uploads_tmp"
MAX_UPLOAD_SIZE_BYTES = 25 * 1024 * 1024  # 25 MB
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/parse-budget")
async def parse_budget_pdf(file: UploadFile = File(...)):
    """
    Parses a budget PDF file using the BudgetPDFParser service.
    Returns structured data (Description, Unit, Qty, Price, Total).
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing filename")

    safe_filename = Path(file.filename).name
    extension = Path(safe_filename).suffix.lower()
    allowed_extensions = (".pdf", ".png", ".jpg", ".jpeg", ".xlsx", ".xls")
    if extension not in allowed_extensions:
        raise HTTPException(status_code=400, detail="File must be a PDF, Image, or Excel")

    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)
    if file_size > MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="File too large (max 25 MB)")

    # Save file temporarily
    temp_filename = f"{uuid.uuid4().hex}{extension}"
    temp_path = os.path.join(UPLOAD_DIR, temp_filename)
    
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Parse
        parser = BudgetPDFParser()
        items = parser.parse(temp_path)
        
        return {
            "filename": file.filename,
            "items": items,
            "total_items": len(items),
            "message": "PDF parsing completed successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup
        if os.path.exists(temp_path):
            os.remove(temp_path)
