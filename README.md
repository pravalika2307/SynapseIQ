# SynapseIQ: Executive Decision Workspace

> An editorial-grade, AI-powered decision intelligence workspace designed specifically for business leaders and executive desks.

---

## 🎨 Visual Philosophy: Bloomberg Terminal meets Apple

SynapseIQ is designed to stand apart from typical AI SaaS templates. It replaces glowing purple dashboards and neon glassmorphism with a calm, spacious, human-centered editorial style. 

- **Earthy, Curated Palette:** Built on warm ivory (`#F8F7F2`), pure alabaster, sage green accents, olive tones, and terracotta highlights.
- **Apple & Keynote Typography:** Clean, high-end editorial layouts utilizing Lora serif typography paired with standard crisp Inter sans-serif elements.
- **Bloomberg-Style Calibration:** Highly detailed, monoline custom SVG charts designed for technical accuracy and maximum legibility.
- **Zero Illustrations or Cyberpunk Blobs:** Focuses strictly on whitespace, thin borders, and structured information layouts.

---

## 🚀 Key Features

### 1. Immersive AI Morning Briefing
A typographic morning briefing sheet prepared for a CEO. Renders critical strategic parameters, opportunities, and exposures before revealing the core analytical desk.

### 2. Executive Synthesis Console
The main workspace structured around actual business questions rather than standard KPI boxes. Features:
- **Business Signals:** Column-aligned metrics containing dynamic trend tags, custom AI-assisted insight notes, and confidence scores.
- **Strategic Actions:** Awaiting dossiers detailing local bottlenecks and transit exposures.

### 3. Visual Projections Dashboard
High-density, custom SVG charts answering specific executive queries:
- **Sourcing Asset Distribution:** Horizontal dot plots measuring capex vs. lane latency.
- **Tariff Cost Projections:** Area curve comparisons between global and optimized regional supply paths.
- **Supplier Credit Matrix:** Debt-equity scatter matrices highlighting liquidity risk alerts.

### 4. Scenario Modeler
A procurement sandbox allowing leaders to adjust inventory buffers and capex scales, visualizing projected lead-time reductions and unit cost shifts in real-time.

### 5. Decision Copilot (Mission Control)
An AI strategy consultant console. Displays dataset telemetry metrics and suggested prompt cards (e.g. *Why did revenue decline?*, *Predict next quarter*) that update dynamic strategic briefs.

---

## 🛠️ Tech Stack

- **Core Structure:** Semantic HTML5 Canvas
- **Design System:** Pure Vanilla CSS3 custom properties (CSS variables, Grid, and Flexbox layouts)
- **Vector Graphics:** Custom SVGs and canvas graphs for performance and crispness
- **Application State:** Vanilla JavaScript (custom single-page router, view transition hooks, and dynamic data binding)

---

## 🗺️ System Architecture & Workflow

```
[ Dataset Upload (CSV/Excel) ] ──> [ Onboarding Sequence (7-Phase Check) ]
                                              │
                                              ▼
[ Executive Synthesis Console ] <── [ Today's Morning Brief (CEO Sheet) ]
         │
         ├───> [ Visual Projections (Bloomberg-Apple Custom Charts) ]
         │
         ├───> [ Scenario Modeler (Geographic procurement sandbox) ]
         │
         └───> [ Decision Copilot (Consulting prompt memo deck) ]
```

---

## 📁 Folder Structure

```
SynapseIQ/
├── assets/
│   ├── logo.svg              # Clean geometric vector monogram
│   └── shipping_logistics.png# Custom cargo logistics visual
├── index.html                # Editorial landing page & upload gate
├── landing.css               # Landing layout and progress animation styles
├── app_landing.js            # Landing interactions and parser logic
├── workspace.html            # Main Single-Page App (SPA) desk container
├── styles.css                # Design system variables, sidebar layout, charts, & copilot
├── app.js                    # View router, dataset state, SVG generators, & copilot logic
└── .gitignore                # System and editor ignore rules
```

---

## 💻 Installation & Local Development

SynapseIQ is built as a static application and requires no build steps or bundler configuration.

### 1. Clone the Repository
```bash
git clone https://github.com/pravalika2307/SynapseIQ.git
cd SynapseIQ
```

### 2. Run a Local Development Server
To bypass browser security limits when loading local files, run a simple local web server:

**Using Node.js (recommended):**
```bash
# Install and run a lightweight server
npx http-server . -p 8080
```

**Using Python:**
```bash
# Python 3
python -m http.server 8080
```

**Using VS Code Live Server:**
Right-click on `index.html` and select **Open with Live Server**.

Open `http://localhost:8080` in your browser.

---

## 🌐 Deployment

To deploy SynapseIQ online:

### GitHub Pages
1. Push the code to your GitHub repository.
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, set the source to `Deploy from a branch`, choose `main` (or active working branch), and click **Save**.

---

## 🔮 Future Scope
- **Live CSV/Excel Parser:** Directly inject and map raw transaction records to SVG chart engines.
- **PDF Brief Exporter:** Automated client-side rendering of boardroom briefs using HTML-to-PDF compilers.
- **Keynote/Notion Integrations:** Sync active modeler parameters and strategic actions to external tools.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
