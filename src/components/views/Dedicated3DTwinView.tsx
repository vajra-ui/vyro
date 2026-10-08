import React from 'react';
import { SimulatedCityTwin3D } from '../map/SimulatedCityTwin3D';
import { useOperationalStore } from '../../stores/operationalStore';

export const Dedicated3DTwinView: React.FC = () => {
  const { setPrimaryViewMode } = useOperationalStore();

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#050914]">
      <SimulatedCityTwin3D 
        onBack={() => setPrimaryViewMode('COMMAND_CENTER')} 
      />
    </div>
  );
};
