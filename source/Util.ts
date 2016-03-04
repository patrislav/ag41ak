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

export class Range {
  constructor(public min: number = 0, public max: number = 0) { }

  set(min: number, max: number) {
    this.min = min; this.max = max;
  }

  randomFloat(): number {
    return randomFloat(this.min, this.max);
  }

  randomInteger(): number {
    return randomInteger(this.min, this.max);
  }
}

export function getUrl(path?: string) {
  let url = window.location.href.substring(0, window.location.href.lastIndexOf("/")+1);
  if (path) {
    url += path;
  }
  return url;
}

export function randomFloat(min: number, max: number): number {
  return Math.random()*(max-min+1)+min;
}

export function randomInteger(min: number, max: number): number {
  return Math.floor(randomFloat(min, max));
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

/*
  Score awarding idea?
    1     => 1x
    2-4   => 2x
    5-10  => 3x
    11-17 => 4x
*/
export function calculateComboPoints(comboCounter: number, baseScore: number): number {
  return baseScore * comboCounter;
}
