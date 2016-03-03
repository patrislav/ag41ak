var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './Bullet'], function (require, exports, Bullet) {
    var PlayerBullet = (function (_super) {
        __extends(PlayerBullet, _super);
        function PlayerBullet(state, player) {
            _super.call(this, state);
            this.setShooter(player);
        }
        PlayerBullet.prototype.reset = function () {
            _super.prototype.reset.call(this);
            this.damage = 1;
            this.velocity.set(0, -PlayerBullet.SPEED);
        };
        PlayerBullet.prototype.setShooter = function (player) {
            _super.prototype.setShooter.call(this, player);
            this.x = player.x;
            this.y = player.y - 50;
        };
        return PlayerBullet;
    })(Bullet);
    return PlayerBullet;
});
//# sourceMappingURL=PlayerBullet.js.map