# SynapseIQ — AI-Powered Decision Intelligence Platform

SynapseIQ is a production-grade enterprise decision intelligence frontend architecture designed for high-stakes business optimization and risk forecasting, tailored to meet Google Cloud styling and architectural standards.

---

## Technical Stack

*   **Runtime & Framework:** React 19, TypeScript (Strict Mode)
*   **Build Utility:** Vite
*   **Styling Engine:** Tailwind CSS v4
*   **Routing System:** React Router v6
*   **State Management:** Zustand
*   **Interactive Node Networks:** React Flow (xyflow)
*   **Visual Chart Telemetry:** Recharts
*   **Icon Library:** Lucide React
*   **Animations:** Framer Motion

---

## Directory Structure

Professional modular setup separating global structures, layouts, pages, and features:

```text
src/
├── assets/         # Static assets and images
├── components/     # Reusable layout and telemetry widgets (DecisionGraph, Sidebar, etc.)
├── features/       # Data context (store, mocks, types)
├── layouts/        # Page wrappers (DashboardLayout)
├── pages/          # Full page views (Landing, ExecutiveBrief, Copilot, etc.)
├── types/          # Strict TypeScript interfaces
├── App.tsx         # Root router configuration
├── index.css       # Core design system tokens and Tailwind bindings
└── main.tsx        # React entry point
```

---

## Quick Start

### 1. Installation
Install project dependencies with peer-dependency compatibility flags:
```bash
npm install
```

### 2. Launch Development server
Run local Vite hot-reloading development server:
```bash
npm run dev
```

### 3. Production Compilation
Compile TypeScript types and optimize production build assets:
```bash
npm run build
```

---

## Feature Architectures

### 1. Decision Graph
Interactive system blueprint rendering relations between critical business dimensions (Revenue, Inventory turn rates, customer satisfaction) using xyflow layout matrices. Selecting node profiles feeds the Zustand store, automatically filtering supporting telemetry signals.

### 2. Strategy Copilot
A split-pane conversation and context-reference room. Provides intelligent consultation suggestions. Responses highlight audit confidence gauges, evidence checklists, and specific strategic directives.

### 3. Scenario Modeler
A sandbox model enabling executives to toggle buffer margins, test Mexican sub-assembly pivots, and simulate cash impact forecasts on Recharts Area projection canvas.

---

## Deployment & Production
This project compiles into optimized, zero-dependency static bundles using Vite:
*   Static files are compiled directly into `/dist`
*   Fully compatible with Google Cloud App Engine, Firebase Hosting, Cloud Run static hosting, or standard CDN pipelines.
*   Uses `HashRouter` to allow stateless routing refreshes on static hosts without complex redirection rule setups.
