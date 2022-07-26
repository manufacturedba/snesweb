import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ConstructionRoute extends Route {
  @service
  remoteConfig;

  @service
  router;

  beforeModel() {
    return this.remoteConfig.fetchAndActivate().then(() => {
      const live = this.remoteConfig.getBoolean('live');
      if (live) {
        this.router.transitionTo('authenticated.base.index');
      }
    });
  }
}
