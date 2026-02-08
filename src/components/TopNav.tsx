import { LayoutDashboard, Users, Stethoscope, Calendar, Building2, BarChart3, ChevronDown, Bell, Search, Network, Activity, GitBranch } from 'lucide-react';
import { useState } from 'react';
import type { Page } from '../App';
import type { Hospital } from '../data/types';
import { hospitals } from '../data/mockData';

type TopNavProps = {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  selectedHospital: Hospital;
  onHospitalChange: (hospital: Hospital) => void;
  onSimulationToggle: () => void;
  isSimulationOpen: boolean;
};

const menuItems = [
  { id: 'dashboard' as Page, icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'patients' as Page, icon: Users, label: 'Patients' },
  { id: 'doctors' as Page, icon: Stethoscope, label: 'Doctors' },
  { id: 'appointments' as Page, icon: Calendar, label: 'Appointments' },
  { id: 'departments' as Page, icon: Building2, label: 'Departments' },
  { id: 'analytics' as Page, icon: BarChart3, label: 'Analytics' },
  { id: 'network' as Page, icon: Network, label: 'Network' },
  { id: 'graph' as Page, icon: GitBranch, label: 'Service Graph' },
];

export function TopNav({ currentPage, onPageChange, selectedHospital, onHospitalChange, onSimulationToggle, isSimulationOpen }: TopNavProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="clay-nav sticky top-0 z-50">
      {/* Top Bar */}
      <div className="border-b border-[#c5cdd8]">
        <div className="max-w-[1600px] mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#6b9ff5] to-[#5a86d4] rounded-2xl flex items-center justify-center clay-icon-bg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-[#2d3748] text-lg">HealthCare Pro</h1>
                <p className="text-xs text-[#6b7c93]">Multi-Hospital Management</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8a95a8]" />
                <input
                  type="text"
                  placeholder="Search patients, doctors, appointments..."
                  className="clay-input w-full pl-12 pr-4 py-2.5 text-[#2d3748] placeholder-[#8a95a8]"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Hospital Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="clay-card flex items-center gap-3 px-4 py-2 hover:shadow-2xl transition-all"
                >
                  <div className="text-left">
                    <div className="text-sm font-semibold text-[#2d3748]">{selectedHospital.name}</div>
                    <div className="text-xs text-[#6b7c93]">{selectedHospital.location}</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-[#6b7c93]" />
                </button>
                
                {showDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowDropdown(false)}
                    ></div>
                    <div className="clay-card absolute top-full right-0 mt-2 w-80 py-2 z-50">
                      {hospitals.map((hospital) => (
                        <button
                          key={hospital.id}
                          onClick={() => {
                            onHospitalChange(hospital);
                            setShowDropdown(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-[#d5dae3] transition-colors rounded-2xl mx-2 ${
                            selectedHospital.id === hospital.id ? 'bg-[#d5dae3]' : ''
                          }`}
                        >
                          <div className="font-semibold text-[#2d3748]">{hospital.name}</div>
                          <div className="text-sm text-[#6b7c93] mt-0.5">{hospital.location}</div>
                          <div className="flex items-center gap-3 text-xs text-[#8a95a8] mt-2">
                            <span>{hospital.beds} beds</span>
                            <span>•</span>
                            <span className={`font-medium ${Math.round((hospital.occupancy / hospital.beds) * 100) > 85 ? 'text-[#e76f51]' : 'text-[#2a9d8f]'}`}>
                              {Math.round((hospital.occupancy / hospital.beds) * 100)}% occupancy
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Notifications */}
              <button className="relative p-2.5 clay-card hover:shadow-2xl transition-all">
                <Bell className="w-5 h-5 text-[#6b7c93]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#e76f51] rounded-full"></span>
              </button>

              {/* Simulation Button */}
              <button 
                onClick={onSimulationToggle}
                className={`relative p-2.5 clay-card hover:shadow-2xl transition-all ${isSimulationOpen ? 'clay-button text-white' : ''}`}
              >
                <Activity className="w-5 h-5" />
                {!isSimulationOpen && <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#2a9d8f] rounded-full animate-pulse"></span>}
              </button>
              
              {/* User Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-[#c5cdd8]">
                <div className="text-right">
                  <div className="text-sm font-semibold text-[#2d3748]">Admin User</div>
                  <div className="text-xs text-[#6b7c93]">System Admin</div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-[#6b9ff5] to-[#5a86d4] rounded-2xl flex items-center justify-center text-white font-semibold clay-icon-bg">
                  A
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex items-center gap-2 py-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                  isActive
                    ? 'clay-button text-white'
                    : 'text-[#6b7c93] hover:bg-[#d5dae3] rounded-2xl'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
