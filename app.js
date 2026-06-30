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

