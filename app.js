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

function renderExecutiveBrief() {
  // 1. Dynamic Greeting based on Local Time
  const hour = new Date().getHours();
  let greetingText = "Good Evening"; 
  if (hour < 12) greetingText = "Good Morning";
  else if (hour < 17) greetingText = "Good Afternoon";

  // 2. Fetch Active Dataset Metadata or fallback to default
  const defaultDataset = {
    name: "global_procurement_Q2.csv",
    rows: 18240,
    columns: 14,
    domain: "Logistics & Supply Chain",
    quality: "99.8%",
    metrics: ["Revenue", "Transit Latency", "Supplier Credit Ratio", "Capital Allocation"],
    missingValues: 14,
    confidence: "93%"
  };

  const d = appState.activeDataset || defaultDataset;

  // Build Dynamic Summary Card HTML
  let metricsHTML = "";
  if (d.metrics && d.metrics.length > 0) {
    d.metrics.forEach(m => {
      metricsHTML += `<span class="summary-metric-pill">${m}</span>`;
    });
  } else {
    metricsHTML = `<span class="summary-metric-empty">None identified</span>`;
  }

  const summaryCardHTML = `
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

  // 3. Define Strategic Brief Templates for each Domain
  let healthScore = 84;
  let healthExplanation = "Data streams indicate stable parameters across core transaction models.";
  let confidenceExplanation = "Strong data volume and minor missing values yield high modeling certainty.";
  let readinessValue = "Optimal";
  let readinessExplanation = "Clean schema records support predictive forecasting models.";
  let summaryText = "";
  
  let cards = {
    findings: [],
    opportunities: [],
    risks: [],
    recommendations: []
  };

  if (d.domain === "Logistics & Supply Chain") {
    healthScore = 82;
    healthExplanation = "Vietnam transit exposures slightly depress overall operational resilience.";
    confidenceExplanation = "Telemetry verified by Port Authority logs and MarineTraffic indices.";
    readinessValue = "Optimal";
    readinessExplanation = "Clean coordinates and time matrices support high-node corridor simulations.";
    summaryText = "Sourcing metrics reveal stable supply throughput. Hanoi assembly line delays create minor inventory backlogs. Re-routing component assemblies to Guadalajara rail lines offers immediate protection against pending tariff revisions.";
    
    cards.findings = [
      {
        title: "Transit Queue Density Surge",
        desc: "Singapore and Hanoi port queue backlogs have escalated turnaround timelines to 32 days.",
        impact: "COMPRESSED DELIVERY BUFFER LIMITS",
        conf: "94%"
      },
      {
        title: "Supplier Credit Constraints",
        desc: "Precision tooling suppliers in Hanoi show solvency dips, risking raw material lockouts.",
        impact: "UPSTREAM TIMELINE COMPROMISE",
        conf: "87%"
      }
    ];

    cards.opportunities = [
      {
        title: "Guadalajara Nearshore Re-routing",
        desc: "Transition 35% of components assemblies to Mexican rail lines, reducing ocean delay risks.",
        impact: "-8% LOGISTICS DURATION IMPROVEMENT",
        conf: "93%"
      },
      {
        title: "Transit Arbitration via Bangkok",
        desc: "Bypass maritime bottleneck corridors by forwarding air cargo through Bangkok hubs.",
        impact: "-24 DAYS TOTAL TRANSIT TIME",
        conf: "89%"
      }
    ];

    cards.risks = [
      {
        title: "Vietnamese Sourcing Bottleneck",
        desc: "Singapore port queues and high Hanoi debt leverage create critical supply disruptions.",
        impact: "POTENTIAL ASSEMBLY DELIVERY BREAK",
        conf: "81%"
      }
    ];

    cards.recommendations = [
      {
        title: "Supplier Working-Capital Cushion",
        desc: "Approve short-term liquidity pre-payments to Hanoi component fabricators to preserve queues.",
        impact: "QUEUE PRIORITY SECURITY",
        conf: "91%"
      },
      {
        title: "Establish Laredo Port Pathways",
        desc: "Secure customs clearance certificates at Laredo hubs to support nearshoring buffers.",
        impact: "CORRIDOR EXPOSURE HEDGE",
        conf: "95%"
      }
    ];

  } else if (d.domain === "Financial Operations") {
    healthScore = 88;
    healthExplanation = "Strong enterprise ARR renewal margins balance logistics inflation costs.";
    confidenceExplanation = "Financial ledger transactions reconciled directly against Stripe data.";
    readinessValue = "Optimal";
    readinessExplanation = "Reconciled ledger history allows highly calibrated budget models.";
    summaryText = "Ledger audits reveal robust Q2 ARR renewals. Sourcing price variance remains isolated within global container spot rates. Consolidating assembly suppliers minimizes overhead margins.";
    
    cards.findings = [
      {
        title: "Enterprise SaaS Revenue Growth",
        desc: "High-node corporate renew rates surged by 18% during Q2.",
        impact: "+$12.4M CORE RECURRING CASH RESERVES",
        conf: "96%"
      },
      {
        title: "Logistics Surcharge Squeeze",
        desc: "Expedited container spot rates surged by 2.4x along global shipping routes.",
        impact: "+$3.2M LOGISTICS OPEX VARIANCE",
        conf: "90%"
      }
    ];

    cards.opportunities = [
      {
        title: "Supplier Sourcing Consolidation",
        desc: "Consolidate assembly orders under a single vendor to reduce secondary markups.",
        impact: "-12% TOOLING PREMIUM OVERHEAD",
        conf: "88%"
      },
      {
        title: "Container Quota Pre-allocations",
        desc: "Contract fixed cargo space quotas in Q3 to avoid spot market pricing exposure.",
        impact: "-24% SPOT FREIGHT VOLATILITY",
        conf: "92%"
      }
    ];

    cards.risks = [
      {
        title: "Secondary Vendor Markup Friction",
        desc: "Solvency strains at Hanoi precision tool hubs drive tooling overhead costs up by 18%.",
        impact: "UNIT COST MARGIN EROSION",
        conf: "85%"
      }
    ];

    cards.recommendations = [
      {
        title: "Freight Contract Ceiling Cap",
        desc: "Negotiate fixed freight cost ceilings with main carriers to prevent spot surcharge exposure.",
        impact: "COST VARIANCE LIMIT RESOLUTION",
        conf: "93%"
      },
      {
        title: "Procurement Capital Reallocation",
        desc: "Reallocate $40M Capex reserves from ocean freight budgets to nearshore corridor supply hubs.",
        impact: "CAPEX CARRYING COST OPTIMIZATION",
        conf: "94%"
      }
    ];

  } else if (d.domain === "Trade & Compliance") {
    healthScore = 79;
    healthExplanation = "New European custom compliance mandates create near-term transaction friction.";
    confidenceExplanation = "Compliance statuses cross-referenced with European Customs Bulletin updates.";
    readinessValue = "Sufficient";
    readinessExplanation = "Minor null regulatory codes present, but compliance pathways remain clear.";
    summaryText = "Revised compliance codes at Antwerp extend average customs clearance times. Stuttgart safety buffer blocks insulate German assembly pathways. Transitioning components to carbon-neutral sites mitigates pending carbon tax surcharges.";
    
    cards.findings = [
      {
        title: "Antwerp Custom Latency",
        desc: "Revised compliance code declarations extended port clearance times by 3.2 days.",
        impact: "DOWNSTREAM PRODUCTION INVENTORY STRAIN",
        conf: "92%"
      },
      {
        title: "Stuttgart Safety Buffer Integrity",
        desc: "Stuttgart central logistics hub holds a robust 12-day inventory buffer.",
        impact: "LOCAL DELAY INSULATION",
        conf: "95%"
      }
    ];

    cards.opportunities = [
      {
        title: "Carbon-Neutral CBAM Sourcing",
        desc: "Transition hardware units to audited carbon-neutral assembly sites to bypass CBAM tariffs.",
        impact: "ZERO CARBON TARIFF PENALTY",
        conf: "90%"
      },
      {
        title: "EU Customs Pre-clearance Audit",
        desc: "Establish pre-compliance registry statuses at major EU entry ports.",
        impact: "-3.2 DAYS CUSTOMS LATENCY",
        conf: "87%"
      }
    ];

    cards.risks = [
      {
        title: "Carbon Tariff Surcharge Penalties",
        desc: "Non-compliant raw material imports face +15% customs fee markups at Antwerp.",
        impact: "MARGIN EROSION RISK",
        conf: "88%"
      }
    ];

    cards.recommendations = [
      {
        title: "CBAM Compliance Registry Audit",
        desc: "Mandate carbon-neutral audits for all tier-1 parts suppliers to eliminate customs friction.",
        impact: "REGULATORY COMPLIANCE EXPOSURE CLEARANCE",
        conf: "91%"
      },
      {
        title: "Stuttgart Buffer Quota Scale-Up",
        desc: "Increase Stuttgart safety buffers by +15% to absorb ongoing Antwerp declaration latency.",
        impact: "SOURCING TIMELINE STABILIZATION",
        conf: "93%"
      }
    ];

  } else {
    // General Enterprise Operations Sourcing Data
    healthScore = 84;
    healthExplanation = "General operational parameters show robust performance markers.";
    confidenceExplanation = "Statistical checks reveal clean field patterns and standard deviations.";
    readinessValue = "Optimal";
    readinessExplanation = "Sufficient row volumes support key forecasting assumptions.";
    summaryText = "Enterprise operations show robust performance indicators. Sourcing timelines are stable, and minor cost anomalies remain localized in secondary vendor transactions. Immediate optimization focuses on container pre-allocation and safety buffer scales.";

    cards.findings = [
      {
        title: "Asset Capacity Performance",
        desc: "Overall equipment output metrics rose by 8% over the past quarter.",
        impact: "+$1.8M REVENUE VALUE GENERATION",
        conf: "93%"
      },
      {
        title: "Freight Surcharge Overhead",
        desc: "Logistics shipping fees reflect a 12% rise due to spot market capacity limits.",
        impact: "OPEX EXPENDITURE COMPRESSION",
        conf: "89%"
      }
    ];

    cards.opportunities = [
      {
        title: "Container Space Pre-allocation",
        desc: "Secure shipping vessel volumes at baseline rates to reduce spot surcharge volatility.",
        impact: "LOGISTICS COST VOLATILITY HEDGE",
        conf: "91%"
      },
      {
        title: "Safety Buffer Quota Calibration",
        desc: "Recalibrate safety stocks at regional hubs to match local throughput variations.",
        impact: "-6 DAYS TRANSIT TIME EXPOSURE",
        conf: "88%"
      }
    ];

    cards.risks = [
      {
        title: "Vendor Transaction Anomalies",
        desc: "Minor pricing anomalies isolated in secondary procurement transaction lists.",
        impact: "UNIT COST COMPLIANCE FRICTION",
        conf: "84%"
      }
    ];

    cards.recommendations = [
      {
        title: "Freight Contract Ceiling Negotiations",
        desc: "Lock cargo prices with shipping lines to insulate operations from spot rate hikes.",
        impact: "OPEX VARIANCE ELIMINATION",
        conf: "92%"
      },
      {
        title: "Local Safety Buffer Reallocation",
        desc: "Reallocate $10M buffer capital to high-throughput regional distribution nodes.",
        impact: "INVENTORY CARRYING COST OPTIMIZATION",
        conf: "90%"
      }
    ];
  }

  // Helper to compile card list HTML with AI Identity Badges
  const compileCardsHTML = (cardList, sectionType) => {
    let html = "";
    cardList.forEach(c => {
      let badgeLabel = "• AI Insight";
      let badgeClass = "olive-badge";
      let isRisk = false;
      
      if (sectionType === "findings") {
        badgeLabel = "• AI Insight";
        badgeClass = "olive-badge";
      } else if (sectionType === "opportunities") {
        badgeLabel = "• AI Generated";
        badgeClass = "";
      } else if (sectionType === "risks") {
        badgeLabel = "• AI Insight";
        badgeClass = "terracotta-badge";
        isRisk = true;
      } else if (sectionType === "recommendations") {
        badgeLabel = "• AI Recommendation";
        badgeClass = "";
      }

      html += `
        <div class="section-card ${isRisk ? 'risk-border' : ''}">
          <div class="card-header">
            <span class="ai-indicator-badge ${badgeClass}">${badgeLabel}</span>
            <span class="card-confidence">${c.conf} Conf</span>
          </div>
          <span class="card-title" style="margin-top: 4px; display: block;">${c.title}</span>
          <p class="card-desc">${c.desc}</p>
          <div class="card-impact ${isRisk ? 'risk-accent' : ''}">${c.impact}</div>
        </div>
      `;
    });
    return html;
  };

  const findingsHTML = compileCardsHTML(cards.findings, "findings");
  const opportunitiesHTML = compileCardsHTML(cards.opportunities, "opportunities");
  const risksHTML = compileCardsHTML(cards.risks, "risks");
  const recommendationsHTML = compileCardsHTML(cards.recommendations, "recommendations");

  // 4. Render Layout
  activeSheetEl.innerHTML = `
    <div class="brief-layout">
      <!-- 1. Header Greeting -->
      <header class="brief-header">
        <span class="brief-tag">BOARDROOM INTELLIGENCE SYSTEM</span>
        <h1 class="brief-welcome-msg">${greetingText}. Your business analysis is ready.</h1>
      </header>

      <!-- 2. Parsed Dataset Metadata Summary -->
      ${summaryCardHTML}

      <!-- 3. AI Executive Summary (Scannable Narrative) -->
      <section class="brief-summary-section">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
          <h3 style="margin-bottom: 0;">AI Executive Summary</h3>
          <span class="ai-indicator-badge">• AI Generated</span>
        </div>
        <p class="brief-summary-text"><strong>Strategic Synthesis:</strong> ${summaryText}</p>
      </section>

      <!-- 4. Dynamic KPI Score Card Row -->
      <section class="brief-meta-row">
        <!-- Business Health Score -->
        <div class="meta-card">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
            <span class="meta-card-label">Business Health Score</span>
            <span class="ai-indicator-badge olive-badge" style="font-size: 7px; padding: 1px 4px;">• AI Insight</span>
          </div>
          <span class="meta-card-value" style="color: var(--color-accent-sage);">${healthScore} <span style="font-size: 11px; font-weight: normal; color: var(--color-text-muted);">/ 100</span></span>
          <span class="meta-card-explanation">${healthExplanation}</span>
        </div>
        
        <!-- AI Confidence Index -->
        <div class="meta-card">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
            <span class="meta-card-label">AI Confidence Index</span>
            <span class="ai-indicator-badge olive-badge" style="font-size: 7px; padding: 1px 4px;">• AI Insight</span>
          </div>
          <span class="meta-card-value" style="color: var(--color-accent-olive);">${d.confidence}</span>
          <span class="meta-card-explanation">${confidenceExplanation}</span>
        </div>

        <!-- Decision Readiness -->
        <div class="meta-card">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
            <span class="meta-card-label">Decision Readiness</span>
            <span class="ai-indicator-badge olive-badge" style="font-size: 7px; padding: 1px 4px;">• AI Insight</span>
          </div>
          <span class="meta-card-value">${readinessValue}</span>
          <span class="meta-card-explanation">${readinessExplanation}</span>
        </div>
      </section>

      <!-- 5. Four Clean Section Grid -->
      <section class="brief-four-sections">
        <!-- Section 1: Key Findings -->
        <div class="brief-card-stack">
          <div class="nav-section-title" style="padding-left: 0; margin-bottom: 8px;">1. Key Findings</div>
          ${findingsHTML}
        </div>

        <!-- Section 2: Top Opportunities -->
        <div class="brief-card-stack">
          <div class="nav-section-title" style="padding-left: 0; margin-bottom: 8px;">2. Top Opportunities</div>
          ${opportunitiesHTML}
        </div>

        <!-- Section 3: Critical Risks -->
        <div class="brief-card-stack">
          <div class="nav-section-title" style="padding-left: 0; margin-bottom: 8px; color: var(--color-accent-terracotta);">3. Critical Risks</div>
          ${risksHTML}
        </div>

        <!-- Section 4: Executive Recommendations -->
        <div class="brief-card-stack">
          <div class="nav-section-title" style="padding-left: 0; margin-bottom: 8px;">4. Executive Recommendations</div>
          ${recommendationsHTML}
        </div>
      </section>

      <!-- Action Signoff footer -->
      <footer class="sheet-actions-footer" style="border-top: 1px solid var(--color-border-hairline); padding-top: var(--spacing-md); margin-top: var(--spacing-lg);">
        <div class="brief-signoff" style="margin-top: 0; padding-top: 0; border: none; margin-bottom: var(--spacing-sm);">
          Approved for circulation. SynapseIQ Strategic Engine.
        </div>
        <button class="btn-editorial btn-primary" id="action-brief-enter" style="padding: 12px 24px; font-size: 11px;">
          Acknowledge & Open Synthesis Desk →
        </button>
      </footer>
    </div>
  `;

  // Bind Enter Workspace Button
  const enterBtn = document.getElementById("action-brief-enter");
  if (enterBtn) {
    enterBtn.addEventListener("click", () => {
      navigateTo("synthesis");
    });
  }
}

// 5.5. Render: Intel Synthesis (The Executive Inbox)
// Business Signals SVG Chart Generators
function generateLineChartSVG(data, isNegative = false) {
  const w = 400;
  const h = 100;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const r = max - min || 1;
  const step = w / (data.length - 1);
  
  let path = "";
  data.forEach((val, i) => {
    const x = i * step;
    const y = h - 10 - ((val - min) / r) * (h - 20);
    path += `${i === 0 ? 'M' : 'L'} ${x} ${y} `;
  });
  
  const strokeColor = isNegative ? 'var(--color-accent-terracotta)' : 'var(--color-accent-sage)';
  
  return `
    <svg viewBox="0 0 ${w} ${h}" class="signal-svg-chart">
      <!-- Gridlines -->
      <line x1="0" y1="${h * 0.25}" x2="${w}" y2="${h * 0.25}" stroke="var(--color-border-hairline)" stroke-width="0.75" stroke-dasharray="3 3" />
      <line x1="0" y1="${h * 0.5}" x2="${w}" y2="${h * 0.5}" stroke="var(--color-border-hairline)" stroke-width="0.75" stroke-dasharray="3 3" />
      <line x1="0" y1="${h * 0.75}" x2="${w}" y2="${h * 0.75}" stroke="var(--color-border-hairline)" stroke-width="0.75" stroke-dasharray="3 3" />
      
      <!-- Chart Line -->
      <path d="${path}" fill="none" stroke="${strokeColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
      
      <!-- Nodes -->
      ${data.map((val, i) => {
        const x = i * step;
        const y = h - 10 - ((val - min) / r) * (h - 20);
        return `<circle cx="${x}" cy="${y}" r="3" fill="var(--color-bg-surface)" stroke="${strokeColor}" stroke-width="1.5" />`;
      }).join("")}
    </svg>
  `;
}

function generateBarChartSVG(data, isNegative = false) {
  const w = 400;
  const h = 100;
  const max = Math.max(...data) || 1;
  const barW = (w / data.length) * 0.5;
  const gap = (w / data.length) * 0.5;
  
  const strokeColor = isNegative ? 'var(--color-accent-terracotta)' : 'var(--color-accent-sage)';
  
  let barsHTML = "";
  data.forEach((val, i) => {
    const x = i * (barW + gap) + gap / 2;
    const barH = (val / max) * (h - 15);
    const y = h - barH;
    barsHTML += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" fill="${strokeColor}" rx="1.5" />`;
  });
  
  return `
    <svg viewBox="0 0 ${w} ${h}" class="signal-svg-chart">
      <!-- Gridlines -->
      <line x1="0" y1="${h * 0.25}" x2="${w}" y2="${h * 0.25}" stroke="var(--color-border-hairline)" stroke-width="0.75" stroke-dasharray="3 3" />
      <line x1="0" y1="${h * 0.5}" x2="${w}" y2="${h * 0.5}" stroke="var(--color-border-hairline)" stroke-width="0.75" stroke-dasharray="3 3" />
      <line x1="0" y1="${h * 0.75}" x2="${w}" y2="${h * 0.75}" stroke="var(--color-border-hairline)" stroke-width="0.75" stroke-dasharray="3 3" />
      ${barsHTML}
    </svg>
  `;
}

function generateAreaChartSVG(data, isNegative = false) {
  const w = 400;
  const h = 100;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const r = max - min || 1;
  const step = w / (data.length - 1);
  
  let path = "";
  data.forEach((val, i) => {
    const x = i * step;
    const y = h - 10 - ((val - min) / r) * (h - 20);
    path += `${i === 0 ? 'M' : 'L'} ${x} ${y} `;
  });
  
  const strokeColor = isNegative ? 'var(--color-accent-terracotta)' : 'var(--color-accent-sage)';
  const fillColor = isNegative ? 'var(--color-accent-terracotta)' : 'var(--color-accent-sage)';
  
  return `
    <svg viewBox="0 0 ${w} ${h}" class="signal-svg-chart">
      <!-- Gridlines -->
      <line x1="0" y1="${h * 0.25}" x2="${w}" y2="${h * 0.25}" stroke="var(--color-border-hairline)" stroke-width="0.75" stroke-dasharray="3 3" />
      <line x1="0" y1="${h * 0.5}" x2="${w}" y2="${h * 0.5}" stroke="var(--color-border-hairline)" stroke-width="0.75" stroke-dasharray="3 3" />
      <line x1="0" y1="${h * 0.75}" x2="${w}" y2="${h * 0.75}" stroke="var(--color-border-hairline)" stroke-width="0.75" stroke-dasharray="3 3" />
      
      <!-- Area path -->
      <path d="${path} L ${w} ${h} L 0 ${h} Z" fill="${fillColor}" opacity="0.06" />
      
      <!-- Line path -->
      <path d="${path}" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      
      <!-- Endpoint marker -->
      <circle cx="${w}" cy="${h - 10 - ((data[data.length-1] - min) / r) * (h - 20)}" r="4" fill="${strokeColor}" />
    </svg>
  `;
}

function generateSegmentChartSVG(segments) {
  const w = 400;
  const h = 14;
  
  let rectsHTML = "";
  let currentX = 0;
  
  segments.forEach(seg => {
    const barW = (seg.percent / 100) * w;
    rectsHTML += `<rect x="${currentX}" y="1" width="${barW}" height="${h-2}" fill="${seg.color}" rx="1.5" />`;
    currentX += barW;
  });
  
  const legendHTML = segments.map(seg => `
    <div style="display: flex; align-items: center; gap: 4px; font-size: 9px; font-weight: 700; text-transform: uppercase; color: var(--color-text-secondary);">
      <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: ${seg.color};"></span>
      <span>${seg.label} (${seg.percent}%)</span>
    </div>
  `).join("");
  
  return `
    <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
      <svg viewBox="0 0 ${w} ${h}" style="width: 100%; height: ${h}px; overflow: visible;">
        ${rectsHTML}
      </svg>
      <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 2px;">
        ${legendHTML}
      </div>
    </div>
  `;
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

  // 1. Fetch Active Dataset or fallback
  const defaultDataset = {
    name: "global_procurement_Q2.csv",
    rows: 18240,
    columns: 14,
    domain: "Logistics & Supply Chain",
    quality: "99.8%",
    metrics: ["Revenue", "Transit Latency", "Supplier Credit Ratio", "Capital Allocation"],
    missingValues: 14,
    confidence: "93%"
  };

  const d = appState.activeDataset || defaultDataset;

  // 2. Calibrate Dynamic Charts depending on domain
  let chartSpecs = [];
  if (d.domain === "Logistics & Supply Chain") {
    chartSpecs = [
      {
        title: "Sourcing Transit Latency",
        trend: "↑ 22%",
        impact: "High",
        note: "Vietnam and Singapore port backlogs escalate ocean turnaround latency times to 32 days.",
        type: "line",
        data: [12, 14, 15, 18, 22, 28, 32],
        negative: true
      },
      {
        title: "Warehouse Safety Buffer Allocation",
        trend: "→ Stable",
        impact: "Medium",
        note: "Stuttgart central logistics node safety buffer expanded to house 45% of component capacities.",
        type: "segment",
        segments: [
          { label: 'Stuttgart Hub', percent: 45, color: 'var(--color-accent-sage)' },
          { label: 'Laredo Node', percent: 35, color: 'var(--color-accent-olive)' },
          { label: 'Hanoi Hub', percent: 20, color: 'var(--color-text-muted)' }
        ]
      },
      {
        title: "Asia-Pacific Sourcing Spend",
        trend: "↓ 8%",
        impact: "High",
        note: "Domestic nearshore component pivots contract Asian supplier spend marks by 8% over standard lines.",
        type: "bar",
        data: [80, 75, 68, 62, 55, 48]
      },
      {
        title: "Supplier Credit Risk Index",
        trend: "↑ 18%",
        impact: "High",
        note: "Solvency strain and cash depletion at tier-2 component fabricators elevate parts default ratios.",
        type: "line",
        data: [1.1, 1.3, 1.4, 1.8, 2.2, 2.6],
        negative: true
      },
      {
        title: "Warehouse Inventory Utilization",
        trend: "↑ 14%",
        impact: "Low",
        note: "Stuttgart safety margins expanded to 72% capacity levels to cushion Hanoi transit backlogs.",
        type: "area",
        data: [45, 50, 52, 58, 65, 72]
      },
      {
        title: "Laredo Rail Corridor Throughput",
        trend: "↑ 35%",
        impact: "High",
        note: "Guadalajara re-routing rail corridor capacity expanded by 35%, ensuring nearshore throughput.",
        type: "bar",
        data: [120, 135, 145, 150, 162]
      }
    ];
  } else if (d.domain === "Financial Operations") {
    chartSpecs = [
      {
        title: "Annualized Recurring Revenue (ARR)",
        trend: "↑ 18%",
        impact: "High",
        note: "Q2 revenue run rate expansions driven by 93% renewal contracts across enterprise hubs.",
        type: "line",
        data: [1.2, 1.4, 1.7, 1.9, 2.1, 2.4]
      },
      {
        title: "Spot Freight Cost Volatility",
        trend: "↑ 24%",
        impact: "High",
        note: "Expedited container spot-rate inflation spikes drive transport overhead budgets up by 24%.",
        type: "bar",
        data: [12, 15, 22, 34, 45, 52],
        negative: true
      },
      {
        title: "Procurement CapEx Breakdown",
        trend: "↑ 12%",
        impact: "Medium",
        note: "Ocean freight surcharges dominate Q2 procurement budgets, accounting for 55% of CapEx allocations.",
        type: "segment",
        segments: [
          { label: 'Ocean Freight', percent: 55, color: 'var(--color-accent-terracotta)' },
          { label: 'Nearshore Rail', percent: 30, color: 'var(--color-accent-sage)' },
          { label: 'Air Logistics', percent: 15, color: 'var(--color-accent-olive)' }
        ]
      },
      {
        title: "Operating Liquid Cash Reserves",
        trend: "↑ 9%",
        impact: "Medium",
        note: "Strong ARR cash inflows expand corporate liquid positions, cushioning freight premium shocks.",
        type: "area",
        data: [10, 12, 14, 15, 18, 22]
      },
      {
        title: "Spot Market Rate Risk Hedge",
        trend: "↓ 15%",
        impact: "High",
        note: "Fixed-contract container quotas successfully reduce spot freight market pricing exposure by 15%.",
        type: "line",
        data: [52, 48, 42, 38, 32, 28]
      },
      {
        title: "European Market Expansion Growth",
        trend: "↑ 28%",
        impact: "High",
        note: "Renewals at EU enterprise nodes lead territorial revenue growth rate models, pacing at 28%.",
        type: "bar",
        data: [60, 68, 72, 85, 96, 112]
      }
    ];
  } else if (d.domain === "Trade & Compliance") {
    chartSpecs = [
      {
        title: "Belgian Port Custom Latency",
        trend: "↑ 32%",
        impact: "High",
        note: "Revised customs mandate codes at Antwerp hubs extend average port check delays to 3.2 days.",
        type: "line",
        data: [1.2, 1.5, 2.1, 2.4, 2.8, 3.2],
        negative: true
      },
      {
        title: "Stuttgart Safety Buffer Capacity",
        trend: "↑ 15%",
        impact: "Medium",
        note: "Stuttgart inventory safety stocks scaled by 15% to absorb Belgian customs delays.",
        type: "bar",
        data: [8, 10, 11, 12, 14, 15]
      },
      {
        title: "Antwerp Surcharge Duties Allocation",
        trend: "↑ 40%",
        impact: "High",
        note: "CBAM carbon tax penalties dominate port surcharge duty profiles, accounting for 40% of fees.",
        type: "segment",
        segments: [
          { label: 'CBAM Tariffs', percent: 40, color: 'var(--color-accent-terracotta)' },
          { label: 'Base Duties', percent: 45, color: 'var(--color-accent-sage)' },
          { label: 'Clearance Fees', percent: 15, color: 'var(--color-accent-olive)' }
        ]
      },
      {
        title: "Carbon-Neutral Compliance Audits",
        trend: "↑ 78%",
        impact: "Medium",
        note: "Supplier carbon compliance check rates reached 78%, resolving potential CBAM fee exposures.",
        type: "area",
        data: [30, 42, 55, 62, 70, 78]
      },
      {
        title: "Customs duty Fee Reductions",
        trend: "↓ 12%",
        impact: "Medium",
        note: "Authorized Economic Operator certifications successfully reduce average port customs clearance fees by 12%.",
        type: "line",
        data: [45, 42, 38, 35, 30, 28]
      },
      {
        title: "Mexican Sourcing Hub Compliance",
        trend: "↑ 45%",
        impact: "High",
        note: "Mexican components fabricators align to 100% compliance checklists, boosting nearshore stability.",
        type: "bar",
        data: [45, 52, 68, 75, 88, 100]
      }
    ];
  } else {
    // General Sourcing / Enterprise Operations
    chartSpecs = [
      {
        title: "Asset Production Throughput",
        trend: "↑ 8%",
        impact: "Medium",
        note: "Core equipment output rates expand, driving a 3-month productivity yield gain of 8%.",
        type: "line",
        data: [100, 102, 103, 105, 108]
      },
      {
        title: "Logistics Surcharge Squeezes",
        trend: "↑ 12%",
        impact: "Medium",
        note: "Freight spot pricing volatility spikes overall logistics operational expenditures by 12%.",
        type: "bar",
        data: [10, 11, 12, 12, 12, 12],
        negative: true
      },
      {
        title: "Container Space Pre-allocation",
        trend: "↓ 15%",
        impact: "High",
        note: "Pre-arranged shipping container commitments decrease overall logistics spot fee exposures by 15%.",
        type: "line",
        data: [40, 38, 35, 30, 28]
      },
      {
        title: "Safety Buffer Quota calibration",
        trend: "↑ 10%",
        impact: "Low",
        note: "Warehouse safety stocks scaled up by 10% to insulate regional corridors from delay spikes.",
        type: "area",
        data: [80, 82, 85, 88, 90]
      }
    ];
  }

  // Compile Dynamic Signals Grid HTML
  let signalsHTML = "";
  chartSpecs.forEach(c => {
    let chartSVG = "";
    if (c.type === "line") {
      chartSVG = generateLineChartSVG(c.data, c.negative);
    } else if (c.type === "bar") {
      chartSVG = generateBarChartSVG(c.data, c.negative);
    } else if (c.type === "area") {
      chartSVG = generateAreaChartSVG(c.data, c.negative);
    } else if (c.type === "segment") {
      chartSVG = generateSegmentChartSVG(c.segments);
    }

    signalsHTML += `
      <div class="signal-chart-card ${c.negative ? 'negative-trend' : ''}">
        <div class="signal-card-header">
          <div class="signal-card-title-group">
            <span class="signal-card-meta">Business Signal</span>
            <h3 class="signal-card-title">${c.title}</h3>
          </div>
          <div class="signal-card-badges">
            <span class="trend-badge ${c.negative ? 'trend-negative' : 'trend-positive'}">${c.trend}</span>
            <span class="impact-badge ${c.impact === 'High' ? 'impact-high' : ''}">Impact: ${c.impact}</span>
          </div>
        </div>
        
        <div class="signal-chart-wrapper">
          ${chartSVG}
        </div>
        
        <div class="signal-card-footer">
          <p class="signal-ai-note"><strong>AI Note:</strong> ${c.note}</p>
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

      <!-- Signature Interactive Decision Graph Hero -->
      <section class="dashboard-section" style="margin-bottom: var(--spacing-lg);">
        <span class="section-question-label">System Architecture</span>
        <h2 class="section-headline">Interactive Decision Matrix</h2>
        
        <div class="decision-graph-container">
          <div class="decision-graph-visualization">
            <svg id="decision-graph-svg" viewBox="0 0 600 300" style="width: 100%; height: 300px; overflow: visible;">
              <!-- Connection Lines -->
              <path id="edge-customers-marketing" d="M 90 190 Q 150 110, 210 110" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" fill="none" />
              <path id="edge-marketing-revenue" d="M 210 110 Q 260 160, 320 210" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" fill="none" />
              <path id="edge-revenue-profit" d="M 320 210 Q 410 180, 510 150" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" fill="none" />
              <path id="edge-inventory-operations" d="M 210 250 Q 300 170, 390 100" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" fill="none" />
              <path id="edge-operations-profit" d="M 390 100 Q 450 120, 510 150" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" fill="none" />
              <path id="edge-revenue-operations" d="M 320 210 Q 350 150, 390 100" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" fill="none" />
              <path id="edge-customers-revenue" d="M 90 190 L 320 210" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" fill="none" />
              
              <!-- Nodes -->
              <g class="graph-node" id="node-customers" data-entity="Customers" transform="translate(90, 190)">
                <circle r="34" fill="#151B23" stroke="var(--color-border-strong)" stroke-width="1.5" />
                <circle class="hover-glow" r="34" fill="none" stroke="var(--color-accent-sage)" stroke-width="0" opacity="0.4" />
                <text text-anchor="middle" y="4" font-size="9" font-weight="700" fill="var(--color-text-primary)">CUSTOMERS</text>
              </g>
              
              <g class="graph-node" id="node-marketing" data-entity="Marketing" transform="translate(210, 110)">
                <circle r="34" fill="#151B23" stroke="var(--color-border-strong)" stroke-width="1.5" />
                <circle class="hover-glow" r="34" fill="none" stroke="var(--color-accent-sage)" stroke-width="0" opacity="0.4" />
                <text text-anchor="middle" y="4" font-size="9" font-weight="700" fill="var(--color-text-primary)">MARKETING</text>
              </g>
              
              <g class="graph-node" id="node-revenue" data-entity="Revenue" transform="translate(320, 210)">
                <circle r="34" fill="#151B23" stroke="var(--color-border-strong)" stroke-width="1.5" />
                <circle class="hover-glow" r="34" fill="none" stroke="var(--color-accent-sage)" stroke-width="0" opacity="0.4" />
                <text text-anchor="middle" y="4" font-size="9" font-weight="700" fill="var(--color-text-primary)">REVENUE</text>
              </g>
              
              <g class="graph-node" id="node-inventory" data-entity="Inventory" transform="translate(210, 250)">
                <circle r="34" fill="#151B23" stroke="var(--color-border-strong)" stroke-width="1.5" />
                <circle class="hover-glow" r="34" fill="none" stroke="var(--color-accent-sage)" stroke-width="0" opacity="0.4" />
                <text text-anchor="middle" y="4" font-size="9" font-weight="700" fill="var(--color-text-primary)">INVENTORY</text>
              </g>
              
              <g class="graph-node" id="node-operations" data-entity="Operations" transform="translate(390, 100)">
                <circle r="34" fill="#151B23" stroke="var(--color-border-strong)" stroke-width="1.5" />
                <circle class="hover-glow" r="34" fill="none" stroke="var(--color-accent-sage)" stroke-width="0" opacity="0.4" />
                <text text-anchor="middle" y="4" font-size="9" font-weight="700" fill="var(--color-text-primary)">OPERATIONS</text>
              </g>
              
              <g class="graph-node" id="node-profit" data-entity="Profit" transform="translate(510, 150)">
                <circle r="34" fill="#151B23" stroke="var(--color-border-strong)" stroke-width="1.5" />
                <circle class="hover-glow" r="34" fill="none" stroke="var(--color-accent-sage)" stroke-width="0" opacity="0.4" />
                <text text-anchor="middle" y="4" font-size="9" font-weight="700" fill="var(--color-text-primary)">PROFIT</text>
              </g>
            </svg>
          </div>
          
          <div class="decision-graph-context" id="graph-context-card">
            <div style="display: flex; align-items: center; gap: var(--spacing-xs); margin-bottom: var(--spacing-xs);">
              <span class="ai-indicator-badge olive-badge">• Decision Engine Graph</span>
              <span class="ai-indicator-badge" id="graph-node-status">Connected</span>
            </div>
            <h3 class="graph-context-title" id="graph-context-title">Strategic Matrix</h3>
            <p class="graph-context-desc" id="graph-context-desc">Hover over any node in the system graph to inspect downstream decision pathways and dynamic metric associations mapped by the SynapseIQ compiler.</p>
            
            <div class="graph-associated-metrics" id="graph-associated-metrics" style="display: none; margin-top: 12px; border-top: 0.75px dashed var(--color-border-hairline); padding-top: 10px;">
              <span class="meta-label" style="font-size: 8px;">CONNECTED NODES</span>
              <div id="graph-metrics-pills" style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px;"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 1: Business Signals -->
      <section class="dashboard-section">
        <span class="section-question-label">Business Signals</span>
        <h2 class="section-headline">What trends require immediate leadership focus?</h2>
        
        <div class="signals-grid-redesign">
          ${signalsHTML}
        </div>
      </section>

      <!-- Section 2: Business Timeline (Fulfilling Business Story Unfolding) -->
      <section class="dashboard-section">
        <span class="section-question-label">Business Timeline</span>
        <h2 class="section-headline">Strategic Progression Pathway</h2>
        
        <div class="business-timeline">
          <div class="timeline-milestone">
            <span class="timeline-time">Day 1 — Current State</span>
            <h3 class="timeline-title">Diagnostic Intake Complete</h3>
            <p class="timeline-desc">Intake Well completes processing 18,240 records. 14 critical anomalies isolated. Upstream transit latencies flag Vietnam shipping ports at 32 days maximum queue latency.</p>
          </div>
          
          <div class="timeline-milestone milestone-alert">
            <span class="timeline-time" style="color: var(--color-accent-terracotta);">Day 15 — Projected Stress Point</span>
            <h3 class="timeline-title">Hanoi Supplier Tooling Solvency Warning</h3>
            <p class="timeline-desc">Predictive modeling highlights insolvency constraints at Tier-2 precision assembly houses. Capital buffer or Mexican routing overrides recommended.</p>
          </div>
          
          <div class="timeline-milestone">
            <span class="timeline-time">Day 30 — Target Pivot Point</span>
            <h3 class="timeline-title">Tactical Redirection Corridor Activation</h3>
            <p class="timeline-desc">Guadalajara safety margin scaled up to 72% storage capacity. Re-allocation of Laredo rail logistics corridors replaces maritime queue lanes.</p>
          </div>
          
          <div class="timeline-milestone">
            <span class="timeline-time">Day 60 — Auditing Target</span>
            <h3 class="timeline-title">Customs Regulatory Clearance Peak</h3>
            <p class="timeline-desc">Customs delay overhead clearances reach optimal 100% completion margins, stabilizing regional logistics channels.</p>
          </div>
          
          <div class="timeline-milestone">
            <span class="timeline-time">Day 90 — Baseline Target</span>
            <h3 class="timeline-title">Margin Volatility Stabilization</h3>
            <p class="timeline-desc">Fixed-capacity pricing limits and nearshore supply channels contract ocean spot rate freight overhead variations by 15%, defending baseline profit markers.</p>
          </div>
        </div>
      </section>

      <!-- Section 3: Strategic Actions -->
      <section class="dashboard-section">
        <span class="section-question-label">Strategic Actions</span>
        <h2 class="section-headline">What decisions are pending executive resolution?</h2>
        
        <div class="strategic-action-list">
          ${listHTML}
        </div>
      </section>

      <!-- Section 4: Future Outlook & Copilot -->
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

      <!-- Section 5: Boardroom Report -->
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

  // Dynamic Graph Nodes Interactive Event Binding
  const nodes = document.querySelectorAll(".graph-node");
  const graphContextTitle = document.getElementById("graph-context-title");
  const graphContextDesc = document.getElementById("graph-context-desc");
  const graphNodeStatus = document.getElementById("graph-node-status");
  const associatedMetrics = document.getElementById("graph-associated-metrics");
  const metricsPills = document.getElementById("graph-metrics-pills");
  
  const entityData = {
    Customers: {
      desc: "Sourcing accounts show 93% Q2 renewals. Acquisition volume maps directly to ARR pipelines.",
      status: "+18% Renewals",
      connections: ["Marketing", "Revenue"],
      color: "var(--color-accent-sage)"
    },
    Marketing: {
      desc: "Marketing allocation drives high-value customer acquisitions. Accounts acquisition cost down 8%.",
      status: "-8% Acquisition",
      connections: ["Customers", "Revenue"],
      color: "var(--color-accent-sage)"
    },
    Revenue: {
      desc: "ARR models stable. High renewal rates balance premium cargo surcharges.",
      status: "Stable Run-Rate",
      connections: ["Customers", "Marketing", "Profit", "Operations"],
      color: "var(--color-accent-sage)"
    },
    Inventory: {
      desc: "Stuttgart safety stock is at 72% utilization to cushion Antwerp custom check latency.",
      status: "72% Capacity",
      connections: ["Operations"],
      color: "var(--color-accent-olive)"
    },
    Operations: {
      desc: "Sourcing transit latencies peak at 32 days due to Singapore/Hanoi port queues.",
      status: "32 Days Latency",
      connections: ["Inventory", "Revenue", "Profit"],
      color: "var(--color-accent-terracotta)"
    },
    Profit: {
      desc: "Net yield is protected by fixed-price ocean freight caps and Guadalajara nearshore re-routing.",
      status: "Optimized Yield",
      connections: ["Revenue", "Operations"],
      color: "var(--color-accent-sage)"
    }
  };

  nodes.forEach(node => {
    node.addEventListener("mouseenter", () => {
      const entity = node.getAttribute("data-entity");
      const info = entityData[entity];
      if (info) {
        // Highlight active nodes using inline styles
        node.querySelector("circle").style.stroke = "var(--color-accent-sage)";
        node.querySelector(".hover-glow").style.strokeWidth = "8px";
        
        // Update context card details
        graphContextTitle.textContent = entity;
        graphContextDesc.textContent = info.desc;
        graphNodeStatus.textContent = info.status;
        graphNodeStatus.className = `ai-indicator-badge ${entity === 'Operations' ? 'terracotta-badge' : 'olive-badge'}`;
        
        // Render associated nodes tags
        associatedMetrics.style.display = "block";
        metricsPills.innerHTML = info.connections.map(c => `
          <span class="summary-metric-pill" style="font-size: 8px; font-weight:700;">${c}</span>
        `).join("");
        
        // Dim all background paths, highlight matching pathways
        document.querySelectorAll("path[id^='edge-']").forEach(p => {
          p.style.stroke = "rgba(255,255,255,0.05)";
          p.style.strokeWidth = "1";
        });
        
        info.connections.forEach(conn => {
          const id1 = `edge-${entity.toLowerCase()}-${conn.toLowerCase()}`;
          const id2 = `edge-${conn.toLowerCase()}-${entity.toLowerCase()}`;
          const pEl = document.getElementById(id1) || document.getElementById(id2);
          if (pEl) {
            pEl.style.stroke = entity === 'Operations' ? 'var(--color-accent-terracotta)' : 'var(--color-accent-sage)';
            pEl.style.strokeWidth = "2.5";
          }
        });
      }
    });

    node.addEventListener("mouseleave", () => {
      node.querySelector("circle").style.stroke = "var(--color-border-strong)";
      node.querySelector(".hover-glow").style.strokeWidth = "0";
      
      // Reset edge styles
      document.querySelectorAll("path[id^='edge-']").forEach(p => {
        p.style.stroke = "rgba(255,255,255,0.15)";
        p.style.strokeWidth = "1.5";
      });
    });
  });

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

  // Build the cinematic checklist structure dynamically
  const statusContainer = document.querySelector(".overlay-status-container");
  if (statusContainer) {
    statusContainer.innerHTML = `
      <div class="overlay-checklist" id="overlay-checklist">
        <div class="checklist-item" id="item-0"><span>Reading Dataset...</span><span class="checklist-status" id="status-0">Pending</span></div>
        <div class="checklist-item" id="item-1"><span>Understanding Business Context...</span><span class="checklist-status" id="status-1">Pending</span></div>
        <div class="checklist-item" id="item-2"><span>Detecting Trends...</span><span class="checklist-status" id="status-2">Pending</span></div>
        <div class="checklist-item" id="item-3"><span>Finding Opportunities...</span><span class="checklist-status" id="status-3">Pending</span></div>
        <div class="checklist-item" id="item-4"><span>Building Executive Brief...</span><span class="checklist-status" id="status-4">Pending</span></div>
        <div class="checklist-item" id="item-5"><span>Preparing Decision Workspace...</span><span class="checklist-status" id="status-5">Pending</span></div>
      </div>
      <div class="overlay-ready-msg" id="overlay-ready-msg">Your Executive Brief is Ready.</div>
    `;
  }

  const totalStages = 6;
  let currentStageIdx = 0;
  const stageDuration = 600; // 600ms per stage

  // Progress starts at 0
  barEl.style.width = "0%";

  function updateStage() {
    if (currentStageIdx < totalStages) {
      const itemEl = document.getElementById(`item-${currentStageIdx}`);
      const statusEl = document.getElementById(`status-${currentStageIdx}`);
      
      if (itemEl && statusEl) {
        itemEl.classList.add("active");
        statusEl.textContent = "In Progress";
      }

      setTimeout(() => {
        if (itemEl && statusEl) {
          itemEl.classList.remove("active");
          itemEl.classList.add("completed");
          statusEl.textContent = "✓ Complete";
        }
        
        const percent = Math.round(((currentStageIdx + 1) / totalStages) * 100);
        barEl.style.width = `${percent}%`;
        
        currentStageIdx++;
        setTimeout(updateStage, 150); // slight pause between items
      }, stageDuration);
    } else {
      // Completed all steps! Trigger cinematic confirmation transition
      const checklist = document.getElementById("overlay-checklist");
      const readyMsg = document.getElementById("overlay-ready-msg");
      
      if (checklist) {
        checklist.style.opacity = "0";
      }
      
      setTimeout(() => {
        if (checklist) checklist.style.display = "none";
        if (readyMsg) {
          readyMsg.classList.add("visible");
        }
        
        // Final transition out after showing "Your Executive Brief is Ready."
        setTimeout(() => {
          overlay.style.opacity = "0";
          
          const landingContainer = document.getElementById("landing-container");
          if (landingContainer) {
            landingContainer.classList.add("fade-out");
          }
          
          setTimeout(() => {
            overlay.style.display = "none";
            if (landingContainer) {
              landingContainer.style.display = "none";
            }
            
            const appContainer = document.getElementById("app-container");
            if (appContainer) {
              appContainer.style.display = "flex";
              appContainer.offsetHeight;
              appContainer.classList.add("fade-in");
            }
            
            navigateTo("executive-brief");
          }, 800);
        }, 1600);
      }, 400);
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
