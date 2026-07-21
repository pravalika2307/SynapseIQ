export interface BIAnalysis {
  revenueTrends: {
    direction: 'upward' | 'downward' | 'stable' | 'insufficient_data';
    slope: number;
    description: string;
  };
  growthRate: {
    percentage: number;
    description: string;
  };
  outliers: {
    count: number;
    columnsWithOutliers: string[];
    description: string;
  };
  correlations: {
    strongestPositive: { col1: string; col2: string; coefficient: number }[];
    strongestNegative: { col1: string; col2: string; coefficient: number }[];
    description: string;
  };
  topPerformingCategories: { category: string; revenue: number; profit: number }[];
  bottomPerformingCategories: { category: string; revenue: number; profit: number }[];
  seasonality: {
    detected: boolean;
    description: string;
  };
  missingValues: {
    totalCount: number;
    ratio: number;
    byColumn: Record<string, number>;
  };
  dataQuality: {
    score: number; // 0 - 100
    grade: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    description: string;
  };
  kpiSummary: {
    metric: string;
    sum: number;
    mean: number;
    min: number;
    max: number;
  }[];
}

export interface DatasetSummary {
  fileName: string;
  rowCount: number;
  columns: string[];
  data: Record<string, any>[];
  detectedMetrics: {
    date: string | null;
    region: string | null;
    category: string | null;
    revenue: string | null;
    profit: string | null;
    marketing: string | null;
    inventory: string | null;
    satisfaction: string | null;
    orders: string | null;
    returns: string | null;
  };
  profile: {
    industry: string;
    businessDomain: string;
    timePeriod: string;
    regions: string[];
    categories: string[];
    primaryKPIs: string[];
    totalRevenue: number;
    totalProfit: number;
    averageSatisfaction: number;
  };
  correlations: Record<string, Record<string, number>>;
  kpiStats: Record<string, {
    mean: number;
    sum: number;
    min: number;
    max: number;
    values: number[];
  }>;
  missingValueCount: number;
  outlierCount: number;
  biAnalysis: BIAnalysis;
}

export function parseCSV(csvText: string, fileName: string): DatasetSummary {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) {
    throw new Error('Dataset must contain at least a header row and one data row.');
  }

  // Simple CSV parser supporting quotes
  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]);
  const data: Record<string, any>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    if (values.length !== headers.length) continue;
    const row: Record<string, any> = {};
    headers.forEach((header, idx) => {
      const val = values[idx];
      // Convert to number if numeric
      if (val === '') {
        row[header] = null;
      } else if (!isNaN(Number(val))) {
        row[header] = Number(val);
      } else {
        row[header] = val;
      }
    });
    data.push(row);
  }

  // Auto-detect columns
  const findColumn = (keywords: string[]): string | null => {
    for (const header of headers) {
      const lower = header.toLowerCase();
      if (keywords.some(kw => lower.includes(kw))) {
        return header;
      }
    }
    return null;
  };

  const detectedMetrics = {
    date: findColumn(['date', 'month', 'year', 'time', 'timestamp']),
    region: findColumn(['region', 'area', 'loc', 'territory', 'zone']),
    category: findColumn(['cat', 'prod', 'segment', 'type', 'item']),
    revenue: findColumn(['revenue', 'sale', 'turnover', 'runrate', 'rev']),
    profit: findColumn(['profit', 'earn', 'margin', 'inc', 'net']),
    marketing: findColumn(['spend', 'market', 'ad', 'cac', 'promo']),
    inventory: findColumn(['inv', 'stock', 'turn', 'qty', 'wareh']),
    satisfaction: findColumn(['sat', 'nps', 'score', 'happy', 'rating', 'feedback']),
    orders: findColumn(['order', 'count', 'vol', 'qty_ordered']),
    returns: findColumn(['return', 'refund', 'reject']),
  };

  // Compute stats for numeric columns
  const numericHeaders = headers.filter(header => {
    return data.length > 0 && typeof data[0][header] === 'number';
  });

  const kpiStats: Record<string, { mean: number; sum: number; min: number; max: number; values: number[] }> = {};
  numericHeaders.forEach(header => {
    const vals = data.map(row => row[header]).filter(v => v !== null) as number[];
    if (vals.length > 0) {
      const sum = vals.reduce((a, b) => a + b, 0);
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const mean = sum / vals.length;
      kpiStats[header] = { mean, sum, min, max, values: vals };
    }
  });

  // Calculate unique values for categorical
  const getUniqueValues = (colName: string | null): string[] => {
    if (!colName) return [];
    const values = new Set<string>();
    data.forEach(row => {
      if (row[colName] !== undefined && row[colName] !== null) {
        values.add(String(row[colName]));
      }
    });
    return Array.from(values);
  };

  const regions = getUniqueValues(detectedMetrics.region);
  const categories = getUniqueValues(detectedMetrics.category);

  // Compute Pearson Correlation
  const correlations: Record<string, Record<string, number>> = {};
  numericHeaders.forEach(h1 => {
    correlations[h1] = {};
    numericHeaders.forEach(h2 => {
      if (h1 === h2) {
        correlations[h1][h2] = 1.0;
        return;
      }
      const pairs = data.map(row => [row[h1], row[h2]]).filter(([v1, v2]) => v1 !== null && v2 !== null) as [number, number][];
      if (pairs.length < 2) {
        correlations[h1][h2] = 0.0;
        return;
      }
      const mean1 = pairs.reduce((sum, p) => sum + p[0], 0) / pairs.length;
      const mean2 = pairs.reduce((sum, p) => sum + p[1], 0) / pairs.length;
      let num = 0;
      let den1 = 0;
      let den2 = 0;
      pairs.forEach(([v1, v2]) => {
        const d1 = v1 - mean1;
        const d2 = v2 - mean2;
        num += d1 * d2;
        den1 += d1 * d1;
        den2 += d2 * d2;
      });
      if (den1 === 0 || den2 === 0) {
        correlations[h1][h2] = 0.0;
      } else {
        correlations[h1][h2] = num / Math.sqrt(den1 * den2);
      }
    });
  });

  // Infer profile info
  const dateCol = detectedMetrics.date;
  let timePeriod = `${data.length} records`;
  if (dateCol && data.length > 0) {
    const dates = data.map(row => new Date(row[dateCol])).filter(d => !isNaN(d.getTime()));
    if (dates.length > 0) {
      const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
      const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
      const diffMonths = (maxDate.getFullYear() - minDate.getFullYear()) * 12 + maxDate.getMonth() - minDate.getMonth() + 1;
      timePeriod = `${diffMonths} Months (${minDate.toISOString().slice(0, 7)} to ${maxDate.toISOString().slice(0, 7)})`;
    }
  }

  // Detect industry & business domain
  let industry = 'General Business';
  let businessDomain = 'Corporate General Operations';
  
  const headerLowerList = headers.map(h => h.toLowerCase());
  const allCategoryVals = categories.map(c => c.toLowerCase());
  const headerText = headerLowerList.join(' ') + ' ' + allCategoryVals.join(' ');

  if (headerText.includes('patient') || headerText.includes('doctor') || headerText.includes('hospital') || headerText.includes('clinical') || headerText.includes('medical') || headerText.includes('diagnosis')) {
    industry = 'Healthcare & Medical';
    businessDomain = 'Healthcare Operations & Quality';
  } else if (headerText.includes('student') || headerText.includes('teacher') || headerText.includes('course') || headerText.includes('grade') || headerText.includes('score') || headerText.includes('school') || headerText.includes('learn')) {
    industry = 'Education';
    businessDomain = 'Academic Performance & Learning Operations';
  } else if (headerText.includes('employee') || headerText.includes('staff') || headerText.includes('salary') || headerText.includes('hiring') || headerText.includes('attrition') || headerText.includes('headcount') || headerText.includes('payroll')) {
    industry = 'HR & Workforce';
    businessDomain = 'Human Capital & Workforce Strategy';
  } else if (headerText.includes('inventory') || headerText.includes('stock') || headerText.includes('warehouse') || headerText.includes('carrier') || headerText.includes('shipping') || headerText.includes('delay') || headerText.includes('transit') || headerText.includes('supply')) {
    industry = 'Supply Chain & Manufacturing';
    businessDomain = 'Logistics Operations & Capacity Scheduling';
  } else if (headerText.includes('ad') || headerText.includes('marketing') || headerText.includes('campaign') || headerText.includes('cac') || headerText.includes('click') || headerText.includes('spend')) {
    industry = 'Marketing & Advertising';
    businessDomain = 'Customer Acquisition & Growth Marketing';
  } else if (headerText.includes('profit') || headerText.includes('expense') || headerText.includes('cost') || headerText.includes('ebitda') || headerText.includes('equity') || headerText.includes('tax') || headerText.includes('cash')) {
    industry = 'Financial Operations';
    businessDomain = 'Corporate Finance & Resource Allocation';
  } else if (headerText.includes('sale') || headerText.includes('revenue') || headerText.includes('deal') || headerText.includes('lead') || headerText.includes('retail') || headerText.includes('e-commerce') || headerText.includes('customer')) {
    industry = 'Sales & E-commerce';
    businessDomain = 'Revenue Enablement & Commercial Operations';
  } else if (allCategoryVals.some(c => c.includes('soft') || c.includes('saas') || c.includes('app') || c.includes('cloud'))) {
    industry = 'Technology / SaaS';
    businessDomain = 'SaaS Growth & Software Operations';
  }

  const primaryKPIs = [];
  if (detectedMetrics.revenue) primaryKPIs.push('Revenue');
  if (detectedMetrics.profit) primaryKPIs.push('Profit');
  if (detectedMetrics.satisfaction) primaryKPIs.push('Customer Satisfaction');
  if (primaryKPIs.length === 0) {
    // take top numeric
    primaryKPIs.push(...numericHeaders.slice(0, 3));
  }

  const totalRev = detectedMetrics.revenue && kpiStats[detectedMetrics.revenue] ? kpiStats[detectedMetrics.revenue].sum : 0;
  const totalProf = detectedMetrics.profit && kpiStats[detectedMetrics.profit] ? kpiStats[detectedMetrics.profit].sum : 0;
  const avgSat = detectedMetrics.satisfaction && kpiStats[detectedMetrics.satisfaction] ? kpiStats[detectedMetrics.satisfaction].mean : 0;

  // Compute missing values
  let missingValueCount = 0;
  data.forEach(row => {
    headers.forEach(h => {
      if (row[h] === null || row[h] === undefined || row[h] === '') {
        missingValueCount++;
      }
    });
  });

  // Outlier detection using Z-score >= 3
  let outlierCount = 0;
  numericHeaders.forEach(header => {
    const stats = kpiStats[header];
    if (stats && stats.values.length > 2) {
      const mean = stats.mean;
      const sqDiffSum = stats.values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);
      const stdDev = Math.sqrt(sqDiffSum / (stats.values.length - 1));
      if (stdDev > 0) {
        stats.values.forEach(val => {
          if (Math.abs(val - mean) / stdDev >= 3.0) {
            outlierCount++;
          }
        });
      }
    }
  });

  // ----------------------------------------------------
  // BUSINESS INTELLIGENCE PREPROCESSING LAYER
  // ----------------------------------------------------
  
  // 1. KPI Summary
  const kpiSummary = Object.keys(kpiStats).map(metric => ({
    metric,
    sum: kpiStats[metric].sum,
    mean: kpiStats[metric].mean,
    min: kpiStats[metric].min,
    max: kpiStats[metric].max
  }));

  // 2. Revenue Trends
  let revenueTrends: {
    direction: 'upward' | 'downward' | 'stable' | 'insufficient_data';
    slope: number;
    description: string;
  } = {
    direction: 'insufficient_data',
    slope: 0,
    description: 'No revenue metric detected to analyze trends.'
  };


  const revCol = detectedMetrics.revenue;
  if (revCol && kpiStats[revCol] && kpiStats[revCol].values.length >= 2) {
    const revVals = kpiStats[revCol].values;
    const n = revVals.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    for (let idx = 0; idx < n; idx++) {
      sumX += idx;
      sumY += revVals[idx];
      sumXY += idx * revVals[idx];
      sumXX += idx * idx;
    }
    const num = (n * sumXY) - (sumX * sumY);
    const den = (n * sumXX) - (sumX * sumX);
    const slope = den === 0 ? 0 : num / den;
    
    let direction: 'upward' | 'downward' | 'stable' = 'stable';
    const relativeSlope = slope / (kpiStats[revCol].mean || 1);
    if (relativeSlope > 0.005) {
      direction = 'upward';
    } else if (relativeSlope < -0.005) {
      direction = 'downward';
    }

    revenueTrends = {
      direction,
      slope,
      description: `Revenue exhibits a localized ${direction} trend with a calculated period slope of ${slope.toFixed(1)} units.`
    };
  }

  // 3. Growth Rate
  let growthRate = {
    percentage: 0,
    description: 'Growth rate calculation requires active revenue timelines.'
  };
  if (revCol && kpiStats[revCol] && kpiStats[revCol].values.length >= 2) {
    const revVals = kpiStats[revCol].values;
    const startVal = revVals[0];
    const endVal = revVals[revVals.length - 1];
    const percentage = startVal > 0 ? ((endVal - startVal) / startVal) * 100 : 0;
    growthRate = {
      percentage,
      description: `Net growth rate over the period registers at ${percentage.toFixed(1)}%, shifting from a starting baseline of ${startVal.toFixed(1)} to an endpoint of ${endVal.toFixed(1)}.`
    };
  }

  // 4. Outliers
  const outlierCols: string[] = [];
  numericHeaders.forEach(header => {
    const stats = kpiStats[header];
    if (stats && stats.values.length > 2) {
      const mean = stats.mean;
      const sqDiffSum = stats.values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);
      const stdDev = Math.sqrt(sqDiffSum / (stats.values.length - 1));
      if (stdDev > 0) {
        let hasOutlier = false;
        stats.values.forEach(val => {
          if (Math.abs(val - mean) / stdDev >= 3.0) {
            hasOutlier = true;
          }
        });
        if (hasOutlier) {
          outlierCols.push(header);
        }
      }
    }
  });

  const outliers = {
    count: outlierCount,
    columnsWithOutliers: outlierCols,
    description: outlierCount > 0 
      ? `A total of ${outlierCount} data points exceeded ±3σ Z-score thresholds, localized within columns: ${outlierCols.join(', ')}.`
      : 'No Z-score outlier anomalies were detected in the telemetry dataset.'
  };

  // 5. Correlation Summary
  const strongPositive: { col1: string; col2: string; coefficient: number }[] = [];
  const strongNegative: { col1: string; col2: string; coefficient: number }[] = [];
  Object.keys(correlations).forEach(col1 => {
    Object.keys(correlations[col1]).forEach(col2 => {
      if (col1 < col2) {
        const coef = correlations[col1][col2];
        if (coef > 0.4) {
          strongPositive.push({ col1, col2, coefficient: coef });
        } else if (coef < -0.4) {
          strongNegative.push({ col1, col2, coefficient: coef });
        }
      }
    });
  });
  strongPositive.sort((a, b) => b.coefficient - a.coefficient);
  strongNegative.sort((a, b) => a.coefficient - b.coefficient);

  const correlation = {
    strongestPositive: strongPositive.slice(0, 3),
    strongestNegative: strongNegative.slice(0, 3),
    description: strongPositive.length > 0
      ? `Strongest positive alignment detected between "${strongPositive[0]?.col1}" and "${strongPositive[0]?.col2}" (Pearson coefficient of ${strongPositive[0]?.coefficient.toFixed(2)}).`
      : 'No high-magnitude linear correlations detected in the telemetry.'
  };

  // 6. Category Performance Analysis
  let topPerformingCategories: { category: string; revenue: number; profit: number }[] = [];
  let bottomPerformingCategories: { category: string; revenue: number; profit: number }[] = [];
  
  const catCol = detectedMetrics.category;
  if (catCol) {
    const catGroup: Record<string, { revenue: number; profit: number }> = {};
    data.forEach(row => {
      const catVal = String(row[catCol] || 'Unassigned');
      if (!catGroup[catVal]) {
        catGroup[catVal] = { revenue: 0, profit: 0 };
      }
      if (revCol) catGroup[catVal].revenue += Number(row[revCol] || 0);
      const profCol = detectedMetrics.profit;
      if (profCol) catGroup[catVal].profit += Number(row[profCol] || 0);
    });

    const catList = Object.keys(catGroup).map(category => ({
      category,
      revenue: catGroup[category].revenue,
      profit: catGroup[category].profit
    }));

    catList.sort((a, b) => b.revenue - a.revenue);
    topPerformingCategories = catList.slice(0, 3);
    bottomPerformingCategories = catList.slice(-3).reverse();
  }

  // 7. Seasonality Analysis
  let seasonality = {
    detected: false,
    description: 'Seasonality analysis requires sequential timestamp series.'
  };
  if (dateCol && revCol && data.length >= 6) {
    const monthlySales: Record<number, number[]> = {};
    data.forEach(row => {
      const dVal = new Date(row[dateCol]);
      if (!isNaN(dVal.getTime())) {
        const month = dVal.getMonth();
        if (!monthlySales[month]) monthlySales[month] = [];
        monthlySales[month].push(Number(row[revCol] || 0));
      }
    });

    const monthMeans = Object.keys(monthlySales).map(m => {
      const vals = monthlySales[Number(m)];
      const sum = vals.reduce((a, b) => a + b, 0);
      return sum / vals.length;
    });

    if (monthMeans.length >= 3) {
      const avg = monthMeans.reduce((a, b) => a + b, 0) / monthMeans.length;
      const sqDiffs = monthMeans.map(m => Math.pow(m - avg, 2));
      const variance = sqDiffs.reduce((a, b) => a + b, 0) / monthMeans.length;
      const stdDev = Math.sqrt(variance);
      const cv = avg > 0 ? stdDev / avg : 0;
      
      const detected = cv > 0.15;
      seasonality = {
        detected,
        description: detected
          ? `Telemetry displays significant cyclical seasonality, with a ${Math.round(cv * 100)}% coefficient of variation in sales across monthly cohorts.`
          : 'Sales distribution is relatively uniform across monthly periods, suggesting low seasonality.'
      };
    }
  }

  // 8. Missing Values
  const missingByCol: Record<string, number> = {};
  headers.forEach(h => {
    missingByCol[h] = 0;
  });
  data.forEach(row => {
    headers.forEach(h => {
      if (row[h] === null || row[h] === undefined || row[h] === '') {
        missingByCol[h]++;
      }
    });
  });

  const totalCells = data.length * headers.length;
  const missingRatio = totalCells > 0 ? missingValueCount / totalCells : 0;
  const missingValues = {
    totalCount: missingValueCount,
    ratio: missingRatio,
    byColumn: missingByCol
  };

  // 9. Data Quality Score
  let qualityScore = 100;
  qualityScore -= missingRatio * 60;
  qualityScore -= Math.min(15, (outlierCount / Math.max(1, data.length)) * 40);
  
  if (!detectedMetrics.revenue) qualityScore -= 10;
  if (!detectedMetrics.profit) qualityScore -= 10;
  if (!detectedMetrics.date) qualityScore -= 5;
  qualityScore = Math.max(10, Math.min(100, Math.round(qualityScore)));

  let grade: 'Excellent' | 'Good' | 'Fair' | 'Poor' = 'Poor';
  if (qualityScore >= 90) grade = 'Excellent';
  else if (qualityScore >= 75) grade = 'Good';
  else if (qualityScore >= 50) grade = 'Fair';

  const dataQuality = {
    score: qualityScore,
    grade,
    description: `Telemetry data quality audited as ${grade} (${qualityScore}/100 score). Ingested ${data.length} records across ${headers.length} columns, with ${missingValueCount} missing entries.`
  };

  const biAnalysis: BIAnalysis = {
    revenueTrends,
    growthRate,
    outliers,
    correlations: correlation,
    topPerformingCategories,
    bottomPerformingCategories,
    seasonality,
    missingValues,
    dataQuality,
    kpiSummary
  };

  return {
    fileName,
    rowCount: data.length,
    columns: headers,
    data,
    detectedMetrics,
    profile: {
      industry,
      businessDomain,
      timePeriod,
      regions: regions.length > 0 ? regions : ['Global'],
      categories: categories.length > 0 ? categories : ['All Categories'],
      primaryKPIs,
      totalRevenue: totalRev,
      totalProfit: totalProf,
      averageSatisfaction: avgSat,
    },
    correlations,
    kpiStats,
    missingValueCount,
    outlierCount,
    biAnalysis
  };
}
