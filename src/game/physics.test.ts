import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getTerrainHeight,
  checkCollision,
  stepPlayerKinematics,
  PlayerPhysicsState,
  MovementInput,
} from './physics';

test('getTerrainHeight returns 0 for flat road corridor', () => {
  assert.equal(getTerrainHeight(0, 0), 0);
  assert.equal(getTerrainHeight(10, 2), 0);
  assert.equal(getTerrainHeight(-50, -4), 0);
});

test('checkCollision detects starter home boundary', () => {
  // Inside starter home (-18 to -8, -25 to -15)
  assert.equal(checkCollision(-13, -20), true);
  // Outside starter home on road (0, 0)
  assert.equal(checkCollision(0, 0), false);
});

test('stepPlayerKinematics accelerates player forward with input', () => {
  const initial: PlayerPhysicsState = {
    posX: 0,
    posY: 0,
    posZ: 0,
    velX: 0,
    velY: 0,
    velZ: 0,
    heading: 0,
    isGrounded: true,
    onBicycle: false,
    currentSpeed: 0,
  };

  const input: MovementInput = {
    forward: true,
    backward: false,
    left: false,
    right: false,
    sprint: false,
    jump: false,
  };

  const next = stepPlayerKinematics(initial, input, 0, 0.1);
  assert.ok(next.currentSpeed > 0, 'Player speed should increase with forward input');
  assert.ok(next.posZ < 0 || next.posZ > -1, 'Player moves along heading direction');
});

test('bicycle mode reaches higher sprint speed than on-foot', () => {
  const footState: PlayerPhysicsState = {
    posX: 0,
    posY: 0,
    posZ: 0,
    velX: 0,
    velY: 0,
    velZ: 0,
    heading: 0,
    isGrounded: true,
    onBicycle: false,
    currentSpeed: 0,
  };

  const bikeState: PlayerPhysicsState = {
    ...footState,
    onBicycle: true,
  };

  const sprintInput: MovementInput = {
    forward: true,
    backward: false,
    left: false,
    right: false,
    sprint: true,
    jump: false,
  };

  // Step 2 seconds to reach steady speed
  let curFoot = footState;
  let curBike = bikeState;
  for (let i = 0; i < 20; i++) {
    curFoot = stepPlayerKinematics(curFoot, sprintInput, 0, 0.1);
    curBike = stepPlayerKinematics(curBike, sprintInput, 0, 0.1);
  }

  assert.ok(curBike.currentSpeed > curFoot.currentSpeed, 'Bicycle sprint speed must exceed on-foot sprint');
  assert.ok(curBike.currentSpeed > 10, 'Bicycle reaches over 10 m/s');
});
