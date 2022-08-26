import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { getRemoteConfig, getValue } from 'firebase/remote-config';

export default class TepacheCastComponent extends Component {
  @service
  remoteConfig;

  @service('-firebase')
  firebase;

  get chromecastConfig() {
    const chromecastJSON = getValue(
      getRemoteConfig(this.firebase),
      'chromecast'
    ).asString();

    return JSON.parse(chromecastJSON);
  }

  @action
  createCastHook(element) {
    // Create new Castjs instance

    const receiver =
      this.chromecastConfig?.receiver ||
      chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;

    // eslint-disable-next-line no-undef
    const cjs = new Castjs({
      receiver,
    });

    // Optional metadata
    const metadata = {
      poster: this.chromecastConfig.poster || '',
      title: this.chromecastConfig.title || '',
      description: this.chromecastConfig.description || '',
    };

    // Wait for user interaction
    element.querySelector('.cast').addEventListener('click', () => {
      if (cjs.available) {
        cjs.cast(this.chromecastConfig.playlist || '', metadata);
      }
    });
  }
}
