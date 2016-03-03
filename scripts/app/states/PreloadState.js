var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../State', '../Util', '../Game'], function (require, exports, State, Util, Game) {
    "use strict";
    var PreloadState = (function (_super) {
        __extends(PreloadState, _super);
        function PreloadState() {
            _super.call(this);
            this.name = "PreloadState";
            this.loadQueue = new createjs.LoadQueue(true);
        }
        PreloadState.prototype.enter = function () {
            var that = this;
            console.log(Util.getUrl("assets/manifest.json"));
            this.loadQueue.loadManifest(Util.getUrl("assets/manifest.json"));
            this.loadQueue.on("complete", function () { return (that.handleComplete()); });
            createjs.Sound.alternateExtensions = ["wav", "mp3"];
            this.loadQueue.installPlugin(createjs.Sound);
        };
        PreloadState.prototype.exit = function () {
        };
        PreloadState.prototype.handleComplete = function () {
            for (var _i = 0, _a = this.loadQueue.getItems(false); _i < _a.length; _i++) {
                var asset = _a[_i];
                if (asset['item']['type'] != 'manifest') {
                    Game.assets[asset['item']['id']] = asset['result'];
                }
            }
            Game.nextState();
        };
        return PreloadState;
    }(State));
    return PreloadState;
});
