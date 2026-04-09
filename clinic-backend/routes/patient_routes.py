from flask import request, jsonify
from config import get_db_connection


def register_patient_routes(app):

    @app.route("/add-patient", methods=["POST"])
    def add_patient():
        data = request.json

        conn = get_db_connection()
        cursor = conn.cursor()

        existing_patient = cursor.execute(
            "SELECT id FROM patient WHERE contactNumber = ?",
            (data["contactNumber"],),
        ).fetchone()

        if existing_patient:
            conn.close()
            return jsonify(
                {"error": "Patient with this contact number is already registered"}
            ), 400

        cursor.execute(
            "INSERT INTO patient (patientName, age, gender, contactNumber) VALUES (?, ?, ?, ?)",
            (data["patientName"], data["age"], data["gender"], data["contactNumber"]),
        )

        conn.commit()
        conn.close()
        return jsonify({"message": "Patient registered successfully"})

    @app.route("/patients", methods=["GET"])
    def get_patients():
        conn = get_db_connection()
        rows = conn.execute("SELECT * FROM patient").fetchall()
        conn.close()
        return jsonify([dict(row) for row in rows])

    @app.route("/patients/<int:patient_id>", methods=["GET"])
    def get_patient(patient_id):
        conn = get_db_connection()
        patient = conn.execute(
            "SELECT * FROM patient WHERE id = ?", (patient_id,)
        ).fetchone()
        conn.close()

        if not patient:
            return jsonify({"error": "Patient not found"}), 404

        return jsonify(dict(patient))

    @app.route("/edit-patient/<int:patient_id>", methods=["PUT"])
    def edit_patient(patient_id):
        data = request.json

        conn = get_db_connection()
        cursor = conn.cursor()

        existing = cursor.execute(
            "SELECT id FROM patient WHERE id = ?", (patient_id,)
        ).fetchone()

        if not existing:
            conn.close()
            return jsonify({"error": "Patient not found"}), 404

        duplicate = cursor.execute(
            "SELECT id FROM patient WHERE contactNumber = ? AND id != ?",
            (data["contactNumber"], patient_id),
        ).fetchone()

        if duplicate:
            conn.close()
            return jsonify(
                {"error": "This contact number belongs to another patient"}
            ), 400

        cursor.execute(
            """UPDATE patient
               SET patientName = ?, age = ?, gender = ?, contactNumber = ?
               WHERE id = ?""",
            (
                data["patientName"],
                data["age"],
                data["gender"],
                data["contactNumber"],
                patient_id,
            ),
        )

        conn.commit()
        conn.close()
        return jsonify({"message": "Patient updated successfully"})

    @app.route("/delete-patient/<int:patient_id>", methods=["DELETE"])
    def delete_patient(patient_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM treatment WHERE patient_id = ?", (patient_id,))
        cursor.execute("DELETE FROM patient WHERE id = ?", (patient_id,))
        conn.commit()
        conn.close()
        return jsonify({"message": "Patient and related treatments deleted successfully"})

    from datetime import datetime

    @app.route("/add-treatment", methods=["POST"])
    def add_treatment():
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO treatment (patient_id, diagnosis, medicines, notes, date)
               VALUES (?, ?, ?, ?, ?)""",
            (
                data["patient_id"],
                data["diagnosis"],
                data["medicines"],
                data["notes"],
                datetime.now().strftime("%Y-%m-%d"),
            ),
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Treatment added"})

    @app.route("/treatments/<int:patient_id>", methods=["GET"])
    def get_treatments(patient_id):
        conn = get_db_connection()
        treatments = conn.execute(
            "SELECT * FROM treatment WHERE patient_id = ? ORDER BY id DESC",
            (patient_id,),
        ).fetchall()
        conn.close()
        return jsonify([dict(t) for t in treatments])

    @app.route("/delete-treatment/<int:treatment_id>", methods=["DELETE"])
    def delete_treatment(treatment_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM treatment WHERE id = ?", (treatment_id,))
        conn.commit()
        conn.close()
        return jsonify({"message": "Treatment deleted"})

    @app.route("/treatments", methods=["GET"])
    def get_all_treatments():
        conn = get_db_connection()
        rows = conn.execute("SELECT * FROM treatment").fetchall()
        conn.close()
        return jsonify([dict(row) for row in rows])

    @app.route("/dashboard-stats", methods=["GET"])
    def dashboard_stats():
        conn = get_db_connection()
        total_patients = conn.execute("SELECT COUNT(*) FROM patient").fetchone()[0]
        total_treatments = conn.execute("SELECT COUNT(*) FROM treatment").fetchone()[0]
        today_treatments = conn.execute(
            "SELECT COUNT(*) FROM treatment WHERE date = DATE('now')"
        ).fetchone()[0]
        today_appointments = conn.execute(
            "SELECT COUNT(*) FROM appointment WHERE appointment_date = DATE('now')"
        ).fetchone()[0]
        total_appointments = conn.execute(
            "SELECT COUNT(*) FROM appointment"
        ).fetchone()[0]
        total_doctors = conn.execute("SELECT COUNT(*) FROM doctor").fetchone()[0]
        conn.close()

        return jsonify({
            "totalPatients": total_patients,
            "totalTreatments": total_treatments,
            "todayTreatments": today_treatments,
            "todayAppointments": today_appointments,
            "totalAppointments": total_appointments,
            "totalDoctors": total_doctors,
        })