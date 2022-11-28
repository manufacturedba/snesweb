import { service } from '@ember/service';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
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
  disableScrollDown = false;

  initialScrollCompleted = false;

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
  scrollToBottom() {
    if (!this.disableScrollDown || !this.initialScrollCompleted) {
      scheduleOnce('afterRender', scrollToBottomOfChat);
      this.initialScrollCompleted = true;
    }
  }

  @action
  onIntersectingTop() {
    this.disableScrollDown = true;
    this.args.onIntersectingTop?.();
  }

  @action
  onExitingTop() {
    this.disableScrollDown = false;
  }
}
