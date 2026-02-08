import { useState, useEffect } from 'react';
import { X, Database, List, Layers, GitBranch, Hash, Play, Pause, Network, Sparkles } from 'lucide-react';

type Operation = {
  id: string;
  type: 'array' | 'queue' | 'stack' | 'hashmap' | 'tree' | 'graph' | 'priority-queue';
  action: string;
  data: any;
  timestamp: number;
};

type SimulationPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  operations: Operation[];
};

type TreeNode = {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
};

export function SimulationPanel({ isOpen, onClose, operations }: SimulationPanelProps) {
  const [activeTab, setActiveTab] = useState<'array' | 'queue' | 'stack' | 'hashmap' | 'tree' | 'graph' | 'priority-queue'>('array');
  const [isPaused, setIsPaused] = useState(false);
  const [arrayData, setArrayData] = useState<any[]>([]);
  const [queueData, setQueueData] = useState<any[]>([]);
  const [stackData, setStackData] = useState<any[]>([]);
  const [hashmapData, setHashmapData] = useState<Record<string, any>>({});
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [graphData, setGraphData] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] });
  const [priorityQueueData, setPriorityQueueData] = useState<any[]>([]);

  useEffect(() => {
    if (!isPaused && operations.length > 0) {
      const latestOp = operations[operations.length - 1];
      applyOperation(latestOp);
    }
  }, [operations, isPaused]);

  const applyOperation = (op: Operation) => {
    switch (op.type) {
      case 'array':
        if (op.action === 'push') {
          setArrayData(prev => [...prev, op.data]);
        } else if (op.action === 'pop') {
          setArrayData(prev => prev.slice(0, -1));
        } else if (op.action === 'insert') {
          setArrayData(prev => [...prev.slice(0, op.data.index), op.data.value, ...prev.slice(op.data.index)]);
        } else if (op.action === 'delete') {
          setArrayData(prev => prev.filter((_, i) => i !== op.data.index));
        }
        break;
      case 'queue':
        if (op.action === 'enqueue') {
          setQueueData(prev => [...prev, op.data]);
        } else if (op.action === 'dequeue') {
          setQueueData(prev => prev.slice(1));
        }
        break;
      case 'stack':
        if (op.action === 'push') {
          setStackData(prev => [...prev, op.data]);
        } else if (op.action === 'pop') {
          setStackData(prev => prev.slice(0, -1));
        }
        break;
      case 'hashmap':
        if (op.action === 'set') {
          setHashmapData(prev => ({ ...prev, [op.data.key]: op.data.value }));
        } else if (op.action === 'delete') {
          setHashmapData(prev => {
            const newMap = { ...prev };
            delete newMap[op.data.key];
            return newMap;
          });
        }
        break;
      case 'graph':
        if (op.action === 'addNode') {
          setGraphData(prev => ({
            ...prev,
            nodes: [...prev.nodes, op.data]
          }));
        } else if (op.action === 'addEdge') {
          setGraphData(prev => ({
            ...prev,
            edges: [...prev.edges, op.data]
          }));
        }
        break;
      case 'priority-queue':
        if (op.action === 'insert') {
          setPriorityQueueData(prev => {
            const newHeap = [...prev, op.data];
            heapifyUp(newHeap, newHeap.length - 1);
            return newHeap;
          });
        } else if (op.action === 'extractMax') {
          setPriorityQueueData(prev => {
            if (prev.length === 0) return prev;
            const newHeap = [...prev];
            newHeap[0] = newHeap[newHeap.length - 1];
            newHeap.pop();
            if (newHeap.length > 0) heapifyDown(newHeap, 0);
            return newHeap;
          });
        }
        break;
    }
  };

  const heapifyUp = (heap: any[], index: number) => {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (heap[index].priority <= heap[parentIndex].priority) break;
      [heap[index], heap[parentIndex]] = [heap[parentIndex], heap[index]];
      index = parentIndex;
    }
  };

  const heapifyDown = (heap: any[], index: number) => {
    const length = heap.length;
    while (true) {
      let largest = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      if (leftChild < length && heap[leftChild].priority > heap[largest].priority) {
        largest = leftChild;
      }
      if (rightChild < length && heap[rightChild].priority > heap[largest].priority) {
        largest = rightChild;
      }
      if (largest === index) break;

      [heap[index], heap[largest]] = [heap[largest], heap[index]];
      index = largest;
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[40%] bg-[#1a1a1a] text-white transform transition-transform duration-300 ease-in-out z-50 shadow-2xl ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold">Data Structure Algorithms</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 hover:bg-gray-800 rounded transition-colors"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 bg-[#252525] overflow-x-auto">
          <TabButton active={activeTab === 'array'} onClick={() => setActiveTab('array')} icon={List} label="Array" />
          <TabButton active={activeTab === 'queue'} onClick={() => setActiveTab('queue')} icon={Layers} label="Queue" />
          <TabButton active={activeTab === 'stack'} onClick={() => setActiveTab('stack')} icon={Layers} label="Stack" />
          <TabButton active={activeTab === 'priority-queue'} onClick={() => setActiveTab('priority-queue')} icon={Sparkles} label="P-Queue" />
          <TabButton active={activeTab === 'hashmap'} onClick={() => setActiveTab('hashmap')} icon={Hash} label="HashMap" />
          <TabButton active={activeTab === 'tree'} onClick={() => setActiveTab('tree')} icon={GitBranch} label="BST" />
          <TabButton active={activeTab === 'graph'} onClick={() => setActiveTab('graph')} icon={Network} label="Graph" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'array' && <ArrayVisualization />}
          {activeTab === 'queue' && <QueueVisualization />}
          {activeTab === 'stack' && <StackVisualization />}
          {activeTab === 'priority-queue' && <PriorityQueueVisualization data={priorityQueueData} setPriorityQueueData={setPriorityQueueData} />}
          {activeTab === 'hashmap' && <HashMapVisualization />}
          {activeTab === 'tree' && <TreeVisualization treeData={treeData} setTreeData={setTreeData} />}
          {activeTab === 'graph' && <GraphVisualization />}
        </div>

        {/* Operation Log */}
        <div className="border-t border-gray-700 p-4 bg-[#252525] max-h-48 overflow-y-auto">
          <h3 className="text-sm font-semibold mb-2 text-gray-400">Recent Operations</h3>
          <div className="space-y-1">
            {operations.slice(-5).reverse().map((op) => (
              <div key={op.id} className="text-xs font-mono bg-[#1a1a1a] p-2 rounded">
                <span className="text-blue-400">{op.type}</span>
                <span className="text-gray-500 mx-2">→</span>
                <span className="text-green-400">{op.action}</span>
                <span className="text-gray-600 ml-2">
                  {new Date(op.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
        active
          ? 'bg-[#1a1a1a] text-blue-400 border-b-2 border-blue-400'
          : 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

// Array Algorithms
function ArrayVisualization() {
  const [array, setArray] = useState<number[]>([5, 2, 8, 1, 9, 3]);
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState<number | null>(null);
  const [sortingSteps, setSortingSteps] = useState<number[][]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const { addOperation } = useSimulation();

  const linearSearch = () => {
    const val = parseInt(searchValue);
    const index = array.indexOf(val);
    setSearchResult(index);
    addOperation('array', 'linearSearch', { value: val, index });
  };

  const binarySearch = () => {
    const val = parseInt(searchValue);
    const sortedArray = [...array].sort((a, b) => a - b);
    let left = 0, right = sortedArray.length - 1;
    let found = -1;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (sortedArray[mid] === val) {
        found = mid;
        break;
      }
      if (sortedArray[mid] < val) left = mid + 1;
      else right = mid - 1;
    }
    setSearchResult(found);
    addOperation('array', 'binarySearch', { value: val, index: found });
  };

  const bubbleSort = () => {
    const arr = [...array];
    const steps: number[][] = [arr.slice()];
    
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          steps.push(arr.slice());
        }
      }
    }
    setSortingSteps(steps);
    setCurrentStep(0);
    addOperation('array', 'bubbleSort', { steps: steps.length });
    
    // Animate steps
    let step = 0;
    const interval = setInterval(() => {
      if (step < steps.length) {
        setArray(steps[step]);
        setCurrentStep(step);
        step++;
      } else {
        clearInterval(interval);
      }
    }, 300);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-4">Array Algorithms</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {array.map((item, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg shadow-lg min-w-[60px] text-center">
              <div className="text-xs text-blue-200 mb-1">[{index}]</div>
              <div className="font-mono text-xl font-bold">{item}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search value..."
            className="flex-1 bg-[#252525] px-3 py-2 rounded text-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={linearSearch} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm">
            Linear Search O(n)
          </button>
          <button onClick={binarySearch} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm">
            Binary Search O(log n)
          </button>
          <button onClick={bubbleSort} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm">
            Bubble Sort O(n²)
          </button>
        </div>
        {searchResult !== null && (
          <div className="bg-[#252525] p-3 rounded">
            <span className="text-green-400">
              {searchResult >= 0 ? `Found at index ${searchResult}` : 'Not found'}
            </span>
          </div>
        )}
        {sortingSteps.length > 0 && (
          <div className="bg-[#252525] p-3 rounded">
            <span className="text-purple-400">Sorting step {currentStep + 1} of {sortingSteps.length}</span>
          </div>
        )}
      </div>

      <AlgorithmInfo 
        title="Array Algorithms"
        algorithms={[
          { name: 'Linear Search', complexity: 'O(n)', desc: 'Check each element sequentially' },
          { name: 'Binary Search', complexity: 'O(log n)', desc: 'Divide and conquer on sorted array' },
          { name: 'Bubble Sort', complexity: 'O(n²)', desc: 'Repeatedly swap adjacent elements' },
        ]}
      />
    </div>
  );
}

// Queue Visualization
function QueueVisualization() {
  const [queue, setQueue] = useState<string[]>(['Patient A', 'Patient B', 'Patient C']);
  const [newItem, setNewItem] = useState('');
  const { addOperation } = useSimulation();

  const enqueue = () => {
    if (newItem) {
      setQueue(prev => [...prev, newItem]);
      addOperation('queue', 'enqueue', { item: newItem });
      setNewItem('');
    }
  };

  const dequeue = () => {
    if (queue.length > 0) {
      const item = queue[0];
      setQueue(prev => prev.slice(1));
      addOperation('queue', 'dequeue', { item });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-4">Queue (FIFO)</h3>
        <div className="flex items-center gap-2 mb-4">
          <div className="text-xs text-gray-500">Front →</div>
          {queue.map((item, index) => (
            <div key={index} className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-lg shadow-lg min-w-[100px] text-center">
              <div className="font-mono text-sm">{item}</div>
            </div>
          ))}
          {queue.length === 0 && <div className="text-gray-500 italic">Empty</div>}
          <div className="text-xs text-gray-500">← Rear</div>
        </div>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Enter item..."
          className="w-full bg-[#252525] px-3 py-2 rounded text-white"
          onKeyPress={(e) => e.key === 'Enter' && enqueue()}
        />
        <div className="flex gap-2">
          <button onClick={enqueue} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm">
            Enqueue O(1)
          </button>
          <button onClick={dequeue} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm">
            Dequeue O(1)
          </button>
        </div>
      </div>

      <AlgorithmInfo 
        title="Queue Operations"
        algorithms={[
          { name: 'Enqueue', complexity: 'O(1)', desc: 'Add to rear' },
          { name: 'Dequeue', complexity: 'O(1)', desc: 'Remove from front' },
          { name: 'Peek', complexity: 'O(1)', desc: 'View front element' },
        ]}
      />
    </div>
  );
}

// Stack Visualization
function StackVisualization() {
  const [stack, setStack] = useState<string[]>(['Action 1', 'Action 2']);
  const [newItem, setNewItem] = useState('');
  const { addOperation } = useSimulation();

  const push = () => {
    if (newItem) {
      setStack(prev => [...prev, newItem]);
      addOperation('stack', 'push', { item: newItem });
      setNewItem('');
    }
  };

  const pop = () => {
    if (stack.length > 0) {
      const item = stack[stack.length - 1];
      setStack(prev => prev.slice(0, -1));
      addOperation('stack', 'pop', { item });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-4">Stack (LIFO)</h3>
        <div className="flex flex-col-reverse gap-2 items-start mb-4">
          {stack.length > 0 && <div className="text-xs text-gray-500 mb-2">← Top</div>}
          {stack.map((item, index) => (
            <div key={index} className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-lg shadow-lg w-full max-w-xs">
              <div className="font-mono text-sm">{item}</div>
            </div>
          ))}
          {stack.length === 0 && <div className="text-gray-500 italic">Empty</div>}
          <div className="text-xs text-gray-500 mt-2">Bottom</div>
        </div>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Enter item..."
          className="w-full bg-[#252525] px-3 py-2 rounded text-white"
          onKeyPress={(e) => e.key === 'Enter' && push()}
        />
        <div className="flex gap-2">
          <button onClick={push} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm">
            Push O(1)
          </button>
          <button onClick={pop} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm">
            Pop O(1)
          </button>
        </div>
      </div>

      <AlgorithmInfo 
        title="Stack Operations"
        algorithms={[
          { name: 'Push', complexity: 'O(1)', desc: 'Add to top' },
          { name: 'Pop', complexity: 'O(1)', desc: 'Remove from top' },
          { name: 'Peek', complexity: 'O(1)', desc: 'View top element' },
        ]}
      />
    </div>
  );
}

// Priority Queue (Max Heap)
function PriorityQueueVisualization({ data, setPriorityQueueData }: { data: any[]; setPriorityQueueData: any }) {
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState('5');
  const { addOperation } = useSimulation();

  const insert = () => {
    if (taskName && priority) {
      addOperation('priority-queue', 'insert', { name: taskName, priority: parseInt(priority) });
      setTaskName('');
      setPriority('5');
    }
  };

  const extractMax = () => {
    if (data.length > 0) {
      addOperation('priority-queue', 'extractMax', { });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-4">Priority Queue (Max Heap)</h3>
        
        {/* Heap Tree Visualization */}
        <div className="bg-[#252525] p-6 rounded-lg mb-4 min-h-[300px]">
          {data.length > 0 ? (
            <div className="space-y-8">
              {/* Level by level */}
              {[0, 1, 2, 3].map(level => {
                const start = Math.pow(2, level) - 1;
                const end = Math.min(Math.pow(2, level + 1) - 1, data.length);
                const levelNodes = data.slice(start, end);
                
                if (levelNodes.length === 0) return null;
                
                return (
                  <div key={level} className="flex justify-center gap-4">
                    {levelNodes.map((node, idx) => (
                      <div key={start + idx} className="flex flex-col items-center">
                        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-3 rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-lg">
                          <div className="text-xs text-yellow-100">{node.priority}</div>
                          <div className="text-[10px] text-white truncate max-w-[50px]">{node.name}</div>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-1">[{start + idx}]</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 italic">
              Heap is empty
            </div>
          )}
        </div>

        {/* Array representation */}
        <div className="text-xs text-gray-500 mb-2">Array Representation:</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {data.map((item, index) => (
            <div key={index} className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded shadow-lg">
              <div className="text-[10px] text-orange-200">[{index}]</div>
              <div className="font-mono text-sm font-bold">{item.priority}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Task name..."
          className="w-full bg-[#252525] px-3 py-2 rounded text-white"
        />
        <input
          type="number"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          placeholder="Priority (1-10)..."
          min="1"
          max="10"
          className="w-full bg-[#252525] px-3 py-2 rounded text-white"
        />
        <div className="flex gap-2">
          <button onClick={insert} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-sm">
            Insert O(log n)
          </button>
          <button onClick={extractMax} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm">
            Extract Max O(log n)
          </button>
        </div>
      </div>

      <AlgorithmInfo 
        title="Priority Queue (Heap)"
        algorithms={[
          { name: 'Insert', complexity: 'O(log n)', desc: 'Add and heapify up' },
          { name: 'Extract Max', complexity: 'O(log n)', desc: 'Remove root and heapify down' },
          { name: 'Peek Max', complexity: 'O(1)', desc: 'View highest priority' },
          { name: 'Heapify', complexity: 'O(n)', desc: 'Build heap from array' },
        ]}
      />

      <div className="bg-[#252525] p-4 rounded-lg">
        <div className="text-xs text-gray-400 mb-2">Use Cases:</div>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>• Emergency patient triage</li>
          <li>• Task scheduling by priority</li>
          <li>• Dijkstra's shortest path</li>
          <li>• Operating system job scheduling</li>
        </ul>
      </div>
    </div>
  );
}

// HashMap Visualization
function HashMapVisualization() {
  const [hashmap, setHashmap] = useState<Record<string, any>>({ 
    'P001': 'John Doe',
    'P002': 'Jane Smith'
  });
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const { addOperation } = useSimulation();

  const set = () => {
    if (key && value) {
      setHashmap(prev => ({ ...prev, [key]: value }));
      addOperation('hashmap', 'set', { key, value });
      setKey('');
      setValue('');
    }
  };

  const deleteKey = (k: string) => {
    setHashmap(prev => {
      const newMap = { ...prev };
      delete newMap[k];
      return newMap;
    });
    addOperation('hashmap', 'delete', { key: k });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-4">HashMap (Hash Table)</h3>
        <div className="space-y-2 mb-4">
          {Object.entries(hashmap).map(([k, v]) => (
            <div key={k} className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-lg shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-xs text-orange-200">Key:</div>
                  <div className="font-mono text-sm">{k}</div>
                </div>
                <div className="text-orange-300">→</div>
                <div>
                  <div className="text-xs text-orange-200">Value:</div>
                  <div className="font-mono text-sm">{v}</div>
                </div>
              </div>
              <button onClick={() => deleteKey(k)} className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs">
                Delete
              </button>
            </div>
          ))}
          {Object.keys(hashmap).length === 0 && (
            <div className="text-gray-500 italic">HashMap is empty</div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Key (e.g., P003)..."
          className="w-full bg-[#252525] px-3 py-2 rounded text-white"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Value (e.g., Bob Wilson)..."
          className="w-full bg-[#252525] px-3 py-2 rounded text-white"
        />
        <button onClick={set} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded text-sm w-full">
          Set O(1)
        </button>
      </div>

      <AlgorithmInfo 
        title="HashMap Operations"
        algorithms={[
          { name: 'Get', complexity: 'O(1) avg', desc: 'Retrieve value by key' },
          { name: 'Set', complexity: 'O(1) avg', desc: 'Insert or update' },
          { name: 'Delete', complexity: 'O(1) avg', desc: 'Remove entry' },
          { name: 'Hash Function', complexity: 'O(1)', desc: 'Convert key to index' },
        ]}
      />
    </div>
  );
}

// Binary Search Tree
function TreeVisualization({ treeData, setTreeData }: { treeData: TreeNode | null; setTreeData: any }) {
  const [insertValue, setInsertValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState<boolean | null>(null);
  const [traversalResult, setTraversalResult] = useState<number[]>([]);
  const { addOperation } = useSimulation();

  const insertNode = (root: TreeNode | null, value: number): TreeNode => {
    if (root === null) {
      return { value, left: null, right: null };
    }
    if (value < root.value) {
      root.left = insertNode(root.left, value);
    } else if (value > root.value) {
      root.right = insertNode(root.right, value);
    }
    return root;
  };

  const searchNode = (root: TreeNode | null, value: number): boolean => {
    if (root === null) return false;
    if (root.value === value) return true;
    if (value < root.value) return searchNode(root.left, value);
    return searchNode(root.right, value);
  };

  const inorderTraversal = (root: TreeNode | null, result: number[] = []): number[] => {
    if (root !== null) {
      inorderTraversal(root.left, result);
      result.push(root.value);
      inorderTraversal(root.right, result);
    }
    return result;
  };

  const insert = () => {
    const val = parseInt(insertValue);
    if (!isNaN(val)) {
      setTreeData((prev: TreeNode | null) => insertNode(prev, val));
      addOperation('tree', 'insert', { value: val });
      setInsertValue('');
    }
  };

  const search = () => {
    const val = parseInt(searchValue);
    if (!isNaN(val)) {
      const found = searchNode(treeData, val);
      setSearchResult(found);
      addOperation('tree', 'search', { value: val, found });
    }
  };

  const inorder = () => {
    const result = inorderTraversal(treeData);
    setTraversalResult(result);
    addOperation('tree', 'inorder', { result });
  };

  const renderTree = (node: TreeNode | null, x: number = 200, y: number = 40, level: number = 0): JSX.Element[] => {
    if (!node) return [];
    
    const elements: JSX.Element[] = [];
    const offsetX = 150 / (level + 1);
    
    // Draw lines to children
    if (node.left) {
      elements.push(
        <line
          key={`line-l-${node.value}-${x}-${y}`}
          x1={x}
          y1={y}
          x2={x - offsetX}
          y2={y + 60}
          stroke="#4b5563"
          strokeWidth="2"
        />
      );
      elements.push(...renderTree(node.left, x - offsetX, y + 60, level + 1));
    }
    
    if (node.right) {
      elements.push(
        <line
          key={`line-r-${node.value}-${x}-${y}`}
          x1={x}
          y1={y}
          x2={x + offsetX}
          y2={y + 60}
          stroke="#4b5563"
          strokeWidth="2"
        />
      );
      elements.push(...renderTree(node.right, x + offsetX, y + 60, level + 1));
    }
    
    // Draw node
    elements.push(
      <g key={`node-${node.value}-${x}-${y}`}>
        <circle
          cx={x}
          cy={y}
          r="20"
          fill="#ec4899"
          stroke="#db2777"
          strokeWidth="2"
        />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="14"
          fontWeight="bold"
        >
          {node.value}
        </text>
      </g>
    );
    
    return elements;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-4">Binary Search Tree</h3>
        <div className="bg-[#252525] rounded-lg p-4 min-h-[350px]">
          {treeData ? (
            <svg width="100%" height="350" viewBox="0 0 400 350">
              {renderTree(treeData)}
            </svg>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 italic">
              Tree is empty. Insert some values!
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="number"
            value={insertValue}
            onChange={(e) => setInsertValue(e.target.value)}
            placeholder="Insert value..."
            className="flex-1 bg-[#252525] px-3 py-2 rounded text-white"
            onKeyPress={(e) => e.key === 'Enter' && insert()}
          />
          <button onClick={insert} className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded text-sm">
            Insert O(log n)
          </button>
        </div>
        
        <div className="flex gap-2">
          <input
            type="number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search value..."
            className="flex-1 bg-[#252525] px-3 py-2 rounded text-white"
            onKeyPress={(e) => e.key === 'Enter' && search()}
          />
          <button onClick={search} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm">
            Search O(log n)
          </button>
        </div>

        <button onClick={inorder} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm w-full">
          Inorder Traversal O(n)
        </button>

        {searchResult !== null && (
          <div className="bg-[#252525] p-3 rounded">
            <span className={searchResult ? 'text-green-400' : 'text-red-400'}>
              {searchResult ? '✓ Value found in tree' : '✗ Value not found'}
            </span>
          </div>
        )}

        {traversalResult.length > 0 && (
          <div className="bg-[#252525] p-3 rounded">
            <div className="text-xs text-gray-400 mb-2">Inorder (sorted):</div>
            <div className="text-purple-400 font-mono">[{traversalResult.join(', ')}]</div>
          </div>
        )}
      </div>

      <AlgorithmInfo 
        title="BST Operations"
        algorithms={[
          { name: 'Insert', complexity: 'O(log n) avg', desc: 'Add node maintaining BST property' },
          { name: 'Search', complexity: 'O(log n) avg', desc: 'Find value using binary search' },
          { name: 'Delete', complexity: 'O(log n) avg', desc: 'Remove node and rebalance' },
          { name: 'Traversal', complexity: 'O(n)', desc: 'Visit all nodes (inorder/preorder/postorder)' },
        ]}
      />
    </div>
  );
}

// Graph - Only show time complexity info (full graph is on separate page)
function GraphVisualization() {
  const { operations } = useSimulation();
  const graphOps = operations.filter(op => op.type === 'graph');
  const latestOp = graphOps[graphOps.length - 1];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-4">Graph Algorithms</h3>
        <div className="bg-[#252525] p-6 rounded-lg">
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🕸️</div>
            <h4 className="text-lg font-semibold text-white mb-2">Service Graph Page</h4>
            <p className="text-gray-400 text-sm mb-4">
              Visit the <span className="text-cyan-400 font-semibold">Service Graph</span> page to see the full interactive visualization
            </p>
            <div className="inline-block bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm">
              Go to: Navigation → Service Graph
            </div>
          </div>
        </div>
      </div>

      {/* Show recent graph operations */}
      {latestOp && (
        <div className="bg-[#252525] p-4 rounded-lg">
          <div className="text-xs text-gray-400 mb-2">Latest Graph Operation:</div>
          <div className="text-sm">
            {latestOp.action === 'dijkstra-start' && (
              <span className="text-yellow-400">
                🔍 Finding path from <span className="font-mono">{latestOp.data.start}</span> to <span className="font-mono">{latestOp.data.end}</span>
              </span>
            )}
            {latestOp.action === 'dijkstra-complete' && (
              <div className="text-green-400">
                <div>✓ Path found! Distance: <span className="font-mono">{latestOp.data.distance}</span></div>
                <div className="text-xs text-gray-500 mt-1">Visited {latestOp.data.visited} nodes</div>
                <div className="text-xs text-gray-400 mt-1 flex items-center gap-1 flex-wrap">
                  Path: {latestOp.data.path.map((node: string, i: number) => (
                    <span key={i}>
                      <span className="text-white font-mono">{node}</span>
                      {i < latestOp.data.path.length - 1 && <span className="text-gray-600 mx-1">→</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {latestOp.action === 'addNode' && (
              <span className="text-blue-400">Added node: <span className="font-mono">{latestOp.data.name}</span></span>
            )}
            {latestOp.action === 'addEdge' && (
              <span className="text-cyan-400">
                Added edge: <span className="font-mono">{latestOp.data.from} → {latestOp.data.to}</span> (weight: {latestOp.data.weight})
              </span>
            )}
          </div>
        </div>
      )}

      <AlgorithmInfo 
        title="Graph Algorithms"
        algorithms={[
          { name: 'Dijkstra', complexity: 'O((V+E)log V)', desc: 'Shortest path in weighted graph' },
          { name: 'BFS', complexity: 'O(V+E)', desc: 'Breadth-first search' },
          { name: 'DFS', complexity: 'O(V+E)', desc: 'Depth-first search' },
          { name: "Prim's MST", complexity: 'O(E log V)', desc: 'Minimum spanning tree' },
          { name: "Kruskal's MST", complexity: 'O(E log E)', desc: 'Minimum spanning tree' },
          { name: 'Bellman-Ford', complexity: 'O(VE)', desc: 'Shortest path (negative weights)' },
        ]}
      />

      <div className="bg-[#252525] p-4 rounded-lg">
        <div className="text-xs text-gray-400 mb-2">Graph Properties:</div>
        <div className="space-y-2 text-xs text-gray-500">
          <div>• <span className="text-white">Weighted:</span> Edges have associated costs</div>
          <div>• <span className="text-white">Directed:</span> Edges have direction</div>
          <div>• <span className="text-white">Connected:</span> All nodes are reachable</div>
          <div>• <span className="text-white">Non-negative weights:</span> Perfect for Dijkstra's</div>
        </div>
      </div>

      <div className="bg-[#252525] p-4 rounded-lg">
        <div className="text-xs text-gray-400 mb-2">Use Cases in Healthcare:</div>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>• Finding optimal paths between hospital services</li>
          <li>• Patient flow optimization</li>
          <li>• Emergency routing and resource allocation</li>
          <li>• Network topology and connectivity analysis</li>
        </ul>
      </div>
    </div>
  );
}

// Helper Component
function AlgorithmInfo({ title, algorithms }: { title: string; algorithms: Array<{ name: string; complexity: string; desc: string }> }) {
  return (
    <div className="bg-[#252525] p-4 rounded-lg">
      <div className="text-sm font-semibold text-gray-400 mb-3">{title}</div>
      <div className="space-y-2">
        {algorithms.map((algo, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div>
              <div className="text-blue-400 font-mono">{algo.name}</div>
              <div className="text-gray-500">{algo.desc}</div>
            </div>
            <div className="text-green-400 font-mono">{algo.complexity}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Import useSimulation hook
import { useSimulation } from '../contexts/SimulationContext';
