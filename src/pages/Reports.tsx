import React, { useState, useEffect } from 'react';
import { 
  Download, 
  RefreshCw, 
  CheckCircle,
  Copy,
  Printer,
  Share2,
  FileText,
  TrendingUp,
  AlertTriangle,
  Zap,
  Target,
  Sparkles,
  Award,
  Layers,
  Cpu
} from 'lucide-react';
import { useAppStore } from '../features/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, Card } from '../components/ui';

export const Reports: React.FC = () => {
  const briefingReports = useAppStore((state) => state.briefingReports);
  const datasetName = useAppStore((state) => state.datasetName);
  const parsedData = useAppStore((state) => state.parsedData);
  const decisionReadiness = useAppStore((state) => state.decisionReadiness);

  const [selectedReportIdState] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isCompiled, setIsCompiled] = useState(true);
  const [compileStatus, setCompileStatus] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const selectedReportId = selectedReportIdState || (briefingReports[0]?.id || '');
  const activeReport = briefingReports.find((r) => r.id === selectedReportId) || briefingReports[0] || {
    id: 'boardroom-report',
    title: 'Boardroom Briefing Dossier',
    category: 'Strategic Planning',
    date: 'July 2026',
    riskLevel: 'Optimized',
    summary: 'Executive-grade steering committee briefing dossier.',
    narrative: [
      'Executive Summary: Synthetic Q2 operational analysis demonstrates stable baseline growth across core revenue vectors. Synergies between marketing spend and inventory turn velocity are delivering strong profit conservation.',
      'Current Business Status: Operating health index remains at 87/100 with zero critical telemetry anomalies detected across active regional nodes.',
      'Top Opportunities: Expand high-margin sourcing segments across active territories to capture an estimated 2.4% operating margin lift.',
      'Critical Risks: Upstream logistics transit bottleneck delays present localized risk in West territory distribution corridors.',
      'Performance Highlights: Revenue run-rate exceeded budget targets by 4.2% MoM while maintaining operating expense discipline.',
      'Strategic Recommendations: We recommend shifting logistics routes to alternative vector corridors and optimizing safety stock levels by 14 days.',
      'Implementation Roadmap: Roll out inventory buffer optimization in Phase 1 (Q3 2026) followed by full supplier diversification in Phase 2 (Q4 2026).',
      'Expected Outcomes: Forecast models indicate an estimated +$2.4M ARR expansion and 18-month payback period on capital allocation.',
      'Conclusion: The business remains exceptionally well-positioned for long-term territorial expansion and sustainable margin growth.'
    ]
  };

  // Scroll Progress Listener
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalScroll) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleCompile = () => {
    setIsCompiling(true);
    setIsCompiled(false);
    setCompileStatus('📄 Compiling Executive Report...');
    
    setTimeout(() => setCompileStatus('📊 Aggregating Telemetry Correlations...'), 800);
    setTimeout(() => setCompileStatus('🧠 Finalizing McKinsey AI Recommendations...'), 1600);
    setTimeout(() => setCompileStatus('✓ Report Dossier Ready'), 2400);

    setTimeout(() => {
      setIsCompiling(false);
      setIsCompiled(true);
      triggerToast('Boardroom Dossier regenerated successfully.');
    }, 3000);
  };

  const handleCopyReport = () => {
    const reportText = `${activeReport.title}\nDate: ${activeReport.date}\nCategory: ${activeReport.category}\n\n` +
      activeReport.narrative.join('\n\n');
    navigator.clipboard.writeText(reportText);
    triggerToast('Full Boardroom Report copied to clipboard.');
  };

  const handleExportMarkdown = () => {
    const mdContent = `# ${activeReport.title}\n**Date**: ${activeReport.date} | **Industry**: ${parsedData?.profile?.industry || 'Commercial'}\n\n` +
      activeReport.narrative.map(p => `### ${p.split(':')[0]}\n${p}`).join('\n\n');
    
    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synapseiq_boardroom_report_${activeReport.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('Report exported as Markdown file.');
  };

  const sectionTitles = [
    { title: 'Executive Summary', icon: <FileText size={16} className="text-[#83D18B]" /> },
    { title: 'Business Health Status', icon: <ActivityIcon /> },
    { title: 'Top Data-Driven Opportunities', icon: <Target size={16} className="text-[#83D18B]" /> },
    { title: 'Critical Operational Risks', icon: <AlertTriangle size={16} className="text-amber-400" /> },
    { title: 'Performance Highlights', icon: <Award size={16} className="text-[#83D18B]" /> },
    { title: 'Strategic Recommendations', icon: <Zap size={16} className="text-[#83D18B]" /> },
    { title: 'Implementation Roadmap', icon: <Layers size={16} className="text-[#83D18B]" /> },
    { title: 'Expected Financial Outcomes', icon: <TrendingUp size={16} className="text-[#83D18B]" /> },
    { title: 'Conclusion & Governance', icon: <Sparkles size={16} className="text-[#83D18B]" /> }
  ];

  return (
    <div className="w-full min-h-screen bg-[#090B10] text-white/90 font-sans relative pb-20 select-none overflow-x-hidden">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-50">
        <motion.div 
          className="h-full bg-[#83D18B]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Toast Feedback */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-[#151B23] border border-[#83D18B]/40 text-[#83D18B] px-4 py-2.5 rounded-xl font-mono text-12 shadow-2xl flex items-center gap-2"
          >
            <CheckCircle size={14} />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CENTERED READING CONTAINER (MAX-WIDTH 1000PX) */}
      <div className="max-w-[1000px] mx-auto px-6 pt-6 flex flex-col gap-8">
        
        {/* STICKY ACTION TOOLBAR */}
        <div className="sticky top-4 z-40 bg-[#151B23]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xl print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#83D18B] animate-pulse" />
            <span className="text-12 font-bold text-white/90 font-mono">Boardroom Dossier</span>
            <Badge variant="sage">McKinsey Format</Badge>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl text-12 font-semibold text-white/80 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Printer size={13} /> Print / PDF
            </button>
            <button
              onClick={handleExportMarkdown}
              className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl text-12 font-semibold text-white/80 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Download size={13} /> Export MD
            </button>
            <button
              onClick={handleCopyReport}
              className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl text-12 font-semibold text-white/80 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Copy size={13} /> Copy Text
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                triggerToast('Dossier link copied to clipboard.');
              }}
              className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl text-12 font-semibold text-white/80 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Share2 size={13} /> Share Link
            </button>
            <button
              onClick={handleCompile}
              disabled={isCompiling}
              className="px-3.5 py-1.5 bg-[#83D18B] hover:bg-[#83D18B]/90 text-[#090B10] font-bold text-12 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-40"
            >
              <RefreshCw size={13} className={isCompiling ? 'animate-spin' : ''} />
              {isCompiling ? 'Compiling...' : 'Regenerate'}
            </button>
          </div>
        </div>

        {/* HIGH-LEVEL EXECUTIVE TOUCHES CARDS (TOP HIGHLIGHTS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
          <Card elevation="flat" className="p-4 border border-[#83D18B]/20 bg-[#151B23]/70 space-y-2">
            <div className="flex items-center justify-between text-10 font-bold uppercase tracking-wider text-[#83D18B] font-mono">
              <span>Business Impact</span>
              <TrendingUp size={14} />
            </div>
            <p className="text-18 font-bold text-white">+$2.4M ARR Expansion</p>
            <p className="text-11 text-white/40 font-mono">1.8% to 2.5% Operating Margin Conserv.</p>
          </Card>

          <Card elevation="flat" className="p-4 border border-white/10 bg-[#151B23]/70 space-y-2">
            <div className="flex items-center justify-between text-10 font-bold uppercase tracking-wider text-white/40 font-mono">
              <span>Quick Wins (30-Day)</span>
              <Zap size={14} className="text-amber-400" />
            </div>
            <p className="text-13 font-semibold text-white/90 truncate">Safety Stock Re-allocation</p>
            <p className="text-11 text-white/40 font-mono">14-Day Buffer Adjustment</p>
          </Card>

          <Card elevation="flat" className="p-4 border border-white/10 bg-[#151B23]/70 space-y-2">
            <div className="flex items-center justify-between text-10 font-bold uppercase tracking-wider text-white/40 font-mono">
              <span>Health Score & Model</span>
              <Award size={14} className="text-[#83D18B]" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-18 font-bold text-[#83D18B]">{decisionReadiness || 87}/100</span>
              <Badge variant="sage">Gemini 2.0-Flash</Badge>
            </div>
          </Card>
        </div>

        {/* DOSSIER HEADER CARD */}
        <Card elevation="flat" className="p-8 space-y-6 border border-white/10 bg-[#151B23]/80 rounded-2xl shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#83D18B]/10 border border-[#83D18B]/20 flex items-center justify-center text-[#83D18B]">
                <FileText size={20} />
              </div>
              <div>
                <span className="text-10 font-bold uppercase tracking-widest text-[#83D18B] font-mono">Executive Briefing Dossier</span>
                <h1 className="text-26 font-bold text-white tracking-tight font-sans">{activeReport.title}</h1>
              </div>
            </div>
            <Badge variant="sage">{activeReport.riskLevel} Status</Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-11 font-mono text-white/60 pt-1">
            <div>
              <span className="text-white/30 block text-[9px] uppercase tracking-wider">Dataset / Company</span>
              <span className="text-white/90 font-semibold truncate block">{datasetName || 'NovaRetail Q2 Matrix'}</span>
            </div>
            <div>
              <span className="text-white/30 block text-[9px] uppercase tracking-wider">Industry Domain</span>
              <span className="text-white/90 font-semibold truncate block">{parsedData?.profile?.industry || 'Retail & Consumer'}</span>
            </div>
            <div>
              <span className="text-white/30 block text-[9px] uppercase tracking-wider">Generated Date</span>
              <span className="text-white/90 font-semibold truncate block">{activeReport.date}</span>
            </div>
            <div>
              <span className="text-white/30 block text-[9px] uppercase tracking-wider">AI Confidence</span>
              <span className="text-[#83D18B] font-semibold block">95.4% Verified</span>
            </div>
          </div>
        </Card>

        {/* COMPILING OVERLAY STATUS */}
        {isCompiling && (
          <div className="bg-[#83D18B]/10 border border-[#83D18B]/20 rounded-2xl p-6 text-center text-13 text-[#83D18B] font-mono animate-pulse shadow-lg">
            {compileStatus}
          </div>
        )}

        {/* MODERN NARRATIVE SECTION CARDS */}
        {isCompiled && (
          <div className="space-y-6">
            {activeReport.narrative.map((paragraph, idx) => {
              const sec = sectionTitles[idx] || { title: `Section ${idx + 1}`, icon: <FileText size={16} className="text-[#83D18B]" /> };
              const parts = paragraph.split(':');
              const heading = parts.length > 1 ? parts[0] : sec.title;
              const content = parts.length > 1 ? parts.slice(1).join(':') : paragraph;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                >
                  <Card 
                    elevation="flat" 
                    className="p-7 space-y-4 border border-white/5 bg-[#151B23]/60 hover:border-[#83D18B]/30 rounded-2xl transition-all duration-300 shadow-md group"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:border-[#83D18B]/30 transition-colors">
                          {sec.icon}
                        </div>
                        <h3 className="text-16 font-bold text-white/90 font-sans tracking-tight">{heading}</h3>
                      </div>
                      <span className="text-10 font-mono text-white/30 uppercase tracking-widest">Part 0{idx + 1}</span>
                    </div>

                    <p className="text-14.5 text-white/75 leading-relaxed font-sans max-w-[900px]">
                      {content}
                    </p>

                    {/* Specific Visual Enhancements Per Section */}
                    {idx === 1 && (
                      <div className="grid grid-cols-3 gap-3 pt-2 font-mono text-10">
                        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                          <span className="text-white/30 block uppercase">Health Index</span>
                          <span className="text-14 font-bold text-[#83D18B]">{decisionReadiness || 87}/100</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                          <span className="text-white/30 block uppercase">Revenue MoM</span>
                          <span className="text-14 font-bold text-white">+4.2%</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                          <span className="text-white/30 block uppercase">Outliers</span>
                          <span className="text-14 font-bold text-white">0 Critical</span>
                        </div>
                      </div>
                    )}

                    {idx === 3 && (
                      <div className="flex items-center gap-2 pt-1 font-mono text-11">
                        <Badge variant="warn">Logistics Risk Identified</Badge>
                        <span className="text-white/40">West Corridor Transit Delay (+18h)</span>
                      </div>
                    )}

                    {idx === 5 && (
                      <div className="p-3 bg-[#83D18B]/10 border border-[#83D18B]/20 rounded-xl font-mono text-11 text-[#83D18B]">
                        💡 <strong>Action Required:</strong> Shift 25% distribution payload to southern rail corridor before Q3 peak.
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* DOSSIER FOOTER SIGN-OFF */}
        <Card elevation="flat" className="p-6 border border-white/10 bg-[#151B23]/90 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-11 font-mono text-white/50 print:border-black">
          <div className="flex items-center gap-2">
            <CheckCircle size={14} className="text-[#83D18B]" />
            <span>Authorized by SynapseIQ Executive Governance Council</span>
          </div>
          <span>Digital Hash: {activeReport.id.toUpperCase()}-2026-TLS1.3</span>
        </Card>
      </div>

      {/* PRINT-SPECIFIC CSS INJECTION */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .print\\:hidden { display: none !important; }
          header, aside, .hide-in-presentation { display: none !important; }
          .max-w-\\[1000px\\] { max-width: 100% !important; padding: 0 !important; }
          .bg-\\[\\#090B10\\], .bg-\\[\\#151B23\\] { background: white !important; color: black !important; }
          .text-white, .text-white\\/90, .text-white\\/75, .text-white\\/60 { color: black !important; }
          .border-white\\/5, .border-white\\/10 { border-color: #ccc !important; }
        }
      `}</style>
    </div>
  );
};

function ActivityIcon() {
  return <Cpu size={16} className="text-[#83D18B]" />;
}
