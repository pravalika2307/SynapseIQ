import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Sliders, ToggleLeft, ToggleRight, Info, Zap } from 'lucide-react';
import { useAppStore } from '../features/store';

export const Forecast: React.FC = () => {
  const selectedScenario = useAppStore((state) => state.selectedScenario);
  const setSelectedScenario = useAppStore((state) => state.setSelectedScenario);
  const scenarioInputs = useAppStore((state) => state.scenarioInputs);
  const updateScenarioInputs = useAppStore((state) => state.updateScenarioInputs);

  // Generate chart data based on scenario inputs
  const getSimulatedData = () => {
    const baseline = [
      { month: 'Jun', spend: 120, baseline: 120 },
      { month: 'Jul', spend: 125, baseline: 125 },
      { month: 'Aug', spend: 135, baseline: 135 },
      { month: 'Sep', spend: 142, baseline: 142 },
      { month: 'Oct', spend: 155, baseline: 155 }
    ];

    // Compute optimized path based on inputs
    const capitalImpact = (100 - scenarioInputs.capitalRatio) * 0.15;
    const safetyStockImpact = scenarioInputs.safetyStock * 0.25;
    const pivotFactor = scenarioInputs.mexicanPivot ? 22 : 0;

    return baseline.map((item, idx) => {
      // Projections change based on factors
      const savings = (idx + 1) * (capitalImpact + safetyStockImpact + pivotFactor) * 0.12;
      return {
        ...item,
        spend: Math.max(80, Math.round(item.spend - savings))
      };
    });
  };

  const chartData = getSimulatedData();

  return (
    <div className="max-w-[1200px] mx-auto px-10 py-12 flex flex-col gap-10">
      {/* Title */}
      <div className="flex flex-col gap-3 pt-8">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-sage opacity-75" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent-sage">Risk Simulator</span>
        </div>
        <h1 className="text-32 font-semibold tracking-tight text-white/95">Procurement Pivot Forecast</h1>
        <p className="text-14 text-white/50 -mt-2">
          Simulate logistics re-routing options and safety margins to predict cash lockups and procurement cost projections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-8">
        {/* Left: Modeler Controls */}
        <div className="bg-card border border-white/5 rounded-2xl p-6 flex flex-col gap-6 shadow-lg h-fit">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <Sliders size={15} className="text-white/40" />
            <h2 className="text-13.5 font-bold uppercase tracking-wider text-white/60">Simulator Controls</h2>
          </div>

          {/* Scenario toggle */}
          <div className="space-y-2">
            <span className="text-[9.5px] font-bold text-white/30 uppercase tracking-wider">Strategic Pathway</span>
            <div className="flex bg-white/[0.02] border border-white/5 p-1 rounded-lg">
              <button
                onClick={() => setSelectedScenario('baseline')}
                className={`
                  flex-1 py-1.5 rounded text-11.5 font-semibold transition-all
                  ${selectedScenario === 'baseline' ? 'bg-white/[0.04] text-white border border-white/5 shadow-sm' : 'text-white/40'}
                `}
              >
                Conservative Baseline
              </button>
              <button
                onClick={() => setSelectedScenario('optimized')}
                className={`
                  flex-1 py-1.5 rounded text-11.5 font-semibold transition-all
                  ${selectedScenario === 'optimized' ? 'bg-white/[0.04] text-white border border-white/5 shadow-sm' : 'text-white/40'}
                `}
              >
                Optimized Jalisco Path
              </button>
            </div>
          </div>

          {/* Capital allocation slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-12 font-medium">
              <span className="text-white/60">Capital Buffer Ratio</span>
              <span className="text-accent-sage font-mono font-bold">{scenarioInputs.capitalRatio}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="90" 
              value={scenarioInputs.capitalRatio}
              onChange={(e) => updateScenarioInputs({ capitalRatio: Number(e.target.value) })}
              className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-accent-sage"
            />
            <p className="text-[10.5px] text-white/30">Ratio of secondary source capital reserve.</p>
          </div>

          {/* Safety stock slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-12 font-medium">
              <span className="text-white/60">Safety Stock Target</span>
              <span className="text-accent-sage font-mono font-bold">{scenarioInputs.safetyStock} days</span>
            </div>
            <input 
              type="range" 
              min="15" 
              max="90" 
              value={scenarioInputs.safetyStock}
              onChange={(e) => updateScenarioInputs({ safetyStock: Number(e.target.value) })}
              className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-accent-sage"
            />
            <p className="text-[10.5px] text-white/30">Target inventory stockpile level at regional warehouses.</p>
          </div>

          {/* Mexico pivot check */}
          <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/5 rounded-xl mt-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-12.5 font-medium text-white/80">Guadalajara Reroute</span>
              <span className="text-[10.5px] text-white/30">Activate Mexican sub-assembly lines.</span>
            </div>
            <button 
              onClick={() => updateScenarioInputs({ mexicanPivot: !scenarioInputs.mexicanPivot })}
              className="text-accent-sage transition-all hover:scale-105 active:scale-95"
            >
              {scenarioInputs.mexicanPivot ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-white/20" />}
            </button>
          </div>
        </div>

        {/* Right: Charts and Projections narrative */}
        <div className="flex flex-col gap-6">
          {/* Main Chart Card */}
          <div className="bg-card border border-white/5 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[9.5px] font-bold text-white/30 uppercase tracking-wider">Projected Sourcing Cost ($M)</span>
              <div className="flex items-center gap-1 text-[10px] text-white/30 bg-white/[0.02] border border-white/5 rounded-md px-2 py-0.5 font-mono">
                <Info size={11} /> Simulated Model
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.15)" fontSize={11} className="font-mono" />
                  <YAxis stroke="rgba(255,255,255,0.15)" fontSize={11} className="font-mono" />
                  <Tooltip 
                    contentStyle={{ background: '#151B23', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area 
                    name="Optimized Pathway" 
                    type="monotone" 
                    dataKey="spend" 
                    stroke="#79D38A" 
                    strokeWidth={2}
                    fill="rgba(121, 211, 138, 0.06)" 
                  />
                  <Area 
                    name="Baseline Path" 
                    type="monotone" 
                    dataKey="baseline" 
                    stroke="rgba(255,255,255,0.15)" 
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                    fill="none" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Projections Narrative */}
          <div className="bg-white/[0.01] border border-white/5 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-accent-sage">
              <Zap size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">AI Procurement Verdict</span>
            </div>
            <p className="text-13.5 text-white/60 leading-relaxed font-serif">
              {scenarioInputs.mexicanPivot 
                ? 'Activating the Guadalajara corridor re-routing pipeline immediately bypasses port queue constraints, saving an estimated $22M in Q3 procurement delays. Gross margin holding improves to 44.0%, compensating for wafer rate spikes.'
                : `Under the current settings (safety stock at ${scenarioInputs.safetyStock} days, secondary capital reserve at ${scenarioInputs.capitalRatio}%), wait lists at Vietnam docks could lock up to $4.2M in supply operations. Rerouting is highly recommended.`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
