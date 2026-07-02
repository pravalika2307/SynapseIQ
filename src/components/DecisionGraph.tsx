import React, { useMemo } from 'react';
import { 
  ReactFlow, 
  Background, 
  Position, 
  Handle,
} from '@xyflow/react';
import type { 
  Node, 
  Edge, 
  NodeProps 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Heart, 
  DollarSign, 
  Percent, 
  Users, 
  Megaphone, 
  Boxes, 
  Settings, 
  Smile 
} from 'lucide-react';
import { useAppStore } from '../features/store';

// Define custom node types
interface CustomNodeData extends Record<string, unknown> {
  label: string;
  metric: string;
  icon: React.ReactNode;
  isActive: boolean;
}

const CustomGraphNode: React.FC<NodeProps<Node<CustomNodeData>>> = ({ data }) => {
  return (
    <div className={`
      px-4 py-3 rounded-xl border bg-card transition-all duration-300 min-w-[150px] shadow-lg
      ${data.isActive 
        ? 'border-accent-sage border-opacity-70 bg-accent-sage-dim shadow-accent-sage/5 scale-105' 
        : 'border-white/5 hover:border-white/15'
      }
    `}>
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
      
      <div className="flex items-center gap-2.5">
        <div className={`p-1.5 rounded-lg ${data.isActive ? 'text-accent-sage' : 'text-white/40'}`}>
          {data.icon}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-white/30">{data.label}</span>
          <span className="text-13.5 font-semibold text-white/90 truncate">{data.metric}</span>
        </div>
      </div>
    </div>
  );
};

const nodeTypes = {
  customNode: CustomGraphNode
};

export const DecisionGraph: React.FC = () => {
  const activeNodeId = useAppStore((state) => state.activeNodeId);
  const setCopilotContextNodeId = useAppStore((state) => state.setCopilotContextNodeId);

  // Define nodes and layouts
  const nodes: Node<CustomNodeData>[] = useMemo(() => [
    {
      id: 'health',
      type: 'customNode',
      position: { x: 280, y: 190 },
      data: {
        label: 'Business Health',
        metric: '84/100',
        icon: <Heart size={14} />,
        isActive: activeNodeId === 'health'
      }
    },
    {
      id: 'revenue',
      type: 'customNode',
      position: { x: 280, y: 20 },
      data: {
        label: 'Revenue',
        metric: '$42.8M',
        icon: <DollarSign size={14} />,
        isActive: activeNodeId === 'revenue'
      }
    },
    {
      id: 'profit',
      type: 'customNode',
      position: { x: 480, y: 100 },
      data: {
        label: 'Profit',
        metric: '44.0%',
        icon: <Percent size={14} />,
        isActive: activeNodeId === 'profit'
      }
    },
    {
      id: 'customers',
      type: 'customNode',
      position: { x: 80, y: 100 },
      data: {
        label: 'Customers',
        metric: '118% NRR',
        icon: <Users size={14} />,
        isActive: activeNodeId === 'customers'
      }
    },
    {
      id: 'marketing',
      type: 'customNode',
      position: { x: 485, y: 270 },
      data: {
        label: 'Marketing',
        metric: '4.8x ROI',
        icon: <Megaphone size={14} />,
        isActive: activeNodeId === 'marketing'
      }
    },
    {
      id: 'inventory',
      type: 'customNode',
      position: { x: 80, y: 270 },
      data: {
        label: 'Inventory',
        metric: '6.2x Turns',
        icon: <Boxes size={14} />,
        isActive: activeNodeId === 'inventory'
      }
    },
    {
      id: 'operations',
      type: 'customNode',
      position: { x: 280, y: 360 },
      data: {
        label: 'Operations',
        metric: '92.4%',
        icon: <Settings size={14} />,
        isActive: activeNodeId === 'operations'
      }
    },
    {
      id: 'customer-satisfaction',
      type: 'customNode',
      position: { x: 490, y: 190 },
      data: {
        label: 'Cust. Satisfaction',
        metric: '72 NPS',
        icon: <Smile size={14} />,
        isActive: activeNodeId === 'customer-satisfaction'
      }
    }
  ], [activeNodeId]);

  // Edges connecting Center (health) to Satellites
  const edges: Edge[] = useMemo(() => {
    const satellites = [
      'revenue',
      'profit',
      'customers',
      'marketing',
      'inventory',
      'operations',
      'customer-satisfaction'
    ];

    return satellites.map((satId) => {
      const isTargetActive = activeNodeId === satId || activeNodeId === 'health';
      return {
        id: `edge-${satId}`,
        source: 'health',
        target: satId,
        animated: isTargetActive,
        style: {
          stroke: isTargetActive ? '#79D38A' : 'rgba(255, 255, 255, 0.05)',
          strokeWidth: isTargetActive ? 1.5 : 1,
          transition: 'stroke 0.3s, stroke-width 0.3s'
        }
      };
    });
  }, [activeNodeId]);

  return (
    <div className="w-full h-[450px] relative bg-background border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-0.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-white/30">System Blueprint</span>
        <span className="text-12 font-medium text-white/70">Interactive Relationship Graph</span>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => setCopilotContextNodeId(node.id)}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        nodesConnectable={false}
        nodesDraggable={false}
        elementsSelectable={true}
        zoomOnScroll={false}
        zoomOnPinch={false}
        panOnDrag={false}
        className="w-full h-full"
      >
        <Background color="#1b222c" gap={20} size={1} />
      </ReactFlow>
    </div>
  );
};
