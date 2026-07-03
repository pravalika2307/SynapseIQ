import React from 'react';
import { Search, Bell, Sparkles, User, Settings, LogOut, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../features/store';
import { Dropdown } from './ui/Dropdown';

export const Topbar: React.FC = () => {
  const datasetName = useAppStore((state) => state.datasetName);
  const isLoadingAnalysis = useAppStore((state) => state.isLoadingAnalysis);
  const isDatasetLoaded = useAppStore((state) => state.isDatasetLoaded);
  const isPresentationMode = useAppStore((state) => state.isPresentationMode);
  const setPresentationMode = useAppStore((state) => state.setPresentationMode);

  const profileMenuItems = [
    {
      id: 'profile',
      label: 'My Profile',
      icon: <User size={14} />,
      onClick: () => alert('Launching profile configurations.')
    },
    {
      id: 'settings',
      label: 'Preferences',
      icon: <Settings size={14} />,
      onClick: () => alert('Loading system preferences.')
    },
    {
      id: 'switch',
      label: 'Switch Account',
      icon: <RefreshCw size={14} />,
      onClick: () => alert('Re-authenticating session.')
    },
    {
      id: 'logout',
      label: 'Log Out',
      icon: <LogOut size={14} />,
      onClick: () => alert('Logging out of workspace.')
    }
  ];

  return (
    <header className="flex items-center h-13 px-6 bg-background/95 backdrop-blur-md border-b border-white/5 sticky top-0 z-50 justify-between gap-4 select-none shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-2.5 w-48 shrink-0">
        <div className="w-5 h-5 text-accent-sage flex items-center justify-center">
          <Sparkles size={18} className="animate-pulse" />
        </div>
        <span className="text-13.5 font-semibold text-white/90 tracking-tight">
          SynapseIQ
        </span>
      </div>

      {/* Search bar */}
      <div className="flex-1 max-w-md relative mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
        <input
          type="text"
          placeholder="Search signals, reports, metrics..."
          className="w-full bg-white/[0.03] border border-white/5 rounded-lg py-1.5 pl-9 pr-4 text-13 text-white/90 placeholder-white/20 outline-none transition-all duration-300 focus:border-accent-sage-border focus:bg-white/[0.05] focus:ring-4 focus:ring-accent-sage/5"
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
              {isLoadingAnalysis ? 'Strategic Analysis Active' : isDatasetLoaded ? 'Context Updated' : 'Ready'}
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

        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/[0.03] transition-all">
          <Bell size={15} />
        </button>

        {/* Profile Dropdown */}
        <Dropdown
          trigger={
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-950 to-slate-900 border border-white/10 flex items-center justify-center text-10 font-bold text-white/70 hover:border-white/25 transition-all">
              PP
            </div>
          }
          items={profileMenuItems}
          align="right"
        />
      </div>
    </header>
  );
};
