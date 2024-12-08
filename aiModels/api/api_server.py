from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from aiModels.api.task_routes import router as task_router
from aiModels.api.engineer_notification import router as notification_router
from aiModels.api.dashboard_routes import router as dashboard_router
from aiModels.api.user_routes import router as user_router
from aiModels.database.database import init_db
from aiModels.utils.logger import log_event

# Initialise the FastAPI application
app = FastAPI(
    title="Notfall Engineers API",
    description="Backend API for task management, notifications, SLA tracking, and user operations.",
    version="2.0.0",
)

# Event triggered on application startup
@app.on_event("startup")
def on_startup():
    """
    Startup event for initialising resources:
    - Initialise database schema.
    - Log the startup event.
    """
    init_db()
    log_event("API server has started and database initialised.")

# Global error handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Handles uncaught exceptions globally for consistent error responses.
    """
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)},
    )

# Include modular routers
app.include_router(user_router, prefix="/api/users", tags=["Users"])
app.include_router(task_router, prefix="/api/tasks", tags=["Tasks"])
app.include_router(notification_router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(dashboard_router, prefix="/api/dashboards", tags=["Dashboards"])

# Root endpoint for health check
@app.get("/")
def root():
    """
    Health check endpoint to verify the API is operational.
    """
    return {"message": "Welcome to Notfall Engineers API", "status": "running"}

@app.get("/api-info")
def api_info():
    """
    Provides metadata about the API.
    """
    return {
        "title": app.title,
        "version": app.version,
        "description": app.description,
    }
