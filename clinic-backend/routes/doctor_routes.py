from flask import request, jsonify
from config import get_db_connection


def register_doctor_routes(app):

    @app.route("/doctors", methods=["GET"])
    def get_doctors():
        conn = get_db_connection()
        rows = conn.execute("SELECT * FROM doctor ORDER BY id DESC").fetchall()
        conn.close()
        return jsonify([dict(r) for r in rows])

    @app.route("/add-doctor", methods=["POST"])
    def add_doctor():
        data = request.json

        if not data.get("name") or len(data["name"].strip()) < 3:
            return jsonify({"error": "Doctor name must be at least 3 characters"}), 400
        if not data.get("specialization") or len(data["specialization"].strip()) < 2:
            return jsonify({"error": "Specialization is required"}), 400
        if not data.get("contact") or len(str(data["contact"])) != 10:
            return jsonify({"error": "Contact number must be exactly 10 digits"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        existing = cursor.execute(
            "SELECT id FROM doctor WHERE contact = ?", (data["contact"],)
        ).fetchone()

        if existing:
            conn.close()
            return jsonify({"error": "Doctor with this contact number already exists"}), 400

        cursor.execute(
            "INSERT INTO doctor (name, specialization, contact, available) VALUES (?, ?, ?, ?)",
            (
                data["name"].strip(),
                data["specialization"].strip(),
                data["contact"],
                data.get("available", 1),
            ),
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Doctor added successfully"})

    @app.route("/edit-doctor/<int:doctor_id>", methods=["PUT"])
    def edit_doctor(doctor_id):
        data = request.json

        conn = get_db_connection()
        cursor = conn.cursor()

        existing = cursor.execute(
            "SELECT id FROM doctor WHERE id = ?", (doctor_id,)
        ).fetchone()

        if not existing:
            conn.close()
            return jsonify({"error": "Doctor not found"}), 404

        duplicate = cursor.execute(
            "SELECT id FROM doctor WHERE contact = ? AND id != ?",
            (data["contact"], doctor_id),
        ).fetchone()

        if duplicate:
            conn.close()
            return jsonify({"error": "This contact number belongs to another doctor"}), 400

        cursor.execute(
            """UPDATE doctor SET name = ?, specialization = ?, contact = ?, available = ?
               WHERE id = ?""",
            (
                data["name"].strip(),
                data["specialization"].strip(),
                data["contact"],
                data.get("available", 1),
                doctor_id,
            ),
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Doctor updated successfully"})

    @app.route("/delete-doctor/<int:doctor_id>", methods=["DELETE"])
    def delete_doctor(doctor_id):
        conn = get_db_connection()
        conn.execute("DELETE FROM doctor WHERE id = ?", (doctor_id,))
        conn.commit()
        conn.close()
        return jsonify({"message": "Doctor deleted successfully"})