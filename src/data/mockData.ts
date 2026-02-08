import type {
  Hospital,
  Patient,
  Doctor,
  Appointment,
  Department,
  Activity,
  WeeklyData,
  DepartmentDistribution,
  MonthlyRevenue,
  PatientTrend,
  DepartmentPerformance
} from './types';

// Hospitals Data
export const hospitals: Hospital[] = [
  { id: '1', name: 'City General Hospital', location: 'New York, NY', beds: 450, occupancy: 378 },
  { id: '2', name: 'St. Mary\'s Medical Center', location: 'Los Angeles, CA', beds: 380, occupancy: 312 },
  { id: '3', name: 'Memorial Healthcare', location: 'Chicago, IL', beds: 520, occupancy: 445 },
  { id: '4', name: 'Riverside Hospital', location: 'Houston, TX', beds: 290, occupancy: 201 },
];

// Patients Data
export const patients: Patient[] = [
  { id: 'P-1001', name: 'John Smith', age: 45, gender: 'Male', condition: 'Cardiac Arrest', department: 'Cardiology', admissionDate: '2026-02-05', status: 'Critical', room: 'ICU-4' },
  { id: 'P-1002', name: 'Emma Johnson', age: 32, gender: 'Female', condition: 'Appendicitis', department: 'Surgery', admissionDate: '2026-02-06', status: 'Recovering', room: 'W-102' },
  { id: 'P-1003', name: 'Michael Brown', age: 28, gender: 'Male', condition: 'Fracture', department: 'Orthopedics', admissionDate: '2026-02-07', status: 'Stable', room: 'W-205' },
  { id: 'P-1004', name: 'Sarah Davis', age: 58, gender: 'Female', condition: 'Pneumonia', department: 'Internal Medicine', admissionDate: '2026-02-04', status: 'Recovering', room: 'W-308' },
  { id: 'P-1005', name: 'David Wilson', age: 41, gender: 'Male', condition: 'Stroke', department: 'Neurology', admissionDate: '2026-02-03', status: 'Critical', room: 'ICU-2' },
  { id: 'P-1006', name: 'Lisa Anderson', age: 35, gender: 'Female', condition: 'Diabetes Management', department: 'Endocrinology', admissionDate: '2026-02-07', status: 'Stable', room: 'W-410' },
  { id: 'P-1007', name: 'James Martinez', age: 62, gender: 'Male', condition: 'Heart Failure', department: 'Cardiology', admissionDate: '2026-02-02', status: 'Stable', room: 'W-156' },
  { id: 'P-1008', name: 'Patricia Taylor', age: 29, gender: 'Female', condition: 'Maternity', department: 'Obstetrics', admissionDate: '2026-02-08', status: 'Stable', room: 'M-201' },
];

// Doctors Data
export const doctors: Doctor[] = [
  { id: 'D-001', name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', department: 'Cardiology', experience: 15, patients: 42, availability: 'Available', email: 'sarah.j@hospital.com', phone: '(555) 123-4567' },
  { id: 'D-002', name: 'Dr. Michael Chen', specialty: 'Neurosurgeon', department: 'Neurology', experience: 12, patients: 28, availability: 'In Surgery', email: 'michael.c@hospital.com', phone: '(555) 234-5678' },
  { id: 'D-003', name: 'Dr. Emily Williams', specialty: 'Pediatrician', department: 'Pediatrics', experience: 8, patients: 56, availability: 'Available', email: 'emily.w@hospital.com', phone: '(555) 345-6789' },
  { id: 'D-004', name: 'Dr. James Rodriguez', specialty: 'Orthopedic Surgeon', department: 'Orthopedics', experience: 18, patients: 35, availability: 'Available', email: 'james.r@hospital.com', phone: '(555) 456-7890' },
  { id: 'D-005', name: 'Dr. Lisa Thompson', specialty: 'General Surgeon', department: 'Surgery', experience: 10, patients: 31, availability: 'In Surgery', email: 'lisa.t@hospital.com', phone: '(555) 567-8901' },
  { id: 'D-006', name: 'Dr. Robert Lee', specialty: 'Internist', department: 'Internal Medicine', experience: 20, patients: 48, availability: 'Available', email: 'robert.l@hospital.com', phone: '(555) 678-9012' },
  { id: 'D-007', name: 'Dr. Maria Garcia', specialty: 'Obstetrician', department: 'Obstetrics', experience: 14, patients: 39, availability: 'Off Duty', email: 'maria.g@hospital.com', phone: '(555) 789-0123' },
  { id: 'D-008', name: 'Dr. David Kim', specialty: 'Radiologist', department: 'Radiology', experience: 9, patients: 24, availability: 'Available', email: 'david.k@hospital.com', phone: '(555) 890-1234' },
];

// Appointments Data
export const appointments: Appointment[] = [
  { id: 'A-1001', patientName: 'John Smith', patientId: 'P-1001', doctorName: 'Dr. Sarah Johnson', department: 'Cardiology', date: '2026-02-08', time: '09:00 AM', type: 'Consultation', status: 'Scheduled', room: 'C-101' },
  { id: 'A-1002', patientName: 'Emma Johnson', patientId: 'P-1002', doctorName: 'Dr. Lisa Thompson', department: 'Surgery', date: '2026-02-08', time: '10:30 AM', type: 'Follow-up', status: 'In Progress', room: 'S-204' },
  { id: 'A-1003', patientName: 'Michael Brown', patientId: 'P-1003', doctorName: 'Dr. James Rodriguez', department: 'Orthopedics', date: '2026-02-08', time: '11:00 AM', type: 'Check-up', status: 'Scheduled', room: 'O-102' },
  { id: 'A-1004', patientName: 'Sarah Davis', patientId: 'P-1004', doctorName: 'Dr. Robert Lee', department: 'Internal Medicine', date: '2026-02-08', time: '02:00 PM', type: 'Consultation', status: 'Scheduled', room: 'IM-305' },
  { id: 'A-1005', patientName: 'David Wilson', patientId: 'P-1005', doctorName: 'Dr. Michael Chen', department: 'Neurology', date: '2026-02-08', time: '03:30 PM', type: 'Follow-up', status: 'Scheduled', room: 'N-201' },
  { id: 'A-1006', patientName: 'Lisa Anderson', patientId: 'P-1006', doctorName: 'Dr. Robert Lee', department: 'Endocrinology', date: '2026-02-09', time: '09:30 AM', type: 'Check-up', status: 'Scheduled', room: 'E-104' },
  { id: 'A-1007', patientName: 'James Martinez', patientId: 'P-1007', doctorName: 'Dr. Sarah Johnson', department: 'Cardiology', date: '2026-02-09', time: '11:00 AM', type: 'Consultation', status: 'Scheduled', room: 'C-102' },
  { id: 'A-1008', patientName: 'Patricia Taylor', patientId: 'P-1008', doctorName: 'Dr. Maria Garcia', department: 'Obstetrics', date: '2026-02-09', time: '01:00 PM', type: 'Prenatal', status: 'Scheduled', room: 'OB-203' },
];

// Departments Data
export const departments: Department[] = [
  {
    id: 'D-001',
    name: 'Cardiology',
    head: 'Dr. Sarah Johnson',
    doctors: 12,
    nurses: 28,
    beds: 45,
    patients: 38,
    equipment: ['ECG Machines', 'Echocardiography', 'Cardiac Monitors'],
    description: 'Specialized in heart and cardiovascular system diseases'
  },
  {
    id: 'D-002',
    name: 'Neurology',
    head: 'Dr. Michael Chen',
    doctors: 10,
    nurses: 22,
    beds: 38,
    patients: 31,
    equipment: ['MRI Scanner', 'EEG Machines', 'CT Scanner'],
    description: 'Treatment of nervous system disorders'
  },
  {
    id: 'D-003',
    name: 'Pediatrics',
    head: 'Dr. Emily Williams',
    doctors: 15,
    nurses: 35,
    beds: 52,
    patients: 48,
    equipment: ['Incubators', 'Pediatric Monitors', 'Vaccination Units'],
    description: 'Comprehensive care for infants, children, and adolescents'
  },
  {
    id: 'D-004',
    name: 'Orthopedics',
    head: 'Dr. James Rodriguez',
    doctors: 14,
    nurses: 30,
    beds: 42,
    patients: 35,
    equipment: ['X-Ray Machines', 'Bone Densitometer', 'Arthroscopy Equipment'],
    description: 'Treatment of musculoskeletal system conditions'
  },
  {
    id: 'D-005',
    name: 'Emergency',
    head: 'Dr. Robert Lee',
    doctors: 20,
    nurses: 45,
    beds: 35,
    patients: 29,
    equipment: ['Defibrillators', 'Ventilators', 'Trauma Kits'],
    description: '24/7 emergency medical care and trauma services'
  },
  {
    id: 'D-006',
    name: 'Surgery',
    head: 'Dr. Lisa Thompson',
    doctors: 18,
    nurses: 40,
    beds: 48,
    patients: 41,
    equipment: ['Operating Tables', 'Anesthesia Machines', 'Surgical Instruments'],
    description: 'Advanced surgical procedures and post-operative care'
  },
];

// Recent Activity Data
export const recentActivities: Activity[] = [
  { id: '1', time: '10 minutes ago', text: 'New patient admission: John Smith - Emergency Department', type: 'admission' },
  { id: '2', time: '25 minutes ago', text: 'Dr. Sarah Johnson completed surgery - OR Room 3', type: 'surgery' },
  { id: '3', time: '1 hour ago', text: 'Bed transfer: Patient moved from ICU to General Ward', type: 'transfer' },
  { id: '4', time: '2 hours ago', text: 'Lab results completed for Patient ID: P-4821', type: 'lab' },
  { id: '5', time: '3 hours ago', text: 'Discharge processed: Emily Davis - Cardiology', type: 'discharge' },
];

// Dashboard Charts Data
export const weeklyPatients: WeeklyData[] = [
  { day: 'Mon', patients: 45 },
  { day: 'Tue', patients: 52 },
  { day: 'Wed', patients: 48 },
  { day: 'Thu', patients: 61 },
  { day: 'Fri', patients: 55 },
  { day: 'Sat', patients: 38 },
  { day: 'Sun', patients: 32 },
];

export const departmentDistribution: DepartmentDistribution[] = [
  { name: 'Emergency', value: 145, color: '#EF4444' },
  { name: 'Surgery', value: 98, color: '#3B82F6' },
  { name: 'Pediatrics', value: 76, color: '#10B981' },
  { name: 'Cardiology', value: 89, color: '#F59E0B' },
  { name: 'Neurology', value: 54, color: '#8B5CF6' },
];

// Analytics Data
export const monthlyRevenue: MonthlyRevenue[] = [
  { month: 'Jan', revenue: 245000, expenses: 180000 },
  { month: 'Feb', revenue: 268000, expenses: 195000 },
  { month: 'Mar', revenue: 282000, expenses: 205000 },
  { month: 'Apr', revenue: 298000, expenses: 210000 },
  { month: 'May', revenue: 315000, expenses: 225000 },
  { month: 'Jun', revenue: 332000, expenses: 230000 },
];

export const patientTrends: PatientTrend[] = [
  { month: 'Jan', inpatient: 420, outpatient: 1250 },
  { month: 'Feb', inpatient: 445, outpatient: 1310 },
  { month: 'Mar', inpatient: 468, outpatient: 1380 },
  { month: 'Apr', inpatient: 492, outpatient: 1420 },
  { month: 'May', inpatient: 515, outpatient: 1485 },
  { month: 'Jun', inpatient: 538, outpatient: 1540 },
];

export const departmentPerformance: DepartmentPerformance[] = [
  { department: 'Cardiology', satisfaction: 92, efficiency: 88 },
  { department: 'Neurology', satisfaction: 89, efficiency: 85 },
  { department: 'Pediatrics', satisfaction: 95, efficiency: 91 },
  { department: 'Orthopedics', satisfaction: 87, efficiency: 83 },
  { department: 'Emergency', satisfaction: 84, efficiency: 90 },
  { department: 'Surgery', satisfaction: 90, efficiency: 87 },
];

export const admissionsByDay: WeeklyData[] = [
  { day: 'Monday', patients: 45 },
  { day: 'Tuesday', patients: 52 },
  { day: 'Wednesday', patients: 48 },
  { day: 'Thursday', patients: 61 },
  { day: 'Friday', patients: 55 },
  { day: 'Saturday', patients: 38 },
  { day: 'Sunday', patients: 32 },
];
