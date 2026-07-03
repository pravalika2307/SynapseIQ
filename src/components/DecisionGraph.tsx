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

const CustomGraphNode: React.FC<NodeProps<Node<CustomNodeData>>> = ({ id, data }) => {
  const breatheNode = id === 'health' || data.label === 'Business Health' || data.label === 'Business Health Index';

  return (
    <div className="relative">
      {/* Subtle radial glow backdrop */}
      {(data.isActive || breatheNode) && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: breatheNode ? [0.12, 0.28, 0.12] : [0.2, 0.4, 0.2], 
            scale: breatheNode ? [1.1, 1.25, 1.1] : [1.15, 1.35, 1.15] 
          }}
          transition={{ repeat: Infinity, duration: breatheNode ? 4.2 : 2.8, ease: 'easeInOut' }}
          className={`absolute -inset-5 rounded-full blur-xl -z-10 pointer-events-none ${breatheNode ? 'bg-[#83D18B]/12' : 'bg-[#83D18B]/18'}`}
        />
      )}

      <motion.div 
        onMouseEnter={data.onMouseEnter}
        onMouseLeave={data.onMouseLeave}
        animate={{
          scale: data.isActive 
            ? [1.02, 1.05, 1.02] 
            : breatheNode 
              ? [0.99, 1.01, 0.99] 
              : 1,
          borderColor: data.isActive 
            ? 'rgba(131, 209, 139, 0.8)' 
            : data.isHovered 
              ? 'rgba(131, 209, 139, 0.4)' 
              : 'rgba(255, 255, 255, 0.05)',
          boxShadow: data.isActive
            ? ['0 0 10px rgba(131,209,139,0.1)', '0 0 25px rgba(131,209,139,0.25)', '0 0 10px rgba(131,209,139,0.1)']
            : 'none'
        }}
        transition={{
          scale: {
            repeat: Infinity,
            duration: breatheNode ? 3.0 : 2.0,
            ease: 'easeInOut'
          },
          boxShadow: {
            repeat: Infinity,
            duration: 2.0,
            ease: 'easeInOut'
          },
          borderColor: { duration: 0.25 }
        }}
        className={`
          px-4 py-3 rounded-xl border bg-[#151B23] transition-all duration-300 min-w-[150px] shadow-lg select-none cursor-pointer
          ${data.isActive ? 'bg-accent-sage-dim' : ''}
          ${data.isDimmed ? 'opacity-15 blur-[0.6px] grayscale scale-95' : 'opacity-100'}
        `}
      >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
      
      <div className="flex items-center gap-2.5">
        <div className={`p-1.5 rounded-lg ${data.isActive ? 'text-accent-sage animate-pulse' : 'text-white/40'}`}>
          {data.icon}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-white/30">{data.label}</span>
          <span className="text-13 font-semibold text-white/90 truncate">{data.metric}</span>
        </div>
      </div>
    </motion.div>
    </div>
  );
};

const nodeTypes = {
  customNode: CustomGraphNode
};

// Relationship details map for the tooltip (Static fallbacks)
const fallbackRelationshipMap: Record<string, { metric: string; influence: string[] }> = {
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
  const nodeContexts = useAppStore((state) => state.nodeContexts);
  const parsedData = useAppStore((state) => state.parsedData);
  const dynamicCanvasEdges = useAppStore((state) => state.strategyCanvasEdges);
  
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

  // Compute dynamic relationships based on actual correlations
  const relationshipMap = useMemo(() => {
    const map: Record<string, { metric: string; influence: string[] }> = {};
    
    Object.keys(nodeContexts).forEach(key => {
      const ctx = nodeContexts[key];
      let influence: string[] = [];

      if (parsedData) {
        // Map standard keys to csv columns
        const standardCol = parsedData.detectedMetrics[key as keyof typeof parsedData.detectedMetrics];
        if (standardCol) {
          const corrs = parsedData.correlations[standardCol] || {};
          const sortedCorrs = Object.keys(corrs)
            .filter(c => c !== standardCol && Math.abs(corrs[c]) > 0.25)
            .sort((a, b) => Math.abs(corrs[b]) - Math.abs(corrs[a]))
            .slice(0, 3);
          influence = sortedCorrs;
        }
      }

      if (influence.length === 0) {
        influence = fallbackRelationshipMap[key]?.influence || ['System variables'];
      }

      map[key] = {
        metric: ctx?.metric || 'Nominal',
        influence
      };
    });

    // Ensure growth exists
    if (!map['growth']) {
      map['growth'] = { metric: '+14% YoY', influence: ['Sales pipeline', 'Regulatory path'] };
    }

    return map;
  }, [nodeContexts, parsedData]);

  // Set of connections linked to any hovered node to dictate fading
  const connectedNodes = useMemo(() => {
    if (!activeHoveredNodeId) return new Set<string>();
    
    const linked = new Set<string>([activeHoveredNodeId]);
    
    // Scan dynamic edges to see what's connected to hovered node
    dynamicCanvasEdges.forEach(e => {
      if (e.source === activeHoveredNodeId) linked.add(e.target);
      if (e.target === activeHoveredNodeId) linked.add(e.source);
    });

    // If health is hovered, connect to all
    if (activeHoveredNodeId === 'health') {
      return new Set([
        'health', 'revenue', 'profit', 'marketing', 'customers', 
        'inventory', 'operations', 'customer-satisfaction', 'growth'
      ]);
    }

    // Always keep health connected
    linked.add('health');
    return linked;
  }, [activeHoveredNodeId, dynamicCanvasEdges]);

  // Layout node definitions
  const fullNodes = useMemo(() => [
    {
      id: 'health',
      type: 'customNode',
      position: { x: 300, y: 195 },
      data: {
        label: 'Business Health',
        metric: nodeContexts.health?.metric || '84/100',
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
        metric: nodeContexts.revenue?.metric || '$42.8M',
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
        metric: nodeContexts.profit?.metric || '44.0%',
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
        metric: nodeContexts['customer-satisfaction']?.metric || '72 NPS',
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
        metric: nodeContexts.marketing?.metric || '4.8x ROI',
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
        metric: nodeContexts.operations?.metric || '92.4%',
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
        metric: nodeContexts.inventory?.metric || '6.2x Turns',
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
        metric: nodeContexts.customers?.metric || '118% NRR',
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
        metric: nodeContexts.growth?.metric || '+14% YoY',
        icon: <TrendingUp size={14} />,
        isActive: activeNodeId === 'growth',
        isHovered: activeHoveredNodeId === 'growth',
        isDimmed: activeHoveredNodeId !== null && !connectedNodes.has('growth'),
        onMouseEnter: () => setHoveredNodeId('growth'),
        onMouseLeave: () => setHoveredNodeId(null)
      }
    }
  ], [activeNodeId, activeHoveredNodeId, connectedNodes, nodeContexts]);

  // Display only assembled nodes
  const nodes = useMemo(() => {
    return fullNodes.slice(0, nodesAssembled);
  }, [fullNodes, nodesAssembled]);

  // Connected relationship edges (Derived dynamically from correlation mapping)
  const edges: Edge[] = useMemo(() => {
    // Render store strategyCanvasEdges
    const renderedEdges = dynamicCanvasEdges.map((e, idx) => {
      const isSourceActive = activeNodeId === e.source || activeNodeId === e.target;
      const isHighlighted = activeHoveredNodeId === e.source || activeHoveredNodeId === e.target || isSourceActive;
      const isDimmed = activeHoveredNodeId !== null && activeHoveredNodeId !== e.source && activeHoveredNodeId !== e.target;

      return {
        id: `edge-${e.source}-${e.target}-${idx}`,
        source: e.source,
        target: e.target,
        animated: !isDimmed,
        style: {
          stroke: isHighlighted ? '#83D18B' : isDimmed ? 'rgba(255,255,255,0.02)' : 'rgba(255, 255, 255, 0.08)',
          strokeWidth: isHighlighted ? 1.5 : 1,
          transition: 'stroke 0.3s, stroke-width 0.3s'
        }
      };
    });

    // Hub-and-spoke edge fallback if nodes are loaded but store is initial
    if (renderedEdges.length === 0) {
      const satellites = ['revenue', 'profit', 'marketing', 'customers', 'inventory', 'operations', 'customer-satisfaction', 'growth'];
      return satellites
        .filter((_, idx) => idx + 1 < nodesAssembled)
        .map((satId) => {
          const isCenterHovered = activeHoveredNodeId === 'health';
          const isSatHovered = activeHoveredNodeId === satId;
          const isHighlighted = isCenterHovered || isSatHovered || (activeNodeId === satId || activeNodeId === 'health');
          const isDimmed = activeHoveredNodeId !== null && !isCenterHovered && !isSatHovered;

          return {
            id: `edge-fallback-${satId}`,
            source: 'health',
            target: satId,
            animated: isHighlighted,
            style: {
              stroke: isHighlighted ? '#83D18B' : isDimmed ? 'rgba(255,255,255,0.02)' : 'rgba(255, 255, 255, 0.08)',
              strokeWidth: isHighlighted ? 1.5 : 1,
              transition: 'stroke 0.3s, stroke-width 0.3s'
            }
          };
        });
    }

    return renderedEdges;
  }, [activeNodeId, activeHoveredNodeId, nodesAssembled, dynamicCanvasEdges]);

  const activeHoveredRel = activeHoveredNodeId ? relationshipMap[activeHoveredNodeId] : null;
  const hoveredNode = activeHoveredNodeId ? fullNodes.find(n => n.id === activeHoveredNodeId) : null;

  return (
    <div className="w-full h-[580px] relative bg-[#090B10] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
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
              <span className="text-12.5 font-bold text-[#83D18B] font-mono flex items-center gap-0.5">
                <ArrowUpRight size={12} /> {activeHoveredRel.metric}
              </span>
            </div>
            
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold tracking-widest text-[#83D18B]">Related Nodes / Influences</span>
              <div className="flex flex-col gap-1 text-12 text-white/65">
                {activeHoveredRel.influence.map((inf, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 leading-tight truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#83D18B] shrink-0 opacity-60" />
                    {inf}
                  </span>
                ))}
              </div>
            </div>

            {/* Dynamic relationship explanation */}
            <div className="border-t border-white/5 pt-2 mt-1 space-y-1">
              <span className="text-[8.5px] uppercase font-bold tracking-widest text-white/35">Correlation Insight</span>
              <p className="text-11 text-white/50 leading-normal font-serif italic text-left">
                {activeHoveredNodeId === 'marketing' 
                  ? "Ad bidding scale directly influences lead capture rates and pipeline volume."
                  : activeHoveredNodeId === 'revenue'
                    ? "Volume growth expands structural leverage over fixed cost run-rates."
                    : activeHoveredNodeId === 'inventory'
                      ? "Buffer stock levels directly cushion Guadalajara production scheduling."
                      : activeHoveredNodeId === 'customers'
                        ? "Account NRR retention directly compounds long-term run-rate stability."
                        : activeHoveredNodeId === 'profit'
                          ? "Net operating income is derived from category margin mix adjustments."
                          : "Calculated operational correlations indicate positive parameter dependencies."
                }
              </p>
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
