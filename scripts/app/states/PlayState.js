var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'jquery', 'underscore', '../State', '../Game', '../Shared', '../entities/Player', '../entities/Enemy', '../entities/EnemyRow', '../entities/PlayerBullet', '../entities/EnemyBullet'], function (require, exports, $, _, State, Game, Shared, Player, Enemy, EnemyRow, PlayerBullet, EnemyBullet) {
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
            this.player = new Player(this);
            this.player.x = Game.width / 2;
            this.player.y = Game.height - 100;
            Game.addChild(this.player);
            if (!Shared.themeMusic) {
                Shared.themeMusic = createjs.Sound.play("theme-1", { volume: 0.35, loop: -1 });
            }
            createjs.Sound.play("start-1");
            this.$ui.show();
            this.currentWave = 1;
            this.wonWave = false;
            this.startWave(this.currentWave);
        };
        PlayState.prototype.exit = function () {
            _super.prototype.exit.call(this);
            this.player = undefined;
            this.enemies = [];
            this.bullets = [];
            this.enemyRows = [];
            this.wonWave = false;
            this.$ui.hide();
        };
        PlayState.prototype.update = function (event) {
            // $('.fps-number').text(Math.round(createjs.Ticker.getMeasuredFPS()));
            // $('.lives-number').text(this.player.health);
            this.$lives.find('span').text(this.player.health);
            if (Shared.themeMusic.playState != createjs.Sound.PLAY_SUCCEEDED) {
                Shared.themeMusic.play({ volume: 0.35, loop: -1 });
            }
            var deltaTime = event.delta / 1000;
            if (Game.anyPressed([8, 27])) {
                Game.previousState();
            }
            for (var _i = 0, _a = this.enemies; _i < _a.length; _i++) {
                var enemy = _a[_i];
                if (!enemy.alive)
                    continue;
                if (this.collides(this.player, enemy) && this.player.hit(1)) {
                    enemy.kill();
                    this.removeEnemy(enemy);
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
                        if (this.collides(enemy, bullet)) {
                            if (enemy.hit(bullet.damage)) {
                                if (!enemy.alive)
                                    this.removeEnemy(enemy);
                                bullet.kill();
                            }
                        }
                    }
                }
                else if (bullet.shooter instanceof Enemy) {
                    if (this.collides(this.player, bullet)) {
                        if (this.player.hit(bullet.damage)) {
                            bullet.kill();
                        }
                    }
                }
            }
            if (this.enemies.length == 0 && !this.wonWave) {
                this.winWave();
            }
        };
        PlayState.prototype.initUI = function () {
            this.$ui = $("<div/>").appendTo(Game.$ui);
            this.$ui.addClass('game-ui-state-play');
            this.$lives = $("<div/>").appendTo(this.$ui);
            this.$lives.html("Lives: <span></span>");
            this.$lives.addClass('game-play-lives');
            this.$waveMsg = $("<div/>").appendTo(this.$ui);
            this.$waveMsg.addClass('game-play-wavemsg');
            $("<h1/>").appendTo(this.$waveMsg);
            $("<h2/>").appendTo(this.$waveMsg);
        };
        PlayState.prototype.startWave = function (wave) {
            var _this = this;
            this.$waveMsg.find('h1').text("Wave " + wave);
            this.$waveMsg.find('h2').text("Are you ready?");
            this.$waveMsg.fadeIn();
            for (var _i = 0, _a = this.enemyRows; _i < _a.length; _i++) {
                var row = _a[_i];
                Game.removeChild(row);
            }
            this.enemies = [];
            this.enemyRows = [];
            for (var i = 0; i < 4; i++) {
                var enemyRow = new EnemyRow(this, 8);
                enemyRow.x = Game.width / 2;
                enemyRow.y = 50 + 50 * i;
                this.enemyRows.push(enemyRow);
                Game.addChild(enemyRow);
            }
            this.enemyShootCheck();
            this.player.x = Game.width / 2;
            this.player.y = Game.height - 100;
            setTimeout(function () {
                _this.$waveMsg.fadeOut();
                _this.paused = false;
                _this.wonWave = false;
            }, 2000);
        };
        PlayState.prototype.winWave = function () {
            var _this = this;
            this.wonWave = true;
            this.currentWave += 1;
            this.enemies = [];
            this.enemyRows = [];
            for (var _i = 0, _a = this.bullets; _i < _a.length; _i++) {
                var bullet = _a[_i];
                bullet.kill();
            }
            setTimeout(function () {
                _this.paused = true;
                _this.startWave(_this.currentWave);
            }, 1000);
        };
        PlayState.prototype.addEnemy = function (enemy) {
            this.enemies.push(enemy);
            Game.addChild(enemy);
        };
        PlayState.prototype.removeEnemy = function (enemy) {
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
        PlayState.prototype.enemyShootCheck = function () {
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
        PlayState.prototype.collides = function (objA, objB) {
            return objA.collides(objB);
        };
        return PlayState;
    })(State);
    return PlayState;
});
//# sourceMappingURL=PlayState.js.map