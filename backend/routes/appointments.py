from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from models.appointment import Appointment, AppointmentCreate, AppointmentUpdate
from database import get_supabase

router = APIRouter()


@router.get("/", response_model=List[Appointment])
async def get_appointments(
    hospital_id: Optional[str] = Query(None, description="Filter by hospital ID"),
    status: Optional[str] = Query(None, description="Filter by status"),
    date: Optional[str] = Query(None, description="Filter by date"),
    department: Optional[str] = Query(None, description="Filter by department"),
    patient_id: Optional[str] = Query(None, description="Filter by patient ID")
):
    """Get all appointments with optional filters."""
    try:
        supabase = get_supabase()
        query = supabase.table("appointments").select("*")
        
        if hospital_id:
            query = query.eq("hospital_id", hospital_id)
        if status:
            query = query.eq("status", status)
        if date:
            query = query.eq("date", date)
        if department:
            query = query.eq("department", department)
        if patient_id:
            query = query.eq("patient_id", patient_id)
        
        response = query.order("date", desc=False).order("time", desc=False).execute()
        return response.data
    except Exception:
        return []


@router.get("/{appointment_id}", response_model=Appointment)
async def get_appointment(appointment_id: str):
    """Get a specific appointment by ID."""
    try:
        supabase = get_supabase()
        response = supabase.table("appointments").select("*").eq("id", appointment_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Appointment not found")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=404, detail="Appointment not found")


@router.post("/", response_model=Appointment)
async def create_appointment(appointment: AppointmentCreate):
    """Create a new appointment."""
    try:
        supabase = get_supabase()
        response = supabase.table("appointments").insert(appointment.model_dump()).execute()
        
        if not response.data:
            raise HTTPException(status_code=400, detail="Failed to create appointment")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{appointment_id}", response_model=Appointment)
async def update_appointment(appointment_id: str, appointment: AppointmentUpdate):
    """Update an appointment."""
    try:
        supabase = get_supabase()
        
        update_data = {k: v for k, v in appointment.model_dump().items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        response = supabase.table("appointments").update(update_data).eq("id", appointment_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Appointment not found")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{appointment_id}")
async def delete_appointment(appointment_id: str):
    """Delete an appointment."""
    try:
        supabase = get_supabase()
        response = supabase.table("appointments").delete().eq("id", appointment_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Appointment not found")
        
        return {"message": "Appointment deleted successfully"}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=404, detail="Appointment not found")
