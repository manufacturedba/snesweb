import Component from '@glimmer/component';
import { Timestamp } from 'firebase/firestore';
import { service } from '@ember/service';
import { TrackedAsyncData } from 'ember-async-data';
import {
  fetchAndActivate,
  getBoolean,
  getRemoteConfig,
  getString,
  getValue,
  activate,
  fetchConfig,
} from 'firebase/remote-config';

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
    if (this.currentPressedButton) {
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
