import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_tasks(num_tasks=1000):
    """
    Generates synthetic tasks for testing and development.

    Parameters:
        num_tasks (int): Number of tasks to generate.

    Returns:
        pd.DataFrame: DataFrame containing generated task details.
    """
    np.random.seed(42)  # Ensure reproducibility

    trades = ["plumbing", "electrical", "HVAC", "solar", "carpentry", "painting", "roofing"]
    locations = ["Area1", "Area2", "Area3", "Area4", "Area5"]
    urgency_levels = ["urgent", "non-urgent"]
    time_slots = ["morning", "afternoon", "evening"]

    current_time = datetime.now()

    tasks = pd.DataFrame({
        "task_id": [f"T{i}" for i in range(1, num_tasks + 1)],
        "trade": np.random.choice(trades, num_tasks),
        "location": np.random.choice(locations, num_tasks),
        "budget": np.random.randint(50, 500, num_tasks),
        "urgency": np.random.choice(urgency_levels, num_tasks),
        "time_slot": np.random.choice(time_slots, num_tasks),
        "description": [
            f"{trade.capitalize()} task in {location}" 
            for trade, location in zip(
                np.random.choice(trades, num_tasks), 
                np.random.choice(locations, num_tasks)
            )
        ],
        # Randomised task creation timestamps
        "created_at": [current_time - timedelta(days=np.random.randint(0, 30)) for _ in range(num_tasks)],
        # Dynamic deadlines based on urgency
        "deadline": [
            current_time + timedelta(hours=2 if urgency == "urgent" else 48)
            for urgency in np.random.choice(urgency_levels, num_tasks)
        ]
    })

    return tasks
