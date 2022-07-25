import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { getAnalytics } from 'firebase/analytics';

export default class ApplicationRoute extends Route {
  @service
  remoteConfig;

  @service('-firebase')
  firebase;

  beforeModel() {
    getAnalytics();
    return this.remoteConfig.fetchAndActivate();
  }
}
