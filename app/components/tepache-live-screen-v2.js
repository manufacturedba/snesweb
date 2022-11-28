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

  fetchMorePending = false;

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

  get messages() {
    return this.store.peekAll('tepache-chat-message')?.sortBy('timetoken');
  }

  @action
  async subscribeToGameSessionChannel() {
    await this.loadMessages();

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

    if (this.fetchMorePending) {
      this.fetchMoreMessages();
      this.fetchMorePending = false;
    }
  }

  @action
  async unsubscribeFromGameSessionChannel() {
    this.store.unloadAll('tepache-chat-message');
    this.pubnub.unsubscribeAll();
  }

  @action
  async fetchMoreMessages() {
    if (this.messages.length) {
      const messageCount = await this.pubnub.messageCounts({
        channels: [this.chatChannel],
        channelTimetokens: [this.messages.firstObject.timetoken],
      });

      if (messageCount.channels[this.chatChannel] > 0) {
        this.loadMessages(this.messages.firstObject.timetoken);
      }
    } else {
      this.fetchMorePending = true;
    }
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

  async loadMessages(startToken) {
    const options = {
      channels: [this.chatChannel],
      count: PUBNUB_HISTORY_LIMIT,
    };

    if (startToken) {
      options.start = startToken;
    }

    const storedMessages = await this.pubnub.fetchMessages(options);

    storedMessages?.channels[this.chatChannel]?.forEach((message) => {
      this.recordChatMessage(message);
    });
  }
}
