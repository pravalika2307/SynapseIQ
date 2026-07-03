import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { motion, AnimatePresence } from 'framer-motion';
import { IntelligenceMesh } from '../components/IntelligenceMesh';
import { Sparkles, X } from 'lucide-react';
import { useAppStore } from '../features/store';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeNodeId = useAppStore((state) => state.activeNodeId);
  const nodeContexts = useAppStore((state) => state.nodeContexts);

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
          actionPath: '/dashboard/canvas'
        };
      } else if (path.includes('/canvas')) {
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

  const handleAction = (path: string, text: string) => {
    if (text === 'Copy Query') {
      // Copy to clipboard or trigger query in Copilot
      // For ease of use, we can populate input or copy query text
      navigator.clipboard.writeText('How do safety stock buffers prevent production delays?');
      alert('Strategic query copied to clipboard! Paste it into the Copilot input.');
    } else {
      navigate(path);
    }
    setSuggestion(null);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-background overflow-hidden relative">
      <IntelligenceMesh />
      <Topbar />
      <div className="flex flex-1 min-h-0 w-full overflow-hidden relative z-10">
        <Sidebar />
        <main className="flex-1 overflow-y-auto w-full relative grid-bg">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} // Soft Apple-like easing
              className="w-full h-full relative z-10"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
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
    </div>
  );
};
