from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.models import Collection, Patient  # Import your models
from backend.database import get_db  # Your database session
from backend.schemas import CollectionCreate

router = APIRouter()

# @router.get("/collectionlist", response_model=List[dict])
# def get_collections_list(db: Session = Depends(get_db)):
#     # Query the collection data
#     collections = db.query(Collection).all()
    
#     collection_data = []
#     for collection in collections:
#         patient = db.query(Patient).filter(Patient.id == collection.patient_id).first()
#         collection_data.append({
#             "id": collection.id,
#             "patient_name": f"{patient.first_name} {patient.middle_name} {patient.last_name}",
#             "regimen": collection.regimen,
#             "next_collection_date": collection.next_collection_date,
#         })

#     return collection_data

## PAGINATION FUNCTIONALITY

@router.get("/collectionlist")
def get_collections_list(
    db: Session = Depends(get_db), 
    page: int = Query(0, alias="page"), 
    limit: int = Query(10),
    search: str = None
):
    query = db.query(Collection)
    
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

# ## SEARCH FUNCTIONALITY

# @router.get("/collectionlist", response_model=List[dict])
# def get_collections_list(
#     db: Session = Depends(get_db), search: str = None, skip: int = 0, limit: int = 5
# ):
#     query = db.query(Collection)
    
#     if search:
#         # Filter collections by patient's name
#         query = query.join(Patient).filter(
#             (Patient.first_name.ilike(f"%{search}%")) | 
#             (Patient.middle_name.ilike(f"%{search}%")) | 
#             (Patient.last_name.ilike(f"%{search}%"))
#         )

#     collections = query.offset(skip).limit(limit).all()
    
#     collection_data = []
#     for collection in collections:
#         patient = db.query(Patient).filter(Patient.id == collection.patient_id).first()
#         collection_data.append({
#             "id": collection.id,
#             "patient_name": f"{patient.first_name} {patient.middle_name} {patient.last_name}",
#             "regimen": collection.regimen,
#             "next_collection_date": collection.next_collection_date,
#         })
    
#     return collection_data

## SEARCH AND PAGINATION FUNCTIONALITY

# @router.get("/collectionlist", response_model=List[dict])
# def get_collections_list(
#     db: Session = Depends(get_db), 
#     search: Optional[str] = None, 
#     page: int = Query(0, alias="page"),  # Default to page 0
#     limit: int = Query(10, ge=1, le=100)  # Default limit is 10, with min=1, max=100
# ):
#     # Create a base query to fetch collections
#     query = db.query(Collection)
    
#     if search:
#         # Apply search filter for patient's name
#         query = query.join(Patient).filter(
#             (Patient.first_name.ilike(f"%{search}%")) |
#             (Patient.middle_name.ilike(f"%{search}%")) |
#             (Patient.last_name.ilike(f"%{search}%"))
#         )
    
#     # Get total number of collections for pagination
#     total_collections = query.count()

#     # Apply pagination with offset and limit
#     collections = query.offset(page * limit).limit(limit).all()
    
#     collection_data = []
#     for collection in collections:
#         # Get patient details for each collection
#         patient = db.query(Patient).filter(Patient.id == collection.patient_id).first()
#         collection_data.append({
#             "id": collection.id,
#             "patient_name": f"{patient.first_name} {patient.middle_name} {patient.last_name}",
#             "regimen": collection.regimen,
#             "next_collection_date": collection.next_collection_date,
#         })

#     # Return both the filtered collections and total count for pagination
#     return {
#         "total": total_collections,
#         "collections": collection_data
#     }



