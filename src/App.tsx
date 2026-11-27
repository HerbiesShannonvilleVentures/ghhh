/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { GameCanvas } from './game/GameCanvas';
import { HUD } from './components/HUD';
import { InventoryModal } from './components/InventoryModal';
import { WorldMapModal } from './components/WorldMapModal';
import { TutorialGuide } from './components/TutorialGuide';
import {
  loadSavedProfile,
  saveProfile,
  openSeedPack,
  completeObjective,
  INITIAL_OBJECTIVES,
} from './game/gameState';
import { PlayerProfile, WorldInteractable, Objective } from './types/game';

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile>(() => loadSavedProfile());
  const [objectives, setObjectives] = useState<Objective[]>(() => {
    const saved = loadSavedProfile();
    return INITIAL_OBJECTIVES.map((obj) => ({
      ...obj,
      completed: saved.completedObjectives.includes(obj.id),
    }));
  });

  const [telemetry, setTelemetry] = useState({
    posX: -13,
    posZ: -12,
    speedKmh: 0,
    headingDeg: 0,
    onBicycle: false,
  });

  const [nearInteractable, setNearInteractable] = useState<WorldInteractable | null>(null);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(() => {
    // If autostart URL param is present, skip story modal
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') return false;
      const dismissed = window.localStorage.getItem('herbies_story_dismissed');
      return dismissed !== 'true';
    }
    return false;
  });

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = useCallback((message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification((curr) => (curr === message ? null : curr));
    }, 4500);
  }, []);

  // Interaction dispatcher
  const handleInteractionTrigger = useCallback(
    (interactable: WorldInteractable) => {
      if (interactable.actionType === 'inspect_mailbox') {
        if (!profile.starterPacksClaimed) {
          const { updatedProfile, rewardCash } = completeObjective(profile, 'obj_claim_seeds');
          updatedProfile.starterPacksClaimed = true;
          saveProfile(updatedProfile);
          setProfile(updatedProfile);
          setObjectives((prev) =>
            prev.map((o) => (o.id === 'obj_claim_seeds' ? { ...o, completed: true } : o))
          );
          showNotification(
            `📫 Claimed 3 Starter Seed Packs from your mailbox! +$${rewardCash} Welcome Bonus!`
          );
          setIsInventoryOpen(true);
        } else {
          showNotification('📫 Mailbox checked: No new mail today. Check back tomorrow!');
        }
      } else if (interactable.actionType === 'starter_grow') {
        const { updatedProfile, rewardCash } = completeObjective(
          profile,
          'obj_inspect_starter_home'
        );
        setProfile(updatedProfile);
        setObjectives((prev) =>
          prev.map((o) => (o.id === 'obj_inspect_starter_home' ? { ...o, completed: true } : o))
        );
        showNotification(
          rewardCash > 0
            ? `🌱 Inspected Backyard Grow Beds! Soil is rich and primed for planting. +$${rewardCash}`
            : '🌱 Backyard Grow Beds: 3 outdoor elevated beds ready for seed germination.'
        );
      } else if (interactable.actionType === 'enter_home') {
        showNotification(
          '🏡 Starter Homestead: Modest 2-bedroom rural house on Old Hwy 2. Safe resting zone.'
        );
      } else if (interactable.actionType === 'read_sign') {
        const { updatedProfile, rewardCash } = completeObjective(
          profile,
          'obj_visit_shannonville'
        );
        setProfile(updatedProfile);
        setObjectives((prev) =>
          prev.map((o) => (o.id === 'obj_visit_shannonville' ? { ...o, completed: true } : o))
        );
        showNotification(
          rewardCash > 0
            ? `🪧 Shannonville Marker: Historic settlement on the Salmon River. +$${rewardCash} Exploration Bonus!`
            : '🪧 Shannonville Marker: Old Highway 2 • Belleville 15km West • Tyendinaga 4km East.'
        );
      }
    },
    [profile, showNotification]
  );

  const handleVehicleChange = useCallback(
    (onBicycle: boolean) => {
      setTelemetry((prev) => ({ ...prev, onBicycle }));
      setProfile((prev) => {
        const next = { ...prev, currentVehicle: onBicycle ? ('bicycle' as const) : ('on_foot' as const) };
        saveProfile(next);
        return next;
      });

      if (onBicycle) {
        const { updatedProfile, rewardCash } = completeObjective(profile, 'obj_mount_bicycle');
        setProfile(updatedProfile);
        setObjectives((prev) =>
          prev.map((o) => (o.id === 'obj_mount_bicycle' ? { ...o, completed: true } : o))
        );
        if (rewardCash > 0) {
          showNotification(`🚲 Mounted Rural Cruiser Bicycle! Speed boosted. +$${rewardCash}`);
        }
      }
    },
    [profile, showNotification]
  );

  const handleOpenSeedPack = useCallback(
    (packItemId: string) => {
      const { updatedProfile, awardedSeeds } = openSeedPack(profile, packItemId);
      setProfile(updatedProfile);
      const seedNames = awardedSeeds.map((s) => `${s.quantity}x ${s.name}`).join(', ');
      showNotification(`✨ Unboxed Seed Pack! Received: ${seedNames}`);
    },
    [profile, showNotification]
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-stone-950 font-sans select-none">
      {/* 3D WebGL Canvas Layer */}
      <GameCanvas
        onInteractionTrigger={handleInteractionTrigger}
        onNearInteractableChange={setNearInteractable}
        onVehicleChange={handleVehicleChange}
        onPlayerTelemetryChange={setTelemetry}
      />

      {/* Non-Occluding Heads Up Display (HUD) */}
      <HUD
        profile={profile}
        telemetry={telemetry}
        nearInteractable={nearInteractable}
        objectives={objectives}
        onOpenInventory={() => setIsInventoryOpen(true)}
        onOpenMap={() => setIsMapOpen(true)}
        onOpenStory={() => setIsStoryOpen(true)}
        onToggleBicycle={() => {
          // Send key B to window
          window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyB' }));
        }}
        notification={notification}
        onDismissNotification={() => setNotification(null)}
      />

      {/* Backpack & Item Storage Modal */}
      <InventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        inventory={profile.inventory}
        onOpenSeedPack={handleOpenSeedPack}
      />

      {/* Regional Central Hastings Navigator Modal */}
      <WorldMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        playerCoords={{ posX: telemetry.posX, posZ: telemetry.posZ }}
      />

      {/* Narrative Story Intro Modal */}
      <TutorialGuide
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
        onDismissForever={() => {
          setIsStoryOpen(false);
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('herbies_story_dismissed', 'true');
          }
        }}
      />
    </div>
  );
}
