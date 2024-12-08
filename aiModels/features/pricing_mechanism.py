def calculate_dynamic_rate(hourly_rate, urgency, experience_years):
    """
    Calculates a dynamic hourly rate based on:
    - hourly_rate: Base rate of the engineer.
    - urgency: Urgency level of the task ('urgent' or 'non-urgent').
    - experience_years: Engineer's experience in years.

    Urgent tasks increase the rate by 20%.
    Each year of experience adds a 1% increase to the rate.
    """
    urgency_multiplier = 1.2 if urgency == "urgent" else 1.0
    experience_multiplier = 1 + (experience_years / 100)
    return hourly_rate * urgency_multiplier * experience_multiplier
