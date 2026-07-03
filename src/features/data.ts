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
    category: 'Revenue Performance',
    text: 'Why did revenue increase?',
    query: 'Why did revenue increase?'
  },
  {
    category: 'Risk Diagnostics',
    text: 'Which region is underperforming?',
    query: 'Which region is underperforming?'
  },
  {
    category: 'Profit Projections',
    text: "Predict next month's profit.",
    query: "Predict next month's profit."
  },
  {
    category: 'Risk Mitigation',
    text: 'What is my biggest business risk?',
    query: 'What is my biggest business risk?'
  },
  {
    category: 'Marketing ROI',
    text: 'Which marketing campaign had the best ROI?',
    query: 'Which marketing campaign had the best ROI?'
  },
  {
    category: 'Strategic Investment',
    text: 'Where should I invest next?',
    query: 'Where should I invest next?'
  }
];

export const copilotAIResponses: Record<string, any> = {
  'What should the company prioritize next quarter?': {
    summary: 'Priorities concentrate on two strategic pillars: nearshoring logistics nodes to the Guadalajara corridor to recoup transpacific latencies and scaling EU ARR expansion via digital compliance modules.',
    evidence: [
      'Jalisco nearshoring corridor lowers shipping queue time from 32 down to 14 days.',
      'Sourcing 25% sub-assemblies domestically preserves gross profit margin targets at 44.0%.',
      'Frankfurt compliance certifications unlock a $12M enterprise pipeline in Central Europe.'
    ],
    confidence: 96,
    recommendation: 'Lock fixed ocean carrier contracts immediately and reallocate 20% of display ad spend to EU targeted webinars.',
    relatedMetrics: ['Gross Margin (44.0%)', 'Transit Latency (32d)', 'NRR (118%)'],
    nextQuestion: 'Predict next month\'s profit.'
  },
  'default-query': {
    summary: 'A standard diagnostic assessment indicates that our logistics channels are running near capacity. Upstream supply chains are stable but vulnerable to maritime transit queues.',
    evidence: [
      'Singapore ports are logging a 32-day transit latency.',
      'Mexican safety stocks are at 30 days.',
      'Enterprise bookings remain strong in the EU corridor.'
    ],
    confidence: 94,
    recommendation: 'Initiate buffer stock scaling to 45 days in North American logistics centers.',
    relatedMetrics: ['Transit Latency (32d)', 'Gross Margin (44.0%)'],
    nextQuestion: 'Simulate Mexican logistics pivot.'
  },
  'Why did revenue increase?': {
    summary: 'Revenue expanded by 18% YoY ($42.8M run-rate), driven by strong Net Revenue Retention (NRR) and contract wins in the EU market compliance segment.',
    evidence: [
      'Net Revenue Retention (NRR) rose to 118% with near-zero Tier-1 churn.',
      'Frankfurt cloud node launch converted 12 security-conscious enterprise accounts.',
      'Customer Acquisition Cost (CAC) decreased by 8% due to high-intent ABM search campaigns.'
    ],
    confidence: 96,
    recommendation: 'Reallocate surplus display ad budget to high-intent account lists in Germany and France.',
    relatedMetrics: ['Revenue Growth (+18%)', 'CAC Efficiency (↓ 8%)', 'NRR (118%)'],
    nextQuestion: 'Which marketing campaign had the best ROI?'
  },
  'Which region is underperforming?': {
    summary: 'The Asia-Pacific supply corridor underperforms due to upstream logistics lags at ports, causing delivery assembly gaps in final delivery pipelines.',
    evidence: [
      'Vietnam assembly hubs report a 32-day shipment delay.',
      'Hanoi Precision Parts debt metrics warn of potential solvency constraint issues.',
      'Texas warehouse space utilization is currently at 88% capacity.'
    ],
    confidence: 92,
    recommendation: 'Divert wafer sourcing flow to Arizona foundry lines and scale Mexican safety stock targets.',
    relatedMetrics: ['Transit Latency (32d)', 'Inventory Turns (6.2x)'],
    nextQuestion: 'What is my biggest business risk?'
  },
  "Predict next month's profit.": {
    summary: 'Gross profit margins are projected to stabilize at 44.0%, but operating margins face a 1.8% contraction risk if ocean freight spot rates remain volatile.',
    evidence: [
      'Ocean spot freight rates increased by $1,200 per container this month.',
      'Guadalajara assembly capacity utilization is running at 92.4%.',
      'Overland shipping from Laredo is scaling up by 15%.'
    ],
    confidence: 88,
    recommendation: 'Lock in fixed ocean carrier rates on the Eastern Pacific corridor immediately.',
    relatedMetrics: ['Gross Margin (44.0%)', 'Transit Latency (32d)'],
    nextQuestion: 'Where should I invest next?'
  },
  'What is my biggest business risk?': {
    summary: 'Overconcentration of wafer sub-assemblies in Hanoi Precision Parts exposes the business to supplier credit default and final delivery shutdown hazards.',
    evidence: [
      'Vietnam supplier debt ratio escalated to 2.8x.',
      'Vietnam terminal vessel turnaround is 5.2 days longer than the historical baseline.',
      'Guadalajara inventory safety buffer holds less than 14 days of SKU-940 components.'
    ],
    confidence: 95,
    recommendation: 'Transition wafer allocations to Arizona foundry lines within the next 60 days.',
    relatedMetrics: ['Vietnam Solvency (32 pts)', 'Transit Latency (32d)', 'Capacity (92.4%)'],
    nextQuestion: "Predict next month's profit."
  },
  'Which marketing campaign had the best ROI?': {
    summary: 'Account-Based Marketing (ABM) targeting Fortune 500 manufacturing accounts yielded the highest returns, reducing overall CAC by 8%.',
    evidence: [
      'ABM program logged a 5.4x LTV:CAC efficiency ratio.',
      'Paid search on high-volume developer keywords CPC increased by 22%.',
      'EU compliance webinars converted 4 major logos.'
    ],
    confidence: 93,
    recommendation: 'Shift 20% of paid display ad spend to targeted compliance webinars and account campaigns.',
    relatedMetrics: ['CAC Efficiency (↓ 8%)', 'Revenue Run-rate ($42.8M)'],
    nextQuestion: 'Why did revenue increase?'
  },
  'Where should I invest next?': {
    summary: 'Capital allocation modeling favors scaling the Jalisco nearshoring corridor to eliminate transpacific logistics delays and minimize capital lockup.',
    evidence: [
      'Nearshoring near Guadalajara reduces transit times from 32 to 14 days.',
      'Overland logistics reduces sea freight custom delays by 2.4 days.',
      'Initial Jalisco plant capacity is running underutilized at 72%.'
    ],
    confidence: 91,
    recommendation: 'Approve the Jalisco supply chain corridor nearshoring proposal.',
    relatedMetrics: ['Gross Margin (44.0%)', 'Transit Latency (32d)', 'Capacity (92.4%)'],
    nextQuestion: 'Why did revenue increase?'
  }
};

export const timelineEvents: any[] = [
  {
    id: 'ev-1',
    date: 'June 25, 2026',
    title: 'Revenue run-rate expanded by 18% YoY',
    summary: 'Q2 enterprise subscription contract conversions exceed target expectations by $3.2M ARR, led by security compliant sales wins in Western Europe.',
    impact: '+$3.2M ARR expansion run-rate',
    confidence: 96,
    trend: 'Optimizing',
    category: 'Revenue',
    whatHappened: 'Subscriptions expanded due to local EU data compliance certifications.',
    why: 'Enterprise accounts in Frankfurt and Paris convert at double the historical baseline.',
    recommendedAction: 'Divert marketing lead generation budget to high-intent European accounts.',
    targetNodeId: 'revenue'
  },
  {
    id: 'ev-2',
    date: 'June 18, 2026',
    title: 'Account-Based Marketing (ABM) launch',
    summary: 'Targeted campaign outreach launched across Fortune 500 manufacturing accounts to combat developer CPC search keyword inflation.',
    impact: '↓ 8% Customer Acquisition Cost (CAC)',
    confidence: 93,
    trend: 'High ROI',
    category: 'Marketing',
    whatHappened: 'Outreach campaigns deployed to bypass developer keyword bid wars.',
    why: 'Niche account-based targeting captures high-intent buyers directly.',
    recommendedAction: 'Add the top 200 mid-market manufacturing logos to the outreach segment.',
    targetNodeId: 'marketing'
  },
  {
    id: 'ev-3',
    date: 'June 10, 2026',
    title: 'Vietnam MCU components supply strain',
    summary: 'Upstream port transit backlogs at Ho Chi Minh docks delay semiconductor delivery, shrinking Jalisco assembly safety stock holding down to 14 days.',
    impact: '+4 days transpacific shipping queue latency',
    confidence: 92,
    trend: 'Risk Alert',
    category: 'Inventory',
    whatHappened: 'MCU sub-assemblies delayed due to transpacific vessel backlogs.',
    why: 'High port utilization and carrier container imbalances at Ho Chi Minh docks.',
    recommendedAction: 'Approve wafer allocation shifting to domestic Arizona foundries.',
    targetNodeId: 'inventory'
  },
  {
    id: 'ev-4',
    date: 'May 28, 2026',
    title: 'Support SLA compliance compression',
    summary: 'Customer success onboarding queues briefly bottleneck under rapid subscription scaling, slipping composite NPS down to 72.',
    impact: '-2.4 hours support SLA response latency',
    confidence: 89,
    trend: 'SLA Strain',
    category: 'Customers',
    whatHappened: 'Support queue response delays logged during peak logo conversions.',
    why: 'Customer success staffing ratios failed to match onboarding volume spikes.',
    recommendedAction: 'Deploy automated AI-assisted ticket triage filters to lower response loops.',
    targetNodeId: 'customers'
  },
  {
    id: 'ev-5',
    date: 'May 14, 2026',
    title: 'GDPR compliance validation in Frankfurt',
    summary: 'Frankfurt cloud node installations complete, enabling localized data hosting compliance certificates.',
    impact: 'Unlocks $12M target pipeline in Central Europe',
    confidence: 95,
    trend: 'Growth Trigger',
    category: 'Growth',
    whatHappened: 'Local EU hosting capabilities initialized.',
    why: 'Regulatory boundaries require localized data residence.',
    recommendedAction: 'Publish success dossier for marketing outreach campaigns.',
    targetNodeId: 'growth'
  },
  {
    id: 'ev-6',
    date: 'May 02, 2026',
    title: 'Guadalajara capacity forecast index update',
    summary: 'Mexico assembly line models simulated at 72% capacity scaling potential.',
    impact: 'Reduces shipping latency from 32 to 14 days',
    confidence: 91,
    trend: 'Optimized',
    category: 'Operations',
    whatHappened: 'Procurement models updated to represent nearshoring pivots.',
    why: 'Overland corridor clears customs 2.4 days faster than marine lanes.',
    recommendedAction: 'Approve Jalisco supply chain corridor transition.',
    targetNodeId: 'operations'
  }
];
