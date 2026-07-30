import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Camera, 
  Lock, 
  Unlock, 
  Fingerprint, 
  Scan, 
  Siren, 
  AlertTriangle, 
  KeyRound, 
  CheckCircle2, 
  Eye, 
  Video,
  ShieldAlert
} from 'lucide-react';
import { SecurityCamera, SmartDevice } from '../types';

interface SecurityViewProps {
  cameras: SecurityCamera[];
  devices: SmartDevice[];
  darkMode: boolean;
  onToggleDevice: (id: string) => void;
  onTriggerSos: () => void;
}

export const SecurityView: React.FC<SecurityViewProps> = ({
  cameras,
  devices,
  darkMode,
  onToggleDevice,
  onTriggerSos
}) => {
  const [faceScanActive, setFaceScanActive] = useState(false);
  const [faceScanVerified, setFaceScanVerified] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinVerified, setPinVerified] = useState(false);

  const mainDoorLock = devices.find(d => d.type === 'door_lock');
  const alarmSiren = devices.find(d => d.type === 'alarm');

  const handleSimulateFaceScan = () => {
    setFaceScanActive(true);
    setFaceScanVerified(false);
    setTimeout(() => {
      setFaceScanActive(false);
      setFaceScanVerified(true);
      setTimeout(() => setFaceScanVerified(false), 4000);
    }, 2500);
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput === '9999') {
      setPinVerified(true);
      setTimeout(() => { setPinVerified(false); setPinInput(''); }, 3000);
    } else {
      alert('Incorrect Security PIN. Please enter 1234 or 9999.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Security & AI Surveillance Suite</h1>
          <p className="text-xs text-slate-400">Live CCTV feeds, Biometric/Face recognition, Emergency SOS, Intruder AI detection</p>
        </div>

        <button
          onClick={onTriggerSos}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 hover:scale-105 transition-all self-start md:self-auto animate-pulse"
        >
          <ShieldAlert className="w-5 h-5" />
          TRIGGER SOS EMERGENCY
        </button>
      </div>

      {/* 4-Cam CCTV Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Video className="w-5 h-5 text-indigo-400" />
            Live CCTV Feeds (4 Camera Channels)
          </h2>
          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            4 Channels Recording 1080p
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cameras.map(cam => (
            <div
              key={cam.id}
              className={`relative rounded-3xl overflow-hidden border shadow-lg group ${
                darkMode ? 'border-slate-800 bg-slate-900/40' : 'border-slate-300 bg-black'
              }`}
            >
              {/* Image stream simulation */}
              <img 
                src={cam.streamUrl} 
                alt={cam.name} 
                className="w-full h-52 object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* Top camera badge */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs font-bold">
                <span className="px-2.5 py-1 rounded-xl bg-black/60 text-white backdrop-blur-md flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-indigo-400" />
                  {cam.name}
                </span>

                {cam.motionDetected ? (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold uppercase animate-bounce">
                    Motion Detected
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/80 text-white text-[10px] font-extrabold uppercase">
                    Live
                  </span>
                )}
              </div>

              {/* Bottom camera info */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 font-mono">
                <span>Location: {cam.location}</span>
                <span>REC 🔴 60 FPS</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Controls & Biometric Auth Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Face Recognition Scanner */}
        <div className={`p-6 rounded-3xl border space-y-4 ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Scan className="w-5 h-5 text-indigo-400" />
              AI Face Recognition Lock
            </h2>
            <span className="text-xs text-slate-400">Front Door Cam</span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
            {faceScanActive ? (
              <div className="space-y-2">
                <Scan className="w-12 h-12 text-indigo-400 animate-spin mx-auto" />
                <p className="text-xs font-bold text-indigo-400 animate-pulse">Analyzing Facial Embeddings...</p>
              </div>
            ) : faceScanVerified ? (
              <div className="space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <p className="text-xs font-extrabold text-emerald-400">Access Granted: Alex Rivera</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Scan className="w-12 h-12 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-400">Position face in front of smart doorbell camera</p>
              </div>
            )}
          </div>

          <button
            onClick={handleSimulateFaceScan}
            disabled={faceScanActive}
            className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-500/20 hover:bg-indigo-500 transition-all"
          >
            Simulate Face Scan Check
          </button>
        </div>

        {/* PIN Authentication & Smart Door Lock */}
        <div className={`p-6 rounded-3xl border space-y-4 ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-400" />
              PIN & Lock Override
            </h2>
            <span className="text-xs text-slate-400">PIN: 1234</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2">
              {mainDoorLock?.isOn ? <Lock className="w-5 h-5 text-emerald-400" /> : <Unlock className="w-5 h-5 text-rose-400" />}
              <div>
                <p className="text-xs font-bold">Front Door Lock</p>
                <p className="text-[10px] text-slate-400">{mainDoorLock?.isOn ? 'LOCKED' : 'UNLOCKED'}</p>
              </div>
            </div>

            <button
              onClick={() => mainDoorLock && onToggleDevice(mainDoorLock.id)}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 font-bold text-xs hover:bg-cyan-500/30"
            >
              Toggle Lock
            </button>
          </div>

          <form onSubmit={handleVerifyPin} className="space-y-2">
            <input
              type="password"
              maxLength={4}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter 4-digit security PIN"
              className="w-full p-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-center tracking-widest font-mono"
            />
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-amber-500 text-slate-900 font-extrabold text-xs hover:bg-amber-400 transition-all"
            >
              Verify PIN
            </button>
          </form>

          {pinVerified && (
            <p className="text-xs font-bold text-emerald-400 text-center">✓ PIN Verified Successfully!</p>
          )}
        </div>

        {/* Siren Alarm Control */}
        <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${
          darkMode ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Siren className="w-5 h-5 text-rose-400" />
              Siren & Armed State
            </h2>
            <span className="text-xs text-rose-400 font-bold">ARMED AWAY</span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-2">
            <p className="font-extrabold">🚨 Intruder Alert Active:</p>
            <p className="text-[11px] opacity-90">All 16 sensors and 4 CCTV feeds are synced to auto-sound siren on motion or gas anomaly.</p>
          </div>

          <button
            onClick={() => alarmSiren && onToggleDevice(alarmSiren.id)}
            className={`w-full py-3 rounded-2xl font-extrabold text-xs transition-all ${
              alarmSiren?.isOn
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40 animate-pulse'
                : 'bg-slate-700/40 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {alarmSiren?.isOn ? 'SILENCE ALARM SIREN NOW' : 'TEST SIREN ALARM'}
          </button>
        </div>

      </div>

    </div>
  );
};
