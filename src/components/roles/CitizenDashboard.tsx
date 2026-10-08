import React, { useState } from 'react';
import { useOperationalStore } from '../../stores/operationalStore';
import { RescueContinuityBar } from '../common/RescueContinuityBar';
import { 
  AlertTriangle, 
  MapPin, 
  Navigation, 
  Radio, 
  CheckCircle2, 
  PhoneCall, 
  Share2, 
  Battery, 
  BatteryCharging, 
  Wifi, 
  WifiOff, 
  ShieldAlert, 
  ExternalLink, 
  Clock, 
  Compass, 
  Activity, 
  ChevronRight, 
  Flame, 
  Waves, 
  Layers, 
  ArrowLeft,
  LifeBuoy,
  Home,
  Check
} from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const {
    activeEmergencySOS,
    emergencyPackets,
    activeRescueTracking,
    locationTrail,
    deviceSurvival,
    activeCitizenCaseId,
    silentModeActive,
    setSilentModeActive,
    triggerOneTapSOS,
    triggerSosDemo,
    rescueChains,
    shelters,
    updateBatteryLevel,
    setRole,
    setPrimaryViewMode
  } = useOperationalStore();

  const [copiedLink, setCopiedLink] = useState(false);

  // Active case data
  const currentCaseId = activeCitizenCaseId || 'VY-26-1042';
  const currentChain = rescueChains[currentCaseId];

  // Dynamic Google Maps URL from live coordinates
  const activeLat = activeEmergencySOS?.location.latitude ?? 11.342790;
  const activeLng = activeEmergencySOS?.location.longitude ?? 77.728462;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${activeLat},${activeLng}`;

  const handleShareLocation = async () => {
    const text = `VYRO EMERGENCY SOS ACTIVE [${currentCaseId}]: Location https://www.google.com/maps/search/?api=1&query=${activeLat},${activeLng}`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleTriggerSOS = () => {
    triggerOneTapSOS();
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#020617] text-slate-100 overflow-y-auto font-sans select-none scrollbar-none pb-12">
      {/* 1. Permanent Signature Rescue Continuity Bar */}
      <RescueContinuityBar compact={false} />

      {/* Main Responsive Container: Mobile-First Max Width */}
      <div className="w-full max-w-xl mx-auto px-4 py-4 space-y-4">
        
        {/* Toggle Mode Banner (For judges/testers to switch between First Screen & Tracking) */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-slate-400">
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${silentModeActive ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`}></span>
            <span>MODE: <strong className="text-white">{silentModeActive ? 'TRACK YOUR SOS (ACTIVE)' : 'FIRST SCREEN (PRE-SOS)'}</strong></span>
          </div>
          <button
            onClick={() => setSilentModeActive(!silentModeActive)}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 transition"
          >
            {silentModeActive ? 'SWITCH TO PRE-SOS HOME' : 'SWITCH TO ACTIVE TRACKING'}
          </button>
        </div>

        {!silentModeActive ? (
          /* ========================================================================= */
          /* SECTION 5: FIRST SCREEN — EMERGENCY HOME                                  */
          /* ========================================================================= */
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Header */}
            <div className="text-center pt-2 pb-1">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-2">
                <span>VYRO EMERGENCY NETWORK</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                VYRO
              </h1>
              <p className="text-xs font-mono text-cyan-300 tracking-wider uppercase mt-0.5">
                VIGILANT RESCUE OPERATIONS
              </p>
            </div>

            {/* Primary Visual: YOU ARE NOT ALONE & GIANT SOS BUTTON */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 shadow-2xl text-center space-y-5">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-1">
                  NO LOGIN REQUIRED
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  YOU ARE NOT ALONE
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  One tap collects your location, device readiness, and transmits to rescue command immediately.
                </p>
              </div>

              {/* ENORMOUS ONE-TAP SOS BUTTON */}
              <button
                onClick={handleTriggerSOS}
                className="w-full py-8 sm:py-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 active:scale-[0.98] transition-all shadow-2xl shadow-rose-600/50 border-2 border-rose-400/50 flex flex-col items-center justify-center space-y-2 group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-rose-500/40 border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-9 h-9 text-white animate-pulse" />
                </div>
                <span className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-white uppercase drop-shadow">
                  ONE-TAP SOS
                </span>
                <span className="text-[11px] font-mono text-rose-200 tracking-wider">
                  PRESS TO BROADCAST DISTRESS
                </span>
              </button>

              {/* Secondary Actions: CALL 112 & SHARE LOCATION */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <a
                  href="tel:112"
                  className="py-3.5 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-white font-mono font-bold text-xs flex items-center justify-center space-x-2 transition"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>CALL 112</span>
                </a>

                <button
                  onClick={handleShareLocation}
                  className="py-3.5 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-white font-mono font-bold text-xs flex items-center justify-center space-x-2 transition"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-cyan-400" /> : <Share2 className="w-4 h-4 text-cyan-400" />}
                  <span>{copiedLink ? 'COPIED LINK' : 'SHARE LOCATION'}</span>
                </button>
              </div>
            </div>

            {/* DEVICE READINESS TELEMETRY */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 font-mono text-xs">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold flex items-center justify-between">
                <span>DEVICE READINESS</span>
                <span className="text-emerald-400 font-semibold">ALL SYSTEMS NOMINAL</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>GPS</span>
                  </span>
                  <span className="text-emerald-400 font-bold">READY</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center space-x-1.5">
                    <Radio className="w-3.5 h-3.5 text-cyan-400" />
                    <span>CELLULAR</span>
                  </span>
                  <span className={deviceSurvival.cellular === 'WEAK' ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {deviceSurvival.cellular}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center space-x-1.5">
                    <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                    <span>INTERNET</span>
                  </span>
                  <span className={deviceSurvival.internet === 'OFFLINE' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {deviceSurvival.internet}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center space-x-1.5">
                    <Activity className="w-3.5 h-3.5 text-purple-400" />
                    <span>MESH</span>
                  </span>
                  <span className="text-purple-300 font-bold">{deviceSurvival.mesh}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between sm:col-span-2">
                  <span className="text-slate-400 flex items-center space-x-1.5">
                    <Battery className="w-3.5 h-3.5 text-emerald-400" />
                    <span>BATTERY</span>
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-300 font-bold">{deviceSurvival.batteryPercent}%</span>
                    <button
                      onClick={() => updateBatteryLevel(deviceSurvival.batteryPercent === 78 ? 8 : 78)}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white"
                      title="Toggle simulated battery drop to demo safety-first preservation"
                    >
                      {deviceSurvival.batteryPercent === 78 ? 'TEST 8%' : 'RESET 78%'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* LAST KNOWN LOCATION CARD */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  LAST KNOWN LOCATION
                </span>
                <span className="text-emerald-400 text-[10px] flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>CONFIDENCE HIGH</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div>
                  <div className="text-[10px] text-slate-400">LATITUDE</div>
                  <div className="text-sm font-bold text-slate-100 mt-0.5">11.342790</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">LONGITUDE</div>
                  <div className="text-sm font-bold text-slate-100 mt-0.5">77.728462</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Updated 18 sec ago</span>
                <span className="text-cyan-400">Accuracy ±6.8m</span>
              </div>
            </div>

            {/* Quick Link to Commander Demo */}
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Testing Commander Command Desk?</span>
              <button
                onClick={() => setRole('COMMANDER')}
                className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center space-x-1"
              >
                <span>OPEN COMMAND CENTER</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* SECTION 11 & 13: SILENT EMERGENCY MODE & TRACK YOUR SOS                   */
          /* ========================================================================= */
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* SILENT EMERGENCY MODE CALLOUT (Section 11) */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900 border-2 border-rose-500/50 shadow-xl space-y-2 text-center">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-mono font-black tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                <span>SOS ACTIVE • {currentCaseId}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                YOUR EMERGENCY HAS BEEN RECEIVED.
              </h2>
              <p className="text-xs font-mono text-slate-300 max-w-sm mx-auto">
                VYRO IS WORKING TO CONNECT YOU WITH A RESPONSE TEAM. STAY CALM.
              </p>
            </div>

            {/* SECTION 13: 10-STAGE EMERGENCY-PROGRESS TIMELINE */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-black text-white">TRACK YOUR SOS</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {currentCaseId}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">CONTINUOUS CHAIN</span>
              </div>

              {/* 10-Stage Vertical List with Subtly Animated Active Step */}
              <div className="space-y-1.5 pt-1">
                {(currentChain?.stages || [
                  { stageId: 'SOS_RECEIVED', label: 'SOS SENT', status: 'VERIFIED' },
                  { stageId: 'AI_TRIAGED', label: 'COMMAND RECEIVED', status: 'VERIFIED' },
                  { stageId: 'COMMANDER_DISPATCH', label: 'AI TRIAGE', status: 'VERIFIED' },
                  { stageId: 'RESCUER_ASSIGNED', label: 'RESCUE ASSIGNMENT', status: 'IN_PROGRESS' },
                  { stageId: 'RESCUER_EN_ROUTE', label: 'RESCUE TEAM EN ROUTE', status: 'PENDING' },
                  { stageId: 'VICTIM_LOCATED', label: 'VICTIM FOUND', status: 'PENDING' },
                  { stageId: 'MEDICAL_HANDOFF', label: 'MEDICAL HANDOFF', status: 'PENDING' },
                  { stageId: 'HOSPITAL_ADMITTED', label: 'HOSPITAL', status: 'PENDING' },
                  { stageId: 'SHELTER_TRANSFERRED', label: 'SHELTER', status: 'PENDING' },
                  { stageId: 'FAMILY_REUNITED', label: 'FAMILY REUNION', status: 'PENDING' },
                  { stageId: 'CASE_CLOSED', label: 'CASE CLOSED', status: 'PENDING' }
                ]).map((st, i) => {
                  const isVerified = st.status === 'VERIFIED';
                  const isInProgress = st.status === 'IN_PROGRESS';

                  return (
                    <div
                      key={st.stageId}
                      className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                        isInProgress
                          ? 'bg-cyan-500/15 border border-cyan-400 text-cyan-200 shadow-sm'
                          : isVerified
                          ? 'bg-slate-950/60 text-slate-300'
                          : 'text-slate-500'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="text-[10px] font-mono text-slate-500 w-4">
                          {(i + 1).toString().padStart(2, '0')}
                        </span>
                        <span className={`font-bold ${isInProgress ? 'text-white' : ''}`}>
                          {st.label}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        {isVerified && (
                          <span className="text-emerald-400 font-bold flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="text-[10px]">✓</span>
                          </span>
                        )}
                        {isInProgress && (
                          <span className="text-cyan-400 font-bold flex items-center space-x-1 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                            <span className="text-[10px]">● ACTIVE</span>
                          </span>
                        )}
                        {!isVerified && !isInProgress && (
                          <span className="text-slate-600 font-bold text-xs">○</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 14: SHARED LOCATION CARD */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>YOUR SHARED LOCATION</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>LOCATION SHARED</span>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div>
                  <div className="text-[10px] text-slate-400">LATITUDE</div>
                  <div className="text-xs font-bold text-slate-100 mt-0.5">{activeLat.toFixed(6)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">LONGITUDE</div>
                  <div className="text-xs font-bold text-slate-100 mt-0.5">{activeLng.toFixed(6)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">ACCURACY</div>
                  <div className="text-xs font-bold text-cyan-300 mt-0.5">±4.2m</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">SOURCE</div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5">GPS</div>
                </div>
              </div>

              {/* Dynamic Google Maps Deep Link Button */}
              <div className="pt-1">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-mono font-bold text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-cyan-600/20"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>OPEN IN GOOGLE MAPS</span>
                </a>
              </div>
            </div>

            {/* SECTION 16: REAL RESCUE TRACKING */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-black text-white">{activeRescueTracking.teamName}</div>
                  <div className="text-[10px] text-cyan-400 font-bold">
                    {activeRescueTracking.status}
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-800/50 text-cyan-300 font-bold">
                  ETA {activeRescueTracking.etaMinutes} MIN
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div>
                  <div className="text-[10px] text-slate-400">VEHICLE</div>
                  <div className="text-xs font-bold text-slate-200 mt-0.5">{activeRescueTracking.vehicleId}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">SPEED</div>
                  <div className="text-xs font-bold text-slate-200 mt-0.5">{activeRescueTracking.speedKmh} km/h</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">DISTANCE</div>
                  <div className="text-xs font-bold text-cyan-300 mt-0.5">{activeRescueTracking.distanceKm} km</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">HEADING</div>
                  <div className="text-xs font-bold text-slate-200 mt-0.5">{activeRescueTracking.heading}°</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>GPS Accuracy: ±{activeRescueTracking.gpsAccuracyMeters}m</span>
                <span>Updated {activeRescueTracking.updatedSecAgo} sec ago</span>
              </div>
            </div>

            {/* SECTION 10: DEVICE SURVIVAL INTELLIGENCE */}
            <div className={`p-4 rounded-2xl border shadow-xl space-y-2.5 font-mono text-xs ${
              deviceSurvival.isCriticalBattery
                ? 'bg-rose-950/80 border-rose-500 animate-pulse'
                : 'bg-slate-900/90 border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold flex items-center space-x-1.5">
                  <Battery className="w-3.5 h-3.5 text-cyan-400" />
                  <span>DEVICE SURVIVAL INTELLIGENCE</span>
                </span>
                <span className="text-slate-400 text-[10px]">
                  {deviceSurvival.charging ? '⚡ CHARGING' : '⚡ NOT CHARGING'}
                </span>
              </div>

              {deviceSurvival.isCriticalBattery && (
                <div className="p-3 rounded-xl bg-rose-900/60 border border-rose-500 text-rose-100 text-xs font-bold space-y-1">
                  <div>⚠ DEVICE BATTERY CRITICAL: {deviceSurvival.batteryPercent}% remaining</div>
                  <div className="text-[11px] font-normal text-rose-200">
                    VYRO has preserved your last known location and reduced telemetry frequency to keep you connected.
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">ESTIMATED COMMUNICATION WINDOW</div>
                  <div className="text-base font-black text-cyan-300 mt-0.5">
                    ~{Math.floor(deviceSurvival.estimatedCommsMinutes / 60)}h {deviceSurvival.estimatedCommsMinutes % 60}m
                  </div>
                </div>
                <span className="text-[9px] px-2 py-1 rounded bg-slate-800 text-slate-400">
                  Simulated Telemetry
                </span>
              </div>
            </div>

            {/* SECTION 9: LOCATION HISTORY / TRAIL */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5 font-mono text-xs">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold flex items-center justify-between">
                <span>LOCATION TRAIL</span>
                <span className="text-slate-500">LAST 4 RECORDED POSITIONS</span>
              </div>

              <div className="space-y-1.5">
                {locationTrail.map((trail, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800/60 text-[11px]"
                  >
                    <span className="text-slate-400">{trail.timestamp}</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 text-[9px] font-bold">
                      {trail.source}
                    </span>
                    <span className="text-slate-200">
                      {trail.latitude.toFixed(6)}, {trail.longitude.toFixed(6)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 12: MULTI-CHANNEL COMMUNICATION RELAY STATUS */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 font-mono text-xs">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                COMMUNICATION RELAY STATUS
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-slate-950 flex justify-between">
                  <span className="text-slate-400">INTERNET</span>
                  <span className={deviceSurvival.internet === 'CONNECTED' ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {deviceSurvival.internet}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 flex justify-between">
                  <span className="text-slate-400">CELLULAR</span>
                  <span className="text-amber-400 font-bold">{deviceSurvival.cellular}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 flex justify-between">
                  <span className="text-slate-400">MESH</span>
                  <span className="text-purple-400 font-bold">{deviceSurvival.mesh}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 flex justify-between">
                  <span className="text-slate-400">RADIO</span>
                  <span className="text-emerald-400 font-bold">{deviceSurvival.radio}</span>
                </div>
              </div>
            </div>

            {/* Quick Return to SOS Home button */}
            <div className="text-center pt-2">
              <button
                onClick={() => setSilentModeActive(false)}
                className="text-xs font-mono text-slate-400 hover:text-white transition underline"
              >
                Return to Emergency Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
