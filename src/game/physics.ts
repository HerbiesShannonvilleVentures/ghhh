/**
 * Pure Physics, Kinematics & Collision Logic
 * Decoupled from Three.js rendering for unit testing and deterministic simulation.
 */

export interface BoundingBox2D {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface MovementInput {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  sprint: boolean;
  jump: boolean;
}

export interface PlayerPhysicsState {
  posX: number;
  posY: number;
  posZ: number;
  velX: number;
  velY: number;
  velZ: number;
  heading: number; // in radians
  isGrounded: boolean;
  onBicycle: boolean;
  currentSpeed: number;
}

// Fixed world obstacles for collision testing
export const WORLD_OBSTACLES: BoundingBox2D[] = [
  // Starter Home main structure: x: -18 to -8, z: -25 to -15
  { minX: -19, maxX: -7, minZ: -26, maxZ: -14 },
  // Home Garage: x: -32 to -22, z: -24 to -16
  { minX: -33, maxX: -21, minZ: -25, maxZ: -15 },
  // Garden shed: x: -16 to -11, z: -38 to -33
  { minX: -17, maxX: -10, minZ: -39, maxZ: -32 },
];

/**
 * Procedural gentle rural Ontario terrain elevation
 */
export function getTerrainHeight(x: number, z: number): number {
  // Road corridor is flat
  if (Math.abs(z) < 5) return 0;
  // Gentle rolling hills with small variation
  const wave1 = Math.sin(x * 0.02) * Math.cos(z * 0.02) * 1.5;
  const wave2 = Math.sin(x * 0.05 + 1.2) * 0.5;
  return Math.max(-0.2, wave1 + wave2);
}

/**
 * Checks if a point collides with world obstacles
 */
export function checkCollision(x: number, z: number, playerRadius = 0.5): boolean {
  for (const obs of WORLD_OBSTACLES) {
    if (
      x + playerRadius > obs.minX &&
      x - playerRadius < obs.maxX &&
      z + playerRadius > obs.minZ &&
      z - playerRadius < obs.maxZ
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Step kinematics with delta time
 */
export function stepPlayerKinematics(
  state: PlayerPhysicsState,
  input: MovementInput,
  cameraAngleY: number,
  dt: number
): PlayerPhysicsState {
  const next = { ...state };
  const safeDt = Math.min(dt, 0.1);

  // Speed constants
  const walkSpeed = 4.0;
  const sprintSpeed = 7.5;
  const bikeBaseSpeed = 8.5;
  const bikeSprintSpeed = 14.5;
  const gravity = -18.0;

  let targetSpeed = 0;
  let moveDirZ = 0;
  let moveDirX = 0;

  if (input.forward) moveDirZ -= 1;
  if (input.backward) moveDirZ += 1;
  if (input.left) moveDirX -= 1;
  if (input.right) moveDirX += 1;

  const hasInput = moveDirX !== 0 || moveDirZ !== 0;

  if (hasInput) {
    const inputAngle = Math.atan2(moveDirX, moveDirZ);
    next.heading = cameraAngleY + inputAngle;

    if (next.onBicycle) {
      targetSpeed = input.sprint ? bikeSprintSpeed : bikeBaseSpeed;
    } else {
      targetSpeed = input.sprint ? sprintSpeed : walkSpeed;
    }
  }

  // Smooth acceleration & braking
  const accelRate = next.onBicycle ? 6.0 : 12.0;
  const dragRate = next.onBicycle ? 3.0 : 10.0;
  const rate = hasInput ? accelRate : dragRate;

  next.currentSpeed += (targetSpeed - next.currentSpeed) * Math.min(rate * safeDt, 1.0);
  if (Math.abs(next.currentSpeed) < 0.01) next.currentSpeed = 0;

  // Compute horizontal displacement
  const stepDistance = next.currentSpeed * safeDt;
  const deltaX = Math.sin(next.heading) * stepDistance;
  const deltaZ = Math.cos(next.heading) * stepDistance;

  // Collision with obstacle sliding
  const targetX = next.posX + deltaX;
  const targetZ = next.posZ + deltaZ;

  if (!checkCollision(targetX, targetZ)) {
    next.posX = targetX;
    next.posZ = targetZ;
  } else {
    // Try X alone
    if (!checkCollision(targetX, next.posZ)) {
      next.posX = targetX;
    }
    // Try Z alone
    if (!checkCollision(next.posX, targetZ)) {
      next.posZ = targetZ;
    }
  }

  // Vertical physics & terrain snap
  const groundY = getTerrainHeight(next.posX, next.posZ);

  if (input.jump && next.isGrounded && !next.onBicycle) {
    next.velY = 6.5;
    next.isGrounded = false;
  }

  next.velY += gravity * safeDt;
  next.posY += next.velY * safeDt;

  if (next.posY <= groundY) {
    next.posY = groundY;
    next.velY = 0;
    next.isGrounded = true;
  } else {
    next.isGrounded = false;
  }

  return next;
}
