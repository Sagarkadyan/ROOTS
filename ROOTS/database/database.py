import sqlite3
import os
import time

# Use absolute paths for the databases
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'users.db')
COURSES_DB_PATH = os.path.join(BASE_DIR, 'courses.db')

def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    return conn

def get_courses_db():
    conn = sqlite3.connect(COURSES_DB_PATH, check_same_thread=False)
    return conn

def init_db():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            number TEXT
        )
        ''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS otps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            identifier TEXT NOT NULL,
            otp TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        conn.commit()

# Call init_db on module import
init_db()

def adder(name, email, password, number):
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO users (name, email, password, number) VALUES (?, ?, ?, ?)",
                (name, email, password, number)
            )
            conn.commit()
            return "Inserted successfully!"
    except sqlite3.IntegrityError:
        return "Email already exists."

def check_password(name, user_password):
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT password FROM users WHERE name = ?", (name,)
            )
            row = cursor.fetchone()
            if row is None:
                return "user not found"
            stored_password = row[0]
            if stored_password == user_password:
                return "correct pass"
            else:
                return "wrong pass"
    except Exception as e:
        return f"invalid pass: {e}"

def update_pss(name, new_passwd):
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "UPDATE users SET password = ? WHERE name = ?",
                (new_passwd, name)
            )
            conn.commit()
            if cursor.rowcount == 0:
                return "user does not exist"
            else:
                return "password updated successfully"
    except Exception as e:
        return f"error: {e}"

def delete_user(name):
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "DELETE FROM users WHERE name = ?",
                (name,)
            )
            conn.commit()
            if cursor.rowcount == 0:
                return "user does not exist"
            else:
                return "user deleted successfully"
    except Exception as e:
        return f"error: {e}"

def store_otp(identifier, otp):
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            # Delete old OTPs for this identifier first
            cursor.execute("DELETE FROM otps WHERE identifier = ?", (identifier,))
            cursor.execute(
                "INSERT INTO otps (identifier, otp) VALUES (?, ?)",
                (identifier, otp)
            )
            conn.commit()
            return True
    except Exception as e:
        print(f"Error storing OTP: {e}")
        return False

def verify_otp(identifier, otp):
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT otp FROM otps WHERE identifier = ? ORDER BY timestamp DESC LIMIT 1",
                (identifier,)
            )
            row = cursor.fetchone()
            if row and row[0] == otp:
                # Delete OTP after successful verification
                cursor.execute("DELETE FROM otps WHERE identifier = ?", (identifier,))
                conn.commit()
                return True
            return False
    except Exception as e:
        print(f"Error verifying OTP: {e}")
        return False

def get_user_by_identifier(identifier):
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT name FROM users WHERE email = ? OR number = ?",
                (identifier, identifier)
            )
            row = cursor.fetchone()
            return row[0] if row else None
    except Exception as e:
        print(f"Error getting user: {e}")
        return None

# --- Course related functions ---

def search_courses(topic):
    try:
        with get_courses_db() as conn:
            cursor = conn.cursor()
            query = f"%{topic}%"
            cursor.execute(
                "SELECT platform, title, url FROM courses WHERE title LIKE ? ORDER BY id DESC",
                (query,)
            )
            rows = cursor.fetchall()
            return [{"platform": r[0], "title": r[1], "url": r[2]} for r in rows]
    except Exception as e:
        print(f"Error searching courses: {e}")
        return []

def get_all_courses():
    try:
        with get_courses_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT platform, title, url FROM courses ORDER BY id DESC"
            )
            rows = cursor.fetchall()
            return [{"platform": r[0], "title": r[1], "url": r[2]} for r in rows]
    except Exception as e:
        print(f"Error getting all courses: {e}")
        return []

if __name__ == "__main__":
    init_db()
