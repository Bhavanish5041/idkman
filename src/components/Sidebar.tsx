import { LayoutDashboard, Users, Stethoscope, Calendar, Building2, BarChart3 } from 'lucide-react';
import type { Page } from '../App';

type SidebarProps = {
  currentPage: Page;
  onPageChange: (page: Page) => void;
};

const menuItems = [
  { id: 'dashboard' as Page, icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'patients' as Page, icon: Users, label: 'Patients' },
  { id: 'doctors' as Page, icon: Stethoscope, label: 'Doctors' },
  { id: 'appointments' as Page, icon: Calendar, label: 'Appointments' },
  { id: 'departments' as Page, icon: Building2, label: 'Departments' },
  { id: 'analytics' as Page, icon: BarChart3, label: 'Analytics' },
];

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">HealthCare</h1>
            <p className="text-sm text-gray-500">Multi-Hospital System</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
