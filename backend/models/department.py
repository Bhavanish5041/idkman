from pydantic import BaseModel, Field, field_validator
from typing import Optional, List


class DepartmentBase(BaseModel):
    """Base department model with common fields."""
    hospital_id: str = Field(..., min_length=1, description="Hospital this department belongs to")
    name: str = Field(..., min_length=1, max_length=100)
    head: str = Field(..., min_length=1, max_length=100)
    doctors: int = Field(..., ge=0, description="Number of doctors")
    nurses: int = Field(..., ge=0, description="Number of nurses")
    beds: int = Field(..., ge=0, description="Total beds")
    patients: int = Field(..., ge=0, description="Current patients")
    equipment: List[str] = Field(default_factory=list)
    description: Optional[str] = Field(None, max_length=500)
    
    @field_validator('hospital_id')
    @classmethod
    def hospital_id_format(cls, v: str) -> str:
        if not v.startswith('H-'):
            raise ValueError('Hospital ID must start with "H-"')
        return v
    
    @field_validator('patients')
    @classmethod
    def patients_must_not_exceed_beds(cls, v: int, info) -> int:
        beds = info.data.get('beds')
        if beds is not None and v > beds:
            raise ValueError(f'Patient count ({v}) cannot exceed total beds ({beds})')
        return v


class DepartmentCreate(DepartmentBase):
    """Model for creating a new department."""
    pass


class DepartmentUpdate(BaseModel):
    """Model for updating a department (all fields optional)."""
    hospital_id: Optional[str] = None
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    head: Optional[str] = Field(None, min_length=1, max_length=100)
    doctors: Optional[int] = Field(None, ge=0)
    nurses: Optional[int] = Field(None, ge=0)
    beds: Optional[int] = Field(None, ge=0)
    patients: Optional[int] = Field(None, ge=0)
    equipment: Optional[List[str]] = None
    description: Optional[str] = Field(None, max_length=500)


class Department(DepartmentBase):
    """Complete department model with ID."""
    id: str
    
    class Config:
        from_attributes = True
