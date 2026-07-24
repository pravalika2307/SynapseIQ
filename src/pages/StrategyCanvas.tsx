import React, { useState, useEffect } from 'react';
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
import { DecisionGraph } from '../components/DecisionGraph';
import { useDemoStore } from '../features/demoStore';
import { useAppStore } from '../features/store';

export const StrategyCanvas: React.FC = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [pulseHighlight, setPulseHighlight] = useState(false);
  const parsedData = useAppStore((state) => state.parsedData);
  
  const isDemoActive = useDemoStore((state) => state.isDemoActive);
  const currentStep = useDemoStore((state) => state.currentStep);

  useEffect(() => {
    if (parsedData) {
      setPulseHighlight(true);
      const timer = setTimeout(() => {
        setPulseHighlight(false);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [parsedData]);

  // WAFER/Supplier Resilience Rating matrix
  const supplierData = [
    { name: 'Hanoi Precision Parts', debtRatio: 2.8, creditRating: 32, value: 50, status: 'Critical Risk' },
    { name: 'Hue Semiconductors', debtRatio: 2.1, creditRating: 48, value: 65, status: 'Solvency Warning' },
    { name: 'MexAllied Fabricators', debtRatio: 1.1, creditRating: 88, value: 120, status: 'Healthy' },
    { name: 'Munich Circuitry', debtRatio: 0.4, creditRating: 94, value: 180, status: 'Optimal' },
    { name: 'Arizona Foundry', debtRatio: 1.4, creditRating: 78, value: 140, status: 'Stable' }
  ];

  return (
    <div className={`max-w-[1280px] mx-auto px-8 md:px-12 py-10 flex flex-col gap-8 md:gap-10 font-sans transition-all duration-1000 ${pulseHighlight ? 'ring-1 ring-[#83D18B]/35 shadow-[0_0_40px_rgba(131,209,139,0.08)] bg-[#83D18B]/[0.01] rounded-[2rem]' : ''}`}>
      {/* Title */}
      <div className="flex flex-col gap-2 pt-4">
        <div className="flex items-center gap-2">
          <Compass className="text-accent-sage animate-spin-slow" size={16} />
          <span className="text-[9.5px] font-bold uppercase tracking-widest text-accent-sage font-mono">Strategy Mapping</span>
        </div>
        <h1 className="text-28 md:text-34 font-bold tracking-tight text-white/95 font-sans">Business Strategy Canvas</h1>
        <p className="text-12.5 text-white/45 max-w-2xl leading-relaxed font-sans">
          Interactive business relationship network. Maps interdependencies between core organizational metrics.
        </p>
      </div>

      {/* Decision Graph Centerpiece */}
      <div className={`transition-all duration-500 rounded-2xl p-2 ${isDemoActive && currentStep === 4 ? 'ring-2 ring-[#83D18B] shadow-[0_0_25px_rgba(131,209,139,0.18)] bg-[#83D18B]/5' : ''}`}>
        <DecisionGraph />
      </div>

      <div className="border-t border-white/5 pt-10 flex flex-col gap-3">
        <h2 className="text-20 font-semibold tracking-tight text-white/90">Supplier Credit Resilience Profiling</h2>
        <p className="text-13 text-white/40 -mt-1">
          Maps supplier debt leverage levels against localized solvency indexes to isolate supply constraints.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
        {/* Scatter Chart Widget */}
        <div className="bg-[#151B23] border border-white/5 rounded-2xl p-6 shadow-xl">
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
                  fill="#83D18B"
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
