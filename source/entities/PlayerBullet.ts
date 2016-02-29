
import Bullet = require('./Bullet');
import Player = require('./Player');
import PlayState = require('../states/PlayState');

class PlayerBullet extends Bullet {

  constructor(state: PlayState, player: Player) {
    super(state);
    this.setShooter(player);
  }

  reset() {
    super.reset();

    this.damage = 1;
    this.velocity.set(0, -PlayerBullet.SPEED);
  }

  setShooter(player: Player) {
    super.setShooter(player);

    this.x = player.x;
    this.y = player.y - 50;
  }

}

export = PlayerBullet;
