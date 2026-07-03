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
  ArrowRight,
  Check,
  Sparkles,
  ArrowRightCircle
} from 'lucide-react';
import { IntelligenceMesh } from './IntelligenceMesh';
import { useAppStore } from '../features/store';

interface AIMissionControlProps {
  onComplete: () => void;
}

export const AIMissionControl: React.FC<AIMissionControlProps> = ({ onComplete }) => {
  const steps = useMemo(() => [
    'Initializing Strategic Intelligence...',
    'Reading Business Data...',
    'Strategic understanding established.',
    'Business relationships mapped.',
    'Finding Hidden Opportunities...',
    'Detecting Strategic Risks...',
    'Executive Brief prepared.',
    'Constructing Strategy Canvas...',
    'Preparing Decision Workspace...',
    'Future outlook recalculated.'
  ], []);

  const checklist = useMemo(() => [
    'Executive recommendations refreshed.',
    'Executive Brief prepared.',
    'Business relationships mapped.',
    'Strategic understanding established.'
  ], []);

  const [activeStep, setActiveStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [checkIndex, setCheckIndex] = useState(-1);
  
  // Phase 2: Narrative states
  const [showNarrative, setShowNarrative] = useState(false);
  const [narrativeIndex, setNarrativeIndex] = useState(0);

  const parsedData = useAppStore((state) => state.parsedData);
  const nodeContexts = useAppStore((state) => state.nodeContexts);

  // Time-based greeting
  const greeting = useMemo(() => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good morning';
    if (hrs < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const healthScore = useMemo(() => {
    const healthMetric = nodeContexts.health?.metric || '84/100';
    return parseInt(healthMetric) || 84;
  }, [nodeContexts]);

  // Dynamic narrative sentences list
  const narrativeSentences = useMemo(() => {
    const rowCountText = parsedData?.rowCount 
      ? `${parsedData.rowCount.toLocaleString()} records`
      : 'the telemetry matrix';
      
    const opportunities = [
      nodeContexts.revenue?.opportunity || 'Marketing efficiency increased by 18%.',
      nodeContexts.profit?.opportunity || 'Inventory safety stock targets must shift nearshore.',
      nodeContexts.customers?.opportunity || 'Customer satisfaction in the West region declined.'
    ];

    return [
      `${greeting}.`,
      `We've completed the analysis of your business performance across ${rowCountText}.`,
      healthScore >= 75 
        ? `The enterprise registers healthy operational parameters with a composite rating of ${healthScore}/100.`
        : `Key indicators suggest operating strains, setting the composite index to ${healthScore}/100.`,
      'However...',
      'Three critical areas require immediate executive prioritization:',
      `1. ${opportunities[0].replace('AI suggests ', 'We recommend ').replace('AI recommends ', 'We recommend ')}`,
      `2. ${opportunities[1].replace('AI suggests ', 'We recommend ').replace('AI recommends ', 'We recommend ')}`,
      `3. ${opportunities[2].replace('AI suggests ', 'We recommend ').replace('AI recommends ', 'We recommend ')}`,
      "We've compiled the strategic action plan inside the boardroom briefings portal.",
      'Welcome to your Decision Workspace.'
    ];
  }, [greeting, parsedData, healthScore, nodeContexts]);

  // Core step-advancing ticker
  useEffect(() => {
    if (activeStep >= steps.length - 1) {
      setCheckIndex(0);
      return;
    }

    const timer = setTimeout(() => {
      setActiveStep((prev) => prev + 1);
    }, 700);

    return () => clearTimeout(timer);
  }, [activeStep, steps.length]);

  // Checklist sequential ticker
  useEffect(() => {
    if (checkIndex === -1) return;

    if (checkIndex >= checklist.length) {
      // Checklist complete. Dissolve checklist and start Narrative!
      const timer = setTimeout(() => {
        setShowNarrative(true);
      }, 600);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setCheckIndex((prev) => prev + 1);
    }, 350);

    return () => clearTimeout(timer);
  }, [checkIndex, checklist.length]);

  // Narrative index advancing ticker
  useEffect(() => {
    if (!showNarrative) return;
    if (narrativeIndex >= narrativeSentences.length) return;

    const timer = setTimeout(() => {
      setNarrativeIndex((prev) => prev + 1);
    }, 1400); // 1.4 seconds per sentence to allow comfortable reading

    return () => clearTimeout(timer);
  }, [showNarrative, narrativeIndex, narrativeSentences.length]);

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
          className="fixed inset-0 z-50 bg-[#050608] flex flex-col justify-between p-10 select-none overflow-hidden font-sans"
        >
          <IntelligenceMesh />

          {/* Top Bar Header */}
          <div className="flex items-center justify-between z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                <span className="absolute w-2 h-2 bg-[#83D18B] rounded-full animate-ping" />
                <span className="w-2.5 h-2.5 bg-[#83D18B] rounded-full" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold text-accent-sage uppercase tracking-widest">
                  AI Mission Control Ingestion
                </span>
                <span className="text-11 text-white/30 font-mono">
                  SynapseIQ Synthesis Matrix v2.5
                </span>
              </div>
            </div>

            <button
              onClick={handleSkip}
              className="flex items-center gap-2 px-4 py-2 border border-white/5 hover:border-white/15 bg-white/[0.01] hover:bg-white/[0.03] rounded-xl text-12 font-medium text-white/50 hover:text-white/90 transition-all cursor-pointer active:scale-95 z-20"
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

            {/* Ingestion Sequential Checklist overlay on completion */}
            <AnimatePresence>
              {checkIndex !== -1 && !showNarrative && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, backdropFilter: 'blur(0px)' }}
                  animate={{ opacity: 1, scale: 1, backdropFilter: 'blur(4px)' }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="absolute inset-0 bg-[#050608]/75 z-20 flex flex-col items-center justify-center p-10 select-none"
                >
                  <motion.div 
                    initial={{ y: 15 }}
                    animate={{ y: 0 }}
                    className="w-full max-w-sm bg-[#0D1117] border border-[#83D18B]/30 shadow-[0_12px_40px_rgba(131,209,139,0.08)] rounded-2xl p-7 flex flex-col gap-6"
                  >
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                      <Sparkles className="text-[#83D18B] animate-pulse" size={18} />
                      <h3 className="text-14 font-bold text-white/90 uppercase tracking-wider">Strategic Synthesis Matrix</h3>
                    </div>
                    <div className="flex flex-col gap-4 text-left">
                      {checklist.map((item, idx) => {
                        const isChecked = checkIndex > idx;
                        const isCurrent = checkIndex === idx;
                        return (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center gap-3 text-13"
                          >
                            <div 
                              className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300
                                ${isChecked 
                                  ? 'bg-[#83D18B] border-[#83D18B] text-[#0D1117]' 
                                  : isCurrent 
                                    ? 'border-[#83D18B] text-[#83D18B] animate-pulse' 
                                    : 'border-white/10 text-transparent'
                                }
                              `}
                            >
                              <Check size={11} strokeWidth={3} />
                            </div>
                            <span 
                              className={`transition-all duration-300 font-mono text-11.5 uppercase tracking-wider
                                ${isChecked 
                                  ? 'text-white/90 font-semibold' 
                                  : isCurrent 
                                    ? 'text-[#83D18B]' 
                                    : 'text-white/30'
                                }
                              `}
                            >
                              {item}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI Narrative Engine Full-screen Overlay */}
            <AnimatePresence>
              {showNarrative && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 bg-[#050608] z-30 flex flex-col items-center justify-center p-12 overflow-y-auto select-none"
                >
                  <div className="w-full max-w-2xl flex flex-col gap-6 text-left relative">
                    <AnimatePresence>
                      {narrativeSentences.slice(0, Math.max(1, narrativeIndex + 1)).map((sentence, sIdx) => {
                        const isOpportunity = sentence.startsWith('1.') || sentence.startsWith('2.') || sentence.startsWith('3.');
                        
                        if (isOpportunity) {
                          return (
                            <motion.div
                              key={sIdx}
                              initial={{ opacity: 0, x: -15, scale: 0.98 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                              className="flex items-start gap-4 p-4 bg-[#12161D]/60 border border-[#83D18B]/20 rounded-2xl shadow-xl text-13.5 text-white/85 font-serif leading-relaxed"
                            >
                              <div className="w-5.5 h-5.5 rounded-full bg-[#83D18B]/10 border border-[#83D18B]/30 flex items-center justify-center text-[#83D18B] font-mono text-10 font-bold shrink-0 mt-0.5">
                                {sentence[0]}
                              </div>
                              <div className="flex-1">
                                {sentence.substring(2)}
                              </div>
                            </motion.div>
                          );
                        }
                        
                        return (
                          <motion.p
                            key={sIdx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={`font-serif leading-relaxed text-white/90
                              ${sIdx === 0 ? 'text-24 md:text-30 font-bold mb-3' : ''}
                              ${sentence === 'However...' ? 'text-20 text-[#83D18B] font-bold italic py-1' : ''}
                              ${sentence.includes('Welcome to') ? 'text-18 font-bold text-[#83D18B] mt-4' : 'text-16'}
                            `}
                          >
                            {sentence}
                          </motion.p>
                        );
                      })}
                    </AnimatePresence>

                    {/* Navigation trigger button once narrative ends */}
                    {narrativeIndex >= narrativeSentences.length - 1 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="mt-10 flex justify-start"
                      >
                        <button
                          onClick={handleSkip}
                          className="flex items-center gap-3.5 px-6 py-3.5 bg-[#83D18B] hover:bg-[#A5E6B3] text-[#050608] rounded-2xl font-semibold text-13.5 shadow-2xl transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                        >
                          Access Decision Workspace
                          <ArrowRightCircle size={16} />
                        </button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
