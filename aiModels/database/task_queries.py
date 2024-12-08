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


# Task-related operations

def create_task(task_data):
    """
    Adds a new task to the database.

    Parameters:
        task_data (dict): Task details (task_id, title, description, assigned_to, status, created_at).
    """
    query = """
        INSERT INTO tasks (task_id, title, description, assigned_to, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """
    params = (
        task_data["task_id"],
        task_data["title"],
        task_data["description"],
        task_data.get("assigned_to"),
        task_data["status"],
        task_data["created_at"],
    )
    execute_query(query, params)


def get_task_by_id(task_id):
    """
    Fetches task details by task ID.

    Parameters:
        task_id (str): Unique ID of the task.

    Returns:
        dict or None: Task details if found, otherwise None.
    """
    query = "SELECT * FROM tasks WHERE task_id = ?"
    result = execute_query(query, (task_id,), fetch=True)
    if result:
        row = result[0]
        return {
            "task_id": row[0],
            "title": row[1],
            "description": row[2],
            "assigned_to": row[3],
            "status": row[4],
            "created_at": row[5],
        }
    return None


def update_task_status(task_id, status):
    """
    Updates the status of a task.

    Parameters:
        task_id (str): Unique ID of the task.
        status (str): New status to set for the task.
    """
    query = "UPDATE tasks SET status = ? WHERE task_id = ?"
    execute_query(query, (status, task_id))


def delete_task(task_id):
    """
    Deletes a task from the database.

    Parameters:
        task_id (str): Unique ID of the task to delete.
    """
    query = "DELETE FROM tasks WHERE task_id = ?"
    execute_query(query, (task_id,))


def fetch_all_tasks(limit=None, offset=None):
    """
    Fetches all tasks with optional pagination.

    Parameters:
        limit (int): Number of tasks to fetch (default: None, fetch all).
        offset (int): Number of tasks to skip (default: None, no offset).

    Returns:
        list[dict]: List of task details.
    """
    query = "SELECT * FROM tasks"
    if limit is not None and offset is not None:
        query += " LIMIT ? OFFSET ?"
        results = execute_query(query, (limit, offset), fetch=True)
    else:
        results = execute_query(query, fetch=True)

    return [
        {
            "task_id": row[0],
            "title": row[1],
            "description": row[2],
            "assigned_to": row[3],
            "status": row[4],
            "created_at": row[5],
        }
        for row in results
    ]


# Utility Functions for Schema Management

def initialise_database():
    """
    Creates the tasks table if it doesn't exist.
    """
    query = """
    CREATE TABLE IF NOT EXISTS tasks (
        task_id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        assigned_to TEXT,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
    """
    execute_query(query)


# Initialise the database schema on import
initialise_database()
