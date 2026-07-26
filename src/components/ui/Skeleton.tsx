import React from 'react';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', style }) => {
  return (
    <div 
      style={style}
      className={`
        relative overflow-hidden bg-white/[0.03] border border-white/5 rounded-xl
        before:absolute before:inset-0 before:-translate-x-full 
        before:animate-[shimmer_1.8s_infinite] 
        before:bg-gradient-to-r before:from-transparent before:via-white/[0.05] before:to-transparent
        ${className}
      `}
    />
  );
};

export const SkeletonCard: React.FC<{ rows?: number }> = ({ rows = 3 }) => {
  return (
    <div className="p-5 bg-[#12161D]/90 border border-white/10 rounded-2xl space-y-4 select-none">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32 rounded-lg" />
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>
      <Skeleton className="h-8 w-24 rounded-lg" />
      <div className="space-y-2 pt-2 border-t border-white/5">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
};

export const SkeletonChart: React.FC = () => {
  return (
    <div className="p-6 bg-[#12161D]/90 border border-white/10 rounded-2xl space-y-4 select-none h-[300px] flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-40 rounded-lg" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex items-end justify-between gap-3 h-44 pt-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="w-full rounded-t-lg" style={{ height: `${Math.max(25, (i * 17) % 100)}%` }} />
        ))}
      </div>
    </div>
  );
};
