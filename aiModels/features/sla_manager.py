from .sla_feature_engineering import calculate_sla_compliance

def monitor_sla(tasks, sla_parameters):
    """
    Monitor SLA compliance for a list of tasks.

    Parameters:
        tasks (list[dict]): List of task details.
        sla_parameters (dict): SLA parameters including compliance thresholds.

    Returns:
        dict: SLA monitoring report with compliance rates and violations.
    """
    violations = []
    compliant_tasks = []

    for task in tasks:
        compliance_score = calculate_sla_compliance(task["deadline"], task["completion_time"])
        if compliance_score < sla_parameters["compliance_threshold"]:
            violations.append({"task_id": task["task_id"], "compliance_score": compliance_score})
        else:
            compliant_tasks.append(task)

    compliance_rate = len(compliant_tasks) / len(tasks) if tasks else 0
    return {
        "compliance_rate": compliance_rate,
        "total_tasks": len(tasks),
        "violations": violations
    }
