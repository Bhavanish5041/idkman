import { useState } from 'react';
import { TopNav } from './components/TopNav';
import { Dashboard } from './components/Dashboard';
import { Patients } from './components/Patients';
import { Doctors } from './components/Doctors';
import { Appointments } from './components/Appointments';
import { Departments } from './components/Departments';
import { Analytics } from './components/Analytics';
import { HospitalNetwork } from './components/HospitalNetwork';
import { ServiceGraph } from './components/ServiceGraph';
import { SimulationPanel } from './components/SimulationPanel';
import { SimulationProvider, useSimulation } from './contexts/SimulationContext';
import type { Hospital } from './data/types';
import { hospitals } from './data/mockData';

export type Page = 'dashboard' | 'patients' | 'doctors' | 'appointments' | 'departments' | 'analytics' | 'network' | 'graph';

function AppContent() {
  const [selectedHospital, setSelectedHospital] = useState<Hospital>(hospitals[0]);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const { operations } = useSimulation();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard hospital={selectedHospital} />;
      case 'patients':
        return <Patients hospital={selectedHospital} />;
      case 'doctors':
        return <Doctors hospital={selectedHospital} />;
      case 'appointments':
        return <Appointments hospital={selectedHospital} />;
      case 'departments':
        return <Departments hospital={selectedHospital} />;
      case 'analytics':
        return <Analytics hospital={selectedHospital} />;
      case 'network':
        return <HospitalNetwork hospital={selectedHospital} />;
      case 'graph':
        return <ServiceGraph hospital={selectedHospital} />;
      default:
        return <Dashboard hospital={selectedHospital} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#e0e5ec] relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-indigo-200 rounded-full blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-purple-200 rounded-full blur-3xl animate-float animation-delay-4000"></div>
      </div>

      <TopNav 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        selectedHospital={selectedHospital}
        onHospitalChange={setSelectedHospital}
        onSimulationToggle={() => setIsSimulationOpen(!isSimulationOpen)}
        isSimulationOpen={isSimulationOpen}
      />
      <main className={`flex-1 overflow-y-auto p-6 relative z-10 transition-all duration-300 ${isSimulationOpen ? 'mr-[40%]' : ''}`}>
        <div className="max-w-[1600px] mx-auto">
          {renderPage()}
        </div>
      </main>

      {/* Simulation Panel */}
      <SimulationPanel 
        isOpen={isSimulationOpen}
        onClose={() => setIsSimulationOpen(false)}
        operations={operations}
      />
    </div>
  );
}

export default function App() {
  return (
    <SimulationProvider>
      <AppContent />
    </SimulationProvider>
  );
}
