import sqlite3

DB_NAME = "tasks.db"

def init_db():
    """
    Initialise the database schema by creating required tables.
    Ensures the schema is ready for the application to use.
    """
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # Create users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            role TEXT CHECK(role IN ('engineer', 'business', 'homeowner', 'property_manager', 'tenant')),
            associated_property_manager TEXT REFERENCES users(user_id) NULL
        )
    """)

      # Create or modify engineers table to include certifications
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS engineers (
            engineer_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            expertise TEXT NOT NULL, -- Comma-separated list of trades
            location TEXT NOT NULL,
            availability TEXT CHECK(availability IN ('available', 'busy')) NOT NULL,
            hourly_rate REAL NOT NULL,
            experience_years INTEGER NOT NULL,
            rating REAL CHECK(rating >= 0 AND rating <= 5),
            certifications TEXT -- Comma-separated list of certifications
        )
    """)

    # Create tasks table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            task_id TEXT PRIMARY KEY,
            user_name TEXT REFERENCES users(user_id),
            trade TEXT NOT NULL,
            location TEXT NOT NULL,
            budget REAL CHECK(budget > 0) NOT NULL,
            urgency TEXT CHECK(urgency IN ('urgent', 'non-urgent')) NOT NULL,
            time_slot TEXT CHECK(time_slot IN ('morning', 'afternoon', 'evening')) NOT NULL,
            description TEXT NOT NULL,
            created_at TEXT NOT NULL,
            deadline TEXT NOT NULL,
            status TEXT CHECK(status IN ('pending', 'approved', 'rejected', 'assigned')) NOT NULL
        )
    """)

    # Create task authorisation table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS task_authorisation (
            task_id TEXT PRIMARY KEY REFERENCES tasks(task_id),
            status TEXT CHECK(status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
            authorised_by TEXT REFERENCES users(user_id)
        )
    """)

    # Create audit logs table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS audit_logs (
            log_id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT DEFAULT (datetime('now')),
            event TEXT NOT NULL
        )
    """)

    # Create indexes for performance
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks (status)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_engineers_location ON engineers (location)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_role ON users (role)")

    conn.commit()
    conn.close()

def execute_transaction(queries):
    """
    Execute a series of database operations as a single transaction.

    Parameters:
        queries (list[tuple]): List of (SQL, parameters) tuples.
    """
    conn = sqlite3.connect(DB_NAME)
    try:
        cursor = conn.cursor()
        for query, params in queries:
            cursor.execute(query, params)
        conn.commit()
    except sqlite3.Error as e:
        conn.rollback()
        raise RuntimeError(f"Transaction failed: {e}")
    finally:
        conn.close()
