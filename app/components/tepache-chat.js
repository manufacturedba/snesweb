import { service } from '@ember/service';
import Component from '@glimmer/component';
import { getRemoteConfig, getValue } from 'firebase/remote-config';
import PubNub from 'pubnub';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { PUBNUB_HISTORY_LIMIT } from 'tepacheweb/constants';
import { tracked } from '@glimmer/tracking';

function scrollToBottomOfChat() {
  const listGroup = document.querySelector('[data-list-container-selector]');

  listGroup.scrollTo({
    top: listGroup.scrollHeight,
    behavior: 'smooth',
  });
}

export default class TepacheChatComponent extends Component {
  @service('-firebase')
  firebase;

  @service
  store;

  #pubnub;

  @tracked
  lastAdminMessage;

  constructor() {
    super(...arguments);

    this.#pubnub = new PubNub(this.config);
  }

  get chatChannel() {
    return `chat.${this.args.channel}`;
  }

  get adminChannel() {
    return `admin.${this.args.channel}`;
  }

  get pubNubConfig() {
    const pubNubConfigJSON = getValue(
      getRemoteConfig(this.firebase),
      'pubnub_config'
    ).asString();

    return JSON.parse(pubNubConfigJSON);
  }

  get config() {
    return {
      ...this.pubNubConfig,
      userId: this.args.userId,
    };
  }

  get messages() {
    return this.store.peekAll('tepache-chat-message');
  }

  @action
  async message(text) {
    try {
      await this.#pubnub.publish({
        message: text,
        channel: `chat.${this.args.channel}`,
        storeInHistory: true,
      });
    } catch (status) {
      console.log(status);
    }
  }

  @action
  async subscribeToGameSessionChannel() {
    const storedMessages = await this.#pubnub.fetchMessages({
      channels: [this.chatChannel, this.adminChannel],
      count: PUBNUB_HISTORY_LIMIT,
    });

    storedMessages?.channels[this.chatChannel]?.forEach((message) => {
      this.recordChatMessage(message);
    });

    this.#pubnub.subscribe({
      channels: [this.chatChannel, this.adminChannel],
      withPresence: true,
    });

    this.#pubnub.addListener({
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
    this.#pubnub.unsubscribeAll();
  }

  @action
  scrollToBottom() {
    scheduleOnce('afterRender', scrollToBottomOfChat);
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
