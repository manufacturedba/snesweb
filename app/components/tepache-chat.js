import { service } from '@ember/service';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

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
  scrollToBottom() {
    if (!this.disableScrollDown || !this.initialScrollCompleted) {
      this.args.scrollToBottom();
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
