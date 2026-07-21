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
  // Check env variable first
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

// Production-grade retry logic with exponential backoff
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
      // Calculate delay with exponential backoff (e.g. 1000ms, 2000ms, 4000ms)
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
  // Format metadata summary for prompt to optimize token usage
  const statsString = JSON.stringify({
    fileName: summary.fileName,
    rowCount: summary.rowCount,
    profile: summary.profile,
    kpis: Object.keys(summary.kpiStats).map(h => ({
      name: h,
      avg: summary.kpiStats[h].mean,
      sum: summary.kpiStats[h].sum,
      min: summary.kpiStats[h].min,
      max: summary.kpiStats[h].max
    })),
    correlations: summary.correlations
  }, null, 2);

  const prompt = `
You are a Senior Management Consultant and the Chief Strategy Officer of SynapseIQ. Your tone is professional, concise, data-driven, and executive-friendly.
Analyze the following corporate telemetry dataset stats summary:
${statsString}

Validate the dataset. If the dataset lacks sufficient column parameters to infer basic business performance, return a structured warning in briefingReports explaining what additional columns would improve the analysis. Do NOT fabricate numbers; only reference values derivable from the stats.

Every single "recommendation" string value under "nodeContexts" MUST start with the exact text "We recommend...". Do not use "AI suggests...", "AI recommends...", or "AI directs...".

You must return a JSON object matching the following structure:
{
  "nodeContexts": {
    "health": { "id": "health", "title": "Business Health Index", "summary": "...", "metricLabel": "...", "metric": "...", "trend": "up|down|neutral", "opportunity": "...", "risk": "...", "recommendation": "..." },
    "revenue": { "id": "revenue", "title": "Revenue Run-rate", "summary": "...", "metricLabel": "...", "metric": "...", "trend": "up|down|neutral", "opportunity": "...", "risk": "...", "recommendation": "..." },
    "profit": { "id": "profit", "title": "Operating Profit Margin", "summary": "...", "metricLabel": "...", "metric": "...", "trend": "up|down|neutral", "opportunity": "...", "risk": "...", "recommendation": "..." },
    "customers": { "id": "customers", "title": "Customer Acquisition", "summary": "...", "metricLabel": "...", "metric": "...", "trend": "up|down|neutral", "opportunity": "...", "risk": "...", "recommendation": "..." },
    "marketing": { "id": "marketing", "title": "Marketing Spend Index", "summary": "...", "metricLabel": "...", "metric": "...", "trend": "up|down|neutral", "opportunity": "...", "risk": "...", "recommendation": "..." },
    "inventory": { "id": "inventory", "title": "Inventory Turn Velocity", "summary": "...", "metricLabel": "...", "metric": "...", "trend": "up|down|neutral", "opportunity": "...", "risk": "...", "recommendation": "..." },
    "operations": { "id": "operations", "title": "Operational Execution", "summary": "...", "metricLabel": "...", "metric": "...", "trend": "up|down|neutral", "opportunity": "...", "risk": "...", "recommendation": "..." },
    "customer-satisfaction": { "id": "customer-satisfaction", "title": "Customer Satisfaction Score", "summary": "...", "metricLabel": "...", "metric": "...", "trend": "up|down|neutral", "opportunity": "...", "risk": "...", "recommendation": "..." }
  },
  "businessSignals": [
    {
      "id": "...", 
      "title": "...", 
      "category": "...", 
      "score": 85.2, 
      "delta": "+2.4%", 
      "trend": "positive|negative|neutral", 
      "note": "AI Bulletins - What happened? Why? Expected impact? Suggested action.", 
      "chartData": [ { "time": "M1", "value": 80 }, { "time": "M2", "value": 81 }, { "time": "M3", "value": 85.2 } ],
      "advisory": {
        "insight": "Consultant-level observation of this metric's trend.",
        "impact": "What this means for the bottom line or operations.",
        "action": "Immediate recommended management action."
      }
    }
  ],
  "briefingReports": [
    {
      "id": "boardroom-report",
      "title": "Boardroom Briefing Dossier",
      "category": "Strategic Planning",
      "date": "July 2026",
      "riskLevel": "Optimized|High|Critical",
      "summary": "Polished executive report derived from real AI insights.",
      "narrative": [
        "Executive Summary: [Narrative directly referencing actual revenue/profit/returns/CAC values]",
        "Business Health: [Detailed analysis of core metrics & health rating]",
        "Key Opportunities: [Actionable opportunities based on correlation matrix]",
        "Critical Risks: [Detailed threats identified in inventory or region segments]",
        "Forecast: [Vivid forward projection based on trends]",
        "Strategic Recommendations: [Specific, context-rich steering actions]",
        "90-Day Action Plan: [Step-by-step priority rollout plan]"
      ]
    }
  ],
  "strategyCanvasEdges": [
    { "source": "revenue", "target": "marketing", "correlation": 0.85 }
  ],
  "timelineEvents": [
    {
      "id": "ev-1",
      "date": "July 2026",
      "title": "Dataset Loaded",
      "summary": "Data-driven summary of the file loading.",
      "impact": "Operational impact details.",
      "confidence": 95,
      "trend": "Optimized",
      "category": "Growth|Revenue|Marketing|Inventory|Customers|Operations|Risk",
      "whatHappened": "What occurred in telemetry.",
      "why": "Underlying business rationale.",
      "recommendedAction": "Actionable steering guidance.",
      "targetNodeId": "health|revenue|profit|customers|marketing|inventory|operations|customer-satisfaction"
    }
  ]
}

Instructions:
1. Format nodeContext summaries with actual numbers, avoid placeholders. Make statements context-rich and trustworthy.
2. In 'businessSignals', write a detailed markdown formatted note. You MUST populate the 'advisory' object with senior consultant insights, impact, and actions. Populate at least 5 signals corresponding to columns in the dataset.
3. In 'briefingReports', construct a highly polished Boardroom Report under the narrative array, with the exact headings: Executive Summary, Business Health, Key Opportunities, Critical Risks, Forecast, Strategic Recommendations, 90-Day Action Plan.
4. Establish canvas edge relationships dynamically using actual high correlations (absolute value > 0.3) from the correlation stats provided.
5. Create at least 3 custom, highly detailed timelineEvents mapping milestones detected in the dataset.
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
    kpis: Object.keys(summary.kpiStats).map(h => `${h}: avg=${summary.kpiStats[h].mean.toFixed(1)}`),
    correlations: summary.correlations
  };

  const prompt = `
You are a Senior Management Consultant and the Chief Strategy Officer of SynapseIQ. Your tone is professional, concise, data-driven, and executive-friendly. You write responses that read like executive consulting briefs, not robotic chatbot dialogues.
Dataset Context:
${JSON.stringify(statsSummary, null, 2)}

Current Selected Node focus in Workspace:
${JSON.stringify(activeNodeContext, null, 2)}

Chat history:
${JSON.stringify(history.slice(-6), null, 2)}

Current User Query: "${query}"

Provide a genuine, strategic, dataset-aligned answer. Avoid hallucinating metrics. Every recommendation value MUST start with the exact text "We recommend...". Return a JSON object with this exact shape:
{
  "summary": "Executive Summary (clear, professional, McKinsey-style statement summarizing the response)",
  "evidence": [
    "Specific data bullet points referencing actual columns, averages, or counts",
    "Further supporting stats from the dataset"
  ],
  "confidence": 95,
  "recommendation": "Recommended Action (specific action plan related to the query)",
  "nextQuestion": "Next Suggested Question (intelligent question starter related to this answer)"
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
    kpis: Object.keys(summary.kpiStats).map(h => `${h}: avg=${summary.kpiStats[h].mean.toFixed(1)}`)
  };

  const prompt = `
You are a Senior Management Consultant and the Chief Strategy Officer of SynapseIQ forecasting corporate telemetry. Your tone is professional, concise, data-driven, and executive-friendly.
Explain the trade-offs, risks, and ROI of these slider assumptions.
Dataset Context:
${JSON.stringify(statsSummary, null, 2)}

Assumed slider inputs adjusted by the executive:
- Marketing Budget allocation: ${sliderValues.marketing}%
- Product Price adjustment: ${sliderValues.price}%
- Inventory stock level target: ${sliderValues.inventory} days
- Headcount Hiring growth: ${sliderValues.hiring}%
- Customer Retention target: ${sliderValues.retention}% NRR
- Operating overhead costs: ${sliderValues.costs}%

Model the forecast. Return a JSON object explaining the trade-offs, risks, and ROI.
Structure:
{
  "verdict": "Why the prediction changed (explain how pricing, marketing, or retention shifts the forecasted path)",
  "tradeoffs": "Business trade-offs (e.g. higher marketing raises acquisition but drives up short term costs)",
  "risks": "Potential risks (e.g. inventory stockouts or retention slip risks)",
  "roi": "Expected ROI (e.g. projected margin shift or ARR multiplier)",
  "confidence": 88,
  "scenarioStatus": "McKinsey-style status description banner",
  "recommendedAction": {
    "title": "Short action title",
    "impact": "Detailed explanation of implementation benefits",
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

// Dedicated AI Service Layer Wrappers to Decouple Business Reasoning from Frontend
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
      console.warn(`Gemini Scenario simulation API failed, falling back to local engine: ${err.message}`);
    }
  }
  return simulateLocalScenario(sliderValues, summary);
}
