import { service } from '@ember/service';
import Component from '@glimmer/component';
import { getRemoteConfig, getValue } from 'firebase/remote-config';

export default class TepacheLiveScreenV2Component extends Component {
  @service
  remoteConfig;

  @service('-firebase')
  firebase;

  get pubNubConfig() {
    const pubNubConfigJSON = getValue(
      getRemoteConfig(this.firebase),
      'pubnub_config'
    ).asString();

    return JSON.parse(pubNubConfigJSON);
  }

  get ovenPlayerConfig() {
    const ovenPlayerConfigJSON = getValue(
      getRemoteConfig(this.firebase),
      'ovenplayer_config'
    ).asString();

    return JSON.parse(ovenPlayerConfigJSON);
  }
}
