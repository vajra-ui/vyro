import React from 'react';
import { useOperationalStore } from '../../stores/operationalStore';
import { MapCameraMode } from '../../types/vyro';
import { Box, Map, Globe, Compass, Plus, Minus, RotateCcw } from 'lucide-react';
import { INCIDENT_CENTER } from '../../data/demoIncidentData';

export const MapControls: React.FC = () => {
  const { cameraMode, setCameraMode, triggerFlyTo } = useOperationalStore();

  const handleResetCenter = () => {
    triggerFlyTo({
      coordinates: INCIDENT_CENTER,
      zoom: 15.2,
      pitch: cameraMode === '3D' ? 62 : 0,
      bearing: -22,
      duration: 1400
    });
  };

  return (
    <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2 select-none">
      {/* 2D / 3D / Satellite Mode Switcher */}
      <div className="flex items-center p-1 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg shadow-xl text-xs font-mono space-x-1">
        <button
          onClick={() => setCameraMode('2D')}
          className={`flex items-center space-x-1 px-2.5 py-1.5 rounded transition ${
            cameraMode === '2D'
              ? 'bg-cyan-600 text-white font-bold shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Switch to 2D Plan View"
        >
          <Map className="w-3.5 h-3.5" />
          <span>2D</span>
        </button>

        <button
          onClick={() => setCameraMode('3D')}
          className={`flex items-center space-x-1 px-2.5 py-1.5 rounded transition ${
            cameraMode === '3D'
              ? 'bg-cyan-600 text-white font-bold shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Switch to 3D Digital Twin (Buildings & Tilt)"
        >
          <Box className="w-3.5 h-3.5" />
          <span>3D</span>
        </button>

        <button
          onClick={() => setCameraMode('SATELLITE')}
          className={`flex items-center space-x-1 px-2.5 py-1.5 rounded transition ${
            cameraMode === 'SATELLITE'
              ? 'bg-cyan-600 text-white font-bold shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Switch to Satellite Imagery"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>SATELLITE</span>
        </button>

        <button
          onClick={() => setCameraMode('TERRAIN')}
          className={`flex items-center space-x-1 px-2.5 py-1.5 rounded transition ${
            cameraMode === 'TERRAIN'
              ? 'bg-cyan-600 text-white font-bold shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Tactical Terrain Perspective"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>TERRAIN</span>
        </button>
      </div>

      {/* Reset Center */}
      <button
        onClick={handleResetCenter}
        className="w-8 h-8 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 shadow-xl flex items-center justify-center transition"
        title="Reset to Sector Incident Center"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
};
