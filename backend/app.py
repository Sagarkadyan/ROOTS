import sqlite3
import random
import string
import os
import sys
from datetime import datetime, timedelta


sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import adder, check_password, update_pss, delete_user, store_otp, verify_otp, get_user_by_identifier
from flask import Flask, request, redirect, url_for, session, render_template, render_template_string, send_from_directory, jsonify


frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'ROOTS', 'out'))

app = Flask(__name__, 
            static_folder=frontend_dir, 
            static_url_path='')

app.secret_key = 'super_secret_development_key'


TREE_DATA = {
  "id": "knowledge",
  "label": "Knowledge",
  "children": [
    {
      "id": "web-dev",
      "label": "Web Development",
      "color": "#4ade80",
      "estimatedHours": 120,
      "difficulty": "Intermediate",
      "description": "Master the art of building modern web applications from the ground up.",
      "children": [
        { "id": "html", "label": "HTML", "color": "#4ade80" },
        { "id": "css", "label": "CSS", "color": "#4ade80" },
        { "id": "javascript", "label": "JavaScript", "color": "#4ade80" }
      ]
    },
    {
      "id": "data-science",
      "label": "Data Science",
      "color": "#06b6d4",
      "estimatedHours": 150,
      "difficulty": "Advanced",
      "description": "Unlock the power of data through analysis and machine learning.",
      "children": [
        { "id": "python", "label": "Python", "color": "#06b6d4" },
        { "id": "ml", "label": "Machine Learning", "color": "#06b6d4" },
        { "id": "stats", "label": "Statistics", "color": "#06b6d4" }
      ]
    },
    {
      "id": "ui-ux",
      "label": "UI/UX Design",
      "color": "#f59e0b",
      "estimatedHours": 80,
      "difficulty": "Beginner",
      "description": "Design beautiful and intuitive user experiences.",
      "children": [
        { "id": "figma", "label": "Figma", "color": "#f59e0b" },
        { "id": "design-systems", "label": "Design Systems", "color": "#f59e0b" },
        { "id": "typography", "label": "Typography", "color": "#f59e0b" }
      ]
    },
    {
      "id": "devops",
      "label": "DevOps",
      "color": "#a78bfa",
      "estimatedHours": 100,
      "difficulty": "Advanced",
      "description": "Bridge the gap between development and operations.",
      "children": [
        { "id": "docker", "label": "Docker", "color": "#a78bfa" },
        { "id": "kubernetes", "label": "Kubernetes", "color": "#a78bfa" },
        { "id": "cicd", "label": "CI/CD", "color": "#a78bfa" }
      ]
    },
    {
      "id": "cybersecurity",
      "label": "Cybersecurity",
      "color": "#ef4444",
      "estimatedHours": 130,
      "difficulty": "Advanced",
      "description": "Protect systems and networks from digital attacks.",
      "children": [
        { "id": "networking", "label": "Networking", "color": "#ef4444" },
        { "id": "cryptography", "label": "Cryptography", "color": "#ef4444" },
        { "id": "ethical-hacking", "label": "Ethical Hacking", "color": "#ef4444" }
      ]
    }
  ]
}

CHAT_RESPONSES = {
  "initialMessages": [
    { "role": "assistant", "text": "Hey! I'm your ROOTS guide 🌱 What do you want to learn?" }
  ],
  "responsePool": [
    "Great question! Let me map that onto your learning tree 🌳",
    "Based on your progress, I'd recommend tackling CSS Grid next!",
    "You're growing fast! Your streak shows real dedication 🔥"
  ]
}

ACTIVITY_FEED = [
  { "id": 1, "title": 'Completed "JavaScript Promises"', "time": "2h ago", "xp": "+150 XP", "icon": "CheckCircle2" },
  { "id": 2, "title": 'Started "React Hooks"', "time": "5h ago", "xp": "+50 XP", "icon": "BookOpen" },
  { "id": 3, "title": 'Earned "7-Day Streak" badge', "time": "Yesterday", "xp": "+200 XP", "icon": "Trophy" }
]

def get_heatmap_data():
    data = []
    today = datetime.now()
    for i in range(364):
        d = today - timedelta(days=i)
        activity = random.randint(0, 4) if i < 60 else random.randint(0, 2)
        data.append({
            "date": d.strftime("%Y-%m-%d"),
            "activity": activity,
            "sessions": random.randint(1, 3) if activity > 0 else 0,
            "xp": activity * 35
        })
    return data


@app.route('/')
def serve_index():
    if os.path.exists(os.path.join(app.static_folder, 'index.html')):
        return send_from_directory(app.static_folder, 'index.html')
    return "UI is building... please wait."

@app.route('/root')
@app.route('/dashboard')
@app.route('/path')
@app.route('/courses')
@app.route('/streak')
@app.route('/tree')
def serve_pages():
    path = request.path.strip('/')
    html_file = f"{path}.html"
    if os.path.exists(os.path.join(app.static_folder, html_file)):
        return send_from_directory(app.static_folder, html_file)
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = data.get('identifier')
    password = data.get('password')

    result = check_password(identifier, password)
    if result == "correct pass":
        session['user_name'] = identifier
        return jsonify({"status": "success", "message": "Login successful"})
    

    user_name = get_user_by_identifier(identifier)
    if user_name:
        result = check_password(user_name, password)
        if result == "correct pass":
            session['user_name'] = user_name
            return jsonify({"status": "success", "message": "Login successful"})

    return jsonify({"status": "error", "message": result})

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    number = data.get('number')
    
    result = adder(name, email, password, number)
    if result == "Inserted successfully!":
        session['user_name'] = name
        return jsonify({"status": "success", "message": result})
    return jsonify({"status": "error", "message": result})

@app.route('/otp-request', methods=['POST'])
def otp_request():
    data = request.get_json()
    identifier = data.get('identifier')
    

    user_name = get_user_by_identifier(identifier)

    if not user_name:

        with sqlite3.connect(os.path.join(os.path.dirname(__file__), '..', 'database', 'users.db')) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM users WHERE name = ?", (identifier,))
            row = cursor.fetchone()
            if row:
                user_name = row[0]

    if not user_name:
        return jsonify({"status": "error", "message": "User not found"})
    

    otp = "123456" 

    if store_otp(identifier, otp):
        session['otp_identifier'] = identifier # Store in session for verification
        return jsonify({"status": "success", "message": "OTP sent! (123456)"})
    return jsonify({"status": "error", "message": "Failed to generate OTP"})

@app.route('/otp-verify', methods=['POST'])
def otp_verify():
    data = request.get_json()
    otp = data.get('otp')
    identifier = session.get('otp_identifier')
    
    if not identifier:
        return jsonify({"status": "error", "message": "OTP session expired"})
    
    if verify_otp(identifier, otp):
        user_name = get_user_by_identifier(identifier)
        if not user_name:
            user_name = identifier 
            
        session['user_name'] = user_name
        session.pop('otp_identifier', None)
        return jsonify({"status": "success", "message": "OTP verified"})
    
    return jsonify({"status": "error", "message": "Invalid OTP"})

@app.route('/logout')
def logout():
    session.pop('user_name', None)
    return jsonify({"status": "success", "message": "Logged out"})

@app.route('/api/session')
def get_session():
    if 'user_name' in session:
        return jsonify({
            "status": "success", 
            "user": {
                "name": session['user_name'],
                "title": "Aspiring Full-Stack Developer",
                "level": 14, 
                "xp": 4820,
                "maxXP": 5000,
                "completedCourses": 12,
                "streakTracker": 47,
                "totalXPEarned": 12450,
                "longestStreak": 63,
                "sessionsThisMonth": 28,
                "memberSince": "Growing since Jan 2025"
            }
        })
    return jsonify({"status": "error", "message": "Not logged in"}), 401

@app.route('/api/tree')
def get_tree():
    return jsonify(TREE_DATA)

@app.route('/api/chat/responses')
def get_chat_responses():
    return jsonify(CHAT_RESPONSES)

@app.route('/api/activity')
def get_activity():
    return jsonify(ACTIVITY_FEED)

@app.route('/api/heatmap')
def get_heatmap():
    return jsonify(get_heatmap_data())

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
