import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppStore } from '../features/store';
import { businessSignals } from '../features/data';

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
      className="max-w-[1200px] mx-auto px-10 py-12 flex flex-col gap-10"
    >
      {/* Title */}
      <motion.div variants={itemVariants} className="flex flex-col gap-3 pt-8">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-sage opacity-75" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent-sage">Telemetry Telepresence</span>
        </div>
        <h1 className="text-32 font-semibold tracking-tight text-white/95">Business Signals Matrix</h1>
        <p className="text-14 text-white/50 -mt-2">
          Real-time telemetry indicators. Clicking a graph node filters and highlights relevant operational signals.
        </p>
      </motion.div>

      {/* Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businessSignals.map((signal) => {
          const isRelated = isSignalRelatedToNode(signal.id, activeNodeId);
          const isDimmed = !isRelated;

          const strokeColor = signal.trend === 'positive' ? '#79D38A' : signal.trend === 'negative' ? '#E76F51' : '#F5B14C';
          const fillColor = signal.trend === 'positive' ? 'rgba(121, 211, 138, 0.08)' : signal.trend === 'negative' ? 'rgba(231, 111, 81, 0.08)' : 'rgba(245, 177, 76, 0.08)';

          return (
            <div
              key={signal.id}
              className={`
                bg-card border rounded-2xl p-6 flex flex-col gap-5 transition-all duration-500 shadow-lg
                ${isDimmed ? 'opacity-20 border-white/5 grayscale-[50%] pointer-events-none' : 'border-white/5 hover:border-white/10 hover:-translate-y-1 hover:shadow-xl'}
                ${isRelated && activeNodeId !== 'health' ? 'border-accent-sage/35 shadow-accent-sage/5 scale-[1.01]' : ''}
              `}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-wider">{signal.category}</span>
                  <h3 className="text-14 font-semibold text-white/90 leading-tight">{signal.title}</h3>
                </div>
                <div className={`
                  text-11.5 font-bold px-2 py-0.5 rounded
                  ${signal.trend === 'positive' ? 'bg-accent-sage-dim text-accent-sage' : signal.trend === 'negative' ? 'bg-critical-dim text-critical' : 'bg-warn-dim text-warn'}
                `}>
                  {signal.delta}
                </div>
              </div>

              {/* Chart */}
              <div className="h-20 w-full overflow-hidden">
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
                      strokeWidth={1.5} 
                      fill={fillColor} 
                      dot={{ r: 2, fill: strokeColor }} 
                    />
                    {signal.chartData[0].baseline !== undefined && (
                      <Area 
                        type="monotone" 
                        dataKey="baseline" 
                        stroke="rgba(255,255,255,0.15)" 
                        strokeWidth={1} 
                        strokeDasharray="3 3"
                        fill="none" 
                        dot={false}
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Footer Note */}
              <div className="border-t border-white/5 pt-3.5 mt-auto">
                <p 
                  className="text-11.5 text-white/40 leading-relaxed font-serif" 
                  dangerouslySetInnerHTML={{ __html: signal.note }}
                />
              </div>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};
