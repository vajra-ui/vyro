import React, { useState } from 'react';
import { useOperationalStore } from '../../stores/operationalStore';
import { Role, DisasterType } from '../../types/vyro';
import { 
  Wifi, 
  WifiOff,
  Radio, 
  UserCheck, 
  AlertTriangle, 
  Play, 
  Sparkles, 
  Layers,
  ChevronDown,
  ShieldCheck,
  RefreshCw,
  Heart
} from 'lucide-react';

export const TopNav: React.FC<{ onOpenRoleModal: () => void }> = ({ onOpenRoleModal }) => {
  const { 
    currentRole, 
    networkStatus, 
    setNetworkStatus,
    cases, 
    rescueTeams, 
    chainBreaks,
    activeDisaster,
    setActiveDisaster,
    startDemoWalkthrough,
    syncOfflineQueue,
    setPrimaryViewMode,
    primaryViewMode,
    openCompilerModal,
    openFamilyModal
  } = useOperationalStore();

  const [isNetMenuOpen, setIsNetMenuOpen] = useState(false);
  const [isDisasterMenuOpen, setIsDisasterMenuOpen] = useState(false);

  const criticalCount = cases.filter((c) => c.priority === 'CRITICAL').length;
  const activeTeamsCount = rescueTeams.filter((t) => t.status === 'EN_ROUTE' || t.status === 'ON_SCENE').length;
  const activeChainBreaks = chainBreaks.filter((cb) => !cb.isResolved).length;

  return (
    <header className="h-14 bg-[#0a0f1d]/95 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-4 flex items-center justify-between z-30 select-none shadow-md">
      {/* Brand & Incident Section */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center font-black tracking-wider text-white shadow-lg shadow-sky-500/20">
            V
          </div>
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-extrabold tracking-widest text-slate-100 text-sm">VYRO</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold tracking-wider">
                VIGILANT RESCUE OPERATIONS
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono tracking-tight flex items-center space-x-1">
              <span>FROM FIRST SOS TO FINAL REUNION</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400 font-semibold">{activeDisaster}</span>
            </div>
          </div>
        </div>

        {/* Live Counters */}
        <div className="hidden lg:flex items-center pl-4 border-l border-slate-800 space-x-3 text-xs font-mono">
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>CRITICAL: <strong>{criticalCount}</strong></span>
          </div>
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-sky-500/10 border border-sky-500/30 text-sky-300">
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            <span>TEAMS: <strong>{activeTeamsCount}</strong></span>
          </div>
          {activeChainBreaks > 0 && (
            <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold animate-pulse">
              <span>⚠ CHAIN BREAKS: {activeChainBreaks}</span>
            </div>
          )}
        </div>
      </div>

      {/* Disaster Mode Switcher Dropdown */}
      <div className="hidden md:flex items-center space-x-2 relative font-mono text-xs">
        <div className="relative">
          <button
            onClick={() => setIsDisasterMenuOpen(!isDisasterMenuOpen)}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
          >
            <span className="text-slate-500 text-[10px]">SCENARIO:</span>
            <span className="font-bold text-amber-400">{activeDisaster}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isDisasterMenuOpen && (
            <div className="absolute top-8 left-0 w-44 bg-[#0a0f1d] border border-slate-700 rounded-xl shadow-2xl p-1 z-40 space-y-0.5">
              {(['FLOOD', 'CYCLONE', 'FIRE', 'EARTHQUAKE', 'TSUNAMI', 'LANDSLIDE'] as DisasterType[]).map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setActiveDisaster(d);
                    setIsDisasterMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition flex items-center justify-between ${
                    activeDisaster === d
                      ? 'bg-amber-500/20 text-amber-300 font-bold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span>{d}</span>
                  {activeDisaster === d && <span className="text-amber-400">●</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-1.5 sm:space-x-2.5">
        {/* Dedicated 3D Twin View Switcher Button */}
        <button
          onClick={() => setPrimaryViewMode(primaryViewMode === '3D_TWIN' ? 'COMMAND_CENTER' : '3D_TWIN')}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border font-mono text-[11px] font-bold transition shadow-sm ${
            primaryViewMode === '3D_TWIN'
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-cyan-500/20'
              : 'bg-slate-900 border-cyan-500/40 text-cyan-300 hover:bg-slate-800 hover:text-white'
          }`}
          title="Toggle Full Dedicated 3D City Twin View"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden md:inline">3D CITY TWIN</span>
        </button>

        {/* VYRO REUNITE™ Family Reunification Platform Trigger */}
        <button
          onClick={openFamilyModal}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-purple-950/70 hover:bg-purple-900 border border-purple-500/50 text-purple-200 font-mono text-[11px] font-bold transition shadow-sm"
          title="Open VYRO REUNITE™ Family Reunification Platform"
        >
          <Heart className="w-3.5 h-3.5 text-pink-400 fill-current" />
          <span className="hidden md:inline">REUNITE</span>
        </button>

        {/* AI Emergency Compiler Modal Trigger Button */}
        <button
          onClick={openCompilerModal}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[11px] font-bold transition shadow-sm"
          title="Open VYRO AI Emergency Compiler"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">AI COMPILER</span>
        </button>

        {/* 15-Step Guided Lifecycle Demo Tour Button for Judges */}
        <button
          onClick={startDemoWalkthrough}
          className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-mono text-[11px] font-bold transition shadow-md shadow-cyan-600/30 cursor-pointer"
          title="Play 15-Step Rescue Lifecycle Demonstration"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">DEMO TOUR</span>
          <span className="sm:hidden">TOUR</span>
        </button>

        {/* Network Status & Offline Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsNetMenuOpen(!isNetMenuOpen)}
            className="flex items-center space-x-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-white transition"
          >
            {networkStatus === 'OFFLINE' ? (
              <WifiOff className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span className={networkStatus === 'OFFLINE' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
              {networkStatus}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {isNetMenuOpen && (
            <div className="absolute top-8 right-0 w-44 bg-[#0a0f1d] border border-slate-700 rounded-xl shadow-2xl p-1 z-40 space-y-0.5">
              {(['ONLINE', 'LIMITED', 'SYNCING', 'OFFLINE'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setNetworkStatus(st);
                    setIsNetMenuOpen(false);
                    if (st === 'ONLINE') syncOfflineQueue();
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition flex items-center justify-between ${
                    networkStatus === st
                      ? 'bg-slate-800 text-cyan-300 font-bold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span>{st}</span>
                  {networkStatus === st && <span className="text-cyan-400">●</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Operational Demo Access Button */}
        <button
          onClick={onOpenRoleModal}
          className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs transition shadow-sm"
          title="Switch Operational Demo Role"
        >
          <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
          <div className="text-left font-mono">
            <div className="text-[9px] text-slate-400 uppercase tracking-wider leading-none">ROLE:</div>
            <div className="text-slate-100 font-bold leading-tight">{currentRole}</div>
          </div>
          <span className="ml-1 text-[9px] px-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            DEMO
          </span>
        </button>
      </div>
    </header>
  );
};
