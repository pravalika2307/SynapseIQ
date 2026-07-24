import React from 'react';
import { motion } from 'framer-motion';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  elevation?: 'flat' | 'raised' | 'elevated';
}

export const Card: React.FC<CardProps> = ({
  hoverEffect = true,
  elevation = 'flat',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'rounded-2xl border transition-all duration-200 ease-out overflow-hidden';
  
  const elevations = {
    flat: 'bg-[#12161D]/80 border-white/[0.06] shadow-sm backdrop-blur-sm',
    raised: 'bg-[#151B23] border-white/[0.08] shadow-md',
    elevated: 'bg-white/[0.015] border-white/[0.06] shadow-xl backdrop-blur-md',
  };

  const hoverStyles = hoverEffect 
    ? 'hover:border-[#83D18B]/25 hover:-translate-y-1 hover:shadow-[0_10px_32px_rgba(0,0,0,0.45),0_0_16px_rgba(131,209,139,0.04)] hover:bg-white/[0.02]' 
    : '';

  return (
    <motion.div
      className={`
        ${baseStyles} 
        ${elevations[elevation]} 
        ${hoverStyles} 
        ${className}
      `}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
};
