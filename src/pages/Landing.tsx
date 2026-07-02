import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Play } from 'lucide-react';
import { useAppStore } from '../features/store';
import { useDemoStore } from '../features/demoStore';
import { UploadZone } from '../components/UploadZone';
import { AnalysisLoader } from '../components/AnalysisLoader';
import { PageTransition } from '../components/PageTransition';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const setDataset = useAppStore((state) => state.setDataset);
  const setIsDatasetLoaded = useAppStore((state) => state.setIsDatasetLoaded);
  
  const startDemo = useDemoStore((state) => state.startDemo);
  const isDemoActive = useDemoStore((state) => state.isDemoActive);
  const nextStep = useDemoStore((state) => state.nextStep);

  const [state, setState] = useState<'hero' | 'loading'>('hero');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setState('loading');
  };

  const handleAnalysisComplete = () => {
    setDataset(selectedFile ? selectedFile.name : 'synapse_intel_matrix_q2.csv');
    setIsDatasetLoaded(true);
    if (isDemoActive) {
      nextStep(); // Advance to Step 3 (Executive Brief)
    } else {
      navigate('/dashboard/brief');
    }
  };

  const handleDemoClick = () => {
    setState('loading');
  };

  const handleStartGuidedDemo = () => {
    startDemo(); // sets isDemoActive to true, step to 1
    nextStep(); // advances to step 2 (AI Ingestion layout)
    setState('loading');
  };

  return (
    <PageTransition className="min-h-screen bg-[#0D1117] flex flex-col justify-between overflow-x-hidden text-[#F5F7FA]">
      {/* Top Navigation */}
      <header className="flex items-center justify-between px-10 md:px-16 h-14 border-b border-white/5 bg-[#0D1117] select-none z-10 shrink-0">
        <div className="flex items-center gap-2.5">
          <Sparkles size={16} className="text-[#79D38A] animate-pulse" />
          <span className="text-13.5 font-bold tracking-tight text-white/90">SynapseIQ</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-12 text-white/40">
          <a href="#docs" onClick={() => alert('Accessing SynapseIQ documentation.')} className="hover:text-white transition-colors">Documentation</a>
          <a href="https://github.com/pravalika2307/SynapseIQ" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
          <a href="#about" onClick={() => alert('SynapseIQ — Executive Decision Intelligence Engine.')} className="hover:text-white transition-colors">About</a>
          <button 
            onClick={() => setState('loading')}
            className="px-4 py-1.5 bg-white/[0.03] border border-white/5 rounded-lg text-white hover:bg-white/[0.06] hover:border-white/10 transition-all font-semibold"
          >
            Get Started
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center py-16 px-6 md:px-12 relative">
        <AnimatePresence mode="wait">
          {state === 'hero' ? (
            <motion.div 
              key="hero"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-4xl flex flex-col lg:flex-row gap-16 items-center lg:text-left text-center"
            >
              {/* Left Column: Premium Headline */}
              <div className="flex-1 space-y-6">
                <h1 className="text-36 md:text-48 font-bold tracking-tight text-white leading-[1.1] font-serif">
                  Your business already has the answers.<br />
                  <span className="text-[#79D38A] italic font-normal font-serif">We help you discover them.</span>
                </h1>
                
                <p className="text-14.5 text-white/40 leading-relaxed max-w-xl">
                  Upload your business data and let SynapseIQ uncover trends, risks, opportunities and strategic recommendations using AI.
                </p>

                <div className="flex flex-wrap gap-4 items-center justify-center lg:justify-start pt-2">
                  <button 
                    onClick={() => {
                      // Trigger file input upload manually
                      const clickTarget = document.querySelector('input[type="file"]') as HTMLInputElement;
                      clickTarget?.click();
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#79D38A] text-[#0D1117] font-semibold text-13 hover:bg-[#79D38A]/90 active:scale-98 transition-all animate-pulse-subtle"
                  >
                    Analyze My Data <ArrowRight size={14} />
                  </button>

                  <button 
                    onClick={handleStartGuidedDemo}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#79D38A]/10 border border-[#79D38A]/30 text-[#79D38A] hover:bg-[#79D38A]/20 transition-all font-semibold text-13"
                  >
                    🎥 Start Guided Demo
                  </button>

                  <button 
                    onClick={handleDemoClick}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/[0.03] border border-white/5 text-white/80 hover:bg-white/[0.06] hover:border-white/10 hover:text-white transition-all font-semibold text-13"
                  >
                    <Play size={12} fill="currentColor" /> Watch Demo
                  </button>
                </div>
              </div>

              {/* Right Column: Premium Upload Area */}
              <div className="w-full max-w-md shrink-0">
                <div className="bg-[#151B23] border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.01] select-none">
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                      Data Intake Portal
                    </span>
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">
                      Ready
                    </span>
                  </div>

                  <div className="p-8">
                    <UploadZone onFileSelected={handleFileSelect} />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="loading"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full max-w-md bg-[#151B23] border border-white/5 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.01] select-none">
                <span className="text-[9px] font-bold text-[#79D38A] uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#79D38A] animate-pulse" />
                  Synthesis Pipeline
                </span>
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider font-mono">
                  {selectedFile ? 'Custom Matrix' : 'Standard Demo'}
                </span>
              </div>
              
              <div className="p-8 py-10">
                <AnalysisLoader onComplete={handleAnalysisComplete} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-between px-10 md:px-16 h-12 border-t border-white/5 text-[11px] text-white/20 relative z-10 shrink-0">
        <span>© 2026 SynapseIQ Corporation. All rights reserved.</span>
        <span>Executive Intelligence System · Region Q2</span>
      </footer>
    </PageTransition>
  );
};
