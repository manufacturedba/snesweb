import { service } from '@ember/service';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { PUBNUB_HISTORY_LIMIT } from 'tepacheweb/constants';
import { tracked } from '@glimmer/tracking';
import { getAnalytics, logEvent } from 'firebase/analytics';

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

  @service
  pubnub;

  @tracked
  lastAdminMessage;

  get messages() {
    return this.store.peekAll('tepache-chat-message');
  }

  @action
  async message(text) {
    logEvent(getAnalytics(), 'send_message', {
      channel: this.args.chatChannel,
    });
    try {
      await this.pubnub.publish({
        message: text,
        channel: this.args.chatChannel,
        storeInHistory: true,
      });
    } catch (status) {
      console.log(status);
    }
  }

  @action
  async subscribeToGameSessionChannel() {
    const storedMessages = await this.pubnub.fetchMessages({
      channels: [this.args.chatChannel, this.args.adminChannel],
      count: PUBNUB_HISTORY_LIMIT,
    });

    storedMessages?.channels[this.args.chatChannel]?.forEach((message) => {
      this.recordChatMessage(message);
    });

    this.pubnub.subscribe({
      channels: [this.args.chatChannel, this.args.adminChannel],
      withPresence: true,
    });

    this.pubnub.addListener({
      message: async (message) => {
        if (message.channel === this.args.chatChannel) {
          this.recordChatMessage(message);
        } else if (message.channel === this.args.adminChannel) {
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
