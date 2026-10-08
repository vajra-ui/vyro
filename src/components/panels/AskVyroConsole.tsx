import React, { useState } from 'react';
import { useOperationalStore } from '../../stores/operationalStore';
import { aiCopilot, AIQueryResponse } from '../../services/aiCopilotService';
import { 
  Sparkles, 
  Send, 
  ChevronUp, 
  ChevronDown, 
  Navigation, 
  ArrowRight,
  HelpCircle,
  X
} from 'lucide-react';

const QUICK_PROMPTS = [
  'Which critical victim is closest to a hospital?',
  'Which rescue team is closest?',
  'Show all chain breaks',
  'Which patient is waiting for hospital confirmation?',
  'Which route is safer?',
  'Which shelter has capacity?',
  'Which victims have stale locations?',
  'Show missing persons near this shelter'
];

export const AskVyroConsole: React.FC = () => {
  const {
    cases,
    rescueTeams,
    hospitals,
    shelters,
    hazardZones,
    chainBreaks,
    missingPersons,
    selectEntity,
    triggerFlyTo,
    openBuildingModal
  } = useOperationalStore();

  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<AIQueryResponse | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const handleSubmit = (queryText: string) => {
    if (!queryText.trim()) return;
    setIsThinking(true);
    setIsOpen(true);

    setTimeout(() => {
      const res = aiCopilot.answerOperationalQuery(
        queryText,
        cases,
        rescueTeams,
        hospitals,
        shelters,
        hazardZones,
        chainBreaks,
        missingPersons
      );
      setResponse(res);
      setIsThinking(false);
    }, 250);
  };

  const handleExecuteSuggestedAction = () => {
    if (!response?.suggestedAction) return;
    const act = response.suggestedAction;

    if (act.type === 'SELECT_ENTITY' && act.entityType && act.entityId) {
      selectEntity(act.entityType, act.entityId);
    } else if (act.type === 'CALCULATE_ROUTE' && act.entityType && act.entityId) {
      selectEntity(act.entityType, act.entityId);
    }

    if (act.coordinates) {
      triggerFlyTo({
        coordinates: act.coordinates,
        zoom: 17,
        pitch: 65,
        bearing: -20
      });
    }
  };

  return (
    <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl px-4 pointer-events-auto">
      {/* Response Box (if open) */}
      {isOpen && (
        <div className="mb-2 bg-[#0c1220]/95 backdrop-blur-md border border-cyan-500/40 rounded-xl shadow-2xl p-4 text-xs font-sans animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="font-mono font-bold text-slate-100 text-xs tracking-wider">
                VYRO SPATIAL AI REASONING COPILOT
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {isThinking ? (
            <div className="py-4 flex items-center justify-center space-x-2 text-cyan-400 font-mono">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce delay-100"></div>
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce delay-200"></div>
              <span>Querying live geospatial records & calculating road paths...</span>
            </div>
          ) : response ? (
            <div className="mt-2.5 space-y-2.5">
              <p className="text-slate-200 text-xs leading-relaxed font-normal bg-slate-900/60 p-2.5 rounded border border-slate-800">
                {response.answer}
              </p>

              {response.dataPoints.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono text-[10px]">
                  {response.dataPoints.map((dp, idx) => (
                    <div key={idx} className="p-1.5 rounded bg-slate-950 border border-slate-800">
                      <div className="text-slate-500 truncate">{dp.label}</div>
                      <div className="text-cyan-300 font-bold truncate mt-0.5">{dp.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {response.suggestedAction && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleExecuteSuggestedAction}
                    className="py-1.5 px-3 rounded bg-cyan-600 hover:bg-cyan-500 font-mono font-bold text-white text-[11px] transition shadow flex items-center space-x-1.5"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{response.suggestedAction.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 inline" />
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* Main Input Bar */}
      <div className="bg-[#0b101c]/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl p-1.5 flex items-center space-x-2">
        <div className="pl-2 flex items-center text-cyan-400">
          <Sparkles className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit(prompt);
          }}
          placeholder="Ask VYRO: closest victim to hospital, nearest rescue team, shelter capacity..."
          className="flex-1 bg-transparent border-none text-slate-100 text-xs placeholder:text-slate-500 focus:outline-none font-mono py-1"
        />

        <button
          onClick={() => handleSubmit(prompt)}
          className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition flex items-center space-x-1 shadow"
        >
          <span>QUERY</span>
          <Send className="w-3 h-3" />
        </button>
      </div>

      {/* Quick Prompts Chips */}
      <div className="flex items-center space-x-1 mt-1.5 overflow-x-auto scrollbar-none pb-0.5">
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => {
              setPrompt(qp);
              handleSubmit(qp);
            }}
            className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 whitespace-nowrap transition backdrop-blur-sm"
          >
            "{qp}"
          </button>
        ))}
      </div>
    </div>
  );
};
