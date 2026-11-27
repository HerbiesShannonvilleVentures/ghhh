/**
 * HUD - In-Game Overlay & Collapsible Bottom Control Dock
 * Built to strictly uphold Three.js Directive 5: Zero Viewport Occlusion.
 */
import React, { useState } from 'react';
import {
  Package,
  Compass,
  Bike,
  User,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Award,
  Sparkles,
  Info,
  CheckCircle2,
  X,
} from 'lucide-react';
import { PlayerProfile, WorldInteractable, Objective } from '../types/game';

interface HUDProps {
  profile: PlayerProfile;
  telemetry: {
    posX: number;
    posZ: number;
    speedKmh: number;
    headingDeg: number;
    onBicycle: boolean;
  };
  nearInteractable: WorldInteractable | null;
  objectives: Objective[];
  onOpenInventory: () => void;
  onOpenMap: () => void;
  onOpenStory: () => void;
  onToggleBicycle: () => void;
  notification: string | null;
  onDismissNotification: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  profile,
  telemetry,
  nearInteractable,
  objectives,
  onOpenInventory,
  onOpenMap,
  onOpenStory,
  onToggleBicycle,
  notification,
  onDismissNotification,
}) => {
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [showObjectivesModal, setShowObjectivesModal] = useState(false);

  const completedCount = objectives.filter((o) => o.completed).length;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 select-none z-20">
      {/* 1. Minimal Top Status Bar */}
      <div className="flex items-start justify-between w-full pointer-events-auto">
        {/* Top-Left: Game Title & Location Badge */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 bg-stone-900/90 border border-stone-700/80 px-3 py-1.5 rounded-xl shadow-lg">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-stone-100 tracking-wide">
              HERBIE&apos;S SHANNONVILLE VENTURES
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-700/40 px-1.5 py-0.2 rounded">
              ALPHA v0.1
            </span>
          </div>

          <div className="flex items-center gap-2 bg-stone-900/85 border border-stone-800 px-2.5 py-1 rounded-lg text-xs text-stone-300 w-fit">
            <Compass className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-semibold text-stone-200">Shannonville</span>
            <span className="text-stone-500">•</span>
            <span className="font-mono text-[11px] text-stone-400">
              Old Hwy 2 ({telemetry.posX}m, {telemetry.posZ}m)
            </span>
          </div>
        </div>

        {/* Top-Right: Financials, Reputation & Vehicle Speed */}
        <div className="flex items-center gap-2 bg-stone-900/90 border border-stone-700/80 px-3 py-1.5 rounded-xl shadow-lg">
          {/* Cash */}
          <div className="flex items-center gap-1 text-emerald-400 font-bold font-mono text-sm pr-2 border-r border-stone-800">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>{profile.cash.toLocaleString()}</span>
          </div>

          {/* Reputation */}
          <div className="flex items-center gap-1 text-amber-300 font-mono text-xs pr-2 border-r border-stone-800">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>{profile.reputation} REP</span>
          </div>

          {/* Vehicle & Speedometer */}
          <div className="flex items-center gap-1.5 text-stone-300 font-mono text-xs">
            {telemetry.onBicycle ? (
              <Bike className="w-3.5 h-3.5 text-teal-400" />
            ) : (
              <User className="w-3.5 h-3.5 text-stone-400" />
            )}
            <span className="text-stone-200 font-bold">{telemetry.speedKmh}</span>
            <span className="text-[10px] text-stone-500">km/h</span>
          </div>
        </div>
      </div>

      {/* 2. Notification Toast Banner (If Active) */}
      {notification && (
        <div className="self-center pointer-events-auto bg-emerald-900/95 border border-emerald-500/80 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-semibold">{notification}</span>
          <button
            onClick={onDismissNotification}
            className="p-1 hover:bg-emerald-800 rounded transition"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5 text-emerald-200" />
          </button>
        </div>
      )}

      {/* 3. Center Proximity Interaction Prompt */}
      {nearInteractable && (
        <div className="self-center pointer-events-auto mb-2 bg-stone-900/95 border-2 border-amber-500 text-stone-100 px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-pulse">
          <div className="px-2 py-0.5 bg-amber-500 text-stone-950 font-mono font-bold text-xs rounded shadow">
            [E]
          </div>
          <div>
            <div className="text-xs font-bold text-amber-300">{nearInteractable.label}</div>
            <div className="text-[11px] text-stone-400">{nearInteractable.subtext}</div>
          </div>
        </div>
      )}

      {/* 4. Unified Collapsible Bottom Control Dock */}
      <div className="self-center flex flex-col items-center pointer-events-auto max-w-full">
        {/* Toggle Button */}
        <button
          onClick={() => setIsDockCollapsed(!isDockCollapsed)}
          className="mb-1.5 px-3 py-1 bg-stone-900/80 hover:bg-stone-850 text-stone-400 hover:text-stone-200 border border-stone-800 rounded-full text-[11px] font-medium flex items-center gap-1 shadow-md transition"
        >
          {isDockCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Show Controls</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Hide Controls</span>
            </>
          )}
        </button>

        {/* Horizontal Dock */}
        {!isDockCollapsed && (
          <div className="bg-stone-900/90 border border-stone-700/80 rounded-2xl p-2 shadow-2xl flex items-center gap-2">
            {/* Backpack / Inventory */}
            <button
              onClick={onOpenInventory}
              className="px-3.5 py-2 bg-stone-800/80 hover:bg-stone-750 hover:border-emerald-500/50 border border-stone-700 text-stone-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition group"
            >
              <Package className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
              <span>Backpack</span>
              <span className="text-[10px] bg-stone-950 px-1.5 py-0.5 rounded text-emerald-400 font-mono">
                {profile.inventory.reduce((a, b) => a + b.quantity, 0)}
              </span>
            </button>

            {/* Regional Map */}
            <button
              onClick={onOpenMap}
              className="px-3.5 py-2 bg-stone-800/80 hover:bg-stone-750 hover:border-blue-500/50 border border-stone-700 text-stone-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition group"
            >
              <Compass className="w-4 h-4 text-blue-400 group-hover:scale-110 transition" />
              <span>World Map</span>
            </button>

            {/* Bicycle Quick Mount/Dismount */}
            <button
              onClick={onToggleBicycle}
              className={`px-3.5 py-2 border rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                telemetry.onBicycle
                  ? 'bg-teal-600 text-white border-teal-400'
                  : 'bg-stone-800/80 hover:bg-stone-750 text-stone-200 border-stone-700'
              }`}
            >
              <Bike className="w-4 h-4 text-teal-300" />
              <span>{telemetry.onBicycle ? 'Dismount Bike' : 'Mount Bike'}</span>
              <span className="text-[9px] font-mono opacity-70">[B]</span>
            </button>

            {/* Objectives */}
            <button
              onClick={() => setShowObjectivesModal(true)}
              className="px-3.5 py-2 bg-stone-800/80 hover:bg-stone-750 hover:border-amber-500/50 border border-stone-700 text-stone-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition group"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
              <span>Objectives</span>
              <span className="text-[10px] bg-stone-950 px-1.5 py-0.5 rounded text-amber-400 font-mono">
                {completedCount}/{objectives.length}
              </span>
            </button>

            {/* Story / Guide */}
            <button
              onClick={onOpenStory}
              className="p-2 bg-stone-800/80 hover:bg-stone-750 border border-stone-700 text-stone-400 hover:text-stone-200 rounded-xl transition"
              aria-label="Story & Instructions"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Objectives Popout Modal */}
      {showObjectivesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 pointer-events-auto">
          <div className="bg-stone-900 border border-stone-700 w-full max-w-md rounded-2xl shadow-2xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-stone-100 text-base">Current Objectives</h3>
              </div>
              <button
                onClick={() => setShowObjectivesModal(false)}
                className="p-1 text-stone-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {objectives.map((obj) => (
                <div
                  key={obj.id}
                  className={`p-3 rounded-xl border text-xs flex items-start gap-3 transition ${
                    obj.completed
                      ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300'
                      : 'bg-stone-800/50 border-stone-700 text-stone-300'
                  }`}
                >
                  <div
                    className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      obj.completed
                        ? 'bg-emerald-600 border-emerald-400 text-white'
                        : 'border-stone-500'
                    }`}
                  >
                    {obj.completed && <CheckCircle2 className="w-3 h-3" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-200">{obj.title}</h4>
                    <p className="text-stone-400 text-[11px] mt-0.5 leading-relaxed">
                      {obj.description}
                    </p>
                    {obj.rewardCash && !obj.completed && (
                      <span className="text-[10px] font-mono text-emerald-400 font-bold mt-1 inline-block">
                        Reward: +${obj.rewardCash}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
