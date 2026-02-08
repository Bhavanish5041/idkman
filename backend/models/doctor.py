from pydantic import BaseModel, Field, field_validator
from typing import Optional, Literal
import re


DoctorAvailability = Literal['Available', 'In Surgery', 'Off Duty', 'On Leave']


class DoctorBase(BaseModel):
    """Base doctor model with common fields."""
    hospital_id: str = Field(..., min_length=1, description="Hospital this doctor belongs to")
    name: str = Field(..., min_length=1, max_length=100)
    specialty: str = Field(..., min_length=1, max_length=100)
    department: str = Field(..., min_length=1)
    experience: int = Field(..., ge=0, le=60, description="Years of experience (0-60)")
    patients: int = Field(..., ge=0, description="Current patient count")
    availability: DoctorAvailability = "Available"
    email: str = Field(..., min_length=1)
    phone: str = Field(..., min_length=1)
    
    @field_validator('hospital_id')
    @classmethod
    def hospital_id_format(cls, v: str) -> str:
        if not v.startswith('H-'):
            raise ValueError('Hospital ID must start with "H-"')
        return v
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str) -> str:
        if '@' not in v or '.' not in v:
            raise ValueError('Invalid email format')
        return v.lower()
    
    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        digits = re.sub(r'\D', '', v)
        if len(digits) < 10:
            raise ValueError('Phone number must have at least 10 digits')
        return v


class DoctorCreate(DoctorBase):
    """Model for creating a new doctor."""
    pass


class DoctorUpdate(BaseModel):
    """Model for updating a doctor (all fields optional)."""
    hospital_id: Optional[str] = None
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    specialty: Optional[str] = Field(None, min_length=1, max_length=100)
    department: Optional[str] = None
    experience: Optional[int] = Field(None, ge=0, le=60)
    patients: Optional[int] = Field(None, ge=0)
    availability: Optional[DoctorAvailability] = None
    email: Optional[str] = None
    phone: Optional[str] = None


class Doctor(DoctorBase):
    """Complete doctor model with ID."""
    id: str
    
    class Config:
        from_attributes = True
