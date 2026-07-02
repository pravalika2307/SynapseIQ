import React, { useState, useEffect } from 'react';
import { Sliders, Zap, CheckCircle } from 'lucide-react';
import { SectionHeader, Card } from '../components/ui';
import { useDemoStore } from '../features/demoStore';
import { useAppStore } from '../features/store';

export const Forecast: React.FC = () => {
  const activeNodeId = useAppStore((state) => state.activeNodeId);

  // Simulation Controls Local State (with Current Strategy baselines)
  const [marketing, setMarketing] = useState(45);
  const [price, setPrice] = useState(10);
  const [inventory, setInventory] = useState(60);
  const [hiring, setHiring] = useState(15);
  const [retention, setRetention] = useState(88);
  const [costs, setCosts] = useState(5);

  const isDemoActive = useDemoStore((state) => state.isDemoActive);
  const currentStep = useDemoStore((state) => state.currentStep);

  // Automatically simulate a 15% increase in marketing budget (from 45% baseline to 60%) in Step 7
  useEffect(() => {
    if (isDemoActive && currentStep === 7) {
      setMarketing(45);
      const timer = setInterval(() => {
        setMarketing((prev) => {
          if (prev >= 60) {
            clearInterval(timer);
            return 60;
          }
          return prev + 1;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [isDemoActive, currentStep]);

  // Dynamic Math Equations for Real-Time Predictions
  const simulatedRevenue = 42.8 * (1 + price / 100) * (1 + (marketing - 45) * 0.0035) * (1 + (retention - 88) * 0.006);
  const simulatedProfit = 44.0 + (price * 0.35) - (costs * 0.25) - ((marketing - 45) * 0.04);
  const simulatedCustGrowth = 12.0 + (marketing - 45) * 0.12 - (price * 0.15) + (hiring - 15) * 0.04;
  const simulatedMarketShare = 18.5 + (marketing - 45) * 0.06 + (retention - 88) * 0.08 - (price * 0.04);
  const simulatedHealth = Math.min(100, Math.max(0, Math.round(84 + (marketing - 45) * 0.08 + (retention - 88) * 0.45 - (costs * 0.15) - (inventory < 30 ? (30 - inventory) * 0.6 : 0))));
  const simulatedConfidence = Math.max(80, Math.min(99, 94 - Math.abs(price - 10) * 0.15 - Math.abs(costs - 5) * 0.1));
  
  const simulatedRisk = (inventory < 30 || costs > 12) ? 'Critical' : (inventory < 45 || costs > 8) ? 'High' : 'Low';

  // Dynamic McKinsey-style Narrative Explanation
  const getAIExplanation = () => {
    let text = '';
    if (marketing > 55) {
      text += `Increasing marketing allocations to ${marketing}% is projected to accelerate logo acquisition targets. However, customer conversion CAC is expected to elevate, squeezing near-term margin. `;
    } else if (marketing < 35) {
      text += `Reducing marketing buffers down to ${marketing}% minimizes overhead capital but limits target pipeline conversion velocity in European expansion lanes. `;
    }

    if (inventory < 35) {
      text += `Scaling inventory targets down to ${inventory}% leaves Fab-14 sub-assembly lines exposed to Vietnamese shipping terminal delays. Sourcing nearshoring is recommended immediately. `;
    } else {
      text += `Maintaining buffer inventories above 45 days ensures continuous plant utilization even during transpacific logistics congestion. `;
    }

    if (price > 18) {
      text += `A price increase of ${price}% is expected to support overall margins but limits mid-market NRR velocity to ${Math.round(retention * 0.95)}%. `;
    }

    if (text === '') {
      text = `Simulated parameters are within optimal operating bounds. Telemetry registers stable gross profit margins at ${simulatedProfit.toFixed(1)}% with an executive health rating of ${simulatedHealth}/100.`;
    }

    return text;
  };

  return (
    <div className="max-w-[1200px] mx-auto px-10 py-12 flex flex-col gap-10 text-[#F5F7FA]">
      
      {/* Title Header */}
      <div className="flex flex-col gap-3 pt-8 select-none">
        <SectionHeader 
          label="Advisory Simulator"
          title="AI Scenario Simulation Workspace"
          description="Test strategic choices in real time. Adjust critical business variables below to simulate forecasted cash, profit, and risk parameters."
        />
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.5fr] gap-8">
        
        {/* Left Column: Simulation controls */}
        <div className="bg-[#151B23] border border-white/5 rounded-2xl p-6 flex flex-col gap-6 shadow-xl h-fit select-none">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <Sliders size={15} className="text-white/40" />
            <h2 className="text-13.5 font-bold uppercase tracking-wider text-white/60 font-sans">Simulation Inputs</h2>
          </div>

          {/* Marketing slider */}
          <div className={`space-y-2 p-3 rounded-xl transition-all duration-500 ${(isDemoActive && currentStep === 7) || activeNodeId === 'marketing' || activeNodeId === 'revenue' ? 'ring-2 ring-[#79D38A] bg-[#79D38A]/5 shadow-[0_0_15px_rgba(121,211,138,0.15)]' : ''}`}>
            <div className="flex justify-between items-center text-12 font-medium">
              <span className="text-white/60">Marketing Budget Allocation</span>
              <span className="text-[#79D38A] font-mono font-bold">{marketing}%</span>
            </div>
            <input 
              type="range" 
              min="15" 
              max="90" 
              value={marketing}
              onChange={(e) => setMarketing(Number(e.target.value))}
              className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#79D38A]"
            />
          </div>

          {/* Price slider */}
          <div className="space-y-2 p-3 rounded-xl transition-all duration-500">
            <div className="flex justify-between items-center text-12 font-medium">
              <span className="text-white/60">Product Pricing Adjustment</span>
              <span className="text-[#79D38A] font-mono font-bold">{price > 0 ? `+${price}` : price}%</span>
            </div>
            <input 
              type="range" 
              min="-10" 
              max="30" 
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#79D38A]"
            />
          </div>

          {/* Inventory slider */}
          <div className={`space-y-2 p-3 rounded-xl transition-all duration-500 ${activeNodeId === 'inventory' ? 'ring-2 ring-[#79D38A] bg-[#79D38A]/5 shadow-[0_0_15px_rgba(121,211,138,0.15)]' : ''}`}>
            <div className="flex justify-between items-center text-12 font-medium">
              <span className="text-white/60">Inventory Safety stock Target</span>
              <span className="text-[#79D38A] font-mono font-bold">{inventory} days</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="90" 
              value={inventory}
              onChange={(e) => setInventory(Number(e.target.value))}
              className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#79D38A]"
            />
          </div>

          {/* Hiring slider */}
          <div className="space-y-2 p-3 rounded-xl transition-all duration-500">
            <div className="flex justify-between items-center text-12 font-medium">
              <span className="text-white/60">Headcount Hiring Growth</span>
              <span className="text-[#79D38A] font-mono font-bold">+{hiring}%</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="45" 
              value={hiring}
              onChange={(e) => setHiring(Number(e.target.value))}
              className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#79D38A]"
            />
          </div>

          {/* Retention slider */}
          <div className={`space-y-2 p-3 rounded-xl transition-all duration-500 ${activeNodeId === 'customers' || activeNodeId === 'customer-satisfaction' ? 'ring-2 ring-[#79D38A] bg-[#79D38A]/5 shadow-[0_0_15px_rgba(121,211,138,0.15)]' : ''}`}>
            <div className="flex justify-between items-center text-12 font-medium">
              <span className="text-white/60">Customer Retention Target</span>
              <span className="text-[#79D38A] font-mono font-bold">{retention}% NRR</span>
            </div>
            <input 
              type="range" 
              min="75" 
              max="98" 
              value={retention}
              onChange={(e) => setRetention(Number(e.target.value))}
              className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#79D38A]"
            />
          </div>

          {/* Operating costs slider */}
          <div className={`space-y-2 p-3 rounded-xl transition-all duration-500 ${activeNodeId === 'operations' || activeNodeId === 'profit' ? 'ring-2 ring-[#79D38A] bg-[#79D38A]/5 shadow-[0_0_15px_rgba(121,211,138,0.15)]' : ''}`}>
            <div className="flex justify-between items-center text-12 font-medium">
              <span className="text-white/60">Operational Overhead Costs</span>
              <span className="text-[#79D38A] font-mono font-bold">{costs > 0 ? `+${costs}` : costs}%</span>
            </div>
            <input 
              type="range" 
              min="-10" 
              max="20" 
              value={costs}
              onChange={(e) => setCosts(Number(e.target.value))}
              className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#79D38A]"
            />
          </div>

        </div>

        {/* Right Column: Outcomes & Projections */}
        <div className="flex flex-col gap-6">
          
          {/* Live Outcome Metrics grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-5 bg-[#151B23] border border-white/5 rounded-2xl flex flex-col gap-1 shadow-lg">
              <span className="text-[9.5px] uppercase font-bold text-white/30 tracking-wider">Projected Revenue</span>
              <span className="text-22 font-bold text-white tracking-tight">${simulatedRevenue.toFixed(1)}M</span>
            </div>

            <div className="p-5 bg-[#151B23] border border-white/5 rounded-2xl flex flex-col gap-1 shadow-lg">
              <span className="text-[9.5px] uppercase font-bold text-white/30 tracking-wider">Gross Profit Margin</span>
              <span className="text-22 font-bold text-white tracking-tight">{simulatedProfit.toFixed(1)}%</span>
            </div>

            <div className="p-5 bg-[#151B23] border border-white/5 rounded-2xl flex flex-col gap-1 shadow-lg">
              <span className="text-[9.5px] uppercase font-bold text-white/30 tracking-wider">Customer Growth</span>
              <span className="text-22 font-bold text-white tracking-tight">+{simulatedCustGrowth.toFixed(1)}%</span>
            </div>

            <div className="p-5 bg-[#151B23] border border-white/5 rounded-2xl flex flex-col gap-1 shadow-lg">
              <span className="text-[9.5px] uppercase font-bold text-white/30 tracking-wider">Market Share</span>
              <span className="text-22 font-bold text-white tracking-tight">{simulatedMarketShare.toFixed(1)}%</span>
            </div>

            <div className="p-5 bg-[#151B23] border border-white/5 rounded-2xl flex flex-col gap-1 shadow-lg">
              <span className="text-[9.5px] uppercase font-bold text-white/30 tracking-wider">Business Health</span>
              <span className="text-22 font-bold text-[#79D38A] tracking-tight">{simulatedHealth}/100</span>
            </div>

            <div className="p-5 bg-[#151B23] border border-white/5 rounded-2xl flex flex-col gap-1 shadow-lg">
              <span className="text-[9.5px] uppercase font-bold text-white/30 tracking-wider">Operational Risk</span>
              <span className={`text-22 font-bold tracking-tight ${simulatedRisk === 'Critical' ? 'text-critical animate-pulse' : 'text-white'}`}>{simulatedRisk}</span>
            </div>
          </div>

          {/* Real-time AI explanation banner */}
          <div className="bg-[#151B23] border border-white/5 rounded-2xl p-6 shadow-lg flex flex-col gap-3">
            <div className="flex items-center gap-1.5 text-[#79D38A] select-none">
              <Zap size={14} className="animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider font-sans">AI Scenario Verdict</span>
            </div>
            <p className="text-14 text-white/60 leading-relaxed font-serif">
              {getAIExplanation()}
            </p>
            <div className="text-[10px] text-white/30 border-t border-white/5 pt-3 mt-1 select-none font-mono">
              Confidence Index: {simulatedConfidence}% · Real-time simulation logic verified.
            </div>
          </div>

          {/* Strategy Comparison Mode */}
          <div className="space-y-4">
            <h3 className="text-14 font-semibold text-white/95 select-none font-sans">Strategic Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Current Strategy Card */}
              <Card elevation="flat" hoverEffect={false} className="p-5 bg-[#151B23]/40 border-white/5">
                <span className="text-[9.5px] font-bold text-white/30 uppercase tracking-wider block mb-3 select-none">Current Strategy</span>
                <div className="space-y-2 text-13">
                  <div className="flex justify-between font-mono">
                    <span className="text-white/40">Marketing:</span> <span className="text-white/70">45%</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-white/40">Pricing Adjustment:</span> <span className="text-white/70">+10%</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-white/40">Inventory:</span> <span className="text-white/70">60d</span>
                  </div>
                  <div className="flex justify-between font-serif border-t border-white/5 pt-2 mt-1">
                    <span className="text-white/30">Projected Health:</span> <strong className="text-white/80 font-sans">84/100</strong>
                  </div>
                  <div className="flex justify-between font-serif">
                    <span className="text-white/30">Projected Revenue:</span> <strong className="text-[#79D38A] font-sans">$42.8M</strong>
                  </div>
                </div>
              </Card>

              {/* Simulated Strategy Card */}
              <Card elevation="flat" hoverEffect={false} className="p-5 bg-[#79D38A]/5 border-[#79D38A]/25 shadow-lg shadow-[#79D38A]/5">
                <span className="text-[9.5px] font-bold text-[#79D38A] uppercase tracking-wider block mb-3 select-none">Simulated Strategy</span>
                <div className="space-y-2 text-13">
                  <div className="flex justify-between font-mono">
                    <span className="text-white/40">Marketing:</span> <span className="text-white/80">{marketing}%</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-white/40">Pricing Adjustment:</span> <span className="text-white/80">{price > 0 ? `+${price}` : price}%</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-white/40">Inventory:</span> <span className="text-white/80">{inventory}d</span>
                  </div>
                  <div className="flex justify-between font-serif border-t border-white/5 pt-2 mt-1">
                    <span className="text-white/30">Projected Health:</span> <strong className="text-[#79D38A] font-sans">{simulatedHealth}/100</strong>
                  </div>
                  <div className="flex justify-between font-serif">
                    <span className="text-white/30">Projected Revenue:</span> <strong className="text-[#79D38A] font-sans">${simulatedRevenue.toFixed(1)}M</strong>
                  </div>
                </div>
              </Card>

            </div>
          </div>

          {/* Featured recommended card */}
          <div className={`bg-[#79D38A]/5 border rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl select-none transition-all duration-500 ${isDemoActive && currentStep === 7 ? 'ring-2 ring-[#79D38A] shadow-[0_0_25px_rgba(121,211,138,0.18)] scale-[1.01] bg-[#79D38A]/10 border-transparent' : 'border-[#79D38A]/20 shadow-[#79D38A]/5'}`}>
            <div className="space-y-1 max-w-md">
              <div className="flex items-center gap-1 text-[#79D38A]">
                <CheckCircle size={14} className="animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider font-sans">✨ Recommended Scenario</span>
              </div>
              <h4 className="text-14 font-semibold text-white/95 tracking-tight font-serif">
                Target 55% Marketing & Jalisco Logistics nearshore corridor
              </h4>
              <p className="text-12 text-white/40 font-serif leading-relaxed">
                Shifting semiconductor logistics overland lowers transpacific delays from 32 days down to 14, safeguarding profit margins.
              </p>
            </div>
            
            <div className="flex flex-col gap-1 text-right sm:border-l border-white/10 sm:pl-6 shrink-0 font-mono text-11">
              <div className="text-white/45">Expected ROI: <strong className="text-[#79D38A]">18.2%</strong></div>
              <div className="text-white/45">Growth: <strong className="text-white/85">+16.4%</strong></div>
              <div className="text-white/45">Risk: <strong className="text-white/85">Low</strong></div>
              <div className="text-white/45">Timeframe: <strong className="text-white/85">45 Days</strong></div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
