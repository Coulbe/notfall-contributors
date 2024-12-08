# Import necessary modules and components
from fastapi import FastAPI, WebSocket, WebSocketDisconnect  # FastAPI framework and WebSocket support.
from data.task_generator import generate_tasks  # Generate synthetic task data.
from data.engineer_generator import generate_engineers  # Generate synthetic engineer data.
from features.pricing_mechanism import calculate_dynamic_rate  # Calculate task pricing based on urgency and other factors.
from features.time_slot_optimisation import optimise_time_slots  # Optimise engineer time slots for tasks.
from features.specialisation_score import calculate_specialisation_score  # Compute skill matches.
from features.real_time_geospatial import get_travel_time  # Get travel time and distance between locations.
from models.reinforcement_learning import RLModel  # Reinforcement learning model for task matching.
from utils.visualisation import visualise_match_scores  # Visualise task-engineer match scores.
from aiModels.api.task_routes import router as task_router  # Task management API routes.
from aiModels.api.engineer_notification import router as notification_router  # Engineer notification routes.
from aiModels.api.dashboard_routes import router as dashboard_router  # Role-based dashboard API routes.
from aiModels.api.user_routes import router as user_router  # User management API routes.
from aiModels.database.database_setup import init_db  # Initialise database tables and schema.
from aiModels.utils.logger import log_event  # Utility for logging events.

from sklearn.preprocessing import StandardScaler  # Scaler for normalising feature data.
from joblib import Parallel, delayed  # Parallel computing for efficient match computations.
import pandas as pd  # Data manipulation.
import numpy as np  # Numerical computations.

# Initialise the FastAPI application
app = FastAPI(
    title="Notfall Engineers API",  # Title for API documentation.
    description="API for managing tasks, real-time notifications, and SLA tracking.",  # Brief description of the API.
    version="1.0.0",  # Version of the API.
)

# ConnectionManager for WebSocket connections
class ConnectionManager:
    """
    Manages WebSocket connections for real-time engineer notifications.
    """
    def __init__(self):
        self.active_connections = {}  # Store active WebSocket connections.

    async def connect(self, engineer_id: str, websocket: WebSocket):
        """
        Adds a WebSocket connection for an engineer.
        """
        await websocket.accept()
        self.active_connections[engineer_id] = websocket
        log_event(f"Engineer {engineer_id} connected.")

    def disconnect(self, engineer_id: str):
        """
        Removes a WebSocket connection for an engineer.
        """
        if engineer_id in self.active_connections:
            del self.active_connections[engineer_id]
            log_event(f"Engineer {engineer_id} disconnected.")

    async def send_message(self, engineer_id: str, message: str):
        """
        Sends a message to a specific engineer.
        """
        if engineer_id in self.active_connections:
            await self.active_connections[engineer_id].send_text(message)
            log_event(f"Message sent to engineer {engineer_id}: {message}")

    async def broadcast(self, engineer_ids: list, message: str):
        """
        Broadcasts a message to multiple engineers.
        """
        for engineer_id in engineer_ids:
            if engineer_id in self.active_connections:
                await self.active_connections[engineer_id].send_text(message)
                log_event(f"Broadcast message to engineer {engineer_id}: {message}")


# Create an instance of ConnectionManager
manager = ConnectionManager()

@app.websocket("/ws/engineer/{engineer_id}")
async def websocket_endpoint(websocket: WebSocket, engineer_id: str):
    """
    WebSocket endpoint for real-time engineer notifications.
    """
    await manager.connect(engineer_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            if data.startswith("accept:"):
                task_id = data.split(":")[1]
                assign_task_to_engineer(task_id, engineer_id)
                update_task_status(task_id, "assigned")
                await manager.send_message(engineer_id, f"Task {task_id} assigned to you.")
                log_event(f"Task {task_id} assigned to engineer {engineer_id}.")
                break
    except WebSocketDisconnect:
        manager.disconnect(engineer_id)


@app.on_event("startup")
def startup_event():
    """
    Perform initialisation tasks on API server startup.
    """
    init_db()
    log_event("Database initialised. API server started.")

@app.get("/")
def root():
    """
    Health check endpoint.
    """
    return {"message": "Welcome to the Notfall Engineers API!"}

@app.get("/api-info")
def api_info():
    """
    API metadata endpoint.
    """
    return {
        "title": app.title,
        "version": app.version,
        "description": app.description,
    }

@app.get("/generate-matches")
def generate_matches():
    """
    Generate task-engineer matches based on multiple features.
    """
    # Generate tasks and engineers
    tasks = generate_tasks(1000)  # Generate 1000 tasks.
    engineers = generate_engineers(200)  # Generate 200 engineers.

    # Function to compute match scores
    def compute_match(task, engineer):
        travel_time, distance = get_travel_time(task["location"], engineer["location"])
        dynamic_rate = calculate_dynamic_rate(
            engineer["hourly_rate"], task["urgency"], engineer["experience_years"]
        )
        specialisation = calculate_specialisation_score(
            engineer.get("certifications", []), task.get("requirements", [])
        )
        time_slot_match = optimise_time_slots(task.get("time_slot"), engineer.get("schedule", []))

        return {
            "task_id": task["task_id"],
            "engineer_id": engineer["engineer_id"],
            "distance": distance or 999,
            "travel_time": travel_time or 999,
            "dynamic_rate": dynamic_rate,
            "specialisation_score": specialisation,
            "time_slot_match": time_slot_match,
            "rating": engineer["rating"],
        }

    # Parallel computation for efficiency
    matches = Parallel(n_jobs=-1)(
        delayed(compute_match)(task, engineer)
        for _, task in tasks.iterrows()
        for _, engineer in engineers.iterrows()
    )

    # Process matches into a DataFrame
    match_df = pd.DataFrame(matches)

    # Normalise feature values
    scaler = StandardScaler()
    features = match_df[["distance", "travel_time", "dynamic_rate", "specialisation_score", "time_slot_match", "rating"]]
    features_scaled = scaler.fit_transform(features)

    # Reinforcement Learning for additional scoring
    rl_model = RLModel(num_states=features_scaled.shape[0], num_actions=1)
    match_df["ml_score"] = features_scaled.dot(np.array([0.3, 0.2, 0.2, 0.1, 0.1, 0.1]))
    match_df["match_score"] = match_df["ml_score"] + [rl_model.choose_action(i) for i in range(features_scaled.shape[0])]

    # Sort matches by task and score
    ranked_matches = match_df.sort_values(["task_id", "match_score"], ascending=[True, False])

    # Visualise results
    visualise_match_scores(ranked_matches)

    return {"message": "Task-engineer matches generated and visualised."}


# Include routers
app.include_router(task_router, prefix="/api/tasks", tags=["Tasks"])
app.include_router(notification_router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(dashboard_router, prefix="/api/dashboards", tags=["Dashboards"])
app.include_router(user_router, prefix="/api/users", tags=["Users"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
