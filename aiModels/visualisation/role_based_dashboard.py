import plotly.express as px
import plotly.graph_objects as go

def generate_dashboard(data, role):
    """
    Generate a role-based dashboard.

    Parameters:
        data (dict): Data specific to the user role.
        role (str): User role (e.g., "engineer", "property_manager", "tenant").
    """
    if role == "engineer":
        _generate_engineer_dashboard(data)
    elif role == "property_manager":
        _generate_property_manager_dashboard(data)
    elif role == "tenant":
        _generate_tenant_dashboard(data)
    else:
        print(f"No dashboard available for role: {role}")

def _generate_engineer_dashboard(data):
    """
    Generate a dashboard for engineers.

    Parameters:
        data (dict): Engineer-specific data.
    """
    tasks = data["tasks"]
    ratings = data["ratings"]

    fig = go.Figure()

    fig.add_trace(
        go.Bar(
            x=[task["task_id"] for task in tasks],
            y=[task["completion_time"] for task in tasks],
            name="Completion Times",
            marker_color="blue"
        )
    )

    fig.add_trace(
        go.Scatter(
            x=[task["task_id"] for task in tasks],
            y=ratings,
            mode="lines+markers",
            name="Ratings",
            line=dict(color="green")
        )
    )

    fig.update_layout(
        title="Engineer Task Performance",
        xaxis_title="Tasks",
        yaxis_title="Values",
        barmode="overlay",
        template="plotly_white"
    )

    fig.show()

def _generate_property_manager_dashboard(data):
    """
    Generate a dashboard for property managers.

    Parameters:
        data (dict): Property manager-specific data.
    """
    fig = px.bar(
        x=data["properties"],
        y=data["active_tasks"],
        labels={"x": "Properties", "y": "Active Tasks"},
        title="Active Tasks Across Properties",
        template="plotly_white"
    )
    fig.update_traces(marker_color="blue")
    fig.show()

def _generate_tenant_dashboard(data):
    """
    Generate a dashboard for tenants.

    Parameters:
        data (dict): Tenant-specific data.
    """
    fig = px.scatter(
        x=range(len(data["completed_tasks"])),
        y=data["satisfaction_ratings"],
        labels={"x": "Tasks", "y": "Satisfaction Ratings"},
        title="Tenant Satisfaction Over Time",
        template="plotly_white"
    )
    fig.update_traces(marker=dict(size=12, color="red"))
    fig.show()
