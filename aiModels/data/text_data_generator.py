import pandas as pd
import numpy as np

def generate_text_data(num_tasks=1000):
    """
    Generates synthetic text data for tasks and engineer feedback.

    Parameters:
        num_tasks (int): Number of text records to generate.

    Returns:
        pd.DataFrame: DataFrame containing task descriptions and feedback.
    """
    np.random.seed(42)  # Ensure reproducibility

    task_descriptions = [
        "Fix water leakage near the boiler due to rusted pipes",
        "Install new electrical wiring for energy-efficient lighting",
        "Repair HVAC system and replace faulty filters",
        "Install solar panels with an inverter system for backup",
        "Fix wooden cabinet and apply water-resistant coating"
    ]

    engineer_feedback = [
        "Completed successfully without delays. Client satisfied.",
        "Minor delays due to traffic but task completed.",
        "Parts unavailable; awaiting client approval for replacements.",
        "Task completed ahead of schedule with no issues.",
        "Delays caused by bad weather but client notified promptly."
    ]

    return pd.DataFrame({
        "task_id": [f"T{i}" for i in range(1, num_tasks + 1)],
        "task_description": np.random.choice(task_descriptions, num_tasks),
        "engineer_feedback": np.random.choice(engineer_feedback, num_tasks),
    })
