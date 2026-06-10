"""
Parameters API Router.
Now uses SQLAlchemy ORM via service layer instead of raw sqlite3.
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
import json

from app.database import get_db
from app.models import CostParameter
from app.services.parameters_service import (
    get_effective_parameters,
    get_global_parameters,
    get_parameters,
)

router = APIRouter()


# --- Pydantic Schemas ---
class CostParameterBase(BaseModel):
    name: str
    category: str
    unit: str = "uni"
    value: float
    classification_rules: Optional[dict] = None
    client_id: Optional[int] = None


class CostParameterCreate(CostParameterBase):
    pass


class CostParameterRead(CostParameterBase):
    id: int

    class Config:
        from_attributes = True


# --- Helper ---
def _param_to_read(param: CostParameter) -> dict:
    """Convert ORM model to response dict."""
    rules = param.classification_rules
    if isinstance(rules, str):
        try:
            rules = json.loads(rules)
        except (json.JSONDecodeError, TypeError):
            rules = None
    return {
        "id": param.id,
        "name": param.name,
        "category": param.category,
        "unit": param.unit,
        "value": float(param.value),
        "classification_rules": rules,
        "client_id": param.client_id,
    }


# --- Endpoints ---

@router.get("/", response_model=List[CostParameterRead])
def read_parameters(
    client_id: Optional[int] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
):
    params = get_parameters(db, client_id=client_id, category=category)
    return [_param_to_read(p) for p in params]


@router.get("/globals", response_model=List[CostParameterRead])
def read_global_parameters_endpoint(db: Session = Depends(get_db)):
    params = get_global_parameters(db)
    return [_param_to_read(p) for p in params]


@router.get("/effective/{client_id}")
def read_effective_parameters_endpoint(client_id: int, db: Session = Depends(get_db)):
    """
    Returns the effective list of parameters for a client.
    Merges Global parameters with Client-specific overrides.
    """
    params = get_effective_parameters(client_id, db)
    return [_param_to_read(p) for p in params]


@router.post("/", response_model=CostParameterRead)
def create_parameter(param: CostParameterCreate, db: Session = Depends(get_db)):
    new_param = CostParameter(
        name=param.name,
        category=param.category,
        unit=param.unit,
        value=param.value,
        classification_rules=param.classification_rules,
        client_id=param.client_id,
    )
    db.add(new_param)
    db.commit()
    db.refresh(new_param)
    return _param_to_read(new_param)


@router.put("/{param_id}", response_model=CostParameterRead)
def update_parameter(param_id: int, param: CostParameterCreate, db: Session = Depends(get_db)):
    existing = db.query(CostParameter).filter(CostParameter.id == param_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Parameter not found")

    existing.name = param.name
    existing.category = param.category
    existing.unit = param.unit
    existing.value = param.value
    existing.classification_rules = param.classification_rules
    existing.client_id = param.client_id
    db.commit()
    db.refresh(existing)
    return _param_to_read(existing)


@router.delete("/{param_id}")
def delete_parameter(param_id: int, db: Session = Depends(get_db)):
    existing = db.query(CostParameter).filter(CostParameter.id == param_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Parameter not found")
    db.delete(existing)
    db.commit()
    return {"ok": True}
