# SynapseIQ — Professional QA Release Validation Checklist

This checklist provides a systematic QA verification matrix to validate production readiness across every release of **SynapseIQ**.

---

## 📥 1. Dataset Ingestion & Preprocessing
- [ ] **CSV Drag-and-Drop**: Dragging a `.csv` file onto the Upload Zone immediately triggers parsing.
- [ ] **Manual CSV File Selection**: File input picker correctly filters and opens `.csv` files.
- [ ] **Demo Mode Activation**: Clicking "⚡ Try Demo Dataset" instantly populates the state store with the preloaded matrix.
- [ ] **CSV Parsing & Column Profiling**: `parseCSV` correctly identifies headers, row counts, and data types without missing fields.
- [ ] **Adaptive Industry Auto-Detection**: Automatically identifies domain profile (`HR`, `Finance`, `Sales`, `Manufacturing`, `Healthcare`, `Logistics`, `Retail`, `Education`, `Banking`, `Energy`).
- [ ] **Statistical Variance & Z-Scores**: Computes Z-score anomaly outliers ($Z \ge 3.0$) and Pearson correlation matrices ($\ge |0.35|$).

---

## ⚡ 2. AI Intelligence & Pipeline Integration
- [ ] **API Key Resolution**: Resolves `VITE_GEMINI_API_KEY` from environment or session storage.
- [ ] **Central Service Invocation**: All AI features route through `geminiService.ts`.
- [ ] **McKinsey Advisory Prompts**: Prompts incorporate domain directives and statistical telemetry context.
- [ ] **Model Negotiation Chain**: Negotiates Flash endpoints (`gemini-2.5-flash` → `gemini-2.0-flash` → `gemini-2.0-flash-lite` → `gemini-1.5-flash`).
- [ ] **Validation Layer Audit**: Filters out generic chatbot phrases (*"Based on the data..."*) and checks JSON structure.
- [ ] **Graceful Resiliency Fallback**: If offline or rate-limited (`429`), smoothly falls back to local heuristic calculations without crashing UI.

---

## 📊 3. Core Feature Pages & Views

### Executive Brief (`ExecutiveBrief.tsx`)
- [ ] Circular Health Index score renders dynamically (0–100).
- [ ] Decision Readiness gauge displays calculated confidence score.
- [ ] CEO Daily Briefing highlights Opportunity, Risk, Action, Positive/Negative Trends, and Strategic Priority.
- [ ] Prioritization Engine classifies insights into Critical, High, Medium, Low badges.

### Strategy Canvas (`StrategyCanvas.tsx` / `DecisionGraph.tsx`)
- [ ] React Flow interactive graph renders node network cleanly.
- [ ] Edges represent calculated Pearson correlation weights.
- [ ] Clicking graph nodes opens context drawer with telemetry insights.

### Business Signals (`BusinessSignals.tsx`)
- [ ] Matrix displays real-time signal scores, deltas, and trend badges.
- [ ] Advisory drawer opens with data-backed recommendations.

### Forecast Studio (`Forecast.tsx`)
- [ ] Slider adjustments update scenario parameters.
- [ ] Debounced (400ms) simulation updates verdict banners and ROI indicators.
- [ ] Recharts interactive Area Chart renders projection bounds cleanly.

### Decision Copilot (`DecisionCopilot.tsx`)
- [ ] Quick starter question chips load pre-populated queries.
- [ ] Response streams with typewriter animation and renders structured recommendation cards.

### Boardroom Report (`Reports.tsx`)
- [ ] Generates 9-paragraph structured briefing dossier.
- [ ] "Print / Export Briefing" triggers clean PDF print dossier layout.

---

## 🎨 4. Design System, Accessibility & Performance
- [ ] **Color Palette**: Dark-mode palette (`#0D1117`, `#151B23`, `#83D18B` sage green) renders uniformly.
- [ ] **Typography**: Inter / Outfit fonts load crisp text across screen densities.
- [ ] **Responsive Breakpoints**: Layout adapts cleanly from desktop (1920px) to mobile (375px).
- [ ] **Zero Console Errors**: Developer console remains free of unhandled exceptions or React key warnings.
- [ ] **Build Performance**: `npm run build` compiles cleanly under 2 seconds.

---

## 🔐 5. Security & Isolation
- [ ] `.env` and API keys are excluded from Git repository index (`.gitignore`).
- [ ] API keys are transmitted via HTTPS TLS directly to Google's official Gemini endpoint.
- [ ] CSV parsing occurs entirely client-side in browser memory without sending raw customer files to unauthorized external servers.
