define(["require", "exports", "jquery", "./Game", "./states/PreloadState", "./states/MenuState", "./states/PlayState"], function (require, exports, $, Game, PreloadState, MenuState, PlayState) {
    "use strict";
    Game.states = [
        new PreloadState(),
        new MenuState(),
        new PlayState()
    ];
    Game.setup($('#game-canvas')[0]);
});
