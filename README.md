# Herbie's Shannonville Ventures

A third-person 3D open-world life simulator and business tycoon game set in Shannonville and the surrounding Central Hastings region of Ontario, Canada.

The player begins a new life after moving from Toronto to Central Hastings with limited funds ($500), a modest starter property on Old Highway 2, three starter seed packs, and a rural cruiser bicycle. From there, they explore the region, cultivate heritage seeds, establish businesses, upgrade properties, purchase practical vehicles, meet characters, and build a regional business empire.

---

## 🎮 Current Playable Alpha Milestone 1 Features

- **Real-Time 3D Engine**: Built on Three.js r160+ with physically grounded PBR lighting, procedural asphalt highway corridors, and rolling Ontario terrain.
- **Third-Person Character Controller**: Responsive WASD walk/run/jump kinematics with smooth stride animations and exponential camera damping with wall collision avoidance.
- **Cruiser Bicycle Simulation**: Rideable multi-part procedural cruiser bicycle with rotating spoked wheels, handlebars, pedals, and speed boost.
- **Starting Homestead**: 42 Old Highway 2 featuring a rustic house with front porch, detached garage/workshop, mailbox depot, and 3 backyard elevated grow beds.
- **Proximity Interaction System**: Contextual floating action prompts (`[E]`) for mounting the bicycle, inspecting the roadside mailbox, checking grow beds, and reading historical signs.
- **Inventory & Economy**: Backpack item registry with Toronto Move-In Starter Packs, seed strain varieties (Hastings Haze, Shannonville Skunk, Tyendinaga Gold), tools, and persistent profile state.
- **Zero-Occlusion Collapsible HUD**: Sleek status bar with live coordinates, speedometer, cash counter, regional map, objectives modal, and full screen cinema mode.
- **Zero-External Dependencies**: 100% procedural textures, materials, and models—zero missing 404 assets or broken textures.

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Run unit tests (logic & physics)
npx --yes tsx --test src/game/physics.test.ts
npx --yes tsx --test src/game/gameState.test.ts

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:3000
# Or skip the intro story directly with: http://localhost:3000/?autostart=1
```

---

## 🕹️ Controls

| Control | Action |
| :--- | :--- |
| **W, A, S, D** / Arrows | Move Character / Steer Bicycle |
| **Shift** | Sprint (Foot or Bicycle) |
| **Space** | Jump (On foot) |
| **E** | Contextual Interaction (Mount Bike, Mailbox, Beds, Signs) |
| **B** | Quick Bicycle Toggle |
| **Mouse Drag** | Orbit Third-Person Camera |
| **Mouse Wheel** | Zoom In / Out |
| **Backpack / Map / Objectives** | Click buttons on collapsible bottom dock |

---

## 📂 Architecture & File Structure

```
/src
  /components
    HUD.tsx              # Clean non-occluding heads-up display & bottom dock
    InventoryModal.tsx   # Backpack & seed pack unboxing interface
    WorldMapModal.tsx    # Regional map of Shannonville & Central Hastings
    TutorialGuide.tsx    # Narrative story intro & controls guide
  /game
    /camera
      ThirdPersonCamera.ts   # Smooth exponential follow camera with wall avoidance
    /entities
      PlayerCharacter.ts     # Multi-part procedural player with walk/ride animations
      Bicycle.ts             # Procedural bicycle with rotating spoked wheels
    /systems
      InteractionSystem.ts   # Proximity raycast & trigger detection
    /world
      ShannonvilleWorld.ts   # Procedural terrain, Old Hwy 2, homestead, signage, foliage
      proceduralTextures.ts  # HTML5 Canvas procedural asphalt, wood, grass, & signs
    GameCanvas.tsx           # WebGL container, software-GL guard & render loop
    gameState.ts             # Profile, cash, objectives, inventory persistence
    gameState.test.ts        # Unit tests for state & economy
    items.ts                 # Item registry, starter packs, and seed strains
    physics.ts               # Pure kinematics, collision boxes, terrain elevation
    physics.test.ts          # Unit tests for physics & bicycle acceleration
  /types
    game.ts                  # Core TypeScript types
  App.tsx                    # Root game coordination component
```
