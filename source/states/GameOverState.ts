
import $ = require('jquery');
import _ = require('underscore');
import State = require('../State');
import Game = require('../Game');
import Shared = require('../Shared');

class GameOverState extends State {
  name: string = "GameOverState";

  inited: boolean = false;

  $ui: JQuery;
  $title: JQuery;
  $score: JQuery;
  $subtitle: JQuery;

  constructor() {
    super();
  }

  enter(): void {
    super.enter();

    let width = Game.stage.canvas['width'];
    let height = Game.stage.canvas['height'];

    let background = new createjs.Shape();
    background.graphics.beginFill("#DB7937").drawRect(0, 0, width, height);
    Game.stage.addChild(background);

    this.$ui.show();
    this.$title.text(Game.lastScore);

    if (!Shared.themeMusic) {
      Shared.themeMusic = createjs.Sound.play("theme-1", { volume: 0.35, loop: -1 });
    }
  }

  exit(): void {
    super.exit();

    this.$ui.hide();
  }

  update(event: createjs.TickerEvent): void {
    let deltaTime = event.delta / 1000;

    if(Shared.themeMusic.playState != createjs.Sound.PLAY_SUCCEEDED) {
      Shared.themeMusic.play({ volume: 0.35, loop: -1 });
    }

    if (Game.anyPressed([13, 32])) { // 13 - enter, 32 - space
      Game.switchState("PlayState");
    }
    else if (Game.anyPressed([8, 27])) { // 8 - backspace, 27 - escape
      Game.switchState("MenuState");
    }
  }

  initUI(): void {
    this.$ui = $("<div/>").appendTo(Game.$ui);
    this.$ui.addClass('game-ui-state-gameover');

    this.$title = $("<h3/>").appendTo(this.$ui);
    this.$title.text("Your score:");

    this.$title = $("<h1/>").appendTo(this.$ui);

    this.$subtitle = $("<h2/>").appendTo(this.$ui);
    this.$subtitle.html("Press <kbd>ENTER</kbd> or <kbd>SPACE</kbd> to start again.");

    super.initUI();
  }

  flashingEffect($el: JQuery): void {
    if (Game.currentState != this) return;

    if (parseFloat($el.css('opacity')) > 0.5) {
      $el.delay(700).animate({
          opacity: 0.30
        },
        500, "linear", ()=> this.flashingEffect($el)
      );
    }
    else {
      $el.animate({
          opacity: 1.00
        },
        500, "linear", ()=> this.flashingEffect($el)
      );
    }

  }
}

export = GameOverState;
