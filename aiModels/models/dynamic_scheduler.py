def schedule_task(task, available_engineers):
    """
    Dynamically schedule a task by matching it with an available engineer.

    Parameters:
        task (dict): Task details, including deadline and trade.
        available_engineers (list[dict]): List of available engineers.

    Returns:
        dict: Assigned engineer details or rescheduling instructions if no match is found.
    """
    try:
        # Filter engineers by trade and availability
        suitable_engineers = [
            engineer for engineer in available_engineers
            if task["trade"] in engineer["expertise"] and engineer["availability"] == "available"
        ]

        # Sort engineers by rating and proximity (assume proximity data available)
        suitable_engineers.sort(key=lambda e: (-e["rating"], e.get("proximity", float("inf"))))

        # Assign the best engineer
        if suitable_engineers:
            assigned_engineer = suitable_engineers[0]
            assigned_engineer["availability"] = "busy"  # Update availability
            print(f"Task {task['task_id']} assigned to Engineer {assigned_engineer['engineer_id']}")
            return assigned_engineer
        else:
            print(f"No suitable engineer found for Task {task['task_id']}")
            return {"status": "reschedule", "reason": "No suitable engineers available"}
    except Exception as e:
        print(f"Error scheduling task: {e}")
        return None
