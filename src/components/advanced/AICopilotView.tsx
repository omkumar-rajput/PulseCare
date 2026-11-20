import React, { useState, useEffect, useRef } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  queryRealTimeAICopilot,
  answerHospitalQuery,
  generateProactiveSuggestions,
  AIChatMessage,
  AISuggestion
} from '../../utils/aiCopilotEngine';
import {
  Bot,
  Sparkles,
  Send,
  Volume2,
  VolumeX,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  RotateCcw,
  Activity,
  HeartPulse,
  Bed,
  Droplet,
  Pill,
  Users,
  ShieldAlert,
  HelpCircle,
  Key,
  Settings2,
  ExternalLink,
  Check
} from 'lucide-react';

export const AICopilotView: React.FC = () => {
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
    addNotification
  } = useHospital();

  const [aiProvider, setAiProvider] = useState<'free' | 'gemini' | 'openai'>(() => {
    return (localStorage.getItem('pc_ai_provider') as any) || 'free';
  });
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('pc_ai_key') || '';
  });
  const [tempKey, setTempKey] = useState(apiKey);
  const [showConfig, setShowConfig] = useState(false);

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `👋 **Welcome to PulseAI Real-Time Clinical Copilot & Omniscient Assistant!**\n\nI am continuously synchronized with the live hospital database. I monitor all **${patients.length} registered patients**, **${beds.length} beds**, **${medicines.length} pharmaceuticals**, **8 blood groups**, and **${doctors.length} specialists**.\n\nYou can ask me ANY question — both live hospital telemetry inquiries and open-ended medical, diagnostic, pharmacological, or general questions.\n\n*Click the 🔑 API Settings button in the chat header to link your Google Gemini or OpenAI key, or use the Free Cloud AI.*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badges: ['Real-Time AI Active', 'Zero-Latency Telemetry', 'Free Cloud Ready'],
      suggestions: [
        'Run hospital health check',
        'Which ICU beds have ventilators?',
        'Check O-Negative blood reserves',
        'Show low stock medicines',
        'Summary for patient Eleanor Harrison'
      ]
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'critical' | 'inventory' | 'operational'>('all');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Live Hospital Knowledge Context
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

  // Compute live proactive suggestions
  const proactiveSuggestions: AISuggestion[] = generateProactiveSuggestions(knowledgeContext);

  const filteredSuggestions = proactiveSuggestions.filter((s) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'critical') return s.severity === 'critical';
    return s.category === selectedCategory;
  });

  // Scroll to bottom on new message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Text to Speech
  const speakText = (text: string) => {
    if (!isSpeechEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#•`_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKey(tempKey);
    localStorage.setItem('pc_ai_key', tempKey);
    localStorage.setItem('pc_ai_provider', aiProvider);
    setShowConfig(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isTyping) return;

    const userMsg: AIChatMessage = {
      id: `USR-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    const historyForPrompt = messages.slice(-6).map((m) => ({
      role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
      content: m.text
    }));

    try {
      const response = await queryRealTimeAICopilot(
        query,
        historyForPrompt,
        knowledgeContext,
        { provider: aiProvider, apiKey }
      );
      setMessages((prev) => [...prev, response]);
      speakText(response.text);
    } catch (e) {
      const fallback = answerHospitalQuery(query, knowledgeContext);
      setMessages((prev) => [...prev, fallback]);
      speakText(fallback.text);
    } finally {
      setIsTyping(false);
    }
  };

  const handlePushNotificationToast = (s: AISuggestion) => {
    addNotification(
      s.severity === 'critical' ? 'critical' : 'warning',
      s.title,
      s.description
    );
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'reset',
        sender: 'assistant',
        text: 'Session history refreshed. PulseAI Copilot is ready for your clinical queries.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        badges: ['Memory Cleared'],
        suggestions: [
          'Run hospital health check',
          'Which ICU beds have ventilators?',
          'Check blood shortages'
        ]
      }
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20 text-teal-300 ring-1 ring-teal-400/40">
                <Bot className="h-5 w-5" />
              </span>
              <span className="rounded-full bg-teal-400/20 px-3 py-0.5 text-xs font-semibold text-teal-200 backdrop-blur-sm border border-teal-300/30">
                Advanced AI Feature #11
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-300 border border-emerald-400/30">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                Live Telemetry Active
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl text-white">
              PulseAI Clinical Copilot & Omniscient Assistant
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl">
              Cross-system healthcare intelligence engine analyzing real-time patient telemetry, bed availability, cold-chain blood reserves, pharmaceutical formulary, and emergency alerts.
            </p>
          </div>

          {/* Quick Stats Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 backdrop-blur-md">
            <div className="text-center px-2">
              <div className="text-xs text-slate-400">Patients</div>
              <div className="text-base font-bold text-teal-300">{patients.length} Live</div>
            </div>
            <div className="text-center px-2 border-l border-slate-700">
              <div className="text-xs text-slate-400">Bed Fleet</div>
              <div className="text-base font-bold text-indigo-300">{beds.length} Total</div>
            </div>
            <div className="text-center px-2 border-l border-slate-700">
              <div className="text-xs text-slate-400">Blood Units</div>
              <div className="text-base font-bold text-rose-300">
                {bloodBank.reduce((a, b) => a + b.unitsAvailable, 0)} Units
              </div>
            </div>
            <div className="text-center px-2 border-l border-slate-700">
              <div className="text-xs text-slate-400">Formularies</div>
              <div className="text-base font-bold text-amber-300">{medicines.length} Meds</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Proactive Suggestions & Live Alert Feeder (4 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                  Proactive AI Suggestions
                </h2>
              </div>
              <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-bold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                {proactiveSuggestions.length} Detected
              </span>
            </div>

            {/* Filter Pills */}
            <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 text-xs">
              {(['all', 'critical', 'inventory', 'operational'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-2.5 py-1 font-medium capitalize transition-all ${
                    selectedCategory === cat
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Suggestion Cards Feed */}
            <div className="mt-3 space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {filteredSuggestions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-400 dark:border-slate-800">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
                  <p className="text-xs font-semibold">All Systems Operating Nominally</p>
                  <p className="text-[11px] text-slate-500 mt-1">No anomalous patterns detected in this category.</p>
                </div>
              ) : (
                filteredSuggestions.map((s) => (
                  <div
                    key={s.id}
                    className={`rounded-xl border p-4 transition-all ${
                      s.severity === 'critical'
                        ? 'border-rose-300 bg-rose-50/60 dark:border-rose-900/60 dark:bg-rose-950/20'
                        : 'border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle
                          className={`h-4 w-4 flex-shrink-0 ${
                            s.severity === 'critical' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
                          }`}
                        />
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {s.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{s.timestamp}</span>
                    </div>

                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {s.description}
                    </p>

                    <div className="mt-2 rounded-lg bg-white/70 p-2 text-[11px] font-medium text-slate-800 dark:bg-slate-900/80 dark:text-slate-200 border border-slate-200/50 dark:border-slate-800/80">
                      💡 <span className="font-semibold text-teal-700 dark:text-teal-400">Action:</span> {s.recommendedAction}
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handlePushNotificationToast(s)}
                        className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        Push Alert Toast
                      </button>

                      {s.targetTab && (
                        <button
                          onClick={() => setActiveTab(s.targetTab!)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 transition-colors"
                        >
                          <span>Open Module</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Chat Console (7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-[650px] rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/70">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
                  <Bot className="h-5 w-5" />
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>PulseAI Real-Time Assistant</span>
                  <span className="rounded bg-teal-100 px-1.5 py-0.5 text-[10px] font-mono font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                    {aiProvider === 'gemini' ? '⚡ Gemini 1.5' : aiProvider === 'openai' ? '🤖 GPT-4o Mini' : '🌟 Free Cloud AI'}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Real-time knowledge of EHR, Beds, Pharmacy, Blood Bank & Doctors + Any Medical Query
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowConfig(!showConfig)}
                title="AI Engine & API Key Settings"
                className={`flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-all ${
                  showConfig || apiKey
                    ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <Key className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">API Settings</span>
              </button>

              <button
                onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
                title={isSpeechEnabled ? 'Disable Voice Audio' : 'Enable Voice Audio'}
                className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
                  isSpeechEnabled
                    ? 'border-teal-500 bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300'
                    : 'border-slate-200 text-slate-400 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800'
                }`}
              >
                {isSpeechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>

              <button
                onClick={handleResetChat}
                title="Reset Conversation"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Config Popover / Dropdown Bar */}
          {showConfig && (
            <div className="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/90 animate-in fade-in duration-150">
              <form onSubmit={handleSaveConfig} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                    <Settings2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    <span>Real-Time AI Model & Key Configuration</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Settings persist in your browser</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setAiProvider('free')}
                    className={`rounded-xl p-2 font-bold transition-all text-center ${
                      aiProvider === 'free'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 dark:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    🌟 Free Cloud AI
                    <div className="text-[10px] font-normal opacity-80">Zero Config / Built-in</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiProvider('gemini')}
                    className={`rounded-xl p-2 font-bold transition-all text-center ${
                      aiProvider === 'gemini'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 dark:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    ⚡ Google Gemini
                    <div className="text-[10px] font-normal opacity-80">1.5 / 2.0 Flash API</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiProvider('openai')}
                    className={`rounded-xl p-2 font-bold transition-all text-center ${
                      aiProvider === 'openai'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 dark:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    🤖 OpenAI
                    <div className="text-[10px] font-normal opacity-80">GPT-4o Mini API</div>
                  </button>
                </div>

                {aiProvider !== 'free' && (
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                      <span>{aiProvider === 'gemini' ? 'Enter Google Gemini API Key' : 'Enter OpenAI API Key'}</span>
                      {aiProvider === 'gemini' && (
                        <a
                          href="https://aistudio.google.com/app/apikey"
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-teal-600 hover:underline dark:text-teal-400"
                        >
                          <span>Get Free Gemini Key (Google AI Studio)</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    <input
                      type="password"
                      value={tempKey}
                      onChange={(e) => setTempKey(e.target.value)}
                      placeholder={aiProvider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-teal-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white font-mono"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowConfig(false)}
                    className="rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-teal-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-teal-700 shadow-xs"
                  >
                    Save & Activate
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Chat Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                    m.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/60 dark:border-slate-700/60'
                  }`}
                >
                  {/* Badges */}
                  {m.badges && m.badges.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {m.badges.map((b, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-teal-500/10 px-1.5 py-0.5 text-[10px] font-mono font-bold text-teal-700 dark:bg-teal-950 dark:text-teal-300 border border-teal-500/20"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Message Body */}
                  <div className="whitespace-pre-wrap">{m.text}</div>

                  {/* Action Shortcut Button */}
                  {m.actionShortcut && (
                    <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                      <button
                        onClick={() => setActiveTab(m.actionShortcut!.targetTab)}
                        className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-teal-700 transition-colors shadow-sm"
                      >
                        <span>{m.actionShortcut.label}</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  {/* Suggestion Chips */}
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                      <div className="text-[10px] font-semibold text-slate-400 mb-1.5">
                        Related suggestions:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {m.suggestions.map((sugg, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendMessage(sugg)}
                            className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-medium text-slate-700 hover:bg-white dark:bg-slate-700/80 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 transition-all shadow-xs"
                          >
                            {sugg}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={`mt-1.5 text-[9px] text-right font-mono ${
                    m.sender === 'user' ? 'text-teal-100' : 'text-slate-400'
                  }`}>
                    {m.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-[11px]">PulseAI synthesizing clinical answer...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Action Prompt Pills */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 flex gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => handleSendMessage('Run hospital health check')}
              className="flex-shrink-0 rounded-lg bg-teal-50 px-2.5 py-1 font-medium text-teal-700 hover:bg-teal-100 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800 transition-colors"
            >
              🏥 Health Check
            </button>
            <button
              onClick={() => handleSendMessage('Which ICU beds are available with ventilators?')}
              className="flex-shrink-0 rounded-lg bg-indigo-50 px-2.5 py-1 font-medium text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-colors"
            >
              🛏️ Ventilator Beds
            </button>
            <button
              onClick={() => handleSendMessage('Check O-Negative blood bank reserves')}
              className="flex-shrink-0 rounded-lg bg-rose-50 px-2.5 py-1 font-medium text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 transition-colors"
            >
              🩸 Blood Reserves
            </button>
            <button
              onClick={() => handleSendMessage('What medicines are low in stock?')}
              className="flex-shrink-0 rounded-lg bg-amber-50 px-2.5 py-1 font-medium text-amber-700 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition-colors"
            >
              💊 Formulary Stock
            </button>
            <button
              onClick={() => handleSendMessage('Who are the on-duty specialists today?')}
              className="flex-shrink-0 rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-colors"
            >
              🩺 Doctors Roster
            </button>
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about patient vitals, ICU beds, medications, doctors, or blood..."
                className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isTyping}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
