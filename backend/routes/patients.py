from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from models.patient import Patient, PatientCreate, PatientUpdate
from database import get_supabase

router = APIRouter()


@router.get("/", response_model=List[Patient])
async def get_patients(
    hospital_id: Optional[str] = Query(None, description="Filter by hospital ID"),
    status: Optional[str] = Query(None, description="Filter by status"),
    department: Optional[str] = Query(None, description="Filter by department")
):
    """Get all patients with optional filters."""
    try:
        supabase = get_supabase()
        query = supabase.table("patients").select("*")
        
        if hospital_id:
            query = query.eq("hospital_id", hospital_id)
        if status:
            query = query.eq("status", status)
        if department:
            query = query.eq("department", department)
        
        response = query.execute()
        return response.data
    except Exception:
        return []


@router.get("/{patient_id}", response_model=Patient)
async def get_patient(patient_id: str):
    """Get a specific patient by ID."""
    try:
        supabase = get_supabase()
        response = supabase.table("patients").select("*").eq("id", patient_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Patient not found")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=404, detail="Patient not found")


@router.post("/", response_model=Patient)
async def create_patient(patient: PatientCreate):
    """Create a new patient."""
    try:
        supabase = get_supabase()
        response = supabase.table("patients").insert(patient.model_dump()).execute()
        
        if not response.data:
            raise HTTPException(status_code=400, detail="Failed to create patient")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{patient_id}", response_model=Patient)
async def update_patient(patient_id: str, patient: PatientUpdate):
    """Update a patient."""
    try:
        supabase = get_supabase()
        
        update_data = {k: v for k, v in patient.model_dump().items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        response = supabase.table("patients").update(update_data).eq("id", patient_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Patient not found")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{patient_id}")
async def delete_patient(patient_id: str):
    """Delete a patient."""
    try:
        supabase = get_supabase()
        response = supabase.table("patients").delete().eq("id", patient_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Patient not found")
        
        return {"message": "Patient deleted successfully"}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=404, detail="Patient not found")
