import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Sparkles
} from 'lucide-react';
import { useAppStore } from '../features/store';

export const PresentationToolbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isPresentationMode = useAppStore((state) => state.isPresentationMode);
  const setPresentationMode = useAppStore((state) => state.setPresentationMode);

  // Presenter Navigation flow order
  const presentationSteps = useMemo(() => [
    { name: 'Executive Briefing', path: '/dashboard/brief' },
    { name: 'Business Timeline Ledger', path: '/dashboard/timeline' },
    { name: 'Business Signals Matrix', path: '/dashboard/signals' },
    { name: 'Strategy Canvas Graph', path: '/dashboard/projections' },
    { name: 'Decision Copilot Panel', path: '/dashboard/copilot' },
    { name: 'Forecast Modeler Workspace', path: '/dashboard/forecast' },
    { name: 'Boardroom Reports dossiers', path: '/dashboard/reports' }
  ], []);

  // Section descriptions mapped to location paths
  const sectionDescriptions: Record<string, string> = {
    '/dashboard/brief': "AI-generated summary of your organization's current business position.",
    '/dashboard/timeline': "Interactive ledger displaying chronological business progression and strategy events.",
    '/dashboard/signals': "The most significant changes detected within your data.",
    '/dashboard/projections': "Visual representation of how core business drivers influence one another.",
    '/dashboard/copilot': "Ask strategic business questions grounded in your uploaded dataset.",
    '/dashboard/forecast': "Simulate future outcomes before making strategic decisions.",
    '/dashboard/reports': "Generate boardroom-grade briefings from raw data."
  };

  // Find active step index based on location pathname
  const activeStepIdx = useMemo(() => {
    const idx = presentationSteps.findIndex(s => s.path === location.pathname);
    return idx === -1 ? 0 : idx;
  }, [location.pathname, presentationSteps]);

  const [overlayText, setOverlayText] = useState<string | null>(null);

  // Trigger fading description overlay whenever route changes
  useEffect(() => {
    const desc = sectionDescriptions[location.pathname];
    if (desc) {
      setOverlayText(desc);
      const timer = setTimeout(() => {
        setOverlayText(null);
      }, 4200); // Overlay fades away after 4.2 seconds
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  // Keyboard navigation arrows listener
  useEffect(() => {
    if (!isPresentationMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        const nextIdx = (activeStepIdx + 1) % presentationSteps.length;
        navigate(presentationSteps[nextIdx].path);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIdx = (activeStepIdx - 1 + presentationSteps.length) % presentationSteps.length;
        navigate(presentationSteps[prevIdx].path);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresentationMode, activeStepIdx, presentationSteps, navigate]);

  if (!isPresentationMode) return null;

  const currentStep = presentationSteps[activeStepIdx];

  return (
    <>
      {/* Subtle Floating overlay explanation */}
      <AnimatePresence>
        {overlayText && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#12161D]/90 border border-[#83D18B]/35 shadow-[0_15px_40px_rgba(0,0,0,0.5)] backdrop-blur-md rounded-2xl px-6 py-3.5 select-none text-center pointer-events-none"
          >
            <div className="flex items-center gap-2.5 justify-center">
              <Sparkles size={13} className="text-[#83D18B] animate-pulse shrink-0" />
              <span className="text-13.5 font-serif font-medium text-white/95 leading-normal">
                {overlayText}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Presentation Control Toolbar at bottom */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 select-none">
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="flex items-center gap-6 bg-[#0D1117]/95 border border-[#83D18B]/25 rounded-2xl px-5 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md"
        >
          {/* Status Mode Badge */}
          <div className="flex items-center gap-2 px-2.5 py-1 bg-[#83D18B]/10 border border-[#83D18B]/20 rounded-lg text-[10px] font-bold text-[#83D18B] uppercase tracking-wider font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#83D18B] animate-ping" />
            Projector Mode
          </div>

          <div className="h-4 w-[1px] bg-white/10" />

          {/* Steps Indicator / Scrubber */}
          <div className="flex flex-col text-left min-w-[150px]">
            <span className="text-[9px] uppercase font-bold tracking-widest text-white/30 font-sans">
              Active Chapter {activeStepIdx + 1} of {presentationSteps.length}
            </span>
            <span className="text-12 font-bold text-white/80 font-serif leading-tight">
              {currentStep.name}
            </span>
          </div>

          {/* Prev/Next Navigation Controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                const prevIdx = (activeStepIdx - 1 + presentationSteps.length) % presentationSteps.length;
                navigate(presentationSteps[prevIdx].path);
              }}
              className="p-2 border border-white/5 hover:border-white/15 bg-white/[0.01] hover:bg-white/[0.03] rounded-xl text-white/60 hover:text-white/95 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={() => {
                const nextIdx = (activeStepIdx + 1) % presentationSteps.length;
                navigate(presentationSteps[nextIdx].path);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#83D18B] hover:bg-[#A5E6B3] text-[#050608] font-bold text-12 rounded-xl active:scale-95 transition-all cursor-pointer"
            >
              Next Step
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="h-4 w-[1px] bg-white/10" />

          {/* Close Toolbar Toggle */}
          <button
            onClick={() => setPresentationMode(false)}
            className="p-2 border border-white/5 hover:border-critical/30 bg-white/[0.01] hover:bg-critical/5 text-white/40 hover:text-critical rounded-xl active:scale-95 transition-all cursor-pointer"
            title="Exit Presentation Mode"
          >
            <X size={15} />
          </button>
        </motion.div>
      </div>
    </>
  );
};
