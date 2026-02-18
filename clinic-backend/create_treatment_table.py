import sqlite3

conn = sqlite3.connect("database.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS treatment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    diagnosis TEXT,
    medicines TEXT,
    notes TEXT,
    date TEXT,
    FOREIGN KEY (patient_id) REFERENCES patient(id)
)
""")

conn.commit()
conn.close()

print("Treatment table created")
