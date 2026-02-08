from fastapi import APIRouter, HTTPException
from typing import List
from models.hospital import Hospital, HospitalCreate, HospitalUpdate
from database import get_supabase

router = APIRouter()


@router.get("/", response_model=List[Hospital])
async def get_hospitals():
    """Get all hospitals."""
    supabase = get_supabase()
    response = supabase.table("hospitals").select("*").execute()
    return response.data


@router.get("/{hospital_id}", response_model=Hospital)
async def get_hospital(hospital_id: str):
    """Get a specific hospital by ID."""
    supabase = get_supabase()
    response = supabase.table("hospitals").select("*").eq("id", hospital_id).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Hospital not found")
    
    return response.data[0]


@router.post("/", response_model=Hospital)
async def create_hospital(hospital: HospitalCreate):
    """Create a new hospital."""
    supabase = get_supabase()
    response = supabase.table("hospitals").insert(hospital.model_dump()).execute()
    
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create hospital")
    
    return response.data[0]


@router.put("/{hospital_id}", response_model=Hospital)
async def update_hospital(hospital_id: str, hospital: HospitalUpdate):
    """Update a hospital."""
    supabase = get_supabase()
    
    # Filter out None values
    update_data = {k: v for k, v in hospital.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    response = supabase.table("hospitals").update(update_data).eq("id", hospital_id).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Hospital not found")
    
    return response.data[0]


@router.delete("/{hospital_id}")
async def delete_hospital(hospital_id: str):
    """Delete a hospital."""
    supabase = get_supabase()
    response = supabase.table("hospitals").delete().eq("id", hospital_id).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Hospital not found")
    
    return {"message": "Hospital deleted successfully"}
