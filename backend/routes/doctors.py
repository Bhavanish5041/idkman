from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from models.doctor import Doctor, DoctorCreate, DoctorUpdate
from database import get_supabase

router = APIRouter()


@router.get("/", response_model=List[Doctor])
async def get_doctors(
    hospital_id: Optional[str] = Query(None, description="Filter by hospital ID"),
    availability: Optional[str] = Query(None, description="Filter by availability"),
    department: Optional[str] = Query(None, description="Filter by department"),
    specialty: Optional[str] = Query(None, description="Filter by specialty")
):
    """Get all doctors with optional filters."""
    try:
        supabase = get_supabase()
        query = supabase.table("doctors").select("*")
        
        if hospital_id:
            query = query.eq("hospital_id", hospital_id)
        if availability:
            query = query.eq("availability", availability)
        if department:
            query = query.eq("department", department)
        if specialty:
            query = query.eq("specialty", specialty)
        
        response = query.execute()
        return response.data
    except Exception:
        return []


@router.get("/{doctor_id}", response_model=Doctor)
async def get_doctor(doctor_id: str):
    """Get a specific doctor by ID."""
    try:
        supabase = get_supabase()
        response = supabase.table("doctors").select("*").eq("id", doctor_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Doctor not found")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=404, detail="Doctor not found")


@router.post("/", response_model=Doctor)
async def create_doctor(doctor: DoctorCreate):
    """Create a new doctor."""
    try:
        supabase = get_supabase()
        response = supabase.table("doctors").insert(doctor.model_dump()).execute()
        
        if not response.data:
            raise HTTPException(status_code=400, detail="Failed to create doctor")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{doctor_id}", response_model=Doctor)
async def update_doctor(doctor_id: str, doctor: DoctorUpdate):
    """Update a doctor."""
    try:
        supabase = get_supabase()
        
        update_data = {k: v for k, v in doctor.model_dump().items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        response = supabase.table("doctors").update(update_data).eq("id", doctor_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Doctor not found")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{doctor_id}")
async def delete_doctor(doctor_id: str):
    """Delete a doctor."""
    try:
        supabase = get_supabase()
        response = supabase.table("doctors").delete().eq("id", doctor_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Doctor not found")
        
        return {"message": "Doctor deleted successfully"}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=404, detail="Doctor not found")
