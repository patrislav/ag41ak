
// The AMD dependencies will be available to all files importing this module
/// <amd-dependency path="easel"/>
/// <amd-dependency path="sound"/>
/// <amd-dependency path="preload"/>

import _ = require('underscore');
import $ = require("jquery");
import State = require("./State");

// Public properties
export let canvas: HTMLElement;
export let stage: createjs.Stage;

export let states: State[];
export let currentState: State;

export let assets: Object = {};


// Public functions
export function setup(_canvas: HTMLElement, _firstStateName?: string): boolean {
  if (!states || states.length == 0) {
    return false;
  }

  canvas = _canvas;
  stage = new createjs.Stage(canvas);

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

// Private functions
function tick(event: createjs.Event) {
  if (currentState && currentState.update) {
    currentState.update(event);
  }

  stage.update();
}
