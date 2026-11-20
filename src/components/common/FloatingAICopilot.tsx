import React, { useState, useRef, useEffect } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  queryRealTimeAICopilot,
  generateProactiveSuggestions,
  AIChatMessage,
  AIConfig
} from '../../utils/aiCopilotEngine';
import {
  Bot,
  Sparkles,
  X,
  Send,
  Maximize2,
  AlertTriangle,
  RotateCcw,
  Key,
  Check,
  ExternalLink,
  Settings2
} from 'lucide-react';

export const FloatingAICopilot: React.FC = () => {
  const {
    patients,
    doctors,
    beds,
    medicines,
    labOrders,
    invoices,
    appointments,
    emergencyCases,
    bloodBank,
    emergencyBroadcasts,
    auditLedger,
    setActiveTab,
    activeTab
  } = useHospital();

  const [isOpen, setIsOpen] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [aiProvider, setAiProvider] = useState<'free' | 'gemini' | 'openai'>(() => {
    return (localStorage.getItem('pc_ai_provider') as any) || 'free';
  });
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('pc_ai_key') || '';
  });
  const [tempKey, setTempKey] = useState(apiKey);

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'init-floating',
      sender: 'assistant',
      text: '🤖 **PulseAI Real-Time Assistant Online.**\n\nI have live access to the entire hospital database (patients, ICU beds, blood bank, pharmacy stock, and doctors) AND can answer any general medical or open-ended questions.\n\n*Tap the 🔑 key icon above to connect your Google Gemini or OpenAI API key, or enjoy the Free Cloud AI.*',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badges: ['Real-Time AI', 'Hospital Grounded', 'Free Cloud Ready'],
      suggestions: ['Available ICU beds?', 'Blood shortages?', 'Hospital health audit']
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const knowledgeContext = {
    patients,
    doctors,
    beds,
    medicines,
    labOrders,
    invoices,
    appointments,
    emergencyCases,
    bloodBank,
    emergencyBroadcasts,
    auditLedger
  };

  const suggestions = generateProactiveSuggestions(knowledgeContext);
  const criticalCount = suggestions.filter((s) => s.severity === 'critical').length;

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKey(tempKey);
    localStorage.setItem('pc_ai_key', tempKey);
    localStorage.setItem('pc_ai_provider', aiProvider);
    setShowConfig(false);
  };

  const handleSend = async (text?: string) => {
    const q = text || inputQuery;
    if (!q.trim() || isTyping) return;

    const userMsg: AIChatMessage = {
      id: `USR-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!text) setInputQuery('');
    setIsTyping(true);

    const historyForPrompt = messages.slice(-6).map((m) => ({
      role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
      content: m.text
    }));

    try {
      const resp = await queryRealTimeAICopilot(
        q,
        historyForPrompt,
        knowledgeContext,
        { provider: aiProvider, apiKey }
      );
      setMessages((prev) => [...prev, resp]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ERR-${Date.now()}`,
          sender: 'assistant',
          text: '⚠️ An unexpected error occurred while communicating with the AI service. Retrying via local clinical reasoning...',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Hide floating widget if user is already on the full AI Copilot view
  if (activeTab === 'adv-ai-copilot') {
    return null;
  }

  return (
    <aside aria-label="PulseAI Copilot Widget" className="fixed bottom-6 right-6 z-50">
      {/* Floating Chat Modal Panel */}
      {isOpen && (
        <div className="mb-3 flex flex-col h-[540px] w-[360px] sm:w-[420px] rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-teal-700 via-indigo-800 to-slate-900 px-4 py-3 text-white dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-white">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>PulseAI Real-Time Copilot</span>
                  <span className="rounded bg-teal-400/20 px-1 py-0.2 text-[9px] font-mono text-teal-200 border border-teal-300/30">
                    {aiProvider === 'gemini' ? 'Gemini 1.5' : aiProvider === 'openai' ? 'GPT-4o' : 'Free AI'}
                  </span>
                </h4>
                <div className="flex items-center gap-1 text-[10px] text-teal-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Real-time Hospital Brain</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowConfig(!showConfig)}
                title="AI Model & API Key Settings"
                className={`rounded-lg p-1.5 transition-colors ${
                  showConfig || apiKey
                    ? 'bg-teal-500/30 text-teal-200 ring-1 ring-teal-400/40'
                    : 'text-slate-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                <Key className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setActiveTab('adv-ai-copilot');
                }}
                title="Expand to Full View"
                className="rounded-lg p-1.5 text-slate-300 hover:bg-white/20 hover:text-white transition-colors"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="rounded-lg p-1.5 text-slate-300 hover:bg-white/20 hover:text-white transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Settings / API Key Popover Panel */}
          {showConfig && (
            <div className="border-b border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/90 animate-in fade-in duration-150">
              <form onSubmit={handleSaveConfig} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100">
                    <Settings2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                    <span>Real-Time AI Configuration</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Stored Locally</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setAiProvider('free')}
                    className={`rounded-lg p-1.5 font-bold transition-all ${
                      aiProvider === 'free'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 dark:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    🌟 Free Cloud AI
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiProvider('gemini')}
                    className={`rounded-lg p-1.5 font-bold transition-all ${
                      aiProvider === 'gemini'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 dark:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    ⚡ Gemini API
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiProvider('openai')}
                    className={`rounded-lg p-1.5 font-bold transition-all ${
                      aiProvider === 'openai'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 dark:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    🤖 OpenAI API
                  </button>
                </div>

                {aiProvider !== 'free' && (
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-300 mb-1">
                      <span>{aiProvider === 'gemini' ? 'Google Gemini API Key' : 'OpenAI API Key'}</span>
                      {aiProvider === 'gemini' && (
                        <a
                          href="https://aistudio.google.com/app/apikey"
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-0.5 text-teal-600 hover:underline dark:text-teal-400"
                        >
                          <span>Get Free Key</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </div>
                    <input
                      type="password"
                      value={tempKey}
                      onChange={(e) => setTempKey(e.target.value)}
                      placeholder={aiProvider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
                      className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-900 focus:border-teal-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowConfig(false)}
                    className="rounded-lg px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-teal-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-teal-700 shadow-xs"
                  >
                    Save & Activate
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Proactive Alert Bar if Critical Exists */}
          {criticalCount > 0 && !showConfig && (
            <div className="bg-rose-50 px-3 py-1.5 text-[11px] font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-b border-rose-200 dark:border-rose-900 flex items-center justify-between">
              <div className="flex items-center gap-1.5 truncate">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{criticalCount} Critical Telemetry Alert(s) Active</span>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setActiveTab('adv-ai-copilot');
                }}
                className="text-[10px] underline hover:no-underline font-bold"
              >
                Review
              </button>
            </div>
          )}

          {/* Chat Stream */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/60 dark:border-slate-700/60'
                  }`}
                >
                  {m.badges && m.badges.length > 0 && (
                    <div className="mb-1.5 flex flex-wrap gap-1">
                      {m.badges.map((b, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-teal-500/10 px-1.5 py-0.5 text-[9px] font-mono font-bold text-teal-700 dark:bg-teal-950 dark:text-teal-300 border border-teal-500/20"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="whitespace-pre-wrap">{m.text}</div>

                  {m.actionShortcut && (
                    <div className="mt-2 pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          setActiveTab(m.actionShortcut!.targetTab);
                        }}
                        className="rounded bg-teal-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-teal-700 transition-colors"
                      >
                        {m.actionShortcut.label} →
                      </button>
                    </div>
                  )}

                  {m.suggestions && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {m.suggestions.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(s)}
                          className="rounded-full bg-white/70 px-2 py-0.5 text-[9px] font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono ml-1">
                  PulseAI reasoning...
                </span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Pills */}
          <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 flex gap-1 overflow-x-auto text-[10px]">
            <button
              onClick={() => handleSend('Which ICU beds are available?')}
              className="flex-shrink-0 rounded bg-white px-2 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            >
              🛏️ ICU Beds
            </button>
            <button
              onClick={() => handleSend('Check O-Negative blood reserves')}
              className="flex-shrink-0 rounded bg-white px-2 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            >
              🩸 Blood
            </button>
            <button
              onClick={() => handleSend('Low stock medicines')}
              className="flex-shrink-0 rounded bg-white px-2 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            >
              💊 Meds
            </button>
            <button
              onClick={() => handleSend('Explain symptoms and treatment of Acute Coronary Syndrome')}
              className="flex-shrink-0 rounded bg-white px-2 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            >
              🩺 Medical AI
            </button>
          </div>

          {/* Input */}
          <div className="p-2.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask PulseAI about hospital data or ANY medical question..."
                className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isTyping}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-40 transition-all"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-teal-600 to-indigo-600 text-white shadow-xl hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-teal-400/40"
      >
        <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-500 opacity-30 blur-sm group-hover:opacity-60 transition duration-300" />
        <Bot className="relative h-7 w-7" />

        {/* Suggestion Notification Badge */}
        {suggestions.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-white dark:ring-slate-900">
            {suggestions.length}
          </span>
        )}
      </button>
    </aside>
  );
};
