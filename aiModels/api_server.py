from flask import Flask, request, jsonify
from joblib import load
from config.config import Config
from retraining.retrain_model import retrain_model, log_retraining_results

# Initialise Flask application
app = Flask(__name__)

# Load existing models
models = {
    "sla_model": load(Config.EXISTING_MODEL_PATH)
}

@app.route("/predict_sla", methods=["POST"])
def predict_sla():
    """
    Endpoint to predict SLA compliance based on task features.
    Expects a JSON payload with task attributes.
    
    Returns:
        JSON response with the SLA violation prediction.
    """
    try:
        data = request.json
        required_features = ["urgency", "budget", "task_duration", "engineer_rating"]

        # Ensure required features are present
        for feature in required_features:
            if feature not in data:
                return jsonify({"error": f"Missing feature: {feature}"}), 400

        # Prepare data for prediction
        features = [[data[feature] for feature in required_features]]
        model = models["sla_model"]
        prediction = model.predict(features)[0]

        return jsonify({
            "sla_violated": bool(prediction),
            "message": "SLA violation predicted" if prediction else "SLA compliance predicted"
        })
    except Exception as e:
        return jsonify({"error": f"Error predicting SLA: {e}"}), 500

@app.route("/retrain", methods=["POST"])
def retrain():
    """
    Endpoint to retrain the SLA prediction model using updated data.
    
    Returns:
        JSON response with retraining results.
    """
    try:
        retraining_results = retrain_model(
            Config.RETRAINING_DATA_PATH,
            Config.EXISTING_MODEL_PATH,
            Config.RETRAINED_MODEL_PATH
        )
        if retraining_results:
            log_retraining_results(retraining_results, Config.RETRAINING_LOG)
            # Reload model
            models["sla_model"] = load(Config.RETRAINED_MODEL_PATH)
            return jsonify({
                "message": "Retraining successful",
                "results": retraining_results
            })
        else:
            return jsonify({"error": "Retraining failed"}), 500
    except Exception as e:
        return jsonify({"error": f"Error during retraining: {e}"}), 500

@app.route("/health", methods=["GET"])
def health_check():
    """
    Health check endpoint to verify the API is running.
    
    Returns:
        JSON response with status message.
    """
    return jsonify({"status": "API is running", "models_loaded": list(models.keys())})

if __name__ == "__main__":
    app.run(debug=Config.DEBUG, host="0.0.0.0", port=5000)
