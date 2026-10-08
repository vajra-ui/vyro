import React from 'react';
import { useOperationalStore } from '../../stores/operationalStore';
import { 
  Play, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  X, 
  Sparkles, 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle, 
  Building2, 
  Users 
} from 'lucide-react';

interface StepDefinition {
  title: string;
  role: 'CITIZEN' | 'COMMANDER' | 'RESCUER' | 'MEDICAL' | 'HOSPITAL' | 'SHELTER';
  description: string;
  actionText: string;
  execute: (store: ReturnType<typeof useOperationalStore.getState>) => void;
}

const DEMO_STEPS: StepDefinition[] = [
  {
    title: '1. Citizen Emergency Home ("ARE YOU SAFE?")',
    role: 'CITIZEN',
    description: 'Zero login for citizens. Stressed user opens app and immediately sees "ARE YOU SAFE?" and primary SOS action.',
    actionText: 'Citizen Taps "GET HELP"',
    execute: (s) => {
      s.setRole('CITIZEN');
      s.setPrimaryViewMode('CITIZEN');
    }
  },
  {
    title: '2. Multi-Disaster Selection & Voice/Text Report',
    role: 'CITIZEN',
    description: 'Citizen selects Flood/Tsunami inundation with 4 people trapped on roof. Enters voice/text report in Tamil/English.',
    actionText: 'Open VYRO AI Emergency Compiler',
    execute: (s) => {
      s.openCompilerModal();
    }
  },
  {
    title: '3. AI Emergency Compiler Pipeline (7 Stages)',
    role: 'CITIZEN',
    description: 'VYRO AI compiler pipeline extracts emergency type, priority P1 CRITICAL (9.6/10), trapped count (4 pax), and Old Bridge sector coordinates. Synthesizes tactical packet #VY-2026-45872.',
    actionText: 'Dispatch to 3D Command Twin',
    execute: (s) => {
      s.closeCompilerModal();
      s.setRole('COMMANDER');
      s.setPrimaryViewMode('3D_TWIN');
      s.setActive3DDisaster('TSUNAMI');
      s.selectEntity('VICTIM', 'VY-2026-0002047');
    }
  },
  {
    title: '4. Commander 3D City Twin Simulation',
    role: 'COMMANDER',
    description: 'Procedural 3D City Twin displays dense illuminated buildings, canal water surge, and critical red beacon on Command Complex rooftop.',
    actionText: 'Review AI Rescue Plans A/B/C',
    execute: (s) => {
      s.setThreatAssessmentTab('PLANS');
      s.setActiveAiRescuePlan('A');
    }
  },
  {
    title: '5. AI Rescue Plan Selection (Option A: Zodiac Raft)',
    role: 'COMMANDER',
    description: 'Option A (Team Bravo Zodiac Raft, 94% Feasibility, ETA: 8m) highlighted in 3D. Commander approves dispatch.',
    actionText: 'Assign Team Bravo to Mission',
    execute: (s) => {
      s.assignTeamToVictim('TEAM-BRAVO-02', 'VY-2026-0002047');
      s.advanceRescueChain('VY-2026-0002047', 'COMMANDER_DISPATCH', {
        actor: 'Commander Varma',
        notes: 'Dispatched Team Bravo Zodiac Raft via river channel'
      });
      s.advanceRescueChain('VY-2026-0002047', 'RESCUER_ASSIGNED', {
        actor: 'Team Bravo',
        notes: 'Unit acknowledged mission dispatch'
      });
    }
  },
  {
    title: '6. Rescuer Mobile Field Interface & Live Telemetry',
    role: 'RESCUER',
    description: 'Mobile-first rescuer screen with "I\'M STILL HERE" micro-beacon, RADAR/SURVIVAL tabs, and live GPS tracking.',
    actionText: 'Rescuer En Route (Speed 24.5 km/h)',
    execute: (s) => {
      s.setRole('RESCUER');
      s.setPrimaryViewMode('RESCUER');
      s.advanceRescueChain('VY-2026-0002047', 'RESCUER_EN_ROUTE');
    }
  },
  {
    title: '7. Victim Located & Extricated',
    role: 'RESCUER',
    description: 'Team Bravo reaches rooftop structure. 4 trapped citizens secured into raft and winched safely.',
    actionText: 'Rescuer Secures Victims',
    execute: (s) => {
      s.updateVictimStatus('VY-2026-0002047', 'RESCUED', 'Extricated into Team Bravo craft');
      s.advanceRescueChain('VY-2026-0002047', 'VICTIM_LOCATED', {
        actor: 'Team Bravo',
        notes: 'Victims confirmed safe on rooftop'
      });
      s.advanceRescueChain('VY-2026-0002047', 'RESCUE_COMPLETED', {
        actor: 'Team Bravo',
        notes: 'Extricated onto zodiac craft'
      });
    }
  },
  {
    title: '8. Paramedic Medical Field Handoff',
    role: 'MEDICAL',
    description: 'Victims transferred to dockside EMS ambulance. Vitals logged and diabetic stabilization provided.',
    actionText: 'Paramedic Hands Off Patient',
    execute: (s) => {
      s.setRole('MEDICAL');
      s.setPrimaryViewMode('MEDICAL');
      s.updateVictimStatus('VY-2026-0002047', 'MEDICAL_HANDOFF', 'Handoff to Rapid EMS Med-01');
      s.advanceRescueChain('VY-2026-0002047', 'MEDICAL_HANDOFF', {
        actor: 'Rapid EMS Med-01',
        locationName: 'Old Bridge Ambulatory Bay',
        notes: 'IV glucose started. Transferring to Hospital ER.'
      });
    }
  },
  {
    title: '9. Hospital ER Delay & Rescue Chain Break Alert',
    role: 'COMMANDER',
    description: '⚠ RESCUE CHAIN BREAK DETECTED. Ambulance delivered patient 28m ago, but hospital intake confirmation is missing!',
    actionText: 'Open Chain Break Sentinel',
    execute: (s) => {
      s.setRole('COMMANDER');
      s.setPrimaryViewMode('COMMAND_CENTER');
      useOperationalStore.setState({ isChainBreakModalOpen: true });
      s.selectEntity('VICTIM', 'VY-2026-0002050');
    }
  },
  {
    title: '10. Commander Resolves Chain Break & Hospital Confirms',
    role: 'HOSPITAL',
    description: 'Commander calls Hospital ER controller. Dr. George confirms patient admission and allocates ICU bed.',
    actionText: 'Confirm Hospital Admission',
    execute: (s) => {
      s.setRole('HOSPITAL');
      s.setPrimaryViewMode('HOSPITAL');
      useOperationalStore.setState({ isChainBreakModalOpen: false });
      s.resolveChainBreak('CB-ALERT-001', 'Hospital ER Dr. George confirmed admission. ICU Bed 14A allocated.');
      s.advanceRescueChain('VY-2026-0002047', 'HOSPITAL_ADMITTED', {
        actor: 'General Hospital ER',
        notes: 'Confirmed admission. ICU Bed 14A.'
      });
    }
  },
  {
    title: '11. Shelter Intake & Evacuee Logistics',
    role: 'SHELTER',
    description: 'Stable evacuees checked into relief shelter. Blankets, food rations, and medical tracking assigned.',
    actionText: 'Check-in Evacuees to Shelter',
    execute: (s) => {
      s.setRole('SHELTER');
      s.setPrimaryViewMode('SHELTER');
      s.updateShelterOccupancy('SHELTER-01', 4);
      s.advanceRescueChain('VY-2026-0002047', 'SHELTER_TRANSFERRED', {
        actor: 'Relief Shelter Officer',
        notes: 'Family checked into Hall 2 with medical clearance'
      });
    }
  },
  {
    title: '12. Family Reunification AI Matching',
    role: 'CITIZEN',
    description: 'Concerned relatives query missing persons. AI matches Leela Menon at relief shelter with 94% confidence.',
    actionText: 'Open Family Verification Dialog',
    execute: (s) => {
      s.setRole('CITIZEN');
      s.setPrimaryViewMode('CITIZEN');
      s.openFamilyModal();
    }
  },
  {
    title: '13. Human Verification & Final Reunion',
    role: 'COMMANDER',
    description: 'Shelter officers verify family identity. Human approval confirmed. Family reunited!',
    actionText: 'Verify Reunion & Close Case',
    execute: (s) => {
      s.setRole('COMMANDER');
      s.setPrimaryViewMode('COMMAND_CENTER');
      s.closeFamilyModal();
      s.verifyFamilyReunion('MP-2026-01');
      s.advanceRescueChain('VY-2026-0002047', 'FAMILY_REUNITED', {
        actor: 'Shelter Relief Officer',
        notes: 'Rajan Menon and Leela Menon safely reunited at Shelter 01'
      });
      s.advanceRescueChain('VY-2026-0002047', 'CASE_CLOSED', {
        actor: 'Commander Varma',
        notes: 'Full rescue lifecycle verified and archived'
      });
    }
  },
  {
    title: '14. Mission Complete — Full Success Screen',
    role: 'COMMANDER',
    description: '✓ Rescue Completed. ✓ Family Reunited. ✓ Case Verified. Disasters create chaos. VYRO creates continuity.',
    actionText: 'Display Final Success Screen',
    execute: (s) => {
      s.openFinalSuccessModal();
    }
  }
];

export const DemoWalkthroughGuide: React.FC = () => {
  const {
    isDemoWalkthroughActive,
    demoWalkthroughStep,
    nextDemoWalkthroughStep,
    setDemoWalkthroughStep,
    closeDemoWalkthrough
  } = useOperationalStore();

  if (!isDemoWalkthroughActive) return null;

  const currentStep = DEMO_STEPS[demoWalkthroughStep] || DEMO_STEPS[0];
  const isLast = demoWalkthroughStep === DEMO_STEPS.length - 1;

  const handleStepAction = () => {
    currentStep.execute(useOperationalStore.getState());
    if (!isLast) {
      nextDemoWalkthroughStep();
    } else {
      closeDemoWalkthrough();
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4 pointer-events-auto animate-fadeIn select-none">
      <div className="bg-[#090e1b]/95 border-2 border-cyan-500 rounded-2xl shadow-2xl p-4 text-xs font-sans backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2 font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="font-bold text-cyan-300 uppercase tracking-wider text-xs">
              VYRO HACKATHON GUIDED LIFECYCLE TOUR
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono text-slate-400 font-bold">
              STEP {demoWalkthroughStep + 1} / {DEMO_STEPS.length}
            </span>
            <button
              onClick={closeDemoWalkthrough}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="py-2.5 space-y-1.5">
          <div className="flex items-center space-x-2">
            <h3 className="font-mono font-bold text-sm text-slate-100">{currentStep.title}</h3>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 border border-slate-700">
              ROLE: {currentStep.role}
            </span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed font-sans">
            {currentStep.description}
          </p>
        </div>

        {/* Action Controls */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <button
              disabled={demoWalkthroughStep === 0}
              onClick={() => {
                const prev = Math.max(0, demoWalkthroughStep - 1);
                setDemoWalkthroughStep(prev);
                DEMO_STEPS[prev].execute(useOperationalStore.getState());
              }}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={isLast}
              onClick={() => {
                const next = Math.min(DEMO_STEPS.length - 1, demoWalkthroughStep + 1);
                setDemoWalkthroughStep(next);
                DEMO_STEPS[next].execute(useOperationalStore.getState());
              }}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleStepAction}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 font-mono font-bold text-white text-xs transition shadow-lg shadow-cyan-600/30 flex items-center space-x-1.5 cursor-pointer"
          >
            <span>{currentStep.actionText}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
