from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from datetime import date, timedelta
import sqlite3
from models import Patient, Collection
from flask import Flask, send_from_directory, send_file, request, jsonify, Blueprint,session, redirect, url_for
import json, requests
from flask_restful import Api, Resource
from flask_migrate import Migrate
from flask_cors import CORS, cross_origin
from mpesa_payment import MpesaPayment
from werkzeug.security import generate_password_hash
import os
from os import environ
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend's URL for better security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app = Flask(__name__)
api = Api(app)
# Init db

BASEDIR = os.path.join(os.path.dirname(__file__))

# Database connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASEDIR, 'app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
CORS(app, origins="http://127.0.0.1:5173")
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

uvicorn main:app --reload --host 0.0.0.0 --port 8000
