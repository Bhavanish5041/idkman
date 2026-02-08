from pydantic import BaseModel, Field, field_validator
from typing import Optional, Literal


AppointmentStatus = Literal['Scheduled', 'In Progress', 'Completed', 'Cancelled']
AppointmentType = Literal['Consultation', 'Follow-up', 'Check-up', 'Surgery', 'Prenatal', 'Emergency']


class AppointmentBase(BaseModel):
    """Base appointment model with common fields."""
    hospital_id: str = Field(..., min_length=1, description="Hospital for this appointment")
    patient_name: str = Field(..., min_length=1, max_length=100)
    patient_id: str = Field(..., min_length=1)
    doctor_name: str = Field(..., min_length=1, max_length=100)
    department: str = Field(..., min_length=1)
    date: str
    time: str = Field(..., min_length=1)
    type: AppointmentType
    status: AppointmentStatus = "Scheduled"
    room: str = Field(..., min_length=1)
    
    @field_validator('hospital_id')
    @classmethod
    def hospital_id_format(cls, v: str) -> str:
        if not v.startswith('H-'):
            raise ValueError('Hospital ID must start with "H-"')
        return v
    
    @field_validator('patient_id')
    @classmethod
    def patient_id_format(cls, v: str) -> str:
        if not v.startswith('P-'):
            raise ValueError('Patient ID must start with "P-"')
        return v


class AppointmentCreate(AppointmentBase):
    """Model for creating a new appointment."""
    pass


class AppointmentUpdate(BaseModel):
    """Model for updating an appointment (all fields optional)."""
    hospital_id: Optional[str] = None
    patient_name: Optional[str] = Field(None, min_length=1, max_length=100)
    patient_id: Optional[str] = None
    doctor_name: Optional[str] = Field(None, min_length=1, max_length=100)
    department: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    type: Optional[AppointmentType] = None
    status: Optional[AppointmentStatus] = None
    room: Optional[str] = None


class Appointment(AppointmentBase):
    """Complete appointment model with ID."""
    id: str
    
    class Config:
        from_attributes = True
