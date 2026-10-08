import React from 'react';
import { useOperationalStore } from '../../stores/operationalStore';
import { VyroReunitePanel } from './VyroReunitePanel';

export const FamilyReunificationModal: React.FC = () => {
  const { isFamilyModalOpen, closeFamilyModal } = useOperationalStore();

  if (!isFamilyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <VyroReunitePanel isModal onClose={closeFamilyModal} />
    </div>
  );
};

export default FamilyReunificationModal;
