from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from backend.models import Collection, Patient  # Import your models
from backend.database import get_db  # Your database session
# from backend.schemas import CollectionCreate

router = APIRouter()

@router.get("/collectionlist", response_model=List[dict])
def get_collections_list(db: Session = Depends(get_db)):
    # Query the collection data
    collections = db.query(Collection).all()
    
    collection_data = []
    for collection in collections:
        patient = db.query(Patient).filter(Patient.id == collection.patient_id).first()
        collection_data.append({
            "id": collection.id,
            "patient_name": f"{patient.first_name} {patient.middle_name} {patient.last_name}",
            "regimen": collection.regimen,
            "next_collection_date": collection.next_collection_date,
        })

    return collection_data
