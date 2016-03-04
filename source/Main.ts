
import $ = require("jquery");
import Game = require("./Game");

// Import and register all the states
import PreloadState = require("./states/PreloadState");
import MenuState = require("./states/MenuState");
import PlayState = require("./states/PlayState");
import GameOverState = require("./states/GameOverState");

Game.states = [
  new PreloadState(),
  new MenuState(),
  new PlayState(),
  new GameOverState(),
];

Game.setup($('#game-canvas')[0]);
