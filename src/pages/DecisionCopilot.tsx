import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, BookOpen, Zap, Compass } from 'lucide-react';
import { useAppStore } from '../features/store';
import { copilotStarters, copilotAIResponses, nodeContexts } from '../features/data';
import { Badge } from '../components/ui';

export const DecisionCopilot: React.FC = () => {
  const messages = useAppStore((state) => state.messages);
  const addMessage = useAppStore((state) => state.addMessage);
  const resetMessages = useAppStore((state) => state.resetMessages);
  
  // Workspace active/context node state
  const activeNodeId = useAppStore((state) => state.activeNodeId);
  const datasetName = useAppStore((state) => state.datasetName);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeNodeContext = nodeContexts[activeNodeId] || nodeContexts.health;

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user query
    addMessage(text, 'user');
    setInput('');
    setIsTyping(true);

    // Simulate McKinsey Consultant Strategy analysis
    setTimeout(() => {
      // Find matching custom response or fallback
      const matchedKey = Object.keys(copilotAIResponses).find(
        (key) => text.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(text.toLowerCase())
      );
      
      const responseData = matchedKey 
        ? copilotAIResponses[matchedKey] 
        : copilotAIResponses['default-query'];

      addMessage(
        responseData.summary,
        'assistant',
        {
          summary: responseData.summary,
          evidence: responseData.evidence,
          confidence: responseData.confidence,
          recommendation: responseData.recommendation,
          // Support for additional fields in data types
          relatedMetrics: responseData.relatedMetrics || [],
          nextQuestion: responseData.nextQuestion || ''
        }
      );
      setIsTyping(false);
    }, 1600);
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
            <Compass size={16} className="text-[#79D38A] animate-spin-slow" />
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
                          <span className="text-[9px] font-bold text-[#79D38A] uppercase tracking-wider block font-sans">
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
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#79D38A] mt-2 shrink-0 opacity-70" />
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
                                <span className="text-[#79D38A] font-mono">{msg.references.confidence}%</span>
                              </div>
                              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-[#79D38A]" style={{ width: `${msg.references.confidence}%` }} />
                              </div>
                            </div>

                            <div className="p-4 bg-[#79D38A]/5 border border-[#79D38A]/10 rounded-xl space-y-1">
                              <span className="text-[9px] uppercase font-bold text-[#79D38A] font-sans flex items-center gap-1">
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
                          className="px-3 py-1.5 rounded-lg bg-[#151B23] border border-white/5 text-12 text-white/50 hover:text-[#79D38A] hover:border-[#79D38A]/30 transition-all font-sans"
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

          {isTyping && (
            <div className="flex items-center gap-2.5 text-white/30 text-12 italic font-serif select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#79D38A] animate-ping" />
              Strategy consult analyst is correlating signals...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input & Suggested Question Starters */}
        <div className="p-6 border-t border-white/5 bg-white/[0.01] space-y-4">
          
          {/* Intelligent Suggested Questions (Shown at mount or when logs are empty) */}
          {messages.length <= 1 && !isTyping && (
            <div className="space-y-2">
              <span className="text-[9.5px] font-bold text-white/20 uppercase tracking-widest block select-none">
                Intelligent Consultation Starters
              </span>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {copilotStarters.map((starter, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(starter.query)}
                    className="p-3 rounded-xl border border-white/5 bg-[#151B23] hover:border-[#79D38A]/30 hover:bg-[#79D38A]/5 transition-all text-left flex flex-col gap-0.5"
                  >
                    <span className="text-[9px] font-bold text-[#79D38A] uppercase tracking-wider">{starter.category}</span>
                    <span className="text-12 text-white/60 truncate w-full">{starter.text}</span>
                  </button>
                ))}
              </div>
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
              className="flex-1 bg-[#151B23] border border-white/5 rounded-xl py-3 px-4 text-13.5 text-white/90 placeholder-white/20 outline-none transition-all focus:border-[#79D38A]/30 focus:ring-4 focus:ring-[#79D38A]/5 font-sans"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="w-11 h-11 rounded-xl bg-[#79D38A] text-[#0D1117] flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 disabled:pointer-events-none"
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
            <span className="text-[9.5px] font-bold text-[#79D38A] uppercase tracking-widest block">Selected Metric</span>
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

          {/* AI Confidence Rating */}
          <div className="space-y-2.5 p-4 bg-white/[0.01] border border-white/5 rounded-xl">
            <span className="text-[9.5px] font-bold text-white/30 uppercase tracking-wider">AI Confidence Rating</span>
            <div className="flex items-center justify-between text-11 font-mono">
              <span className="text-white/40">Reliability Index</span>
              <span className="text-[#79D38A] font-bold">94%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#79D38A] rounded-full" style={{ width: '94%' }} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
