import type { DatasetSummary } from './csvParser';
import type { NodeContext, SignalItem, BriefingReport, CopilotResponse, ScenarioResponse, TimelineEvent } from '../types';
import { askLocalCopilot, simulateLocalScenario, generateLocalAnalysis } from './localAnalysis';

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

// Structured Logging helper
function logStructured(meta: {
  operation: string;
  status: 'success' | 'retry' | 'fallback' | 'error' | 'cancelled';
  durationMs: number;
  attempt?: number;
  error?: string;
}) {
  console.info(JSON.stringify({
    timestamp: new Date().toISOString(),
    ...meta
  }));
}

// ----------------------------------------------------
// EXECUTIVE REWRITE RULES & REPETITIVE SENTENCE CHECKERS
// ----------------------------------------------------
function rewriteExecutiveLanguage(text: string): string {
  if (!text) return '';
  let cleaned = text;
  const mappings = [
    { pattern: /based on the provided data/gi, replacement: "Strategic evaluation of the telemetry indicates" },
    { pattern: /based on the data/gi, replacement: "Operational telemetry indicates" },
    { pattern: /it appears that/gi, replacement: "Telemetry audits demonstrate" },
    { pattern: /it appears/gi, replacement: "Audits demonstrate" },
    { pattern: /the dataset suggests/gi, replacement: "Operational patterns confirm" },
    { pattern: /the data suggests/gi, replacement: "Telemetry registers" },
    { pattern: /as we can see/gi, replacement: "Executive analysis highlights" }
  ];
  for (const map of mappings) {
    cleaned = cleaned.replace(map.pattern, map.replacement);
  }
  return cleaned;
}

function hasDuplicateSentences(text: string): boolean {
  if (!text) return false;
  const sentences = text.split(/[.!?]+/).map(s => s.trim().toLowerCase()).filter(s => s.length > 25);
  const seen = new Set<string>();
  for (const s of sentences) {
    if (seen.has(s)) {
      return true;
    }
    seen.add(s);
  }
  return false;
}

// ----------------------------------------------------
// SCHEMA VALIDATORS
// ----------------------------------------------------
function cleanAndValidateAnalysis(parsed: any): boolean {
  if (!parsed || typeof parsed !== 'object') return false;
  if (!parsed.nodeContexts || !parsed.businessSignals || !parsed.briefingReports) return false;
  
  const required = ['health', 'revenue', 'profit', 'customers'];
  for (const req of required) {
    if (!parsed.nodeContexts[req] || typeof parsed.nodeContexts[req].recommendation !== 'string') {
      return false;
    }
  }

  if (parsed.briefingReports[0] && parsed.briefingReports[0].narrative) {
    const narrative = parsed.briefingReports[0].narrative;
    if (!Array.isArray(narrative) || narrative.length !== 9) return false;
    for (let i = 0; i < narrative.length; i++) {
      narrative[i] = rewriteExecutiveLanguage(narrative[i]);
      if (hasDuplicateSentences(narrative[i])) return false;
      if (/based on the provided data|it appears|the dataset suggests/i.test(narrative[i])) return false;
    }
  }

  const nodes = Object.keys(parsed.nodeContexts);
  for (const nodeKey of nodes) {
    const node = parsed.nodeContexts[nodeKey];
    node.summary = rewriteExecutiveLanguage(node.summary || '');
    if (hasDuplicateSentences(node.summary)) return false;
    if (/based on the provided data|it appears|the dataset suggests/i.test(node.summary)) return false;
  }
  
  return true;
}

function cleanAndValidateCopilot(parsed: any): boolean {
  if (!parsed || typeof parsed !== 'object') return false;
  if (typeof parsed.summary !== 'string' || typeof parsed.recommendation !== 'string') return false;
  if (parsed.confidence && parsed.confidence < 50) return false;

  parsed.summary = rewriteExecutiveLanguage(parsed.summary);
  if (hasDuplicateSentences(parsed.summary)) return false;
  if (/based on the provided data|it appears|the dataset suggests/i.test(parsed.summary)) return false;

  return true;
}

function cleanAndValidateScenario(parsed: any): boolean {
  if (!parsed || typeof parsed !== 'object') return false;
  if (typeof parsed.verdict !== 'string' || !parsed.recommendedAction || typeof parsed.recommendedAction.impact !== 'string') return false;
  if (parsed.confidence && parsed.confidence < 50) return false;

  parsed.verdict = rewriteExecutiveLanguage(parsed.verdict);
  if (hasDuplicateSentences(parsed.verdict)) return false;
  if (/based on the provided data|it appears|the dataset suggests/i.test(parsed.verdict)) return false;

  return true;
}

// Raw Gemini fetch with Timeout & Abort controller
async function callGeminiRaw(apiKey: string, prompt: string, signal?: AbortSignal): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 seconds timeout
  
  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener('abort', () => controller.abort(), { once: true });
    }
  }

  try {
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
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

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
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// Retry loop with exponential backoff and rate-limiting (429) checks
async function callGeminiRawWithRetry(
  apiKey: string, 
  prompt: string, 
  operation: string,
  signal?: AbortSignal,
  retries = 3, 
  initialDelay = 1000
): Promise<string> {
  let attempt = 0;
  const start = performance.now();
  
  while (true) {
    attempt++;
    try {
      const res = await callGeminiRaw(apiKey, prompt, signal);
      const duration = Math.round(performance.now() - start);
      logStructured({ operation, status: 'success', durationMs: duration, attempt });
      return res;
    } catch (error: any) {
      const duration = Math.round(performance.now() - start);
      
      if (signal?.aborted || error.name === 'AbortError') {
        logStructured({ operation, status: 'cancelled', durationMs: duration, attempt, error: 'Request aborted by user' });
        throw error;
      }

      if (attempt >= retries) {
        logStructured({ operation, status: 'error', durationMs: duration, attempt, error: error.message });
        throw error;
      }

      const isRateLimit = error.message.includes('429') || error.message.toLowerCase().includes('rate limit') || error.message.toLowerCase().includes('quota');
      const delay = (isRateLimit ? initialDelay * 3 : initialDelay) * Math.pow(2, attempt - 1);
      
      logStructured({ operation, status: 'retry', durationMs: duration, attempt, error: `Error encountered: ${error.message}. Retrying in ${delay}ms` });
      
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, delay);
        signal?.addEventListener('abort', () => {
          clearTimeout(timeout);
          reject(new DOMException('Aborted', 'AbortError'));
        }, { once: true });
      });
    }
  }
}

export async function generateGeminiAnalysis(
  apiKey: string, 
  summary: DatasetSummary,
  signal?: AbortSignal
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

  let attempt = 0;
  while (attempt < 2) {
    attempt++;
    try {
      const responseText = await callGeminiRawWithRetry(apiKey, prompt, 'generateGeminiAnalysis', signal);
      const parsed = JSON.parse(responseText);
      if (cleanAndValidateAnalysis(parsed)) {
        return parsed as AnalysisResponse;
      }
      logStructured({ operation: 'generateGeminiAnalysis', status: 'retry', durationMs: 0, attempt, error: 'Validation failed. Regenerating...' });
    } catch (err: any) {
      if (attempt >= 2) throw err;
    }
  }
  throw new Error('generateGeminiAnalysis failed validation audit.');
}

export async function askGeminiCopilot(
  apiKey: string,
  query: string,
  history: { sender: 'user' | 'assistant'; text: string }[],
  summary: DatasetSummary,
  activeNodeContext: NodeContext,
  signal?: AbortSignal
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

  let attempt = 0;
  while (attempt < 2) {
    attempt++;
    try {
      const responseText = await callGeminiRawWithRetry(apiKey, prompt, 'askGeminiCopilot', signal);
      const parsed = JSON.parse(responseText);
      if (cleanAndValidateCopilot(parsed)) {
        return parsed as CopilotResponse;
      }
      logStructured({ operation: 'askGeminiCopilot', status: 'retry', durationMs: 0, attempt, error: 'Validation failed. Regenerating...' });
    } catch (err: any) {
      if (attempt >= 2) throw err;
    }
  }
  throw new Error('askGeminiCopilot failed validation audit.');
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
  summary: DatasetSummary,
  signal?: AbortSignal
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

  let attempt = 0;
  while (attempt < 2) {
    attempt++;
    try {
      const responseText = await callGeminiRawWithRetry(apiKey, prompt, 'simulateGeminiScenario', signal);
      const parsed = JSON.parse(responseText);
      if (cleanAndValidateScenario(parsed)) {
        return parsed as ScenarioResponse;
      }
      logStructured({ operation: 'simulateGeminiScenario', status: 'retry', durationMs: 0, attempt, error: 'Validation failed. Regenerating...' });
    } catch (err: any) {
      if (attempt >= 2) throw err;
    }
  }
  throw new Error('simulateGeminiScenario failed validation audit.');
}

// ----------------------------------------------------
// DEDICATED AI SERVICE wrappers with robust fallback & structured logs
// ----------------------------------------------------
export async function getAnalysisResponse(
  apiKey: string | null,
  summary: DatasetSummary,
  signal?: AbortSignal
): Promise<AnalysisResponse> {
  const start = performance.now();
  if (apiKey && apiKey.trim() !== '') {
    try {
      return await generateGeminiAnalysis(apiKey, summary, signal);
    } catch (err: any) {
      const duration = Math.round(performance.now() - start);
      if (err.name === 'AbortError' || signal?.aborted) {
        logStructured({ operation: 'getAnalysisResponse', status: 'cancelled', durationMs: duration, error: 'Cancelled' });
        throw err;
      }
      logStructured({ operation: 'getAnalysisResponse', status: 'fallback', durationMs: duration, error: err.message });
    }
  }
  const localAnalysis = generateLocalAnalysis(summary);
  return {
    ...localAnalysis,
    strategyCanvasEdges: [
      { source: 'revenue', target: 'marketing', correlation: 0.8 },
      { source: 'profit', target: 'revenue', correlation: 0.9 }
    ]
  };
}

export async function getCopilotResponse(
  apiKey: string | null,
  query: string,
  history: { sender: 'user' | 'assistant'; text: string }[],
  summary: DatasetSummary,
  activeNodeContext: NodeContext,
  signal?: AbortSignal
): Promise<CopilotResponse> {
  const start = performance.now();
  if (apiKey && apiKey.trim() !== '') {
    try {
      return await askGeminiCopilot(apiKey, query, history, summary, activeNodeContext, signal);
    } catch (err: any) {
      const duration = Math.round(performance.now() - start);
      if (err.name === 'AbortError' || signal?.aborted) {
        logStructured({ operation: 'getCopilotResponse', status: 'cancelled', durationMs: duration, error: 'Cancelled' });
        throw err;
      }
      logStructured({ operation: 'getCopilotResponse', status: 'fallback', durationMs: duration, error: err.message });
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
  summary: DatasetSummary,
  signal?: AbortSignal
): Promise<ScenarioResponse> {
  const start = performance.now();
  if (apiKey && apiKey.trim() !== '') {
    try {
      return await simulateGeminiScenario(apiKey, sliderValues, summary, signal);
    } catch (err: any) {
      const duration = Math.round(performance.now() - start);
      if (err.name === 'AbortError' || signal?.aborted) {
        logStructured({ operation: 'getScenarioSimulation', status: 'cancelled', durationMs: duration, error: 'Cancelled' });
        throw err;
      }
      logStructured({ operation: 'getScenarioSimulation', status: 'fallback', durationMs: duration, error: err.message });
    }
  }
  return simulateLocalScenario(sliderValues, summary);
}
