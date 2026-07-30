import React, { useState } from 'react';
import { 
  Bell, 
  ShieldAlert, 
  CloudSun, 
  UserCheck, 
  Search, 
  Moon, 
  Sun, 
  Wifi, 
  CheckCircle2, 
  AlertTriangle,
  X,
  Volume2
} from 'lucide-react';
import { SystemAlert, UserProfile, WeatherData } from '../types';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeUser: UserProfile;
  users: UserProfile[];
  setActiveUser: (u: UserProfile) => void;
  alerts: SystemAlert[];
  weather: WeatherData;
  onTriggerSos: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  activeUser,
  users,
  setActiveUser,
  alerts,
  weather,
  onTriggerSos,
  activeTab,
  setActiveTab
}) => {
  const [showAlertsDrawer, setShowAlertsDrawer] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadAlertsCount = alerts.filter(a => !a.read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('device') || q.includes('light') || q.includes('ac')) setActiveTab('devices');
    else if (q.includes('sensor') || q.includes('temp') || q.includes('gas')) setActiveTab('sensors');
    else if (q.includes('energy') || q.includes('power') || q.includes('bill')) setActiveTab('energy');
    else if (q.includes('rule') || q.includes('automation')) setActiveTab('automations');
    else if (q.includes('cam') || q.includes('security') || q.includes('lock')) setActiveTab('security');
    else if (q.includes('ai') || q.includes('gemini') || q.includes('ask')) setActiveTab('gemini');
    else setActiveTab('devices');
  };

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
      darkMode ? 'bg-[#020617]/80 border-slate-800 text-slate-100' : 'bg-white/80 border-slate-200 text-slate-800'
    }`}>
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        
        {/* Left: Brand & Network Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 font-bold text-xl">
            <Wifi className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">
                NEXUS IoT
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                MQTT Online
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Professional AI Smart Home Core</p>
          </div>
        </div>

        {/* Center: Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center max-w-md w-full mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search devices, sensors, rules, AI..."
              className={`w-full pl-9 pr-4 py-2 text-sm rounded-xl border outline-none transition-all ${
                darkMode 
                  ? 'bg-slate-900/60 border-slate-800 text-slate-200 focus:border-indigo-500' 
                  : 'bg-slate-100 border-slate-300 text-slate-800 focus:border-indigo-600'
              }`}
            />
          </div>
        </form>

        {/* Right: Actions, Weather, Alerts, User Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Weather Widget */}
          <button 
            onClick={() => setActiveTab('weather')}
            className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              darkMode ? 'bg-slate-800/60 border-slate-700 hover:bg-slate-800' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <CloudSun className="w-4 h-4 text-amber-400" />
            <span>{weather.city}: {weather.tempC}°C</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-xl border transition-all ${
              darkMode ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
            title="Toggle Light/Dark Mode"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowAlertsDrawer(!showAlertsDrawer)}
              className={`relative p-2 rounded-xl border transition-all ${
                darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Bell className="w-4 h-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Alerts Popover */}
            {showAlertsDrawer && (
              <div className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border shadow-2xl p-4 z-50 transition-all ${
                darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Active Home Alerts ({alerts.length})</span>
                  </div>
                  <button onClick={() => setShowAlertsDrawer(false)} className="text-slate-400 hover:text-slate-200">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
                  {alerts.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No active system alerts.</p>
                  ) : (
                    alerts.map(a => (
                      <div key={a.id} className={`p-3 rounded-xl border text-xs space-y-1 ${
                        a.severity === 'danger' ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' :
                        a.severity === 'warning' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' :
                        'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                      }`}>
                        <div className="flex items-center justify-between font-semibold">
                          <span>{a.title}</span>
                          <span className="text-[10px] opacity-70">{a.timestamp}</span>
                        </div>
                        <p className="opacity-90">{a.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Emergency SOS Button */}
          <button
            onClick={onTriggerSos}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold text-xs shadow-lg shadow-rose-600/30 hover:brightness-110 active:scale-95 transition-all"
          >
            <ShieldAlert className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">SOS LOCK</span>
          </button>

          {/* User Profile Selector */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className={`flex items-center gap-2 p-1.5 pl-2 rounded-xl border transition-all ${
                darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <img src={activeUser.avatar} alt={activeUser.name} className="w-6 h-6 rounded-full object-cover border border-cyan-400" />
              <span className="text-xs font-semibold hidden md:inline">{activeUser.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-extrabold bg-cyan-500/20 text-cyan-400 hidden lg:inline">
                {activeUser.role}
              </span>
            </button>

            {showUserDropdown && (
              <div className={`absolute right-0 mt-2 w-56 rounded-2xl border shadow-xl p-2 z-50 ${
                darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                <div className="px-3 py-2 text-xs font-bold border-b border-slate-700/40 text-slate-400">
                  Switch Active User
                </div>
                <div className="mt-1 space-y-1">
                  {users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => { setActiveUser(u); setShowUserDropdown(false); }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                        u.id === activeUser.id 
                          ? 'bg-cyan-500/20 text-cyan-400 font-bold' 
                          : 'hover:bg-slate-700/40'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                        <div className="text-left">
                          <p>{u.name}</p>
                          <p className="text-[10px] text-slate-400 capitalize">{u.role}</p>
                        </div>
                      </div>
                      {u.id === activeUser.id && <UserCheck className="w-4 h-4 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
