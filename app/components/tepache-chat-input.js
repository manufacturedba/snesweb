import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class TepacheChatInputComponent extends Component {
  @tracked
  messageText = '';

  @action
  message() {
    this.args.onMessage(this.messageText);
    this.messageText = '';
  }
}
