import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5 relative">
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-white/30 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full bg-[#12161D] border rounded-xl py-2 px-3.5 text-12.5 text-white/90 placeholder-white/25 outline-none transition-all duration-150 font-sans tracking-tight
            ${icon ? 'pl-9.5' : ''}
            ${error 
              ? 'border-critical focus:border-critical focus:ring-2 focus:ring-critical/20' 
              : 'border-white/[0.08] focus:border-[#83D18B]/50 focus:bg-white/[0.03] focus:ring-2 focus:ring-[#83D18B]/20'
            }
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <span className="text-[11px] font-medium text-critical tracking-wide block">
          {error}
        </span>
      )}
    </div>
  );
};
