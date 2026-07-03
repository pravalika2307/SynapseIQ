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

  // Detect industry
  let industry = 'General Business';
  const allCategoryVals = categories.map(c => c.toLowerCase());
  if (allCategoryVals.some(c => c.includes('soft') || c.includes('saas') || c.includes('app') || c.includes('cloud'))) {
    industry = 'Technology / SaaS';
  } else if (allCategoryVals.some(c => c.includes('cloth') || c.includes('shoe') || c.includes('furn') || c.includes('electr') || c.includes('retail') || c.includes('toy'))) {
    industry = 'Retail & E-commerce';
  } else if (allCategoryVals.some(c => c.includes('part') || c.includes('metal') || c.includes('chem') || c.includes('machin'))) {
    industry = 'Manufacturing';
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

  return {
    fileName,
    rowCount: data.length,
    columns: headers,
    data,
    detectedMetrics,
    profile: {
      industry,
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
  };
}
