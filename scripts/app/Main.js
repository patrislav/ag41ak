define(["require", "exports", "jquery", "./Game", "./states/PreloadState", "./states/MenuState", "./states/PlayState", "./states/GameOverState"], function (require, exports, $, Game, PreloadState, MenuState, PlayState, GameOverState) {
    "use strict";
    Game.states = [
        new PreloadState(),
        new MenuState(),
        new PlayState(),
        new GameOverState(),
    ];
    Game.setup($('#game-canvas')[0]);
});
