
/// <amd-dependency path="easel"/>

import $ = require("jquery");
import Game = require("./Game");

let game = new Game();

let canvas = $('#game-canvas')[0];
let stage = new createjs.Stage(canvas);

let circle = new createjs.Shape();
circle.graphics.beginFill("#ff0000").drawCircle(0, 0, 50);
circle.x = 100;
circle.y = 100;
stage.addChild(circle);

stage.update();
