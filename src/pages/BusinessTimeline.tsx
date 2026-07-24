import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Filter, 
  Zap, 
  Info
} from 'lucide-react';
import { useAppStore } from '../features/store';
import { SectionHeader, Badge, Card } from '../components/ui';

import type { TimelineEvent } from '../types';

const renderRecommendation = (recText: string) => {
  if (!recText) return null;
  try {
    const data = JSON.parse(recText);
    if (data && typeof data === 'object' && data.recommendation) {
      return (
        <div className="space-y-2 mt-1 font-sans text-left text-11.5">
          <div className="leading-relaxed"><strong className="text-white/80 font-sans block text-[10px] uppercase text-white/30 tracking-wider">Recommendation</strong> <span className="text-white/85 font-serif text-12 leading-relaxed block">{data.recommendation}</span></div>
          <div className="leading-relaxed"><strong className="text-white/80 font-sans block text-[10px] uppercase text-white/30 tracking-wider">Business Reasoning</strong> <span className="text-white/70 font-serif leading-relaxed block">{data.businessReasoning}</span></div>
          <div className="leading-relaxed"><strong className="text-white/80 font-sans block text-[10px] uppercase text-white/30 tracking-wider">Supporting Metrics</strong> <span className="text-white/70 font-serif leading-relaxed block">{data.supportingMetrics}</span></div>
          <div className="leading-relaxed"><strong className="text-white/80 font-sans block text-[10px] uppercase text-white/30 tracking-wider">Expected Impact</strong> <span className="text-white/70 font-serif leading-relaxed block">{data.expectedImpact}</span></div>
          
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-white/5 pt-2 mt-2 font-mono text-[10.5px]">
            <div>
              <span className="text-white/20 block uppercase text-[8px] tracking-wide">Confidence</span>
              <span className="text-[#83D18B] font-bold">{data.confidenceScore}</span>
            </div>
            <div>
              <span className="text-white/20 block uppercase text-[8px] tracking-wide">Risks</span>
              <span className="text-white/50 block truncate max-w-[130px]" title={data.potentialRisks}>{data.potentialRisks}</span>
            </div>
            <div>
              <span className="text-white/20 block uppercase text-[8px] tracking-wide">Difficulty</span>
              <span className="text-white/60">{data.implementationDifficulty}</span>
            </div>
            <div>
              <span className="text-white/20 block uppercase text-[8px] tracking-wide">Priority</span>
              <span className="text-white/60">{data.priority}</span>
            </div>
            <div className="col-span-2">
              <span className="text-white/20 block uppercase text-[8px] tracking-wide">Suggested Timeline</span>
              <span className="text-[#83D18B]/80 font-semibold">{data.suggestedTimeline}</span>
            </div>
          </div>
        </div>
      );
    }
  } catch (e) {
    // Treat as raw text
  }
  return <span className="font-serif leading-relaxed">"{recText}"</span>;
};


export const BusinessTimeline: React.FC = () => {
  const setCopilotContextNodeId = useAppStore((state) => state.setCopilotContextNodeId);
  const activeNodeId = useAppStore((state) => state.activeNodeId);
  const timelineEvents = useAppStore((state) => state.timelineEvents);

  const [filter, setFilter] = useState<string>('All');
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  // Sync timeline expansion with globally selected Strategy Canvas active node
  useEffect(() => {
    if (activeNodeId && activeNodeId !== 'health') {
      const matchingEvent = timelineEvents.find((e) => e.targetNodeId === activeNodeId);
      if (matchingEvent) {
        setExpandedEventId(matchingEvent.id);
        setFilter('All'); // Force reset filters so the highlighted card is visible
      }
    }
  }, [activeNodeId, timelineEvents]);

  const categories = ['All', 'Revenue', 'Marketing', 'Inventory', 'Customers', 'Operations', 'Risk', 'Growth'];

  const filteredEvents = timelineEvents.filter((ev) => {
    if (filter === 'All') return true;
    if (filter === 'Risk') return ev.trend === 'Risk Alert' || ev.trend === 'SLA Strain';
    return ev.category === filter;
  });

  const handleEventClick = (ev: TimelineEvent) => {
    // Expand or collapse
    setExpandedEventId(expandedEventId === ev.id ? null : ev.id);
    
    // Set workspace context to target node
    setCopilotContextNodeId(ev.targetNodeId);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-8 md:px-12 py-10 flex flex-col gap-8 md:gap-10 text-[#F5F7FA] font-sans">
      
      {/* Title Header */}
      <div className="flex flex-col gap-2 select-none">
        <SectionHeader 
          label="Strategic Progression"
          title="Business Progression Timeline"
          description="Interactive business storytelling ledger. Explains what happened, why it happened, and maps recommended corporate strategy actions."
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-3 border-b border-white/5 pb-4 select-none flex-wrap">
        <div className="flex items-center gap-1.5 text-11 text-white/30 font-bold uppercase tracking-wider mr-2">
          <Filter size={12} /> Filter Events:
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setFilter(cat);
                setExpandedEventId(null);
              }}
              className={`
                px-3 py-1.5 rounded-lg text-11.5 font-semibold transition-all border
                ${filter === cat 
                  ? 'bg-accent-sage text-background border-accent-sage' 
                  : 'bg-card border-white/5 text-white/50 hover:text-white/80 hover:border-white/10'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Timeline Ledger */}
      <div className="relative pl-8 border-l border-white/5 ml-4 mt-4 space-y-12">
        <AnimatePresence mode="wait">
          {filteredEvents.map((ev) => {
            const isHovered = hoveredEventId === ev.id;
            const isExpanded = expandedEventId === ev.id;
            const isNodeActive = activeNodeId === ev.targetNodeId;

            // Trend styles
            const trendColors: Record<string, string> = {
              'Optimizing': 'text-accent-sage bg-accent-sage-dim border-accent-sage-border',
              'High ROI': 'text-accent-sage bg-accent-sage-dim border-accent-sage-border',
              'Risk Alert': 'text-critical bg-critical/10 border-critical/20',
              'SLA Strain': 'text-critical bg-critical/10 border-critical/20',
              'Growth Trigger': 'text-[#A5E6B3] bg-[#A5E6B3]/5 border-[#A5E6B3]/20',
              'Optimized': 'text-accent-sage bg-accent-sage-dim border-accent-sage-border'
            };

            const isRisk = ev.trend === 'Risk Alert' || ev.trend === 'SLA Strain';

            return (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 25, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {/* Vertical Timeline Marker Dot */}
                <div 
                  className={`
                    absolute -left-[40px] top-4 w-4.5 h-4.5 rounded-full border-4 bg-background transition-all duration-300
                    ${isNodeActive ? 'border-accent-sage scale-110 shadow-lg shadow-accent-sage/10' : 'border-white/10'}
                    ${isRisk ? 'border-critical' : ''}
                  `}
                />

                {/* Event Card */}
                <Card
                  hoverEffect
                  elevation={isExpanded ? 'raised' : 'flat'}
                  onMouseEnter={() => setHoveredEventId(ev.id)}
                  onMouseLeave={() => setHoveredEventId(null)}
                  onClick={() => handleEventClick(ev)}
                  className={`
                    p-6 flex flex-col gap-4 select-none cursor-pointer transition-all duration-300 relative
                    ${isNodeActive ? 'border-accent-sage/30 bg-accent-sage-dim/5' : ''}
                  `}
                >
                  {/* Top info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-11.5 font-mono text-white/30 flex items-center gap-1.5">
                        <Calendar size={12} /> {ev.date}
                      </span>
                      <Badge variant={ev.category === 'Risk' || isRisk ? 'critical' : 'sage'}>
                        {ev.category}
                      </Badge>
                    </div>
                    
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase font-mono ${trendColors[ev.trend] || 'text-white/50 border-white/5'}`}>
                      {ev.trend}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="space-y-2">
                    <h3 className="text-15.5 font-semibold text-white/95 tracking-tight flex items-center gap-2">
                      {ev.title}
                    </h3>
                    <p className="text-13.5 text-white/45 leading-relaxed font-serif">
                      {ev.summary}
                    </p>
                  </div>

                  {/* Context Metrics Summary */}
                  <div className="flex flex-wrap justify-between items-center text-11.5 pt-1 mt-auto">
                    <span className="text-white/30 font-serif">
                      Business Impact: <strong className="text-white/60 font-sans">{ev.impact}</strong>
                    </span>
                    <span className="text-white/30 font-mono">
                      Audit Conf: <strong className="text-[#83D18B]">{ev.confidence}%</strong>
                    </span>
                  </div>

                  {/* Expanded AI Insights details panel */}
                  <AnimatePresence>
                    {(isExpanded || isHovered) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden border-t border-white/5 pt-4 mt-2 space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl space-y-1">
                            <span className="text-[9px] uppercase font-bold text-white/30 font-sans">What happened & Why?</span>
                            <p className="text-12.5 text-white/60 font-serif leading-relaxed">
                              {ev.whatHappened} {ev.why}
                            </p>
                          </div>

                          <div className="p-4 bg-[#83D18B]/5 border border-[#83D18B]/10 rounded-xl space-y-1.5">
                            <span className="text-[9px] uppercase font-bold text-[#83D18B] font-sans flex items-center gap-1">
                              <Zap size={11} /> Recommended Strategic Action
                            </span>
                             <div className="text-12.5 text-white/70 leading-relaxed text-left">
                               {renderRecommendation(ev.recommendedAction)}
                             </div>
                          </div>
                        </div>

                        <div className="text-[10px] text-white/30 flex items-center gap-1 font-mono">
                          <Info size={11} /> Clicking event highlights workspace and focuses AI consultation room query.
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
};
