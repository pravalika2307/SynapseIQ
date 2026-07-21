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
You are a Senior Strategy Consultant from McKinsey, BCG, Bain, Deloitte, or Google Cloud Consulting. Your tone is highly professional, concise, data-driven, and executive-friendly.
Never provide generic summaries. Avoid repeating numbers unnecessarily. Every recommendation must include reasoning, and every insight must explain the underlying WHY.

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
        "insight": "Consultant-level observation of this metric's trend, explaining the WHY.",
        "impact": "Operational or financial implications.",
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
        "Executive Summary: [Provide a high-level strategic synthesis and overview of performance]",
        "Business Context: [Detail the operational and industry environment, explaining the WHY behind the telemetry]",
        "Key Findings: [List the core observations derived from the data averages, maximums and minimums]",
        "Root Causes: [Outline the underlying structural or operational drivers of the trends]",
        "Business Risks: [Detail the most critical bottom-line and operational threats]",
        "Growth Opportunities: [Identify the top high-margin strategic upsides]",
        "Strategic Recommendations: [Specific, context-rich steering actions, always beginning with 'We recommend...']",
        "Immediate Actions: [Priority step-by-step rollout plan for the next 30 days]",
        "Expected Impact: [Quantify the expected performance improvements and financial outcomes]",
        "Confidence Score: [A strategic summary of why the telemetry supports these findings with high reliability]"
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
      "why": "Underlying business rationale explaining the WHY.",
      "recommendedAction": "Actionable steering guidance starting with 'We recommend...'.",
      "targetNodeId": "health|revenue|profit|customers|marketing|inventory|operations|customer-satisfaction"
    }
  ]
}

Instructions:
1. Return structured JSON ONLY. Do not wrap response in markdown.
2. In 'briefingReports', the 'narrative' array MUST contain exactly 10 paragraphs corresponding to the headings: Executive Summary, Business Context, Key Findings, Root Causes, Business Risks, Growth Opportunities, Strategic Recommendations, Immediate Actions, Expected Impact, and Confidence Score. Each paragraph must be prefixed with its heading name (e.g. 'Executive Summary: ...').
3. Explain the underlying WHY behind every key data trend. Make statements context-rich, concise, and professional.
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
You are a Senior Strategy Consultant from McKinsey, BCG, Bain, Deloitte, or Google Cloud Consulting. Your tone is highly professional, concise, data-driven, and executive-friendly.
Never provide generic summaries. Avoid repeating numbers unnecessarily. Every recommendation must include reasoning, and every insight must explain the underlying WHY.

Dataset Context:
${JSON.stringify(statsSummary, null, 2)}

Current Selected Node focus in Workspace:
${JSON.stringify(activeNodeContext, null, 2)}

Chat history:
${JSON.stringify(history.slice(-6), null, 2)}

Current User Query: "${query}"

Provide a genuine, strategic, dataset-aligned answer. Avoid hallucinating metrics. Every recommendation value MUST start with the exact text "We recommend...". Return structured JSON only.

Return a JSON object with this exact shape:
{
  "summary": "Executive Summary & Business Context: [Consolidated high-level strategic synthesis and the industry WHY behind this query]",
  "evidence": [
    "Key Findings: [Specific data observation backed by statistics]",
    "Root Causes: [Underlying operational driver explaining this data trend]"
  ],
  "confidence": 95,
  "recommendation": "Strategic Recommendations, Immediate Actions & Expected Impact: [We recommend specific steering actions, detail immediate next steps, and outline expected bottom-line impacts]",
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
    biAnalysis: summary.biAnalysis
  };

  const prompt = `
You are a Senior Strategy Consultant from McKinsey, BCG, Bain, Deloitte, or Google Cloud Consulting forecasting corporate telemetry. Your tone is highly professional, concise, data-driven, and executive-friendly.
Never provide generic summaries. Avoid repeating numbers unnecessarily. Every recommendation must include reasoning, and every insight must explain the underlying WHY.

Dataset Context:
${JSON.stringify(statsSummary, null, 2)}

Assumed slider inputs adjusted by the executive:
- Marketing Budget allocation: ${sliderValues.marketing}%
- Product Price adjustment: ${sliderValues.price}%
- Inventory stock level target: ${sliderValues.inventory} days
- Headcount Hiring growth: ${sliderValues.hiring}%
- Customer Retention target: ${sliderValues.retention}% NRR
- Operating overhead costs: ${sliderValues.costs}%

Model the forecast. Return structured JSON only.

JSON Structure:
{
  "verdict": "Executive Summary, Business Context, Key Findings & Root Causes: [Synthesised forecast path showing how sliders shift operations, explaining the WHY and structural root causes]",
  "tradeoffs": "Growth Opportunities & Trade-offs: [Explain how pipeline velocity or near-term margins are balanced by these sliders]",
  "risks": "Business Risks: [Detailed operational and financial threats created by these configurations]",
  "roi": "Strategic Recommendations, Immediate Actions & Expected Impact: [We recommend specific steering targets, detailed immediate actions, and estimated ROI multipliers]",
  "confidence": 88,
  "scenarioStatus": "McKinsey-style status description banner summarizing the model outlook",
  "recommendedAction": {
    "title": "Short action title",
    "impact": "Detailed explanation of implementation benefits and reasoning",
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
      console.warn(`Gemini Scenario simulation API failed, falling back to local reasoning: ${err.message}`);
    }
  }
  return simulateLocalScenario(sliderValues, summary);
}
