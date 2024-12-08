import sqlite3
from datetime import datetime

def get_database_name():
    """
    Returns the name of the SQLite database file.
    """
    return "tasks.db"

def connect_to_database():
    """
    Establishes a connection to the SQLite database.

    Returns:
        sqlite3.Connection: Database connection object.
    """
    try:
        return sqlite3.connect(get_database_name())
    except sqlite3.Error as e:
        print(f"Error connecting to the database: {e}")
        return None

def execute_query(query, params=None, fetch=False):
    """
    Executes a SQL query and optionally fetches results.

    Parameters:
        query (str): SQL query to execute.
        params (tuple): Parameters for the SQL query (default: None).
        fetch (bool): Whether to fetch results (default: False).

    Returns:
        list or None: Query results if fetch=True, otherwise None.
    """
    try:
        with connect_to_database() as conn:
            cursor = conn.cursor()
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            if fetch:
                return cursor.fetchall()
            conn.commit()
    except sqlite3.Error as e:
        print(f"Error executing query: {e}")
    return None

# Logging-related functions

def log_event(user_id, action, details):
    """
    Log an event in the audit log.

    Parameters:
        user_id (str): ID of the user responsible for the event.
        action (str): Action performed (e.g., "add_task", "update_trade").
        details (str): Additional details about the event.
    """
    query = """
        INSERT INTO audit_logs (timestamp, user_id, action, details)
        VALUES (?, ?, ?, ?)
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    params = (timestamp, user_id, action, details)
    execute_query(query, params)

def fetch_all_logs(limit=None, offset=None):
    """
    Fetch all logs from the audit log table with optional pagination.

    Parameters:
        limit (int): Number of logs to fetch (default: None, fetch all).
        offset (int): Number of logs to skip (default: None, no offset).

    Returns:
        list[dict]: List of log entries.
    """
    query = "SELECT * FROM audit_logs"
    if limit is not None and offset is not None:
        query += " LIMIT ? OFFSET ?"
        params = (limit, offset)
        rows = execute_query(query, params, fetch=True)
    else:
        rows = execute_query(query, fetch=True)

    return [
        {"log_id": row[0], "timestamp": row[1], "user_id": row[2], "action": row[3], "details": row[4]}
        for row in rows
    ] if rows else []

def fetch_logs_by_user(user_id, limit=None, offset=None):
    """
    Fetch logs for a specific user with optional pagination.

    Parameters:
        user_id (str): ID of the user to filter logs by.
        limit (int): Number of logs to fetch (default: None, fetch all).
        offset (int): Number of logs to skip (default: None, no offset).

    Returns:
        list[dict]: List of log entries for the specified user.
    """
    query = "SELECT * FROM audit_logs WHERE user_id = ?"
    if limit is not None and offset is not None:
        query += " LIMIT ? OFFSET ?"
        params = (user_id, limit, offset)
    else:
        params = (user_id,)
    rows = execute_query(query, params, fetch=True)

    return [
        {"log_id": row[0], "timestamp": row[1], "user_id": row[2], "action": row[3], "details": row[4]}
        for row in rows
    ] if rows else []

def fetch_logs_by_action(action, limit=None, offset=None):
    """
    Fetch logs for a specific action with optional pagination.

    Parameters:
        action (str): Action to filter logs by.
        limit (int): Number of logs to fetch (default: None, fetch all).
        offset (int): Number of logs to skip (default: None, no offset).

    Returns:
        list[dict]: List of log entries for the specified action.
    """
    query = "SELECT * FROM audit_logs WHERE action = ?"
    if limit is not None and offset is not None:
        query += " LIMIT ? OFFSET ?"
        params = (action, limit, offset)
    else:
        params = (action,)
    rows = execute_query(query, params, fetch=True)

    return [
        {"log_id": row[0], "timestamp": row[1], "user_id": row[2], "action": row[3], "details": row[4]}
        for row in rows
    ] if rows else []

def fetch_logs_by_timeframe(start_time, end_time, limit=None, offset=None):
    """
    Fetch logs within a specific timeframe with optional pagination.

    Parameters:
        start_time (str): Start timestamp (e.g., "2023-01-01 00:00:00").
        end_time (str): End timestamp (e.g., "2023-01-31 23:59:59").
        limit (int): Number of logs to fetch (default: None, fetch all).
        offset (int): Number of logs to skip (default: None, no offset).

    Returns:
        list[dict]: List of log entries within the specified timeframe.
    """
    query = "SELECT * FROM audit_logs WHERE timestamp BETWEEN ? AND ?"
    if limit is not None and offset is not None:
        query += " LIMIT ? OFFSET ?"
        params = (start_time, end_time, limit, offset)
    else:
        params = (start_time, end_time)
    rows = execute_query(query, params, fetch=True)

    return [
        {"log_id": row[0], "timestamp": row[1], "user_id": row[2], "action": row[3], "details": row[4]}
        for row in rows
    ] if rows else []
