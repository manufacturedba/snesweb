import Component from '@glimmer/component';

export default class TepacheGameServerControllerComponent extends Component {
  get aButtonPressed() {
    return this.args.pressedState === 'a';
  }

  get bButtonPressed() {
    return this.args.pressedState === 'b';
  }

  get xButtonPressed() {
    return this.args.pressedState === 'x';
  }

  get yButtonPressed() {
    return this.args.pressedState === 'y';
  }

  get startButtonPressed() {
    return this.args.pressedState === 'start';
  }
  get selectButtonPressed() {
    return this.args.pressedState === 'select';
  }

  get leftDirectionPressed() {
    return this.args.pressedState === 'left';
  }

  get rightDirectionPressed() {
    return this.args.pressedState === 'right';
  }

  get upDirectionPressed() {
    return this.args.pressedState === 'up';
  }

  get downDirectionPressed() {
    return this.args.pressedState === 'down';
  }

  get dpadPressed() {
    return (
      this.leftDirectionPressed ||
      this.rightDirectionPressed ||
      this.upDirectionPressed ||
      this.downDirectionPressed
    );
  }
}
