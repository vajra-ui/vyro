import React, { useState } from 'react';
import { useOperationalStore } from '../../stores/operationalStore';
import { RescueContinuityBar } from '../common/RescueContinuityBar';
import { 
  ShieldAlert, 
  Sparkles, 
  Play, 
  RotateCcw, 
  MapPin, 
  Battery, 
  Radio, 
  Users, 
  Building2, 
  Home, 
  Users2, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Send, 
  Maximize2, 
  Clock, 
  Layers, 
  LifeBuoy, 
  Stethoscope, 
  Check, 
  Flame, 
  Waves,
  ChevronDown,
  ChevronRight,
  Heart,
  X
} from 'lucide-react';
import { VyroReunitePanel } from '../panels/VyroReunitePanel';

type CommanderTab = 'SOS' | 'CASES' | 'TEAMS' | 'REUNITE' | 'ANALYTICS' | 'PROFILE';

export const CommanderDashboard: React.FC = () => {
  const {
    cases,
    rescueTeams,
    chainBreaks,
    hospitals,
    shelters,
    activeCitizenCaseId,
    activeEmergencySOS,
    activeRescueTracking,
    deviceSurvival,
    triggerSosDemo,
    triggerAssignDemo,
    dispatchTeamToCase,
    triggerFullRescueDemo,
    resetDemo,
    setPrimaryViewMode,
    selectEntity,
    advanceRescueChain,
    resolveChainBreak,
    updateHospitalBeds,
    updateShelterOccupancy,
    setRole
  } = useOperationalStore();

  const [activeTab, setActiveTab] = useState<CommanderTab>('CASES');
  const [selectedCaseId, setSelectedCaseId] = useState<string>(activeCitizenCaseId || 'VY-26-1042');
  const [showAiAlternatives, setShowAiAlternatives] = useState(false);
  const [expandedWhyId, setExpandedWhyId] = useState<string | null>('VY-26-1042');
  const [manualAssignCaseId, setManualAssignCaseId] = useState<string | null>(null);

  const AVAILABLE_RESCUE_UNITS = [
    {
      id: 'TEAM-ALPHA-04',
      name: 'Rescue Alpha',
      callsign: 'Alpha-04',
      vehicle: 'Amphibious Rig R-07',
      capability: 'Water & Winch Extrication',
      eta: '4m',
      match: 94,
      icon: '🚤'
    },
    {
      id: 'AIR-01',
      name: 'Coast Guard Helo Air-1',
      callsign: 'Air-1 Helo',
      vehicle: 'Helicopter Air-1',
      capability: 'Aerial Winch & Rooftop Airlift',
      eta: '4m',
      match: 89,
      icon: '🚁'
    },
    {
      id: 'TEAM-BRAVO-02',
      name: 'Team Bravo-02',
      callsign: 'Trident Bravo',
      vehicle: 'Zodiac Raft Z-02',
      capability: 'Shallow Flood Canal Navigation',
      eta: '8m',
      match: 82,
      icon: '🛶'
    },
    {
      id: 'NDRF-UNIT-01',
      name: 'NDRF Battalion 04',
      callsign: 'Garuda One',
      vehicle: 'Tactical 4x4 Rig',
      capability: 'Debris Removal & Ground Cordon',
      eta: '12m',
      match: 75,
      icon: '🚚'
    },
    {
      id: 'MED-ALPHA-01',
      name: 'Rapid EMS Med-01',
      callsign: 'Med-01 ALS',
      vehicle: 'ALS Ambulance 04',
      capability: 'Critical Trauma Life Support',
      eta: '10m',
      match: 91,
      icon: '🚑'
    }
  ];


  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  // Dynamic Google Maps link for the selected case
  const gmapsLink = selectedCase
    ? `https://www.google.com/maps/search/?api=1&query=${selectedCase.coordinates[1]},${selectedCase.coordinates[0]}`
    : '#';

  // Section categorization (Section 17)
  const activeSosCases = cases.filter((c) => c.status === 'REPORTED');
  const criticalCases = cases.filter((c) => c.priority === 'CRITICAL');
  const unassignedCases = cases.filter((c) => !c.assignedTeamId);
  const rescueInProgressCases = cases.filter((c) => c.status === 'ASSIGNED' || c.status === 'EN_ROUTE' || c.status === 'ON_SCENE');
  const medicalCases = cases.filter((c) => c.status === 'MEDICAL_HANDOFF');
  const hospitalCases = cases.filter((c) => c.status === 'HOSPITALIZED');
  const shelterCases = cases.filter((c) => c.status === 'SHELTERED');
  const reunitedCases = cases.filter((c) => c.status === 'REUNITED' || c.status === 'CLOSED');

  // Active chain breaks (Section 33)
  const activeBreaks = chainBreaks.filter((b) => !b.isResolved);

  return (
    <div className="w-full h-full flex flex-col bg-[#020617] text-slate-100 overflow-hidden font-sans select-none">
      {/* 1. Permanent Signature Rescue Continuity Bar */}
      <RescueContinuityBar />

      {/* 2. Top Header Navigation (Section 17) */}
      <header className="h-14 bg-[#090e1c] border-b border-slate-800/80 px-4 flex items-center justify-between shrink-0 z-20">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="relative group cursor-pointer" onClick={() => setPrimaryViewMode('3D_TWIN')}>
            <img 
              src="/logo-icon.png" 
              alt="VYRO Logo" 
              className="w-9 h-9 rounded-xl object-contain bg-[#000b1f] border border-cyan-500/40 shadow-md shadow-cyan-500/20 p-0.5 group-hover:border-cyan-400 transition" 
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-[#090e1c] animate-pulse"></div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-widest text-slate-100 text-sm">VYRO COMMAND</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                OPERATIONAL DESK
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">ONE PERSON • ONE CASE • ONE CONTINUOUS RESCUE CHAIN</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="hidden md:flex items-center space-x-1 font-mono text-xs">
          {(['SOS', 'CASES', 'TEAMS', 'REUNITE', 'ANALYTICS'] as CommanderTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg transition font-bold flex items-center space-x-1 ${
                activeTab === tab
                  ? tab === 'REUNITE'
                    ? 'bg-purple-600 text-white border border-purple-400 shadow-md shadow-purple-600/30'
                    : 'bg-slate-800 text-cyan-300 border border-cyan-500/40'
                  : tab === 'REUNITE'
                  ? 'text-purple-300 hover:bg-purple-950/40 hover:text-white border border-purple-800/40'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              {tab === 'REUNITE' && <Heart className="w-3 h-3 fill-current text-pink-300" />}
              <span>[{tab === 'REUNITE' ? 'VYRO REUNITE™' : tab}]</span>
            </button>
          ))}

          {/* Explicit 3D Twin Trigger (Section 22) */}
          <button
            onClick={() => setPrimaryViewMode('3D_TWIN')}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-300 font-bold transition shadow-sm"
            title="Launch Dedicated Fullscreen 3D Digital Twin"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>[3D TWIN]</span>
          </button>
        </div>

        {/* Quick Role Switcher shortcut */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setRole('CITIZEN')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 transition"
          >
            ← VIEW AS CITIZEN
          </button>
        </div>
      </header>

      {/* 3. Demo Center Bar (Section 29-32: REAL STATEFUL DEMOS) */}
      <div className="bg-[#0b1324] border-b border-slate-800/80 px-4 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0 z-20 font-mono text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold text-amber-400 flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DEMO CENTER:</span>
          </span>
          <span className="text-[10px] text-slate-400 hidden sm:inline">Real stateful rescue simulation</span>
        </div>

        <div className="flex items-center space-x-2 flex-wrap">
          <button
            onClick={triggerSosDemo}
            className="px-2.5 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/60 text-rose-300 hover:text-white font-bold transition flex items-center space-x-1 shadow-sm"
            title="Create case VY-26-DEMO-01 at Old Bridge"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>▶ SOS SENT DEMO</span>
          </button>

          <button
            onClick={triggerAssignDemo}
            className="px-2.5 py-1 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/60 text-cyan-300 hover:text-white font-bold transition flex items-center space-x-1 shadow-sm"
            title="Assign Rescue Alpha with 94% match"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>▶ ASSIGN DEMO</span>
          </button>

          <button
            onClick={triggerFullRescueDemo}
            className="px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black transition flex items-center space-x-1 shadow-md shadow-emerald-600/30"
            title="Execute entire 10-stage rescue chain walkthrough"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>▶ FULL RESCUE DEMO</span>
          </button>

          <button
            onClick={resetDemo}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition flex items-center space-x-1"
            title="Reset demo cases"
          >
            <RotateCcw className="w-3 h-3" />
            <span>↻ RESET</span>
          </button>
        </div>
      </div>

      {/* 4. Docked Chain-Break Detection Console (Section 33: NO POPUPS) */}
      {activeBreaks.length > 0 && (
        <div className="bg-rose-950/90 border-b-2 border-rose-500 px-4 py-2.5 shrink-0 z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono text-xs">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-rose-600 text-white animate-pulse">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="font-black text-rose-200 tracking-wide">
                ⚠ CHAIN BREAK DETECTED • CASE {activeBreaks[0].caseId}
              </div>
              <div className="text-[11px] text-rose-300">
                {activeBreaks[0].missingConfirmation} | FALLBACK: <strong className="text-white">{activeBreaks[0].lastVerifiedLocation}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => resolveChainBreak(activeBreaks[0].id, 'ER Controller confirmed intake.')}
              className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-extrabold transition shadow"
            >
              [ RESOLVE BREAK ]
            </button>
            <button
              onClick={triggerAssignDemo}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition"
            >
              [ REASSIGN TEAM ]
            </button>
          </div>
        </div>
      )}

      {/* 5. Main Tactical Grid Workspace (Sections 17-21) or VYRO REUNITE™ Desk */}
      {activeTab === 'REUNITE' ? (
        <div className="flex-1 w-full overflow-hidden">
          <VyroReunitePanel />
        </div>
      ) : (
        <div className="flex-1 w-full overflow-y-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (8 cols): 8 Operational Status Sections */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Quick Metrics KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-rose-500/40 space-y-1">
              <div className="text-[10px] text-rose-400 font-bold uppercase">ACTIVE SOS</div>
              <div className="text-2xl font-black text-rose-300">{activeSosCases.length}</div>
              <div className="text-[10px] text-slate-400">Immediate response required</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/40 space-y-1">
              <div className="text-[10px] text-amber-400 font-bold uppercase">UNASSIGNED</div>
              <div className="text-2xl font-black text-amber-300">{unassignedCases.length}</div>
              <div className="text-[10px] text-slate-400">Awaiting AI/Manual Dispatch</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/40 space-y-1">
              <div className="text-[10px] text-cyan-400 font-bold uppercase">IN PROGRESS</div>
              <div className="text-2xl font-black text-cyan-300">{rescueInProgressCases.length}</div>
              <div className="text-[10px] text-slate-400">Teams en route or extricating</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/40 space-y-1">
              <div className="text-[10px] text-emerald-400 font-bold uppercase">REUNITED / SAFE</div>
              <div className="text-2xl font-black text-emerald-300">{reunitedCases.length}</div>
              <div className="text-[10px] text-slate-400">Full continuity completed</div>
            </div>
          </div>

          {/* SECTION 17: DASHBOARD CASE SECTIONS */}
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="text-xs font-black tracking-widest text-slate-300 uppercase">
                OPERATIONAL CASES ({cases.length})
              </span>
              <span className="text-cyan-400 text-[10px]">REAL-TIME RECEPTOR</span>
            </div>

            {/* List of Case Cards */}
            <div className="space-y-3">
              {cases.map((c) => {
                const isSelected = c.id === selectedCaseId;
                const isExpanded = expandedWhyId === c.id;

                // Rescue Urgency Score (Section 18)
                const urgencyScore = c.priority === 'CRITICAL' ? 94 : c.priority === 'HIGH' ? 76 : 52;
                const urgencyReasons = c.priority === 'CRITICAL'
                  ? [
                      'Battery dropped below 40% (Preservation active)',
                      'GPS accuracy high (±4.2m) with rising water depth',
                      '2 children reported in trapped group',
                      'Last location updated within 12 seconds',
                      'Mesh relay connected to primary tower'
                    ]
                  : [
                      'Standard emergency reporting channel',
                      'Location accuracy verified by network gateway'
                    ];

                return (
                  <div
                    key={c.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-400/80 shadow-lg shadow-cyan-950/40'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Top Case Card Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-black text-white">{c.id}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold text-[10px]">
                          {c.disasterType}
                        </span>
                        <span className="text-slate-400 text-xs">
                          {c.peopleCount} {c.peopleCount === 1 ? 'PERSON' : 'PEOPLE'}
                        </span>
                      </div>

                      {/* Urgency Badge */}
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded font-black text-[11px] ${
                          urgencyScore >= 80
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          URGENCY {urgencyScore}/100
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                          {c.status}
                        </span>
                      </div>
                    </div>

                    {/* Telemetry Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5 text-[11px] text-slate-300">
                      <div>
                        <div className="text-[10px] text-slate-400">LOCATION</div>
                        <div className="font-bold truncate mt-0.5">{c.locationName}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">COORDINATES</div>
                        <div className="mt-0.5 font-mono">{c.coordinates[1].toFixed(5)}, {c.coordinates[0].toFixed(5)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">BATTERY / SOURCE</div>
                        <div className="mt-0.5">{c.priority === 'CRITICAL' ? '37% • MESH' : '78% • GPS'}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">LOCATION AGE</div>
                        <div className="mt-0.5 text-cyan-400 font-semibold">3 sec ago (±{c.accuracyMeters}m)</div>
                      </div>
                    </div>

                    {/* SECTION 18: WHY PRIORITY INCREASED Dropdown */}
                    <div className="pt-2">
                      <button
                        onClick={() => setExpandedWhyId(isExpanded ? null : c.id)}
                        className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 transition"
                      >
                        <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        <span>WHY PRIORITY IS SCORED {urgencyScore}/100</span>
                      </button>

                      {isExpanded && (
                        <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-[11px] text-slate-300">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">
                            RESCUE URGENCY ENGINE EXPLANATION:
                          </div>
                          {urgencyReasons.map((r, ri) => (
                            <div key={ri} className="flex items-center space-x-1.5 text-slate-300">
                              <span className="text-cyan-400">✓</span>
                              <span>{r}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons: AI AUTO ASSIGN | MANUAL ASSIGN | TRACK */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mt-2">
                      <div className="flex items-center space-x-2">
                        {c.assignedTeamId ? (
                          <div className="flex items-center space-x-2">
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-[11px] flex items-center space-x-1.5 shadow-sm">
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>ASSIGNED: {AVAILABLE_RESCUE_UNITS.find(u => u.id === c.assignedTeamId)?.name || c.assignedTeamId}</span>
                              <span className="text-emerald-400/80 font-normal">({c.status})</span>
                            </span>
                            <button
                              onClick={() => setManualAssignCaseId(manualAssignCaseId === c.id ? null : c.id)}
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold transition"
                              title="Reassign another unit"
                            >
                              REASSIGN
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setSelectedCaseId(c.id);
                                dispatchTeamToCase(c.id);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-[11px] flex items-center space-x-1.5 shadow-md shadow-cyan-900/30 transition active:scale-95"
                              title="Auto-evaluate case and dispatch optimal rescue team with AI"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                              <span>AI AUTO ASSIGN</span>
                            </button>

                            <button
                              onClick={() => setManualAssignCaseId(manualAssignCaseId === c.id ? null : c.id)}
                              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center space-x-1.5 ${
                                manualAssignCaseId === c.id
                                  ? 'bg-amber-500 text-slate-950 font-black ring-2 ring-amber-400'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                              }`}
                              title="Open manual team selection tray"
                            >
                              <Users className="w-3.5 h-3.5" />
                              <span>MANUAL ASSIGN</span>
                              <ChevronDown className={`w-3 h-3 transform transition-transform ${manualAssignCaseId === c.id ? 'rotate-180' : ''}`} />
                            </button>
                          </>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedCaseId(c.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-bold transition"
                        >
                          TRACK CASE
                        </button>

                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${c.coordinates[1]},${c.coordinates[0]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                          title="Open Coordinates in Google Maps"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* INTERACTIVE MANUAL DISPATCH SELECTION TRAY */}
                    {manualAssignCaseId === c.id && (
                      <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-amber-500/50 space-y-2.5 animate-fadeIn">
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                          <span className="text-[11px] font-bold text-amber-300 flex items-center space-x-1.5">
                            <Users className="w-3.5 h-3.5" />
                            <span>MANUAL DISPATCH SELECTION • CHOOSE RESCUE UNIT FOR {c.id}</span>
                          </span>
                          <button
                            onClick={() => setManualAssignCaseId(null)}
                            className="text-slate-400 hover:text-white p-0.5 rounded"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {AVAILABLE_RESCUE_UNITS.map((unit) => (
                            <div
                              key={unit.id}
                              className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition flex flex-col justify-between space-y-2"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-bold text-white flex items-center space-x-1.5">
                                    <span>{unit.icon}</span>
                                    <span>{unit.name}</span>
                                  </div>
                                  <div className="text-[10px] text-slate-400 mt-0.5">{unit.vehicle} • {unit.capability}</div>
                                </div>
                                <div className="text-right">
                                  <span className="text-[10px] font-bold text-cyan-300 px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                                    ETA {unit.eta}
                                  </span>
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  dispatchTeamToCase(c.id, unit.id, true);
                                  setManualAssignCaseId(null);
                                }}
                                className="w-full py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] transition flex items-center justify-center space-x-1 shadow"
                              >
                                <Check className="w-3 h-3" />
                                <span>DISPATCH {unit.callsign}</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): AI Recommendation Box & Facility Continua */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* SECTION 15: AI RECOMMENDATION CARD */}
          <div className="p-4 rounded-2xl bg-[#091224] border-2 border-cyan-500/50 shadow-xl space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-cyan-800/40">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-black text-white text-xs">AI RECOMMENDATION</div>
                  <div className="text-[10px] text-cyan-300">DISPATCH DECISION ENGINE</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold">
                94% MATCH
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-black text-white">RESCUE ALPHA</div>
                <div className="text-[10px] text-slate-400">Vehicle R-07 (Amphibious Rig)</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-cyan-300">ETA 4 MIN</div>
                <div className="text-[10px] text-slate-400">Distance 2.8 km</div>
              </div>
            </div>

            {/* WHY? Checklist */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-[11px]">
              <div className="text-[10px] font-bold text-slate-400 uppercase">WHY RESCUE ALPHA?</div>
              <div className="text-emerald-400 flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Closest available team to Old Bridge</span>
              </div>
              <div className="text-emerald-400 flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Suitable high-clearance rescue vehicle</span>
              </div>
              <div className="text-emerald-400 flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Water-rescue & winch extraction capability</span>
              </div>
              <div className="text-emerald-400 flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Advanced medical life support onboard</span>
              </div>
              <div className="text-emerald-400 flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Reliable mesh communication line</span>
              </div>
            </div>

            {/* Assignment Action & Alternatives Toggle */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => dispatchTeamToCase(selectedCaseId, 'TEAM-ALPHA-04')}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/20 active:scale-98"
              >
                [ AUTO-ASSIGN RESCUE ALPHA TO {selectedCaseId} ]
              </button>

              <button
                onClick={() => setShowAiAlternatives(!showAiAlternatives)}
                className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold transition flex items-center justify-center space-x-1"
              >
                <span>{showAiAlternatives ? 'HIDE ALTERNATIVES' : '[ VIEW ALTERNATIVE UNITS ]'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${showAiAlternatives ? 'rotate-180' : ''}`} />
              </button>

              {showAiAlternatives && (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">CLICK TO MANUALLY DISPATCH:</div>
                  <button
                    onClick={() => dispatchTeamToCase(selectedCaseId, 'AIR-01', true)}
                    className="w-full flex justify-between items-center p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 transition text-left cursor-pointer"
                  >
                    <span className="text-slate-200 font-bold">🚁 COAST GUARD HELO AIR-1</span>
                    <span className="text-cyan-400 font-bold">78% Match (ETA 4m) →</span>
                  </button>
                  <button
                    onClick={() => dispatchTeamToCase(selectedCaseId, 'TEAM-BRAVO-02', true)}
                    className="w-full flex justify-between items-center p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 transition text-left cursor-pointer"
                  >
                    <span className="text-slate-200 font-bold">🛶 ZODIAC RAFT Z-02</span>
                    <span className="text-emerald-400 font-bold">85% Match (ETA 8m) →</span>
                  </button>
                  <button
                    onClick={() => dispatchTeamToCase(selectedCaseId, 'NDRF-UNIT-01', true)}
                    className="w-full flex justify-between items-center p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 transition text-left cursor-pointer"
                  >
                    <span className="text-slate-200 font-bold">🚚 TACTICAL 4X4 UNIT 04</span>
                    <span className="text-amber-400 font-bold">42% Match (ETA 22m) →</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 19: HOSPITAL HANDOFF TRANSMISSION */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
              <span className="font-bold text-white flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>HOSPITAL PRE-ARRIVAL HANDOFF</span>
              </span>
              <span className="text-emerald-400 text-[10px]">TRANSMITTED</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">TARGET FACILITY:</span>
                <span className="font-bold text-white">Government General Hospital</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ESTIMATED ARRIVAL:</span>
                <span className="text-cyan-300 font-bold">12 MIN</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">BED ALLOCATION:</span>
                <span className="text-emerald-400 font-bold">Bed 14A (ER Trauma Bay)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ACTIVE CASUALTIES:</span>
                <span>6 Pax (2 Pediatric Patients)</span>
              </div>
            </div>
          </div>

          {/* SECTION 20: SHELTER CONTINUITY (SAME CASE ID) */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
              <span className="font-bold text-white flex items-center space-x-1.5">
                <Home className="w-4 h-4 text-purple-400" />
                <span>SAFE SHELTER CONTINUITY</span>
              </span>
              <span className="text-purple-300 text-[10px]">SAME CASE ID</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-[11px]">
              <div className="font-bold text-white">VYRO SAFE SHELTER 01</div>
              <div className="grid grid-cols-3 gap-1 text-center">
                <div className="p-1.5 rounded bg-slate-900">
                  <div className="text-[10px] text-slate-400">CAPACITY</div>
                  <div className="font-bold text-slate-100">250</div>
                </div>
                <div className="p-1.5 rounded bg-slate-900">
                  <div className="text-[10px] text-slate-400">OCCUPIED</div>
                  <div className="font-bold text-amber-400">157</div>
                </div>
                <div className="p-1.5 rounded bg-slate-900">
                  <div className="text-[10px] text-slate-400">AVAILABLE</div>
                  <div className="font-bold text-emerald-400">93</div>
                </div>
              </div>
              <div className="text-[10px] text-slate-400">
                Case follows victim directly to safe shelter without re-registration.
              </div>
            </div>
          </div>

          {/* SECTION 21: FAMILY REUNIFICATION */}
          <div 
            onClick={() => setActiveTab('REUNITE')}
            className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-purple-500/40 hover:border-purple-400 transition cursor-pointer space-y-2.5 font-mono text-xs shadow-lg group"
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
              <span className="font-bold text-white flex items-center space-x-1.5">
                <Heart className="w-4 h-4 text-pink-400 fill-current" />
                <span>VYRO REUNITE™</span>
              </span>
              <span className="text-emerald-400 text-[10px] font-bold">98% MATCH FOUND</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">REUNIFICATION CENTER:</span>
                <span className="font-bold text-white">RC-02 (Central Hub)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">MATCH STATUS:</span>
                <span className="text-emerald-400 font-bold">REUNION READY (05)</span>
              </div>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                Two-way identification active. Child & vulnerable person safe verification queue active.
              </div>
            </div>

            <button
              onClick={() => setActiveTab('REUNITE')}
              className="w-full py-2 rounded-xl bg-purple-600/30 group-hover:bg-purple-600/50 border border-purple-500/50 text-purple-200 font-bold text-xs flex items-center justify-center space-x-1.5 transition"
            >
              <Heart className="w-3.5 h-3.5 fill-current text-pink-300" />
              <span>OPEN VYRO REUNITE™ DESK →</span>
            </button>
          </div>

        </div>
      </div>
      )}
    </div>
  );
};
