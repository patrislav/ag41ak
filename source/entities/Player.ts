
import Entity = require('../Entity');
import Game = require('../Game');
import Util = require('../Util');
import PlayerBullet = require('./PlayerBullet');
import PlayState = require('../states/PlayState');

class Player extends Entity {
  static SPEED = 175; // px/second
  static SHOOT_COOLDOWN = 0.4; // seconds

  bitmap: createjs.Bitmap;
  state: PlayState;

  shootCooldown = 0;

  constructor() {
    super();
    this.bitmap = new createjs.Bitmap(Game.assets['player']);
    this.regX = this.bitmap.image.width/2;
    this.regY = this.bitmap.image.height/2;
    this.addChild(this.bitmap);

    this.drag.set(Player.SPEED * 8, Player.SPEED * 8);
    this.maxVelocity.set(Player.SPEED, Player.SPEED);
    this.acceleration.x = 0;
    this.acceleration.y = 0;

    this.addEventListener("added", ()=>( this.added() ));
  }

  added() {
    createjs.Ticker.addEventListener("tick", (event: createjs.TickerEvent)=>( this.update(event) ));
  }

  update(event: createjs.TickerEvent) {
    let deltaTime = event.delta / 1000; // convert to seconds

    this.shootCooldown -= deltaTime;
    if (this.shootCooldown < 0)
      this.shootCooldown = 0;

    this.handleInput();
    this.updateMotion(deltaTime);
  }

  handleInput() {
    this.acceleration.x = 0;
    this.acceleration.y = 0;

    if (Game.anyPressed([37, 65])) { // 37 - left arrow, 65 - A
      this.acceleration.x -= this.drag.x;
    }
    if (Game.anyPressed([39, 68])) { // 39 - right arrow, 68 - D
      this.acceleration.x += this.drag.x;
    }
    if (Game.anyPressed([38])) { // 38 - up arrow
      this.acceleration.y -= this.drag.y;
    }
    if (Game.anyPressed([40])) { // 40 - down arrow
      this.acceleration.y += this.drag.y;
    }

    if (Game.anyPressed([32])) { // 32 - space
      if (this.shootCooldown <= 0) {
        let bullet = new PlayerBullet(this);
        this.parent.addChild(bullet);
        this.state.bullets.push(bullet);

        this.shootCooldown = Player.SHOOT_COOLDOWN;
      }
    }
  }

  getDisplayObject(): createjs.DisplayObject {
    return this.bitmap;
  }


}

export = Player;
