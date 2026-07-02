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
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2 select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-sage animate-pulse-ring" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-accent-sage/80">
          {label}
        </span>
      </div>
      <h2 className="text-22 font-semibold tracking-tight text-white/95 leading-none">
        {title}
      </h2>
      {description && (
        <p className="text-13.5 text-white/40 leading-relaxed max-w-[620px] -mt-1 font-serif">
          {description}
        </p>
      )}
    </div>
  );
};
