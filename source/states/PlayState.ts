
import $ = require('jquery');
import _ = require('underscore');
import State = require('../State');
import Game = require('../Game');
import Shared = require('../Shared');
import Entity = require('../Entity');
import Player = require('../entities/Player');
import Enemy = require('../entities/Enemy');
import EnemyRow = require('../entities/EnemyRow');
import Bullet = require('../entities/Bullet');
import PlayerBullet = require('../entities/PlayerBullet');
import EnemyBullet = require('../entities/EnemyBullet');

class PlayState extends State {
  name: string = "PlayState";

  // Number of pixels between playable area and canvas border
  borderSize: number = 50;

  player: Player;
  enemies: Enemy[] = [];
  enemyRows: EnemyRow[] = [];

  enemyColumns: number = 8;

  bullets: Bullet[] = [];

  score: number;

  $ui: JQuery;
  $waveMsg: JQuery;
  $lives: JQuery;
  $score: JQuery;

  constructor() {
    super();
  }

  enter(): void {
    super.enter();

    this.paused = true;
    this.score = 0;

    let background = new createjs.Shape();
    background.graphics.beginFill("#DB7937").drawRect(0, 0, Game.width, Game.height);
    Game.stage.addChild(background);

    this.player = new Player(this);
    this.player.x = Game.width/2;
    this.player.y = Game.height-100;
    Game.addChild(this.player);

    for (let i = 0; i < 4; i++) {
      let enemyRow = new EnemyRow(this, 8);
      enemyRow.x = Game.width/2;
      enemyRow.y = 50 + 50*i;
      this.enemyRows.push(enemyRow);
      Game.addChild(enemyRow);
    }

    this.enemyShootCheck();

    // let enemyPositions = [
    //   { x: width/2 - 300, y: 100 },
    //   { x: width/2 - 230, y: 100 },
    //   { x: width/2 - 160, y: 100 },
    //   { x: width/2 - 90, y: 100 },
    //   { x: width/2 - 20, y: 100 },
    //   { x: width/2 + 50, y: 100 },
    //   { x: width/2 + 120, y: 100 },
    //   { x: width/2 + 190, y: 100 }
    // ];
    //
    // for (let position of enemyPositions) {
    //   let enemy = new Enemy(this, position.x, position.y);
    //   this.addEnemy(enemy);
    // }

    if (!Shared.themeMusic) {
      Shared.themeMusic = createjs.Sound.play("theme-1", { volume: 0.35, loop: -1 });
    }

    createjs.Sound.play("start-1");
    this.$ui.show();
    this.$waveMsg.find('h1').text("Wave 1");
    this.$waveMsg.find('h2').text("Are you ready?");
    this.$waveMsg.fadeIn();

    setTimeout(()=>{
      this.$waveMsg.fadeOut();
      this.paused = false;
    }, 2000);
  }

  exit(): void {
    super.exit();

    this.player = undefined;
    this.enemies = [];
    this.bullets = [];
    this.enemyRows = [];

    this.$ui.hide();
  }

  update(event: createjs.Event): void {
    // $('.fps-number').text(Math.round(createjs.Ticker.getMeasuredFPS()));
    // $('.lives-number').text(this.player.health);

    this.$lives.find('span').text(this.player.health);

    if(Shared.themeMusic.playState != createjs.Sound.PLAY_SUCCEEDED) {
      Shared.themeMusic.play({ volume: 0.35, loop: -1 });
    }

    let deltaTime = event.delta / 1000; // event.delta is in ms

    // Handle input
    // TODO: It should pause the game and show in-game menu, though
    if (Game.anyPressed([8, 27])) { // 8 - backspace, 27 - escape
      Game.previousState();
    }

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

  initUI(): void {
    this.$ui = $("<div/>").appendTo(Game.$ui);
    this.$ui.addClass('game-ui-state-play');

    this.$lives = $("<div/>").appendTo(this.$ui);
    this.$lives.html("Lives: <span></span>");
    this.$lives.addClass('game-play-lives');

    this.$waveMsg = $("<div/>").appendTo(this.$ui);
    this.$waveMsg.addClass('game-play-wavemsg');
    $("<h1/>").appendTo(this.$waveMsg);
    $("<h2/>").appendTo(this.$waveMsg);
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

  enemyShootCheck() {
    for (let c = 0; c < this.enemyColumns; c++) {
      for (let i = this.enemyRows.length-1; i >= 0; i--) {
        let enemy = <Enemy> this.enemyRows[i].getChildAt(c);
        if (enemy.alive) {
          enemy.shootEnabled = true;
          break;
        }
      }
    }
  }

  collides(objA: Entity, objB: Entity): boolean {
    return objA.collides(objB);
  }
}

export = PlayState;
