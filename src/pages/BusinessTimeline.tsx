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

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  summary: string;
  impact: string;
  confidence: number;
  trend: string;
  category: 'Revenue' | 'Marketing' | 'Inventory' | 'Customers' | 'Operations' | 'Risk' | 'Growth';
  whatHappened: string;
  why: string;
  recommendedAction: string;
  targetNodeId: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    id: 'ev-1',
    date: 'June 25, 2026',
    title: 'Revenue run-rate expanded by 18% YoY',
    summary: 'Q2 enterprise subscription contract conversions exceed target expectations by $3.2M ARR, led by security compliant sales wins in Western Europe.',
    impact: '+$3.2M ARR expansion run-rate',
    confidence: 96,
    trend: 'Optimizing',
    category: 'Revenue',
    whatHappened: 'Subscriptions expanded due to local EU data compliance certifications.',
    why: 'Enterprise accounts in Frankfurt and Paris convert at double the historical baseline.',
    recommendedAction: 'Divert marketing lead generation budget to high-intent European accounts.',
    targetNodeId: 'revenue'
  },
  {
    id: 'ev-2',
    date: 'June 18, 2026',
    title: 'Account-Based Marketing (ABM) launch',
    summary: 'Targeted campaign outreach launched across Fortune 500 manufacturing accounts to combat developer CPC search keyword inflation.',
    impact: '↓ 8% Customer Acquisition Cost (CAC)',
    confidence: 93,
    trend: 'High ROI',
    category: 'Marketing',
    whatHappened: 'Outreach campaigns deployed to bypass developer keyword bid wars.',
    why: 'Niche account-based targeting captures high-intent buyers directly.',
    recommendedAction: 'Add the top 200 mid-market manufacturing logos to the outreach segment.',
    targetNodeId: 'marketing'
  },
  {
    id: 'ev-3',
    date: 'June 10, 2026',
    title: 'Vietnam MCU components supply strain',
    summary: 'Upstream port transit backlogs at Ho Chi Minh docks delay semiconductor delivery, shrinking Jalisco assembly safety stock holding down to 14 days.',
    impact: '+4 days transpacific shipping queue latency',
    confidence: 92,
    trend: 'Risk Alert',
    category: 'Inventory',
    whatHappened: 'MCU sub-assemblies delayed due to transpacific vessel backlogs.',
    why: 'High port utilization and carrier container imbalances at Ho Chi Minh docks.',
    recommendedAction: 'Approve wafer allocation shifting to domestic Arizona foundries.',
    targetNodeId: 'inventory'
  },
  {
    id: 'ev-4',
    date: 'May 28, 2026',
    title: 'Support SLA compliance compression',
    summary: 'Customer success onboarding queues briefly bottleneck under rapid subscription scaling, slipping composite NPS down to 72.',
    impact: '-2.4 hours support SLA response latency',
    confidence: 89,
    trend: 'SLA Strain',
    category: 'Customers',
    whatHappened: 'Support queue response delays logged during peak logo conversions.',
    why: 'Customer success staffing ratios failed to match onboarding volume spikes.',
    recommendedAction: 'Deploy automated AI-assisted ticket triage filters to lower response loops.',
    targetNodeId: 'customers'
  },
  {
    id: 'ev-5',
    date: 'May 14, 2026',
    title: 'GDPR compliance validation in Frankfurt',
    summary: 'Frankfurt cloud node installations complete, enabling localized data hosting compliance certificates.',
    impact: 'Unlocks $12M target pipeline in Central Europe',
    confidence: 95,
    trend: 'Growth Trigger',
    category: 'Growth',
    whatHappened: 'Local EU hosting capabilities initialized.',
    why: 'Regulatory boundaries require localized data residence.',
    recommendedAction: 'Publish success dossier for marketing outreach campaigns.',
    targetNodeId: 'growth'
  },
  {
    id: 'ev-6',
    date: 'May 02, 2026',
    title: 'Guadalajara capacity forecast index update',
    summary: 'Mexico assembly line models simulated at 72% capacity scaling potential.',
    impact: 'Reduces shipping latency from 32 to 14 days',
    confidence: 91,
    trend: 'Optimized',
    category: 'Operations',
    whatHappened: 'Procurement models updated to represent nearshoring pivots.',
    why: 'Overland corridor clears customs 2.4 days faster than marine lanes.',
    recommendedAction: 'Approve Jalisco supply chain corridor transition.',
    targetNodeId: 'operations'
  }
];

export const BusinessTimeline: React.FC = () => {
  const setCopilotContextNodeId = useAppStore((state) => state.setCopilotContextNodeId);
  const activeNodeId = useAppStore((state) => state.activeNodeId);

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
  }, [activeNodeId]);

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
    <div className="max-w-[1200px] mx-auto px-10 py-12 flex flex-col gap-10 text-[#F5F7FA]">
      
      {/* Title Header */}
      <div className="flex flex-col gap-3 pt-8 select-none">
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
          {filteredEvents.map((ev, idx) => {
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
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
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
                      Audit Conf: <strong className="text-[#79D38A]">{ev.confidence}%</strong>
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

                          <div className="p-4 bg-[#79D38A]/5 border border-[#79D38A]/10 rounded-xl space-y-1.5">
                            <span className="text-[9px] uppercase font-bold text-[#79D38A] font-sans flex items-center gap-1">
                              <Zap size={11} /> Recommended Strategic Action
                            </span>
                            <p className="text-12.5 text-white/70 font-serif leading-relaxed">
                              "{ev.recommendedAction}"
                            </p>
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
