import json
import os
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

from flask import send_from_directory

@app.route('/user_profile.json')
def get_profile():
    return send_from_directory(os.getcwd(), 'user_profile.json')

# This is where your personalization is saved
PROFILE_PATH = '../captioning_mt26/src/captioning_lib/data_source/user_profile.json'

@app.route('/')
def login():
    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/api/save_profile', methods=['POST'])
def save_profile():
    data = request.json
    # This automatically creates the JSON file
    with open(PROFILE_PATH, 'w') as f:
        json.dump(data, f, indent=4)
    return jsonify({"message": "Profile saved!"})

@app.route('/api/save_transcript', methods=['POST'])
def save_transcript():
    data = request.json
    # This creates a 'history.txt' file in your folder and adds to it
    with open('history.txt', 'a', encoding='utf-8') as f:
        f.write(f"Raw: {data['raw']}\nCleaned: {data['cleaned']}\n---\n")
    return jsonify({"status": "saved"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)