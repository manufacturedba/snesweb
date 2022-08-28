import Route from '@ember/routing/route';
import { service } from '@ember/service';

/**
 * This route is used to display the main landing page for the site
 */
export default class BaseIndexRoute extends Route {
  @service
  store;

  @service
  remoteConfig;

  @service
  router;

  async model() {
    return this.modelFor('authenticated.base');
  }
}
