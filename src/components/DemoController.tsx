import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Play, Pause, ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import { useDemoStore } from '../features/demoStore';
import { useAppStore } from '../features/store';
import { motion, AnimatePresence } from 'framer-motion';

interface StepConfig {
  step: number;
  title: string;
  route: string;
  durationMs: number;
  narrative: string;
}

const stepsConfig: StepConfig[] = [
  {
    step: 1,
    title: 'Welcome Screen',
    route: '/',
    durationMs: 5000,
    narrative: "Welcome to SynapseIQ. Let's discover the story hidden in your business data."
  },
  {
    step: 2,
    title: 'AI Synthesis Sequence',
    route: '/',
    durationMs: 8000,
    narrative: 'Playing the ingestion sequence: validating context, detecting trends, and isolating operational anomalies.'
  },
  {
    step: 3,
    title: 'Executive Briefing',
    route: '/dashboard/brief',
    durationMs: 14000,
    narrative: 'Isolated Q2 growth targets, circular Business Health (91/100), and top strategic action plans.'
  },
  {
    step: 4,
    title: 'Strategy Canvas Relational Graph',
    route: '/dashboard/projections',
    durationMs: 14000,
    narrative: 'Exploring metric interdependencies. Revenue, Marketing, and Profit relationships are mapped.'
  },
  {
    step: 5,
    title: 'Operational Business Signals',
    route: '/dashboard/signals',
    durationMs: 14000,
    narrative: 'Analyzing regional telemetry trends, NRR logo expansions, and AI recommendations.'
  },
  {
    step: 6,
    title: 'Decision Copilot consultation',
    route: '/dashboard/copilot',
    durationMs: 18000,
    narrative: 'Asking: "What should the company prioritize next quarter?" Streaming McKinsey consultant responses.'
  },
  {
    step: 7,
    title: 'AI Scenario Simulation',
    route: '/dashboard/forecast',
    durationMs: 14000,
    narrative: 'Simulating +15% Marketing budget increase. Observe real-time margin adjustments and target shifts.'
  },
  {
    step: 8,
    title: 'Executive Synthesis Complete',
    route: '/dashboard/brief',
    durationMs: 999999,
    narrative: 'SynapseIQ has successfully transformed raw business telemetry into actionable directives.'
  }
];

export const DemoController: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    isDemoActive, 
    currentStep, 
    isPaused, 
    exitDemo, 
    pauseDemo, 
    resumeDemo, 
    nextStep, 
    prevStep,
    setStep
  } = useDemoStore();

  const setDatasetName = useAppStore((state) => state.setDatasetName);
  const setIsDatasetLoaded = useAppStore((state) => state.setIsDatasetLoaded);

  const timerRef = useRef<any | null>(null);
  const progressTimerRef = useRef<any | null>(null);
  const [percentProgress, setPercentProgress] = React.useState(0);

  const activeStepConfig = stepsConfig.find((s) => s.step === currentStep) || stepsConfig[0];

  // Route Auto-Navigation when Step changes
  useEffect(() => {
    if (!isDemoActive) return;
    
    // Trigger proper route loading
    if (location.pathname !== activeStepConfig.route) {
      navigate(activeStepConfig.route);
    }

    // Set demo matrix defaults
    if (currentStep >= 3) {
      setDatasetName('synapse_intel_matrix_q2.csv');
      setIsDatasetLoaded(true);
    }
  }, [currentStep, isDemoActive, activeStepConfig.route, navigate, location.pathname, setDatasetName, setIsDatasetLoaded]);

  // Handle auto-advancing timers
  useEffect(() => {
    if (!isDemoActive || isPaused) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }

    // Reset percent progress
    setPercentProgress(0);
    const stepDuration = activeStepConfig.durationMs;
    const intervalMs = 100;
    let elapsedMs = 0;

    // Progress updates
    progressTimerRef.current = setInterval(() => {
      elapsedMs += intervalMs;
      setPercentProgress(Math.min(100, (elapsedMs / stepDuration) * 100));
    }, intervalMs);

    // Auto next step timeout
    timerRef.current = setTimeout(() => {
      if (currentStep < 8) {
        nextStep();
      } else {
        exitDemo();
      }
    }, stepDuration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [currentStep, isDemoActive, isPaused, activeStepConfig.durationMs, nextStep, exitDemo]);

  if (!isDemoActive) return null;

  if (currentStep === 8) {
    return (
      <AnimatePresence>
        <div className="fixed inset-0 bg-[#0D1117]/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md bg-[#151B23] border border-[#83D18B]/20 rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center gap-6 select-none font-sans"
          >
            <div className="w-12 h-12 rounded-full bg-[#83D18B]/10 border border-[#83D18B]/25 flex items-center justify-center text-[#83D18B]">
              <Sparkles size={20} className="animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-18 font-semibold text-white">Guided Tour Complete</h3>
              <p className="text-13.5 text-white/50 leading-relaxed font-serif">
                "SynapseIQ has successfully transformed raw business telemetry into actionable directives."
              </p>
            </div>

            <div className="flex flex-col gap-2.5 w-full pt-2">
              <button
                onClick={exitDemo}
                className="w-full py-2.5 rounded-xl bg-[#83D18B] text-[#0D1117] font-semibold text-13 hover:bg-[#83D18B]/90 transition-all"
              >
                Explore Freely
              </button>
              <button
                onClick={() => setStep(1)}
                className="w-full py-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-white/80 hover:bg-white/[0.06] transition-all font-semibold text-13"
              >
                Restart Demo
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xl px-4"
      >
        <div className="bg-[#151B23] border border-[#83D18B]/30 rounded-2xl p-5 shadow-2xl flex flex-col gap-3 font-sans relative overflow-hidden">
          
          {/* Progress bar line */}
          <div className="absolute bottom-0 left-0 h-0.5 bg-[#83D18B] transition-all duration-100" style={{ width: `${percentProgress}%` }} />

          {/* Top Panel Control bar */}
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5 select-none">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#83D18B] animate-pulse" />
              <span className="text-11.5 font-bold uppercase tracking-wider text-white/80">
                Guided Judge Tour · Step {currentStep} of 8
              </span>
            </div>
            
            {/* Quick exit */}
            <button 
              onClick={exitDemo}
              className="text-white/40 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Step Narrative explanation */}
          <div className="space-y-1 py-1">
            <h4 className="text-13.5 font-semibold text-white">{activeStepConfig.title}</h4>
            <p className="text-12.5 text-white/50 leading-relaxed font-serif">
              "{activeStepConfig.narrative}"
            </p>
          </div>

          {/* Action Button Row */}
          <div className="flex items-center justify-between select-none pt-1">
            
            {/* Prev step */}
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="p-1.5 rounded-lg border border-white/5 bg-white/[0.02] text-white/60 hover:text-white disabled:opacity-20 transition-all"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Play/Pause */}
            <div className="flex items-center gap-2">
              {isPaused ? (
                <button
                  onClick={resumeDemo}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-[#83D18B] text-[#0D1117] font-semibold text-11.5 rounded-lg hover:bg-[#83D18B]/90 transition-all"
                >
                  <Play size={11} fill="currentColor" /> Resume Demo
                </button>
              ) : (
                <button
                  onClick={pauseDemo}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-white/[0.03] border border-white/5 text-white font-semibold text-11.5 rounded-lg hover:bg-white/[0.06] transition-all"
                >
                  <Pause size={11} fill="currentColor" /> Pause Demo
                </button>
              )}
            </div>

            {/* Next step */}
            <button
              onClick={nextStep}
              disabled={currentStep === 8}
              className="p-1.5 rounded-lg border border-white/5 bg-white/[0.02] text-white/60 hover:text-white disabled:opacity-20 transition-all"
            >
              <ChevronRight size={16} />
            </button>

          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};
