from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Patient, Collection
from backend.schemas import PatientCreate, PatientUpdate


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

# endpoint to add patient
@router.post("/")
def add_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    new_patient = Patient(**patient.dict())  
    db.add(new_patient)
    db.commit()  
    db.refresh(new_patient)  
    return {"id": new_patient.id, "message": "Patient added successfully"}  

# endpoint to get patient by id
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

# endpoint to edit patient by id
@router.put("/{patient_id}")
def update_patient(patient_id: int, patient_data: PatientUpdate, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    for key, value in patient_data.dict(exclude_unset=True).items():
        setattr(patient, key, value)

    db.commit()
    db.refresh(patient)
    return {"message": "Patient updated successfully", "patient": patient}


# endpoint to delete patient by id
# @router.delete("/{patient_id}")
# def delete_patient(patient_id: int, db: Session = Depends(get_db)):
#     patient = db.query(Patient).filter(Patient.id == patient_id).first()
#     if not patient:
#         raise HTTPException(status_code=404, detail="Patient not found")

#     db.delete(patient)
#     db.commit()
#     return {"message": "Patient deleted successfully"}

@router.delete("/{patient_id}")
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Delete all collections associated with this patient first
    db.query(Collection).filter(Collection.patient_id == patient_id).delete()

    # Now delete the patient
    db.delete(patient)
    db.commit()
    return {"message": "Patient and related collections deleted successfully"}
