import React, { useState, useEffect } from 'react';
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
  ArrowRight,
  Activity,
  AlertTriangle,
  Siren,
  PhoneCall,
  ShieldCheck,
  Check,
  RotateCcw,
  Layers,
  Heart,
  Thermometer,
  Zap,
  Users,
  Compass,
  ChevronDown
} from 'lucide-react';
import { fetchRealRoadRoute } from '../../services/routingService';

export const MedicalDashboard: React.FC = () => {
  const { 
    medicalTeams, 
    hospitals, 
    cases, 
    hazardZones, 
    setActiveRoute, 
    updateVictimStatus, 
    advanceRescueChain,
    updateHospitalBeds,
    updateMedicalTeamStatus,
    updateCaseTriage,
    resolveChainBreak,
    openFamilyModal,
    setPrimaryViewMode
  } = useOperationalStore();

  const myMedicalUnit = medicalTeams[0] || {
    id: 'MED-ALPHA-01',
    name: 'Rapid EMS Med-01',
    ambulanceType: 'ADVANCED_LIFE_SUPPORT',
    status: 'AVAILABLE',
    coordinates: [76.2755, 9.9800]
  };

  // Mobile View Switcher: Clinical Panel vs 3D Map
  const [mobileTab, setMobileTab] = useState<'CLINICAL' | 'MAP'>('CLINICAL');

  // Patient selection (default to critical or first case)
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    cases.find((c) => c.status === 'MEDICAL_HANDOFF' || c.priority === 'CRITICAL')?.id || cases[0]?.id || 'VY-26-1042'
  );

  const patientCase = cases.find((c) => c.id === selectedCaseId) || cases[0];
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(hospitals[0]?.id || '');
  const targetHospital = hospitals.find((h) => h.id === selectedHospitalId) || hospitals[0];

  // Clinical Vitals State
  const [heartRate, setHeartRate] = useState<number>(114);
  const [systolic, setSystolic] = useState<number>(92);
  const [diastolic, setDiastolic] = useState<number>(64);
  const [spO2, setSpO2] = useState<number>(89);
  const [respRate, setRespRate] = useState<number>(24);
  const [gcsScore, setGcsScore] = useState<number>(11);
  const [avpuState, setAvpuState] = useState<'A' | 'V' | 'P' | 'U'>('V');
  const [vitalsSaved, setVitalsSaved] = useState<boolean>(false);

  // Field Interventions Checklist
  const [interventions, setInterventions] = useState<{ [key: string]: boolean }>({
    o2: true,
    iv: true,
    tourniquet: false,
    cSpine: true,
    thermalFoil: true,
    defibPads: false
  });

  // Triage Tag Category
  const [triageCategory, setTriageCategory] = useState<'RED' | 'YELLOW' | 'GREEN' | 'BLACK'>('RED');
  const [triageFeedback, setTriageFeedback] = useState<string | null>(null);

  // Route & Dispatch State
  const [isRouting, setIsRouting] = useState<boolean>(false);
  const [routeInfo, setRouteInfo] = useState<{ distanceKm: number; etaMinutes: number; hazardNote: string } | null>(null);
  const [isDispatched, setIsDispatched] = useState<boolean>(false);
  const [dispatchMinutesLeft, setDispatchMinutesLeft] = useState<number>(4);

  // Admission Modal State
  const [admissionSuccessModal, setAdmissionSuccessModal] = useState<boolean>(false);

  // Keep state synced if patientCase changes
  useEffect(() => {
    if (patientCase) {
      if (patientCase.priority === 'CRITICAL') setTriageCategory('RED');
      else if (patientCase.priority === 'HIGH') setTriageCategory('YELLOW');
      else setTriageCategory('GREEN');
    }
  }, [patientCase?.id]);

  // Toggle interventions
  const toggleIntervention = (key: string) => {
    setInterventions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Save Vitals Action
  const handleSaveVitals = () => {
    const summary = `Vitals Logged: HR ${heartRate}bpm | BP ${systolic}/${diastolic} | SpO2 ${spO2}% | RR ${respRate} | GCS ${gcsScore} (${avpuState})`;
    updateCaseTriage(patientCase.id, triageCategory === 'RED' ? 'CRITICAL' : triageCategory === 'YELLOW' ? 'HIGH' : 'ACTIVE', undefined, summary);
    setVitalsSaved(true);
    setTimeout(() => setVitalsSaved(false), 2500);
  };

  // Change Triage Tag Action
  const handleSelectTriage = (tag: 'RED' | 'YELLOW' | 'GREEN' | 'BLACK') => {
    setTriageCategory(tag);
    const mappedPriority = tag === 'RED' ? 'CRITICAL' : tag === 'YELLOW' ? 'HIGH' : 'ACTIVE';
    updateCaseTriage(patientCase.id, mappedPriority, undefined, `START Field Triage set to ${tag}`);
    setTriageFeedback(`Triage Code Locked: ${tag}`);
    setTimeout(() => setTriageFeedback(null), 2500);
  };

  // Calculate Ambulance Route
  const handleRouteToHospital = async () => {
    if (!targetHospital) return;
    setIsRouting(true);
    try {
      const route = await fetchRealRoadRoute(
        myMedicalUnit.coordinates || [76.2755, 9.9800],
        targetHospital.coordinates || [76.2820, 9.9860],
        myMedicalUnit.name,
        targetHospital.name,
        hazardZones
      );
      setActiveRoute(route);
      setRouteInfo({
        distanceKm: route.distanceKm || 2.4,
        etaMinutes: route.estimatedMinutes || 4,
        hazardNote: route.hazardIntersection ? 'Route diverted around flooded river sector' : 'Fastest clear road corridor identified'
      });
    } catch {
      setRouteInfo({
        distanceKm: 2.4,
        etaMinutes: 4,
        hazardNote: 'High-priority emergency vehicle clearance requested'
      });
    } finally {
      setIsRouting(false);
    }
  };

  // Dispatch Ambulance Action
  const handleDispatchAmbulance = () => {
    setIsDispatched(true);
    setDispatchMinutesLeft(4);
    updateMedicalTeamStatus(myMedicalUnit.id, 'TRANSPORTING', targetHospital.id);
    updateVictimStatus(patientCase.id, 'EN_ROUTE', `Ambulance Code 3 transport initiated to ${targetHospital.name}`);
    advanceRescueChain(patientCase.id, 'RESCUER_EN_ROUTE', {
      actor: myMedicalUnit.name,
      locationName: targetHospital.name,
      notes: 'Code 3 transport with active vitals streaming'
    });
  };

  // Hospital ER Admission Action
  const handleConfirmAdmission = () => {
    // Decrement available bed in target hospital
    const isIcu = triageCategory === 'RED';
    updateHospitalBeds(targetHospital.id, isIcu ? 0 : -1, isIcu ? -1 : 0);
    
    // Update victim & chain
    updateVictimStatus(patientCase.id, 'HOSPITALIZED', `Admitted to ${targetHospital.name} (${isIcu ? 'ICU Bed' : 'Trauma Ward'})`);
    advanceRescueChain(patientCase.id, 'HOSPITAL_ADMITTED', {
      actor: `${targetHospital.name} Trauma Receiving Desk`,
      locationName: targetHospital.name,
      notes: `Patient admitted under ${triageCategory} triage protocol. Vitals: HR ${heartRate}, SpO2 ${spO2}%`
    });

    // Resolve any pending chain breaks
    resolveChainBreak('CB-ALERT-001', `Casualty admission verified at ${targetHospital.name}`);

    // Update medical unit back to AVAILABLE
    updateMedicalTeamStatus(myMedicalUnit.id, 'AVAILABLE');
    setIsDispatched(false);

    // Show admission certificate modal
    setAdmissionSuccessModal(true);
  };

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] flex flex-col md:flex-row overflow-hidden bg-[#070b14] text-slate-100 font-sans select-none">
      
      {/* Mobile Top Segment Switcher (Hidden on md and up) */}
      <div className="md:hidden flex items-center justify-around bg-[#0a1122] border-b border-slate-800 p-1.5 shrink-0 z-30 font-mono text-xs">
        <button
          onClick={() => setMobileTab('CLINICAL')}
          className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition ${
            mobileTab === 'CLINICAL'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Stethoscope className="w-4 h-4 text-teal-400" />
          <span>CLINICAL TRIAGE</span>
        </button>
        <button
          onClick={() => setMobileTab('MAP')}
          className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition ${
            mobileTab === 'MAP'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>3D GPS ROUTE</span>
          {routeInfo && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>}
        </button>
      </div>

      {/* Left Medical Control Panel */}
      <div className={`w-full md:w-[440px] lg:w-[480px] h-full bg-[#080e1d]/95 backdrop-blur-md border-r border-slate-800/90 p-3 sm:p-4 flex flex-col justify-between z-20 text-xs overflow-y-auto scrollbar-thin shadow-2xl ${
        mobileTab === 'MAP' ? 'hidden md:flex' : 'flex'
      }`}>
        <div className="space-y-3.5">
          
          {/* 1. Header & Ambulance Unit Status */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shadow-md">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white font-mono flex items-center space-x-1.5">
                  <span>{myMedicalUnit.name}</span>
                </h2>
                <div className="text-[10px] font-mono text-teal-400/80">
                  {myMedicalUnit.ambulanceType.replace(/_/g, ' ')} • GPS ACTIVE
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                isDispatched
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {isDispatched ? '🚨 CODE 3 TRANSPORT' : myMedicalUnit.status}
              </span>
            </div>
          </div>

          {/* 2. Patient Case Selector */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400 flex items-center space-x-1">
                <Users className="w-3.5 h-3.5 text-teal-400" />
                <span>CASUALTY SELECTION:</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                {cases.length} TOTAL CASUALTIES
              </span>
            </div>

            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="w-full bg-[#0a1122] border border-slate-700/80 rounded-lg px-2.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-teal-400"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  [{c.id}] {c.name} ({c.priority}) — {c.status}
                </option>
              ))}
            </select>

            <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-slate-300">
              <span>Location: <strong className="text-slate-100">{patientCase.locationName}</strong></span>
              <span className={`font-bold ${
                patientCase.priority === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'
              }`}>{patientCase.priority}</span>
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
              <strong className="text-teal-300">Complaint:</strong> {patientCase.medicalNeeds || 'Severe hypothermia and trauma sustained during flood surge.'}
            </div>
          </div>

          {/* 3. START Field Triage Tag Selector */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-300 font-bold">START TRIAGE SEVERITY CODE:</span>
              {triageFeedback && (
                <span className="text-teal-400 font-bold animate-pulse text-[10px]">{triageFeedback}</span>
              )}
            </div>

            <div className="grid grid-cols-4 gap-1.5 font-mono text-[10px] font-bold">
              <button
                onClick={() => handleSelectTriage('RED')}
                className={`py-2 rounded-lg border transition text-center flex flex-col items-center justify-center ${
                  triageCategory === 'RED'
                    ? 'bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-600/30 ring-1 ring-rose-400'
                    : 'bg-slate-950 text-rose-400 border-slate-800 hover:border-rose-500/50'
                }`}
              >
                <span>RED</span>
                <span className="text-[8px] opacity-80">IMMEDIATE</span>
              </button>

              <button
                onClick={() => handleSelectTriage('YELLOW')}
                className={`py-2 rounded-lg border transition text-center flex flex-col items-center justify-center ${
                  triageCategory === 'YELLOW'
                    ? 'bg-amber-600 text-white border-amber-400 shadow-md shadow-amber-600/30 ring-1 ring-amber-400'
                    : 'bg-slate-950 text-amber-400 border-slate-800 hover:border-amber-500/50'
                }`}
              >
                <span>YELLOW</span>
                <span className="text-[8px] opacity-80">DELAYED</span>
              </button>

              <button
                onClick={() => handleSelectTriage('GREEN')}
                className={`py-2 rounded-lg border transition text-center flex flex-col items-center justify-center ${
                  triageCategory === 'GREEN'
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400'
                    : 'bg-slate-950 text-emerald-400 border-slate-800 hover:border-emerald-500/50'
                }`}
              >
                <span>GREEN</span>
                <span className="text-[8px] opacity-80">MINOR</span>
              </button>

              <button
                onClick={() => handleSelectTriage('BLACK')}
                className={`py-2 rounded-lg border transition text-center flex flex-col items-center justify-center ${
                  triageCategory === 'BLACK'
                    ? 'bg-slate-700 text-white border-slate-400 ring-1 ring-slate-400'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600'
                }`}
              >
                <span>BLACK</span>
                <span className="text-[8px] opacity-80">DECEASED</span>
              </button>
            </div>
          </div>

          {/* 4. Live Clinical Vitals Monitor */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-teal-400 font-bold flex items-center space-x-1.5">
                <HeartPulse className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>FIELD VITALS TELEMETRY</span>
              </span>
              <span className="text-[10px] text-slate-400">STREAMING TO ER</span>
            </div>

            {/* Vitals Grid with adjustments */}
            <div className="grid grid-cols-2 gap-2 font-mono">
              {/* Heart Rate */}
              <div className="p-2.5 rounded-lg bg-[#070d1a] border border-slate-800 flex flex-col justify-between">
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>HEART RATE</span>
                  <Heart className="w-3 h-3 text-rose-500 fill-current animate-ping" />
                </div>
                <div className="flex items-baseline space-x-1 my-1">
                  <span className={`text-xl font-black ${heartRate > 100 || heartRate < 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {heartRate}
                  </span>
                  <span className="text-[10px] text-slate-400">BPM</span>
                </div>
                <div className="flex space-x-1">
                  <button onClick={() => setHeartRate((h) => Math.max(40, h - 5))} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px]">-5</button>
                  <button onClick={() => setHeartRate((h) => Math.min(180, h + 5))} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px]">+5</button>
                </div>
              </div>

              {/* SpO2 Oxygen */}
              <div className="p-2.5 rounded-lg bg-[#070d1a] border border-slate-800 flex flex-col justify-between">
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>PULSE OX (SpO2)</span>
                  <Activity className="w-3 h-3 text-cyan-400" />
                </div>
                <div className="flex items-baseline space-x-1 my-1">
                  <span className={`text-xl font-black ${spO2 < 92 ? 'text-rose-400' : 'text-cyan-300'}`}>
                    {spO2}%
                  </span>
                  <span className="text-[10px] text-slate-400">{spO2 < 92 ? 'HYPOXIC' : 'NORMAL'}</span>
                </div>
                <div className="flex space-x-1">
                  <button onClick={() => setSpO2((s) => Math.max(70, s - 2))} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px]">-2</button>
                  <button onClick={() => setSpO2((s) => Math.min(100, s + 2))} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px]">+2</button>
                </div>
              </div>

              {/* Blood Pressure */}
              <div className="p-2.5 rounded-lg bg-[#070d1a] border border-slate-800 flex flex-col justify-between">
                <div className="text-[10px] text-slate-400">BLOOD PRESSURE</div>
                <div className="text-base font-black text-amber-300 my-1">
                  {systolic}/{diastolic} <span className="text-[10px] font-normal text-slate-400">mmHg</span>
                </div>
                <div className="flex space-x-1">
                  <button onClick={() => { setSystolic(85); setDiastolic(55); }} className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[9px] text-slate-300">LOW</button>
                  <button onClick={() => { setSystolic(120); setDiastolic(80); }} className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[9px] text-slate-300">NORM</button>
                  <button onClick={() => { setSystolic(160); setDiastolic(100); }} className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[9px] text-slate-300">HIGH</button>
                </div>
              </div>

              {/* Glasgow Coma Scale (GCS) */}
              <div className="p-2.5 rounded-lg bg-[#070d1a] border border-slate-800 flex flex-col justify-between">
                <div className="text-[10px] text-slate-400">GCS & AVPU</div>
                <div className="text-base font-black text-white my-1 flex items-baseline space-x-1">
                  <span>{gcsScore}/15</span>
                  <span className="text-[10px] text-teal-400">({avpuState === 'A' ? 'Alert' : avpuState === 'V' ? 'Voice' : avpuState === 'P' ? 'Pain' : 'Unresp'})</span>
                </div>
                <div className="flex space-x-1">
                  {(['A', 'V', 'P', 'U'] as const).map((code) => (
                    <button
                      key={code}
                      onClick={() => {
                        setAvpuState(code);
                        setGcsScore(code === 'A' ? 15 : code === 'V' ? 12 : code === 'P' ? 8 : 3);
                      }}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        avpuState === code ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Save & Stream Vitals Button */}
            <button
              onClick={handleSaveVitals}
              className={`w-full py-2 rounded-lg font-mono font-bold text-xs transition flex items-center justify-center space-x-1.5 shadow ${
                vitalsSaved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-teal-600/90 hover:bg-teal-500 text-white'
              }`}
            >
              {vitalsSaved ? <Check className="w-4 h-4 text-white" /> : <Zap className="w-4 h-4 text-teal-200" />}
              <span>{vitalsSaved ? 'VITALS SYNCED TO HOSPITAL ER' : 'SAVE & TRANSMIT VITALS TO ER'}</span>
            </button>
          </div>

          {/* 5. Field Emergency Interventions Checklist */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="text-[11px] font-mono font-bold text-slate-300">
              EMERGENCY INTERVENTIONS APPLIED:
            </div>

            <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
              {[
                { key: 'o2', label: 'High-Flow O2 (15L)' },
                { key: 'iv', label: '18G IV Saline Bolus' },
                { key: 'cSpine', label: 'C-Spine Rigid Collar' },
                { key: 'thermalFoil', label: 'Thermal Foil Wrap' },
                { key: 'tourniquet', label: 'CAT Tourniquet' },
                { key: 'defibPads', label: 'AED Defib Standby' }
              ].map(({ key, label }) => {
                const active = interventions[key];
                return (
                  <button
                    key={key}
                    onClick={() => toggleIntervention(key)}
                    className={`p-2 rounded-lg border text-left flex items-center justify-between transition ${
                      active
                        ? 'bg-teal-950/40 border-teal-500/60 text-teal-200 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{label}</span>
                    <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] ${
                      active ? 'bg-teal-500 text-slate-950 font-bold' : 'border border-slate-700'
                    }`}>
                      {active ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Destination Hospital Selector & Bed Matching */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="text-[11px] font-mono text-slate-300 font-bold flex items-center justify-between">
              <span>DESTINATION EMERGENCY DEPARTMENT:</span>
              <span className="text-[10px] text-teal-400 font-normal">LIVE BEDS</span>
            </div>

            <div className="space-y-1.5">
              {hospitals.map((h) => {
                const isSelected = selectedHospitalId === h.id;
                return (
                  <div
                    key={h.id}
                    onClick={() => setSelectedHospitalId(h.id)}
                    className={`cursor-pointer p-2.5 rounded-lg border transition text-xs ${
                      isSelected
                        ? 'bg-slate-800/90 border-teal-400 ring-1 ring-teal-400'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-slate-200 flex justify-between items-center">
                      <span className="truncate">{h.name}</span>
                      <span className="text-teal-400 font-mono text-[10px] px-1.5 py-0.2 rounded bg-teal-950 border border-teal-800 shrink-0">
                        {h.traumaLevel}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1.5 flex justify-between">
                      <span>General Beds: <strong className="text-slate-200">{h.availableBeds}/{h.totalBeds}</strong></span>
                      <span className="text-emerald-400 font-bold">ICU Beds: {h.icuAvailable} Free</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calculate Ambulance Route Button */}
            <button
              onClick={handleRouteToHospital}
              disabled={isRouting}
              className="w-full mt-2 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 font-mono font-bold text-white text-xs transition flex items-center justify-center space-x-1.5 shadow"
            >
              <Navigation className={`w-3.5 h-3.5 ${isRouting ? 'animate-spin' : ''}`} />
              <span>{isRouting ? 'CALCULATING ROAD CORRIDOR...' : 'CALCULATE AMBULANCE ROAD ROUTE'}</span>
            </button>

            {/* Turn-by-Turn Route Preview if calculated */}
            {routeInfo && (
              <div className="mt-2 p-2.5 rounded-lg bg-teal-950/40 border border-teal-500/40 font-mono space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-teal-300 font-bold">✓ ROUTE TO {targetHospital.name.toUpperCase()}</span>
                  <span className="text-white font-bold">{routeInfo.distanceKm} km • {routeInfo.etaMinutes} min ETA</span>
                </div>
                <div className="text-[10px] text-teal-200/80">
                  {routeInfo.hazardNote}
                </div>
              </div>
            )}
          </div>

          {/* 7. Dispatch Ambulance (Code 3 Lights & Sirens) */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            {!isDispatched ? (
              <button
                onClick={handleDispatchAmbulance}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 font-mono font-black text-white text-xs uppercase tracking-wider transition shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Siren className="w-4 h-4 animate-pulse" />
                <span>DISPATCH CODE 3 AMBULANCE TO ER</span>
              </button>
            ) : (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/50 space-y-2 animate-pulse">
                <div className="flex items-center justify-between font-mono text-xs text-rose-300 font-bold">
                  <span className="flex items-center space-x-1.5">
                    <Siren className="w-4 h-4" />
                    <span>EN ROUTE WITH CODE 3 LIGHTS & SIRENS</span>
                  </span>
                  <span>ETA {dispatchMinutesLeft} MINS</span>
                </div>
                <div className="text-[10px] font-mono text-slate-300">
                  Streaming live telemetry directly to {targetHospital.name} Trauma Receiving Bay.
                </div>
              </div>
            )}
          </div>

          {/* 8. Confirm Hospital Admission */}
          <button
            onClick={handleConfirmAdmission}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-mono font-black text-white text-xs uppercase tracking-wider transition shadow-xl shadow-emerald-600/30 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>CONFIRM HOSPITAL ER ADMISSION & HANDOFF</span>
          </button>
        </div>

        <div className="pt-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex items-center justify-between">
          <span>EMS TELEMETRY • ENCRYPTED</span>
          <span className="text-teal-400">PROTOCOL: START-TRIAGE</span>
        </div>
      </div>

      {/* Right / Centerpiece: 3D Twin & Hospital Map View */}
      <div className={`relative flex-1 h-full overflow-hidden bg-[#050914] ${
        mobileTab === 'CLINICAL' ? 'hidden md:block' : 'block'
      }`}>
        <SimulatedCityTwin3D isHeroMode={true} />

        {/* Floating Route Telemetry HUD when route calculated */}
        {routeInfo && (
          <div className="absolute top-4 left-4 z-20 max-w-sm p-3 rounded-xl bg-slate-950/90 border border-teal-500/40 backdrop-blur-md shadow-2xl font-mono text-xs space-y-1">
            <div className="flex items-center space-x-1.5 text-teal-300 font-bold">
              <Navigation className="w-4 h-4 text-teal-400" />
              <span>ACTIVE AMBULANCE CORRIDOR</span>
            </div>
            <div className="text-white text-sm font-black">
              {routeInfo.distanceKm} km • {routeInfo.etaMinutes} min ETA
            </div>
            <div className="text-[10px] text-slate-400">
              To: {targetHospital.name} ({targetHospital.traumaLevel})
            </div>
          </div>
        )}
      </div>

      {/* Admission Success Certificate Modal */}
      {admissionSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#091122] border-2 border-emerald-500/80 rounded-2xl p-6 text-center shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-9 h-9 text-emerald-400" />
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-1">
                EMERGENCY HANDOFF VERIFIED
              </span>
              <h3 className="text-xl font-black text-white font-mono">
                PATIENT SAFELY ADMITTED
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Casualty {patientCase.name} ({patientCase.id}) successfully transitioned to {targetHospital.name}.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-left font-mono text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Ward:</span>
                <strong className="text-emerald-300">{triageCategory === 'RED' ? 'ICU Trauma Bed 03' : 'General Trauma Bed 12'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Triage Code:</span>
                <span className="text-rose-400 font-bold">{triageCategory} (Immediate Care)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Admission Recorded:</span>
                <span className="text-white">{new Date().toLocaleTimeString()} IST</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setAdmissionSuccessModal(false);
                  openFamilyModal();
                }}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-purple-600/30 transition"
              >
                <Heart className="w-4 h-4 fill-current text-pink-300" />
                <span>NOTIFY FAMILY VIA VYRO REUNITE™</span>
              </button>

              <button
                onClick={() => setAdmissionSuccessModal(false)}
                className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs transition"
              >
                CLOSE ADMISSION RECEIPT
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
