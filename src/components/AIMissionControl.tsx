import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { IntelligenceMesh } from './IntelligenceMesh';

interface AIMissionControlProps {
  onComplete: () => void;
}

export const AIMissionControl: React.FC<AIMissionControlProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const initSteps = [
    { text: 'Initializing SynapseIQ...', label: 'Initializing SynapseIQ...' },
    { text: 'Dataset Profiled', label: '✓ Dataset Profiled' },
    { text: 'Business Metrics Mapped', label: '✓ Business Metrics Mapped' },
    { text: 'AI Intelligence Activated', label: '✓ AI Intelligence Activated' },
    { text: 'Decision Engine Ready', label: '✓ Decision Engine Ready' }
  ];

  useEffect(() => {
    // Advance steps sequentially every 500ms to keep total duration under 2.5 seconds
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= 4) {
          clearInterval(interval);
          // Wait a moment and then complete the sequence
          setTimeout(() => {
            onComplete();
          }, 450);
          return 4;
        }
        return prev + 1;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-[#050608] flex items-center justify-center p-6 select-none font-sans"
    >
      <IntelligenceMesh />
      
      <motion.div 
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm bg-[#0D1117]/85 border border-[#83D18B]/20 rounded-2xl p-7.5 shadow-[0_12px_45px_rgba(131,209,139,0.06)] backdrop-blur-md relative z-10 flex flex-col gap-6"
      >
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <Sparkles className="text-[#83D18B] animate-pulse" size={16} />
          <h3 className="text-11.5 font-bold text-white/90 uppercase tracking-widest font-sans">AI Initialization</h3>
        </div>

        <div className="flex flex-col gap-4 text-left font-mono">
          {initSteps.map((item, idx) => {
            const isVisible = step >= idx;
            if (!isVisible) return null;

            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className={`text-13 tracking-wide select-none ${idx === 0 ? 'text-white/80' : 'text-[#83D18B] font-semibold'}`}
              >
                {item.label}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};
