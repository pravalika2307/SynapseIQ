import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  badgeText?: string;
  hintText?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  badgeText = 'AI Telemetry Workspace',
  hintText
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="p-8 md:p-12 bg-[#12161D]/80 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md text-center flex flex-col items-center gap-4 max-w-lg mx-auto select-none font-sans relative overflow-hidden"
    >
      {/* Glow Backdrop Accent */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#83D18B]/50 to-transparent" />
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#83D18B]/5 blur-3xl rounded-full pointer-events-none" />

      {/* Icon Badge Container */}
      <div className="w-12 h-12 rounded-2xl bg-[#83D18B]/10 border border-[#83D18B]/20 flex items-center justify-center text-[#83D18B] shadow-inner shrink-0">
        {icon || <Sparkles size={20} className="animate-pulse" />}
      </div>

      <span className="text-11 font-bold uppercase tracking-widest text-[#83D18B] font-mono">
        {badgeText}
      </span>

      <div className="space-y-1.5 text-center">
        <h3 className="text-18 font-bold text-white/95 tracking-tight font-sans">
          {title}
        </h3>
        <p className="text-13 text-white/60 leading-relaxed font-sans max-w-md">
          {description}
        </p>
      </div>

      {hintText && (
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-12 text-white/50 font-mono w-full text-left">
          💡 <span className="text-white/70">{hintText}</span>
        </div>
      )}

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-5 py-2.5 bg-[#83D18B] hover:bg-[#97DD9E] text-[#050608] font-bold text-13 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center gap-2 font-sans shadow-lg"
        >
          <span>{actionText}</span>
          <ArrowRight size={14} />
        </button>
      )}
    </motion.div>
  );
};
