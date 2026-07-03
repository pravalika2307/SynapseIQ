import { create } from 'zustand';
import type { NodeContext, SignalItem, BriefingReport, TimelineEvent } from '../types';
import { parseCSV, type DatasetSummary } from './csvParser';
import { generateGeminiAnalysis, getStoredApiKey, setStoredApiKey } from './geminiService';
import { generateLocalAnalysis } from './localAnalysis';
import { 
  nodeContexts as defaultNodeContexts, 
  businessSignals as defaultBusinessSignals, 
  briefingReports as defaultBriefingReports,
  timelineEvents as defaultTimelineEvents
} from './data';

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
    relatedMetrics?: string[];
    nextQuestion?: string;
  };
}

interface AppState {
  // Dataset Ingestion & Profile State
  datasetName: string | null;
  rawCSVData: string | null;
  parsedData: DatasetSummary | null;
  uploadProgress: number;
  isUploading: boolean;
  isDatasetLoaded: boolean;
  
  // Dashboard Context Data state (Dynamic)
  nodeContexts: Record<string, NodeContext>;
  businessSignals: SignalItem[];
  briefingReports: BriefingReport[];
  timelineEvents: TimelineEvent[];
  strategyCanvasEdges: { source: string; target: string; correlation?: number }[];
  
  // Active Workspace Focus states
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
  
  // Gemini Configuration
  geminiApiKey: string | null;
  isLoadingAnalysis: boolean;
  analysisError: string | null;
  
  // Layout states
  isSidebarCollapsed: boolean;
  isPresentationMode: boolean;
  copilotPreloadQuery: string | null;
  
  // Actions
  setDatasetName: (name: string | null) => void;
  setUploadProgress: (progress: number) => void;
  setIsUploading: (uploading: boolean) => void;
  setIsDatasetLoaded: (loaded: boolean) => void;
  setActiveNodeId: (id: string) => void;
  setCopilotContextNodeId: (id: string) => void;
  setSelectedScenario: (scenario: 'baseline' | 'optimized') => void;
  updateScenarioInputs: (inputs: Partial<{ capitalRatio: number; safetyStock: number; mexicanPivot: boolean }>) => void;
  addMessage: (text: string, sender: 'user' | 'assistant', references?: CopilotMessage['references']) => void;
  resetMessages: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setPresentationMode: (active: boolean) => void;
  setCopilotPreloadQuery: (query: string | null) => void;
  
  // Intelligence Actions
  setGeminiApiKey: (key: string | null) => void;
  triggerAnalysis: (csvText: string, fileName: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  datasetName: 'synapse_intel_matrix_q2.csv',
  rawCSVData: null,
  parsedData: null,
  uploadProgress: 0,
  isUploading: false,
  isDatasetLoaded: false,
  
  nodeContexts: defaultNodeContexts,
  businessSignals: defaultBusinessSignals,
  briefingReports: defaultBriefingReports,
  timelineEvents: defaultTimelineEvents,
  strategyCanvasEdges: [],
  
  activeNodeId: 'health',
  copilotContextNodeId: 'health',
  isSidebarCollapsed: false,
  isPresentationMode: localStorage.getItem('synapse_presentation_mode') === 'true',
  copilotPreloadQuery: null,
  
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
  
  geminiApiKey: getStoredApiKey(),
  isLoadingAnalysis: false,
  analysisError: null,
  
  setDatasetName: (name) => set({ datasetName: name }),
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
  setPresentationMode: (active) => {
    localStorage.setItem('synapse_presentation_mode', active ? 'true' : 'false');
    set({ isPresentationMode: active });
  },
  setCopilotPreloadQuery: (query) => set({ copilotPreloadQuery: query }),
  
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
  
  resetMessages: () => {
    const activeNode = get().activeNodeId;
    const nodeTitle = get().nodeContexts[activeNode]?.title || 'composite index';
    set({
      messages: [
        {
          id: 'welcome',
          sender: 'assistant',
          text: `System contextual state reset. I am currently focused on "${nodeTitle}". Ask me any strategy question about this node context.`,
          timestamp: new Date(),
        }
      ]
    });
  },
  
  setGeminiApiKey: (key) => {
    setStoredApiKey(key);
    set({ geminiApiKey: key });
  },
  
  triggerAnalysis: async (csvText, fileName) => {
    set({ isLoadingAnalysis: true, analysisError: null, rawCSVData: csvText, datasetName: fileName });
    
    try {
      // 1. Validate and Parse Dataset client-side (computes correlations, KPIs)
      const summary = parseCSV(csvText, fileName);
      set({ parsedData: summary });
      
      const localInsights = generateLocalAnalysis(summary);
      const apiKey = get().geminiApiKey;
      
      if (apiKey && apiKey.trim() !== '') {
        try {
          // 2. Call Gemini for high-fidelity contextual insights
          const insights = await generateGeminiAnalysis(apiKey, summary);
          
          set({
            nodeContexts: insights.nodeContexts,
            businessSignals: insights.businessSignals,
            briefingReports: insights.briefingReports,
            timelineEvents: (insights as any).timelineEvents || localInsights.timelineEvents,
            strategyCanvasEdges: insights.strategyCanvasEdges,
            isDatasetLoaded: true,
            isLoadingAnalysis: false
          });
          return;
        } catch (apiErr: any) {
          console.warn('Gemini API Analysis failed, falling back to local heuristic calculations:', apiErr);
          set({ analysisError: `Gemini API Call failed: ${apiErr.message}. Loaded in local analysis fallback mode.` });
        }
      }
      
      // 3. Heuristic Fallback Analysis
      // Calculate dynamic edges based on actual correlations
      const edges: { source: string; target: string; correlation?: number }[] = [];
      const metrics = summary.detectedMetrics;
      
      // Map standard metrics to edges if they exist and correlate
      const metricKeys = Object.keys(metrics).filter(k => metrics[k as keyof typeof metrics] !== null);
      metricKeys.forEach(k1 => {
        metricKeys.forEach(k2 => {
          if (k1 < k2) {
            const col1 = metrics[k1 as keyof typeof metrics]!;
            const col2 = metrics[k2 as keyof typeof metrics]!;
            const corr = summary.correlations[col1]?.[col2] || 0;
            if (Math.abs(corr) > 0.35) {
              edges.push({
                source: k1,
                target: k2,
                correlation: corr
              });
            }
          }
        });
      });
      
      // Ensure at least baseline connections exist if none exceed threshold
      if (edges.length === 0) {
        edges.push(
          { source: 'revenue', target: 'profit' },
          { source: 'marketing', target: 'revenue' },
          { source: 'inventory', target: 'operations' },
          { source: 'customers', target: 'revenue' }
        );
      }
      
      set({
        nodeContexts: localInsights.nodeContexts,
        businessSignals: localInsights.businessSignals,
        briefingReports: localInsights.briefingReports,
        timelineEvents: localInsights.timelineEvents,
        strategyCanvasEdges: edges,
        isDatasetLoaded: true,
        isLoadingAnalysis: false
      });
      
    } catch (err: any) {
      console.error('Failed to analyze dataset:', err);
      set({ 
        analysisError: err.message || 'Unknown parsing error.',
        isLoadingAnalysis: false,
        isDatasetLoaded: false
      });
      throw err;
    }
  }
}));
