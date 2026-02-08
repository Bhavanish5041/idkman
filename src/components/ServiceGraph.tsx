import { useState, useEffect } from 'react';
import { Navigation, ArrowRight, Activity } from 'lucide-react';
import type { Hospital } from '../data/types';
import { useSimulation } from '../contexts/SimulationContext';

type ServiceGraphProps = {
  hospital: Hospital;
};

type GraphNode = {
  id: string;
  name: string;
  x: number;
  y: number;
};

type GraphEdge = {
  from: string;
  to: string;
  weight: number;
  label: string;
};

// Define hospital services as graph nodes
const serviceNodes: GraphNode[] = [
  { id: 'emergency', name: 'Emergency', x: 150, y: 100 },
  { id: 'registration', name: 'Registration', x: 400, y: 100 },
  { id: 'consultation', name: 'Consultation', x: 650, y: 100 },
  { id: 'lab', name: 'Laboratory', x: 250, y: 250 },
  { id: 'radiology', name: 'Radiology', x: 500, y: 250 },
  { id: 'pharmacy', name: 'Pharmacy', x: 750, y: 250 },
  { id: 'surgery', name: 'Surgery', x: 350, y: 400 },
  { id: 'icu', name: 'ICU', x: 550, y: 400 },
  { id: 'discharge', name: 'Discharge', x: 450, y: 550 },
];

// Define edges with weights (e.g., time in minutes)
const serviceEdges: GraphEdge[] = [
  { from: 'emergency', to: 'registration', weight: 5, label: '5m' },
  { from: 'emergency', to: 'lab', weight: 10, label: '10m' },
  { from: 'registration', to: 'consultation', weight: 15, label: '15m' },
  { from: 'registration', to: 'lab', weight: 8, label: '8m' },
  { from: 'consultation', to: 'lab', weight: 5, label: '5m' },
  { from: 'consultation', to: 'radiology', weight: 10, label: '10m' },
  { from: 'consultation', to: 'pharmacy', weight: 12, label: '12m' },
  { from: 'lab', to: 'consultation', weight: 5, label: '5m' },
  { from: 'lab', to: 'surgery', weight: 20, label: '20m' },
  { from: 'radiology', to: 'consultation', weight: 10, label: '10m' },
  { from: 'radiology', to: 'surgery', weight: 15, label: '15m' },
  { from: 'pharmacy', to: 'discharge', weight: 10, label: '10m' },
  { from: 'surgery', to: 'icu', weight: 5, label: '5m' },
  { from: 'surgery', to: 'discharge', weight: 30, label: '30m' },
  { from: 'icu', to: 'discharge', weight: 60, label: '60m' },
  { from: 'consultation', to: 'discharge', weight: 25, label: '25m' },
  { from: 'emergency', to: 'radiology', weight: 12, label: '12m' },
  { from: 'lab', to: 'pharmacy', weight: 8, label: '8m' },
];

// Service costs (in dollars)
const serviceCosts: Record<string, number> = {
  emergency: 500,
  registration: 50,
  consultation: 150,
  lab: 200,
  radiology: 350,
  pharmacy: 100,
  surgery: 5000,
  icu: 2500,
  discharge: 75,
};

// Disease/Condition-based service paths
type DiseasePathway = {
  id: string;
  name: string;
  description: string;
  requiredServices: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  estimatedTime: number;
};

const diseasePathways: DiseasePathway[] = [
  {
    id: 'fracture',
    name: 'Bone Fracture',
    description: 'Broken bone requiring imaging and potential surgery',
    requiredServices: ['emergency', 'radiology', 'surgery', 'icu', 'discharge'],
    severity: 'high',
    estimatedTime: 180
  },
  {
    id: 'infection',
    name: 'Bacterial Infection',
    description: 'Infection requiring lab tests and medication',
    requiredServices: ['registration', 'consultation', 'lab', 'pharmacy', 'discharge'],
    severity: 'medium',
    estimatedTime: 90
  },
  {
    id: 'cardiac',
    name: 'Cardiac Emergency',
    description: 'Heart-related emergency requiring immediate care',
    requiredServices: ['emergency', 'lab', 'radiology', 'surgery', 'icu', 'discharge'],
    severity: 'critical',
    estimatedTime: 240
  },
  {
    id: 'respiratory',
    name: 'Respiratory Issue',
    description: 'Breathing problems requiring examination and tests',
    requiredServices: ['emergency', 'consultation', 'radiology', 'pharmacy', 'discharge'],
    severity: 'high',
    estimatedTime: 120
  },
  {
    id: 'checkup',
    name: 'General Checkup',
    description: 'Routine health examination',
    requiredServices: ['registration', 'consultation', 'lab', 'discharge'],
    severity: 'low',
    estimatedTime: 60
  },
  {
    id: 'surgery-planned',
    name: 'Scheduled Surgery',
    description: 'Pre-planned surgical procedure',
    requiredServices: ['registration', 'consultation', 'lab', 'radiology', 'surgery', 'icu', 'discharge'],
    severity: 'high',
    estimatedTime: 300
  },
  {
    id: 'trauma',
    name: 'Major Trauma',
    description: 'Severe injury requiring comprehensive care',
    requiredServices: ['emergency', 'lab', 'radiology', 'surgery', 'icu', 'discharge'],
    severity: 'critical',
    estimatedTime: 360
  },
  {
    id: 'fever',
    name: 'High Fever',
    description: 'Elevated temperature requiring diagnosis',
    requiredServices: ['registration', 'consultation', 'lab', 'pharmacy', 'discharge'],
    severity: 'medium',
    estimatedTime: 75
  },
];

// Calculate optimal path through required services
function calculateOptimalPath(requiredServices: string[]): { path: string[]; totalTime: number; totalCost: number } {
  // Build a graph with only required services
  const path: string[] = [];
  let totalTime = 0;
  let totalCost = 0;

  for (let i = 0; i < requiredServices.length - 1; i++) {
    const from = requiredServices[i];
    const to = requiredServices[i + 1];
    path.push(from);

    // Add cost for this service
    totalCost += serviceCosts[from] || 0;

    // Find direct edge or calculate shortest path between these two required services
    const directEdge = serviceEdges.find(e => e.from === from && e.to === to);
    if (directEdge) {
      totalTime += directEdge.weight;
    } else {
      // Use BFS to find shortest path between these two services
      const subPath = findShortestSubPath(from, to);
      totalTime += subPath.distance;
    }
  }
  path.push(requiredServices[requiredServices.length - 1]);
  // Add cost for the last service
  totalCost += serviceCosts[requiredServices[requiredServices.length - 1]] || 0;

  return { path, totalTime, totalCost };
}

// BFS to find shortest path between two nodes
function findShortestSubPath(start: string, end: string): { distance: number } {
  const queue: Array<{ node: string; dist: number }> = [{ node: start, dist: 0 }];
  const visited = new Set<string>();
  visited.add(start);

  while (queue.length > 0) {
    const current = queue.shift()!;
    
    if (current.node === end) {
      return { distance: current.dist };
    }

    serviceEdges.forEach(edge => {
      if (edge.from === current.node && !visited.has(edge.to)) {
        visited.add(edge.to);
        queue.push({ node: edge.to, dist: current.dist + edge.weight });
      }
    });
  }

  return { distance: 0 };
}

export function ServiceGraph({ hospital }: ServiceGraphProps) {
  const [selectedDisease, setSelectedDisease] = useState<string>('');
  const [currentPathway, setCurrentPathway] = useState<DiseasePathway | null>(null);
  const [servicePath, setServicePath] = useState<string[]>([]);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const { addOperation } = useSimulation();

  useEffect(() => {
    // Initialize graph in simulation
    serviceNodes.forEach((node, index) => {
      setTimeout(() => {
        addOperation('graph', 'addNode', { id: node.id, name: node.name });
      }, index * 100);
    });

    setTimeout(() => {
      serviceEdges.forEach((edge, index) => {
        setTimeout(() => {
          addOperation('graph', 'addEdge', { 
            from: edge.from, 
            to: edge.to, 
            weight: edge.weight 
          });
        }, index * 50);
      });
    }, serviceNodes.length * 100);
  }, []);

  const findServicePath = () => {
    if (!selectedDisease) return;

    const pathway = diseasePathways.find(p => p.id === selectedDisease);
    if (!pathway) return;

    setIsCalculating(true);
    setCurrentPathway(pathway);
    addOperation('graph', 'pathfinding-start', { disease: pathway.name, services: pathway.requiredServices });

    // Calculate optimal path through required services
    setTimeout(() => {
      const result = calculateOptimalPath(pathway.requiredServices);
      setServicePath(result.path);
      setTotalTime(result.totalTime);
      setTotalCost(result.totalCost);
      setIsCalculating(false);

      addOperation('graph', 'pathfinding-complete', { 
        disease: pathway.name,
        path: result.path, 
        time: result.totalTime,
        cost: result.totalCost,
        services: pathway.requiredServices.length
      });
    }, 1000);
  };

  const clearPath = () => {
    setServicePath([]);
    setTotalTime(0);
    setTotalCost(0);
    setSelectedDisease('');
    setCurrentPathway(null);
    addOperation('graph', 'clear', { });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#2d3748]">Service Graph - Disease-Based Routing</h2>
        <p className="text-[#6b7c93] mt-1">Visualize patient journey through hospital services based on medical condition</p>
      </div>

      {/* Disease Selection */}
      <div className="clay-card p-6">
        <h3 className="font-semibold text-[#2d3748] mb-4">Select Patient Condition</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {diseasePathways.map(pathway => (
            <button
              key={pathway.id}
              onClick={() => setSelectedDisease(pathway.id)}
              className={`p-4 rounded-2xl text-left transition-all ${
                selectedDisease === pathway.id
                  ? 'clay-button text-white'
                  : 'clay-card hover:shadow-xl'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="font-semibold text-sm">{pathway.name}</div>
                <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(pathway.severity)}`}>
                  {pathway.severity}
                </span>
              </div>
              <div className="text-xs opacity-80">{pathway.description}</div>
              <div className="text-xs mt-2 opacity-60">
                {pathway.requiredServices.length} services • ~{pathway.estimatedTime}min
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={findServicePath}
            disabled={!selectedDisease || isCalculating}
            className="clay-button flex items-center gap-2 px-6 py-2 text-white disabled:opacity-50"
          >
            <Navigation className="w-4 h-4" />
            {isCalculating ? 'Calculating Path...' : 'Generate Service Path'}
          </button>
          {servicePath.length > 0 && (
            <button
              onClick={clearPath}
              className="clay-card px-6 py-2 text-[#2d3748] hover:bg-[#d5dae3]"
            >
              Clear Path
            </button>
          )}
        </div>

        {/* Results */}
        {currentPathway && servicePath.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-gradient-to-r from-[#d5dae3] to-[#e0e5ec] rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-[#2d3748]">Service Path: {currentPathway.name}</h4>
                  <p className="text-xs text-[#6b7c93] mt-1">{currentPathway.description}</p>
                </div>
                <div className="text-right space-y-2">
                  <div className="px-4 py-1 bg-gradient-to-br from-[#6b9ff5] to-[#5a86d4] text-white rounded-xl text-sm font-semibold">
                    {totalTime} minutes
                  </div>
                  <div className="px-4 py-1 bg-gradient-to-br from-[#2a9d8f] to-[#21867a] text-white rounded-xl text-sm font-semibold">
                    ${totalCost.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {servicePath.map((nodeId, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-white rounded-xl text-sm font-medium text-[#2d3748] flex items-center gap-2">
                      <span className="text-xs text-[#6b7c93]">{index + 1}.</span>
                      {serviceNodes.find(n => n.id === nodeId)?.name}
                    </span>
                    {index < servicePath.length - 1 && <ArrowRight className="w-4 h-4 text-[#6b7c93]" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="clay-card p-4">
              <h4 className="font-semibold text-[#2d3748] mb-3">Cost Breakdown</h4>
              <div className="space-y-2">
                {servicePath.map((nodeId, index) => {
                  const serviceName = serviceNodes.find(n => n.id === nodeId)?.name || '';
                  const cost = serviceCosts[nodeId] || 0;
                  return (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-[#d5dae3] last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6b9ff5] to-[#5a86d4] text-white text-xs flex items-center justify-center font-semibold">
                          {index + 1}
                        </span>
                        <span className="text-sm text-[#2d3748]">{serviceName}</span>
                      </div>
                      <span className="text-sm font-semibold text-[#2a9d8f]">${cost.toLocaleString()}</span>
                    </div>
                  );
                })}
                <div className="flex items-center justify-between pt-3 border-t-2 border-[#2d3748]">
                  <span className="font-semibold text-[#2d3748]">Total Treatment Cost</span>
                  <span className="text-lg font-bold text-[#2a9d8f]">${totalCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Graph Visualization */}
      <div className="clay-card p-6">
        <h3 className="font-semibold text-[#2d3748] mb-4">Hospital Service Network</h3>
        <div className="relative bg-[#e0e5ec] rounded-2xl p-8" style={{ height: '650px' }}>
          <svg width="100%" height="100%" className="absolute inset-0">
            {/* Draw edges */}
            {serviceEdges.map((edge, index) => {
              const fromNode = serviceNodes.find(n => n.id === edge.from);
              const toNode = serviceNodes.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              const isInPath = servicePath.length > 0 && 
                servicePath.includes(edge.from) && 
                servicePath.includes(edge.to) &&
                Math.abs(servicePath.indexOf(edge.from) - servicePath.indexOf(edge.to)) === 1;

              const midX = (fromNode.x + toNode.x) / 2;
              const midY = (fromNode.y + toNode.y) / 2;

              return (
                <g key={index}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={isInPath ? '#6b9ff5' : '#a3b1c6'}
                    strokeWidth={isInPath ? 4 : 2}
                    opacity={isInPath ? 1 : 0.4}
                    className="transition-all duration-300"
                  />
                  <text
                    x={midX}
                    y={midY - 5}
                    fontSize="12"
                    fill={isInPath ? '#5a86d4' : '#6b7c93'}
                    fontWeight={isInPath ? 'bold' : 'normal'}
                    textAnchor="middle"
                    className="transition-all duration-300"
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}

            {/* Draw nodes */}
            {serviceNodes.map((node) => {
              const isInPath = servicePath.includes(node.id);
              const isRequired = currentPathway?.requiredServices.includes(node.id);
              const pathIndex = servicePath.indexOf(node.id);
              const isStart = pathIndex === 0;
              const isEnd = pathIndex === servicePath.length - 1;

              let fillColor = '#e0e5ec';
              let strokeColor = '#a3b1c6';
              let textColor = '#2d3748';

              if (isStart) {
                fillColor = '#2a9d8f';
                strokeColor = '#21867a';
                textColor = '#ffffff';
              } else if (isEnd) {
                fillColor = '#e76f51';
                strokeColor = '#d45a3c';
                textColor = '#ffffff';
              } else if (isInPath) {
                fillColor = '#6b9ff5';
                strokeColor = '#5a86d4';
                textColor = '#ffffff';
              } else if (isRequired) {
                fillColor = '#f4a261';
                strokeColor = '#e9944a';
                textColor = '#ffffff';
              }

              return (
                <g key={node.id} className="transition-all duration-300">
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isInPath || isStart || isEnd ? 35 : 30}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isInPath || isStart || isEnd ? 4 : 2}
                    className="transition-all duration-300"
                    style={{
                      filter: isInPath || isStart || isEnd 
                        ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' 
                        : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }}
                  />
                  {pathIndex >= 0 && (
                    <circle
                      cx={node.x - 15}
                      cy={node.y - 15}
                      r="12"
                      fill="#ffffff"
                      stroke={strokeColor}
                      strokeWidth="2"
                    />
                  )}
                  {pathIndex >= 0 && (
                    <text
                      x={node.x - 15}
                      y={node.y - 15}
                      fontSize="10"
                      fill={strokeColor}
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {pathIndex + 1}
                    </text>
                  )}
                  <text
                    x={node.x}
                    y={node.y}
                    fontSize="12"
                    fill={textColor}
                    fontWeight="600"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="transition-all duration-300 pointer-events-none"
                  >
                    {node.name.split(' ').map((word, i) => (
                      <tspan key={i} x={node.x} dy={i === 0 ? 0 : 14}>
                        {word}
                      </tspan>
                    ))}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-4 right-4 clay-card p-4 text-xs space-y-2">
            <div className="font-semibold text-[#2d3748] mb-2">Legend</div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#2a9d8f] border-2 border-[#21867a]"></div>
              <span className="text-[#6b7c93]">Start Service</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#6b9ff5] border-2 border-[#5a86d4]"></div>
              <span className="text-[#6b7c93]">In Patient Path</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#e76f51] border-2 border-[#d45a3c]"></div>
              <span className="text-[#6b7c93]">End Service</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#f4a261] border-2 border-[#e9944a]"></div>
              <span className="text-[#6b7c93]">Required Service</span>
            </div>
          </div>
        </div>
      </div>

      {/* Service Cost Overview */}
      <div className="clay-card p-6">
        <h3 className="font-semibold text-[#2d3748] mb-4">Service Costs Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {serviceNodes.map(node => {
            const cost = serviceCosts[node.id] || 0;
            const isInPath = servicePath.includes(node.id);
            return (
              <div 
                key={node.id} 
                className={`p-4 rounded-2xl transition-all ${
                  isInPath 
                    ? 'bg-gradient-to-br from-[#6b9ff5] to-[#5a86d4] text-white shadow-lg' 
                    : 'bg-[#d5dae3]'
                }`}
              >
                <div className={`text-xs mb-1 ${isInPath ? 'text-white/80' : 'text-[#6b7c93]'}`}>
                  {node.name}
                </div>
                <div className={`text-lg font-bold ${isInPath ? 'text-white' : 'text-[#2a9d8f]'}`}>
                  ${cost.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 p-4 bg-[#d5dae3] rounded-2xl">
          <div className="text-xs text-[#6b7c93] mb-2">Cost Categories:</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div>
              <span className="font-semibold text-[#2d3748]">Basic Services:</span>
              <span className="text-[#6b7c93] ml-2">$50 - $200</span>
            </div>
            <div>
              <span className="font-semibold text-[#2d3748]">Specialized:</span>
              <span className="text-[#6b7c93] ml-2">$200 - $500</span>
            </div>
            <div>
              <span className="font-semibold text-[#2d3748]">Critical Care:</span>
              <span className="text-[#6b7c93] ml-2">$2,500 - $5,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
