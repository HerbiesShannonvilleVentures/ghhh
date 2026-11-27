/**
 * Procedural Third-Person Player Character Entity (3-12 Part THREE.Group)
 * Supports walk/sprint stride kinematics and seated bicycle posture.
 */
import * as THREE from 'three';

export class PlayerCharacter {
  public group: THREE.Group;
  public headGroup: THREE.Group;
  public torso: THREE.Mesh;
  public leftArm: THREE.Group;
  public rightArm: THREE.Group;
  public leftLeg: THREE.Group;
  public rightLeg: THREE.Group;
  public contactShadow: THREE.Mesh;

  private walkCycleTime = 0;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'PlayerCharacter';

    // Materials
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xdeb887,
      roughness: 0.6,
      metalness: 0.05,
    });

    const flannelMat = new THREE.MeshStandardMaterial({
      color: 0xb23b2d, // Red buffalo flannel
      roughness: 0.8,
      metalness: 0.05,
    });

    const denimMat = new THREE.MeshStandardMaterial({
      color: 0x243b55, // Blue jeans
      roughness: 0.85,
      metalness: 0.05,
    });

    const bootMat = new THREE.MeshStandardMaterial({
      color: 0x3d2714, // Work boots
      roughness: 0.7,
      metalness: 0.1,
    });

    const capMat = new THREE.MeshStandardMaterial({
      color: 0x2d4030, // Forest green trucker cap
      roughness: 0.75,
      metalness: 0.05,
    });

    // 1. Torso
    const torsoGeo = new THREE.BoxGeometry(0.48, 0.62, 0.28);
    this.torso = new THREE.Mesh(torsoGeo, flannelMat);
    this.torso.position.y = 1.1;
    this.group.add(this.torso);

    // 2. Head & Cap Group
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 1.55, 0);

    const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.28, 0.26), skinMat);
    this.headGroup.add(headMesh);

    // Cap crown & bill
    const capCrown = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.12, 0.28), capMat);
    capCrown.position.y = 0.12;
    this.headGroup.add(capCrown);

    const capBill = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.02, 0.16), capMat);
    capBill.position.set(0, 0.08, 0.18);
    this.headGroup.add(capBill);

    this.group.add(this.headGroup);

    // 3. Left Arm
    this.leftArm = new THREE.Group();
    this.leftArm.position.set(0.32, 1.35, 0);
    const leftArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.55, 0.14), flannelMat);
    leftArmMesh.position.y = -0.22;
    this.leftArm.add(leftArmMesh);
    const leftHand = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.1), skinMat);
    leftHand.position.y = -0.52;
    this.leftArm.add(leftHand);
    this.group.add(this.leftArm);

    // 4. Right Arm
    this.rightArm = new THREE.Group();
    this.rightArm.position.set(-0.32, 1.35, 0);
    const rightArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.55, 0.14), flannelMat);
    rightArmMesh.position.y = -0.22;
    this.rightArm.add(rightArmMesh);
    const rightHand = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.1), skinMat);
    rightHand.position.y = -0.52;
    this.rightArm.add(rightHand);
    this.group.add(this.rightArm);

    // 5. Left Leg
    this.leftLeg = new THREE.Group();
    this.leftLeg.position.set(0.14, 0.8, 0);
    const leftLegMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.65, 0.18), denimMat);
    leftLegMesh.position.y = -0.3;
    this.leftLeg.add(leftLegMesh);
    const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.26), bootMat);
    leftBoot.position.set(0, -0.65, 0.04);
    this.leftLeg.add(leftBoot);
    this.group.add(this.leftLeg);

    // 6. Right Leg
    this.rightLeg = new THREE.Group();
    this.rightLeg.position.set(-0.14, 0.8, 0);
    const rightLegMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.65, 0.18), denimMat);
    rightLegMesh.position.y = -0.3;
    this.rightLeg.add(rightLegMesh);
    const rightBoot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.26), bootMat);
    rightBoot.position.set(0, -0.65, 0.04);
    this.rightLeg.add(rightBoot);
    this.group.add(this.rightLeg);

    // 7. Ground Contact Shadow
    const shadowGeo = new THREE.CircleGeometry(0.45, 16);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    });
    this.contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    this.contactShadow.rotation.x = -Math.PI / 2;
    this.contactShadow.position.y = 0.015;
    this.group.add(this.contactShadow);
  }

  public updateAnimation(speed: number, onBicycle: boolean, isGrounded: boolean, dt: number): void {
    if (onBicycle) {
      // Seated riding posture
      this.group.position.y = 0.15; // slightly raised on bicycle saddle
      this.torso.rotation.x = 0.35; // leaning forward toward handlebars
      this.headGroup.rotation.x = -0.2; // looking up at the road ahead

      // Hands gripping handlebars
      this.leftArm.rotation.x = -0.7;
      this.leftArm.rotation.z = -0.2;
      this.rightArm.rotation.x = -0.7;
      this.rightArm.rotation.z = 0.2;

      // Pedaling legs
      if (speed > 0.1) {
        this.walkCycleTime += speed * dt * 5.0;
        const pedalAngle = this.walkCycleTime;
        this.leftLeg.rotation.x = 0.4 + Math.sin(pedalAngle) * 0.45;
        this.rightLeg.rotation.x = 0.4 + Math.sin(pedalAngle + Math.PI) * 0.45;
      } else {
        // One leg resting on pedal, one angled slightly
        this.leftLeg.rotation.x = 0.7;
        this.rightLeg.rotation.x = 0.2;
      }
      this.contactShadow.visible = false; // bicycle has its own shadow
    } else {
      // On-foot posture
      this.group.position.y = 0;
      this.torso.rotation.x = 0;
      this.headGroup.rotation.x = 0;
      this.contactShadow.visible = true;

      if (!isGrounded) {
        // Jumping pose
        this.leftLeg.rotation.x = -0.5;
        this.rightLeg.rotation.x = 0.3;
        this.leftArm.rotation.x = -0.8;
        this.rightArm.rotation.x = -0.8;
      } else if (speed > 0.2) {
        // Dynamic walking / running stride
        const strideFrequency = speed > 5 ? 12 : 7;
        this.walkCycleTime += dt * strideFrequency;
        const legSwing = Math.sin(this.walkCycleTime) * (speed > 5 ? 0.9 : 0.55);
        const armSwing = -legSwing * 0.75;

        this.leftLeg.rotation.x = legSwing;
        this.rightLeg.rotation.x = -legSwing;
        this.leftArm.rotation.x = armSwing;
        this.rightArm.rotation.x = -armSwing;
        this.torso.position.y = 1.1 + Math.abs(Math.sin(this.walkCycleTime * 2)) * 0.05;
      } else {
        // Idle breathing
        this.walkCycleTime += dt * 2.0;
        this.leftLeg.rotation.x = 0;
        this.rightLeg.rotation.x = 0;
        this.leftArm.rotation.x = Math.sin(this.walkCycleTime) * 0.04;
        this.rightArm.rotation.x = -Math.sin(this.walkCycleTime) * 0.04;
        this.torso.position.y = 1.1;
      }
    }
  }
}
