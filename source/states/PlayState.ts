
import $ = require('jquery');
import _ = require('underscore');
import State = require('../State');
import Game = require('../Game');
import Entity = require('../Entity');
import Player = require('../entities/Player');
import Enemy = require('../entities/Enemy');
import Bullet = require('../entities/Bullet');
import PlayerBullet = require('../entities/PlayerBullet');
import EnemyBullet = require('../entities/EnemyBullet');

class PlayState extends State {
  name: string = "PlayState";

  player: Player;
  enemies: Enemy[] = [];

  bullets: Bullet[] = [];

  themeMusic: createjs.AbstractSoundInstance;

  constructor() {
    super();
  }

  enter(): void {
    let width = Game.stage.canvas['width'];
    let height = Game.stage.canvas['height'];

    let background = new createjs.Shape();
    background.graphics.beginFill("#DB7937").drawRect(0, 0, width, height);
    Game.stage.addChild(background);

    this.player = new Player(this);
    this.player.x = width/2;
    this.player.y = height-100;
    Game.addChild(this.player);

    let enemyPositions = [
      { x: width/2 - 300, y: 100 },
      { x: width/2 - 150, y: 100 },
      { x: width/2      , y: 100 },
      { x: width/2 + 150, y: 100 },
      { x: width/2 + 300, y: 100 }
    ];

    for (let position of enemyPositions) {
      let enemy = new Enemy(this, position.x, position.y);
      this.addEnemy(enemy);
    }

    this.themeMusic = createjs.Sound.play("theme-1", { volume: 0.35, loop: -1 });
  }

  exit(): void {
    Game.stage.removeAllChildren();

    this.player = undefined;
    this.enemies = [];
    this.bullets = [];
    this.themeMusic = undefined;
  }

  update(event: createjs.Event): void {
    $('.fps-number').text(Math.round(createjs.Ticker.getMeasuredFPS()));
    $('.lives-number').text(this.player.health);

    if(this.themeMusic.playState != createjs.Sound.PLAY_SUCCEEDED) {
      this.themeMusic.play({ volume: 0.35, loop: -1 });
    }

    let deltaTime = event.delta / 1000; // event.delta is in ms

    // Check if player hits an enemy
    for(let enemy of this.enemies) {
      if (!enemy.alive) continue;

      if (this.collides(this.player, enemy) && this.player.hit(1)) {
        enemy.kill();

        if (!this.player.alive) {
          Game.removeChild(this.player);
        }
      }
    }

    // Check all the bullets
    for (let bullet of this.bullets) {
      // Check if the Player shot down an Enemy
      if (bullet.shooter instanceof Player) {
        for (let enemy of this.enemies) {
          if (!enemy.alive) continue;

          if (this.collides(enemy, bullet)) {
            if (enemy.hit(bullet.damage)) {
              bullet.kill();
            }
          }
        }
      }
      // Check if an Enemy shot down the Player
      else if (bullet.shooter instanceof Enemy) {
        if (this.collides(this.player, bullet)) {
          if (this.player.hit(bullet.damage)) {
            bullet.kill();
          }
        }
      }
    }
  }

  addEnemy(enemy: Enemy) {
    this.enemies.push(enemy);
    Game.addChild(enemy);
  }

  addBullet(bullet: Bullet) {
    this.bullets.push(bullet);
    Game.addChild(bullet);
  }

  recyclePlayerBullet(): PlayerBullet {
    return <PlayerBullet> _.find(this.bullets, (b: Bullet)=> b instanceof PlayerBullet && !b.alive );
  }

  recycleEnemyBullet(): EnemyBullet {
    return <EnemyBullet> _.find(this.bullets, (b: EnemyBullet)=> b instanceof EnemyBullet && !b.alive );
  }

  collides(objA: Entity, objB: Entity): boolean {
    if (!objA.alive || !objB.alive) return false;

    if (objA.getCollider().intersects(objB.getCollider())) {
      return true;
    }

    return false;
  }
}

export = PlayState;
