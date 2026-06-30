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
