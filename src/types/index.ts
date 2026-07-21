export interface NodeContext {
  id: string;
  title: string;
  summary: string;
  metricLabel: string;
  metric: string;
  trend: 'up' | 'down' | 'neutral';
  opportunity: string;
  risk: string;
  recommendation: string;
}

export interface BriefingReport {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  narrative: string[];
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Optimized';
}

export interface SignalItem {
  id: string;
  title: string;
  category: string;
  score: number;
  delta: string;
  trend: 'positive' | 'negative' | 'neutral';
  note: string;
  chartData: Array<{ time: string; value: number; baseline?: number }>;
  advisory?: {
    insight: string;
    impact: string;
    action: string;
  };
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  summary: string;
  impact: string;
  confidence: number;
  trend: string;
  category: 'Revenue' | 'Marketing' | 'Inventory' | 'Customers' | 'Operations' | 'Risk' | 'Growth';
  whatHappened: string;
  why: string;
  recommendedAction: string;
  targetNodeId: string;
}

export interface CopilotResponse {
  summary: string;
  evidence: string[];
  confidence: number;
  recommendation: string;
  nextQuestion: string;
  relatedMetrics?: string[];
}

export interface ScenarioResponse {
  verdict: string;
  tradeoffs: string;
  risks: string;
  roi: string;
  confidence: number;
  scenarioStatus?: string;
  recommendedAction?: {
    title: string;
    impact: string;
    expectedRevenueIncrease: string;
    complexity: string;
    confidence: number;
    roi: string;
  };
}

