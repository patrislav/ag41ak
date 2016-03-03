var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../Entity', './Enemy', '../Game'], function (require, exports, Entity, Enemy, Game) {
    var EnemyRow = (function (_super) {
        __extends(EnemyRow, _super);
        function EnemyRow(state, numberOfEnemies) {
            _super.call(this, state);
            this.state = state;
            this.initialCount = numberOfEnemies;
            this.enableUpdate();
        }
        EnemyRow.prototype.added = function () {
            _super.prototype.added.call(this);
            for (var i = 0; i < this.initialCount; i++) {
                var enemy = new Enemy(this.state);
                enemy.x = enemy.regX + i * (enemy.getBounds().width + 10);
                enemy.y = enemy.regY;
                enemy.row = this;
                this.addChild(enemy);
                this.state.enemies.push(enemy);
            }
            this.regX = this.getBounds().width / 2;
            this.regY = this.getBounds().height / 2;
            this.speed = EnemyRow.SPEED;
            this.acceleration.set(this.speed, 0);
            this.maxVelocity.set(this.speed, 0);
        };
        EnemyRow.prototype.removed = function () {
            _super.prototype.removed.call(this);
            this.removeAllChildren();
        };
        EnemyRow.prototype.update = function (event) {
            _super.prototype.update.call(this, event);
            var deltaTime = event.delta / 1000;
            if (this.x - this.regX < this.state.borderSize) {
                this.acceleration.x = this.speed;
            }
            else if (this.x + this.regX > Game.width - this.state.borderSize) {
                this.acceleration.x = -this.speed;
            }
            this.updateMotion(deltaTime);
        };
        EnemyRow.SPEED = 50;
        return EnemyRow;
    })(Entity);
    return EnemyRow;
});
//# sourceMappingURL=EnemyRow.js.map