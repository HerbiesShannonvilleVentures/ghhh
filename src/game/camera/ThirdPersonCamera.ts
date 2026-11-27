/**
 * Third-Person Camera Controller
 * Features smooth exponential damping, mouse orbit, zoom, and obstacle wall pull-in.
 */
import * as THREE from 'three';
import { checkCollision } from '../physics';

export class ThirdPersonCamera {
  public camera: THREE.PerspectiveCamera;
  public idealDistance = 4.5;
  public currentDistance = 4.5;
  public minDistance = 1.5;
  public maxDistance = 9.0;

  public yaw = 0; // horizontal angle
  public pitch = 0.25; // vertical angle (radians)
  public minPitch = -0.1;
  public maxPitch = 1.1;

  public targetPosition = new THREE.Vector3();
  public currentCameraPos = new THREE.Vector3();
  public currentLookTarget = new THREE.Vector3();

  constructor(aspect: number) {
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 500);
    this.camera.position.set(0, 3, 6);
  }

  public update(playerPos: THREE.Vector3, dt: number): void {
    // Look target slightly above player chest
    const desiredLookTarget = new THREE.Vector3(playerPos.x, playerPos.y + 1.3, playerPos.z);
    this.currentLookTarget.lerp(desiredLookTarget, Math.min(dt * 15, 1.0));

    // Desired camera offset based on spherical coordinates
    const horizontalDist = this.idealDistance * Math.cos(this.pitch);
    const verticalDist = this.idealDistance * Math.sin(this.pitch);

    let desiredX = this.currentLookTarget.x - Math.sin(this.yaw) * horizontalDist;
    let desiredZ = this.currentLookTarget.z - Math.cos(this.yaw) * horizontalDist;
    let desiredY = this.currentLookTarget.y + verticalDist;

    // Wall collision prevention: test ray steps from target toward desired position
    const steps = 8;
    let safeDistanceRatio = 1.0;
    for (let i = 1; i <= steps; i++) {
      const frac = i / steps;
      const testX = THREE.MathUtils.lerp(this.currentLookTarget.x, desiredX, frac);
      const testZ = THREE.MathUtils.lerp(this.currentLookTarget.z, desiredZ, frac);
      if (checkCollision(testX, testZ, 0.4)) {
        safeDistanceRatio = Math.max(0.25, (i - 1) / steps);
        break;
      }
    }

    if (safeDistanceRatio < 1.0) {
      desiredX = THREE.MathUtils.lerp(this.currentLookTarget.x, desiredX, safeDistanceRatio);
      desiredZ = THREE.MathUtils.lerp(this.currentLookTarget.z, desiredZ, safeDistanceRatio);
      desiredY = THREE.MathUtils.lerp(this.currentLookTarget.y, desiredY, safeDistanceRatio) + 0.3;
    }

    const targetCamVec = new THREE.Vector3(desiredX, desiredY, desiredZ);
    // Smooth exponential damping
    this.currentCameraPos.lerp(targetCamVec, Math.min(dt * 10, 1.0));

    this.camera.position.copy(this.currentCameraPos);
    this.camera.lookAt(this.currentLookTarget);
  }

  public onMouseMove(deltaX: number, deltaY: number, sensitivity = 0.003): void {
    this.yaw -= deltaX * sensitivity;
    this.pitch += deltaY * sensitivity;
    this.pitch = Math.max(this.minPitch, Math.min(this.maxPitch, this.pitch));
  }

  public onZoom(deltaZoom: number): void {
    this.idealDistance = Math.max(
      this.minDistance,
      Math.min(this.maxDistance, this.idealDistance + deltaZoom * 0.5)
    );
  }
}
