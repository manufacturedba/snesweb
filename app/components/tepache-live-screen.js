import { service } from '@ember/service';
import Component from '@glimmer/component';
import { getRemoteConfig, getValue } from 'firebase/remote-config';
import { BUTTON_INTERACTIONS } from '../constants';

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
  @service
  remoteConfig;

  @service('-firebase')
  firebase;

  get pressedState() {
    if (this.currentPressedButton?.type === BUTTON_INTERACTIONS.BUTTON_PRESS) {
      return {
        ...initialPressedState,
        [this.currentPressedButton.button.toLowerCase()]: true,
      };
    }

    return initialPressedState;
  }

  get currentPressedButton() {
    return this.args.hardwareInputCollection.find((hardwareInputModel) => {
      return hardwareInputModel.createdAt.getTime() > Date.now() - 6000;
    });
  }

  get isPending() {
    return this.args.gameSessionModel.state.pending;
  }

  get ovenPlayerConfig() {
    const ovenPlayerConfigJSON = getValue(
      getRemoteConfig(this.firebase),
      'ovenplayer_config'
    ).asString();

    return JSON.parse(ovenPlayerConfigJSON);
  }
}
