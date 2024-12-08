import matplotlib.pyplot as plt
import plotly.graph_objects as go

def plot_sla_compliance_summary(sla_summary):
    """
    Plot a summary of SLA compliance.

    Parameters:
        sla_summary (dict): SLA summary including compliance rate and violations.
    """
    labels = ["Compliant Tasks", "Violations"]
    sizes = [
        sla_summary["compliance_rate"] * sla_summary["total_tasks"],
        (1 - sla_summary["compliance_rate"]) * sla_summary["total_tasks"]
    ]
    colours = ["#4CAF50", "#F44336"]

    plt.figure(figsize=(8, 6))
    plt.pie(sizes, labels=labels, autopct="%1.1f%%", startangle=140, colors=colours)
    plt.title("SLA Compliance Summary")
    plt.axis("equal")
    plt.show()

def plot_sla_trends(violations, compliance_rates):
    """
    Plot SLA compliance trends over time.

    Parameters:
        violations (list[dict]): List of violations with timestamps.
        compliance_rates (list[dict]): Compliance rates over time.
    """
    fig = go.Figure()

    # Add compliance rates
    fig.add_trace(
        go.Scatter(
            x=[rate["timestamp"] for rate in compliance_rates],
            y=[rate["compliance_rate"] for rate in compliance_rates],
            mode="lines+markers",
            name="Compliance Rate",
            line=dict(color="blue")
        )
    )

    # Add violations
    fig.add_trace(
        go.Bar(
            x=[violation["timestamp"] for violation in violations],
            y=[1] * len(violations),
            name="Violations",
            marker_color="red"
        )
    )

    fig.update_layout(
        title="SLA Compliance Trends",
        xaxis_title="Time",
        yaxis_title="Compliance Rate / Violations",
        barmode="overlay",
        template="plotly_white"
    )

    fig.show()
