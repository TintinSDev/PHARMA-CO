from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Patient
from schemas import PatientCreate

router = APIRouter(prefix="/patients", tags=["Patients"])

# @router.post("/")
# def add_patient(patient: PatientCreate, db: Session = Depends(get_db)):
#     new_patient = Patient(**patient.dict())
#     db.add(new_patient)
#     db.commit()
#     db.refresh(new_patient)
#     return new_patient
@router.post("/")
def add_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    new_patient = Patient(**patient.dict())  # Create a new patient from the request data
    db.add(new_patient)
    db.commit()  # Commit the changes to the database
    db.refresh(new_patient)  # Refresh to get the newly generated ID
    return {"id": new_patient.id}  # Return the patient ID after adding the patient

@router.get("/")
def get_patients(db: Session = Depends(get_db)):
    return db.query(Patient).all()

@router.post("/")
def add_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    new_patient = Patient(**patient.dict())  # Create a new patient from the request data
    db.add(new_patient)
    db.commit()  # Commit the changes to the database
    db.refresh(new_patient)  # Refresh to get the newly generated ID
    return {"id": new_patient.id}  # Return the patient ID after adding the patient
