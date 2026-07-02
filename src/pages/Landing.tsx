import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, FileText, ArrowRight } from 'lucide-react';
import { useAppStore } from '../features/store';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const setDataset = useAppStore((state) => state.setDataset);
  const setIsDatasetLoaded = useAppStore((state) => state.setIsDatasetLoaded);

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState(0);
  const [greeting, setGreeting] = useState('Good Evening.');

  // Set greeting based on local time
  useEffect(() => {
    const hrs = new Date().getHours();
    if (hrs < 12) setGreeting('Good Morning.');
    else if (hrs < 18) setGreeting('Good Afternoon.');
    else setGreeting('Good Evening.');
  }, []);

  const steps = [
    'Parsing tabular telemetry indices...',
    'Synthesizing supply chain latency paths...',
    'Isolating manufacturer solvency warning flags...',
    'Correlating EU compliance modules...',
    'Structuring business intelligence nodes...'
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    setIsUploading(true);
    setUploadStep(0);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Simulate upload pipeline
  useEffect(() => {
    if (!isUploading) return;

    const interval = setInterval(() => {
      setUploadStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setDataset(file ? file.name : 'synapse_intel_matrix_q2.csv');
            setIsDatasetLoaded(true);
            navigate('/dashboard/brief');
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 900);

    return () => clearInterval(interval);
  }, [isUploading, file, navigate, setDataset, setIsDatasetLoaded, steps.length]);

  return (
    <div className="min-h-screen bg-background relative flex flex-col justify-between overflow-hidden select-none">
      {/* Grid backdrop */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between px-12 h-14 border-b border-white/5 bg-background/80 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-2.5">
          <Sparkles size={18} className="text-accent-sage animate-pulse" />
          <span className="text-14 font-semibold text-white/90 tracking-tight">SynapseIQ</span>
        </div>
        <button 
          onClick={() => {
            setDataset('synapse_intel_matrix_q2.csv');
            setIsDatasetLoaded(true);
            navigate('/dashboard/brief');
          }}
          className="text-12.5 font-medium text-white/40 hover:text-white/80 transition-all flex items-center gap-1.5"
        >
          Quick Demo <ArrowRight size={14} />
        </button>
      </header>

      {/* Main card */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-xl flex flex-col gap-8 items-center text-center">
          <div className="space-y-3">
            <h1 className="text-48 md:text-56 font-bold text-white tracking-tight leading-none font-serif">
              {greeting}
            </h1>
            <p className="text-16 text-white/40 font-serif italic">
              Let's make today's decisions smarter.
            </p>
          </div>

          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`
              w-full bg-card border rounded-2xl overflow-hidden transition-all duration-300 shadow-2xl relative
              ${dragActive ? 'border-accent-sage scale-[1.01]' : 'border-white/5'}
            `}
          >
            <input 
              type="file" 
              id="file-selector"
              onChange={handleFileChange}
              accept=".csv,.xlsx,.xls"
              className="hidden" 
            />
            
            {/* Header info */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.01]">
              <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                Data Intake Well
              </span>
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                {isUploading ? 'Synthesizing...' : 'Idle'}
              </span>
            </div>

            {/* Content area */}
            <div className="p-10 flex flex-col items-center justify-center min-h-[220px]">
              {!isUploading ? (
                <label 
                  htmlFor="file-selector"
                  className="cursor-pointer flex flex-col items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center bg-white/[0.01] group-hover:border-accent-sage-border group-hover:bg-accent-sage-dim transition-all duration-300">
                    <FileText size={20} className="text-white/30 group-hover:text-accent-sage transition-all" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-15 font-semibold text-white/80 tracking-tight">
                      Upload your business dataset
                    </h3>
                    <p className="text-12 text-white/30">
                      Drag and drop file here, or click to browse
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[9.5px] font-bold text-white/40 bg-white/[0.03] border border-white/5 rounded px-2 py-0.5">CSV</span>
                    <span className="text-[9.5px] font-bold text-white/40 bg-white/[0.03] border border-white/5 rounded px-2 py-0.5">EXCEL</span>
                  </div>
                </label>
              ) : (
                <div className="w-full space-y-6 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-12.5 text-white/60 font-mono truncate max-w-[70%]">
                      {file ? file.name : 'synapse_intel_matrix_q2.csv'}
                    </span>
                    <span className="text-12 font-bold text-accent-sage font-mono">
                      {Math.round(((uploadStep + 1) / steps.length) * 100)}%
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent-sage transition-all duration-500 rounded-full"
                      style={{ width: `${((uploadStep + 1) / steps.length) * 100}%` }}
                    />
                  </div>

                  <p className="text-12 text-white/40 italic font-serif">
                    {steps[uploadStep]}
                  </p>
                </div>
              )}
            </div>
          </div>

          <p className="text-11.5 text-white/20">
            SynapseIQ synthesizes standard logs, invoices, or balance logs in under 10 seconds.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-between px-12 h-12 border-t border-white/5 text-[11px] text-white/20 relative z-10">
        <span>© 2026 SynapseIQ Corporation. All rights reserved.</span>
        <span>Enterprise v3.0 · Decision Intelligence</span>
      </footer>
    </div>
  );
};
