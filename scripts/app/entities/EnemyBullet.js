var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './Bullet'], function (require, exports, Bullet) {
    "use strict";
    var EnemyBullet = (function (_super) {
        __extends(EnemyBullet, _super);
        function EnemyBullet(state, enemy) {
            _super.call(this, state);
            this.setShooter(enemy);
        }
        EnemyBullet.prototype.reset = function () {
            _super.prototype.reset.call(this);
            this.damage = 1;
            this.velocity.set(0, EnemyBullet.SPEED);
        };
        EnemyBullet.prototype.render = function () {
            this.shape = new createjs.Shape();
            this.shape.graphics.beginFill('#ffffff').drawCircle(EnemyBullet.RADIUS, EnemyBullet.RADIUS, EnemyBullet.RADIUS);
            this.shape.setBounds(0, 0, EnemyBullet.RADIUS * 2, EnemyBullet.RADIUS * 2);
            this.addChild(this.shape);
            this.regX = Bullet.WIDTH / 2;
            this.regY = Bullet.HEIGHT / 2;
        };
        EnemyBullet.prototype.setShooter = function (enemy) {
            _super.prototype.setShooter.call(this, enemy);
            var position = enemy.parent.localToGlobal(enemy.x, enemy.y);
            this.x = position.x;
            this.y = position.y + 10;
        };
        EnemyBullet.prototype.setSpeed = function (speed) {
            this.velocity.y = speed;
        };
        EnemyBullet.RADIUS = 3;
        return EnemyBullet;
    }(Bullet));
    return EnemyBullet;
});
