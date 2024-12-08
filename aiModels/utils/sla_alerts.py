def categorise_sla_alert(compliance_score, threshold):
    """
    Categorise SLA alerts based on compliance score.

    Parameters:
        compliance_score (float): SLA compliance score.
        threshold (float): SLA compliance threshold.

    Returns:
        str: Alert category ("critical", "warning", "info").
    """
    if compliance_score < threshold * 0.5:
        return "critical"
    elif compliance_score < threshold:
        return "warning"
    else:
        return "info"

def escalate_alert(alert, escalation_level=2):
    """
    Escalate an SLA alert to a higher priority or authority.

    Parameters:
        alert (dict): Alert details.
        escalation_level (int): Level of escalation (default: 2).

    Returns:
        dict: Escalated alert with updated priority or recipient.
    """
    alert["escalation_level"] = escalation_level
    alert["message"] += f" [Escalated to Level {escalation_level}]"
    print(f"Escalated Alert: {alert['message']}")
    return alert
