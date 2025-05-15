from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/test")
def test():
    return jsonify({"message": "Hello from Flask!"})