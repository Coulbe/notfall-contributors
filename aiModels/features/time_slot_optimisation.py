def optimise_time_slots(task_time, engineer_schedule):
    """
    Matches the task's time slot with the engineer's available schedule.
    - task_time: Requested time for the task.
    - engineer_schedule: List of available time slots for the engineer.

    Returns:
    1 if the time slots overlap, otherwise 0.
    """
    for slot in engineer_schedule:
        if task_time in slot:
            return 1
    return 0
