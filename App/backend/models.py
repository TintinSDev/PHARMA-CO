from sqlalchemy import Column, Integer, String, Date, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from backend.database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    middle_name = Column(String, index=True, unique=True )
    last_name = Column(String, index=True, unique=True )

class CollectionList(Base):
    __tablename__ = "regimens"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

class Collection(Base):
    __tablename__ = "collections"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    regimen = Column(String)  # Changed regimen_id to regimen (String)
    quantity = Column(Integer, CheckConstraint("quantity <= 180"))
    collection_date = Column(Date)
    next_collection_date = Column(Date)
    overdue_date = Column(Date)

    patient = relationship("Patient")
    # Removed the relationship to Regimen since regimen is now a string