from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict

from app.database import get_db
from app.services.estimation import calculate_indirect_costs

router = APIRouter()

class EstimationRequest(BaseModel):
    project_id: int
    duration_months: int
    staffing_profile: Dict[str, int] 
    # e.g. {"Linieros": 5, "Personal Directo": 10}

@router.post("/calculate-indirects")
def estimate_indirects(request: EstimationRequest, db: Session = Depends(get_db)):
    try:
        result = calculate_indirect_costs(
            project_id=request.project_id,
            duration_months=request.duration_months,
            staffing=request.staffing_profile,
            db=db
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
