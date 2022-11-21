import { service } from '@ember/service';
import Component from '@glimmer/component';
import { getRemoteConfig, getValue } from 'firebase/remote-config';
import PubNub from 'pubnub';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { PUBNUB_HISTORY_LIMIT } from 'tepacheweb/constants';

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

  constructor() {
    super(...arguments);

    this.#pubnub = new PubNub(this.config);
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
      channels: [`chat.${this.args.channel}`],
      count: PUBNUB_HISTORY_LIMIT,
    });

    storedMessages?.channels[`chat.${this.args.channel}`]?.forEach(
      (message) => {
        this.recordChatMessage(message);
      }
    );

    this.#pubnub.subscribe({
      channels: [`chat.${this.args.channel}`],
      withPresence: true,
    });

    this.#pubnub.addListener({
      message: async (message) => {
        this.recordChatMessage(message);
      },
    });
  }

  @action
  async unsubscribeFromGameSessionChannel() {
    this.#pubnub.unsubscribe({
      channels: [`chat.${this.args.channel}`],
    });
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
      console.error('Error fetching player session', error);
    }
  }
}
