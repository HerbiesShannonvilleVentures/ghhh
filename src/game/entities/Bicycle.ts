/**
 * Procedural Cruiser Bicycle Entity (3-12 Part THREE.Group)
 * Built with physical PBR materials, rotating wheels, and grounded bottom pivot.
 */
import * as THREE from 'three';

export class BicycleEntity {
  public group: THREE.Group;
  public frontWheel: THREE.Group;
  public rearWheel: THREE.Group;
  public crankset: THREE.Group;
  public handlebars: THREE.Group;
  public contactShadow: THREE.Mesh;

  private wheelRadius = 0.35;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'Bicycle';

    // Materials
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x1d5c7c, // Vintage teal blue
      roughness: 0.35,
      metalness: 0.7,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      roughness: 0.15,
      metalness: 0.9,
    });

    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.85,
      metalness: 0.05,
    });

    const leatherMat = new THREE.MeshStandardMaterial({
      color: 0x4a2c16,
      roughness: 0.65,
      metalness: 0.1,
    });

    // 1. Rear Wheel
    this.rearWheel = this.createWheel(tireMat, chromeMat);
    this.rearWheel.position.set(0, this.wheelRadius, -0.55);
    this.group.add(this.rearWheel);

    // 2. Front Wheel
    this.frontWheel = this.createWheel(tireMat, chromeMat);
    this.frontWheel.position.set(0, this.wheelRadius, 0.65);
    this.group.add(this.frontWheel);

    // 3. Diamond Frame Tubes
    const frameGroup = new THREE.Group();

    // Bottom bracket to rear hub (chainstay)
    const chainstayGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.58, 8);
    const leftChainstay = new THREE.Mesh(chainstayGeo, frameMat);
    leftChainstay.rotation.x = Math.PI / 2 + 0.1;
    leftChainstay.position.set(0.06, this.wheelRadius, -0.28);
    frameGroup.add(leftChainstay);

    const rightChainstay = leftChainstay.clone();
    rightChainstay.position.x = -0.06;
    frameGroup.add(rightChainstay);

    // Seat tube
    const seatTubeGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.55, 8);
    const seatTube = new THREE.Mesh(seatTubeGeo, frameMat);
    seatTube.rotation.x = -0.32;
    seatTube.position.set(0, 0.52, -0.05);
    frameGroup.add(seatTube);

    // Down tube
    const downTubeGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.68, 8);
    const downTube = new THREE.Mesh(downTubeGeo, frameMat);
    downTube.rotation.x = 0.85;
    downTube.position.set(0, 0.48, 0.22);
    frameGroup.add(downTube);

    // Top tube (crossbar)
    const topTubeGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.62, 8);
    const topTube = new THREE.Mesh(topTubeGeo, frameMat);
    topTube.rotation.x = Math.PI / 2 + 0.05;
    topTube.position.set(0, 0.76, 0.22);
    frameGroup.add(topTube);

    // Head tube & fork
    const forkGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.48, 8);
    const leftFork = new THREE.Mesh(forkGeo, chromeMat);
    leftFork.rotation.x = 0.25;
    leftFork.position.set(0.05, 0.52, 0.6);
    frameGroup.add(leftFork);

    const rightFork = leftFork.clone();
    rightFork.position.x = -0.05;
    frameGroup.add(rightFork);

    this.group.add(frameGroup);

    // 4. Handlebars & Grips
    this.handlebars = new THREE.Group();
    this.handlebars.position.set(0, 0.88, 0.55);

    const barStem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.16, 8), chromeMat);
    this.handlebars.add(barStem);

    const barCross = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.52, 8), chromeMat);
    barCross.rotation.z = Math.PI / 2;
    barCross.position.y = 0.08;
    this.handlebars.add(barCross);

    // Rubber grips
    const gripGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.1, 8);
    const leftGrip = new THREE.Mesh(gripGeo, tireMat);
    leftGrip.rotation.z = Math.PI / 2;
    leftGrip.position.set(0.22, 0.08, 0);
    this.handlebars.add(leftGrip);

    const rightGrip = leftGrip.clone();
    rightGrip.position.x = -0.22;
    this.handlebars.add(rightGrip);

    // Bell accent
    const bell = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), chromeMat);
    bell.position.set(0.14, 0.11, 0.02);
    this.handlebars.add(bell);

    // Front wire basket
    const basketGeo = new THREE.BoxGeometry(0.28, 0.16, 0.2);
    const wireMat = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      wireframe: true,
      roughness: 0.4,
    });
    const basket = new THREE.Mesh(basketGeo, wireMat);
    basket.position.set(0, 0.04, 0.14);
    this.handlebars.add(basket);

    this.group.add(this.handlebars);

    // 5. Saddle
    const saddleGeo = new THREE.ConeGeometry(0.1, 0.24, 4);
    const saddle = new THREE.Mesh(saddleGeo, leatherMat);
    saddle.rotation.x = Math.PI / 2 + 0.1;
    saddle.rotation.y = Math.PI;
    saddle.scale.set(0.9, 0.5, 1.4);
    saddle.position.set(0, 0.82, -0.12);
    this.group.add(saddle);

    // 6. Crankset & Pedals
    this.crankset = new THREE.Group();
    this.crankset.position.set(0, this.wheelRadius * 0.9, 0.02);
    const sprocket = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.01, 16), chromeMat);
    sprocket.rotation.z = Math.PI / 2;
    this.crankset.add(sprocket);

    const pedalArmGeo = new THREE.BoxGeometry(0.015, 0.12, 0.015);
    const leftArm = new THREE.Mesh(pedalArmGeo, chromeMat);
    leftArm.position.set(0.08, 0.05, 0);
    this.crankset.add(leftArm);

    const rightArm = new THREE.Mesh(pedalArmGeo, chromeMat);
    rightArm.position.set(-0.08, -0.05, 0);
    this.crankset.add(rightArm);
    this.group.add(this.crankset);

    // 7. Ground Contact Shadow
    const shadowGeo = new THREE.PlaneGeometry(0.5, 1.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    this.contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    this.contactShadow.rotation.x = -Math.PI / 2;
    this.contactShadow.position.y = 0.015;
    this.group.add(this.contactShadow);
  }

  private createWheel(tireMat: THREE.Material, rimMat: THREE.Material): THREE.Group {
    const wheel = new THREE.Group();

    // Outer rubber tire (torus)
    const tire = new THREE.Mesh(
      new THREE.TorusGeometry(this.wheelRadius, 0.03, 10, 24),
      tireMat
    );
    tire.rotation.y = Math.PI / 2;
    wheel.add(tire);

    // Chrome rim
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(this.wheelRadius - 0.02, 0.01, 8, 24),
      rimMat
    );
    rim.rotation.y = Math.PI / 2;
    wheel.add(rim);

    // Center hub
    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.08, 8),
      rimMat
    );
    hub.rotation.z = Math.PI / 2;
    wheel.add(hub);

    // Spokes
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI;
      const spoke = new THREE.Mesh(
        new THREE.CylinderGeometry(0.003, 0.003, (this.wheelRadius - 0.02) * 2, 4),
        rimMat
      );
      spoke.rotation.x = angle;
      wheel.add(spoke);
    }

    return wheel;
  }

  public updateAnimation(speed: number, dt: number, turnAngle: number): void {
    const rotationStep = (speed / this.wheelRadius) * dt;
    this.frontWheel.rotation.x += rotationStep;
    this.rearWheel.rotation.x += rotationStep;
    this.crankset.rotation.x += rotationStep * 0.7;

    // Steer handlebars smoothly with turn angle
    this.handlebars.rotation.y = THREE.MathUtils.lerp(
      this.handlebars.rotation.y,
      turnAngle * 0.6,
      Math.min(dt * 10, 1.0)
    );
  }
}
