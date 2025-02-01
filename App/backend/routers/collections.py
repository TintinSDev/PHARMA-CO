from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
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

@router.get("/")
def get_collections_list(
    db: Session = Depends(get_db), 
    page: int = Query(0, alias="page"), 
    limit: int = Query(10),
    search: str = None
):
    query = db.query(Collection).join(Patient, Collection.patient_id == Patient.id)
    
    # Apply search filter
    if search:
        query = query.join(Patient).filter(
            (Patient.first_name.ilike(f"%{search}%")) | 
            (Patient.middle_name.ilike(f"%{search}%")) | 
            (Patient.last_name.ilike(f"%{search}%"))
        )

    # Apply pagination to the filtered query
    total_collections = query.count()
    collections = query.offset(page * limit).limit(limit).all()
    
    collection_data = []
    for collection in collections:
        patient = db.query(Patient).filter(Patient.id == collection.patient_id).first()
        collection_data.append({
            "id": collection.id,
            "patient_name": f"{patient.first_name} {patient.middle_name} {patient.last_name}",
            "regimen": collection.regimen,
            "next_collection_date": collection.next_collection_date,
        })

    return {
        "total": total_collections,
        "collections": collection_data
    }