
import Game = require("./Game");

class State {
  name: string;

  uiInited: boolean = false;

  enter(): void {
    if (!this.uiInited) {
      this.initUI();
    }
  }

  update(event: createjs.Event): void {}

  exit(): void {
    Game.stage.removeAllChildren();
  }

  initUI(): void {
    this.uiInited = true;
  }
}

export = State;
