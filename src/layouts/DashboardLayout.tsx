import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { motion, AnimatePresence } from 'framer-motion';
import { IntelligenceMesh } from '../components/IntelligenceMesh';
import { Sparkles, X } from 'lucide-react';
import { useAppStore } from '../features/store';
import { PresentationToolbar } from '../components/PresentationToolbar';
import { LiveInsightStream } from '../components/LiveInsightStream';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeNodeId = useAppStore((state) => state.activeNodeId);
  const nodeContexts = useAppStore((state) => state.nodeContexts);
  const isPresentationMode = useAppStore((state) => state.isPresentationMode);
  const parsedData = useAppStore((state) => state.parsedData);
  const setCopilotPreloadQuery = useAppStore((state) => state.setCopilotPreloadQuery);
  const setCopilotContextNodeId = useAppStore((state) => state.setCopilotContextNodeId);

  // AI Initiative Alert State
  const [initiative, setInitiative] = useState<{
    title: string;
    bullets: string[];
    query: string;
    nodeId: string;
  } | null>(null);

  // Suggestion Toast State
  const [suggestion, setSuggestion] = useState<{ text: string; actionText: string; actionPath: string } | null>(null);
  const idleTimerRef = useRef<any>(null);

  const resetIdleTimer = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    
    // Clear suggestion if active when user interacts
    // but only if they are actively moving. Let's keep it visible until closed/clicked
    // so they have time to read it. Just reset the next spawn timer.
    idleTimerRef.current = setTimeout(() => {
      // Determine context-based suggestions
      const path = location.pathname;
      const activeTitle = nodeContexts[activeNodeId]?.title || 'Business Health';
      
      let nextSuggestion = {
        text: 'Customer Satisfaction dropped 6%. View related insights?',
        actionText: 'View Signals',
        actionPath: '/dashboard/signals'
      };

      if (path.includes('/brief')) {
        nextSuggestion = {
          text: `Solvency metrics are currently focused on "${activeTitle}". Explore interdependencies on the Strategy Canvas?`,
          actionText: 'Open Canvas',
          actionPath: '/dashboard/projections'
        };
      } else if (path.includes('/projections')) {
        nextSuggestion = {
          text: `Wait! Wafer spot-rates are showing regional variance. Compile a Board Briefing?`,
          actionText: 'View Reports',
          actionPath: '/dashboard/reports'
        };
      } else if (path.includes('/forecast')) {
        nextSuggestion = {
          text: 'Marketing slider yields direct customer growth. Shift overhead allocations in Copilot?',
          actionText: 'Consult Copilot',
          actionPath: '/dashboard/copilot'
        };
      } else if (path.includes('/copilot')) {
        nextSuggestion = {
          text: `Ask Copilot: "How do safety stock buffers prevent production delays?" to identify supply safety indexes.`,
          actionText: 'Copy Query',
          actionPath: '/dashboard/copilot' // keeps on page
        };
      }

      setSuggestion(nextSuggestion);
    }, 4500); // Trigger suggestion after 4.5s of total inactivity
  };

  useEffect(() => {
    // Reset timer on activity
    const handleActivity = () => {
      resetIdleTimer();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('click', handleActivity);

    // Initial load timer
    resetIdleTimer();

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [location.pathname, activeNodeId, nodeContexts]);

  useEffect(() => {
    if (!parsedData) return;

    // Proactively generate initiative alert after 6 seconds of workspace load
    const timer = setTimeout(() => {
      const profile = parsedData.profile;
      
      let title = "We noticed something important.";
      let bullets = [
        "Revenue expanded by 18% over the period.",
        "However, operating profit only increased by 2%."
      ];
      let query = "Why did revenue increase by 18% while profit only increased by 2%? Detail the underlying structural constraints.";
      let nodeId = "profit";

      // Customization if customer metrics suggest West region complaint rises
      if (profile.regions.includes('West')) {
        title = "Customer behavior shifted.";
        bullets = [
          "Customer satisfaction in the West region dropped.",
          "Shipping transit bottlenecks hold near 32 days."
        ];
        query = "Explain why customer satisfaction in the West region dropped and detail recommended cargo logistics success updates.";
        nodeId = "customers";
      }

      setInitiative({ title, bullets, query, nodeId });
    }, 6000);

    return () => clearTimeout(timer);
  }, [parsedData]);

  const handleAction = (path: string, text: string) => {
    if (text === 'Copy Query') {
      setCopilotPreloadQuery('How do safety stock buffers prevent production delays?');
      navigate('/dashboard/copilot');
    } else {
      navigate(path);
    }
    setSuggestion(null);
  };

  return (
    <div className={`flex flex-col h-screen w-screen bg-background overflow-hidden relative ${isPresentationMode ? 'presentation-mode' : ''}`}>
      <IntelligenceMesh />
      <Topbar />
      <div className="flex flex-1 min-h-0 w-full overflow-hidden relative z-10">
        <Sidebar />
        <main role="main" aria-label="Executive Intelligence Workspace" className="flex-1 overflow-y-auto w-full relative grid-bg">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10, filter: 'blur(2px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(2px)' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }} // Calmer Apple-like premium transition
              className="w-full h-full relative z-10"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <LiveInsightStream />
      </div>

      {/* Dynamic Contextual AI Suggestion Toast */}
      <AnimatePresence>
        {suggestion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="fixed bottom-6 right-6 z-50 w-[340px] bg-[#151B23]/90 border border-[#83D18B]/35 shadow-[0_10px_30px_rgba(131,209,139,0.08)] backdrop-blur-md rounded-2xl p-5 flex flex-col gap-3 font-sans select-none"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-[#83D18B]">
                <Sparkles size={14} className="animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Strategic Recommendation</span>
              </div>
              <button 
                onClick={() => setSuggestion(null)}
                className="text-white/30 hover:text-white/60 p-0.5 rounded transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-12.5 text-white/75 leading-relaxed font-serif">
              {suggestion.text}
            </p>

            <button
              onClick={() => handleAction(suggestion.actionPath, suggestion.actionText)}
              className="w-full text-center bg-[#83D18B] text-[#0D1117] font-semibold text-11.5 py-2 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              {suggestion.actionText}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Proactive AI Initiative Card */}
      <AnimatePresence>
        {initiative && (
          <motion.div
            initial={{ opacity: 0, x: -30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            className="fixed bottom-6 left-6 z-50 w-[360px] bg-[#12161D]/95 border border-[#83D18B]/35 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md rounded-2xl p-6 flex flex-col gap-4 select-none font-sans"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#83D18B]">
                <Sparkles size={14} className="animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider">AI Initiative Alert</span>
              </div>
              <button 
                onClick={() => setInitiative(null)}
                className="text-white/30 hover:text-white/60 p-0.5 rounded transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-2 text-left">
              <h4 className="text-14.5 font-bold text-white/95 font-serif leading-snug">
                {initiative.title}
              </h4>
              <div className="space-y-1.5 border-l border-[#83D18B]/30 pl-4 py-1 text-12.5 text-white/75 font-serif leading-relaxed">
                {initiative.bullets.map((line, lIdx) => (
                  <p key={lIdx}>{line}</p>
                ))}
              </div>
              <p className="text-12 text-white/50 pt-1 font-serif">
                Would you like to investigate this strategic anomaly now?
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setInitiative(null)}
                className="flex-1 py-2.5 border border-white/5 hover:border-white/10 hover:bg-white/[0.02] rounded-xl text-11.5 font-semibold text-white/50 hover:text-white/80 transition-all cursor-pointer active:scale-95"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  setCopilotPreloadQuery(initiative.query);
                  setCopilotContextNodeId(initiative.nodeId);
                  navigate('/dashboard/copilot');
                  setInitiative(null);
                }}
                className="flex-1 py-2.5 bg-[#83D18B] hover:bg-[#A5E6B3] text-[#050608] font-bold text-11.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Investigate
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PresentationToolbar />
    </div>
  );
};
