import sqlite3
import hashlib


def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()


conn = sqlite3.connect("database.db")
cursor = conn.cursor()

# Patient table
cursor.execute("""
CREATE TABLE IF NOT EXISTS patient (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patientName TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    contactNumber TEXT NOT NULL
)
""")

# Treatment table
cursor.execute("""
CREATE TABLE IF NOT EXISTS treatment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    diagnosis TEXT NOT NULL,
    medicines TEXT,
    notes TEXT,
    date TEXT NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patient(id)
)
""")

# Staff / Auth table
cursor.execute("""
CREATE TABLE IF NOT EXISTS staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Reception',
    token TEXT
)
""")

# Doctor table
cursor.execute("""
CREATE TABLE IF NOT EXISTS doctor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    contact TEXT NOT NULL,
    available INTEGER NOT NULL DEFAULT 1
)
""")

# Appointment table
cursor.execute("""
CREATE TABLE IF NOT EXISTS appointment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER,
    doctor_name TEXT NOT NULL,
    appointment_date TEXT NOT NULL,
    appointment_time TEXT NOT NULL,
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'scheduled',
    FOREIGN KEY (patient_id) REFERENCES patient(id),
    FOREIGN KEY (doctor_id) REFERENCES doctor(id)
)
""")

# Seed default admin user
existing = cursor.execute(
    "SELECT id FROM staff WHERE username = 'admin'"
).fetchone()

if not existing:
    cursor.execute(
        "INSERT INTO staff (name, username, password, role) VALUES (?, ?, ?, ?)",
        ("Clinic Staff", "admin", hash_password("admin123"), "Reception"),
    )
    print("Default admin user created: admin / admin123")
else:
    print("Admin user already exists")

conn.commit()
conn.close()

print("All tables created successfully!")