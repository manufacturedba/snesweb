import { service } from '@ember/service';
import Component from '@glimmer/component';
import { getRemoteConfig, getValue } from 'firebase/remote-config';
import { BUTTON_INTERACTIONS } from '../constants';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

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

//stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = '#';
  for (var i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

export default class TepacheLiveScreenComponent extends Component {
  @service
  remoteConfig;

  @service('-firebase')
  firebase;

  @tracked
  formModel;

  @service
  nes;

  constructor() {
    super(...arguments);
    this.formModel = {
      textarea: '',
    };
  }

  @action
  async request(button) {
    if (navigator && navigator.vibrate) {
      navigator?.vibrate(100); // vibrate for 100ms
    }

    return await this.nes.request({
      path: '/api/socket/tepache-session-captures',
      method: 'POST',
      payload: {
        button,
        gameSessionUrn: this.args.gameSessionModel?.urn,
        playerSessionUrn: this.args.playerSessionModel?.urn,
      },
    });
  }

  @action
  submit() {
    this.request(this.formModel?.textarea?.toLowerCase());
  }

  get pressedState() {
    if (this.currentPressedButton?.type === BUTTON_INTERACTIONS.BUTTON_PRESS) {
      return {
        ...initialPressedState,
        [this.currentPressedButton?.button?.toLowerCase()]: true,
      };
    }

    return initialPressedState;
  }

  get currentPressedButton() {
    return this.args.hardwareInputCollection.reduce(
      (current, hardwareInputModel) => {
        if (hardwareInputModel.createdAt.getTime() > Date.now() - 6000) {
          return hardwareInputModel;
        }

        return current;
      },
      null
    );
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

  get miniOvenPlayerConfig() {
    const ovenPlayerConfigJSON = getValue(
      getRemoteConfig(this.firebase),
      'ovenplayer_config'
    ).asString();

    const defaultConfig = JSON.parse(ovenPlayerConfigJSON);
    return {
      ...defaultConfig,
      autoStart: false,
      controls: true,
      expandFullScreenUI: true,
    };
  }

  get formattedSessionCaptures() {
    return this.args.sessionCaptureCollection.map(({ createdAt, button }) => {
      return {
        message: `You voted for ${button}`,
        secret: true,
        createdAt,
      };
    });
  }

  get sortedMergedLogs() {
    return [
      ...this.args.logCollection.toArray(),
      ...this.formattedSessionCaptures,
    ].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  get textColor() {
    return stringToColor(this.args.playerSessionModel.name);
  }
}
