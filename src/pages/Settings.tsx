import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  SectionHeader, 
  Card, 
  Badge, 
  Input 
} from '../components/ui';
import { 
  Sliders, 
  Globe, 
  Palette, 
  Cpu, 
  Database, 
  Bell, 
  ShieldCheck, 
  Info, 
  Check, 
  Sparkles, 
  ExternalLink,
  Lock,
  Moon,
  Zap,
  Server
} from 'lucide-react';
import { getStoredApiKey } from '../features/geminiService';
import { ACCENT_THEMES, applyAccentTheme } from '../features/themeEngine';

export interface EnterpriseSettingsState {
  // General
  workspaceName: string;
  companyName: string;
  industry: string;
  timeZone: string;

  // Appearance
  darkMode: boolean;
  compactMode: boolean;
  animationToggle: boolean;
  accentColor: string;

  // AI Settings
  geminiModel: string;
  creativityLevel: number; // 0.0 to 1.0
  responseLength: 'concise' | 'detailed' | 'executive';
  executiveTone: 'McKinsey & Co.' | 'BCG' | 'Goldman Sachs' | 'Harvard Business';
  enableLocalFallback: boolean;
  aiConfidenceDisplay: boolean;

  // Data Settings
  defaultUploadFolder: string;
  csvDelimiter: string;
  autoDetectIndustry: boolean;
  autoSaveSession: boolean;

  // Notifications
  notifAnalysisCompleted: boolean;
  notifReportGenerated: boolean;
  notifForecastReady: boolean;
}

const DEFAULT_SETTINGS: EnterpriseSettingsState = {
  workspaceName: 'NovaRetail Enterprise Q2 Workspace',
  companyName: 'NovaRetail Global Corporation',
  industry: 'Retail & Consumer Goods',
  timeZone: 'UTC-05:00 (Eastern Time)',

  darkMode: true,
  compactMode: false,
  animationToggle: true,
  accentColor: '#83D18B',

  geminiModel: 'gemini-2.5-flash',
  creativityLevel: 0.2,
  responseLength: 'executive',
  executiveTone: 'McKinsey & Co.',
  enableLocalFallback: true,
  aiConfidenceDisplay: true,

  defaultUploadFolder: '/datasets/q2-briefings',
  csvDelimiter: 'Auto (Comma/Semicolon)',
  autoDetectIndustry: true,
  autoSaveSession: true,

  notifAnalysisCompleted: true,
  notifReportGenerated: true,
  notifForecastReady: false
};

const STORAGE_SETTINGS_KEY = 'synapseiq_enterprise_settings';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'ai' | 'data' | 'notifications' | 'security' | 'about'>('general');
  const [settings, setSettings] = useState<EnterpriseSettingsState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const apiKey = getStoredApiKey();

  const handleUpdate = <K extends keyof EnterpriseSettingsState>(key: K, value: EnterpriseSettingsState[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(next));
      return next;
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <Globe size={14} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={14} /> },
    { id: 'ai', label: 'AI Pipeline', icon: <Cpu size={14} /> },
    { id: 'data', label: 'Data & Privacy', icon: <Database size={14} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={14} /> },
    { id: 'security', label: 'Security & TLS', icon: <ShieldCheck size={14} /> },
    { id: 'about', label: 'About & System', icon: <Info size={14} /> }
  ] as const;

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-10 flex flex-col gap-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <SectionHeader 
          label="Enterprise Controls"
          title="Platform Settings"
          description="Manage workspace parameters, Google Gemini AI model negotiation, security protocols, and system defaults."
        />
        {saveSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex items-center gap-2 px-3 py-1.5 bg-[#83D18B]/10 border border-[#83D18B]/30 rounded-lg text-[#83D18B] text-12 font-mono"
          >
            <Check size={14} /> Settings Saved
          </motion.div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-white/5 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-13 transition-all duration-200 cursor-pointer whitespace-nowrap ${
                isActive 
                  ? 'bg-white/[0.06] text-white font-semibold border border-white/10 shadow-sm' 
                  : 'text-white/50 hover:text-white/80 hover:bg-white/[0.02]'
              }`}
            >
              <span className={isActive ? 'text-[#83D18B]' : 'opacity-60'}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        {/* 1. GENERAL TAB */}
        {activeTab === 'general' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <Card elevation="flat" className="p-6 space-y-6">
              <h3 className="text-14 font-bold text-white/90 border-b border-white/5 pb-3">Workspace Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-12 font-medium text-white/60 block mb-2">Workspace Name</label>
                  <Input 
                    value={settings.workspaceName}
                    onChange={(e) => handleUpdate('workspaceName', e.target.value)}
                    placeholder="Enter workspace name..."
                  />
                </div>
                <div>
                  <label className="text-12 font-medium text-white/60 block mb-2">Company Name</label>
                  <Input 
                    value={settings.companyName}
                    onChange={(e) => handleUpdate('companyName', e.target.value)}
                    placeholder="Enter organization..."
                  />
                </div>
                <div>
                  <label className="text-12 font-medium text-white/60 block mb-2">Primary Business Domain / Industry</label>
                  <select 
                    value={settings.industry}
                    onChange={(e) => handleUpdate('industry', e.target.value)}
                    className="w-full bg-[#151B23] border border-white/10 rounded-xl py-2 px-3 text-13 text-white/90 outline-none focus:border-[#83D18B]"
                  >
                    <option value="Retail & Consumer Goods">Retail & Consumer Goods</option>
                    <option value="Enterprise SaaS & Technology">Enterprise SaaS & Technology</option>
                    <option value="Financial Services & Banking">Financial Services & Banking</option>
                    <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                    <option value="Manufacturing & Yield">Manufacturing & Yield</option>
                    <option value="Freight & Logistics">Freight & Logistics</option>
                    <option value="Energy & Utilities">Energy & Utilities</option>
                  </select>
                </div>
                <div>
                  <label className="text-12 font-medium text-white/60 block mb-2">Workspace Time Zone</label>
                  <Input 
                    value={settings.timeZone}
                    onChange={(e) => handleUpdate('timeZone', e.target.value)}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* 2. APPEARANCE TAB */}
        {activeTab === 'appearance' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <Card elevation="flat" className="p-6 space-y-6">
              <h3 className="text-14 font-bold text-white/90 border-b border-white/5 pb-3">Theme & Aesthetics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <Moon size={18} className="text-[#83D18B]" />
                    <div>
                      <h4 className="text-13 font-semibold text-white/90">Dark Mode System Theme</h4>
                      <p className="text-11 text-white/40">Default Linear & Google Cloud Obsidian Dark Theme</p>
                    </div>
                  </div>
                  <Badge variant="sage">Enabled (Default)</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <Sliders size={18} className="text-[#83D18B]" />
                    <div>
                      <h4 className="text-13 font-semibold text-white/90">Compact Density View</h4>
                      <p className="text-11 text-white/40">Reduce row padding for high-density executive dashboards</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={settings.compactMode}
                    onChange={(e) => handleUpdate('compactMode', e.target.checked)}
                    className="w-4 h-4 accent-[#83D18B] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <Zap size={18} className="text-[#83D18B]" />
                    <div>
                      <h4 className="text-13 font-semibold text-white/90">Framer Motion Micro-Animations</h4>
                      <p className="text-11 text-white/40">Enable smooth spring transitions and typewriter streaming effects</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={settings.animationToggle}
                    onChange={(e) => handleUpdate('animationToggle', e.target.checked)}
                    className="w-4 h-4 accent-[#83D18B] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-12 font-medium text-white/60 block mb-3 font-sans">Enterprise Accent Theme Engine</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.values(ACCENT_THEMES).map((theme) => {
                      const isSelected = settings.accentColor === theme.id || settings.accentColor === theme.hex;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => {
                            handleUpdate('accentColor', theme.id);
                            applyAccentTheme(theme.id);
                          }}
                          className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer select-none text-left ${
                            isSelected 
                              ? 'bg-white/[0.06] border-white/30 ring-1 ring-white/30' 
                              : 'bg-black/20 border-white/5 hover:border-white/15 hover:bg-white/[0.02]'
                          }`}
                        >
                          <div 
                            className="w-5 h-5 rounded-full border border-white/20 shrink-0 flex items-center justify-center shadow-sm"
                            style={{ backgroundColor: theme.hex }}
                          >
                            {isSelected && <Check size={11} style={{ color: theme.contrastText }} className="font-bold" />}
                          </div>
                          <span className="text-12 font-medium text-white/85 truncate font-sans">
                            {theme.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* 3. AI SETTINGS TAB */}
        {activeTab === 'ai' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <Card elevation="flat" className="p-6 space-y-6">
              <h3 className="text-14 font-bold text-white/90 border-b border-white/5 pb-3">Google Gemini AI Engine Parameters</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-12 font-medium text-white/60 block mb-2">Primary Flash Model Target</label>
                  <select 
                    value={settings.geminiModel}
                    onChange={(e) => handleUpdate('geminiModel', e.target.value)}
                    className="w-full bg-[#151B23] border border-white/10 rounded-xl py-2 px-3 text-13 text-white/90 outline-none focus:border-[#83D18B]"
                  >
                    <option value="gemini-2.5-flash">gemini-2.5-flash (Newest Stable)</option>
                    <option value="gemini-2.0-flash">gemini-2.0-flash (Recommended)</option>
                    <option value="gemini-2.0-flash-lite">gemini-2.0-flash-lite (High Speed)</option>
                    <option value="gemini-1.5-flash">gemini-1.5-flash (Legacy)</option>
                  </select>
                </div>

                <div>
                  <label className="text-12 font-medium text-white/60 block mb-2">Executive Advisory Persona Tone</label>
                  <select 
                    value={settings.executiveTone}
                    onChange={(e) => handleUpdate('executiveTone', e.target.value as any)}
                    className="w-full bg-[#151B23] border border-white/10 rounded-xl py-2 px-3 text-13 text-white/90 outline-none focus:border-[#83D18B]"
                  >
                    <option value="McKinsey & Co.">McKinsey & Co. (Strategic & Quantitative)</option>
                    <option value="BCG">BCG (Growth Matrix & Vector Analysis)</option>
                    <option value="Goldman Sachs">Goldman Sachs (Financial Risk & Yield Focus)</option>
                    <option value="Harvard Business">Harvard Business (Academic Operational Governance)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-12 font-medium text-white/60">Model Creativity / Temperature ({settings.creativityLevel.toFixed(1)})</label>
                    <span className="text-10 text-white/40 font-mono">0.0 (Deterministic) - 1.0 (Creative)</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.creativityLevel}
                    onChange={(e) => handleUpdate('creativityLevel', parseFloat(e.target.value))}
                    className="w-full accent-[#83D18B] cursor-pointer"
                  />
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/5">
                  <div>
                    <h4 className="text-13 font-semibold text-white/90">Enable Client-Side Local Fallback</h4>
                    <p className="text-11 text-white/40">Use statistical Pearson & Z-score matrices when API key reaches free tier quota limits</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={settings.enableLocalFallback}
                    onChange={(e) => handleUpdate('enableLocalFallback', e.target.checked)}
                    className="w-4 h-4 accent-[#83D18B] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/5">
                  <div>
                    <h4 className="text-13 font-semibold text-white/90">Show Decision Readiness Confidence Index</h4>
                    <p className="text-11 text-white/40">Display calculated statistical confidence badges (0–100%) on AI insight cards</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={settings.aiConfidenceDisplay}
                    onChange={(e) => handleUpdate('aiConfidenceDisplay', e.target.checked)}
                    className="w-4 h-4 accent-[#83D18B] cursor-pointer"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* 4. DATA SETTINGS TAB */}
        {activeTab === 'data' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <Card elevation="flat" className="p-6 space-y-6">
              <h3 className="text-14 font-bold text-white/90 border-b border-white/5 pb-3">Data Ingestion & CSV Rules</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-12 font-medium text-white/60 block mb-2">Default Upload Target Folder</label>
                  <Input 
                    value={settings.defaultUploadFolder}
                    onChange={(e) => handleUpdate('defaultUploadFolder', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-12 font-medium text-white/60 block mb-2">CSV Delimiter Parsing Strategy</label>
                  <Input 
                    value={settings.csvDelimiter}
                    onChange={(e) => handleUpdate('csvDelimiter', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/5">
                  <div>
                    <h4 className="text-13 font-semibold text-white/90">Auto-Detect Industry Domain Profile</h4>
                    <p className="text-11 text-white/40">Automatically tailor prompts to HR, Finance, Logistics, or Healthcare context</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={settings.autoDetectIndustry}
                    onChange={(e) => handleUpdate('autoDetectIndustry', e.target.checked)}
                    className="w-4 h-4 accent-[#83D18B] cursor-pointer"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* 5. NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <Card elevation="flat" className="p-6 space-y-6">
              <h3 className="text-14 font-bold text-white/90 border-b border-white/5 pb-3">In-App Intelligence Alerts</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/5">
                  <div>
                    <h4 className="text-13 font-semibold text-white/90">Analysis Completed Toast Alerts</h4>
                    <p className="text-11 text-white/40">Show notification when Gemini finishes synthesizing dataset correlation edges</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={settings.notifAnalysisCompleted}
                    onChange={(e) => handleUpdate('notifAnalysisCompleted', e.target.checked)}
                    className="w-4 h-4 accent-[#83D18B] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/5">
                  <div>
                    <h4 className="text-13 font-semibold text-white/90">Boardroom Briefing Ready Alerts</h4>
                    <p className="text-11 text-white/40">Notify when a new 9-paragraph briefing report dossier is compiled</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={settings.notifReportGenerated}
                    onChange={(e) => handleUpdate('notifReportGenerated', e.target.checked)}
                    className="w-4 h-4 accent-[#83D18B] cursor-pointer"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* 6. SECURITY TAB */}
        {activeTab === 'security' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <Card elevation="flat" className="p-6 space-y-6">
              <h3 className="text-14 font-bold text-white/90 border-b border-white/5 pb-3">Security & API Key Isolation</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <Lock size={18} className="text-[#83D18B]" />
                    <div>
                      <h4 className="text-13 font-semibold text-white/90">Environment API Key Status</h4>
                      <p className="text-11 font-mono text-white/40">
                        {apiKey ? `Bound: ${apiKey.substring(0, 10)}...` : 'No API key provided (Running Heuristic Engine)'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={apiKey ? 'sage' : 'warn'}>
                    {apiKey ? 'Configured & Active' : 'Offline Fallback'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <Server size={18} className="text-[#83D18B]" />
                    <div>
                      <h4 className="text-13 font-semibold text-white/90">Transport Security Protocol</h4>
                      <p className="text-11 text-white/40">TLS 1.3 End-to-End Encryption to Google AI Studio REST channel</p>
                    </div>
                  </div>
                  <Badge variant="sage">TLS 1.3 Active</Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* 7. ABOUT TAB */}
        {activeTab === 'about' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <Card elevation="flat" className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#83D18B]/10 border border-[#83D18B]/20 flex items-center justify-center text-[#83D18B]">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="text-16 font-bold text-white/90">SynapseIQ Platform</h3>
                    <p className="text-12 text-white/40 font-mono">v1.0.0-enterprise (Build 2026.07.22)</p>
                  </div>
                </div>
                <Badge variant="sage">Production Ready</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-13 text-white/70">
                <a 
                  href="https://github.com/pravalika2307/SynapseIQ#readme" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/5 hover:border-white/20 transition-all"
                >
                  <span className="font-semibold text-white/90">System Documentation</span>
                  <ExternalLink size={14} className="text-white/40" />
                </a>

                <a 
                  href="https://github.com/pravalika2307/SynapseIQ" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/5 hover:border-white/20 transition-all"
                >
                  <span className="font-semibold text-white/90">GitHub Repository</span>
                  <ExternalLink size={14} className="text-white/40" />
                </a>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};
