var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './Util', "easel"], function (require, exports, Util) {
    "use strict";
    var Entity = (function (_super) {
        __extends(Entity, _super);
        function Entity(state) {
            var _this = this;
            _super.call(this);
            this.state = state;
            this.reset();
            this.updateHandler = function (event) { return (_this.update(event)); };
        }
        Entity.prototype.reset = function () {
            this.acceleration = new Util.Vector2();
            this.velocity = new Util.Vector2();
            this.maxVelocity = new Util.Vector2();
            this.drag = new Util.Vector2();
            this.invulnerable = false;
            this.revive();
            this.localCollider = undefined;
        };
        Entity.prototype.getDisplayObject = function () {
            return null;
        };
        Entity.prototype.updateMotion = function (deltaTime) {
            if (this.state.paused)
                return;
            var velocityDelta = 0.5 * (Util.computeVelocity(this.velocity.x, this.acceleration.x, this.drag.x, this.maxVelocity.x, deltaTime) - this.velocity.x);
            this.velocity.x += velocityDelta;
            var delta = this.velocity.x * deltaTime;
            this.velocity.x += velocityDelta;
            this.x += delta;
            velocityDelta = 0.5 * (Util.computeVelocity(this.velocity.y, this.acceleration.y, this.drag.y, this.maxVelocity.y, deltaTime) - this.velocity.y);
            this.velocity.y += velocityDelta;
            delta = this.velocity.y * deltaTime;
            this.velocity.y += velocityDelta;
            this.y += delta;
        };
        Entity.prototype.getCollider = function () {
            var rect = (this.localCollider ? this.localCollider : this.getBounds()).clone();
            var point = this.localToGlobal(rect.x, rect.y);
            rect.x = point.x;
            rect.y = point.y;
            return rect;
        };
        Entity.prototype.hit = function (damage) {
            if (this.invulnerable)
                return false;
            this.health -= damage;
            if (this.health <= 0) {
                this.kill();
            }
            return true;
        };
        Entity.prototype.kill = function () {
            this.health = 0;
            this.alive = false;
            this.visible = false;
            if (this.parent)
                createjs.Ticker.removeEventListener("tick", this.updateHandler);
        };
        Entity.prototype.revive = function (health) {
            if (health === void 0) { health = undefined; }
            this.health = health;
            this.alive = true;
            this.visible = true;
            if (this.parent)
                createjs.Ticker.addEventListener("tick", this.updateHandler);
        };
        Entity.prototype.enableUpdate = function () {
            var _this = this;
            this.addEventListener("added", function () { return (_this.added()); });
            this.addEventListener("removed", function () { return (_this.removed()); });
        };
        Entity.prototype.added = function () {
            createjs.Ticker.addEventListener("tick", this.updateHandler);
        };
        Entity.prototype.removed = function () {
            createjs.Ticker.removeEventListener("tick", this.updateHandler);
        };
        Entity.prototype.update = function (event) {
        };
        Entity.prototype.collides = function (obj) {
            if (!this.alive || !obj.alive)
                return false;
            if (this.getCollider().intersects(obj.getCollider())) {
                return true;
            }
            return false;
        };
        return Entity;
    }(createjs.Container));
    return Entity;
});
