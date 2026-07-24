import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Position, 
  Handle,
  ReactFlowProvider,
  useReactFlow,
  Controls,
  MiniMap
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
import { useDemoStore } from '../features/demoStore';

// Define custom node data type
interface CustomNodeData extends Record<string, unknown> {
  label: string;
  metric: string;
  icon: React.ReactNode;
  isActive: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  onMouseEnter: (id: string) => void;
  onMouseLeave: () => void;
}

// Memoized Custom Graph Node to prevent re-renders on unrelated graph state updates
const CustomGraphNodeComponent: React.FC<NodeProps<Node<CustomNodeData>>> = ({ id, data }) => {
  const breatheNode = id === 'health' || data.label === 'Business Health' || data.label === 'Business Health Index';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative"
    >
      {/* Radial glow backdrop for active or health hub node */}
      {(data.isActive || breatheNode) && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: breatheNode ? [0.15, 0.3, 0.15] : [0.2, 0.4, 0.2], 
            scale: breatheNode ? [1.1, 1.2, 1.1] : [1.15, 1.25, 1.15] 
          }}
          transition={{ repeat: Infinity, duration: breatheNode ? 4.0 : 2.5, ease: 'easeInOut' }}
          className={`absolute -inset-6 rounded-2xl blur-xl -z-10 pointer-events-none ${breatheNode ? 'bg-[#83D18B]/15' : 'bg-[#83D18B]/20'}`}
        />
      )}

      <motion.div 
        onMouseEnter={() => data.onMouseEnter(id)}
        onMouseLeave={data.onMouseLeave}
        animate={{
          scale: data.isActive 
            ? [1.02, 1.04, 1.02] 
            : breatheNode 
              ? [0.99, 1.01, 0.99] 
              : 1,
          borderColor: data.isActive 
            ? 'rgba(131, 209, 139, 0.85)' 
            : data.isHovered 
              ? 'rgba(131, 209, 139, 0.45)' 
              : 'rgba(255, 255, 255, 0.08)',
          boxShadow: data.isActive
            ? ['0 0 10px rgba(131,209,139,0.1)', '0 0 25px rgba(131,209,139,0.25)', '0 0 10px rgba(131,209,139,0.1)']
            : '0 8px 30px rgba(0,0,0,0.45)'
        }}
        transition={{
          scale: { repeat: Infinity, duration: breatheNode ? 3.0 : 2.0, ease: 'easeInOut' },
          boxShadow: { repeat: Infinity, duration: 2.0, ease: 'easeInOut' },
          borderColor: { duration: 0.15 }
        }}
        className={`
          px-4.5 py-3.5 rounded-2xl border bg-[#12161D]/90 backdrop-blur-md transition-colors duration-150 min-w-[160px] select-none cursor-pointer
          ${data.isActive ? 'bg-[#83D18B]/10 border-[#83D18B]' : ''}
          ${data.isDimmed ? 'opacity-25 blur-[0.5px] grayscale scale-95' : 'opacity-100'}
        `}
      >
        <Handle type="target" position={Position.Top} className="opacity-0" />
        <Handle type="source" position={Position.Bottom} className="opacity-0" />
        
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl bg-white/[0.03] border border-white/5 ${data.isActive ? 'text-[#83D18B] border-[#83D18B]/30' : 'text-white/40'}`}>
            {data.icon}
          </div>
          <div className="flex flex-col min-w-0 text-left">
            <span className="text-[9px] uppercase font-bold tracking-wider font-mono text-white/35">{data.label}</span>
            <span className="text-13 font-bold text-white/95 truncate font-sans">{data.metric}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const CustomGraphNode = React.memo(CustomGraphNodeComponent, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.data.isActive === nextProps.data.isActive &&
    prevProps.data.isHovered === nextProps.data.isHovered &&
    prevProps.data.isDimmed === nextProps.data.isDimmed &&
    prevProps.data.label === nextProps.data.label &&
    prevProps.data.metric === nextProps.data.metric
  );
});

// Static nodeTypes definition outside render loop to prevent re-mounting
const nodeTypes = {
  customNode: CustomGraphNode
};

// Static relationship fallback definitions
const fallbackRelationshipMap: Record<string, { metric: string; influence: string[] }> = {
  health: { metric: '84/100', influence: ['Revenue Run-rate', 'SLA Compliances', 'Safety stocks'] },
  revenue: { metric: '↑ 18%', influence: ['Marketing campaigns', 'Enterprise Customers', 'South Region'] },
  profit: { metric: '44.0%', influence: ['Wafer margins', 'Corridor rerouting', 'Spot-rates'] },
  marketing: { metric: '4.8x ROI', influence: ['High-Intent Search', 'Account-Based focus', 'Ad Bid levels'] },
  customers: { metric: '118% NRR', influence: ['Onboarding pipelines', 'Customer Satisfaction NPS', 'Logo retention'] },
  inventory: { metric: '6.2x turns', influence: ['Port queues', 'Jalisco buffer levels', 'Wafer availability'] },
  operations: { metric: '92.4%', influence: ['Guadalajara Plant Capacity', 'Wafer sourcing', 'Clearance delays'] },
  'customer-satisfaction': { metric: '72 NPS', influence: ['Product reliability', 'Support response loops', 'SLA compliances'] },
  growth: { metric: '↑ 14%', influence: ['Sales team focus', 'Frankfurt regulatory path', 'Renewals scale'] }
};

let strategyCanvasHasPlayedAnimation = false;

const DecisionGraphInner: React.FC = () => {
  const activeNodeId = useAppStore((state) => state.activeNodeId);
  const setCopilotContextNodeId = useAppStore((state) => state.setCopilotContextNodeId);
  const nodeContexts = useAppStore((state) => state.nodeContexts);
  const parsedData = useAppStore((state) => state.parsedData);
  const dynamicCanvasEdges = useAppStore((state) => state.strategyCanvasEdges);
  
  const isDemoActive = useDemoStore((state) => state.isDemoActive);
  const currentStep = useDemoStore((state) => state.currentStep);

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [nodesAssembled, setNodesAssembled] = useState(
    strategyCanvasHasPlayedAnimation ? 9 : 0
  );

  const { fitView } = useReactFlow();

  // Single initial camera fit on mount to avoid viewport jumping
  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ padding: 0.24, duration: 250 });
    }, 150);
    return () => clearTimeout(timer);
  }, [fitView]);

  const activeHoveredNodeId = (isDemoActive && currentStep === 4) ? 'revenue' : hoveredNodeId;

  // Memoized node hover callbacks
  const handleMouseEnter = useCallback((id: string) => {
    setHoveredNodeId(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredNodeId(null);
  }, []);

  // Fast sequential node assembly animation
  useEffect(() => {
    if (strategyCanvasHasPlayedAnimation) return;

    const timer = setInterval(() => {
      setNodesAssembled((prev) => {
        if (prev >= 9) {
          clearInterval(timer);
          strategyCanvasHasPlayedAnimation = true;
          return 9;
        }
        return prev + 1;
      });
    }, 90);
    return () => clearInterval(timer);
  }, []);

  const relationshipMap = useMemo(() => {
    const map: Record<string, { metric: string; influence: string[] }> = {};
    
    Object.keys(nodeContexts).forEach(key => {
      const ctx = nodeContexts[key];
      let influence: string[] = [];

      if (parsedData) {
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

    if (!map['growth']) {
      map['growth'] = { metric: '+14% YoY', influence: ['Sales pipeline', 'Regulatory path'] };
    }

    return map;
  }, [nodeContexts, parsedData]);

  const connectedNodes = useMemo(() => {
    if (!activeHoveredNodeId) return new Set<string>();
    
    const linked = new Set<string>([activeHoveredNodeId]);
    
    dynamicCanvasEdges.forEach(e => {
      if (e.source === activeHoveredNodeId) linked.add(e.target);
      if (e.target === activeHoveredNodeId) linked.add(e.source);
    });

    if (activeHoveredNodeId === 'health') {
      return new Set([
        'health', 'revenue', 'profit', 'marketing', 'customers', 
        'inventory', 'operations', 'customer-satisfaction', 'growth'
      ]);
    }

    linked.add('health');
    return linked;
  }, [activeHoveredNodeId, dynamicCanvasEdges]);

  // Executive node layout definitions with stable coordinate geometry
  const fullNodes = useMemo(() => [
    {
      id: 'health',
      type: 'customNode',
      position: { x: 360, y: 240 },
      data: {
        label: 'Business Health',
        metric: nodeContexts.health?.metric || '84/100',
        icon: <Heart size={16} />,
        isActive: activeNodeId === 'health',
        isHovered: activeHoveredNodeId === 'health',
        isDimmed: activeHoveredNodeId !== null && !connectedNodes.has('health'),
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave
      }
    },
    {
      id: 'revenue',
      type: 'customNode',
      position: { x: 360, y: 20 },
      data: {
        label: 'Revenue',
        metric: nodeContexts.revenue?.metric || '$42.8M',
        icon: <DollarSign size={16} />,
        isActive: activeNodeId === 'revenue',
        isHovered: activeHoveredNodeId === 'revenue',
        isDimmed: activeHoveredNodeId !== null && !connectedNodes.has('revenue'),
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave
      }
    },
    {
      id: 'profit',
      type: 'customNode',
      position: { x: 600, y: 90 },
      data: {
        label: 'Profit',
        metric: nodeContexts.profit?.metric || '44.0%',
        icon: <Percent size={16} />,
        isActive: activeNodeId === 'profit',
        isHovered: activeHoveredNodeId === 'profit',
        isDimmed: activeHoveredNodeId !== null && !connectedNodes.has('profit'),
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave
      }
    },
    {
      id: 'customer-satisfaction',
      type: 'customNode',
      position: { x: 650, y: 240 },
      data: {
        label: 'Satisfaction',
        metric: nodeContexts['customer-satisfaction']?.metric || '72 NPS',
        icon: <Smile size={16} />,
        isActive: activeNodeId === 'customer-satisfaction',
        isHovered: activeHoveredNodeId === 'customer-satisfaction',
        isDimmed: activeHoveredNodeId !== null && !connectedNodes.has('customer-satisfaction'),
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave
      }
    },
    {
      id: 'marketing',
      type: 'customNode',
      position: { x: 600, y: 390 },
      data: {
        label: 'Marketing',
        metric: nodeContexts.marketing?.metric || '4.8x ROI',
        icon: <Megaphone size={16} />,
        isActive: activeNodeId === 'marketing',
        isHovered: activeHoveredNodeId === 'marketing',
        isDimmed: activeHoveredNodeId !== null && !connectedNodes.has('marketing'),
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave
      }
    },
    {
      id: 'operations',
      type: 'customNode',
      position: { x: 360, y: 460 },
      data: {
        label: 'Operations',
        metric: nodeContexts.operations?.metric || '92.4%',
        icon: <Settings size={16} />,
        isActive: activeNodeId === 'operations',
        isHovered: activeHoveredNodeId === 'operations',
        isDimmed: activeHoveredNodeId !== null && !connectedNodes.has('operations'),
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave
      }
    },
    {
      id: 'inventory',
      type: 'customNode',
      position: { x: 120, y: 390 },
      data: {
        label: 'Inventory',
        metric: nodeContexts.inventory?.metric || '6.2x Turns',
        icon: <Boxes size={16} />,
        isActive: activeNodeId === 'inventory',
        isHovered: activeHoveredNodeId === 'inventory',
        isDimmed: activeHoveredNodeId !== null && !connectedNodes.has('inventory'),
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave
      }
    },
    {
      id: 'customers',
      type: 'customNode',
      position: { x: 70, y: 240 },
      data: {
        label: 'Customers',
        metric: nodeContexts.customers?.metric || '118% NRR',
        icon: <Users size={16} />,
        isActive: activeNodeId === 'customers',
        isHovered: activeHoveredNodeId === 'customers',
        isDimmed: activeHoveredNodeId !== null && !connectedNodes.has('customers'),
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave
      }
    },
    {
      id: 'growth',
      type: 'customNode',
      position: { x: 120, y: 90 },
      data: {
        label: 'Growth Index',
        metric: nodeContexts.growth?.metric || '+14% YoY',
        icon: <TrendingUp size={16} />,
        isActive: activeNodeId === 'growth',
        isHovered: activeHoveredNodeId === 'growth',
        isDimmed: activeHoveredNodeId !== null && !connectedNodes.has('growth'),
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave
      }
    }
  ], [activeNodeId, activeHoveredNodeId, connectedNodes, nodeContexts, handleMouseEnter, handleMouseLeave]);

  const nodes = useMemo(() => fullNodes.slice(0, nodesAssembled), [fullNodes, nodesAssembled]);

  // Clean edge routing with stable keys
  const edges: Edge[] = useMemo(() => {
    const renderedEdges = dynamicCanvasEdges
      .filter(e => nodes.some(n => n.id === e.source) && nodes.some(n => n.id === e.target))
      .map((e) => {
        const isSourceActive = activeNodeId === e.source || activeNodeId === e.target;
        const isHighlighted = activeHoveredNodeId === e.source || activeHoveredNodeId === e.target || isSourceActive;
        const isDimmed = activeHoveredNodeId !== null && activeHoveredNodeId !== e.source && activeHoveredNodeId !== e.target;

        return {
          id: `edge-${e.source}-${e.target}`,
          source: e.source,
          target: e.target,
          type: 'smoothstep',
          animated: !isDimmed,
          style: {
            stroke: isHighlighted ? '#83D18B' : isDimmed ? 'rgba(255,255,255,0.02)' : 'rgba(255, 255, 255, 0.08)',
            strokeWidth: isHighlighted ? 1.8 : 1,
            transition: 'stroke 0.2s, stroke-width 0.2s'
          }
        };
      });

    if (renderedEdges.length === 0) {
      const satellites = ['revenue', 'profit', 'marketing', 'customers', 'inventory', 'operations', 'customer-satisfaction', 'growth'];
      return satellites
        .filter((satId, idx) => idx + 1 < nodesAssembled && nodes.some(n => n.id === satId))
        .map((satId) => {
          const isCenterHovered = activeHoveredNodeId === 'health';
          const isSatHovered = activeHoveredNodeId === satId;
          const isHighlighted = isCenterHovered || isSatHovered || (activeNodeId === satId || activeNodeId === 'health');
          const isDimmed = activeHoveredNodeId !== null && !isCenterHovered && !isSatHovered;

          return {
            id: `edge-fallback-${satId}`,
            source: 'health',
            target: satId,
            type: 'smoothstep',
            animated: isHighlighted,
            style: {
              stroke: isHighlighted ? '#83D18B' : isDimmed ? 'rgba(255,255,255,0.02)' : 'rgba(255, 255, 255, 0.08)',
              strokeWidth: isHighlighted ? 1.8 : 1,
              transition: 'stroke 0.2s, stroke-width 0.2s'
            }
          };
        });
    }

    return renderedEdges;
  }, [activeNodeId, activeHoveredNodeId, nodesAssembled, dynamicCanvasEdges, nodes]);

  const activeHoveredRel = activeHoveredNodeId ? relationshipMap[activeHoveredNodeId] : null;
  const hoveredNode = activeHoveredNodeId ? fullNodes.find(n => n.id === activeHoveredNodeId) : null;

  return (
    <div className="w-full h-[620px] relative bg-[#090B10] border border-white/10 rounded-2xl overflow-hidden shadow-2xl font-sans">
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-0.5 select-none pointer-events-none">
        <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#83D18B] font-mono">Decision Topology</span>
        <span className="text-12 font-bold text-white/90 font-sans">Multivariate Strategy Mesh</span>
      </div>

      {/* Relationship Tooltip overlay */}
      <AnimatePresence>
        {activeHoveredRel && hoveredNode && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 top-4 right-4 bg-[#12161D]/95 border border-white/10 rounded-2xl p-4.5 w-64 shadow-2xl flex flex-col gap-2.5 pointer-events-none select-none backdrop-blur-md font-sans"
          >
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[9.5px] uppercase font-bold tracking-wider text-white/40 font-mono">
                {hoveredNode.data.label}
              </span>
              <span className="text-12.5 font-bold text-[#83D18B] font-mono flex items-center gap-0.5">
                <ArrowUpRight size={12} /> {activeHoveredRel.metric}
              </span>
            </div>
            
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold tracking-widest text-[#83D18B] font-mono">Related Nodes / Influences</span>
              <div className="flex flex-col gap-1 text-12 text-white/70">
                {activeHoveredRel.influence.map((inf, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 leading-tight truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#83D18B] shrink-0 opacity-60" />
                    {inf}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-white/5 pt-2 mt-1 space-y-1">
              <span className="text-[8.5px] uppercase font-bold tracking-widest text-white/35 font-mono">Correlation Insight</span>
              <p className="text-11 text-white/60 leading-relaxed font-sans text-left">
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
        fitViewOptions={{ padding: 0.24 }}
        nodesConnectable={false}
        nodesDraggable={false}
        elementsSelectable={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        panOnDrag={true}
        proOptions={{ hideAttribution: true }}
        className="w-full h-full"
      >
        <Background color="#1A212B" gap={24} size={1} />
        <Controls 
          className="bg-[#151B23]/90 border border-white/10 rounded-xl overflow-hidden shadow-2xl fill-white/70"
          showInteractive={false}
        />
        <MiniMap 
          nodeColor="#83D18B"
          maskColor="rgba(9, 11, 16, 0.75)"
          className="bg-[#12161D]/90 border border-white/10 rounded-xl overflow-hidden shadow-2xl"
          zoomable
          pannable
        />
      </ReactFlow>

      {/* Attribution watermark styling rules */}
      <style>{`
        .react-flow__attribution { display: none !important; }
        .react-flow__controls-button {
          background: #12161D !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
          color: rgba(255, 255, 255, 0.7) !important;
          fill: rgba(255, 255, 255, 0.7) !important;
        }
        .react-flow__controls-button:hover {
          background: rgba(255, 255, 255, 0.06) !important;
          color: #83D18B !important;
          fill: #83D18B !important;
        }
      `}</style>
    </div>
  );
};

export const DecisionGraph: React.FC = () => {
  return (
    <ReactFlowProvider>
      <DecisionGraphInner />
    </ReactFlowProvider>
  );
};
