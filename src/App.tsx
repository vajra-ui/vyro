import React, { useState } from 'react';
import { useOperationalStore } from './stores/operationalStore';
import { TopNav } from './components/layout/TopNav';
import { RoleSwitcherModal } from './components/layout/RoleSwitcherModal';
import { SplashScreen } from './components/layout/SplashScreen';
import { DemoWalkthroughGuide } from './components/layout/DemoWalkthroughGuide';
import { ChainBreakModal } from './components/panels/ChainBreakModal';
import { FamilyReunificationModal } from './components/panels/FamilyReunificationModal';
import { AIEmergencyCompilerModal } from './components/panels/AIEmergencyCompilerModal';
import { LiveRescuerTrackingModal } from './components/panels/LiveRescuerTrackingModal';
import { FinalSuccessModal } from './components/panels/FinalSuccessModal';
import { Dedicated3DTwinView } from './components/views/Dedicated3DTwinView';
import { CommanderDashboard } from './components/roles/CommanderDashboard';
import { RescuerDashboard } from './components/roles/RescuerDashboard';
import { MedicalDashboard } from './components/roles/MedicalDashboard';
import { HospitalDashboard } from './components/roles/HospitalDashboard';
import { ShelterDashboard } from './components/roles/ShelterDashboard';
import { CitizenDashboard } from './components/roles/CitizenDashboard';

export const App: React.FC = () => {
  const { currentRole, primaryViewMode, isSplashActive } = useOperationalStore();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  return (
    <div className="w-screen h-screen flex flex-col bg-[#070b14] text-slate-100 overflow-hidden font-sans select-none">
      {/* 1. Cinematic Professional Splash Screen on Boot */}
      {isSplashActive && <SplashScreen />}

      {/* 2. Top Header Navigation */}
      <TopNav onOpenRoleModal={() => setIsRoleModalOpen(true)} />

      {/* 3. Primary View Mode / Role-Specific Dashboards */}
      <main className="flex-1 w-full h-[calc(100vh-3.5rem)] relative overflow-hidden">
        {primaryViewMode === '3D_TWIN' ? (
          <Dedicated3DTwinView />
        ) : (
          <>
            {currentRole === 'CITIZEN' && <CitizenDashboard />}
            {currentRole === 'COMMANDER' && <CommanderDashboard />}
            {currentRole === 'RESCUER' && <RescuerDashboard />}
            {currentRole === 'MEDICAL' && <MedicalDashboard />}
            {currentRole === 'HOSPITAL' && <HospitalDashboard />}
            {currentRole === 'SHELTER' && <ShelterDashboard />}
          </>
        )}
      </main>

      {/* 4. Global Tactical Overlays & Modals */}
      <AIEmergencyCompilerModal />
      <LiveRescuerTrackingModal />
      <ChainBreakModal />
      <FamilyReunificationModal />
      <FinalSuccessModal />
      <DemoWalkthroughGuide />

      {/* 5. Demo Access Switcher Modal */}
      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </div>
  );
};

export default App;
