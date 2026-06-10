from decimal import Decimal
from typing import List, Dict
# Mock imports - in real app would use DB session
from app.models import QualityProtocol, ProtocolStatus

def calculate_top_health(protocols: List[Dict]) -> Decimal:
    """
    Calculates the 'Health' of a TOP Folder based on protocol status.
    Formula: (Approved Protocols / Total Required) * 100
    """
    if not protocols:
        return Decimal("0.00")
    
    total = len(protocols)
    approved = sum(1 for p in protocols if p['status'] == 'APPROVED')
    
    return Decimal((approved / total) * 100).quantize(Decimal("0.01"))

def check_paperwork_gap(task_progress: float, protocol_status: str) -> bool:
    """
    Returns True if there is a 'Paperwork Gap' (Task Done but Protocol Not Approved).
    """
    if task_progress >= 100 and protocol_status != 'APPROVED':
        return True
    return False
