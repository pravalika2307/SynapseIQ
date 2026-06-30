/* ==========================================================================
   SynapseIQ - Application Logic & State Machine
   ========================================================================== */

// 1. Core Data Models
const briefingsData = {
  "supply-chain": {
    id: "supply-chain",
    title: "Supply Chain Exposure: Southeast Asia Port Delays",
    category: "Operational Intel",
    date: "June 30, 2026",
    readTime: "8 Min Read",
    author: "Logistics Intelligence Unit",
    summary: "A synthesized assessment of bottlenecks in the Strait of Malacca and secondary port backlogs in Vietnam, detailing risk horizons and mitigation scenarios.",
    paragraphs: [
      {
        id: "p1",
        hasDropCap: true,
        text: "Significant congestion at the Port of Singapore and secondary hubs in Vietnam has reached a critical bottleneck, threatening manufacturing schedules for Q3. AI synthesis indicates an average vessel turnaround delay of 4.8 days, compounding upstream inventory delays. Our primary exposure centers around component assemblies in Hanoi.",
        annotation: {
          type: "terracotta",
          tag: "Critical Bottleneck",
          summary: "Vietnam turnaround delays rose by 22% over the last fortnight. Upstream logistics are failing to absorb the backlog.",
          confidence: "94% Confidence",
          source: "Maritime Port Authority of SG"
        }
      },
      {
        id: "p2",
        text: "In analysis of alternative logistics routing, routing air-freight through Bangkok remains a viable secondary channel, although it introduces a 4.1x cargo cost multiplier. Operational analysts are weighing this premium against potential contract breach penalties from high-value enterprise accounts.",
        annotation: {
          type: "sage",
          tag: "Logistics Recommendation",
          summary: "Hybrid sea-air forwarding via Bangkok reduces lead time by 9 days, offsetting the penalty costs of delayed delivery.",
          confidence: "87% Confidence",
          source: "SupplyChainIQ Database"
        }
      },
      {
        id: "p3",
        text: "Transitioning a portion of component sourcing to domestic Mexican fabricators represents the most viable long-term containment path. Initial data suggests a 15% unit cost premium, offset by a 70% decrease in transit latency and immunity to pending regional tariff revisions. This projection has been visualised in the Scenario Modeler.",
        annotation: null
      },
      {
        id: "p4",
        text: "Furthermore, executive consensus indicates a willingness to absorb short-term shipping premium costs to protect market share. However, mid-tier partners are exhibiting liquidity constraints, which may lead to supply chain fractures if transport congestion extends beyond September.",
        annotation: {
          type: "terracotta",
          tag: "Supplier Debt Risk",
          summary: "Three core tier-2 suppliers in Vietnam report debt-to-equity ratios exceeding 2.5. Cash flows cannot sustain freight costs.",
          confidence: "81% Confidence",
          source: "Refinitiv Credit Ratings"
        }
      }
    ]
  },
  "semiconductor": {
    id: "semiconductor",
    title: "Semiconductor Sourcing: Advanced Node Transition",
    category: "Strategic Inventory",
    date: "May 14, 2026",
    readTime: "12 Min Read",
    author: "Hardware Architecture Council",
    summary: "Evaluating the transition timeline from 7nm to 5nm nodes under shifting bilateral export controls and domestic foundry subsidies.",
    paragraphs: [
      {
        id: "p1",
        hasDropCap: true,
        text: "The accelerating bifurcation of semiconductor manufacturing centers presents both an existential risk and an expansion opportunity. The transition to domestic 5nm node sourcing is projected to increase unit cost by 18% over the next fiscal cycle, but guarantees immunity from impending regional tariffs.",
        annotation: {
          type: "sage",
          tag: "Tariff Insulation",
          summary: "Transitioning to domestic nodes shields primary SKU lines from the proposed 25% import tariff on microelectronics.",
          confidence: "91% Confidence",
          source: "Federal Trade Commission Analysis"
        }
      },
      {
        id: "p2",
        text: "Simultaneously, tooling delays at the Phoenix fabrication facility have extended the dual-sourcing period by six months. We must maintain secondary sourcing from TSMC Hsinchu, exposing our product release timeline to maritime passage risks in the South China Sea.",
        annotation: {
          type: "terracotta",
          tag: "Tooling Bottleneck",
          summary: "Extreme ultraviolet (EUV) lithography installation delayed by 180 days due to specialized technician visa queues.",
          confidence: "98% Confidence",
          source: "ASML Logistics Schedule"
        }
      },
      {
        id: "p3",
        text: "Financial models suggest establishing a temporary inventory buffer of 120 days. The cash drag of holding this capital is estimated at $4.2M, which is comfortably covered by our Q2 capital reserves. Sourcing leads suggest this acts as our strongest insurance policy.",
        annotation: {
          type: "sage",
          tag: "Liquidity Clearance",
          summary: "Cash reserves are sufficient to absorb the carrying cost buffer without impacting the planned share buyback program.",
          confidence: "85% Confidence",
          source: "Treasury Committee Reports"
        }
      }
    ]
  },
  "market-expansion": {
    id: "market-expansion",
    title: "EU Market Compliance: AI Act & Data Sovereignty",
    category: "Regulatory Compliance",
    date: "April 02, 2026",
    readTime: "6 Min Read",
    author: "Global Legal & SRE Teams",
    summary: "Operational alignment plan for regional cloud nodes following the implementation of strict data sovereignty requirements under the updated European framework.",
    paragraphs: [
      {
        id: "p1",
        hasDropCap: true,
        text: "New legislative mandates on artificial intelligence deployment in European markets necessitate a structural rewrite of our centralized synthesis algorithms. Under the revised framework, models processing European enterprise metadata must run on isolated regional infrastructure.",
        annotation: {
          type: "terracotta",
          tag: "Compliance Risk",
          summary: "Non-compliant endpoints face penalties of up to 4% of global annual turnover. Enforcement actions begin in Q4.",
          confidence: "99% Confidence",
          source: "EU Commission Gazette"
        }
      },
      {
        id: "p2",
        text: "Our Frankfurt datacenter expansion is currently running ahead of schedule, with server clusters operating at 85% capacity. Transitioning our primary enterprise clients in France and Germany to local nodes can be executed with less than 2 hours of planned maintenance window latency.",
        annotation: {
          type: "sage",
          tag: "Infrastructure Ready",
          summary: "Frankfurt capacity expansion absorbs the localized workloads. Migration path latency is well within standard SLAs.",
          confidence: "93% Confidence",
          source: "Global Site Reliability Engineering"
        }
      }
    ]
  }
};

// 2. Application State
const appState = {
  currentView: "executive-brief", // Default view is now the CEO morning report
  activeBriefingId: "supply-chain",
  modeler: {
    sourcingFocus: "hybrid", // "global", "hybrid", "domestic"
    capexScale: 40,          // in millions ($10M - $100M)
    bufferDays: 30           // 0 to 90 days
  }
};

// 3. Document Elements Cache
const activeSheetEl = document.getElementById("active-sheet");
const annotationRailEl = document.getElementById("annotation-rail");
const railCardsContainerEl = document.getElementById("rail-cards-container");
const navItems = document.querySelectorAll(".nav-item, .nav-item-sub");

// 4. View Router & Transitions
function navigateTo(view, dataId = null) {
  // Fade out sheet
  activeSheetEl.style.opacity = "0";
  activeSheetEl.style.transform = "translateY(8px)";
  
  // Clear annotations while transitions happen
  railCardsContainerEl.innerHTML = "";
  
  setTimeout(() => {
    appState.currentView = view;
    if (dataId && briefingsData[dataId]) {
      appState.activeBriefingId = dataId;
    }
    
    // Update navigation sidebar classes
    updateNavSelection(view, dataId);
    
    // Render content based on view
    if (view === "projections") {
      renderVisualProjections();
      annotationRailEl.style.display = "none";
      document.querySelector(".workspace-area").style.paddingRight = "0";
    } else if (view === "copilot") {
      renderDecisionCopilot();
      annotationRailEl.style.display = "none";
      document.querySelector(".workspace-area").style.paddingRight = "0";
    } else if (view === "executive-brief") {
      renderExecutiveBrief();
      annotationRailEl.style.display = "none";
      document.querySelector(".workspace-area").style.paddingRight = "0";
    } else if (view === "synthesis") {
      renderIntelSynthesis();
      annotationRailEl.style.display = "none";
      document.querySelector(".workspace-area").style.paddingRight = "0";
    } else if (view === "briefing") {
      renderDecisionBriefing();
      annotationRailEl.style.display = "block";
      document.querySelector(".workspace-area").style.paddingRight = "320px";
    } else if (view === "modeler") {
      renderScenarioModeler();
      annotationRailEl.style.display = "none";
      document.querySelector(".workspace-area").style.paddingRight = "0";
    }
    
    // Fade in sheet
    activeSheetEl.style.opacity = "1";
    activeSheetEl.style.transform = "translateY(0)";
    
    // If briefing, position annotations after layout renders
    if (view === "briefing") {
      setTimeout(alignAnnotationCards, 100);
    }
  }, 200);
}

function updateNavSelection(view, dataId) {
  navItems.forEach(item => {
    item.classList.remove("active");
    
    // Top-level nav buttons
    if (item.getAttribute("data-view") === view) {
      if (view === "briefing") {
        if (item.getAttribute("data-brief-id") === dataId) {
          item.classList.add("active");
        }
      } else {
        item.classList.add("active");
      }
    }
    
    // Sub-items
    if (item.classList.contains("nav-item-sub")) {
      if (view === "briefing" && item.getAttribute("data-brief-id") === dataId) {
        item.classList.add("active");
      }
    }
  });
}

// 4.5. Render: Visual Projections (Bloomberg meets Apple Editorial Charts)
function renderVisualProjections() {
  activeSheetEl.innerHTML = `
    <div class="projections-layout">
      
      <!-- Editorial Header -->
      <header class="synthesis-header">
        <div class="editorial-date">Visual Analytics — June 30, 2026</div>
        <h1 class="sheet-title">Macro Projections Console</h1>
        <p class="sheet-summary" style="font-style: normal; font-size: 15px; color: var(--color-text-secondary);">
          Calibrated visual models pairing the density of a Bloomberg Terminal with the clarity of Apple Keynote. Every chart isolates a key boardroom business query.
        </p>
      </header>

      <!-- Custom Tooltip Element -->
      <div id="chart-tooltip" class="chart-tooltip-overlay"></div>

      <!-- Magazine Grid (2 Columns) -->
      <div class="magazine-grid">

        <!-- Chart 1: Sourcing Asset Distribution (Dot Track Plot) -->
        <div class="tech-chart-container magazine-span-full">
          <header class="tech-chart-header">
            <span class="tech-chart-title">Visual 1.1: Sourcing Asset Distribution & Transit Exposure</span>
            <h2 class="tech-chart-q">How is our inventory capital distributed across global transit lanes?</h2>
          </header>
          
          <svg class="svg-canvas" height="150" viewBox="0 0 700 150">
            <!-- X Axis ticks & lines -->
            <line x1="100" y1="120" x2="650" y2="120" class="axis-line"></line>
            
            <line x1="200" y1="10" x2="200" y2="120" class="grid-line" stroke-dasharray="2 1"></line>
            <line x1="350" y1="10" x2="350" y2="120" class="grid-line" stroke-dasharray="2 1"></line>
            <line x1="500" y1="10" x2="500" y2="120" class="grid-line" stroke-dasharray="2 1"></line>
            <line x1="650" y1="10" x2="650" y2="120" class="grid-line" stroke-dasharray="2 1"></line>
            
            <text x="200" y="135" class="axis-label x-align">LOW ($10M / 5d)</text>
            <text x="350" y="135" class="axis-label x-align">MODERATE ($25M / 15d)</text>
            <text x="500" y="135" class="axis-label x-align">HIGH ($40M / 25d)</text>
            <text x="650" y="135" class="axis-label x-align">PEAK ($55M / 35d)</text>

            <!-- Row Tracks -->
            <!-- Row 1: Singapore -->
            <text x="80" y="28" class="node-group-label">Singapore</text>
            <line x1="100" y1="25" x2="650" y2="25" class="target-track" stroke-dasharray="4 2"></line>
            <circle cx="500" cy="25" r="4.5" fill="var(--color-accent-terracotta)" class="chart-node" data-info="Singapore Delay Node: 30-day queue backlog at strait congestion sectors. High exposure." stroke="#FFFFFF" stroke-width="1"></circle>
            <circle cx="590" cy="25" r="4.5" fill="var(--color-accent-sage)" class="chart-node" data-info="Singapore Sourcing Asset: $48M capital active. Peak financial concentration." stroke="#FFFFFF" stroke-width="1"></circle>

            <!-- Row 2: Hanoi -->
            <text x="80" y="58" class="node-group-label">Hanoi Assembly</text>
            <line x1="100" y1="55" x2="650" y2="55" class="target-track" stroke-dasharray="4 2"></line>
            <circle cx="420" cy="55" r="4.5" fill="var(--color-accent-terracotta)" class="chart-node" data-info="Hanoi Delay Node: 22-day shipping backlog. Tier-2 liquidity strain is high." stroke="#FFFFFF" stroke-width="1"></circle>
            <circle cx="280" cy="55" r="4.5" fill="var(--color-accent-sage)" class="chart-node" data-info="Hanoi Sourcing Asset: $18M parts inventory buffer." stroke="#FFFFFF" stroke-width="1"></circle>

            <!-- Row 3: Guadalajara -->
            <text x="80" y="88" class="node-group-label">Guadalajara</text>
            <line x1="100" y1="85" x2="650" y2="85" class="target-track" stroke-dasharray="4 2"></line>
            <circle cx="160" cy="85" r="4.5" fill="var(--color-accent-sage)" class="chart-node" data-info="Guadalajara Delay Node: 6-day transit corridor delay. Highly insulated." stroke="#FFFFFF" stroke-width="1"></circle>
            <circle cx="480" cy="85" r="4.5" fill="var(--color-accent-sage)" class="chart-node" data-info="Guadalajara Sourcing Asset: $38M capital active. Regional expansion focus." stroke="#FFFFFF" stroke-width="1"></circle>

            <!-- Row 4: Stuttgart -->
            <text x="80" y="118" class="node-group-label">Stuttgart Hub</text>
            <line x1="100" y1="115" x2="650" y2="115" class="target-track" stroke-dasharray="4 2"></line>
            <circle cx="130" cy="115" r="4.5" fill="var(--color-accent-sage)" class="chart-node" data-info="Stuttgart Delay Node: 4-day transit latency. Fully optimized." stroke="#FFFFFF" stroke-width="1"></circle>
            <circle cx="220" cy="115" r="4.5" fill="var(--color-accent-sage)" class="chart-node" data-info="Stuttgart Sourcing Asset: $12M capital active." stroke="#FFFFFF" stroke-width="1"></circle>
          </svg>
          <div class="chart-legend" style="justify-content: flex-end;">
            <div class="legend-item"><span class="legend-color sage"></span> Capital Invested ($M)</div>
            <div class="legend-item"><span class="legend-color terracotta"></span> Node Delay (Days)</div>
          </div>
        </div>

        <!-- Chart 2: Tariff Cost Projections (Area Curves) -->
        <div class="tech-chart-container">
          <header class="tech-chart-header">
            <span class="tech-chart-title">Visual 1.2: Tariff Sourcing Curve (Unit Cost Projections)</span>
            <h2 class="tech-chart-q">What is the projected financial impact of tariff changes on unit cost?</h2>
          </header>
          
          <svg class="svg-canvas" height="180" viewBox="0 0 350 180">
            <!-- Gridlines -->
            <line x1="40" y1="140" x2="330" y2="140" class="axis-line"></line>
            <line x1="40" y1="20" x2="40" y2="140" class="axis-line"></line>
            
            <line x1="40" y1="100" x2="330" y2="100" class="grid-line"></line>
            <line x1="40" y1="60" x2="330" y2="60" class="grid-line"></line>
            <line x1="40" y1="20" x2="330" y2="20" class="grid-line"></line>
            
            <line x1="112.5" y1="20" x2="112.5" y2="140" class="grid-line" stroke-dasharray="2 2"></line>
            <line x1="185" y1="20" x2="185" y2="140" class="grid-line" stroke-dasharray="2 2"></line>
            <line x1="257.5" y1="20" x2="257.5" y2="140" class="grid-line" stroke-dasharray="2 2"></line>
            <line x1="330" y1="20" x2="330" y2="140" class="grid-line" stroke-dasharray="2 2"></line>

            <!-- Y Axis labels -->
            <text x="32" y="23" class="axis-label y-align">$200</text>
            <text x="32" y="63" class="axis-label y-align">$150</text>
            <text x="32" y="103" class="axis-label y-align">$100</text>
            <text x="32" y="143" class="axis-label y-align">BASE</text>

            <!-- X Axis labels -->
            <text x="40" y="155" class="axis-label x-align">Q2 '26</text>
            <text x="112.5" y="155" class="axis-label x-align">Q3 '26</text>
            <text x="185" y="155" class="axis-label x-align">Q4 '26</text>
            <text x="257.5" y="155" class="axis-label x-align">Q1 '27</text>
            <text x="330" y="155" class="axis-label x-align">Q2 '27</text>

            <!-- Area Path 1: Baseline (Terracotta) -->
            <path d="M 40 100 Q 112.5 80, 185 45 T 330 30 L 330 140 L 40 140 Z" class="curve-area series-terracotta"></path>
            <path d="M 40 100 Q 112.5 80, 185 45 T 330 30" class="curve-line series-terracotta" stroke-dasharray="4 2"></path>

            <!-- Area Path 2: Optimized (Sage) -->
            <path d="M 40 100 Q 112.5 110, 185 95 T 330 85 L 330 140 L 40 140 Z" class="curve-area series-sage"></path>
            <path d="M 40 100 Q 112.5 110, 185 95 T 330 85" class="curve-line series-sage"></path>

            <!-- Intersecting Nodes -->
            <circle cx="330" cy="30" r="4" fill="var(--color-accent-terracotta)" class="chart-node" data-info="Baseline Sourcing Projection: $192/unit if Singapore nodes maintain concentration." stroke="#FFFFFF" stroke-width="1"></circle>
            <circle cx="330" cy="85" r="4" fill="var(--color-accent-sage)" class="chart-node" data-info="Optimized Sourcing Projection: $146/unit under Mexican re-routing corridor pivots." stroke="#FFFFFF" stroke-width="1"></circle>
          </svg>
          <div class="chart-legend" style="justify-content: flex-end;">
            <div class="legend-item"><span class="legend-color sage"></span> Optimized Localized Path</div>
            <div class="legend-item"><span class="legend-color terracotta"></span> Conservative Global Path</div>
          </div>
        </div>

        <!-- Chart 3: Supplier Credit Resilience (Bloomberg scatter) -->
        <div class="tech-chart-container">
          <header class="tech-chart-header">
            <span class="tech-chart-title">Visual 1.3: Supplier Resilience Index Matrix</span>
            <h2 class="tech-chart-q">Which tier-1 and tier-2 suppliers face liquidity constraints?</h2>
          </header>
          
          <svg class="svg-canvas" height="180" viewBox="0 0 350 180">
            <!-- Axes -->
            <line x1="40" y1="140" x2="330" y2="140" class="axis-line"></line>
            <line x1="40" y1="20" x2="40" y2="140" class="axis-line"></line>
            
            <!-- Gridlines -->
            <line x1="40" y1="80" x2="330" y2="80" class="grid-line" stroke-dasharray="2 1"></line>
            <line x1="185" y1="20" x2="185" y2="140" class="grid-line" stroke-dasharray="2 1"></line>

            <!-- Axis Labels -->
            <!-- Y-Axis labels: Credit Rating Index -->
            <text x="32" y="23" class="axis-label y-align">100 Rating</text>
            <text x="32" y="83" class="axis-label y-align">50 Rating</text>
            <text x="32" y="143" class="axis-label y-align">0 Rating</text>

            <!-- X-Axis labels: Debt-Equity Ratio -->
            <text x="40" y="155" class="axis-label x-align">0.0 (Clean)</text>
            <text x="185" y="155" class="axis-label x-align">2.0 (Limit)</text>
            <text x="330" y="155" class="axis-label x-align">4.0 (Overleveraged)</text>

            <!-- Scatter Nodes (Bloomberg style scatter) -->
            <!-- Hanoi Fab (Critical Anomaly) -->
            <circle cx="280" cy="110" r="4.5" fill="var(--color-accent-terracotta)" class="chart-node" data-info="Hanoi Precision Parts (Vietnam) • Debt Ratio: 2.8x • Credit Rating: 32 • AI Verdict: Severe Liquidity Risk." stroke="#FFFFFF" stroke-width="1"></circle>
            <!-- Hue Micro (Risk) -->
            <circle cx="220" cy="90" r="4.5" fill="var(--color-accent-terracotta)" class="chart-node" data-info="Hue Semiconductors • Debt Ratio: 2.1x • Credit Rating: 48 • AI Verdict: Solvency Constraint Warning." stroke="#FFFFFF" stroke-width="1"></circle>
            <!-- Mexico Allied (Stable) -->
            <circle cx="120" cy="40" r="4" fill="var(--color-accent-sage)" class="chart-node" data-info="MexAllied Fabricators (MX) • Debt Ratio: 1.1x • Credit Rating: 88 • AI Verdict: Healthy." stroke="#FFFFFF" stroke-width="1"></circle>
            <!-- Munich Board (Stable) -->
            <circle cx="70" cy="30" r="4" fill="var(--color-accent-sage)" class="chart-node" data-info="Munich Circuitry (DE) • Debt Ratio: 0.4x • Credit Rating: 94 • AI Verdict: Clean." stroke="#FFFFFF" stroke-width="1"></circle>
            <!-- AZ Foundry (Stable) -->
            <circle cx="150" cy="50" r="4" fill="var(--color-accent-sage)" class="chart-node" data-info="Arizona Foundry SKU (US) • Debt Ratio: 1.4x • Credit Rating: 78 • AI Verdict: Optimal." stroke="#FFFFFF" stroke-width="1"></circle>
          </svg>
          <div class="chart-legend" style="justify-content: flex-end;">
            <div class="legend-item"><span class="legend-color sage"></span> Stable Partner</div>
            <div class="legend-item"><span class="legend-color terracotta"></span> Critical Risk Alert</div>
          </div>
        </div>

      </div>

    </div>
  `;

  // Hook up hover tooltip overlays
  setupChartTooltipListeners();
}

function setupChartTooltipListeners() {
  const nodes = document.querySelectorAll(".chart-node");
  const tooltip = document.getElementById("chart-tooltip");
  const sheet = document.getElementById("active-sheet");
  
  if (!nodes || !tooltip || !sheet) return;

  nodes.forEach(node => {
    node.addEventListener("mousemove", (e) => {
      const info = node.getAttribute("data-info");
      tooltip.textContent = info;
      
      const sheetRect = sheet.getBoundingClientRect();
      const left = e.clientX - sheetRect.left + 15;
      const top = e.clientY - sheetRect.top + 15;
      
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
      tooltip.style.opacity = "1";
    });

    node.addEventListener("mouseleave", () => {
      tooltip.style.opacity = "0";
    });
  });
}

// 5. Render: Executive Morning Brief (CEO's Morning Desk Sheet)
function renderExecutiveBrief() {
  activeSheetEl.innerHTML = `
    <div class="brief-layout">
      <header class="brief-header">
        <span class="brief-tag">DAILY REPORT — BOARD CONFIDENTIAL</span>
        <h1 class="sheet-title">Today's Executive Brief</h1>
        <p class="sheet-summary" style="font-style: normal; font-size: 15px; color: var(--color-text-secondary);">
          A synthesized morning briefing prepared for the Executive Desk. AI analysis maps strategic operational opportunities and vulnerabilities from raw enterprise indicators.
        </p>
      </header>

      <!-- Typographic metric highlights, avoiding neon widgets -->
      <section class="brief-grid">
        <div class="brief-stat">
          <span class="brief-number accent-sage">3</span>
          <span class="brief-label">Opportunities Found</span>
        </div>
        <div class="brief-stat">
          <span class="brief-number accent-terracotta">1</span>
          <span class="brief-label">Critical Risk</span>
        </div>
        <div class="brief-stat">
          <span class="brief-number">+12%</span>
          <span class="brief-label">Projected Growth</span>
        </div>
        <div class="brief-stat">
          <span class="brief-number">93%</span>
          <span class="brief-label">AI Confidence</span>
        </div>
      </section>

      <!-- Business Editorial Text -->
      <section class="brief-narratives">
        <h2 class="brief-section-title">Strategic Outlook</h2>
        <p class="paragraph-block" style="font-size: 15px; line-height: 1.7; margin-bottom: 24px;">
          Overall operational stability is cataloged as highly resilient. Active supply lines show strong productivity metrics, with localized logistics backlogs in Hanoi representing our primary operational threat vector. Expanding local corridors while optimizing capital reserves will yield a projected 12% Q3 growth coefficient.
        </p>

        <h2 class="brief-section-title">Active Opportunities</h2>
        <ul class="brief-bullet-list">
          <li class="brief-bullet-item">
            <strong>Geographic Sourcing Shift:</strong> Shifting component fabrication allocations to domestic Mexican suppliers offsets container transit queues and shields primary supply lines from pending import tariff revisions.
          </li>
          <li class="brief-bullet-item">
            <strong>Transit Corridor Arbitration:</strong> Re-routing sea-air forwarding operations via Bangkok reduces average port turnaround queues from 30 days to 6 days.
          </li>
          <li class="brief-bullet-item">
            <strong>Capital Efficiency Optimization:</strong> Activating the $40M Capex corridors reduces carrying asset drag and accelerates shipping throughput ratios.
          </li>
        </ul>

        <h2 class="brief-section-title">Critical Risk Focus</h2>
        <ul class="brief-bullet-list">
          <li class="brief-bullet-item">
            <strong>Supplier Liquidity Strain:</strong> Hanoi shipping backlogs have reached a 4.8-day queue backlog, which directly exposes three core tier-2 parts suppliers to operational solvency constraints.
          </li>
        </ul>
      </section>

      <div class="brief-signoff">
        Approved for circulation. SynapseIQ Synthesis engine.
      </div>

      <div class="sheet-actions-footer">
        <button class="btn-editorial btn-primary" id="action-brief-enter">Acknowledge & Open Synthesis Desk →</button>
      </div>
    </div>
  `;

  // Attach button click event
  const enterBtn = document.getElementById("action-brief-enter");
  if (enterBtn) {
    enterBtn.addEventListener("click", () => {
      navigateTo("synthesis");
    });
  }
}

// 5.5. Render: Intel Synthesis (The Executive Inbox)
function renderIntelSynthesis() {
  let listHTML = "";
  Object.values(briefingsData).forEach(brief => {
    let badgeType = brief.id === "supply-chain" ? "type-terracotta" : "type-sage";
    let badgeText = brief.id === "supply-chain" ? "Critical Risk" : "Optimized";
    
    listHTML += `
      <div class="action-dossier-card" data-id="${brief.id}">
        <div>
          <div class="action-dossier-meta">
            <span class="alert-badge ${badgeType}">${badgeText}</span>
            <span>${brief.category}</span>
            <span>•</span>
            <span>${brief.date}</span>
          </div>
          <h3 class="action-dossier-title">${brief.title}</h3>
          <p class="action-dossier-desc">${brief.summary}</p>
        </div>
        <div class="row-arrow-block">
          <svg class="row-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width: 18px; height: 18px;">
            <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    `;
  });

  activeSheetEl.innerHTML = `
    <div class="workspace-dashboard">
      
      <!-- Dashboard Editorial Header -->
      <header class="synthesis-header">
        <div class="editorial-date">Synthesis Matrix — June 30, 2026</div>
        <h1 class="sheet-title">Executive Synthesis Console</h1>
        <p class="sheet-summary" style="font-style: normal; font-size: 15px; color: var(--color-text-secondary);">
          Real-time organizational synthesis. AI analysis maps operational anomalies against strategic objectives to guide high-stakes decision validation.
        </p>
      </header>

      <!-- Section 1: Business Signals -->
      <section class="dashboard-section">
        <span class="section-question-label">Business Signals</span>
        <h2 class="section-headline">What trends require immediate leadership focus?</h2>
        
        <div class="signals-grid">
          <!-- Card 1: Revenue -->
          <div class="insight-card">
            <div class="insight-header">
              <span class="insight-title">Revenue (Q2 Run Rate)</span>
              <span class="insight-trend up-sage">↑ 18%</span>
            </div>
            <div class="insight-value-block">
              <span class="insight-value">₹2.4 Cr</span>
            </div>
            <div class="insight-note-block">
              <p class="insight-note-text">
                Growth driven by high-node enterprise renewals and expanded logistics client operations.
              </p>
            </div>
            <span class="insight-confidence">94% AI Confidence • Verified by Stripe Ledger</span>
          </div>

          <!-- Card 2: Logistics Latency -->
          <div class="insight-card type-terracotta">
            <div class="insight-header">
              <span class="insight-title">Logistics Transit Latency</span>
              <span class="insight-trend up-terracotta">↑ 22%</span>
            </div>
            <div class="insight-value-block">
              <span class="insight-value">4.8 Days</span>
            </div>
            <div class="insight-note-block">
              <p class="insight-note-text">
                Congestion peaks at Singapore and Hanoi ports, causing upstream component release bottlenecks.
              </p>
            </div>
            <span class="insight-confidence">87% AI Confidence • Verified by MarineTraffic API</span>
          </div>

          <!-- Card 3: Supplier Solvency -->
          <div class="insight-card type-terracotta">
            <div class="insight-header">
              <span class="insight-title">Supplier Debt-Equity Ratio</span>
              <span class="insight-trend up-terracotta">↑ 14%</span>
            </div>
            <div class="insight-value-block">
              <span class="insight-value">2.6x Limit</span>
            </div>
            <div class="insight-note-block">
              <p class="insight-note-text">
                Hanoi tier-2 fabricators face critical cash depletion, risking material delivery breaks.
              </p>
            </div>
            <span class="insight-confidence">81% AI Confidence • Verified by Refinitiv Ratings</span>
          </div>
        </div>
      </section>

      <!-- Section 2: Strategic Actions -->
      <section class="dashboard-section">
        <span class="section-question-label">Strategic Actions</span>
        <h2 class="section-headline">What decisions are pending executive resolution?</h2>
        
        <div class="strategic-action-list">
          ${listHTML}
        </div>
      </section>

      <!-- Section 3: Future Outlook & Copilot -->
      <section class="dashboard-section">
        <span class="section-question-label">Future Outlook</span>
        <h2 class="section-headline">What projections shape our upcoming quarters?</h2>
        
        <div class="future-outlook-split">
          <!-- Mini SVG Chart -->
          <div class="chart-container" style="margin-top: 0; background-color: var(--color-bg-base); border: 1px solid var(--color-border-hairline);">
            <div class="chart-header">
              <span class="chart-title" style="font-size: 9px;">Core Sourcing Spend Outlook ($M)</span>
            </div>
            <svg class="svg-chart" style="height: 120px; width: 100%;">
              <line x1="0" y1="15" x2="100%" y2="15" stroke="var(--color-border-hairline)" stroke-width="0.75"></line>
              <line x1="0" y1="60" x2="100%" y2="60" stroke="var(--color-border-hairline)" stroke-width="0.75"></line>
              <line x1="0" y1="105" x2="100%" y2="105" stroke="var(--color-border-strong)" stroke-width="1.25"></line>
              
              <path d="M 0 100 C 80 80, 160 90, 240 40 S 320 20, 400 30" fill="none" stroke="var(--color-accent-sage)" stroke-width="2" stroke-linecap="round"></path>
              <path d="M 0 100 C 80 90, 160 110, 240 70 S 320 85, 400 80" fill="none" stroke="var(--color-accent-terracotta)" stroke-width="1.25" stroke-dasharray="2 2"></path>
              
              <circle cx="400" cy="30" r="3.5" fill="var(--color-accent-sage)"></circle>
            </svg>
            <div class="chart-legend" style="margin-top: 8px; justify-content: flex-end;">
              <div class="legend-item"><span class="legend-color sage"></span> Scenario</div>
              <div class="legend-item"><span class="legend-color terracotta"></span> Baseline</div>
            </div>
          </div>

          <!-- Modeler Promo Card -->
          <div class="outlook-modeler-promo">
            <span class="section-question-label" style="color: var(--color-accent-sage); margin-bottom: 0;">DECISION COPILOT</span>
            <h3 class="promo-title">Simulate Procurement Pivots</h3>
            <p class="promo-text">
              Adjust capital scaling ratios and geographic supply shifts to forecast mitigation lead-times and cost projections dynamically.
            </p>
            <button class="btn-editorial btn-primary" id="btn-dashboard-modeler" style="padding: 8px 16px; font-size: 11px;">
              Launch Modeler Workspace
            </button>
          </div>
        </div>
      </section>

      <!-- Section 4: Boardroom Report -->
      <section class="dashboard-section" style="margin-bottom: 0;">
        <span class="section-question-label">Boardroom Report</span>
        <h2 class="section-headline">What is ready for investor circulation?</h2>
        
        <div class="boardroom-report-panel">
          <div class="report-actions-row">
            <button class="report-action-btn" id="btn-export-pdf">
              <svg class="report-btn-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Compile Board Briefing PDF
            </button>
            <button class="report-action-btn" id="btn-sync-keynote">
              <svg class="report-btn-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Synchronize to Notion & Keynote
            </button>
          </div>
        </div>
      </section>

    </div>
  `;

  // Attach dossier card click event listeners
  document.querySelectorAll(".action-dossier-card").forEach(card => {
    card.addEventListener("click", () => {
      navigateTo("briefing", card.getAttribute("data-id"));
    });
  });

  // Attach Modeler launch listener
  const modelerLaunchBtn = document.getElementById("btn-dashboard-modeler");
  if (modelerLaunchBtn) {
    modelerLaunchBtn.addEventListener("click", () => {
      navigateTo("modeler");
    });
  }

  // Attach Boardroom alert simulation listeners
  const exportPdfBtn = document.getElementById("btn-export-pdf");
  if (exportPdfBtn) {
    exportPdfBtn.addEventListener("click", () => {
      alert("Generating Executive Briefing PDF document. Synthesis logs, modeler runs, and active dossier solutions compiled.");
    });
  }
  const syncBtn = document.getElementById("btn-sync-keynote");
  if (syncBtn) {
    syncBtn.addEventListener("click", () => {
      alert("Sync request queued. Local databases synchronized to Notion Enterprise and Keynote Cloud templates.");
    });
  }
}

// 6. Render: Decision Briefing (Editorial View)
function renderDecisionBriefing() {
  const brief = briefingsData[appState.activeBriefingId];
  let paragraphsHTML = "";
  let cardsHTML = "";
  
  brief.paragraphs.forEach((p, idx) => {
    let classList = "paragraph-block";
    let textContent = p.text;
    
    if (p.hasDropCap) {
      const firstLetter = p.text.charAt(0);
      const remainingText = p.text.slice(1);
      textContent = `<span class="drop-cap">${firstLetter}</span>${remainingText}`;
    }
    
    if (brief.id === "supply-chain" && idx === 2) {
      paragraphsHTML += `
        <div class="editorial-image-container">
          <img src="assets/shipping_logistics.png" alt="Southeast Asia Shipping Bottleneck" class="editorial-image">
function drawSvgChart(unitCost, riskScore) {
  const chart = document.getElementById("svg-chart-element");
  if (!chart) return;
  
  const width = chart.clientWidth || 500;
  const height = 160;
  
  // Baseline path: starts high, fluctuates up due to supply risks
  const p1_y = 120;
  const p2_y = 80;
  const p3_y = 100;
  const p4_y = 50;
  
  const baselinePath = `M 0 ${p1_y} Q ${width * 0.3} ${p2_y}, ${width * 0.6} ${p3_y} T ${width} ${p4_y}`;
  document.getElementById("path-baseline").setAttribute("d", baselinePath);

  // Projected path: controlled by cost and risk factors
  // Higher cost = line starts higher.
  // Higher risk = line fluctuates higher in outer quarters.
  // Good capex/low risk = line flattens out.
  const costScalar = parseFloat(unitCost) / 120; // 1.0 to 1.6
  const riskScalar = riskScore / 100; // 0.05 to 0.85
  
  const startY = 160 - (50 * costScalar); 
  const q2Y = 160 - (60 * costScalar) - (20 * riskScalar);
  const q3Y = 160 - (70 * costScalar) - (50 * riskScalar);
  const endY = 160 - (80 * costScalar) + (30 * (1 - riskScalar)); // flattens out if low risk
  
  const projectedPath = `M 0 ${startY} C ${width * 0.25} ${q2Y}, ${width * 0.6} ${q3Y}, ${width} ${endY}`;
  document.getElementById("path-projected").setAttribute("d", projectedPath);
  
  // Node marker at end
  const nodeEnd = document.getElementById("node-end");
  nodeEnd.setAttribute("cx", width);
  nodeEnd.setAttribute("cy", endY);
}

function runBriefingLoader() {
  const overlay = document.getElementById("briefing-overlay");
  const msgEl = document.getElementById("overlay-status-msg");
  const barEl = document.getElementById("overlay-progress-bar");
  const container = document.getElementById("app-container");
  
  if (!overlay || !msgEl || !barEl || !container) {
    // Fallback if elements not found
    navigateTo("executive-brief");
    return;
  }

  const stages = [
    "Reading uploaded dataset...",
    "Analyzing 18,000+ records...",
    "Finding anomalies...",
    "Identifying opportunities...",
    "Forecasting business trends...",
    "Generating strategic recommendations...",
    "Preparing boardroom briefing..."
  ];

  let currentStageIdx = 0;
  const stageDuration = 400; // 400ms per stage

  // Progress starts at 0
  barEl.style.width = "0%";

  function updateStage() {
    if (currentStageIdx < stages.length) {
      msgEl.style.opacity = "0.3";
      
      setTimeout(() => {
        msgEl.textContent = stages[currentStageIdx];
        msgEl.style.opacity = "1";
        
        const percent = Math.round(((currentStageIdx + 1) / stages.length) * 100);
        barEl.style.width = `${percent}%`;
        
        currentStageIdx++;
        setTimeout(updateStage, stageDuration);
      }, 100);
    } else {
      // Transition out
      overlay.classList.add("fade-out");
      
      setTimeout(() => {
        overlay.style.display = "none";
        
        // Elegant fade reveal of main app
        container.style.transition = "opacity 1.2s ease-in-out";
        container.style.opacity = "1";
        
        navigateTo("executive-brief");
      }, 800);
    }
  }

  // Start sequence
  updateStage();
}

// 10. Initialization
document.addEventListener("DOMContentLoaded", () => {
  // Attach Sidebar click listeners
  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", (e) => {
      const view = item.getAttribute("data-view");
      const briefId = item.getAttribute("data-brief-id");
      navigateTo(view, briefId);
    });
  });

  document.querySelectorAll(".nav-item-sub").forEach(item => {
    item.addEventListener("click", () => {
      const view = item.getAttribute("data-view");
      const briefId = item.getAttribute("data-brief-id");
      navigateTo(view, briefId);
    });
  });
  
  // Start the daily briefing loading sequence
  runBriefingLoader();
});
