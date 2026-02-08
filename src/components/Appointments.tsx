import { useState, useEffect } from 'react';
import { Calendar, Clock, Search, Plus, Filter } from 'lucide-react';
import type { Hospital, Appointment } from '../data/types';
import { appointments } from '../data/mockData';
import { useSimulation } from '../contexts/SimulationContext';

type AppointmentsProps = {
  hospital: Hospital;
};

export function Appointments({ hospital }: AppointmentsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-02-08');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const { addOperation } = useSimulation();

  // Simulate loading appointments into queue (FIFO)
  useEffect(() => {
    appointments.forEach((appointment, index) => {
      setTimeout(() => {
        addOperation('queue', 'enqueue', { 
          id: appointment.id, 
          patient: appointment.patientName,
          time: appointment.time
        });
      }, index * 150);
    });
  }, []);

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = appointment.date === selectedDate;
    const matchesStatus = selectedStatus === 'all' || appointment.status === selectedStatus;
    return matchesSearch && matchesDate && matchesStatus;
  });

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    addOperation('queue', 'filter', { date, count: appointments.filter(a => a.date === date).length });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Appointments</h2>
          <p className="text-gray-600 mt-1">{filteredAppointments.length} appointments for selected date</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          New Appointment
        </button>
      </div>

      {/* Filters */}
      <div className="clay-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8a95a8]" />
            <input
              type="text"
              placeholder="Search by patient, doctor, or appointment ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="clay-input w-full pl-10 pr-4 py-2 text-[#2d3748] placeholder-[#8a95a8]"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="clay-stat p-4">
          <div className="text-sm text-[#6b7c93]">Total Today</div>
          <div className="text-2xl font-semibold text-[#2d3748] mt-1">
            {appointments.filter(a => a.date === selectedDate).length}
          </div>
        </div>
        <div className="clay-stat p-4">
          <div className="text-sm text-[#6b7c93]">Scheduled</div>
          <div className="text-2xl font-semibold text-[#6b9ff5] mt-1">
            {appointments.filter(a => a.date === selectedDate && a.status === 'Scheduled').length}
          </div>
        </div>
        <div className="clay-stat p-4">
          <div className="text-sm text-[#6b7c93]">In Progress</div>
          <div className="text-2xl font-semibold text-[#f4a261] mt-1">
            {appointments.filter(a => a.date === selectedDate && a.status === 'In Progress').length}
          </div>
        </div>
        <div className="clay-stat p-4">
          <div className="text-sm text-[#6b7c93]">Completed</div>
          <div className="text-2xl font-semibold text-[#2a9d8f] mt-1">
            {appointments.filter(a => a.date === selectedDate && a.status === 'Completed').length}
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="clay-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#d5dae3] border-b border-[#c5cdd8]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appointment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-900">{appointment.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-gray-900">{appointment.patientName}</div>
                      <div className="text-sm text-gray-500">{appointment.patientId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-900">{appointment.doctorName}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-600">{appointment.department}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-gray-900">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {appointment.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-600">{appointment.type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-900">{appointment.room}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <AppointmentStatusBadge status={appointment.status} />
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

function AppointmentStatusBadge({ status }: { status: Appointment['status'] }) {
  const styles = {
    'Scheduled': 'bg-blue-100 text-blue-700',
    'In Progress': 'bg-orange-100 text-orange-700',
    'Completed': 'bg-green-100 text-green-700',
    'Cancelled': 'bg-red-100 text-red-700',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}
