/**
 * Represents a strategic node context payload displayed on the Executive Brief and Strategy Canvas.
 */
export interface NodeContext {
  /** Unique metric identifier (e.g. 'health', 'revenue', 'profit') */
  id: string;
  /** Display title for the metric context */
  title: string;
  /** High-level executive synthesis summary */
  summary: string;
  /** Label describing the metric value (e.g. 'Operating Margin') */
  metricLabel: string;
  /** Formatted metric value (e.g. '42.8%') */
  metric: string;
  /** Operational trend direction */
  trend: 'up' | 'down' | 'neutral';
  /** Primary opportunity vector identified by AI analysis */
  opportunity: string;
  /** Primary risk factor identified by AI analysis */
  risk: string;
  /** Stringified JSON payload conforming to executive recommendation structure */
  recommendation: string;
}

/**
 * Represents a 9-paragraph Boardroom Briefing Dossier formatted for steering committee review.
 */
export interface BriefingReport {
  /** Unique dossier identifier */
  id: string;
  /** Title of the boardroom briefing dossier */
  title: string;
  /** Categorical domain (e.g. 'Strategic Planning') */
  category: string;
  /** Generation date string */
  date: string;
  /** Executive summary snippet */
  summary: string;
  /** Exactly 9 narrative paragraphs adhering to McKinsey format rules */
  narrative: string[];
  /** Overall risk status tier */
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Optimized';
}

/**
 * Represents a real-time telemetry signal card in the Business Signals matrix.
 */
export interface SignalItem {
  /** Unique signal identifier */
  id: string;
  /** Title of the telemetry signal */
  title: string;
  /** Categorical domain (e.g. 'Supply Chain', 'Financial Solvency') */
  category: string;
  /** Telemetry score rating (0-100) */
  score: number;
  /** Period-over-period delta string (e.g. '+2.4%') */
  delta: string;
  /** Trend classification */
  trend: 'positive' | 'negative' | 'neutral';
  /** Brief operational observation note */
  note: string;
  /** Micro sparkline dataset points */
  chartData: Array<{ time: string; value: number; baseline?: number }>;
  /** Optional contextual AI advisory bulletin */
  advisory?: {
    insight: string;
    impact: string;
    action: string;
  };
}

/**
 * Represents an operational event item in the Business Timeline audit trail.
 */
export interface TimelineEvent {
  /** Unique event identifier */
  id: string;
  /** Milestone date string (e.g. 'July 2026') */
  date: string;
  /** Title of the historical milestone */
  title: string;
  /** Executive summary of the event */
  summary: string;
  /** Financial or operational impact statement */
  impact: string;
  /** Statistical confidence rating (0-100%) */
  confidence: number;
  /** Trend status description */
  trend: string;
  /** Category classification */
  category: 'Revenue' | 'Marketing' | 'Inventory' | 'Customers' | 'Operations' | 'Risk' | 'Growth';
  /** Detailed breakdown of what occurred */
  whatHappened: string;
  /** Underlying root cause explanation */
  why: string;
  /** Stringified JSON recommendation payload */
  recommendedAction: string;
  /** Target node ID linked on the Strategy Canvas */
  targetNodeId: string;
}

/**
 * Represents an AI consultation response payload returned by Decision Copilot.
 */
export interface CopilotResponse {
  /** Executive summary and explanatory context */
  summary: string;
  /** Bullet points of key findings and root cause drivers */
  evidence: string[];
  /** Statistical confidence rating (0-100%) */
  confidence: number;
  /** Stringified JSON recommendation payload */
  recommendation: string;
  /** Suggested follow-up query starter */
  nextQuestion: string;
  /** Optional list of related metric keys */
  relatedMetrics?: string[];
}

/**
 * Represents a simulated forecast scenario payload returned by the Forecast Modeler.
 */
export interface ScenarioResponse {
  /** Executive verdict summary */
  verdict: string;
  /** Analysis of trade-offs between parameters */
  tradeoffs: string;
  /** Identified business risk factors */
  risks: string;
  /** Expected ROI statement */
  roi: string;
  /** Forecast confidence rating (0-100%) */
  confidence: number;
  /** Status banner description */
  scenarioStatus?: string;
  /** Detailed recommended action object */
  recommendedAction?: {
    title: string;
    impact: string;
    expectedRevenueIncrease: string;
    complexity: string;
    confidence: number;
    roi: string;
  };
}


