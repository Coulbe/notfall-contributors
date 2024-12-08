import os

class Config:
    """
    Centralised configuration class for the Notfall Engineers system.
    This class manages all configurable settings, including paths, hyperparameters,
    notification modes, and environmental configurations.
    """

    # General Settings
    DEBUG = os.getenv("DEBUG", True)  # Enable or disable debug mode (default: True)
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Base directory of the project
    LOG_DIR = os.path.join(BASE_DIR, "../logs")  # Directory for storing log files
    DATA_DIR = os.path.join(BASE_DIR, "../data")  # Directory for storing data files
    MODELS_DIR = os.path.join(BASE_DIR, "../models")  # Directory for storing machine learning models

    # Retraining Settings
    RETRAINING_LOG = os.path.join(LOG_DIR, "retraining_log.json")  # Path to retraining log file
    RETRAINING_DATA_PATH = os.path.join(DATA_DIR, "updated_sla_data.csv")  # Path to updated training data
    EXISTING_MODEL_PATH = os.path.join(MODELS_DIR, "sla_model.joblib")  # Path to the current SLA model
    RETRAINED_MODEL_PATH = os.path.join(MODELS_DIR, "retrained_sla_model.joblib")  # Path to save retrained SLA model

    # Default Hyperparameters for Models
    DEFAULT_HYPERPARAMETERS = {
        "n_estimators": 100,  # Number of decision trees in the ensemble
        "max_depth": None,  # Maximum depth of a decision tree (None for unlimited depth)
        "min_samples_split": 2,  # Minimum number of samples required to split a node
        "min_samples_leaf": 1,  # Minimum number of samples required at a leaf node
        "random_state": 42,  # Seed for random number generator
    }

    # Dashboard Configuration
    DASHBOARD_REFRESH_INTERVAL = int(os.getenv("DASHBOARD_REFRESH_INTERVAL", 10))  # Refresh interval in seconds

    # Notification Service
    NOTIFICATION_MODE = os.getenv("NOTIFICATION_MODE", "email")  # Notification mode (options: email, sms, websocket)
    EMAIL_SETTINGS = {
        "SMTP_SERVER": os.getenv("SMTP_SERVER", "smtp.example.com"),
        "SMTP_PORT": int(os.getenv("SMTP_PORT", 587)),
        "EMAIL_USERNAME": os.getenv("EMAIL_USERNAME", "user@example.com"),
        "EMAIL_PASSWORD": os.getenv("EMAIL_PASSWORD", "password"),
    }
    SMS_SETTINGS = {
        "API_URL": os.getenv("SMS_API_URL", "https://api.smsprovider.com/send"),
        "API_KEY": os.getenv("SMS_API_KEY", "your_sms_api_key"),
    }
    WEBSOCKET_SETTINGS = {
        "SERVER_URL": os.getenv("WEBSOCKET_SERVER_URL", "ws://localhost:8000"),
    }

    # SLA Compliance Settings
    SLA_COMPLIANCE_THRESHOLD = float(os.getenv("SLA_COMPLIANCE_THRESHOLD", 0.8))  # SLA compliance threshold (default: 0.8)

    # Advanced Settings
    ENABLE_HYPERPARAMETER_TUNING = bool(os.getenv("ENABLE_HYPERPARAMETER_TUNING", True))  # Enable hyperparameter tuning

    # Environment Configuration
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")  # Current environment (development, staging, production)
    if ENVIRONMENT == "production":
        DEBUG = False  # Disable debug mode in production
        LOG_DIR = "/var/log/notfall-engineers"  # Update log directory for production

    @staticmethod
    def print_config():
        """
        Print all current configuration settings for debugging and verification purposes.

        This method iterates through all attributes of the Config class and displays
        their values, excluding internal methods and variables.
        """
        print("Current Configuration Settings:")
        for key, value in Config.__dict__.items():
            if not key.startswith("__") and not callable(value):
                print(f"{key}: {value}")

    @staticmethod
    def get_email_settings():
        """
        Retrieve email configuration settings.

        Returns:
            dict: Email settings for the notification service.
        """
        return Config.EMAIL_SETTINGS

    @staticmethod
    def get_sms_settings():
        """
        Retrieve SMS configuration settings.

        Returns:
            dict: SMS settings for the notification service.
        """
        return Config.SMS_SETTINGS

    @staticmethod
    def get_websocket_settings():
        """
        Retrieve WebSocket configuration settings.

        Returns:
            dict: WebSocket settings for the notification service.
        """
        return Config.WEBSOCKET_SETTINGS

    @staticmethod
    def get_environment():
        """
        Retrieve the current environment setting.

        Returns:
            str: Current environment (development, staging, production).
        """
        return Config.ENVIRONMENT
