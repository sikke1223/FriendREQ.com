import os
import logging
from flask import Flask, render_template, send_from_directory, request, redirect, url_for

# Set up logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "monkeymoney-secret-key-2024")

@app.route('/')
def index():
    """Serve the main login page"""
    return send_from_directory('.', 'index.html')

@app.route('/admin')
@app.route('/admin.html')
def admin():
    """Serve the admin panel"""
    return send_from_directory('.', 'admin.html')

@app.route('/dashboard')
@app.route('/dashboard.html')
def dashboard():
    """Serve the user dashboard"""
    return send_from_directory('.', 'dashboard.html')

@app.route('/register')
@app.route('/register.html')
def register():
    """Serve the registration page"""
    return send_from_directory('.', 'register.html')

@app.route('/deposit')
@app.route('/deposit.html')
def deposit():
    """Serve the deposit page"""
    return send_from_directory('.', 'deposit.html')

@app.route('/withdraw')
@app.route('/withdraw.html')
def withdraw():
    """Serve the withdrawal page"""
    return send_from_directory('.', 'withdraw.html')

@app.route('/forget-password')
@app.route('/forget-password.html')
def forget_password():
    """Serve the password reset page"""
    return send_from_directory('.', 'forget-password.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files"""
    return send_from_directory('.', filename)

@app.route('/js/<path:filename>')
def serve_js(filename):
    """Serve JavaScript files"""
    return send_from_directory('js', filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
