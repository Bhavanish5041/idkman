from fastapi import APIRouter, Query
from typing import List, Optional
from models.analytics import (
    WeeklyData, DepartmentDistribution, MonthlyRevenue,
    PatientTrend, DepartmentPerformance, AnalyticsResponse
)
from database import get_supabase

router = APIRouter()

# Mock data fallbacks (used when database is empty or hospital not specified)
WEEKLY_PATIENTS_MOCK = [
    {"day": "Mon", "patients": 45},
    {"day": "Tue", "patients": 52},
    {"day": "Wed", "patients": 48},
    {"day": "Thu", "patients": 61},
    {"day": "Fri", "patients": 55},
    {"day": "Sat", "patients": 38},
    {"day": "Sun", "patients": 32},
]

DEPARTMENT_DISTRIBUTION_MOCK = [
    {"name": "Emergency", "value": 145, "color": "#EF4444"},
    {"name": "Surgery", "value": 98, "color": "#3B82F6"},
    {"name": "Pediatrics", "value": 76, "color": "#10B981"},
    {"name": "Cardiology", "value": 89, "color": "#F59E0B"},
    {"name": "Neurology", "value": 54, "color": "#8B5CF6"},
]

MONTHLY_REVENUE_MOCK = [
    {"month": "Jan", "revenue": 245000, "expenses": 180000},
    {"month": "Feb", "revenue": 268000, "expenses": 195000},
    {"month": "Mar", "revenue": 282000, "expenses": 205000},
    {"month": "Apr", "revenue": 298000, "expenses": 210000},
    {"month": "May", "revenue": 315000, "expenses": 225000},
    {"month": "Jun", "revenue": 332000, "expenses": 230000},
]

PATIENT_TRENDS_MOCK = [
    {"month": "Jan", "inpatient": 420, "outpatient": 1250},
    {"month": "Feb", "inpatient": 445, "outpatient": 1310},
    {"month": "Mar", "inpatient": 468, "outpatient": 1380},
    {"month": "Apr", "inpatient": 492, "outpatient": 1420},
    {"month": "May", "inpatient": 515, "outpatient": 1485},
    {"month": "Jun", "inpatient": 538, "outpatient": 1540},
]

DEPARTMENT_PERFORMANCE_MOCK = [
    {"department": "Cardiology", "satisfaction": 92, "efficiency": 88},
    {"department": "Neurology", "satisfaction": 89, "efficiency": 85},
    {"department": "Pediatrics", "satisfaction": 95, "efficiency": 91},
    {"department": "Orthopedics", "satisfaction": 87, "efficiency": 83},
    {"department": "Emergency", "satisfaction": 84, "efficiency": 90},
    {"department": "Surgery", "satisfaction": 90, "efficiency": 87},
]


@router.get("/weekly-patients", response_model=List[WeeklyData])
async def get_weekly_patients(
    hospital_id: Optional[str] = Query(None, description="Filter by hospital ID")
):
    """Get weekly patient admission data."""
    try:
        supabase = get_supabase()
        query = supabase.table("weekly_patients").select("*")
        if hospital_id:
            query = query.eq("hospital_id", hospital_id)
        response = query.execute()
        if response.data:
            return response.data
    except Exception:
        pass
    return WEEKLY_PATIENTS_MOCK


@router.get("/department-distribution", response_model=List[DepartmentDistribution])
async def get_department_distribution(
    hospital_id: Optional[str] = Query(None, description="Filter by hospital ID")
):
    """Get patient distribution by department."""
    try:
        supabase = get_supabase()
        query = supabase.table("department_distribution").select("*")
        if hospital_id:
            query = query.eq("hospital_id", hospital_id)
        response = query.execute()
        if response.data:
            return response.data
    except Exception:
        pass
    return DEPARTMENT_DISTRIBUTION_MOCK


@router.get("/monthly-revenue", response_model=List[MonthlyRevenue])
async def get_monthly_revenue(
    hospital_id: Optional[str] = Query(None, description="Filter by hospital ID")
):
    """Get monthly revenue and expenses data."""
    try:
        supabase = get_supabase()
        query = supabase.table("monthly_revenue").select("*")
        if hospital_id:
            query = query.eq("hospital_id", hospital_id)
        response = query.execute()
        if response.data:
            return response.data
    except Exception:
        pass
    return MONTHLY_REVENUE_MOCK


@router.get("/patient-trends", response_model=List[PatientTrend])
async def get_patient_trends(
    hospital_id: Optional[str] = Query(None, description="Filter by hospital ID")
):
    """Get inpatient vs outpatient trends."""
    try:
        supabase = get_supabase()
        query = supabase.table("patient_trends").select("*")
        if hospital_id:
            query = query.eq("hospital_id", hospital_id)
        response = query.execute()
        if response.data:
            return response.data
    except Exception:
        pass
    return PATIENT_TRENDS_MOCK


@router.get("/department-performance", response_model=List[DepartmentPerformance])
async def get_department_performance(
    hospital_id: Optional[str] = Query(None, description="Filter by hospital ID")
):
    """Get department satisfaction and efficiency scores."""
    try:
        supabase = get_supabase()
        query = supabase.table("department_performance").select("*")
        if hospital_id:
            query = query.eq("hospital_id", hospital_id)
        response = query.execute()
        if response.data:
            return response.data
    except Exception:
        pass
    return DEPARTMENT_PERFORMANCE_MOCK


@router.get("/", response_model=AnalyticsResponse)
async def get_all_analytics(
    hospital_id: Optional[str] = Query(None, description="Filter by hospital ID")
):
    """Get all analytics data in one request."""
    weekly = await get_weekly_patients(hospital_id)
    distribution = await get_department_distribution(hospital_id)
    revenue = await get_monthly_revenue(hospital_id)
    trends = await get_patient_trends(hospital_id)
    performance = await get_department_performance(hospital_id)
    
    return AnalyticsResponse(
        weekly_patients=weekly,
        department_distribution=distribution,
        monthly_revenue=revenue,
        patient_trends=trends,
        department_performance=performance
    )
