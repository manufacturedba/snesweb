import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class TepacheErrorAlertComponent extends Component {
  @service
  errorAlert;

  @action
  dismiss() {
    this.errorAlert.clear();
  }

  get message() {
    return this.errorAlert.message;
  }
}
