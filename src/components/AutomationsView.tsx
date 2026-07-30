import React, { useState } from 'react';
import { 
  Workflow, 
  Plus, 
  Trash2, 
  Power, 
  Zap, 
  Flame, 
  CloudRain, 
  Thermometer, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Play
} from 'lucide-react';
import { AutomationRule, SmartDevice, SensorReading } from '../types';

interface AutomationsViewProps {
  automations: AutomationRule[];
  devices: SmartDevice[];
  sensors: SensorReading[];
  darkMode: boolean;
  onToggleAutomation: (id: string) => void;
  onCreateAutomation: (rule: Partial<AutomationRule>) => void;
  onDeleteAutomation: (id: string) => void;
  onOpenAiWithPrompt: (prompt: string) => void;
}

export const AutomationsView: React.FC<AutomationsViewProps> = ({
  automations,
  devices,
  sensors,
  darkMode,
  onToggleAutomation,
  onCreateAutomation,
  onDeleteAutomation,
  onOpenAiWithPrompt
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [selectedSensorId, setSelectedSensorId] = useState(sensors[0]?.id || '');
  const [condition, setCondition] = useState<'>' | '<' | '==' | '!='>('>');
  const [threshold, setThreshold] = useState<number>(30);
  const [selectedDeviceId, setSelectedDeviceId] = useState(devices[0]?.id || '');
  const [action, setAction] = useState<'turn_on' | 'turn_off' | 'set_value' | 'trigger_alarm'>('turn_on');

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    const sens = sensors.find(s => s.id === selectedSensorId);
    const dev = devices.find(d => d.id === selectedDeviceId);

    onCreateAutomation({
      name: ruleName || `${sens?.name} ${condition} ${threshold} -> ${dev?.name}`,
      sensorId: selectedSensorId,
      sensorName: sens?.name || 'Sensor',
      condition,
      threshold,
      targetDeviceId: selectedDeviceId,
      targetDeviceName: dev?.name || 'Device',
      action,
      enabled: true
    });

    setShowCreateModal(false);
    setRuleName('');
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Automation Engine & IF-THEN Rules</h1>
          <p className="text-xs text-slate-400">Configure autonomous edge execution rules triggered directly by sensor updates</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenAiWithPrompt('Suggest 3 smart automation rules for my home to improve comfort and security.')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 font-bold text-xs hover:bg-purple-600/30 transition-all"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            AI Rule Assistant
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Rule
          </button>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {automations.map(rule => (
          <div
            key={rule.id}
            className={`p-5 rounded-3xl border transition-all space-y-4 ${
              rule.enabled
                ? darkMode
                  ? 'bg-indigo-600/10 border-indigo-500/30'
                  : 'bg-indigo-50 border-indigo-300'
                : darkMode
                ? 'bg-slate-900/40 border-slate-800 opacity-60'
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${rule.enabled ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>
                  <Workflow className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-100">{rule.name}</h3>
                  <p className="text-[10px] text-slate-400">Last Triggered: {rule.lastTriggered || 'Never'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleAutomation(rule.id)}
                  className={`w-10 h-6 rounded-full transition-all relative p-0.5 ${
                    rule.enabled ? 'bg-indigo-600' : 'bg-slate-800 border border-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    rule.enabled ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>

                <button
                  onClick={() => onDeleteAutomation(rule.id)}
                  className="p-1.5 rounded-xl hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual IF-THEN Chain */}
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-indigo-400">IF</span>
                <span className="font-semibold text-slate-200">{rule.sensorName}</span>
                <span className="font-mono text-amber-400">{rule.condition} {rule.threshold}</span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-500 hidden sm:block" />

              <div className="flex items-center gap-2">
                <span className="font-extrabold text-emerald-400">THEN</span>
                <span className="font-semibold text-slate-200">{rule.targetDeviceName}</span>
                <span className="uppercase font-bold text-xs text-indigo-400">[{rule.action.replace('_', ' ')}]</span>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Modal for Rule Builder */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl space-y-4 ${
            darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <h2 className="text-xl font-extrabold">Build IF-THEN Automation Rule</h2>
            
            <form onSubmit={handleSaveRule} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400">Rule Name</label>
                <input
                  type="text"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  placeholder="e.g. Turn on Fan if Temp > 30°C"
                  className="w-full mt-1 p-2.5 text-xs rounded-xl border bg-slate-900/60 border-slate-700 text-slate-100 outline-none focus:border-cyan-500"
                />
              </div>

              {/* IF Section */}
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-3">
                <p className="text-xs font-extrabold text-cyan-400">IF (Trigger Sensor)</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <select
                      value={selectedSensorId}
                      onChange={(e) => setSelectedSensorId(e.target.value)}
                      className="w-full p-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200"
                    >
                      {sensors.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.location})</option>
                      ))}
                    </select>
                  </div>

                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="p-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-mono"
                  >
                    <option value=">">&gt; (Greater)</option>
                    <option value="<">&lt; (Less)</option>
                    <option value="==">== (Equals)</option>
                    <option value="!=">!= (Not Equal)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400">Threshold Value</label>
                  <input
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-full p-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-mono"
                  />
                </div>
              </div>

              {/* THEN Section */}
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                <p className="text-xs font-extrabold text-emerald-400">THEN (Target Device Action)</p>
                <select
                  value={selectedDeviceId}
                  onChange={(e) => setSelectedDeviceId(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200"
                >
                  {devices.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.room})</option>
                  ))}
                </select>

                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value as any)}
                  className="w-full p-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200 uppercase font-bold"
                >
                  <option value="turn_on">Turn ON</option>
                  <option value="turn_off">Turn OFF</option>
                  <option value="trigger_alarm">Trigger Security Siren</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-700 text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 hover:bg-cyan-400"
                >
                  Save Automation Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
