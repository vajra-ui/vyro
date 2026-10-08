import React, { useState } from 'react';
import { useOperationalStore } from '../../stores/operationalStore';
import { 
  AlertTriangle, 
  ShieldAlert, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  X, 
  PhoneCall, 
  Radio, 
  Building2,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const ChainBreakModal: React.FC = () => {
  const {
    chainBreaks,
    isChainBreakModalOpen,
    resolveChainBreak,
    triggerFlyTo,
    selectEntity
  } = useOperationalStore();

  const [activeAlertIndex, setActiveAlertIndex] = useState(0);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // We show unverified chain breaks
  const activeAlerts = chainBreaks.filter((cb) => !cb.isResolved);
  const currentAlert = activeAlerts[activeAlertIndex] || chainBreaks[0];

  if (!isChainBreakModalOpen && activeAlerts.length === 0) return null;

  // If modal is not explicitly open, show the persistent tactical emergency banner on top
  if (!isChainBreakModalOpen) {
    if (activeAlerts.length === 0) return null;
    return (
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl px-4 pointer-events-auto animate-bounce">
        <div
          onClick={() => {
            useOperationalStore.setState({ isChainBreakModalOpen: true });
            selectEntity('VICTIM', currentAlert.caseId);
          }}
          className="cursor-pointer bg-gradient-to-r from-amber-950 via-rose-950 to-amber-950 border-2 border-amber-500 rounded-xl px-4 py-2.5 shadow-2xl flex items-center justify-between text-xs font-mono text-amber-200 backdrop-blur-md"
        >
          <div className="flex items-center space-x-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse shrink-0" />
            <div>
              <div className="font-bold text-amber-300 flex items-center space-x-1.5">
                <span>⚠ RESCUE CHAIN BREAK DETECTED</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-100 border border-amber-400">
                  {currentAlert.caseId}
                </span>
              </div>
              <div className="text-[10px] text-slate-300 font-sans">
                {currentAlert.missingConfirmation} • Tap to investigate
              </div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold text-[10px] uppercase shadow hover:bg-amber-400 transition">
            INVESTIGATE
          </span>
        </div>
      </div>
    );
  }

  const handleResolve = () => {
    setIsVerifying(true);
    setTimeout(() => {
      resolveChainBreak(currentAlert.id, resolutionNotes || 'ER Staff confirmed patient intake and bed allocation.');
      setIsVerifying(false);
      useOperationalStore.setState({ isChainBreakModalOpen: false });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-xl bg-[#0b0e1a] border-2 border-amber-500/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 border-b border-amber-500/50 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 shadow animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-black text-amber-200 tracking-wider">
                ⚠ RESCUE CHAIN BREAK DETECTED
              </h2>
              <div className="text-[11px] text-slate-400 font-mono">
                Automated Handoff Integrity Engine • Incident Verification Required
              </div>
            </div>
          </div>
          <button
            onClick={() => useOperationalStore.setState({ isChainBreakModalOpen: false })}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 text-xs font-sans">
          {/* Main Anomaly Alert Box */}
          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-2">
            <div className="flex items-center justify-between font-mono text-amber-300 font-bold">
              <span>ANOMALY TELEMETRY BREAK</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                {currentAlert.risk} RISK
              </span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed font-sans">
              The Rescue Chain detected a critical missing confirmation between emergency responders. A transfer was declared by field responders, but the downstream facility has not registered admission.
            </p>
          </div>

          {/* Structured Telemetry Matrix */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 font-mono text-[11px]">
            <div className="flex justify-between border-b border-slate-800 pb-1.5">
              <span className="text-slate-400">CASE IDENTIFIER:</span>
              <strong className="text-cyan-300">{currentAlert.caseId}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1.5">
              <span className="text-slate-400">LAST VERIFIED STAGE:</span>
              <strong className="text-slate-200">{currentAlert.lastVerifiedStage}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1.5">
              <span className="text-slate-400">LAST VERIFIED LOCATION:</span>
              <span className="text-slate-300 text-right">{currentAlert.lastVerifiedLocation}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1.5">
              <span className="text-slate-400">RESPONSIBLE TEAM:</span>
              <strong className="text-sky-300">{currentAlert.responsibleTeam}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1.5">
              <span className="text-slate-400">EXPECTED NEXT STAGE:</span>
              <strong className="text-amber-300">{currentAlert.expectedNextStage}</strong>
            </div>
            <div className="flex justify-between pt-0.5">
              <span className="text-slate-400">MISSING CONFIRMATION:</span>
              <span className="text-rose-400 font-bold">{currentAlert.missingConfirmation}</span>
            </div>
          </div>

          {/* Recommended Action */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
              RECOMMENDED COMMANDER ACTION:
            </div>
            <p className="text-slate-200 text-xs leading-relaxed font-sans">
              {currentAlert.recommendedAction}
            </p>
            <div className="text-[10px] text-slate-500 font-mono italic">
              * Note: AI must never declare death or disappearance automatically. Human confirmation required.
            </div>
          </div>

          {/* Direct Hotlines */}
          <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
            <a
              href="tel:1077"
              className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 flex items-center justify-between text-slate-300 hover:text-white transition"
            >
              <div className="flex items-center space-x-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                <span>GENERAL ER DESK</span>
              </div>
              <span className="text-cyan-400 font-bold">CALL</span>
            </a>
            <button
              onClick={() => {
                selectEntity('VICTIM', currentAlert.caseId);
                useOperationalStore.setState({ isChainBreakModalOpen: false });
              }}
              className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 flex items-center justify-between text-slate-300 hover:text-white transition"
            >
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>FLY 3D TO SCENE</span>
              </div>
              <span className="text-amber-400 font-bold">VIEW</span>
            </button>
          </div>

          {/* Resolution Input */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase">
              COMMANDER RESOLUTION / VERIFICATION NOTES:
            </label>
            <textarea
              rows={2}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="e.g. Verbal confirmation from ER Dr. George. Patient admitted to Trauma Bay 3."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 placeholder:text-slate-500 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => useOperationalStore.setState({ isChainBreakModalOpen: false })}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs transition"
          >
            DISMISS ALERT
          </button>

          <button
            onClick={handleResolve}
            disabled={isVerifying}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isVerifying ? 'VERIFYING...' : 'CONFIRM & RESOLVE CHAIN BREAK'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
