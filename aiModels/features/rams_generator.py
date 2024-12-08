import json

def identify_risks(task):
    """
    Identify potential risks based on task details.

    Parameters:
        task (dict): Task details including trade and description.

    Returns:
        list[dict]: List of risks and mitigation strategies.
    """
    risks = []

    if "electrical" in task["trade"]:
        risks.append({"risk": "electrical shock", "mitigation": "use insulated gloves"})
    if "plumbing" in task["trade"]:
        risks.append({"risk": "water spillage", "mitigation": "ensure proper sealing"})

    # Add general risks
    risks.append({"risk": "slips and falls", "mitigation": "wear non-slip footwear"})
    return risks

def generate_rams(task):
    """
    Generate a RAMS document for a specific task.

    Parameters:
        task (dict): Task details, including trade, location, and task description.

    Returns:
        dict: RAMS document with risks and mitigation strategies.
    """
    rams = {
        "task_id": task["task_id"],
        "trade": task["trade"],
        "location": task["location"],
        "description": task["description"],
        "risks": identify_risks(task),
        "safety_measures": [
            "Wear PPE (Personal Protective Equipment)",
            "Follow all safety protocols",
            "Ensure proper use of tools and equipment"
        ]
    }
    return rams
