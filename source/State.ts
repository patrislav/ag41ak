
class State {
  name: string;
  enter(): void {}
  update(event: createjs.Event): void {}
  exit(): void {}
}

export = State;
