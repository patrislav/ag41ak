var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'jquery', 'underscore', '../State', '../Game', '../Util', '../Shared', '../entities/Player', '../entities/Enemy', '../entities/EnemyRow', '../entities/PlayerBullet', '../entities/EnemyBullet'], function (require, exports, $, _, State, Game, Util, Shared, Player, Enemy, EnemyRow, PlayerBullet, EnemyBullet) {
    "use strict";
    var PlayState = (function (_super) {
        __extends(PlayState, _super);
        function PlayState() {
            _super.call(this);
            this.name = "PlayState";
            this.borderSize = 50;
            this.enemies = [];
            this.enemyRows = [];
            this.enemyColumns = 8;
            this.bullets = [];
        }
        PlayState.prototype.enter = function () {
            _super.prototype.enter.call(this);
            this.paused = true;
            this.score = 0;
            var background = new createjs.Shape();
            background.graphics.beginFill("#DB7937").drawRect(0, 0, Game.width, Game.height);
            Game.stage.addChild(background);
            this.respawnPoint = new createjs.Point(Game.width / 2, Game.height - 100);
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
        };
        PlayState.prototype.exit = function () {
            _super.prototype.exit.call(this);
            this.player = undefined;
            this.enemies = [];
            this.bullets = [];
            this.enemyRows = [];
            this.wonWave = false;
            Game.lastScore = this.score;
            this.score = 0;
            this.$ui.hide();
        };
        PlayState.prototype.update = function (event) {
            var deltaTime = event.delta / 1000;
            this.updateUI();
            this.checkCollisions();
            this.comboCooldown -= deltaTime;
            if (this.comboCooldown < 0) {
                this.comboCooldown = 0;
                this.comboCounter = 0;
            }
            if (this.enemies.length == 0 && !this.wonWave) {
                this.winWave();
            }
            if (Game.anyPressed([8, 27])) {
                Game.previousState();
            }
        };
        PlayState.prototype.initUI = function () {
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
        };
        PlayState.prototype.updateUI = function () {
            this.$lives.find('span').text(this.player.health);
            this.$score.find('span').text(this.score);
        };
        PlayState.prototype.startWave = function (wave) {
            var _this = this;
            this.comboCounter = 0;
            this.comboCooldown = 0;
            this.$waveMsg.find('h1').text("Wave " + wave);
            this.$waveMsg.find('h2').text("Are you ready?");
            this.$waveMsg.fadeIn();
            for (var _i = 0, _a = this.enemyRows; _i < _a.length; _i++) {
                var row = _a[_i];
                Game.removeChild(row);
            }
            for (var _b = 0, _c = this.bullets; _b < _c.length; _b++) {
                var bullet = _c[_b];
                bullet.kill();
            }
            this.enemies = [];
            this.enemyRows = [];
            setTimeout(function () {
                _this.$waveMsg.fadeOut();
                _this.paused = false;
                var _loop_1 = function(i) {
                    setTimeout(function () {
                        console.log("timeout" + i);
                        _this.wonWave = false;
                        _this.spawnEnemyRow(i);
                    }, 1000 + 300 * i);
                };
                for (var i = 0; i < 4; i++) {
                    _loop_1(i);
                }
            }, 2000);
        };
        PlayState.prototype.winWave = function () {
            var _this = this;
            this.wonWave = true;
            this.currentWave += 1;
            this.enemies = [];
            this.enemyRows = [];
            setTimeout(function () {
                _this.startWave(_this.currentWave);
            }, 1000);
        };
        PlayState.prototype.spawnEnemyRow = function (rowNumber) {
            var enemyRow = new EnemyRow(this, 8);
            enemyRow.x = Game.width / 2;
            enemyRow.y = 100 + 40 * rowNumber;
            var max = 15 - this.currentWave / 2;
            if (max < 8)
                max = 8;
            enemyRow.shootCooldownRange = new Util.Range(3, max);
            var min = 70 + (this.currentWave - 1) * 10;
            if (min > 200)
                min = 200;
            max = 200 + (this.currentWave - 1) * 10;
            if (max > 400)
                max = 400;
            enemyRow.bulletSpeedRange = new Util.Range(min, max);
            enemyRow.alpha = 0;
            createjs.Tween.get(enemyRow)
                .to({ alpha: 1 }, 500);
            this.enemyRows.push(enemyRow);
            Game.addChild(enemyRow);
            this.enemyShootCheck();
        };
        PlayState.prototype.addEnemy = function (enemy) {
            this.enemies.push(enemy);
            Game.addChild(enemy);
        };
        PlayState.prototype.killEnemy = function (enemy) {
            this.comboCounter++;
            this.comboCooldown = 2;
            this.score += Util.calculateComboPoints(this.comboCounter, enemy.baseScore);
            this.enemies = this.enemies.filter(function (e) { return e != enemy; });
        };
        PlayState.prototype.addBullet = function (bullet) {
            this.bullets.push(bullet);
            Game.addChild(bullet);
        };
        PlayState.prototype.recyclePlayerBullet = function () {
            return _.find(this.bullets, function (b) { return b instanceof PlayerBullet && !b.alive; });
        };
        PlayState.prototype.recycleEnemyBullet = function () {
            return _.find(this.bullets, function (b) { return b instanceof EnemyBullet && !b.alive; });
        };
        PlayState.prototype.checkCollisions = function () {
            for (var _i = 0, _a = this.enemies; _i < _a.length; _i++) {
                var enemy = _a[_i];
                if (!enemy.alive)
                    continue;
                if (this.player.collides(enemy) && this.player.hit(1)) {
                    enemy.kill();
                    if (!this.player.alive) {
                        Game.removeChild(this.player);
                    }
                }
            }
            for (var _b = 0, _c = this.bullets; _b < _c.length; _b++) {
                var bullet = _c[_b];
                if (bullet.shooter instanceof Player) {
                    for (var _d = 0, _e = this.enemies; _d < _e.length; _d++) {
                        var enemy = _e[_d];
                        if (!enemy.alive)
                            continue;
                        if (enemy.collides(bullet)) {
                            if (enemy.hit(bullet.damage)) {
                                bullet.kill();
                            }
                        }
                    }
                }
                else if (bullet.shooter instanceof Enemy) {
                    if (this.player.collides(bullet)) {
                        if (this.player.hit(bullet.damage)) {
                            bullet.kill();
                        }
                    }
                }
            }
        };
        PlayState.prototype.enemyShootCheck = function () {
            for (var _i = 0, _a = this.enemies; _i < _a.length; _i++) {
                var enemy = _a[_i];
                enemy.shootEnabled = false;
            }
            for (var c = 0; c < this.enemyColumns; c++) {
                for (var i = this.enemyRows.length - 1; i >= 0; i--) {
                    var enemy = this.enemyRows[i].getChildAt(c);
                    if (enemy.alive) {
                        enemy.shootEnabled = true;
                        break;
                    }
                }
            }
        };
        return PlayState;
    }(State));
    return PlayState;
});
