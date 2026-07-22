import React, { useState } from 'react';
import { 
  Download, 
  RefreshCw, 
  Calendar, 
  Tag, 
  CheckCircle,
} from 'lucide-react';
import { useAppStore } from '../features/store';
import { motion } from 'framer-motion';

export const Reports: React.FC = () => {
  const briefingReports = useAppStore((state) => state.briefingReports);
  const [selectedReportIdState, setSelectedReportIdState] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isCompiled, setIsCompiled] = useState(false);
  const [compileStatus, setCompileStatus] = useState('');

  const selectedReportId = selectedReportIdState || (briefingReports[0]?.id || '');
  const activeReport = briefingReports.find((r) => r.id === selectedReportId) || briefingReports[0] || {
    id: '',
    title: 'Executive Intelligence Dossier',
    category: 'Strategic Planning',
    date: 'July 2026',
    riskLevel: 'Optimized',
    summary: 'Executive-grade circulation brief.',
    narrative: [
      'Upload a business dataset to begin generating executive insights.'
    ]
  };

  const handleCompile = () => {
    setIsCompiling(true);
    setIsCompiled(false);
    setCompileStatus('📄 Compiling Executive Report...');
    
    setTimeout(() => {
      setCompileStatus('📊 Aggregating Business Insights...');
    }, 800);

    setTimeout(() => {
      setCompileStatus('🧠 Finalizing AI Recommendations...');
    }, 1600);

    setTimeout(() => {
      setCompileStatus('✓ Report Ready');
    }, 2400);

    setTimeout(() => {
      setIsCompiling(false);
      setIsCompiled(true);
    }, 3200);
  };

  React.useEffect(() => {
    setIsCompiled(false);
  }, [selectedReportId]);

  return (
    <div className="max-w-[1200px] mx-auto px-10 py-12 flex flex-col gap-10">
      {/* Title */}
      <div className="flex flex-col gap-3 pt-8">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-sage opacity-75" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent-sage">Circulation Desk</span>
        </div>
        <h1 className="text-32 font-semibold tracking-tight text-white/95">Boardroom Report</h1>
        <p className="text-14 text-white/50 -mt-2">
          Ready for investor and steering committee distribution. Compile executive-grade analysis summaries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
        {/* Left: Reports list */}
        <div className="flex flex-col gap-3.5">
          <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest px-2">Select Briefing Dossier</span>
          
          <div className="space-y-2">
            {briefingReports.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReportIdState(report.id)}
                className={`
                  w-full text-left p-5 rounded-xl border transition-all duration-300 flex flex-col gap-2.5 bg-card
                  ${selectedReportId === report.id 
                    ? 'border-accent-sage/35 bg-accent-sage-dim shadow-lg' 
                    : 'border-white/5 hover:border-white/10 hover:bg-white/[0.01]'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] font-bold text-white/35 uppercase tracking-wider">{report.category}</span>
                  <span className={`
                    text-[9px] font-bold px-2 py-0.5 rounded uppercase
                    ${report.riskLevel === 'Critical' ? 'bg-critical-dim text-critical' : report.riskLevel === 'High' ? 'bg-warn-dim text-warn' : 'bg-accent-sage-dim text-accent-sage'}
                  `}>
                    {report.riskLevel}
                  </span>
                </div>
                <h3 className="text-13.5 font-semibold text-white/90 leading-tight">{report.title}</h3>
                <p className="text-11.5 text-white/40 truncate w-full">{report.summary}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Detailed layout view */}
        <div className="bg-card border border-white/5 rounded-2xl p-10 flex flex-col gap-8 shadow-xl">
          {/* Metadata */}
          <div className="flex flex-col gap-3 border-b border-white/5 pb-6">
            <div className="flex items-center gap-4 text-11 text-white/30 font-mono">
              <span className="flex items-center gap-1.5"><Calendar size={12} /> {activeReport.date}</span>
              <span className="flex items-center gap-1.5"><Tag size={12} /> {activeReport.category}</span>
            </div>
            <h2 className="text-24 font-serif text-white/90 leading-snug font-medium">
              {activeReport.title}
            </h2>
          </div>

          {isCompiled && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#83D18B]/10 border border-[#83D18B]/20 rounded-xl p-4.5 flex items-center justify-between gap-4 mt-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#83D18B]/20 flex items-center justify-center text-[#83D18B]">
                  <CheckCircle size={18} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-13 font-bold text-white/90 font-sans">Report Compiled successfully</span>
                  <span className="text-11 text-white/40 font-serif">Saved to your strategic briefings folder.</span>
                </div>
              </div>
              <button 
                onClick={() => window.print()}
                className="px-4 py-1.5 bg-[#83D18B] hover:bg-[#83D18B]/95 text-[#090B10] font-bold text-11 rounded-lg transition-all font-sans cursor-pointer active:scale-95"
              >
                Print / Export Briefing
              </button>
            </motion.div>
          )}

          {/* Narrative paragraphs */}
          <div className="space-y-6 flex-1">
            {!isCompiled ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01] my-4 min-h-[300px]">
                <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4 text-[#83D18B]">
                  <Download size={18} className="animate-bounce" />
                </div>
                <h3 className="text-15 font-bold text-white/95 mb-1.5 font-sans">No report generated</h3>
                <p className="text-12.5 text-[#83D18B] mb-2 font-serif">
                  Create a boardroom-ready report in one click.
                </p>
                <p className="text-11.5 text-white/35 mb-6 font-sans max-w-sm">
                  Click 'Compile Board Briefing' below to generate your executive analytical dossier.
                </p>
                <button
                  onClick={handleCompile}
                  disabled={isCompiling}
                  className="px-5 py-2.5 bg-accent-sage hover:bg-accent-sage/90 text-background font-bold text-12 rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  <RefreshCw size={13} className={isCompiling ? 'animate-spin' : ''} />
                  Compile Report Now
                </button>
              </div>
            ) : (
              activeReport.narrative.map((paragraph, idx) => (
                <p 
                  key={idx} 
                  className={`text-15 text-white/60 leading-relaxed font-serif ${idx === 0 ? 'first-letter:text-48 first-letter:text-accent-sage first-letter:font-serif first-letter:mr-2.5 first-letter:float-left first-letter:leading-none' : ''}`}
                >
                  {paragraph}
                </p>
              ))
            )}
          </div>

          {/* Action footer */}
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <div className="flex items-center gap-2 text-11.5 text-white/40 font-serif">
              <CheckCircle size={12.5} className="text-accent-sage" />
              <span>Complies with corporate digital compliance protocols.</span>
            </div>

            <div className="flex gap-2 w-full sm:w-auto shrink-0">
              <button 
                onClick={handleCompile}
                disabled={isCompiling}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-accent-sage text-background font-semibold text-12 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 disabled:pointer-events-none"
              >
                {isCompiling ? <RefreshCw size={13} className="animate-spin" /> : <Download size={13} />}
                {isCompiling ? 'Compiling...' : 'Compile Board Briefing'}
              </button>
            </div>
          </div>

          {isCompiling && (
            <div className="bg-white/[0.01] border border-white/5 rounded-xl p-4 text-center text-12 text-white/50 animate-pulse mt-2 italic font-serif">
              {compileStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
