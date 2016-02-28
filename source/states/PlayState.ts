
import $ = require('jquery');
import State = require('../State');
import Game = require('../Game');
import Player = require('../entities/Player');
import Bullet = require('../entities/Bullet');

class PlayState extends State {
  name: string = "PlayState";

  player: Player;

  bullets: Bullet[];

  constructor() {
    super();
  }

  enter(): void {
    let width = Game.stage.canvas['width'];
    let height = Game.stage.canvas['height'];

    let background = new createjs.Shape();
    background.graphics.beginFill("#DB7937").drawRect(0, 0, width, height);
    Game.stage.addChild(background);

    this.player = new Player();
    this.player.x = width/2;
    this.player.y = height-100;
    Game.addChild(this.player);
  }

  exit(): void {

  }

  update(event: createjs.Event): void {
    $('.thing').text("FPS: " + Math.round(createjs.Ticker.getMeasuredFPS()));

    let deltaTime = event.delta / 1000; // event.delta is in ms
  }
}

export = PlayState;
