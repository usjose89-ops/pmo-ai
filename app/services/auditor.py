from typing import List, Dict, Any, Optional
import networkx as nx
from sqlalchemy.orm import Session
from app.models import Project, Task, APU
from app.services.scheduler import Scheduler

class Auditor:
    def __init__(self, session: Session, project_id: int):
        self.session = session
        self.project_id = project_id
        self.project_tasks = session.query(Task).join(APU, Task.apu_id == APU.id).filter(APU.project_id == project_id).all()
        # Fallback if tasks are just linked to project differently, but Schema has Task -> APU -> Project.
        # Actually Task has no direct project_id in models.py, it links via APU? 
        # Wait, models.py Task definition:
        # id, name, start/end, dependencies, evm, apu_id, quantity.
        # It does NOT have project_id. 
        # So we assume strict Task -> APU -> Project relationship for auditing.
        # If a Task is NOT linked to an APU, it might be orphaned or just a scheduling placeholder.
        # For Auditor, we need all tasks relevant to the project.
        # Let's assume passed tasks are filtered externally or we fetch all involved.
        pass

    def sanity_check_project(self, tasks: List[Task]) -> Dict[str, Any]:
        """
        Run a suite of sanity checks on the project.
        """
        report = {
            "resource_check": {"status": "PASS", "issues": []},
            "logic_check": {"status": "PASS", "issues": []},
            "pmi_compliance": {"status": "PASS", "issues": []}
        }
        
        # 1. Resource / Budget Integrity Check
        # Compare Task Quantity * APU Unit Price vs Planned Value?
        # Or check if APU is missing.
        for task in tasks:
            if not task.apu_id:
                # Issue: Task without Budget/APU
                # Not necessarily an error, but a warning for "Auditor".
                # report["resource_check"]["issues"].append(f"Task {task.id} has no APU assigned.")
                pass
            else:
                if task.quantity <= 0:
                     report["resource_check"]["issues"].append(f"Task {task.id} has invalid quantity {task.quantity}.")
                     report["resource_check"]["status"] = "WARN"

        # 2. Logic Check (Circular Dependencies)
        scheduler = Scheduler(tasks)
        if not nx.is_directed_acyclic_graph(scheduler.graph):
             report["logic_check"]["status"] = "FAIL"
             report["logic_check"]["issues"].append("Circular dependency detected in project schedule.")
             try:
                 cycle = nx.find_cycle(scheduler.graph)
                 report["logic_check"]["issues"].append(f"Cycle: {cycle}")
             except:
                 pass

        # 3. PMI Compliance
        # "Predictive" projects must have dependencies for all tasks except Start and End.
        # We need to know Project Methodology. 
        # Assuming we can look up project from first task's APU or passed context.
        # Let's do a strict check: Start node (indegree 0) and End node (outdegree 0).
        # Any node with Indegree 0 that is NOT the project start is "Open Loop".
        
        # Analyze Graph
        for n in scheduler.graph.nodes():
            in_degree = scheduler.graph.in_degree(n)
            out_degree = scheduler.graph.out_degree(n)
            
            # Simplified check: Warning if a task has no predecessors AND no successors (Orphan)
            # unless it's the only task.
            if in_degree == 0 and out_degree == 0 and len(tasks) > 1:
                 report["pmi_compliance"]["issues"].append(f"Task {n} is isolated (No predecessors or successors).")
                 report["pmi_compliance"]["status"] = "WARN"
            
            # PMI: Minimize basic 'Finish-to-Start' with lags? 
            # We just check for open loops.
            
        return report
