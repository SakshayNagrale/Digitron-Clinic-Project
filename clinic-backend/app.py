from flask import Flask
from flask_cors import CORS
from routes.patient_routes import register_patient_routes
from routes.auth_routes import register_auth_routes
from routes.appointment_routes import register_appointment_routes
from routes.doctor_routes import register_doctor_routes

app = Flask(__name__)
CORS(app)

register_auth_routes(app)
register_patient_routes(app)
register_appointment_routes(app)
register_doctor_routes(app)

@app.route("/")
def home():
    return {"message": "Backend is running"}

if __name__ == "__main__":
    app.run(debug=True)