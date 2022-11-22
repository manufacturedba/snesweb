import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TepacheMetadataComponent extends Component {
  @tracked
  reportingModalOpen = false;

  @action
  report() {
    this.reportingModalOpen = true;
  }
}
