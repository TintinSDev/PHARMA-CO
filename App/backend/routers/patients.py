from fastapi import APIRouter, Depends, Query, HTTPException, UploadFile, File
import pandas as pd
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

# Get patient by ID
@router.get("/{patient_id}", response_model=PatientCreate)  # or a proper schema
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

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


@router.post("/upload-csv")
async def upload_patients_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    # Check file extension
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")

    file.file.seek(0)

    # Read CSV
    try:
        df = pd.read_csv(file.file, header=0)  # read first row as header
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read CSV file: {e}")

    # If only one column, split it
    if len(df.columns) == 1:
        df = df[df.columns[0]].str.split(',', expand=True)
        df.columns = ["first_name", "middle_name", "last_name"]

    # Validate required columns
    required_columns = {"first_name", "middle_name", "last_name"}
    if not required_columns.issubset(df.columns):
        raise HTTPException(status_code=400, detail=f"CSV must include columns: {required_columns}")

    added = 0
    for _, row in df.iterrows():
        patient = Patient(
            first_name=row["first_name"],
            middle_name=row["middle_name"] if pd.notna(row["middle_name"]) else None,
            last_name=row["last_name"] if pd.notna(row["last_name"]) else None,
        )
        db.add(patient)
        added += 1

    db.commit()

    return {"message": f"Successfully added {added} patients."}
