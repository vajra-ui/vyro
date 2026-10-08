import React from 'react';
import { useOperationalStore } from '../../stores/operationalStore';
import { Role } from '../../types/vyro';
import { X, Shield, LifeBuoy, Stethoscope, Building2, Home, User, CheckCircle2 } from 'lucide-react';

interface RoleOption {
  role: Role;
  title: string;
  email: string;
  password: string;
  desc: string;
  icon: React.ReactNode;
  badgeColor: string;
}

const ROLES: RoleOption[] = [
  {
    role: 'COMMANDER',
    title: 'Incident Commander',
    email: 'commander@vyro.demo',
    password: 'Vyro@123',
    desc: 'Master 3D digital twin situational awareness, resource allocation, dispatch & AI reasoning.',
    icon: <Shield className="w-5 h-5 text-sky-400" />,
    badgeColor: 'border-sky-500/40 bg-sky-500/10 text-sky-300'
  },
  {
    role: 'RESCUER',
    title: 'Field Rescue Team Alpha',
    email: 'rescuer@vyro.demo',
    password: 'Vyro@123',
    desc: 'Tactical GPS navigation, real turn-by-turn road routes, victim extraction, status updates.',
    icon: <LifeBuoy className="w-5 h-5 text-blue-400" />,
    badgeColor: 'border-blue-500/40 bg-blue-500/10 text-blue-300'
  },
  {
    role: 'MEDICAL',
    title: 'Emergency Medical Service',
    email: 'medical@vyro.demo',
    password: 'Vyro@123',
    desc: 'Casualty triage, mobile vitals logging, ambulance routing & hospital destination matching.',
    icon: <Stethoscope className="w-5 h-5 text-teal-400" />,
    badgeColor: 'border-teal-500/40 bg-teal-500/10 text-teal-300'
  },
  {
    role: 'HOSPITAL',
    title: 'General Hospital ER Desk',
    email: 'hospital@vyro.demo',
    password: 'Vyro@123',
    desc: 'Trauma center reception, ICU & general bed occupancy monitor, incoming casualty live ETA.',
    icon: <Building2 className="w-5 h-5 text-emerald-400" />,
    badgeColor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
  },
  {
    role: 'SHELTER',
    title: 'Relief Shelter Management',
    email: 'shelter@vyro.demo',
    password: 'Vyro@123',
    desc: 'Evacuee intake, capacity & bed allocation, medical support flags, family reunification.',
    icon: <Home className="w-5 h-5 text-purple-400" />,
    badgeColor: 'border-purple-500/40 bg-purple-500/10 text-purple-300'
  },
  {
    role: 'CITIZEN',
    title: 'Citizen Emergency SOS',
    email: 'citizen.sos@vyro.demo',
    password: 'No Password Needed',
    desc: 'Instant 1-tap SOS distress beacon, location report, nearby safe shelter finder & route.',
    icon: <User className="w-5 h-5 text-amber-400" />,
    badgeColor: 'border-amber-500/40 bg-amber-500/10 text-amber-300'
  }
];

export const RoleSwitcherModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { currentRole, setRole, addAuditLog, setPrimaryViewMode, openCompilerModal } = useOperationalStore();

  if (!isOpen) return null;

  const handleSelectRole = (r: RoleOption) => {
    setRole(r.role);
    addAuditLog(r.email, r.role, 'LOGIN_AUTH', `Authenticated as demo ${r.title}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0c1220] border border-slate-700/80 rounded-xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <img 
              src="/logo-icon.png" 
              alt="VYRO Logo" 
              className="w-10 h-10 rounded-xl object-contain bg-[#000b1f] border border-cyan-500/40 shadow-lg shadow-cyan-500/20 p-0.5 shrink-0" 
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-100 tracking-wide">
                  Role Authentication & Demo Access
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                  DEMO CREDENTIALS
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Select a pre-configured role to view the tactical operational environment through that role's interface.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="my-2.5 px-3 py-2 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>NOTICE: DEMO ACCESS ONLY • SIMULATION MODE</span>
          <span className="text-cyan-400">PASSWORD: Vyro@123</span>
        </div>

        {/* Hero Feature Quick Links */}
        <div className="grid grid-cols-2 gap-2 mb-3 font-mono text-xs">
          <button
            onClick={() => {
              setPrimaryViewMode('3D_TWIN');
              onClose();
            }}
            className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/50 hover:bg-cyan-900/50 text-cyan-200 font-bold transition flex items-center justify-center space-x-2 shadow-sm"
          >
            <span>🏙️ 3D CITY TWIN HERO</span>
          </button>
          <button
            onClick={() => {
              openCompilerModal();
              onClose();
            }}
            className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-500/50 hover:bg-purple-900/50 text-purple-200 font-bold transition flex items-center justify-center space-x-2 shadow-sm"
          >
            <span>🧠 AI EMERGENCY COMPILER</span>
          </button>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
          {ROLES.map((r) => {
            const isCurrent = currentRole === r.role;
            return (
              <div
                key={r.role}
                onClick={() => handleSelectRole(r)}
                className={`cursor-pointer p-3.5 rounded-lg border transition-all relative ${
                  isCurrent
                    ? 'bg-slate-800/90 border-cyan-500 ring-1 ring-cyan-500/50 shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded bg-slate-800 border border-slate-700">
                      {r.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-100 flex items-center space-x-1.5">
                        <span>{r.title}</span>
                        {isCurrent && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 inline" />
                        )}
                      </h3>
                      <div className="text-[11px] font-mono text-slate-400">
                        {r.email}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase font-bold ${r.badgeColor}`}
                  >
                    {r.role}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                  {r.desc}
                </p>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Pass: {r.password}</span>
                  <span className="text-cyan-400 font-semibold group-hover:underline">
                    {isCurrent ? 'ACTIVE' : 'SWITCH ->'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">
            System: Mock Credentials = Real Geospatial Twin World
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
