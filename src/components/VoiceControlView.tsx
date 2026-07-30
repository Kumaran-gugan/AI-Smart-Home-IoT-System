import React, { useState } from 'react';
import { Mic, MicOff, Volume2, CheckCircle2, Play, Power, Lock, Warehouse, Tv, Music } from 'lucide-react';
import { SmartDevice } from '../types';

interface VoiceControlViewProps {
  devices: SmartDevice[];
  darkMode: boolean;
  onToggleDevice: (id: string) => void;
  onSetDevice: (id: string, updates: Partial<SmartDevice>) => void;
}

export const VoiceControlView: React.FC<VoiceControlViewProps> = ({
  devices,
  darkMode,
  onToggleDevice,
  onSetDevice
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceLogs, setVoiceLogs] = useState<{ id: string; command: string; actionText: string; time: string }[]>([
    { id: '1', command: 'Turn on bedroom light', actionText: 'Command Executed: Master Bed Ambient Light set to ON', time: '10:12 AM' },
    { id: '2', command: 'Lock main door', actionText: 'Command Executed: Smart Front Door Lock engaged', time: '09:45 AM' },
  ]);

  const quickVoiceCommands = [
    'Turn on bedroom light',
    'Turn off AC',
    'Lock main door',
    'Open garage',
    'Switch on TV',
    'Play music',
  ];

  const handleExecuteVoiceCommand = (cmdText: string) => {
    setTranscript(cmdText);
    setIsListening(false);

    let actionText = `Command Received: "${cmdText}" - Device state updated.`;
    const lower = cmdText.toLowerCase();

    if (lower.includes('bedroom light')) {
      const dev = devices.find(d => d.name.toLowerCase().includes('bed'));
      if (dev) { onToggleDevice(dev.id); actionText = `Executed: Toggled ${dev.name}`; }
    } else if (lower.includes('ac')) {
      const dev = devices.find(d => d.type === 'ac');
      if (dev) { onToggleDevice(dev.id); actionText = `Executed: Toggled ${dev.name}`; }
    } else if (lower.includes('lock') || lower.includes('door')) {
      const dev = devices.find(d => d.type === 'door_lock');
      if (dev) { onToggleDevice(dev.id); actionText = `Executed: Front Door Lock status updated`; }
    } else if (lower.includes('garage')) {
      const dev = devices.find(d => d.type === 'garage_door');
      if (dev) { onToggleDevice(dev.id); actionText = `Executed: Toggled Garage Door`; }
    } else if (lower.includes('tv')) {
      const dev = devices.find(d => d.type === 'tv');
      if (dev) { onToggleDevice(dev.id); actionText = `Executed: Smart TV state toggled`; }
    } else if (lower.includes('music')) {
      const dev = devices.find(d => d.type === 'music_system');
      if (dev) { onToggleDevice(dev.id); actionText = `Executed: Spatial Audio playing Chillout`; }
    }

    setVoiceLogs(prev => [
      { id: Date.now().toString(), command: cmdText, actionText, time: new Date().toLocaleTimeString() },
      ...prev
    ]);
  };

  const startSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech Recognition is not supported in this browser environment. You can click any quick voice command chip below!');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    setIsListening(true);
    rec.start();

    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      handleExecuteVoiceCommand(text);
    };

    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Hands-Free Voice Control Assistant</h1>
        <p className="text-xs text-slate-400">Speak natural commands to control lighting, climate, security locks, and media</p>
      </div>

      {/* Voice Visualizer Box */}
      <div className={`p-8 rounded-3xl border flex flex-col items-center justify-center text-center space-y-6 ${
        darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <button
          onClick={startSpeechRecognition}
          className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-2xl transition-all relative ${
            isListening
              ? 'bg-gradient-to-r from-rose-500 to-red-600 shadow-rose-500/50 scale-110 animate-pulse'
              : 'bg-gradient-to-tr from-indigo-600 to-indigo-700 shadow-indigo-500/30 hover:scale-105'
          }`}
        >
          {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
        </button>

        <div>
          <h2 className="text-lg font-bold">
            {isListening ? 'Listening for voice command...' : 'Tap Mic to Speak Command'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {transcript ? `Recognized: "${transcript}"` : 'Try saying: "Turn on bedroom light" or "Lock main door"'}
          </p>
        </div>

        {/* Audio Wave Simulation */}
        {isListening && (
          <div className="flex items-center gap-1.5 h-8">
            {[40, 80, 60, 100, 70, 90, 50, 85].map((h, i) => (
              <div 
                key={i} 
                className="w-1.5 bg-indigo-400 rounded-full animate-bounce" 
                style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Voice Command Chips */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-400">Click to Simulate Voice Commands:</h3>
        <div className="flex flex-wrap gap-2">
          {quickVoiceCommands.map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => handleExecuteVoiceCommand(cmd)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all flex items-center gap-2 ${
                darkMode
                  ? 'bg-slate-900/60 border-slate-800 text-slate-200 hover:border-indigo-500 hover:text-indigo-400'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-600'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
              "{cmd}"
            </button>
          ))}
        </div>
      </div>

      {/* Voice Activity Logs */}
      <div className={`p-5 rounded-3xl border space-y-3 ${
        darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <h3 className="text-sm font-bold">Recent Voice Execution History</h3>
        <div className="space-y-2">
          {voiceLogs.map(log => (
            <div key={log.id} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-indigo-400">"{log.command}"</p>
                <p className="text-[11px] text-slate-300">{log.actionText}</p>
              </div>
              <span className="text-[10px] text-slate-500">{log.time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
