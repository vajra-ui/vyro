import React from 'react';
import { useOperationalStore } from '../../stores/operationalStore';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Heart, 
  RotateCcw, 
  Sparkles, 
  Award, 
  X,
  ExternalLink
} from 'lucide-react';

export const FinalSuccessModal: React.FC = () => {
  const { 
    isFinalSuccessModalOpen, 
    closeFinalSuccessModal, 
    resetSimulation, 
    setPrimaryViewMode 
  } = useOperationalStore();

  if (!isFinalSuccessModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 font-sans select-none">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#0d1c38] via-[#091326] to-[#060c18] border-2 border-emerald-500/70 rounded-3xl shadow-2xl p-6 sm:p-8 text-center text-slate-100 overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Success Emblem */}
        <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/30">
          <ShieldCheck className="w-10 h-10 text-emerald-400 animate-pulse" />
        </div>

        {/* Three Verification Badges */}
        <div className="space-y-2.5 max-w-md mx-auto mb-8 font-mono">
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center space-x-2 text-emerald-300 font-extrabold text-sm shadow-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>✓ RESCUE COMPLETED</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center space-x-2 text-emerald-300 font-extrabold text-sm shadow-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>✓ FAMILY REUNITED</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center space-x-2 text-emerald-300 font-extrabold text-sm shadow-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>✓ CASE VERIFIED</span>
          </div>
        </div>

        {/* Brand & Mission Statement */}
        <div className="mb-8">
          <div className="text-3xl font-black tracking-widest text-white uppercase mb-1">
            VYRO
          </div>
          <div className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-3">
            VIGILANT RESCUE OPERATIONS
          </div>
          <p className="text-sm text-slate-300 font-mono italic mb-4">
            "From First SOS to Final Reunion"
          </p>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-cyan-200">
            <strong>Disasters create chaos. VYRO creates continuity.</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 font-mono text-xs">
          <button
            onClick={() => {
              closeFinalSuccessModal();
              setPrimaryViewMode('3D_TWIN');
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <span>RETURN TO 3D CITY TWIN</span>
          </button>
          <button
            onClick={() => {
              resetSimulation();
              closeFinalSuccessModal();
              setPrimaryViewMode('COMMAND_CENTER');
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESET SCENARIO DEMO</span>
          </button>
        </div>
      </div>
    </div>
  );
};
