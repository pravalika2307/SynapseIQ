import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'sage' | 'critical' | 'warn' | 'neutral';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-11 font-bold tracking-wider uppercase border select-none font-mono';
  
  const variants = {
    sage: 'bg-accent-sage-dim text-accent-sage border-accent-sage-border',
    critical: 'bg-critical/10 text-critical border-critical/20',
    warn: 'bg-warn/10 text-warn border-warn/20',
    neutral: 'bg-white/[0.02] text-white/50 border-white/5',
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
