import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  Zap, 
  Thermometer, 
  AlertTriangle, 
  HelpCircle, 
  Wrench, 
  Clock, 
  User, 
  Copy, 
  Check,
  RefreshCw
} from 'lucide-react';

interface GeminiAiViewProps {
  darkMode: boolean;
  initialPrompt?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
}

export const GeminiAiView: React.FC<GeminiAiViewProps> = ({ darkMode, initialPrompt }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'gemini',
      text: "👋 **Hello Alex!** I am your **Google Gemini AI Smart Home Intelligence Core**.\n\nI have real-time visibility over your **16 IoT devices**, **16 sensors**, **energy usage**, and **security feeds**. Ask me anything, or pick a prompt below!",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (initialPrompt) {
      handleSendPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const promptChips = [
    { label: '⚡ How much electricity am I using?', query: 'How much electricity am I using right now across all my devices?' },
    { label: '💡 Suggest energy saving tips', query: 'Suggest 3 high-impact energy saving tips based on my active devices.' },
    { label: '🌡️ Why is my room too hot?', query: 'Why is my room too hot right now according to my temperature and HVAC sensors?' },
    { label: '❄️ Should I turn on the AC?', query: 'Should I turn on the Master Bedroom AC right now?' },
    { label: '💵 Predict electricity bill', query: 'Predict my electricity bill for this month based on my usage rate.' },
    { label: '⚡ Recommend automation routines', query: 'Recommend 3 automation routines to optimize my home.' },
    { label: '🚨 Detect abnormal sensor values', query: 'Scan all 16 sensors for abnormal values or thresholds.' },
    { label: '🔔 Explain recent alerts', query: 'Explain the recent system alerts and recommend actions.' },
    { label: '🛠️ Troubleshoot IoT devices', query: 'How do I troubleshoot an offline or flickering MQTT device?' },
    { label: '📅 Maintenance reminders', query: 'Generate a smart maintenance checklist for my HVAC and water tank.' },
  ];

  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `gem-${Date.now()}`,
        sender: 'gemini',
        text: data.answer || 'No response from Gemini server.',
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `gem-err-${Date.now()}`,
          sender: 'gemini',
          text: '⚠️ **Network / Server Error**: Unable to reach Gemini AI backend service.',
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech Recognition API is not supported in this browser. Please type your query.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    if (!isListening) {
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      setIsListening(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-extrabold tracking-tight">Google Gemini AI Core Assistant</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Powered by @google/genai `gemini-3.6-flash` model with live home telemetry grounding</p>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendPrompt(chip.query)}
            disabled={loading}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              darkMode 
                ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-indigo-500 hover:text-indigo-300' 
                : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-600'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className={`p-4 sm:p-6 rounded-3xl border shadow-xl space-y-4 min-h-[450px] max-h-[550px] overflow-y-auto flex flex-col ${
        darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 max-w-3xl ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            <div className={`w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xs ${
              msg.sender === 'user'
                ? 'bg-cyan-500 shadow-md shadow-cyan-500/30'
                : 'bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-md shadow-purple-600/30'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
            </div>

            <div className={`p-4 rounded-2xl text-xs sm:text-sm space-y-2 relative group ${
              msg.sender === 'user'
                ? 'bg-indigo-600 text-white font-medium rounded-tr-none shadow-md shadow-indigo-500/20'
                : darkMode
                ? 'bg-slate-900/60 border border-slate-800 text-slate-200 rounded-tl-none'
                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
            }`}>
              {/* Message text with formatting */}
              <div className="prose prose-invert max-w-none text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                {msg.text}
              </div>

              <div className="flex items-center justify-between text-[10px] opacity-60 pt-1">
                <span>{msg.timestamp}</span>
                {msg.sender === 'gemini' && (
                  <button
                    onClick={() => copyToClipboard(msg.id, msg.text)}
                    className="hover:opacity-100 flex items-center gap-1"
                  >
                    {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-xs font-bold text-purple-400 p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 w-fit">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Gemini AI is querying telemetry & formatting insight...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={(e) => { e.preventDefault(); handleSendPrompt(inputQuery); }} className="relative">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask Gemini AI about energy, room temp, automations, device fixes..."
          disabled={loading}
          className={`w-full pl-4 pr-24 py-3.5 text-sm rounded-2xl border outline-none transition-all shadow-lg ${
            darkMode
              ? 'bg-slate-800/90 border-slate-700 text-slate-100 focus:border-purple-500'
              : 'bg-white border-slate-300 text-slate-800 focus:border-purple-600'
          }`}
        />

        <div className="absolute right-2 top-2 flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-2 rounded-xl transition-all ${
              isListening ? 'bg-rose-500 text-white animate-pulse' : 'text-slate-400 hover:text-purple-400'
            }`}
            title="Voice Speech Input"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            type="submit"
            disabled={loading || !inputQuery.trim()}
            className="p-2 rounded-xl bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30 hover:bg-purple-500 disabled:opacity-50 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

    </div>
  );
};
