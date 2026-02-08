import { useState } from 'react';
import { Search, Plus, Mail, Phone, MoreVertical } from 'lucide-react';
import type { Hospital, Doctor } from '../data/types';
import { doctors } from '../data/mockData';

type DoctorsProps = {
  hospital: Hospital;
};

export function Doctors({ hospital }: DoctorsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || doctor.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departments = Array.from(new Set(doctors.map(d => d.department)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Medical Staff</h2>
          <p className="text-gray-600 mt-1">{filteredDoctors.length} doctors on staff</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          Add Doctor
        </button>
      </div>

      {/* Filters */}
      <div className="clay-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, specialty, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="clay-stat p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                  {doctor.name.split(' ')[1][0]}{doctor.name.split(' ')[2]?.[0] || doctor.name.split(' ')[1][1]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-sm text-gray-600">{doctor.id}</p>
                </div>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <p className="text-sm text-gray-600">Specialty</p>
                <p className="font-medium text-gray-900">{doctor.specialty}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium text-gray-900">{doctor.department}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-sm text-gray-600">Experience</p>
                  <p className="font-medium text-gray-900">{doctor.experience} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Patients</p>
                  <p className="font-medium text-gray-900">{doctor.patients}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <AvailabilityBadge availability={doctor.availability} />
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Email">
                  <Mail className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Call">
                  <Phone className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AvailabilityBadge({ availability }: { availability: Doctor['availability'] }) {
  const styles = {
    'Available': 'bg-green-100 text-green-700',
    'In Surgery': 'bg-red-100 text-red-700',
    'Off Duty': 'bg-gray-100 text-gray-700',
    'On Leave': 'bg-orange-100 text-orange-700',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[availability]}`}>
      {availability}
    </span>
  );
}
