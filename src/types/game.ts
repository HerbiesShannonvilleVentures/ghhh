/**
 * Herbie's Shannonville Ventures - Core Game Types
 */

export type VehicleType = 'on_foot' | 'bicycle' | 'car' | 'truck';

export interface PlayerInventoryItem {
  id: string;
  itemId: string;
  name: string;
  description: string;
  category: 'seeds' | 'packs' | 'tools' | 'consumable' | 'vehicle' | 'misc';
  quantity: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  value: number;
  metadata?: Record<string, unknown>;
}

export interface PlayerProfile {
  id: string;
  displayName: string;
  cash: number;
  bankBalance: number;
  reputation: number;
  level: number;
  currentVehicle: VehicleType;
  inventory: PlayerInventoryItem[];
  starterPacksClaimed: boolean;
  tutorialStep: number;
  completedObjectives: string[];
  currentLocationName: string;
  stats: {
    distanceTraveledMeters: number;
    timePlayedSeconds: number;
    seedsPlanted: number;
    harvestsCompleted: number;
    npcSalesTotal: number;
  };
  settings: {
    graphicsQuality: 'high' | 'medium' | 'low';
    cameraSensitivity: number;
    soundEnabled: boolean;
  };
}

export interface WorldInteractable {
  id: string;
  label: string;
  subtext?: string;
  position: [number, number, number];
  radius: number;
  icon?: string;
  actionType: 'mount_bike' | 'inspect_mailbox' | 'starter_grow' | 'enter_home' | 'read_sign' | 'store_oasis';
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  rewardCash?: number;
}
