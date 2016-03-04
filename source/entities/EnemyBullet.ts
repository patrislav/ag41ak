
import Bullet = require('./Bullet');
import Enemy = require('./Enemy');
import PlayState = require('../states/PlayState');

class EnemyBullet extends Bullet {

  static RADIUS = 3;

  constructor(state: PlayState, enemy: Enemy) {
    super(state);
    this.setShooter(enemy);
  }

  reset() {
    super.reset();

    this.damage = 1;
    this.velocity.set(0, EnemyBullet.SPEED);
  }

  render() {
    this.shape = new createjs.Shape();
    this.shape.graphics.beginFill('#ffffff').drawCircle(EnemyBullet.RADIUS, EnemyBullet.RADIUS, EnemyBullet.RADIUS);
    this.shape.setBounds(0, 0, EnemyBullet.RADIUS*2, EnemyBullet.RADIUS*2);
    this.addChild(this.shape);

    this.regX = Bullet.WIDTH/2;
    this.regY = Bullet.HEIGHT/2;
  }

  setShooter(enemy: Enemy) {
    super.setShooter(enemy);

    let position = enemy.parent.localToGlobal(enemy.x, enemy.y);
    this.x = position.x;
    this.y = position.y + 10;
  }

  setSpeed(speed: number) {
    this.velocity.y = speed;
  }

}

export = EnemyBullet;
