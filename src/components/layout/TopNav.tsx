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
  Heart,
  Menu,
  X,
  Compass,
  LifeBuoy
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const criticalCount = cases.filter((c) => c.priority === 'CRITICAL').length;
  const activeTeamsCount = rescueTeams.filter((t) => t.status === 'EN_ROUTE' || t.status === 'ON_SCENE').length;
  const activeChainBreaks = chainBreaks.filter((cb) => !cb.isResolved).length;

  return (
    <header className="relative h-14 bg-[#0a0f1d]/95 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-4 flex items-center justify-between z-40 select-none shadow-md">
      {/* Brand & Incident Section */}
      <div className="flex items-center space-x-2.5 sm:space-x-4">
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          <div className="relative group cursor-pointer" onClick={() => setPrimaryViewMode('COMMAND_CENTER')}>
            <img 
              src="/logo-icon.png" 
              alt="VYRO Logo" 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-contain bg-[#000b1f] border border-cyan-500/40 shadow-md shadow-cyan-500/20 p-0.5 group-hover:border-cyan-400 transition" 
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 border-2 border-[#0a0f1d] animate-pulse"></div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-extrabold tracking-widest text-slate-100 text-sm">VYRO</span>
              <span className="hidden sm:inline text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold tracking-wider">
                VIGILANT RESCUE OPERATIONS
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono tracking-tight flex items-center space-x-1">
              <span className="hidden xs:inline">RESCUE CONTINUITY</span>
              <span className="hidden xs:inline text-slate-600">•</span>
              <span className="text-cyan-400 font-semibold">{activeDisaster}</span>
            </div>
          </div>
        </div>

        {/* Live Counters (Desktop) */}
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

      {/* Disaster Mode Switcher Dropdown (Desktop) */}
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

      {/* Right Desktop Controls */}
      <div className="hidden md:flex items-center space-x-1.5 sm:space-x-2">
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
          <span>3D TWIN</span>
        </button>

        {/* VYRO REUNITE™ Family Reunification Platform Trigger */}
        <button
          onClick={openFamilyModal}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-purple-950/70 hover:bg-purple-900 border border-purple-500/50 text-purple-200 font-mono text-[11px] font-bold transition shadow-sm"
          title="Open VYRO REUNITE™ Family Reunification Platform"
        >
          <Heart className="w-3.5 h-3.5 text-pink-400 fill-current" />
          <span>REUNITE</span>
        </button>

        {/* AI Emergency Compiler Modal Trigger Button */}
        <button
          onClick={openCompilerModal}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[11px] font-bold transition shadow-sm"
          title="Open VYRO AI Emergency Compiler"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI COMPILER</span>
        </button>

        {/* 15-Step Guided Lifecycle Demo Tour Button */}
        <button
          onClick={startDemoWalkthrough}
          className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-mono text-[11px] font-bold transition shadow-md shadow-cyan-600/30 cursor-pointer"
          title="Play 15-Step Rescue Lifecycle Demonstration"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>TOUR</span>
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

      {/* Mobile Right Controls: Role Badge & Hamburger Menu Button */}
      <div className="flex md:hidden items-center space-x-1.5">
        <button
          onClick={onOpenRoleModal}
          className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-[10px] font-mono text-slate-200"
          title="Switch Demo Role"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
          <span className="font-bold">{currentRole}</span>
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-white transition"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Tactical Drawer / Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-14 left-0 right-0 bottom-0 bg-[#070d1a]/95 backdrop-blur-xl z-50 p-4 border-b border-cyan-500/30 overflow-y-auto space-y-4 font-mono text-xs animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Quick Scenario Selector */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
              <span>DISASTER SCENARIO</span>
              <span className="text-amber-400 font-bold">{activeDisaster}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
              {(['FLOOD', 'TSUNAMI', 'FIRE', 'EARTHQUAKE', 'CYCLONE', 'LANDSLIDE'] as DisasterType[]).map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setActiveDisaster(d);
                  }}
                  className={`py-1.5 rounded-lg border text-center transition ${
                    activeDisaster === d
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Core Tactical Tools Grid */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setPrimaryViewMode(primaryViewMode === '3D_TWIN' ? 'COMMAND_CENTER' : '3D_TWIN');
                setIsMobileMenuOpen(false);
              }}
              className={`p-3 rounded-xl border font-bold flex flex-col items-center justify-center space-y-1 transition text-center ${
                primaryViewMode === '3D_TWIN'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-slate-900/80 border-slate-800 text-slate-200'
              }`}
            >
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>3D CITY TWIN</span>
              <span className="text-[9px] text-slate-400 font-normal">Kochi Digital Twin</span>
            </button>

            <button
              onClick={() => {
                openFamilyModal();
                setIsMobileMenuOpen(false);
              }}
              className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40 text-purple-200 font-bold flex flex-col items-center justify-center space-y-1 transition text-center"
            >
              <Heart className="w-5 h-5 text-pink-400 fill-current" />
              <span>VYRO REUNITE™</span>
              <span className="text-[9px] text-purple-300/80 font-normal">Family Reunion Net</span>
            </button>

            <button
              onClick={() => {
                openCompilerModal();
                setIsMobileMenuOpen(false);
              }}
              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 font-bold flex flex-col items-center justify-center space-y-1 transition text-center"
            >
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>AI COMPILER</span>
              <span className="text-[9px] text-slate-400 font-normal">Emergency NLP Triage</span>
            </button>

            <button
              onClick={() => {
                startDemoWalkthrough();
                setIsMobileMenuOpen(false);
              }}
              className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 font-bold flex flex-col items-center justify-center space-y-1 transition text-center"
            >
              <Play className="w-5 h-5 text-cyan-400 fill-current" />
              <span>15-STEP TOUR</span>
              <span className="text-[9px] text-cyan-300/80 font-normal">Guided Demo</span>
            </button>
          </div>

          {/* Network Switcher & Live Stats */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">NETWORK COMMS:</span>
              <span className={`font-bold ${networkStatus === 'OFFLINE' ? 'text-rose-400' : 'text-emerald-400'}`}>
                {networkStatus}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1 text-[10px]">
              {(['ONLINE', 'LIMITED', 'SYNCING', 'OFFLINE'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setNetworkStatus(st);
                    if (st === 'ONLINE') syncOfflineQueue();
                  }}
                  className={`py-1 rounded border text-center transition ${
                    networkStatus === st
                      ? 'bg-slate-800 text-cyan-300 font-bold border-cyan-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className="p-1.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300">
                CRITICAL: <strong>{criticalCount}</strong>
              </div>
              <div className="p-1.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-300">
                TEAMS: <strong>{activeTeamsCount}</strong>
              </div>
              <div className="p-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
                BREAKS: <strong>{activeChainBreaks}</strong>
              </div>
            </div>
          </div>

          {/* Close Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-center border border-slate-700"
          >
            CLOSE MENU
          </button>
        </div>
      )}
    </header>
  );
};
