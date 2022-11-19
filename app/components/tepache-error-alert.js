import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { getAnalytics, logEvent } from 'firebase/analytics';

export default class TepacheErrorAlertComponent extends Component {
  @service
  errorAlert;

  @action
  dismiss() {
    logEvent(getAnalytics(), 'dismiss_error_alert');
    this.errorAlert.clear();
  }
}
