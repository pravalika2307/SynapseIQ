import React from 'react';
import { ShieldCheck, Cpu, Database, CheckCircle2 } from 'lucide-react';

export interface AITrustBadgeProps {
  confidence?: number | string;
  sourceCoverage?: string;
  dataFreshness?: string;
  verified?: boolean;
  className?: string;
}

export const AITrustBadge: React.FC<AITrustBadgeProps> = ({
  confidence = 94,
  sourceCoverage = '100% Telemetry',
  dataFreshness = 'Live',
  verified = true,
  className = ''
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-2 text-[10px] font-mono select-none ${className}`}>
      {verified && (
        <div className="flex items-center gap-1 bg-[#83D18B]/10 text-[#83D18B] border border-[#83D18B]/20 rounded-md px-2 py-0.5">
          <CheckCircle2 size={11} className="shrink-0" />
          <span className="font-bold uppercase tracking-wider">AI Verified</span>
        </div>
      )}

      {confidence && (
        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/10 text-white/70 rounded-md px-2 py-0.5">
          <ShieldCheck size={11} className="text-[#83D18B] shrink-0" />
          <span>Confidence: <strong className="text-white font-bold">{confidence}%</strong></span>
        </div>
      )}

      {sourceCoverage && (
        <div className="hidden sm:flex items-center gap-1 bg-white/[0.03] border border-white/10 text-white/60 rounded-md px-2 py-0.5">
          <Database size={10} className="text-white/40 shrink-0" />
          <span>Coverage: <strong className="text-white/80">{sourceCoverage}</strong></span>
        </div>
      )}

      {dataFreshness && (
        <div className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/10 text-white/50 rounded-md px-2 py-0.5">
          <Cpu size={10} className="text-white/40 shrink-0" />
          <span>Freshness: <strong className="text-white/80">{dataFreshness}</strong></span>
        </div>
      )}
    </div>
  );
};
