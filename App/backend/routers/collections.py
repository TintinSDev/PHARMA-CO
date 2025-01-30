from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import timedelta, date
from backend.database import get_db
from backend.models import Collection, Patient
from backend.schemas import CollectionCreate

router = APIRouter(prefix="/collections", tags=["Collections"])

@router.post("/")
def add_collection(
    collection: CollectionCreate, db: Session = Depends(get_db)
):
    # Get the patient from the database using the patient ID
    patient = db.query(Patient).filter(Patient.id == collection.patient_id).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Create a new collection entry
    new_collection = Collection(
        patient_id=collection.patient_id,
        regimen=collection.regimen,
        quantity=collection.quantity,
        collection_date=collection.collection_date,
        next_collection_date=collection.next_collection_date,
    )
    
    db.add(new_collection)
    db.commit()
    db.refresh(new_collection)

    # Return the patient name, regimen, and next collection date
    return {
        "patient_name": f"{patient.first_name} {patient.middle_name} {patient.last_name}",
        "regimen": new_collection.regimen,
        "next_collection_date": new_collection.next_collection_date,
        "id": new_collection.id,
    }
