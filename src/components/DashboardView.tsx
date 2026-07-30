import React, { useState } from 'react';
import { 
  Zap, 
  Thermometer, 
  Sliders, 
  ShieldCheck, 
  Activity, 
  Power, 
  Lock, 
  Sparkles, 
  ArrowUpRight, 
  Droplets, 
  Wind, 
  AlertTriangle,
  Play,
  Volume2
} from 'lucide-react';
import { SmartDevice, SensorReading, SystemAlert, WeatherData } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardViewProps {
  devices: SmartDevice[];
  sensors: SensorReading[];
  alerts: SystemAlert[];
  weather: WeatherData;
  darkMode: boolean;
  onToggleDevice: (id: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenAiWithPrompt: (prompt: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  devices,
  sensors,
  alerts,
  weather,
  darkMode,
  onToggleDevice,
  onNavigateTab,
  onOpenAiWithPrompt
}) => {
  const [selectedRoom, setSelectedRoom] = useState<string>('All');

  const rooms = ['All', 'Living Room', 'Master Bedroom', 'Kitchen', 'Garden', 'Garage'];

  const activeDevices = devices.filter(d => d.isOn);
  const totalPowerWatts = activeDevices.reduce((acc, d) => acc + d.powerWatts, 0);

  const tempSensor = sensors.find(s => s.type === 'temperature');
  const humiditySensor = sensors.find(s => s.type === 'humidity');
  const aqiSensor = sensors.find(s => s.type === 'air_quality');

  const filteredDevices = selectedRoom === 'All' 
    ? devices 
    : devices.filter(d => d.room.toLowerCase().includes(selectedRoom.toLowerCase()));

  // Sample power trend data
  const powerTrendData = [
    { time: '00:00', watts: 450 },
    { time: '04:00', watts: 280 },
    { time: '08:00', watts: 1400 },
    { time: '12:00', watts: 2100 },
    { time: '16:00', watts: 1850 },
    { time: '20:00', watts: totalPowerWatts },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner & AI Quick Insight */}
      <div className={`p-6 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-slate-500/10 border-slate-200'
      }`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                AI Smart Home Overview
              </span>
              <span className="text-xs text-slate-400">Updated Real-Time</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
              Welcome Back, <span className="text-indigo-400">Alex</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Your IoT network is running smooth. {activeDevices.length} devices are active consuming {totalPowerWatts}W. Gemini AI detected no critical system anomalies.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenAiWithPrompt('How much electricity am I using right now and how can I save?')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              Ask AI Assistant
            </button>
            <button
              onClick={() => onNavigateTab('security')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-bold transition-all ${
                darkMode ? 'bg-slate-900/60 border-slate-800 text-emerald-400 hover:bg-slate-800' : 'bg-white border-slate-200 text-emerald-600 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Security Armed
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Active Power */}
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Power Load</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold">{totalPowerWatts} <span className="text-xs font-medium text-slate-400">Watts</span></p>
            <p className="text-xs text-emerald-400 mt-1 font-medium">~$0.18 / hr cost</p>
          </div>
        </div>

        {/* Temperature */}
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Room Temp</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold">{tempSensor?.value || 24.5} <span className="text-xs font-medium text-slate-400">°C</span></p>
            <p className="text-xs text-slate-400 mt-1">Target AC: 23°C</p>
          </div>
        </div>

        {/* Humidity & AQI */}
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Humidity / AQI</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold">{humiditySensor?.value || 52}%</p>
            <p className="text-xs text-emerald-400 mt-1">Air Quality: {aqiSensor?.value || 28} AQI (Good)</p>
          </div>
        </div>

        {/* Devices Active */}
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Devices</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Sliders className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold">{activeDevices.length} / {devices.length}</p>
            <p className="text-xs text-indigo-400 mt-1">16 Nodes Connected</p>
          </div>
        </div>

      </div>

      {/* Main Grid: Power Graph & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Realtime Power Trend */}
        <div className={`lg:col-span-2 p-5 sm:p-6 rounded-3xl border ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">Live Power Demand (Watts)</h2>
              <p className="text-xs text-slate-400">MQTT telemetry stream recorded over 24 hrs</p>
            </div>
            <button 
              onClick={() => onNavigateTab('energy')}
              className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1"
            >
              Full Analytics <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={powerTrendData}>
                <defs>
                  <linearGradient id="powerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke={darkMode ? '#64748b' : '#94a3b8'} fontSize={11} />
                <YAxis stroke={darkMode ? '#64748b' : '#94a3b8'} fontSize={11} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                    borderColor: darkMode ? '#1e293b' : '#e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="watts" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#powerGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions & Scene Mode */}
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h2 className="text-lg font-bold">Quick Automation Scenes</h2>
          <p className="text-xs text-slate-400">Trigger pre-set Smart Home profiles with 1 click</p>

          <div className="space-y-2.5">
            <button
              onClick={() => {
                devices.forEach(d => { if (d.category === 'lighting') onToggleDevice(d.id); });
              }}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition-all ${
                darkMode ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Power className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-sm">Night Cinema Mode</p>
                  <p className="text-[10px] text-slate-400">Dim lights, close curtains, TV on</p>
                </div>
              </div>
              <Play className="w-4 h-4 text-indigo-400" />
            </button>

            <button
              onClick={() => {
                devices.forEach(d => { if (d.isOn && d.category !== 'security') onToggleDevice(d.id); });
              }}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition-all ${
                darkMode ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-sm">Leaving Home Mode</p>
                  <p className="text-[10px] text-slate-400">Turn off all, arm security & locks</p>
                </div>
              </div>
              <Play className="w-4 h-4 text-rose-400" />
            </button>

            <button
              onClick={() => onNavigateTab('gemini')}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition-all ${
                darkMode ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-sm">Ask AI Eco Optimization</p>
                  <p className="text-[10px] text-slate-400">Let Gemini suggest power saves</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-purple-400" />
            </button>
          </div>
        </div>

      </div>

      {/* Device Filter & Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">Devices Overview</h2>
            <p className="text-xs text-slate-400">Direct remote toggle and MQTT channel controls</p>
          </div>

          {/* Room Pill Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {rooms.map(room => (
              <button
                key={room}
                onClick={() => setSelectedRoom(room)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedRoom === room
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : darkMode
                    ? 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {room}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredDevices.map(dev => (
            <div
              key={dev.id}
              className={`p-4 rounded-2xl border transition-all relative overflow-hidden group ${
                dev.isOn
                  ? darkMode 
                    ? 'bg-indigo-600/10 border-indigo-500/30' 
                    : 'bg-indigo-50 border-indigo-300'
                  : darkMode 
                    ? 'bg-slate-900/40 border-slate-800 opacity-80' 
                    : 'bg-slate-50 border-slate-200 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{dev.room}</span>
                  <h3 className="font-bold text-sm text-slate-100 group-hover:text-indigo-400 transition-colors">{dev.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{dev.powerWatts}W consumption</p>
                </div>

                <button
                  onClick={() => onToggleDevice(dev.id)}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                    dev.isOn 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' 
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Power className="w-4 h-4" />
                </button>
              </div>

              {dev.value !== undefined && dev.isOn && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Setting:</span>
                  <span className="font-bold text-indigo-400">{dev.value} {dev.type === 'ac' ? '°C' : '%'}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
