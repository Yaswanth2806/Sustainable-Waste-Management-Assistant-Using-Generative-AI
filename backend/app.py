"""
app.py — WasteGuide AI Flask backend entrypoint.
Run with: python app.py
Starts the API on http://localhost:5000
"""
import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

from routes.waste import waste_bp
from routes.history import history_bp
from routes.centers import centers_bp

app = Flask(__name__)
app.config["JSON_SORT_KEYS"] = False

CORS(app, resources={r"/api/*": {"origins": os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")}})

app.register_blueprint(waste_bp, url_prefix="/api")
app.register_blueprint(history_bp, url_prefix="/api")
app.register_blueprint(centers_bp, url_prefix="/api")


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
