var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../Entity', '../Game', '../Util', './EnemyBullet'], function (require, exports, Entity, Game, Util, EnemyBullet) {
    "use strict";
    var Enemy = (function (_super) {
        __extends(Enemy, _super);
        function Enemy(state, x, y) {
            _super.call(this, state);
            this.shootCooldown = Util.randomFloat(1, 5);
            if (x)
                this.x = x;
            if (y)
                this.y = y;
            this.bitmap = new createjs.Bitmap(Game.assets['alien1-1']);
            this.regX = this.bitmap.image.width / 2;
            this.regY = this.bitmap.image.height / 2;
            this.addChild(this.bitmap);
            this.health = 2;
            this.shootEnabled = false;
            this.enableUpdate();
        }
        Enemy.prototype.update = function (event) {
            _super.prototype.update.call(this, event);
            var deltaTime = event.delta / 1000;
            if (!this.state.paused && this.alive && this.shootEnabled) {
                this.shootCooldown -= deltaTime;
                if (this.shootCooldown < 0) {
                    var bullet = this.state.recycleEnemyBullet();
                    if (bullet) {
                        bullet.reset();
                        bullet.setShooter(this);
                    }
                    else {
                        bullet = new EnemyBullet(this.state, this);
                        this.state.addBullet(bullet);
                    }
                    this.shootCooldown = Util.randomFloat(3, 12);
                }
            }
        };
        Enemy.prototype.hit = function (damage) {
            createjs.Sound.play("hurt-1", { volume: 1 });
            return _super.prototype.hit.call(this, damage);
        };
        Enemy.prototype.kill = function () {
            _super.prototype.kill.call(this);
            this.state.enemyShootCheck();
            createjs.Sound.play("boom-1", { volume: 1 });
        };
        Enemy.prototype.getDisplayObject = function () {
            return this.bitmap;
        };
        Enemy.SIZE = 50;
        return Enemy;
    }(Entity));
    return Enemy;
});
