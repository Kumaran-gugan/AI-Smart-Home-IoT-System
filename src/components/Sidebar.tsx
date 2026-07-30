import React from 'react';
import { 
  LayoutDashboard, 
  Sliders, 
  Gauge, 
  Zap, 
  Workflow, 
  ShieldCheck, 
  Bot, 
  Mic, 
  CloudSun, 
  FileSpreadsheet, 
  Settings2,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, darkMode }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: 'Live' },
    { id: 'devices', label: 'Device Control', icon: Sliders, badge: '16 Devs' },
    { id: 'sensors', label: 'Sensors Telemetry', icon: Gauge, badge: '16 Sensors' },
    { id: 'energy', label: 'Energy Analytics', icon: Zap, badge: 'KWh' },
    { id: 'automations', label: 'Automation Rules', icon: Workflow, badge: '5 Rules' },
    { id: 'security', label: 'Security Center', icon: ShieldCheck, badge: '4 Cams' },
    { id: 'gemini', label: 'Gemini AI Assistant', icon: Bot, badge: 'AI 3.6' },
    { id: 'voice', label: 'Voice Commands', icon: Mic, badge: 'Speech' },
    { id: 'weather', label: 'Weather Forecast', icon: CloudSun, badge: '22°C' },
    { id: 'reports', label: 'Reports & Export', icon: FileSpreadsheet, badge: 'PDF/CSV' },
    { id: 'admin', label: 'Admin & MQTT Code', icon: Settings2, badge: 'ESP32' },
  ];

  return (
    <aside className={`w-full md:w-64 flex-shrink-0 border-r transition-colors ${
      darkMode ? 'bg-[#020617]/90 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
    }`}>
      <div className="p-4 space-y-1 overflow-x-auto md:overflow-y-auto max-h-[calc(100vh-4rem)]">
        <p className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 hidden md:block">
          Main Navigation
        </p>

        <div className="flex md:flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20'
                    : darkMode
                    ? 'hover:bg-slate-800/80 hover:text-slate-100'
                    : 'hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                  <span>{item.label}</span>
                </div>

                <div className="hidden lg:flex items-center gap-1">
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold uppercase ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className={`w-3 h-3 opacity-50 ${isActive ? 'inline' : 'hidden group-hover:inline'}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick System Health Box */}
        <div className={`hidden md:block mt-6 p-3.5 rounded-2xl border ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-slate-400">System Telemetry</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Optimal
            </span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">MQTT Broker:</span>
              <span className="font-mono text-indigo-400">broker.emqx.io</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Latency:</span>
              <span className="font-mono text-emerald-400">14 ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Gemini AI:</span>
              <span className="font-mono text-purple-400">Active</span>
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
};
