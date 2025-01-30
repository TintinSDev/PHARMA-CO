from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from datetime import date, timedelta
import sqlite3

app = FastAPI()

# Database Connection

def get_db():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    return conn, cursor

# Database Initialization
def init_db():
    conn, cursor = get_db()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT,
            middle_name TEXT,
            last_name TEXT
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS regimens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS collections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER,
            regimen_id INTEGER,
            quantity INTEGER CHECK(quantity <= 180),
            collection_date DATE,
            next_collection_date DATE,
            overdue_date DATE,
            FOREIGN KEY(patient_id) REFERENCES patients(id),
            FOREIGN KEY(regimen_id) REFERENCES regimens(id)
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# Pydantic Models
class Patient(BaseModel):
    first_name: str
    middle_name: str
    last_name: str

class Collection(BaseModel):
    patient_id: int
    regimen_id: int
    quantity: int
    collection_date: date