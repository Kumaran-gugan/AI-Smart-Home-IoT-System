import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Flame, 
  Wind, 
  Eye, 
  Compass, 
  Ruler, 
  Sun, 
  Waves, 
  Sprout, 
  DoorClosed, 
  CloudRain, 
  CloudFog, 
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { SensorReading } from '../types';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SensorsViewProps {
  sensors: SensorReading[];
  darkMode: boolean;
  onOpenAiWithPrompt: (prompt: string) => void;
}

export const SensorsView: React.FC<SensorsViewProps> = ({ sensors, darkMode, onOpenAiWithPrompt }) => {

  const getSensorIcon = (type: SensorReading['type']) => {
    switch (type) {
      case 'temperature': return Thermometer;
      case 'humidity': return Droplets;
      case 'gas':
      case 'smoke': return CloudFog;
      case 'flame': return Flame;
      case 'motion': return Eye;
      case 'ir': return Compass;
      case 'ultrasonic': return Ruler;
      case 'light': return Sun;
      case 'water_level': return Waves;
      case 'soil_moisture': return Sprout;
      case 'door':
      case 'window': return DoorClosed;
      case 'rain': return CloudRain;
      case 'air_quality':
      case 'co2': return Wind;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">IoT Sensors & Live Telemetry</h1>
          <p className="text-xs text-slate-400">16 Environmental & Safety telemetry sensors streaming via MQTT 5.0 protocol</p>
        </div>

        <button
          onClick={() => onOpenAiWithPrompt('Analyze my sensor readings and check if there are any environmental hazards or anomalies.')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-bold text-xs hover:bg-indigo-600/30 transition-all self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          AI Anomaly Diagnostic
        </button>
      </div>

      {/* Grid of 16 Sensors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sensors.map(sens => {
          const Icon = getSensorIcon(sens.type);
          
          return (
            <div
              key={sens.id}
              className={`p-5 rounded-3xl border transition-all space-y-3 ${
                sens.status === 'critical'
                  ? 'bg-rose-500/10 border-rose-500/50 text-rose-200'
                  : sens.status === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-200'
                  : darkMode
                  ? 'bg-slate-900/40 border-slate-800'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2.5 rounded-2xl ${
                    sens.status === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                    sens.status === 'critical' ? 'bg-rose-500/20 text-rose-400' :
                    'bg-indigo-500/20 text-indigo-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-100">{sens.name}</h3>
                    <p className="text-[10px] text-slate-400">{sens.location}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  sens.status === 'critical' ? 'bg-rose-500 text-white' :
                  sens.status === 'warning' ? 'bg-amber-500 text-slate-900' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {sens.status}
                </span>
              </div>

              {/* Value display */}
              <div className="pt-2">
                <p className="text-2xl font-extrabold">
                  {sens.value} <span className="text-xs font-semibold text-slate-400">{sens.unit}</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-1">Updated {sens.updatedAt}</p>
              </div>

              {/* Sparkline chart history */}
              {sens.history && sens.history.length > 0 && (
                <div className="h-10 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sens.history}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={sens.status === 'warning' ? '#f59e0b' : '#6366f1'} 
                        strokeWidth={2} 
                        dot={false} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
