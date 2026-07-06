# Changelog

All notable changes to SynapseIQ are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2025-07-06

### 🏆 Google GenAI Academy Hackathon Prototype Release

This is the first official release of SynapseIQ — an AI-powered Decision Intelligence Platform built for the Google GenAI Academy Hackathon 2025.

### Added

#### Core Platform
- **Intelligent Dataset Upload** — CSV drag-and-drop with automatic data profiling, industry inference, missing value detection, and Z-score outlier analysis
- **AI Narrative Engine** — Full-screen animated narrative experience after dataset analysis completes
- **Executive Brief** — AI-narrated business health summary with strategic priorities, opportunity cards, and risk indicators
- **Strategy Canvas** — Interactive React Flow relationship graph with mathematical correlation mapping between business metrics
- **Business Signals** — Anomaly detection telemetry matrix with McKinsey-style signal explanations
- **AI Strategist (Decision Copilot)** — Gemini-powered executive chat interface with structured response format (Summary → Evidence → Interpretation → Recommendation → Confidence → Follow-up)
- **Forecast Studio** — Live scenario simulator with 6 business levers and real-time trade-off analysis
- **Business Timeline** — Chronological narrative ledger with category filtering
- **Boardroom Report** — Auto-generated 7-section executive report (Executive Summary, Business Health, Key Opportunities, Critical Risks, Forecast, Strategic Recommendations, 90-Day Action Plan)
- **Data Explorer** — Raw dataset viewer for detailed record inspection

#### AI Intelligence
- **Google Gemini API integration** — Full executive brief generation, copilot chat, and scenario simulation
- **Offline reasoning engine** — Dataset-grounded heuristic analysis when no API key is provided
- **Dynamic confidence scoring** — AI confidence adapts to dataset completeness, outlier density, and column availability
- **Honest AI declarations** — Professional diagnostic banners when dataset lacks required columns
- **Correlation-driven Strategy Canvas** — Edges derived from actual mathematical correlations (Pearson)

#### User Experience
- **Guided Demo Tour** — Automated 3-minute walkthrough for hackathon judges
- **Presentation Mode** — Clean projector-optimized interface with one-click toggle
- **Intelligence Mesh Background** — Ambient animated particle system
- **AI Initiative Cards** — Proactive business situation alerts surfaced post-analysis
- **Today's Priorities Console** — AI-surfaced top 3 executive action items

#### Infrastructure
- **Multi-stage Dockerfile** — Optimized production container image
- **Nginx SPA routing** — Static file serving with hash router fallback
- **Google Cloud Run ready** — Full deployment configuration included

### Technical Stack
- React 19 + TypeScript 6 (strict mode)
- Vite 8 build system
- Tailwind CSS v4 dark theme
- Zustand 5 state management
- React Flow 12 (xyflow) for Strategy Canvas
- Recharts 3 for business charts
- Framer Motion 12 for animations

---

## [Unreleased]

### Planned
- Real-time data streaming via WebSocket
- Multi-user collaborative workspaces
- ERP integration (SAP, Oracle, Microsoft Dynamics)
- CRM integration (Salesforce, HubSpot)
- Explainable AI with causal reasoning chains
- Enterprise SSO authentication
- PowerPoint / PDF boardroom export
- Google Vertex AI integration

---

[1.0.0]: https://github.com/pravalika2307/SynapseIQ/releases/tag/v1.0.0
