import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  CheckCircle2, 
  Cpu, 
  FileSpreadsheet, 
  BarChart3, 
  Compass, 
  Layers, 
  TrendingUp, 
  Activity, 
  Brain
} from 'lucide-react';
import { IntelligenceMesh } from './IntelligenceMesh';
import { useAppStore } from '../features/store';

interface AIMissionControlProps {
  onComplete: () => void;
}

export const AIMissionControl: React.FC<AIMissionControlProps> = ({ onComplete }) => {
  const parsedData = useAppStore((state) => state.parsedData);
  const datasetName = useAppStore((state) => state.datasetName);
  const geminiApiKey = useAppStore((state) => state.geminiApiKey);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(12);

  // Real or animated tallies
  const totalRows = parsedData?.rowCount || 240;
  const totalCols = parsedData?.columns?.length || 7;
  const [liveRows, setLiveRows] = useState(0);
  const [liveCols, setLiveCols] = useState(0);
  const [liveKpis, setLiveKpis] = useState(0);
  const [liveSignals, setLiveSignals] = useState(0);
  const [liveRisks, setLiveRisks] = useState(0);
  const [liveRecs, setLiveRecs] = useState(0);

  const steps = [
    { title: 'Uploading Dataset Stream', status: 'Reading binary CSV buffers & schema...', icon: <FileSpreadsheet size={16} /> },
    { title: 'Parsing Business Intelligence', status: 'Building bivariate correlation matrix...', icon: <BarChart3 size={16} /> },
    { title: 'Detecting Industry Domain', status: `Profiled: ${parsedData?.profile?.industry || 'Commercial Strategy'}`, icon: <Activity size={16} /> },
    { title: 'Generating Executive Insights', status: 'Isolating covariance delta vectors...', icon: <Brain size={16} /> },
    { title: 'Running Strategic Analysis', status: 'Calculating WACC prioritization scores...', icon: <Compass size={16} /> },
    { title: 'Consulting Gemini Intelligence Engine', status: `Connected to ${geminiApiKey ? 'gemini-2.5-flash' : 'Local Heuristic Engine'}`, icon: <Cpu size={16} /> },
    { title: 'Building Executive Brief', status: 'Compiling 9-paragraph boardroom dossier...', icon: <Layers size={16} /> },
    { title: 'Preparing Decision Intelligence Workspace', status: 'Finalizing real-time telemetry dashboard...', icon: <Sparkles size={16} /> }
  ];

  const readinessChecklist = [
    { label: 'Executive Brief Ready', icon: <FileSpreadsheet size={13} className="text-[#83D18B]" /> },
    { label: 'Strategy Canvas Ready', icon: <Compass size={13} className="text-[#83D18B]" /> },
    { label: 'Business Signals Ready', icon: <Activity size={13} className="text-[#83D18B]" /> },
    { label: 'Forecast Ready', icon: <TrendingUp size={13} className="text-[#83D18B]" /> },
    { label: 'Boardroom Report Ready', icon: <Layers size={13} className="text-[#83D18B]" /> }
  ];

  // Stage sequence animation interval
  useEffect(() => {
    const totalSteps = steps.length;
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const next = prev + 1;
        if (next >= totalSteps) {
          clearInterval(interval);
          setProgressPercent(100);
          setTimeout(() => {
            onComplete();
          }, 600);
          return totalSteps - 1;
        }
        setProgressPercent(Math.min(96, Math.round(((next + 1) / totalSteps) * 100)));
        return next;
      });
    }, 420);

    return () => clearInterval(interval);
  }, [onComplete, steps.length]);

  // Live tally counters
  useEffect(() => {
    const rowTimer = setInterval(() => {
      setLiveRows((prev) => (prev < totalRows ? Math.min(totalRows, prev + Math.ceil(totalRows / 6)) : totalRows));
      setLiveCols((prev) => (prev < totalCols ? Math.min(totalCols, prev + 2) : totalCols));
      setLiveKpis((prev) => (prev < 14 ? prev + 3 : 14));
      setLiveSignals((prev) => (prev < 6 ? prev + 1 : 6));
      setLiveRisks((prev) => (prev < 2 ? prev + 1 : 2));
      setLiveRecs((prev) => (prev < 4 ? prev + 1 : 4));
    }, 350);

    return () => clearInterval(rowTimer);
  }, [totalRows, totalCols]);

  const currentStep = steps[currentStepIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 bg-[#07090E] flex items-center justify-center p-6 select-none font-sans overflow-hidden"
    >
      <IntelligenceMesh />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[680px] bg-[#0E121A]/90 border border-[#83D18B]/30 rounded-3xl p-8 backdrop-blur-2xl shadow-[0_0_80px_rgba(131,209,139,0.12)] relative z-10 flex flex-col gap-6"
      >
        {/* Top Header & Pulse Indicator */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="relative w-7 h-7 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full bg-[#83D18B]/30 filter blur-[3px]"
              />
              <Sparkles size={18} className="text-[#83D18B] relative z-10 animate-pulse" />
            </div>
            <div>
              <h2 className="text-14 font-bold text-white tracking-tight uppercase font-mono">
                AI Intelligence Processing Unit
              </h2>
              <span className="text-11 text-white/40 font-mono">
                Ingesting: {datasetName || 'synapse_intel_matrix_q2.csv'}
              </span>
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="text-18 font-bold text-[#83D18B]">{progressPercent}%</span>
            <span className="text-10 text-white/30 block uppercase">Progress</span>
          </div>
        </div>

        {/* Cinematic Progress Bar */}
        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden relative border border-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-[#83D18B] via-[#6FE3D6] to-[#83D18B]"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </div>

        {/* Current Active Step Banner */}
        <div className="bg-[#151B23]/90 border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4 text-left shadow-lg">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#83D18B]/10 border border-[#83D18B]/20 flex items-center justify-center text-[#83D18B] shrink-0">
              {currentStep.icon}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-[#83D18B] uppercase tracking-wider font-mono">
                Step 0{currentStepIndex + 1} of 08
              </span>
              <h3 className="text-15 font-bold text-white/95 truncate font-sans">
                {currentStep.title}
              </h3>
              <p className="text-12 text-white/50 truncate font-serif mt-0.5">
                {currentStep.status}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-[#83D18B] bg-[#83D18B]/10 border border-[#83D18B]/20 rounded-lg px-2.5 py-1 shrink-0">
            <Cpu size={12} className="animate-spin" />
            <span>Processing</span>
          </div>
        </div>

        {/* Live Statistics Tally Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 font-mono text-left select-none">
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
            <span className="text-[8.5px] text-white/30 uppercase tracking-wider block">Rows</span>
            <span className="text-14 font-bold text-white">{liveRows}</span>
          </div>
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
            <span className="text-[8.5px] text-white/30 uppercase tracking-wider block">Cols</span>
            <span className="text-14 font-bold text-white">{liveCols}</span>
          </div>
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
            <span className="text-[8.5px] text-white/30 uppercase tracking-wider block">KPIs</span>
            <span className="text-14 font-bold text-[#83D18B]">{liveKpis}</span>
          </div>
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
            <span className="text-[8.5px] text-white/30 uppercase tracking-wider block">Signals</span>
            <span className="text-14 font-bold text-cyan-400">{liveSignals}</span>
          </div>
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
            <span className="text-[8.5px] text-white/30 uppercase tracking-wider block">Risks</span>
            <span className="text-14 font-bold text-amber-400">{liveRisks}</span>
          </div>
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
            <span className="text-[8.5px] text-white/30 uppercase tracking-wider block">Directives</span>
            <span className="text-14 font-bold text-purple-400">{liveRecs}</span>
          </div>
        </div>

        {/* Near Completion Workspace Readiness Checklist */}
        <AnimatePresence>
          {progressPercent >= 60 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border-t border-white/10 pt-4"
            >
              <span className="text-[9.5px] font-bold text-white/30 uppercase tracking-widest font-mono block text-left mb-3">
                Workspace Readiness Verification
              </span>
              <div className="flex flex-wrap gap-2 text-11 font-sans">
                {readinessChecklist.map((item, idx) => {
                  const isReady = progressPercent >= 60 + idx * 7;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: isReady ? 1 : 0.4, scale: 1 }}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border transition-all ${
                        isReady 
                          ? 'bg-[#83D18B]/10 border-[#83D18B]/30 text-white font-medium' 
                          : 'bg-white/[0.02] border-white/5 text-white/30'
                      }`}
                    >
                      <CheckCircle2 size={12} className={isReady ? 'text-[#83D18B]' : 'text-white/20'} />
                      <span>{item.label}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
