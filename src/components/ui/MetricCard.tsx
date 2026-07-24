import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Card } from './Card';

export interface MetricCardProps {
  label: string;
  value: string;
  trend?: {
    value: string;
    type: 'up' | 'down' | 'neutral';
  };
  description?: string;
  sparkline?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  trend,
  description,
  sparkline
}) => {
  const trendColors = {
    up: 'text-accent-sage',
    down: 'text-critical',
    neutral: 'text-warn',
  };

  const TrendIcon = trend 
    ? trend.type === 'up' 
      ? ArrowUpRight 
      : trend.type === 'down' 
        ? ArrowDownRight 
        : Minus
    : null;

  return (
    <Card elevation="flat" hoverEffect className="p-6 flex flex-col justify-between overflow-hidden relative group">
      <div>
        <span className="text-11 font-bold uppercase tracking-wider text-white/35 block mb-2 select-none font-mono">
          {label}
        </span>
        <div className={`text-28 font-bold tracking-tight mb-1 font-sans ${trend ? trendColors[trend.type] : 'text-white'}`}>
          {value}
        </div>
        
        {trend && (
          <div className="text-13 text-white/40 flex items-center gap-1 font-mono">
            {TrendIcon && <TrendIcon size={12} className={trendColors[trend.type]} />}
            <span>{trend.value}</span>
          </div>
        )}

        {description && !trend && (
          <div className="text-13 text-white/40 font-sans">
            {description}
          </div>
        )}
      </div>

      {sparkline && (
        <div className="h-9 w-full mt-5 shrink-0 opacity-40 group-hover:opacity-60 transition-opacity">
          {sparkline}
        </div>
      )}
    </Card>
  );
};
