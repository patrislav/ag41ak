var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../Entity'], function (require, exports, Entity) {
    var Bullet = (function (_super) {
        __extends(Bullet, _super);
        function Bullet(state) {
            _super.call(this, state);
        }
        Bullet.prototype.reset = function () {
            _super.prototype.reset.call(this);
            this.enableUpdate();
            this.lifetime = 10;
            this.render();
            this.damage = 0;
        };
        Bullet.prototype.render = function () {
            this.shape = new createjs.Shape();
            this.shape.graphics.beginFill('#ffffff').drawRect(0, 0, Bullet.WIDTH, Bullet.HEIGHT);
            this.shape.setBounds(0, 0, Bullet.WIDTH, Bullet.HEIGHT);
            this.addChild(this.shape);
            this.regX = Bullet.WIDTH / 2;
            this.regY = Bullet.HEIGHT / 2;
        };
        Bullet.prototype.setShooter = function (shooter) {
            this.shooter = shooter;
        };
        Bullet.prototype.update = function (event) {
            _super.prototype.update.call(this, event);
            var deltaTime = event.delta / 1000;
            if (!this.state.paused)
                this.updateMotion(deltaTime);
            this.lifetime -= deltaTime;
            if (this.lifetime <= 0) {
                this.kill();
            }
        };
        Bullet.prototype.getDisplayObject = function () {
            return this.shape;
        };
        Bullet.SPEED = 350;
        Bullet.WIDTH = 4;
        Bullet.HEIGHT = 12;
        return Bullet;
    })(Entity);
    return Bullet;
});
//# sourceMappingURL=Bullet.js.map