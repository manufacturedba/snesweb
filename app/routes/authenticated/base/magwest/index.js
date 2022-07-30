import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MagwestRoute extends Route {
  @service
  remoteConfig;

  model() {
    return this.remoteConfig.getString('magwest_urn');
  }
}
