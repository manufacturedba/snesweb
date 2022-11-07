import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { getRemoteConfig, getValue } from 'firebase/remote-config';
import { BUTTON_INTERACTIONS } from '../constants';
import { throttle } from '@ember/runloop';

const allButtons = [
  'a',
  'b',
  'x',
  'y',
  'left',
  'right',
  'up',
  'down',
  'start',
  'select',
];

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

const throttleTime = 500; // ms
const heartbeatTime = 12 * 1000;

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

const RecognitionClass =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const GrammarListClass =
  window.SpeechGrammarList || window.webkitSpeechGrammarList;

export default class TepacheLiveScreenComponent extends Component {
  @service
  remoteConfig;

  @service('-firebase')
  firebase;

  @service
  nes;

  @tracked
  formModel;

  @tracked
  recentlyActivePlayerCount;

  #subscription;

  constructor() {
    super(...arguments);
    this.formModel = {
      textarea: '',
    };
  }

  @action
  async request(button) {
    if (!button) {
      return;
    }

    if (navigator && navigator.vibrate) {
      navigator?.vibrate(100); // vibrate for 100ms
    }

    try {
      return await this.nes.request({
        path: '/api/socket/tepache-session-captures',
        method: 'POST',
        payload: {
          button,
          gameSessionUrn: this.args.gameSessionModel?.urn,
          playerSessionUrn: this.args.playerSessionModel?.urn,
        },
      });
    } catch (error) {
      if (error?.message?.includes('server disconnected')) {
        this.nes.connect();
      }
    }
  }

  @action
  submit() {
    return throttle(
      this,
      this.request,
      this.formModel?.textarea?.toLowerCase()?.trim(),
      throttleTime
    );
  }

  @action
  setupSpeechRecognition() {
    if (!RecognitionClass || !GrammarListClass) {
      return;
    }

    const grammar =
      '#JSGF V1.0; grammar commands; public <command> = a | b | x | y | up | down | left | right | start | select ;';

    const recognition = new RecognitionClass();
    const speechRecognitionList = new GrammarListClass();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 12;
    document.body.addEventListener('click', () => {
      recognition.start();
    });
    recognition.onresult = (event) => {
      const speechResult = Array.from(
        event.results[event.results.length - 1]
      ).reduce((result, match) => {
        const normalizedMatch = match.transcript.trim().toLowerCase();

        if (allButtons.includes(normalizedMatch)) {
          return normalizedMatch;
        }

        return result;
      }, '');
      throttle(this, this.request, speechResult, throttleTime);
    };
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

  get trimmedMergedLogs() {
    return this.sortedMergedLogs && this.sortedMergedLogs.slice(0, 5);
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

  async fetchHeartbeat() {
    const response = await this.nes.request({
      path: '/api/socket/heartbeat',
      method: 'POST',
      payload: {
        playerSessionDocumentId: this.args.playerSessionModel.id,
      },
    });

    this.recentlyActivePlayerCount =
      response?.payload?.recentlyActivePlayerCount;
  }

  @action
  heartbeat() {
    this.fetchHeartbeat();

    this.#subscription = setInterval(async () => {
      try {
        this.fetchHeartbeat();
      } catch (error) {
        this.#subscription?.clearInterval();
      }
    }, heartbeatTime);
  }

  @action
  remove() {
    super.willDestroy(...arguments);

    this.#subscription?.clearInterval();
  }
}
