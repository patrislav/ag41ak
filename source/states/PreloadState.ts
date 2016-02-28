
import $ = require('jquery');
import State = require('../State');
import Game = require('../Game');

class PreloadState implements State {
  name: string = "PreloadState";

  loadQueue: createjs.LoadQueue;

  constructor() {
    this.loadQueue = new createjs.LoadQueue(true);
  }

  enter(): void {
    console.log("Preload - enter");
    this.loadQueue.loadManifest("../../../assets/manifest.json");
    this.loadQueue.on("complete", this.handleComplete);
  }

  exit(): void {
    console.log("Preload - exit");
  }

  handleComplete(): void {
    console.log("Preload - handleComplete");
    Game.nextState();
  }
}

export = PreloadState;
