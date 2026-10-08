import React from 'react';
import { useOperationalStore } from '../../stores/operationalStore';
import { SimulatedCityTwin3D } from '../map/SimulatedCityTwin3D';
import { 
  Building2, 
  Activity, 
  Users, 
  Plus, 
  Minus, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Truck,
  ArrowRight,
  ShieldCheck,
  Send
} from 'lucide-react';

export const HospitalDashboard: React.FC = () => {
  const { 
    hospitals, 
    cases, 
    updateHospitalBeds, 
    updateVictimStatus,
    advanceRescueChain,
    resolveChainBreak,
    chainBreaks,
    setPrimaryViewMode
  } = useOperationalStore();
  const myHospital = hospitals[0]; // General Hospital

  const incomingCases = cases.filter(
    (c) => c.status === 'EN_ROUTE' || c.status === 'MEDICAL_HANDOFF' || c.priority === 'CRITICAL' || c.priority === 'CHAIN_BREAK'
  );

  const handleConfirmAdmission = (caseId: string, bedType: 'ICU' | 'TRAUMA' | 'GENERAL') => {
    if (bedType === 'ICU') {
      updateHospitalBeds(myHospital.id, 0, -1);
    } else {
      updateHospitalBeds(myHospital.id, -1, 0);
    }
    updateVictimStatus(caseId, 'HOSPITALIZED', `Admitted to Hospital ${bedType} Ward`);
    advanceRescueChain(caseId, 'HOSPITAL_ADMITTED', { 
      actor: `${myHospital.name} ER Staff`, 
      notes: `Confirmed admission: ${bedType} bed allocated` 
    });
    resolveChainBreak('CB-ALERT-001', 'Hospital ER intake confirmed and verified');
  };

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] flex flex-col md:flex-row overflow-hidden bg-[#070b14] text-slate-100 font-sans">
      {/* Hospital ER Left Panel */}
      <div className="w-full md:w-[420px] h-auto md:h-full bg-[#081020]/95 backdrop-blur-md border-r border-slate-800 p-4 sm:p-5 flex flex-col justify-between z-20 text-xs overflow-y-auto shadow-2xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <h2 className="text-sm font-mono font-bold text-white">{myHospital.name}</h2>
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                {myHospital.address}
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              {myHospital.traumaLevel}
            </span>
          </div>

          {/* Bed & Facility Capacity Management */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5 font-mono">
            <div className="text-[10px] text-slate-400 uppercase font-bold flex justify-between">
              <span>HOSPITAL CARE CAPACITY</span>
              <span className="text-emerald-400">{myHospital.operationalStatus}</span>
            </div>

            {/* ICU Beds */}
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-cyan-300">CRITICAL ICU UNITS</div>
                <div className="text-[10px] text-slate-400">{myHospital.icuAvailable} Free / {myHospital.icuTotal} Total</div>
              </div>
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => updateHospitalBeds(myHospital.id, 0, -1)}
                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center border border-slate-700"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateHospitalBeds(myHospital.id, 0, 1)}
                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center border border-slate-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Trauma / General Ward Beds */}
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-200">TRAUMA / GENERAL BEDS</div>
                <div className="text-[10px] text-slate-400">{myHospital.availableBeds} Free / {myHospital.totalBeds} Total</div>
              </div>
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => updateHospitalBeds(myHospital.id, -1, 0)}
                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center border border-slate-700"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateHospitalBeds(myHospital.id, 1, 0)}
                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center border border-slate-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Incoming Patients & Admission Confirmation */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center justify-between">
              <span>INCOMING PATIENTS & AMBULANCES</span>
              <span className="text-amber-400 font-bold">{incomingCases.length} TRANSIT</span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {incomingCases.map((c) => {
                const isBreak = c.priority === 'CHAIN_BREAK';
                return (
                  <div
                    key={c.id}
                    className={`p-3 rounded-xl border transition ${
                      isBreak ? 'bg-amber-950/30 border-amber-500/60' : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-bold text-slate-200">#{c.id}</span>
                      {isBreak ? (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold animate-pulse">
                          CHAIN BREAK PENDING
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400 flex items-center space-x-1 font-mono">
                          <Truck className="w-3 h-3 inline" />
                          <span>ETA ~4m (Ambulance Med-01)</span>
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-300 mt-1 font-semibold">{c.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{c.medicalNeeds}</div>

                    {/* CONFIRM ADMISSION & TRANSFER Buttons */}
                    <div className="pt-2 mt-2 border-t border-slate-800 flex flex-col gap-1.5 font-mono text-[11px]">
                      <button
                        onClick={() => handleConfirmAdmission(c.id, 'ICU')}
                        className="w-full py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-bold transition flex items-center justify-center space-x-1.5 shadow cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>CONFIRM ADMISSION (ICU)</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleConfirmAdmission(c.id, 'TRAUMA')}
                          className="flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                        >
                          TRAUMA WARD
                        </button>
                        <button
                          onClick={() => handleConfirmAdmission(c.id, 'GENERAL')}
                          className="flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                        >
                          TRANSFER SHELTER
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between">
          <span>TRAUMA NETWORK: VERIFIED</span>
          <span className="text-emerald-400">AMBULANCES CONNECTED: 3</span>
        </div>
      </div>

      {/* 3D Simulated City Centerpiece */}
      <div className="relative flex-1 h-full overflow-hidden bg-[#050914]">
        <SimulatedCityTwin3D isHeroMode={true} />
      </div>
    </div>
  );
};
