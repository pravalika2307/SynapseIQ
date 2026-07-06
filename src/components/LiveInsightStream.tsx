import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Activity, 
  Users, 
  Boxes, 
  Sparkles,
  Zap
} from 'lucide-react';
import { useAppStore } from '../features/store';

interface InsightEvent {
  id: string;
  type: 'revenue' | 'forecast' | 'customers' | 'inventory' | 'marketing';
  text: string;
  time: string;
}

export const LiveInsightStream: React.FC = () => {
  const isPresentationMode = useAppStore((state) => state.isPresentationMode);
  const isDatasetLoaded = useAppStore((state) => state.isDatasetLoaded);

  const [insights, setInsights] = useState<InsightEvent[]>([
    { id: '1', type: 'revenue', text: 'Revenue anomaly isolated', time: 'Just now' },
    { id: '2', type: 'customers', text: 'Customer churn vectors mapped', time: '2m ago' }
  ]);

  const rotationInsights: Omit<InsightEvent, 'id' | 'time'>[] = [
    { type: 'forecast', text: 'Forecast confidence stabilized' },
    { type: 'inventory', text: 'Inventory buffer risk mitigated' },
    { type: 'marketing', text: 'Marketing campaign exceeds targets' },
    { type: 'revenue', text: 'Operating profit discrepancy tagged' },
    { type: 'customers', text: 'CSAT compliance drop detected' }
  ];

  useEffect(() => {
    if (!isDatasetLoaded || isPresentationMode) return;

    const interval = setInterval(() => {
      const randomEvent = rotationInsights[Math.floor(Math.random() * rotationInsights.length)];
      const newEvent: InsightEvent = {
        ...randomEvent,
        id: Math.random().toString(36).substring(7),
        time: 'Just now'
      };

      setInsights((prev) => {
        // Update previous top event time label
        const updatedPrev = prev.map((item, idx) => ({
          ...item,
          time: idx === 0 ? '1m ago' : `${idx + 2}m ago`
        }));
        return [newEvent, ...updatedPrev].slice(0, 4); // Keep top 4 insights
      });
    }, 25000); // Trigger every 25 seconds

    return () => clearInterval(interval);
  }, [isDatasetLoaded, isPresentationMode]);

  if (isPresentationMode || !isDatasetLoaded) return null;

  const iconMap = {
    revenue: <TrendingUp size={12} className="text-[#83D18B]" />,
    forecast: <Zap size={12} className="text-accent-secondary" />,
    customers: <Users size={12} className="text-white/60" />,
    inventory: <Boxes size={12} className="text-warn" />,
    marketing: <Sparkles size={12} className="text-accent-secondary" />
  };

  return (
    <div className="w-[220px] shrink-0 border-l border-white/5 bg-[#090B10] flex flex-col h-full py-6 select-none font-sans overflow-hidden">
      <div className="px-5 pb-4 border-b border-white/5 flex items-center gap-2">
        <Activity size={14} className="text-[#83D18B] animate-pulse" />
        <span className="text-11.5 font-bold uppercase tracking-wider text-white/80">Live Telemetry</span>
      </div>

      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="show"
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3.5"
      >
        <AnimatePresence>
          {insights.map((insight) => (
            <motion.div
              key={insight.id}
              variants={{
                hidden: { opacity: 0, y: 15 },
                show: { opacity: 1, y: 0 }
              }}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, x: -20, height: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18 }}
              className="bg-[#12161D] border border-white/5 rounded-xl p-3.5 flex flex-col gap-1.5 shadow-md relative overflow-hidden group hover:border-[#83D18B]/20 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {iconMap[insight.type]}
                  <span className="text-[8px] font-mono uppercase tracking-widest text-white/40">
                    {insight.type}
                  </span>
                </div>
                <span className="text-[8px] text-white/30 font-mono">{insight.time}</span>
              </div>
              <p className="text-12 font-medium text-white/80 leading-normal text-left font-serif">
                {insight.text}
              </p>
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#83D18B]/1 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
