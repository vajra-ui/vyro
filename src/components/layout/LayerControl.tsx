import React from 'react';
import { useOperationalStore } from '../../stores/operationalStore';
import { 
  Layers, 
  AlertCircle, 
  Shield, 
  Cross, 
  Building2, 
  Home, 
  AlertTriangle, 
  Navigation, 
  Radio, 
  Box
} from 'lucide-react';
import { LayerVisibility } from '../../types/vyro';

export const LayerControl: React.FC = () => {
  const { layerVisibility, toggleLayer } = useOperationalStore();

  const layers: Array<{ key: keyof LayerVisibility; label: string; icon: React.ReactNode; color: string }> = [
    { key: 'victims', label: 'Victims', icon: <AlertCircle className="w-3.5 h-3.5" />, color: 'text-rose-400' },
    { key: 'rescueTeams', label: 'Rescue Teams', icon: <Shield className="w-3.5 h-3.5" />, color: 'text-sky-400' },
    { key: 'medicalTeams', label: 'Medical EMS', icon: <Cross className="w-3.5 h-3.5" />, color: 'text-teal-400' },
    { key: 'hospitals', label: 'Hospitals', icon: <Building2 className="w-3.5 h-3.5" />, color: 'text-emerald-400' },
    { key: 'shelters', label: 'Shelters', icon: <Home className="w-3.5 h-3.5" />, color: 'text-purple-400' },
    { key: 'hazards', label: 'Flood Hazards', icon: <AlertTriangle className="w-3.5 h-3.5" />, color: 'text-amber-400' },
    { key: 'routes', label: 'Routes', icon: <Navigation className="w-3.5 h-3.5" />, color: 'text-cyan-400' },
    { key: 'communication', label: 'Comms Nodes', icon: <Radio className="w-3.5 h-3.5" />, color: 'text-indigo-400' },
    { key: 'buildings3d', label: '3D Buildings', icon: <Box className="w-3.5 h-3.5" />, color: 'text-yellow-400' },
  ];

  return (
    <div className="flex items-center space-x-1 p-1 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg shadow-xl text-xs font-mono">
      <div className="px-2 py-1 text-slate-400 flex items-center space-x-1.5 border-r border-slate-800 text-[11px] font-semibold">
        <Layers className="w-3.5 h-3.5 text-cyan-400" />
        <span className="hidden sm:inline">LAYERS</span>
      </div>

      <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none py-0.5 px-1">
        {layers.map((l) => {
          const isActive = layerVisibility[l.key];
          return (
            <button
              key={l.key}
              onClick={() => toggleLayer(l.key)}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-[11px] transition-all ${
                isActive
                  ? 'bg-slate-800 text-slate-200 border border-slate-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 opacity-60'
              }`}
            >
              <span className={isActive ? l.color : 'text-slate-600'}>{l.icon}</span>
              <span className="whitespace-nowrap">{l.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
