import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const THINKING_MESSAGES = [
  '⚡ Ingesting Dataset Stream...',
  '📊 Parsing Business Intelligence...',
  '🧠 Consulting Gemini Intelligence Engine...',
  '📈 Generating Executive Insights...',
  '📑 Preparing Decision Intelligence Workspace...'
];

export const AIThinkingLoader: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % THINKING_MESSAGES.length);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  const currentMessage = THINKING_MESSAGES[index];

  return (
    <div className="flex flex-col gap-3 py-2 select-none">
      <div className="flex items-center gap-3">
        {/* Futuristic glowing breathing indicator */}
        <div className="relative w-6 h-6 flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.25, 0.75, 0.25],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.6,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full bg-[#83D18B]/30 filter blur-[3px]"
          />
          <Sparkles size={14} className="text-[#83D18B] relative z-10 animate-pulse" />
        </div>
        
        <div className="h-6 flex items-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentMessage}
              initial={{ opacity: 0, y: 6, filter: 'blur(2px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(2px)' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="text-12.5 font-bold font-mono text-[#83D18B] tracking-wide"
            >
              {currentMessage}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
