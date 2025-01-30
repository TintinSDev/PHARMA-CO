from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import timedelta, date
from database import get_db
from models import Collection
from schemas import CollectionCreate

router = APIRouter(prefix="/collections", tags=["Collections"])

@router.post("/")
def add_collection(collection: CollectionCreate, db: Session = Depends(get_db)):
    next_collection_date = collection.collection_date + timedelta(days=90)
    overdue_date = next_collection_date + timedelta(days=7)

    new_collection = Collection(
        patient_id=collection.patient_id,
        regimen=collection.regimen,  # Save regimen directly as a string
        quantity=collection.quantity,
        collection_date=collection.collection_date,
        next_collection_date=next_collection_date,
        overdue_date=overdue_date
    )
    db.add(new_collection)
    db.commit()
    db.refresh(new_collection)
    return {"id": new_collection.id}
