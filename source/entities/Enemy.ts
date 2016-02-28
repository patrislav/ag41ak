
import Entity = require('../Entity');
import Game = require('../Game');
import Util = require('../Util');
import PlayState = require('../states/PlayState');

class Enemy extends Entity {

  static SIZE = 50;

  state: PlayState;
  shape: createjs.Shape;

  constructor(state: PlayState) {
    super(state);

    this.shape = new createjs.Shape();
    this.shape.graphics.beginFill('#000000').drawRect(0, 0, Enemy.SIZE, Enemy.SIZE);
    this.shape.setBounds(0, 0, Enemy.SIZE, Enemy.SIZE);
    this.addChild(this.shape);

    this.regX = Enemy.SIZE/2;
    this.regY = Enemy.SIZE/2;

    this.updateHandler = (event: createjs.TickerEvent)=> ( this.update(event) );

    this.addEventListener("added", ()=>( this.added() ));
    this.addEventListener("removed", ()=>( this.removed() ));
  }

  added() {
    createjs.Ticker.addEventListener("tick", this.updateHandler);
  }

  removed() {
    createjs.Ticker.removeEventListener("tick", this.updateHandler);
  }

  update(event: createjs.TickerEvent) {
    let deltaTime = event.delta / 1000; // convert to seconds
  }

  getDisplayObject(): createjs.DisplayObject {
    return this.shape;
  }

}

export = Enemy;
