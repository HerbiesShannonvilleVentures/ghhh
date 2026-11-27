# Herbie's Shannonville Ventures — Game Design Document

## 1. Vision & Core Philosophy
Herbie's Shannonville Ventures is an open-world 3D life simulation and regional tycoon game set in the rural landscape of Shannonville and Central Hastings, Ontario.

Unlike abstract menu-based mobile management games, players physically exist within the 3D world:
- Riding down Old Highway 2 on a bicycle to visit local stores and trading posts.
- Returning home to their rural property to tend to garden beds and greenhouse operations.
- Building relationships with local characters, completing contracts, and expanding into businesses and vehicles.

---

## 2. Setting & World Design
- **Core Hub**: Shannonville crossroads on Old Highway 2, connecting Belleville to the west and Deseronto/Tyendinaga to the east.
- **Atmosphere**: Authentic rural Ontario—asphalt roads with double yellow lines, cedar split-rail fences, pine and sugar maple groves, roadside utility poles, gravel driveways, and historic community signs.
- **No Paid Google Maps Runtime Dependency**: The geographic terrain, road corridors, and landmarks are procedurally generated and inspired by real regional layouts without requiring a paid runtime API.

---

## 3. Economy & Progression Systems
1. **Starting Funds**: $500 cash, modest homestead, 3 starter seed packs, and a cruiser bicycle.
2. **Growing Simulation**:
   - 5 growth stages: Germination, Seedling, Vegetative, Flowering, Ready to Harvest.
   - Soil moisture, nutrient management, and seasonal weather.
   - Simplified game-like cultivation mechanics.
3. **Vehicle Hierarchy**:
   - Tier 1: Rural Cruiser Bicycle (Free, 0 fuel, reliable).
   - Tier 2: Beater Civic / Classic Pickup (Practical, requires fuel from local gas stations).
   - Tier 3: Work Van / Commercial Utility Truck.
   - Black market luxury vehicles unlocked only through high-tier contracts.
4. **Markets & NPCs**:
   - NPC wholesale buyers purchase harvested yields for cash.
   - Player-to-player marketplace reserved for rare genetics, collectible seeds, and vehicle parts.

---

## 4. Multi-Phase Roadmap
- **Milestone 1 (Complete)**: 3D Foundation, Character Movement, Bicycle Simulation, Starter Homestead, Proximity Interactions, Backpack, and Regional Map.
- **Milestone 2**: Shannonville Environment Expansion, Trading Post Storefronts (Oasis, Enterprise, Legacy 420), and NPC Dialog System.
- **Milestone 3**: 5-Stage Interactive Growing Mechanics & Soil Care on Backyard Grow Beds.
- **Milestone 4**: NPC Selling Loop, Gas Station Fuel Economy, and Practical Vehicles.
- **Milestone 5**: Business Tycoon Operations & Real-Time Weather Integration.
- **Milestone 6**: Firebase Authentication & UID-Isolated Persistent Cloud Saves.
