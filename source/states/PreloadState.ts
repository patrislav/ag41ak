
import $ = require('jquery');
import State = require('../State');
import Game = require('../Game');

class PreloadState extends State {
  name: string = "PreloadState";

  loadQueue: createjs.LoadQueue;

  constructor() {
    super();
    this.loadQueue = new createjs.LoadQueue(true);
  }

  enter(): void {
    let that = this;

    this.loadQueue.loadManifest("../../../assets/manifest.json");
    this.loadQueue.on("complete", ()=>(that.handleComplete()));
  }

  exit(): void {

  }

  handleComplete(): void {
    for(let asset of this.loadQueue.getItems(false)) {
      if (asset['item']['type'] != 'manifest') {
        Game.assets[asset['item']['id']] = asset['result'];
      }
    }

    Game.nextState();
  }
}

export = PreloadState;
