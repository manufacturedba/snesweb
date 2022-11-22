import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class TepacheReportingModalComponent extends Component {
  @service
  store;

  @tracked
  record;

  @action
  onShow() {
    this.record = this.store.createRecord('tepache-report');
  }

  @action
  async submitReport(modal) {
    await this.record.save();
    modal.close();
  }
}
