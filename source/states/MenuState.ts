
import $ = require('jquery');
import _ = require('underscore');
import State = require('../State');
import Game = require('../Game');

class MenuState extends State {
  name: string = "MenuState";

  inited: boolean = false;

  $ui: JQuery;
  $title: JQuery;
  $subtitle: JQuery;

  constructor() {
    super();
  }

  enter(): void {
    let width = Game.stage.canvas['width'];
    let height = Game.stage.canvas['height'];

    let background = new createjs.Shape();
    background.graphics.beginFill("#DB7937").drawRect(0, 0, width, height);
    Game.stage.addChild(background);

    if (!this.inited) {
      this.initUI();
    }

    this.flashingEffect(this.$subtitle);

    this.$ui.show();
  }

  exit(): void {
    super.exit();

    this.$ui.hide();
  }

  update(event: createjs.TickerEvent): void {
    let deltaTime = event.delta / 1000;

    if (Game.anyPressed([13, 32])) { // 13 - enter, 32 - space
      Game.nextState();
    }
  }

  initUI(): void {
    this.$ui = $("<div/>").appendTo(Game.$ui);
    this.$ui.addClass('game-ui-state-menu');
    this.$ui.css('position', 'absolute');

    this.$title = $("<h1/>").appendTo(this.$ui);
    this.$title.text("AG41AK");

    this.$subtitle = $("<h2/>").appendTo(this.$ui);
    this.$subtitle.html("Press <kbd>ENTER</kbd> or <kbd>SPACE</kbd> to <em>ENTER SPACE</em>.");

    this.inited = true;
  }

  flashingEffect($el: JQuery): void {
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

export = MenuState;
