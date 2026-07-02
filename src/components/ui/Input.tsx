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
            w-full bg-card border rounded-lg py-2 px-3 text-13 text-white/90 placeholder-white/20 outline-none transition-all duration-300
            ${icon ? 'pl-9' : ''}
            ${error 
              ? 'border-critical focus:border-critical focus:ring-4 focus:ring-critical/5' 
              : 'border-white/5 focus:border-accent-sage-border focus:bg-white/[0.05] focus:ring-4 focus:ring-accent-sage/5'
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
