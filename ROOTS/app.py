from  database import adder,check_password,update_pss ,delete_user
from flask import Flask, request, redirect, url_for, session, render_template_string

app = Flask(__name__)
# Keep this secret in a real application!
app.secret_key = 'super_secret_development_key'

DB_FILE = 'users.db'

# Dictionary mapping course IDs to external video URLs
COURSE_LINKS = {
    "red_teaming_101": "https://www.youtube.com/watch?v=example1", 
    "bug_bounty_basics": "https://www.youtube.com/watch?v=example2",
    "roblox_game_dev": "https://www.youtube.com/watch?v=example3"
}

def get_db_connection():
    """Opens a fresh, thread-safe connection to your existing database."""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row # Allows us to access columns by name
    return conn

@app.route('/')
def home():
    if 'user_name' in session:
        return f"Welcome back, {session['user_name']}! <br><a href='/dashboard'>Go to Dashboard</a> | <a href='/logout'>Logout</a>"
    return "Welcome to the Learning Platform! <br><a href='/login'>Please Log In</a>"

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Your database uses 'name' for login checks based on your database.py
        name = request.form['name']
        password = request.form['password']
        check_password = ['password']
    # The Login Form
    login_form = '''
        <h2>Login</h2>
        <form method="post">
            <p><input type="text" name="name" placeholder="Name" required></p>
            <p><input type="password" name="password" placeholder="Password" required></p>
            <p><input type="submit" value="Login"></p>
        </form>
    '''
    return render_template_string(login_form)

@app.route('/logout')
def logout():
    session.pop('user_name', None)
    return redirect(url_for('home'))

@app.route('/dashboard')
def dashboard():
    # Protect route: must be logged in
    if 'user_name' not in session:
        return redirect(url_for('login'))
        
    dashboard_html = '''
        <h2>Your Course Dashboard</h2>
        <ul>
            <li><a href="/play/red_teaming_101">Red Teaming Fundamentals</a></li>
            <li><a href="/play/bug_bounty_basics">Web Bug Bounty Hunting</a></li>
            <li><a href="/play/roblox_game_dev">Roblox Game Development</a></li>
        </ul>
        <a href='/logout'>Logout</a>
    '''
    return render_template_string(dashboard_html)

@app.route('/play/<course_id>')
def play_course(course_id):
    # Protect route: must be logged in
    if 'user_name' not in session:
        return redirect(url_for('login'))
        
    # Check if the course exists in our dictionary
    if course_id in COURSE_LINKS:
        video_url = COURSE_LINKS[course_id]
        return redirect(video_url)
    else:
        return "Course not found. <a href='/dashboard'>Back to Dashboard</a>", 404

if __name__ == '__main__':
    app.run(debug=True)