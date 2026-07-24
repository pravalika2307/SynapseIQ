import React, { useState } from 'react';
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
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hoverEffect) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: (y / (rect.height / 2)) * -2.5,
      y: (x / (rect.width / 2)) * 2.5,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const baseStyles = 'rounded-2xl border transition-all duration-200 ease-out overflow-hidden';
  
  const elevations = {
    flat: 'bg-[#12161D]/80 border-white/[0.06] shadow-sm backdrop-blur-sm',
    raised: 'bg-[#151B23] border-white/[0.08] shadow-md',
    elevated: 'bg-white/[0.015] border-white/[0.06] shadow-xl backdrop-blur-md',
  };

  const hoverStyles = hoverEffect 
    ? 'hover:border-[#83D18B]/25 hover:shadow-[0_12px_36px_rgba(0,0,0,0.45),0_0_16px_rgba(131,209,139,0.05)] hover:bg-white/[0.02]' 
    : '';

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={hoverEffect ? { rotateX: tilt.x, rotateY: tilt.y } : {}}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      style={{ transformStyle: 'preserve-3d' }}
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
