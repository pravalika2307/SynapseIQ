import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Sparkles, 
  User, 
  Settings, 
  LogOut, 
  FileText, 
  Clock, 
  HelpCircle, 
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../features/store';
import { Dropdown } from './ui/Dropdown';

export const Topbar: React.FC = () => {
  const datasetName = useAppStore((state) => state.datasetName);
  const isLoadingAnalysis = useAppStore((state) => state.isLoadingAnalysis);
  const isDatasetLoaded = useAppStore((state) => state.isDatasetLoaded);
  const isPresentationMode = useAppStore((state) => state.isPresentationMode);
  const setPresentationMode = useAppStore((state) => state.setPresentationMode);
  const setIsDatasetLoaded = useAppStore((state) => state.setIsDatasetLoaded);

  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const profileMenuItems = [
    {
      id: 'profile',
      label: 'Profile & Activity',
      icon: <User size={14} className="text-[#83D18B]" />,
      onClick: () => window.location.hash = '#/dashboard/brief'
    },
    {
      id: 'reports',
      label: 'My Reports',
      icon: <FileText size={14} />,
      onClick: () => window.location.hash = '#/dashboard/reports'
    },
    {
      id: 'timeline',
      label: 'Recent Sessions',
      icon: <Clock size={14} />,
      onClick: () => window.location.hash = '#/dashboard/timeline'
    },
    {
      id: 'settings',
      label: 'Preferences & Controls',
      icon: <Settings size={14} />,
      onClick: () => window.location.hash = '#/dashboard/settings'
    },
    {
      id: 'help',
      label: 'Help Center & Shortcuts',
      icon: <HelpCircle size={14} />,
      onClick: () => window.location.hash = '#/dashboard/explorer'
    },
    {
      id: 'releases',
      label: 'Release Notes (v1.0.0)',
      icon: <Sparkles size={14} className="text-amber-400" />,
      onClick: () => window.location.hash = '#/dashboard/settings'
    },
    {
      id: 'about',
      label: 'About SynapseIQ',
      icon: <Info size={14} />,
      onClick: () => window.open('https://github.com/pravalika2307/SynapseIQ#readme', '_blank')
    },
    {
      id: 'signout',
      label: 'Sign Out',
      icon: <LogOut size={14} className="text-red-400" />,
      onClick: () => setShowSignOutModal(true)
    }
  ];

  const handleConfirmSignOut = () => {
    setIsDatasetLoaded(false);
    setShowSignOutModal(false);
    window.location.hash = '#/';
  };

  return (
    <>
      <header className="flex items-center h-13 px-6 bg-[#0D1117]/90 backdrop-blur-xl border-b border-white/[0.08] sticky top-0 z-50 justify-between gap-4 select-none shrink-0 shadow-sm">
        {/* Brand */}
        <div className="flex items-center gap-2.5 w-48 shrink-0">
          <div className="w-5 h-5 text-accent-sage flex items-center justify-center">
            <Sparkles size={18} className="animate-pulse text-[#83D18B]" />
          </div>
          <span className="text-13.5 font-bold text-white/90 tracking-tight font-sans">
            SynapseIQ
          </span>
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-md relative mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
          <input
            type="text"
            placeholder="Search signals, reports, metrics..."
            className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-1.5 pl-9 pr-4 text-13 text-white/90 placeholder-white/25 outline-none transition-all duration-200 focus:border-[#83D18B]/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#83D18B]/10 font-sans"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {datasetName && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-white/[0.02] border border-white/5 rounded-md text-11 text-white/55 font-mono">
              <span className="text-[9px] font-bold text-white/30 uppercase">Set:</span>
              <span className="text-accent-sage truncate max-w-[120px]">{datasetName}</span>
            </div>
          )}

          <div className="flex items-center gap-2 px-2.5 py-1 bg-white/[0.02] border border-white/5 rounded-full text-[10px] font-bold text-white/55 tracking-wider uppercase font-mono select-none overflow-hidden">
            <span className={`w-1.5 h-1.5 rounded-full ${isLoadingAnalysis ? 'bg-critical' : 'bg-accent-sage'} animate-pulse`} />
            <AnimatePresence mode="wait">
              <motion.span
                key={isLoadingAnalysis ? 'analysing' : isDatasetLoaded ? 'loaded' : 'ready'}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {isLoadingAnalysis ? 'Building strategic understanding...' : isDatasetLoaded ? 'Business relationships refreshed.' : 'System Ready'}
              </motion.span>
            </AnimatePresence>
          </div>

          <button
            onClick={() => setPresentationMode(!isPresentationMode)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-11.5 font-bold transition-all cursor-pointer active:scale-95 select-none
              ${isPresentationMode
                ? 'bg-[#83D18B] border-[#83D18B] text-[#050608]'
                : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.03] text-white/60 hover:text-white/90 hover:border-white/10'
              }
            `}
          >
            <span>✨ Presentation Mode</span>
          </button>

          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/[0.03] transition-all cursor-pointer">
            <Bell size={15} />
          </button>

          {/* Premium Profile Dropdown */}
          <Dropdown
            trigger={
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-950 to-slate-900 border border-[#83D18B]/30 flex items-center justify-center text-11 font-bold text-white/90 hover:border-[#83D18B] transition-all cursor-pointer shadow-sm active:scale-95">
                PP
              </div>
            }
            items={profileMenuItems}
            align="right"
          />
        </div>
      </header>

      {/* Sign Out Confirmation Modal */}
      <AnimatePresence>
        {showSignOutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-[#151B23] border border-white/10 rounded-2xl p-6 max-w-sm w-full space-y-5 shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <LogOut size={18} />
                </div>
                <div>
                  <h3 className="text-14 font-bold text-white/90">Sign Out of SynapseIQ?</h3>
                  <p className="text-11 text-white/40">Ending current workspace session</p>
                </div>
              </div>

              <p className="text-12 text-white/60 leading-relaxed">
                Your active dataset insights and briefing states remain isolated on your local client device. Confirming sign out will return you to the public landing portal.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setShowSignOutModal(false)}
                  className="flex-1 py-2 rounded-xl border border-white/10 text-12 font-semibold text-white/60 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSignOut}
                  className="flex-1 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 text-12 font-bold transition-all cursor-pointer"
                >
                  Confirm Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
