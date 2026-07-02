import { create } from 'zustand';

interface DemoState {
  isDemoActive: boolean;
  currentStep: number;
  isPaused: boolean;
  
  startDemo: () => void;
  exitDemo: () => void;
  pauseDemo: () => void;
  resumeDemo: () => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
}

export const useDemoStore = create<DemoState>((set) => ({
  isDemoActive: false,
  currentStep: 1,
  isPaused: false,

  startDemo: () => set({ isDemoActive: true, currentStep: 1, isPaused: false }),
  exitDemo: () => set({ isDemoActive: false, currentStep: 1, isPaused: false }),
  pauseDemo: () => set({ isPaused: true }),
  resumeDemo: () => set({ isPaused: false }),
  
  nextStep: () => set((state) => ({ 
    currentStep: Math.min(8, state.currentStep + 1) 
  })),
  
  prevStep: () => set((state) => ({ 
    currentStep: Math.max(1, state.currentStep - 1) 
  })),
  
  setStep: (step: number) => set({ currentStep: step })
}));
