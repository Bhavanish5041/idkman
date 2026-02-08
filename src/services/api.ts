/**
 * API Client Service for Multi Hospital Management System
 * Provides typed fetch wrappers for backend API endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Generic fetch wrapper with error handling
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}

// Types (matching backend Pydantic models)
export interface Hospital {
    id: string;
    name: string;
    location: string;
    beds: number;
    occupancy: number;
}

export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: string;
    condition: string;
    department: string;
    admission_date: string;
    status: 'Critical' | 'Stable' | 'Recovering' | 'Discharged';
    room: string;
}

export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    department: string;
    experience: number;
    patients: number;
    availability: 'Available' | 'In Surgery' | 'Off Duty' | 'On Leave';
    email: string;
    phone: string;
}

export interface Appointment {
    id: string;
    patient_name: string;
    patient_id: string;
    doctor_name: string;
    department: string;
    date: string;
    time: string;
    type: string;
    status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
    room: string;
}

export interface Department {
    id: string;
    name: string;
    head: string;
    doctors: number;
    nurses: number;
    beds: number;
    patients: number;
    equipment: string[];
    description: string;
}

// Hospitals API
export const hospitalsAPI = {
    getAll: () => fetchAPI<Hospital[]>('/hospitals'),
    getById: (id: string) => fetchAPI<Hospital>(`/hospitals/${id}`),
    create: (data: Omit<Hospital, 'id'>) =>
        fetchAPI<Hospital>('/hospitals', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Hospital>) =>
        fetchAPI<Hospital>(`/hospitals/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
        fetchAPI<{ message: string }>(`/hospitals/${id}`, { method: 'DELETE' }),
};

// Patients API
export const patientsAPI = {
    getAll: (filters?: { status?: string; department?: string }) => {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.department) params.append('department', filters.department);
        const query = params.toString() ? `?${params.toString()}` : '';
        return fetchAPI<Patient[]>(`/patients${query}`);
    },
    getById: (id: string) => fetchAPI<Patient>(`/patients/${id}`),
    create: (data: Omit<Patient, 'id'>) =>
        fetchAPI<Patient>('/patients', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Patient>) =>
        fetchAPI<Patient>(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
        fetchAPI<{ message: string }>(`/patients/${id}`, { method: 'DELETE' }),
};

// Doctors API
export const doctorsAPI = {
    getAll: (filters?: { availability?: string; department?: string; specialty?: string }) => {
        const params = new URLSearchParams();
        if (filters?.availability) params.append('availability', filters.availability);
        if (filters?.department) params.append('department', filters.department);
        if (filters?.specialty) params.append('specialty', filters.specialty);
        const query = params.toString() ? `?${params.toString()}` : '';
        return fetchAPI<Doctor[]>(`/doctors${query}`);
    },
    getById: (id: string) => fetchAPI<Doctor>(`/doctors/${id}`),
    create: (data: Omit<Doctor, 'id'>) =>
        fetchAPI<Doctor>('/doctors', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Doctor>) =>
        fetchAPI<Doctor>(`/doctors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
        fetchAPI<{ message: string }>(`/doctors/${id}`, { method: 'DELETE' }),
};

// Appointments API
export const appointmentsAPI = {
    getAll: (filters?: { status?: string; date?: string; department?: string; patient_id?: string }) => {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.date) params.append('date', filters.date);
        if (filters?.department) params.append('department', filters.department);
        if (filters?.patient_id) params.append('patient_id', filters.patient_id);
        const query = params.toString() ? `?${params.toString()}` : '';
        return fetchAPI<Appointment[]>(`/appointments${query}`);
    },
    getById: (id: string) => fetchAPI<Appointment>(`/appointments/${id}`),
    create: (data: Omit<Appointment, 'id'>) =>
        fetchAPI<Appointment>('/appointments', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Appointment>) =>
        fetchAPI<Appointment>(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
        fetchAPI<{ message: string }>(`/appointments/${id}`, { method: 'DELETE' }),
};

// Departments API
export const departmentsAPI = {
    getAll: () => fetchAPI<Department[]>('/departments'),
    getById: (id: string) => fetchAPI<Department>(`/departments/${id}`),
    create: (data: Omit<Department, 'id'>) =>
        fetchAPI<Department>('/departments', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Department>) =>
        fetchAPI<Department>(`/departments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
        fetchAPI<{ message: string }>(`/departments/${id}`, { method: 'DELETE' }),
};

// Analytics API
export interface AnalyticsData {
    weekly_patients: { day: string; patients: number }[];
    department_distribution: { name: string; value: number; color: string }[];
    monthly_revenue: { month: string; revenue: number; expenses: number }[];
    patient_trends: { month: string; inpatient: number; outpatient: number }[];
    department_performance: { department: string; satisfaction: number; efficiency: number }[];
}

export const analyticsAPI = {
    getAll: () => fetchAPI<AnalyticsData>('/analytics'),
    getWeeklyPatients: () => fetchAPI<AnalyticsData['weekly_patients']>('/analytics/weekly-patients'),
    getDepartmentDistribution: () => fetchAPI<AnalyticsData['department_distribution']>('/analytics/department-distribution'),
    getMonthlyRevenue: () => fetchAPI<AnalyticsData['monthly_revenue']>('/analytics/monthly-revenue'),
    getPatientTrends: () => fetchAPI<AnalyticsData['patient_trends']>('/analytics/patient-trends'),
    getDepartmentPerformance: () => fetchAPI<AnalyticsData['department_performance']>('/analytics/department-performance'),
};

// Health check
export const healthCheck = () => fetchAPI<{ status: string }>('/health'.replace('/api', ''));
