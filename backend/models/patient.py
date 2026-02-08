from pydantic import BaseModel, Field, field_validator
from typing import Optional, Literal


PatientStatus = Literal['Critical', 'Stable', 'Recovering', 'Discharged']
Gender = Literal['Male', 'Female', 'Other']


class PatientBase(BaseModel):
    """Base patient model with common fields."""
    hospital_id: str = Field(..., min_length=1, description="Hospital this patient belongs to")
    name: str = Field(..., min_length=1, max_length=100)
    age: int = Field(..., gt=0, lt=150, description="Age must be between 1 and 149")
    gender: Gender
    condition: str = Field(..., min_length=1, max_length=200)
    department: str = Field(..., min_length=1)
    admission_date: str
    status: PatientStatus = "Stable"
    room: str = Field(..., min_length=1)
    
    @field_validator('name')
    @classmethod
    def name_must_not_be_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip()
    
    @field_validator('hospital_id')
    @classmethod
    def hospital_id_format(cls, v: str) -> str:
        if not v.startswith('H-'):
            raise ValueError('Hospital ID must start with "H-"')
        return v


class PatientCreate(PatientBase):
    """Model for creating a new patient."""
    pass


class PatientUpdate(BaseModel):
    """Model for updating a patient (all fields optional)."""
    hospital_id: Optional[str] = None
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    age: Optional[int] = Field(None, gt=0, lt=150)
    gender: Optional[Gender] = None
    condition: Optional[str] = Field(None, min_length=1, max_length=200)
    department: Optional[str] = None
    admission_date: Optional[str] = None
    status: Optional[PatientStatus] = None
    room: Optional[str] = None


class Patient(PatientBase):
    """Complete patient model with ID."""
    id: str
    
    class Config:
        from_attributes = True
