// The AMD dependencies will be available to all files importing this module
/// <amd-dependency path="easel"/>
/// <amd-dependency path="tween"/>
/// <amd-dependency path="sound"/>
/// <amd-dependency path="preload"/>
define(["require", "exports", 'underscore', "jquery", "easel", "tween", "sound", "preload"], function (require, exports, _, $) {
    exports.assets = {};
    exports.keys = {};
    var $soundButton;
    function setup(_canvas, _firstStateName) {
        if (!exports.states || exports.states.length == 0) {
            return false;
        }
        exports.canvas = _canvas;
        exports.width = exports.canvas['width'];
        exports.height = exports.canvas['height'];
        exports.stage = new createjs.Stage(exports.canvas);
        exports.$ui = $("<div/>").insertBefore($(exports.canvas));
        exports.$ui.addClass('game-ui');
        $soundButton = $("<div/>").appendTo(exports.$ui);
        $soundButton.addClass('game-sound-button');
        var $btn = $('<a href="#"/>').appendTo($soundButton);
        $btn.addClass('game-sound-button-on');
        $btn.click(soundButtonClick);
        $btn = $('<a href="#"/>').appendTo($soundButton);
        $btn.addClass('game-sound-button-off');
        $btn.click(soundButtonClick);
        $btn.hide();
        if (_firstStateName) {
            exports.currentState = findState(_firstStateName);
        }
        else {
            exports.currentState = exports.states[0];
        }
        exports.currentState.enter();
        createjs.Ticker.setFPS(40);
        createjs.Ticker.addEventListener("tick", tick);
        return true;
    }
    exports.setup = setup;
    function soundButtonClick(event) {
        $(this).parent().find('a').toggle();
        createjs.Sound.muted = !createjs.Sound.muted;
        event.preventDefault();
    }
    function registerStates(_states) {
        exports.states = _states;
    }
    exports.registerStates = registerStates;
    function findState(name) {
        return _.find(exports.states, function (s) { return (s.name == name); });
    }
    exports.findState = findState;
    function switchState(newState) {
        var oldState = exports.currentState;
        if (typeof newState === "string") {
            exports.currentState = findState(newState);
        }
        else {
            exports.currentState = newState;
        }
        if (!exports.currentState) {
            return false;
        }
        oldState.exit();
        exports.currentState.enter();
        return true;
    }
    exports.switchState = switchState;
    function nextState() {
        var i = exports.states.indexOf(exports.currentState);
        if (exports.states[i + 1]) {
            switchState(exports.states[i + 1]);
        }
    }
    exports.nextState = nextState;
    function previousState() {
        var i = exports.states.indexOf(exports.currentState);
        if (exports.states[i - 1]) {
            switchState(exports.states[i - 1]);
        }
    }
    exports.previousState = previousState;
    function addChild(entity) {
        exports.stage.addChild(entity);
    }
    exports.addChild = addChild;
    function removeChild(entity) {
        exports.stage.removeChild(entity);
    }
    exports.removeChild = removeChild;
    function anyPressed(keycodes) {
        for (var _i = 0; _i < keycodes.length; _i++) {
            var keycode = keycodes[_i];
            if (exports.keys[keycode]) {
                return true;
            }
        }
        return false;
    }
    exports.anyPressed = anyPressed;
    function tick(event) {
        window.document.onkeydown = function (event) { return handleKeydown(event); };
        window.document.onkeyup = function (event) { return handleKeyup(event); };
        if (exports.currentState && exports.currentState.update) {
            exports.currentState.update(event);
        }
        exports.stage.update();
    }
    function handleKeydown(event) {
        var keycode = event.which || event.keyCode;
        exports.keys[keycode] = true;
        event.preventDefault();
        return false;
    }
    function handleKeyup(event) {
        var keycode = event.which || event.keyCode;
        exports.keys[keycode] = false;
        event.preventDefault();
        return false;
    }
});
//# sourceMappingURL=Game.js.map