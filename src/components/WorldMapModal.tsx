/**
 * WorldMapModal - Regional Central Hastings & Shannonville Navigator
 */
import React from 'react';
import { MapPin, Navigation, Compass, X, AlertCircle } from 'lucide-react';

interface WorldMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerCoords: { posX: number; posZ: number };
}

export const WorldMapModal: React.FC<WorldMapModalProps> = ({
  isOpen,
  onClose,
  playerCoords,
}) => {
  if (!isOpen) return null;

  // Key regional points of interest in Central Hastings / Shannonville coordinate system
  const POIS = [
    {
      id: 'homestead',
      name: 'Starter Homestead & Grow Beds',
      desc: '42 Old Highway 2 • Your rural property with workshop & garden beds',
      x: -13,
      z: -16,
      type: 'home',
      color: 'bg-emerald-500',
    },
    {
      id: 'mailbox',
      name: 'Rural Mailbox & Starter Seed Depot',
      desc: 'Old Hwy 2 Driveway • Claim move-in seed packs',
      x: -5,
      z: -8,
      type: 'depot',
      color: 'bg-amber-500',
    },
    {
      id: 'shannonville_center',
      name: 'Shannonville Crossroads & Signpost',
      desc: 'Junction of Old Highway 2 & Shannonville Road',
      x: -60,
      z: 0,
      type: 'crossroad',
      color: 'bg-blue-500',
    },
    {
      id: 'tyendinaga_border',
      name: 'Tyendinaga Mohawk Territory Boundary',
      desc: 'Regional trading hub & future dispensary venues',
      x: -110,
      z: -10,
      type: 'territory',
      color: 'bg-purple-500',
    },
    {
      id: 'belleville_hwy',
      name: 'Westbound Old Hwy 2 (To Belleville 15km)',
      desc: 'Highway corridor leading to urban commercial district',
      x: -150,
      z: 0,
      type: 'highway',
      color: 'bg-sky-500',
    },
  ];

  // Map scale conversion: -160 to +60 in X, -60 to +40 in Z
  const mapMinX = -170;
  const mapMaxX = 60;
  const mapMinZ = -70;
  const mapMaxZ = 45;

  const getMapPercentX = (worldX: number) => {
    return Math.max(5, Math.min(95, ((worldX - mapMinX) / (mapMaxX - mapMinX)) * 100));
  };

  const getMapPercentY = (worldZ: number) => {
    return Math.max(5, Math.min(95, ((worldZ - mapMinZ) / (mapMaxZ - mapMinZ)) * 100));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 select-none">
      <div className="bg-stone-900 border border-stone-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-850 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-950/60 border border-blue-700/50 rounded-lg text-blue-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-100">
                Central Hastings & Shannonville Regional Map
              </h2>
              <p className="text-xs text-stone-400">
                Live Coordinates: X: {playerCoords.posX}m • Z: {playerCoords.posZ}m
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition"
            aria-label="Close world map"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Canvas Visualizer */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="relative w-full h-80 bg-stone-950 border border-stone-800 rounded-xl overflow-hidden shadow-inner">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#292524_1px,transparent_1px),linear-gradient(to_bottom,#292524_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />

            {/* Old Highway 2 Road Line */}
            <div
              className="absolute left-0 right-0 h-4 bg-stone-700 border-y border-amber-500/40 transform -translate-y-1/2 flex items-center justify-center"
              style={{ top: `${getMapPercentY(0)}%` }}
            >
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400/80 uppercase">
                Old Highway 2 (East-West Regional Corridor)
              </span>
            </div>

            {/* Shannonville Crossroad Line */}
            <div
              className="absolute top-0 bottom-0 w-3 bg-stone-700 border-x border-stone-500/30 transform -translate-x-1/2"
              style={{ left: `${getMapPercentX(-60)}%` }}
            />

            {/* POI Markers */}
            {POIS.map((poi) => (
              <div
                key={poi.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                style={{
                  left: `${getMapPercentX(poi.x)}%`,
                  top: `${getMapPercentY(poi.z)}%`,
                }}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 border-stone-900 shadow-md ${poi.color}`}
                />
                <div className="absolute left-1/2 -translate-x-1/2 top-4 whitespace-nowrap bg-stone-900/90 border border-stone-700 text-stone-200 text-[10px] font-semibold px-2 py-0.5 rounded shadow pointer-events-none opacity-80 group-hover:opacity-100 transition">
                  {poi.name}
                </div>
              </div>
            ))}

            {/* Live Player Position Marker */}
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
              style={{
                left: `${getMapPercentX(playerCoords.posX)}%`,
                top: `${getMapPercentY(playerCoords.posZ)}%`,
              }}
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-[0_0_12px_rgba(16,185,129,0.8)] flex items-center justify-center animate-pulse">
                <Navigation className="w-3 h-3 text-white transform -rotate-45" />
              </div>
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-emerald-400 bg-stone-950/90 px-1.5 py-0.2 rounded border border-emerald-500/50">
                YOU
              </span>
            </div>
          </div>

          {/* Regional Geographic Notice */}
          <div className="mt-4 p-3.5 bg-stone-850/80 border border-stone-800 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-stone-400 leading-relaxed">
              <strong className="text-stone-300">Regional Geography Note:</strong> Built on
              procedural 3D rural Ontario terrain modeled around Central Hastings & Shannonville. No
              paid Google Maps runtime API key required; map coordinates correlate directly to 3D
              world coordinates.
            </p>
          </div>

          {/* Points of Interest Directory */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
            {POIS.map((poi) => (
              <div
                key={poi.id}
                className="p-2.5 bg-stone-800/40 border border-stone-800 rounded-lg flex items-center gap-2.5"
              >
                <div className={`w-2.5 h-2.5 rounded-full ${poi.color} shrink-0`} />
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-stone-200 truncate">{poi.name}</h4>
                  <p className="text-[11px] text-stone-400 truncate">{poi.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
