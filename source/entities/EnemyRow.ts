import Entity = require('../Entity');
import Enemy = require('./Enemy');
import Game = require('../Game');
import PlayState = require('../states/PlayState');

class EnemyRow extends Entity {

  state: PlayState;

  static SPEED = 50;

  speed: number;
  initialCount: number;

  constructor(state: PlayState, numberOfEnemies: number) {
    super(state);

    this.state = state;
    this.initialCount = numberOfEnemies;

    this.enableUpdate();
  }

  added() {
    super.added();

    for (let i = 0; i < this.initialCount; i++) {
      let enemy = new Enemy(this.state);
      enemy.x = enemy.regX + i * (enemy.getBounds().width + 10);
      enemy.y = enemy.regY;
      enemy.row = this;
      this.addChild(enemy);
      this.state.enemies.push(enemy);
    }

    this.regX = this.getBounds().width/2;
    this.regY = this.getBounds().height/2;

    this.speed = EnemyRow.SPEED;
    this.acceleration.set(this.speed, 0);
    this.maxVelocity.set(this.speed, 0);

  }

  removed() {
    super.removed();
    this.removeAllChildren();
  }

  update(event: createjs.TickerEvent) {
    super.update(event);
    let deltaTime = event.delta / 1000; // convert to seconds

    if (this.x - this.regX < this.state.borderSize) {
      this.acceleration.x = this.speed;
    }
    else if (this.x + this.regX > Game.width - this.state.borderSize) {
      this.acceleration.x = -this.speed;
    }

    this.updateMotion(deltaTime);
  }

}

export = EnemyRow;
