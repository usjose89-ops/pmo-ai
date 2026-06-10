from datetime import date
from typing import Any, Optional

from app.models import Task, TaskCompletionStatus, TaskLog, TaskStatus
from app.services.notifications import EmailService


class SimpleDiGraph:
    def __init__(self):
        self._nodes = set()
        self._succ = {}
        self._pred = {}

    def add_node(self, node: Any):
        self._nodes.add(node)
        self._succ.setdefault(node, set())
        self._pred.setdefault(node, set())

    def add_edge(self, source: Any, target: Any):
        self.add_node(source)
        self.add_node(target)
        self._succ[source].add(target)
        self._pred[target].add(source)

    def nodes(self):
        return list(self._nodes)

    def in_degree(self, node: Any) -> int:
        return len(self._pred.get(node, set()))

    def out_degree(self, node: Any) -> int:
        return len(self._succ.get(node, set()))


class MockSession:
    def add(self, obj: Any):
        print(f"[DB] Added new record: {obj}")

    def commit(self):
        print("[DB] Commit successful.")


class Scheduler:
    """
    Builds a dependency graph from task ORM objects for audit and validation flows.
    """

    def __init__(self, tasks: list[Task]):
        self.graph = SimpleDiGraph()
        tasks_by_id = {t.id: t for t in tasks if t.id is not None}

        for task in tasks:
            if task.id is None:
                continue
            self.graph.add_node(task.id)

        for task in tasks:
            if task.id is None:
                continue
            dependencies = task.dependencies or []
            if isinstance(dependencies, dict):
                dependencies = dependencies.get("ids", [])
            if not isinstance(dependencies, list):
                continue
            for dep_id in dependencies:
                if dep_id in tasks_by_id:
                    self.graph.add_edge(dep_id, task.id)


def update_task_date(
    task: Task,
    new_date: date,
    reason: Optional[str],
    user_id: int,
    manager_email: str = "jefe.terreno@constructia.cl",
    db: Any = None,
) -> bool:
    """
    Updates a task deadline and handles auditing + notifications if delayed.
    """
    session = db or MockSession()
    current_deadline = task.end_date

    if new_date > current_deadline:
        if not reason:
            raise ValueError("Se requiere una razón ('reason') para postergar una fecha.")

        task.end_date = new_date
        task.status = TaskStatus.DELAYED
        task.completion_status = TaskCompletionStatus.DELAYED_JUSTIFIED

        log_entry = TaskLog(
            task_id=task.id,
            previous_date=current_deadline,
            new_date=new_date,
            reason=reason,
            change_date=date.today(),
        )
        session.add(log_entry)

        EmailService.send_delay_alert(
            manager_email=manager_email,
            task_title=task.name,
            old_date=current_deadline,
            new_date=new_date,
            reason=reason,
        )

        session.commit()
        return True

    task.end_date = new_date
    if task.completion_status == TaskCompletionStatus.DELAYED_JUSTIFIED:
        task.completion_status = TaskCompletionStatus.ON_TIME
    session.commit()
    return True
