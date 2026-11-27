/**
 * GameCanvas - Three.js 3D Viewport
 * Strictly follows Three.js Skill & Ultra Mode architecture:
 * - Software-WebGL guard with afterDraw pacing
 * - ACESFilmic tone mapping & SRGBColorSpace
 * - Zero GC in render loop (pre-allocated Vector3/Quat)
 * - Isolated ref container preventing React re-render unmounts
 * - Throttled HUD state updates (<= 10Hz)
 */
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PlayerCharacter } from './entities/PlayerCharacter';
import { BicycleEntity } from './entities/Bicycle';
import { ShannonvilleWorld } from './world/ShannonvilleWorld';
import { ThirdPersonCamera } from './camera/ThirdPersonCamera';
import { InteractionSystem } from './systems/InteractionSystem';
import {
  stepPlayerKinematics,
  PlayerPhysicsState,
  MovementInput,
} from './physics';
import { WorldInteractable } from '../types/game';

interface GameCanvasProps {
  onInteractionTrigger: (interactable: WorldInteractable) => void;
  onNearInteractableChange: (interactable: WorldInteractable | null) => void;
  onVehicleChange: (onBicycle: boolean) => void;
  onPlayerTelemetryChange: (telemetry: {
    posX: number;
    posZ: number;
    speedKmh: number;
    headingDeg: number;
    onBicycle: boolean;
  }) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  onInteractionTrigger,
  onNearInteractableChange,
  onVehicleChange,
  onPlayerTelemetryChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Keep latest callbacks in refs to avoid restarting the Three.js loop
  const callbacksRef = useRef({
    onInteractionTrigger,
    onNearInteractableChange,
    onVehicleChange,
    onPlayerTelemetryChange,
  });
  callbacksRef.current = {
    onInteractionTrigger,
    onNearInteractableChange,
    onVehicleChange,
    onPlayerTelemetryChange,
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect Software-WebGL (for headless test runner & low-spec browsers)
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Initialize Three.js Scene & Renderer
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Build Shannonville World
    const world = new ShannonvilleWorld(scene);
    const interactionSystem = new InteractionSystem(world.interactables);

    // 4. Build Player and Bicycle
    const playerActor = new PlayerCharacter();
    scene.add(playerActor.group);

    const bicycle = new BicycleEntity();
    scene.add(bicycle.group);

    // Park bicycle initially at homestead driveway
    bicycle.group.position.copy(world.bicycleStandPos);

    // 5. Build Camera
    const cameraController = new ThirdPersonCamera(
      container.clientWidth / container.clientHeight
    );

    // 6. Physics & Input State
    // Spawn player in front of starter house facing the highway
    let physicsState: PlayerPhysicsState = {
      posX: -13,
      posY: 0,
      posZ: -12,
      velX: 0,
      velY: 0,
      velZ: 0,
      heading: 0, // facing south toward Old Highway 2
      isGrounded: true,
      onBicycle: false,
      currentSpeed: 0,
    };

    const keys: MovementInput = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      sprint: false,
      jump: false,
    };

    let activeInteractable: WorldInteractable | null = null;
    let isMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let lastHudUpdate = 0;

    // 7. Input Event Listeners
    const onKeyDown = (e: KeyboardEvent) => {
      // Avoid capturing input if user is in an input field
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.right = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.sprint = true;
          break;
        case 'Space':
          keys.jump = true;
          e.preventDefault();
          break;
        case 'KeyE':
          // Trigger nearest interaction
          if (activeInteractable) {
            if (activeInteractable.actionType === 'mount_bike') {
              toggleBicycle();
            } else {
              callbacksRef.current.onInteractionTrigger(activeInteractable);
            }
          }
          break;
        case 'KeyB':
          // Quick toggle bicycle if near or already mounted
          toggleBicycle();
          break;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.right = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.sprint = false;
          break;
        case 'Space':
          keys.jump = false;
          break;
      }
    };

    const toggleBicycle = () => {
      if (physicsState.onBicycle) {
        // Dismount: drop bicycle right here
        physicsState.onBicycle = false;
        bicycle.group.position.set(physicsState.posX, physicsState.posY, physicsState.posZ);
        bicycle.group.rotation.y = physicsState.heading;
        bicycle.group.visible = true;
        callbacksRef.current.onVehicleChange(false);
      } else {
        // Mount: check distance to bicycle
        const distToBike = Math.hypot(
          physicsState.posX - bicycle.group.position.x,
          physicsState.posZ - bicycle.group.position.z
        );
        if (distToBike < 3.5) {
          physicsState.onBicycle = true;
          callbacksRef.current.onVehicleChange(true);
        }
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      cameraController.onMouseMove(deltaX, deltaY);
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onWheel = (e: WheelEvent) => {
      cameraController.onZoom(e.deltaY > 0 ? 1 : -1);
    };

    // Touch support for mobile devices
    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - touchStartX;
        const deltaY = e.touches[0].clientY - touchStartY;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        cameraController.onMouseMove(deltaX, deltaY, 0.005);
      }
    };

    const onResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      cameraController.camera.aspect = width / height;
      cameraController.camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onResize);
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: true });
    renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: true });

    // 8. Main Game Loop with Software-WebGL pacing
    const clock = new THREE.Clock();
    let frameId = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 60);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const _playerVec = new THREE.Vector3();

    function tick() {
      const dt = Math.min(clock.getDelta(), 0.1);

      // Step physics kinematics
      physicsState = stepPlayerKinematics(
        physicsState,
        keys,
        cameraController.yaw,
        dt
      );

      // Update 3D Actor position & orientation
      _playerVec.set(physicsState.posX, physicsState.posY, physicsState.posZ);
      playerActor.group.position.copy(_playerVec);
      playerActor.group.rotation.y = physicsState.heading;

      if (physicsState.onBicycle) {
        // Lock bicycle to player position and heading
        bicycle.group.position.copy(_playerVec);
        bicycle.group.rotation.y = physicsState.heading;
        bicycle.group.visible = true;

        // Animate wheels & handlebars
        const turnAngle = (keys.left ? 0.35 : 0) - (keys.right ? 0.35 : 0);
        bicycle.updateAnimation(physicsState.currentSpeed, dt, turnAngle);
      }

      // Animate player walking / pedaling
      playerActor.updateAnimation(
        physicsState.currentSpeed,
        physicsState.onBicycle,
        physicsState.isGrounded,
        dt
      );

      // Update Third-Person Camera with wall avoidance
      cameraController.update(_playerVec, dt);

      // Check proximity interactables
      let nearResult = interactionSystem.getNearestInteractable(
        physicsState.posX,
        physicsState.posY,
        physicsState.posZ
      );

      // If already on bicycle, do not prompt to mount bicycle
      if (physicsState.onBicycle && nearResult?.item.actionType === 'mount_bike') {
        nearResult = null;
      }

      const nextInteractable = nearResult ? nearResult.item : null;
      if (nextInteractable?.id !== activeInteractable?.id) {
        activeInteractable = nextInteractable;
        callbacksRef.current.onNearInteractableChange(activeInteractable);
      }

      // Throttle HUD telemetry updates to 10Hz
      const now = performance.now();
      if (now - lastHudUpdate > 100) {
        lastHudUpdate = now;
        callbacksRef.current.onPlayerTelemetryChange({
          posX: Math.round(physicsState.posX * 10) / 10,
          posZ: Math.round(physicsState.posZ * 10) / 10,
          speedKmh: Math.round(physicsState.currentSpeed * 3.6),
          headingDeg: Math.round(((physicsState.heading * 180) / Math.PI + 360) % 360),
          onBicycle: physicsState.onBicycle,
        });
      }

      // Render Scene
      renderer.render(scene, cameraController.camera);

      // Schedule next frame
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    // 9. Cleanup on Unmount
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.domElement.removeEventListener('touchstart', onTouchStart);
      renderer.domElement.removeEventListener('touchmove', onTouchMove);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
      data-testid="three-canvas-container"
    />
  );
};
