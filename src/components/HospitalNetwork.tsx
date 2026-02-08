import { useState, useEffect } from 'react';
import { Network, MessageSquare, Users, Bed, ArrowRightLeft, Activity, Send, CheckCircle, XCircle } from 'lucide-react';
import type { Hospital } from '../data/types';
import { hospitals } from '../data/mockData';
import { projectId, publicAnonKey } from '../utils/supabase/info';

type HospitalNetworkProps = {
  hospital: Hospital;
};

type TransferRequest = {
  id: string;
  fromHospital: string;
  toHospital: string;
  patientName: string;
  patientId: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
};

type Message = {
  id: string;
  fromHospital: string;
  toHospital: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
};

export function HospitalNetwork({ hospital }: HospitalNetworkProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'transfers' | 'messages' | 'resources'>('overview');
  const [transfers, setTransfers] = useState<TransferRequest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewTransfer, setShowNewTransfer] = useState(false);
  const [showNewMessage, setShowNewMessage] = useState(false);

  useEffect(() => {
    loadData();
  }, [hospital.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load transfers
      const transfersRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-edf953a9/transfers?hospitalId=${hospital.id}`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      if (transfersRes.ok) {
        const transfersData = await transfersRes.json();
        setTransfers(transfersData);
      }

      // Load messages
      const messagesRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-edf953a9/messages?hospitalId=${hospital.id}`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      if (messagesRes.ok) {
        const messagesData = await messagesRes.json();
        setMessages(messagesData);
      }
    } catch (error) {
      console.error('Error loading hospital network data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTransfer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const transfer = {
      fromHospital: hospital.id,
      toHospital: formData.get('toHospital') as string,
      patientName: formData.get('patientName') as string,
      patientId: formData.get('patientId') as string,
      reason: formData.get('reason') as string,
    };

    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-edf953a9/transfers`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(transfer),
        }
      );

      if (res.ok) {
        await loadData();
        setShowNewTransfer(false);
        form.reset();
      }
    } catch (error) {
      console.error('Error creating transfer:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const message = {
      fromHospital: hospital.id,
      toHospital: formData.get('toHospital') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-edf953a9/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(message),
        }
      );

      if (res.ok) {
        await loadData();
        setShowNewMessage(false);
        form.reset();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleUpdateTransferStatus = async (transferId: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-edf953a9/transfers/${transferId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (res.ok) {
        await loadData();
      }
    } catch (error) {
      console.error('Error updating transfer:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#2d3748]">Hospital Network</h2>
          <p className="text-[#6b7c93] mt-1">Connect and collaborate with {hospitals.length - 1} other hospitals</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowNewTransfer(true)}
            className="clay-button flex items-center gap-2 px-4 py-2 text-white"
          >
            <ArrowRightLeft className="w-5 h-5" />
            New Transfer
          </button>
          <button
            onClick={() => setShowNewMessage(true)}
            className="clay-button flex items-center gap-2 px-4 py-2 text-white"
          >
            <MessageSquare className="w-5 h-5" />
            New Message
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="clay-card p-2 flex gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
            activeTab === 'overview' ? 'clay-button text-white' : 'text-[#6b7c93] hover:bg-[#d5dae3]'
          }`}
        >
          <Network className="w-5 h-5" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('transfers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
            activeTab === 'transfers' ? 'clay-button text-white' : 'text-[#6b7c93] hover:bg-[#d5dae3]'
          }`}
        >
          <ArrowRightLeft className="w-5 h-5" />
          Transfers
          {transfers.filter(t => t.status === 'pending').length > 0 && (
            <span className="clay-card-inset px-2 py-0.5 text-xs rounded-full">
              {transfers.filter(t => t.status === 'pending').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
            activeTab === 'messages' ? 'clay-button text-white' : 'text-[#6b7c93] hover:bg-[#d5dae3]'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          Messages
          {messages.filter(m => !m.read).length > 0 && (
            <span className="clay-card-inset px-2 py-0.5 text-xs rounded-full">
              {messages.filter(m => !m.read).length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
            activeTab === 'resources' ? 'clay-button text-white' : 'text-[#6b7c93] hover:bg-[#d5dae3]'
          }`}
        >
          <Activity className="w-5 h-5" />
          Resources
        </button>
      </div>

      {/* Content */}
      {activeTab === 'overview' && <OverviewTab hospitals={hospitals} currentHospital={hospital} />}
      {activeTab === 'transfers' && (
        <TransfersTab
          transfers={transfers}
          currentHospital={hospital}
          onUpdateStatus={handleUpdateTransferStatus}
        />
      )}
      {activeTab === 'messages' && <MessagesTab messages={messages} currentHospital={hospital} />}
      {activeTab === 'resources' && <ResourcesTab hospitals={hospitals} currentHospital={hospital} />}

      {/* New Transfer Modal */}
      {showNewTransfer && (
        <Modal onClose={() => setShowNewTransfer(false)} title="Request Patient Transfer">
          <form onSubmit={handleCreateTransfer} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2d3748] mb-1">To Hospital</label>
              <select name="toHospital" required className="clay-input w-full px-4 py-2 text-[#2d3748]">
                <option value="">Select hospital...</option>
                {hospitals.filter(h => h.id !== hospital.id).map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2d3748] mb-1">Patient Name</label>
              <input
                type="text"
                name="patientName"
                required
                className="clay-input w-full px-4 py-2 text-[#2d3748] placeholder-[#8a95a8]"
                placeholder="Enter patient name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2d3748] mb-1">Patient ID</label>
              <input
                type="text"
                name="patientId"
                required
                className="clay-input w-full px-4 py-2 text-[#2d3748] placeholder-[#8a95a8]"
                placeholder="Enter patient ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2d3748] mb-1">Transfer Reason</label>
              <textarea
                name="reason"
                required
                rows={3}
                className="clay-input w-full px-4 py-2 text-[#2d3748] placeholder-[#8a95a8]"
                placeholder="Reason for transfer (e.g., specialized care, capacity)"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowNewTransfer(false)} className="clay-card flex-1 px-4 py-2 text-[#6b7c93] transition-all hover:shadow-2xl">
                Cancel
              </button>
              <button type="submit" className="clay-button flex-1 px-4 py-2 text-white">
                Send Request
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* New Message Modal */}
      {showNewMessage && (
        <Modal onClose={() => setShowNewMessage(false)} title="Send Message">
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2d3748] mb-1">To Hospital</label>
              <select name="toHospital" required className="clay-input w-full px-4 py-2 text-[#2d3748]">
                <option value="">Select hospital...</option>
                {hospitals.filter(h => h.id !== hospital.id).map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2d3748] mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                required
                className="clay-input w-full px-4 py-2 text-[#2d3748] placeholder-[#8a95a8]"
                placeholder="Message subject"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2d3748] mb-1">Message</label>
              <textarea
                name="message"
                required
                rows={4}
                className="clay-input w-full px-4 py-2 text-[#2d3748] placeholder-[#8a95a8]"
                placeholder="Type your message..."
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowNewMessage(false)} className="clay-card flex-1 px-4 py-2 text-[#6b7c93] transition-all hover:shadow-2xl">
                Cancel
              </button>
              <button type="submit" className="clay-button flex-1 px-4 py-2 text-white">
                <Send className="w-4 h-4 inline mr-2" />
                Send Message
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function OverviewTab({ hospitals, currentHospital }: { hospitals: Hospital[]; currentHospital: Hospital }) {
  return (
    <div className="space-y-6">
      {/* Network Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="clay-stat p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#6b9ff5] to-[#5a86d4] rounded-2xl clay-icon-bg flex items-center justify-center">
              <Network className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-[#2d3748]">{hospitals.length}</div>
          <div className="text-sm text-[#6b7c93]">Connected Hospitals</div>
        </div>
        <div className="clay-stat p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2a9d8f] to-[#218c80] rounded-2xl clay-icon-bg flex items-center justify-center">
              <Bed className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-[#2d3748]">
            {hospitals.reduce((sum, h) => sum + (h.beds - h.occupancy), 0)}
          </div>
          <div className="text-sm text-[#6b7c93]">Available Beds Network-wide</div>
        </div>
        <div className="clay-stat p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#9d84b7] to-[#8672a2] rounded-2xl clay-icon-bg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-[#2d3748]">847</div>
          <div className="text-sm text-[#6b7c93]">Shared Medical Staff</div>
        </div>
        <div className="clay-stat p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#f4a261] to-[#e76f51] rounded-2xl clay-icon-bg flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-[#2d3748]">23</div>
          <div className="text-sm text-[#6b7c93]">Transfers This Month</div>
        </div>
      </div>

      {/* Hospital Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.filter(h => h.id !== currentHospital.id).map(h => (
          <div key={h.id} className="clay-stat p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-[#2d3748]">{h.name}</h3>
                <p className="text-sm text-[#6b7c93]">{h.location}</p>
              </div>
              <div className="w-3 h-3 bg-[#2a9d8f] rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6b7c93]">Available Beds:</span>
                <span className="font-medium text-[#2d3748]">{h.beds - h.occupancy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7c93]">Occupancy:</span>
                <span className={`font-medium ${Math.round((h.occupancy / h.beds) * 100) > 85 ? 'text-[#e76f51]' : 'text-[#2a9d8f]'}`}>
                  {Math.round((h.occupancy / h.beds) * 100)}%
                </span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="clay-card flex-1 px-3 py-2 text-sm text-[#6b7c93] transition-all hover:shadow-2xl">
                View Details
              </button>
              <button className="clay-button flex-1 px-3 py-2 text-sm text-white">
                Connect
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TransfersTab({
  transfers,
  currentHospital,
  onUpdateStatus,
}: {
  transfers: TransferRequest[];
  currentHospital: Hospital;
  onUpdateStatus: (id: string, status: 'approved' | 'rejected') => void;
}) {
  return (
    <div className="space-y-4">
      {transfers.length === 0 ? (
        <div className="clay-card p-12 text-center">
          <ArrowRightLeft className="w-12 h-12 text-[#8a95a8] mx-auto mb-3" />
          <p className="text-[#6b7c93]">No transfer requests</p>
        </div>
      ) : (
        transfers.map(transfer => (
          <div key={transfer.id} className="clay-stat p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-[#2d3748]">{transfer.patientName}</h3>
                  <span className="text-sm text-[#6b7c93]">ID: {transfer.patientId}</span>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-[#6b7c93]">
                    <span className="font-medium">From:</span> {hospitals.find(h => h.id === transfer.fromHospital)?.name}
                  </p>
                  <p className="text-[#6b7c93]">
                    <span className="font-medium">To:</span> {hospitals.find(h => h.id === transfer.toHospital)?.name}
                  </p>
                  <p className="text-[#2d3748] mt-2">{transfer.reason}</p>
                  <p className="text-xs text-[#8a95a8] mt-2">{transfer.timestamp}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {transfer.status === 'pending' && transfer.toHospital === currentHospital.id && (
                  <>
                    <button
                      onClick={() => onUpdateStatus(transfer.id, 'approved')}
                      className="clay-button px-4 py-2 text-white flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => onUpdateStatus(transfer.id, 'rejected')}
                      className="clay-card px-4 py-2 text-[#e76f51] transition-all hover:shadow-2xl flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
                {transfer.status === 'approved' && (
                  <span className="clay-card px-3 py-1 text-sm text-[#2a9d8f] font-medium">Approved</span>
                )}
                {transfer.status === 'rejected' && (
                  <span className="clay-card px-3 py-1 text-sm text-[#e76f51] font-medium">Rejected</span>
                )}
                {transfer.status === 'pending' && transfer.fromHospital === currentHospital.id && (
                  <span className="clay-card px-3 py-1 text-sm text-[#f4a261] font-medium">Pending</span>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function MessagesTab({ messages, currentHospital }: { messages: Message[]; currentHospital: Hospital }) {
  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="clay-card p-12 text-center">
          <MessageSquare className="w-12 h-12 text-[#8a95a8] mx-auto mb-3" />
          <p className="text-[#6b7c93]">No messages</p>
        </div>
      ) : (
        messages.map(message => (
          <div key={message.id} className={`clay-stat p-6 ${!message.read ? 'border-l-4 border-[#6b9ff5]' : ''}`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-[#2d3748]">{message.subject}</h3>
                <p className="text-sm text-[#6b7c93]">
                  From: {hospitals.find(h => h.id === message.fromHospital)?.name}
                </p>
              </div>
              <span className="text-xs text-[#8a95a8]">{message.timestamp}</span>
            </div>
            <p className="text-[#2d3748] mt-2">{message.message}</p>
          </div>
        ))
      )}
    </div>
  );
}

function ResourcesTab({ hospitals, currentHospital }: { hospitals: Hospital[]; currentHospital: Hospital }) {
  return (
    <div className="clay-card overflow-hidden">
      <table className="w-full">
        <thead className="bg-[#d5dae3]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7c93] uppercase">Hospital</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7c93] uppercase">Available Beds</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7c93] uppercase">Occupancy</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7c93] uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7c93] uppercase">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#c5cdd8]">
          {hospitals.filter(h => h.id !== currentHospital.id).map(h => {
            const availableBeds = h.beds - h.occupancy;
            const occupancyRate = Math.round((h.occupancy / h.beds) * 100);
            return (
              <tr key={h.id} className="hover:bg-[#d5dae3]">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-[#2d3748]">{h.name}</div>
                    <div className="text-sm text-[#6b7c93]">{h.location}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-[#2d3748]">{availableBeds}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 w-24 clay-card-inset h-3 relative overflow-hidden">
                      <div
                        className={`h-3 rounded-full ${occupancyRate > 85 ? 'bg-[#e76f51]' : 'bg-[#2a9d8f]'}`}
                        style={{ width: `${occupancyRate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-[#2d3748]">{occupancyRate}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#2a9d8f] rounded-full animate-pulse"></div>
                    <span className="text-sm text-[#2d3748]">Online</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button className="clay-button px-3 py-1.5 text-sm text-white">
                    Request Resources
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
      <div className="clay-card relative max-w-lg w-full p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#2d3748]">{title}</h3>
          <button onClick={onClose} className="text-[#8a95a8] hover:text-[#2d3748]">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
