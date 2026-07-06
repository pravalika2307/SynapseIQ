import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const THINKING_MESSAGES = [
  '🧠 Analyzing Business Signals...',
  '📊 Correlating Business Metrics...',
  '⚡ Detecting Risks & Opportunities...',
  '🤖 Generating Strategic Recommendations...',
  '📑 Preparing Executive Summary...'
];

export const AIThinkingLoader: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % THINKING_MESSAGES.length);
    }, 1800); // Cycle every 1.8s
    return () => clearInterval(interval);
  }, []);

  const currentMessage = THINKING_MESSAGES[index];

  return (
    <div className="flex flex-col gap-3 py-2 select-none">
      <div className="flex items-center gap-3">
        {/* Futuristic glowing breathing indicator */}
        <div className="relative w-5 h-5 flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.35, 1],
              opacity: [0.25, 0.75, 0.25],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.6,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full bg-[#83D18B]/25 filter blur-[2px]"
          />
          <div className="w-2 h-2 rounded-full bg-[#83D18B] shadow-[0_0_8px_rgba(131,209,139,0.8)]" />
        </div>
        
        <div className="h-6 flex items-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentMessage}
              initial={{ opacity: 0, y: 8, filter: 'blur(2px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="text-13 font-medium font-serif italic text-[#83D18B] tracking-wide"
            >
              {currentMessage}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
