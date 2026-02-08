import { Users, UserCheck, Calendar, Bed, TrendingUp, TrendingDown } from 'lucide-react';
import type { Hospital } from '../data/types';
import { weeklyPatients, departmentDistribution, recentActivities } from '../data/mockData';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type DashboardProps = {
  hospital: Hospital;
};

export function Dashboard({ hospital }: DashboardProps) {
  const occupancyRate = Math.round((hospital.occupancy / hospital.beds) * 100);
  const availableBeds = hospital.beds - hospital.occupancy;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#2d3748]">Dashboard Overview</h2>
        <p className="text-[#6b7c93] mt-1">Welcome to {hospital.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Total Patients"
          value="1,284"
          change={12}
          isPositive={true}
          color="blue"
        />
        <StatCard
          icon={UserCheck}
          label="Active Doctors"
          value="156"
          change={3}
          isPositive={true}
          color="green"
        />
        <StatCard
          icon={Calendar}
          label="Appointments Today"
          value="89"
          change={-5}
          isPositive={false}
          color="purple"
        />
        <StatCard
          icon={Bed}
          label="Bed Occupancy"
          value={`${occupancyRate}%`}
          change={8}
          isPositive={occupancyRate < 90}
          color="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Patients Chart */}
        <div className="clay-card p-6">
          <h3 className="font-semibold text-[#2d3748] mb-4">Weekly Patient Admissions</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyPatients}>
              <CartesianGrid strokeDasharray="3 3" stroke="#c5cdd8" />
              <XAxis dataKey="day" stroke="#6b7c93" />
              <YAxis stroke="#6b7c93" />
              <Tooltip />
              <Bar dataKey="patients" fill="#6b9ff5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="clay-card p-6">
          <h3 className="font-semibold text-[#2d3748] mb-4">Patient Distribution by Department</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={departmentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {departmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {departmentDistribution.map((dept) => (
              <div key={dept.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }}></div>
                <span className="text-sm text-[#6b7c93]">{dept.name}</span>
                <span className="text-sm font-medium text-[#2d3748] ml-auto">{dept.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bed Availability */}
      <div className="clay-card p-6">
        <h3 className="font-semibold text-[#2d3748] mb-4">Bed Availability</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[#6b7c93]">Occupied Beds</span>
              <span className="font-medium text-[#2d3748]">{hospital.occupancy} / {hospital.beds}</span>
            </div>
            <div className="clay-card-inset h-4 relative overflow-hidden">
              <div
                className={`h-full ${occupancyRate > 85 ? 'bg-[#e76f51]' : 'bg-[#6b9ff5]'} rounded-full`}
                style={{ width: `${occupancyRate}%` }}
              ></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#c5cdd8]">
            <div>
              <div className="text-sm text-[#6b7c93]">Available</div>
              <div className="text-2xl font-semibold text-[#2a9d8f]">{availableBeds}</div>
            </div>
            <div>
              <div className="text-sm text-[#6b7c93]">Occupied</div>
              <div className="text-2xl font-semibold text-[#6b9ff5]">{hospital.occupancy}</div>
            </div>
            <div>
              <div className="text-sm text-[#6b7c93]">Total Capacity</div>
              <div className="text-2xl font-semibold text-[#2d3748]">{hospital.beds}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="clay-card p-6">
        <h3 className="font-semibold text-[#2d3748] mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <ActivityItem
              key={activity.id}
              time={activity.time}
              text={activity.text}
              type={activity.type}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

type StatCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  change: number;
  isPositive: boolean;
  color: 'blue' | 'green' | 'purple' | 'orange';
};

function StatCard({ icon: Icon, label, value, change, isPositive, color }: StatCardProps) {
  const colorClasses = {
    blue: 'from-[#6b9ff5] to-[#5a86d4] text-[#5a86d4]',
    green: 'from-[#2a9d8f] to-[#218c80] text-[#2a9d8f]',
    purple: 'from-[#9d84b7] to-[#8672a2] text-[#8672a2]',
    orange: 'from-[#f4a261] to-[#e76f51] text-[#e76f51]',
  };

  return (
    <div className="clay-stat p-6">
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorClasses[color]} clay-icon-bg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-[#2a9d8f]' : 'text-[#e76f51]'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-semibold text-[#2d3748]">{value}</div>
        <div className="text-sm text-[#6b7c93] mt-1">{label}</div>
      </div>
    </div>
  );
}

type ActivityItemProps = {
  time: string;
  text: string;
  type: 'admission' | 'surgery' | 'transfer' | 'lab' | 'discharge';
};

function ActivityItem({ time, text, type }: ActivityItemProps) {
  const typeColors = {
    admission: 'bg-[#6b9ff5]',
    surgery: 'bg-[#9d84b7]',
    transfer: 'bg-[#f4a261]',
    lab: 'bg-[#2a9d8f]',
    discharge: 'bg-[#8a95a8]',
  };

  return (
    <div className="flex items-start gap-3">
      <div className={`w-2 h-2 rounded-full mt-2 ${typeColors[type]}`}></div>
      <div className="flex-1">
        <p className="text-[#2d3748]">{text}</p>
        <p className="text-sm text-[#8a95a8] mt-1">{time}</p>
      </div>
    </div>
  );
}
