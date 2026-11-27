/**
 * TutorialGuide - Narrative Story Intro & Objective Prompts
 */
import React from 'react';
import { Home, Sprout, Bike, ArrowRight, X } from 'lucide-react';

interface TutorialGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onDismissForever: () => void;
}

export const TutorialGuide: React.FC<TutorialGuideProps> = ({
  isOpen,
  onClose,
  onDismissForever,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 select-none">
      <div className="bg-stone-900 border border-emerald-700/60 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header with Rustic Banner */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-950/80 to-stone-900 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600/30 border border-emerald-500/50 rounded-xl text-emerald-400">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                Act I: Moving from Toronto
              </span>
              <h2 className="text-xl font-bold text-stone-100">
                Welcome to Central Hastings & Shannonville
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg transition"
            aria-label="Close story dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Narrative Body */}
        <div className="p-6 space-y-4 text-stone-300 text-sm leading-relaxed">
          <p>
            You have left the city hustle of Toronto behind to start fresh in Central Hastings,
            Ontario. With your modest $500 starting funds, you secured this small starter homestead
            along rural Old Highway 2 just outside Shannonville.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 bg-stone-850/80 border border-stone-800 rounded-xl flex items-start gap-3">
              <Sprout className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-stone-200">3 Starter Seed Packs</h4>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Check your roadside mailbox at the driveway entrance to claim and open your
                  starter packs.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-stone-850/80 border border-stone-800 rounded-xl flex items-start gap-3">
              <Bike className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-stone-200">Rural Cruiser Bicycle</h4>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Parked near the driveway. Press <kbd className="px-1 py-0.5 bg-stone-700 text-stone-200 rounded text-[10px] font-mono">E</kbd> or <kbd className="px-1 py-0.5 bg-stone-700 text-stone-200 rounded text-[10px] font-mono">B</kbd> to mount and explore the region.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-stone-950/60 border border-stone-800 rounded-lg text-xs text-stone-400">
            <strong className="text-stone-300">Controls:</strong> <kbd className="px-1 bg-stone-800 rounded text-stone-200 font-mono">W A S D</kbd> to move, <kbd className="px-1 bg-stone-800 rounded text-stone-200 font-mono">Shift</kbd> to sprint, <kbd className="px-1 bg-stone-800 rounded text-stone-200 font-mono">Space</kbd> to jump, drag mouse to orbit camera, <kbd className="px-1 bg-stone-800 rounded text-stone-200 font-mono">E</kbd> to interact.
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between">
          <button
            onClick={onDismissForever}
            className="text-xs text-stone-500 hover:text-stone-300 transition underline underline-offset-2"
          >
            Don&apos;t show again
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-lg transition"
          >
            Start Exploring
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
