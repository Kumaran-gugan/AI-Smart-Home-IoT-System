import React, { useState } from 'react';
import { 
  Zap, 
  DollarSign, 
  TrendingUp, 
  Sparkles, 
  Sun, 
  PieChart as PieIcon, 
  Lightbulb, 
  BarChart3,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SmartDevice } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  LineChart, 
  Line 
} from 'recharts';

interface EnergyViewProps {
  devices: SmartDevice[];
  darkMode: boolean;
  onOpenAiWithPrompt: (prompt: string) => void;
}

export const EnergyView: React.FC<EnergyViewProps> = ({ devices, darkMode, onOpenAiWithPrompt }) => {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const activeWatts = devices.filter(d => d.isOn).reduce((acc, d) => acc + d.powerWatts, 0);
  const estDailyKwh = ((activeWatts * 14) / 1000).toFixed(1); // 14 avg hours
  const estMonthlyKwh = (Number(estDailyKwh) * 30).toFixed(0);
  const estMonthlyCost = (Number(estMonthlyKwh) * 0.15).toFixed(2); // $0.15 / kWh tariff

  // Weekly data
  const weeklyEnergyData = [
    { day: 'Mon', kwh: 18.2, cost: 2.73, solar: 6.5 },
    { day: 'Tue', kwh: 22.4, cost: 3.36, solar: 8.0 },
    { day: 'Wed', kwh: 19.8, cost: 2.97, solar: 7.2 },
    { day: 'Thu', kwh: 24.1, cost: 3.61, solar: 5.8 },
    { day: 'Fri', kwh: 21.0, cost: 3.15, solar: 8.4 },
    { day: 'Sat', kwh: 28.5, cost: 4.27, solar: 9.1 },
    { day: 'Sun', kwh: 25.3, cost: 3.79, solar: 8.8 },
  ];

  // Appliance category breakdown
  const categoryData = [
    { name: 'EV Charger', watts: 3200, color: '#06b6d4' },
    { name: 'Master AC', watts: 1200, color: '#3b82f6' },
    { name: 'Water Pump', watts: 750, color: '#10b981' },
    { name: 'OLED TV & Audio', watts: 240, color: '#8b5cf6' },
    { name: 'Lighting', watts: 150, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Energy Management & Cost Predictor</h1>
          <p className="text-xs text-slate-400">Track power consumption, solar offset, peak hours, and AI bill optimization</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenAiWithPrompt('Predict my monthly electricity bill and give me 3 specific energy saving tips for my active devices.')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            AI Bill Prediction Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Est. Daily Usage</span>
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-extrabold mt-2">{estDailyKwh} <span className="text-xs font-semibold text-slate-400">kWh</span></p>
          <p className="text-xs text-emerald-400 mt-1">18% lower than neighborhood avg</p>
        </div>

        <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Est. Monthly Bill</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold mt-2">${estMonthlyCost}</p>
          <p className="text-xs text-slate-400 mt-1">Based on $0.15 / kWh rate</p>
        </div>

        <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Solar Roof Offset</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold mt-2">53.8 <span className="text-xs font-semibold text-slate-400">kWh</span></p>
          <p className="text-xs text-amber-400 mt-1">Saved ~$8.07 this week</p>
        </div>

        <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Peak Hours Alert</span>
            <TrendingUp className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-extrabold mt-2 text-rose-400">2 PM - 7 PM</p>
          <p className="text-xs text-slate-400 mt-1">Shift heavy loads to morning</p>
        </div>

      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Energy Consumption Bar Chart */}
        <div className={`lg:col-span-2 p-6 rounded-3xl border ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">Weekly kWh Consumption vs Solar Yield</h2>
              <p className="text-xs text-slate-400">Net grid import vs rooftop solar production</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-indigo-400 font-bold">
                <span className="w-3 h-3 rounded bg-indigo-500" /> Grid kWh
              </span>
              <span className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                <span className="w-3 h-3 rounded bg-amber-400" /> Solar kWh
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyEnergyData}>
                <XAxis dataKey="day" stroke={darkMode ? '#64748b' : '#94a3b8'} fontSize={11} />
                <YAxis stroke={darkMode ? '#64748b' : '#94a3b8'} fontSize={11} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                    borderColor: darkMode ? '#1e293b' : '#e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="kwh" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="solar" fill="#fbbf24" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appliance Consumption Breakdown */}
        <div className={`p-6 rounded-3xl border space-y-4 ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
          <h2 className="text-lg font-bold">Appliance Power Load (Watts)</h2>
          <p className="text-xs text-slate-400">Current load by active equipment</p>

          <div className="space-y-3">
            {categoryData.map(cat => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{cat.name}</span>
                  <span className="font-mono text-indigo-400">{cat.watts} W</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(cat.watts / 3200) * 100}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 p-3 rounded-2xl bg-indigo-500/10 border-indigo-500/30 text-xs text-indigo-300">
            <p className="font-bold">⚡ AI Power Tip:</p>
            <p className="mt-1">EV Charger accounts for ~58% of total power draw. Scheduling charge sessions after 11:00 PM will reduce rate to $0.09/kWh.</p>
          </div>
        </div>

      </div>

    </div>
  );
};
