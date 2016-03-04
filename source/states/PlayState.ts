
import $ = require('jquery');
import _ = require('underscore');
import State = require('../State');
import Game = require('../Game');
import Util = require('../Util');
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

  // Player respawn point
  respawnPoint: createjs.Point;

  player: Player;
  enemies: Enemy[] = [];
  enemyRows: EnemyRow[] = [];

  enemyColumns: number = 8;

  bullets: Bullet[] = [];

  currentWave: number;
  wonWave: boolean;
  score: number;

  comboCooldown: number;
  comboCounter: number;

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

    this.respawnPoint = new createjs.Point(Game.width/2, Game.height-100);

    this.player = new Player(this);
    this.player.set(this.respawnPoint);
    Game.addChild(this.player);

    if (Shared.themeMusic) {
      Shared.themeMusic.stop();
    }

    this.$ui.show();

    this.currentWave = 1;
    this.wonWave = true;
    this.startWave(this.currentWave);
  }

  exit(): void {
    super.exit();

    this.player = undefined;
    this.enemies = [];
    this.bullets = [];
    this.enemyRows = [];
    this.wonWave = false;

    this.$ui.hide();
  }

  update(event: createjs.Event): void {
    let deltaTime = event.delta / 1000; // event.delta is in ms

    this.updateUI();

    this.checkCollisions();

    // Handle combo
    this.comboCooldown -= deltaTime;
    if (this.comboCooldown < 0) {
      this.comboCooldown = 0;
      this.comboCounter = 0;
    }

    // Check for wave win
    if (this.enemies.length == 0 && !this.wonWave) {
      this.winWave();
    }

    // Handle input
    // TODO: It should pause the game and show in-game menu, though
    if (Game.anyPressed([8, 27])) { // 8 - backspace, 27 - escape
      Game.previousState();
    }
  }

  initUI(): void {
    this.$ui = $("<div/>").appendTo(Game.$ui);
    this.$ui.addClass('game-ui-state-play');

    this.$lives = $("<div/>").appendTo(this.$ui);
    this.$lives.html("Lives: <span></span>");
    this.$lives.addClass('game-play-lives');

    this.$score = $("<div/>").appendTo(this.$ui);
    this.$score.html("Score: <span></span>");
    this.$score.addClass('game-play-score');

    this.$waveMsg = $("<div/>").appendTo(this.$ui);
    this.$waveMsg.addClass('game-play-wavemsg');
    $("<h1/>").appendTo(this.$waveMsg);
    $("<h2/>").appendTo(this.$waveMsg);
  }

  updateUI(): void {
    this.$lives.find('span').text(this.player.health);
    this.$score.find('span').text(this.score);
  }

  startWave(wave: number) {
    this.comboCounter = 0;
    this.comboCooldown = 0;

    this.$waveMsg.find('h1').text("Wave " + wave);
    this.$waveMsg.find('h2').text("Are you ready?");
    this.$waveMsg.fadeIn();

    for (let row of this.enemyRows) {
      Game.removeChild(row);
    }

    for (let bullet of this.bullets) {
      bullet.kill();
    }

    this.enemies = [];
    this.enemyRows = [];

    // this.player.set(this.respawnPoint);

    setTimeout(()=>{
      this.$waveMsg.fadeOut();
      this.paused = false;

      for (let i = 0; i < 4; i++) {
        setTimeout(()=>{
          console.log("timeout" + i);
          this.wonWave = false;
          this.spawnEnemyRow(i);
        }, 1000 + 300*i);
      }
    }, 2000);
  }

  winWave() {
    this.wonWave = true;
    this.currentWave += 1;

    this.enemies = [];
    this.enemyRows = [];

    setTimeout(()=>{
      // this.paused = true;
      this.startWave(this.currentWave);
    }, 1000);
  }

  spawnEnemyRow(rowNumber: number) {
    let enemyRow = new EnemyRow(this, 8);
    enemyRow.x = Game.width/2;
    enemyRow.y = 100 + 40*rowNumber;

    let max = 15 - this.currentWave/2;
    if (max < 8) max = 8;
    enemyRow.shootCooldownRange = new Util.Range(3, max);

    let min = 70 + (this.currentWave-1)*10;
    if (min > 200) min = 200;
    max = 200 + (this.currentWave-1)*10;
    if (max > 400) max = 400;
    enemyRow.bulletSpeedRange = new Util.Range(min, max);

    enemyRow.alpha = 0;
    createjs.Tween.get(enemyRow)
      .to({ alpha: 1 }, 500);

    this.enemyRows.push(enemyRow);
    Game.addChild(enemyRow);

    this.enemyShootCheck();
  }

  addEnemy(enemy: Enemy) {
    this.enemies.push(enemy);
    Game.addChild(enemy);
  }

  killEnemy(enemy: Enemy) {
    this.comboCounter++;
    this.comboCooldown = 2;

    this.score += Util.calculateComboPoints(this.comboCounter, enemy.baseScore);

    this.enemies = this.enemies.filter(e => e != enemy);
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

  checkCollisions() {
    // Check if player hits an enemy
    for(let enemy of this.enemies) {
      if (!enemy.alive) continue;

      if (this.player.collides(enemy) && this.player.hit(1)) {
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

          if (enemy.collides(bullet)) {
            if (enemy.hit(bullet.damage)) {
              bullet.kill();
            }
          }
        }
      }
      // Check if an Enemy shot down the Player
      else if (bullet.shooter instanceof Enemy) {
        if (this.player.collides(bullet)) {
          if (this.player.hit(bullet.damage)) {
            bullet.kill();
          }
        }
      }
    }
  }

  /**
   Enables shooting only for enemies that are in the first row in each column.
   Basically, only those enemies can shoot that don't have any enemies below.
  */
  enemyShootCheck() {
    for (let enemy of this.enemies) {
      enemy.shootEnabled = false;
    }

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
}

export = PlayState;
