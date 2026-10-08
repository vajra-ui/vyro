import React from 'react';
import { useOperationalStore } from '../../stores/operationalStore';
import { RescueContinuityStage } from '../../types/vyro';
import { 
  User, 
  Radio, 
  MapPin, 
  Sparkles, 
  Shield, 
  LifeBuoy, 
  Stethoscope, 
  Building2, 
  Home, 
  Users2,
  CheckCircle2
} from 'lucide-react';

interface StageMeta {
  id: RescueContinuityStage;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  whatHappensNext: string;
  detail: string;
}

const STAGES: StageMeta[] = [
  {
    id: 'PERSON',
    label: 'PERSON',
    shortLabel: 'PERSON',
    icon: User,
    whatHappensNext: 'SOS signal transmitted through multi-channel relay',
    detail: 'Citizen in need'
  },
  {
    id: 'SIGNAL',
    label: 'SIGNAL',
    shortLabel: 'SIGNAL',
    icon: Radio,
    whatHappensNext: 'Telemetry gathered; fallback chain resolving position',
    detail: 'Encrypted packet broadcast'
  },
  {
    id: 'LOCATION',
    label: 'LOCATION',
    shortLabel: 'LOC',
    icon: MapPin,
    whatHappensNext: 'AI triage analyzing hazard proximity and priority',
    detail: 'Accuracy ±4.2m GPS'
  },
  {
    id: 'AI',
    label: 'AI TRIAGE',
    shortLabel: 'AI',
    icon: Sparkles,
    whatHappensNext: 'Selecting best rescue team and specialized vehicle',
    detail: 'Urgency scored 94/100'
  },
  {
    id: 'RESPONDER',
    label: 'RESPONDER',
    shortLabel: 'UNIT',
    icon: Shield,
    whatHappensNext: 'Rescue Alpha deploying vehicle R-07 en route',
    detail: 'Assigned: Rescue Alpha'
  },
  {
    id: 'RESCUE',
    label: 'RESCUE',
    shortLabel: 'RESCUE',
    icon: LifeBuoy,
    whatHappensNext: 'Winch extrication and transfer to paramedic unit',
    detail: 'In progress / En Route'
  },
  {
    id: 'MEDICAL',
    label: 'MEDICAL',
    shortLabel: 'MEDIC',
    icon: Stethoscope,
    whatHappensNext: 'Pre-arrival dispatch packet sent ahead to hospital',
    detail: 'ALS stabilization'
  },
  {
    id: 'HOSPITAL',
    label: 'HOSPITAL',
    shortLabel: 'HOSP',
    icon: Building2,
    whatHappensNext: 'Post-treatment transition to safe relief shelter',
    detail: 'Bed 14A allocated'
  },
  {
    id: 'SHELTER',
    label: 'SHELTER',
    shortLabel: 'SHELTER',
    icon: Home,
    whatHappensNext: 'Family matching and biometric verification at RC-02',
    detail: 'Safe haven intake (Same ID)'
  },
  {
    id: 'FAMILY',
    label: 'FAMILY',
    shortLabel: 'REUNION',
    icon: Users2,
    whatHappensNext: 'Case successfully verified and closed: YOU ARE SAFE.',
    detail: '98% match verified'
  }
];

export const RescueContinuityBar: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { activeRescueStage, setActiveRescueStage, activeCitizenCaseId } = useOperationalStore();

  const currentStageIndex = STAGES.findIndex((s) => s.id === activeRescueStage);
  const currentStageMeta = STAGES[currentStageIndex] || STAGES[0];

  return (
    <div className="w-full bg-[#050b18]/95 border-y border-slate-800/80 px-3 sm:px-4 py-2 z-10 select-none shadow-md backdrop-blur-md">
      {/* Top Title & "What happens next?" Callout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2 font-mono text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="text-[10px] sm:text-xs font-black tracking-widest text-slate-300 uppercase">
            RESCUE CONTINUITY CHAIN
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-700/40 font-bold">
            {activeCitizenCaseId || 'VY-26-1042'}
          </span>
        </div>

        {/* The Central VYRO Question: WHAT HAPPENS TO THIS PERSON NEXT? */}
        <div className="text-[11px] text-slate-300 flex items-center space-x-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="text-cyan-400 font-bold hidden md:inline">WHAT HAPPENS NEXT?</span>
          <span className="text-slate-400 hidden md:inline">→</span>
          <span className="text-slate-200 font-medium">{currentStageMeta.whatHappensNext}</span>
        </div>
      </div>

      {/* 10-Stage Visual Sequence */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-none py-1">
        {STAGES.map((st, idx) => {
          const Icon = st.icon;
          const isPassed = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;

          return (
            <React.Fragment key={st.id}>
              <button
                onClick={() => setActiveRescueStage(st.id)}
                title={`${st.label}: ${st.detail}`}
                className={`flex flex-col items-center shrink-0 px-1.5 sm:px-2 py-1 rounded-lg transition-all ${
                  isCurrent
                    ? 'bg-cyan-500/20 border border-cyan-400 shadow-md shadow-cyan-500/20 text-cyan-300 scale-105'
                    : isPassed
                    ? 'bg-emerald-950/30 border border-emerald-500/40 text-emerald-400'
                    : 'bg-slate-900/60 border border-slate-800/80 text-slate-500 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-1">
                  {isPassed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-cyan-400 animate-pulse' : ''}`} />
                  )}
                  <span className={`text-[10px] font-mono font-bold ${isCurrent ? 'text-white' : ''}`}>
                    {compact ? st.shortLabel : st.label}
                  </span>
                </div>
                {!compact && (
                  <span className={`text-[8px] font-mono mt-0.5 truncate max-w-[70px] ${
                    isCurrent ? 'text-cyan-200 font-semibold' : 'text-slate-500'
                  }`}>
                    {st.detail}
                  </span>
                )}
              </button>

              {idx < STAGES.length - 1 && (
                <div className={`h-[2px] flex-1 min-w-[6px] max-w-[16px] transition-colors ${
                  idx < currentStageIndex ? 'bg-emerald-500/80' : 'bg-slate-800'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
