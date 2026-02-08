import { Building2, Users, Bed, Activity } from 'lucide-react';
import type { Hospital, Department } from '../data/types';
import { departments } from '../data/mockData';

type DepartmentsProps = {
  hospital: Hospital;
};

export function Departments({ hospital }: DepartmentsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Departments</h2>
        <p className="text-gray-600 mt-1">{departments.length} active departments</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="clay-stat p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#6b9ff5] to-[#5a86d4] rounded-2xl clay-icon-bg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm text-[#6b7c93]">Total Departments</div>
          </div>
          <div className="text-2xl font-semibold text-[#2d3748]">{departments.length}</div>
        </div>
        <div className="clay-stat p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2a9d8f] to-[#218c80] rounded-2xl clay-icon-bg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm text-[#6b7c93]">Total Doctors</div>
          </div>
          <div className="text-2xl font-semibold text-[#2d3748]">
            {departments.reduce((sum, dept) => sum + dept.doctors, 0)}
          </div>
        </div>
        <div className="clay-stat p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#9d84b7] to-[#8672a2] rounded-2xl clay-icon-bg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm text-[#6b7c93]">Total Nurses</div>
          </div>
          <div className="text-2xl font-semibold text-[#2d3748]">
            {departments.reduce((sum, dept) => sum + dept.nurses, 0)}
          </div>
        </div>
        <div className="clay-stat p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#f4a261] to-[#e76f51] rounded-2xl clay-icon-bg flex items-center justify-center">
              <Bed className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm text-[#6b7c93]">Total Beds</div>
          </div>
          <div className="text-2xl font-semibold text-[#2d3748]">
            {departments.reduce((sum, dept) => sum + dept.beds, 0)}
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {departments.map((department) => (
          <div key={department.id} className="clay-stat p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#6b9ff5] to-[#5a86d4] rounded-2xl clay-icon-bg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{department.name}</h3>
                  <p className="text-sm text-gray-600">{department.id}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Department Head</div>
                <div className="text-sm font-medium text-gray-900">{department.head}</div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">{department.description}</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-200">
              <div>
                <div className="text-xs text-gray-500">Doctors</div>
                <div className="text-lg font-semibold text-gray-900">{department.doctors}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Nurses</div>
                <div className="text-lg font-semibold text-gray-900">{department.nurses}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Beds</div>
                <div className="text-lg font-semibold text-gray-900">{department.beds}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Patients</div>
                <div className="text-lg font-semibold text-gray-900">{department.patients}</div>
              </div>
            </div>

            {/* Bed Occupancy Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Bed Occupancy</span>
                <span className="font-medium text-gray-900">
                  {Math.round((department.patients / department.beds) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    (department.patients / department.beds) > 0.85 ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(department.patients / department.beds) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Equipment */}
            <div>
              <div className="text-xs text-gray-500 mb-2">Key Equipment</div>
              <div className="flex flex-wrap gap-2">
                {department.equipment.map((item, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
