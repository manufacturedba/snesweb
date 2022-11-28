import { service } from '@ember/service';
import Component from '@glimmer/component';
import { getRemoteConfig, getValue } from 'firebase/remote-config';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { PUBNUB_HISTORY_LIMIT } from 'tepacheweb/constants';

export default class TepacheLiveScreenV2Component extends Component {
  @service
  remoteConfig;

  @service('-firebase')
  firebase;

  @service
  pubnub;

  @service
  store;

  @tracked
  totalOccupancy = 0;

  @tracked
  lastAdminMessage = {};

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

  @action
  async subscribeToGameSessionChannel() {
    const storedMessages = await this.pubnub.fetchMessages({
      channels: [this.chatChannel, this.adminChannel],
      count: PUBNUB_HISTORY_LIMIT,
    });

    storedMessages?.channels[this.chatChannel]?.forEach((message) => {
      this.recordChatMessage(message);
    });

    this.pubnub.subscribe({
      channels: [this.chatChannel, this.adminChannel],
      withPresence: true,
    });

    this.pubnub.addListener({
      message: async (message) => {
        if (message.channel === this.chatChannel) {
          this.recordChatMessage(message);
        } else if (message.channel === this.adminChannel) {
          this.lastAdminMessage = message;
        }
      },
    });
  }

  @action
  async unsubscribeFromGameSessionChannel() {
    this.store.unloadAll('tepache-chat-message');
    this.pubnub.unsubscribeAll();
  }

  async recordChatMessage(message) {
    try {
      const playerSession = await this.store.findRecord(
        'tepache-player-session',
        message.publisher || message.uuid
      );
      this.store.createRecord('tepache-chat-message', {
        ...message,
        publisher: playerSession.name,
      });
    } catch (error) {
      console.warn('Unable fetching player session for chat ID', error);
    }
  }
}
