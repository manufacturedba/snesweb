import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { run } from '@ember/runloop';
import { Timestamp } from 'firebase/firestore';
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
  get pressedState() {
    if (this.currentPressedButton) {
      return {
        ...initialPressedState,
        [this.currentPressedButton.type.toLowerCase()]: true,
      };
    }

    return initialPressedState;
  }

  get currentPressedButton() {
    return this.args.hardwareInputCollection.find((hardwareInputModel) => {
      return Timestamp.toDate(hardwareInputModel).getTime() > Date.now() - 6000;
    });
  }

  get isPending() {
    return this.args.gameSessionModel.state.pending;
  }
}
