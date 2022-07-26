import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class BaseRoute extends Route {
  @service
  router;

  @service
  remoteConfig;

  @service
  session;

  beforeModel() {
    const live = this.remoteConfig.getBoolean('live');

    if (!live) {
      this.router.transitionTo('authenticated.construction');
    }
  }
}
