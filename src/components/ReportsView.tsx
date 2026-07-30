import React, { useState } from 'react';
import { FileSpreadsheet, Download, Printer, FileText, CheckCircle2, Sparkles } from 'lucide-react';
import { SmartDevice, SensorReading } from '../types';

interface ReportsViewProps {
  devices: SmartDevice[];
  sensors: SensorReading[];
  darkMode: boolean;
  onOpenAiWithPrompt: (prompt: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  devices,
  sensors,
  darkMode,
  onOpenAiWithPrompt
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownloadCsv = () => {
    const headers = ['ID,Name,Type,Room,State,PowerWatts,MqttTopic,LastUpdated\n'];
    const rows = devices.map(d => `${d.id},"${d.name}",${d.type},"${d.room}",${d.isOn ? 'ON' : 'OFF'},${d.powerWatts},"${d.mqttTopic}","${d.lastUpdated}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smarthome_devices_report_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    
    setDownloadSuccess('CSV Export downloaded successfully!');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handlePrintPdfReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">System Reports & Data Export</h1>
          <p className="text-xs text-slate-400">Generate downloadable CSV telemetry logs and printable PDF audit summaries</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>

          <button
            onClick={handlePrintPdfReport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs hover:bg-slate-700 transition-all"
          >
            <Printer className="w-4 h-4" />
            Print PDF Report
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Printable Report Document Card */}
      <div className={`p-8 rounded-3xl border space-y-6 ${
        darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-indigo-400">AI SMART HOME IOT EXECUTIVE SUMMARY</h2>
            <p className="text-xs text-slate-400">Audit Date: {new Date().toLocaleDateString()} • System ID: NEXUS-8829</p>
          </div>
          <FileText className="w-8 h-8 text-indigo-400" />
        </div>

        {/* Section 1: Devices Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Device Network Telemetry</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-700/60 text-slate-400">
                  <th className="p-2">Device Name</th>
                  <th className="p-2">Room</th>
                  <th className="p-2">State</th>
                  <th className="p-2">Power Draw</th>
                  <th className="p-2">MQTT Channel</th>
                </tr>
              </thead>
              <tbody>
                {devices.map(d => (
                  <tr key={d.id} className="border-b border-slate-800/40 hover:bg-slate-700/20">
                    <td className="p-2 font-bold">{d.name}</td>
                    <td className="p-2 text-slate-400">{d.room}</td>
                    <td className="p-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        d.isOn ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/40 text-slate-400'
                      }`}>
                        {d.isOn ? 'Active' : 'Standby'}
                      </span>
                    </td>
                    <td className="p-2 font-mono text-cyan-400">{d.powerWatts} W</td>
                    <td className="p-2 font-mono text-slate-400 text-[10px]">{d.mqttTopic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Sensor Health */}
        <div className="space-y-3 pt-4 border-t border-slate-700/50">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Sensor Environmental Matrix</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {sensors.map(s => (
              <div key={s.id} className="p-3 rounded-2xl bg-slate-900/60 border border-slate-700/50 text-xs">
                <p className="font-bold text-slate-200">{s.name}</p>
                <p className="text-lg font-extrabold text-cyan-400 mt-1">{s.value} <span className="text-[10px] text-slate-400">{s.unit}</span></p>
                <p className="text-[10px] text-slate-400 mt-0.5">{s.location}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
