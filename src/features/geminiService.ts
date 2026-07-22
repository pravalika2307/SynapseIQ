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

function getIndustryContextInstructions(industry: string): string {
  switch (industry) {
    case 'Healthcare & Medical':
      return `
Focus areas for Healthcare: Patient throughput optimization, clinical quality metrics, bed capacity scheduling, staff compliance, and medical resource conservation. Adjust recommendations to target clinical directors and chief medical officers.
`;
    case 'Education':
      return `
Focus areas for Education: Learning velocity indexes, academic retention scores, curriculum allocations, and tuition budget balances. Adjust recommendations to target academic directors and board trustees.
`;
    case 'HR & Workforce':
      return `
Focus areas for Human Resources: Talent retention, cost-of-hire optimization, compensation parity indexes, workforce utilization capacity, and headcount distribution. Adjust recommendations to target CHROs and personnel strategy committees.
`;
    case 'Supply Chain & Manufacturing':
      return `
Focus areas for Supply Chain & Logistics: Transit queue bottlenecks, warehouse safety stock threshold optimizations, carrier spot rate mitigations, nearshore capacity corridor shifts, and inventory turns. Adjust recommendations to target Chief Operations Officers and supply chain directors.
`;
    case 'Marketing & Advertising':
      return `
Focus areas for Marketing: Acquisition conversion ratios, LTV:CAC efficiency indices, direct marketing reallocations, organic brand expansion, and traffic channel margins. Adjust recommendations to target CMOs and digital marketing directors.
`;
    case 'Financial Operations':
      return `
Focus areas for Finance: Net operating margins, EBITDA growth targets, fixed/variable cost structures, investment optimization, and working capital cash conservation. Adjust recommendations to target CFOs and treasury committees.
`;
    case 'Sales & E-commerce':
      return `
Focus areas for Sales: Close ratios, average deal velocity, regional distribution metrics, customer churn margins, and lifetime customer value optimization. Adjust recommendations to target Chief Revenue Officers and sales managers.
`;
    case 'Technology / SaaS':
      return `
Focus areas for SaaS: Monthly Recurring Revenue (MRR), Customer Acquisition Cost (CAC) payback speed, customer churn indices, net revenue retention (NRR), and platform capacity margins. Adjust recommendations to target Chief Executive Officers and technology directors.
`;
    default:
      return `
Focus areas for General Business: Corporate operating efficiencies, workflow bottlenecks, commercial capacity scheduling, and bottom-line margin expansion.
`;
  }
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

const GEMINI_FLASH_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash'
];

// Raw Gemini fetch with Model Negotiation, Timeout & Abort controller
async function callGeminiRaw(apiKey: string, prompt: string, signal?: AbortSignal): Promise<string> {
  let lastError: any = null;

  for (let i = 0; i < GEMINI_FLASH_MODELS.length; i++) {
    const model = GEMINI_FLASH_MODELS[i];
    const isLastModel = i === GEMINI_FLASH_MODELS.length - 1;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const start = performance.now();
    
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
      const duration = Math.round(performance.now() - start);

      if (!response.ok) {
        const errText = await response.text();
        const status = response.status;

        // Status 404 (Not Found / Unsupported), 429 (Quota/Rate limit), 503/500 (Service Unavailable)
        const isNegotiationFallback = status === 404 || status === 429 || status === 503 || status === 500;
        
        lastError = new Error(`Gemini API Model [${model}] HTTP ${status}: ${errText}`);

        if (isNegotiationFallback && !isLastModel) {
          logStructured({
            operation: 'modelNegotiation',
            status: 'retry',
            durationMs: duration,
            attempt: i + 1,
            error: `Model ${model} returned HTTP ${status}. Retrying fallback model [${GEMINI_FLASH_MODELS[i + 1]}]...`
          });
          continue; // Fallback to next model
        }

        throw lastError;
      }

      const resJson = await response.json();
      const rawText = resJson?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new Error(`Gemini API Model [${model}] returned empty candidate text.`);
      }

      logStructured({
        operation: 'modelNegotiation',
        status: 'success',
        durationMs: duration,
        attempt: i + 1,
        error: `Gemini Model [${model}] activated successfully.`
      });
      console.info(`[Gemini Intelligence Engine] Activated model: ${model}`);

      return rawText;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError' || signal?.aborted) {
        throw err;
      }
      lastError = err;
      if (!isLastModel) {
        const duration = Math.round(performance.now() - start);
        logStructured({
          operation: 'modelNegotiation',
          status: 'retry',
          durationMs: duration,
          attempt: i + 1,
          error: `Model ${model} error (${err.message}). Retrying fallback model [${GEMINI_FLASH_MODELS[i + 1]}]...`
        });
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('Gemini API model chain negotiation failed.');
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
Industry Context Strategy Directives:
${getIndustryContextInstructions(summary.profile.industry)}

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
Industry Context Strategy Directives:
${getIndustryContextInstructions(summary.profile.industry)}

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
Industry Context Strategy Directives:
${getIndustryContextInstructions(summary.profile.industry)}

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
function computeDynamicEdges(summary: DatasetSummary): { source: string; target: string; correlation?: number }[] {
  const edges: { source: string; target: string; correlation?: number }[] = [];
  const metrics = summary.detectedMetrics;
  
  if (metrics) {
    const metricKeys = Object.keys(metrics).filter(k => metrics[k as keyof typeof metrics] !== null);
    metricKeys.forEach(k1 => {
      metricKeys.forEach(k2 => {
        if (k1 < k2) {
          const col1 = metrics[k1 as keyof typeof metrics]!;
          const col2 = metrics[k2 as keyof typeof metrics]!;
          const corr = summary.correlations?.[col1]?.[col2] || 0;
          if (Math.abs(corr) > 0.35) {
            edges.push({
              source: k1,
              target: k2,
              correlation: Number(corr.toFixed(2))
            });
          }
        }
      });
    });
  }
  
  if (edges.length === 0) {
    edges.push(
      { source: 'revenue', target: 'profit', correlation: 0.88 },
      { source: 'marketing', target: 'revenue', correlation: 0.76 },
      { source: 'inventory', target: 'operations', correlation: 0.65 },
      { source: 'customers', target: 'revenue', correlation: 0.82 }
    );
  }

  return edges;
}

export async function getAnalysisResponse(
  apiKey: string | null,
  summary: DatasetSummary,
  signal?: AbortSignal
): Promise<AnalysisResponse> {
  const effectiveKey = (apiKey && apiKey.trim() !== '') ? apiKey : getStoredApiKey();
  const start = performance.now();
  if (effectiveKey && effectiveKey.trim() !== '') {
    try {
      return await generateGeminiAnalysis(effectiveKey, summary, signal);
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
    strategyCanvasEdges: computeDynamicEdges(summary)
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
  const effectiveKey = (apiKey && apiKey.trim() !== '') ? apiKey : getStoredApiKey();
  const start = performance.now();
  if (effectiveKey && effectiveKey.trim() !== '') {
    try {
      return await askGeminiCopilot(effectiveKey, query, history, summary, activeNodeContext, signal);
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
  const effectiveKey = (apiKey && apiKey.trim() !== '') ? apiKey : getStoredApiKey();
  const start = performance.now();
  if (effectiveKey && effectiveKey.trim() !== '') {
    try {
      return await simulateGeminiScenario(effectiveKey, sliderValues, summary, signal);
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
