import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ConstructionRoute extends Route {
  @service
  remoteConfig;

  @service
  router;

  beforeModel() {
    const live = this.remoteConfig.getBoolean('live');
    if (live) {
      this.router.transitionTo('authenticated.base.index');
    }
  }
}
