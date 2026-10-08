import React from 'react';
import { useOperationalStore } from '../../stores/operationalStore';
import { 
  X, 
  Building2, 
  MapPin, 
  Users, 
  HeartHandshake, 
  Phone, 
  Navigation, 
  Sparkles, 
  CheckCircle2, 
  Clock,
  Layers
} from 'lucide-react';

export const BuildingDetailModal: React.FC = () => {
  const { buildingModal, closeBuildingModal, shelters, hospitals, triggerFlyTo } = useOperationalStore();

  if (!buildingModal.isOpen || !buildingModal.buildingId) return null;

  const shelter = shelters.find((s) => s.id === buildingModal.buildingId);
  const hospital = hospitals.find((h) => h.id === buildingModal.buildingId);

  // If shelter was selected (or default Government Higher Secondary School)
  const isShelter = buildingModal.type === 'SHELTER' || !!shelter;
  const current = shelter || shelters[0];

  const available = current.capacity - current.currentOccupancy;
  const occupancyPct = Math.round((current.currentOccupancy / current.capacity) * 100);

  const handleFlyToBuilding = () => {
    triggerFlyTo({
      coordinates: current.coordinates,
      zoom: 17.5,
      pitch: 68,
      bearing: -35,
      duration: 1800
    });
    closeBuildingModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#0b101c] border border-purple-500/50 rounded-xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between pb-3.5 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold uppercase">
                REAL 3D LOCATION VIEW
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                ● STATUS: {current.operationalStatus}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 tracking-wide mt-1">
              {current.name}
            </h2>
            <div className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              <span>{current.address}</span>
            </div>
          </div>
          <button
            onClick={closeBuildingModal}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Building Telemetry Specs */}
        <div className="my-4 space-y-3 font-mono text-xs">
          <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400">TYPE:</span>
              <div className="text-slate-100 font-bold">Shelter / Evacuation Hub</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">COORDINATES:</span>
              <div className="text-slate-200">{current.coordinates[1].toFixed(5)}° N, {current.coordinates[0].toFixed(5)}° E</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">BUILDING ELEVATION / HEIGHT:</span>
              <div className="text-cyan-400 font-bold">{current.buildingHeight}m (3D Extruded)</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">LAST SYNC:</span>
              <div className="text-slate-200">{current.lastUpdate}</div>
            </div>
          </div>

          {/* Occupancy Stats */}
          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-sans font-semibold">CURRENT OCCUPANCY</span>
              <span className="text-purple-300 font-bold">{occupancyPct}% CAPACITY</span>
            </div>
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-purple-500 h-full" style={{ width: `${occupancyPct}%` }}></div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-base font-bold text-white">{current.capacity}</div>
                <div className="text-[9px] text-slate-400">TOTAL CAPACITY</div>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-base font-bold text-purple-400">{current.currentOccupancy}</div>
                <div className="text-[9px] text-slate-400">CURRENT OCCUPANCY</div>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-base font-bold text-emerald-400">{available}</div>
                <div className="text-[9px] text-slate-400">AVAILABLE BEDS</div>
              </div>
            </div>
          </div>

          {/* Medical Support & Cases Breakdown */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <div className="text-xs font-bold text-emerald-400">
                {current.medicalSupport ? 'AVAILABLE' : 'NONE'}
              </div>
              <div className="text-[10px] text-slate-400">MEDICAL SUPPORT</div>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <div className="text-xs font-bold text-cyan-400">{current.activeCases}</div>
              <div className="text-[10px] text-slate-400">ACTIVE CASES</div>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <div className="text-xs font-bold text-amber-400">{current.missingPersonCases}</div>
              <div className="text-[10px] text-slate-400">MISSING PERSON CASES</div>
            </div>
          </div>

          {/* AI Operational Insight */}
          <div className="p-3 rounded-lg bg-sky-950/30 border border-sky-500/40 text-sky-200">
            <div className="text-[10px] font-bold text-sky-400 uppercase flex items-center space-x-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI OPERATIONAL INSIGHT</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-300 font-sans">
              "Current shelter occupancy is {occupancyPct}%. {available} spaces remain available. Facility is safe from water intrusion; recommend routing incoming evacuees from Broadway Sector via Chittoor Road."
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-3 gap-2">
          <button
            onClick={handleFlyToBuilding}
            className="py-2 px-3 rounded bg-purple-600 hover:bg-purple-500 font-mono font-bold text-white text-xs transition flex items-center justify-center space-x-1 shadow"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>VIEW 3D</span>
          </button>
          <button
            onClick={() => {
              alert(`Contacting Shelter Coordinator at: ${current.contactNumber}`);
            }}
            className="py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 font-mono text-slate-200 text-xs transition border border-slate-700 flex items-center justify-center space-x-1"
          >
            <Phone className="w-3.5 h-3.5 text-cyan-400" />
            <span>CONTACT</span>
          </button>
          <button
            onClick={closeBuildingModal}
            className="py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 font-mono text-slate-200 text-xs transition border border-slate-700"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};
