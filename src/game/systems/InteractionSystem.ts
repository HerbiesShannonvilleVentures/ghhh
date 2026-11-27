/**
 * Interaction System
 * Detects nearby interactables and manages player interaction triggers.
 */
import { WorldInteractable } from '../../types/game';

export class InteractionSystem {
  private interactables: WorldInteractable[];

  constructor(interactables: WorldInteractable[]) {
    this.interactables = interactables;
  }

  public getNearestInteractable(
    playerX: number,
    playerY: number,
    playerZ: number
  ): { item: WorldInteractable; distance: number } | null {
    let nearest: WorldInteractable | null = null;
    let minDistance = Infinity;

    for (const item of this.interactables) {
      const dx = playerX - item.position[0];
      const dy = playerY - item.position[1];
      const dz = playerZ - item.position[2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist <= item.radius && dist < minDistance) {
        minDistance = dist;
        nearest = item;
      }
    }

    if (nearest) {
      return { item: nearest, distance: minDistance };
    }
    return null;
  }
}
