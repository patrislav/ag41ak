var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'jquery', '../State', '../Game', '../Shared'], function (require, exports, $, State, Game, Shared) {
    "use strict";
    var MenuState = (function (_super) {
        __extends(MenuState, _super);
        function MenuState() {
            _super.call(this);
            this.name = "MenuState";
            this.inited = false;
        }
        MenuState.prototype.enter = function () {
            _super.prototype.enter.call(this);
            var width = Game.stage.canvas['width'];
            var height = Game.stage.canvas['height'];
            var background = new createjs.Shape();
            background.graphics.beginFill("#DB7937").drawRect(0, 0, width, height);
            Game.stage.addChild(background);
            this.flashingEffect(this.$subtitle);
            this.$ui.show();
            if (!Shared.themeMusic) {
                Shared.themeMusic = createjs.Sound.play("theme-1", { volume: 0.35, loop: -1 });
            }
        };
        MenuState.prototype.exit = function () {
            _super.prototype.exit.call(this);
            this.$ui.hide();
        };
        MenuState.prototype.update = function (event) {
            var deltaTime = event.delta / 1000;
            if (Shared.themeMusic.playState != createjs.Sound.PLAY_SUCCEEDED) {
                Shared.themeMusic.play({ volume: 0.35, loop: -1 });
            }
            if (Game.anyPressed([13, 32])) {
                Game.nextState();
            }
        };
        MenuState.prototype.initUI = function () {
            this.$ui = $("<div/>").appendTo(Game.$ui);
            this.$ui.addClass('game-ui-state-menu');
            this.$title = $("<h1/>").appendTo(this.$ui);
            this.$title.text("AG41AK");
            this.$subtitle = $("<h2/>").appendTo(this.$ui);
            this.$subtitle.html("Press <kbd>ENTER</kbd> or <kbd>SPACE</kbd> to <em>ENTER SPACE</em>.");
            _super.prototype.initUI.call(this);
        };
        MenuState.prototype.flashingEffect = function ($el) {
            var _this = this;
            if (Game.currentState != this)
                return;
            if (parseFloat($el.css('opacity')) > 0.5) {
                $el.delay(700).animate({
                    opacity: 0.30
                }, 500, "linear", function () { return _this.flashingEffect($el); });
            }
            else {
                $el.animate({
                    opacity: 1.00
                }, 500, "linear", function () { return _this.flashingEffect($el); });
            }
        };
        return MenuState;
    }(State));
    return MenuState;
});
