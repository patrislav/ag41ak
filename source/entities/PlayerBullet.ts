
import Bullet = require('./Bullet');
import Player = require('./Player');

class PlayerBullet extends Bullet {

  constructor(player: Player) {
    super();

    this.velocity.set(0, -PlayerBullet.SPEED);
    this.shooter = player;

    this.x = player.x;
    this.y = player.y - 50;
  }

}

export = PlayerBullet;
