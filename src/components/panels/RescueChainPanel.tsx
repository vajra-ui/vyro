import React from 'react';
import { useOperationalStore } from '../../stores/operationalStore';
import { VictimCase, RescueChainStage, RescueChainStageId } from '../../types/vyro';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  MapPin, 
  UserCheck, 
  Activity, 
  ArrowRight,
  Sparkles,
  Building2,
  PhoneCall
} from 'lucide-react';

interface RescueChainPanelProps {
  victimCase: VictimCase;
}

export const RescueChainPanel: React.FC<RescueChainPanelProps> = ({ victimCase }) => {
  const { rescueChains, advanceRescueChain, triggerFlyTo } = useOperationalStore();
  const chain = rescueChains[victimCase.id];

  if (!chain) {
    return (
      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
        Initializing Rescue Chain ledger for {victimCase.id}...
      </div>
    );
  }

  const stages = chain.stages;

  const handleStageClick = (st: RescueChainStage) => {
    if (st.coordinates) {
      triggerFlyTo({
        coordinates: st.coordinates,
        zoom: 17,
        pitch: 62,
        bearing: -20
      });
    }
  };

  return (
    <div className="space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5 font-mono text-xs font-bold text-slate-200">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>RESCUE CHAIN INTELLIGENCE</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
          {stages.filter((s) => s.status === 'VERIFIED').length} / {stages.length} VERIFIED
        </span>
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed">
        Full human journey ledger: Every critical handoff is cryptographically tracked with time, actor, location, and telemetry evidence.
      </p>

      {/* Visual Vertical Timeline */}
      <div className="space-y-2 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800 pl-1">
        {stages.map((st, idx) => {
          const isVerified = st.status === 'VERIFIED';
          const isInProgress = st.status === 'IN_PROGRESS';
          const isChainBreak = st.status === 'CHAIN_BREAK';

          return (
            <div
              key={st.stageId}
              onClick={() => handleStageClick(st)}
              className={`group cursor-pointer relative flex items-start space-x-3 p-2 rounded-lg border transition text-xs ${
                isChainBreak
                  ? 'bg-amber-950/30 border-amber-500/60 shadow-lg'
                  : isVerified
                  ? 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  : isInProgress
                  ? 'bg-sky-950/20 border-sky-500/40'
                  : 'bg-slate-950/40 border-slate-900 opacity-60'
              }`}
            >
              {/* Badge Icon */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border z-10 transition ${
                  isChainBreak
                    ? 'bg-amber-500 border-white text-slate-950 font-black animate-bounce'
                    : isVerified
                    ? 'bg-emerald-600 border-emerald-400 text-white'
                    : isInProgress
                    ? 'bg-sky-600 border-sky-400 text-white animate-pulse'
                    : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}
              >
                {isChainBreak ? (
                  <span>!</span>
                ) : isVerified ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <span className="text-[9px] font-mono">{idx + 1}</span>
                )}
              </div>

              {/* Stage Telemetry Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between font-mono">
                  <span
                    className={`font-bold text-xs truncate ${
                      isChainBreak
                        ? 'text-amber-300'
                        : isVerified
                        ? 'text-slate-200'
                        : isInProgress
                        ? 'text-sky-300'
                        : 'text-slate-500'
                    }`}
                  >
                    {st.label}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase border ${
                      isChainBreak
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : isVerified
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : isInProgress
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                        : 'bg-slate-900 text-slate-500 border-slate-800'
                    }`}
                  >
                    {st.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {st.timestamp && (
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{st.timestamp}</span>
                    {st.actor && <span>• {st.actor}</span>}
                  </div>
                )}

                {st.locationName && (
                  <div className="text-[10px] text-slate-400 flex items-center space-x-1 mt-0.5 truncate">
                    <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate">{st.locationName}</span>
                  </div>
                )}

                {st.evidence && (
                  <div className="text-[10px] font-mono text-cyan-300 bg-slate-950/80 p-1.5 rounded border border-slate-800 mt-1 leading-tight">
                    Evidence: {st.evidence}
                  </div>
                )}

                {st.notes && (
                  <div className="text-[10px] font-mono text-amber-300/90 bg-amber-950/20 p-1.5 rounded border border-amber-900/40 mt-1 leading-tight">
                    {st.notes}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
