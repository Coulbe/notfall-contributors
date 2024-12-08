import sqlite3

def get_database_name():
    """
    Returns the name of the SQLite database file.

    This function allows for future flexibility if the database name needs to be dynamically determined.
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
        print(f"Error connecting to database: {e}")
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

# Engineer-related operations

def add_engineer(engineer):
    """
    Add a new engineer to the database.

    Parameters:
        engineer (dict): Engineer details, including certifications.
    """
    query = """
        INSERT INTO engineers (engineer_id, name, expertise, location, availability, hourly_rate, experience_years, rating, certifications)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """
    params = (
        engineer["engineer_id"],
        engineer["name"],
        ",".join(engineer["expertise"]),
        engineer["location"],
        engineer["availability"],
        engineer["hourly_rate"],
        engineer["experience_years"],
        engineer["rating"],
        ",".join(engineer.get("certifications", []))
    )
    execute_query(query, params)

def fetch_all_engineers():
    """
    Fetch all engineers from the database.

    Returns:
        list[dict]: List of engineer details.
    """
    query = "SELECT * FROM engineers"
    rows = execute_query(query, fetch=True)

    return [
        {
            "engineer_id": row[0],
            "name": row[1],
            "expertise": row[2].split(","),
            "location": row[3],
            "availability": row[4],
            "hourly_rate": row[5],
            "experience_years": row[6],
            "rating": row[7],
            "certifications": row[8].split(",") if row[8] else []
        }
        for row in rows
    ] if rows else []

def update_engineer_availability(engineer_id, availability):
    """
    Update the availability of an engineer.

    Parameters:
        engineer_id (str): ID of the engineer to update.
        availability (str): New availability status ('available' or 'busy').
    """
    query = """
        UPDATE engineers
        SET availability = ?
        WHERE engineer_id = ?
    """
    params = (availability, engineer_id)
    execute_query(query, params)

# Trade-related operations

def add_trade(trade):
    """
    Add a new trade to the database.

    Parameters:
        trade (dict): Trade details (trade_id, name, description, hourly_rate_range).
    """
    query = """
        INSERT INTO trades (trade_id, name, description, hourly_rate_range)
        VALUES (?, ?, ?, ?)
    """
    params = (trade["trade_id"], trade["name"], trade["description"], trade["hourly_rate_range"])
    execute_query(query, params)

def fetch_all_trades():
    """
    Fetch all trades from the database.

    Returns:
        list[dict]: List of trade details.
    """
    query = "SELECT * FROM trades"
    rows = execute_query(query, fetch=True)

    return [
        {"trade_id": row[0], "name": row[1], "description": row[2], "hourly_rate_range": row[3]}
        for row in rows
    ] if rows else []

def fetch_trade_by_id(trade_id):
    """
    Fetch a trade by its ID.

    Parameters:
        trade_id (str): ID of the trade to fetch.

    Returns:
        dict: Trade details if found, otherwise None.
    """
    query = "SELECT * FROM trades WHERE trade_id = ?"
    params = (trade_id,)
    row = execute_query(query, params, fetch=True)

    if row:
        row = row[0]
        return {"trade_id": row[0], "name": row[1], "description": row[2], "hourly_rate_range": row[3]}
    return None

def update_trade(trade_id, trade_details):
    """
    Update the details of a trade.

    Parameters:
        trade_id (str): ID of the trade to update.
        trade_details (dict): Updated trade details.
    """
    query = """
        UPDATE trades
        SET name = ?, description = ?, hourly_rate_range = ?
        WHERE trade_id = ?
    """
    params = (
        trade_details["name"],
        trade_details["description"],
        trade_details["hourly_rate_range"],
        trade_id
    )
    execute_query(query, params)
