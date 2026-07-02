import React, { useEffect, useState } from 'react';
import { motion as dMotion } from 'framer-motion';
import { useAppStore } from '../features/store';
import { useDemoStore } from '../features/demoStore';
import { Card, Badge, SectionHeader } from '../components/ui';
import { 
  FileSpreadsheet, 
  Calendar, 
  Activity, 
  ShieldAlert, 
  Zap, 
  Compass 
} from 'lucide-react';

export const ExecutiveBrief: React.FC = () => {
  const datasetName = useAppStore((state) => state.datasetName);
  const [greeting, setGreeting] = useState('Good Evening');
  
  const isDemoActive = useDemoStore((state) => state.isDemoActive);
  const currentStep = useDemoStore((state) => state.currentStep);

  useEffect(() => {
    const hrs = new Date().getHours();
    if (hrs < 12) setGreeting('Good Morning');
    else if (hrs < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const analyzedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 4 Elegant Key Insights
  const insights = [
    {
      title: 'Wafer Yield Optimization',
      explanation: 'Slight calibration variations detected in Fab-14 sub-assembly machines.',
      impact: 'Boosts final system validation pass rates from 98.6% to 99.4%.',
      confidence: 94,
      trend: 'Optimizing',
    },
    {
      title: 'Transpacific Sourcing Corridor',
      explanation: 'Vessel port queue latencies at Vietnam terminals remain bottlenecked.',
      impact: 'Delays final product assembly targets in North America by 8 days.',
      confidence: 89,
      trend: 'Risk Warning',
    },
    {
      title: 'Mid-Market Base Expansion',
      explanation: 'High renewal rates log active telemetry spikes in compliance verticals.',
      impact: 'Contributes an additional $3.2M ARR run-rate forecast next quarter.',
      confidence: 96,
      trend: 'Upsell Trigger',
    },
    {
      title: 'Mexico Corridor Reroute',
      explanation: 'Guadalajara production line scales up to accept excess wafer cargo.',
      impact: 'Reduces transit times to North American fulfillment nodes by 18 days.',
      confidence: 91,
      trend: 'Strategic Shift',
    }
  ];

  // Top 3 Opportunities
  const opportunities = [
    {
      title: 'Jalisco logistics nearshoring corridor',
      improvement: '+18 days lead time recovery',
      impact: '$4.2M working capital unlocked',
      priority: 'High Priority',
      reasoning: 'Rerouting electronics sub-assemblies to Mexico bypasses transpacific harbor backlogs and tariff overhead.'
    },
    {
      title: 'Frankfurt digital compliance upsell',
      improvement: '+14% account expansion rate',
      impact: '+$1.8M ARR expansion forecast',
      priority: 'Medium Priority',
      reasoning: 'Leverage our recently verified GDPR localization certification to cross-sell to security-conscious enterprise accounts.'
    },
    {
      title: 'Abatement of spot-rate transport lanes',
      improvement: '-12% cargo freight cost',
      impact: '+$840k gross margin retention',
      priority: 'Tactical Pivot',
      reasoning: 'Transitioning shipping volumes to locked contract rates shields Q3 bottom line from ocean rate volatility spikes.'
    }
  ];

  // Critical Risks
  const risks = [
    {
      title: 'Vietnamese supplier solvency constraint',
      cause: 'Severe debt-to-equity leverage warning at Hanoi Precision Parts.',
      action: 'Distribute wafer supply sourcing targets to domestic Arizona foundries.'
    },
    {
      title: 'Support CS backlog escalation',
      cause: 'Rapid mid-market onboarding rates outpace CS engineer allocations.',
      action: 'Deploy automated AI-assisted customer triage filters to lower response loops.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
  };

  return (
    <dMotion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-[1200px] mx-auto px-10 py-12 flex flex-col gap-14 text-[#F5F7FA]"
    >
      {/* Header Section */}
      <dMotion.section variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-8 border-b border-white/5 pb-8 select-none">
        <div className="space-y-3">
          <h1 className="text-36 md:text-48 font-bold text-white tracking-tight leading-none font-serif">
            {greeting}.<br />
            <span className="text-[#79D38A] italic font-normal font-serif">Your business analysis is ready.</span>
          </h1>
          <p className="text-13.5 text-white/40 max-w-lg leading-relaxed font-serif">
            Synthesized operational telemetry. Critical warning factors isolated.
          </p>
        </div>

        {/* Metadata dashboard chips */}
        <div className="flex flex-wrap gap-4 items-center shrink-0">
          <div className="flex items-center gap-2.5 px-4 py-2 bg-[#151B23] border border-white/5 rounded-xl text-12 text-white/60 shadow-lg">
            <FileSpreadsheet size={14} className="text-white/30" />
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-white/30 uppercase tracking-wider">Dataset File</span>
              <span className="font-mono text-[#79D38A] text-11 truncate max-w-[140px]">{datasetName || 'synapse_intel_matrix_q2.csv'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2 bg-[#151B23] border border-white/5 rounded-xl text-12 text-white/60 shadow-lg">
            <Calendar size={14} className="text-white/30" />
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-white/30 uppercase tracking-wider">Analyzed At</span>
              <span className="font-mono text-[#79D38A] text-11">{analyzedTime}</span>
            </div>
          </div>
        </div>
      </dMotion.section>

      {/* Main Grid: Split summary & circular health */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8">
        
        {/* Executive Summary Card */}
        <dMotion.div variants={itemVariants}>
          <Card elevation="flat" className={`p-8 h-full flex flex-col gap-6 transition-all duration-500 ${isDemoActive && currentStep === 3 ? 'ring-2 ring-[#79D38A] scale-[1.01] shadow-[0_0_25px_rgba(121,211,138,0.18)] bg-[#79D38A]/5' : ''}`}>
            <div className="flex items-center gap-2 border-b border-white/5 pb-4">
              <Activity size={14} className="text-white/40" />
              <h2 className="text-13.5 font-bold uppercase tracking-wider text-white/60">Executive Synthesis</h2>
            </div>
            
            <p className="text-15.5 text-white/80 leading-relaxed font-serif">
              Our Q2 synthesis indicates a robust operational baseline with **18% revenue run-rate expansion**, primarily supported by enterprise renewal loops. However, maritime lane congestion in Southeast Asia introduces shipping risks, locking up capital allocations. Rerouting assembly logistics to nearshore hubs is recommended.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl">
                <span className="text-[9.5px] font-bold text-[#79D38A] uppercase tracking-wider block mb-1">Top Opportunity</span>
                <span className="text-12.5 text-white/70 leading-normal font-serif">Jalisco shipping nearshore corridor recovery</span>
              </div>
              <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl">
                <span className="text-[9.5px] font-bold text-critical uppercase tracking-wider block mb-1">Critical Risk Warning</span>
                <span className="text-12.5 text-white/70 leading-normal font-serif">Vietnamese foundry solvency & shipping delay</span>
              </div>
            </div>
          </Card>
        </dMotion.div>

        {/* Circular Business Health Widget */}
        <dMotion.div variants={itemVariants}>
          <Card elevation="flat" className={`p-8 flex flex-col items-center justify-center text-center gap-6 h-full transition-all duration-500 ${isDemoActive && currentStep === 3 ? 'ring-2 ring-[#79D38A] scale-[1.01] shadow-[0_0_25px_rgba(121,211,138,0.18)] bg-[#79D38A]/5' : ''}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/30">Business Health Index</span>
            
            {/* SVG Circular indicator */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="absolute transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
                <circle cx="50" cy="50" r="40" stroke="#79D38A" strokeWidth="8" fill="transparent" 
                        strokeDasharray="251.2" strokeDashoffset="22.6" strokeLinecap="round" />
              </svg>
              <div className="flex flex-col items-center select-none">
                <span className="text-36 font-bold tracking-tight text-white">91</span>
                <span className="text-11 text-white/30 uppercase tracking-widest font-mono">/ 100</span>
              </div>
            </div>

            <p className="text-12.5 text-white/40 leading-relaxed max-w-xs font-serif italic">
              Health score is optimized by consistent wafer production outputs and low contract attrition, but shipping backlogs cap maximal returns.
            </p>
          </Card>
        </dMotion.div>
      </div>

      {/* Key Insights (2x2 Grid) */}
      <dMotion.section variants={itemVariants} className="space-y-6">
        <SectionHeader 
          label="Operational Telemetry"
          title="Key Business Insights"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((ins, idx) => (
            <Card key={idx} elevation="flat" className="p-6 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <h3 className="text-14.5 font-semibold text-white/90 tracking-tight">{ins.title}</h3>
                <span className="text-[10.5px] font-bold font-mono text-[#79D38A] bg-[#79D38A]/5 border border-[#79D38A]/10 px-2 py-0.5 rounded">
                  {ins.trend}
                </span>
              </div>
              <p className="text-13.5 text-white/50 leading-relaxed font-serif">{ins.explanation}</p>
              <div className="border-t border-white/5 pt-3 mt-auto flex justify-between items-center text-11.5">
                <span className="text-white/30 font-serif">Impact: <strong className="text-white/60 font-sans">{ins.impact}</strong></span>
                <span className="text-white/30 font-mono">Conf: <strong className="text-[#79D38A]">{ins.confidence}%</strong></span>
              </div>
            </Card>
          ))}
        </div>
      </dMotion.section>

      {/* Opportunities (1x3 Grid) */}
      <dMotion.section variants={itemVariants} className={`space-y-6 transition-all duration-500 rounded-2xl p-4 ${isDemoActive && currentStep === 3 ? 'ring-2 ring-[#79D38A] shadow-[0_0_25px_rgba(121,211,138,0.15)] bg-[#79D38A]/5' : ''}`}>
        <SectionHeader 
          label="Strategic Pipeline"
          title="Top 3 AI Opportunities"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {opportunities.map((opp, idx) => (
            <Card key={idx} elevation="flat" className="p-6 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <Badge variant="sage">{opp.priority}</Badge>
                <span className="text-11 font-mono text-[#79D38A] font-bold">{opp.improvement}</span>
              </div>
              <h3 className="text-14 font-semibold text-white/90 leading-tight tracking-tight">{opp.title}</h3>
              <p className="text-12.5 text-white/45 leading-relaxed font-serif">{opp.reasoning}</p>
              <div className="border-t border-white/5 pt-3.5 mt-auto text-12 font-medium text-white/70">
                Expected: {opp.impact}
              </div>
            </Card>
          ))}
        </div>
      </dMotion.section>

      {/* Risks & Recommendation row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
        
        {/* Critical Risks Column */}
        <dMotion.div variants={itemVariants} className={`space-y-6 transition-all duration-500 rounded-2xl p-4 ${isDemoActive && currentStep === 3 ? 'ring-2 ring-[#79D38A] shadow-[0_0_25px_rgba(121,211,138,0.15)] bg-[#79D38A]/5' : ''}`}>
          <SectionHeader 
            label="Anomalies Isolated"
            title="Critical Business Risks"
          />

          <div className="space-y-3.5">
            {risks.map((risk, idx) => (
              <Card key={idx} elevation="flat" className="p-5 flex items-start gap-4 border-l-2 border-critical/40">
                <div className="w-8 h-8 rounded-full bg-critical/10 flex items-center justify-center shrink-0">
                  <ShieldAlert size={15} className="text-critical" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-13.5 font-semibold text-white/95">{risk.title}</h4>
                  <p className="text-12 text-white/40 leading-relaxed font-serif"><strong className="text-white/60">Cause:</strong> {risk.cause}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-accent-sage mt-1 font-serif">
                    <Zap size={11} /> Suggested Action: {risk.action}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </dMotion.div>

        {/* Featured AI Recommendation Card */}
        <dMotion.div variants={itemVariants} className="space-y-6">
          <SectionHeader 
            label="Steering Directive"
            title="Featured Recommendation"
          />

          <Card elevation="flat" className="p-6 bg-accent-sage-dim border border-accent-sage-border/30 rounded-2xl flex flex-col gap-5 justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[#79D38A]">
                <Compass size={14} className="animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Strategic Directive</span>
              </div>
              <h3 className="text-16 font-semibold text-white/95 leading-snug tracking-tight">
                Migrate semiconductor assembly targets to American foundry lines
              </h3>
              <p className="text-13 text-white/60 leading-relaxed font-serif">
                Shifting raw foundry capacity allocations to domestic foundries shields operations from transpacific logistics halts and Hanoi credit warnings.
              </p>
            </div>

            <div className="border-t border-accent-sage-border/20 pt-4 flex justify-between items-center text-11.5 font-mono">
              <span className="text-white/40">Expected Outcome: <strong className="text-[#79D38A]">Lead recovery</strong></span>
              <span className="text-white/40">Timeline: <strong className="text-white/70">60 days</strong></span>
            </div>
          </Card>
        </dMotion.div>
      </div>
    </dMotion.div>
  );
};
