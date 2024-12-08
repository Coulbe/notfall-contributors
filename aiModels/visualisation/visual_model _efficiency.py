import matplotlib.pyplot as plt
import numpy as np
import time
from joblib import Parallel, delayed

# Simulating model efficiency measurement with synthetic data
task_counts = [100, 500, 1000, 2000, 5000]
engineer_counts = [50, 100, 200, 300, 500]
times = []

# Simulated compute_match function (representing parallelised computation)
def compute_match_simulated(task, engineer):
    time.sleep(0.00001)  # Simulate computation time for each task-engineer pair
    return task + engineer

# Measure execution time for different sizes
for task_count, engineer_count in zip(task_counts, engineer_counts):
    tasks = range(task_count)
    engineers = range(engineer_count)
    start_time = time.time()
    
    Parallel(n_jobs=-1)(
        delayed(compute_match_simulated)(task, engineer)
        for task in tasks
        for engineer in engineers
    )
    end_time = time.time()
    times.append(end_time - start_time)

# Visualise results
plt.figure(figsize=(10, 6))
plt.plot([t * e for t, e in zip(task_counts, engineer_counts)], times, marker='o')
plt.xlabel("Number of Task-Engineer Pairs", fontsize=12)
plt.ylabel("Execution Time (seconds)", fontsize=12)
plt.title("Model Efficiency: Execution Time vs. Task-Engineer Pair Count", fontsize=14)
plt.grid(True)
plt.show()
