import React, { useEffect, useState } from 'react';
import { motion as dMotion } from 'framer-motion';
import { useAppStore } from '../features/store';
import { useDemoStore } from '../features/demoStore';
import { Card, Badge, SectionHeader } from '../components/ui';
import { 
  FileSpreadsheet, 
  Calendar, 
  Activity, 
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
            <span className="text-[#83D18B] italic font-normal font-serif">Your business analysis is ready.</span>
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
              <span className="font-mono text-[#83D18B] text-11 truncate max-w-[140px]">{datasetName || 'synapse_intel_matrix_q2.csv'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2 bg-[#151B23] border border-white/5 rounded-xl text-12 text-white/60 shadow-lg">
            <Calendar size={14} className="text-white/30" />
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-white/30 uppercase tracking-wider">Analyzed At</span>
              <span className="font-mono text-[#83D18B] text-11">{analyzedTime}</span>
            </div>
          </div>
        </div>
      </dMotion.section>

      {/* Main Grid: Split summary & circular health */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8">
        
        {/* Executive Summary Card */}
        <dMotion.div variants={itemVariants}>
          <Card elevation="flat" className={`p-8 h-full flex flex-col gap-6 transition-all duration-500 ${isDemoActive && currentStep === 3 ? 'ring-2 ring-[#83D18B] scale-[1.01] shadow-[0_0_25px_rgba(131,209,139,0.18)] bg-[#83D18B]/5' : ''}`}>
            <div className="flex items-center gap-2 border-b border-white/5 pb-4">
              <Activity size={14} className="text-white/40" />
              <h2 className="text-13.5 font-bold uppercase tracking-wider text-white/60">Executive Synthesis</h2>
            </div>
            
            <p className="text-17 text-white/90 leading-relaxed font-serif">
              Our Q2 synthesis indicates a robust operational baseline with **18% revenue run-rate expansion**, primarily supported by enterprise renewal loops. However, maritime lane congestion in Southeast Asia introduces shipping risks, locking up capital allocations. Rerouting assembly logistics to nearshore hubs is recommended.
            </p>

            <p className="text-13.5 text-white/45 leading-relaxed font-serif -mt-2">
              Introduction of Arizona wafer supply corridors acts as an active risk shield, stabilizing the composite solvency score.
            </p>
          </Card>
        </dMotion.div>

        {/* Circular Business Health Widget */}
        <dMotion.div variants={itemVariants}>
          <Card elevation="flat" className={`p-8 flex flex-col items-center justify-center text-center gap-6 h-full transition-all duration-500 ${isDemoActive && currentStep === 3 ? 'ring-2 ring-[#83D18B] scale-[1.01] shadow-[0_0_25px_rgba(131,209,139,0.18)] bg-[#83D18B]/5' : ''}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 font-sans">Business Health Index</span>
            
            {/* SVG Circular indicator */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="absolute transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
                <circle cx="50" cy="50" r="40" stroke="#83D18B" strokeWidth="8" fill="transparent" 
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

      {/* CEO Briefing Column: Opportunity, Risk, Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Biggest Opportunity */}
        <dMotion.div variants={itemVariants} className={`space-y-4 transition-all duration-500 rounded-2xl p-2 ${isDemoActive && currentStep === 3 ? 'ring-2 ring-[#83D18B] shadow-[0_0_25px_rgba(131,209,139,0.15)] bg-[#83D18B]/5 border-transparent' : ''}`}>
          <SectionHeader 
            label="Strategic Pipeline"
            title="Biggest Opportunity"
          />
          <Card elevation="flat" className="p-6 flex flex-col gap-4 min-h-[220px]">
            <div className="flex justify-between items-start">
              <Badge variant="sage">High Priority</Badge>
              <span className="text-11 font-mono text-[#83D18B] font-bold">+18% Lead Time</span>
            </div>
            <h3 className="text-15 font-semibold text-white/90 leading-snug tracking-tight">Guadalajara Sourcing Pivot</h3>
            <p className="text-13 text-white/45 leading-relaxed font-serif">
              Transitioning 25% of microcontroller logistics volumes overland through nearshore corridors recovers lead times to 14 days.
            </p>
            <div className="border-t border-white/5 pt-3.5 mt-auto text-12 font-medium text-[#83D18B] font-sans">
              Projected ROI: 18.2% expansion
            </div>
          </Card>
        </dMotion.div>

        {/* Biggest Risk */}
        <dMotion.div variants={itemVariants} className={`space-y-4 transition-all duration-500 rounded-2xl p-2 ${isDemoActive && currentStep === 3 ? 'ring-2 ring-[#83D18B] shadow-[0_0_25px_rgba(131,209,139,0.15)] bg-[#83D18B]/5 border-transparent' : ''}`}>
          <SectionHeader 
            label="Anomalies Isolated"
            title="Biggest Risk"
          />
          <Card elevation="flat" className="p-6 flex flex-col gap-4 border-l-2 border-critical/55 min-h-[220px]">
            <div className="flex justify-between items-start">
              <Badge variant="critical">Critical Risk</Badge>
              <span className="text-11 font-mono text-critical font-bold">32d Latency</span>
            </div>
            <h3 className="text-15 font-semibold text-white/90 leading-snug tracking-tight">Vietnam Maritime Bottlenecks</h3>
            <p className="text-13 text-white/45 leading-relaxed font-serif">
              Peak port queue constraints delay microcontroller components from Taiwan, risking factory assembly shut downs within 14 days.
            </p>
            <div className="border-t border-white/5 pt-3.5 mt-auto text-12 font-medium text-critical/80 font-sans">
              Exposure: $4.2M Capital Lock
            </div>
          </Card>
        </dMotion.div>

        {/* AI Recommendation */}
        <dMotion.div variants={itemVariants} className={`space-y-4 transition-all duration-500 rounded-2xl p-2 ${isDemoActive && currentStep === 3 ? 'ring-2 ring-[#83D18B] shadow-[0_0_25px_rgba(131,209,139,0.15)] bg-[#83D18B]/5 border-transparent' : ''}`}>
          <SectionHeader 
            label="Steering Directive"
            title="AI Recommendation"
          />
          <Card elevation="flat" className="p-6 bg-accent-sage-dim border border-accent-sage-border/30 rounded-2xl flex flex-col gap-4 min-h-[220px] justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[#83D18B]">
                <Compass size={14} className="animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Strategic Directive</span>
              </div>
              <h3 className="text-14.5 font-semibold text-white/95 leading-snug tracking-tight">
                Establish Arizona wafer corridors
              </h3>
              <p className="text-12.5 text-white/55 leading-relaxed font-serif">
                Scaling buffer safety stocks to 60 days near domestic foundries insulates lines from transpacific logistics bottlenecks.
              </p>
            </div>

            <div className="border-t border-accent-sage-border/20 pt-3 flex justify-between items-center text-11.5 font-mono">
              <span className="text-white/45">Outcome: <strong className="text-[#83D18B]">Lead recovery</strong></span>
              <span className="text-white/45">Timeline: <strong className="text-white/70">60 days</strong></span>
            </div>
          </Card>
        </dMotion.div>

      </div>
    </dMotion.div>
  );
};
