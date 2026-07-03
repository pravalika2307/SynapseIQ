import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Dot } from 'lucide-react';

interface AnalysisLoaderProps {
  onComplete: () => void;
}

export const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({ onComplete }) => {
  const steps = [
    'Reading Dataset',
    'Validating Data',
    'Understanding Business Context',
    'Detecting Trends',
    'Finding Risks',
    'Finding Opportunities',
    'Building Executive Brief',
    'Preparing Decision Workspace',
  ];

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (activeStep >= steps.length) {
      const timer = setTimeout(() => {
        onComplete();
      }, 600);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setActiveStep((prev) => prev + 1);
    }, 1200); // 1.2s per step for a premium, non-rushed feel

    return () => clearTimeout(timer);
  }, [activeStep, steps.length, onComplete]);

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      <div className="flex flex-col gap-1 border-b border-white/5 pb-4 mb-6 select-none">
        <span className="text-[10px] font-bold uppercase tracking-widest text-accent-sage animate-pulse">
          Synthesis Engine Active
        </span>
        <span className="text-12 text-white/40">
          SynapseIQ is processing database telemetry inputs...
        </span>
      </div>

      <div className="space-y-3.5">
        {steps.map((step, idx) => {
          const isCompleted = idx < activeStep;
          const isActive = idx === activeStep;
          const isPending = idx > activeStep;

          return (
            <div 
              key={idx}
              className={`
                flex items-center gap-3.5 text-13.5 transition-all duration-300
                ${isCompleted ? 'text-white/80' : ''}
                ${isActive ? 'text-accent-sage' : ''}
                ${isPending ? 'text-white/20' : ''}
              `}
            >
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.div
                      key="completed"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="text-accent-sage"
                    >
                      <Check size={14} strokeWidth={3} />
                    </motion.div>
                  ) : isActive ? (
                    <motion.div
                      key="active"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                      className="text-accent-sage"
                    >
                      <Dot size={24} strokeWidth={4} />
                    </motion.div>
                  ) : (
                    <div key="pending" className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  )}
                </AnimatePresence>
              </div>

              <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
