import React, { useState, useEffect } from 'react';
import { useOperationalStore } from '../../stores/operationalStore';
import { 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Globe, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Radio, 
  X,
  Volume2,
  ChevronRight,
  Database,
  Search,
  Activity
} from 'lucide-react';
import { DisasterType } from '../../types/vyro';

interface PipelineStage {
  id: number;
  name: string;
  subtext: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED';
}

const SAMPLE_INPUTS = [
  {
    lang: 'Tamil',
    code: 'ta',
    text: 'பழைய பாலம் அருகே எங்கள் கட்டிடத்தின் மாடியில் வெள்ள நீர் சூழ்ந்துள்ளது. 4 பேர் சிக்கியிருக்கிறோம், உடனடியாக படகு தேவை!',
    translation: 'Near Old Bridge, flood water has surrounded our building rooftop. 4 people trapped, immediate boat needed!'
  },
  {
    lang: 'Hindi',
    code: 'hi',
    text: 'सुनामी की लहर पुल के पास आ गई है, छत पर 3 लोग फंसे हैं और पानी बढ़ रहा है। तुरंत सहायता भेजें!',
    translation: 'Tsunami wave reached near bridge, 3 people trapped on roof and water is rising. Send help immediately!'
  },
  {
    lang: 'English',
    code: 'en',
    text: '18m surge wave cresting into sector 3 old bridge approach! Rooftop flooded, elderly patient needs winch extraction!',
    translation: '18m surge wave cresting into sector 3 old bridge approach! Rooftop flooded, elderly patient needs winch extraction!'
  },
  {
    lang: 'Malayalam',
    code: 'ml',
    text: 'പഴയ പാലം റോഡ് വെള്ളത്തിനടിയിലാണ്. കെട്ടിടത്തിന്റെ മുകളിൽ 4 പേർ കുടുങ്ങിയിരിക്കുന്നു, പെട്ടെന്ന് വള്ളം വേണം!',
    translation: 'Old bridge road is submerged. 4 people trapped on building roof, boat urgently required!'
  }
];

export const AIEmergencyCompilerModal: React.FC = () => {
  const { 
    isCompilerModalOpen, 
    closeCompilerModal, 
    submitCitizenSOS, 
    setPrimaryViewMode,
    setActive3DDisaster,
    selectEntity
  } = useOperationalStore();

  const [rawInput, setRawInput] = useState(SAMPLE_INPUTS[0].text);
  const [selectedLanguage, setSelectedLanguage] = useState(SAMPLE_INPUTS[0].lang);
  const [isCompiling, setIsCompiling] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [compiledPacket, setCompiledPacket] = useState<any | null>(null);

  const pipelineStages: PipelineStage[] = [
    { id: 1, name: 'RAW HUMAN INPUT INGESTION', subtext: 'Normalizing acoustic/text telemetry buffer', status: currentStepIndex > 0 ? 'COMPLETED' : currentStepIndex === 0 ? 'PROCESSING' : 'PENDING' },
    { id: 2, name: 'LANGUAGE IDENTIFICATION', subtext: `Detected: ${selectedLanguage} (Confidence 99.2%)`, status: currentStepIndex > 1 ? 'COMPLETED' : currentStepIndex === 1 ? 'PROCESSING' : 'PENDING' },
    { id: 3, name: 'SEMANTIC EXTRACTION', subtext: 'Entity recognition: Trapped count, water level, urgency', status: currentStepIndex > 2 ? 'COMPLETED' : currentStepIndex === 2 ? 'PROCESSING' : 'PENDING' },
    { id: 4, name: 'EMERGENCY CLASSIFICATION', subtext: 'Disaster match: FLOOD / TSUNAMI SURGE', status: currentStepIndex > 3 ? 'COMPLETED' : currentStepIndex === 3 ? 'PROCESSING' : 'PENDING' },
    { id: 5, name: 'PRIORITY RATING', subtext: 'Calculated P1: CRITICAL (Threat Score: 9.6/10)', status: currentStepIndex > 4 ? 'COMPLETED' : currentStepIndex === 4 ? 'PROCESSING' : 'PENDING' },
    { id: 6, name: 'LOCATION CLUE EXTRACTION', subtext: 'Old Bridge Sector / Rooftop Elevation +42m', status: currentStepIndex > 5 ? 'COMPLETED' : currentStepIndex === 5 ? 'PROCESSING' : 'PENDING' },
    { id: 7, name: 'EMERGENCY PACKET SYNTHESIS', subtext: 'Deterministic JSON packet generated for Commander 3D Twin', status: currentStepIndex > 6 ? 'COMPLETED' : currentStepIndex === 6 ? 'PROCESSING' : 'PENDING' },
  ];

  const handleStartCompile = () => {
    setIsCompiling(true);
    setCurrentStepIndex(0);
    setCompiledPacket(null);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCurrentStepIndex(step);
      if (step >= 7) {
        clearInterval(interval);
        setIsCompiling(false);
        // Generated Packet
        setCompiledPacket({
          caseId: 'VY-2026-45872',
          disasterType: 'TSUNAMI' as DisasterType,
          severity: 'CRITICAL P1 (9.6/10)',
          peopleCount: 4,
          locationClue: 'Old Bridge Sector, Rooftop Complex Pier 4',
          hazards: ['Surge Current +18m', 'High Water Velocity', 'Structural Inundation'],
          requiredResources: ['Zodiac Amphibious Raft', 'Winch Harness', 'Trauma Paramedic'],
          confidence: '96.8%',
          detectedLanguage: selectedLanguage,
          synthesizedSummary: 'Critical flood/tsunami surge entrapment of 4 citizens on elevated rooftop requiring watercraft extraction before next surge crest.'
        });
      }
    }, 450);
  };

  const handleDispatchToCommander = () => {
    if (!compiledPacket) return;
    submitCitizenSOS({
      disasterType: compiledPacket.disasterType,
      location: [76.2711, 9.9312],
      locationName: compiledPacket.locationClue,
      accuracy: 8,
      peopleCount: compiledPacket.peopleCount,
      rawReport: rawInput,
      isVoice: false,
      triage: {
        disasterType: compiledPacket.disasterType,
        priority: 'CRITICAL',
        severityScore: 9.6,
        urgency: 'IMMEDIATE',
        victimCount: compiledPacket.peopleCount,
        trappedStatus: true,
        extractedHazards: compiledPacket.hazards,
        extractedLocationClues: [compiledPacket.locationClue],
        detectedLanguage: compiledPacket.detectedLanguage,
        duplicateProbability: 0.05,
        recommendedUnitType: 'Zodiac Raft',
        aiSummary: compiledPacket.synthesizedSummary
      }
    });

    setActive3DDisaster('TSUNAMI');
    selectEntity('VICTIM', 'VY-2026-0002047');
    closeCompilerModal();
    setPrimaryViewMode('3D_TWIN');
  };

  if (!isCompilerModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
      <div className="relative w-full max-w-5xl bg-[#091122] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0d1a33] via-[#0b162c] to-[#091122] border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <img 
              src="/logo-icon.png" 
              alt="VYRO Logo" 
              className="w-10 h-10 rounded-xl object-contain bg-[#000b1f] border border-cyan-400 shadow-lg shadow-cyan-500/20 p-0.5" 
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black tracking-wider text-white uppercase">
                  VYRO EMERGENCY COMPILER
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                  AI DECISION ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Converts unstructured human emergency input into actionable rescue intelligence
              </p>
            </div>
          </div>
          <button
            onClick={closeCompilerModal}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Section 1: Raw Human Input & Dialect Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>RAW HUMAN EMERGENCY INPUT</span>
              </label>
              <div className="flex items-center space-x-1.5">
                {SAMPLE_INPUTS.map((sample) => (
                  <button
                    key={sample.code}
                    onClick={() => {
                      setRawInput(sample.text);
                      setSelectedLanguage(sample.lang);
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition ${
                      selectedLanguage === sample.lang
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {sample.lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <textarea
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-sm font-sans focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition resize-none"
                placeholder="Enter raw emergency text or spoken voice message in any Indian regional language..."
              />
              <button
                onClick={handleStartCompile}
                disabled={isCompiling}
                className="absolute bottom-3 right-3 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition disabled:opacity-50 flex items-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isCompiling ? 'COMPILING PIPELINE...' : 'COMPILE RESCUE PACKET'}</span>
              </button>
            </div>
          </div>

          {/* Section 2: 7-Stage Compiler Pipeline Animation */}
          <div className="bg-[#060c18] border border-slate-800 rounded-xl p-4">
            <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>PIPELINE EXECUTION MONITOR</span>
              <span className="text-cyan-400">STAGE {Math.min(currentStepIndex + 1, 7)} OF 7</span>
            </div>

            <div className="space-y-2">
              {pipelineStages.map((stage) => {
                const isCompleted = stage.status === 'COMPLETED';
                const isProcessing = stage.status === 'PROCESSING';

                return (
                  <div
                    key={stage.id}
                    className={`p-2.5 rounded-lg border transition flex items-center justify-between text-xs font-mono ${
                      isCompleted
                        ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200'
                        : isProcessing
                        ? 'bg-amber-950/40 border-amber-500 text-amber-200 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-900/40 border-slate-800/80 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        isCompleted
                          ? 'bg-cyan-500 text-slate-950'
                          : isProcessing
                          ? 'bg-amber-500 text-slate-950 animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isCompleted ? '✓' : stage.id}
                      </div>
                      <div>
                        <div className="font-bold tracking-wide">{stage.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{stage.subtext}</div>
                      </div>
                    </div>

                    <div className="text-[10px] font-bold">
                      {isCompleted && <span className="text-emerald-400">PASSED</span>}
                      {isProcessing && <span className="text-amber-400 animate-pulse">PROCESSING...</span>}
                      {stage.status === 'PENDING' && <span className="text-slate-600">QUEUED</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Output Emergency Packet Synthesis Card */}
          {compiledPacket && (
            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#0c1830] to-[#070e1c] border-2 border-cyan-400 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <span className="font-mono font-black text-sm text-white uppercase tracking-wider">
                    SYNTHESIZED RESCUE PACKET: {compiledPacket.caseId}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded bg-rose-500/20 border border-rose-500/50 text-rose-300 font-mono text-xs font-bold animate-pulse">
                  {compiledPacket.severity}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-3 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">EMERGENCY CLASSIFICATION</span>
                  <strong className="text-cyan-300 text-sm">{compiledPacket.disasterType}</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">AFFECTED PERSONS</span>
                  <strong className="text-amber-300 text-sm">{compiledPacket.peopleCount} TRAPPED CITIZENS</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">AI CONFIDENCE SCORE</span>
                  <strong className="text-emerald-300 text-sm">{compiledPacket.confidence}</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 col-span-1 sm:col-span-2">
                  <span className="text-[10px] text-slate-400 block">EXTRACTED LOCATION CLUE</span>
                  <strong className="text-slate-100">{compiledPacket.locationClue}</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">DETECTED HAZARDS</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {compiledPacket.hazards.map((h: string) => (
                      <span key={h} className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs font-mono mb-4">
                <span className="text-slate-400 block mb-1">RECOMMENDED RESCUE UNITS & RESOURCES:</span>
                <div className="flex flex-wrap gap-2">
                  {compiledPacket.requiredResources.map((res: string) => (
                    <span key={res} className="px-2 py-1 rounded bg-sky-500/20 border border-sky-500/40 text-sky-200 font-bold">
                      {res}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={closeCompilerModal}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs transition"
                >
                  DISMISS
                </button>
                <button
                  onClick={handleDispatchToCommander}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-mono font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition flex items-center space-x-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>DISPATCH TO 3D COMMAND TWIN</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
