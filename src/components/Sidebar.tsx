import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FileText, 
  Activity, 
  Compass, 
  MessageSquare, 
  TrendingUp, 
  Layers 
} from 'lucide-react';
import { useAppStore } from '../features/store';

export const Sidebar: React.FC = () => {
  const activeNodeId = useAppStore((state) => state.activeNodeId);

  const navItems = [
    {
      to: '/dashboard/brief',
      icon: <FileText size={16} />,
      label: 'Executive Brief'
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
      label: 'Board Reports'
    }
  ];

  return (
    <aside className="w-56 bg-background border-r border-white/5 flex flex-col h-full shrink-0 select-none py-6">
      <div className="flex flex-col flex-1 overflow-y-auto px-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-text-4 px-4 mb-2 text-white/30 block">
          Workspace
        </span>

        <nav className="space-y-[2px]">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-2.5 text-13 transition-all duration-200 border-l-2
                ${isActive 
                  ? 'text-white border-accent-sage bg-accent-sage/5 font-medium' 
                  : 'text-white/50 border-transparent hover:text-white/80 hover:bg-white/[0.02]'
                }
              `}
            >
              <span className="opacity-70 group-hover:opacity-100">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-bold bg-accent-sage-dim text-accent-sage border border-accent-sage-border rounded-full px-2 py-0.5">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

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
      </div>

      <div className="mt-auto px-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-3 p-2 hover:bg-white/[0.03] rounded-lg cursor-pointer transition-all">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center text-11 font-bold text-white/80">
            AM
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-12 font-medium text-white/80 truncate">Andrew Mercer</span>
            <span className="text-[10px] text-white/30 truncate">Managing Director</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
