import optuna
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

# Objective function for Optuna
def objective(trial):
    # Define the search space
    n_estimators = trial.suggest_int("n_estimators", 50, 500)
    max_depth = trial.suggest_int("max_depth", 2, 20)
    learning_rate = trial.suggest_float("learning_rate", 0.01, 0.3)
    subsample = trial.suggest_float("subsample", 0.6, 1.0)
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train model with sampled hyperparameters
    model = GradientBoostingRegressor(
        n_estimators=n_estimators,
        max_depth=max_depth,
        learning_rate=learning_rate,
        subsample=subsample,
        random_state=42
    )
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    
    # Evaluate performance
    mse = mean_squared_error(y_test, y_pred)
    return mse

# Run the optimisation
study = optuna.create_study(direction="minimize")
study.optimize(objective, n_trials=50)

# Best parameters and score
print("Best Parameters:", study.best_params)
print("Best MSE:", study.best_value)

# Train final model with best parameters
best_params = study.best_params
final_model = GradientBoostingRegressor(**best_params, random_state=42)
final_model.fit(X, y)
