
import Entity = require('../Entity');

class Bullet extends Entity {

  static SPEED = 350;
  static RADIUS = 4;

  shooter: Entity;

  shape: createjs.Shape;

  constructor() {
    super();

    this.shape = new createjs.Shape();
    this.shape.graphics.beginFill('#ffffff').drawCircle(0, 0, Bullet.RADIUS);
    this.addChild(this.shape);

    this.addEventListener("added", ()=>( this.added() ));
  }

  added() {
    createjs.Ticker.addEventListener("tick", (event: createjs.TickerEvent)=>( this.update(event) ));
  }

  update(event: createjs.TickerEvent) {
    let deltaTime = event.delta / 1000; // convert to seconds

    this.updateMotion(deltaTime);
  }

  getDisplayObject(): createjs.DisplayObject {
    return this.shape;
  }

}

export = Bullet;
