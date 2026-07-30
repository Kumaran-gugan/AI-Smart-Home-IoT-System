import React, { useState } from 'react';
import { 
  Lightbulb, 
  Wind, 
  Thermometer, 
  Lock, 
  Unlock, 
  Warehouse, 
  Blinds, 
  Droplet, 
  Plug, 
  Tv, 
  Music, 
  Coffee, 
  Fan, 
  Siren, 
  ShowerHead,
  Power,
  Sliders,
  Sparkles,
  Palette,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { SmartDevice, DeviceCategory } from '../types';

interface DeviceControlViewProps {
  devices: SmartDevice[];
  darkMode: boolean;
  onToggleDevice: (id: string) => void;
  onSetDevice: (id: string, updates: Partial<SmartDevice>) => void;
  onOpenAiWithPrompt: (prompt: string) => void;
}

export const DeviceControlView: React.FC<DeviceControlViewProps> = ({
  devices,
  darkMode,
  onToggleDevice,
  onSetDevice,
  onOpenAiWithPrompt
}) => {
  const [selectedCategory, setSelectedCategory] = useState<DeviceCategory | 'all'>('all');
  const [brewingStatus, setBrewingStatus] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Devices' },
    { id: 'lighting', label: 'Lighting' },
    { id: 'climate', label: 'Climate' },
    { id: 'security', label: 'Security' },
    { id: 'appliances', label: 'Appliances' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'outdoors', label: 'Outdoors' },
  ];

  const filteredDevices = selectedCategory === 'all' 
    ? devices 
    : devices.filter(d => d.category === selectedCategory);

  const getDeviceIcon = (type: SmartDevice['type']) => {
    switch (type) {
      case 'light':
      case 'garden_light': return Lightbulb;
      case 'fan': return Wind;
      case 'ac': return Thermometer;
      case 'door_lock': return Lock;
      case 'garage_door': return Warehouse;
      case 'curtain': return Blinds;
      case 'water_pump': return Droplet;
      case 'smart_plug': return Plug;
      case 'tv': return Tv;
      case 'music_system': return Music;
      case 'coffee_machine': return Coffee;
      case 'air_purifier': return Fan;
      case 'alarm': return Siren;
      case 'sprinkler': return ShowerHead;
      default: return Sliders;
    }
  };

  const handleBrewCoffee = (devId: string) => {
    setBrewingStatus('Grinding beans & brewing fresh Espresso...');
    setTimeout(() => {
      setBrewingStatus('Coffee is ready! Enjoy your fresh brew.');
      setTimeout(() => setBrewingStatus(null), 4000);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Smart Home Control Panel</h1>
          <p className="text-xs text-slate-400">16 Full-featured IoT device nodes with real-time MQTT payload state sync</p>
        </div>

        <button
          onClick={() => onOpenAiWithPrompt('How can I automate my devices based on my daily routine?')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 font-bold text-xs hover:bg-purple-600/30 transition-all self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          AI Routine Recommendations
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : darkMode
                ? 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Coffee brewing toast */}
      {brewingStatus && (
        <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-2 animate-bounce">
          <Coffee className="w-5 h-5 animate-spin" />
          <span>{brewingStatus}</span>
        </div>
      )}

      {/* Device Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevices.map(dev => {
          const Icon = getDeviceIcon(dev.type);

          return (
            <div
              key={dev.id}
              className={`p-5 rounded-3xl border transition-all space-y-4 ${
                dev.isOn
                  ? darkMode
                    ? 'bg-indigo-600/10 border-indigo-500/30 shadow-lg shadow-indigo-500/5'
                    : 'bg-indigo-50 border-indigo-300 shadow-md'
                  : darkMode
                    ? 'bg-slate-900/40 border-slate-800 opacity-80'
                    : 'bg-slate-50 border-slate-200 opacity-80'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${
                    dev.isOn 
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                      : 'bg-slate-800/60 text-slate-400 border border-slate-700/60'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{dev.room}</span>
                    <h3 className="font-bold text-base text-slate-100">{dev.name}</h3>
                    <p className="text-[11px] text-slate-400">{dev.powerWatts}W • {dev.mqttTopic}</p>
                  </div>
                </div>

                <button
                  onClick={() => onToggleDevice(dev.id)}
                  className={`p-3 rounded-2xl font-bold text-xs transition-all ${
                    dev.isOn
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Power className="w-4 h-4" />
                </button>
              </div>

              {/* Type-Specific Interactive Controls */}
              {dev.isOn && (
                <div className="pt-3 border-t border-slate-800/80 space-y-3">
                  
                  {/* Light / RGB controls */}
                  {(dev.type === 'light' || dev.type === 'garden_light') && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-400">Brightness</span>
                        <span className="text-indigo-400">{dev.value || 80}%</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={dev.value || 80}
                        onChange={(e) => onSetDevice(dev.id, { value: Number(e.target.value) })}
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                      {dev.type === 'garden_light' && (
                        <div className="flex items-center gap-2 pt-1">
                          <Palette className="w-4 h-4 text-slate-400" />
                          <span className="text-xs text-slate-400">Color Palette:</span>
                          <input
                            type="color"
                            value={dev.color || '#2a9d8f'}
                            onChange={(e) => onSetDevice(dev.id, { color: e.target.value })}
                            className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Fan Controls */}
                  {dev.type === 'fan' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-400">Fan Speed Level</span>
                        <span className="text-indigo-400">Speed {dev.value || 3} / 5</span>
                      </div>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map(spd => (
                          <button
                            key={spd}
                            onClick={() => onSetDevice(dev.id, { value: spd })}
                            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              dev.value === spd 
                                ? 'bg-cyan-500 text-white shadow-md' 
                                : 'bg-slate-700/40 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {spd}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AC Climate Controls */}
                  {dev.type === 'ac' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">Target Temp</span>
                        <span className="text-xl font-extrabold text-cyan-400">{dev.value || 23}°C</span>
                      </div>
                      <input
                        type="range"
                        min="16"
                        max="30"
                        value={dev.value || 23}
                        onChange={(e) => onSetDevice(dev.id, { value: Number(e.target.value) })}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                      <div className="flex gap-1.5">
                        {['cool', 'heat', 'fan', 'auto'].map(m => (
                          <button
                            key={m}
                            onClick={() => onSetDevice(dev.id, { mode: m })}
                            className={`flex-1 py-1 text-[10px] font-extrabold uppercase rounded-lg transition-all ${
                              dev.mode === m ? 'bg-cyan-500 text-white' : 'bg-slate-700/40 text-slate-400'
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Smart TV / Entertainment Controls */}
                  {dev.type === 'tv' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-400">Volume Level</span>
                        <span className="text-cyan-400">{dev.value || 30}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={dev.value || 30}
                        onChange={(e) => onSetDevice(dev.id, { value: Number(e.target.value) })}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                      <p className="text-[11px] text-slate-400">Input Source: <span className="font-bold text-slate-200">{dev.mode || 'HDMI 1'}</span></p>
                    </div>
                  )}

                  {/* Coffee Machine */}
                  {dev.type === 'coffee_machine' && (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-400">Selected Roast: <span className="font-bold text-amber-400 capitalize">{dev.mode || 'espresso'}</span></p>
                      <button
                        onClick={() => handleBrewCoffee(dev.id)}
                        className="w-full py-2 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-600/30 hover:bg-amber-500 transition-all flex items-center justify-center gap-2"
                      >
                        <Coffee className="w-4 h-4" />
                        Brew Fresh Coffee Now
                      </button>
                    </div>
                  )}

                  {/* Curtains Position */}
                  {dev.type === 'curtain' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-400">Curtain Open State</span>
                        <span className="text-cyan-400">{dev.value || 70}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={dev.value || 70}
                        onChange={(e) => onSetDevice(dev.id, { value: Number(e.target.value) })}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                    </div>
                  )}

                  {/* Sprinklers / Water Pump */}
                  {(dev.type === 'sprinkler' || dev.type === 'water_pump') && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Auto-timer:</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> 15 Min Cycle Active
                      </span>
                    </div>
                  )}

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
