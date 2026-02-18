import sqlite3

conn = sqlite3.connect("database.db")
cursor = conn.cursor()

cursor.execute("DELETE FROM patient")

conn.commit()
conn.close()

print("All patient records deleted successfully")
