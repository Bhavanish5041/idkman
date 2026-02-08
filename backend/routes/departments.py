from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from models.department import Department, DepartmentCreate, DepartmentUpdate
from database import get_supabase

router = APIRouter()


@router.get("/", response_model=List[Department])
async def get_departments(
    hospital_id: Optional[str] = Query(None, description="Filter by hospital ID")
):
    """Get all departments with optional hospital filter."""
    try:
        supabase = get_supabase()
        query = supabase.table("departments").select("*")
        
        if hospital_id:
            query = query.eq("hospital_id", hospital_id)
        
        response = query.execute()
        return response.data
    except Exception:
        return []


@router.get("/{department_id}", response_model=Department)
async def get_department(department_id: str):
    """Get a specific department by ID."""
    try:
        supabase = get_supabase()
        response = supabase.table("departments").select("*").eq("id", department_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Department not found")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=404, detail="Department not found")


@router.post("/", response_model=Department)
async def create_department(department: DepartmentCreate):
    """Create a new department."""
    try:
        supabase = get_supabase()
        response = supabase.table("departments").insert(department.model_dump()).execute()
        
        if not response.data:
            raise HTTPException(status_code=400, detail="Failed to create department")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{department_id}", response_model=Department)
async def update_department(department_id: str, department: DepartmentUpdate):
    """Update a department."""
    try:
        supabase = get_supabase()
        
        update_data = {k: v for k, v in department.model_dump().items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        response = supabase.table("departments").update(update_data).eq("id", department_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Department not found")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{department_id}")
async def delete_department(department_id: str):
    """Delete a department."""
    try:
        supabase = get_supabase()
        response = supabase.table("departments").delete().eq("id", department_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Department not found")
        
        return {"message": "Department deleted successfully"}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=404, detail="Department not found")
