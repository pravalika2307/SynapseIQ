import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const baseStyles = 'inline-flex items-center justify-center font-sans font-medium rounded-xl transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-sage/40 disabled:opacity-40 disabled:pointer-events-none select-none cursor-pointer overflow-hidden relative tracking-tight';
  
  const variants = {
    primary: 'bg-accent-sage text-background font-semibold shadow-md shadow-accent-sage/5 hover:bg-[#97DD9E] active:bg-accent-sage/80 hover:shadow-[0_4px_14px_rgba(131,209,139,0.22)]',
    secondary: 'bg-white/[0.03] border border-white/[0.08] text-white/85 hover:bg-white/[0.06] hover:text-white hover:border-white/15 active:bg-white/[0.08]',
    ghost: 'text-white/60 hover:text-white hover:bg-white/[0.04] active:bg-white/[0.06]',
    critical: 'bg-critical/15 border border-critical/20 text-critical hover:bg-critical/25 active:bg-critical/30',
    warn: 'bg-warn/15 border border-warn/20 text-warn hover:bg-warn/25 active:bg-warn/30',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-11',
    md: 'px-4 py-2 text-12.5',
    lg: 'px-5 py-2.5 text-13.5',
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };
    
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <motion.button
      whileHover={{ y: -1.5 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleButtonClick}
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      {...(props as any)}
    >
      <span className="relative z-10 flex items-center justify-center gap-1.5">{children}</span>
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.35 }}
            animate={{ scale: 4.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="absolute rounded-full bg-white/20 pointer-events-none z-0"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: '20px',
              height: '20px',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
};
