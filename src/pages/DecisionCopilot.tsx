import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, BookOpen, CheckCircle, ShieldAlert, Zap } from 'lucide-react';
import { useAppStore } from '../features/store';
import { copilotStarters, copilotAIResponses } from '../features/data';

export const DecisionCopilot: React.FC = () => {
  const messages = useAppStore((state) => state.messages);
  const addMessage = useAppStore((state) => state.addMessage);
  const resetMessages = useAppStore((state) => state.resetMessages);
  const copilotContextNodeId = useAppStore((state) => state.copilotContextNodeId);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Last assistant response for the reference panel (on the right)
  const lastAssistantMessage = [...messages]
    .reverse()
    .find((m) => m.sender === 'assistant');

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    addMessage(text, 'user');
    setInput('');
    setIsTyping(true);

    // Simulate AI consultant response
    setTimeout(() => {
      // Find matching custom response or fall back to default
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
          recommendation: responseData.recommendation
        }
      );
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="h-[calc(100vh-52px)] w-full flex overflow-hidden bg-background">
      {/* Left Pane: Conversation */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-white/5 h-full relative">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-accent-sage" />
            <h2 className="text-14 font-semibold text-white/95">Consultation Room</h2>
          </div>
          <button 
            onClick={resetMessages}
            className="text-[10px] uppercase font-bold text-white/30 hover:text-white/60 px-2.5 py-1 bg-white/[0.02] border border-white/5 rounded-md transition-all"
          >
            Clear Context
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex flex-col gap-2 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                {/* Meta details */}
                <span className="text-[9px] font-bold text-white/20 uppercase tracking-wider font-mono">
                  {msg.sender === 'user' ? 'Executive Director' : 'Synapse Intelligence'} · {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>

                {/* Bubble */}
                <div className={`
                  px-5 py-3.5 rounded-2xl text-13.5 leading-relaxed shadow-md
                  ${msg.sender === 'user' 
                    ? 'bg-accent-sage text-background font-medium rounded-tr-none' 
                    : 'bg-card border border-white/5 text-white/80 rounded-tl-none font-serif'
                  }
                `}>
                  {msg.text}
                </div>

                {/* Compact AI Reference Preview */}
                {msg.sender === 'assistant' && msg.references && (
                  <div className="flex items-center gap-2.5 mt-1.5 px-3 py-1 bg-white/[0.01] border border-white/5 rounded-full text-[10.5px] text-white/40">
                    <CheckCircle size={10.5} className="text-accent-sage" />
                    <span>Confidence Score: <strong className="text-accent-sage">{msg.references.confidence}%</strong></span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <div className="flex items-center gap-2 text-white/30 text-12 italic font-serif">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-sage animate-ping" />
              AI strategy consultant is analyzing records...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input & Smart Starters Area */}
        <div className="p-6 border-t border-white/5 bg-white/[0.01] space-y-4">
          {/* Smart Starters */}
          {messages.length <= 1 && !isTyping && (
            <div className="space-y-2">
              <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest block">
                Suggested Consultation Starters
              </span>
              <div className="grid grid-cols-2 gap-2">
                {copilotStarters.map((starter, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(starter.query)}
                    className="p-3 rounded-lg border border-white/5 bg-card hover:border-accent-sage-border hover:bg-accent-sage-dim transition-all text-left flex flex-col gap-0.5"
                  >
                    <span className="text-[9px] font-bold text-accent-sage uppercase tracking-wider">{starter.category}</span>
                    <span className="text-12.5 text-white/60 truncate w-full">{starter.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
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
              placeholder={`Consult Copilot on contextual node: "${copilotContextNodeId}"...`}
              className="flex-1 bg-card border border-white/5 rounded-xl py-3 px-4 text-13.5 text-white/90 placeholder-white/20 outline-none transition-all focus:border-accent-sage-border focus:ring-4 focus:ring-accent-sage/5"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="w-11 h-11 rounded-xl bg-accent-sage text-background flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 disabled:pointer-events-none"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>

      {/* Right Pane: AI References & Context */}
      <div className="w-80 flex flex-col h-full bg-card/30 overflow-y-auto">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-white/[0.01]">
          <BookOpen size={14} className="text-white/40" />
          <h2 className="text-12 font-bold uppercase tracking-wider text-white/40">AI References</h2>
        </div>

        <div className="p-6 space-y-6">
          {lastAssistantMessage?.references ? (
            <>
              {/* Executive Summary */}
              <div className="space-y-2">
                <span className="text-[9px] font-bold text-accent-sage uppercase tracking-widest block">Executive Summary</span>
                <p className="text-13 text-white/60 leading-relaxed font-serif">
                  {lastAssistantMessage.references.summary}
                </p>
              </div>

              {/* Supporting Evidence */}
              <div className="space-y-3">
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">Supporting Evidence</span>
                <div className="space-y-2">
                  {lastAssistantMessage.references.evidence.map((ev, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-sage mt-2 shrink-0 opacity-80" />
                      <span className="text-12.5 text-white/60 leading-normal">{ev}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confidence Gauge */}
              <div className="space-y-2.5 p-4 bg-white/[0.01] border border-white/5 rounded-xl">
                <span className="text-[9.5px] font-bold text-white/30 uppercase tracking-wider">Audit Confidence Rating</span>
                <div className="flex items-center justify-between text-11 font-mono">
                  <span className="text-white/40">Reliability Weight</span>
                  <span className="text-accent-sage font-bold">{lastAssistantMessage.references.confidence}%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-sage rounded-full" style={{ width: `${lastAssistantMessage.references.confidence}%` }} />
                </div>
              </div>

              {/* Strategy Action / Recommendation */}
              <div className="p-4 bg-accent-sage-dim border border-accent-sage-border rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-accent-sage">
                  <Zap size={13} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Tactical Directive</span>
                </div>
                <p className="text-12 text-white/70 leading-relaxed font-serif">
                  "{lastAssistantMessage.references.recommendation}"
                </p>
              </div>
            </>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-center gap-3 opacity-30 px-4">
              <ShieldAlert size={22} />
              <span className="text-12 text-white/80 font-serif">No contextual references loaded. Ask a consultation query to stream metadata.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
