import { create } from 'zustand';

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  references?: {
    summary: string;
    evidence: string[];
    confidence: number;
    recommendation: string;
  };
}

interface AppState {
  // Dataset Upload State
  datasetName: string | null;
  uploadProgress: number;
  isUploading: boolean;
  isDatasetLoaded: boolean;
  
  // Dashboard Context State
  activeNodeId: string;
  copilotContextNodeId: string;
  
  // Forecast scenario modeler state
  selectedScenario: 'baseline' | 'optimized';
  scenarioInputs: {
    capitalRatio: number; // percentage (0 - 100)
    safetyStock: number;   // days (0 - 90)
    mexicanPivot: boolean;
  };
  
  // Decision Copilot conversation logs
  messages: CopilotMessage[];
  
  // Actions
  setDataset: (name: string | null) => void;
  setUploadProgress: (progress: number) => void;
  setIsUploading: (uploading: boolean) => void;
  setIsDatasetLoaded: (loaded: boolean) => void;
  setActiveNodeId: (id: string) => void;
  setCopilotContextNodeId: (id: string) => void;
  setSelectedScenario: (scenario: 'baseline' | 'optimized') => void;
  updateScenarioInputs: (inputs: Partial<{ capitalRatio: number; safetyStock: number; mexicanPivot: boolean }>) => void;
  addMessage: (text: string, sender: 'user' | 'assistant', references?: CopilotMessage['references']) => void;
  resetMessages: () => void;
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  datasetName: 'synapse_intel_matrix_q2.csv',
  uploadProgress: 0,
  isUploading: false,
  isDatasetLoaded: true, // Default to loaded so the dashboard works out of the box
  
  activeNodeId: 'health',
  copilotContextNodeId: 'health',
  isSidebarCollapsed: false,
  
  selectedScenario: 'baseline',
  scenarioInputs: {
    capitalRatio: 45,
    safetyStock: 30,
    mexicanPivot: false,
  },
  
  messages: [
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Good evening. I have finished synthesizing the Q2 operations matrix. Where should we begin our consultation?',
      timestamp: new Date(),
    }
  ],
  
  setDataset: (name) => set({ datasetName: name }),
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  setIsUploading: (uploading) => set({ isUploading: uploading }),
  setIsDatasetLoaded: (loaded) => set({ isDatasetLoaded: loaded }),
  
  setActiveNodeId: (id) => set({ activeNodeId: id }),
  setCopilotContextNodeId: (id) => set({ copilotContextNodeId: id, activeNodeId: id }),
  setSelectedScenario: (scenario) => set({ selectedScenario: scenario }),
  updateScenarioInputs: (inputs) => set((state) => ({
    scenarioInputs: { ...state.scenarioInputs, ...inputs }
  })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  
  addMessage: (text, sender, references) => set((state) => ({
    messages: [
      ...state.messages,
      {
        id: Math.random().toString(36).substring(7),
        sender,
        text,
        timestamp: new Date(),
        references,
      }
    ]
  })),
  
  resetMessages: () => set({
    messages: [
      {
        id: 'welcome',
        sender: 'assistant',
        text: 'System contextual state reset. How can I assist you with your business strategy today?',
        timestamp: new Date(),
      }
    ]
  })
}));
