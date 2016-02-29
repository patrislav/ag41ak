
import Entity = require('../Entity');
import Game = require('../Game');
import Util = require('../Util');
import PlayState = require('../states/PlayState');
import EnemyBullet = require('./EnemyBullet');

class Enemy extends Entity {

  static SIZE = 50;

  state: PlayState;
  shape: createjs.Shape;

  shootCooldown: number = Util.randomFloat(1, 5);

  constructor(state: PlayState, x?: number, y?: number) {
    super(state);

    if (x) this.x = x;
    if (y) this.y = y;

    this.shape = new createjs.Shape();
    this.shape.graphics.beginFill('#000000').drawRect(0, 0, Enemy.SIZE, Enemy.SIZE);
    this.shape.setBounds(0, 0, Enemy.SIZE, Enemy.SIZE);
    this.addChild(this.shape);

    this.regX = Enemy.SIZE/2;
    this.regY = Enemy.SIZE/2;

    this.health = 2;

    this.enableUpdate();
  }

  update(event: createjs.TickerEvent) {
    super.update(event);
    let deltaTime = event.delta / 1000; // convert to seconds

    this.shootCooldown -= deltaTime;
    if (this.shootCooldown < 0) {
      let bullet = this.state.recycleEnemyBullet();
      if (bullet) {
        bullet.reset();
        bullet.setShooter(this);
      }
      else {
        bullet = new EnemyBullet(this.state, this);
        this.state.addBullet(bullet);
      }

      createjs.Sound.play("zap-2", { volume: 1 });
      this.shootCooldown = Util.randomFloat(3, 12);
    }

  }

  hit(damage: number): boolean {
    createjs.Sound.play("hurt-1", { volume: 1 });

    return super.hit(damage);
  }

  kill() {
    super.kill();

    createjs.Sound.play("boom-1", { volume: 1 });
  }

  getDisplayObject(): createjs.DisplayObject {
    return this.shape;
  }

}

export = Enemy;
