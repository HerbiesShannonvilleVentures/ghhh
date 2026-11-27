/**
 * Central Game State & Persistence Manager
 * Handles player inventory, cash transactions, objectives, and save/load.
 */

import { PlayerProfile, PlayerInventoryItem, Objective } from '../types/game';
import { STARTER_ITEMS, STARTER_SEED_STRAINS } from './items';

const STORAGE_KEY = 'herbies_shannonville_save_v1';

export const INITIAL_OBJECTIVES: Objective[] = [
  {
    id: 'obj_inspect_starter_home',
    title: 'Explore Your Starter Property',
    description: 'Inspect your new rural property and mailbox on Old Highway 2.',
    completed: false,
    rewardCash: 50,
  },
  {
    id: 'obj_mount_bicycle',
    title: 'Test Your Rural Cruiser Bike',
    description: 'Mount your bicycle by pressing [E] near the front driveway.',
    completed: false,
    rewardCash: 50,
  },
  {
    id: 'obj_claim_seeds',
    title: 'Open Toronto Move-In Starter Pack',
    description: 'Inspect your mailbox to claim and unbox your 3 starter seed packs.',
    completed: false,
    rewardCash: 100,
  },
  {
    id: 'obj_visit_shannonville',
    title: 'Ride to Shannonville Crossroads',
    description: 'Follow the paved road west toward the historic crossroads and trading post.',
    completed: false,
    rewardCash: 150,
  },
];

export function createDefaultProfile(): PlayerProfile {
  return {
    id: 'demo_player_' + Math.random().toString(36).substring(2, 9),
    displayName: 'Herbie Settler',
    cash: 500,
    bankBalance: 0,
    reputation: 10,
    level: 1,
    currentVehicle: 'on_foot',
    inventory: [...STARTER_ITEMS],
    starterPacksClaimed: false,
    tutorialStep: 1,
    completedObjectives: [],
    currentLocationName: 'Old Highway 2 - Starter Homestead',
    stats: {
      distanceTraveledMeters: 0,
      timePlayedSeconds: 0,
      seedsPlanted: 0,
      harvestsCompleted: 0,
      npcSalesTotal: 0,
    },
    settings: {
      graphicsQuality: 'high',
      cameraSensitivity: 1.0,
      soundEnabled: true,
    },
  };
}

export function loadSavedProfile(): PlayerProfile {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = window.localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    }
  } catch (e) {
    console.warn('Failed to load profile from localStorage:', e);
  }
  return createDefaultProfile();
}

export function saveProfile(profile: PlayerProfile): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }
  } catch (e) {
    console.warn('Failed to save profile to localStorage:', e);
  }
}

/**
 * Open a starter pack and add seeds to inventory
 */
export function openSeedPack(
  profile: PlayerProfile,
  packItemId = 'toronto_move_in_pack'
): { updatedProfile: PlayerProfile; awardedSeeds: PlayerInventoryItem[] } {
  const packIndex = profile.inventory.findIndex(
    (item) => item.itemId === packItemId && item.quantity > 0
  );

  if (packIndex === -1) {
    return { updatedProfile: profile, awardedSeeds: [] };
  }

  const updatedInventory = [...profile.inventory];
  const pack = { ...updatedInventory[packIndex] };

  if (pack.quantity <= 1) {
    updatedInventory.splice(packIndex, 1);
  } else {
    pack.quantity -= 1;
    updatedInventory[packIndex] = pack;
  }

  // Grant 3 random/balanced seeds from starter strains
  const awardedSeeds: PlayerInventoryItem[] = STARTER_SEED_STRAINS.map((strain, idx) => ({
    id: `seed_${Date.now()}_${idx}`,
    itemId: strain.itemId,
    name: strain.name,
    description: strain.description,
    category: 'seeds',
    quantity: Math.floor(Math.random() * 2) + 2, // 2-3 seeds per strain
    rarity: strain.rarity,
    value: strain.value,
  }));

  for (const seed of awardedSeeds) {
    const existing = updatedInventory.find((i) => i.itemId === seed.itemId);
    if (existing) {
      existing.quantity += seed.quantity;
    } else {
      updatedInventory.push({ ...seed });
    }
  }

  const updatedProfile: PlayerProfile = {
    ...profile,
    inventory: updatedInventory,
  };

  saveProfile(updatedProfile);
  return { updatedProfile, awardedSeeds };
}

/**
 * Mark an objective completed and reward player
 */
export function completeObjective(
  profile: PlayerProfile,
  objectiveId: string
): { updatedProfile: PlayerProfile; rewardCash: number } {
  if (profile.completedObjectives.includes(objectiveId)) {
    return { updatedProfile: profile, rewardCash: 0 };
  }

  const obj = INITIAL_OBJECTIVES.find((o) => o.id === objectiveId);
  const reward = obj?.rewardCash || 0;

  const updatedProfile: PlayerProfile = {
    ...profile,
    cash: profile.cash + reward,
    reputation: profile.reputation + 5,
    completedObjectives: [...profile.completedObjectives, objectiveId],
  };

  saveProfile(updatedProfile);
  return { updatedProfile, rewardCash: reward };
}
