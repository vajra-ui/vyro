import React, { useState } from 'react';
import { useOperationalStore } from '../../stores/operationalStore';
import { FamilyCaseRecord, VyroReuniteStage } from '../../types/vyro';
import { 
  Users, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  PhoneCall, 
  QrCode, 
  Lock, 
  Building2, 
  MapPin, 
  Search, 
  ArrowRight, 
  Check, 
  X, 
  Clock, 
  MessageSquare, 
  ExternalLink, 
  ShieldAlert, 
  BadgeCheck,
  UserCheck,
  Radio,
  FileText
} from 'lucide-react';

interface VyroReunitePanelProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const VyroReunitePanel: React.FC<VyroReunitePanelProps> = ({ onClose, isModal = false }) => {
  const {
    familyCases,
    reunionQueue,
    activeFamilyCaseId,
    setActiveFamilyCaseId,
    sendImSafeNotification,
    reportMissingPersonCase,
    verifyReuniteStep,
    executeReuniteHandoff,
    sendSafeMessage,
    activeRescueStage
  } = useOperationalStore();

  const [activeTab, setActiveTab] = useState<'MATCHING' | 'REPORT'>('MATCHING');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [typedToken, setTypedToken] = useState('');
  const [tokenError, setTokenError] = useState(false);
  const [handoffSuccess, setHandoffSuccess] = useState(false);
  const [outgoingMsg, setOutgoingMsg] = useState('');

  // Report Form state
  const [repName, setRepName] = useState('');
  const [repAge, setRepAge] = useState<number>(10);
  const [repReporter, setRepReporter] = useState('');
  const [repRelation, setRepRelation] = useState('Parent');
  const [repPhone, setRepPhone] = useState('');
  const [repLocation, setRepLocation] = useState('Old Bridge Sector');
  const [reportCreatedId, setReportCreatedId] = useState<string | null>(null);

  const selectedCase = familyCases.find((c) => c.id === activeFamilyCaseId) || familyCases[0];

  const filteredCases = familyCases.filter((c) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'REUNION_READY') return c.status === 'REUNION_READY';
    if (filterStatus === 'AWAITING') return c.status === 'AWAITING_VERIFICATION';
    if (filterStatus === 'COMPLETED') return c.status === 'COMPLETED';
    return true;
  });

  const handleVerifyStep = (stepNumber: number) => {
    if (!selectedCase) return;
    verifyReuniteStep(selectedCase.id, stepNumber);
  };

  const handleHandoff = () => {
    if (!selectedCase) return;
    const tokenToTest = typedToken.trim() || selectedCase.reunionToken;
    const ok = executeReuniteHandoff(selectedCase.id, tokenToTest);
    if (ok) {
      setHandoffSuccess(true);
      setTokenError(false);
      setTimeout(() => setHandoffSuccess(false), 3500);
    } else {
      setTokenError(true);
      setTimeout(() => setTokenError(false), 2500);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!outgoingMsg.trim() || !selectedCase) return;
    sendSafeMessage(selectedCase.id, outgoingMsg.trim());
    setOutgoingMsg('');
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repName || !repReporter) return;

    const newId = reportMissingPersonCase({
      missingPersonName: repName,
      age: repAge,
      reportedBy: repReporter,
      relationship: repRelation,
      contactPhone: repPhone || '+91 98470 00000',
      lastKnownLocation: repLocation
    });

    setReportCreatedId(newId);
    setTimeout(() => {
      setReportCreatedId(null);
      setActiveTab('MATCHING');
      setRepName('');
      setRepReporter('');
    }, 2000);
  };

  const REUNITE_STAGES: { id: VyroReuniteStage; label: string }[] = [
    { id: 'FIND', label: 'FIND' },
    { id: 'IDENTIFY', label: 'IDENTIFY' },
    { id: 'MATCH', label: 'MATCH' },
    { id: 'VERIFY', label: 'VERIFY' },
    { id: 'CONNECT', label: 'CONNECT' },
    { id: 'REUNITE', label: 'REUNITE' },
    { id: 'CLOSE', label: 'CLOSE' }
  ];

  return (
    <div className={`w-full flex flex-col bg-[#050b18] text-slate-100 font-sans select-none ${isModal ? 'h-[92vh] max-w-5xl rounded-2xl border border-purple-500/50 shadow-2xl overflow-hidden' : 'h-full overflow-y-auto'}`}>
      
      {/* 1. TOP HEADER BANNER */}
      <header className="p-4 bg-gradient-to-r from-purple-950/90 via-slate-900 to-indigo-950/90 border-b border-purple-500/40 shrink-0 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img 
              src="/logo-icon.png" 
              alt="VYRO Logo" 
              className="w-10 h-10 rounded-xl object-contain bg-[#000b1f] border border-purple-400 shadow-lg shadow-purple-600/30 p-0.5" 
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-pink-600 border border-[#050b18] flex items-center justify-center text-[8px] text-white font-bold">
              ❤
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-black tracking-wider text-white">
                VYRO REUNITE™
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/40 font-bold">
                TWO-WAY REUNIFICATION NETWORK
              </span>
            </div>
            <p className="text-xs text-purple-200/80 font-mono tracking-tight mt-0.5">
              “Finding the person is not the end of rescue. Getting them safely back to their people is.”
            </p>
          </div>
        </div>

        {/* Tab Selector & Close Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('MATCHING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'MATCHING'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>TWO-WAY NETWORK</span>
          </button>

          <button
            onClick={() => setActiveTab('REPORT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'REPORT'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>REPORT MISSING PERSON</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* 2. VYRO REUNITE™ 7-STAGE CHAIN BANNER */}
      <div className="bg-[#090f22] border-b border-purple-900/40 px-4 py-2 flex items-center justify-between overflow-x-auto scrollbar-none font-mono text-[11px] shrink-0">
        <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider hidden md:inline">
          REUNITE LIFECYCLE:
        </span>
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {REUNITE_STAGES.map((st, idx) => {
            const isCompleted = selectedCase && (
              (st.id === 'FIND' && true) ||
              (st.id === 'IDENTIFY' && selectedCase.verificationSteps[1]?.verified) ||
              (st.id === 'MATCH' && selectedCase.matchConfidence > 0) ||
              (st.id === 'VERIFY' && selectedCase.verificationSteps[2]?.verified) ||
              (st.id === 'CONNECT' && selectedCase.verificationSteps[3]?.verified) ||
              (st.id === 'REUNITE' && selectedCase.verificationSteps[4]?.verified) ||
              (st.id === 'CLOSE' && selectedCase.status === 'COMPLETED')
            );
            const isCurrent = selectedCase?.currentStage === st.id;

            return (
              <React.Fragment key={st.id}>
                <div
                  className={`px-2 py-0.5 rounded-md font-bold flex items-center space-x-1 transition ${
                    isCurrent
                      ? 'bg-purple-500 text-white shadow-sm shadow-purple-500/40 animate-pulse'
                      : isCompleted
                      ? 'bg-purple-950/80 text-purple-300 border border-purple-800/60'
                      : 'text-slate-600'
                  }`}
                >
                  {isCompleted && <span className="text-emerald-400 text-[10px]">✓</span>}
                  <span>{st.label}</span>
                </div>
                {idx < REUNITE_STAGES.length - 1 && (
                  <span className="text-slate-600 text-[10px]">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <span className="text-[10px] text-emerald-400 font-bold hidden lg:inline">
          CASE #{selectedCase?.id || 'FM-26-0091'}
        </span>
      </div>

      {/* 3. REUNION QUEUE KPI COUNTERS (Section 7) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 bg-[#070c1e] border-b border-slate-800/80 font-mono text-xs shrink-0">
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-bold">READY FOR MATCH</div>
          <div className="text-xl font-black text-cyan-300 mt-0.5">
            {reunionQueue.readyForMatch.toString().padStart(2, '0')}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/40 text-center">
          <div className="text-[10px] text-purple-400 uppercase font-bold">MATCH FOUND</div>
          <div className="text-xl font-black text-purple-300 mt-0.5">
            {reunionQueue.matchFound.toString().padStart(2, '0')}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-amber-500/40 text-center">
          <div className="text-[10px] text-amber-400 uppercase font-bold">AWAITING VERIF.</div>
          <div className="text-xl font-black text-amber-300 mt-0.5">
            {reunionQueue.awaitingVerification.toString().padStart(2, '0')}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-emerald-500/40 text-center">
          <div className="text-[10px] text-emerald-400 uppercase font-bold">REUNION READY</div>
          <div className="text-xl font-black text-emerald-300 mt-0.5">
            {reunionQueue.reunionReady.toString().padStart(2, '0')}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-teal-500/40 text-center col-span-2 sm:col-span-1">
          <div className="text-[10px] text-teal-400 uppercase font-bold">COMPLETED</div>
          <div className="text-xl font-black text-teal-300 mt-0.5">
            {reunionQueue.completed.toString().padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* 4. MAIN WORKSPACE */}
      <div className="flex-1 w-full overflow-hidden flex flex-col lg:flex-row">
        
        {activeTab === 'REPORT' ? (
          /* ========================================================================= */
          /* SECTION 3: FAMILY SEARCH MODE — FILE MISSING PERSON REPORT                */
          /* ========================================================================= */
          <div className="flex-1 p-6 overflow-y-auto space-y-4 max-w-2xl mx-auto font-mono text-xs">
            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 space-y-1">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Search className="w-4 h-4 text-purple-400" />
                <span>FAMILY SEARCH MODE • REPORT MISSING PERSON</span>
              </h2>
              <p className="text-xs text-slate-300">
                Enter minimal identifying details. VYRO immediately issues a Family Case ID and begins continuous two-way matching against all authorized rescue, hospital, and shelter intakes.
              </p>
            </div>

            {reportCreatedId && (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>FAMILY CASE {reportCreatedId} GENERATED! Continuous two-way search initiated.</span>
              </div>
            )}

            <form onSubmit={handleReportSubmit} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">MISSING PERSON FULL NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
                    value={repName}
                    onChange={(e) => setRepName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-purple-400 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">AGE RANGE / AGE *</label>
                  <input
                    type="number"
                    min="1"
                    max="110"
                    value={repAge}
                    onChange={(e) => setRepAge(parseInt(e.target.value) || 10)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-purple-400 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">REPORTED BY (YOUR NAME) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Sharma"
                    value={repReporter}
                    onChange={(e) => setRepReporter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-purple-400 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">RELATIONSHIP *</label>
                  <select
                    value={repRelation}
                    onChange={(e) => setRepRelation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-purple-400 outline-none"
                  >
                    <option value="Parent">Parent / Guardian</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Son / Daughter</option>
                    <option value="Sibling">Brother / Sister</option>
                    <option value="Other">Other Relative</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">CONTACT PHONE NUMBER *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98470 11200"
                    value={repPhone}
                    onChange={(e) => setRepPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-purple-400 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">LAST KNOWN LOCATION *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Old Bridge Sector"
                    value={repLocation}
                    onChange={(e) => setRepLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-purple-400 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('MATCHING')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black shadow-lg shadow-purple-600/30 transition flex items-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>START CONTINUOUS MATCHING</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ========================================================================= */
          /* SECTION 1 & 4: TWO-WAY REUNIFICATION NETWORK DESK                         */
          /* ========================================================================= */
          <>
            {/* Left Column: Active Cases & Priority Filter */}
            <div className="w-full lg:w-80 border-r border-slate-800 bg-[#070d1e] flex flex-col shrink-0 overflow-y-auto">
              
              {/* Priority Alert Box (Section 8) */}
              <div className="p-3 bg-rose-950/60 border-b border-rose-500/40 font-mono text-[11px] space-y-1">
                <div className="flex items-center space-x-1 text-rose-300 font-bold">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>HIGH REUNIFICATION PRIORITY</span>
                </div>
                <div className="text-slate-300">
                  Child separated from guardian • Guardian located 3.2 km away
                </div>
              </div>

              {/* Status Filters */}
              <div className="p-2 border-b border-slate-800 flex items-center space-x-1 font-mono text-[10px] overflow-x-auto scrollbar-none">
                {['ALL', 'REUNION_READY', 'AWAITING', 'COMPLETED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2 py-1 rounded transition font-bold whitespace-nowrap ${
                      filterStatus === st
                        ? 'bg-purple-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Cases List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2 font-mono text-xs">
                {filteredCases.map((fc) => {
                  const isSelected = fc.id === activeFamilyCaseId;
                  const isHighPriority = fc.priority === 'CRITICAL_VULNERABLE';

                  return (
                    <div
                      key={fc.id}
                      onClick={() => setActiveFamilyCaseId(fc.id)}
                      className={`p-3 rounded-xl border transition cursor-pointer space-y-1.5 ${
                        isSelected
                          ? 'bg-purple-950/40 border-purple-400 shadow-md shadow-purple-950/40'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{fc.missingPersonName}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                          {fc.matchConfidence}% MATCH
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>{fc.id} ↔ {fc.victimCaseId}</span>
                        <span className="text-slate-300">Age: {fc.age}</span>
                      </div>

                      {isHighPriority && (
                        <div className="text-[9px] px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/40 font-bold">
                          ⚠ PRIORITY: {fc.priorityReason || 'Vulnerable Individual'}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 text-[10px]">
                        <span className="text-slate-400">Reporter: {fc.reportedBy}</span>
                        <span className={`font-bold ${
                          fc.status === 'COMPLETED' ? 'text-teal-400' :
                          fc.status === 'REUNION_READY' ? 'text-emerald-400 animate-pulse' :
                          'text-amber-400'
                        }`}>
                          {fc.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Case Deep-Dive, Two-Way Match, 7 Steps & Handoff */}
            {selectedCase ? (
              <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 font-mono text-xs">
                
                {/* SECTION 4: TWO-WAY MATCHING TOPOLOGY */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>TWO-WAY REUNIFICATION MATCHING</span>
                    </span>
                    <span className="text-emerald-400 font-black text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50">
                      FAMILY MATCH FOUND — {selectedCase.matchConfidence}% CONFIDENCE
                    </span>
                  </div>

                  {/* Flow Diagram */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center text-center p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-700">
                      <div className="text-[10px] text-slate-400">RESCUED PERSON</div>
                      <div className="font-bold text-white text-xs mt-0.5">{selectedCase.victimCaseId}</div>
                      <div className="text-[9px] text-cyan-300 truncate">{selectedCase.currentFacility}</div>
                    </div>

                    <div className="text-purple-400 font-bold text-sm hidden md:block">⇄</div>

                    <div className="p-2 rounded-lg bg-purple-950/70 border border-purple-500/60 shadow-sm">
                      <div className="text-[10px] text-purple-300 font-bold">IDENTITY ENGINE</div>
                      <div className="font-black text-white text-xs mt-0.5">BI-DIRECTIONAL</div>
                      <div className="text-[9px] text-purple-300">Continuous Cross-Check</div>
                    </div>

                    <div className="text-purple-400 font-bold text-sm hidden md:block">⇄</div>

                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-700">
                      <div className="text-[10px] text-slate-400">FAMILY CASE</div>
                      <div className="font-bold text-white text-xs mt-0.5">{selectedCase.id}</div>
                      <div className="text-[9px] text-slate-300">{selectedCase.reportedBy} ({selectedCase.relationship})</div>
                    </div>
                  </div>

                  {/* Authorized Matching Evidence List */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-[11px]">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">AUTHORIZED MATCHING CRITERIA:</div>
                    {selectedCase.matchCriteria.map((crit, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{crit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION 2: "I'M SAFE" NOTIFICATION SYSTEM */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center space-x-1.5 text-xs">
                      <Radio className="w-4 h-4 text-emerald-400" />
                      <span>“I'M SAFE” FAMILY NOTIFICATION RELAY</span>
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      selectedCase.imSafeSent
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    }`}>
                      {selectedCase.imSafeSent ? 'NOTIFICATION DELIVERED' : 'AWAITING DISPATCH'}
                    </span>
                  </div>

                  {/* Message Preview Box (Section 2) */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-xs">
                    <div className="text-emerald-400 font-black flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>🟢 YOUR FAMILY MEMBER HAS BEEN LOCATED</span>
                    </div>
                    <div className="text-slate-300 space-y-0.5 text-[11px]">
                      <div>Case: <strong className="text-white">{selectedCase.victimCaseId}</strong></div>
                      <div>Status: <strong className="text-emerald-300">SAFE & VERIFIED</strong></div>
                      <div>Current location: <strong className="text-cyan-300">{selectedCase.currentFacility}</strong></div>
                      <div>Last verified: <strong className="text-slate-300">{selectedCase.imSafeSentTime || '18:42 IST'}</strong></div>
                      <div className="text-[10px] text-slate-500 pt-1 italic">
                        * Exact GPS coordinates protected for safety. Authorized intake verified.
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => sendImSafeNotification(selectedCase.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition shadow-md shadow-emerald-600/30 flex items-center space-x-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{selectedCase.imSafeSent ? 'RE-SEND AUTHORIZED NOTIFICATION' : 'SEND "I\'M SAFE" NOTIFICATION'}</span>
                    </button>
                  </div>
                </div>

                {/* SECTION 5: 7-STEP SAFE VERIFICATION WORKFLOW */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                    <span className="font-bold text-white text-xs flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      <span>7-STEP SAFE VERIFICATION PROTOCOL</span>
                    </span>
                    <span className="text-[10px] text-purple-300">PREVENTS MISHANDOFF</span>
                  </div>

                  <div className="space-y-2">
                    {selectedCase.verificationSteps.map((step) => {
                      return (
                        <div
                          key={step.stepNumber}
                          className={`p-3 rounded-xl border flex items-center justify-between transition ${
                            step.verified
                              ? 'bg-slate-950/80 border-slate-800 text-slate-200'
                              : 'bg-purple-950/20 border-purple-500/40 text-purple-200'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] font-mono text-purple-400 font-bold">
                                STEP {step.stepNumber}
                              </span>
                              <span className="font-bold text-xs text-white">{step.title}</span>
                              {step.verified && (
                                <span className="text-emerald-400 font-bold text-[10px] flex items-center space-x-0.5">
                                  <Check className="w-3 h-3" />
                                  <span>VERIFIED</span>
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {step.description}
                            </div>
                            {step.verified && step.authorizedOfficer && (
                              <div className="text-[10px] text-slate-500">
                                {step.timestamp} • {step.authorizedOfficer}
                              </div>
                            )}
                          </div>

                          {!step.verified && (
                            <button
                              onClick={() => handleVerifyStep(step.stepNumber)}
                              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] transition shrink-0 ml-2"
                            >
                              [ VERIFY STEP {step.stepNumber} ]
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SECTION 9 & 10: FAMILY COMMUNICATION BRIDGE & REUNION TOKEN HANDOFF */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Family Communication Bridge (Section 9) */}
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs flex items-center space-x-1.5">
                          <MessageSquare className="w-4 h-4 text-cyan-400" />
                          <span>FAMILY COMMUNICATION BRIDGE</span>
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold">VERIFIED CONTACT</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Protected channel restores communication without exposing raw phone numbers.
                      </p>
                    </div>

                    {/* Chat Log */}
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 max-h-44 overflow-y-auto">
                      {selectedCase.safeMessageLog.map((m) => (
                        <div key={m.id} className="p-2 rounded-lg bg-slate-900 text-[11px] space-y-0.5">
                          <div className="flex justify-between text-[10px] text-slate-400">
                            <span className="font-bold text-cyan-300">{m.sender}</span>
                            <span>{m.time}</span>
                          </div>
                          <div className="text-slate-200 whitespace-pre-line">{m.text}</div>
                        </div>
                      ))}
                    </div>

                    {/* Send Message Input */}
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2 pt-1">
                      <input
                        type="text"
                        placeholder="Type safe verified message..."
                        value={outgoingMsg}
                        onChange={(e) => setOutgoingMsg(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400"
                      />
                      <button
                        type="submit"
                        className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>

                  {/* Reunion QR & Single-Use Token Handoff (Section 10 & 11) */}
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-purple-500/40 space-y-3 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs flex items-center space-x-1.5">
                          <QrCode className="w-4 h-4 text-purple-400" />
                          <span>REUNION TOKEN & PHYSICAL HANDOFF</span>
                        </span>
                        <span className="text-[10px] text-amber-400 font-bold">{selectedCase.tokenExpiry}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Temporary security token used at the Family Reunification Center to seal handoff.
                      </p>
                    </div>

                    {/* Token Display Box */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-purple-500/50 text-center space-y-1">
                      <div className="text-[10px] text-slate-400 uppercase">OFFICIAL SINGLE-USE TOKEN</div>
                      <div className="text-xl font-black font-mono tracking-widest text-purple-300">
                        {selectedCase.reunionToken}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Target: {selectedCase.reunionCenter}
                      </div>
                    </div>

                    {/* Token Validation Form */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder={selectedCase.reunionToken}
                          value={typedToken}
                          onChange={(e) => setTypedToken(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono uppercase outline-none focus:border-purple-400"
                        />
                        <button
                          onClick={handleHandoff}
                          disabled={selectedCase.status === 'COMPLETED'}
                          className={`px-3 py-1.5 rounded-lg font-black text-xs transition ${
                            selectedCase.status === 'COMPLETED'
                              ? 'bg-teal-900/60 text-teal-300 border border-teal-500'
                              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md'
                          }`}
                        >
                          {selectedCase.status === 'COMPLETED' ? 'HANDOFF SEALED' : '[ CONFIRM HANDOFF ]'}
                        </button>
                      </div>

                      {handoffSuccess && (
                        <div className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1 animate-fadeIn">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>PHYSICAL HANDOFF VERIFIED! Case sealed and archived.</span>
                        </div>
                      )}

                      {tokenError && (
                        <div className="text-[11px] font-bold text-rose-400 flex items-center space-x-1 animate-fadeIn">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>INVALID TOKEN. Please verify case token matching RC-02.</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* SECTION 11: REUNION EVIDENCE LEDGER */}
                {selectedCase.status === 'COMPLETED' && (
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/60 space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between pb-1 border-b border-emerald-800/40">
                      <span className="font-bold text-emerald-200 text-xs flex items-center space-x-1.5">
                        <BadgeCheck className="w-4 h-4 text-emerald-400" />
                        <span>REUNION EVIDENCE LEDGER • CASE {selectedCase.id}</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-900 text-emerald-200">
                        STATUS: CLOSED
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <div className="text-emerald-300 flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>PERSON LOCATED</span>
                      </div>
                      <div className="text-emerald-300 flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>IDENTITY VERIFIED</span>
                      </div>
                      <div className="text-emerald-300 flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>FAMILY VERIFIED</span>
                      </div>
                      <div className="text-emerald-300 flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>HANDOFF COMPLETED</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-800/60 text-[11px] flex justify-between items-center text-slate-300">
                      <span>REUNION TIME: <strong>18:42:16 IST</strong></span>
                      <span>REUNION CENTER: <strong>RC-02 (Central Hub)</strong></span>
                      <span className="text-emerald-400 font-bold">FULL RESCUE CHAIN COMPLETED</span>
                    </div>
                  </div>
                )}

              </div>
            ) : null}
          </>
        )}

      </div>
    </div>
  );
};