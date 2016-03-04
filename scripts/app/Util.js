define(["require", "exports"], function (require, exports) {
    "use strict";
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
    }());
    exports.Vector2 = Vector2;
    var Range = (function () {
        function Range(min, max) {
            if (min === void 0) { min = 0; }
            if (max === void 0) { max = 0; }
            this.min = min;
            this.max = max;
        }
        Range.prototype.set = function (min, max) {
            this.min = min;
            this.max = max;
        };
        Range.prototype.randomFloat = function () {
            return randomFloat(this.min, this.max);
        };
        Range.prototype.randomInteger = function () {
            return randomInteger(this.min, this.max);
        };
        return Range;
    }());
    exports.Range = Range;
    function getUrl(path) {
        var url = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1);
        if (path) {
            url += path;
        }
        return url;
    }
    exports.getUrl = getUrl;
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
    function calculateComboPoints(comboCounter, baseScore) {
        return baseScore * comboCounter;
    }
    exports.calculateComboPoints = calculateComboPoints;
});
