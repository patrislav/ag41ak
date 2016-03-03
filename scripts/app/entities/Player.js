var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../Entity', '../Game', './PlayerBullet'], function (require, exports, Entity, Game, PlayerBullet) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(state) {
            _super.call(this, state);
            this.shootCooldown = 0;
            this.invulnCooldown = 0;
            this.bitmap = new createjs.Bitmap(Game.assets['player']);
            this.regX = this.bitmap.image.width / 2;
            this.regY = this.bitmap.image.height / 2;
            this.addChild(this.bitmap);
            this.drag.set(Player.SPEEDX * 6, Player.SPEEDY * 6);
            this.maxVelocity.set(Player.SPEEDX, Player.SPEEDY);
            this.acceleration.x = 0;
            this.acceleration.y = 0;
            this.health = 3;
            this.localCollider = new createjs.Rectangle(23, 41, 48, 44);
            this.enableUpdate();
        }
        Player.prototype.update = function (event) {
            _super.prototype.update.call(this, event);
            var deltaTime = event.delta / 1000;
            if (!this.state.paused) {
                this.shootCooldown -= deltaTime;
                if (this.shootCooldown < 0)
                    this.shootCooldown = 0;
                this.handleInput();
                this.updateMotion(deltaTime);
                if (this.invulnerable) {
                    this.invulnCooldown -= deltaTime;
                    if (this.invulnCooldown <= 0) {
                        this.invulnerable = false;
                        this.invulnCooldown = 0;
                    }
                }
            }
        };
        Player.prototype.handleInput = function () {
            this.acceleration.x = 0;
            this.acceleration.y = 0;
            if (Game.anyPressed([37, 65])) {
                this.acceleration.x -= this.drag.x;
            }
            if (Game.anyPressed([39, 68])) {
                this.acceleration.x += this.drag.x;
            }
            if (Game.anyPressed([38])) {
                this.acceleration.y -= this.drag.y;
            }
            if (Game.anyPressed([40])) {
                this.acceleration.y += this.drag.y;
            }
            if (Game.anyPressed([32])) {
                if (this.shootCooldown <= 0) {
                    var bullet = this.state.recyclePlayerBullet();
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
        };
        Player.prototype.hit = function (damage) {
            var res = _super.prototype.hit.call(this, damage);
            if (res && this.alive) {
                this.invulnerable = true;
                this.invulnCooldown = Player.INVULN_TIME;
                this.invulnerabilityEffect();
                createjs.Sound.play("hurt-1", { volume: 1 });
            }
            return res;
        };
        Player.prototype.kill = function () {
            _super.prototype.kill.call(this);
            createjs.Sound.play("boom-2", { volume: 1 });
            createjs.Sound.play("lose-1", { volume: 1, delay: 100 });
        };
        Player.prototype.invulnerabilityEffect = function () {
            var _this = this;
            if (!this.invulnerable) {
                this.alpha = 1;
                return;
            }
            if (this.alpha > 0.5) {
                createjs.Tween.get(this)
                    .to({ alpha: 0.25 }, 400)
                    .call(function () { return _this.invulnerabilityEffect(); });
            }
            else {
                createjs.Tween.get(this)
                    .to({ alpha: 0.90 }, 400)
                    .wait(200)
                    .call(function () { return _this.invulnerabilityEffect(); });
            }
        };
        Player.prototype.getDisplayObject = function () {
            return this.bitmap;
        };
        Player.SPEEDX = 300;
        Player.SPEEDY = 200;
        Player.SHOOT_COOLDOWN = 0.3;
        Player.INVULN_TIME = 4;
        return Player;
    })(Entity);
    return Player;
});
//# sourceMappingURL=Player.js.map