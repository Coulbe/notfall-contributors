import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
from joblib import dump, load
import datetime
import json
import matplotlib.pyplot as plt

def load_existing_model(model_path):
    """
    Load the existing model for evaluation and comparison.

    Parameters:
        model_path (str): Path to the saved model.

    Returns:
        RandomForestClassifier: Loaded model instance or None if loading fails.
    """
    try:
        model = load(model_path)
        print(f"Model loaded successfully from {model_path}")
        return model
    except Exception as e:
        print(f"Error loading model: {e}")
        return None

def retrain_model(data_path, model_path, output_path="retrained_model.joblib"):
    """
    Retrain a machine learning model using updated data and tune hyperparameters.

    Parameters:
        data_path (str): Path to the CSV file containing updated training data.
        model_path (str): Path to the existing model.
        output_path (str): Path to save the retrained model.

    Returns:
        dict: Retraining results, including performance metrics and metadata.
    """
    try:
        # Load data
        data = pd.read_csv(data_path)
        X = data[["urgency", "budget", "task_duration", "engineer_rating"]]
        y = data["sla_violated"]

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Load existing model
        existing_model = load_existing_model(model_path)

        # Evaluate existing model
        if existing_model:
            existing_predictions = existing_model.predict(X_test)
            existing_accuracy = accuracy_score(y_test, existing_predictions)
            print(f"Existing model accuracy: {existing_accuracy}")
        else:
            existing_accuracy = None

        # Retrain model with hyperparameter tuning
        param_grid = {
            "n_estimators": [100, 200],
            "max_depth": [None, 10, 20],
            "min_samples_split": [2, 5],
            "min_samples_leaf": [1, 2],
        }
        rf = RandomForestClassifier(random_state=42)
        grid_search = GridSearchCV(rf, param_grid, cv=3, n_jobs=-1, scoring="accuracy")
        grid_search.fit(X_train, y_train)

        best_model = grid_search.best_estimator_
        retrained_accuracy = grid_search.best_score_
        print(f"Retrained model accuracy (cross-validated): {retrained_accuracy}")
        print("Classification Report on Test Set:")
        print(classification_report(y_test, best_model.predict(X_test)))

        # Save retrained model
        dump(best_model, output_path)
        print(f"Retrained model saved to {output_path}")

        # Feature importance
        plot_feature_importance(best_model, X.columns)

        # Metadata
        metadata = {
            "existing_accuracy": existing_accuracy,
            "retrained_accuracy": retrained_accuracy,
            "best_params": grid_search.best_params_,
            "model_path": output_path,
            "retraining_timestamp": datetime.datetime.now().isoformat(),
        }

        return metadata
    except Exception as e:
        print(f"Error during retraining: {e}")
        return None

def plot_feature_importance(model, feature_names):
    """
    Visualise feature importance for the retrained model.

    Parameters:
        model (RandomForestClassifier): Trained model.
        feature_names (list): List of feature names.
    """
    try:
        importance = model.feature_importances_
        sorted_indices = importance.argsort()

        plt.figure(figsize=(10, 6))
        plt.barh(range(len(sorted_indices)), importance[sorted_indices], align="center")
        plt.yticks(range(len(sorted_indices)), [feature_names[i] for i in sorted_indices])
        plt.title("Feature Importance")
        plt.xlabel("Importance")
        plt.ylabel("Features")
        plt.show()
    except Exception as e:
        print(f"Error plotting feature importance: {e}")

def log_retraining_results(results, log_path="retraining_log.json"):
    """
    Log the retraining results with metadata for auditing and tracking.

    Parameters:
        results (dict): Retraining results, including performance metrics and metadata.
        log_path (str): Path to the log file.
    """
    try:
        with open(log_path, "a") as log_file:
            json.dump(results, log_file)
            log_file.write("\n")
            print(f"Retraining results logged in {log_path}")
    except Exception as e:
        print(f"Error logging retraining results: {e}")
