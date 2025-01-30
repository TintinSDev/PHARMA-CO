from fastapi import APIRouter, Depends
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
@router.post("/")
def add_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    new_patient = Patient(**patient.dict())  # Create a new patient from the request data
    db.add(new_patient)
    db.commit()  # Commit the changes to the database
    db.refresh(new_patient)  # Refresh to get the newly generated ID
    return {"id": new_patient.id, "message": "Patient added successfully"}  # Return the patient ID after adding the patient

@router.get("/")
def get_patients(db: Session = Depends(get_db)):
    return db.query(Patient).all()



# @app.post("/patients")
# async def add_patient(patient_data: Patient):
#     # Handle the incoming data and return a response
#     return {"id": 123, "message": "Patient added successfully"}
