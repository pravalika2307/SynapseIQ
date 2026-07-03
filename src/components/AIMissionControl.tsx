import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  DollarSign, 
  Percent, 
  Users, 
  Megaphone, 
  Boxes, 
  Settings,
  ArrowRight
} from 'lucide-react';
import { IntelligenceMesh } from './IntelligenceMesh';

interface AIMissionControlProps {
  onComplete: () => void;
}

export const AIMissionControl: React.FC<AIMissionControlProps> = ({ onComplete }) => {
  const steps = useMemo(() => [
    'Initializing Strategic Intelligence...',
    'Reading Business Data...',
    'Understanding Company Structure...',
    'Mapping Business Relationships...',
    'Finding Hidden Opportunities...',
    'Detecting Strategic Risks...',
    'Generating Executive Brief...',
    'Constructing Strategy Canvas...',
    'Preparing Decision Workspace...',
    'Analysis Complete.'
  ], []);

  const [activeStep, setActiveStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (activeStep >= steps.length) {
      setIsExiting(true);
      const timer = setTimeout(() => {
        onComplete();
      }, 800); // 800ms dissolve transition
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setActiveStep((prev) => prev + 1);
    }, 700); // 700ms per step = 7.0 seconds total

    return () => clearTimeout(timer);
  }, [activeStep, steps.length, onComplete]);

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  // Node position mapping (radial surrounding a center health node)
  const nodeConfig = [
    { id: 'revenue', label: 'Revenue', val: '$42.8M', icon: <DollarSign size={14} />, x: '35%', y: '25%', step: 1 },
    { id: 'customers', label: 'Customers', val: '118% NRR', icon: <Users size={14} />, x: '25%', y: '50%', step: 2 },
    { id: 'marketing', label: 'Marketing', val: '4.8x ROI', icon: <Megaphone size={14} />, x: '35%', y: '75%', step: 3 },
    { id: 'profit', label: 'Profit Margin', val: '44.0%', icon: <Percent size={14} />, x: '65%', y: '25%', step: 3 },
    { id: 'operations', label: 'Operations', val: '92.4%', icon: <Settings size={14} />, x: '75%', y: '50%', step: 4 },
    { id: 'inventory', label: 'Inventory', val: '6.2x Turns', icon: <Boxes size={14} />, x: '65%', y: '75%', step: 5 },
    { id: 'health', label: 'Business Health', val: '84/100', icon: <Heart size={14} />, x: '50%', y: '50%', step: 7, isCenter: true },
  ];

  // Laser edge lines definition
  const edgeConfig = [
    { from: 'marketing', to: 'revenue', step: 3 },
    { from: 'revenue', to: 'profit', step: 3 },
    { from: 'operations', to: 'revenue', step: 4 },
    { from: 'inventory', to: 'operations', step: 5 },
    { from: 'operations', to: 'profit', step: 5 },
    // Connections to central health node once health is revealed
    { from: 'revenue', to: 'health', step: 7 },
    { from: 'profit', to: 'health', step: 7 },
    { from: 'customers', to: 'health', step: 7 },
    { from: 'operations', to: 'health', step: 7 },
  ];

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 bg-[#050608] flex flex-col justify-between p-10 select-none overflow-hidden"
        >
          <IntelligenceMesh />

          {/* Top Bar Header */}
          <div className="flex items-center justify-between z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                <span className="absolute w-2 h-2 bg-[#83D18B] rounded-full animate-ping" />
                <span className="w-2.5 h-2.5 bg-[#83D18B] rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-accent-sage uppercase tracking-widest font-sans">
                  AI Mission Control Ingestion
                </span>
                <span className="text-11 text-white/30 font-mono">
                  SynapseIQ Synthesis Matrix v2.5
                </span>
              </div>
            </div>

            <button
              onClick={handleSkip}
              className="flex items-center gap-2 px-4 py-2 border border-white/5 hover:border-white/15 bg-white/[0.01] hover:bg-white/[0.03] rounded-xl text-12 font-medium text-white/50 hover:text-white/90 transition-all font-sans cursor-pointer active:scale-95"
            >
              Skip Ingestion
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Central Spatial Visualizer Sandbox */}
          <div className="flex-1 w-full relative flex items-center justify-center z-10 my-6">
            
            {/* SVG Laser Edge lines container */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {edgeConfig.map((edge, idx) => {
                const sourceNode = nodeConfig.find(n => n.id === edge.from)!;
                const targetNode = nodeConfig.find(n => n.id === edge.to)!;
                const isEdgeVisible = activeStep >= edge.step;
                const isHealthVisible = activeStep >= 7;

                if (!isEdgeVisible) return null;

                return (
                  <motion.line
                    key={idx}
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={edge.to === 'health' || edge.from === 'health' ? '#83D18B' : 'rgba(255, 255, 255, 0.15)'}
                    strokeWidth={edge.to === 'health' || edge.from === 'health' ? 1.5 : 1}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: isHealthVisible && (edge.to === 'health' || edge.from === 'health') ? [0.2, 0.8, 0.4] : 0.4 }}
                    transition={{ 
                      pathLength: { duration: 0.6, ease: 'easeOut' }, 
                      opacity: { duration: 0.5 } 
                    }}
                    strokeDasharray={edge.to === 'health' || edge.from === 'health' ? '4 2' : 'none'}
                  />
                );
              })}
            </svg>

            {/* Render absolute spatial nodes */}
            {nodeConfig.map((node) => {
              const isNodeVisible = activeStep >= node.step;
              if (!isNodeVisible) return null;

              return (
                <motion.div
                  key={node.id}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ 
                    scale: node.isCenter ? [1, 1.05, 1] : 1, 
                    opacity: 1 
                  }}
                  transition={{ 
                    scale: node.isCenter 
                      ? { repeat: Infinity, duration: 2.2, ease: 'easeInOut' }
                      : { type: 'spring', stiffness: 120, damping: 15 }
                  }}
                  style={{
                    position: 'absolute',
                    left: node.x,
                    top: node.y,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`
                    px-4 py-3 rounded-xl border flex items-center gap-3.5 shadow-2xl z-10 min-w-[145px] backdrop-blur-sm select-none
                    ${node.isCenter 
                      ? 'border-[#83D18B]/35 bg-accent-sage-dim/20 text-[#83D18B]' 
                      : 'border-white/5 bg-[#151B23]/60 text-white/90'
                    }
                  `}
                >
                  <div className={`p-1.5 rounded-lg ${node.isCenter ? 'bg-[#83D18B]/20 text-[#83D18B]' : 'bg-white/5 text-white/40'}`}>
                    {node.icon}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-white/30">{node.label}</span>
                    <span className="text-13.5 font-bold font-mono tracking-tight">{node.val}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Narrative strategic logging */}
          <div className="w-full max-w-lg mx-auto z-10 shrink-0 space-y-4 text-center">
            
            {/* Steps text animation */}
            <div className="min-h-[44px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="flex flex-col gap-1 select-none"
                >
                  <span className="text-11 font-mono uppercase text-accent-sage font-bold tracking-widest">
                    Step {Math.min(steps.length, activeStep + 1)} of {steps.length}
                  </span>
                  <span className="text-16 font-medium text-white/90 font-serif leading-tight">
                    {steps[Math.min(steps.length - 1, activeStep)]}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Full-width premium process track */}
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
              <motion.div 
                className="h-full bg-[#83D18B] rounded-full"
                animate={{ width: `${(Math.min(steps.length, activeStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>

            <div className="text-[10px] text-white/25 uppercase font-mono tracking-widest pt-1">
              Establishing Strategic Core Context
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
