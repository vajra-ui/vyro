import React, { useState } from 'react';
import { useOperationalStore } from '../../stores/operationalStore';
import { SimulatedCityTwin3D } from '../map/SimulatedCityTwin3D';
import { 
  Home, 
  Users, 
  UserPlus, 
  UserMinus, 
  HeartHandshake, 
  Building2, 
  Search,
  Package,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ShelterDashboard: React.FC = () => {
  const { shelters, updateShelterOccupancy, triggerFlyTo, openFamilyModal } = useOperationalStore();
  const myShelter = shelters[0]; // Government Higher Secondary School

  const [searchQuery, setSearchQuery] = useState('');
  const [supplyRequested, setSupplyRequested] = useState(false);

  const available = myShelter.capacity - myShelter.currentOccupancy;
  const occupancyPct = Math.round((myShelter.currentOccupancy / myShelter.capacity) * 100);

  // Evacuee check-in roster
  const evacuees = [
    { id: 'EV-101', name: 'Rajan Menon', age: 64, sector: 'Old Bridge', status: 'MED_CARE' },
    { id: 'EV-102', name: 'Leela Menon', age: 60, sector: 'Old Bridge', status: 'SHELTERED' },
    { id: 'EV-103', name: 'Anjali Nair & Infant', age: 28, sector: 'Broadway Lane 4', status: 'SHELTERED' },
    { id: 'EV-104', name: 'S. George', age: 45, sector: 'Marine Drive Waterfront', status: 'SHELTERED' },
    { id: 'EV-105', name: 'Praveen K.', age: 34, sector: 'Kacheripady Basin', status: 'SHELTERED' }
  ];

  const filteredEvacuees = evacuees.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] flex flex-col md:flex-row overflow-hidden bg-[#080c14]">
      {/* Shelter Management HUD */}
      <div className="w-full md:w-96 h-auto md:h-full bg-[#0a0f1d]/95 backdrop-blur-md border-r border-slate-800 p-4 flex flex-col justify-between z-20 text-xs overflow-y-auto shadow-2xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <Home className="w-5 h-5 text-purple-400" />
                <h2 className="text-sm font-mono font-bold text-slate-100">{myShelter.name}</h2>
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                {myShelter.address}
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
              {myShelter.operationalStatus}
            </span>
          </div>

          {/* Occupancy Progress & Rapid Intake */}
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2.5 font-mono">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-sans font-semibold">SHELTER OCCUPANCY</span>
              <span className="text-purple-300 font-bold">{occupancyPct}% FULL</span>
            </div>

            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-purple-500 h-full transition-all duration-300" style={{ width: `${occupancyPct}%` }}></div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center pt-1">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-base font-bold text-purple-400">{myShelter.currentOccupancy}</div>
                <div className="text-[9px] text-slate-400">TOTAL OCCUPANTS</div>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-base font-bold text-emerald-400">{available}</div>
                <div className="text-[9px] text-slate-400">AVAILABLE SPACES</div>
              </div>
            </div>

            {/* Quick Intake Counter Buttons */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">QUICK INTAKE:</span>
              <div className="flex space-x-1.5">
                <button
                  onClick={() => updateShelterOccupancy(myShelter.id, -5)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                >
                  -5
                </button>
                <button
                  onClick={() => updateShelterOccupancy(myShelter.id, 5)}
                  className="px-2 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  +5 CHECK-IN
                </button>
              </div>
            </div>
          </div>

          {/* Evacuee Search & Family Reunification */}
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center justify-between">
              <span>EVACUEE ROSTER</span>
              <button
                onClick={openFamilyModal}
                className="text-purple-400 hover:text-purple-300 font-bold underline font-mono text-[10px]"
              >
                + REUNIFICATION DESK
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search by evacuee name or sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-purple-400 pl-7"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2" />
            </div>

            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {filteredEvacuees.map((e) => (
                <div key={e.id} className="p-2 rounded bg-slate-950 border border-slate-800 text-xs flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-slate-200">{e.name} ({e.age}y)</div>
                    <div className="text-[10px] text-slate-500 font-mono">Sector: {e.sector}</div>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
                    {e.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Logistics & Supplies Request */}
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-400 uppercase font-bold">SUPPLIES LOGISTICS:</span>
              <span className="text-emerald-400 font-bold">{myShelter.suppliesStatus}</span>
            </div>
            <button
              onClick={() => setSupplyRequested(true)}
              className="w-full py-2 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 font-mono text-slate-200 text-xs transition flex items-center justify-center space-x-1.5"
            >
              <Package className="w-4 h-4 text-purple-400" />
              <span>{supplyRequested ? 'RATIONS & WATER DISPATCHED' : 'REQUEST BLANKETS & WATER RATIONS'}</span>
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500">
          SHELTER MANAGEMENT LOGGED • RELIEF DESK
        </div>
      </div>

      {/* 3D Simulated City Centerpiece */}
      <div className="relative flex-1 h-full overflow-hidden bg-[#050914]">
        <SimulatedCityTwin3D isHeroMode={true} />
      </div>
    </div>
  );
};
