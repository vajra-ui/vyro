import React, { useState, useEffect } from 'react';
import { useOperationalStore } from '../../stores/operationalStore';
import { SimulatedCityTwin3D } from '../map/SimulatedCityTwin3D';
import { 
  LifeBuoy, 
  Navigation, 
  MapPin, 
  ShieldCheck, 
  Radio, 
  AlertTriangle, 
  CheckCircle2, 
  HeartHandshake, 
  Compass,
  ArrowRight,
  Radar,
  HeartPulse,
  Package,
  Share2,
  Maximize2
} from 'lucide-react';
import { deviceGeolocation } from '../../services/geolocationService';

export const RescuerDashboard: React.FC = () => {
  const {
    rescueTeams,
    cases,
    updateRescueTeamLocation,
    updateVictimStatus,
    activeRoute,
    isGpsTracking,
    setGpsTracking,
    advanceRescueChain,
    openLiveTrackingModal
  } = useOperationalStore();

  const myTeam = rescueTeams.find((t) => t.id === 'TEAM-BRAVO-02') || rescueTeams[0];
  const assignedCase = cases.find((c) => c.id === myTeam.assignedMissionId) || cases[0];

  const [activeTab, setActiveTab] = useState<'RADAR' | 'SURVIVAL' | 'PACKET' | 'MESH'>('RADAR');
  const [mobileTab, setMobileTab] = useState<'HUD' | 'MAP'>('HUD');
  const [beaconCount, setBeaconCount] = useState(0);
  const [lastBeaconTime, setLastBeaconTime] = useState<string | null>(null);

  const handleImStillHere = () => {
    setBeaconCount((c) => c + 1);
    const timeStr = `${new Date().toLocaleTimeString()} IST`;
    setLastBeaconTime(timeStr);
  };

  // Progress status calculation
  const getStepStatus = (step: number) => {
    if (assignedCase.status === 'REPORTED') return step === 1;
    if (assignedCase.status === 'ASSIGNED') return step <= 2;
    if (assignedCase.status === 'EN_ROUTE') return step <= 3;
    if (assignedCase.status === 'ON_SCENE') return step <= 4;
    if (assignedCase.status === 'RESCUED' || assignedCase.status === 'MEDICAL_HANDOFF' || assignedCase.status === 'HOSPITALIZED' || assignedCase.status === 'CLOSED') return true;
    return false;
  };

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] flex flex-col md:flex-row overflow-hidden bg-[#070b14] text-slate-100 font-sans">
      {/* Mobile Top Segment Switcher */}
      <div className="md:hidden flex items-center justify-around bg-[#0a1122] border-b border-slate-800 p-1.5 shrink-0 z-30 font-mono text-xs">
        <button
          onClick={() => setMobileTab('HUD')}
          className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition ${
            mobileTab === 'HUD'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Radar className="w-4 h-4 text-cyan-400" />
          <span>TACTICAL RADAR</span>
        </button>
        <button
          onClick={() => setMobileTab('MAP')}
          className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition ${
            mobileTab === 'MAP'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>3D MISSION MAP</span>
        </button>
      </div>

      {/* Tactical Mobile-First Left Panel */}
      <div className={`w-full md:w-[420px] h-full bg-[#081020]/95 backdrop-blur-md border-r border-slate-800 p-3 sm:p-5 flex flex-col justify-between z-20 text-xs overflow-y-auto shadow-2xl ${
        mobileTab === 'MAP' ? 'hidden md:flex' : 'flex'
      }`}>
        <div className="space-y-4">
          {/* 1. "I'M STILL HERE" MICRO-BEACON */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/40 shadow-lg space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-cyan-300 font-bold flex items-center space-x-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                <span>"I'M STILL HERE" MICRO-BEACON</span>
              </span>
              <span className="text-[10px] text-slate-400">
                {lastBeaconTime ? `Last: ${lastBeaconTime}` : 'STANDBY'}
              </span>
            </div>
            <button
              onClick={handleImStillHere}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
            >
              <Radio className="w-4 h-4" />
              <span>I'M STILL HERE ({beaconCount})</span>
            </button>
            <div className="text-[9px] font-mono text-slate-400 text-center">
              Emits high-frequency ultrasonic & LoRa heartbeat to command net
            </div>
          </div>

          {/* 2. TACTICAL TABS: RADAR / SURVIVAL / PACKET / MESH */}
          <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px]">
            {(['RADAR', 'SURVIVAL', 'PACKET', 'MESH'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-1.5 rounded-lg font-bold transition ${
                  activeTab === tab
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          {activeTab === 'RADAR' && (
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">ASSIGNED RESCUE TEAM:</span>
                <strong className="text-cyan-300 font-bold">{myTeam.name}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">UNIT STATUS:</span>
                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">
                  {myTeam.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">DISTANCE TO TARGET:</span>
                <strong className="text-white">531 m (Canal Transit)</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">ESTIMATED ETA:</span>
                <strong className="text-emerald-400 font-bold">4 min</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">LOCATION CONFIDENCE:</span>
                <span className="text-cyan-300 font-bold">98.4% (Live Triangulation)</span>
              </div>

              {/* Live Tracking Modal Trigger */}
              <button
                onClick={() => openLiveTrackingModal(myTeam.id)}
                className="w-full mt-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 text-cyan-300 font-bold transition flex items-center justify-center space-x-1.5"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>OPEN LIVE RESCUER GPS TRACKING</span>
              </button>
            </div>
          )}

          {activeTab === 'SURVIVAL' && (
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="text-slate-300 font-bold flex items-center space-x-1.5 text-rose-300">
                <HeartPulse className="w-4 h-4 text-rose-400" />
                <span>VICTIM TRIAGE PROTOCOL</span>
              </div>
              <div className="text-[11px] text-slate-400 space-y-1">
                <div>• Patient: #{assignedCase.id} ({assignedCase.name})</div>
                <div>• Condition: {assignedCase.medicalNeeds}</div>
                <div>• People Trapped: {assignedCase.peopleCount} Citizens</div>
                <div>• Extraction: Rooftop Winch to Zodiac Boat</div>
              </div>
            </div>
          )}

          {activeTab === 'PACKET' && (
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs font-mono">
              <div className="text-cyan-300 font-bold flex items-center space-x-1.5">
                <Package className="w-4 h-4 text-cyan-400" />
                <span>TACTICAL PAYLOAD PACKET</span>
              </div>
              <div className="text-[10px] text-slate-400 space-y-0.5">
                <div>Packet ID: PKT-VYRO-45872</div>
                <div>Encryption: ChaCha20-Poly1305</div>
                <div>Frequency: 915.2 MHz LoRa SF7</div>
                <div>Handoff Target: St. Mary's General Hospital</div>
              </div>
            </div>
          )}

          {activeTab === 'MESH' && (
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs font-mono">
              <div className="text-emerald-300 font-bold flex items-center space-x-1.5">
                <Share2 className="w-4 h-4 text-emerald-400" />
                <span>MESH RELAY TOPOLOGY</span>
              </div>
              <div className="text-[10px] text-slate-400 space-y-0.5">
                <div>• Relay 01 (Old Bridge): ACTIVE (Signal: -64 dBm)</div>
                <div>• Relay 02 (Tower Rooftop): ACTIVE (Signal: -71 dBm)</div>
                <div>• Relay 03 (Harbor Basin): ACTIVE (Signal: -78 dBm)</div>
                <div>• Mesh Latency: 22ms round-trip</div>
              </div>
            </div>
          )}

          {/* 3. RESCUE LIFECYCLE PROGRESS BAR: 1. SOS SENT -> 2. ASSIGNED -> 3. EN ROUTE -> 4. ON SCENE -> 5. RESCUED */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
              RESCUE MISSION LIFECYCLE
            </span>
            <div className="flex items-center justify-between text-[10px] font-mono">
              {[
                { step: 1, label: '1. SOS' },
                { step: 2, label: '2. ASSIGN' },
                { step: 3, label: '3. ROUTE' },
                { step: 4, label: '4. SCENE' },
                { step: 5, label: '5. RESCUED' }
              ].map((s) => {
                const isPassed = getStepStatus(s.step);
                return (
                  <div key={s.step} className="flex flex-col items-center">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] mb-1 ${
                      isPassed ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {isPassed ? '✓' : s.step}
                    </div>
                    <span className={isPassed ? 'text-cyan-300 font-bold' : 'text-slate-600'}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. RESCUER ACTIONS: EN ROUTE, ARRIVED, VICTIM LOCATED, VICTIM SECURED, MEDICAL HANDOFF */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center justify-between">
              <span>FIELD STAGE CONTROLS</span>
              <span className="text-cyan-400 font-mono">TACTICAL STATE</span>
            </span>

            <div className="space-y-1.5 font-mono text-xs">
              <button
                onClick={() => {
                  updateVictimStatus(assignedCase.id, 'EN_ROUTE', 'Unit en route');
                  advanceRescueChain(assignedCase.id, 'RESCUER_EN_ROUTE', { actor: myTeam.name, role: 'RESCUER' });
                }}
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition flex items-center justify-center space-x-2 shadow cursor-pointer"
              >
                <span>1. EN ROUTE</span>
              </button>

              <button
                onClick={() => {
                  updateVictimStatus(assignedCase.id, 'ON_SCENE', 'Unit arrived at structure');
                  advanceRescueChain(assignedCase.id, 'VICTIM_LOCATED', { actor: myTeam.name, notes: 'Rescuer arrived at location' });
                }}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition flex items-center justify-center space-x-2 shadow cursor-pointer"
              >
                <span>2. ARRIVED (ON SCENE)</span>
              </button>

              <button
                onClick={() => {
                  updateVictimStatus(assignedCase.id, 'ON_SCENE', 'Victim visually located on rooftop');
                  advanceRescueChain(assignedCase.id, 'VICTIM_LOCATED', { actor: myTeam.name, notes: 'Victim confirmed safe on roof' });
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition flex items-center justify-center space-x-2 shadow cursor-pointer"
              >
                <span>3. VICTIM LOCATED</span>
              </button>

              <button
                onClick={() => {
                  updateVictimStatus(assignedCase.id, 'RESCUED', 'Victim secured into zodiac craft');
                  advanceRescueChain(assignedCase.id, 'RESCUE_COMPLETED', { actor: myTeam.name, notes: 'Extricated into raft' });
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center justify-center space-x-2 shadow cursor-pointer"
              >
                <span>4. VICTIM SECURED</span>
              </button>

              <button
                onClick={() => {
                  updateVictimStatus(assignedCase.id, 'MEDICAL_HANDOFF', 'Handoff to Paramedic ambulance');
                  advanceRescueChain(assignedCase.id, 'MEDICAL_HANDOFF', { actor: myTeam.name, notes: 'Handoff to EMS Team' });
                }}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition flex items-center justify-center space-x-2 shadow cursor-pointer"
              >
                <span>5. MEDICAL HANDOFF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tactical 3D Viewport in Rescuer View */}
      <div className={`relative flex-1 h-full overflow-hidden bg-[#050914] ${
        mobileTab === 'HUD' ? 'hidden md:block' : 'block'
      }`}>
        <SimulatedCityTwin3D isHeroMode={true} />
      </div>
    </div>
  );
};
