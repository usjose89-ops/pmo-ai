from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Task, TaskPriority, TaskStatus
from app.services.notifications import EmailService
from app.services.scheduler import update_task_date

router = APIRouter()


class TaskAssignmentRequest(BaseModel):
    title: str
    priority: str  # HIGH, MEDIUM, LOW
    deadline: date
    assignee_email: str
    project_id: int


class TaskDateUpdateRequest(BaseModel):
    new_date: date
    reason: Optional[str] = None


@router.post("/assign")
def assign_task(request: TaskAssignmentRequest, db: Session = Depends(get_db)):
    """
    Assigns and persists a new task, then triggers notification.
    """
    try:
        priority = TaskPriority(request.priority.upper())
    except ValueError:
        raise HTTPException(status_code=422, detail="priority must be HIGH, MEDIUM, or LOW")

    if "@" not in request.assignee_email:
        raise HTTPException(status_code=422, detail="assignee_email is invalid")

    if request.deadline < date.today():
        raise HTTPException(status_code=422, detail="deadline cannot be in the past")

    new_task = Task(
        name=request.title.strip(),
        project_id=request.project_id,
        start_date=date.today(),
        end_date=request.deadline,
        original_deadline=request.deadline,
        priority=priority,
        assigned_email=request.assignee_email,
        status=TaskStatus.PENDING,
        dependencies=[],
        quantity=1,
        planned_value=0,
        earned_value=0,
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    EmailService.send_task_assignment(
        task_title=new_task.name,
        email=new_task.assigned_email,
        deadline=new_task.end_date,
        priority=new_task.priority.value,
    )

    return {
        "status": "success",
        "task_id": new_task.id,
        "message": "Task assigned and email sent.",
    }


@router.put("/{task_id}/update-date")
def update_task_deadline(task_id: int, request: TaskDateUpdateRequest, db: Session = Depends(get_db)):
    """
    Updates task date. Enforces delay protocol and logs audit trail.
    """
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    try:
        update_task_date(
            task=task,
            new_date=request.new_date,
            reason=request.reason,
            user_id=1,  # Placeholder until auth is implemented.
            db=db,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {
        "status": "success",
        "task_id": task.id,
        "new_date": task.end_date,
        "task_status": task.status.value if task.status else None,
        "audit_logged": True,
    }
