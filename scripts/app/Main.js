define(["require", "exports", "jquery", "./Game", "./states/PreloadState", "./states/MenuState", "./states/PlayState"], function (require, exports, $, Game, PreloadState, MenuState, PlayState) {
    Game.states = [
        new PreloadState(),
        new MenuState(),
        new PlayState()
    ];
    Game.setup($('#game-canvas')[0]);
});
//# sourceMappingURL=Main.js.map