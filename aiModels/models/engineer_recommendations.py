import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def recommend_engineers(task, engineers):
    """
    Recommend the top engineers for a given task.

    Parameters:
        task (dict): Task details, including trade and location.
        engineers (list[dict]): List of engineer details.

    Returns:
        list[dict]: Top recommended engineers for the task.
    """
    try:
        # Create feature vectors
        task_vector = np.array([task["urgency"], task["budget"]])
        engineer_vectors = np.array([[e["rating"], e["hourly_rate"]] for e in engineers])

        # Compute similarity
        similarities = cosine_similarity([task_vector], engineer_vectors)[0]

        # Rank engineers by similarity and certifications
        ranked_engineers = sorted(
            zip(similarities, engineers),
            key=lambda x: (-x[0], -len(x[1].get("certifications", [])))  # Higher certifications preferred
        )
        return [engineer for _, engineer in ranked_engineers[:5]]
    except Exception as e:
        print(f"Error recommending engineers: {e}")
        return []
