import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { run } from '@ember/runloop';

const initialPressedState = {
  a: false,
  b: false,
  x: false,
  y: false,
  start: false,
  select: false,
  left: false,
  right: false,
  up: false,
  down: false,
};

export default class TepacheLiveScreenComponent extends Component {
  @tracked
  pressedState = { ...initialPressedState };

  constructor() {
    super(...arguments);

    setInterval(() => {
      run(() => {
        // this.toggleRandomButton();
      });
    }, 500);
  }

  @action
  toggleRandomButton() {
    const randomIndex = Math.floor(
      Math.random() * Object.keys(this.pressedState).length
    );

    const randomButton = Object.keys(this.pressedState)[randomIndex];
    this.pressedState = {
      ...initialPressedState,
      [randomButton]: true,
    };
    console.log(
      'toggleRandomButton',
      randomButton,
      this.pressedState[randomButton]
    );

    // set(this, `pressedState.${randomButton}`, !this.pressedState[randomButton]);
  }

  get isPending() {
    return this.args.gameSessionModel.state.pending;
  }
}
