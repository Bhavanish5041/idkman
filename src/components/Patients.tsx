import { useState, useEffect } from 'react';
import { Search, Filter, Plus, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import type { Hospital, Patient } from '../data/types';
import { patients } from '../data/mockData';
import { useSimulation } from '../contexts/SimulationContext';

type PatientsProps = {
  hospital: Hospital;
};

export function Patients({ hospital }: PatientsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const { addOperation } = useSimulation();

  // Simulate loading patients into array
  useEffect(() => {
    patients.forEach((patient, index) => {
      setTimeout(() => {
        addOperation('array', 'push', { name: patient.name, id: patient.id });
      }, index * 100);
    });
  }, []);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || patient.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Simulate searching through array
    addOperation('array', 'search', { query, results: filteredPatients.length });
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    // Simulate filtering operation
    addOperation('array', 'filter', { status, count: filteredPatients.length });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#2d3748]">Patients</h2>
          <p className="text-[#6b7c93] mt-1">{filteredPatients.length} total patients</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="glass-button flex items-center gap-2 px-4 py-2 text-white rounded-2xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Patient
        </button>
      </div>

      {/* Filters */}
      <div className="clay-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8a95a8]" />
            <input
              type="text"
              placeholder="Search by name, ID, or condition..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="clay-input w-full pl-10 pr-4 py-2 text-[#2d3748] placeholder-[#8a95a8]"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="clay-input px-4 py-2 text-[#2d3748]"
            >
              <option value="all">All Status</option>
              <option value="Critical">Critical</option>
              <option value="Stable">Stable</option>
              <option value="Recovering">Recovering</option>
              <option value="Discharged">Discharged</option>
            </select>
            <button className="clay-card flex items-center gap-2 px-4 py-2 transition-all hover:shadow-2xl">
              <Filter className="w-5 h-5" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="clay-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#d5dae3] border-b border-[#c5cdd8]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age/Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Condition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-900">{patient.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-900">{patient.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-600">{patient.age} / {patient.gender}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900">{patient.condition}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-600">{patient.department}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-900">{patient.room}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={patient.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="View">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="Edit">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="More">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="clay-card flex items-center justify-between px-6 py-4">
        <div className="text-sm text-[#6b7c93]">
          Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPatients.length}</span> of{' '}
          <span className="font-medium">{filteredPatients.length}</span> results
        </div>
        <div className="flex gap-2">
          <button className="clay-card px-4 py-2 text-[#6b7c93] transition-all hover:shadow-2xl disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="clay-button px-4 py-2 text-white">1</button>
          <button className="clay-card px-4 py-2 text-[#6b7c93] transition-all hover:shadow-2xl">2</button>
          <button className="clay-card px-4 py-2 text-[#6b7c93] transition-all hover:shadow-2xl">3</button>
          <button className="clay-card px-4 py-2 text-[#6b7c93] transition-all hover:shadow-2xl">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Patient['status'] }) {
  const styles = {
    Critical: 'bg-red-100 text-red-700',
    Stable: 'bg-green-100 text-green-700',
    Recovering: 'bg-blue-100 text-blue-700',
    Discharged: 'bg-gray-100 text-gray-700',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}
