
import $ = require("jquery");
import Game = require("./Game");

// Import and register all the states
import PreloadState = require("./states/PreloadState");
import MenuState = require("./states/MenuState");
import PlayState = require("./states/PlayState");

Game.states = [
  new PreloadState(),
  new MenuState(),
  new PlayState()
];

Game.setup($('#game-canvas')[0]);
