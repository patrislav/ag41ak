/// <amd-dependency path="easel"/>

import Game = require('./Game');
import Util = require('./Util');
import State = require('./State');

class Entity extends createjs.Container {

  updateHandler: (event: createjs.TickerEvent)=>any;

  state: State;

  acceleration: Util.Vector2;
  velocity: Util.Vector2;
  maxVelocity: Util.Vector2;
  drag: Util.Vector2;

  health: number;

  alive: boolean;
  invulnerable: boolean;

  localCollider: createjs.Rectangle;

  constructor(state: State) {
    super();
    this.state = state;
    this.reset();

    this.updateHandler = (event: createjs.TickerEvent)=> ( this.update(event) );
  }

  reset() {
    this.acceleration = new Util.Vector2();
    this.velocity = new Util.Vector2();
    this.maxVelocity = new Util.Vector2();
    this.drag = new Util.Vector2();

    this.invulnerable = false;
    this.revive();

    this.localCollider = undefined;
  }

  getDisplayObject(): createjs.DisplayObject {
    return null;
  }

  updateMotion(deltaTime: number) {
    if (this.state.paused) return;

    let velocityDelta = 0.5 * (Util.computeVelocity(this.velocity.x, this.acceleration.x, this.drag.x, this.maxVelocity.x, deltaTime) - this.velocity.x);
		this.velocity.x += velocityDelta;
		let delta = this.velocity.x * deltaTime;
		this.velocity.x += velocityDelta;
		this.x += delta;

		velocityDelta = 0.5 * (Util.computeVelocity(this.velocity.y, this.acceleration.y, this.drag.y, this.maxVelocity.y, deltaTime) - this.velocity.y);
		this.velocity.y += velocityDelta;
		delta = this.velocity.y * deltaTime;
		this.velocity.y += velocityDelta;
		this.y += delta;
  }

  getCollider(): createjs.Rectangle {
    let rect = (this.localCollider ? this.localCollider : this.getBounds()).clone();

    let point = this.localToGlobal(rect.x, rect.y);
    rect.x = point.x;
    rect.y = point.y;

    return rect;
  }

  hit(damage: number): boolean {
    if (this.invulnerable) return false;

    this.health -= damage;
    if (this.health <= 0) {
      this.kill();
    }

    return true;
  }

  kill() {
    this.health = 0;
    this.alive = false;
    this.visible = false;
    if (this.parent)
      createjs.Ticker.removeEventListener("tick", this.updateHandler);
  }

  revive(health = undefined) {
    this.health = health;
    this.alive = true;
    this.visible = true;
    if (this.parent)
      createjs.Ticker.addEventListener("tick", this.updateHandler);
  }

  enableUpdate() {
    this.addEventListener("added", ()=>( this.added() ));
    this.addEventListener("removed", ()=>( this.removed() ));
  }

  added() {
    createjs.Ticker.addEventListener("tick", this.updateHandler);
  }

  removed() {
    createjs.Ticker.removeEventListener("tick", this.updateHandler);
  }

  update(event: createjs.TickerEvent) {
  }

  collides(obj: Entity): boolean {
    if (!this.alive || !obj.alive) return false;

    if (this.getCollider().intersects(obj.getCollider())) {
      return true;
    }

    return false;
  }

}

export = Entity;
