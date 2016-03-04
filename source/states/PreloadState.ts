
import $ = require('jquery');
import State = require('../State');
import Util = require('../Util');
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

    this.loadQueue.loadManifest(Util.getUrl("assets/manifest.json"));
    this.loadQueue.on("complete", ()=>(that.handleComplete()));
    createjs.Sound.alternateExtensions = ["wav", "mp3"];
    this.loadQueue.installPlugin(<any>createjs.Sound);
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
