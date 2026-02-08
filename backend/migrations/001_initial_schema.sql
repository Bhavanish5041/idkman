-- Initial Schema Migration for Multi Hospital Management System
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Hospitals Table
CREATE TABLE IF NOT EXISTS hospitals (
    id TEXT PRIMARY KEY DEFAULT 'H-' || uuid_generate_v4()::text,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    beds INTEGER NOT NULL DEFAULT 0 CHECK (beds >= 0),
    occupancy INTEGER NOT NULL DEFAULT 0 CHECK (occupancy >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_occupancy CHECK (occupancy <= beds)
);

-- Departments Table (linked to hospital)
CREATE TABLE IF NOT EXISTS departments (
    id TEXT PRIMARY KEY DEFAULT 'DEPT-' || uuid_generate_v4()::text,
    hospital_id TEXT NOT NULL,
    name TEXT NOT NULL,
    head TEXT NOT NULL,
    doctors INTEGER NOT NULL DEFAULT 0 CHECK (doctors >= 0),
    nurses INTEGER NOT NULL DEFAULT 0 CHECK (nurses >= 0),
    beds INTEGER NOT NULL DEFAULT 0 CHECK (beds >= 0),
    patients INTEGER NOT NULL DEFAULT 0 CHECK (patients >= 0),
    equipment TEXT[] DEFAULT '{}',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_dept_occupancy CHECK (patients <= beds)
);

-- Doctors Table (linked to hospital)
CREATE TABLE IF NOT EXISTS doctors (
    id TEXT PRIMARY KEY DEFAULT 'DOC-' || uuid_generate_v4()::text,
    hospital_id TEXT NOT NULL,
    name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    department TEXT NOT NULL,
    experience INTEGER NOT NULL DEFAULT 0 CHECK (experience >= 0),
    patients INTEGER NOT NULL DEFAULT 0 CHECK (patients >= 0),
    availability TEXT NOT NULL DEFAULT 'Available' CHECK (availability IN ('Available', 'In Surgery', 'Off Duty', 'On Leave')),
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patients Table (linked to hospital)
CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY DEFAULT 'P-' || uuid_generate_v4()::text,
    hospital_id TEXT NOT NULL,
    name TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age > 0 AND age < 150),
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    condition TEXT NOT NULL,
    department TEXT NOT NULL,
    admission_date DATE NOT NULL,
    discharge_date DATE,
    status TEXT NOT NULL DEFAULT 'Stable' CHECK (status IN ('Critical', 'Stable', 'Recovering', 'Discharged')),
    room TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (discharge_date IS NULL OR discharge_date >= admission_date)
);

-- Appointments Table (linked to hospital)
CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY DEFAULT 'A-' || uuid_generate_v4()::text,
    hospital_id TEXT NOT NULL,
    patient_name TEXT NOT NULL,
    patient_id TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    doctor_id TEXT,
    department TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Consultation', 'Follow-up', 'Check-up', 'Surgery', 'Prenatal', 'Emergency')),
    status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'In Progress', 'Completed', 'Cancelled')),
    room TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Tables (linked to hospital)
CREATE TABLE IF NOT EXISTS weekly_patients (
    id SERIAL PRIMARY KEY,
    hospital_id TEXT NOT NULL,
    day TEXT NOT NULL CHECK (day IN ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun')),
    patients INTEGER NOT NULL DEFAULT 0 CHECK (patients >= 0)
);

CREATE TABLE IF NOT EXISTS department_distribution (
    id SERIAL PRIMARY KEY,
    hospital_id TEXT NOT NULL,
    name TEXT NOT NULL,
    value INTEGER NOT NULL DEFAULT 0 CHECK (value >= 0),
    color TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS monthly_revenue (
    id SERIAL PRIMARY KEY,
    hospital_id TEXT NOT NULL,
    month TEXT NOT NULL CHECK (month IN ('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec')),
    revenue INTEGER NOT NULL DEFAULT 0 CHECK (revenue >= 0),
    expenses INTEGER NOT NULL DEFAULT 0 CHECK (expenses >= 0)
);

CREATE TABLE IF NOT EXISTS patient_trends (
    id SERIAL PRIMARY KEY,
    hospital_id TEXT NOT NULL,
    month TEXT NOT NULL CHECK (month IN ('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec')),
    inpatient INTEGER NOT NULL DEFAULT 0 CHECK (inpatient >= 0),
    outpatient INTEGER NOT NULL DEFAULT 0 CHECK (outpatient >= 0)
);

CREATE TABLE IF NOT EXISTS department_performance (
    id SERIAL PRIMARY KEY,
    hospital_id TEXT NOT NULL,
    department TEXT NOT NULL,
    satisfaction INTEGER NOT NULL DEFAULT 0 CHECK (satisfaction >= 0 AND satisfaction <= 100),
    efficiency INTEGER NOT NULL DEFAULT 0 CHECK (efficiency >= 0 AND efficiency <= 100)
);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for auto-updating timestamps
CREATE TRIGGER update_hospitals_updated_at BEFORE UPDATE ON hospitals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_departments_hospital ON departments(hospital_id);
CREATE INDEX IF NOT EXISTS idx_doctors_hospital ON doctors(hospital_id);
CREATE INDEX IF NOT EXISTS idx_patients_hospital ON patients(hospital_id);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_patients_department ON patients(department);
CREATE INDEX IF NOT EXISTS idx_doctors_availability ON doctors(availability);
CREATE INDEX IF NOT EXISTS idx_doctors_department ON doctors(department);
CREATE INDEX IF NOT EXISTS idx_appointments_hospital ON appointments(hospital_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);

-- Enable Row Level Security
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON hospitals FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON departments FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON doctors FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON patients FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON appointments FOR SELECT USING (true);

-- Create policies for insert/update/delete
CREATE POLICY "Enable insert for authenticated users" ON hospitals FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON hospitals FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON hospitals FOR DELETE USING (true);

CREATE POLICY "Enable insert for authenticated users" ON departments FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON departments FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON departments FOR DELETE USING (true);

CREATE POLICY "Enable insert for authenticated users" ON doctors FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON doctors FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON doctors FOR DELETE USING (true);

CREATE POLICY "Enable insert for authenticated users" ON patients FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON patients FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON patients FOR DELETE USING (true);

CREATE POLICY "Enable insert for authenticated users" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON appointments FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON appointments FOR DELETE USING (true);
