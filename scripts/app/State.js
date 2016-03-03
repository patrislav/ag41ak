define(["require", "exports", "./Game"], function (require, exports, Game) {
    var State = (function () {
        function State() {
            this.uiInited = false;
            this.paused = false;
        }
        State.prototype.enter = function () {
            if (!this.uiInited) {
                this.initUI();
            }
        };
        State.prototype.update = function (event) { };
        State.prototype.exit = function () {
            Game.stage.removeAllChildren();
        };
        State.prototype.initUI = function () {
            this.uiInited = true;
        };
        return State;
    })();
    return State;
});
//# sourceMappingURL=State.js.map