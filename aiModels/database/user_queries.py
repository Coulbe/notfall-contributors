import sqlite3

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

# User-related operations

def add_user(user):
    """
    Add a new user to the database.

    Parameters:
        user (dict): User details (user_id, name, role, associated_property_manager).
    """
    if user["role"] not in ["engineer", "business", "homeowner", "property_manager", "tenant"]:
        raise ValueError("Invalid role. Must be one of: 'engineer', 'business', 'homeowner', 'property_manager', 'tenant'.")
    
    query = """
        INSERT INTO users (user_id, name, role, associated_property_manager)
        VALUES (?, ?, ?, ?)
    """
    params = (
        user["user_id"],
        user["name"],
        user["role"],
        user.get("associated_property_manager", None)  # Nullable field
    )
    execute_query(query, params)

def fetch_all_users(limit=None, offset=None):
    """
    Fetch all users from the database with optional pagination.

    Parameters:
        limit (int): Number of users to fetch (default: None, fetch all).
        offset (int): Number of users to skip (default: None, no offset).

    Returns:
        list[dict]: List of user details.
    """
    query = "SELECT * FROM users"
    if limit is not None and offset is not None:
        query += " LIMIT ? OFFSET ?"
        params = (limit, offset)
        rows = execute_query(query, params, fetch=True)
    else:
        rows = execute_query(query, fetch=True)

    return [
        {"user_id": row[0], "name": row[1], "role": row[2], "associated_property_manager": row[3]}
        for row in rows
    ] if rows else []

def fetch_user_by_id(user_id):
    """
    Fetch user details by user ID.

    Parameters:
        user_id (str): ID of the user to fetch.

    Returns:
        dict: User details if found, otherwise None.
    """
    query = "SELECT * FROM users WHERE user_id = ?"
    params = (user_id,)
    row = execute_query(query, params, fetch=True)

    if row:
        row = row[0]
        return {"user_id": row[0], "name": row[1], "role": row[2], "associated_property_manager": row[3]}
    return None

def fetch_users_by_name(name, limit=None, offset=None):
    """
    Fetch users by partial name match with optional pagination.

    Parameters:
        name (str): Name to search for.
        limit (int): Number of users to fetch (default: None, fetch all).
        offset (int): Number of users to skip (default: None, no offset).

    Returns:
        list[dict]: List of user details matching the name.
    """
    query = "SELECT * FROM users WHERE name LIKE ?"
    if limit is not None and offset is not None:
        query += " LIMIT ? OFFSET ?"
        params = (f"%{name}%", limit, offset)
    else:
        params = (f"%{name}%",)
    rows = execute_query(query, params, fetch=True)

    return [
        {"user_id": row[0], "name": row[1], "role": row[2], "associated_property_manager": row[3]}
        for row in rows
    ] if rows else []

def fetch_users_by_roles(roles, limit=None, offset=None):
    """
    Fetch users by multiple roles with optional pagination.

    Parameters:
        roles (list[str]): List of roles to filter users by.
        limit (int): Number of users to fetch (default: None, fetch all).
        offset (int): Number of users to skip (default: None, no offset).

    Returns:
        list[dict]: List of users matching the specified roles.
    """
    placeholders = ",".join("?" for _ in roles)
    query = f"SELECT * FROM users WHERE role IN ({placeholders})"
    if limit is not None and offset is not None:
        query += " LIMIT ? OFFSET ?"
        params = (*roles, limit, offset)
    else:
        params = tuple(roles)
    rows = execute_query(query, params, fetch=True)

    return [
        {"user_id": row[0], "name": row[1], "role": row[2], "associated_property_manager": row[3]}
        for row in rows
    ] if rows else []

def update_user(user_id, updates):
    """
    Update user details.

    Parameters:
        user_id (str): ID of the user to update.
        updates (dict): Updated user details (e.g., name, role, associated_property_manager).
    """
    fields = []
    params = []

    if "name" in updates:
        fields.append("name = ?")
        params.append(updates["name"])
    if "role" in updates:
        if updates["role"] not in ["engineer", "business", "homeowner", "property_manager", "tenant"]:
            raise ValueError("Invalid role. Must be one of: 'engineer', 'business', 'homeowner', 'property_manager', 'tenant'.")
        fields.append("role = ?")
        params.append(updates["role"])
    if "associated_property_manager" in updates:
        fields.append("associated_property_manager = ?")
        params.append(updates["associated_property_manager"])

    params.append(user_id)

    query = f"UPDATE users SET {', '.join(fields)} WHERE user_id = ?"
    execute_query(query, tuple(params))

def delete_user(user_id):
    """
    Delete a user from the database.

    Parameters:
        user_id (str): ID of the user to delete.
    """
    query = "DELETE FROM users WHERE user_id = ?"
    params = (user_id,)
    execute_query(query, params)

def bulk_delete_users(user_ids):
    """
    Delete multiple users from the database.

    Parameters:
        user_ids (list[str]): List of user IDs to delete.
    """
    placeholders = ",".join("?" for _ in user_ids)
    query = f"DELETE FROM users WHERE user_id IN ({placeholders})"
    execute_query(query, tuple(user_ids))
