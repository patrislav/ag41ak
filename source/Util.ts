/**
 * Util.ts
 *
 * Small utilities module.
 */

export class Vector2 {
  constructor(public x: number = 0, public y: number = 0) { }

  set(_x: number, _y: number) {
    this.x = _x; this.y = _y;
  }
}

export function computeVelocity(velocity: number, acceleration: number, drag: number, max: number, elapsed: number): number {
  if (acceleration != 0) {
    velocity += acceleration * elapsed;
  }
  else if (drag != 0) {
    drag *= elapsed;
    if (velocity - drag > 0) {
      velocity -= drag;
    }
    else if (velocity + drag < 0) {
      velocity += drag;
    }
    else {
      velocity = 0;
    }
  }

  if (velocity != 0 && max != 0) {
    if (velocity > max) {
      velocity = max;
    }
    else if (velocity < -max) {
      velocity = -max;
    }
  }

  return velocity;
}