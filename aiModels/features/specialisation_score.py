def calculate_specialisation_score(engineer_certifications, task_requirements):
    """
    Calculates a specialisation score based on:
    - engineer_certifications: List of engineer's certifications.
    - task_requirements: List of task-specific requirements.

    The score is the ratio of matching certifications to the total required.
    """
    score = 0
    for cert in engineer_certifications:
        if cert in task_requirements:
            score += 1
    return score / len(task_requirements) if task_requirements else 0
