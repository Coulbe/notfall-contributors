import datetime

def calculate_sla_compliance(task_deadline, task_completion_time):
    """
    Calculate SLA compliance for a given task based on deadline and completion time.

    Parameters:
        task_deadline (str): Deadline for the task in ISO format (YYYY-MM-DDTHH:MM:SS).
        task_completion_time (str): Actual completion time in ISO format.

    Returns:
        float: SLA compliance score (0.0 to 1.0).
    """
    try:
        deadline = datetime.datetime.fromisoformat(task_deadline)
        completion = datetime.datetime.fromisoformat(task_completion_time)

        if completion <= deadline:
            return 1.0  # Fully compliant
        else:
            delay = (completion - deadline).total_seconds()
            compliance = max(0.0, 1 - (delay / (24 * 60 * 60)))  # Decrease score for delays
            return compliance
    except Exception as e:
        print(f"Error calculating SLA compliance: {e}")
        return 0.0

def generate_sla_report(tasks, sla_threshold=0.8):
    """
    Generate a detailed SLA compliance report.

    Parameters:
        tasks (list[dict]): List of task details with deadlines and completion times.
        sla_threshold (float): Minimum compliance score for SLA adherence.

    Returns:
        dict: Detailed SLA report.
    """
    total_compliance = 0
    compliant_count = 0
    non_compliant_tasks = []

    for task in tasks:
        compliance = calculate_sla_compliance(task["deadline"], task["completion_time"])
        total_compliance += compliance

        if compliance < sla_threshold:
            non_compliant_tasks.append({"task_id": task["task_id"], "compliance": compliance})
        else:
            compliant_count += 1

    average_compliance = total_compliance / len(tasks) if tasks else 0
    return {
        "total_tasks": len(tasks),
        "compliant_tasks": compliant_count,
        "average_compliance": round(average_compliance, 2),
        "non_compliant_tasks": non_compliant_tasks
    }
