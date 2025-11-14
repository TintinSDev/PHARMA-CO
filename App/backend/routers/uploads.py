from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
import pandas as pd
from datetime import datetime

from backend.database import get_db
from backend.models import Patient, Collection

router = APIRouter(prefix="/upload", tags=["Upload Excel"])


@router.post("/")
async def upload_excel(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Load Excel file into a pandas DataFrame
    df = pd.read_excel(file.file)

    # ----------------------------------------
    # CASE 1: PATIENTS SHEET
    # ----------------------------------------
    if {"first_name", "middle_name", "last_name"}.issubset(df.columns):
        for _, row in df.iterrows():
            new_patient = Patient(
                first_name=row["first_name"],
                middle_name=row["middle_name"],
                last_name=row["last_name"]
            )
            db.add(new_patient)

        db.commit()
        return {"message": "Patients uploaded successfully!", "rows_added": len(df)}

    # ----------------------------------------
    # CASE 2: COLLECTIONS SHEET
    # ----------------------------------------
    elif {"patient_id", "regimen", "quantity", "collection_date", "next_collection_date"}.issubset(df.columns):

        for _, row in df.iterrows():

            # Validate patient exists
            patient = db.query(Patient).filter(Patient.id == row["patient_id"]).first()
            if not patient:
                raise HTTPException(
                    status_code=400,
                    detail=f"Patient with ID {row['patient_id']} does not exist!"
                )

            new_collection = Collection(
                patient_id=row["patient_id"],
                regimen=row["regimen"],
                quantity=int(row["quantity"]),
                collection_date=pd.to_datetime(row["collection_date"]).date(),
                next_collection_date=pd.to_datetime(row["next_collection_date"]).date(),
            )
            db.add(new_collection)

        db.commit()
        return {"message": "Collections uploaded successfully!", "rows_added": len(df)}

    # ----------------------------------------
    # INVALID FILE FORMAT
    # ----------------------------------------
    else:
        raise HTTPException(
            status_code=400,
            detail="Excel columns do not match Patients or Collections format."
        )
