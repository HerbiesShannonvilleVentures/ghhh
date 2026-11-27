/**
 * InventoryModal - Player Backpack & Item Inspection
 */
import React, { useState } from 'react';
import { PlayerInventoryItem } from '../types/game';
import { Package, Sparkles, Shield, Wrench, Sprout, Bike, X } from 'lucide-react';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: PlayerInventoryItem[];
  onOpenSeedPack: (packItemId: string) => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  inventory,
  onOpenSeedPack,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inspectItem, setInspectItem] = useState<PlayerInventoryItem | null>(null);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'packs', label: 'Seed Packs' },
    { id: 'seeds', label: 'Seeds' },
    { id: 'tools', label: 'Tools' },
    { id: 'vehicle', label: 'Vehicles' },
  ];

  const filteredItems = inventory.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'rare':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'uncommon':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default:
        return 'bg-stone-500/20 text-stone-300 border-stone-500/40';
    }
  };

  const getItemIcon = (category: string) => {
    switch (category) {
      case 'packs':
        return <Package className="w-5 h-5 text-amber-400" />;
      case 'seeds':
        return <Sprout className="w-5 h-5 text-emerald-400" />;
      case 'tools':
        return <Wrench className="w-5 h-5 text-sky-400" />;
      case 'vehicle':
        return <Bike className="w-5 h-5 text-teal-400" />;
      default:
        return <Shield className="w-5 h-5 text-stone-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none select-none">
      <div className="bg-stone-900 border border-stone-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-850 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-950/60 border border-emerald-700/50 rounded-lg text-emerald-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-100">Player Storage & Backpack</h2>
              <p className="text-xs text-stone-400">
                Holding {inventory.reduce((acc, i) => acc + i.quantity, 0)} total units
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition"
            aria-label="Close inventory"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-6 py-2.5 bg-stone-900/90 border-b border-stone-800 flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-800/80 text-stone-400 hover:text-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Inventory Content Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setInspectItem(item)}
              className="p-3.5 bg-stone-800/60 hover:bg-stone-800 border border-stone-700/60 rounded-xl cursor-pointer transition flex items-start gap-3 group"
            >
              <div className="p-2.5 bg-stone-900/90 border border-stone-700 rounded-lg shrink-0 group-hover:border-emerald-600/50 transition">
                {getItemIcon(item.category)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h3 className="text-sm font-semibold text-stone-200 truncate">{item.name}</h3>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    x{item.quantity}
                  </span>
                </div>
                <p className="text-xs text-stone-400 line-clamp-2 mb-2 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border uppercase font-mono tracking-wider ${getRarityBadge(
                      item.rarity
                    )}`}
                  >
                    {item.rarity}
                  </span>
                  {item.category === 'packs' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenSeedPack(item.itemId);
                      }}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition shadow"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Open Pack
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="col-span-2 py-12 text-center text-stone-500 text-sm">
              No items in this category yet.
            </div>
          )}
        </div>

        {/* Inspect Modal Footer Details */}
        {inspectItem && (
          <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-stone-400">Selected Item</p>
              <p className="text-sm font-bold text-stone-200">{inspectItem.name}</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-stone-400">
                Value: <span className="text-emerald-400 font-bold">${inspectItem.value}</span>
              </span>
              <button
                onClick={() => setInspectItem(null)}
                className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-md transition"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
