import React from 'react';
import { ShieldAlert, Lock, Siren, PhoneCall, X, CheckCircle2 } from 'lucide-react';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLockAll: () => void;
  onSoundSiren: () => void;
}

export const SosModal: React.FC<SosModalProps> = ({
  isOpen,
  onClose,
  onLockAll,
  onSoundSiren
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border-2 border-rose-600 shadow-2xl text-slate-100 space-y-6 text-center relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-full bg-rose-600/20 text-rose-500 border-2 border-rose-500 flex items-center justify-center mx-auto animate-bounce">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-rose-500 tracking-tight">EMERGENCY SOS LOCKDOWN</h2>
          <p className="text-xs text-slate-300 mt-1">
            Immediate high-priority home defense procedure initiated.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => { onLockAll(); alert('All smart locks engaged and curtains closed!'); }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-extrabold text-sm shadow-lg shadow-rose-600/40 hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            LOCKDOWN ALL DOORS & GARAGE
          </button>

          <button
            onClick={() => { onSoundSiren(); alert('Emergency Siren Siren activated!'); }}
            className="w-full py-3 rounded-2xl bg-amber-600 text-white font-extrabold text-sm shadow-lg shadow-amber-600/40 hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Siren className="w-4 h-4" />
            SOUND EMERGENCY ALARM SIREN
          </button>

          <button
            onClick={() => alert('Simulating emergency call to local emergency dispatcher (911)...')}
            className="w-full py-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-200 font-extrabold text-sm hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            CALL EMERGENCY SERVICES (911)
          </button>
        </div>

        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-200 underline pt-2"
        >
          Disarm & Cancel SOS State
        </button>

      </div>
    </div>
  );
};
