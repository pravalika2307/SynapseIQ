import { parseCSV } from '../csvParser';

/**
 * Automated Unit Test Suite for SynapseIQ Business Intelligence & Data Engine
 */
function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Assertion Error] ${message}`);
  }
}

export function runCSVParserUnitTests() {
  const sampleSalesCSV = `Date,Region,Product,Sales,Revenue,Profit,Quantity
2026-01-01,North America,Cloud Engine,15,67500,27000,15
2026-01-02,EMEA,AI Analytics,22,70400,24640,22
2026-01-03,APAC,Cyber Shield,18,32400,14580,18
2026-01-04,LATAM,Data Mesh,30,54000,24300,30
2026-01-05,North America,Cloud Engine,25,112500,45000,25`;

  // Test 1: Header parsing
  const summary = parseCSV(sampleSalesCSV, 'test_sales.csv');
  assert(summary.fileName === 'test_sales.csv', 'Filename should match input');
  assert(summary.rowCount === 5, 'Row count should equal 5');
  assert(summary.columns.includes('Revenue'), 'Columns should contain Revenue');

  // Test 2: Industry domain detection
  assert(summary.profile.industry.toLowerCase().includes('sales'), 'Industry should be detected as Sales');

  // Test 3: Pearson correlation bounds
  const revCol = summary.detectedMetrics.revenue;
  const profitCol = summary.detectedMetrics.profit;
  if (revCol && profitCol && summary.correlations[revCol]) {
    const corr = summary.correlations[revCol][profitCol];
    assert(corr >= -1.0 && corr <= 1.0, 'Pearson correlation coefficient must be between -1.0 and 1.0');
  }

  // Test 4: Missing cell sanitization
  const dirtyCSV = `Employee_ID,Department,Salary,Experience\nEMP-1,Sales,,4\nEMP-2,Eng,120000,`;
  const dirtySummary = parseCSV(dirtyCSV, 'dirty.csv');
  assert(dirtySummary.rowCount === 2, 'Row count should equal 2');
  assert(dirtySummary.biAnalysis.missingValues.totalCount > 0, 'Should register missing values count');

  return { status: 'success', testsRun: 4 };
}
