import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
from joblib import dump, load

def train_sla_model(data, model_path="sla_model.joblib"):
    """
    Train a predictive SLA model using historical task data.

    Parameters:
        data (pd.DataFrame): DataFrame containing historical task data.
        model_path (str): Path to save the trained model.

    Returns:
        RandomForestClassifier: Trained SLA prediction model.
    """
    try:
        # Feature engineering
        X = data[["urgency", "budget", "task_duration", "engineer_rating"]]
        y = data["sla_violated"]  # 1 if SLA was violated, 0 otherwise

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Train model
        model = RandomForestClassifier(random_state=42)
        model.fit(X_train, y_train)

        # Evaluate model
        predictions = model.predict(X_test)
        print(classification_report(y_test, predictions))
        print("Confusion Matrix:")
        print(confusion_matrix(y_test, predictions))

        # Save model
        dump(model, model_path)
        print(f"Model saved to {model_path}")

        return model
    except Exception as e:
        print(f"Error training SLA model: {e}")
        return None

def load_sla_model(model_path="sla_model.joblib"):
    """
    Load a pre-trained SLA prediction model.

    Parameters:
        model_path (str): Path to the saved model.

    Returns:
        RandomForestClassifier: Loaded SLA prediction model.
    """
    try:
        model = load(model_path)
        print(f"Model loaded from {model_path}")
        return model
    except Exception as e:
        print(f"Error loading SLA model: {e}")
        return None

def feature_importance(model, feature_names):
    """
    Display feature importance for the SLA model.

    Parameters:
        model (RandomForestClassifier): Trained SLA prediction model.
        feature_names (list[str]): List of feature names.

    Returns:
        dict: Feature importance rankings.
    """
    try:
        importances = model.feature_importances_
        importance_dict = {feature: round(importance, 3) for feature, importance in zip(feature_names, importances)}
        return sorted(importance_dict.items(), key=lambda x: -x[1])
    except Exception as e:
        print(f"Error calculating feature importance: {e}")
        return {}
