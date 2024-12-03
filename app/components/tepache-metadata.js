import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TepacheMetadataComponent extends Component {
  @tracked
  reportingModalOpen = false;

  @tracked
  helpModalOpen = false;

  @action
  report() {
    this.reportingModalOpen = true;
  }

  @action
  help() {
    this.helpModalOpen = true;
  }

  @action
  toggleChat() {
    this.args.toggleChat();
  }
}
