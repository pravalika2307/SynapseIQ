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
}
