import React from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useAppStore } from '../features/store';
import { nodeContexts } from '../features/data';
import { DecisionGraph } from '../components/DecisionGraph';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export const ExecutiveBrief: React.FC = () => {
  const activeNodeId = useAppStore((state) => state.activeNodeId);
  const datasetName = useAppStore((state) => state.datasetName);
  
  const context = nodeContexts[activeNodeId] || nodeContexts.health;

  // Mini Sparkline Data
  const sparklineData = {
    revenue: [
      { v: 31 }, { v: 34 }, { v: 36 }, { v: 35 }, { v: 39 }, { v: 42.8 }
    ],
    efficiency: [
      { v: 12 }, { v: 10 }, { v: 9.5 }, { v: 9 }, { v: 8.4 }, { v: 8.2 }
    ],
    margin: [
      { v: 43.1 }, { v: 43.4 }, { v: 43.5 }, { v: 43.8 }, { v: 43.9 }, { v: 44.0 }
    ],
    latency: [
      { v: 22 }, { v: 24 }, { v: 28 }, { v: 30 }, { v: 31 }, { v: 32 }
    ]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-[1200px] mx-auto px-10 py-12 flex flex-col gap-14"
    >
      {/* Hero Section */}
      <motion.section variants={itemVariants} className="flex flex-col gap-5 pt-8">
        <div className="flex items-center gap-2 px-3 py-1 bg-accent-sage-dim border border-accent-sage-border rounded-full text-[10.5px] font-bold text-accent-sage tracking-wider uppercase w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-sage animate-pulse" />
          Real-time synthesis active
        </div>
        
        <h1 className="text-48 md:text-56 font-bold text-white tracking-tight leading-none font-serif">
          Here's your business,<br />
          <span className="text-accent-sage italic font-normal font-serif">intelligently understood.</span>
        </h1>
        
        <p className="text-14.5 text-white/50 max-w-[560px] leading-relaxed">
          Real-time organizational synthesis. AI maps operational anomalies against strategic objectives — giving you clarity when it matters most.
        </p>

        <div className="flex items-center gap-6 flex-wrap mt-2">
          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-card border border-white/5 rounded-lg text-12 text-white/60">
            <FileSpreadsheet size={13} className="text-white/30" />
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-white/30 uppercase tracking-wider">Active File</span>
              <span className="font-mono text-accent-sage text-11">{datasetName || 'synapse_intel_matrix_q2.csv'}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-bold text-white/30 uppercase tracking-wider">Synthesis Confidence</span>
            <div className="flex items-center gap-2.5">
              <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-accent-sage rounded-full" style={{ width: '94%' }} />
              </div>
              <span className="text-11.5 font-bold font-mono text-accent-sage">94%</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* KPI Cards Row */}
      <motion.section variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="bg-card border border-white/5 rounded-xl pt-5 px-5 flex flex-col justify-between overflow-hidden hover:border-white/10 hover:-translate-y-1 transition-all duration-300 relative group">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 block mb-3">Revenue Growth</span>
            <div className="text-28 font-bold text-accent-sage tracking-tight mb-1">+18%</div>
            <div className="text-11 text-white/40 flex items-center gap-1">
              <ArrowUpRight size={12} className="text-accent-sage" /> vs Q1 projection
            </div>
          </div>
          <div className="h-9 w-full mt-5 shrink-0 opacity-40 group-hover:opacity-60 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData.revenue}>
                <Area type="monotone" dataKey="v" stroke="#79D38A" strokeWidth={1.5} fill="rgba(121, 211, 138, 0.08)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CAC Efficiency */}
        <div className="bg-card border border-white/5 rounded-xl pt-5 px-5 flex flex-col justify-between overflow-hidden hover:border-white/10 hover:-translate-y-1 transition-all duration-300 relative group">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 block mb-3">CAC Efficiency</span>
            <div className="text-28 font-bold text-accent-sage tracking-tight mb-1">↓ 8%</div>
            <div className="text-11 text-white/40 flex items-center gap-1">
              <ArrowUpRight size={12} className="text-accent-sage" /> Cost reduction
            </div>
          </div>
          <div className="h-9 w-full mt-5 shrink-0 opacity-40 group-hover:opacity-60 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData.efficiency}>
                <Area type="monotone" dataKey="v" stroke="#79D38A" strokeWidth={1.5} fill="rgba(121, 211, 138, 0.08)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gross Margin */}
        <div className="bg-card border border-white/5 rounded-xl pt-5 px-5 flex flex-col justify-between overflow-hidden hover:border-white/10 hover:-translate-y-1 transition-all duration-300 relative group">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 block mb-3">Gross Margin</span>
            <div className="text-28 font-bold text-white tracking-tight mb-1">44.0%</div>
            <div className="text-11 text-white/40 flex items-center gap-1">
              <ArrowUpRight size={12} className="text-accent-sage" /> +0.5% margin hold
            </div>
          </div>
          <div className="h-9 w-full mt-5 shrink-0 opacity-40 group-hover:opacity-60 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData.margin}>
                <Area type="monotone" dataKey="v" stroke="#F5F7FA" strokeWidth={1.5} fill="rgba(245, 247, 250, 0.05)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transit Latency */}
        <div className="bg-card border border-white/5 rounded-xl pt-5 px-5 flex flex-col justify-between overflow-hidden hover:border-white/10 hover:-translate-y-1 transition-all duration-300 relative group">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 block mb-3">Transit Latency</span>
            <div className="text-28 font-bold text-critical tracking-tight mb-1">32d</div>
            <div className="text-11 text-white/40 flex items-center gap-1">
              <ArrowDownRight size={12} className="text-critical" /> Peak backlog
            </div>
          </div>
          <div className="h-9 w-full mt-5 shrink-0 opacity-40 group-hover:opacity-60 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData.latency}>
                <Area type="monotone" dataKey="v" stroke="#E76F51" strokeWidth={1.5} fill="rgba(231, 111, 81, 0.08)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.section>

      {/* Decision Graph Centerpiece */}
      <motion.section variants={itemVariants} className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-sage opacity-75" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent-sage">Decision Intelligence</span>
        </div>
        <h2 className="text-22 font-semibold tracking-tight text-white/95">Business Decision Graph</h2>
        <p className="text-13 text-white/40 -mt-2">
          Click nodes in the relational network to filter signals, update the brief, and reveal opportunities.
        </p>
        <DecisionGraph />
      </motion.section>

      {/* Executive Briefing Editorial */}
      <motion.section variants={itemVariants} className="bg-card border border-white/5 rounded-2xl p-10 flex flex-col gap-8 shadow-xl">
        <div className="flex justify-between items-start border-b border-white/5 pb-6 gap-8">
          <div className="space-y-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/20">Boardroom Briefing</span>
            <h2 className="text-26 font-serif text-white/90 leading-tight">
              Focus Segment: <span className="italic font-normal font-serif text-accent-sage">{context.title}</span>
            </h2>
          </div>
          <div className="text-right flex flex-col gap-0.5">
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/20">Active Node</span>
            <span className="text-12 font-bold text-accent-sage font-mono uppercase">{context.id}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.15fr] gap-12">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            <h3 className="text-17 font-serif text-white/90 leading-snug">Context Analysis</h3>
            <p className="text-15 font-serif text-white/50 leading-relaxed">
              {context.summary}
            </p>
            
            <div className="mt-2 p-5 bg-white/[0.01] border border-white/5 rounded-xl">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/20">Synthesis Confidence</span>
                <span className="text-12 font-bold text-accent-sage font-mono">94%</span>
              </div>
              <div className="w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-accent-sage rounded-full" style={{ width: '94%' }} />
              </div>
            </div>
          </div>

          {/* Right Column (Metrics & Bullet Cards) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/[0.01] border border-white/5 rounded-xl p-5 flex flex-col gap-1.5">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider">{context.metricLabel}</span>
              <div className="text-26 font-bold text-white/90 tracking-tight">{context.metric}</div>
              <span className="text-[10px] text-white/20 leading-tight mt-1">Real-time telemetry snapshot</span>
            </div>

            <div className="bg-white/[0.01] border border-white/5 rounded-xl p-5 flex flex-col gap-1">
              <span className="text-[9px] font-bold text-accent-sage uppercase tracking-wider">Top Opportunity</span>
              <p className="text-12.5 text-white/70 leading-relaxed font-medium mt-1">{context.opportunity}</p>
            </div>

            <div className="bg-white/[0.01] border border-white/5 rounded-xl p-5 flex flex-col gap-1">
              <span className="text-[9px] font-bold text-critical uppercase tracking-wider">Critical Risk</span>
              <p className="text-12.5 text-white/70 leading-relaxed font-medium mt-1">{context.risk}</p>
            </div>

            <div className="bg-white/[0.01] border border-white/5 rounded-xl p-5 flex flex-col gap-1">
              <span className="text-[9px] font-bold text-accent-sage uppercase tracking-wider">AI Strategy Directive</span>
              <p className="text-12 text-white/50 italic font-serif leading-relaxed mt-1">
                "{context.recommendation}"
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Business Timeline */}
      <motion.section variants={itemVariants} className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-sage opacity-75" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent-sage">Business Timeline</span>
        </div>
        <h2 className="text-22 font-semibold tracking-tight text-white/95 -mt-2">Strategic Progression Pathway</h2>
        
        <div className="flex flex-col relative pl-9 max-w-2xl border-l border-white/5 ml-1.5 mt-4 space-y-8">
          <div className="relative">
            <span className="absolute -left-[41.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent-sage border-2 border-background" />
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-1">Day 1 — Current State</span>
            <h3 className="text-14.5 font-semibold text-white/90 leading-tight">Diagnostic Intake Complete</h3>
            <p className="text-13 text-white/45 mt-1 leading-relaxed">
              Intake Well processes 18,240 records. 14 critical anomalies isolated. Port delays in Southeast Asia flag shipping queues at 32 days.
            </p>
          </div>

          <div className="relative">
            <span className="absolute -left-[41.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-critical border-2 border-background shadow-[0_0_0_3px_rgba(231,111,81,0.15)]" />
            <span className="text-[10px] font-bold text-critical uppercase tracking-widest block mb-1">Day 15 — Projected Stress Point</span>
            <h3 className="text-14.5 font-semibold text-white/90 leading-tight">Hanoi Supplier Solvency Alert</h3>
            <p className="text-13 text-white/45 mt-1 leading-relaxed">
              Predictive models alert to liquidity friction points at Hanoi Precision Parts. Re-allocation or Mexican corridors recommended.
            </p>
          </div>

          <div className="relative">
            <span className="absolute -left-[41.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-white/20 border-2 border-background" />
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-1">Day 30 — Pivot point</span>
            <h3 className="text-14.5 font-semibold text-white/90 leading-tight">Tactical Redirection Corridor</h3>
            <p className="text-13 text-white/45 mt-1 leading-relaxed">
              Jalisco corridor capacity scales to 72% safety volume. Laredo pre-clearance corridor bypasses sea cargo logjams.
            </p>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};
