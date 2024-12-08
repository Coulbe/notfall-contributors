from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from aiModels.database.task_queries import create_task, get_task_by_id, update_task_status, delete_task
from aiModels.utils.auth_middleware import jwt_required

# Initialise the router for task-related endpoints
router = APIRouter()

# Request model for creating a task
class TaskCreateRequest(BaseModel):
    title: str
    description: str
    urgency: int
    budget: float
    property_id: str
    tenant_id: Optional[str] = None  # Optional for cases where property manager creates the task

# Request model for updating a task's status
class TaskStatusUpdateRequest(BaseModel):
    status: str

@router.post("/create", dependencies=[Depends(jwt_required)])
async def create_task_route(task_request: TaskCreateRequest):
    """
    Create a new task in the system.

    Parameters:
    - task_request (TaskCreateRequest): The task details sent in the request body.

    Returns:
        JSON response with the created task ID.
    """
    try:
        task_id = create_task(task_request.dict())
        return {"message": "Task created successfully", "task_id": task_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating task: {e}")

@router.get("/{task_id}", dependencies=[Depends(jwt_required)])
async def get_task_route(task_id: str):
    """
    Retrieve details of a specific task.

    Parameters:
    - task_id (str): The unique ID of the task.

    Returns:
        JSON response with task details or a 404 error if the task is not found.
    """
    try:
        task = get_task_by_id(task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        return task
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving task: {e}")

@router.put("/{task_id}/status", dependencies=[Depends(jwt_required)])
async def update_task_status_route(task_id: str, status_request: TaskStatusUpdateRequest):
    """
    Update the status of a specific task.

    Parameters:
    - task_id (str): The unique ID of the task.
    - status_request (TaskStatusUpdateRequest): The new status to be updated.

    Returns:
        JSON response indicating success or failure of the update.
    """
    try:
        success = update_task_status(task_id, status_request.status)
        if not success:
            raise HTTPException(status_code=400, detail="Failed to update task status")
        return {"message": f"Task {task_id} status updated to {status_request.status}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating task status: {e}")

@router.delete("/{task_id}", dependencies=[Depends(jwt_required)])
async def delete_task_route(task_id: str):
    """
    Delete a specific task.

    Parameters:
    - task_id (str): The unique ID of the task.

    Returns:
        JSON response indicating success or failure of the deletion.
    """
    try:
        success = delete_task(task_id)
        if not success:
            raise HTTPException(status_code=400, detail="Failed to delete task")
        return {"message": f"Task {task_id} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting task: {e}")
