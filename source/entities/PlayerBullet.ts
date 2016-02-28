
import Bullet = require('./Bullet');
import Player = require('./Player');
import PlayState = require('../states/PlayState');

class PlayerBullet extends Bullet {

  constructor(state: PlayState, player: Player) {
    super(state);

    this.shooter = player;
    this.velocity.set(0, -PlayerBullet.SPEED);

    this.x = player.x;
    this.y = player.y - 50;
  }

}

export = PlayerBullet;
