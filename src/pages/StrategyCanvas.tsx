import React, { useState } from 'react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Compass, Info, TrendingUp } from 'lucide-react';

export const StrategyCanvas: React.FC = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // WAFER/Supplier Resilience Rating matrix
  const supplierData = [
    { name: 'Hanoi Precision Parts', debtRatio: 2.8, creditRating: 32, value: 50, status: 'Critical Risk' },
    { name: 'Hue Semiconductors', debtRatio: 2.1, creditRating: 48, value: 65, status: 'Solvency Warning' },
    { name: 'MexAllied Fabricators', debtRatio: 1.1, creditRating: 88, value: 120, status: 'Healthy' },
    { name: 'Munich Circuitry', debtRatio: 0.4, creditRating: 94, value: 180, status: 'Optimal' },
    { name: 'Arizona Foundry', debtRatio: 1.4, creditRating: 78, value: 140, status: 'Stable' }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-10 py-12 flex flex-col gap-10">
      {/* Title */}
      <div className="flex flex-col gap-3 pt-8">
        <div className="flex items-center gap-2">
          <Compass className="text-accent-sage animate-spin-slow" size={16} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent-sage">Strategy Mapping</span>
        </div>
        <h1 className="text-32 font-semibold tracking-tight text-white/95">Supplier Resilience Index Matrix</h1>
        <p className="text-14 text-white/50 -mt-2">
          Multidimensional supplier credit profiling. Maps debt leverage ratios against organizational solvency scores to trace supply constraints.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
        {/* Scatter Chart Widget */}
        <div className="bg-card border border-white/5 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[9.5px] font-bold text-white/30 uppercase tracking-wider">Leverage vs Solvency Rating</span>
            <span className="text-[10px] text-white/30 flex items-center gap-1 bg-white/[0.02] border border-white/5 rounded px-2 py-0.5 font-mono">
              <Info size={11} /> Real-time telemetry
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                <XAxis 
                  type="number" 
                  dataKey="debtRatio" 
                  name="Debt Ratio" 
                  unit="x" 
                  stroke="rgba(255,255,255,0.15)"
                  fontSize={10}
                  domain={[0, 4]}
                />
                <YAxis 
                  type="number" 
                  dataKey="creditRating" 
                  name="Solvency Rating" 
                  unit=" pts" 
                  stroke="rgba(255,255,255,0.15)"
                  fontSize={10}
                  domain={[0, 100]}
                />
                <ZAxis type="number" dataKey="value" range={[60, 400]} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ background: '#18212C', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                />
                <ReferenceLine x={2.0} stroke="#E76F51" strokeDasharray="3 3" />
                <ReferenceLine y={50} stroke="#E76F51" strokeDasharray="3 3" />
                <Scatter 
                  name="Foundries" 
                  data={supplierData} 
                  fill="#79D38A"
                  onClick={(node: any) => setHoveredNode(node.name)}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[10px] text-white/30 border-t border-white/5 pt-4">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent-sage" /> Healthy Foundry</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-critical" /> Critical Risk Warning Threshold</span>
          </div>
        </div>

        {/* Narrative description */}
        <div className="bg-card border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-accent-sage">
              <TrendingUp size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Financial Solvency Report</span>
            </div>
            
            <h3 className="text-16 font-semibold text-white/95 leading-snug">Foundry Resilience Audit</h3>
            
            <p className="text-13.5 text-white/50 leading-relaxed font-serif">
              Our wafer manufacturing supply chain is heavily dependent on microcontrollers manufactured by Hanoi Precision Parts. With a debt ratio of 2.8x and a credit score of 32, this node operates above safe thresholds.
            </p>
            <p className="text-13.5 text-white/50 leading-relaxed font-serif">
              Introduction of Arizona wafer supply corridors acts as an active risk shield, stabilizing the composite solvency score.
            </p>
          </div>

          {hoveredNode && (
            <div className="mt-6 p-4 bg-white/[0.01] border border-white/5 rounded-xl text-12 text-white/70">
              <span className="text-[9px] uppercase font-bold text-white/30 tracking-wider">Selected Node Profile</span>
              <div className="font-semibold text-accent-sage text-13 mt-0.5">{hoveredNode}</div>
              <div className="text-white/40 text-11.5 mt-1 font-serif">
                Flags log dynamic warnings on debt ratio checks. Buffer allocations recommended.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
