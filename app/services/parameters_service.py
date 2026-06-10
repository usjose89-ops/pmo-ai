"""
Parameters Service — Business logic for CostParameter management.
Extracted from app.api.parameters to avoid cross-layer imports.
Uses SQLAlchemy ORM exclusively.
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models import CostParameter


def get_effective_parameters(client_id: int, db: Session) -> List[CostParameter]:
    """
    Returns the effective list of parameters for a client.
    Merges Global parameters with Client-specific overrides.
    """
    globals_list = db.query(CostParameter).filter(CostParameter.client_id.is_(None)).all()
    client_list = db.query(CostParameter).filter(CostParameter.client_id == client_id).all()

    effective = {}
    for param in globals_list:
        effective[param.name] = param
    for param in client_list:
        effective[param.name] = param  # Client override replaces global

    return list(effective.values())


def get_global_parameters(db: Session) -> List[CostParameter]:
    """Returns all global (client_id IS NULL) parameters."""
    return db.query(CostParameter).filter(CostParameter.client_id.is_(None)).all()


def get_parameters(
    db: Session,
    client_id: Optional[int] = None,
    category: Optional[str] = None
) -> List[CostParameter]:
    """Returns parameters with optional filters."""
    query = db.query(CostParameter)
    if client_id is not None:
        query = query.filter(CostParameter.client_id == client_id)
    if category:
        query = query.filter(CostParameter.category == category)
    return query.all()
