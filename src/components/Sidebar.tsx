import React from 'react';
import { NavLink } from 'react-router-dom';
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
  Settings,
  HelpCircle,
  User,
  Clock
} from 'lucide-react';
import { useAppStore } from '../features/store';

export const Sidebar: React.FC = () => {
  const activeNodeId = useAppStore((state) => state.activeNodeId);
  const isSidebarCollapsed = useAppStore((state) => state.isSidebarCollapsed);
  const setSidebarCollapsed = useAppStore((state) => state.setSidebarCollapsed);

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

  const bottomItems = [
    {
      icon: <Settings size={16} />,
      label: 'Settings',
      onClick: () => alert('Settings configuration module.')
    },
    {
      icon: <HelpCircle size={16} />,
      label: 'Help & Docs',
      onClick: () => alert('Launching SynapseIQ document desk.')
    }
  ];

  return (
    <motion.aside 
      animate={{ width: isSidebarCollapsed ? 64 : 220 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="bg-background border-r border-white/5 flex flex-col h-full shrink-0 select-none py-6 relative hide-in-presentation"
    >
      {/* Collapse Toggle Button */}
      <button 
        onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
        className="absolute top-5 -right-3 w-6 h-6 rounded-full border border-white/10 bg-[#151B23] flex items-center justify-center text-white/50 hover:text-white/90 hover:border-white/20 transition-all z-40 shadow-lg"
      >
        {isSidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden px-1 scrollbar-none">
        {/* Workspace Label */}
        <AnimatePresence mode="wait">
          {!isSidebarCollapsed ? (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] font-bold uppercase tracking-wider text-white/30 px-4 mb-2 block"
            >
              Workspace
            </motion.span>
          ) : (
            <div className="h-6" />
          )}
        </AnimatePresence>

        {/* Main Navigation Links */}
        <nav className="space-y-[2px]">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center px-4 py-2.5 text-13 transition-all duration-300 relative group
                ${isActive ? 'text-white font-medium font-sans' : 'text-white/50 hover:text-white/85'}
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div 
                      layoutId="activeNavBackground"
                      className="absolute inset-0 bg-accent-sage/[0.04] border-l-2 border-accent-sage z-0"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  
                  <motion.span 
                    animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                    className="opacity-70 group-hover:opacity-100 min-w-[20px] z-10 flex items-center justify-center"
                  >
                    {item.icon}
                  </motion.span>
                  
                  {!isSidebarCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ml-3 flex-1 truncate z-10 text-left"
                    >
                      {item.label}
                    </motion.span>
                  )}

                  {!isSidebarCollapsed && item.badge && (
                    <span className="text-[10px] font-bold bg-accent-sage-dim text-accent-sage border border-accent-sage-border rounded-full px-2 py-0.5 ml-auto z-10">
                      {item.badge}
                    </span>
                  )}

                  {isSidebarCollapsed && (
                    <div className="absolute left-16 bg-[#18212C] border border-white/5 text-white/90 text-[11px] rounded px-2.5 py-1.5 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap shadow-xl">
                      {item.label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Briefing Focus (Hidden in collapsed mode to save vertical visual weight) */}
        <AnimatePresence>
          {!isSidebarCollapsed && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 px-4 mt-6 mb-2 block">
                Briefing Focus
              </span>
              <div className="space-y-[2px]">
                <NavLink
                  to="/dashboard/brief/supply-chain"
                  className={({ isActive }) => `
                    flex items-center gap-2.5 pl-9 pr-4 py-2 text-12.5 transition-all duration-200
                    ${isActive ? 'text-accent-sage font-medium' : 'text-white/40 hover:text-white/70'}
                  `}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${activeNodeId === 'inventory' || activeNodeId === 'operations' ? 'bg-accent-sage' : 'bg-white/20'}`} />
                  Supply Chain
                </NavLink>
                <NavLink
                  to="/dashboard/brief/semiconductor"
                  className={({ isActive }) => `
                    flex items-center gap-2.5 pl-9 pr-4 py-2 text-12.5 transition-all duration-200
                    ${isActive ? 'text-accent-sage font-medium' : 'text-white/40 hover:text-white/70'}
                  `}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  Semiconductors
                </NavLink>
                <NavLink
                  to="/dashboard/brief/market-compliance"
                  className={({ isActive }) => `
                    flex items-center gap-2.5 pl-9 pr-4 py-2 text-12.5 transition-all duration-200
                    ${isActive ? 'text-accent-sage font-medium' : 'text-white/40 hover:text-white/70'}
                  `}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  EU Compliance
                </NavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Actions section */}
      <div className="mt-auto pt-4 border-t border-white/5 space-y-[2px]">
        {/* Collapsible settings / help icons */}
        {bottomItems.map((item, idx) => (
          <button
            key={idx}
            onClick={item.onClick}
            className="w-full flex items-center px-4 py-2.5 text-13 text-white/50 hover:text-white/80 hover:bg-white/[0.02] border-l-2 border-transparent transition-all duration-200 relative group"
          >
            <span className="opacity-70 group-hover:opacity-100 min-w-[20px]">{item.icon}</span>
            {!isSidebarCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="ml-3 truncate"
              >
                {item.label}
              </motion.span>
            )}

            {/* Tooltip for collapsed mode */}
            {isSidebarCollapsed && (
              <div className="absolute left-16 bg-[#18212C] border border-white/5 text-white/90 text-[11px] rounded px-2.5 py-1.5 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap shadow-xl">
                {item.label}
              </div>
            )}
          </button>
        ))}

        {/* Profile Info block */}
        <div className="px-3 pt-2 mt-2">
          <div className="flex items-center gap-3 p-1 hover:bg-white/[0.03] rounded-lg cursor-pointer transition-all overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center text-11 font-bold text-white/80 shrink-0">
              <User size={14} className="opacity-60" />
            </div>
            {!isSidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col min-w-0"
              >
                <span className="text-12 font-medium text-white/80 truncate">Andrew Mercer</span>
                <span className="text-[10px] text-white/30 truncate">Managing Director</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.aside>
  );
};
