from pydantic import BaseModel
from typing import List


class WeeklyData(BaseModel):
    """Weekly patient data."""
    day: str
    patients: int


class DepartmentDistribution(BaseModel):
    """Department distribution data for charts."""
    name: str
    value: int
    color: str


class MonthlyRevenue(BaseModel):
    """Monthly revenue data."""
    month: str
    revenue: int
    expenses: int


class PatientTrend(BaseModel):
    """Patient trend data."""
    month: str
    inpatient: int
    outpatient: int


class DepartmentPerformance(BaseModel):
    """Department performance data."""
    department: str
    satisfaction: int
    efficiency: int


class AnalyticsResponse(BaseModel):
    """Complete analytics response."""
    weekly_patients: List[WeeklyData]
    department_distribution: List[DepartmentDistribution]
    monthly_revenue: List[MonthlyRevenue]
    patient_trends: List[PatientTrend]
    department_performance: List[DepartmentPerformance]
