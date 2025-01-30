from pydantic import BaseModel
from datetime import date

class PatientCreate(BaseModel):
    first_name: str
    middle_name: str
    last_name: str

class CollectionCreate(BaseModel):
    patient_id: int
    regimen: str
    quantity: int
    collection_date: date
      # Instead of regimen_id, now it's a string for the regimen name
