import type { NodeContext, BriefingReport, SignalItem } from '../types';

export const nodeContexts: Record<string, NodeContext> = {
  health: {
    id: 'health',
    title: 'Business Health Index',
    summary: 'The composite health index registers 84/100, driven by strong enterprise revenue bookings and high customer retention. However, logistics disruptions in Asian lanes pose minor capital lockup risks.',
    metricLabel: 'Composite Health Score',
    metric: '84/100',
    trend: 'neutral',
    opportunity: 'Diversify logistics lanes to Jalisco corridor to unlock $4.2M working capital.',
    risk: '32-day transit queue at Vietnam ports causing supply line strain.',
    recommendation: 'Initiate safety stock buffer allocation in North American fulfillment nodes.'
  },
  revenue: {
    id: 'revenue',
    title: 'Revenue Metrics Run-rate',
    summary: 'Enterprise subscription revenue grew by 18% YoY in Q2, beating expectations. New landing expansion in European Union offset slower APAC transactional software sales.',
    metricLabel: 'Quarterly Run-Rate',
    metric: '$42.8M',
    trend: 'up',
    opportunity: 'Accelerate contract conversions in Germany and France following compliance audits.',
    risk: 'Slower deal cycles in APAC due to local regulatory shifts.',
    recommendation: 'Shift 15% regional marketing budget from APAC to European expansion targets.'
  },
  profit: {
    id: 'profit',
    title: 'Operating Profit Margin',
    summary: 'Gross profit margins stabilized at 44.0%, but operating margin is slightly compressed due to ocean freight spot rate hikes. Real-time sourcing pivots protect core margins.',
    metricLabel: 'Gross Margin',
    metric: '44.0%',
    trend: 'up',
    opportunity: 'Lock in fixed ocean carrier rates on the Eastern Pacific corridor.',
    risk: 'Freight spot rate volatility could contract bottom line by 1.8% next quarter.',
    recommendation: 'Accelerate nearshore migration of electronics sub-assemblies to Mexico.'
  },
  customers: {
    id: 'customers',
    title: 'Customer Acquisition & Base',
    summary: 'Enterprise active logo count expanded by 12% with near-zero churn in Tier-1 customer categories. Mid-market customer groups represent the highest expansion velocity.',
    metricLabel: 'Net Revenue Retention',
    metric: '118%',
    trend: 'up',
    opportunity: 'Upsell contextual compliance modules to the existing mid-market base.',
    risk: 'Customer success bottlenecks due to rapid post-sale onboarding demands.',
    recommendation: 'Increase customer success staffing ratios by 8% in high-growth corridors.'
  },
  marketing: {
    id: 'marketing',
    title: 'Marketing Performance Index',
    summary: 'Customer Acquisition Cost (CAC) declined by 8% due to high-intent search optimization and target account marketing campaigns. Paid media returns peaked in North America.',
    metricLabel: 'LTV : CAC Ratio',
    metric: '4.8x',
    trend: 'up',
    opportunity: 'Double down on account-based strategy for Fortune 500 manufacturing accounts.',
    risk: 'Cost-per-click escalation on high-volume developer keywords.',
    recommendation: 'Reallocate 20% of general display budget to targeted logistics reports and webinars.'
  },
  inventory: {
    id: 'inventory',
    title: 'Inventory Turn Velocity',
    summary: 'Global inventory turn velocity slowed slightly. Lead times on core semiconductors extended, requiring higher safety stock holding at North American warehouses.',
    metricLabel: 'Inventory Turnover',
    metric: '6.2x',
    trend: 'down',
    opportunity: 'Repurpose empty warehouse space in Texas for nearshore buffer logistics.',
    risk: 'Critical parts depletion at Mexican manufacturing plants if shipping slips further.',
    recommendation: 'Increase safety stock ratio of critical SKU-940 components to 45 days.'
  },
  operations: {
    id: 'operations',
    title: 'Operational Execution Index',
    summary: 'Manufacturing capacity utilization reached 92% at Guadalajara and Austin plants. Upstream supply chain latency remains the chief operational constraint.',
    metricLabel: 'Capacity Utilization',
    metric: '92.4%',
    trend: 'neutral',
    opportunity: 'Deploy automated inspection tooling to reduce quality audit loop times.',
    risk: 'Port bottlenecks causing sub-assembly delivery gaps.',
    recommendation: 'Leverage air-freight corridors for high-margin SKU shipments to cover gaps.'
  },
  'customer-satisfaction': {
    id: 'customer-satisfaction',
    title: 'Customer Satisfaction Score',
    summary: 'Customer Net Promoter Score (NPS) registers a strong 72, driven by product reliability and high customer service responsiveness. SLA compliance stands at 99.4%.',
    metricLabel: 'Net Promoter Score',
    metric: '72 NPS',
    trend: 'up',
    opportunity: 'Publish customer success stories to highlight SLA consistency and reliability.',
    risk: 'Higher response times during peak shipping season overloads support channels.',
    recommendation: 'Implement AI-assisted ticket triage to maintain under-15-minute response times.'
  }
};

export const businessSignals: SignalItem[] = [
  {
    id: 'transit-latency',
    title: 'Transit Latency Index',
    category: 'Logistics',
    score: 32,
    delta: '+4 days',
    trend: 'negative',
    note: 'Upstream transit latencies flag <strong>Singapore to Laredo</strong> ocean routes at peak delays.',
    chartData: [
      { time: 'M1', value: 24, baseline: 20 },
      { time: 'M2', value: 25, baseline: 20 },
      { time: 'M3', value: 28, baseline: 20 },
      { time: 'M4', value: 30, baseline: 20 },
      { time: 'M5', value: 32, baseline: 20 }
    ]
  },
  {
    id: 'solvency-constraints',
    title: 'Supplier Financial Health',
    category: 'Risk Management',
    score: 84,
    delta: '-12 pts',
    trend: 'negative',
    note: 'Predictive modeling flags <strong>Hanoi Precision Parts</strong> with warning debt-to-equity markers.',
    chartData: [
      { time: 'M1', value: 96 },
      { time: 'M2', value: 94 },
      { time: 'M3', value: 91 },
      { time: 'M4', value: 87 },
      { time: 'M5', value: 84 }
    ]
  },
  {
    id: 'cac-efficiency',
    title: 'CAC Efficiency Ratio',
    category: 'Finance',
    score: 8.2,
    delta: '-8% cost',
    trend: 'positive',
    note: 'LTV value expands with targeted enterprise bookings, optimizing <strong>CAC returns</strong>.',
    chartData: [
      { time: 'M1', value: 9.0 },
      { time: 'M2', value: 8.8 },
      { time: 'M3', value: 8.5 },
      { time: 'M4', value: 8.3 },
      { time: 'M5', value: 8.2 }
    ]
  },
  {
    id: 'gross-margin',
    title: 'Gross Operating Profit Margin',
    category: 'Finance',
    score: 44.0,
    delta: '+0.5%',
    trend: 'positive',
    note: 'Real-time supply corridor rerouting successfully protects the core <strong>margin target</strong>.',
    chartData: [
      { time: 'M1', value: 43.2, baseline: 43.0 },
      { time: 'M2', value: 43.5, baseline: 43.0 },
      { time: 'M3', value: 43.8, baseline: 43.0 },
      { time: 'M4', value: 43.9, baseline: 43.0 },
      { time: 'M5', value: 44.0, baseline: 43.0 }
    ]
  },
  {
    id: 'order-fill-rate',
    title: 'Order Perfect Fill Rate',
    category: 'Operations',
    score: 96.8,
    delta: '+1.2%',
    trend: 'positive',
    note: 'Austin assembly center optimization yields <strong>96.8% perfect deliveries</strong>.',
    chartData: [
      { time: 'M1', value: 95.1 },
      { time: 'M2', value: 95.3 },
      { time: 'M3', value: 95.8 },
      { time: 'M4', value: 96.2 },
      { time: 'M5', value: 96.8 }
    ]
  },
  {
    id: 'customs-holdings',
    title: 'Customs Clearance Latency',
    category: 'Compliance',
    score: 1.8,
    delta: '-0.4 days',
    trend: 'positive',
    note: 'Fast-tracked pre-clearances at <strong>Laredo port of entry</strong> reduced holding times.',
    chartData: [
      { time: 'M1', value: 2.4 },
      { time: 'M2', value: 2.2 },
      { time: 'M3', value: 2.0 },
      { time: 'M4', value: 1.9 },
      { time: 'M5', value: 1.8 }
    ]
  }
];

export const briefingReports: BriefingReport[] = [
  {
    id: 'supply-chain',
    title: 'Transpacific Logistics & Supply Chain Exposure',
    category: 'Operations & Logistics',
    date: 'June 2026',
    riskLevel: 'Critical',
    summary: 'A bottleneck study on key ocean corridors. Overconcentration of logistics nodes in Southeast Asia creates high susceptibility to shipping queue delays.',
    narrative: [
      'An analysis of transpacific shipping records indicates that maritime corridors exiting the Port of Ho Chi Minh and Singapore are experiencing unprecedented congestion. Average vessel queue delays at these hubs have escalated by 18% over the past 45 days, causing downstream manufacturing disruptions.',
      'Our diagnostic logs reveal a secondary vulnerability: over-reliance on the Laredo overland rail connection for final assembly shipping. A 2.4-day average custom delay at Laredo has generated inventory pile-ups at our border warehouses, tying up roughly $4.2M in working capital.',
      'The strategy consulting AI recommends a dual-path rerouting strategy: shifting 25% of electronics shipping volume to nearshore Mexican nodes in Guadalajara and utilizing Laredo primarily for pre-cleared, fast-track shipments.'
    ]
  },
  {
    id: 'semiconductor',
    title: 'Semiconductor Sourcing Risk Matrix',
    category: 'Risk Management',
    date: 'May 2026',
    riskLevel: 'High',
    summary: 'Audit of Tier-1 and Tier-2 foundry allocations. Supply security assessment for core microcontroller SKU assemblies.',
    narrative: [
      'Microcontroller unit (MCU) lead times have stabilized at 24 weeks, but raw wafer constraints persist at key Tier-2 suppliers in Taiwan. Any regional supply shock would instantly halt assembly lines in Guadalajara within 14 days.',
      'The audit team recommends establishing a multi-foundry sourcing structure, introducing a secondary wafer validation corridor via US-based domestic foundries, even at a 12% unit cost premium, to guarantee operational continuity.',
      'By scaling safety stocks from 30 to 60 days, we can establish a buffer that insulates the core production line from sudden shipping halts.'
    ]
  },
  {
    id: 'market-expansion',
    title: 'EU Digital Trade Compliance Audit',
    category: 'Compliance & Legal',
    date: 'April 2026',
    riskLevel: 'Optimized',
    summary: 'Preparation briefing for regulatory changes in the European Union. Analysis of operational adjustments needed to secure expansion goals.',
    narrative: [
      'A review of the upcoming EU digital trade regulations indicates our compliance roadmap is fully aligned. Data localization mandates have been satisfied through the establishment of our Frankfurt cloud nodes.',
      'Minor overhead adjustments in customer success reporting protocols are required before the September enforcement date, but no major engineering milestones are blocking expansion targets.',
      'Leverage this compliant status as a primary competitive differentiator in pending sales cycles with enterprise prospects in Germany and France.'
    ]
  }
];

export const copilotStarters = [
  {
    category: 'Revenue & Growth',
    text: 'Why did revenue increase this month?',
    query: 'Provide a breakdown of the revenue growth. What factors contributed to the +18% increase this month?'
  },
  {
    category: 'Risk Assessment',
    text: 'Which region needs immediate attention?',
    query: 'Identify the region with the highest operational latency and financial risk. What are the key bottlenecks there?'
  },
  {
    category: 'Logistics Corridor',
    text: 'Analyze transpacific shipping bottlenecks.',
    query: 'Detail the current transit queue delays in Southeast Asia. How does it impact our safety stock metrics?'
  },
  {
    category: 'Nearshoring Modeler',
    text: 'Simulate Mexican logistics pivot.',
    query: 'How does nearshoring 25% of sub-assemblies to Mexico impact gross margin and shipping lead times?'
  }
];

export const copilotAIResponses: Record<string, any> = {
  'default-query': {
    summary: 'A standard diagnostic assessment indicates that our logistics channels are running near capacity. Upstream supply chains are stable but vulnerable to maritime transit queues.',
    evidence: [
      'Singapore ports are logging a 32-day transit latency.',
      'Mexican safety stocks are at 30 days.',
      'Enterprise bookings remain strong in the EU corridor.'
    ],
    confidence: 94,
    recommendation: 'Initiate buffer stock scaling to 45 days in North American logistics centers.'
  },
  'Why did revenue increase this month?': {
    summary: 'Q2 revenue run-rate expanded by 18% YoY ($42.8M total), primarily driven by enterprise renewals in North America and contract wins in the EU market compliance segment.',
    evidence: [
      'Net Revenue Retention (NRR) rose to 118%.',
      'EU digital compliance expansion added 12 new logo accounts.',
      'Customer Acquisition Cost (CAC) decreased by 8% due to targeted campaign execution.'
    ],
    confidence: 96,
    recommendation: 'Reallocate surplus lead generation funds to high-intent account lists in France and Germany.'
  },
  'Which region needs immediate attention?': {
    summary: 'The Asia-Pacific supply corridor requires immediate operational mitigation. Upstream logistics lags at ports are generating assembly gaps in final delivery pipelines.',
    evidence: [
      'Vietnam assembly hubs report a 32-day shipment delay.',
      'Hanoi Precision Parts debt metrics warn of potential solvency constraint issues.',
      'Texas warehouse space utilization is currently at 88% capacity.'
    ],
    confidence: 92,
    recommendation: 'Divert wafer sourcing flow to Arizona foundry lines and trigger the safety stock expansion.'
  },
  'Analyze transpacific shipping bottlenecks.': {
    summary: 'Transpacific transit times are constrained by port processing backlogs in Southeast Asian shipping hubs, primarily impacting electronics component SKU categories.',
    evidence: [
      'Average vessel turnaround is 5.2 days longer than the historical baseline.',
      'Ocean spot freight rates increased by $1,200 per container.',
      'Laredo customs clearance holds stand at 1.8 days.'
    ],
    confidence: 89,
    recommendation: 'Secure fixed contract rates for the remainder of the fiscal year to protect operating profit.'
  },
  'Simulate Mexican logistics pivot.': {
    summary: 'Rerouting 25% of wafer supply chains to the Guadalajara corridor decreases shipping latency from 32 to 14 days, protecting gross margins from cargo premium spikes.',
    evidence: [
      'Lead time drops by 18 days overall.',
      'Tariff mitigation lowers compliance overhead by $420k.',
      'Slight increase in overland transport costs is offset by maritime container cost reductions.'
    ],
    confidence: 91,
    recommendation: 'Approve the Jalisco supply chain corridor nearshoring proposal.'
  }
};
