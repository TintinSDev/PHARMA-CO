from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Patient
from backend.schemas import PatientCreate


router = APIRouter(prefix="/patients", tags=["Patients"])

# @router.post("/")
# def add_patient(patient: PatientCreate, db: Session = Depends(get_db)):
#     new_patient = Patient(**patient.dict())
#     db.add(new_patient)
#     db.commit()
#     db.refresh(new_patient)
#     return new_patient
# @router.post("/")
# def add_patient(patient: PatientCreate, db: Session = Depends(get_db)):
#     new_patient = Patient(**patient.dict())  # Create a new patient from the request data
#     db.add(new_patient)
#     db.commit()  # Commit the changes to the database
#     db.refresh(new_patient)  # Refresh to get the newly generated ID
#     return {"id": new_patient.id, "message": "Patient added successfully"}  # Return the patient ID after adding the patient

# @router.get("/")
# def get_patients(db: Session = Depends(get_db)):
#     return db.query(Patient).all()
@router.post("/")
def add_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    new_patient = Patient(**patient.dict())  
    db.add(new_patient)
    db.commit()  
    db.refresh(new_patient)  
    return {"id": new_patient.id, "message": "Patient added successfully"}  

@router.get("/")
def get_patients(
    db: Session = Depends(get_db), 
    skip: int = Query(0, alias="page"), 
    limit: int = Query(10)
):
    total_patients = db.query(Patient).count()  # Get total count for pagination

    patients = db.query(Patient).offset(skip * limit).limit(limit).all()

    return {
        "total": total_patients,
        "patients": patients
    }


