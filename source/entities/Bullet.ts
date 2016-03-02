
import Entity = require('../Entity');
import PlayState = require('../states/PlayState');

class Bullet extends Entity {

  static SPEED = 350;
  static WIDTH = 4;
  static HEIGHT = 12;

  lifetime: number; // time for the bullet to live

  state: PlayState;
  shooter: Entity;

  damage: number;

  shape: createjs.Shape;

  constructor(state: PlayState) {
    super(state);
  }

  reset() {
    super.reset();
    this.enableUpdate();

    this.lifetime = 10;

    this.render();

    this.damage = 0;
  }

  render() {
    this.shape = new createjs.Shape();
    this.shape.graphics.beginFill('#ffffff').drawRect(0, 0, Bullet.WIDTH, Bullet.HEIGHT);
    this.shape.setBounds(0, 0, Bullet.WIDTH, Bullet.HEIGHT);
    this.addChild(this.shape);

    this.regX = Bullet.WIDTH/2;
    this.regY = Bullet.HEIGHT/2;
  }

  setShooter(shooter: Entity) {
    this.shooter = shooter;
  }

  update(event: createjs.TickerEvent) {
    super.update(event);
    let deltaTime = event.delta / 1000; // convert to seconds

    if (!this.state.paused)
      this.updateMotion(deltaTime);

    this.lifetime -= deltaTime;
    if (this.lifetime <= 0) {
      this.kill();
    }
  }

  getDisplayObject(): createjs.DisplayObject {
    return this.shape;
  }

}

export = Bullet;
