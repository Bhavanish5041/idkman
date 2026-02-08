export type Hospital = {
  id: string;
  name: string;
  location: string;
  beds: number;
  occupancy: number;
};

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  department: string;
  admissionDate: string;
  status: 'Critical' | 'Stable' | 'Recovering' | 'Discharged';
  room: string;
};

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  department: string;
  experience: number;
  patients: number;
  availability: 'Available' | 'In Surgery' | 'Off Duty' | 'On Leave';
  email: string;
  phone: string;
};

export type Appointment = {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  type: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  room: string;
};

export type Department = {
  id: string;
  name: string;
  head: string;
  doctors: number;
  nurses: number;
  beds: number;
  patients: number;
  equipment: string[];
  description: string;
};

export type Activity = {
  id: string;
  time: string;
  text: string;
  type: 'admission' | 'surgery' | 'transfer' | 'lab' | 'discharge';
};

export type WeeklyData = {
  day: string;
  patients: number;
};

export type DepartmentDistribution = {
  name: string;
  value: number;
  color: string;
};

export type MonthlyRevenue = {
  month: string;
  revenue: number;
  expenses: number;
};

export type PatientTrend = {
  month: string;
  inpatient: number;
  outpatient: number;
};

export type DepartmentPerformance = {
  department: string;
  satisfaction: number;
  efficiency: number;
};
