/**
 * Util.ts
 *
 * Small utilities module.
 */
define(["require", "exports"], function (require, exports) {
    var Vector2 = (function () {
        function Vector2(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Vector2.prototype.set = function (_x, _y) {
            this.x = _x;
            this.y = _y;
        };
        return Vector2;
    })();
    exports.Vector2 = Vector2;
    function randomFloat(min, max) {
        return Math.random() * (max - min + 1) + min;
    }
    exports.randomFloat = randomFloat;
    function randomInteger(min, max) {
        return Math.floor(randomFloat(min, max));
    }
    exports.randomInteger = randomInteger;
    function computeVelocity(velocity, acceleration, drag, max, elapsed) {
        if (acceleration != 0) {
            velocity += acceleration * elapsed;
        }
        else if (drag != 0) {
            drag *= elapsed;
            if (velocity - drag > 0) {
                velocity -= drag;
            }
            else if (velocity + drag < 0) {
                velocity += drag;
            }
            else {
                velocity = 0;
            }
        }
        if (velocity != 0 && max != 0) {
            if (velocity > max) {
                velocity = max;
            }
            else if (velocity < -max) {
                velocity = -max;
            }
        }
        return velocity;
    }
    exports.computeVelocity = computeVelocity;
});
//# sourceMappingURL=Util.js.map