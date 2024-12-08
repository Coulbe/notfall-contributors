import pandas as pd
import numpy as np

def generate_engineers(num_engineers=200):
    """
    Generates synthetic engineers for testing and development.

    Parameters:
        num_engineers (int): Number of engineers to generate.

    Returns:
        pd.DataFrame: DataFrame containing generated engineer details.
    """
    np.random.seed(42)  # Ensure reproducibility

    trades = ["plumbing", "electrical", "HVAC", "solar", "carpentry", "painting", "roofing"]
    locations = ["Area1", "Area2", "Area3", "Area4", "Area5"]

    engineers = pd.DataFrame({
        "engineer_id": [f"E{i}" for i in range(1, num_engineers + 1)],
        "name": [f"Engineer_{i}" for i in range(1, num_engineers + 1)],
        # Assign multiple expertise fields to each engineer
        "expertise": [
            np.random.choice(trades, np.random.randint(1, 3), replace=False).tolist()
            for _ in range(num_engineers)
        ],
        "location": np.random.choice(locations, num_engineers),
        "availability": np.random.choice(["available", "busy"], num_engineers),
        "hourly_rate": np.random.randint(20, 100, num_engineers),
        "experience_years": np.random.randint(1, 20, num_engineers),
        # Dynamic ratings based on experience
        "rating": [min(5.0, 3.0 + (exp / 10)) for exp in np.random.randint(1, 20, num_engineers)],
        "preferred_by_property_manager": np.random.choice([True, False], num_engineers, p=[0.2, 0.8])
    })

    return engineers
