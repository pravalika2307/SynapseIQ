import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, BookOpen, Zap, Compass, Sparkles } from 'lucide-react';
import { useAppStore } from '../features/store';
import { copilotStarters } from '../features/data';
import { getCopilotResponse } from '../features/geminiService';
import { parseCSV } from '../features/csvParser';
import { Badge, AIThinkingLoader } from '../components/ui';

import { useDemoStore } from '../features/demoStore';

export const DecisionCopilot: React.FC = () => {
  const messages = useAppStore((state) => state.messages);
  const addMessage = useAppStore((state) => state.addMessage);
  const resetMessages = useAppStore((state) => state.resetMessages);
  
  // Workspace active/context node state
  const activeNodeId = useAppStore((state) => state.activeNodeId);
  const datasetName = useAppStore((state) => state.datasetName);
  const nodeContexts = useAppStore((state) => state.nodeContexts);
  const parsedData = useAppStore((state) => state.parsedData);
  const geminiApiKey = useAppStore((state) => state.geminiApiKey);
  const setGeminiApiKey = useAppStore((state) => state.setGeminiApiKey);
  const copilotPreloadQuery = useAppStore((state) => state.copilotPreloadQuery);
  const setCopilotPreloadQuery = useAppStore((state) => state.setCopilotPreloadQuery);
  const explorationHistory = useAppStore((state) => state.explorationHistory);
  const decisionReadiness = useAppStore((state) => state.decisionReadiness);

  const isDemoActive = useDemoStore((state) => state.isDemoActive);
  const currentStep = useDemoStore((state) => state.currentStep);
  const [hasTriggeredDemo, setHasTriggeredDemo] = useState(false);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<any | null>(null);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeNodeContext = nodeContexts[activeNodeId] || nodeContexts.health;

  // Real-time AI Memory check on exploration logs
  const memoryAnalysis = useMemo(() => {
    const counts: Record<string, number> = {};
    explorationHistory.forEach(topic => {
      counts[topic] = (counts[topic] || 0) + 1;
    });
    
    const sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    const topTopic = sorted[0];
    
    if (topTopic && counts[topTopic] >= 2) {
      const labelMap: Record<string, string> = {
        revenue: 'Revenue Streams',
        profit: 'Operating Profits',
        customers: 'Customer Support SLA performance',
        inventory: 'Inventory buffer ratios',
        marketing: 'Marketing Campaigns and Acquisition ROI'
      };
      
      const relatedMap: Record<string, string> = {
        revenue: 'Marketing Campaign Reallocations and ad ROI',
        profit: 'Inventory safety stock thresholds',
        customers: 'Regional Support SLA targets',
        inventory: 'Upstream raw supply transportation delays',
        marketing: 'Customer retention margins'
      };

      return {
        hasMemoryAlert: true,
        topicLabel: labelMap[topTopic] || topTopic,
        relatedLabel: relatedMap[topTopic] || 'Operations optimization'
      };
    }
    
    return { hasMemoryAlert: false, topicLabel: '', relatedLabel: '' };
  }, [explorationHistory]);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, streamingText]);

  useEffect(() => {
    if (isDemoActive && currentStep === 6 && !hasTriggeredDemo) {
      setHasTriggeredDemo(true);
      const timer = setTimeout(() => {
        handleSend('What should the company prioritize next quarter?');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isDemoActive, currentStep, hasTriggeredDemo]);

  // Listen for proactive AI Initiative query triggers
  useEffect(() => {
    if (copilotPreloadQuery) {
      const queryToTrigger = copilotPreloadQuery;
      setCopilotPreloadQuery(null);
      const timer = setTimeout(() => {
        handleSend(queryToTrigger);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [copilotPreloadQuery]);

  const streamResponse = (responseData: any) => {
    setIsTyping(false);
    setStreamingMessage(responseData);
    setStreamingText('');

    const words = responseData.summary.split(' ');
    let currentWordIdx = 0;
    let currentText = '';

    const interval = setInterval(() => {
      if (currentWordIdx < words.length) {
        currentText += (currentWordIdx === 0 ? '' : ' ') + words[currentWordIdx];
        setStreamingText(currentText);
        currentWordIdx++;
      } else {
        clearInterval(interval);
        addMessage(
          responseData.summary,
          'assistant',
          {
            summary: responseData.summary,
            evidence: responseData.evidence,
            confidence: responseData.confidence,
            recommendation: responseData.recommendation,
            relatedMetrics: responseData.relatedMetrics || [],
            nextQuestion: responseData.nextQuestion || ''
          }
        );
        setStreamingMessage(null);
        setStreamingText('');
      }
    }, 25);
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    addMessage(text, 'user');
    setInput('');
    setIsTyping(true);

    const store = useAppStore.getState();
    const apiKey = store.geminiApiKey;
    let summary = store.parsedData;
    if (!summary) {
      try {
        const { DEFAULT_CSV } = await import('../features/defaultDataset');
        summary = parseCSV(DEFAULT_CSV, 'synapse_intel_matrix_q2.csv');
      } catch (err) {
        console.error('Failed to parse default CSV:', err);
      }
    }

    if (summary) {
      try {
        const history = store.messages.map(m => ({ sender: m.sender, text: m.text }));
        const responseData = await getCopilotResponse(apiKey, text, history, summary, activeNodeContext);
        streamResponse(responseData);
      } catch (err) {
        console.error('Failed to obtain copilot response:', err);
        setIsTyping(false);
      }
    }

  };

  // Follow-up chips actions
  const followUpChips = [
    'Compare Regions',
    'Explain Trend',
    'Show Forecast',
    'View Timeline',
    'Ask Why'
  ];

  const handleFollowUpClick = (chip: string) => {
    handleSend(`${chip} on current context: "${activeNodeContext.title}"`);
  };

  return (
    <div className="h-[calc(100vh-52px)] w-full flex overflow-hidden bg-background text-[#F5F7FA]">
      
      {/* Left Pane: Strategy Consultation room */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-white/5 h-full relative bg-[#0D1117]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-white/5 select-none bg-white/[0.01]">
          <div className="flex items-center gap-2">
            <Compass size={16} className="text-[#83D18B] animate-spin-slow" />
            <h2 className="text-13.5 font-semibold text-white/95">Consultation Log</h2>
          </div>
          <button 
            onClick={resetMessages}
            className="text-[10px] uppercase font-bold text-white/30 hover:text-white/60 px-2.5 py-1 bg-white/[0.02] border border-white/5 rounded-md transition-all"
          >
            Reset Room
          </button>
        </div>

        {/* Message logs viewport */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => {
              const isUser = msg.sender === 'user';
              
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex flex-col gap-2.5 max-w-[85%] ${isUser ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                >
                  {/* Message Sender Metadata */}
                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest font-mono select-none">
                    {isUser ? 'Executive Query' : 'Strategy Advisory Team'} · {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  {/* Bubble - Claude / Perplexity typography, no speech shapes */}
                  <div className={`
                    rounded-2xl transition-all duration-300
                    ${isUser 
                      ? 'bg-[#151B23] border border-white/10 text-white px-5 py-3.5 shadow-md font-sans text-13.5 font-medium' 
                      : 'text-white/80 font-serif text-15 leading-relaxed space-y-4'
                    }
                  `}>
                    {isUser ? (
                      msg.text
                    ) : (
                      // McKinsey style structured format
                      <div className="space-y-6">
                        {/* 1. Executive Summary */}
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-[#83D18B] uppercase tracking-wider block font-sans">
                            1. Executive Summary
                          </span>
                          <p className="leading-relaxed">{msg.text}</p>
                        </div>

                        {/* 2. Supporting Evidence */}
                        {msg.references?.evidence && (
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider block font-sans">
                              2. Supporting Evidence
                            </span>
                            <div className="space-y-1.5 pl-3">
                              {msg.references.evidence.map((ev: string, eIdx: number) => (
                                <div key={eIdx} className="flex gap-2 items-start text-13.5 text-white/60">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#83D18B] mt-2 shrink-0 opacity-70" />
                                  <span>{ev}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 3 & 4. Confidence and Recommended Action */}
                        {msg.references && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl flex flex-col justify-between gap-2.5">
                              <div className="flex justify-between items-center text-[9px] uppercase font-bold text-white/40 font-sans">
                                <span>3. Audit Confidence</span>
                                <span className="text-[#83D18B] font-mono">{msg.references.confidence}%</span>
                              </div>
                              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-[#83D18B]" style={{ width: `${msg.references.confidence}%` }} />
                              </div>
                            </div>

                            <div className="p-4 bg-[#83D18B]/5 border border-[#83D18B]/10 rounded-xl space-y-1">
                              <span className="text-[9px] uppercase font-bold text-[#83D18B] font-sans flex items-center gap-1">
                                <Zap size={10} /> 4. Recommended Action
                              </span>
                              <p className="text-12 text-white/70 font-serif leading-normal">
                                "{msg.references.recommendation}"
                              </p>
                            </div>
                          </div>
                        )}

                        {/* 5. Related Metrics */}
                        {msg.references?.relatedMetrics && msg.references.relatedMetrics.length > 0 && (
                          <div className="space-y-1 pt-1">
                            <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider block font-sans">
                              5. Related Metrics
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {msg.references.relatedMetrics.map((met: string, mIdx: number) => (
                                <Badge key={mIdx} variant="neutral">{met}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Follow-up Chips Experience */}
                  {!isUser && idx === messages.length - 1 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-wrap gap-2 pt-2"
                    >
                      {followUpChips.map((chip, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => handleFollowUpClick(chip)}
                          className="px-3 py-1.5 rounded-lg bg-[#151B23] border border-white/5 text-12 text-white/50 hover:text-[#83D18B] hover:border-[#83D18B]/30 transition-all font-sans"
                        >
                          {chip}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Typewriter Streaming Bubble */}
          {streamingMessage && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-3 max-w-[85%] bg-accent-sage-dim/40 border border-accent-sage-border/30 rounded-2xl p-5 select-none self-start"
            >
              <div className="flex items-center gap-2 border-b border-[#83D18B]/20 pb-2 text-[#83D18B]">
                <Sparkles size={13} className="animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider font-sans">Streaming Strategic Insights...</span>
              </div>
              <p className="text-13 leading-relaxed font-serif text-white/90">
                {streamingText}
                <span className="inline-block text-[#83D18B] ml-1 font-bold animate-[pulse_0.75s_infinite]">▋</span>
              </p>
            </motion.div>
          )}

          {isTyping && (
            <AIThinkingLoader />
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Input & Suggested Question Starters */}
        <div className="p-6 border-t border-white/5 bg-white/[0.01] space-y-4">
          
          {/* Intelligent Suggested Questions (Shown at mount or when logs are empty) */}
          {messages.length <= 1 && !isTyping && (
            <div className="space-y-4">
              {memoryAnalysis.hasMemoryAlert && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#83D18B]/10 border border-[#83D18B]/20 rounded-xl p-3.5 flex items-center gap-3 text-left shadow-lg select-none"
                >
                  <Sparkles size={14} className="text-[#83D18B] shrink-0 animate-pulse" />
                  <p className="text-12 text-white/80 leading-normal font-serif">
                    Based on your earlier analysis of <strong>{memoryAnalysis.topicLabel}</strong>, we recommend reviewing related <strong>{memoryAnalysis.relatedLabel}</strong>.
                  </p>
                </motion.div>
              )}

              <span className="text-[9.5px] font-bold text-white/20 uppercase tracking-widest block select-none">
                Intelligent Consultation Starters
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(activeNodeId === 'revenue' ? [
                  { category: 'Revenue Growth', text: 'Why did revenue increase?', query: 'Why did revenue increase?' },
                  { category: 'Regional Split', text: 'Which region contributed most?', query: 'Which region is underperforming?' },
                  { category: 'Forecasting', text: 'Predict next quarter.', query: 'Predict next month\'s profit.' }
                ] : activeNodeId === 'profit' ? [
                  { category: 'Margin Expansion', text: 'Why did gross margin stabilize?', query: 'Why did gross margin stabilize?' },
                  { category: 'Freight Spot-rates', text: 'Audit maritime shipping costs.', query: 'What is the impact of ocean freight rates?' },
                  { category: 'Nearshoring', text: 'Simulate Mexican wafer sourcing.', query: 'How does nearshoring stabilize operations?' }
                ] : activeNodeId === 'customers' ? [
                  { category: 'NRR Retentions', text: 'Why is mid-market churn near zero?', query: 'Explain NRR optimization.' },
                  { category: 'Onboarding bottlenecks', text: 'Analyze support response latencies.', query: 'Why did customer satisfaction decline?' },
                  { category: 'CS Ratios', text: 'How do customer CS ratios compare?', query: 'Explain customer success scaling recommendations.' }
                ] : activeNodeId === 'operations' ? [
                  { category: 'Facility Capacity', text: 'Audit Laredo customs delay decrease.', query: 'Explain Laredo customs latencies.' },
                  { category: 'Supply Corridors', text: 'Analyze transpacific logistics halts.', query: 'What is our biggest business risk?' },
                  { category: 'Buffer Stocks', text: 'Simulate safety stock allocations.', query: 'How do safety stock buffers prevent production delays?' }
                ] : copilotStarters).map((starter, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(starter.query)}
                    className="p-3.5 rounded-xl border border-white/5 bg-[#151B23] hover:border-[#83D18B]/30 hover:bg-[#83D18B]/5 transition-all text-left flex flex-col gap-1 cursor-pointer"
                  >
                    <span className="text-[9px] font-bold text-[#83D18B] uppercase tracking-wider">{starter.category}</span>
                    <span className="text-12 text-white/70 w-full line-clamp-2 leading-relaxed">{starter.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up Chips */}
          {!isTyping && messages.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {(activeNodeId === 'revenue' 
                ? ['Simulate 60% Marketing Budget', 'Explain CAC efficiency increase', 'Audit EU compliance segments']
                : activeNodeId === 'profit'
                ? ['Audit nearshore wafer margins', 'Predict freight cost inflation impact']
                : activeNodeId === 'inventory' || activeNodeId === 'operations'
                ? ['Simulate Laredo shipping buffer', 'Check Hanoi solvency trends']
                : ['What is my biggest business risk?', 'Predict next month\'s profit', 'Why did revenue increase?']
              ).map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(chip)}
                  className="text-[11px] bg-[#151B23] border border-white/5 rounded-full px-3 py-1 text-white/55 hover:text-[#83D18B] hover:border-[#83D18B]/25 transition-all font-sans font-medium select-none cursor-pointer"
                >
                  {chip} &rarr;
                </button>
              ))}
            </div>
          )}

          {/* Consultation Input field */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-center gap-2.5 relative"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Consult advisory board on context: "${activeNodeContext.title}"...`}
              className="flex-1 bg-[#151B23] border border-white/5 rounded-xl py-3 px-4 text-13.5 text-white/90 placeholder-white/20 outline-none transition-all focus:border-[#83D18B]/30 focus:ring-4 focus:ring-[#83D18B]/5 font-sans"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="w-11 h-11 rounded-xl bg-[#83D18B] text-[#0D1117] flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 disabled:pointer-events-none"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>

      {/* Right Pane: AI Context Panel */}
      <div className="w-80 flex flex-col h-full bg-[#151B23] overflow-y-auto shrink-0 select-none">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-white/[0.01]">
          <BookOpen size={14} className="text-white/40" />
          <h2 className="text-12 font-bold uppercase tracking-wider text-white/40 font-sans">Context Metadata</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Selected Metric Context */}
          <div className="space-y-2">
            <span className="text-[9.5px] font-bold text-[#83D18B] uppercase tracking-widest block">Selected Metric</span>
            <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl space-y-1">
              <span className="text-14 font-semibold text-white/95">{activeNodeContext.title}</span>
              <div className="flex justify-between items-center text-11 font-mono text-white/40 mt-1">
                <span>Value:</span>
                <span className="text-white/70 font-semibold">{activeNodeContext.metric}</span>
              </div>
            </div>
          </div>

          {/* Dataset Name */}
          <div className="space-y-1.5">
            <span className="text-[9.5px] font-bold text-white/30 uppercase tracking-widest block">Dataset Name</span>
            <span className="text-12 font-mono text-white/60 truncate block bg-white/[0.01] border border-white/5 rounded-lg px-3 py-2">
              {datasetName || 'synapse_intel_matrix_q2.csv'}
            </span>
          </div>

          {/* Ingested Dataset Profile */}
          {parsedData && (
            <div className="space-y-2 p-4 bg-white/[0.01] border border-white/5 rounded-xl text-12 text-left">
              <span className="text-[9.5px] font-bold text-white/30 uppercase tracking-widest block">Dataset Profile</span>
              <div className="space-y-1.5 font-mono text-11 text-white/50 pt-1">
                <div className="flex justify-between">
                  <span>Industry:</span>
                  <span className="text-white/70 font-semibold">{parsedData.profile.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span>Records:</span>
                  <span className="text-white/70 font-semibold">{parsedData.rowCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Timeframe:</span>
                  <span className="text-white/70 font-semibold truncate max-w-[130px]" title={parsedData.profile.timePeriod}>
                    {parsedData.profile.timePeriod.split(' (')[0]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Missing Values:</span>
                  <span className="text-white/70 font-semibold">{parsedData.missingValueCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Detected Outliers:</span>
                  <span className="text-white/70 font-semibold">{parsedData.outlierCount}</span>
                </div>
              </div>
            </div>
          )}

          {/* Current Focus Analysis */}
          <div className="space-y-1.5">
            <span className="text-[9.5px] font-bold text-white/30 uppercase tracking-widest block">Current Focus</span>
            <p className="text-12.5 text-white/50 leading-relaxed font-serif">
              {activeNodeContext.summary}
            </p>
          </div>

          {/* Related Insights */}
          <div className="space-y-2.5">
            <span className="text-[9.5px] font-bold text-white/30 uppercase tracking-widest block">Related Insights</span>
            <div className="space-y-2">
              <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg text-11.5 text-white/50 font-serif leading-relaxed">
                <strong className="text-white/70 font-sans">Opportunity:</strong> {activeNodeContext.opportunity}
              </div>
              <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg text-11.5 text-white/50 font-serif leading-relaxed">
                <strong className="text-white/70 font-sans">Anomaly risk:</strong> {activeNodeContext.risk}
              </div>
            </div>
          </div>

          {/* Gemini API Key Configuration */}
          <div className="space-y-2.5 p-4 bg-white/[0.01] border border-white/5 rounded-xl">
            <span className="text-[9.5px] font-bold text-white/30 uppercase tracking-wider block">Gemini API Key</span>
            <input
              type="password"
              value={geminiApiKey || ''}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="Enter API Key to supercharge AI..."
              className="w-full bg-[#0D1117] border border-white/5 rounded-lg px-2.5 py-1.5 text-11 text-white/70 placeholder-white/20 outline-none focus:border-[#83D18B]/30"
            />
            <span className="text-[9px] text-white/20 block leading-tight">
              {geminiApiKey ? '✅ Key Loaded. True Gemini Pipeline active.' : '💡 Optional. Falls back to localized data insights.'}
            </span>
          </div>

          {/* AI Confidence Rating */}
          <div className="space-y-2.5 p-4 bg-white/[0.01] border border-white/5 rounded-xl" title="Confidence metrics dynamically calculated from record completeness, missing parameters, and Z-score outlier ratios.">
            <span className="text-[9.5px] font-bold text-white/30 uppercase tracking-wider block">AI Confidence Rating</span>
            <div className="flex items-center justify-between text-11 font-mono">
              <span className="text-white/40">Reliability Index</span>
              <span className="text-[#83D18B] font-bold">{decisionReadiness}%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#83D18B] rounded-full" style={{ width: `${decisionReadiness}%` }} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
