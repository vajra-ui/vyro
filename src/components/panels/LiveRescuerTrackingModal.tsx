import React, { useState, useEffect } from 'react';
import { useOperationalStore } from '../../stores/operationalStore';
import { 
  Navigation, 
  Gauge, 
  Compass, 
  Radio, 
  MapPin, 
  Clock, 
  X, 
  ShieldAlert, 
  Waves,
  CheckCircle2,
  Share2,
  Volume2
} from 'lucide-react';

export const LiveRescuerTrackingModal: React.FC = () => {
  const { 
    isLiveTrackingModalOpen, 
    closeLiveTrackingModal, 
    liveTrackingTeamId,
    rescueTeams,
    cases,
    advanceRescueChain
  } = useOperationalStore();

  const [speedKmh, setSpeedKmh] = useState(24.5);
  const [headingDegrees, setHeadingDegrees] = useState(48);
  const [distanceMeters, setDistanceMeters] = useState(531);
  const [etaMinutes, setEtaMinutes] = useState(4);

  // Dynamic telemetry jitter
  useEffect(() => {
    if (!isLiveTrackingModalOpen) return;
    const interval = setInterval(() => {
      setSpeedKmh((prev) => Math.max(12, +(prev + (Math.random() - 0.5) * 2.5).toFixed(1)));
      setHeadingDegrees((prev) => Math.floor((prev + (Math.random() - 0.5) * 4 + 360) % 360));
      setDistanceMeters((prev) => Math.max(45, prev - 8));
    }, 1500);
    return () => clearInterval(interval);
  }, [isLiveTrackingModalOpen]);

  if (!isLiveTrackingModalOpen) return null;

  const team = rescueTeams.find((t) => t.id === liveTrackingTeamId) || rescueTeams[0];
  const targetCase = cases.find((c) => c.priority === 'CRITICAL') || cases[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="relative w-full max-w-2xl bg-[#081020] border-2 border-cyan-500/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#0d1a33] to-[#081020] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/20">
              <Navigation className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-mono font-black text-sm tracking-widest text-white uppercase">
                  LIVE RESCUER GPS TRACKING
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                  SIMULATION MODE
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                ACTIVE TELEMETRY UPLINK • 10Hz LORA ENCRYPTED BEACON
              </div>
            </div>
          </div>
          <button
            onClick={closeLiveTrackingModal}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telemetry Grid */}
        <div className="p-5 space-y-4 font-mono">
          {/* Key Rescuer and Target Bar */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">RESCUER CALLSIGN</span>
              <div className="text-sm font-bold text-cyan-300 mt-0.5">{team.callsign}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{team.vehicleType} • 4 CREW</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">VICTIM TARGET</span>
              <div className="text-sm font-bold text-rose-400 mt-0.5">#{targetCase.id}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{targetCase.locationName}</div>
            </div>
          </div>

          {/* Real-time Telemetry Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-center space-x-1 text-slate-400 text-[10px] mb-1">
                <MapPin className="w-3 h-3 text-cyan-400" />
                <span>DISTANCE</span>
              </div>
              <div className="text-lg font-black text-white">{distanceMeters} m</div>
              <div className="text-[9px] text-emerald-400">CLOSING IN</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-center space-x-1 text-slate-400 text-[10px] mb-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>ETA</span>
              </div>
              <div className="text-lg font-black text-cyan-300">{etaMinutes} min</div>
              <div className="text-[9px] text-slate-500">OPTIMAL VECTOR</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-center space-x-1 text-slate-400 text-[10px] mb-1">
                <Gauge className="w-3 h-3 text-cyan-400" />
                <span>SPEED</span>
              </div>
              <div className="text-lg font-black text-amber-300">{speedKmh} km/h</div>
              <div className="text-[9px] text-slate-500">RIVER TRANSIT</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-center space-x-1 text-slate-400 text-[10px] mb-1">
                <Compass className="w-3 h-3 text-cyan-400" />
                <span>HEADING</span>
              </div>
              <div className="text-lg font-black text-slate-100">{headingDegrees}° NE</div>
              <div className="text-[9px] text-slate-500">COMPASS GYRO</div>
            </div>
          </div>

          {/* Communication & Route Status */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400">COMMUNICATION LINK:</span>
              <span className="text-emerald-400 font-bold flex items-center space-x-1">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>ENCRYPTED MESH 915 MHz (SNR: +18dB)</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">ROUTE CHANNEL:</span>
              <span className="text-cyan-300 font-bold">
                Old Bridge Central Canal Approach → Rooftop Winch Waypoint
              </span>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between font-mono text-xs">
          <span className="text-slate-400 text-[11px]">
            * Simulated GPS sensor packet streaming at 100ms interval
          </span>
          <button
            onClick={closeLiveTrackingModal}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition cursor-pointer"
          >
            CLOSE TELEMETRY
          </button>
        </div>
      </div>
    </div>
  );
};
