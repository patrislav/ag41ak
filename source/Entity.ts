/// <amd-dependency path="easel"/>

import Game = require('./Game');
import Util = require('./Util');
import State = require('./State');

class Entity extends createjs.Container {

  updateHandler: (event: createjs.TickerEvent)=>any;

  acceleration = new Util.Vector2();
  velocity = new Util.Vector2();
  maxVelocity = new Util.Vector2();
  drag = new Util.Vector2();

  constructor(public state: State) {
    super();
  }

  getDisplayObject(): createjs.DisplayObject {
    return null;
  }

  updateMotion(deltaTime: number) {
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

}

export = Entity;
