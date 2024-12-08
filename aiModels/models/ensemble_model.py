def weighted_ensemble_predictions(predictions, weights):
    """
    Combine predictions from multiple models using a weighted ensemble approach.

    Parameters:
        predictions (list[float]): List of prediction scores from different models.
        weights (list[float]): Weights for each model's prediction.

    Returns:
        float: Final weighted ensemble score.
    """
    try:
        weighted_score = sum(p * w for p, w in zip(predictions, weights)) / sum(weights)
        return weighted_score
    except Exception as e:
        print(f"Error in ensemble predictions: {e}")
        return 0.0
