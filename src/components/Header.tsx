import { ChevronDown, Bell, Search } from 'lucide-react';
import { useState } from 'react';
import type { Hospital } from '../App';
import { hospitals } from '../App';

type HeaderProps = {
  selectedHospital: Hospital;
  onHospitalChange: (hospital: Hospital) => void;
};

export function Header({ selectedHospital, onHospitalChange }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div>
                <div className="text-sm font-medium text-gray-900">{selectedHospital.name}</div>
                <div className="text-xs text-gray-500">{selectedHospital.location}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            
            {showDropdown && (
              <div className="absolute top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {hospitals.map((hospital) => (
                  <button
                    key={hospital.id}
                    onClick={() => {
                      onHospitalChange(hospital);
                      setShowDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      selectedHospital.id === hospital.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="font-medium text-gray-900">{hospital.name}</div>
                    <div className="text-sm text-gray-500">{hospital.location}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {hospital.beds} beds • {Math.round((hospital.occupancy / hospital.beds) * 100)}% occupancy
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients, doctors, appointments..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">Admin User</div>
              <div className="text-xs text-gray-500">System Administrator</div>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
              A
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
