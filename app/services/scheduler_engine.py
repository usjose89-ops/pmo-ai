import datetime
from typing import List, Dict, Any, Optional

# Mocking NetworkX functionality for the MVP environment if not installed
# In a real scenario: import networkx as nx
class SimpleDAG:
    def __init__(self):
        self.nodes = set()
        self.edges = []
        self.preds = {}
        self.succs = {}

    def add_node(self, node):
        self.nodes.add(node)
        if node not in self.preds: self.preds[node] = []
        if node not in self.succs: self.succs[node] = []

    def add_edge(self, u, v):
        self.add_node(u)
        self.add_node(v)
        self.edges.append((u, v))
        self.preds[v].append(u)
        self.succs[u].append(v)

    def topological_sort(self):
        # Kahn's algorithm
        in_degree = {u: 0 for u in self.nodes}
        for u, v in self.edges:
            in_degree[v] += 1

        queue = sorted([u for u, d in in_degree.items() if d == 0])
        ordered = []

        while queue:
            node = queue.pop(0)
            ordered.append(node)

            for successor in self.succs.get(node, []):
                in_degree[successor] -= 1
                if in_degree[successor] == 0:
                    queue.append(successor)
                    queue.sort()

        if len(ordered) != len(self.nodes):
            raise ValueError("Cycle detected in dependencies")

        return ordered

class SchedulerEngine:
    """
    Implements CPM (Critical Path Method) Logic.
    """
    
    @staticmethod
    def calculate_critical_path(
        tasks: List[Dict[str, Any]], 
        project_start_date: datetime.date
    ) -> List[Dict[str, Any]]:
        
        # 1. Build Graph
        graph = SimpleDAG()
        task_map = {t["id"]: t for t in tasks}
        
        for t in tasks:
            graph.add_node(t["id"])
            for dep_id in t.get("dependencies", []):
                if dep_id in task_map:
                    graph.add_edge(dep_id, t["id"])

        sorted_nodes = graph.topological_sort() # Ensure we process in dependency order

        # 2. Forward Pass (Early Start / Early Finish)
        # ES = Max(EF of predecessors)
        # EF = ES + Duration
        
        for task_id in sorted_nodes:
            task = task_map.get(task_id)
            if not task: continue
            
            predecessors = graph.preds[task_id]
            if not predecessors:
                early_start = 0 # Relative days from start
            else:
                predecessor_finishes = [
                    task_map[p]["early_finish"]
                    for p in predecessors
                    if p in task_map and "early_finish" in task_map[p]
                ]
                early_start = max(predecessor_finishes) if predecessor_finishes else 0

            duration = int(task.get("duration", 0))
            early_finish = early_start + duration
            
            task["early_start"] = early_start
            task["early_finish"] = early_finish

        # 3. Backward Pass (Late Start / Late Finish)
        # LF = Min(LS of successors) ; For last node, LF = EF
        # LS = LF - Duration
        
        project_duration = max([t["early_finish"] for t in tasks]) if tasks else 0
        
        # Process in reverse topological order
        for task_id in reversed(sorted_nodes):
            task = task_map.get(task_id)
            if not task: continue
            
            successors = graph.succs[task_id]
            if not successors:
                late_finish = project_duration
            else:
                successor_starts = [
                    task_map[s]["late_start"]
                    for s in successors
                    if s in task_map and "late_start" in task_map[s]
                ]
                late_finish = min(successor_starts) if successor_starts else project_duration
                
            late_start = late_finish - int(task.get("duration", 0))
            
            task["late_finish"] = late_finish
            task["late_start"] = late_start
            
            # 4. Total Float & Critical Path
            total_float = late_start - task["early_start"]
            task["total_float"] = total_float
            task["is_critical"] = (total_float == 0)
            
            # Convert numeric offsets to Dates
            task["start_date"] = project_start_date + datetime.timedelta(days=task["early_start"])
            task["end_date"] = project_start_date + datetime.timedelta(days=task["early_finish"])

        return tasks
