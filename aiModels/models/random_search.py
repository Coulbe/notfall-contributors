import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.metrics import mean_squared_error

# Generate synthetic dataset
np.random.seed(42)
match_df = pd.DataFrame({
    "distance": np.random.uniform(0, 100, 1000),
    "travel_time": np.random.uniform(0, 120, 1000),
    "dynamic_rate": np.random.uniform(20, 80, 1000),
    "specialisation_score": np.random.uniform(0, 1, 1000),
    "time_slot_match": np.random.choice([0, 1], 1000),
    "rating": np.random.uniform(3.0, 5.0, 1000),
    "match_score": np.random.uniform(0, 1, 1000)  # Target variable
})

# Features and target
X = match_df[["distance", "travel_time", "dynamic_rate", "specialisation_score", "time_slot_match", "rating"]]
y = match_df["match_score"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Hyperparameter search space
param_dist = {
    "n_estimators": [50, 100, 200],
    "max_depth": [3, 5, 10, None],
    "learning_rate": np.linspace(0.01, 0.3, 10),
    "subsample": [0.6, 0.8, 1.0]
}

# Initialise Gradient Boosting model
gbm = GradientBoostingRegressor(random_state=42)

# Random search with cross-validation
random_search = RandomizedSearchCV(
    estimator=gbm,
    param_distributions=param_dist,
    n_iter=50,  # Number of random combinations
    scoring="neg_mean_squared_error",  # Evaluation metric
    cv=3,  # 3-fold cross-validation
    random_state=42,
    verbose=1,
    n_jobs=-1  # Parallelism
)

# Fit the random search
random_search.fit(X_train, y_train)

# Best parameters and performance
print("Best Parameters:", random_search.best_params_)
print("Best CV Score:", -random_search.best_score_)

# Evaluate on the test set
best_model = random_search.best_estimator_
y_pred = best_model.predict(X_test)
test_mse = mean_squared_error(y_test, y_pred)
print("Test Set MSE:", test_mse)
