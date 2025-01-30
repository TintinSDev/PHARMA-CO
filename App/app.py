from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from datetime import date, timedelta
import sqlite3
from models import Patient, Collection

app = FastAPI()



# API Endpoints
@app.post("/patients")
def add_patient(patient: Patient):
    conn, cursor = get_db()
    cursor.execute("INSERT INTO patients (first_name, middle_name, last_name) VALUES (?, ?, ?)",
                   (patient.first_name, patient.middle_name, patient.last_name))
    conn.commit()
    conn.close()
    return {"message": "Patient added successfully"}

@app.get("/patients")
def get_patients():
    conn, cursor = get_db()
    cursor.execute("SELECT * FROM patients")
    patients = cursor.fetchall()
    conn.close()
    return patients

@app.post("/collections")
def add_collection(collection: Collection):
    next_collection_date = collection.collection_date + timedelta(days=30)
    overdue_date = next_collection_date + timedelta(days=7)
    conn, cursor = get_db()
    cursor.execute("""
        INSERT INTO collections (patient_id, regimen_id, quantity, collection_date, next_collection_date, overdue_date)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (collection.patient_id, collection.regimen_id, collection.quantity, collection.collection_date, next_collection_date, overdue_date))
    conn.commit()
    conn.close()
    return {"message": "Collection recorded successfully"}

@app.get("/overdue")
def get_overdue():
    conn, cursor = get_db()
    cursor.execute("SELECT * FROM collections WHERE overdue_date < ?", (date.today(),))
    overdue_collections = cursor.fetchall()
    conn.close()
    return overdue_collections
