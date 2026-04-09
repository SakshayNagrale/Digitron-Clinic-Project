from flask import request, jsonify
from config import get_db_connection
import hashlib
import secrets

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def register_auth_routes(app):

    @app.route("/login", methods=["POST"])
    def login():
        data = request.json

        if not data or not data.get("username") or not data.get("password"):
            return jsonify({"error": "Username and password are required"}), 400

        conn = get_db_connection()
        user = conn.execute(
            "SELECT * FROM staff WHERE username = ?",
            (data["username"],)
        ).fetchone()
        conn.close()

        if not user:
            return jsonify({"error": "Invalid username or password"}), 401

        hashed = hash_password(data["password"])
        if user["password"] != hashed:
            return jsonify({"error": "Invalid username or password"}), 401

        # Generate a simple session token
        token = secrets.token_hex(32)

        # Save token to DB
        conn = get_db_connection()
        conn.execute(
            "UPDATE staff SET token = ? WHERE id = ?",
            (token, user["id"])
        )
        conn.commit()
        conn.close()

        return jsonify({
            "message": "Login successful",
            "token": token,
            "name": user["name"],
            "role": user["role"]
        })

    @app.route("/logout", methods=["POST"])
    def logout():
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        if token:
            conn = get_db_connection()
            conn.execute("UPDATE staff SET token = NULL WHERE token = ?", (token,))
            conn.commit()
            conn.close()
        return jsonify({"message": "Logged out"})