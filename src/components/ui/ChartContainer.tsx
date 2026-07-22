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
    <Card elevation="flat" className="p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5 select-none">
          <span className="text-[9.5px] font-bold text-white/30 uppercase tracking-wider">
            {title}
          </span>
          {subtitle && (
            <span className="text-11.5 text-white/40 leading-none">
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

      <div className="w-full relative">
        {children}
      </div>
    </Card>
  );
});

ChartContainer.displayName = 'ChartContainer';
