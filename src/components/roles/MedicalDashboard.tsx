import React, { useState } from 'react';
import { useOperationalStore } from '../../stores/operationalStore';
import { SimulatedCityTwin3D } from '../map/SimulatedCityTwin3D';
import { 
  Stethoscope, 
  HeartPulse, 
  Building2, 
  Navigation, 
  MapPin, 
  CheckCircle2, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { fetchRealRoadRoute } from '../../services/routingService';

export const MedicalDashboard: React.FC = () => {
  const { medicalTeams, hospitals, cases, hazardZones, setActiveRoute, updateVictimStatus, advanceRescueChain } = useOperationalStore();
  const myMedicalUnit = medicalTeams[0]; // MED-ALPHA-01
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(hospitals[0]?.id || '');
  const [triageCategory, setTriageCategory] = useState<'RED' | 'YELLOW' | 'GREEN'>('RED');

  // Currently handled patient
  const patientCase = cases.find((c) => c.status === 'MEDICAL_HANDOFF' || c.priority === 'CRITICAL') || cases[0];
  const targetHospital = hospitals.find((h) => h.id === selectedHospitalId) || hospitals[0];

  const handleRouteToHospital = async () => {
    if (targetHospital) {
      const route = await fetchRealRoadRoute(
        myMedicalUnit.coordinates,
        targetHospital.coordinates,
        myMedicalUnit.name,
        targetHospital.name,
        hazardZones
      );
      setActiveRoute(route);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] flex flex-col md:flex-row overflow-hidden bg-[#080c14]">
      {/* Left Triage Control HUD */}
      <div className="w-full md:w-96 h-auto md:h-full bg-[#0a0f1d]/95 backdrop-blur-md border-r border-slate-800 p-4 flex flex-col justify-between z-20 text-xs overflow-y-auto shadow-2xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <Stethoscope className="w-5 h-5 text-teal-400" />
                <h2 className="text-sm font-mono font-bold text-slate-100">{myMedicalUnit.name}</h2>
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                Type: {myMedicalUnit.ambulanceType}
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold">
              {myMedicalUnit.status}
            </span>
          </div>

          {/* Active Casualty Triage Card */}
          <div className="p-3.5 rounded-lg bg-slate-900 border border-teal-500/40 space-y-2.5">
            <div className="text-[10px] font-mono text-teal-400 uppercase font-bold flex items-center justify-between">
              <span>FIELD CASUALTY TRIAGE</span>
              <span className="text-rose-400">{patientCase.priority}</span>
            </div>

            <div>
              <div className="font-mono font-bold text-sm text-slate-100">{patientCase.id}</div>
              <div className="text-xs text-slate-300 font-semibold">{patientCase.name} ({patientCase.age || 64} yrs)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{patientCase.locationName}</div>
            </div>

            <div className="p-2 rounded bg-rose-950/20 border border-rose-500/30 text-rose-300 text-[11px]">
              <strong>Chief Complaint:</strong> {patientCase.medicalNeeds}
            </div>

            {/* Triage Tag Selector */}
            <div className="pt-1 space-y-1">
              <label className="text-[10px] font-mono text-slate-400">TRIAGE SEVERITY CODE:</label>
              <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px] font-bold">
                <button
                  onClick={() => setTriageCategory('RED')}
                  className={`py-1 rounded border transition ${
                    triageCategory === 'RED' ? 'bg-rose-600 text-white border-rose-400' : 'bg-slate-800 text-rose-400 border-slate-700'
                  }`}
                >
                  RED (IMMEDIATE)
                </button>
                <button
                  onClick={() => setTriageCategory('YELLOW')}
                  className={`py-1 rounded border transition ${
                    triageCategory === 'YELLOW' ? 'bg-amber-600 text-white border-amber-400' : 'bg-slate-800 text-amber-400 border-slate-700'
                  }`}
                >
                  YELLOW (DELAYED)
                </button>
                <button
                  onClick={() => setTriageCategory('GREEN')}
                  className={`py-1 rounded border transition ${
                    triageCategory === 'GREEN' ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-slate-800 text-emerald-400 border-slate-700'
                  }`}
                >
                  GREEN (MINOR)
                </button>
              </div>
            </div>
          </div>

          {/* Hospital Destination Matching */}
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">
              DESTINATION EMERGENCY DEPARTMENT
            </div>

            <div className="space-y-1.5">
              {hospitals.map((h) => {
                const isSelected = selectedHospitalId === h.id;
                return (
                  <div
                    key={h.id}
                    onClick={() => setSelectedHospitalId(h.id)}
                    className={`cursor-pointer p-2 rounded border transition text-xs ${
                      isSelected
                        ? 'bg-slate-800 border-teal-400 ring-1 ring-teal-400'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-slate-200 flex justify-between">
                      <span className="truncate">{h.name}</span>
                      <span className="text-teal-400 font-mono text-[11px] shrink-0">{h.traumaLevel}</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1 flex justify-between">
                      <span>Beds: {h.availableBeds}/{h.totalBeds}</span>
                      <span className="text-emerald-400">ICU: {h.icuAvailable} free</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleRouteToHospital}
              className="w-full mt-2 py-2 rounded bg-teal-600 hover:bg-teal-500 font-mono font-bold text-white text-xs transition flex items-center justify-center space-x-1 shadow"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>CALCULATE AMBULANCE ROAD ROUTE</span>
            </button>
          </div>

          {/* Transfer Confirmation */}
          <button
            onClick={() => {
              updateVictimStatus(patientCase.id, 'HOSPITALIZED', `Admitted to ${targetHospital.name}`);
              advanceRescueChain(patientCase.id, 'HOSPITAL_ADMITTED', { actor: 'Rapid EMS Med-01', locationName: targetHospital.name, notes: `Admitted under ${triageCategory} Triage Code` });
            }}
            className="w-full py-2 rounded bg-emerald-600 hover:bg-emerald-500 font-mono font-bold text-white text-xs transition shadow flex items-center justify-center space-x-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>CONFIRM HOSPITAL ADMISSION</span>
          </button>
        </div>

        <div className="pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500">
          MEDICAL TELEMETRY STREAMING • SECURE
        </div>
      </div>

      {/* 3D Simulated City Centerpiece */}
      <div className="relative flex-1 h-full overflow-hidden bg-[#050914]">
        <SimulatedCityTwin3D isHeroMode={true} />
      </div>
    </div>
  );
};
