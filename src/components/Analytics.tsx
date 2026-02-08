import { DollarSign, Users, Calendar, TrendingUp } from 'lucide-react';
import type { Hospital } from '../data/types';
import { monthlyRevenue, patientTrends, admissionsByDay, departmentPerformance } from '../data/mockData';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type AnalyticsProps = {
  hospital: Hospital;
};

export function Analytics({ hospital }: AnalyticsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#2d3748]">Analytics & Reports</h2>
        <p className="text-[#6b7c93] mt-1">Performance metrics and insights for {hospital.name}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="clay-stat p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2a9d8f] to-[#218c80] rounded-2xl clay-icon-bg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm text-[#2a9d8f] font-medium">+12.5%</span>
          </div>
          <div className="text-2xl font-semibold text-[#2d3748]">$332K</div>
          <div className="text-sm text-[#6b7c93] mt-1">Monthly Revenue</div>
        </div>

        <div className="clay-stat p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#6b9ff5] to-[#5a86d4] rounded-2xl clay-icon-bg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm text-[#6b9ff5] font-medium">+8.2%</span>
          </div>
          <div className="text-2xl font-semibold text-[#2d3748]">2,078</div>
          <div className="text-sm text-[#6b7c93] mt-1">Total Patients</div>
        </div>

        <div className="clay-stat p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#9d84b7] to-[#8672a2] rounded-2xl clay-icon-bg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm text-[#9d84b7] font-medium">+15.3%</span>
          </div>
          <div className="text-2xl font-semibold text-[#2d3748]">1,540</div>
          <div className="text-sm text-[#6b7c93] mt-1">Appointments</div>
        </div>

        <div className="clay-stat p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#f4a261] to-[#e76f51] rounded-2xl clay-icon-bg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm text-[#f4a261] font-medium">92%</span>
          </div>
          <div className="text-2xl font-semibold text-[#2d3748]">4.6/5</div>
          <div className="text-sm text-[#6b7c93] mt-1">Patient Satisfaction</div>
        </div>
      </div>

      {/* Revenue & Expenses */}
      <div className="clay-card p-6">
        <h3 className="font-semibold text-[#2d3748] mb-4">Revenue vs Expenses</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#c5cdd8" />
            <XAxis dataKey="month" stroke="#6b7c93" />
            <YAxis stroke="#6b7c93" />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="revenue" stackId="1" stroke="#2a9d8f" fill="#2a9d8f" fillOpacity={0.6} name="Revenue" />
            <Area type="monotone" dataKey="expenses" stackId="2" stroke="#e76f51" fill="#e76f51" fillOpacity={0.6} name="Expenses" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Patient Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="clay-card p-6">
          <h3 className="font-semibold text-[#2d3748] mb-4">Patient Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={patientTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#c5cdd8" />
              <XAxis dataKey="month" stroke="#6b7c93" />
              <YAxis stroke="#6b7c93" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="inpatient" stroke="#6b9ff5" strokeWidth={2} name="Inpatient" />
              <Line type="monotone" dataKey="outpatient" stroke="#2a9d8f" strokeWidth={2} name="Outpatient" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="clay-card p-6">
          <h3 className="font-semibold text-[#2d3748] mb-4">Weekly Admissions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={admissionsByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#c5cdd8" />
              <XAxis dataKey="day" stroke="#6b7c93" />
              <YAxis stroke="#6b7c93" />
              <Tooltip />
              <Bar dataKey="admissions" fill="#9d84b7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Performance */}
      <div className="clay-card p-6">
        <h3 className="font-semibold text-[#2d3748] mb-4">Department Performance Metrics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={departmentPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#c5cdd8" />
            <XAxis dataKey="department" stroke="#6b7c93" />
            <YAxis stroke="#6b7c93" />
            <Tooltip />
            <Legend />
            <Bar dataKey="satisfaction" fill="#2a9d8f" name="Patient Satisfaction (%)" />
            <Bar dataKey="efficiency" fill="#6b9ff5" name="Operational Efficiency (%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Summary Table */}
      <div className="clay-card overflow-hidden">
        <div className="p-6 border-b border-[#c5cdd8]">
          <h3 className="font-semibold text-[#2d3748]">Department Performance Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#d5dae3]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7c93] uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7c93] uppercase">Satisfaction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7c93] uppercase">Efficiency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7c93] uppercase">Overall Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c5cdd8]">
              {departmentPerformance.map((dept) => (
                <tr key={dept.department} className="hover:bg-[#d5dae3]">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-[#2d3748]">
                    {dept.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 w-24 clay-card-inset h-3 relative overflow-hidden">
                        <div
                          className="bg-[#2a9d8f] h-3 rounded-full"
                          style={{ width: `${dept.satisfaction}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-[#2d3748]">{dept.satisfaction}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 w-24 clay-card-inset h-3 relative overflow-hidden">
                        <div
                          className="bg-[#6b9ff5] h-3 rounded-full"
                          style={{ width: `${dept.efficiency}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-[#2d3748]">{dept.efficiency}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`clay-card px-3 py-1 text-sm font-medium ${
                      dept.overall >= 90 ? 'text-[#2a9d8f]' : 
                      dept.overall >= 75 ? 'text-[#6b9ff5]' : 'text-[#f4a261]'
                    }`}>
                      {dept.overall}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
