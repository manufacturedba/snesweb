import { service } from '@ember/service';
import Component from '@glimmer/component';
import { getRemoteConfig, getValue } from 'firebase/remote-config';
import { tracked } from '@glimmer/tracking';

export default class TepacheLiveScreenV2Component extends Component {
  @service
  remoteConfig;

  @service('-firebase')
  firebase;

  @service
  pubnub;

  @tracked
  totalOccupancy = 0;

  constructor() {
    super(...arguments);

    this.pubnub.setUserId(this.args.playerSessionModel.id);
    this.hereNow();
  }

  hereNow() {
    return this.pubnub.hereNow(
      {
        channels: [this.chatChannel],
      },
      (status, response) => {
        this.totalOccupancy = response?.totalOccupancy;
      }
    );
  }

  get chatChannel() {
    return `chat.${this.args.gameSessionModel.id}`;
  }

  get adminChannel() {
    return `admin.${this.args.gameSessionModel.id}`;
  }

  get ovenPlayerConfig() {
    const ovenPlayerConfigJSON = getValue(
      getRemoteConfig(this.firebase),
      'ovenplayer_config'
    ).asString();

    return JSON.parse(ovenPlayerConfigJSON);
  }
}
