import React, { useMemo, useState, useCallback, useRef } from 'react';
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
  ArrowUpRight,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { useAppStore } from '../features/store';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemoStore } from '../features/demoStore';

interface NodeDefinition {
  id: string;
  label: string;
  x: number;
  y: number;
  icon: React.ReactNode;
}

// Static topology node positions centered in an 800x520 canvas coordinate system
const STAGED_NODES: NodeDefinition[] = [
  { id: 'health', label: 'Business Health', x: 400, y: 260, icon: <Heart size={16} /> },
  { id: 'revenue', label: 'Revenue', x: 400, y: 65, icon: <DollarSign size={16} /> },
  { id: 'profit', label: 'Profit', x: 630, y: 130, icon: <Percent size={16} /> },
  { id: 'customer-satisfaction', label: 'Satisfaction', x: 680, y: 260, icon: <Smile size={16} /> },
  { id: 'marketing', label: 'Marketing', x: 630, y: 390, icon: <Megaphone size={16} /> },
  { id: 'operations', label: 'Operations', x: 400, y: 455, icon: <Settings size={16} /> },
  { id: 'inventory', label: 'Inventory', x: 170, y: 390, icon: <Boxes size={16} /> },
  { id: 'customers', label: 'Customers', x: 120, y: 260, icon: <Users size={16} /> },
  { id: 'growth', label: 'Growth Index', x: 170, y: 130, icon: <TrendingUp size={16} /> }
];

// Fallback influence metadata map
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

export const DecisionGraph: React.FC = () => {
  const activeNodeId = useAppStore((state) => state.activeNodeId);
  const setCopilotContextNodeId = useAppStore((state) => state.setCopilotContextNodeId);
  const nodeContexts = useAppStore((state) => state.nodeContexts);
  const parsedData = useAppStore((state) => state.parsedData);
  const dynamicCanvasEdges = useAppStore((state) => state.strategyCanvasEdges);

  const isDemoActive = useDemoStore((state) => state.isDemoActive);
  const currentStep = useDemoStore((state) => state.currentStep);

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Smooth Viewport Controls
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const activeHoveredNodeId = (isDemoActive && currentStep === 4) ? 'revenue' : hoveredNodeId;

  // Viewport drag pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.graph-node')) return;
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom((prev) => Math.min(1.6, Math.max(0.65, prev * zoomFactor)));
  }, []);

  const resetViewport = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Relationship Map compilation
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

  // Connected nodes map for hover highlighting
  const connectedNodes = useMemo(() => {
    if (!activeHoveredNodeId) return new Set<string>();
    
    const linked = new Set<string>([activeHoveredNodeId]);
    
    dynamicCanvasEdges.forEach(e => {
      if (e.source === activeHoveredNodeId) linked.add(e.target);
      if (e.target === activeHoveredNodeId) linked.add(e.source);
    });

    if (activeHoveredNodeId === 'health') {
      return new Set(STAGED_NODES.map(n => n.id));
    }

    linked.add('health');
    return linked;
  }, [activeHoveredNodeId, dynamicCanvasEdges]);

  // Compute dynamic edge paths
  const edges = useMemo(() => {
    let edgePairs: { source: string; target: string }[] = dynamicCanvasEdges;
    
    if (edgePairs.length === 0) {
      edgePairs = STAGED_NODES.filter(n => n.id !== 'health').map(n => ({ source: 'health', target: n.id }));
    }

    return edgePairs.map(pair => {
      const sourceNode = STAGED_NODES.find(n => n.id === pair.source);
      const targetNode = STAGED_NODES.find(n => n.id === pair.target);
      if (!sourceNode || !targetNode) return null;

      const isSourceActive = activeNodeId === pair.source || activeNodeId === pair.target;
      const isHighlighted = activeHoveredNodeId === pair.source || activeHoveredNodeId === pair.target || isSourceActive;
      const isDimmed = activeHoveredNodeId !== null && activeHoveredNodeId !== pair.source && activeHoveredNodeId !== pair.target;

      // Curved SVG Bezier path
      const dx = targetNode.x - sourceNode.x;
      const cx1 = sourceNode.x + dx * 0.5;
      const cy1 = sourceNode.y;
      const cx2 = sourceNode.x + dx * 0.5;
      const cy2 = targetNode.y;
      const pathData = `M ${sourceNode.x} ${sourceNode.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${targetNode.x} ${targetNode.y}`;

      return {
        id: `${pair.source}-${pair.target}`,
        pathData,
        isHighlighted,
        isDimmed
      };
    }).filter(Boolean);
  }, [activeNodeId, activeHoveredNodeId, dynamicCanvasEdges]);

  const activeHoveredRel = activeHoveredNodeId ? relationshipMap[activeHoveredNodeId] : null;
  const hoveredNode = activeHoveredNodeId ? STAGED_NODES.find(n => n.id === activeHoveredNodeId) : null;

  return (
    <div 
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className="w-full h-[580px] relative bg-[#090B10] border border-white/10 rounded-2xl overflow-hidden shadow-2xl select-none font-sans cursor-grab active:cursor-grabbing"
    >
      {/* Top Header Information Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-0.5 pointer-events-none select-none">
        <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#83D18B] font-mono">Decision Topology</span>
        <span className="text-12 font-bold text-white/90 font-sans">Multivariate Strategy Mesh</span>
      </div>

      {/* Floating Viewport Controls */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1 bg-[#12161D]/90 border border-white/10 p-1 rounded-xl shadow-xl backdrop-blur-md">
        <button
          type="button"
          onClick={() => setZoom(z => Math.min(1.6, z + 0.15))}
          title="Zoom In"
          className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-[#83D18B] hover:bg-white/[0.05] rounded-lg transition-colors cursor-pointer"
        >
          <ZoomIn size={14} />
        </button>
        <button
          type="button"
          onClick={() => setZoom(z => Math.max(0.65, z - 0.15))}
          title="Zoom Out"
          className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-[#83D18B] hover:bg-white/[0.05] rounded-lg transition-colors cursor-pointer"
        >
          <ZoomOut size={14} />
        </button>
        <button
          type="button"
          onClick={resetViewport}
          title="Reset Viewport"
          className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-[#83D18B] hover:bg-white/[0.05] rounded-lg transition-colors cursor-pointer"
        >
          <Maximize2 size={13} />
        </button>
      </div>

      {/* Dynamic McKinsey Relationship Tooltip Overlay */}
      <AnimatePresence>
        {activeHoveredRel && hoveredNode && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute z-30 top-4 right-4 bg-[#12161D]/95 border border-white/10 rounded-2xl p-4.5 w-64 shadow-2xl flex flex-col gap-2.5 pointer-events-none select-none backdrop-blur-md font-sans"
          >
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[9.5px] uppercase font-bold tracking-wider text-white/40 font-mono">
                {hoveredNode.label}
              </span>
              <span className="text-12.5 font-bold text-[#83D18B] font-mono flex items-center gap-0.5">
                <ArrowUpRight size={12} /> {activeHoveredRel.metric}
              </span>
            </div>
            
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold tracking-widest text-[#83D18B] font-mono">Related Influences</span>
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

      {/* Main SVG/HTML Canvas Transform Group */}
      <div 
        className="w-full h-full relative"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center'
        }}
      >
        {/* SVG Background Pattern & Curved Edges */}
        <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 800 520">
          <defs>
            <pattern id="grid-dots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#1A212B" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-dots)" />

          {/* Render Bezier Edges */}
          {edges.map(edge => edge && (
            <g key={edge.id}>
              <path
                d={edge.pathData}
                fill="none"
                stroke={edge.isHighlighted ? '#83D18B' : edge.isDimmed ? 'rgba(255,255,255,0.02)' : 'rgba(255, 255, 255, 0.08)'}
                strokeWidth={edge.isHighlighted ? 2.2 : 1}
                strokeDasharray={edge.isHighlighted ? '6,4' : 'none'}
                className={edge.isHighlighted ? 'animate-pulse' : ''}
              />
            </g>
          ))}
        </svg>

        {/* HTML Node Layer (Strictly 100% Flicker-Free Controlled Coordinates) */}
        <div className="absolute inset-0 pointer-events-none">
          {STAGED_NODES.map((node) => {
            const isActive = activeNodeId === node.id;
            const isHovered = activeHoveredNodeId === node.id;
            const isDimmed = activeHoveredNodeId !== null && !connectedNodes.has(node.id);
            const metric = nodeContexts[node.id]?.metric || (fallbackRelationshipMap[node.id]?.metric || 'Nominal');
            const breatheNode = node.id === 'health';

            return (
              <div
                key={node.id}
                style={{
                  left: `${(node.x / 800) * 100}%`,
                  top: `${(node.y / 520) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className="absolute pointer-events-auto graph-node z-10"
              >
                {/* Hub Radial Glow */}
                {(isActive || breatheNode) && (
                  <div 
                    className={`absolute -inset-5 rounded-2xl blur-xl -z-10 pointer-events-none ${breatheNode ? 'bg-[#83D18B]/15' : 'bg-[#83D18B]/25'}`}
                  />
                )}

                <div
                  onClick={() => setCopilotContextNodeId(node.id)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className={`
                    px-4 py-3 rounded-2xl border bg-[#12161D]/95 backdrop-blur-md min-w-[160px] select-none cursor-pointer transition-colors duration-150 shadow-xl
                    ${isActive ? 'border-[#83D18B] bg-[#83D18B]/10 shadow-[0_0_25px_rgba(131,209,139,0.25)]' : 'border-white/10 hover:border-[#83D18B]/40'}
                    ${isHovered ? 'border-[#83D18B]/60' : ''}
                    ${isDimmed ? 'opacity-25 grayscale' : 'opacity-100'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-white/[0.03] border border-white/5 ${isActive ? 'text-[#83D18B] border-[#83D18B]/30' : 'text-white/40'}`}>
                      {node.icon}
                    </div>
                    <div className="flex flex-col min-w-0 text-left">
                      <span className="text-[9px] uppercase font-bold tracking-wider font-mono text-white/35">{node.label}</span>
                      <span className="text-13 font-bold text-white/95 truncate font-sans">{metric}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
