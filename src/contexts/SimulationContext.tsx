import { useState, createContext, useContext, ReactNode } from 'react';

type Operation = {
  id: string;
  type: 'array' | 'queue' | 'stack' | 'hashmap' | 'tree';
  action: string;
  data: any;
  timestamp: number;
};

type SimulationContextType = {
  operations: Operation[];
  addOperation: (type: Operation['type'], action: string, data: any) => void;
  clearOperations: () => void;
};

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [operations, setOperations] = useState<Operation[]>([]);

  const addOperation = (type: Operation['type'], action: string, data: any) => {
    const newOp: Operation = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      action,
      data,
      timestamp: Date.now(),
    };
    setOperations(prev => [...prev, newOp]);
  };

  const clearOperations = () => {
    setOperations([]);
  };

  return (
    <SimulationContext.Provider value={{ operations, addOperation, clearOperations }}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within SimulationProvider');
  }
  return context;
}
