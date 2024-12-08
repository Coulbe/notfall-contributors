from fastapi import APIRouter, HTTPException, Depends
from aiModels.database.dashboard_queries import fetch_dashboard_metrics
from aiModels.utils.auth_middleware import jwt_required
from typing import Optional

# Initialise the router for dashboard-related endpoints
router = APIRouter()

@router.get("/overview", dependencies=[Depends(jwt_required)])
async def get_overview():
    """
    Fetch an overview of system-wide metrics for the dashboard.
    Example data includes:
    - Total number of tasks.
    - Active tasks in progress.
    - Number of engineers currently online.
    - SLA compliance rate.

    Authentication:
    Requires a valid JWT token for access.

    Returns:
        JSON response with aggregated metrics.
    """
    try:
        # Fetch aggregated metrics for the overview dashboard
        data = fetch_dashboard_metrics()
        return {
            "total_tasks": data["total_tasks"],
            "active_tasks": data["active_tasks"],
            "engineers_online": data["engineers_online"],
            "sla_compliance_rate": f"{data['sla_compliance_rate'] * 100:.2f}%",
        }
    except Exception as e:
        # Handle unexpected errors and return a 500 HTTP response
        raise HTTPException(status_code=500, detail=f"Error fetching dashboard overview: {e}")

@router.get("/engineer/{engineer_id}", dependencies=[Depends(jwt_required)])
async def engineer_dashboard(engineer_id: str):
    """
    Fetch detailed metrics specific to an engineer's performance.

    Metrics include:
    - Number of tasks completed.
    - Average engineer rating.
    - Current availability status.

    Parameters:
    - engineer_id (str): The unique ID of the engineer.

    Returns:
        JSON response with engineer-specific metrics or a 404 error if the engineer is not found.
    """
    try:
        # Fetch metrics tailored to an individual engineer
        data = fetch_dashboard_metrics(role="engineer", id=engineer_id)
        if not data:
            raise HTTPException(status_code=404, detail="Engineer not found")
        return {
            "engineer_id": engineer_id,
            "tasks_completed": data["tasks_completed"],
            "rating": data["rating"],
            "availability": data["availability"],
        }
    except Exception as e:
        # Handle unexpected errors and return a 500 HTTP response
        raise HTTPException(status_code=500, detail=f"Error fetching engineer metrics: {e}")

@router.get("/manager/{manager_id}", dependencies=[Depends(jwt_required)])
async def property_manager_dashboard(manager_id: str):
    """
    Fetch detailed metrics specific to a property manager's portfolio.

    Metrics include:
    - Number of properties managed.
    - Number of active tasks.
    - SLA compliance rate for managed properties.

    Parameters:
    - manager_id (str): The unique ID of the property manager.

    Returns:
        JSON response with manager-specific metrics or a 404 error if the manager is not found.
    """
    try:
        # Fetch metrics tailored to a property manager
        data = fetch_dashboard_metrics(role="property_manager", id=manager_id)
        if not data:
            raise HTTPException(status_code=404, detail="Property manager not found")
        return {
            "manager_id": manager_id,
            "properties_managed": data["properties_managed"],
            "active_tasks": data["active_tasks"],
            "sla_compliance_rate": f"{data['sla_compliance_rate'] * 100:.2f}%",
        }
    except Exception as e:
        # Handle unexpected errors and return a 500 HTTP response
        raise HTTPException(status_code=500, detail=f"Error fetching property manager metrics: {e}")
