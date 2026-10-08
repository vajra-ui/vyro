import React, { useState } from 'react';
import { useOperationalStore } from '../../stores/operationalStore';
import { 
  X, 
  MapPin, 
  Navigation, 
  Shield, 
  LifeBuoy, 
  AlertTriangle, 
  HeartPulse, 
  CheckCircle, 
  Clock, 
  Building2, 
  ArrowRight,
  ExternalLink,
  Sparkles,
  RefreshCw,
  PhoneCall
} from 'lucide-react';
import { fetchRealRoadRoute, calculateHaversineDistanceKm } from '../../services/routingService';
import { RescueChainPanel } from './RescueChainPanel';

export const EntityDetailsPanel: React.FC = () => {
  const {
    selectedEntity,
    clearSelection,
    cases,
    rescueTeams,
    medicalTeams,
    hospitals,
    shelters,
    hazardZones,
    assignTeamToVictim,
    updateVictimStatus,
    setActiveRoute,
    triggerFlyTo,
    openBuildingModal,
    activeRoute
  } = useOperationalStore();

  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [selectedTeamForDispatch, setSelectedTeamForDispatch] = useState<string>('');

  if (!selectedEntity) {
    return (
      <aside className="w-84 h-full bg-[#0a0f1d]/95 backdrop-blur-md border-l border-slate-800/80 p-4 flex flex-col justify-between z-20 text-xs font-sans shadow-xl">
        <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-500">
          <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-3">
            <MapPin className="w-6 h-6 text-slate-600" />
          </div>
          <h3 className="font-mono text-sm text-slate-300 font-bold mb-1">TACTICAL INSPECTION</h3>
          <p className="text-xs text-slate-500 max-w-xs">
            Select an operational entity from the map or case log to inspect real coordinates, calculate road routes, or dispatch rescue teams.
          </p>
        </div>
      </aside>
    );
  }

  // 1. VICTIM CASE DETAIL
  if (selectedEntity.type === 'VICTIM') {
    const victim = cases.find((c) => c.id === selectedEntity.id);
    if (!victim) return null;

    const assignedTeam = rescueTeams.find((t) => t.id === victim.assignedTeamId);

    // Calculate nearest available teams with exact distances
    const teamRankings = rescueTeams.map((t) => {
      const dist = calculateHaversineDistanceKm(t.coordinates, victim.coordinates);
      return {
        team: t,
        distanceKm: +dist.toFixed(2),
        estMin: Math.max(2, Math.round((dist / 22) * 60))
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);

    const handleCalculateRoute = async (teamCoords: [number, number], teamName: string) => {
      setIsCalculatingRoute(true);
      try {
        const route = await fetchRealRoadRoute(
          teamCoords,
          victim.coordinates,
          teamName,
          victim.locationName,
          hazardZones
        );
        setActiveRoute(route);
      } finally {
        setIsCalculatingRoute(false);
      }
    };

    return (
      <aside className="w-84 h-full bg-[#0a0f1d]/95 backdrop-blur-md border-l border-slate-800/80 flex flex-col z-20 text-xs shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-800 bg-slate-900/70 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-sm text-slate-100">{victim.id}</span>
              <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-bold ${
                victim.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-orange-500/20 text-orange-300 border-orange-500/40'
              }`}>
                {victim.priority}
              </span>
            </div>
            <div className="text-slate-300 font-semibold text-xs mt-1">{victim.name}</div>
          </div>
          <button onClick={clearSelection} className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3.5 space-y-3.5 flex-1">
          {/* Spatial Telemetry Card */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono space-y-1.5">
            <div className="text-slate-400 uppercase text-[10px] tracking-wider font-bold text-cyan-400 flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span>REAL GEOSPATIAL LOCATION</span>
            </div>
            <div className="text-slate-200 font-sans font-semibold text-xs">{victim.locationName}</div>
            <div className="text-slate-400 flex justify-between">
              <span>COORDINATES:</span>
              <span className="text-slate-200">{victim.coordinates[1].toFixed(5)}° N, {victim.coordinates[0].toFixed(5)}° E</span>
            </div>
            <div className="text-slate-400 flex justify-between">
              <span>GPS ACCURACY:</span>
              <span className="text-emerald-400">±{victim.accuracyMeters} meters</span>
            </div>
            <div className="text-slate-400 flex justify-between">
              <span>LAST VERIFIED:</span>
              <span>{victim.lastVerifiedAt}</span>
            </div>
            <div className="text-slate-400 flex justify-between">
              <span>INTEL SOURCE:</span>
              <span className="text-slate-200 truncate max-w-[150px]">{victim.source}</span>
            </div>
          </div>

          {/* Medical Needs & Triage */}
          <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 space-y-1 text-rose-200">
            <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-rose-400 flex items-center space-x-1">
              <HeartPulse className="w-3 h-3" />
              <span>TRIAGE & MEDICAL NEEDS</span>
            </div>
            <p className="text-xs leading-relaxed font-sans">{victim.medicalNeeds}</p>
          </div>

          {/* AI Operational Insight */}
          <div className="p-3 rounded-lg bg-sky-950/20 border border-sky-500/30 text-sky-200 space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-sky-400 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              <span>AI RESCUE PLAN RECOMMENDATION</span>
            </div>
            <p className="text-[11px] font-sans leading-relaxed text-slate-300">
              {teamRankings[0] ? (
                <>
                  Optimal deployment: <strong>{teamRankings[0].team.name}</strong> ({teamRankings[0].distanceKm} km away, ETA ~{teamRankings[0].estMin} mins). Route via northern road segment to bypass 1.4m backwater surge.
                </>
              ) : 'No team available.'}
            </p>
          </div>

          {/* Team Assignment & Road Routing */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="text-[10px] font-mono uppercase font-bold text-slate-400 flex items-center justify-between">
              <span>DISPATCH & ROUTING</span>
              {assignedTeam && <span className="text-sky-400">ASSIGNED: {assignedTeam.name}</span>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-mono">SELECT RESCUE TEAM:</label>
              <select
                value={selectedTeamForDispatch || victim.assignedTeamId || ''}
                onChange={(e) => setSelectedTeamForDispatch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="">-- Choose Team (Ranked by proximity) --</option>
                {teamRankings.map((r) => (
                  <option key={r.team.id} value={r.team.id}>
                    {r.team.name} ({r.distanceKm} km, ~{r.estMin} min) - {r.team.status}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  const targetTeamId = selectedTeamForDispatch || teamRankings[0]?.team.id;
                  if (targetTeamId) {
                    assignTeamToVictim(targetTeamId, victim.id);
                    const t = rescueTeams.find((x) => x.id === targetTeamId);
                    if (t) handleCalculateRoute(t.coordinates, t.name);
                  }
                }}
                className="py-1.5 px-2 rounded bg-sky-600 hover:bg-sky-500 font-mono font-bold text-white text-[11px] transition shadow flex items-center justify-center space-x-1"
              >
                <LifeBuoy className="w-3.5 h-3.5" />
                <span>DISPATCH TEAM</span>
              </button>

              <button
                disabled={isCalculatingRoute}
                onClick={() => {
                  const t = assignedTeam || rescueTeams[0];
                  if (t) handleCalculateRoute(t.coordinates, t.name);
                }}
                className="py-1.5 px-2 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 font-mono text-slate-200 text-[11px] transition flex items-center justify-center space-x-1"
              >
                <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isCalculatingRoute ? 'CALCULATING...' : 'SHOW ROUTE'}</span>
              </button>
            </div>
          </div>

          {/* Active Route Telemetry (if calculated) */}
          {activeRoute && (
            <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/40 text-xs font-mono space-y-1 text-cyan-200">
              <div className="font-bold flex items-center justify-between text-cyan-300">
                <span>REAL ROAD ROUTE (OSRM)</span>
                <span className="text-[10px] px-1.5 rounded bg-cyan-500/20 border border-cyan-500/40">{activeRoute.risk} RISK</span>
              </div>
              <div className="text-slate-300 flex justify-between">
                <span>ROAD DISTANCE:</span>
                <strong className="text-white">{activeRoute.distanceKm} km</strong>
              </div>
              <div className="text-slate-300 flex justify-between">
                <span>ESTIMATED TIME:</span>
                <strong className="text-white">{activeRoute.estimatedMinutes} min</strong>
              </div>
              <div className="text-[10px] text-amber-300/90 mt-1 pt-1 border-t border-cyan-800/60 leading-tight">
                {activeRoute.riskReason}
              </div>
            </div>
          )}

          {/* Rescue Chain Intelligence Journey */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <RescueChainPanel victimCase={victim} />
          </div>

          {/* Operational Status Actions */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
              UPDATE OPERATIONAL STATUS
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => updateVictimStatus(victim.id, 'ON_SCENE', 'Team arrived at structure')}
                className="py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono transition border border-slate-700"
              >
                ON SCENE
              </button>
              <button
                onClick={() => updateVictimStatus(victim.id, 'RESCUED', 'Victim successfully extricated')}
                className="py-1 px-2 rounded bg-emerald-600/80 hover:bg-emerald-500 text-white text-[10px] font-mono transition font-bold"
              >
                RESCUED
              </button>
              <button
                onClick={() => updateVictimStatus(victim.id, 'MEDICAL_HANDOFF', 'Transferred to EMS ambulance')}
                className="py-1 px-2 rounded bg-teal-600/80 hover:bg-teal-500 text-white text-[10px] font-mono transition font-bold"
              >
                MED HANDOFF
              </button>
              <button
                onClick={() => updateVictimStatus(victim.id, 'SHELTERED', 'Checked into Government HSS shelter')}
                className="py-1 px-2 rounded bg-purple-600/80 hover:bg-purple-500 text-white text-[10px] font-mono transition font-bold"
              >
                SHELTERED
              </button>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // 2. RESCUE TEAM DETAIL
  if (selectedEntity.type === 'TEAM') {
    const team = rescueTeams.find((t) => t.id === selectedEntity.id);
    if (!team) return null;

    return (
      <aside className="w-84 h-full bg-[#0a0f1d]/95 backdrop-blur-md border-l border-slate-800/80 p-3.5 flex flex-col z-20 text-xs shadow-2xl overflow-y-auto">
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-sm text-slate-100">{team.name}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold">
                {team.status}
              </span>
            </div>
            <div className="text-slate-400 text-xs mt-0.5">Callsign: <strong>{team.callsign}</strong></div>
          </div>
          <button onClick={clearSelection} className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 mt-3">
          <div className="p-3 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono space-y-1.5">
            <div className="text-sky-400 font-bold uppercase text-[10px] flex items-center justify-between">
              <span>LIVE GPS TELEMETRY</span>
              <span className="text-emerald-400">● {team.trackingActive ? 'ACTIVE' : 'OFF'}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>POSITION:</span>
              <span>{team.coordinates[1].toFixed(5)}° N, {team.coordinates[0].toFixed(5)}° E</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>GPS ACCURACY:</span>
              <span className="text-emerald-400">±{team.accuracyMeters}m</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>LAST UPDATE:</span>
              <span>{team.lastLocationUpdate}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>VEHICLE:</span>
              <span>{team.vehicleType}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>PERSONNEL:</span>
              <span>{team.personnelCount} Operators</span>
            </div>
          </div>

          {team.assignedMissionId && (
            <div className="p-3 rounded bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase">ASSIGNED MISSION</div>
              <div className="font-mono font-bold text-cyan-400">{team.assignedMissionId}</div>
              <button
                onClick={() => {
                  const c = cases.find((x) => x.id === team.assignedMissionId);
                  if (c) {
                    triggerFlyTo({ coordinates: c.coordinates, zoom: 17, pitch: 65 });
                  }
                }}
                className="w-full mt-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition"
              >
                VIEW TARGET SCENE 3D
              </button>
            </div>
          )}
        </div>
      </aside>
    );
  }

  // 3. HOSPITAL DETAIL
  if (selectedEntity.type === 'HOSPITAL') {
    const hosp = hospitals.find((h) => h.id === selectedEntity.id);
    if (!hosp) return null;

    return (
      <aside className="w-84 h-full bg-[#0a0f1d]/95 backdrop-blur-md border-l border-slate-800/80 p-3.5 flex flex-col z-20 text-xs shadow-2xl overflow-y-auto">
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="font-mono font-bold text-sm text-slate-100">{hosp.name}</div>
            <div className="text-[10px] font-mono text-emerald-400 mt-0.5">{hosp.traumaLevel} TRAUMA CENTER</div>
          </div>
          <button onClick={clearSelection} className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 mt-3">
          <div className="p-3 rounded bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">CAPACITY METRICS</div>
            <div className="grid grid-cols-2 gap-2 text-center font-mono">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-lg font-bold text-emerald-400">{hosp.availableBeds}</div>
                <div className="text-[10px] text-slate-400">BEDS FREE / {hosp.totalBeds}</div>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-lg font-bold text-cyan-400">{hosp.icuAvailable}</div>
                <div className="text-[10px] text-slate-400">ICU BEDS / {hosp.icuTotal}</div>
              </div>
            </div>
            <div className="text-xs text-slate-300 pt-1 flex justify-between">
              <span>Incoming Casualties:</span>
              <strong className="text-amber-400">{hosp.activeIncomingCasualties} in transit</strong>
            </div>
          </div>

          <button
            onClick={() => openBuildingModal(hosp.id, 'HOSPITAL')}
            className="w-full py-2 rounded bg-emerald-600 hover:bg-emerald-500 font-mono font-bold text-white text-xs transition flex items-center justify-center space-x-1.5 shadow"
          >
            <Building2 className="w-4 h-4" />
            <span>INSPECT REAL 3D FACILITY</span>
          </button>
        </div>
      </aside>
    );
  }

  // 4. SHELTER DETAIL
  if (selectedEntity.type === 'SHELTER') {
    const shelter = shelters.find((s) => s.id === selectedEntity.id);
    if (!shelter) return null;

    const available = shelter.capacity - shelter.currentOccupancy;
    const occupancyPct = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);

    return (
      <aside className="w-84 h-full bg-[#0a0f1d]/95 backdrop-blur-md border-l border-slate-800/80 p-3.5 flex flex-col z-20 text-xs shadow-2xl overflow-y-auto">
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="font-mono font-bold text-sm text-slate-100">{shelter.name}</div>
            <div className="text-[10px] font-mono text-purple-400 mt-0.5">RELIEF SHELTER & EVACUATION</div>
          </div>
          <button onClick={clearSelection} className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 mt-3">
          <div className="p-3 rounded bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-mono text-slate-300">
              <span>OCCUPANCY ({occupancyPct}%)</span>
              <span><strong>{shelter.currentOccupancy}</strong> / {shelter.capacity}</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${occupancyPct}%` }}></div>
            </div>
            <div className="text-[11px] font-mono text-emerald-400 flex justify-between">
              <span>AVAILABLE SPACES:</span>
              <strong className="text-white">{available}</strong>
            </div>
            <div className="text-[11px] font-mono text-slate-400 flex justify-between">
              <span>MEDICAL SUPPORT:</span>
              <span className="text-emerald-400">{shelter.medicalSupport ? 'AVAILABLE' : 'NONE'}</span>
            </div>
          </div>

          <button
            onClick={() => openBuildingModal(shelter.id, 'SHELTER')}
            className="w-full py-2 rounded bg-purple-600 hover:bg-purple-500 font-mono font-bold text-white text-xs transition flex items-center justify-center space-x-1.5 shadow"
          >
            <Building2 className="w-4 h-4" />
            <span>INSPECT REAL 3D FACILITY</span>
          </button>
        </div>
      </aside>
    );
  }

  return null;
};
