import React, { useState } from 'react';
import { Card, Button, Badge } from './ui';
import { Database, Play } from 'lucide-react';
import { parseCSV, type DatasetSummary } from '../features/csvParser';
import { useAppStore } from '../features/store';

const SAMPLE_CSV_PRESETS: Record<string, { domain: string; csvText: string }> = {
  'sales.csv': {
    domain: 'Sales & Revenue',
    csvText: `Date,Region,Product,Sales,Revenue,Profit,Quantity
2026-01-01,North America,Cloud Engine,15,67500,27000,15
2026-01-02,EMEA,AI Analytics,22,70400,24640,22
2026-01-03,APAC,Cyber Shield,18,32400,14580,18
2026-01-04,LATAM,Data Mesh,30,54000,24300,30
2026-01-05,North America,Cloud Engine,25,112500,45000,25`
  },
  'hr.csv': {
    domain: 'Human Resources',
    csvText: `Employee_ID,Department,Salary,Experience,Performance,Attrition,Training_Hours
EMP-1001,Engineering,145000,8,92,0,45
EMP-1002,Sales,85000,4,78,0,30
EMP-1003,Engineering,165000,11,95,0,60
EMP-1004,Customer Support,58000,2,68,1,15
EMP-1005,Product,125000,6,88,0,40`
  },
  'finance.csv': {
    domain: 'Corporate Finance',
    csvText: `Month,Revenue,Expenses,Net_Profit,Cash_Flow,Operating_Cost
2026-01,1500000,950000,550000,506000,630000
2026-02,1522500,960000,562500,517500,639450
2026-03,1545337,971000,574337,528390,649041
2026-04,1568517,982000,586517,539595,658777
2026-05,1592045,993000,599045,551121,668659`
  },
  'healthcare.csv': {
    domain: 'Healthcare Operations',
    csvText: `Hospital,Department,Patients,Recovery_Rate,Readmission_Rate,Treatment_Cost
St. Jude Memorial,Cardiology,140,94.5,4.2,850000
Apex Health West,Oncology,95,88.2,7.8,1120000
Metro General,Neurology,180,91.0,5.5,940000
Trinity Medical,Pediatrics,210,97.8,2.1,620000`
  },
  'manufacturing.csv': {
    domain: 'Manufacturing & Yield',
    csvText: `Factory,Production,Downtime,Defect_Rate,Maintenance_Cost,Output
Plant Detroit #1,3500,12,1.2,28000,3458
Stuttgart Hub,4200,8,0.8,22000,4166
Yokohama Foundry,2900,24,2.4,45000,2830
Monterrey Assembly,3800,16,1.8,32000,3731`
  },
  'logistics.csv': {
    domain: 'Freight & Logistics',
    csvText: `Shipment_ID,Route,Delivery_Time,Fuel_Cost,Delayed,Distance
SHP-2001,Corridor Alpha (US-MX),28.4,2450,0,1200
SHP-2002,Corridor Beta (EU-UK),18.2,1850,0,850
SHP-2003,Pacific Route (US-JP),74.5,8900,1,3400
SHP-2004,Trans-Asia Air,42.1,5400,0,2100`
  },
  'outliers.csv (Edge Case)': {
    domain: 'Statistical Stress Test',
    csvText: `Factory,Production,Downtime,Defect_Rate,Maintenance_Cost,Output
Plant Detroit #1,2500,10,1.5,15000,2462
Stuttgart Hub,2600,12,1.4,16000,2563
Yokohama Foundry,150000,450,48.5,980000,77250
Monterrey Assembly,2400,11,1.6,1450,2361`
  }
};

export const DeveloperDatasetTester: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>('sales.csv');
  const [testResult, setTestResult] = useState<{
    summary: DatasetSummary | null;
    status: 'idle' | 'success' | 'error';
    logs: string[];
  }>({ summary: null, status: 'idle', logs: [] });

  const triggerAnalysis = useAppStore((state) => state.triggerAnalysis);

  const handleRunValidation = async (presetKey: string) => {
    const preset = SAMPLE_CSV_PRESETS[presetKey];
    if (!preset) return;

    const logs: string[] = [];
    logs.push(`[1/4] Ingesting preset: ${presetKey} (${preset.domain})`);

    try {
      const summary = parseCSV(preset.csvText, presetKey);
      logs.push(`[2/4] CSV Parsed successfully. Rows: ${summary.rowCount}, Cols: ${summary.columns.length}`);
      logs.push(`[3/4] Industry Detected: ${summary.profile.industry.toUpperCase()}`);
      logs.push(`[4/4] Correlation matrix keys computed: ${Object.keys(summary.correlations).length} metrics`);

      setTestResult({
        summary,
        status: 'success',
        logs
      });

      // Hydrate into global store
      await triggerAnalysis(preset.csvText, presetKey);
    } catch (err: any) {
      logs.push(`[ERROR] Parsing failed: ${err.message}`);
      setTestResult({
        summary: null,
        status: 'error',
        logs
      });
    }
  };

  return (
    <Card elevation="flat" className="p-[#1b222d] space-y-6 border border-[#83D18B]/20 bg-[#0D1117]">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#83D18B]/10 flex items-center justify-center text-[#83D18B]">
            <Database size={18} />
          </div>
          <div>
            <h3 className="text-14 font-bold text-white/90">Developer Validation Utility</h3>
            <p className="text-11 text-white/40">Internal CSV Dataset Preset Tester & BI Engine Validator</p>
          </div>
        </div>
        <Badge variant="sage">Dev Tools Only</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="text-12 font-medium text-white/60 block">Select Sample Dataset Preset:</label>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
            {Object.keys(SAMPLE_CSV_PRESETS).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedPreset(key)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border text-12 font-sans transition-all text-left ${
                  selectedPreset === key 
                    ? 'border-[#83D18B] bg-[#83D18B]/10 text-white font-semibold' 
                    : 'border-white/5 bg-white/[0.02] text-white/60 hover:border-white/10 hover:text-white'
                }`}
              >
                <span>{key}</span>
                <span className="text-10 text-white/40 font-mono">{SAMPLE_CSV_PRESETS[key].domain}</span>
              </button>
            ))}
          </div>

          <Button 
            variant="primary" 
            size="md" 
            className="w-full flex items-center justify-center gap-2"
            onClick={() => handleRunValidation(selectedPreset)}
          >
            <Play size={14} /> Validate & Hydrate Preset
          </Button>
        </div>

        <div className="bg-black/40 rounded-xl p-4 border border-white/5 flex flex-col justify-between font-mono text-11 space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
              <span className="text-white/40 uppercase tracking-wider text-10 font-bold">Diagnostic Execution Log</span>
              {testResult.status === 'success' && <Badge variant="sage">PASS</Badge>}
              {testResult.status === 'error' && <Badge variant="critical">FAIL</Badge>}
            </div>

            {testResult.logs.length === 0 ? (
              <p className="text-white/30 italic text-12 pt-4">Click "Validate & Hydrate Preset" to run automated BI engine diagnostics.</p>
            ) : (
              <div className="space-y-1.5 text-white/70">
                {testResult.logs.map((log, i) => (
                  <p key={i} className={log.includes('ERROR') ? 'text-red-400' : 'text-[#83D18B]'}>{log}</p>
                ))}
              </div>
            )}
          </div>

          {testResult.summary && (
            <div className="pt-3 border-t border-white/5 text-10 text-white/50 space-y-1">
              <p><strong className="text-white/80">Active Industry:</strong> {testResult.summary.profile.industry}</p>
              <p><strong className="text-white/80">Primary KPI:</strong> {testResult.summary.profile.primaryKPIs?.[0] || 'N/A'}</p>
              <p><strong className="text-white/80">Outliers Count:</strong> {testResult.summary.biAnalysis.outliers.count}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
