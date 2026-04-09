from flask import request, jsonify
from config import get_db_connection

def register_appointment_routes(app):

    @app.route("/appointments", methods=["GET"])
    def get_appointments():
        conn = get_db_connection()
        rows = conn.execute("""
            SELECT a.*, p.patientName as patient_name
            FROM appointment a
            LEFT JOIN patient p ON a.patient_id = p.id
            ORDER BY a.appointment_date DESC, a.appointment_time DESC
        """).fetchall()
        conn.close()
        return jsonify([dict(r) for r in rows])

    @app.route("/add-appointment", methods=["POST"])
    def add_appointment():
        data = request.json

        required = ["patient_id", "doctor_name", "appointment_date", "appointment_time"]
        for field in required:
            if not data.get(field):
                return jsonify({"error": f"{field} is required"}), 400

        conn = get_db_connection()
        conn.execute("""
            INSERT INTO appointment (patient_id, doctor_name, appointment_date, appointment_time, reason, status)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            data["patient_id"],
            data["doctor_name"],
            data["appointment_date"],
            data["appointment_time"],
            data.get("reason", ""),
            data.get("status", "scheduled")
        ))
        conn.commit()
        conn.close()
        return jsonify({"message": "Appointment scheduled successfully"})

    @app.route("/edit-appointment/<int:appointment_id>", methods=["PUT"])
    def edit_appointment(appointment_id):
        data = request.json

        conn = get_db_connection()
        existing = conn.execute(
            "SELECT id FROM appointment WHERE id = ?", (appointment_id,)
        ).fetchone()

        if not existing:
            conn.close()
            return jsonify({"error": "Appointment not found"}), 404

        conn.execute("""
            UPDATE appointment
            SET patient_id = ?, doctor_name = ?, appointment_date = ?,
                appointment_time = ?, reason = ?, status = ?
            WHERE id = ?
        """, (
            data["patient_id"],
            data["doctor_name"],
            data["appointment_date"],
            data["appointment_time"],
            data.get("reason", ""),
            data.get("status", "scheduled"),
            appointment_id
        ))
        conn.commit()
        conn.close()
        return jsonify({"message": "Appointment updated successfully"})

    @app.route("/delete-appointment/<int:appointment_id>", methods=["DELETE"])
    def delete_appointment(appointment_id):
        conn = get_db_connection()
        conn.execute("DELETE FROM appointment WHERE id = ?", (appointment_id,))
        conn.commit()
        conn.close()
        return jsonify({"message": "Appointment deleted"})

    @app.route("/appointments/today", methods=["GET"])
    def get_today_appointments():
        conn = get_db_connection()
        rows = conn.execute("""
            SELECT a.*, p.patientName as patient_name
            FROM appointment a
            LEFT JOIN patient p ON a.patient_id = p.id
            WHERE a.appointment_date = DATE('now')
            ORDER BY a.appointment_time ASC
        """).fetchall()
        conn.close()
        return jsonify([dict(r) for r in rows])