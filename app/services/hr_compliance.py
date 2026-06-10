from datetime import date
from typing import Dict, Any, List

class WorkerComplianceService:
    
    @staticmethod
    def validate_worker_eligibility(
        worker_data: Dict[str, Any], 
        task_date: date
    ) -> Dict[str, Any]:
        """
        Validates if a worker is eligible for a task on a specific date.
        Returns: { allowed: bool, block_reason: str }
        """
        # 1. Check Exams
        exams = worker_data.get("exams", [])
        for exam in exams:
            exam_name = exam.get("name")
            expiration = exam.get("expiration_date")
            
            # Logic: If exam is mandatory and expired
            # For MVP, assuming all exams in list are mandatory for the role
            if expiration < task_date:
                return {
                    "allowed": False,
                    "block_reason": f"Examen '{exam_name}' vencido (Venció: {expiration})"
                }

        # 2. Check Induction (Specific Rule: "Inducción Cero Daño")
        inductions = worker_data.get("inductions", [])
        has_induction = any(ind.get("name") == "Cero Daño" and ind.get("status") == "VALID" for ind in inductions)
        
        if not has_induction:
            return {
                "allowed": False,
                "block_reason": "Falta Inducción 'Cero Daño' o no está vigente."
            }
            
        return {
            "allowed": True,
            "block_reason": None
        }
