
import Entity = require('../Entity');
import PlayState = require('../states/PlayState');

class Bullet extends Entity {

  static SPEED = 350;
  static RADIUS = 4;

  state: PlayState;
  shooter: Entity;

  shape: createjs.Shape;

  constructor(state: PlayState) {
    super(state);

    this.shape = new createjs.Shape();
    this.shape.graphics.beginFill('#ffffff').drawCircle(0, 0, Bullet.RADIUS);
    this.shape.setBounds(-Bullet.RADIUS, -Bullet.RADIUS, Bullet.RADIUS, Bullet.RADIUS);
    this.addChild(this.shape);

    this.updateHandler = (event: createjs.TickerEvent)=> ( this.update(event) );

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
    let deltaTime = event.delta / 1000; // convert to seconds

    this.updateMotion(deltaTime);
  }

  getDisplayObject(): createjs.DisplayObject {
    return this.shape;
  }

}

export = Bullet;
