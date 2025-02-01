from sqlalchemy import Column, Integer, String, Date, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from backend.database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    middle_name = Column(String, index=True)
    last_name = Column(String, index=True)
    
    Collections = relationship("Collection", back_populates="patient", cascade="all, delete")

# class Regimen(Base):
#     __tablename__ = "regimens"

#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, index=True)

class Collection(Base):
    __tablename__ = "collections"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    regimen = Column(String)  # Changed regimen_id to regimen (String)
    quantity = Column(Integer, CheckConstraint("quantity <= 180"))
    collection_date = Column(Date)
    next_collection_date = Column(Date)

    patient = relationship("Patient")
    # Removed the relationship to Regimen since regimen is now a string
    
    # def calculate_next_collection_date(self):
    #     """Calculate next collection date as 3 months after the current collection date"""
    #     return self.collection_date + timedelta(weeks=12)  # 3 months later

    # def set_overdue_date(self):
    #     """Set overdue date based on collection date"""
    #     # For example, overdue if 1 month after the collection date
    #     return self.collection_date + timedelta(weeks=4)  # 1 month later