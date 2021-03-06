
// The AMD dependencies will be available to all files importing this module
/// <amd-dependency path="easel"/>
/// <amd-dependency path="tween"/>
/// <amd-dependency path="sound"/>
/// <amd-dependency path="preload"/>

import _ = require('underscore');
import $ = require("jquery");
import State = require("./State");
import Entity = require("./Entity");
import EnemyRow = require("./entities/EnemyRow");

// Public properties
export let canvas: HTMLElement;
export let stage: createjs.Stage;
export let $ui: JQuery;

export let width: number;
export let height: number;

export let states: State[];
export let currentState: State;

export let assets: Object = {};

export let keys: Object = {};

export let lastScore: number = 0;

let $soundButton: JQuery;

// Public functions
export function setup(_canvas: HTMLElement, _firstStateName?: string): boolean {
  if (!states || states.length == 0) {
    return false;
  }

  canvas = _canvas;
  width = canvas['width'];
  height = canvas['height'];

  stage = new createjs.Stage(canvas);
  $ui = $("<div/>").insertBefore( $(canvas) );
  $ui.addClass('game-ui');

  $soundButton = $("<div/>").appendTo($ui);
  $soundButton.addClass('game-sound-button');

  let $btn = $('<a href="#"/>').appendTo($soundButton);
  $btn.addClass('game-sound-button-on');
  $btn.click(soundButtonClick);

  $btn = $('<a href="#"/>').appendTo($soundButton);
  $btn.addClass('game-sound-button-off');
  $btn.click(soundButtonClick);
  $btn.hide();

  if (_firstStateName) {
    currentState = findState(_firstStateName);
  }
  else {
    currentState = states[0];
  }

  currentState.enter();

  createjs.Ticker.setFPS(40);
  createjs.Ticker.addEventListener("tick", tick);

  return true;
}

function soundButtonClick(event) {
  $(this).parent().find('a').toggle();
  createjs.Sound.muted = !createjs.Sound.muted;
  event.preventDefault();
}

export function registerStates(_states: State[]) {
  states = _states;
}

export function findState(name: string): State {
  return _.find(states, (s) => (s.name == name));
}

export function switchState(newState: State|string): boolean {
  let oldState = currentState;

  if (typeof newState === "string") {
    currentState = findState(<string> newState);
  }
  else {
    currentState = <State> newState;
  }

  if (!currentState) {
    return false;
  }

  oldState.exit();
  currentState.enter();
  return true;
}

export function nextState() {
  let i = states.indexOf(currentState);
  if (states[i+1]) {
    switchState(states[i+1]);
  }
}

export function previousState() {
  let i = states.indexOf(currentState);
  if (states[i-1]) {
    switchState(states[i-1]);
  }
}

export function addChild(entity: Entity|EnemyRow) {
  stage.addChild(entity);
}

export function removeChild(entity: Entity|EnemyRow) {
  stage.removeChild(entity);
}

export function anyPressed(keycodes: number[]): boolean {
  for (let keycode of keycodes) {
    if (keys[keycode]) {
      return true;
    }
  }
  return false;
}

// Private functions
function tick(event: createjs.Event) {
  // Handle input
  // window.document.addEventListener("keydown", (event)=>(handleKeydown(event)));
  window.document.onkeydown = (event: KeyboardEvent)=> handleKeydown(event);
  window.document.onkeyup = (event: KeyboardEvent)=> handleKeyup(event);

  // Handle the state update
  if (currentState && currentState.update) {
    currentState.update(event);
  }

  // Update the stage
  stage.update();
}

// Handle input functions
function handleKeydown(event: KeyboardEvent): boolean {
  let keycode = event.which || event.keyCode;
  keys[keycode] = true;

  event.preventDefault();
  return false;
}

function handleKeyup(event: KeyboardEvent): boolean {
  let keycode = event.which || event.keyCode;
  keys[keycode] = false;

  event.preventDefault();
  return false;
}
