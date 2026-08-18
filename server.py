from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os, requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

load_dotenv()
SECRET = os.getenv("RECAPTCHA_SECRET")

@app.post("/verify-recaptcha")
def verify_recaptcha():
    data = request.get_json(silent=True)
    token = data.get("token") if data else None
    if not token:
        return jsonify({"success": False, "error": "no-token"}), 400

    if not SECRET:
        return jsonify({"success": False, "error": "not-configured"}), 500

    # Verify with Google
    try:
        resp = requests.post(
            "https://www.google.com/recaptcha/api/siteverify",
            data={"secret": SECRET, "response": token},
            timeout=5
        ).json()
    except requests.RequestException:
        return jsonify({"success": False, "error": "verify-unavailable"}), 502

    if resp.get("success"):
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "error": resp.get("error-codes")}), 403


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000)
