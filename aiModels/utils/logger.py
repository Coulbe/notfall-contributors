import logging
from logging.handlers import RotatingFileHandler

def setup_rotating_logger(name, log_file, max_bytes=5 * 1024 * 1024, backup_count=5, level=logging.INFO):
    """
    Set up a logger with log rotation.

    Parameters:
        name (str): Name of the logger.
        log_file (str): Path to the log file.
        max_bytes (int): Maximum size of a log file before rotation (default: 5MB).
        backup_count (int): Number of backup log files to keep (default: 5).
        level (int): Logging level (default: logging.INFO).

    Returns:
        logging.Logger: Configured rotating logger instance.
    """
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    handler = RotatingFileHandler(log_file, maxBytes=max_bytes, backupCount=backup_count)
    handler.setFormatter(formatter)

    logger = logging.getLogger(name)
    logger.setLevel(level)
    logger.addHandler(handler)

    return logger

# Example usage
logger = setup_rotating_logger("System Logger", "system.log")
logger.debug("Debugging SLA compliance checks.")
logger.info("SLA monitoring initialised.")
logger.error("Task assignment failed.")
