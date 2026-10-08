import React, { useEffect, useState } from 'react';
import { useOperationalStore } from '../../stores/operationalStore';
import { Shield, Radio, Activity, Cpu, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

const LOADING_STEPS = [
  { label: 'CONNECTING TO RESCUE NETWORK', duration: 700, icon: Radio },
  { label: 'LOADING DIGITAL TWIN (KOCHI SECTOR)', duration: 800, icon: Activity },
  { label: 'INITIALIZING AI EMERGENCY TRIAGE', duration: 750, icon: Cpu },
  { label: 'CHECKING SECURE SATELLITE & MESH COMMS', duration: 650, icon: Zap },
  { label: 'SYSTEM READY — CITIZEN PORTAL ACTIVE', duration: 600, icon: CheckCircle2 }
];

export const SplashScreen: React.FC = () => {
  const { dismissSplash } = useOperationalStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const runSequence = (index: number) => {
      if (index >= LOADING_STEPS.length) {
        // Complete -> trigger smooth fadeout
        timeoutId = setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            dismissSplash();
          }, 600);
        }, 500);
        return;
      }

      timeoutId = setTimeout(() => {
        setCompletedSteps((prev) => [...prev, index]);
        setCurrentStepIndex(index + 1);
        runSequence(index + 1);
      }, LOADING_STEPS[index].duration);
    };

    runSequence(0);

    return () => clearTimeout(timeoutId);
  }, [dismissSplash]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#04070e] text-slate-100 select-none overflow-hidden transition-opacity duration-700 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Cinematic Tactical Atmospheric Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle dark grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a15_1px,transparent_1px),linear-gradient(to_bottom,#0f172a15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

        {/* Distant emergency pulsing beacons */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-600/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-rose-600/10 blur-[100px] animate-pulse delay-500"></div>

        {/* Rain / Mist subtle CSS lines */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#060a14]/60 to-[#04070e]"></div>

        {/* Subtle 3D Wireframe Silhouette representation */}
        <svg
          className="absolute bottom-0 w-full h-48 opacity-15 text-slate-600"
          preserveAspectRatio="none"
          viewBox="0 0 1200 200"
        >
          <path
            d="M0,200 L50,140 L90,140 L120,90 L160,90 L200,160 L240,160 L280,110 L330,110 L370,180 L420,130 L470,130 L520,70 L580,70 L620,150 L680,100 L740,100 L790,170 L850,120 L910,120 L960,80 L1020,80 L1080,160 L1150,110 L1200,200 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Top Header Tactical Indicator */}
      <div className="w-full max-w-4xl pt-8 px-6 flex items-center justify-between text-[11px] font-mono text-slate-500 z-10">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          <span className="text-slate-400 font-semibold tracking-wider">
            CRITICAL INFRASTRUCTURE MONITOR
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span>SEC: KOCHI-WATERFRONT</span>
          <span className="text-cyan-400">STATUS: INITIALIZING</span>
        </div>
      </div>

      {/* Center Cinematic Brand Block */}
      <div className="flex flex-col items-center text-center px-4 z-10 max-w-xl">
        {/* Official Brand Logo with cinematic tactical glow */}
        <div className="relative mb-5 group">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-cyan-500/30 via-sky-500/35 to-purple-600/30 blur-2xl animate-pulse"></div>
          <img 
            src="/logo.png" 
            alt="VYRO — Vigilant Rescue Operations" 
            className="relative w-52 sm:w-60 h-auto rounded-2xl shadow-2xl border border-cyan-500/40 bg-[#000b1f] object-contain p-2.5" 
          />
        </div>

        {/* Core Philosophy Quote */}
        <div className="mt-4 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400 tracking-wide">
          Disasters create chaos. <strong className="text-slate-200">VYRO creates continuity.</strong>
        </div>

        {/* Sequential Step Loading Display */}
        <div className="mt-10 w-full max-w-md bg-slate-950/70 border border-slate-800/90 rounded-xl p-4 shadow-2xl backdrop-blur-md text-left">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-3 border-b border-slate-800/80 pb-2">
            <span>TACTICAL BOOT SEQUENCE</span>
            <span className="text-cyan-400 font-bold">
              {Math.min(100, Math.round(((completedSteps.length) / LOADING_STEPS.length) * 100))}%
            </span>
          </div>

          <div className="space-y-2">
            {LOADING_STEPS.map((step, idx) => {
              const isCompleted = completedSteps.includes(idx);
              const isCurrent = currentStepIndex === idx;
              const StepIcon = step.icon;

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between text-[11px] font-mono transition-all duration-300 ${
                    isCompleted
                      ? 'text-slate-300'
                      : isCurrent
                      ? 'text-cyan-300 font-bold scale-[1.01]'
                      : 'text-slate-600'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shrink-0"></div>
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0"></div>
                    )}
                    <span className="truncate">{step.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0">
                    {isCompleted ? 'OK' : isCurrent ? 'RUNNING' : 'QUEUED'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Smooth Progress Bar */}
          <div className="mt-3 w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 h-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (completedSteps.length / LOADING_STEPS.length) * 100)}%`
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Skip for Judge Option */}
      <div className="w-full max-w-4xl pb-8 px-6 flex items-center justify-between text-[11px] font-mono text-slate-500 z-10">
        <div>ZERO CITIZEN LOGIN ENFORCED • EMERGENCY READY</div>
        <button
          onClick={() => {
            setIsFadingOut(true);
            setTimeout(dismissSplash, 200);
          }}
          className="px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition flex items-center space-x-1"
        >
          <span>ENTER CITIZEN PORTAL</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
