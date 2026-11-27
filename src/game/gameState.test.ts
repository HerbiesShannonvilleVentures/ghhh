import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createDefaultProfile,
  openSeedPack,
  completeObjective,
} from './gameState';

test('createDefaultProfile initializes with $500 and starter items', () => {
  const profile = createDefaultProfile();
  assert.equal(profile.cash, 500);
  assert.equal(profile.currentVehicle, 'on_foot');
  assert.ok(profile.inventory.length >= 3);
  const starterPack = profile.inventory.find((i) => i.itemId === 'toronto_move_in_pack');
  assert.ok(starterPack);
  assert.equal(starterPack?.quantity, 3);
});

test('openSeedPack consumes one pack and grants seed items', () => {
  const profile = createDefaultProfile();
  const initialPacks = profile.inventory.find((i) => i.itemId === 'toronto_move_in_pack')?.quantity || 0;
  
  const { updatedProfile, awardedSeeds } = openSeedPack(profile, 'toronto_move_in_pack');
  
  const remainingPacks = updatedProfile.inventory.find((i) => i.itemId === 'toronto_move_in_pack')?.quantity || 0;
  assert.equal(remainingPacks, initialPacks - 1);
  assert.ok(awardedSeeds.length > 0, 'Should award seeds');
  
  const totalSeeds = updatedProfile.inventory.filter((i) => i.category === 'seeds');
  assert.ok(totalSeeds.length > 0, 'Seeds should be in inventory');
});

test('completeObjective grants cash reward once only', () => {
  const profile = createDefaultProfile();
  const initialCash = profile.cash;
  
  const res1 = completeObjective(profile, 'obj_inspect_starter_home');
  assert.equal(res1.rewardCash, 50);
  assert.equal(res1.updatedProfile.cash, initialCash + 50);
  assert.ok(res1.updatedProfile.completedObjectives.includes('obj_inspect_starter_home'));
  
  // Second completion should be ignored
  const res2 = completeObjective(res1.updatedProfile, 'obj_inspect_starter_home');
  assert.equal(res2.rewardCash, 0);
  assert.equal(res2.updatedProfile.cash, initialCash + 50);
});
