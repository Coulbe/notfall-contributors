from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from aiModels.models.dynamic_scheduler import get_top_5_engineers
from aiModels.database.database import assign_task_to_engineer, update_task_status
from aiModels.utils.logger import log_event
from aiModels.utils.notification_service import notify_engineers, engineer_accept_task

# Initialise the router for notification-related endpoints and WebSocket
router = APIRouter()

# WebSocket Connection Manager
class ConnectionManager:
    """
    Manages active WebSocket connections for real-time notifications.
    """

    def __init__(self):
        self.active_connections = {}

    async def connect(self, engineer_id: str, websocket: WebSocket):
        """
        Add a new WebSocket connection for an engineer.

        Parameters:
        - engineer_id (str): The unique ID of the engineer.
        - websocket (WebSocket): The WebSocket connection object.
        """
        await websocket.accept()
        self.active_connections[engineer_id] = websocket
        log_event(f"Engineer {engineer_id} connected.")

    def disconnect(self, engineer_id: str):
        """
        Remove a WebSocket connection for an engineer.

        Parameters:
        - engineer_id (str): The unique ID of the engineer.
        """
        if engineer_id in self.active_connections:
            del self.active_connections[engineer_id]
            log_event(f"Engineer {engineer_id} disconnected.")

    async def send_message(self, engineer_id: str, message: str):
        """
        Send a message to a specific engineer.

        Parameters:
        - engineer_id (str): The unique ID of the engineer.
        - message (str): The message content.
        """
        if engineer_id in self.active_connections:
            await self.active_connections[engineer_id].send_text(message)
            log_event(f"Sent message to engineer {engineer_id}: {message}")

    async def broadcast(self, engineer_ids: list, message: str):
        """
        Broadcast a message to multiple engineers.

        Parameters:
        - engineer_ids (list): List of engineer IDs.
        - message (str): The message content.
        """
        for engineer_id in engineer_ids:
            if engineer_id in self.active_connections:
                await self.active_connections[engineer_id].send_text(message)
                log_event(f"Broadcast message to engineer {engineer_id}: {message}")


# Initialise the connection manager
manager = ConnectionManager()

# WebSocket Endpoint
@router.websocket("/ws/engineer/{engineer_id}")
async def websocket_endpoint(websocket: WebSocket, engineer_id: str):
    """
    WebSocket endpoint for engineers to receive task notifications.

    Parameters:
    - websocket (WebSocket): The WebSocket connection object.
    - engineer_id (str): The unique ID of the engineer.
    """
    await manager.connect(engineer_id, websocket)
    try:
        while True:
            # Listen for incoming messages from the engineer
            data = await websocket.receive_text()
            if data.startswith("accept:"):
                task_id = data.split(":")[1]
                # Assign the task to the engineer and update its status
                assign_task_to_engineer(task_id, engineer_id)
                update_task_status(task_id, "assigned")
                await manager.send_message(engineer_id, f"Task {task_id} has been assigned to you.")
                log_event(f"Task {task_id} assigned to engineer {engineer_id}.")
                break
    except WebSocketDisconnect:
        # Handle WebSocket disconnection
        manager.disconnect(engineer_id)

# REST Endpoint: Notify Engineers
@router.post("/notify")
async def notify_engineers_route(task_id: str, task_details: dict):
    """
    Notify a group of engineers in real time about a new task.

    Parameters:
    - task_id (str): The unique ID of the task.
    - task_details (dict): Additional details about the task (e.g., urgency, location, budget).

    Returns:
        JSON response with the IDs of the engineers who were notified.
    """
    try:
        # Notify top engineers about the task
        engineers_notified = notify_engineers(task_id, task_details)
        return {
            "message": "Engineers notified successfully.",
            "task_id": task_id,
            "engineers": engineers_notified,
        }
    except Exception as e:
        # Handle errors during notification
        raise HTTPException(status_code=500, detail=f"Error notifying engineers: {e}")

# REST Endpoint: Accept Task
@router.post("/accept")
async def accept_task_route(engineer_id: str, task_id: str):
    """
    Allow an engineer to accept a task assignment.

    Parameters:
    - engineer_id (str): The unique ID of the engineer accepting the task.
    - task_id (str): The unique ID of the task being accepted.

    Returns:
        JSON response indicating success or failure of the task acceptance.
    """
    try:
        # Process task acceptance
        success = engineer_accept_task(engineer_id, task_id)
        if not success:
            raise HTTPException(status_code=400, detail="Task acceptance failed")
        return {
            "message": f"Engineer {engineer_id} successfully accepted task {task_id}.",
        }
    except Exception as e:
        # Handle errors during task acceptance
        raise HTTPException(status_code=500, detail=f"Error accepting task: {e}")
