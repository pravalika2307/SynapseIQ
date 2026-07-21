import type { DatasetSummary } from './csvParser';
import type { NodeContext, SignalItem, BriefingReport, CopilotResponse, ScenarioResponse, TimelineEvent } from '../types';
import { askLocalCopilot, simulateLocalScenario } from './localAnalysis';

export interface AnalysisResponse {
  nodeContexts: Record<string, NodeContext>;
  businessSignals: SignalItem[];
  briefingReports: BriefingReport[];
  strategyCanvasEdges: { source: string; target: string; correlation?: number }[];
  timelineEvents?: TimelineEvent[];
}

const STORAGE_KEY = 'synapseiq_gemini_api_key';

export function getStoredApiKey(): string | null {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim() !== '') {
    return envKey;
  }
  return localStorage.getItem(STORAGE_KEY);
}

export function setStoredApiKey(key: string | null) {
  if (key) {
    localStorage.setItem(STORAGE_KEY, key);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

async function callGeminiRaw(apiKey: string, prompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API Error: ${response.status} - ${errText}`);
  }

  const resJson = await response.json();
  const rawText = resJson?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error('Gemini API returned an empty response.');
  }

  return rawText;
}

async function callGeminiRawWithRetry(apiKey: string, prompt: string, retries = 3, initialDelay = 1000): Promise<string> {
  let attempt = 0;
  while (true) {
    try {
      return await callGeminiRaw(apiKey, prompt);
    } catch (error: any) {
      attempt++;
      if (attempt >= retries) {
        console.error(`Gemini API: All ${retries} attempts failed.`);
        throw error;
      }
      const delay = initialDelay * Math.pow(2, attempt - 1);
      console.warn(`Gemini API: Attempt ${attempt} failed. Retrying in ${delay}ms... Error: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

export async function generateGeminiAnalysis(
  apiKey: string, 
  summary: DatasetSummary
): Promise<AnalysisResponse> {
  const statsString = JSON.stringify({
    fileName: summary.fileName,
    rowCount: summary.rowCount,
    profile: summary.profile,
    biAnalysis: summary.biAnalysis
  }, null, 2);

  const prompt = `
Role: Executive Business Advisor (McKinsey/BCG).
Dataset:
${statsString}

Constraints:
1. No repetitive wording. No generic phrasing. No hallucinations.
2. Focus on trends (slopes, MoM vectors) and covariance between metrics instead of isolated numbers.
3. Every Context recommendation AND timeline recommendedAction MUST be a stringified JSON object:
{"recommendation": "We recommend... [core suggestion starting with 'We recommend...']", "businessReasoning": "...", "supportingMetrics": "...", "expectedImpact": "...", "confidenceScore": "...", "potentialRisks": "...", "implementationDifficulty": "Low|Medium|High", "priority": "Low|Medium|High", "suggestedTimeline": "..."}

Return JSON shape exactly:
{
  "nodeContexts": {
    "health": { "id": "health", "title": "Business Health Index", "summary": "...", "metricLabel": "...", "metric": "...", "trend": "up|down|neutral", "opportunity": "...", "risk": "...", "recommendation": "STRINGIFIED_RECOMMENDATION_JSON" },
    "revenue": { "id": "revenue", "title": "Revenue Run-rate", "summary": "...", "metricLabel": "...", "metric": "...", "trend": "up|down|neutral", "opportunity": "...", "risk": "...", "recommendation": "STRINGIFIED_RECOMMENDATION_JSON" },
    "profit": { "id": "profit", "title": "Operating Profit Margin", "summary": "...", "metricLabel": "...", "metric": "...", "trend": "up|down|neutral", "opportunity": "...", "risk": "...", "recommendation": "STRINGIFIED_RECOMMENDATION_JSON" },
    "customers": { "id": "customers", "title": "Customer Acquisition", "summary": "...", "metricLabel": "...", "metric": "...", "trend": "up|down|neutral", "opportunity": "...", "risk": "...", "recommendation": "STRINGIFIED_RECOMMENDATION_JSON" },
    "marketing": { "id": "marketing", "title": "Marketing Spend Index", "summary": "...", "metricLabel": "...", "metric": "...", "trend": "up|down|neutral", "opportunity": "...", "risk": "...", "recommendation": "STRINGIFIED_RECOMMENDATION_JSON" },
    "inventory": { "id": "inventory", "title": "Inventory Turn Velocity", "summary": "...", "metricLabel": "...", "metric": "...", "trend": "up|down|neutral", "opportunity": "...", "risk": "...", "recommendation": "STRINGIFIED_RECOMMENDATION_JSON" },
    "operations": { "id": "operations", "title": "Operational Execution", "summary": "...", "metricLabel": "...", "metric": "...", "trend": "up|down|neutral", "opportunity": "...", "risk": "...", "recommendation": "STRINGIFIED_RECOMMENDATION_JSON" },
    "customer-satisfaction": { "id": "customer-satisfaction", "title": "Customer Satisfaction Score", "summary": "...", "metricLabel": "...", "metric": "...", "trend": "up|down|neutral", "opportunity": "...", "risk": "...", "recommendation": "STRINGIFIED_RECOMMENDATION_JSON" }
  },
  "businessSignals": [
    {
      "id": "...", "title": "...", "category": "...", "score": 85.2, "delta": "+2.4%", "trend": "positive|negative|neutral", "note": "...", "chartData": [ { "time": "M1", "value": 80 } ],
      "advisory": { "insight": "...", "impact": "...", "action": "..." }
    }
  ],
  "briefingReports": [
    {
      "id": "boardroom-report", "title": "Boardroom Briefing Dossier", "category": "Strategic Planning", "date": "July 2026", "riskLevel": "Optimized|High|Critical", "summary": "...",
      "narrative": [
        "Executive Summary: [Takeaway summary]",
        "Current Business Status: [BI telemetry health status]",
        "Top Opportunities: [Data-driven opportunities]",
        "Critical Risks: [Operational threats, logistics bottlenecks]",
        "Performance Highlights: [Telemetry beats, maximums]",
        "Strategic Recommendations: [Steering actions, starting with 'We recommend...']",
        "Implementation Roadmap: [Step-by-step priority rollout timeline]",
        "Expected Outcomes: [ARR/operating margin lift expected]",
        "Conclusion: [Final synthesis for boardroom]"
      ]
    }
  ],
  "strategyCanvasEdges": [ { "source": "revenue", "target": "marketing", "correlation": 0.85 } ],
  "timelineEvents": [
    {
      "id": "ev-1", "date": "July 2026", "title": "...", "summary": "...", "impact": "...", "confidence": 95, "trend": "Optimized", "category": "Growth", "whatHappened": "...", "why": "...", "recommendedAction": "STRINGIFIED_RECOMMENDATION_JSON", "targetNodeId": "health"
    }
  ]
}

Only return clean JSON. narrative array must have exactly 9 paragraphs.
`;

  const responseText = await callGeminiRawWithRetry(apiKey, prompt);
  return JSON.parse(responseText) as AnalysisResponse;
}

export async function askGeminiCopilot(
  apiKey: string,
  query: string,
  history: { sender: 'user' | 'assistant'; text: string }[],
  summary: DatasetSummary,
  activeNodeContext: NodeContext
): Promise<CopilotResponse> {
  const statsSummary = {
    fileName: summary.fileName,
    profile: summary.profile,
    biAnalysis: summary.biAnalysis
  };

  const prompt = `
Role: Executive Business Advisor (McKinsey/BCG).
Dataset:
${JSON.stringify(statsSummary)}

Selected Node Context:
${JSON.stringify(activeNodeContext)}

History:
${JSON.stringify(history.slice(-4))}

User Query: "${query}"

Guidelines:
1. Speak concisely, analytically, and authoritatively. Avoid generic/repetitive phrasing.
2. Ground all insights in local biAnalysis. If columns are missing (e.g. payroll, satisfaction), state: "The available data is insufficient to analyze this dimension because no X metrics were detected."
3. Explain trends, compare KPIs, suggest next steps, and maintain conversation history context for follow-up questions.
4. "recommendation" MUST be a stringified JSON object matching:
{"recommendation": "We recommend... [core suggestion starting with 'We recommend...']", "businessReasoning": "...", "supportingMetrics": "...", "expectedImpact": "...", "confidenceScore": "...", "potentialRisks": "...", "implementationDifficulty": "Low|Medium|High", "priority": "Low|Medium|High", "suggestedTimeline": "..."}

Return JSON shape:
{
  "summary": "Executive Summary & Business Context: [Strategic context and explanatory WHY]",
  "evidence": [ "Key Findings: [observation]", "Root Causes: [operational driver]" ],
  "confidence": 95,
  "recommendation": "STRINGIFIED_RECOMMENDATION_JSON",
  "nextQuestion": "Follow-up question starter"
}
`;

  const responseText = await callGeminiRawWithRetry(apiKey, prompt);
  return JSON.parse(responseText) as CopilotResponse;
}

export async function simulateGeminiScenario(
  apiKey: string,
  sliderValues: {
    marketing: number;
    price: number;
    inventory: number;
    hiring: number;
    retention: number;
    costs: number;
  },
  summary: DatasetSummary
): Promise<ScenarioResponse> {
  const statsSummary = {
    fileName: summary.fileName,
    profile: summary.profile,
    biAnalysis: summary.biAnalysis
  };

  const prompt = `
Role: Executive Business Advisor (McKinsey/BCG) forecasting telemetry.
Context:
${JSON.stringify(statsSummary)}

Slider inputs:
- Marketing: ${sliderValues.marketing}%, Price: ${sliderValues.price}%, Inventory: ${sliderValues.inventory}d, Hiring: ${sliderValues.hiring}%, Retention: ${sliderValues.retention}%, Costs: ${sliderValues.costs}%

Guidelines:
1. Model forecast trends using telemetry. No generic/repetitive phrasing. No hallucinations.
2. recommendedAction.impact MUST be a stringified JSON object matching:
{"recommendation": "We recommend... [core suggestion starting with 'We recommend...']", "businessReasoning": "...", "supportingMetrics": "...", "expectedImpact": "...", "confidenceScore": "...", "potentialRisks": "...", "implementationDifficulty": "Low|Medium|High", "priority": "Low|Medium|High", "suggestedTimeline": "..."}

Return JSON shape:
{
  "verdict": "Executive Summary, Business Context, Key Findings & Root Causes: [synthesis of slider impact]",
  "tradeoffs": "Growth Opportunities & Trade-offs: [budget/margin balance]",
  "risks": "Business Risks: [operational bottlenecks]",
  "roi": "Strategic Recommendations, Immediate Actions & Expected Impact: [ROI rationale]",
  "confidence": 88,
  "scenarioStatus": "McKinsey-style summary description banner",
  "recommendedAction": {
    "title": "Short title",
    "impact": "STRINGIFIED_RECOMMENDATION_JSON",
    "expectedRevenueIncrease": "+8.3%",
    "complexity": "Low|Medium|High",
    "confidence": 94,
    "roi": "12.4x"
  }
}
`;

  const responseText = await callGeminiRawWithRetry(apiKey, prompt);
  return JSON.parse(responseText) as ScenarioResponse;
}

export async function getCopilotResponse(
  apiKey: string | null,
  query: string,
  history: { sender: 'user' | 'assistant'; text: string }[],
  summary: DatasetSummary,
  activeNodeContext: NodeContext
): Promise<CopilotResponse> {
  if (apiKey && apiKey.trim() !== '') {
    try {
      return await askGeminiCopilot(apiKey, query, history, summary, activeNodeContext);
    } catch (err: any) {
      console.warn(`Gemini Copilot API failed, falling back to local engine: ${err.message}`);
    }
  }
  return askLocalCopilot(query, history, summary, activeNodeContext);
}

export async function getScenarioSimulation(
  apiKey: string | null,
  sliderValues: {
    marketing: number;
    price: number;
    inventory: number;
    hiring: number;
    retention: number;
    costs: number;
  },
  summary: DatasetSummary
): Promise<ScenarioResponse> {
  if (apiKey && apiKey.trim() !== '') {
    try {
      return await simulateGeminiScenario(apiKey, sliderValues, summary);
    } catch (err: any) {
      console.warn(`Gemini Scenario simulation API failed, falling back to local reasoning: ${err.message}`);
    }
  }
  return simulateLocalScenario(sliderValues, summary);
}
