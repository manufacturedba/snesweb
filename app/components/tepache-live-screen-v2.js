import { service } from '@ember/service';
import Component from '@glimmer/component';
import { getRemoteConfig, getValue } from 'firebase/remote-config';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { PUBNUB_HISTORY_LIMIT } from 'tepacheweb/constants';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { scheduleOnce } from '@ember/runloop';

function scrollToBottomOfChat() {
  const listGroup = document.querySelector('[data-list-container-selector]');

  listGroup.scrollTo({
    top: listGroup.scrollHeight,
    behavior: 'smooth',
  });
}

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

  missingPlayerIds = null;

  @tracked
  showInput = true;

  constructor() {
    super(...arguments);

    this.pubnub.setUserId(this.args.playerSessionModel.id);
    this.hereNow();
    this.missingPlayerIds = {};
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
    return `chat.${this.args?.gameSessionModel?.id}`;
  }

  get adminChannel() {
    return `admin.${this.args?.gameSessionModel?.id}`;
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

  get filteredMessages() {
    return this.messages?.filterBy('publisher');
  }

  @action
  async subscribeToGameSessionChannel() {
    window.visualViewport.addEventListener('resize', () => {
      document.querySelector(
        '#live-screen'
      ).style.height = `${window.visualViewport.height}px`;
    });

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
    const playerId = message.publisher || message.uuid;

    try {
      if (this.missingPlayerIds[playerId]) {
        return this.store.createRecord('tepache-chat-message', {
          ...message,
          publisher: '',
        });
      }

      const playerSession = await this.store.findRecord(
        'tepache-player-session',
        playerId
      );

      return this.store.createRecord('tepache-chat-message', {
        ...message,
        publisher: playerSession.name,
      });
    } catch (error) {
      this.missingPlayerIds[playerId] = true;
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

    const messages = storedMessages.channels[this.chatChannel];

    if (messages?.length) {
      return Promise.all(
        messages.map((message) => this.recordChatMessage(message))
      );
    }
  }

  @action
  toggleChat() {
    this.showInput = !this.showInput;
  }

  @action
  async message(text) {
    logEvent(getAnalytics(), 'send_message', {
      channel: this.chatChannel,
    });
    try {
      await this.pubnub.publish({
        message: text,
        channel: this.chatChannel,
        storeInHistory: true,
      });
    } catch (status) {
      console.log(status);
    }
  }

  @action
  scrollToBottom() {
    if (!this.disableScrollDown || !this.initialScrollCompleted) {
      scheduleOnce('afterRender', scrollToBottomOfChat);
      this.initialScrollCompleted = true;
    }
  }
}
