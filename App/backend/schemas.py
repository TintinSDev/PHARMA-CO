from pydantic import BaseModel, validator
from typing import Optional
from datetime import date

class PatientCreate(BaseModel):
    first_name: str
    middle_name: str
    last_name: str
    
    class Config:
      orm_mode = True  # This is necessary to allow Pydantic to convert SQLAlchemy models to Pydantic models

  # Instead of regimen_id, now it's a string for the regimen na
class CollectionCreate(BaseModel):
    patient_id: int
    regimen: str
    quantity: int
    collection_date: date
    next_collection_date: date  # This is calculated on the backend, not user-input
    # overdue_date: date  # This is also calculated on the backend

    @validator("regimen")
    def check_regimen_length(cls, value):
        if len(value) < 3:
            raise ValueError('Regimen must be at least 3 characters long.')
        return value

    class Config:
        orm_mode = True

class PatientUpdate(BaseModel):
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    

