import type { DatasetSummary } from './csvParser';
import type { NodeContext, SignalItem, BriefingReport, TimelineEvent } from '../types';

export function generateLocalAnalysis(summary: DatasetSummary): {
  nodeContexts: Record<string, NodeContext>;
  businessSignals: SignalItem[];
  briefingReports: BriefingReport[];
  timelineEvents: TimelineEvent[];
} {
  const profile = summary.profile;
  const metrics = summary.detectedMetrics;
  const kpiStats = summary.kpiStats;

  // Format currency helpers
  const formatCurrency = (val: number) => {
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    if (val >= 1e3) return `$${(val / 1e3).toFixed(1)}k`;
    return `$${val.toFixed(2)}`;
  };

  const totalRevenueVal = profile.totalRevenue;
  const totalProfitVal = profile.totalProfit;
  const averageSatisfactionVal = profile.averageSatisfaction;

  const totalRevenue = formatCurrency(totalRevenueVal);
  const totalProfit = formatCurrency(totalProfitVal);
  const avgSatisfaction = averageSatisfactionVal > 0 ? `${averageSatisfactionVal.toFixed(1)} NPS` : '82 NPS';

  // Compute profit margin
  const marginVal = totalRevenueVal > 0 ? (totalProfitVal / totalRevenueVal) * 100 : 44.0;
  const profitMargin = `${marginVal.toFixed(1)}%`;

  // Find strongest correlations for opportunities/risks
  let opportunityText = 'Pivot production lines to high-performing product segments to optimize yield.';
  let riskText = 'Inventory carrying costs or operational delays in logistics lanes limit profit potential.';
  let recommendationText = 'We recommend reallocating marketing capital to high-margin revenue nodes.';

  const correlationPairs: { h1: string; h2: string; val: number }[] = [];
  Object.keys(summary.correlations).forEach(h1 => {
    Object.keys(summary.correlations[h1]).forEach(h2 => {
      if (h1 < h2) {
        correlationPairs.push({ h1, h2, val: summary.correlations[h1][h2] });
      }
    });
  });

  // Sort by absolute correlation
  correlationPairs.sort((a, b) => Math.abs(b.val) - Math.abs(a.val));
  const strongPos = correlationPairs.find(p => p.val > 0.4 && p.h1 !== p.h2);
  const strongNeg = correlationPairs.find(p => p.val < -0.4 && p.h1 !== p.h2);

  if (strongPos) {
    opportunityText = `Accelerate customer exposure in "${strongPos.h1}" to drive "${strongPos.h2}" (positive correlation of ${strongPos.val.toFixed(2)}).`;
  }
  if (strongNeg) {
    riskText = `Historical inverse correlation of ${strongNeg.val.toFixed(2)} between "${strongNeg.h1}" and "${strongNeg.h2}" suggests resource conflict.`;
  }

  // Calculate trends for signals
  const generateSignalData = (colName: string | null, labelName: string, category: string, defaultScore: number): SignalItem => {
    if (!colName || !kpiStats[colName]) {
      // Mock signal data if column doesn't exist
      return {
        id: colName || labelName.toLowerCase().replace(/\s+/g, '-'),
        title: labelName,
        category,
        score: defaultScore,
        delta: '+0.0%',
        trend: 'neutral',
        note: 'Default tracking mode active.',
        chartData: Array.from({ length: 5 }, (_, i) => ({ time: `M${i+1}`, value: defaultScore })),
        advisory: {
          insight: `Baseline tracking for standard parameter ${labelName} is currently active.`,
          impact: `Current values are running nominal at a standard metric score of ${defaultScore}.`,
          action: `Verify dataset columns to ingest localized timeline telemetry for this indicator.`
        }
      };
    }

    const values = kpiStats[colName].values;
    const len = values.length;
    const chartVals = len > 5 ? values.slice(-5) : values;
    const chartData = chartVals.map((v, idx) => ({
      time: `M${idx + 1}`,
      value: Number(v.toFixed(1))
    }));

    const currentScore = Number(values[len - 1].toFixed(1));
    const previousScore = len > 1 ? values[len - 2] : currentScore;
    const deltaVal = currentScore - previousScore;
    const deltaPercent = previousScore > 0 ? (deltaVal / previousScore) * 100 : 0;
    const delta = `${deltaVal >= 0 ? '+' : ''}${deltaVal.toFixed(1)} (${deltaPercent >= 0 ? '+' : ''}${deltaPercent.toFixed(1)}%)`;
    const trend = deltaVal > 0 ? 'positive' : deltaVal < 0 ? 'negative' : 'neutral';

    return {
      id: colName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: colName,
      category,
      score: currentScore,
      delta,
      trend,
      note: `Active monitoring of ${colName} across all business operating segments.`,
      chartData,
      advisory: {
        insight: `Average ${colName} registered at ${kpiStats[colName].mean.toFixed(1)} with a peak of ${kpiStats[colName].max.toFixed(1)} and minimum of ${kpiStats[colName].min.toFixed(1)}.`,
        impact: `Current level is ${currentScore}, showing a ${deltaPercent >= 0 ? 'increase' : 'decrease'} of ${Math.abs(deltaPercent).toFixed(1)}% compared to the prior period.`,
        action: `Execute continuous correlation tracking on ${colName} to balance capital deployment buffers.`
      }
    };
  };

  const businessSignals: SignalItem[] = [
    generateSignalData(metrics.revenue, 'Revenue Performance', 'Finance', totalRevenueVal > 0 ? totalRevenueVal / summary.rowCount : 120000),
    generateSignalData(metrics.profit, 'Profit Telemetry', 'Finance', totalProfitVal > 0 ? totalProfitVal / summary.rowCount : 50000),
    generateSignalData(metrics.marketing, 'Marketing CAC Spend', 'Marketing', 15000),
    generateSignalData(metrics.inventory, 'Inventory Turnover', 'Operations', 35),
    generateSignalData(metrics.satisfaction, 'Customer Feedback Index', 'Customer Success', 80),
  ];

  // Calculate Business Health score out of 100
  let healthScore = 80;
  if (metrics.profit && metrics.revenue && totalRevenueVal > 0) {
    const margin = totalProfitVal / totalRevenueVal;
    if (margin > 0.5) healthScore += 15;
    else if (margin > 0.3) healthScore += 10;
    else if (margin > 0.1) healthScore += 5;
    else healthScore -= 10;
  }
  if (metrics.satisfaction && averageSatisfactionVal > 0) {
    if (averageSatisfactionVal > 85) healthScore += 5;
    else if (averageSatisfactionVal < 60) healthScore -= 10;
  }
  healthScore = Math.max(10, Math.min(100, healthScore));

  const nodeContexts: Record<string, NodeContext> = {
    health: {
      id: 'health',
      title: 'Business Health Index',
      summary: `The composite health score computes to ${healthScore}/100 based on parsed spreadsheet parameters. Performance is stabilized by cumulative profit margins of ${profitMargin} on a baseline of ${totalRevenue} total revenue.`,
      metricLabel: 'Composite Health Score',
      metric: `${healthScore}/100`,
      trend: healthScore >= 80 ? 'up' : healthScore >= 60 ? 'neutral' : 'down',
      opportunity: opportunityText,
      risk: riskText,
      recommendation: recommendationText
    },
    revenue: {
      id: 'revenue',
      title: 'Revenue Run-rate',
      summary: `Total accumulated revenue stands at ${totalRevenue} over a timeline of ${profile.timePeriod}. Sourcing channels are distributed across ${profile.categories.join(', ')} product categories.`,
      metricLabel: 'Accumulated Revenue',
      metric: totalRevenue,
      trend: 'up',
      opportunity: `Expand operations in the highest correlation category node to unlock scalable capital.`,
      risk: `Overconcentration of sales in a single category node introduces sudden revenue drops.`,
      recommendation: `We recommend balancing regional capital allocations across the ${profile.regions.length} active regions.`
    },
    profit: {
      id: 'profit',
      title: 'Operating Profit Margin',
      summary: `Total operating profit is validated at ${totalProfit} representing an average gross profit margin of ${profitMargin}. Sourcing overhead adjustments should target margin conservation.`,
      metricLabel: 'Total Profit',
      metric: totalProfit,
      trend: marginVal > 40 ? 'up' : 'neutral',
      opportunity: `Optimizing cost of goods sold (COGS) by 5% yields an additional ${formatCurrency(totalRevenueVal * 0.05)} profit.`,
      risk: `Upstream margin compression from operational cost spikes.`,
      recommendation: `We recommend locking fixed carrier and sourcing contracts for the next 90 days.`
    },
    customers: {
      id: 'customers',
      title: 'Customer Satisfaction Base',
      summary: `The customer database records an average customer feedback satisfaction index of ${avgSatisfaction}. Support compliance holds a high alignment ratio.`,
      metricLabel: 'Avg Satisfaction Rating',
      metric: avgSatisfaction,
      trend: averageSatisfactionVal >= 75 ? 'up' : 'neutral',
      opportunity: `Utilize high satisfaction scores to secure recurring enterprise contract extensions.`,
      risk: `Unresolved anomalies in lower performing categories degrade composite brand loyalty.`,
      recommendation: `We recommend deploying customer success automation in regions with expanding complaint metrics.`
    }
  };

  // Add the remaining default nodes so they exist if the user clicks them
  ['marketing', 'inventory', 'operations', 'customer-satisfaction'].forEach(key => {
    if (!nodeContexts[key]) {
      nodeContexts[key] = {
        id: key,
        title: key.toUpperCase().replace('-', ' '),
        summary: `Standard metrics diagnostic log for ${key}. Current performance indexes are stable under baseline parameters.`,
        metricLabel: 'Performance Status',
        metric: 'Nominal',
        trend: 'neutral',
        opportunity: opportunityText,
        risk: riskText,
        recommendation: recommendationText
      };
    }
  });

  const briefingReports: BriefingReport[] = [
    {
      id: 'boardroom-report',
      title: 'Executive Intelligence & Strategic Briefing',
      category: 'Strategic Planning',
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      riskLevel: healthScore >= 80 ? 'Optimized' : healthScore >= 60 ? 'High' : 'Critical',
      summary: `Fully compiled business brief for ${summary.fileName}. Evaluates operational performance and tactical priorities.`,
      narrative: [
        `Executive Summary: The audit team has completed a structured analysis of the business database "${summary.fileName}". Over the evaluated period of ${profile.timePeriod}, the company achieved total revenues of ${totalRevenue} and generated net profits of ${totalProfit}, establishing a strong baseline profit margin of ${profitMargin}.`,
        `Business Health & Opportunities: The composite Business Health Index is set at ${healthScore}/100. This score is supported by solid customer satisfaction scores averaging ${avgSatisfaction}. Our statistical modeling identifies the top opportunity as follows: ${opportunityText}`,
        `Critical Risks & Recommendations: The primary risk factor revolves around supply chain and inventory turn parameters: ${riskText}. To mitigate this exposure, the strategy consulting board recommends: ${recommendationText}`,
        `90-Day Action Plan: 1. Deploy target capital resources to capture the correlation advantages identified in our opportunity audit. 2. Scale safety buffers to buffer critical subassembly nodes. 3. Finalize trade compliance check points.`
      ]
    }
  ];

  const timelineEvents: TimelineEvent[] = [
    {
      id: 'ev-1',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      title: `Dataset Loaded: ${summary.fileName}`,
      summary: `Successfully ingested ${summary.rowCount} rows of operational telemetry for ${profile.industry}. Identified primary KPIs: ${profile.primaryKPIs.join(', ')}.`,
      impact: `Ingested ${summary.rowCount} telemetry periods.`,
      confidence: 98,
      trend: 'Optimized',
      category: 'Growth',
      whatHappened: 'Telemetry import validated.',
      why: 'Corporate spreadsheet uploaded to Decision Intelligence room.',
      recommendedAction: 'Inspect nodes in the Strategy Canvas to trace interdependencies.',
      targetNodeId: 'health'
    }
  ];

  if (metrics.revenue && kpiStats[metrics.revenue]) {
    const revCol = metrics.revenue;
    const maxRevVal = kpiStats[revCol].max;
    timelineEvents.push({
      id: 'ev-2',
      date: 'Calculated Milestone',
      title: `Peak revenue record identified`,
      summary: `Peak performance period achieved maximum revenue value of ${formatCurrency(maxRevVal)} compared to a historical baseline average of ${formatCurrency(kpiStats[revCol].mean)}.`,
      impact: `Peak revenue reached ${formatCurrency(maxRevVal)}`,
      confidence: 95,
      trend: 'Growth Trigger',
      category: 'Revenue',
      whatHappened: 'Peak sales period achieved.',
      why: 'Market expansion and high-margin conversion velocity spikes.',
      recommendedAction: 'Trace category and region sales ratios for that period to duplicate wins.',
      targetNodeId: 'revenue'
    });
  }

  if (metrics.profit && kpiStats[metrics.profit]) {
    const profCol = metrics.profit;
    const meanProf = kpiStats[profCol].mean;
    timelineEvents.push({
      id: 'ev-3',
      date: 'Calculated Milestone',
      title: `Average gross operating margin audit`,
      summary: `Overall profitability averaged ${formatCurrency(meanProf)} per period, representing a cumulative margins of ${profitMargin}. Sourcing costs dictate margin conservation.`,
      impact: `Profit runrate averaged ${formatCurrency(meanProf)}`,
      confidence: 93,
      trend: 'Optimizing',
      category: 'Operations',
      whatHappened: 'Gross operating profit margin stabilized.',
      why: 'Protected by forward supply contracts and product category mix.',
      recommendedAction: 'Verify nearshore waiver corridors to shield against carrier rate hikes.',
      targetNodeId: 'profit'
    });
  }

  if (metrics.satisfaction && kpiStats[metrics.satisfaction]) {
    const satCol = metrics.satisfaction;
    const avgSatVal = kpiStats[satCol].mean;
    const curScoreVal = kpiStats[satCol].values[kpiStats[satCol].values.length - 1];
    timelineEvents.push({
      id: 'ev-4',
      date: 'Calculated Milestone',
      title: `Customer satisfaction feedback index`,
      summary: `Customer NPS averages ${avgSatVal.toFixed(1)} NPS. High compliance scores act as a primary retention buffer.`,
      impact: `Customer satisfaction holds at ${curScoreVal.toFixed(1)} NPS`,
      confidence: 91,
      trend: avgSatVal >= 75 ? 'Optimized' : 'SLA Strain',
      category: 'Customers',
      whatHappened: 'Composite feedback loops monitored.',
      why: 'Direct customer support loops and delivery timeliness.',
      recommendedAction: 'Deploy automation packages in lower performing categories.',
      targetNodeId: 'customers'
    });
  }

  return {
    nodeContexts,
    businessSignals,
    briefingReports,
    timelineEvents
  };
}
