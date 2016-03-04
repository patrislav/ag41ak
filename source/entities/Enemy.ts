
import Entity = require('../Entity');
import Game = require('../Game');
import Util = require('../Util');
import PlayState = require('../states/PlayState');
import EnemyBullet = require('./EnemyBullet');
import EnemyRow = require('./EnemyRow');

class Enemy extends Entity {

  static SIZE = 50;

  state: PlayState;
  bitmap: createjs.Bitmap;
  row: EnemyRow;

  shootEnabled: boolean;
  shootCooldown: number = Util.randomFloat(1, 5);

  baseScore: number;

  constructor(state: PlayState, x?: number, y?: number) {
    super(state);

    if (x) this.x = x;
    if (y) this.y = y;

    this.bitmap = new createjs.Bitmap(Game.assets['alien1-1']);
    this.regX = this.bitmap.image.width/2;
    this.regY = this.bitmap.image.height/2;
    this.addChild(this.bitmap);

    this.health = 2;
    this.shootEnabled = false;
    this.baseScore = 10;

    this.enableUpdate();
  }

  update(event: createjs.TickerEvent) {
    super.update(event);
    let deltaTime = event.delta / 1000; // convert to seconds

    if (!this.state.paused && this.alive && this.shootEnabled) {
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

        this.shootCooldown = Util.randomFloat(3, 12);
      }
    }

  }

  hit(damage: number): boolean {
    createjs.Sound.play("hurt-1", { volume: 1 });

    return super.hit(damage);
  }

  kill() {
    super.kill();
    this.state.killEnemy(this);
    this.state.enemyShootCheck();

    createjs.Sound.play("boom-1", { volume: 1 });
  }

  getDisplayObject(): createjs.DisplayObject {
    return this.bitmap;
  }

}

export = Enemy;
