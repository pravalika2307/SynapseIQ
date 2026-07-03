import React, { useState, useEffect } from 'react';
import { Sliders, Zap, CheckCircle, RefreshCw, Sparkles } from 'lucide-react';
import { SectionHeader, Card, CountUp } from '../components/ui';
import { useDemoStore } from '../features/demoStore';
import { useAppStore } from '../features/store';
import { simulateGeminiScenario } from '../features/geminiService';
import { parseCSV } from '../features/csvParser';

export const Forecast: React.FC = () => {
  const activeNodeId = useAppStore((state) => state.activeNodeId);
  const geminiApiKey = useAppStore((state) => state.geminiApiKey);
  const parsedData = useAppStore((state) => state.parsedData);

  // Simulation Controls Local State (with Current Strategy baselines)
  const [marketing, setMarketing] = useState(45);
  const [price, setPrice] = useState(10);
  const [inventory, setInventory] = useState(60);
  const [hiring, setHiring] = useState(15);
  const [retention, setRetention] = useState(88);
  const [costs, setCosts] = useState(5);

  const [aiVerdict, setAiVerdict] = useState<string>('');
  const [aiTradeoffs, setAiTradeoffs] = useState<string>('');
  const [aiRisks, setAiRisks] = useState<string>('');
  const [aiRoi, setAiRoi] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [recalcHighlight, setRecalcHighlight] = useState(false);

  const hasSlidersMoved = marketing !== 45 || price !== 10 || inventory !== 60 || hiring !== 15 || retention !== 88 || costs !== 5;
  const scenarioStatus = hasSlidersMoved 
    ? "Reducing operating costs improves profitability, but may reduce customer satisfaction over time."
    : "If current momentum continues, quarterly revenue is projected to increase by approximately 11%.";

  const isDemoActive = useDemoStore((state) => state.isDemoActive);
  const currentStep = useDemoStore((state) => state.currentStep);

  useEffect(() => {
    if (hasSlidersMoved) {
      setRecalcHighlight(true);
      const timer = setTimeout(() => {
        setRecalcHighlight(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [marketing, price, inventory, hiring, retention, costs]);

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

  // Debounced live scenario simulation with Gemini
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!geminiApiKey || geminiApiKey.trim() === '') {
        return; // Fallback to heuristic
      }
      setIsSimulating(true);
      try {
        let summary = parsedData;
        if (!summary) {
          const { DEFAULT_CSV } = await import('../features/defaultDataset');
          summary = parseCSV(DEFAULT_CSV, 'synapse_intel_matrix_q2.csv');
        }
        const res = await simulateGeminiScenario(geminiApiKey, {
          marketing,
          price,
          inventory,
          hiring,
          retention,
          costs
        }, summary);
        setAiVerdict(res.verdict);
        setAiTradeoffs(res.tradeoffs);
        setAiRisks(res.risks);
        setAiRoi(res.roi);
      } catch (err) {
        console.error('Gemini scenario simulation failed:', err);
      } finally {
        setIsSimulating(false);
      }
    }, 650);

    return () => clearTimeout(handler);
  }, [marketing, price, inventory, hiring, retention, costs, geminiApiKey, parsedData]);

  // Dynamic Math Equations for Real-Time Predictions
  const simulatedRevenue = 42.8 * (1 + price / 100) * (1 + (marketing - 45) * 0.0035) * (1 + (retention - 88) * 0.006);
  const simulatedProfit = 44.0 + (price * 0.35) - (costs * 0.25) - ((marketing - 45) * 0.04);
  const simulatedCustGrowth = 12.0 + (marketing - 45) * 0.12 - (price * 0.15) + (hiring - 15) * 0.04;
  const simulatedMarketShare = 18.5 + (marketing - 45) * 0.06 + (retention - 88) * 0.08 - (price * 0.04);
  const simulatedHealth = Math.min(100, Math.max(0, Math.round(84 + (marketing - 45) * 0.08 + (retention - 88) * 0.45 - (costs * 0.15) - (inventory < 30 ? (30 - inventory) * 0.6 : 0))));
  const simulatedConfidence = Math.max(80, Math.min(99, 94 - Math.abs(price - 10) * 0.15 - Math.abs(costs - 5) * 0.1));
  
  const simulatedRisk = (inventory < 30 || costs > 12) ? 'Critical' : (inventory < 45 || costs > 8) ? 'High' : 'Low';

  // Dynamic McKinsey-style Narrative Explanation (Heuristic Fallback)
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
          <div className={`space-y-2 p-3 rounded-xl transition-all duration-500 ${(isDemoActive && currentStep === 7) || activeNodeId === 'marketing' || activeNodeId === 'revenue' ? 'ring-2 ring-[#83D18B] bg-[#83D18B]/5 shadow-[0_0_15px_rgba(131,209,139,0.15)]' : ''}`}>
            <div className="flex justify-between items-center text-12 font-medium">
              <span className="text-white/60">Marketing Budget Allocation</span>
              <span className="text-[#83D18B] font-mono font-bold">{marketing}%</span>
            </div>
            <input 
              type="range" 
              min="15" 
              max="90" 
              value={marketing}
              onChange={(e) => setMarketing(Number(e.target.value))}
              className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#83D18B]"
            />
          </div>

          {/* Price slider */}
          <div className="space-y-2 p-3 rounded-xl transition-all duration-500">
            <div className="flex justify-between items-center text-12 font-medium">
              <span className="text-white/60">Product Pricing Adjustment</span>
              <span className="text-[#83D18B] font-mono font-bold">{price > 0 ? `+${price}` : price}%</span>
            </div>
            <input 
              type="range" 
              min="-10" 
              max="30" 
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#83D18B]"
            />
          </div>

          {/* Inventory slider */}
          <div className={`space-y-2 p-3 rounded-xl transition-all duration-500 ${activeNodeId === 'inventory' ? 'ring-2 ring-[#83D18B] bg-[#83D18B]/5 shadow-[0_0_15px_rgba(131,209,139,0.15)]' : ''}`}>
            <div className="flex justify-between items-center text-12 font-medium">
              <span className="text-white/60">Inventory Safety stock Target</span>
              <span className="text-[#83D18B] font-mono font-bold">{inventory} days</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="90" 
              value={inventory}
              onChange={(e) => setInventory(Number(e.target.value))}
              className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#83D18B]"
            />
          </div>

          {/* Hiring slider */}
          <div className="space-y-2 p-3 rounded-xl transition-all duration-500">
            <div className="flex justify-between items-center text-12 font-medium">
              <span className="text-white/60">Headcount Hiring Growth</span>
              <span className="text-[#83D18B] font-mono font-bold">+{hiring}%</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="45" 
              value={hiring}
              onChange={(e) => setHiring(Number(e.target.value))}
              className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#83D18B]"
            />
          </div>

          {/* Retention slider */}
          <div className={`space-y-2 p-3 rounded-xl transition-all duration-500 ${activeNodeId === 'customers' || activeNodeId === 'customer-satisfaction' ? 'ring-2 ring-[#83D18B] bg-[#83D18B]/5 shadow-[0_0_15px_rgba(131,209,139,0.15)]' : ''}`}>
            <div className="flex justify-between items-center text-12 font-medium">
              <span className="text-white/60">Customer Retention Target</span>
              <span className="text-[#83D18B] font-mono font-bold">{retention}% NRR</span>
            </div>
            <input 
              type="range" 
              min="75" 
              max="98" 
              value={retention}
              onChange={(e) => setRetention(Number(e.target.value))}
              className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#83D18B]"
            />
          </div>

          {/* Operating costs slider */}
          <div className={`space-y-2 p-3 rounded-xl transition-all duration-500 ${activeNodeId === 'operations' || activeNodeId === 'profit' ? 'ring-2 ring-[#83D18B] bg-[#83D18B]/5 shadow-[0_0_15px_rgba(131,209,139,0.15)]' : ''}`}>
            <div className="flex justify-between items-center text-12 font-medium">
              <span className="text-white/60">Operational Overhead Costs</span>
              <span className="text-[#83D18B] font-mono font-bold">{costs > 0 ? `+${costs}` : costs}%</span>
            </div>
            <input 
              type="range" 
              min="-10" 
              max="20" 
              value={costs}
              onChange={(e) => setCosts(Number(e.target.value))}
              className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#83D18B]"
            />
          </div>

        </div>

        {/* Right Column: Outcomes & Projections */}
        <div className={`flex flex-col gap-6 transition-all duration-700 ${recalcHighlight ? 'ring-1 ring-[#83D18B]/30 shadow-[0_0_30px_rgba(131,209,139,0.06)] bg-[#83D18B]/[0.005] rounded-3xl p-2' : ''}`}>
          
          {/* Live Outcome Metrics grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-5 bg-[#151B23] border border-white/5 rounded-2xl flex flex-col gap-1 shadow-lg">
              <span className="text-[9.5px] uppercase font-bold text-white/30 tracking-wider">Projected Revenue</span>
              <span className="text-22 font-bold text-white tracking-tight">
                <CountUp value={simulatedRevenue} decimals={1} prefix="$" suffix="M" />
              </span>
            </div>

            <div className="p-5 bg-[#151B23] border border-white/5 rounded-2xl flex flex-col gap-1 shadow-lg">
              <span className="text-[9.5px] uppercase font-bold text-white/30 tracking-wider">Gross Profit Margin</span>
              <span className="text-22 font-bold text-white tracking-tight">
                <CountUp value={simulatedProfit} decimals={1} suffix="%" />
              </span>
            </div>

            <div className="p-5 bg-[#151B23] border border-white/5 rounded-2xl flex flex-col gap-1 shadow-lg">
              <span className="text-[9.5px] uppercase font-bold text-white/30 tracking-wider">Customer Growth</span>
              <span className="text-22 font-bold text-white tracking-tight">
                <CountUp value={simulatedCustGrowth} decimals={1} prefix="+" suffix="%" />
              </span>
            </div>

            <div className="p-5 bg-[#151B23] border border-white/5 rounded-2xl flex flex-col gap-1 shadow-lg">
              <span className="text-[9.5px] uppercase font-bold text-white/30 tracking-wider">Market Share</span>
              <span className="text-22 font-bold text-white tracking-tight">
                <CountUp value={simulatedMarketShare} decimals={1} suffix="%" />
              </span>
            </div>

            <div className="p-5 bg-[#151B23] border border-white/5 rounded-2xl flex flex-col gap-1 shadow-lg">
              <span className="text-[9.5px] uppercase font-bold text-white/30 tracking-wider">Business Health</span>
              <span className="text-22 font-bold text-[#83D18B] tracking-tight">
                <CountUp value={simulatedHealth} />
                <span className="text-12 text-white/30 uppercase tracking-widest font-mono font-normal">/100</span>
              </span>
            </div>

            <div className="p-5 bg-[#151B23] border border-white/5 rounded-2xl flex flex-col gap-1 shadow-lg">
              <span className="text-[9.5px] uppercase font-bold text-white/30 tracking-wider">Operational Risk</span>
              <span className={`text-22 font-bold tracking-tight ${simulatedRisk === 'Critical' ? 'text-critical animate-pulse' : 'text-white'}`}>{simulatedRisk}</span>
            </div>
          </div>

          {/* Real-time AI explanation banner */}
          <div className="bg-[#151B23] border border-white/5 rounded-2xl p-6 shadow-lg flex flex-col gap-4 relative overflow-hidden">
            {isSimulating && (
              <div className="absolute inset-0 bg-[#090B10]/60 flex items-center justify-center gap-2 backdrop-blur-[1px] z-10">
                <RefreshCw size={14} className="animate-spin text-[#83D18B]" />
                <span className="text-11 font-mono text-white/50">Running predictive modeling...</span>
              </div>
            )}
            
            <div className="flex items-center justify-between text-[#83D18B] select-none border-b border-white/5 pb-2.5">
              <div className="flex items-center gap-1.5">
                <Zap size={14} className="animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider font-sans">Gemini Predictive Advisor</span>
              </div>
              <span className="text-[9.5px] font-mono text-white/30">
                Confidence: {simulatedConfidence}%
              </span>
            </div>

            <div className="p-3.5 bg-accent-sage-dim/20 border border-accent-sage-border/25 rounded-xl text-12 font-serif text-[#83D18B] leading-normal flex items-start gap-2.5">
              <Sparkles size={14} className="shrink-0 mt-0.5" />
              <span>{scenarioStatus}</span>
            </div>

            <div className="space-y-3 font-serif">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-sans font-bold tracking-widest text-[#83D18B]/70 animate-pulse">Verdict</span>
                <p className="text-13.5 text-white/80 leading-relaxed">
                  {aiVerdict || getAIExplanation()}
                </p>
              </div>

              {(aiTradeoffs || aiRisks || aiRoi) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/5 pt-3 mt-1.5">
                  <div className="space-y-0.5">
                    <span className="text-[8.5px] uppercase font-sans font-bold tracking-widest text-white/40">Trade-offs</span>
                    <p className="text-11.5 text-white/50 leading-normal">{aiTradeoffs}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[8.5px] uppercase font-sans font-bold tracking-widest text-white/40">Risks</span>
                    <p className="text-11.5 text-white/50 leading-normal">{aiRisks}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[8.5px] uppercase font-sans font-bold tracking-widest text-white/40">Expected ROI</span>
                    <p className="text-11.5 text-[#83D18B] leading-normal">{aiRoi}</p>
                  </div>
                </div>
              )}
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
                    <span className="text-white/30">Projected Revenue:</span> <strong className="text-[#83D18B] font-sans">$42.8M</strong>
                  </div>
                </div>
              </Card>

              {/* Simulated Strategy Card */}
              <Card elevation="flat" hoverEffect={false} className="p-5 bg-[#83D18B]/5 border-[#83D18B]/25 shadow-lg shadow-[#83D18B]/5">
                <span className="text-[9.5px] font-bold text-[#83D18B] uppercase tracking-wider block mb-3 select-none">Simulated Strategy</span>
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
                    <span className="text-white/30">Projected Health:</span> <strong className="text-[#83D18B] font-sans">{simulatedHealth}/100</strong>
                  </div>
                  <div className="flex justify-between font-serif">
                    <span className="text-white/30">Projected Revenue:</span> <strong className="text-[#83D18B] font-sans">${simulatedRevenue.toFixed(1)}M</strong>
                  </div>
                </div>
              </Card>

            </div>
          </div>

          {/* Featured recommended card (Decision Moment) */}
          <div className={`bg-[#83D18B]/5 border rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl select-none transition-all duration-500 ${hasSlidersMoved ? 'ring-2 ring-[#83D18B]/60 shadow-[0_0_25px_rgba(131,209,139,0.2)] bg-[#83D18B]/10 border-transparent scale-[1.015]' : 'border-[#83D18B]/20 shadow-[#83D18B]/5'}`}>
            <div className="space-y-1.5 max-w-md">
              <div className="flex items-center gap-1.5 text-[#83D18B]">
                <CheckCircle size={14} className="animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider font-sans">
                  {hasSlidersMoved ? "⚡ Decision Moment: Recommended Executive Action" : "✨ Recommended Scenario"}
                </span>
              </div>
              <h4 className="text-14.5 font-bold text-white/95 tracking-tight font-serif text-left">
                {hasSlidersMoved ? "Execute Supply Chain Nearshoring Pivot" : "Target 55% Marketing & Jalisco Logistics nearshore corridor"}
              </h4>
              <p className="text-12 text-white/45 font-serif leading-relaxed text-left">
                {hasSlidersMoved 
                  ? "Shifting raw wafer custom channels to Laredo overland corridors reduces transit risk by 45%, protecting net margin profiles." 
                  : "Shifting semiconductor logistics overland lowers transpacific delays from 32 days down to 14, safeguarding profit margins."
                }
              </p>
            </div>
            
            <div className="flex flex-col gap-1 text-right sm:border-l border-white/10 sm:pl-6 shrink-0 font-mono text-11">
              <div className="text-white/45">Expected Revenue Increase: <strong className="text-[#83D18B]">+8.3%</strong></div>
              <div className="text-white/45">Implementation Complexity: <strong className="text-white/85">Medium</strong></div>
              <div className="text-white/45">Confidence: <strong className="text-[#83D18B]">94%</strong></div>
              <div className="text-white/45">Est. ROI: <strong className="text-white/85">12.4x</strong></div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
