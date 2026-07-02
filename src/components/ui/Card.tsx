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
  const baseStyles = 'rounded-xl border transition-all duration-300 overflow-hidden';
  
  const elevations = {
    flat: 'bg-card border-white/5 shadow-sm',
    raised: 'bg-card border-white/10 shadow-md',
    elevated: 'bg-white/[0.01] border-white/5 shadow-2xl backdrop-blur-md',
  };

  const hoverStyles = hoverEffect 
    ? 'hover:border-white/15 hover:-translate-y-0.5 hover:shadow-lg' 
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
