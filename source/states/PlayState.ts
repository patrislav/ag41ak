
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

    if (!Shared.themeMusic) {
      Shared.themeMusic = createjs.Sound.play("theme-1", { volume: 0.35, loop: -1 });
    }

    createjs.Sound.play("start-1");
    this.$ui.show();

    this.currentWave = 1;
    this.wonWave = false;
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
        this.removeEnemy(enemy);

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
              if (!enemy.alive) this.removeEnemy(enemy);

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


    // Check for wave win
    if (this.enemies.length == 0 && !this.wonWave) {
      this.winWave();
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

  startWave(wave: number) {
    this.$waveMsg.find('h1').text("Wave " + wave);
    this.$waveMsg.find('h2').text("Are you ready?");
    this.$waveMsg.fadeIn();

    for (let row of this.enemyRows) {
      Game.removeChild(row);
    }

    this.enemies = [];
    this.enemyRows = [];

    for (let i = 0; i < 4; i++) {
      let enemyRow = new EnemyRow(this, 8);
      enemyRow.x = Game.width/2;
      enemyRow.y = 50 + 50*i;
      this.enemyRows.push(enemyRow);
      Game.addChild(enemyRow);
    }

    this.enemyShootCheck();

    this.player.x = Game.width/2;
    this.player.y = Game.height-100;

    setTimeout(()=>{
      this.$waveMsg.fadeOut();
      this.paused = false;
      this.wonWave = false;
    }, 2000);
  }

  winWave() {
    this.wonWave = true;
    this.currentWave += 1;

    this.enemies = [];
    this.enemyRows = [];

    for (let bullet of this.bullets) {
      bullet.kill();
    }

    setTimeout(()=>{
      this.paused = true;
      this.startWave(this.currentWave);
    }, 1000);
  }

  addEnemy(enemy: Enemy) {
    this.enemies.push(enemy);
    Game.addChild(enemy);
  }

  removeEnemy(enemy: Enemy) {
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
