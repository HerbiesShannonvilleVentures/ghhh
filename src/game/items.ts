/**
 * Central Item Registry & Starter Items
 */
import { PlayerInventoryItem } from '../types/game';

export const STARTER_ITEMS: PlayerInventoryItem[] = [
  {
    id: 'starter_pack_1',
    itemId: 'toronto_move_in_pack',
    name: 'Toronto Move-In Starter Pack',
    description: 'Welcome to Central Hastings! Contains 3 hardy rural starter seed strains and basic soil nutrients.',
    category: 'packs',
    quantity: 3,
    rarity: 'uncommon',
    value: 75,
  },
  {
    id: 'bicycle_vintage',
    itemId: 'vintage_rural_bicycle',
    name: 'Rural Cruiser Bicycle',
    description: 'A trusty single-speed bicycle with front carrier rack. Free to ride, zero fuel required.',
    category: 'vehicle',
    quantity: 1,
    rarity: 'common',
    value: 120,
  },
  {
    id: 'watering_can_basic',
    itemId: 'metal_watering_can',
    name: 'Galvanized Watering Can',
    description: 'Reliable 10-liter watering can for caring for backyard grow beds.',
    category: 'tools',
    quantity: 1,
    rarity: 'common',
    value: 25,
  },
];

export const STARTER_SEED_STRAINS = [
  {
    itemId: 'seed_hastings_haze',
    name: 'Hastings Haze Seeds',
    description: 'Hardy outdoor cross that thrives in temperate eastern Ontario autumns.',
    rarity: 'uncommon' as const,
    thcRating: '18%',
    growthSpeed: 1.2,
    yieldEstimate: 45,
    value: 30,
  },
  {
    itemId: 'seed_shannonville_skunk',
    name: 'Shannonville Skunk Seeds',
    description: 'Robust, aromatic heritage strain popular across Central Hastings reserves and farms.',
    rarity: 'common' as const,
    thcRating: '16%',
    growthSpeed: 1.0,
    yieldEstimate: 50,
    value: 20,
  },
  {
    itemId: 'seed_mohawk_gold',
    name: 'Tyendinaga Gold Seeds',
    description: 'Prized regional heritage strain with rich terpenes and dense resilient foliage.',
    rarity: 'rare' as const,
    thcRating: '22%',
    growthSpeed: 0.9,
    yieldEstimate: 60,
    value: 65,
  },
];
