from pydantic import BaseModel
from datetime import date

class PatientCreate(BaseModel):
    first_name: str
    middle_name: str
    last_name: str

  # Instead of regimen_id, now it's a string for the regimen na
class CollectionCreate(BaseModel):
    patient_id: int
    regimen: str
    quantity: int
    collection_date: date
    next_collection_date: date  # Add this line

    class Config:
        orm_mode = True
