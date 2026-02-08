-- Seed Data Migration for Multi Hospital Management System
-- Run this after 001_initial_schema.sql in your Supabase SQL Editor

-- Seed Hospitals
INSERT INTO hospitals (id, name, location, beds, occupancy) VALUES
    ('H-001', 'City General Hospital', 'New York, NY', 450, 378),
    ('H-002', 'St. Mary''s Medical Center', 'Los Angeles, CA', 380, 312),
    ('H-003', 'Memorial Healthcare', 'Chicago, IL', 520, 445),
    ('H-004', 'Riverside Hospital', 'Houston, TX', 290, 201);

-- Seed Departments for Hospital 1 (City General)
INSERT INTO departments (id, hospital_id, name, head, doctors, nurses, beds, patients, equipment, description) VALUES
    ('DEPT-001', 'H-001', 'Cardiology', 'Dr. Sarah Johnson', 12, 28, 45, 38, ARRAY['ECG Machines', 'Echocardiography', 'Cardiac Monitors'], 'Specialized in heart and cardiovascular system diseases'),
    ('DEPT-002', 'H-001', 'Neurology', 'Dr. Michael Chen', 10, 22, 38, 31, ARRAY['MRI Scanner', 'EEG Machines', 'CT Scanner'], 'Treatment of nervous system disorders'),
    ('DEPT-003', 'H-001', 'Pediatrics', 'Dr. Emily Williams', 15, 35, 52, 48, ARRAY['Incubators', 'Pediatric Monitors', 'Vaccination Units'], 'Comprehensive care for infants, children, and adolescents'),
    ('DEPT-004', 'H-001', 'Surgery', 'Dr. Lisa Thompson', 18, 40, 48, 41, ARRAY['Operating Tables', 'Anesthesia Machines', 'Surgical Instruments'], 'Advanced surgical procedures and post-operative care');

-- Seed Departments for Hospital 2 (St. Mary's)
INSERT INTO departments (id, hospital_id, name, head, doctors, nurses, beds, patients, equipment, description) VALUES
    ('DEPT-005', 'H-002', 'Cardiology', 'Dr. John Harris', 8, 20, 35, 28, ARRAY['ECG Machines', 'Cardiac Monitors'], 'Heart and cardiovascular care'),
    ('DEPT-006', 'H-002', 'Orthopedics', 'Dr. James Rodriguez', 14, 30, 42, 35, ARRAY['X-Ray Machines', 'Bone Densitometer', 'Arthroscopy Equipment'], 'Treatment of musculoskeletal system conditions'),
    ('DEPT-007', 'H-002', 'Emergency', 'Dr. Robert Lee', 20, 45, 35, 29, ARRAY['Defibrillators', 'Ventilators', 'Trauma Kits'], '24/7 emergency medical care'),
    ('DEPT-008', 'H-002', 'Internal Medicine', 'Dr. Amanda White', 12, 25, 40, 32, ARRAY['Ultrasound', 'Blood Analyzers'], 'General adult medicine');

-- Seed Departments for Hospital 3 (Memorial)
INSERT INTO departments (id, hospital_id, name, head, doctors, nurses, beds, patients, equipment, description) VALUES
    ('DEPT-009', 'H-003', 'Neurology', 'Dr. Patricia Moore', 12, 28, 45, 40, ARRAY['MRI Scanner', 'EEG Machines', 'CT Scanner'], 'Advanced neurological care'),
    ('DEPT-010', 'H-003', 'Pediatrics', 'Dr. Kevin Brown', 18, 40, 60, 52, ARRAY['Incubators', 'Pediatric Monitors'], 'Children healthcare'),
    ('DEPT-011', 'H-003', 'Obstetrics', 'Dr. Maria Garcia', 15, 35, 45, 38, ARRAY['Fetal Monitors', 'Ultrasound', 'Delivery Equipment'], 'Pregnancy and childbirth care'),
    ('DEPT-012', 'H-003', 'Radiology', 'Dr. David Kim', 10, 15, 10, 8, ARRAY['CT Scanner', 'MRI Machine', 'X-Ray Equipment'], 'Diagnostic imaging');

-- Seed Departments for Hospital 4 (Riverside)
INSERT INTO departments (id, hospital_id, name, head, doctors, nurses, beds, patients, equipment, description) VALUES
    ('DEPT-013', 'H-004', 'Emergency', 'Dr. Steven Clark', 16, 35, 30, 25, ARRAY['Defibrillators', 'Ventilators'], '24/7 emergency services'),
    ('DEPT-014', 'H-004', 'Surgery', 'Dr. Rachel Adams', 12, 28, 35, 28, ARRAY['Operating Tables', 'Surgical Instruments'], 'Surgical care'),
    ('DEPT-015', 'H-004', 'Endocrinology', 'Dr. Tom Wilson', 6, 12, 18, 14, ARRAY['Glucose Monitors', 'Thyroid Scanners'], 'Hormonal disorders treatment');

-- Seed Doctors for Hospital 1
INSERT INTO doctors (id, hospital_id, name, specialty, department, experience, patients, availability, email, phone) VALUES
    ('DOC-001', 'H-001', 'Dr. Sarah Johnson', 'Cardiologist', 'Cardiology', 15, 42, 'Available', 'sarah.j@citygen.com', '(555) 123-4567'),
    ('DOC-002', 'H-001', 'Dr. Michael Chen', 'Neurosurgeon', 'Neurology', 12, 28, 'In Surgery', 'michael.c@citygen.com', '(555) 234-5678'),
    ('DOC-003', 'H-001', 'Dr. Emily Williams', 'Pediatrician', 'Pediatrics', 8, 56, 'Available', 'emily.w@citygen.com', '(555) 345-6789'),
    ('DOC-004', 'H-001', 'Dr. Lisa Thompson', 'General Surgeon', 'Surgery', 10, 31, 'In Surgery', 'lisa.t@citygen.com', '(555) 456-7890');

-- Seed Doctors for Hospital 2
INSERT INTO doctors (id, hospital_id, name, specialty, department, experience, patients, availability, email, phone) VALUES
    ('DOC-005', 'H-002', 'Dr. John Harris', 'Cardiologist', 'Cardiology', 18, 38, 'Available', 'john.h@stmarys.com', '(555) 567-8901'),
    ('DOC-006', 'H-002', 'Dr. James Rodriguez', 'Orthopedic Surgeon', 'Orthopedics', 20, 45, 'Available', 'james.r@stmarys.com', '(555) 678-9012'),
    ('DOC-007', 'H-002', 'Dr. Robert Lee', 'Emergency Medicine', 'Emergency', 14, 62, 'Available', 'robert.l@stmarys.com', '(555) 789-0123'),
    ('DOC-008', 'H-002', 'Dr. Amanda White', 'Internist', 'Internal Medicine', 11, 35, 'Off Duty', 'amanda.w@stmarys.com', '(555) 890-1234');

-- Seed Doctors for Hospital 3
INSERT INTO doctors (id, hospital_id, name, specialty, department, experience, patients, availability, email, phone) VALUES
    ('DOC-009', 'H-003', 'Dr. Patricia Moore', 'Neurologist', 'Neurology', 16, 40, 'Available', 'patricia.m@memorial.com', '(555) 901-2345'),
    ('DOC-010', 'H-003', 'Dr. Kevin Brown', 'Pediatrician', 'Pediatrics', 9, 48, 'Available', 'kevin.b@memorial.com', '(555) 012-3456'),
    ('DOC-011', 'H-003', 'Dr. Maria Garcia', 'Obstetrician', 'Obstetrics', 14, 39, 'On Leave', 'maria.g@memorial.com', '(555) 123-4568'),
    ('DOC-012', 'H-003', 'Dr. David Kim', 'Radiologist', 'Radiology', 12, 24, 'Available', 'david.k@memorial.com', '(555) 234-5679');

-- Seed Doctors for Hospital 4
INSERT INTO doctors (id, hospital_id, name, specialty, department, experience, patients, availability, email, phone) VALUES
    ('DOC-013', 'H-004', 'Dr. Steven Clark', 'Emergency Medicine', 'Emergency', 15, 55, 'Available', 'steven.c@riverside.com', '(555) 345-6780'),
    ('DOC-014', 'H-004', 'Dr. Rachel Adams', 'General Surgeon', 'Surgery', 13, 33, 'In Surgery', 'rachel.a@riverside.com', '(555) 456-7891'),
    ('DOC-015', 'H-004', 'Dr. Tom Wilson', 'Endocrinologist', 'Endocrinology', 17, 28, 'Available', 'tom.w@riverside.com', '(555) 567-8902');

-- Seed Patients for Hospital 1
INSERT INTO patients (id, hospital_id, name, age, gender, condition, department, admission_date, status, room) VALUES
    ('P-1001', 'H-001', 'John Smith', 45, 'Male', 'Cardiac Arrest', 'Cardiology', '2026-02-05', 'Critical', 'ICU-4'),
    ('P-1002', 'H-001', 'Emma Johnson', 32, 'Female', 'Brain Surgery Recovery', 'Neurology', '2026-02-06', 'Recovering', 'W-102'),
    ('P-1003', 'H-001', 'Marcus White', 8, 'Male', 'Pneumonia', 'Pediatrics', '2026-02-07', 'Stable', 'P-205'),
    ('P-1004', 'H-001', 'Sarah Davis', 58, 'Female', 'Appendectomy', 'Surgery', '2026-02-04', 'Recovering', 'W-308');

-- Seed Patients for Hospital 2
INSERT INTO patients (id, hospital_id, name, age, gender, condition, department, admission_date, status, room) VALUES
    ('P-1005', 'H-002', 'David Wilson', 52, 'Male', 'Heart Failure', 'Cardiology', '2026-02-03', 'Critical', 'ICU-2'),
    ('P-1006', 'H-002', 'Lisa Anderson', 35, 'Female', 'Fractured Leg', 'Orthopedics', '2026-02-07', 'Stable', 'O-410'),
    ('P-1007', 'H-002', 'James Martinez', 41, 'Male', 'Car Accident', 'Emergency', '2026-02-02', 'Critical', 'E-156'),
    ('P-1008', 'H-002', 'Patricia Taylor', 68, 'Female', 'Diabetes Management', 'Internal Medicine', '2026-02-08', 'Stable', 'M-201');

-- Seed Patients for Hospital 3
INSERT INTO patients (id, hospital_id, name, age, gender, condition, department, admission_date, status, room) VALUES
    ('P-1009', 'H-003', 'Robert Brown', 55, 'Male', 'Stroke', 'Neurology', '2026-02-05', 'Critical', 'ICU-3'),
    ('P-1010', 'H-003', 'Jennifer Lee', 6, 'Female', 'Asthma', 'Pediatrics', '2026-02-06', 'Stable', 'P-102'),
    ('P-1011', 'H-003', 'Maria Santos', 29, 'Female', 'Maternity', 'Obstetrics', '2026-02-07', 'Stable', 'OB-205'),
    ('P-1012', 'H-003', 'Thomas Clark', 72, 'Male', 'CT Scan Required', 'Radiology', '2026-02-08', 'Stable', 'R-101');

-- Seed Patients for Hospital 4
INSERT INTO patients (id, hospital_id, name, age, gender, condition, department, admission_date, status, room) VALUES
    ('P-1013', 'H-004', 'Susan Miller', 48, 'Female', 'Severe Burns', 'Emergency', '2026-02-04', 'Critical', 'E-101'),
    ('P-1014', 'H-004', 'William Jones', 62, 'Male', 'Knee Replacement', 'Surgery', '2026-02-05', 'Recovering', 'S-202'),
    ('P-1015', 'H-004', 'Nancy Davis', 45, 'Female', 'Thyroid Disorder', 'Endocrinology', '2026-02-06', 'Stable', 'EN-103');

-- Seed Appointments for Hospital 1
INSERT INTO appointments (id, hospital_id, patient_name, patient_id, doctor_name, department, date, time, type, status, room) VALUES
    ('A-1001', 'H-001', 'John Smith', 'P-1001', 'Dr. Sarah Johnson', 'Cardiology', '2026-02-08', '09:00 AM', 'Consultation', 'Scheduled', 'C-101'),
    ('A-1002', 'H-001', 'Emma Johnson', 'P-1002', 'Dr. Michael Chen', 'Neurology', '2026-02-08', '10:30 AM', 'Follow-up', 'In Progress', 'N-204');

-- Seed Appointments for Hospital 2
INSERT INTO appointments (id, hospital_id, patient_name, patient_id, doctor_name, department, date, time, type, status, room) VALUES
    ('A-1003', 'H-002', 'Lisa Anderson', 'P-1006', 'Dr. James Rodriguez', 'Orthopedics', '2026-02-08', '11:00 AM', 'Check-up', 'Scheduled', 'O-102'),
    ('A-1004', 'H-002', 'Patricia Taylor', 'P-1008', 'Dr. Amanda White', 'Internal Medicine', '2026-02-08', '02:00 PM', 'Consultation', 'Scheduled', 'IM-305');

-- Seed Appointments for Hospital 3
INSERT INTO appointments (id, hospital_id, patient_name, patient_id, doctor_name, department, date, time, type, status, room) VALUES
    ('A-1005', 'H-003', 'Robert Brown', 'P-1009', 'Dr. Patricia Moore', 'Neurology', '2026-02-08', '03:30 PM', 'Follow-up', 'Scheduled', 'N-201'),
    ('A-1006', 'H-003', 'Maria Santos', 'P-1011', 'Dr. Maria Garcia', 'Obstetrics', '2026-02-09', '09:30 AM', 'Prenatal', 'Scheduled', 'OB-104');

-- Seed Appointments for Hospital 4
INSERT INTO appointments (id, hospital_id, patient_name, patient_id, doctor_name, department, date, time, type, status, room) VALUES
    ('A-1007', 'H-004', 'William Jones', 'P-1014', 'Dr. Rachel Adams', 'Surgery', '2026-02-09', '11:00 AM', 'Follow-up', 'Scheduled', 'S-102'),
    ('A-1008', 'H-004', 'Nancy Davis', 'P-1015', 'Dr. Tom Wilson', 'Endocrinology', '2026-02-09', '01:00 PM', 'Check-up', 'Scheduled', 'EN-203');

-- Seed Weekly Patients Data (per hospital)
INSERT INTO weekly_patients (hospital_id, day, patients) VALUES
    ('H-001', 'Mon', 45), ('H-001', 'Tue', 52), ('H-001', 'Wed', 48), ('H-001', 'Thu', 61), ('H-001', 'Fri', 55), ('H-001', 'Sat', 38), ('H-001', 'Sun', 32),
    ('H-002', 'Mon', 38), ('H-002', 'Tue', 45), ('H-002', 'Wed', 42), ('H-002', 'Thu', 50), ('H-002', 'Fri', 48), ('H-002', 'Sat', 30), ('H-002', 'Sun', 25),
    ('H-003', 'Mon', 55), ('H-003', 'Tue', 62), ('H-003', 'Wed', 58), ('H-003', 'Thu', 70), ('H-003', 'Fri', 65), ('H-003', 'Sat', 45), ('H-003', 'Sun', 40),
    ('H-004', 'Mon', 28), ('H-004', 'Tue', 32), ('H-004', 'Wed', 30), ('H-004', 'Thu', 38), ('H-004', 'Fri', 35), ('H-004', 'Sat', 22), ('H-004', 'Sun', 18);

-- Seed Department Distribution (per hospital)
INSERT INTO department_distribution (hospital_id, name, value, color) VALUES
    ('H-001', 'Cardiology', 89, '#EF4444'), ('H-001', 'Neurology', 54, '#3B82F6'), ('H-001', 'Pediatrics', 76, '#10B981'), ('H-001', 'Surgery', 65, '#F59E0B'),
    ('H-002', 'Cardiology', 45, '#EF4444'), ('H-002', 'Orthopedics', 62, '#3B82F6'), ('H-002', 'Emergency', 85, '#10B981'), ('H-002', 'Internal Medicine', 50, '#F59E0B'),
    ('H-003', 'Neurology', 72, '#EF4444'), ('H-003', 'Pediatrics', 90, '#3B82F6'), ('H-003', 'Obstetrics', 58, '#10B981'), ('H-003', 'Radiology', 35, '#F59E0B'),
    ('H-004', 'Emergency', 70, '#EF4444'), ('H-004', 'Surgery', 48, '#3B82F6'), ('H-004', 'Endocrinology', 25, '#10B981');

-- Seed Monthly Revenue (per hospital)
INSERT INTO monthly_revenue (hospital_id, month, revenue, expenses) VALUES
    ('H-001', 'Jan', 245000, 180000), ('H-001', 'Feb', 268000, 195000), ('H-001', 'Mar', 282000, 205000), ('H-001', 'Apr', 298000, 210000), ('H-001', 'May', 315000, 225000), ('H-001', 'Jun', 332000, 230000),
    ('H-002', 'Jan', 195000, 150000), ('H-002', 'Feb', 210000, 160000), ('H-002', 'Mar', 225000, 175000), ('H-002', 'Apr', 240000, 185000), ('H-002', 'May', 255000, 195000), ('H-002', 'Jun', 270000, 205000),
    ('H-003', 'Jan', 320000, 240000), ('H-003', 'Feb', 345000, 260000), ('H-003', 'Mar', 365000, 275000), ('H-003', 'Apr', 385000, 290000), ('H-003', 'May', 410000, 310000), ('H-003', 'Jun', 435000, 325000),
    ('H-004', 'Jan', 145000, 110000), ('H-004', 'Feb', 158000, 120000), ('H-004', 'Mar', 172000, 130000), ('H-004', 'Apr', 185000, 140000), ('H-004', 'May', 198000, 150000), ('H-004', 'Jun', 212000, 160000);

-- Seed Department Performance (per hospital)
INSERT INTO department_performance (hospital_id, department, satisfaction, efficiency) VALUES
    ('H-001', 'Cardiology', 92, 88), ('H-001', 'Neurology', 89, 85), ('H-001', 'Pediatrics', 95, 91), ('H-001', 'Surgery', 90, 87),
    ('H-002', 'Cardiology', 88, 84), ('H-002', 'Orthopedics', 91, 86), ('H-002', 'Emergency', 84, 90), ('H-002', 'Internal Medicine', 87, 82),
    ('H-003', 'Neurology', 93, 89), ('H-003', 'Pediatrics', 96, 92), ('H-003', 'Obstetrics', 94, 88), ('H-003', 'Radiology', 85, 91),
    ('H-004', 'Emergency', 82, 88), ('H-004', 'Surgery', 88, 85), ('H-004', 'Endocrinology', 90, 83);
