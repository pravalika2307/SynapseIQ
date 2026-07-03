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
  const baseStyles = 'rounded-2xl border transition-all duration-500 ease-out overflow-hidden';
  
  const elevations = {
    flat: 'bg-card border-white/5 shadow-sm',
    raised: 'bg-card border-white/10 shadow-md',
    elevated: 'bg-white/[0.01] border-white/5 shadow-2xl backdrop-blur-md',
  };

  const hoverStyles = hoverEffect 
    ? 'hover:border-white/10 hover:scale-[1.015] hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:bg-white/[0.015]' 
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
