
import Game = require("./Game");

class State {
  name: string;

  enter(): void {}
  update(event: createjs.Event): void {}

  exit(): void {
    Game.stage.removeAllChildren();
  }
}

export = State;
