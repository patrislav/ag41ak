
import $ = require("jquery");
import Game = require("./Game");

// Import and register all the states
import PreloadState = require("./states/PreloadState");
import PlayState = require("./states/PlayState");

Game.states = [
  new PreloadState(),
  new PlayState()
];

Game.setup($('#game-canvas')[0]);
