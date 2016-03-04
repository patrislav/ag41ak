
import Entity = require('../Entity');
import Game = require('../Game');
import Util = require('../Util');
import PlayerBullet = require('./PlayerBullet');
import PlayState = require('../states/PlayState');

class Player extends Entity {
  static SPEEDX = 300; // px/second
  static SPEEDY = 200; // px/second
  static SHOOT_COOLDOWN = 0.3; // seconds
  static INVULN_TIME = 4; // seconds
  static RESPAWN_TIME = 2; // seconds

  bitmap: createjs.Bitmap;
  state: PlayState;

  shootCooldown = 0;
  invulnCooldown = 0;

  respawning = false;

  constructor(state: PlayState) {
    super(state);
    this.bitmap = new createjs.Bitmap(Game.assets['player']);
    this.regX = this.bitmap.image.width/2;
    this.regY = this.bitmap.image.height/2;
    this.addChild(this.bitmap);

    this.drag.set(Player.SPEEDX * 6, Player.SPEEDY * 6);
    this.maxVelocity.set(Player.SPEEDX, Player.SPEEDY);
    this.acceleration.x = 0;
    this.acceleration.y = 0;

    this.health = 3;

    this.localCollider = new createjs.Rectangle(23, 41, 48, 44);

    this.enableUpdate();
  }

  update(event: createjs.TickerEvent) {
    super.update(event);
    let deltaTime = event.delta / 1000; // convert to seconds

    if (!this.state.paused) {
      this.shootCooldown -= deltaTime;
      if (this.shootCooldown < 0)
        this.shootCooldown = 0;

      this.handleInput();
      this.handleBounds();
      this.updateMotion(deltaTime);

      if (this.invulnerable) {
        this.invulnCooldown -= deltaTime;
        if (this.invulnCooldown <= 0) {
          this.invulnerable = false;
          this.invulnCooldown = 0;
        }
      }
    }
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
      if (this.shootCooldown <= 0 && !this.respawning) {
        let bullet = this.state.recyclePlayerBullet();
        if (bullet) {
          bullet.reset();
          bullet.setShooter(this);
        }
        else {
          bullet = new PlayerBullet(this.state, this);
          this.state.addBullet(bullet);
        }

        createjs.Sound.play("zap-1");
        this.shootCooldown = Player.SHOOT_COOLDOWN;
      }
    }
  }

  handleBounds() {
    // Zero the acceleration if out of playable area
    let collider = this.getCollider();
    if ((collider.x <= this.state.borderSize && this.acceleration.x < 0)
    || (collider.x + collider.width >= Game.width - this.state.borderSize && this.acceleration.x > 0)) {
      this.acceleration.x = 0;
    }
    if ((collider.y <= this.state.borderSize && this.acceleration.y < 0)
    || (collider.y + collider.height >= Game.height - this.state.borderSize && this.acceleration.y > 0)) {
      this.acceleration.y = 0;
    }
  }

  hit(damage: number): boolean {
    let res = super.hit(damage);
    if (res && this.alive) {
      this.visible = false;
      this.invulnerable = true;
      this.respawning = true;
      this.invulnCooldown = Player.INVULN_TIME + Player.RESPAWN_TIME;

      createjs.Sound.play("hurt-1", { volume: 1 });

      setTimeout(()=> {
        this.set(this.state.respawnPoint);
        this.visible = true;
        this.respawning = false;
        this.invulnerabilityEffect();
      }, Player.RESPAWN_TIME * 1000);
    }
    return res;
  }

  kill() {
    super.kill();

    createjs.Sound.play("boom-2", { volume: 1 });
    createjs.Sound.play("lose-1", { volume: 1, delay: 100 });
  }

  invulnerabilityEffect() {
    if (!this.invulnerable) {
      this.alpha = 1;
      return;
    }

    if (this.alpha > 0.5) {
      createjs.Tween.get(this)
        .to({ alpha: 0.25 }, 400)
        .call( ()=> this.invulnerabilityEffect() );
    }
    else {
      createjs.Tween.get(this)
        .to({ alpha: 0.90 }, 400)
        .wait(200)
        .call( ()=> this.invulnerabilityEffect() );
    }
  }

  getDisplayObject(): createjs.DisplayObject {
    return this.bitmap;
  }


}

export = Player;
