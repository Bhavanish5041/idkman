from pydantic import BaseModel, Field, field_validator
from typing import Optional


class HospitalBase(BaseModel):
    """Base hospital model with common fields."""
    name: str = Field(..., min_length=1, max_length=200)
    location: str = Field(..., min_length=1, max_length=200)
    beds: int = Field(..., ge=0, description="Total number of beds")
    occupancy: int = Field(..., ge=0, description="Current occupancy")
    
    @field_validator('occupancy')
    @classmethod
    def occupancy_must_not_exceed_beds(cls, v: int, info) -> int:
        beds = info.data.get('beds')
        if beds is not None and v > beds:
            raise ValueError(f'Occupancy ({v}) cannot exceed total beds ({beds})')
        return v


class HospitalCreate(HospitalBase):
    """Model for creating a new hospital."""
    pass


class HospitalUpdate(BaseModel):
    """Model for updating a hospital (all fields optional)."""
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    location: Optional[str] = Field(None, min_length=1, max_length=200)
    beds: Optional[int] = Field(None, ge=0)
    occupancy: Optional[int] = Field(None, ge=0)


class Hospital(HospitalBase):
    """Complete hospital model with ID."""
    id: str
    
    class Config:
        from_attributes = True
