import sqlite3

conn = sqlite3.connect("database.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS patient (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patientName TEXT,
    age INTEGER,
    gender TEXT,
    contactNumber TEXT
)
""")

conn.commit()
conn.close()

print("Patient table created")
