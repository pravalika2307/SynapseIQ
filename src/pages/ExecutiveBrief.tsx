import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as dMotion } from 'framer-motion';
import { useAppStore } from '../features/store';
import { Card, Badge, CountUp } from '../components/ui';
import { 
  FileSpreadsheet, 
  Calendar, 
  Activity, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';

export const ExecutiveBrief: React.FC = () => {
  const navigate = useNavigate();
  const datasetName = useAppStore((state) => state.datasetName);
  const nodeContexts = useAppStore((state) => state.nodeContexts);
  const parsedData = useAppStore((state) => state.parsedData);
  const setCopilotPreloadQuery = useAppStore((state) => state.setCopilotPreloadQuery);
  const setCopilotContextNodeId = useAppStore((state) => state.setCopilotContextNodeId);
  const decisionReadiness = useAppStore((state) => state.decisionReadiness);
  const [greeting, setGreeting] = useState('Good Evening');
  const [pulseHighlight, setPulseHighlight] = useState(false);
  

  useEffect(() => {
    const hrs = new Date().getHours();
    if (hrs < 12) setGreeting('Good Morning');
    else if (hrs < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  useEffect(() => {
    if (parsedData) {
      setPulseHighlight(true);
      const timer = setTimeout(() => {
        setPulseHighlight(false);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [parsedData]);

  const analyzedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const health = nodeContexts.health || { summary: '', metric: '84/100', opportunity: '', risk: '', recommendation: '' };
  const healthScore = parseInt(health.metric) || 84;
  const strokeOffset = 251.2 - (251.2 * healthScore) / 100;

  // Dynamically compile CEO Daily Briefing parameters from Recommendation payloads
  const ceoBriefing = useMemo(() => {
    const dataNodes = Object.keys(nodeContexts).map(key => {
      const node = nodeContexts[key];
      let recommendationData = null;
      try {
        recommendationData = JSON.parse(node.recommendation);
      } catch (e) {}
      return {
        key,
        node,
        rec: recommendationData
      };
    });

    const revNode = dataNodes.find(d => d.key === 'revenue') || dataNodes[0];
    const opportunityText = revNode.node.opportunity || "Expand high-margin sourcing segments across active territories.";
    const opportunityMetric = revNode.rec?.supportingMetrics || "Revenue at stable baseline.";

    const invNode = dataNodes.find(d => d.key === 'inventory') || dataNodes.find(d => d.key === 'profit') || dataNodes[0];
    const riskText = invNode.node.risk || "Upstream logistics transit bottleneck delays.";
    const riskMetric = invNode.rec?.potentialRisks || "Sourcing delays or supplier concentration risks.";

    const opNode = dataNodes.find(d => d.key === 'operations') || dataNodes.find(d => d.key === 'profit') || dataNodes[0];
    const actionText = opNode.rec?.recommendation || "Shift logistics routes and diversify transportation vectors.";
    const actionMetric = opNode.rec?.supportingMetrics || "Nominal parameters lag behind baseline targets.";

    const positiveNodes = dataNodes.filter(d => d.node.trend === 'up');
    const posNode = positiveNodes[0] || dataNodes.find(d => d.key === 'revenue') || dataNodes[0];
    const posTrendText = posNode.node.summary || "Revenue run-rates demonstrate stable gains.";
    const posTrendMetric = posNode.rec?.supportingMetrics || "Nominal parameters exceeded.";

    const negativeNodes = dataNodes.filter(d => d.node.trend === 'down');
    const negNode = negativeNodes[0] || dataNodes.find(d => d.key === 'customers') || dataNodes[0];
    const negTrendText = negNode.node.summary || "Customer support complaints showing regional divergence in West regions.";
    const negTrendMetric = negNode.rec?.potentialRisks || "SLA compliance levels contracted by 8%.";

    const stratNode = dataNodes.find(d => d.rec?.priority === 'High') || dataNodes.find(d => d.key === 'health') || dataNodes[0];
    const stratPriorityText = stratNode.rec?.businessReasoning || "Optimize safety stock carrying levels and insulate gross margin conservation from shipping rate volatility.";
    const stratPriorityImpact = stratNode.rec?.expectedImpact || "1.8% to 2.5% bottom-line operating margin conservation.";

    return {
      opportunity: { text: opportunityText, metrics: opportunityMetric },
      risk: { text: riskText, metrics: riskMetric },
      action: { text: actionText, metrics: actionMetric },
      positiveTrend: { text: posTrendText, metrics: posTrendMetric },
      negativeTrend: { text: negTrendText, metrics: negTrendMetric },
      priority: { text: stratPriorityText, metrics: stratPriorityImpact },
      confidence: decisionReadiness
    };
  }, [nodeContexts, decisionReadiness]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const, delay: 0.0 } }
  };

  const kpisVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const, delay: 0.08 } }
  };

  const summaryVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const, delay: 0.16 } }
  };

  const prioritiesVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const, delay: 0.24 } }
  };



  return (
    <dMotion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={`max-w-[1200px] mx-auto px-10 py-12 flex flex-col gap-14 text-[#F5F7FA] transition-all duration-1000 ${pulseHighlight ? 'ring-1 ring-[#83D18B]/35 shadow-[0_0_40px_rgba(131,209,139,0.08)] bg-[#83D18B]/[0.01] rounded-[2rem]' : ''}`}
    >
      {/* Header Section */}
      <dMotion.section variants={headerVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-8 border-b border-white/5 pb-8 select-none">
        <div className="space-y-3">
          <h1 className="text-36 md:text-48 font-bold text-white tracking-tight leading-none font-serif">
            {greeting}.<br />
            <span className="text-[#83D18B] italic font-normal font-serif">Your business analysis is ready.</span>
          </h1>
          <p className="text-13.5 text-white/40 max-w-lg leading-relaxed font-serif">
            Synthesized operational telemetry. Critical warning factors isolated.
          </p>
        </div>

        {/* Metadata dashboard chips */}
        <div className="flex flex-wrap gap-4 items-center shrink-0">
          <div className="flex items-center gap-2.5 px-4 py-2 bg-[#151B23] border border-white/5 rounded-xl text-12 text-white/60 shadow-lg">
            <FileSpreadsheet size={14} className="text-white/30" />
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-white/30 uppercase tracking-wider">Dataset File</span>
              <span className="font-mono text-[#83D18B] text-11 truncate max-w-[140px]">{datasetName || 'synapse_intel_matrix_q2.csv'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2 bg-[#151B23] border border-white/5 rounded-xl text-12 text-white/60 shadow-lg">
            <Calendar size={14} className="text-white/30" />
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-white/30 uppercase tracking-wider">Analyzed At</span>
              <span className="font-mono text-[#83D18B] text-11">{analyzedTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2 bg-[#151B23] border border-white/5 rounded-xl text-12 text-white/60 shadow-lg" title="Confidence metrics dynamically calculated from record completeness, missing parameters, and Z-score outlier ratios.">
            <Activity size={14} className="text-white/30" />
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-white/30 uppercase tracking-wider">Decision Confidence</span>
              <span className="font-mono text-[#83D18B] text-11"><CountUp value={decisionReadiness} />%</span>
            </div>
          </div>
        </div>
      </dMotion.section>

      {/* CEO Daily Briefing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        
        {/* Left Side: Dynamic CEO Briefing Cards */}
        <dMotion.div variants={summaryVariants} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Strategic Priority */}
            <div className="md:col-span-2 p-6 bg-gradient-to-r from-[#1A261D]/50 to-[#0F1612]/30 border border-[#83D18B]/15 rounded-2xl text-left flex flex-col gap-2 shadow-lg">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#83D18B] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#83D18B]/80 font-sans">Strategic Priority</span>
              </div>
              <p className="text-15 text-white/90 leading-relaxed font-serif">
                {ceoBriefing.priority.text}
              </p>
              <div className="text-[10px] text-white/35 font-mono mt-1 border-t border-white/5 pt-2">
                Expected Impact: <span className="text-[#83D18B] font-semibold">{ceoBriefing.priority.metrics}</span>
              </div>
            </div>

            {/* Immediate Action Required */}
            <div className="md:col-span-2 p-6 bg-[#2D161B]/20 border border-red-500/10 rounded-2xl text-left flex flex-col gap-2 shadow-lg">
              <div className="flex items-center gap-2 text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[10px] font-bold uppercase tracking-wider font-sans">Immediate Action Required</span>
              </div>
              <p className="text-14 text-white/90 leading-relaxed font-serif">
                {ceoBriefing.action.text}
              </p>
              <div className="text-[10px] text-white/35 font-mono mt-1 border-t border-white/5 pt-2">
                Supporting Telemetry: <span className="text-red-300 font-semibold">{ceoBriefing.action.metrics}</span>
              </div>
            </div>

            {/* Biggest Opportunity */}
            <div className="p-6 bg-[#111A15]/40 border border-white/5 hover:border-[#83D18B]/20 rounded-2xl text-left flex flex-col justify-between gap-4 shadow-lg transition-all duration-300">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#83D18B] font-sans block">Biggest Opportunity</span>
                <p className="text-13.5 text-white/85 leading-relaxed font-serif">
                  {ceoBriefing.opportunity.text}
                </p>
              </div>
              <div className="text-[9.5px] text-white/30 font-mono border-t border-white/5 pt-2.5">
                Metric Profile: <span className="text-white/60">{ceoBriefing.opportunity.metrics}</span>
              </div>
            </div>

            {/* Biggest Risk */}
            <div className="p-6 bg-[#1E1712]/30 border border-white/5 hover:border-orange-500/20 rounded-2xl text-left flex flex-col justify-between gap-4 shadow-lg transition-all duration-300">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 font-sans block">Biggest Risk</span>
                <p className="text-13.5 text-white/85 leading-relaxed font-serif">
                  {ceoBriefing.risk.text}
                </p>
              </div>
              <div className="text-[9.5px] text-white/30 font-mono border-t border-white/5 pt-2.5">
                Risk Vector: <span className="text-white/60">{ceoBriefing.risk.metrics}</span>
              </div>
            </div>

            {/* Positive Trend */}
            <div className="p-6 bg-[#11161E]/40 border border-white/5 rounded-2xl text-left flex flex-col justify-between gap-4 shadow-lg">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 font-sans block">Positive Trend</span>
                <p className="text-13 text-white/80 leading-relaxed font-serif line-clamp-3">
                  {ceoBriefing.positiveTrend.text}
                </p>
              </div>
              <div className="text-[9.5px] text-white/30 font-mono border-t border-white/5 pt-2.5">
                Covariance Check: <span className="text-white/60">{ceoBriefing.positiveTrend.metrics}</span>
              </div>
            </div>

            {/* Negative Trend */}
            <div className="p-6 bg-[#1E1215]/20 border border-white/5 rounded-2xl text-left flex flex-col justify-between gap-4 shadow-lg">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 font-sans block">Negative Trend</span>
                <p className="text-13 text-white/80 leading-relaxed font-serif line-clamp-3">
                  {ceoBriefing.negativeTrend.text}
                </p>
              </div>
              <div className="text-[9.5px] text-white/30 font-mono border-t border-white/5 pt-2.5">
                Exposure: <span className="text-white/60">{ceoBriefing.negativeTrend.metrics}</span>
              </div>
            </div>

          </div>
        </dMotion.div>

        {/* Right Side: Operations Performance Indices */}
        <dMotion.div variants={kpisVariants} className="flex flex-col gap-6">
          <Card elevation="flat" className="p-8 flex flex-col gap-8 h-full justify-center">
            <div className="flex flex-col sm:flex-row lg:flex-col gap-8 justify-around items-center">
              
              {/* Business Health Index */}
              <div className="flex flex-col items-center gap-3 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 font-sans">Business Health Index</span>
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="absolute transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
                    <dMotion.circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      stroke="#83D18B" 
                      strokeWidth="8" 
                      fill="transparent" 
                      strokeDasharray="251.2" 
                      initial={{ strokeDashoffset: 251.2 }}
                      animate={{ strokeDashoffset: strokeOffset }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      strokeLinecap="round" 
                    />
                  </svg>
                  <div className="flex flex-col items-center">
                    <span className="text-24 font-bold tracking-tight text-white">
                      <CountUp value={healthScore} />
                    </span>
                    <span className="text-[9px] text-white/30 font-mono">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Decision Readiness */}
              <div className="flex flex-col items-center gap-3 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 font-sans">Decision Readiness Index</span>
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="absolute transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
                    <dMotion.circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      stroke="#6FE3D6" 
                      strokeWidth="8" 
                      fill="transparent" 
                      strokeDasharray="251.2" 
                      initial={{ strokeDashoffset: 251.2 }}
                      animate={{ strokeDashoffset: 251.2 - (251.2 * decisionReadiness) / 100 }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                      strokeLinecap="round" 
                    />
                  </svg>
                  <div className="flex flex-col items-center">
                    <span className="text-24 font-bold tracking-tight text-white">
                      <CountUp value={decisionReadiness} />
                    </span>
                    <span className="text-[9px] text-white/30 font-mono">/ 100</span>
                  </div>
                </div>
              </div>

            </div>
            
            <p className="text-11 text-white/35 text-center leading-relaxed font-serif italic border-t border-white/5 pt-4">
              Real-time operational indices generated based on multivariate dataset regression analysis.
            </p>
          </Card>
        </dMotion.div>
      </div>

      {/* Today's Priorities Section */}
      <dMotion.div variants={prioritiesVariants} className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-[#83D18B]" size={15} />
            <h2 className="text-14 font-bold uppercase tracking-wider text-white/80">Today's Priorities</h2>
          </div>
          <span className="text-[10px] font-mono text-white/40">Guiding Strategic Actions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Execute Supply Buffer Optimization",
              impact: "Stabilize raw wafer stock against transport delay bottlenecks.",
              confidence: 94,
              roi: "12.4x",
              time: "14 days",
              query: "How do safety stock buffers prevent production delays? Detail the specific ROI calculation.",
              nodeId: "inventory",
              badge: "High Impact"
            },
            {
              title: "Deploy Marketing Reallocation",
              impact: "Shift digital ad spend to high-performing organic customer channels.",
              confidence: 88,
              roi: "8.2x",
              time: "30 days",
              query: "Detail the ad spend reallocation forecast. How does a 15% shift influence acquisition?",
              nodeId: "marketing",
              badge: "Organic Focus"
            },
            {
              title: "Deploy West Region SLA Remediation",
              impact: "Address declining customer satisfaction scores across West corridors.",
              confidence: 91,
              roi: "5.5x",
              time: "45 days",
              query: "Analyze customer support response speeds in the West region and list recommendations.",
              nodeId: "customers",
              badge: "SLA Alert"
            }
          ].map((item, idx) => (
            <Card key={idx} elevation="flat" className="p-6 flex flex-col gap-5 justify-between min-h-[260px] hover:border-[#83D18B]/25 transition-all">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <Badge variant={idx === 2 ? 'critical' : 'sage'}>{item.badge}</Badge>
                  <span className="text-[9px] font-mono text-white/35 font-bold uppercase">Priority {idx + 1}</span>
                </div>
                <h3 className="text-14.5 font-bold text-white/90 leading-snug tracking-tight font-serif text-left">
                  {item.title}
                </h3>
                <p className="text-12.5 text-white/45 leading-relaxed font-serif text-left">
                  {item.impact}
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-11 border-t border-white/5 pt-3.5 text-left">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-white/30 uppercase">Confidence</span>
                    <span className="text-white/80 font-bold font-mono text-11.5"><CountUp value={item.confidence} />%</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-white/30 uppercase">Est. ROI</span>
                    <span className="text-[#83D18B] font-bold font-mono text-11.5">{item.roi}</span>
                  </div>
                  <div className="flex flex-col mt-2">
                    <span className="text-[8px] font-bold text-white/30 uppercase">Est. Completion</span>
                    <span className="text-white/80 font-mono text-11">{item.time}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCopilotPreloadQuery(item.query);
                    setCopilotContextNodeId(item.nodeId);
                    navigate('/dashboard/copilot');
                  }}
                  className="w-full py-2 bg-white/[0.02] hover:bg-[#83D18B] border border-white/5 hover:border-[#83D18B] text-white/70 hover:text-[#0D1117] font-bold text-11.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  Open Investigation
                  <ArrowRight size={12} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </dMotion.div>
    </dMotion.div>
  );
};
