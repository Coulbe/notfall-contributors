from .sla_alerts import categorise_sla_alert, escalate_alert, send_alert

def real_time_sla_check(task, sla_threshold, notification_service):
    """
    Perform a real-time SLA compliance check for an ongoing task.

    Parameters:
        task (dict): Task details.
        sla_threshold (float): Minimum SLA compliance score required.
        notification_service (object): Notification service instance.

    Returns:
        dict: SLA check results, including alerts if violations are found.
    """
    compliance_score = task["compliance_score"]
    alert = generate_sla_alert(task, compliance_score, sla_threshold)

    if alert:
        category = categorise_sla_alert(compliance_score, sla_threshold)
        alert["category"] = category

        if category == "critical":
            escalate_alert(alert)
        
        send_alert(alert, notification_service)
        return alert
    return {"status": "compliant", "task_id": task["task_id"]}

def generate_sla_summary(tasks, sla_threshold):
    """
    Generate a summary of SLA compliance for a batch of tasks.

    Parameters:
        tasks (list[dict]): List of tasks with compliance data.
        sla_threshold (float): SLA compliance threshold.

    Returns:
        dict: SLA summary, including compliance rate and violation count.
    """
    compliant_tasks = 0
    violations = []

    for task in tasks:
        if task["compliance_score"] >= sla_threshold:
            compliant_tasks += 1
        else:
            violations.append(task)

    total_tasks = len(tasks)
    compliance_rate = compliant_tasks / total_tasks if total_tasks > 0 else 0
    return {
        "total_tasks": total_tasks,
        "compliance_rate": round(compliance_rate, 2),
        "violations": violations
    }
