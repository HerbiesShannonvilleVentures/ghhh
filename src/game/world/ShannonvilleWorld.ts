/**
 * Shannonville & Central Hastings 3D World Generator
 * Features rustic starter homestead, Old Highway 2 corridor, cedar split-rail fences,
 * composite pine/maple trees, backyard grow beds, utility poles, and road signs.
 */
import * as THREE from 'three';
import {
  createGrassTexture,
  createRoadTexture,
  createWoodPlankTexture,
  createSignTexture,
  createMailboxTexture,
} from './proceduralTextures';
import { WorldInteractable } from '../../types/game';

export class ShannonvilleWorld {
  public scene: THREE.Scene;
  public interactables: WorldInteractable[] = [];
  public bicycleStandPos = new THREE.Vector3(-6, 0, -12);

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.buildLighting();
    this.buildTerrainAndRoads();
    this.buildStarterHomestead();
    this.buildBackyardGrowPlot();
    this.buildRoadSignageAndInfrastructure();
    this.buildFoliageAndPerimeter();
    this.setupInteractables();
  }

  private buildLighting(): void {
    // Sky and fog
    const skyColor = 0xb4d7ec;
    this.scene.background = new THREE.Color(skyColor);
    this.scene.fog = new THREE.FogExp2(skyColor, 0.0075);

    // Warm Sun Key Light
    const sunLight = new THREE.DirectionalLight(0xfff6e5, 1.8);
    sunLight.position.set(45, 60, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 160;
    sunLight.shadow.camera.left = -45;
    sunLight.shadow.camera.right = 45;
    sunLight.shadow.camera.top = 45;
    sunLight.shadow.camera.bottom = -45;
    sunLight.shadow.bias = -0.0005;
    sunLight.shadow.normalBias = 0.02;
    this.scene.add(sunLight);

    // Cool Sky/Ground Hemisphere Fill
    const hemiLight = new THREE.HemisphereLight(0xbfd8eb, 0x475f32, 0.75);
    this.scene.add(hemiLight);

    // Subtle ambient
    const ambient = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(ambient);
  }

  private buildTerrainAndRoads(): void {
    // 1. Broad rolling terrain
    const grassTex = createGrassTexture();
    const terrainGeo = new THREE.PlaneGeometry(320, 320, 32, 32);
    const terrainMat = new THREE.MeshStandardMaterial({
      map: grassTex,
      roughness: 0.9,
      metalness: 0.05,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -0.05;
    terrain.receiveShadow = true;
    this.scene.add(terrain);

    // 2. Old Highway 2 Corridor (East-West main road)
    const roadTex = createRoadTexture();
    const roadGeo = new THREE.PlaneGeometry(12, 300);
    const roadMat = new THREE.MeshStandardMaterial({
      map: roadTex,
      roughness: 0.8,
      metalness: 0.1,
    });
    const mainRoad = new THREE.Mesh(roadGeo, roadMat);
    mainRoad.rotation.x = -Math.PI / 2;
    mainRoad.rotation.z = Math.PI / 2; // East-West along X axis
    mainRoad.position.set(0, 0.02, 0); // slightly above ground to prevent Z-fighting
    mainRoad.receiveShadow = true;
    this.scene.add(mainRoad);

    // Gravel shoulders along road
    const shoulderMat = new THREE.MeshStandardMaterial({
      color: 0x827768,
      roughness: 0.95,
      metalness: 0.05,
    });
    const northShoulder = new THREE.Mesh(new THREE.PlaneGeometry(2, 300), shoulderMat);
    northShoulder.rotation.x = -Math.PI / 2;
    northShoulder.rotation.z = Math.PI / 2;
    northShoulder.position.set(0, 0.015, -7);
    this.scene.add(northShoulder);

    const southShoulder = northShoulder.clone();
    southShoulder.position.z = 7;
    this.scene.add(southShoulder);

    // 3. Shannonville Road Crossroad (North-South at x = -60)
    const crossroad = new THREE.Mesh(new THREE.PlaneGeometry(10, 160), roadMat);
    crossroad.rotation.x = -Math.PI / 2;
    crossroad.position.set(-60, 0.025, 0);
    this.scene.add(crossroad);

    // 4. Gravel Driveway into Starter Homestead (leads north from road to house)
    const drivewayMat = new THREE.MeshStandardMaterial({
      color: 0x6e6559,
      roughness: 0.95,
    });
    const driveway = new THREE.Mesh(new THREE.PlaneGeometry(6, 22), drivewayMat);
    driveway.rotation.x = -Math.PI / 2;
    driveway.position.set(-8, 0.018, -14);
    driveway.receiveShadow = true;
    this.scene.add(driveway);
  }

  private buildStarterHomestead(): void {
    const woodTex = createWoodPlankTexture();

    const foundationMat = new THREE.MeshStandardMaterial({
      color: 0x4a4d52, // Fieldstone gray
      roughness: 0.9,
    });
    const wallMat = new THREE.MeshStandardMaterial({
      map: woodTex,
      roughness: 0.7,
      metalness: 0.1,
    });
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x333b42, // Slate dark shingles
      roughness: 0.65,
    });
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0xf0ede6, // White trim
      roughness: 0.5,
    });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x88aabb,
      roughness: 0.2,
      metalness: 0.6,
      transparent: true,
      opacity: 0.75,
    });

    const houseGroup = new THREE.Group();
    houseGroup.position.set(-13, 0, -20);

    // 1. Foundation
    const foundation = new THREE.Mesh(new THREE.BoxGeometry(10.2, 0.6, 9.2), foundationMat);
    foundation.position.y = 0.3;
    foundation.receiveShadow = true;
    houseGroup.add(foundation);

    // 2. Main house walls
    const walls = new THREE.Mesh(new THREE.BoxGeometry(10, 4.2, 9), wallMat);
    walls.position.y = 2.7;
    walls.castShadow = true;
    walls.receiveShadow = true;
    houseGroup.add(walls);

    // 3. Gable roof (triangular prism via ExtrudeGeometry)
    const roofShape = new THREE.Shape();
    roofShape.moveTo(-5.4, 0);
    roofShape.lineTo(0, 2.8);
    roofShape.lineTo(5.4, 0);
    roofShape.closePath();

    const extrudeSettings = { depth: 9.8, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1 };
    const roofGeo = new THREE.ExtrudeGeometry(roofShape, extrudeSettings);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, 4.8, -4.9);
    roof.castShadow = true;
    houseGroup.add(roof);

    // 4. Front Porch with roof & columns
    const porchFloor = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.4, 2.5), woodTex ? wallMat : trimMat);
    porchFloor.position.set(0, 0.4, 5.2);
    houseGroup.add(porchFloor);

    // 4 white porch columns
    for (const xOff of [-2.8, -0.9, 0.9, 2.8]) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.6, 8), trimMat);
      col.position.set(xOff, 1.8, 6.2);
      col.castShadow = true;
      houseGroup.add(col);
    }

    const porchRoof = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.2, 2.6), roofMat);
    porchRoof.position.set(0, 3.1, 5.2);
    houseGroup.add(porchRoof);

    // 5. Front Door
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x5e2b1d, roughness: 0.6 });
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 0.08), doorMat);
    door.position.set(0, 1.7, 4.54);
    houseGroup.add(door);

    // 6. Windows
    for (const xOff of [-2.8, 2.8]) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.6, 0.08), glassMat);
      win.position.set(xOff, 2.2, 4.54);
      houseGroup.add(win);

      const frame = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.7, 0.04), trimMat);
      frame.position.set(xOff, 2.2, 4.52);
      houseGroup.add(frame);
    }

    // 7. Chimney
    const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.2, 0.8), foundationMat);
    chimney.position.set(3.2, 5.8, -1.5);
    chimney.castShadow = true;
    houseGroup.add(chimney);

    this.scene.add(houseGroup);

    // 8. Detached Garage / Workshop (x = -27, z = -20)
    const garageGroup = new THREE.Group();
    garageGroup.position.set(-27, 0, -20);
    const garageWalls = new THREE.Mesh(new THREE.BoxGeometry(8, 3.6, 7), wallMat);
    garageWalls.position.y = 1.8;
    garageWalls.castShadow = true;
    garageGroup.add(garageWalls);

    const garageDoor = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 2.8, 0.06),
      new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.3, roughness: 0.4 })
    );
    garageDoor.position.set(0, 1.4, 3.53);
    garageGroup.add(garageDoor);

    const garageRoof = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.4, 7.6), roofMat);
    garageRoof.position.set(0, 3.7, 0);
    garageRoof.castShadow = true;
    garageGroup.add(garageRoof);
    this.scene.add(garageGroup);
  }

  private buildBackyardGrowPlot(): void {
    // 3 Elevated Wooden Grow Beds behind the house (z = -32 to -36)
    const bedWoodMat = new THREE.MeshStandardMaterial({
      color: 0x4a3319,
      roughness: 0.85,
    });
    const soilMat = new THREE.MeshStandardMaterial({
      color: 0x24170d, // Dark nutrient-rich organic soil
      roughness: 0.95,
    });
    const plantStemMat = new THREE.MeshStandardMaterial({
      color: 0x3d7023,
      roughness: 0.6,
    });
    const plantLeafMat = new THREE.MeshStandardMaterial({
      color: 0x579c31,
      roughness: 0.5,
    });

    const growArea = new THREE.Group();
    growArea.position.set(-13, 0, -32);

    for (let i = 0; i < 3; i++) {
      const bedGroup = new THREE.Group();
      bedGroup.position.set((i - 1) * 3.5, 0, 0);

      // Wooden border box
      const box = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.45, 4.0), bedWoodMat);
      box.position.y = 0.22;
      box.castShadow = true;
      bedGroup.add(box);

      // Dark organic soil
      const soil = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.1, 3.8), soilMat);
      soil.position.y = 0.42;
      bedGroup.add(soil);

      // Starter sprout nodes (early vegetative stage)
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 2; c++) {
          const sprout = new THREE.Group();
          sprout.position.set((c - 0.5) * 1.0, 0.45, (r - 1) * 1.1);

          const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.25, 6), plantStemMat);
          stem.position.y = 0.12;
          sprout.add(stem);

          // Fan leaves
          for (let leaf = 0; leaf < 4; leaf++) {
            const angle = (leaf / 4) * Math.PI * 2;
            const leafMesh = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.14, 4), plantLeafMat);
            leafMesh.position.set(Math.cos(angle) * 0.08, 0.22, Math.sin(angle) * 0.08);
            leafMesh.rotation.z = Math.cos(angle) * 0.5;
            leafMesh.rotation.x = Math.sin(angle) * 0.5;
            sprout.add(leafMesh);
          }
          bedGroup.add(sprout);
        }
      }

      growArea.add(bedGroup);
    }

    // Small garden shed next to grow beds
    const shed = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 2.6, 2.8),
      new THREE.MeshStandardMaterial({ color: 0x82492f, roughness: 0.8 })
    );
    shed.position.set(7.5, 1.3, -1);
    shed.castShadow = true;
    growArea.add(shed);

    this.scene.add(growArea);
  }

  private buildRoadSignageAndInfrastructure(): void {
    // 1. Rural Mailbox at driveway entrance (-5, 0, -8)
    const mailboxGroup = new THREE.Group();
    mailboxGroup.position.set(-5, 0, -8);

    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 1.3, 8),
      new THREE.MeshStandardMaterial({ color: 0x5a4128, roughness: 0.85 })
    );
    post.position.y = 0.65;
    post.castShadow = true;
    mailboxGroup.add(post);

    const boxMat = new THREE.MeshStandardMaterial({
      map: createMailboxTexture(),
      roughness: 0.4,
      metalness: 0.5,
    });
    const mailbox = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.35, 0.7), boxMat);
    mailbox.position.set(0, 1.35, 0);
    mailbox.castShadow = true;
    mailboxGroup.add(mailbox);

    // Red flag
    const flag = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.15, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xd42a2a })
    );
    flag.position.set(0.21, 1.4, 0.15);
    mailboxGroup.add(flag);

    this.scene.add(mailboxGroup);

    // 2. Ontario Highway Signs along Old Highway 2
    // Sign A: Welcome to Shannonville
    const signTexA = createSignTexture('SHANNONVILLE', 'OLD HIGHWAY 2 • POP. 750');
    const signGroupA = new THREE.Group();
    signGroupA.position.set(-20, 0, -8.5);

    for (const xOff of [-1.1, 1.1]) {
      const p = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.07, 2.8, 8),
        new THREE.MeshStandardMaterial({ color: 0x4a4a4a, metalness: 0.7, roughness: 0.3 })
      );
      p.position.set(xOff, 1.4, 0);
      p.castShadow = true;
      signGroupA.add(p);
    }
    const signBoardA = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 1.6, 0.08),
      new THREE.MeshStandardMaterial({ map: signTexA, roughness: 0.3, metalness: 0.1 })
    );
    signBoardA.position.set(0, 2.4, 0.05);
    signBoardA.castShadow = true;
    signGroupA.add(signBoardA);
    this.scene.add(signGroupA);

    // Sign B: Belleville / Tyendinaga Junction Direction Sign
    const signTexB = createSignTexture('TYENDINAGA TERRITORY', 'BELLEVILLE 15 KM ➔', '#154868');
    const signGroupB = new THREE.Group();
    signGroupB.position.set(-65, 0, -8.5);
    const pB1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 2.8, 8),
      new THREE.MeshStandardMaterial({ color: 0x4a4a4a, metalness: 0.7, roughness: 0.3 })
    );
    pB1.position.set(0, 1.4, 0);
    signGroupB.add(pB1);
    const signBoardB = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 1.5, 0.08),
      new THREE.MeshStandardMaterial({ map: signTexB, roughness: 0.3, metalness: 0.1 })
    );
    signBoardB.position.set(0, 2.3, 0.05);
    signGroupB.add(signBoardB);
    this.scene.add(signGroupB);

    // 3. Wooden Utility Poles along north side of road
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x4d3826, roughness: 0.9 });
    for (let x = -120; x <= 120; x += 40) {
      const pole = new THREE.Group();
      pole.position.set(x, 0, -9.5);

      const tall = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 10, 8), poleMat);
      tall.position.y = 5;
      tall.castShadow = true;
      pole.add(tall);

      const crossarm = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.16, 0.16), poleMat);
      crossarm.position.y = 9.2;
      pole.add(crossarm);

      // Ceramic insulators
      const insulMat = new THREE.MeshStandardMaterial({ color: 0x228899, roughness: 0.2 });
      for (const cx of [-0.9, 0, 0.9]) {
        const ins = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.15, 6), insulMat);
        ins.position.set(cx, 9.35, 0);
        pole.add(ins);
      }

      this.scene.add(pole);
    }

    // 4. Cedar Split-Rail Fence along property lines
    const fenceMat = new THREE.MeshStandardMaterial({ color: 0x6e563d, roughness: 0.85 });
    for (let x = -40; x <= 20; x += 5) {
      if (x >= -11 && x <= -5) continue; // Driveway opening
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 1.3, 6), fenceMat);
      post.position.set(x, 0.65, -8.2);
      post.castShadow = true;
      this.scene.add(post);

      const rail1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 5.2, 6), fenceMat);
      rail1.rotation.z = Math.PI / 2;
      rail1.position.set(x + 2.5, 0.95, -8.2);
      this.scene.add(rail1);

      const rail2 = rail1.clone();
      rail2.position.y = 0.45;
      this.scene.add(rail2);
    }
  }

  private buildFoliageAndPerimeter(): void {
    // Composite multi-part procedural pine and maple trees (3-12 parts)
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x48321e, roughness: 0.9 });
    const pineShades = [0x1e4521, 0x2b5c30, 0x183a1b];
    const mapleShades = [0x4d752c, 0x5a8a34, 0x736329];

    // Seeded tree placements around perimeter and property backdrop
    const treePositions = [
      // Backyard grove (behind starter house)
      [-5, -42], [-12, -45], [-22, -42], [-30, -38], [-38, -44], [3, -40], [14, -38],
      // West perimeter
      [-75, -25], [-82, -15], [-78, 12], [-85, 25], [-92, -35], [-70, -50],
      // East perimeter
      [35, -25], [42, -15], [38, 18], [48, 28], [55, -35], [60, -45],
      // South of Highway 2 across the road
      [-40, 25], [-25, 30], [-10, 22], [5, 28], [20, 24], [35, 32],
      [-55, 35], [-70, 28], [50, 26], [65, 35],
    ];

    for (let idx = 0; idx < treePositions.length; idx++) {
      const [tx, tz] = treePositions[idx];
      const isPine = idx % 2 === 0;
      const treeGroup = new THREE.Group();
      treeGroup.position.set(tx, 0, tz);

      const scaleMod = 0.85 + (idx % 5) * 0.1;
      treeGroup.scale.set(scaleMod, scaleMod, scaleMod);

      // Trunk
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.36, 3.5, 8),
        trunkMat
      );
      trunk.position.y = 1.75;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      if (isPine) {
        // Multi-tier tapered pine foliage
        const foliageMat = new THREE.MeshStandardMaterial({
          color: pineShades[idx % pineShades.length],
          roughness: 0.8,
        });

        for (let tier = 0; tier < 4; tier++) {
          const radius = 2.2 - tier * 0.45;
          const cone = new THREE.Mesh(
            new THREE.ConeGeometry(radius, 2.0, 7),
            foliageMat
          );
          cone.position.y = 3.2 + tier * 1.35;
          cone.castShadow = true;
          treeGroup.add(cone);
        }
      } else {
        // Multi-cluster rounded maple / deciduous foliage
        const foliageMat = new THREE.MeshStandardMaterial({
          color: mapleShades[idx % mapleShades.length],
          roughness: 0.8,
        });

        const clusters = [
          [0, 4.2, 0, 1.8],
          [-0.7, 4.8, 0.5, 1.4],
          [0.8, 4.6, -0.4, 1.4],
          [0, 5.8, 0, 1.2],
        ];

        for (const [cx, cy, cz, cr] of clusters) {
          const ball = new THREE.Mesh(new THREE.DodecahedronGeometry(cr, 1), foliageMat);
          ball.position.set(cx, cy, cz);
          ball.castShadow = true;
          treeGroup.add(ball);
        }
      }

      this.scene.add(treeGroup);
    }
  }

  private setupInteractables(): void {
    this.interactables = [
      {
        id: 'interact_bicycle',
        label: 'Cruiser Bicycle',
        subtext: 'Press [E] to Mount / Ride',
        position: [-6, 0, -12],
        radius: 2.4,
        actionType: 'mount_bike',
      },
      {
        id: 'interact_mailbox',
        label: 'Rural Mailbox',
        subtext: 'Press [E] to Inspect & Claim Starter Seed Packs',
        position: [-5, 0, -8],
        radius: 2.2,
        actionType: 'inspect_mailbox',
      },
      {
        id: 'interact_starter_home',
        label: 'Starter Homestead',
        subtext: 'Press [E] to Inspect Residence & Rest',
        position: [-13, 0, -15.5],
        radius: 3.5,
        actionType: 'enter_home',
      },
      {
        id: 'interact_grow_beds',
        label: 'Backyard Grow Beds',
        subtext: 'Press [E] to Tend Soil & Manage Crops',
        position: [-13, 0, -32],
        radius: 4.0,
        actionType: 'starter_grow',
      },
      {
        id: 'interact_shannonville_sign',
        label: 'Shannonville Signpost',
        subtext: 'Press [E] to Read Regional History',
        position: [-20, 0, -8.5],
        radius: 3.0,
        actionType: 'read_sign',
      },
    ];
  }
}
