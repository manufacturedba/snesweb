import Route from '@ember/routing/route';
import { service } from '@ember/service';

/**
 * This route is to collect basic information before entering game session
 */
export default class BaseMagwestRoute extends Route {
  @service
  router;

  async beforeModel() {
    this.router.transitionTo('authenticated.base.play');
  }
}
