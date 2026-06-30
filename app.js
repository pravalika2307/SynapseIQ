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

// 4.3. Decision Copilot - Consulting Memo Database & Render
const copilotBriefs = {
  "revenue": {
    meta: "MEMORANDUM • CONFIDENTIAL • SOURCING EXPENSES",
    title: "Revenue Contraction Analysis — Q2 2026",
    content: `
      <p>Sourcing and operational telemetry reveals that Q2 revenue contraction of 3.8% ($12.4M variance vs budget) is primarily driven by shipping latency backlogs and upstream cost escalations, rather than market demand failure.</p>
      
      <div class="matrix-card-title" style="margin-top: 16px; margin-bottom: 8px;">Core Drivers of Unit Margin Erosion:</div>
      <ul class="readout-bullet-list">
        <li class="readout-bullet-item">
          <strong>Strait of Malacca Congestion:</strong> Average transit duration rose from 14 to 32 days, resulting in late-delivery penalty clauses from high-tier electronics accounts.
        </li>
        <li class="readout-bullet-item">
          <strong>Spot Shipping Premium:</strong> Expedited container charges to clear the Shanghai corridor created a 2.4x logistics spend multiplier.
        </li>
        <li class="readout-bullet-item">
          <strong>Vietnamese Subcontractor Constraints:</strong> Solvency constraints at Hanoi fabs forced secondary vendor reliance at 18% higher tooling premiums.
        </li>
      </ul>
      
      <div class="readout-table-wrapper" style="margin-top: 16px;">
        <table class="readout-table">
          <thead>
            <tr>
              <th>Impact Channel</th>
              <th>Variance vs Baseline</th>
              <th>Primary Action Path</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Strait Delay Penalties</td>
              <td style="color: var(--color-accent-terracotta); font-weight: 600;">+$4.8M</td>
              <td>Enforce force majeure clause / Pre-clear logistics channels</td>
            </tr>
            <tr>
              <td>Spot Freight Premiums</td>
              <td style="color: var(--color-accent-terracotta); font-weight: 600;">+$3.2M</td>
              <td>Transition 30% supply capacity to Mexican rail lines</td>
            </tr>
            <tr>
              <td>Vendor tooling markups</td>
              <td style="color: var(--color-accent-terracotta); font-weight: 600;">+$1.4M</td>
              <td>Provide short-term supplier working-capital injection</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  },
  "regions": {
    meta: "ASSESSMENT BRIEFING • SUPPLY PATH RISKS",
    title: "Geographical Transit Exposure Audit",
    content: `
      <p>Multi-node parsing identifies <strong>Southeast Asia (Vietnam and Singapore hubs)</strong> as the critical vulnerability vector, accounting for 74% of active operational exposure.</p>
      
      <div class="readout-matrix" style="margin-top: 16px;">
        <div class="matrix-card">
          <div class="matrix-card-title" style="color: var(--color-accent-terracotta);">Singapore Port</div>
          <p class="matrix-card-text">Transit queue backlogs are at peak historical density (30-day delays). Risk level is critical. Recommended action is immediate implementation of local customs pre-clearance and container tracking buffers.</p>
        </div>
        <div class="matrix-card">
          <div class="matrix-card-title" style="color: var(--color-accent-terracotta);">Vietnam Assembly</div>
          <p class="matrix-card-text">High debt leverage and credit rating drops in the Hanoi precision tooling tier present immediate liquidity risks. Secondary sourcing buffers must be activated.</p>
        </div>
      </div>

      <div class="matrix-card" style="margin-top: 0;">
        <div class="matrix-card-title" style="color: var(--color-accent-sage);">Mexico Corridor (Laredo/Guadalajara)</div>
        <p class="matrix-card-text">Guadalajara and Laredo transit times are holding at 6 days with unit pricing variations of +8%. Excellent buffer candidate to absorb Southeast Asian delay profiles.</p>
      </div>
    `
  },
  "predict": {
    meta: "PREDICTIVE MODEL • BOARD COMPILATION",
    title: "Q3 2026 Procurement Projections & Margin Trends",
    content: `
      <p>Predictive analytics project a baseline unit cost surge of +23% ($192/unit avg) if current supply chain routing is maintained. Transitioning to a hybrid nearshoring model shifts the expected cost trajectory downwards.</p>
      
      <div class="readout-table-wrapper" style="margin-top: 16px;">
        <table class="readout-table">
          <thead>
            <tr>
              <th>Routing Scenario</th>
              <th>Avg Lead Time</th>
              <th>Projected Unit Cost</th>
              <th>Risk Coefficient</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Scenario A (Baseline - Global First)</td>
              <td>13 Days</td>
              <td>$192.14</td>
              <td style="color: var(--color-accent-terracotta); font-weight: 600;">68%</td>
            </tr>
            <tr>
              <td><strong>Scenario B (Optimized - Hybrid Regional)</strong></td>
              <td><strong>11 Days</strong></td>
              <td><strong>$147.14</strong></td>
              <td style="color: var(--color-accent-sage); font-weight: 600;"><strong>25%</strong></td>
            </tr>
            <tr>
              <td>Scenario C (Local Sourcing - Domestic Focus)</td>
              <td>4 Days</td>
              <td>$165.40</td>
              <td style="color: var(--color-accent-sage); font-weight: 600;">12%</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <p style="font-size: 11px; color: var(--color-text-muted); margin-top: 8px;"><em>*Projections based on Monte Carlo simulations parsing 18,240 records across Q3 trade policy vectors. Confidence interval: 93%.</em></p>
    `
  },
  "action": {
    meta: "TACTICAL DISPOSITION SHEET • ACTIONS REQUIRED",
    title: "Vietnamese Transit Mitigation Action Plan",
    content: `
      <p>This action plan details tactical steps required to insulate critical assemblies from Southeast Asian shipping congestion and supply-side liquidity failures.</p>
      
      <div class="matrix-card-title" style="margin-top: 16px; margin-bottom: 8px;">Phased Strategic Sequence:</div>
      <ul class="readout-bullet-list">
        <li class="readout-bullet-item">
          <strong>Phase 1 (Immediate - 15 Days):</strong> Re-route 35% of Hanoi production buffers to Guadalajara. Authorize air freight premiums ($1.2M CapEx) to bypass maritime delays on high-priority orders.
        </li>
        <li class="readout-bullet-item">
          <strong>Phase 2 (Mid-term - 15-60 Days):</strong> Inject short-term liquidity/pre-payments into Tier-2 Vietnamese suppliers to secure production queues and forestall vendor insolvencies.
        </li>
        <li class="readout-bullet-item">
          <strong>Phase 3 (Long-term - 60-90 Days):</strong> Transition to nearshoring networks. Establish secondary manufacturing routes using Guadalajara and Laredo customs corridors to permanently lower systemic dependency.
        </li>
      </ul>
    `
  },
  "summary": {
    meta: "DATASET SUMMARY • EXECUTIVE SYNOPSIS",
    title: "Database Telemetry Synthesis Report",
    content: `
      <p>Synthesis of the active procurement database consisting of 18,240 records across 14 transaction variables. Overall quality is robust, exposing targeted operational risks.</p>
      
      <div class="readout-matrix" style="margin-top: 16px;">
        <div class="matrix-card">
          <div class="matrix-card-title">Data Integrity</div>
          <p class="matrix-card-text">99.8% successfully parsed. Clean fields with zero null vectors or missing date records. High statistical confidence.</p>
        </div>
        <div class="matrix-card">
          <div class="matrix-card-title">Anomalies Isolated</div>
          <p class="matrix-card-text">14 high-severity anomalies isolated (primarily supply-side pricing spikes and shipping container delays).</p>
        </div>
      </div>
      
      <div class="matrix-card" style="margin-top: 0;">
        <div class="matrix-card-title">Primary Objective</div>
        <p class="matrix-card-text">Optimize global transit paths, protect core margin thresholds, and resolve supplier capital exposure vulnerabilities.</p>
      </div>
    `
  }
};

function renderDecisionCopilot() {
  activeSheetEl.innerHTML = `
    <div class="copilot-layout">
      <!-- Left Control Panel (Mission Control Diagnostics & Prompts) -->
      <div class="copilot-control-panel">
        
        <!-- Dataset Telemetry Widget -->
        <div class="copilot-telemetry">
          <div class="telemetry-item" style="grid-column: span 2; border-bottom: 0.75px solid var(--color-border-hairline); padding-bottom: 6px; margin-bottom: 4px;">
            <span class="telemetry-label">Active Sourcing Dataset</span>
            <span class="telemetry-val" style="font-family: var(--font-serif); font-size: 13px;">global_procurement_Q2.csv</span>
          </div>
          <div class="telemetry-item">
            <span class="telemetry-label">Record Count</span>
            <span class="telemetry-val">18,240 Rows</span>
          </div>
          <div class="telemetry-item">
            <span class="telemetry-label">Data Integrity</span>
            <span class="telemetry-val" style="color: var(--color-accent-sage);">99.8% Optimal</span>
          </div>
          <div class="telemetry-item">
            <span class="telemetry-label">Anomalies</span>
            <span class="telemetry-val" style="color: var(--color-accent-terracotta);">14 isolated</span>
          </div>
          <div class="telemetry-item">
            <span class="telemetry-label">Copilot Mode</span>
            <span class="telemetry-val">Consultant</span>
          </div>
        </div>

        <!-- Strategy Prompts Deck -->
        <div class="nav-section-title" style="padding-left: 0; margin-bottom: 4px; margin-top: 8px;">Consultant Inquiry Deck</div>
        <div class="copilot-prompt-deck">
          <button class="prompt-card active" data-brief="revenue">
            <span class="prompt-card-category">Financial Impact</span>
            <span class="prompt-card-text">Why did revenue decline?</span>
          </button>
          
          <button class="prompt-card" data-brief="regions">
            <span class="prompt-card-category">Risk Exposure</span>
            <span class="prompt-card-text">Which region needs attention?</span>
          </button>
          
          <button class="prompt-card" data-brief="predict">
            <span class="prompt-card-category">Projections</span>
            <span class="prompt-card-text">Predict next quarter.</span>
          </button>
          
          <button class="prompt-card" data-brief="action">
            <span class="prompt-card-category">Action Plan</span>
            <span class="prompt-card-text">Generate an action plan.</span>
          </button>
          
          <button class="prompt-card" data-brief="summary">
            <span class="prompt-card-category">Data Synthesis</span>
            <span class="prompt-card-text">Summarize this dataset.</span>
          </button>
        </div>

      </div>

      <!-- Right Readout Panel (Consultant Memorandums) -->
      <div class="copilot-readout-panel">
        <header class="readout-header">
          <span class="readout-meta" id="readout-meta">MEMORANDUM • CONFIDENTIAL • SOURCING EXPENSES</span>
          <h2 class="readout-title" id="readout-title">Revenue Contraction Analysis — Q2 2026</h2>
        </header>
        
        <div class="readout-body" id="readout-body">
          <!-- Inserted Dynamically -->
        </div>
      </div>

      <!-- Custom Query Bar (Bottom Span) -->
      <div class="copilot-input-container">
        <div class="copilot-input-wrapper">
          <input type="text" class="copilot-input" id="copilot-query-input" placeholder="Formulate custom strategic query (e.g. 'How does Shanghai container pricing affect Mexico tooling margins?')...">
        </div>
        <button class="btn-editorial btn-primary" id="copilot-query-btn" style="padding: 12px 24px; font-size: 11px;">
          Execute Query
        </button>
      </div>

    </div>
  `;

  // Render initial active card (revenue)
  const defaultBrief = copilotBriefs["revenue"];
  document.getElementById("readout-body").innerHTML = defaultBrief.content;

  // Bind Copilot event listeners
  setupCopilotListeners();
}

function setupCopilotListeners() {
  const cards = document.querySelectorAll(".prompt-card");
  const metaEl = document.getElementById("readout-meta");
  const titleEl = document.getElementById("readout-title");
  const bodyEl = document.getElementById("readout-body");
  const inputEl = document.getElementById("copilot-query-input");
  const buttonEl = document.getElementById("copilot-query-btn");

  if (!cards || !bodyEl || !metaEl || !titleEl) return;

  // Click card handlers
  cards.forEach(card => {
    card.addEventListener("click", () => {
      // Clear active classes
      cards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      const briefId = card.getAttribute("data-brief");
      const brief = copilotBriefs[briefId];
      if (!brief) return;

      // Smooth fade transition
      bodyEl.style.opacity = "0";
      setTimeout(() => {
        metaEl.textContent = brief.meta;
        titleEl.textContent = brief.title;
        bodyEl.innerHTML = brief.content;
        bodyEl.style.opacity = "1";
      }, 150);
    });
  });

  // Custom strategic query submission handler
  const handleQuery = () => {
    const queryText = inputEl.value.trim();
    if (!queryText) return;

    // Deselect other prompt cards
    cards.forEach(c => c.classList.remove("active"));

    // Render loading steps inside the memo area
    bodyEl.style.opacity = "0";
    setTimeout(() => {
      metaEl.textContent = "AI SEARCH & REASONING MODEL";
      titleEl.textContent = "Processing Strategic Inquiry...";
      bodyEl.innerHTML = `
        <div class="copilot-loader">
          <span id="loader-step">Querying procurement databases...</span>
          <div class="loader-track">
            <div class="loader-bar"></div>
          </div>
        </div>
      `;
      bodyEl.style.opacity = "1";
      
      const stepEl = document.getElementById("loader-step");
      
      // Animate loading stages
      setTimeout(() => {
        if (stepEl) stepEl.textContent = "Assessing supply path node models...";
      }, 700);

      setTimeout(() => {
        if (stepEl) stepEl.textContent = "Generating strategic action briefs...";
      }, 1400);

      // Render custom generated consulting brief response
      setTimeout(() => {
        bodyEl.style.opacity = "0";
        setTimeout(() => {
          metaEl.textContent = "BOARDROOM SYNTHESIS REPORT • CONSULTANT RESPONSE";
          titleEl.textContent = `Consultation Brief: "${queryText.length > 40 ? queryText.slice(0, 40) + '...' : queryText}"`;
          
          // Tailor response slightly if keywords are present
          let resultText = "";
          let lowerText = queryText.toLowerCase();

          if (lowerText.includes("mexico") || lowerText.includes("guadalajara")) {
            resultText = `
              <p>Operational logic parses Guadalajara as highly viable for nearshoring buffer routing, showing resilient 6-day lead times. However, custom tariffs introduce a localized unit premium of 8.2% ($12.50 per tool assembly SKU).</p>
              <div class="matrix-card" style="margin-top: 16px;">
                <div class="matrix-card-title" style="color: var(--color-accent-sage);">Guadalajara / Laredo Corridor Outlook</div>
                <p class="matrix-card-text">Infrastructure capacities are strong, but long-term exposure mitigation requires establishing localized supply channels rather than purely re-routing global raw inputs.</p>
              </div>
            `;
          } else if (lowerText.includes("cost") || lowerText.includes("pricing") || lowerText.includes("margin")) {
            resultText = `
              <p>Cost variance analysis projects procurement spot freight rate premiums to persist throughout Q3. Establishing container pre-allocations and transition strategies lowers projected Unit Sourcing Cost by 24% ($147.14 vs. $192.14 baseline).</p>
              <div class="readout-table-wrapper" style="margin-top: 16px;">
                <table class="readout-table">
                  <thead>
                    <tr>
                      <th>Sourcing Strategy</th>
                      <th>Expected Q3 Margin</th>
                      <th>Logistics CapEx Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Global-First (Base)</td>
                      <td style="color: var(--color-accent-terracotta);">32% Gross</td>
                      <td>$0.0M</td>
                    </tr>
                    <tr>
                      <td><strong>Hybrid-Regional</strong></td>
                      <td style="color: var(--color-accent-sage);"><strong>44% Gross</strong></td>
                      <td><strong>$40.0M</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            `;
          } else {
            resultText = `
              <p>Sourcing analysis evaluated trade lane vectors, supplier indices, and maritime congestion signals. We isolate 14 critical pricing/shipping anomalies across 18,240 records.</p>
              <div class="matrix-card" style="margin-top: 16px;">
                <div class="matrix-card-title" style="color: var(--color-accent-olive);">Primary Consulting Verdict</div>
                <p class="matrix-card-text">To defend margins from Southeast Asian port backlogs, near-term capital reallocation to secondary assembly hubs (e.g. Mexico) is highly recommended.</p>
              </div>
            `;
          }

          bodyEl.innerHTML = resultText;
          bodyEl.style.opacity = "1";
          inputEl.value = ""; // clear field
        }, 150);
      }, 2100);

    }, 150);
  };

  // Click query button
  buttonEl.addEventListener("click", handleQuery);

  // Press Enter key on input field
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleQuery();
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
  let summaryCardHTML = "";
  if (appState.activeDataset) {
    const d = appState.activeDataset;
    let metricsHTML = "";
    if (d.metrics && d.metrics.length > 0) {
      d.metrics.forEach(m => {
        metricsHTML += `<span class="summary-metric-pill">${m}</span>`;
      });
    } else {
      metricsHTML = `<span class="summary-metric-empty">None identified</span>`;
    }

    summaryCardHTML = `
      <div class="dataset-summary-card">
        <div class="summary-card-header">
          <span class="summary-card-title">${d.name}</span>
          <span class="summary-card-meta">ACTIVE DATASET INTAKE AUDIT</span>
        </div>
        <div class="summary-card-grid">
          <div class="summary-grid-item">
            <span class="summary-item-label">Rows</span>
            <span class="summary-item-value">${d.rows.toLocaleString()}</span>
          </div>
          <div class="summary-grid-item">
            <span class="summary-item-label">Columns</span>
            <span class="summary-item-value">${d.columns}</span>
          </div>
          <div class="summary-grid-item">
            <span class="summary-item-label">Detected Domain</span>
            <span class="summary-item-value" style="color: var(--color-accent-sage);">${d.domain}</span>
          </div>
          <div class="summary-grid-item">
            <span class="summary-item-label">Data Quality</span>
            <span class="summary-item-value" style="color: var(--color-accent-sage);">${d.quality}</span>
          </div>
          <div class="summary-grid-item" style="grid-column: span 2;">
            <span class="summary-item-label">Metrics Identified</span>
            <div class="summary-metrics-list">${metricsHTML}</div>
          </div>
          <div class="summary-grid-item">
            <span class="summary-item-label">Missing Values</span>
            <span class="summary-item-value" style="${d.missingValues > 0 ? 'color: var(--color-accent-terracotta);' : ''}">${d.missingValues}</span>
          </div>
          <div class="summary-grid-item">
            <span class="summary-item-label">Confidence Index</span>
            <span class="summary-item-value" style="color: var(--color-accent-olive);">${d.confidence}</span>
          </div>
        </div>
      </div>
    `;
  }

  activeSheetEl.innerHTML = `
    <div class="brief-layout">
      <header class="brief-header">
        <span class="brief-tag">DAILY REPORT — BOARD CONFIDENTIAL</span>
        <h1 class="sheet-title">Today's Executive Brief</h1>
        <p class="sheet-summary" style="font-style: normal; font-size: 15px; color: var(--color-text-secondary);">
          A synthesized morning briefing prepared for the Executive Desk. AI analysis maps strategic operational opportunities and vulnerabilities from raw enterprise indicators.
        </p>
      </header>

      ${summaryCardHTML}

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
          <div class="image-caption">Figure 1.1: Visualizing maritime transit queues outside South China Sea ports.</div>
        </div>
      `;
    }

    if (p.annotation) {
      const annotColorClass = p.annotation.type === "terracotta" ? "has-annotation-terracotta" : "has-annotation";
      classList += ` ${annotColorClass}`;
      
      paragraphsHTML += `
        <div class="${classList}" id="p-block-${idx}" data-annotation-id="card-${idx}">
          ${textContent}
        </div>
      `;
      
      cardsHTML += `
        <div class="annotation-card type-${p.annotation.type}" id="card-${idx}" data-p-id="p-block-${idx}">
          <span class="card-tag">${p.annotation.tag}</span>
          <p class="card-summary">${p.annotation.summary}</p>
          <div class="card-footer">
            <span class="confidence-score">${p.annotation.confidence}</span>
            <span>Source: ${p.annotation.source}</span>
          </div>
        </div>
      `;
    } else {
      paragraphsHTML += `
        <div class="${classList}" id="p-block-${idx}">
          ${textContent}
        </div>
      `;
    }
  });

  // Supply-chain specific Scenario Modeler promo link
  let bottomActionHTML = "";
  if (brief.id === "supply-chain") {
    bottomActionHTML = `
      <div class="sheet-actions-footer">
        <button class="btn-editorial btn-secondary" id="action-archive">Acknowledge Receipt</button>
        <button class="btn-editorial btn-primary" id="action-modeler">Open Scenario Modeler →</button>
      </div>
    `;
  } else {
    bottomActionHTML = `
      <div class="sheet-actions-footer">
        <button class="btn-editorial btn-secondary" id="action-archive">Acknowledge Receipt</button>
        <button class="btn-editorial btn-primary" id="action-close">Return to Briefings</button>
      </div>
    `;
  }

  activeSheetEl.innerHTML = `
    <div class="briefing-layout">
      <header>
        <div class="sheet-meta-sec">
          <span>${brief.category}</span>
          <span>${brief.date}</span>
          <span>${brief.readTime}</span>
        </div>
        <h1 class="sheet-title">${brief.title}</h1>
        
        <div class="sheet-description-grid">
          <div class="sheet-summary">${brief.summary}</div>
          <div class="sheet-meta-block">
            <div>
              <span class="meta-label">Author</span>
              <div class="meta-val">${brief.author}</div>
            </div>
            <div>
              <span class="meta-label">Security</span>
              <div class="meta-val">Board Confidential</div>
            </div>
          </div>
        </div>
      </header>
      
      <section class="briefing-body">
        ${paragraphsHTML}
      </section>

      ${bottomActionHTML}
    </div>
  `;
  
  // Inject cards into rail
  railCardsContainerEl.innerHTML = cardsHTML;
  
  // Attach listeners for interactive paragraph alignments & highlights
  setupAnnotationInteractionListeners();
  
  // Footers buttons
  const modelerBtn = document.getElementById("action-modeler");
  if (modelerBtn) {
    modelerBtn.addEventListener("click", () => navigateTo("modeler"));
  }
  const closeBtn = document.getElementById("action-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => navigateTo("synthesis"));
  }
  const ackBtn = document.getElementById("action-archive");
  if (ackBtn) {
    ackBtn.addEventListener("click", () => {
      alert("Briefing receipt logged. Synthetic intelligence database updated.");
      navigateTo("synthesis");
    });
  }
}

// 7. Render: Scenario Modeler View
function renderScenarioModeler() {
  activeSheetEl.innerHTML = `
    <div class="modeler-layout">
      <header class="synthesis-header">
        <div class="editorial-date">Simulation Matrix</div>
        <h1 class="sheet-title">Supply Chain Modeler</h1>
        <p class="sheet-summary" style="font-style: normal; font-size: 15px; color: var(--color-text-secondary);">
          Toggle geographic procurement sourcing structures and adjust capital scales to project lead-time mitigation ratios and unit cost variances.
        </p>
      </header>

      <div class="modeler-grid">
        <!-- Controls Column -->
        <div class="modeler-controls">
          <div class="control-group">
            <div class="control-header">
              <span class="control-label">Sourcing Strategy</span>
            </div>
            <div class="toggle-group" id="sourcing-toggles">
              <button class="toggle-btn" data-value="global">Global-First</button>
              <button class="toggle-btn" data-value="hybrid">Hybrid-Regional</button>
              <button class="toggle-btn" data-value="domestic">Domestic-Focus</button>
            </div>
          </div>

          <div class="control-group">
            <div class="control-header">
              <span class="control-label">Capital Allocation</span>
              <span class="control-value" id="capex-val">$40M</span>
            </div>
            <input type="range" min="10" max="100" step="5" value="40" class="desk-slider" id="capex-slider">
            <span class="meta-label" style="font-size:9px;">Allocated to tooling, custom logistics corridors, and customs pre-clearance.</span>
          </div>

          <div class="control-group">
            <div class="control-header">
              <span class="control-label">Inventory Buffer</span>
              <span class="control-value" id="buffer-val">30 Days</span>
            </div>
            <input type="range" min="0" max="90" step="5" value="30" class="desk-slider" id="buffer-slider">
            <span class="meta-label" style="font-size:9px;">Dedicated warehouse storage limits representing security stock coefficients.</span>
          </div>
        </div>

        <!-- Outputs Column -->
        <div class="modeler-outputs">
          <div class="output-metrics">
            <div class="metric-card">
              <div class="metric-card-label">Logistics Lead Time</div>
              <div class="metric-card-value" id="out-lead-time">14 Days</div>
              <div class="metric-card-delta positive" id="out-lead-delta">-12 Days</div>
            </div>
            <div class="metric-card">
              <div class="metric-card-label">Unit Sourcing Cost</div>
              <div class="metric-card-value" id="out-unit-cost">$155.00</div>
              <div class="metric-card-delta negative" id="out-cost-delta">+29% over baseline</div>
            </div>
          </div>

          <div class="output-metrics" style="grid-template-columns: 1fr; margin-bottom: 0;">
            <div class="metric-card" style="padding: 12px 16px;">
              <div class="metric-card-label">Supply Chain Risk Coefficient</div>
              <div style="display: flex; align-items: center; gap: var(--spacing-sm); margin-top: 4px;">
                <div class="metric-card-value" id="out-risk-val" style="font-size: 20px;">42%</div>
                <div style="flex-grow: 1; height: 4px; background-color: var(--color-border-strong); border-radius: var(--radius-sm); position: relative; overflow: hidden;">
                  <div id="risk-bar" style="position: absolute; left: 0; top: 0; bottom: 0; width: 42%; background-color: var(--color-accent-sage); transition: width var(--transition-smooth);"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="output-narrative-container">
            <div class="narrative-title">Synthesis Forecast</div>
            <p class="narrative-text" id="out-narrative">Loading forecast projection...</p>
          </div>
        </div>
      </div>

      <!-- Forecast SVG Trend Graph -->
      <div class="chart-container">
        <div class="chart-header">
          <span class="chart-title">4-Quarter Supply Chain Spend Trend ($M)</span>
          <div class="chart-legend">
            <div class="legend-item"><span class="legend-color sage"></span> Projected Scenario</div>
            <div class="legend-item"><span class="legend-color terracotta"></span> Baseline Risk Margin</div>
          </div>
        </div>
        <!-- Premium SVG Graph -->
        <svg class="svg-chart" id="svg-chart-element">
          <!-- Graph Gridlines -->
          <line x1="0" y1="20" x2="100%" y2="20" stroke="var(--color-border-hairline)" stroke-width="1"></line>
          <line x1="0" y1="70" x2="100%" y2="70" stroke="var(--color-border-hairline)" stroke-width="1"></line>
          <line x1="0" y1="120" x2="100%" y2="120" stroke="var(--color-border-hairline)" stroke-width="1"></line>
          <line x1="0" y1="160" x2="100%" y2="160" stroke="var(--color-border-strong)" stroke-width="1.5"></line>

          <!-- Label markers -->
          <text x="0" y="15" fill="var(--color-text-muted)" font-size="8">MAX</text>
          <text x="0" y="155" fill="var(--color-text-muted)" font-size="8">BASE</text>
          
          <text x="10%" y="175" fill="var(--color-text-secondary)" font-size="9" text-anchor="middle">Q3 '26</text>
          <text x="36%" y="175" fill="var(--color-text-secondary)" font-size="9" text-anchor="middle">Q4 '26</text>
          <text x="63%" y="175" fill="var(--color-text-secondary)" font-size="9" text-anchor="middle">Q1 '27</text>
          <text x="90%" y="175" fill="var(--color-text-secondary)" font-size="9" text-anchor="middle">Q2 '27</text>

          <!-- Paths: updated in javascript -->
          <path id="path-baseline" fill="none" stroke="var(--color-accent-terracotta)" stroke-width="1.5" stroke-dasharray="3 3"></path>
          <path id="path-projected" fill="none" stroke="var(--color-accent-sage)" stroke-width="2.5" stroke-linecap="round"></path>
          
          <!-- Interactive Nodes -->
          <circle id="node-end" r="4" fill="var(--color-accent-sage)"></circle>
        </svg>
      </div>

      <div class="sheet-actions-footer">
        <button class="btn-editorial btn-secondary" id="action-modeler-cancel">Return to Briefings</button>
        <button class="btn-editorial btn-primary" id="action-modeler-save">Approve Sourcing Strategy Direction</button>
      </div>
    </div>
  `;

  // Attach controls listeners
  setupModelerControlsListeners();
  
  // Run initial calculator update
  updateModelerCalculations();
}

// 8. Annotation Margins Alignment Engine
function alignAnnotationCards() {
  if (appState.currentView !== "briefing") return;
  
  const cards = document.querySelectorAll(".annotation-card");
  const sheet = document.getElementById("active-sheet");
  if (!sheet) return;

  cards.forEach(card => {
    const pId = card.getAttribute("data-p-id");
    const pEl = document.getElementById(pId);
    
    if (pEl) {
      // Calculate vertical offset of paragraph relative to the desk sheet
      const pRect = pEl.getBoundingClientRect();
      const sheetRect = sheet.getBoundingClientRect();
      const offsetTop = pRect.top - sheetRect.top;
      
      // Position card in the rail
      card.style.top = `${offsetTop}px`;
    }
  });
}

function setupAnnotationInteractionListeners() {
  const pBlocks = document.querySelectorAll(".paragraph-block");
  const cards = document.querySelectorAll(".annotation-card");

  pBlocks.forEach(p => {
    if (p.getAttribute("data-annotation-id")) {
      p.addEventListener("mouseenter", () => {
        // Focus this paragraph & corresponding card
        focusAnnotation(p.id, p.getAttribute("data-annotation-id"));
      });
      p.addEventListener("mouseleave", () => {
        unfocusAll();
      });
    }
  });

  cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      focusAnnotation(card.getAttribute("data-p-id"), card.id);
    });
    card.addEventListener("mouseleave", () => {
      unfocusAll();
    });
  });
  
  // Re-align on window resize
  window.addEventListener("resize", alignAnnotationCards);
}

function focusAnnotation(pId, cardId) {
  unfocusAll();
  
  const pEl = document.getElementById(pId);
  const cardEl = document.getElementById(cardId);
  
  if (pEl) pEl.classList.add("active-focus");
  if (cardEl) {
    cardEl.classList.add("focused");
    // Ensure card has high z-index and perfect visibility
    cardEl.style.opacity = "1";
    cardEl.style.transform = "scale(1.02)";
  }
}

function unfocusAll() {
  document.querySelectorAll(".paragraph-block").forEach(p => {
    p.classList.remove("active-focus");
  });
  document.querySelectorAll(".annotation-card").forEach(card => {
    card.classList.remove("focused");
    card.style.opacity = "";
    card.style.transform = "";
  });
}

// 9. Modeler Simulation Calculations & SVGs
function setupModelerControlsListeners() {
  // Sourcing Focus Toggles
  const toggles = document.querySelectorAll("#sourcing-toggles .toggle-btn");
  toggles.forEach(btn => {
    // Set active class based on state
    if (btn.getAttribute("data-value") === appState.modeler.sourcingFocus) {
      btn.classList.add("active");
    }
    
    btn.addEventListener("click", () => {
      toggles.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      appState.modeler.sourcingFocus = btn.getAttribute("data-value");
      updateModelerCalculations();
    });
  });

  // Sliders
  const capexSlider = document.getElementById("capex-slider");
  const capexVal = document.getElementById("capex-val");
  capexSlider.value = appState.modeler.capexScale;
  capexVal.textContent = `$${appState.modeler.capexScale}M`;
  capexSlider.addEventListener("input", (e) => {
    appState.modeler.capexScale = parseInt(e.target.value);
    capexVal.textContent = `$${appState.modeler.capexScale}M`;
    updateModelerCalculations();
  });

  const bufferSlider = document.getElementById("buffer-slider");
  const bufferVal = document.getElementById("buffer-val");
  bufferSlider.value = appState.modeler.bufferDays;
  bufferVal.textContent = `${appState.modeler.bufferDays} Days`;
  bufferSlider.addEventListener("input", (e) => {
    appState.modeler.bufferDays = parseInt(e.target.value);
    bufferVal.textContent = `${appState.modeler.bufferDays} Days`;
    updateModelerCalculations();
  });

  // Save/Cancel buttons
  document.getElementById("action-modeler-cancel").addEventListener("click", () => {
    navigateTo("briefing", "supply-chain");
  });
  document.getElementById("action-modeler-save").addEventListener("click", () => {
    alert(`Procurement strategy approved: ${appState.modeler.sourcingFocus.toUpperCase()} sourcing focus with $${appState.modeler.capexScale}M Capex budget expansion.`);
    navigateTo("synthesis");
  });
}

function updateModelerCalculations() {
  const sf = appState.modeler.sourcingFocus;
  const capex = appState.modeler.capexScale;
  const buffer = appState.modeler.bufferDays;
  
  // Calculate Lead Time (Days)
  // Baseline: Global = 30, Hybrid = 16, Domestic = 6
  let baseLead = 30;
  if (sf === "hybrid") baseLead = 16;
  if (sf === "domestic") baseLead = 6;
  
  // Capex reduction (up to 40% reduction based on spend scale)
  const capexReductionCoeff = 1 - (capex / 100) * 0.4; 
  let finalLeadTime = Math.max(2, Math.round(baseLead * capexReductionCoeff));
  
  // Adjust output elements
  const leadValEl = document.getElementById("out-lead-time");
  leadValEl.textContent = `${finalLeadTime} Days`;
  
  const leadDeltaEl = document.getElementById("out-lead-delta");
  const baselineDiff = finalLeadTime - 30;
  if (baselineDiff < 0) {
    leadDeltaEl.textContent = `${baselineDiff} Days vs. baseline`;
    leadDeltaEl.className = "metric-card-delta positive";
  } else {
    leadDeltaEl.textContent = `Baseline latency`;
    leadDeltaEl.className = "metric-card-delta";
  }

  // Calculate Unit Sourcing Cost ($)
  // Baseline: Global = 120, Hybrid = 152, Domestic = 194
  let baseCost = 120;
  if (sf === "hybrid") baseCost = 152;
  if (sf === "domestic") baseCost = 194;
  
  // Capex offset (Capex investment efficiency slightly lowers unit costs over time: up to 8%)
  const capexCostDiscount = 1 - (capex / 100) * 0.08;
  const finalUnitCost = (baseCost * capexCostDiscount).toFixed(2);
  
  const costValEl = document.getElementById("out-unit-cost");
  costValEl.textContent = `$${finalUnitCost}`;
  
  const costDeltaEl = document.getElementById("out-cost-delta");
  const costRatio = Math.round(((finalUnitCost - 120) / 120) * 100);
  if (costRatio > 0) {
    costDeltaEl.textContent = `+${costRatio}% cost premium`;
    costDeltaEl.className = "metric-card-delta negative";
  } else if (costRatio < 0) {
    costDeltaEl.textContent = `${costRatio}% cost optimization`;
    costDeltaEl.className = "metric-card-delta positive";
  } else {
    costDeltaEl.textContent = `Baseline sourcing cost`;
    costDeltaEl.className = "metric-card-delta";
  }

  // Calculate Risk Index
  // Buffer days reduce risk (each day of buffer offsets risk by 0.5%)
  // Sourcing focus risk base: Global = 85%, Hybrid = 45%, Domestic = 12%
  let baseRisk = 85;
  if (sf === "hybrid") baseRisk = 45;
  if (sf === "domestic") baseRisk = 12;
  
  // Capex also reduces operational risk by building corridors (up to 20% risk offset)
  const capexRiskDiscount = (capex / 100) * 20;
  const bufferRiskDiscount = (buffer / 90) * 35;
  
  let finalRisk = Math.max(5, Math.round(baseRisk - capexRiskDiscount - bufferRiskDiscount));
  
  const riskValEl = document.getElementById("out-risk-val");
  riskValEl.textContent = `${finalRisk}%`;
  
  const riskBar = document.getElementById("risk-bar");
  riskBar.style.width = `${finalRisk}%`;
  if (finalRisk < 30) {
    riskBar.style.backgroundColor = "var(--color-accent-sage)";
  } else if (finalRisk < 60) {
    riskBar.style.backgroundColor = "var(--color-accent-olive)";
  } else {
    riskBar.style.backgroundColor = "var(--color-accent-terracotta)";
  }

  // Narrative Text Compiler
  const narrativeEl = document.getElementById("out-narrative");
  let narrativeText = "";
  if (sf === "global") {
    narrativeText = `Maintaining our primary node focus in Singapore/Hanoi yields a highly optimal unit cost baseline ($${finalUnitCost}). However, it forces executive leadership to accept high exposure grids. Low capex corridors result in shipping backlogs, leaving a Risk Coefficient of ${finalRisk}%. Upstream supply disruptions remain likely.`;
  } else if (sf === "hybrid") {
    narrativeText = `Establishing secondary channels in Mexico and regional buffer centers provides structural flexibility. The unit cost premium of $${finalUnitCost} remains moderate. High capex allocation ($${capex}M) mitigates transit times, keeping lead latency at a low ${finalLeadTime} days and risk moderate at ${finalRisk}%.`;
  } else {
    narrativeText = `A Domestic-First sourcing alignment entirely insulates production loops from international maritime passage risks, dropping risk coefficients to a minimal ${finalRisk}%. However, structural localization constraints push unit procurement costs to a peak of $${finalUnitCost}. Highly recommended for tariff protection.`;
  }
  narrativeEl.textContent = narrativeText;

  // Render SVG charts
  drawSvgChart(finalUnitCost, finalRisk);
}

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
  
  if (!overlay || !msgEl || !barEl) {
    navigateTo("executive-brief");
    return;
  }

  // Display overlay with flex
  overlay.style.display = "flex";
  
  // Force reflow and animate opacity
  overlay.offsetHeight;
  overlay.style.opacity = "1";

  const stages = [
    "Reading Dataset",
    "Validating Structure",
    "Cleaning Missing Values",
    "Detecting Business Metrics",
    "Finding Anomalies",
    "Building Executive Brief",
    "Preparing Decision Workspace"
  ];

  let currentStageIdx = 0;
  const stageDuration = 450; // 450ms * 7 stages = ~3.2 seconds total processing time

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
      }, 50);
    } else {
      // Complete! Trigger Elegant transitions
      overlay.style.opacity = "0";
      
      // Scale down and fade out landing container
      const landingContainer = document.getElementById("landing-container");
      if (landingContainer) {
        landingContainer.classList.add("fade-out");
      }
      
      setTimeout(() => {
        overlay.style.display = "none";
        if (landingContainer) {
          landingContainer.style.display = "none";
        }
        
        // Scale up and fade in workspace container
        const appContainer = document.getElementById("app-container");
        if (appContainer) {
          appContainer.style.display = "flex";
          // force reflow
          appContainer.offsetHeight;
          appContainer.classList.add("fade-in");
        }
        
        // Render brief view with dynamic summary card
        navigateTo("executive-brief");
      }, 800);
    }
  }

  // Start sequence
  updateStage();
}

// 9. Client-side File Upload & Parser
function setupLandingGreeting() {
  const greetingTitle = document.getElementById("greeting-title");
  if (greetingTitle) {
    const hour = new Date().getHours();
    let greetingText = "Good Evening."; 
    
    if (hour < 12) {
      greetingText = "Good Morning.";
    } else if (hour < 17) {
      greetingText = "Good Afternoon.";
    } else {
      greetingText = "Good Evening.";
    }
    
    greetingTitle.textContent = greetingText;
  }
}

function setupDragAndDrop() {
  const dropZone = document.getElementById("drop-zone");
  const fileSelector = document.getElementById("file-selector");
  
  if (!dropZone || !fileSelector) return;

  dropZone.addEventListener("click", (e) => {
    if (e.target !== fileSelector) {
      fileSelector.click();
    }
  });

  fileSelector.addEventListener("change", (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  });

  ["dragenter", "dragover"].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add("drag-active");
    }, false);
  });

  ["dragleave", "drop"].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove("drag-active");
    }, false);
  });

  dropZone.addEventListener("drop", (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, false);
}

function processFile(file) {
  const fileName = file.name;
  const extension = fileName.split(".").pop().toLowerCase();
  const statusLabel = document.getElementById("upload-status-lbl");
  const titleEl = document.querySelector(".upload-title");
  const subtitleEl = document.querySelector(".upload-subtitle");
  
  if (extension !== "csv" && extension !== "xlsx" && extension !== "xls") {
    if (statusLabel) {
      statusLabel.textContent = "Invalid Format";
      statusLabel.style.color = "var(--color-accent-terracotta)";
    }
    if (titleEl) titleEl.textContent = "Supported Formats Only";
    if (subtitleEl) {
      subtitleEl.textContent = "Please select a valid CSV or Excel file.";
      subtitleEl.style.color = "var(--color-accent-terracotta)";
    }
    
    setTimeout(() => {
      if (statusLabel) {
        statusLabel.textContent = "Ready for Synthesis";
        statusLabel.style.color = "";
      }
      if (titleEl) titleEl.textContent = "Upload your business dataset.";
      if (subtitleEl) {
        subtitleEl.textContent = "Drag and drop file here, or click to browse";
        subtitleEl.style.color = "";
      }
    }, 3000);
    return;
  }

  // Show upload progress UI
  const uploadMainView = document.getElementById("upload-main-view");
  const uploadProgressView = document.getElementById("upload-progress-view");
  const progressFileName = document.getElementById("progress-file-name");
  const progressPercentage = document.getElementById("progress-percentage");
  const progressBarFill = document.getElementById("progress-bar-fill");
  const progressStatusText = document.getElementById("progress-status-text");

  if (uploadMainView && uploadProgressView) {
    uploadMainView.classList.add("hidden");
    uploadProgressView.classList.remove("hidden");
  }
  
  if (progressFileName) progressFileName.textContent = fileName;
  if (statusLabel) {
    statusLabel.textContent = "Synthesis In Progress";
    statusLabel.style.color = "var(--color-accent-sage)";
  }

  // Read file data
  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    parseCSV(text, fileName);
  };
  
  setTimeout(() => {
    reader.readAsText(file);
  }, 600);
}

function parseCSV(text, fileName) {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
  const rows = Math.max(0, lines.length - 1);
  let columns = 0;
  let headers = [];
  
  if (lines.length > 0) {
    headers = lines[0].split(",").map(h => h.replace(/['"]+/g, '').trim());
    columns = headers.length;
  }

  let missingCount = 0;
  const metricsSet = new Set();
  const metricKeywords = ["revenue", "latency", "cost", "price", "margin", "transactions", "spend", "sales", "rating", "ratio", "credit", "delay", "buffer", "capex"];

  headers.forEach(h => {
    const lowerHeader = h.toLowerCase();
    metricKeywords.forEach(k => {
      if (lowerHeader.includes(k)) {
        metricsSet.add(h);
      }
    });
  });

  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(",");
    cells.forEach(c => {
      if (c.trim() === "") {
        missingCount++;
      }
    });
  }

  let domain = "Enterprise Operations";
  const headerString = headers.join(" ").toLowerCase();
  if (headerString.includes("latency") || headerString.includes("port") || headerString.includes("vessel") || headerString.includes("shipping") || headerString.includes("transit") || headerString.includes("delay")) {
    domain = "Logistics & Supply Chain";
  } else if (headerString.includes("revenue") || headerString.includes("spend") || headerString.includes("price") || headerString.includes("margin") || headerString.includes("sourcing") || headerString.includes("cost")) {
    domain = "Financial Operations";
  } else if (headerString.includes("compliance") || headerString.includes("carbon") || headerString.includes("tariff") || headerString.includes("regulatory")) {
    domain = "Trade & Compliance";
  }

  const totalCells = Math.max(1, (rows * columns));
  const qualityPercent = Math.max(50, Math.min(100, Math.round((1 - (missingCount / totalCells)) * 1000) / 10));
  const confidencePercent = Math.max(50, Math.min(99, Math.round(qualityPercent * 0.94)));

  appState.activeDataset = {
    name: fileName,
    rows: rows,
    columns: columns,
    domain: domain,
    quality: `${qualityPercent}%`,
    metrics: Array.from(metricsSet).slice(0, 4),
    missingValues: missingCount,
    confidence: `${confidencePercent}%`
  };

  // Animate the upload progress bar
  const progressBarFill = document.getElementById("progress-bar-fill");
  const progressPercentage = document.getElementById("progress-percentage");
  const progressStatusText = document.getElementById("progress-status-text");

  let uploadPercentage = 0;
  const timer = setInterval(() => {
    uploadPercentage += 5;
    if (progressPercentage) progressPercentage.textContent = `${uploadPercentage}%`;
    if (progressBarFill) progressBarFill.style.width = `${uploadPercentage}%`;
    if (progressStatusText) {
      if (uploadPercentage < 50) progressStatusText.textContent = "Ingesting file streams...";
      else if (uploadPercentage < 90) progressStatusText.textContent = "Resolving column schemas...";
      else progressStatusText.textContent = "Intake complete.";
    }

    if (uploadPercentage >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        runBriefingLoader();
      }, 400);
    }
  }, 50);
}

function loadDefaultDataset() {
  appState.activeDataset = {
    name: "global_procurement_Q2.csv",
    rows: 18240,
    columns: 14,
    domain: "Logistics & Supply Chain",
    quality: "99.8%",
    metrics: ["Revenue", "Transit Latency", "Supplier Credit Ratio", "Capital Allocation"],
    missingValues: 14,
    confidence: "93%"
  };

  const uploadMainView = document.getElementById("upload-main-view");
  const uploadProgressView = document.getElementById("upload-progress-view");
  const progressFileName = document.getElementById("progress-file-name");
  const progressPercentage = document.getElementById("progress-percentage");
  const progressBarFill = document.getElementById("progress-bar-fill");
  const progressStatusText = document.getElementById("progress-status-text");
  const statusLabel = document.getElementById("upload-status-lbl");

  if (uploadMainView && uploadProgressView) {
    uploadMainView.classList.add("hidden");
    uploadProgressView.classList.remove("hidden");
  }
  
  if (progressFileName) progressFileName.textContent = "global_procurement_Q2.csv";
  if (statusLabel) {
    statusLabel.textContent = "Synthesis In Progress";
    statusLabel.style.color = "var(--color-accent-sage)";
  }

  let uploadPercentage = 0;
  const timer = setInterval(() => {
    uploadPercentage += 10;
    if (progressPercentage) progressPercentage.textContent = `${uploadPercentage}%`;
    if (progressBarFill) progressBarFill.style.width = `${uploadPercentage}%`;
    if (progressStatusText) {
      progressStatusText.textContent = "Loading default briefing metrics...";
    }

    if (uploadPercentage >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        runBriefingLoader();
      }, 300);
    }
  }, 40);
}

// 10. Initialization
document.addEventListener("DOMContentLoaded", () => {
  setupLandingGreeting();
  setupDragAndDrop();

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
  
  const navStartBtn = document.getElementById("btn-nav-start");
  if (navStartBtn) {
    navStartBtn.addEventListener("click", () => {
      loadDefaultDataset();
    });
  }
});
