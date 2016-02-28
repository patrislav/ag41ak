
import $ = require('jquery');
import _ = require('underscore');
import State = require('../State');
import Game = require('../Game');
import Entity = require('../Entity');
import Player = require('../entities/Player');
import Enemy = require('../entities/Enemy');
import Bullet = require('../entities/Bullet');

class PlayState extends State {
  name: string = "PlayState";

  player: Player;
  enemies: Enemy[] = [];

  bullets: Bullet[] = [];

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
    this.player.state = this;
    Game.addChild(this.player);

    let enemy = new Enemy();
    enemy.x = width/2;
    enemy.y = 100;
    Game.addChild(enemy);
    this.enemies.push(enemy);
  }

  exit(): void {

  }

  update(event: createjs.Event): void {
    $('.thing').text("FPS: " + Math.round(createjs.Ticker.getMeasuredFPS()));

    let deltaTime = event.delta / 1000; // event.delta is in ms
  }

  collides(objA: Entity, objB: Entity, callback?: (a: Entity, b: Entity)=>any) {
    let point1 = objA.localToGlobal(objA.getDisplayObject().x, objA.getDisplayObject().y);
    let rect1 = new createjs.Rectangle(point1.x, point1.y, objA.getBounds().width, objA.getBounds().height);
    let point2 = objB.localToGlobal(objB.getDisplayObject().x, objB.getDisplayObject().y);
    let rect2 = new createjs.Rectangle(point2.x, point2.y, objB.getBounds().width, objB.getBounds().height);

		if (rect1.intersects(rect2)) {
      if (callback) {
        callback.call(objA, objB);
      }
    }
  }
}

export = PlayState;
