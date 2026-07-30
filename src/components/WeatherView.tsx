import React from 'react';
import { CloudSun, Sun, CloudRain, Wind, Droplets, Compass, Sparkles, ShieldCheck } from 'lucide-react';
import { WeatherData, SmartDevice } from '../types';

interface WeatherViewProps {
  weather: WeatherData;
  devices: SmartDevice[];
  darkMode: boolean;
  onOpenAiWithPrompt: (prompt: string) => void;
}

export const WeatherView: React.FC<WeatherViewProps> = ({
  weather,
  devices,
  darkMode,
  onOpenAiWithPrompt
}) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Weather & Environmental Station</h1>
          <p className="text-xs text-slate-400">Live meteorological forecast integrated with automated climate & curtain controls</p>
        </div>

        <button
          onClick={() => onOpenAiWithPrompt('How should I adjust my home AC and window drapery based on today weather forecast?')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-bold text-xs hover:bg-indigo-600/30 transition-all self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          AI Weather Climate Advice
        </button>
      </div>

      {/* Main Weather Card */}
      <div className={`p-8 rounded-3xl border relative overflow-hidden ${
        darkMode ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border-slate-800' : 'bg-gradient-to-br from-indigo-600 to-indigo-800 text-white border-transparent'
      }`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">{weather.city}</span>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <CloudSun className="w-16 h-16 text-amber-400 animate-bounce" />
              <div>
                <h2 className="text-5xl font-extrabold tracking-tight">{weather.tempC}°C</h2>
                <p className="text-sm font-semibold opacity-90">{weather.condition}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
            <div className="p-3 rounded-2xl bg-black/30 backdrop-blur-md text-center border border-white/10">
              <Droplets className="w-4 h-4 text-indigo-300 mx-auto" />
              <p className="text-xs font-bold mt-1">{weather.humidity}%</p>
              <p className="text-[10px] opacity-70">Humidity</p>
            </div>

            <div className="p-3 rounded-2xl bg-black/30 backdrop-blur-md text-center border border-white/10">
              <Wind className="w-4 h-4 text-indigo-300 mx-auto" />
              <p className="text-xs font-bold mt-1">{weather.windKmH} km/h</p>
              <p className="text-[10px] opacity-70">Wind Speed</p>
            </div>

            <div className="p-3 rounded-2xl bg-black/30 backdrop-blur-md text-center border border-white/10">
              <Sun className="w-4 h-4 text-amber-300 mx-auto" />
              <p className="text-xs font-bold mt-1">UV {weather.uvIndex}</p>
              <p className="text-[10px] opacity-70">Moderate</p>
            </div>

            <div className="p-3 rounded-2xl bg-black/30 backdrop-blur-md text-center border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-300 mx-auto" />
              <p className="text-xs font-bold mt-1">{weather.airQuality}</p>
              <p className="text-[10px] opacity-70">Balcony AQI</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast Grid */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold">5-Day Local Forecast</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {weather.forecast.map((day, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border text-center space-y-2 ${
                darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <span className="text-xs font-extrabold text-indigo-400 uppercase">{day.day}</span>
              <CloudSun className="w-6 h-6 text-amber-400 mx-auto" />
              <p className="text-lg font-extrabold">{day.tempC}°C</p>
              <p className="text-[10px] text-slate-400">{day.condition}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
