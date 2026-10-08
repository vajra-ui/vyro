import React, { useState } from 'react';
import { useOperationalStore } from '../../stores/operationalStore';
import { TRANSLATIONS } from '../../data/translations';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  PhoneCall, 
  ShieldCheck, 
  X, 
  Search, 
  AlertTriangle,
  ChevronRight,
  LifeBuoy
} from 'lucide-react';

interface CitizenCaseTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCaseId?: string | null;
}

export const CitizenCaseTrackerModal: React.FC<CitizenCaseTrackerModalProps> = ({
  isOpen,
  onClose,
  initialCaseId
}) => {
  const { cases, rescueChains, currentLanguage, triggerFlyTo } = useOperationalStore();
  const t = TRANSLATIONS[currentLanguage];

  const [searchId, setSearchId] = useState(initialCaseId || 'VY-2026-0002047');
  const [queriedCaseId, setQueriedCaseId] = useState(initialCaseId || 'VY-2026-0002047');

  if (!isOpen) return null;

  const currentCase = cases.find((c) => c.id.toLowerCase() === queriedCaseId.toLowerCase()) || cases[0];
  const chain = currentCase ? rescueChains[currentCase.id] : null;

  // Simple human progression stages
  const simpleStages = [
    { id: 'SOS_RECEIVED', title: t.sosReceived, desc: 'Distress signal received by disaster control' },
    { id: 'AI_TRIAGED', title: t.aiTriaged, desc: 'Urgency & equipment verified by AI copilot' },
    { id: 'RESCUER_ASSIGNED', title: t.rescuerAssigned, desc: 'NDRF / Coastal police rescue unit tasked' },
    { id: 'RESCUER_EN_ROUTE', title: t.enRoute, desc: 'Rescue craft navigating to your structure' },
    { id: 'VICTIM_LOCATED', title: t.victimLocated, desc: 'Rescuers have arrived at your building' },
    { id: 'MEDICAL_HANDOFF', title: t.medicalCare, desc: 'Paramedic triage & emergency stabilization' },
    { id: 'HOSPITAL_ADMITTED', title: t.hospitalized, desc: 'Transferred to hospital trauma department' },
    { id: 'SHELTER_TRANSFERRED', title: t.sheltered, desc: 'Relocated to safe evacuation relief shelter' },
    { id: 'FAMILY_REUNITED', title: t.reunited, desc: 'Family members linked and verified' },
    { id: 'CASE_CLOSED', title: t.closed, desc: 'Rescue lifecycle completed & verified' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-lg bg-[#090f1d] border border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-mono font-bold text-slate-100 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>{t.trackMyCase}</span>
            </h2>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              Secure citizen case reference tracker • No login required
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Case ID Search Input */}
        <div className="p-3 bg-slate-950/70 border-b border-slate-800/80 flex items-center space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Case ID (e.g. VY-2026-0002047)..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-400 pl-8 uppercase"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>
          <button
            onClick={() => setQueriedCaseId(searchId)}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition shadow"
          >
            TRACK
          </button>
        </div>

        {/* Case Content */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 text-xs font-sans">
          {currentCase ? (
            <>
              {/* Summary Card */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 font-mono">
                <div className="flex items-center justify-between">
                  <div className="text-base font-bold text-slate-100">{currentCase.id}</div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                    currentCase.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                    'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {currentCase.priority} PRIORITY
                  </span>
                </div>

                <div className="text-xs text-slate-300 font-sans font-semibold">
                  {currentCase.name}
                </div>

                <div className="flex items-center space-x-1.5 text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{currentCase.locationName}</span>
                </div>

                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>LAST STATUS:</span>
                  <strong className="text-emerald-400">{currentCase.status}</strong>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold mb-2">
                  RESCUE PROGRESSION LIFECYCLE
                </div>

                <div className="space-y-2 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {simpleStages.map((st, idx) => {
                    const chainStage = chain?.stages.find((s) => s.stageId === st.id);
                    const isVerified = chainStage?.status === 'VERIFIED';
                    const isInProgress = chainStage?.status === 'IN_PROGRESS';
                    const isChainBreak = chainStage?.status === 'CHAIN_BREAK';

                    return (
                      <div key={st.id} className="relative flex items-start space-x-3 text-xs pl-0.5">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border z-10 ${
                            isVerified
                              ? 'bg-emerald-600 border-emerald-400 text-white'
                              : isInProgress
                              ? 'bg-sky-600 border-sky-400 text-white animate-pulse'
                              : isChainBreak
                              ? 'bg-amber-600 border-amber-400 text-white animate-bounce'
                              : 'bg-slate-900 border-slate-800 text-slate-600'
                          }`}
                        >
                          {isVerified ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <span className="text-[10px] font-mono">{idx + 1}</span>
                          )}
                        </div>

                        <div className="flex-1 pb-1.5">
                          <div className="flex items-center justify-between font-mono">
                            <span className={`font-bold ${isVerified ? 'text-slate-100' : isInProgress ? 'text-cyan-300' : 'text-slate-500'}`}>
                              {st.title}
                            </span>
                            {chainStage?.timestamp && (
                              <span className="text-[10px] text-slate-400">{chainStage.timestamp}</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-sans mt-0.5">{st.desc}</div>
                          {chainStage?.notes && (
                            <div className="mt-1 text-[10px] font-mono text-cyan-300 bg-slate-950/70 p-1 rounded border border-slate-800">
                              {chainStage.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Direct Disaster Helpline */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">{t.directHelpline}</div>
                  <div className="text-cyan-400 font-mono font-bold text-sm">1077 / +91 484 2361250</div>
                </div>
                <a
                  href="tel:1077"
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition flex items-center space-x-1 shadow"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>CALL</span>
                </a>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-slate-500 font-mono">
              Case ID not found. Please verify reference code.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
