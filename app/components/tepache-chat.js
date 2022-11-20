import { service } from '@ember/service';
import Component from '@glimmer/component';
import { getRemoteConfig, getValue } from 'firebase/remote-config';
import PubNub from 'pubnub';
import { action } from '@ember/object';
import { TrackedAsyncData } from 'ember-async-data';
import { cached } from '@glimmer/tracking';
import { schedule } from '@ember/runloop';

function scrollToBottomOfChat() {
  schedule('afterRender', this, () => {
    requestAnimationFrame(() => {
      const listGroup = document.querySelector(
        '[data-list-container-selector]'
      );

      listGroup.scrollTo({
        top: listGroup.scrollHeight,
        behavior: 'smooth',
      });
    });
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

  @cached
  get processedMessages() {
    return new TrackedAsyncData(
      Promise.all(
        this.messages.map(
          async ({
            channel,
            message,
            publisher,
            subscribedChannel,
            timeToken,
          }) => {
            let playerSession;
            try {
              playerSession = await this.store.findRecord(
                'tepache-player-session',
                publisher
              );
              return {
                channel,
                message,
                publisher: playerSession.name,
                subscribedChannel,
                timeToken,
              };
            } catch (error) {
              return {};
            }
          }
        )
      ),
      this
    );
  }

  @action
  async message(text) {
    try {
      await this.#pubnub.publish({
        message: text,
        channel: this.args.channel,
        storeInHistory: true,
      });
    } catch (status) {
      console.log(status);
    }
  }

  @action
  async subscribeToGameSessionChannel() {
    const storedMessages = await this.#pubnub.fetchMessages({
      channels: [this.args.channel],
      count: 40,
    });

    storedMessages?.channels[this.args.channel]?.forEach((message) => {
      this.store.createRecord('tepache-chat-message', {
        ...message,
        publisher: message.publisher || message.uuid,
      });
    });

    this.#pubnub.subscribe({
      channels: [this.args.channel],
      withPresence: true,
    });

    this.#pubnub.addListener({
      message: (message) => {
        scrollToBottomOfChat();
        this.store.createRecord('tepache-chat-message', message);
      },
    });

    scrollToBottomOfChat();
  }
}
