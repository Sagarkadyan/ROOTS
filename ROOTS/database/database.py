import sqlite3

conn = sqlite3.connect('users.db')
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
conn.commit()


def adder(name,email,password,number):
    try:
        cursor.execute(
            "INSERT INTO users (name, email, password, number) VALUES (?, ?, ?, ?)",
            (name, email, password, number)
        )
        conn.commit()
        return("Inserted successfully!")
    except sqlite3.IntegrityError:
        return("Email already exists.")


def check_password( name, user_password):
    try:
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
if __name__== "__main__":
    conn.close()
