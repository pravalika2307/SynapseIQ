import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppStore } from '../features/store';
import { useDemoStore } from '../features/demoStore';
import { Card } from '../components/ui';
import { Zap } from 'lucide-react';

// Helper to check if a signal is related to the currently active graph node
const isSignalRelatedToNode = (signalId: string, nodeId: string): boolean => {
  if (nodeId === 'health') return true; // Health shows all
  if (nodeId === 'revenue') return ['cac-efficiency', 'gross-margin'].includes(signalId);
  if (nodeId === 'profit') return ['gross-margin', 'cac-efficiency'].includes(signalId);
  if (nodeId === 'inventory') return ['transit-latency', 'solvency-constraints'].includes(signalId);
  if (nodeId === 'operations') return ['transit-latency', 'order-fill-rate'].includes(signalId);
  if (nodeId === 'customers') return ['cac-efficiency', 'order-fill-rate'].includes(signalId);
  if (nodeId === 'marketing') return ['cac-efficiency'].includes(signalId);
  if (nodeId === 'customer-satisfaction') return ['order-fill-rate', 'customs-holdings'].includes(signalId);
  return false;
};


export const BusinessSignals: React.FC = () => {
  const activeNodeId = useAppStore((state) => state.activeNodeId);
  const businessSignals = useAppStore((state) => state.businessSignals);
  
  const isDemoActive = useDemoStore((state) => state.isDemoActive);
  const currentStep = useDemoStore((state) => state.currentStep);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-[1280px] mx-auto px-8 md:px-12 py-10 flex flex-col gap-8 md:gap-10 font-sans"
    >
      {/* Title */}
      <motion.div variants={itemVariants} className="flex flex-col gap-2 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-sage opacity-75" />
          <span className="text-[9.5px] font-bold uppercase tracking-widest text-accent-sage font-mono">Telemetry Telepresence</span>
        </div>
        <h1 className="text-28 md:text-34 font-bold tracking-tight text-white/95 font-sans">Business Signals Matrix</h1>
        <p className="text-12.5 text-white/45 max-w-2xl leading-relaxed font-sans">
          Real-time telemetry indicators. Clicking a graph node filters and highlights relevant operational signals.
        </p>
      </motion.div>

      {/* Grid */}
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
          }
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {businessSignals.map((signal) => {
          const isRelated = isSignalRelatedToNode(signal.id, activeNodeId);
          const isDimmed = !isRelated;

          const strokeColor = signal.trend === 'positive' ? '#83D18B' : signal.trend === 'negative' ? '#E76F51' : '#F5B14C';
          const fillColor = signal.trend === 'positive' ? 'rgba(131, 209, 139, 0.08)' : signal.trend === 'negative' ? 'rgba(231, 111, 81, 0.08)' : 'rgba(245, 177, 76, 0.08)';

          const isHighlightDemo = isDemoActive && currentStep === 5 && ['gross-margin', 'transit-latency', 'cac-efficiency'].includes(signal.id);
          const advisory = signal.advisory || { insight: 'No signal anomalies detected.', impact: 'Stable.', action: 'Continue tracking.' };

          return (
            <motion.div
              key={signal.id}
              variants={{
                hidden: { opacity: 0, y: 15 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
              }}
              className={`
                bg-[#151B23] border rounded-2xl p-6 flex flex-col gap-4.5 transition-all duration-500 shadow-lg
                ${isDimmed && !isHighlightDemo ? 'opacity-20 border-white/5 grayscale-[50%] pointer-events-none' : 'border-white/5 hover:border-white/10 hover:-translate-y-1 hover:shadow-xl'}
                ${isRelated && activeNodeId !== 'health' ? 'border-accent-sage/35 shadow-accent-sage/5 scale-[1.01]' : ''}
                ${isHighlightDemo ? 'ring-2 ring-[#83D18B] scale-[1.01] shadow-[0_0_20px_rgba(131,209,139,0.15)] bg-[#83D18B]/5 border-transparent' : ''}
              `}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 select-none">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-wider">{signal.category}</span>
                  <h3 className="text-14 font-semibold text-white/90 leading-tight">{signal.title}</h3>
                </div>
                <motion.div 
                  animate={
                    signal.trend === 'negative'
                      ? {
                          boxShadow: [
                            '0 0 0px rgba(231,111,81,0)',
                            '0 0 8px rgba(231,111,81,0.35)',
                            '0 0 0px rgba(231,111,81,0)'
                          ]
                        }
                      : signal.trend === 'positive'
                        ? {
                            scale: [0.97, 1.03, 0.97],
                            boxShadow: [
                              '0 0 0px rgba(131,209,139,0)',
                              '0 0 8px rgba(131,209,139,0.25)',
                              '0 0 0px rgba(131,209,139,0)'
                            ]
                          }
                        : {}
                  }
                  transition={{
                    repeat: Infinity,
                    duration: signal.trend === 'negative' ? 1.6 : 2.4,
                    ease: "easeInOut"
                  }}
                  className={`
                    text-11.5 font-bold px-2 py-0.5 rounded select-none
                    ${signal.trend === 'positive' ? 'bg-accent-sage-dim text-accent-sage' : signal.trend === 'negative' ? 'bg-critical-dim text-critical' : 'bg-warn-dim text-warn'}
                  `}
                >
                  {signal.delta}
                </motion.div>
              </div>

              {/* Sparkline (Supporting evidence) */}
              <div className="h-14 w-full overflow-hidden opacity-75">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={signal.chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip 
                      contentStyle={{ background: '#18212C', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                      labelStyle={{ display: 'none' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke={strokeColor} 
                      strokeWidth={1.2} 
                      fill={fillColor} 
                      dot={{ r: 1.5, fill: strokeColor }} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* CEO/Advisory Bulletins */}
              <div className="border-t border-white/5 pt-4 flex flex-col gap-3 font-serif">
                <div className="space-y-1">
                  <span className="text-[8.5px] uppercase font-sans font-bold tracking-widest text-[#83D18B]/70">What changed?</span>
                  <p className="text-12 text-white/70 leading-normal">{advisory.insight}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[8.5px] uppercase font-sans font-bold tracking-widest text-white/40">What happens next?</span>
                  <p className="text-12 text-white/60 leading-normal">{advisory.impact}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[8.5px] uppercase font-sans font-bold tracking-widest text-white/40">What should you do?</span>
                  <p className="text-12 text-white/65 leading-normal italic">{advisory.action}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* AI Recommendations panel (Step 5 spotlight target) */}
      <AnimatePresence>
        {isDemoActive && currentStep === 5 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full mt-4"
          >
            <Card elevation="flat" className="p-6 border border-[#83D18B]/20 bg-[#83D18B]/5 shadow-xl flex flex-col gap-3">
              <div className="flex items-center gap-1.5 text-[#83D18B]">
                <Zap size={14} className="animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider font-sans">AI Sourcing Recommendations</span>
              </div>
              <h4 className="text-14.5 font-semibold text-white tracking-tight font-serif">
                Divert wafer sourcing flow to Arizona foundry lines & scale Jalisco stock targets to 60 days
              </h4>
              <p className="text-13 text-white/50 leading-relaxed font-serif">
                Analysis of Vietnamese dock backlogs flags peak queues at 32 days. Transitioning microcontroller SKU components overland protects overall gross profit margin targets.
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
