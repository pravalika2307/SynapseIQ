import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Activity,
  Compass,
  MessageSquare,
  TrendingUp,
  Layers,
  Database,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Settings,
  HelpCircle,
  User,
  Clock,
  Sparkles,
  Target,
  Cpu
} from 'lucide-react';
import { useAppStore } from '../features/store';
import { useDemoStore } from '../features/demoStore';

export const Sidebar: React.FC = () => {
  const activeNodeId = useAppStore((state) => state.activeNodeId);
  const isSidebarCollapsed = useAppStore((state) => state.isSidebarCollapsed);
  const setSidebarCollapsed = useAppStore((state) => state.setSidebarCollapsed);
  const datasetName = useAppStore((state) => state.datasetName);
  const parsedData = useAppStore((state) => state.parsedData);
  const decisionReadiness = useAppStore((state) => state.decisionReadiness);
  const isLoadingAnalysis = useAppStore((state) => state.isLoadingAnalysis);
  const geminiApiKey = useAppStore((state) => state.geminiApiKey);
  const startDemo = useDemoStore((state) => state.startDemo);

  const navContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Collapsible Briefing Focus state
  const [isBriefingOpen, setIsBriefingOpen] = useState(true);
  const [isBriefingExpanded, setIsBriefingExpanded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const activeEl = navContainerRef.current?.querySelector('.active');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const navItems = [
    {
      to: '/dashboard/brief',
      icon: <FileText size={16} />,
      label: 'Executive Brief'
    },
    {
      to: '/dashboard/timeline',
      icon: <Clock size={16} />,
      label: 'Business Timeline'
    },
    {
      to: '/dashboard/signals',
      icon: <Activity size={16} />,
      label: 'Business Signals',
      badge: '6'
    },
    {
      to: '/dashboard/projections',
      icon: <Compass size={16} />,
      label: 'Strategy Canvas'
    },
    {
      to: '/dashboard/copilot',
      icon: <MessageSquare size={16} />,
      label: 'Decision Copilot'
    },
    {
      to: '/dashboard/forecast',
      icon: <TrendingUp size={16} />,
      label: 'Forecast Modeler'
    },
    {
      to: '/dashboard/reports',
      icon: <Layers size={16} />,
      label: 'Boardroom Report'
    },
    {
      to: '/dashboard/explorer',
      icon: <Database size={16} />,
      label: 'Data Explorer'
    }
  ];

  const briefingFocusItems = [
    { to: '/dashboard/brief/supply-chain', label: 'Supply Chain Resiliency', id: 'inventory' },
    { to: '/dashboard/brief/semiconductor', label: 'Semiconductor Supply', id: 'operations' },
    { to: '/dashboard/brief/market-compliance', label: 'EU Market Compliance', id: 'health' },
    { to: '/dashboard/brief/wacc-capital', label: 'WACC Capital Allocation', id: 'revenue' },
    { to: '/dashboard/brief/apac-expansion', label: 'APAC Regional Expansion', id: 'customers' },
    { to: '/dashboard/brief/logistics-sla', label: 'Logistics Transit SLA', id: 'operations' },
    { to: '/dashboard/brief/cyber-security', label: 'Cybersecurity Threat Shield', id: 'profit' }
  ];

  const visibleBriefings = isBriefingExpanded 
    ? briefingFocusItems 
    : briefingFocusItems.slice(0, 3);

  const bottomItems = [
    {
      icon: <Sparkles size={16} className="text-[#83D18B]" />,
      label: 'Guided Tour',
      onClick: () => startDemo()
    },
    {
      icon: <Settings size={16} />,
      label: 'Platform Settings',
      onClick: () => window.location.hash = '#/dashboard/settings'
    },
    {
      icon: <HelpCircle size={16} />,
      label: 'Help & Docs',
      onClick: () => window.open('https://github.com/pravalika2307/SynapseIQ#readme', '_blank')
    }
  ];

  return (
    <motion.aside
      animate={{ width: isSidebarCollapsed ? 64 : 230 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#0B0E14] border-r border-white/5 flex flex-col h-full shrink-0 select-none relative hide-in-presentation"
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
        aria-label="Toggle Navigation Sidebar"
        className="absolute top-5 -right-3 w-6 h-6 rounded-full border border-white/10 bg-[#151B23] flex items-center justify-center text-white/50 hover:text-white/90 hover:border-white/20 transition-all z-40 shadow-lg cursor-pointer"
      >
        {isSidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* STICKY TOP HEADER */}
      <div className="sticky top-0 z-20 bg-[#0B0E14] border-b border-white/[0.04] px-4 py-4 flex items-center justify-between">
        <AnimatePresence mode="wait">
          {!isSidebarCollapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Target size={14} className="text-[#83D18B]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 font-mono">
                Workspace
              </span>
            </motion.div>
          ) : (
            <div className="w-full flex justify-center">
              <Target size={16} className="text-[#83D18B]" />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* INDEPENDENTLY SCROLLABLE MIDDLE NAVIGATION */}
      <div 
        ref={navContainerRef} 
        className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-1.5 scroll-smooth scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 relative"
      >
        {/* Intelligent Live Workspace Telemetry Summary Card */}
        <AnimatePresence>
          {datasetName && !isSidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="mb-3 p-3 rounded-xl bg-[#151B23]/90 border border-[#83D18B]/25 font-sans space-y-2.5 shadow-lg select-none"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Database size={13} className="text-[#83D18B] shrink-0" />
                  <span className="text-11.5 font-bold text-white/90 truncate font-mono">{datasetName}</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#83D18B] animate-pulse shrink-0" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-white/50 font-mono">
                <div>
                  <span className="text-white/30 block uppercase tracking-wider text-[8.5px]">Industry</span>
                  <span className="text-white/80 font-medium truncate block">{parsedData?.profile?.industry || 'Commercial Strategy'}</span>
                </div>
                <div>
                  <span className="text-white/30 block uppercase tracking-wider text-[8.5px]">Dimensions</span>
                  <span className="text-white/80 font-medium truncate block">
                    {parsedData?.rowCount ? `${parsedData.rowCount}r • ${parsedData.columns?.length || 0}c` : '240r • 7c'}
                  </span>
                </div>
                <div>
                  <span className="text-white/30 block uppercase tracking-wider text-[8.5px]">Health Score</span>
                  <span className="text-[#83D18B] font-bold block">{decisionReadiness || 87}/100</span>
                </div>
                <div>
                  <span className="text-white/30 block uppercase tracking-wider text-[8.5px]">AI Status</span>
                  <span className="text-white/80 font-medium truncate block">{isLoadingAnalysis ? 'Synthesizing...' : 'Active'}</span>
                </div>
              </div>

              <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-[9.5px] font-mono text-white/40">
                <div className="flex items-center gap-1 text-[#83D18B]">
                  <Cpu size={11} />
                  <span>{geminiApiKey ? 'Gemini 2.0-Flash' : 'Offline Engine'}</span>
                </div>
                <span>Just now</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Workspace Navigation */}
        <nav className="space-y-[2px]" aria-label="Main Workspace Links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center px-3.5 py-2.5 text-13 rounded-xl transition-all duration-200 relative group
                ${isActive ? 'text-white font-medium active bg-white/[0.04]' : 'text-white/50 hover:text-white/85 hover:bg-white/[0.02]'}
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBackground"
                      className="absolute left-0 top-2 bottom-2 w-1 bg-[#83D18B] rounded-r-full z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}

                  <motion.span
                    animate={isActive 
                      ? { scale: 1.05, color: '#83D18B', opacity: 1 } 
                      : { scale: 1, color: '#ffffff', opacity: 0.5 }
                    }
                    whileHover={{ opacity: 0.85, color: '#83D18B' }}
                    transition={{ duration: 0.2 }}
                    className="min-w-[20px] z-10 flex items-center justify-center"
                  >
                    {item.icon}
                  </motion.span>

                  {!isSidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={isActive 
                        ? { opacity: 1, x: 0, color: '#ffffff' } 
                        : { opacity: 0.5, x: 0, color: 'rgba(255,255,255,0.5)' }
                      }
                      whileHover={{ opacity: 0.85 }}
                      transition={{ duration: 0.2 }}
                      className="ml-3 flex-1 truncate z-10 text-left font-sans"
                    >
                      {item.label}
                    </motion.span>
                  )}

                  {!isSidebarCollapsed && item.badge && (
                    <span className="text-[10px] font-bold bg-[#83D18B]/10 text-[#83D18B] border border-[#83D18B]/20 rounded-full px-2 py-0.5 ml-auto z-10 font-mono">
                      {item.badge}
                    </span>
                  )}

                  {isSidebarCollapsed && (
                    <div className="absolute left-16 bg-[#18212C] border border-white/10 text-white/90 text-[11px] rounded-lg px-2.5 py-1.5 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap shadow-xl">
                      {item.label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* COLLAPSIBLE BRIEFING FOCUS SECTION */}
        <AnimatePresence>
          {!isSidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-4 border-t border-white/[0.04]"
            >
              {/* Accordion Header */}
              <button
                onClick={() => setIsBriefingOpen(!isBriefingOpen)}
                className="w-full flex items-center justify-between px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/40 hover:text-white/70 transition-colors cursor-pointer"
              >
                <span>Briefing Focus</span>
                <span className="text-white/30">
                  {isBriefingOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </span>
              </button>

              {/* Accordion Items Body */}
              <AnimatePresence>
                {isBriefingOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-[2px] mt-1"
                  >
                    {visibleBriefings.map((brief) => (
                      <NavLink
                        key={brief.to}
                        to={brief.to}
                        className={({ isActive }) => `
                          flex items-center gap-2.5 pl-4 pr-3 py-2 text-12 transition-all duration-200 rounded-lg group
                          ${isActive ? 'text-[#83D18B] font-medium bg-[#83D18B]/5' : 'text-white/40 hover:text-white/75 hover:bg-white/[0.02]'}
                        `}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeNodeId === brief.id ? 'bg-[#83D18B] shadow-[0_0_8px_rgba(131,209,139,0.8)]' : 'bg-white/20 group-hover:bg-white/40'}`} />
                        <span className="truncate">{brief.label}</span>
                      </NavLink>
                    ))}

                    {/* View More / Show Less Toggle Button */}
                    <button
                      onClick={() => setIsBriefingExpanded(!isBriefingExpanded)}
                      className="w-full flex items-center justify-between px-4 py-2 text-[11px] font-semibold text-[#83D18B] hover:text-[#83D18B]/80 transition-colors cursor-pointer pt-2"
                    >
                      <span>
                        {isBriefingExpanded 
                          ? 'Show Less' 
                          : `View More (+${briefingFocusItems.length - 3} vectors)`}
                      </span>
                      {isBriefingExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* STICKY BOTTOM FOOTER & PROFILE CARD */}
      <div className="sticky bottom-0 z-20 bg-[#0B0E14] border-t border-white/[0.06] pt-2 pb-3 px-2 space-y-1">
        {/* Navigation bottom items */}
        {bottomItems.map((item, idx) => (
          <button
            key={idx}
            onClick={item.onClick}
            className="w-full flex items-center px-3.5 py-2 text-12.5 text-white/50 hover:text-white/90 hover:bg-white/[0.03] rounded-xl transition-all duration-200 relative group cursor-pointer"
          >
            <span className="opacity-70 group-hover:opacity-100 min-w-[20px]">{item.icon}</span>
            {!isSidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="ml-3 truncate font-sans"
              >
                {item.label}
              </motion.span>
            )}

            {isSidebarCollapsed && (
              <div className="absolute left-16 bg-[#18212C] border border-white/10 text-white/90 text-[11px] rounded-lg px-2.5 py-1.5 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap shadow-xl">
                {item.label}
              </div>
            )}
          </button>
        ))}

        {/* STICKY PROFILE CARD */}
        <div className="pt-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-3 p-2 hover:bg-white/[0.04] rounded-xl cursor-pointer transition-all overflow-hidden border border-transparent hover:border-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center text-11 font-bold text-white/80 shrink-0">
              <User size={14} className="opacity-70 text-[#83D18B]" />
            </div>
            {!isSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col min-w-0"
              >
                <span className="text-12 font-semibold text-white/90 truncate font-sans">Pravalika Palle</span>
                <span className="text-[10px] text-white/40 truncate font-mono">Managing Director</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.aside>
  );
};
