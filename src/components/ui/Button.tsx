import React from 'react';
import { motion } from 'framer-motion';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'critical' | 'warn';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-sans font-semibold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-sage/50 disabled:opacity-50 disabled:pointer-events-none select-none';
  
  const variants = {
    primary: 'bg-accent-sage text-background hover:bg-accent-sage/90 active:bg-accent-sage/80',
    secondary: 'bg-white/[0.03] border border-white/5 text-white/80 hover:bg-white/[0.06] hover:text-white hover:border-white/10',
    ghost: 'text-white/60 hover:text-white hover:bg-white/[0.04]',
    critical: 'bg-critical/15 border border-critical/20 text-critical hover:bg-critical/25',
    warn: 'bg-warn/15 border border-warn/20 text-warn hover:bg-warn/25',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-11.5',
    md: 'px-4.5 py-2 text-13',
    lg: 'px-6 py-2.5 text-14.5',
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};
