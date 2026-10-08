import React, { useState } from 'react';
import { useOperationalStore } from '../../stores/operationalStore';
import { CasePriority, VictimCase } from '../../types/vyro';
import { 
  AlertCircle, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  LifeBuoy, 
  Hospital, 
  Home, 
  ChevronRight,
  Filter,
  CheckCircle2
} from 'lucide-react';

export const CasesListPanel: React.FC = () => {
  const { cases, rescueTeams, hospitals, shelters, selectedEntity, selectEntity } = useOperationalStore();
  const [filterPriority, setFilterPriority] = useState<CasePriority | 'ALL'>('ALL');
  const [activeTab, setActiveTab] = useState<'CASES' | 'RESOURCES'>('CASES');

  const criticalCount = cases.filter((c) => c.priority === 'CRITICAL').length;
  const highCount = cases.filter((c) => c.priority === 'HIGH').length;
  const activeCount = cases.filter((c) => c.priority === 'ACTIVE').length;
  const chainBreakCount = cases.filter((c) => c.priority === 'CHAIN_BREAK').length;

  const filteredCases = cases.filter((c) => {
    if (filterPriority === 'ALL') return true;
    return c.priority === filterPriority;
  });

  return (
    <aside className="w-80 h-full bg-[#0a0f1d]/95 backdrop-blur-md border-r border-slate-800/80 flex flex-col z-20 text-xs font-sans shadow-xl">
      {/* Top Header & Sub-Tabs */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-mono font-bold tracking-wider text-slate-200 text-xs flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>INCIDENT LOG</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            TOTAL CASES: <strong>{cases.length}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-md border border-slate-800">
          <button
            onClick={() => setActiveTab('CASES')}
            className={`py-1 rounded text-center font-mono font-semibold text-[11px] transition ${
              activeTab === 'CASES'
                ? 'bg-slate-800 text-cyan-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CASES ({cases.length})
          </button>
          <button
            onClick={() => setActiveTab('RESOURCES')}
            className={`py-1 rounded text-center font-mono font-semibold text-[11px] transition ${
              activeTab === 'RESOURCES'
                ? 'bg-slate-800 text-cyan-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            RESOURCES
          </button>
        </div>
      </div>

      {activeTab === 'CASES' ? (
        <>
          {/* Priority Pill Filters */}
          <div className="px-3 py-2 border-b border-slate-800/80 flex items-center space-x-1 overflow-x-auto scrollbar-none bg-slate-900/30">
            <button
              onClick={() => setFilterPriority('ALL')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition ${
                filterPriority === 'ALL'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              ALL ({cases.length})
            </button>
            <button
              onClick={() => setFilterPriority('CRITICAL')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition flex items-center space-x-1 ${
                filterPriority === 'CRITICAL'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-rose-400/80 hover:bg-slate-800'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span>CRIT ({criticalCount})</span>
            </button>
            <button
              onClick={() => setFilterPriority('CHAIN_BREAK')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition flex items-center space-x-1 ${
                filterPriority === 'CHAIN_BREAK'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-amber-400/80 hover:bg-slate-800'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>BREAKS ({chainBreakCount})</span>
            </button>
            <button
              onClick={() => setFilterPriority('HIGH')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition ${
                filterPriority === 'HIGH'
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                  : 'text-orange-400/80 hover:bg-slate-800'
              }`}
            >
              HIGH ({highCount})
            </button>
          </div>

          {/* Cases List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredCases.map((c) => {
              const isSelected = selectedEntity?.type === 'VICTIM' && selectedEntity?.id === c.id;
              const priorityColors: Record<CasePriority, { border: string; bg: string; text: string; badge: string }> = {
                CRITICAL: { border: 'border-rose-500/60', bg: 'bg-rose-950/20', text: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
                HIGH: { border: 'border-orange-500/60', bg: 'bg-orange-950/20', text: 'text-orange-400', badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40' },
                ACTIVE: { border: 'border-sky-500/60', bg: 'bg-sky-950/20', text: 'text-sky-400', badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40' },
                CHAIN_BREAK: { border: 'border-amber-500/60', bg: 'bg-amber-950/20', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40' }
              };
              const col = priorityColors[c.priority];

              return (
                <div
                  key={c.id}
                  onClick={() => selectEntity('VICTIM', c.id)}
                  className={`cursor-pointer p-2.5 rounded-lg border transition-all relative ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-400 ring-1 ring-cyan-400 shadow-md'
                      : `bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40`
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono font-bold text-slate-100">{c.id}</span>
                        <span className={`text-[9px] font-mono px-1 py-0.2 rounded border font-semibold ${col.badge}`}>
                          {c.priority}
                        </span>
                      </div>
                      <div className="text-slate-300 font-medium text-[11px] mt-0.5 truncate max-w-[190px]">
                        {c.name}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 flex items-center space-x-0.5">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{c.lastVerifiedAt.split(' ')[0]}</span>
                    </span>
                  </div>

                  <div className="mt-2 flex items-center space-x-1 text-[11px] text-slate-400 truncate">
                    <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate">{c.locationName}</span>
                  </div>

                  {c.hazardProximityNote && (
                    <div className="mt-1.5 px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-[10px] font-mono text-rose-300 truncate">
                      ⚠ {c.hazardProximityNote}
                    </div>
                  )}

                  <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">
                      STATUS: <strong className="text-slate-200">{c.status}</strong>
                    </span>
                    <span className="text-cyan-400 group-hover:underline flex items-center">
                      FLY TO 3D <ChevronRight className="w-3 h-3 inline" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Resources List Tab */
        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          {/* Rescue Teams */}
          <div>
            <div className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>RESCUE TEAMS ({rescueTeams.length})</span>
            </div>
            <div className="space-y-1.5">
              {rescueTeams.map((t) => (
                <div
                  key={t.id}
                  onClick={() => selectEntity('TEAM', t.id)}
                  className="cursor-pointer p-2 rounded bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800 text-xs transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-slate-200">{t.name}</span>
                    <span className={`text-[9px] font-mono px-1 py-0.2 rounded border ${
                      t.status === 'EN_ROUTE' ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                    <span>Callsign: {t.callsign}</span>
                    <span>GPS: ±{t.accuracyMeters}m</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hospitals */}
          <div>
            <div className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <Hospital className="w-3.5 h-3.5" />
              <span>HOSPITALS ({hospitals.length})</span>
            </div>
            <div className="space-y-1.5">
              {hospitals.map((h) => (
                <div
                  key={h.id}
                  onClick={() => selectEntity('HOSPITAL', h.id)}
                  className="cursor-pointer p-2 rounded bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800 text-xs transition"
                >
                  <div className="font-semibold text-slate-200 truncate">{h.name}</div>
                  <div className="text-[10px] font-mono text-emerald-400 mt-0.5 flex justify-between">
                    <span>Avail: {h.availableBeds}/{h.totalBeds} beds</span>
                    <span>ICU: {h.icuAvailable} free</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shelters */}
          <div>
            <div className="text-[11px] font-mono font-bold text-purple-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <Home className="w-3.5 h-3.5" />
              <span>SHELTERS ({shelters.length})</span>
            </div>
            <div className="space-y-1.5">
              {shelters.map((s) => (
                <div
                  key={s.id}
                  onClick={() => selectEntity('SHELTER', s.id)}
                  className="cursor-pointer p-2 rounded bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800 text-xs transition"
                >
                  <div className="font-semibold text-slate-200 truncate">{s.name}</div>
                  <div className="text-[10px] font-mono text-purple-400 mt-0.5 flex justify-between">
                    <span>Occupancy: {s.currentOccupancy}/{s.capacity}</span>
                    <span>Free: {s.capacity - s.currentOccupancy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
