import React, { useMemo, useState, useEffect } from 'react';
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
  Smile,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { useAppStore } from '../features/store';
import { motion, AnimatePresence } from 'framer-motion';

// Define custom node types
interface CustomNodeData extends Record<string, unknown> {
  label: string;
  metric: string;
  icon: React.ReactNode;
  isActive: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const CustomGraphNode: React.FC<NodeProps<Node<CustomNodeData>>> = ({ data }) => {
  return (
    <div 
      onMouseEnter={data.onMouseEnter}
      onMouseLeave={data.onMouseLeave}
      className={`
        px-4 py-3 rounded-xl border bg-card transition-all duration-300 min-w-[150px] shadow-lg select-none cursor-pointer
        ${data.isActive 
          ? 'border-[#79D38A] bg-accent-sage-dim shadow-accent-sage/5 scale-105 ring-2 ring-[#79D38A]/25 animate-pulse' 
          : 'border-white/5 hover:border-white/15'
        }
        ${data.isDimmed ? 'opacity-25 scale-95' : 'opacity-100'}
        ${data.isHovered && !data.isActive ? 'border-[#79D38A]/50 bg-white/[0.01]' : ''}
      `}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
      
      <div className="flex items-center gap-2.5">
        <div className={`p-1.5 rounded-lg ${data.isActive ? 'text-accent-sage' : 'text-white/40'}`}>
          {data.icon}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-white/30">{data.label}</span>
          <span className="text-13 font-semibold text-white/90 truncate">{data.metric}</span>
        </div>
      </div>
    </div>
  );
};

const nodeTypes = {
  customNode: CustomGraphNode
};

// Relationship details map for the tooltip
const relationshipMap: Record<string, { metric: string; influence: string[] }> = {
  health: { metric: '84/100', influence: ['Revenue Run-rate', 'SLA Compliances', 'Safety stocks'] },
  revenue: { metric: '↑ 18%', influence: ['Marketing campaigns', 'Enterprise Customers', 'South Region'] },
  profit: { metric: '44.0%', influence: [' wafer margins', 'corridor rerouting', 'wafer spot-rates'] },
  marketing: { metric: '4.8x ROI', influence: ['High-Intent Search', 'Account-Based focus', 'Ad Bid levels'] },
  customers: { metric: '118% NRR', influence: ['Onboarding pipelines', 'Customer Satisfaction NPS', 'Logo retention'] },
  inventory: { metric: '6.2x turns', influence: ['Singapore port queues', 'Jalisco buffer levels', 'wafer availability'] },
  operations: { metric: '92.4%', influence: ['Guadalajara Plant Capacity', 'Wafer sourcing', 'Clearance delays'] },
  'customer-satisfaction': { metric: '72 NPS', influence: ['Product reliability', 'Support response loops', 'SLA compliances'] },
  growth: { metric: '↑ 14%', influence: ['Sales team focus', 'Frankfurt regulatory path', 'renewals scale'] }
};

import { useDemoStore } from '../features/demoStore';

export const DecisionGraph: React.FC = () => {
  const activeNodeId = useAppStore((state) => state.activeNodeId);
  const setCopilotContextNodeId = useAppStore((state) => state.setCopilotContextNodeId);
  
  const isDemoActive = useDemoStore((state) => state.isDemoActive);
  const currentStep = useDemoStore((state) => state.currentStep);

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [nodesAssembled, setNodesAssembled] = useState(0);

  // Auto-hover revenue to display relationships in Step 4
  const activeHoveredNodeId = (isDemoActive && currentStep === 4) ? 'revenue' : hoveredNodeId;

  // Assemble nodes sequentially over 1.6s
  useEffect(() => {
    const timer = setInterval(() => {
      setNodesAssembled((prev) => {
        if (prev >= 9) {
          clearInterval(timer);
          return 9;
        }
        return prev + 1;
      });
    }, 150);
    return () => clearInterval(timer);
  }, []);

  // Set of connections linked to any hovered node to dictate fading
  const connectedNodes = useMemo(() => {
    if (!activeHoveredNodeId) return new Set<string>();
    
    // Health is connected to all
    if (activeHoveredNodeId === 'health') {
      return new Set([
        'health', 'revenue', 'profit', 'marketing', 'customers', 
        'inventory', 'operations', 'customer-satisfaction', 'growth'
      ]);
    }

    // Direct neighborhood list
    return new Set(['health', activeHoveredNodeId]);
  }, [activeHoveredNodeId]);

  // Layout node definitions
  const fullNodes = useMemo(() => [
    {
      id: 'health',
      type: 'customNode',
      position: { x: 300, y: 195 },
      data: {
        label: 'Business Health',
        metric: '84/100',
        icon: <Heart size={14} />,
        isActive: activeNodeId === 'health',
        isHovered: activeHoveredNodeId === 'health',
        isDimmed: activeHoveredNodeId !== null && !connectedNodes.has('health'),
        onMouseEnter: () => setHoveredNodeId('health'),
        onMouseLeave: () => setHoveredNodeId(null)
      }
    },
    {
      id: 'revenue',
      type: 'customNode',
      position: { x: 300, y: 15 },
      data: {
        label: 'Revenue',
        metric: '$42.8M',
        icon: <DollarSign size={14} />,
        isActive: activeNodeId === 'revenue',
        isHovered: activeHoveredNodeId === 'revenue',
        isDimmed: activeHoveredNodeId !== null && !connectedNodes.has('revenue'),
        onMouseEnter: () => setHoveredNodeId('revenue'),
        onMouseLeave: () => setHoveredNodeId(null)
      }
    },
    {
      id: 'profit',
      type: 'customNode',
      position: { x: 490, y: 75 },
      data: {
        label: 'Profit',
        metric: '44.0%',
        icon: <Percent size={14} />,
        isActive: activeNodeId === 'profit',
        isHovered: activeHoveredNodeId === 'profit',
        isDimmed: activeHoveredNodeId !== null && !connectedNodes.has('profit'),
        onMouseEnter: () => setHoveredNodeId('profit'),
        onMouseLeave: () => setHoveredNodeId(null)
      }
    },
    {
      id: 'customer-satisfaction',
      type: 'customNode',
      position: { x: 530, y: 195 },
      data: {
        label: 'Satisfaction',
        metric: '72 NPS',
        icon: <Smile size={14} />,
        isActive: activeNodeId === 'customer-satisfaction',
        isHovered: activeHoveredNodeId === 'customer-satisfaction',
        isDimmed: activeHoveredNodeId !== null && !connectedNodes.has('customer-satisfaction'),
        onMouseEnter: () => setHoveredNodeId('customer-satisfaction'),
        onMouseLeave: () => setHoveredNodeId(null)
      }
    },
    {
      id: 'marketing',
      type: 'customNode',
      position: { x: 490, y: 315 },
      data: {
        label: 'Marketing',
        metric: '4.8x ROI',
        icon: <Megaphone size={14} />,
        isActive: activeNodeId === 'marketing',
        isHovered: activeHoveredNodeId === 'marketing',
        isDimmed: activeHoveredNodeId !== null && !connectedNodes.has('marketing'),
        onMouseEnter: () => setHoveredNodeId('marketing'),
        onMouseLeave: () => setHoveredNodeId(null)
      }
    },
    {
      id: 'operations',
      type: 'customNode',
      position: { x: 300, y: 375 },
      data: {
        label: 'Operations',
        metric: '92.4%',
        icon: <Settings size={14} />,
        isActive: activeNodeId === 'operations',
        isHovered: activeHoveredNodeId === 'operations',
        isDimmed: activeHoveredNodeId !== null && !connectedNodes.has('operations'),
        onMouseEnter: () => setHoveredNodeId('operations'),
        onMouseLeave: () => setHoveredNodeId(null)
      }
    },
    {
      id: 'inventory',
      type: 'customNode',
      position: { x: 110, y: 315 },
      data: {
        label: 'Inventory',
        metric: '6.2x Turns',
        icon: <Boxes size={14} />,
        isActive: activeNodeId === 'inventory',
        isHovered: activeHoveredNodeId === 'inventory',
        isDimmed: activeHoveredNodeId !== null && !connectedNodes.has('inventory'),
        onMouseEnter: () => setHoveredNodeId('inventory'),
        onMouseLeave: () => setHoveredNodeId(null)
      }
    },
    {
      id: 'customers',
      type: 'customNode',
      position: { x: 70, y: 195 },
      data: {
        label: 'Customers',
        metric: '118% NRR',
        icon: <Users size={14} />,
        isActive: activeNodeId === 'customers',
        isHovered: activeHoveredNodeId === 'customers',
        isDimmed: activeHoveredNodeId !== null && !connectedNodes.has('customers'),
        onMouseEnter: () => setHoveredNodeId('customers'),
        onMouseLeave: () => setHoveredNodeId(null)
      }
    },
    {
      id: 'growth',
      type: 'customNode',
      position: { x: 110, y: 75 },
      data: {
        label: 'Growth Index',
        metric: '+14% YoY',
        icon: <TrendingUp size={14} />,
        isActive: activeNodeId === 'growth',
        isHovered: activeHoveredNodeId === 'growth',
        isDimmed: activeHoveredNodeId !== null && !connectedNodes.has('growth'),
        onMouseEnter: () => setHoveredNodeId('growth'),
        onMouseLeave: () => setHoveredNodeId(null)
      }
    }
  ], [activeNodeId, activeHoveredNodeId, connectedNodes]);

  // Display only assembled nodes
  const nodes = useMemo(() => {
    return fullNodes.slice(0, nodesAssembled);
  }, [fullNodes, nodesAssembled]);

  // Connected relationship edges
  const edges: Edge[] = useMemo(() => {
    const satellites = [
      'revenue',
      'profit',
      'marketing',
      'customers',
      'inventory',
      'operations',
      'customer-satisfaction',
      'growth'
    ];

    // Only render edges if endpoints are already assembled
    return satellites
      .filter((_, idx) => idx + 1 < nodesAssembled)
      .map((satId) => {
        const isCenterHovered = activeHoveredNodeId === 'health';
        const isSatHovered = activeHoveredNodeId === satId;
        
        // Highlight logic
        const isHighlighted = isCenterHovered || isSatHovered || (activeNodeId === satId || activeNodeId === 'health');
        const isDimmed = activeHoveredNodeId !== null && !isCenterHovered && !isSatHovered;

        return {
          id: `edge-${satId}`,
          source: 'health',
          target: satId,
          animated: isHighlighted,
          style: {
            stroke: isHighlighted ? '#79D38A' : isDimmed ? 'rgba(255,255,255,0.02)' : 'rgba(255, 255, 255, 0.08)',
            strokeWidth: isHighlighted ? 1.5 : 1,
            transition: 'stroke 0.3s, stroke-width 0.3s'
          }
        };
      });
  }, [activeNodeId, activeHoveredNodeId, nodesAssembled]);

  const activeHoveredRel = activeHoveredNodeId ? relationshipMap[activeHoveredNodeId] : null;
  const hoveredNode = activeHoveredNodeId ? fullNodes.find(n => n.id === activeHoveredNodeId) : null;

  return (
    <div className="w-full h-[580px] relative bg-background border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-0.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-white/30">System Blueprint</span>
        <span className="text-12 font-medium text-white/70">Interactive Relationship Graph</span>
      </div>

      {/* Relationship Tooltip overlay */}
      <AnimatePresence>
        {activeHoveredRel && hoveredNode && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute z-20 top-4 right-4 bg-[#151B23] border border-white/5 rounded-xl p-4 w-60 shadow-2xl flex flex-col gap-2 pointer-events-none select-none font-sans"
          >
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[9.5px] uppercase font-bold tracking-wider text-white/30">
                {hoveredNode.data.label}
              </span>
              <span className="text-12.5 font-bold text-[#79D38A] font-mono flex items-center gap-0.5">
                <ArrowUpRight size={12} /> {activeHoveredRel.metric}
              </span>
            </div>
            
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold tracking-widest text-[#79D38A]">Influenced By</span>
              <div className="flex flex-col gap-1 text-12 text-white/65">
                {activeHoveredRel.influence.map((inf, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 leading-tight">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#79D38A] shrink-0 opacity-60" />
                    {inf}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
