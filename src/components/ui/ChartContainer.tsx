import React from 'react';
import { Card } from './Card';
import { Info } from 'lucide-react';

export interface ChartContainerProps {
  title: string;
  subtitle?: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
}

export const ChartContainer: React.FC<ChartContainerProps> = React.memo(({
  title,
  subtitle,
  extra,
  children
}) => {
  return (
    <Card elevation="flat" className="p-5 md:p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between pb-1">
        <div className="flex flex-col gap-0.5 select-none">
          <span className="text-[9.5px] font-bold text-white/35 uppercase tracking-wider font-mono">
            {title}
          </span>
          {subtitle && (
            <span className="text-11 text-white/40 leading-none font-sans">
              {subtitle}
            </span>
          )}
        </div>
        
        {extra ? extra : (
          <div className="flex items-center gap-1 text-[10px] text-white/30 bg-[#151B23]/60 border border-white/5 rounded-md px-2 py-0.5 font-mono select-none">
            <Info size={11} /> Real-time telemetry
          </div>
        )}
      </div>

      <div className="w-full relative pt-1 pb-1">
        {children}
      </div>
    </Card>
  );
});

ChartContainer.displayName = 'ChartContainer';
