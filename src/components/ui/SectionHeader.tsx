import React from 'react';

export interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  label,
  title,
  description
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-sage animate-pulse-ring" />
        <span className="text-[9.5px] font-bold uppercase tracking-widest text-accent-sage/80 font-mono">
          {label}
        </span>
      </div>
      <h2 className="text-18 md:text-20 font-bold tracking-tight text-white/95 leading-tight font-sans">
        {title}
      </h2>
      {description && (
        <p className="text-12 md:text-12.5 text-white/45 leading-relaxed max-w-[640px] font-sans">
          {description}
        </p>
      )}
    </div>
  );
};
