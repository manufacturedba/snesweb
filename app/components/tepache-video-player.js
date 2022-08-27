import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { getRemoteConfig, getValue } from 'firebase/remote-config';

export default class TepacheVideoPlayerComponent extends Component {
  @service
  remoteConfig;

  @service('-firebase')
  firebase;

  #playing = false;

  get chromecastConfig() {
    const chromecastJSON = getValue(
      getRemoteConfig(this.firebase),
      'chromecast'
    ).asString();

    return JSON.parse(chromecastJSON);
  }

  @action
  createCastHook() {
    // Create new Castjs instance

    const receiver =
      this.chromecastConfig?.receiver ||
      chrome?.cast?.media?.DEFAULT_MEDIA_RECEIVER_APP_ID;

    // eslint-disable-next-line no-undef
    this.cjs = new Castjs({
      receiver,
      joinpolicy: 'origin_scoped',
    });

    this.cjs.on('connect', () => {
      if (this.#playing) {
        this.cjs.play();
      }
    });

    this.cjs.on('error', (error) => {
      console.error(error);
    });
  }

  @action
  cast() {
    // Optional metadata
    const metadata = {
      poster: this.chromecastConfig.poster || '',
      title: this.chromecastConfig.title || '',
      description: this.chromecastConfig.description || '',
    };

    if (this.cjs.available) {
      this.cjs.cast(this.chromecastConfig.playlist || '', metadata);
    }
  }

  @action
  onStateChanged({ newstate }) {
    this.#playing = newstate === 'playing';

    if (newstate === 'playing') {
      this.cjs.play();
    }

    if (newstate === 'paused') {
      this.cjs.pause();
    }

    if (newstate === 'error') {
      this.cjs.stop();
    }
  }

  @action
  onMute(volume) {
    if (!volume) {
      this.cjs.mute();
    } else {
      this.cjs.volume(volume / 100);
    }
  }

  @action
  onVolumeChange(volume) {
    this.cjs.volume(volume / 100);
  }
}
